-- Bookings Table Setup for The Corner House
-- Run these commands in your Supabase SQL editor

-- 1. Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_ids UUID[] DEFAULT '{}', -- Array of room UUIDs
    is_whole_property BOOLEAN DEFAULT false,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    guest_info JSONB NOT NULL DEFAULT '{}', -- Store guest information as JSON
    add_ons UUID[] DEFAULT '{}', -- Array of addon UUIDs
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    source VARCHAR(20) NOT NULL DEFAULT 'direct' CHECK (source IN ('direct', 'airbnb', 'booking.com', 'vrbo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_date_range ON bookings(check_in, check_out);

-- 3. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_booking_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_booking_updated_at();

-- 5. Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for the bookings table
-- Allow authenticated users to manage bookings
CREATE POLICY "Admin can manage bookings" ON bookings
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Allow public to create bookings (for the booking form)
CREATE POLICY "Public can create bookings" ON bookings
    FOR INSERT
    WITH CHECK (true);

-- Allow public to read their own bookings (if we implement user authentication)
-- CREATE POLICY "Users can read their own bookings" ON bookings
--     FOR SELECT
--     USING (guest_info->>'email' = auth.jwt() ->> 'email');

-- 7. Create a function to check availability
CREATE OR REPLACE FUNCTION check_room_availability(
    p_room_ids UUID[],
    p_check_in DATE,
    p_check_out DATE,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflicting_bookings INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflicting_bookings
    FROM bookings
    WHERE (
        -- Check if any of the requested rooms are already booked
        (room_ids && p_room_ids OR is_whole_property = true)
        AND
        -- Check for date overlap
        (check_in < p_check_out AND check_out > p_check_in)
        AND
        -- Exclude the current booking if updating
        (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
        AND
        -- Only consider confirmed and pending bookings
        status IN ('confirmed', 'pending')
    );
    
    RETURN conflicting_bookings = 0;
END;
$$ LANGUAGE plpgsql;

-- 8. Create a function to get booking statistics
CREATE OR REPLACE FUNCTION get_booking_stats(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    total_bookings BIGINT,
    confirmed_bookings BIGINT,
    pending_bookings BIGINT,
    cancelled_bookings BIGINT,
    total_revenue DECIMAL(10,2),
    avg_booking_value DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
        COALESCE(SUM(total_price) FILTER (WHERE status = 'confirmed'), 0) as total_revenue,
        COALESCE(AVG(total_price) FILTER (WHERE status = 'confirmed'), 0) as avg_booking_value
    FROM bookings
    WHERE (
        p_start_date IS NULL OR check_in >= p_start_date
    ) AND (
        p_end_date IS NULL OR check_in <= p_end_date
    );
END;
$$ LANGUAGE plpgsql;

-- 9. Insert some sample data for testing (only if rooms and addons exist)
DO $$
DECLARE
    sample_property_id UUID;
    sample_room_id UUID;
    sample_addon_id UUID;
BEGIN
    -- Get a sample property
    SELECT id INTO sample_property_id FROM properties LIMIT 1;
    
    -- Get a sample room
    SELECT id INTO sample_room_id FROM rooms LIMIT 1;
    
    -- Get a sample addon
    SELECT id INTO sample_addon_id FROM addons LIMIT 1;
    
    -- Only insert if we have the required data
    IF sample_property_id IS NOT NULL THEN
        INSERT INTO bookings (
            property_id,
            room_ids,
            is_whole_property,
            check_in,
            check_out,
            guests,
            guest_info,
            add_ons,
            base_price,
            total_price,
            status,
            payment_status,
            source
        ) VALUES 
        (
            sample_property_id,
            CASE WHEN sample_room_id IS NOT NULL THEN ARRAY[sample_room_id] ELSE ARRAY[]::UUID[] END,
            false,
            CURRENT_DATE + INTERVAL '7 days',
            CURRENT_DATE + INTERVAL '10 days',
            2,
            '{"firstName": "John", "lastName": "Doe", "email": "john@example.com", "phone": "+44123456789", "specialRequests": "Early check-in if possible"}',
            CASE WHEN sample_addon_id IS NOT NULL THEN ARRAY[sample_addon_id] ELSE ARRAY[]::UUID[] END,
            300.00,
            325.00,
            'confirmed',
            'paid',
            'direct'
        ),
        (
            sample_property_id,
            ARRAY[]::UUID[],
            true,
            CURRENT_DATE + INTERVAL '14 days',
            CURRENT_DATE + INTERVAL '21 days',
            6,
            '{"firstName": "Jane", "lastName": "Smith", "email": "jane@example.com", "phone": "+44987654321"}',
            CASE WHEN sample_addon_id IS NOT NULL THEN ARRAY[sample_addon_id] ELSE ARRAY[]::UUID[] END,
            800.00,
            850.00,
            'pending',
            'pending',
            'direct'
        )
        ON CONFLICT DO NOTHING;
    END IF;
END $$; 