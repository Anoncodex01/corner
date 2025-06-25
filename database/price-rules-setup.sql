-- Price Rules Table for Dynamic Pricing
CREATE TABLE IF NOT EXISTS price_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    addon_id UUID REFERENCES addons(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL, -- e.g. 'seasonal', 'weekend', 'discount'
    description TEXT,
    price_modifier DECIMAL(10,2) NOT NULL, -- e.g. 10.00 for +£10, -5.00 for -£5
    modifier_type VARCHAR(10) NOT NULL DEFAULT 'absolute', -- 'absolute' or 'percent'
    start_date DATE,
    end_date DATE,
    days_of_week VARCHAR(20), -- e.g. 'Fri,Sat,Sun'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255),
    minimum_stay INTEGER
);

CREATE INDEX IF NOT EXISTS idx_price_rules_addon_id ON price_rules(addon_id);
CREATE INDEX IF NOT EXISTS idx_price_rules_room_id ON price_rules(room_id);
CREATE INDEX IF NOT EXISTS idx_price_rules_is_active ON price_rules(is_active);

CREATE OR REPLACE FUNCTION update_price_rule_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_price_rule_updated_at
    BEFORE UPDATE ON price_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_price_rule_updated_at();

ALTER TABLE price_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage price rules" ON price_rules
    FOR ALL
    USING (auth.role() = 'authenticated'); 