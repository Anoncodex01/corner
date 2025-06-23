import { Property, Room, Booking, PricingRule, AvailabilityCheck, PriceCalculation } from './types';

// Mock data store - in production, this would be a database
class BookingService {
  private properties: Property[] = [
    {
      id: 'corner-house',
      name: 'The Corner House',
      description: 'A beautifully renovated 5-bedroom property in Braunston',
      address: 'Braunston, Daventry, Northamptonshire',
      images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
      amenities: ['WiFi', 'Parking', 'Kitchen', 'Garden'],
      rules: ['No smoking', 'Quiet hours 10PM-8AM'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  private rooms: Room[] = [
    {
      id: 'lion-suite',
      propertyId: 'corner-house',
      name: 'Lion Suite',
      description: 'Majestic suite with golden accents',
      capacity: 2,
      bedType: 'King',
      bathroom: 'ensuite',
      basePrice: 120,
      images: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'],
      features: ['Smart TV', 'Mini Fridge', 'Work Desk'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'elephant-room',
      propertyId: 'corner-house',
      name: 'Elephant Room',
      description: 'Spacious room with earthy tones',
      capacity: 2,
      bedType: 'Queen',
      bathroom: 'ensuite',
      basePrice: 100,
      images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'],
      features: ['Smart TV', 'Tea Station', 'Garden View'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'buffalo-room',
      propertyId: 'corner-house',
      name: 'Buffalo Room',
      description: 'Rustic charm with modern comfort',
      capacity: 2,
      bedType: 'Double',
      bathroom: 'shared',
      basePrice: 95,
      images: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'],
      features: ['Smart TV', 'Reading Nook'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'rhino-room',
      propertyId: 'corner-house',
      name: 'Rhino Room',
      description: 'Contemporary design with geometric patterns',
      capacity: 1,
      bedType: 'Single',
      bathroom: 'shared',
      basePrice: 90,
      images: ['https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg'],
      features: ['Smart TV', 'Study Area'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'leopard-room',
      propertyId: 'corner-house',
      name: 'Leopard Room',
      description: 'Elegant spotted patterns with sophisticated styling',
      capacity: 1,
      bedType: 'Single',
      bathroom: 'shared',
      basePrice: 85,
      images: ['https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg'],
      features: ['Smart TV', 'Vanity Area'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private pricingRules: PricingRule[] = [
    {
      id: 'weekend-premium',
      propertyId: 'corner-house',
      name: 'Weekend Premium',
      type: 'weekend',
      daysOfWeek: [5, 6], // Friday, Saturday
      priceModifier: 25,
      modifierType: 'percentage',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'whole-house-discount',
      propertyId: 'corner-house',
      name: 'Whole House Booking',
      type: 'length_of_stay',
      minimumStay: 1,
      priceModifier: -50, // £50 discount for whole house
      modifierType: 'fixed',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'extended-stay-discount',
      propertyId: 'corner-house',
      name: 'Extended Stay Discount',
      type: 'length_of_stay',
      minimumStay: 7,
      priceModifier: -15,
      modifierType: 'percentage',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private bookings: Booking[] = [];

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

  // Room Management
  getRooms(propertyId?: string): Room[] {
    return propertyId 
      ? this.rooms.filter(r => r.propertyId === propertyId)
      : this.rooms;
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.find(r => r.id === id);
  }

  createRoom(room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Room {
    const newRoom: Room = {
      ...room,
      id: `room-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.rooms.push(newRoom);
    return newRoom;
  }

  updateRoom(id: string, updates: Partial<Room>): Room | null {
    const index = this.rooms.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    this.rooms[index] = {
      ...this.rooms[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.rooms[index];
  }

  // Pricing Rules Management
  getPricingRules(propertyId?: string): PricingRule[] {
    return propertyId 
      ? this.pricingRules.filter(r => r.propertyId === propertyId)
      : this.pricingRules;
  }

  createPricingRule(rule: Omit<PricingRule, 'id' | 'createdAt' | 'updatedAt'>): PricingRule {
    const newRule: PricingRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pricingRules.push(newRule);
    return newRule;
  }

  updatePricingRule(id: string, updates: Partial<PricingRule>): PricingRule | null {
    const index = this.pricingRules.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    this.pricingRules[index] = {
      ...this.pricingRules[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.pricingRules[index];
  }

  // Availability Checking
  checkAvailability({ propertyId, checkIn, checkOut, roomIds, isWholeProperty }: AvailabilityCheck): boolean {
    const conflictingBookings = this.bookings.filter(booking => {
      // Skip cancelled bookings
      if (booking.status === 'cancelled') return false;
      
      // Check date overlap
      const hasDateOverlap = (
        (checkIn >= booking.checkIn && checkIn < booking.checkOut) ||
        (checkOut > booking.checkIn && checkOut <= booking.checkOut) ||
        (checkIn <= booking.checkIn && checkOut >= booking.checkOut)
      );
      
      if (!hasDateOverlap) return false;
      
      // Check property conflict
      if (booking.propertyId !== propertyId) return false;
      
      // If either booking is for whole property, there's a conflict
      if (booking.isWholeProperty || isWholeProperty) return true;
      
      // Check room conflicts
      if (roomIds && booking.roomIds) {
        return roomIds.some(roomId => booking.roomIds.includes(roomId));
      }
      
      return false;
    });
    
    return conflictingBookings.length === 0;
  }

  // Price Calculation
  calculatePrice({ propertyId, checkIn, checkOut, roomIds, isWholeProperty }: AvailabilityCheck): PriceCalculation {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    let basePrice = 0;
    
    if (isWholeProperty) {
      // Special whole house pricing
      basePrice = 400 * nights;
    } else if (roomIds) {
      // Calculate based on selected rooms
      basePrice = roomIds.reduce((total, roomId) => {
        const room = this.getRoom(roomId);
        return total + (room ? room.basePrice * nights : 0);
      }, 0);
    }
    
    // Apply pricing rules
    const applicableRules = this.pricingRules.filter(rule => {
      if (!rule.isActive) return false;
      if (rule.propertyId && rule.propertyId !== propertyId) return false;
      
      // Check date range
      if (rule.startDate && checkIn < rule.startDate) return false;
      if (rule.endDate && checkOut > rule.endDate) return false;
      
      // Check days of week for weekend pricing
      if (rule.type === 'weekend' && rule.daysOfWeek) {
        const hasWeekendNight = this.hasWeekendNights(checkIn, checkOut, rule.daysOfWeek);
        if (!hasWeekendNight) return false;
      }
      
      // Check minimum stay
      if (rule.minimumStay && nights < rule.minimumStay) return false;
      
      // Check if it's a whole house booking rule
      if (rule.name === 'Whole House Booking' && !isWholeProperty) return false;
      
      return true;
    });
    
    let totalPrice = basePrice;
    const ruleAdjustments: { rule: PricingRule; adjustment: number }[] = [];
    
    applicableRules.forEach(rule => {
      let adjustment = 0;
      if (rule.modifierType === 'percentage') {
        adjustment = (basePrice * rule.priceModifier) / 100;
      } else {
        adjustment = rule.priceModifier;
      }
      
      totalPrice += adjustment;
      ruleAdjustments.push({ rule, adjustment });
    });
    
    return {
      basePrice,
      pricingRules: ruleAdjustments,
      totalPrice: Math.max(0, totalPrice), // Ensure price doesn't go negative
      nights,
    };
  }
  
  private hasWeekendNights(checkIn: Date, checkOut: Date, weekendDays: number[]): boolean {
    const current = new Date(checkIn);
    while (current < checkOut) {
      if (weekendDays.includes(current.getDay())) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }
    return false;
  }

  // Booking Management
  getBookings(propertyId?: string): Booking[] {
    return propertyId 
      ? this.bookings.filter(b => b.propertyId === propertyId)
      : this.bookings;
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking | null {
    // Check availability first
    const isAvailable = this.checkAvailability({
      propertyId: booking.propertyId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      roomIds: booking.roomIds,
      isWholeProperty: booking.isWholeProperty,
    });
    
    if (!isAvailable) {
      return null; // Booking conflict
    }
    
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

  cancelBooking(id: string): boolean {
    const booking = this.getBooking(id);
    if (!booking) return false;
    
    this.updateBooking(id, { status: 'cancelled' });
    return true;
  }
}

// Export singleton instance
export const bookingService = new BookingService();