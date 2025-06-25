import { Property, Room, Booking, PriceRule, AvailabilityCheck, PriceCalculation } from './types';

// Mock data store - in production, this would be a database
class BookingService {
  private properties: Property[] = [
    {
      id: 'corner-house',
      name: 'The Corner House',
      description: 'A beautifully renovated 5-bedroom property in Braunston',
      address: 'Braunston, Daventry, Northamptonshire',
      city: 'Daventry',
      region: 'Northamptonshire',
      country: 'United Kingdom',
      images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
      amenities: ['WiFi', 'Parking', 'Kitchen', 'Garden'],
      rules: ['No smoking', 'Quiet hours 10PM-8AM'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      num_rooms: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  private bookings: Booking[] = [];
  private pricingRules: PriceRule[] = [];

  // Property Management
  getProperties(): Property[] {
    return this.properties;
  }

  getProperty(id: string): Property | undefined {
    return this.properties.find(p => p.id === id);
  }

  createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
    const newProperty: Property = {
      ...property,
      id: `property-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.push(newProperty);
    return newProperty;
  }

  updateProperty(id: string, updates: Partial<Property>): Property | null {
    const index = this.properties.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.properties[index] = {
      ...this.properties[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.properties[index];
  }

  deleteProperty(id: string): boolean {
    const index = this.properties.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.properties.splice(index, 1);
    return true;
  }

  // Room Management - Now handled by database
  getRooms(propertyId?: string): Room[] {
    // This method is now deprecated as rooms are fetched from database
    return [];
  }

  createRoom(room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Room {
    // This method is now deprecated as rooms are created via admin interface
    const newRoom: Room = {
      ...room,
      id: `room-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newRoom;
  }

  // Booking Management
  getBookings(): Booking[] {
    return this.bookings;
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    this.bookings[index] = {
      ...this.bookings[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.bookings[index];
  }

  deleteBooking(id: string): boolean {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    this.bookings.splice(index, 1);
    return true;
  }

  // Availability and Pricing
  checkAvailability(check: AvailabilityCheck): boolean {
    // Mock availability check - in production, this would query the database
    const conflictingBookings = this.bookings.filter(booking => {
      const bookingCheckIn = new Date(booking.checkIn);
      const bookingCheckOut = new Date(booking.checkOut);
      
      return (
        (check.checkIn < bookingCheckOut && check.checkOut > bookingCheckIn) &&
        booking.roomIds.some(roomId => check.roomIds?.includes(roomId) || false)
      );
    });

    return conflictingBookings.length === 0;
  }

  calculatePrice(check: AvailabilityCheck): PriceCalculation {
    // Mock price calculation - in production, this would use actual room prices and pricing rules
    const nights = Math.ceil((check.checkOut.getTime() - check.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = (check.roomIds?.length || 0) * 100 * nights; // £100 per room per night
    const total = basePrice; // Add add-ons later when implemented

    return {
      basePrice,
      pricingRules: [],
      totalPrice: total,
      nights,
    };
  }

  // Pricing Rules Management
  getPricingRules(): PriceRule[] {
    return this.pricingRules;
  }

  createPricingRule(rule: Omit<PriceRule, 'id' | 'created_at' | 'updated_at'>): PriceRule {
    const newRule: PriceRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.pricingRules.push(newRule);
    return newRule;
  }
}

export const bookingService = new BookingService();