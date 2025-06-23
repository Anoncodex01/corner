'use client';

import { useState } from 'react';
import { Calendar, Users, Search, Home, Building, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function BookingWidget() {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');
  const [bookingType, setBookingType] = useState('room');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams({
      checkIn: checkIn ? format(checkIn, 'yyyy-MM-dd') : '',
      checkOut: checkOut ? format(checkOut, 'yyyy-MM-dd') : '',
      guests,
      type: bookingType,
    });
    
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <Card className="max-w-4xl mx-auto border-2 border-white/40 bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl">
      <CardHeader className="text-center pt-8">
        <CardTitle className="text-3xl font-bold font-playfair text-terracotta-800">
          Find Your Perfect Stay
        </CardTitle>
        <CardDescription className="text-gray-600">
          Check availability and book your room or the entire house
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Check-in Date */}
          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12 bg-white/80"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12 bg-white/80"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => date <= (checkIn || new Date(new Date().setHours(0,0,0,0)))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">Guests</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="h-12 bg-white/80">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Booking Type */}
          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">Booking Type</Label>
            <Select value={bookingType} onValueChange={setBookingType}>
              <SelectTrigger className="h-12 bg-white/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="room">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4" /> Individual Room
                  </div>
                </SelectItem>
                <SelectItem value="house">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" /> Entire House
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <Button 
              onClick={handleSearch}
              className="w-full h-12 btn-primary rounded-lg"
              disabled={!checkIn || !checkOut}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="mt-6 p-3 bg-terracotta-100/50 border border-terracotta-200/60 rounded-lg">
          <p className="text-sm text-terracotta-800 text-center flex items-center justify-center">
            <Sparkles className="h-4 w-4 mr-2 text-terracotta-600" />
            <strong>Special Offer:</strong>&nbsp;Book 3+ nights and save 15%.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}