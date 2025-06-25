-- SQL Commands for Add-ons Management System
-- Run these commands in your Supabase SQL editor

-- 1. Create the addons table
CREATE TABLE IF NOT EXISTS addons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    category VARCHAR(100) NOT NULL DEFAULT 'Services',
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_addons_category ON addons(category);
CREATE INDEX IF NOT EXISTS idx_addons_is_active ON addons(is_active);
CREATE INDEX IF NOT EXISTS idx_addons_created_at ON addons(created_at DESC);

-- 3. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_addons_updated_at 
    BEFORE UPDATE ON addons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Create the storage bucket for addon images
-- Note: This needs to be done through the Supabase dashboard or API
-- Go to Storage > Create a new bucket called 'addon-images'
-- Set it to public and configure the following policies

-- 6. Storage policies for the addon-images bucket
-- Run these after creating the bucket in Supabase dashboard

-- Allow public read access to addon images
CREATE POLICY "Public read access for addon images" ON storage.objects
    FOR SELECT USING (bucket_id = 'addon-images');

-- Allow authenticated users to upload addon images
CREATE POLICY "Authenticated users can upload addon images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'addon-images' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update addon images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'addon-images' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to delete their uploaded images
CREATE POLICY "Authenticated users can delete addon images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'addon-images' 
        AND auth.role() = 'authenticated'
    );

-- 7. Insert some sample add-ons (optional)
INSERT INTO addons (name, description, price, category, is_active) VALUES
('Breakfast Package', 'Full English breakfast served in your room or the dining area. Includes eggs, bacon, sausages, toast, and coffee.', 15.00, 'Food & Beverage', true),
('Evening Meal', 'Three-course dinner prepared by our chef. Includes starter, main course, and dessert.', 35.00, 'Food & Beverage', true),
('Room Service', '24/7 room service with a selection of snacks, drinks, and light meals.', 8.00, 'Services', true),
('Spa Treatment', 'Relaxing massage or facial treatment in the comfort of your room.', 45.00, 'Wellness', true),
('Airport Transfer', 'Private transfer to and from the nearest airport or train station.', 25.00, 'Transportation', true),
('Movie Night Package', 'Popcorn, snacks, and access to our premium movie collection.', 12.00, 'Entertainment', true),
('Anniversary Package', 'Special decoration, champagne, and romantic dinner setup.', 75.00, 'Special Events', true);

-- 8. Row Level Security (RLS) policies for the addons table
-- Enable RLS
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active add-ons
CREATE POLICY "Public read access to active addons" ON addons
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all add-ons (for admin panel)
CREATE POLICY "Authenticated users can read all addons" ON addons
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert add-ons
CREATE POLICY "Authenticated users can insert addons" ON addons
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update add-ons
CREATE POLICY "Authenticated users can update addons" ON addons
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete add-ons
CREATE POLICY "Authenticated users can delete addons" ON addons
    FOR DELETE USING (auth.role() = 'authenticated');

-- 9. Create a view for public add-ons (optional)
CREATE VIEW public_addons AS
SELECT id, name, description, price, category, image_url
FROM addons
WHERE is_active = true
ORDER BY category, name;

-- Grant access to the view
GRANT SELECT ON public_addons TO anon;
GRANT SELECT ON public_addons TO authenticated; 