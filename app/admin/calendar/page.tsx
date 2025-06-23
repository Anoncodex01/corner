'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Plus, Eye, Edit, X } from 'lucide-react';
import { bookingService } from '@/lib/booking-service';
import { Booking } from '@/lib/types';
import { toast } from 'sonner';

interface CalendarDay {
  date: Date;
  bookings: Booking[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    const allBookings = bookingService.getBookings();
    setBookings(allBookings);
  }, []);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, bookings, viewMode]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    if (viewMode === 'month') {
      // Get first day of month and adjust for week start (Monday = 1)
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - ((firstDay.getDay() + 6) % 7));
      
      const days: CalendarDay[] = [];
      const current = new Date(startDate);
      
      // Generate 42 days (6 weeks)
      for (let i = 0; i < 42; i++) {
        const dayBookings = bookings.filter(booking => {
          const bookingStart = new Date(booking.checkIn);
          const bookingEnd = new Date(booking.checkOut);
          return current >= bookingStart && current < bookingEnd;
        });
        
        days.push({
          date: new Date(current),
          bookings: dayBookings,
          isCurrentMonth: current.getMonth() === month,
          isToday: isToday(current),
        });
        
        current.setDate(current.getDate() + 1);
      }
      
      setCalendarDays(days);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getBookingTypeColor = (isWholeProperty: boolean) => {
    return isWholeProperty ? 'bg-purple-100 border-purple-300' : 'bg-blue-100 border-blue-300';
  };

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    const updated = bookingService.updateBooking(bookingId, { status: newStatus as any });
    if (updated) {
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
      toast.success(`Booking ${newStatus}`);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar Management</h1>
          <p className="text-gray-600">View and manage bookings across your calendar</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Booking
          </Button>
        </div>
      </div>

      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Cancelled</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 border-b">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-1 border border-gray-200 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${day.isToday ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !day.isCurrentMonth ? 'text-gray-400' : day.isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {day.bookings.slice(0, 3).map((booking) => (
                    <Dialog key={booking.id}>
                      <DialogTrigger asChild>
                        <div
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                            getBookingTypeColor(booking.isWholeProperty)
                          }`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`}></div>
                            <span className="truncate">
                              {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                            </span>
                          </div>
                          <div className="text-gray-600">
                            {booking.isWholeProperty ? 'Whole House' : `${booking.roomIds.length} room(s)`}
                          </div>
                        </div>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Booking Details</DialogTitle>
                        </DialogHeader>
                        {selectedBooking && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Guest Information</h4>
                                <p><strong>Name:</strong> {selectedBooking.guestInfo.firstName} {selectedBooking.guestInfo.lastName}</p>
                                <p><strong>Email:</strong> {selectedBooking.guestInfo.email}</p>
                                <p><strong>Phone:</strong> {selectedBooking.guestInfo.phone}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Booking Details</h4>
                                <p><strong>Check-in:</strong> {selectedBooking.checkIn.toLocaleDateString()}</p>
                                <p><strong>Check-out:</strong> {selectedBooking.checkOut.toLocaleDateString()}</p>
                                <p><strong>Guests:</strong> {selectedBooking.guests}</p>
                                <p><strong>Status:</strong> 
                                  <Badge className={`ml-2 ${getStatusColor(selectedBooking.status)} text-white`}>
                                    {selectedBooking.status}
                                  </Badge>
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Accommodation</h4>
                              <p>
                                {selectedBooking.isWholeProperty 
                                  ? 'Entire Property' 
                                  : `Rooms: ${selectedBooking.roomIds.join(', ')}`
                                }
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Pricing</h4>
                              <p><strong>Base Price:</strong> £{selectedBooking.basePrice.toFixed(2)}</p>
                              <p><strong>Total Price:</strong> £{selectedBooking.totalPrice.toFixed(2)}</p>
                            </div>
                            
                            {selectedBooking.guestInfo.specialRequests && (
                              <div>
                                <h4 className="font-semibold mb-2">Special Requests</h4>
                                <p className="text-gray-700">{selectedBooking.guestInfo.specialRequests}</p>
                              </div>
                            )}
                            
                            <div className="flex space-x-2 pt-4 border-t">
                              {selectedBooking.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  ))}
                  
                  {day.bookings.length > 3 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{day.bookings.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => {
                    const bookingMonth = b.checkIn.getMonth();
                    const bookingYear = b.checkIn.getFullYear();
                    return bookingMonth === currentDate.getMonth() && bookingYear === currentDate.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-terracotta-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-terracotta-600">
                  £{bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0).toFixed(0)}
                </p>
              </div>
              <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-terracotta-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}