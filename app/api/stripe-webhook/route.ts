export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  let event;
  try {
    const sig = (headers() as any).get('stripe-signature');
    const body = await req.text();
    
    // Check if webhook secret is configured
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ message: 'Webhook secret not configured' }, { status: 500 });
    }
    
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const permittedEvents = ['checkout.session.completed'];

  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const data = event.data.object;
          console.log(`CheckoutSession status: ${data.payment_status}`);
          console.log('Session metadata:', data.metadata);
          
          // Save booking in your database using data.metadata
          if (data.payment_status === 'paid') {
            const metadata = data.metadata || {};
            
            // Required fields from metadata
            const guest_email = metadata.guest_email;
            const booking_type = metadata.booking_type;
            const check_in = metadata.check_in;
            const check_out = metadata.check_out;
            const guests = parseInt(metadata.guests || '1');
            const total_price = parseFloat(metadata.total_price || '0');
            const base_price = parseFloat(metadata.base_price || '0');
            
            // Parse JSON fields
            let selected_rooms = [];
            let add_ons = [];
            try {
              selected_rooms = JSON.parse(metadata.selected_rooms || '[]');
              add_ons = JSON.parse(metadata.add_ons || '[]');
            } catch (e) {
              console.error('Error parsing JSON metadata:', e);
            }

            if (!guest_email || !booking_type || !check_in || !check_out) {
              console.error('Missing required booking metadata in Stripe session:', metadata);
              break;
            }

            // Check if service role key is configured
            if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
              console.error('SUPABASE_SERVICE_ROLE_KEY is not configured');
              break;
            }

            // Use Supabase service role key for admin insert
            const supabaseAdmin = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            // Prepare guest info object
            const guest_info = {
              firstName: metadata.guest_firstName || '',
              lastName: metadata.guest_lastName || '',
              email: guest_email,
              phone: metadata.guest_phone || '',
              specialRequests: metadata.guest_specialRequests || '',
            };

            const property_id = metadata.property_id || null;
            const insertPayload = {
              property_id: property_id,
              room_ids: selected_rooms,
              is_whole_property: booking_type === 'house',
              check_in: check_in.slice(0, 10),
              check_out: check_out.slice(0, 10),
              guests: guests,
              guest_info: guest_info,
              add_ons: add_ons,
              base_price: base_price,
              total_price: total_price,
              status: 'confirmed',
              payment_status: 'paid',
              source: 'direct',
            };

            console.log('Supabase insert payload:', insertPayload);

            // Check availability before inserting booking
            let roomIdsToCheck = selected_rooms;
            if (booking_type === 'house' && property_id) {
              const { data: allRooms, error: roomsError } = await supabaseAdmin.from('rooms').select('id').eq('property_id', property_id);
              if (roomsError) {
                console.error('Failed to fetch rooms for property', roomsError);
                break;
              }
              roomIdsToCheck = (allRooms || []).map(r => r.id);
            }
            const { data: isAvailable, error: availError } = await supabaseAdmin.rpc('check_room_availability', {
              p_room_ids: roomIdsToCheck,
              p_check_in: check_in,
              p_check_out: check_out,
            });
            if (availError || !isAvailable) {
              console.error('Room(s) or property not available for these dates. Not saving booking.');
              break;
            }

            // Idempotency: check if booking for this Stripe session already exists
            const existing = await supabaseAdmin.from('bookings').select('id').eq('stripe_session_id', data.id).maybeSingle();
            if (existing.data) {
              console.log('Booking already exists for this Stripe session:', data.id);
              break;
            }
            // Insert complete booking record, including stripe_session_id
            const insertPayloadWithSession = { ...insertPayload, stripe_session_id: data.id };
            const { data: bookingData, error } = await supabaseAdmin.from('bookings').insert([insertPayloadWithSession]).select();

            if (error) {
              console.error('Error saving booking after payment:', error);
            } else {
              console.log('Booking saved successfully after payment for', guest_email);
              console.log('Booking ID:', bookingData?.[0]?.id);
            }
          }
          break;
        }
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook handler failed:', error);
      return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 });
} 