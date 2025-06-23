export interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  images: string[];
  amenities: string[];
  rules: string[];
  checkInTime: string;
  checkOutTime: string;
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

export interface PricingRule {
  id: string;
  propertyId?: string;
  roomId?: string;
  name: string;
  type: 'weekend' | 'holiday' | 'event' | 'seasonal' | 'length_of_stay';
  startDate?: Date;
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  minimumStay?: number;
  maximumStay?: number;
  priceModifier: number; // Percentage or fixed amount
  modifierType: 'percentage' | 'fixed';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
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
    rule: PricingRule;
    adjustment: number;
  }[];
  totalPrice: number;
  nights: number;
}