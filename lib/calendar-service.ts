import { supabase } from './supabaseClient';
import { Booking } from './types';

export interface CalendarDay {
  date: Date;
  bookings: Booking[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  occupancyRate: number;
}

export interface CalendarStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
  occupancyRate: number;
}

export interface BookingWithDetails extends Booking {
  propertyName?: string;
  roomNames?: string[];
  addonNames?: string[];
}

class CalendarService {
  // Fetch all bookings for a date range
  async getBookings(startDate: Date, endDate: Date): Promise<BookingWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties:property_id(name)
        `)
        .gte('check_in', startDate.toISOString().split('T')[0])
        .lte('check_out', endDate.toISOString().split('T')[0])
        .order('check_in', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }

      // Transform the data to match our interface
      const bookings = (data || []).map(booking => ({
        id: booking.id,
        propertyId: booking.property_id,
        roomIds: booking.room_ids || [],
        isWholeProperty: booking.is_whole_property,
        checkIn: new Date(booking.check_in),
        checkOut: new Date(booking.check_out),
        guests: booking.guests,
        guestInfo: booking.guest_info,
        addOns: booking.add_ons || [],
        basePrice: booking.base_price,
        totalPrice: booking.total_price,
        status: booking.status,
        paymentStatus: booking.payment_status,
        source: booking.source,
        createdAt: new Date(booking.created_at),
        updatedAt: new Date(booking.updated_at),
        propertyName: booking.properties?.name,
        roomNames: [],
        addonNames: [],
      }));

      // Fetch room names for bookings that have rooms
      const roomIds = bookings
        .filter(b => b.roomIds.length > 0)
        .flatMap(b => b.roomIds);
      
      if (roomIds.length > 0) {
        const { data: roomsData } = await supabase
          .from('rooms')
          .select('id, name')
          .in('id', roomIds);
        
        const roomsMap = new Map(roomsData?.map(r => [r.id, r.name]) || []);
        
        bookings.forEach(booking => {
          booking.roomNames = booking.roomIds.map((id: string) => roomsMap.get(id) || 'Unknown Room');
        });
      }

      // Fetch addon names for bookings that have addons
      const addonIds = bookings
        .filter(b => b.addOns.length > 0)
        .flatMap(b => b.addOns);
      
      if (addonIds.length > 0) {
        const { data: addonsData } = await supabase
          .from('addons')
          .select('id, name')
          .in('id', addonIds);
        
        const addonsMap = new Map(addonsData?.map(a => [a.id, a.name]) || []);
        
        bookings.forEach(booking => {
          booking.addonNames = booking.addOns.map((id: string) => addonsMap.get(id) || 'Unknown Addon');
        });
      }

      return bookings;
    } catch (error) {
      console.error('Error in getBookings:', error);
      return [];
    }
  }

  // Generate calendar days for a specific month
  async generateCalendarDays(year: number, month: number): Promise<CalendarDay[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    // Get first day of month and adjust for week start (Monday = 1)
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const calendarStart = new Date(firstDay);
    calendarStart.setDate(calendarStart.getDate() - ((firstDay.getDay() + 6) % 7));
    const calendarEnd = new Date(lastDay);
    calendarEnd.setDate(calendarEnd.getDate() + (7 - ((lastDay.getDay() + 6) % 7)));

    // Fetch bookings for the calendar period
    const bookings = await this.getBookings(calendarStart, calendarEnd);
    // Fetch all rooms for the property (assume all bookings are for the same property)
    let totalRooms = 5; // fallback
    if (bookings.length > 0) {
      const propertyId = bookings[0].propertyId;
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('id')
        .eq('property_id', propertyId);
      if (!roomsError && roomsData) {
        totalRooms = roomsData.length;
      }
    }
    const days: CalendarDay[] = [];
    const current = new Date(calendarStart);
    // Generate calendar days
    while (current <= calendarEnd) {
      const dayBookings = bookings.filter(booking => {
        return current >= booking.checkIn && current < booking.checkOut;
      });
      // Calculate total booked rooms for the day
      let bookedRoomIds = new Set<string>();
      for (const booking of dayBookings) {
        if (booking.isWholeProperty) {
          // If whole property is booked, all rooms are booked
          bookedRoomIds = new Set();
          for (let i = 0; i < totalRooms; i++) bookedRoomIds.add(`room${i}`); // placeholder, will be replaced below
          break;
        }
        for (const id of booking.roomIds) {
          bookedRoomIds.add(id);
        }
      }
      // If any booking isWholeProperty, set occupancy to 100%
      let occupancyRate = 0;
      if (dayBookings.some(b => b.isWholeProperty)) {
        occupancyRate = 1;
      } else {
        occupancyRate = totalRooms > 0 ? bookedRoomIds.size / totalRooms : 0;
      }
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;
      const isHoliday = this.isHoliday(current);
      days.push({
        date: new Date(current),
        bookings: dayBookings,
        isCurrentMonth: current.getMonth() === month - 1,
        isToday: this.isToday(current),
        isWeekend,
        isHoliday,
        occupancyRate,
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }

  // Get calendar statistics
  async getCalendarStats(startDate?: Date, endDate?: Date): Promise<CalendarStats> {
    try {
      let data, error;
      if (startDate && endDate) {
        const p_start_date = startDate.toISOString().split('T')[0];
        const p_end_date = endDate.toISOString().split('T')[0];
        ({ data, error } = await supabase.rpc('get_booking_stats', { p_start_date, p_end_date }));
      } else {
        ({ data, error } = await supabase.rpc('get_booking_stats'));
      }
      console.log('get_booking_stats raw response:', { data, error });
      if (error) {
        console.error('Error fetching calendar stats:', error);
        return {
          totalBookings: 0,
          confirmedBookings: 0,
          pendingBookings: 0,
          cancelledBookings: 0,
          totalRevenue: 0,
          avgBookingValue: 0,
          occupancyRate: 0,
        };
      }
      const stats = data?.[0] || {};
      return {
        totalBookings: parseInt(stats.total_bookings) || 0,
        confirmedBookings: parseInt(stats.confirmed_bookings) || 0,
        pendingBookings: parseInt(stats.pending_bookings) || 0,
        cancelledBookings: parseInt(stats.cancelled_bookings) || 0,
        totalRevenue: parseFloat(stats.total_revenue) || 0,
        avgBookingValue: parseFloat(stats.avg_booking_value) || 0,
        occupancyRate: 0, // Calculate separately if needed
      };
    } catch (error) {
      console.error('Error in getCalendarStats:', error);
      return {
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        avgBookingValue: 0,
        occupancyRate: 0,
      };
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      return false;
    }
  }

  // Check room availability
  async checkAvailability(roomIds: string[], checkIn: Date, checkOut: Date, excludeBookingId?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('check_room_availability', {
        p_room_ids: roomIds,
        p_check_in: checkIn.toISOString().split('T')[0],
        p_check_out: checkOut.toISOString().split('T')[0],
        p_exclude_booking_id: excludeBookingId,
      });

      if (error) {
        console.error('Error checking availability:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error in checkAvailability:', error);
      return false;
    }
  }

  // Get bookings for a specific date
  async getBookingsForDate(date: Date): Promise<BookingWithDetails[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.getBookings(startOfDay, endOfDay);
  }

  // Get upcoming bookings
  async getUpcomingBookings(limit: number = 10): Promise<BookingWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties:property_id(name)
        `)
        .gte('check_in', new Date().toISOString().split('T')[0])
        .order('check_in', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching upcoming bookings:', error);
        return [];
      }

      return (data || []).map(booking => ({
        id: booking.id,
        propertyId: booking.property_id,
        roomIds: booking.room_ids || [],
        isWholeProperty: booking.is_whole_property,
        checkIn: new Date(booking.check_in),
        checkOut: new Date(booking.check_out),
        guests: booking.guests,
        guestInfo: booking.guest_info,
        addOns: booking.add_ons || [],
        basePrice: booking.base_price,
        totalPrice: booking.total_price,
        status: booking.status,
        paymentStatus: booking.payment_status,
        source: booking.source,
        createdAt: new Date(booking.created_at),
        updatedAt: new Date(booking.updated_at),
        propertyName: booking.properties?.name,
      }));
    } catch (error) {
      console.error('Error in getUpcomingBookings:', error);
      return [];
    }
  }

  // Helper methods
  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private isHoliday(date: Date): boolean {
    // Simple holiday check - could be enhanced with a holidays table
    const month = date.getMonth();
    const day = date.getDate();
    
    // UK Bank Holidays (simplified)
    const holidays = [
      { month: 0, day: 1 },   // New Year's Day
      { month: 3, day: 25 },  // Good Friday (approximate)
      { month: 3, day: 28 },  // Easter Monday (approximate)
      { month: 4, day: 6 },   // Early May Bank Holiday
      { month: 4, day: 27 },  // Spring Bank Holiday
      { month: 7, day: 26 },  // Summer Bank Holiday
      { month: 11, day: 25 }, // Christmas Day
      { month: 11, day: 26 }, // Boxing Day
    ];
    
    return holidays.some(holiday => holiday.month === month && holiday.day === day);
  }

  // Get month statistics
  async getMonthStats(year: number, month: number): Promise<CalendarStats> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return this.getCalendarStats(startDate, endDate);
  }

  // Get week statistics
  async getWeekStats(startDate: Date): Promise<CalendarStats> {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return this.getCalendarStats(startDate, endDate);
  }
}

export const calendarService = new CalendarService(); 