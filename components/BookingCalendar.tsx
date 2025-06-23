'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingData {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  selectedRooms: string[];
  bookingType: string;
}

interface BookingCalendarProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookingData, updateBookingData }) => {
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!bookingData.checkIn || selectingCheckOut) {
      if (selectingCheckOut && bookingData.checkIn && date > bookingData.checkIn) {
        updateBookingData({ checkOut: date });
        setSelectingCheckOut(false);
      } else if (!selectingCheckOut) {
        updateBookingData({ checkIn: date, checkOut: null });
        setSelectingCheckOut(true);
      }
    } else if (date > bookingData.checkIn) {
      updateBookingData({ checkOut: date });
      setSelectingCheckOut(false);
    } else {
      updateBookingData({ checkIn: date, checkOut: null });
      setSelectingCheckOut(true);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    if (!bookingData.checkIn) return false;
    
    const dateTime = date.getTime();
    const checkInTime = bookingData.checkIn.getTime();
    
    if (bookingData.checkOut) {
      const checkOutTime = bookingData.checkOut.getTime();
      return dateTime >= checkInTime && dateTime <= checkOutTime;
    }
    
    return dateTime === checkInTime;
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const diffTime = Math.abs(bookingData.checkOut.getTime() - bookingData.checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-terracotta">Select Your Dates</CardTitle>
        <div className="flex flex-wrap gap-2">
          {bookingData.checkIn && (
            <Badge variant="outline" className="border-terracotta text-terracotta">
              Check-in: {bookingData.checkIn.toLocaleDateString()}
            </Badge>
          )}
          {bookingData.checkOut && (
            <Badge variant="outline" className="border-ivy text-ivy">
              Check-out: {bookingData.checkOut.toLocaleDateString()}
            </Badge>
          )}
          {calculateNights() > 0 && (
            <Badge className="bg-terracotta text-white">
              {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={bookingData.checkIn || undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border"
            modifiers={{
              selected: isDateSelected,
              range_start: bookingData.checkIn ? (date: Date) => date.getTime() === bookingData.checkIn!.getTime() : undefined,
              range_end: bookingData.checkOut ? (date: Date) => date.getTime() === bookingData.checkOut!.getTime() : undefined,
              range_middle: (date: Date) => {
                if (!bookingData.checkIn || !bookingData.checkOut) return false;
                const dateTime = date.getTime();
                return dateTime > bookingData.checkIn.getTime() && dateTime < bookingData.checkOut.getTime();
              }
            }}
            modifiersStyles={{
              range_start: { backgroundColor: '#B5651D', color: 'white' },
              range_end: { backgroundColor: '#B5651D', color: 'white' },
              range_middle: { backgroundColor: '#B5651D20', color: '#B5651D' }
            }}
          />
        </div>
        
        {selectingCheckOut && bookingData.checkIn && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Now select your check-out date (must be after {bookingData.checkIn.toLocaleDateString()})
            </p>
          </div>
        )}

        {bookingData.bookingType === 'house' && calculateNights() > 0 && calculateNights() < 2 && 
         bookingData.checkIn && bookingData.checkIn.getDay() >= 5 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Weekend whole house bookings require a minimum of 2 nights.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCalendar;