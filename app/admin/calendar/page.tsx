'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Plus, Eye, Edit, X, Users, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { calendarService, CalendarDay, CalendarStats, BookingWithDetails } from '@/lib/calendar-service';
import CreateBookingDialog from '@/components/admin/CreateBookingDialog';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CalendarStats>({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    avgBookingValue: 0,
    occupancyRate: 0,
  });

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, viewMode]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      // Load calendar days
      const days = await calendarService.generateCalendarDays(year, month);
      setCalendarDays(days);
      
      // Load statistics
      const monthStats = await calendarService.getMonthStats(year, month);
      setStats(monthStats);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingTypeColor = (isWholeProperty: boolean) => {
    return isWholeProperty ? 'bg-purple-100 border-purple-300' : 'bg-blue-100 border-blue-300';
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    const success = await calendarService.updateBookingStatus(bookingId, newStatus as any);
    if (success) {
      toast.success(`Booking ${newStatus}`);
      loadCalendarData(); // Reload data
    } else {
      toast.error('Failed to update booking status');
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getOccupancyColor = (rate: number) => {
    if (rate >= 0.8) return 'bg-red-100 text-red-800';
    if (rate >= 0.6) return 'bg-yellow-100 text-yellow-800';
    if (rate >= 0.4) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

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
          
          <CreateBookingDialog onBookingCreated={loadCalendarData} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-terracotta-600">£{stats.totalRevenue.toFixed(0)}</p>
              </div>
              <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-terracotta-500" />
              </div>
            </div>
          </CardContent>
        </Card>
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
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Whole Property</span>
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
                className={`min-h-[140px] p-1 border border-gray-200 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${day.isToday ? 'bg-blue-50 border-blue-300' : ''} ${
                  day.isWeekend ? 'bg-gray-25' : ''
                } ${day.isHoliday ? 'bg-red-25' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={`text-sm font-medium ${
                    !day.isCurrentMonth ? 'text-gray-400' : 
                    day.isToday ? 'text-blue-600' : 
                    day.isHoliday ? 'text-red-600' :
                    'text-gray-900'
                  }`}>
                    {day.date.getDate()}
                  </div>
                  {day.occupancyRate > 0 && (
                    <Badge className={`text-xs ${getOccupancyColor(day.occupancyRate)}`}>
                      {Math.round(day.occupancyRate * 100)}%
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {day.bookings.slice(0, 3).map((booking) => (
                    <Dialog key={booking.id}>
                      <DialogTrigger asChild>
                        <div
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                            getBookingTypeColor(booking.isWholeProperty)
                          }`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`}></div>
                            <span className="truncate font-medium">
                              {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                            </span>
                          </div>
                          <div className="text-gray-600 text-xs">
                            {booking.isWholeProperty ? 'Whole House' : `${booking.roomIds.length} room(s)`}
                          </div>
                          <div className="text-gray-500 text-xs">
                            £{booking.totalPrice.toFixed(0)}
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
                                  <Badge className={`ml-2 ${getStatusBadgeColor(selectedBooking.status)}`}>
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
                                  : `Rooms: ${selectedBooking.roomNames?.join(', ') || selectedBooking.roomIds.join(', ')}`
                                }
                              </p>
                              {selectedBooking.propertyName && (
                                <p className="text-sm text-gray-600">Property: {selectedBooking.propertyName}</p>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Pricing</h4>
                              <p><strong>Base Price:</strong> £{selectedBooking.basePrice.toFixed(2)}</p>
                              <p><strong>Total Price:</strong> £{selectedBooking.totalPrice.toFixed(2)}</p>
                              {selectedBooking.addonNames && selectedBooking.addonNames.length > 0 && (
                                <p><strong>Add-ons:</strong> {selectedBooking.addonNames.join(', ')}</p>
                              )}
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
    </div>
  );
}