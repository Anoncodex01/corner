export interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  region: string;
  country: string;
  images: string[];
  amenities: string[];
  rules: string[];
  checkInTime: string;
  checkOutTime: string;
  check_in_time?: string;
  check_out_time?: string;
  num_rooms: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  capacity: number;
  bedType: string;
  bathroom: 'ensuite' | 'shared';
  basePrice: number;
  images: string[];
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceRule {
  id: string;
  rule_type: 'seasonal' | 'day_of_week' | 'minimum_stay' | 'last_minute' | 'advance_booking';
  modifier_type: 'percentage' | 'fixed';
  price_modifier: number; // Percentage or fixed amount
  minimum_stay?: number;
  start_date?: Date;
  end_date?: Date;
  days_of_week?: number[]; // 0-6 (Sunday-Saturday)
  is_active: boolean;
  property_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  roomIds: string[];
  isWholeProperty: boolean;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  addOns: string[];
  basePrice: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'blocked';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  source: 'direct' | 'airbnb' | 'booking.com' | 'vrbo';
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilityCheck {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  roomIds?: string[];
  isWholeProperty?: boolean;
}

export interface PriceCalculation {
  basePrice: number;
  pricingRules: {
    rule: PriceRule;
    adjustment: number;
  }[];
  totalPrice: number;
  nights: number;
}