export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, guestInfo, bookingType, checkIn, checkOut, selectedRooms, addOns, guests, totalPrice, propertyId } = body;

    // Validate inputs
    if (!amount || typeof amount !== 'number' || isNaN(amount)) {
      console.error('Invalid amount:', amount);
      return NextResponse.json({ error: 'Invalid or missing amount' }, { status: 400 });
    }

    // Fetch all room IDs for the property if booking whole property
    let roomIdsToCheck = selectedRooms;
    if (bookingType === 'house' && propertyId) {
      const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      const { data: allRooms, error: roomsError } = await supabaseAdmin.from('rooms').select('id').eq('property_id', propertyId);
      if (roomsError) {
        return NextResponse.json({ error: 'Failed to fetch rooms for property' }, { status: 500 });
      }
      roomIdsToCheck = (allRooms || []).map(r => r.id);
    }
    // Check availability
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: isAvailable, error: availError } = await supabaseAdmin.rpc('check_room_availability', {
      p_room_ids: roomIdsToCheck,
      p_check_in: checkIn,
      p_check_out: checkOut,
    });
    if (availError || !isAvailable) {
      return NextResponse.json({ error: 'Selected room(s) or property not available for these dates.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: description || 'Room Booking at The Corner House',
            },
            unit_amount: amount, // Amount in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking?canceled=true`,
      metadata: {
        guest_email: guestInfo?.email || '',
        guest_firstName: guestInfo?.firstName || '',
        guest_lastName: guestInfo?.lastName || '',
        guest_phone: guestInfo?.phone || '',
        guest_specialRequests: guestInfo?.specialRequests || '',
        booking_type: bookingType || '',
        check_in: checkIn || '',
        check_out: checkOut || '',
        selected_rooms: JSON.stringify(selectedRooms || []),
        add_ons: JSON.stringify(addOns || []),
        guests: guests?.toString() || '1',
        total_price: totalPrice?.toString() || '0',
        base_price: totalPrice?.toString() || '0',
        property_id: propertyId || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
