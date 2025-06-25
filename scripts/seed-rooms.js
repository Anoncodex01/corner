// Script to seed the database with initial room data
// Run this script to populate your Supabase database with sample rooms

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rooms = [
  {
    property_id: 'corner-house', // Make sure this property exists in your database
    name: 'Lion Suite',
    description: 'Our flagship room featuring golden accents and royal luxury with a king-size bed. Perfect for couples seeking a premium experience.',
    capacity: 2,
    bed_type: 'King',
    bathroom: 'ensuite',
    base_price: 120,
    features: ['Smart TV', 'Mini Fridge', 'Work Desk', 'Premium Toiletries', 'King Bed', 'Ensuite Bathroom'],
    is_active: true,
    images: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop']
  },
  {
    property_id: 'corner-house',
    name: 'Elephant Room',
    description: 'Spacious and serene with earthy tones, natural textures, and comfortable queen bed. Ideal for relaxation and comfort.',
    capacity: 2,
    bed_type: 'Queen',
    bathroom: 'ensuite',
    base_price: 100,
    features: ['Smart TV', 'Tea Station', 'Reading Chair', 'Garden View', 'Queen Bed', 'Ensuite Bathroom'],
    is_active: true,
    images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop']
  },
  {
    property_id: 'corner-house',
    name: 'Buffalo Room',
    description: 'Rustic charm meets modern comfort in warm, rich tones with double bed. Perfect for those who appreciate traditional aesthetics.',
    capacity: 2,
    bed_type: 'Double',
    bathroom: 'shared',
    base_price: 95,
    features: ['Smart TV', 'Storage Space', 'Reading Nook', 'Rustic Decor', 'Double Bed', 'Shared Bathroom'],
    is_active: true,
    images: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop']
  },
  {
    property_id: 'corner-house',
    name: 'Rhino Room',
    description: 'Contemporary design with strong, geometric patterns and single bed. Modern and minimalist for the solo traveler.',
    capacity: 1,
    bed_type: 'Single',
    bathroom: 'shared',
    base_price: 90,
    features: ['Smart TV', 'Study Area', 'Built-in Wardrobe', 'Modern Design', 'Single Bed', 'Shared Bathroom'],
    is_active: true,
    images: ['https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop']
  },
  {
    property_id: 'corner-house',
    name: 'Leopard Room',
    description: 'Elegant spotted patterns with sophisticated styling and single bed. Stylish and chic for the fashion-conscious guest.',
    capacity: 1,
    bed_type: 'Single',
    bathroom: 'shared',
    base_price: 85,
    features: ['Smart TV', 'Vanity Area', 'Window Seat', 'Elegant Decor', 'Single Bed', 'Shared Bathroom'],
    is_active: true,
    images: ['https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop']
  }
];

const addons = [
  {
    name: 'Breakfast Package',
    description: 'Full English breakfast served in the dining room',
    price: 15,
    category: 'Food & Beverage',
    is_active: true
  },
  {
    name: 'Welcome Drinks',
    description: 'Complimentary welcome drinks upon arrival',
    price: 0,
    category: 'Food & Beverage',
    is_active: true
  },
  {
    name: 'Late Check-out',
    description: 'Extended check-out until 2 PM',
    price: 25,
    category: 'Services',
    is_active: true
  },
  {
    name: 'Additional Parking Space',
    description: 'Extra parking space per night',
    price: 5,
    category: 'Services',
    is_active: true
  },
  {
    name: 'Room Service',
    description: 'In-room dining service',
    price: 10,
    category: 'Services',
    is_active: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // First, ensure the property exists
    console.log('📋 Checking/Creating property...');
    const { data: existingProperty } = await supabase
      .from('properties')
      .select('id')
      .eq('id', 'corner-house')
      .single();

    if (!existingProperty) {
      const { error: propertyError } = await supabase
        .from('properties')
        .insert([{
          id: 'corner-house',
          name: 'The Corner House',
          description: 'A beautifully renovated 5-bedroom property in Braunston',
          address: 'Braunston, Daventry, Northamptonshire',
          city: 'Daventry',
          region: 'Northamptonshire',
          country: 'United Kingdom',
          check_in_time: '15:00',
          check_out_time: '11:00',
          amenities: ['WiFi', 'Parking', 'Kitchen', 'Garden'],
          rules: ['No smoking', 'Quiet hours 10PM-8AM'],
          num_rooms: 5
        }]);

      if (propertyError) {
        console.error('❌ Error creating property:', propertyError);
        return;
      }
      console.log('✅ Property created successfully');
    } else {
      console.log('✅ Property already exists');
    }

    // Insert rooms
    console.log('🛏️  Inserting rooms...');
    const { error: roomsError } = await supabase
      .from('rooms')
      .insert(rooms);

    if (roomsError) {
      console.error('❌ Error inserting rooms:', roomsError);
      return;
    }
    console.log('✅ Rooms inserted successfully');

    // Insert add-ons
    console.log('🎁 Inserting add-ons...');
    const { error: addonsError } = await supabase
      .from('addons')
      .insert(addons);

    if (addonsError) {
      console.error('❌ Error inserting add-ons:', addonsError);
      return;
    }
    console.log('✅ Add-ons inserted successfully');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${rooms.length} rooms and ${addons.length} add-ons`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seeding function
seedDatabase(); 