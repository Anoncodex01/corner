'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingData {
  checkIn: string;
  checkOut: string;
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
      if (selectingCheckOut && bookingData.checkIn && date > new Date(bookingData.checkIn)) {
        updateBookingData({ checkOut: date.toISOString() });
        setSelectingCheckOut(false);
      } else if (!selectingCheckOut) {
        updateBookingData({ checkIn: date.toISOString(), checkOut: null });
        setSelectingCheckOut(true);
      }
    } else if (date > new Date(bookingData.checkIn)) {
      updateBookingData({ checkOut: date.toISOString() });
      setSelectingCheckOut(false);
    } else {
      updateBookingData({ checkIn: date.toISOString(), checkOut: null });
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
    const checkInDate = new Date(bookingData.checkIn);
    const dateTime = date.getTime();
    const checkInTime = checkInDate.getTime();
    if (bookingData.checkOut) {
      const checkOutDate = new Date(bookingData.checkOut);
      const checkOutTime = checkOutDate.getTime();
      return dateTime >= checkInTime && dateTime <= checkOutTime;
    }
    return dateTime === checkInTime;
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  // Build modifiers object without undefined values
  const modifiers: Record<string, any> = {
    selected: isDateSelected,
    range_middle: (date: Date) => {
      if (!bookingData.checkIn || !bookingData.checkOut) return false;
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const dateTime = date.getTime();
      return dateTime > checkInDate.getTime() && dateTime < checkOutDate.getTime();
    },
  };
  if (bookingData.checkIn) {
    const checkInDate = new Date(bookingData.checkIn);
    modifiers.range_start = (date: Date) => date.getTime() === checkInDate.getTime();
  }
  if (bookingData.checkOut) {
    const checkOutDate = new Date(bookingData.checkOut);
    modifiers.range_end = (date: Date) => date.getTime() === checkOutDate.getTime();
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-brand-primary">Select Your Dates</CardTitle>
        <div className="flex flex-wrap gap-2">
          {bookingData.checkIn && (
            <Badge variant="outline" className="border-brand-primary text-brand-primary">
              Check-in: {new Date(bookingData.checkIn).toLocaleDateString()}
            </Badge>
          )}
          {bookingData.checkOut && (
            <Badge variant="outline" className="border-brand-secondary text-brand-secondary">
              Check-out: {new Date(bookingData.checkOut).toLocaleDateString()}
            </Badge>
          )}
          {calculateNights() > 0 && (
            <Badge className="bg-brand-primary text-white">
              {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={bookingData.checkIn ? new Date(bookingData.checkIn) : undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border"
            modifiers={modifiers}
            modifiersStyles={{
              range_start: { backgroundColor: '#1d3e3c', color: 'white' },
              range_end: { backgroundColor: '#1d3e3c', color: 'white' },
              range_middle: { backgroundColor: '#1d3e3c20', color: '#1d3e3c' }
            }}
          />
        </div>
        
        {selectingCheckOut && bookingData.checkIn && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Now select your check-out date (must be after {new Date(bookingData.checkIn).toLocaleDateString()})
            </p>
          </div>
        )}

        {bookingData.bookingType === 'house' && calculateNights() > 0 && calculateNights() < 2 && 
         bookingData.checkIn && new Date(bookingData.checkIn).getDay() >= 5 && (
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