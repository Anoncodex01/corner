# Calendar Implementation for The Corner House

## Overview

This document describes the comprehensive calendar system implemented for The Corner House luxury accommodation booking site. The system provides a full-featured calendar interface for managing bookings, viewing availability, and handling all booking-related operations.

## Features Implemented

### 🗓️ **Calendar Interface**
- **Month/Week View**: Toggle between monthly and weekly calendar views
- **Visual Booking Display**: Color-coded bookings with status indicators
- **Occupancy Tracking**: Real-time occupancy rates for each day
- **Holiday Recognition**: Automatic highlighting of UK bank holidays
- **Weekend Styling**: Special styling for weekend days

### 📊 **Statistics Dashboard**
- **Monthly Statistics**: Total bookings, confirmed, pending, cancelled
- **Revenue Tracking**: Total revenue and average booking value
- **Real-time Updates**: Statistics update automatically when bookings change

### 🎯 **Booking Management**
- **Create Bookings**: Full booking creation dialog with validation
- **Status Updates**: Confirm, cancel, or modify booking status
- **Availability Checking**: Real-time availability validation
- **Guest Information**: Complete guest details and special requests
- **Add-ons Integration**: Select and manage booking add-ons

### 🔍 **Advanced Features**
- **Database Integration**: Full Supabase integration with real-time data
- **Availability Functions**: SQL functions for checking room availability
- **Statistics Functions**: Database functions for booking analytics
- **Row Level Security**: Proper security policies for data access

## Database Schema

### Bookings Table
```sql
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_ids TEXT[] DEFAULT '{}',
    is_whole_property BOOLEAN DEFAULT false,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    guest_info JSONB NOT NULL DEFAULT '{}',
    add_ons TEXT[] DEFAULT '{}',
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    source VARCHAR(20) NOT NULL DEFAULT 'direct',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Key Functions
- `check_room_availability()`: Check if rooms are available for given dates
- `get_booking_stats()`: Get comprehensive booking statistics
- `update_booking_updated_at()`: Automatic timestamp updates

## File Structure

```
├── app/admin/calendar/
│   └── page.tsx                    # Main calendar page
├── components/admin/
│   └── CreateBookingDialog.tsx     # Booking creation dialog
├── lib/
│   ├── calendar-service.ts         # Calendar service layer
│   └── booking-service.ts          # Legacy booking service (updated)
├── database/
│   └── bookings-setup.sql          # Database setup script
└── CALENDAR_IMPLEMENTATION.md      # This documentation
```

## Key Components

### 1. CalendarService (`lib/calendar-service.ts`)
The main service class that handles all calendar operations:

```typescript
class CalendarService {
  async getBookings(startDate: Date, endDate: Date): Promise<BookingWithDetails[]>
  async generateCalendarDays(year: number, month: number): Promise<CalendarDay[]>
  async getCalendarStats(startDate?: Date, endDate?: Date): Promise<CalendarStats>
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<boolean>
  async checkAvailability(roomIds: string[], checkIn: Date, checkOut: Date): Promise<boolean>
}
```

### 2. Calendar Page (`app/admin/calendar/page.tsx`)
The main calendar interface with:
- Month/week view toggle
- Navigation controls
- Booking display with status colors
- Statistics dashboard
- Booking detail dialogs

### 3. CreateBookingDialog (`components/admin/CreateBookingDialog.tsx`)
Comprehensive booking creation form with:
- Property and room selection
- Date and guest information
- Add-ons selection
- Real-time price calculation
- Availability validation

## Usage Instructions

### Setting Up the Database

1. **Run the SQL Setup**:
   ```sql
   -- Copy and paste the contents of database/bookings-setup.sql
   -- into your Supabase SQL editor and execute
   ```

2. **Verify Tables**:
   - Check that the `bookings` table was created
   - Verify the functions `check_room_availability` and `get_booking_stats` exist
   - Confirm RLS policies are in place

### Using the Calendar

1. **Navigate to Calendar**:
   - Go to `/admin/calendar` in your application
   - The calendar will load with current month's data

2. **View Bookings**:
   - Bookings appear as colored blocks on calendar days
   - Click any booking to view detailed information
   - Use the legend to understand status colors

3. **Create New Booking**:
   - Click "Add Booking" button
   - Fill in all required information
   - System will validate availability automatically
   - Submit to create the booking

4. **Manage Existing Bookings**:
   - Click on any booking to open details
   - Use action buttons to confirm/cancel bookings
   - Edit booking information as needed

### Calendar Features

#### Status Colors
- 🟢 **Green**: Confirmed bookings
- 🟡 **Yellow**: Pending bookings
- 🔴 **Red**: Cancelled bookings
- 🔵 **Blue**: Completed bookings
- 🟣 **Purple**: Whole property bookings

#### Occupancy Indicators
- **Red Badge**: High occupancy (80%+)
- **Yellow Badge**: Medium occupancy (60-79%)
- **Blue Badge**: Low occupancy (40-59%)
- **Gray Badge**: Very low occupancy (<40%)

## API Integration

### Supabase Queries

The calendar system uses several Supabase queries:

```typescript
// Fetch bookings with property details
const { data } = await supabase
  .from('bookings')
  .select(`
    *,
    properties:property_id(name),
    rooms:room_ids(name)
  `)
  .gte('check_in', startDate)
  .lte('check_out', endDate);

// Update booking status
const { error } = await supabase
  .from('bookings')
  .update({ status: newStatus })
  .eq('id', bookingId);

// Check availability using custom function
const { data } = await supabase.rpc('check_room_availability', {
  p_room_ids: roomIds,
  p_check_in: checkIn,
  p_check_out: checkOut
});
```

## Security Considerations

### Row Level Security (RLS)
- **Admin Access**: Authenticated users can manage all bookings
- **Public Creation**: Anyone can create bookings (for booking form)
- **Future Enhancement**: User-specific booking access

### Data Validation
- **Client-side**: Form validation for required fields
- **Server-side**: Database constraints and triggers
- **Availability**: Real-time availability checking

## Performance Optimizations

### Database Indexes
- `idx_bookings_property_id`: Fast property-based queries
- `idx_bookings_date_range`: Efficient date range searches
- `idx_bookings_status`: Quick status filtering
- `idx_bookings_created_at`: Recent bookings sorting

### Caching Strategy
- **Calendar Days**: Generated on-demand and cached
- **Statistics**: Calculated using database functions
- **Availability**: Real-time checking with optimized queries

## Future Enhancements

### Planned Features
1. **Week View**: Detailed weekly calendar view
2. **Drag & Drop**: Drag bookings to reschedule
3. **Bulk Operations**: Select multiple bookings for batch actions
4. **Export Functionality**: Export calendar data to CSV/PDF
5. **Email Notifications**: Automatic booking confirmations
6. **Payment Integration**: Direct payment processing
7. **Multi-property Support**: Calendar for multiple properties

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live updates
2. **Advanced Filtering**: Filter by guest, room type, status
3. **Calendar Sync**: Integration with external calendars
4. **Mobile Optimization**: Touch-friendly calendar interface
5. **Analytics Dashboard**: Advanced booking analytics

## Troubleshooting

### Common Issues

1. **Calendar Not Loading**:
   - Check database connection
   - Verify RLS policies
   - Check browser console for errors

2. **Bookings Not Appearing**:
   - Ensure bookings table has data
   - Check date format in database
   - Verify property_id references

3. **Availability Check Failing**:
   - Confirm `check_room_availability` function exists
   - Check room_ids array format
   - Verify booking status values

4. **Statistics Not Updating**:
   - Check `get_booking_stats` function
   - Verify date parameters
   - Check for database errors

### Debug Mode
Enable debug logging by adding to your environment:
```bash
NEXT_PUBLIC_DEBUG_CALENDAR=true
```

## Support

For issues or questions about the calendar implementation:
1. Check the browser console for error messages
2. Verify database setup and permissions
3. Test with sample data first
4. Review the Supabase logs for database errors

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Production Ready ✅ 