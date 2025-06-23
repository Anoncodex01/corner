'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Search, Filter, Eye, Edit, X, Check } from 'lucide-react';
import { bookingService } from '@/lib/booking-service';
import { Booking } from '@/lib/types';
import { toast } from 'sonner';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const allBookings = bookingService.getBookings();
    setBookings(allBookings);
    setFilteredBookings(allBookings);
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.guestInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    const updated = bookingService.updateBooking(bookingId, { status: newStatus as any });
    if (updated) {
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
      toast.success(`Booking ${newStatus}`);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    const success = bookingService.cancelBooking(bookingId);
    if (success) {
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' as any } : b
      ));
      toast.success('Booking cancelled');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage all property bookings</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{booking.guestInfo.email}</p>
                          <p className="text-xs text-gray-500">ID: {booking.id}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Check-in:</span>
                          <p className="font-medium">{booking.checkIn.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Check-out:</span>
                          <p className="font-medium">{booking.checkOut.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Guests:</span>
                          <p className="font-medium">{booking.guests}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <p className="font-medium">£{booking.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-gray-500 text-sm">Accommodation:</span>
                        <p className="text-sm">
                          {booking.isWholeProperty 
                            ? 'Entire Property' 
                            : `Rooms: ${booking.roomIds.join(', ')}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
                                  <p><strong>Status:</strong> <Badge className={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Badge></p>
                                </div>
                              </div>
                              
                              {selectedBooking.guestInfo.specialRequests && (
                                <div>
                                  <h4 className="font-semibold mb-2">Special Requests</h4>
                                  <p className="text-gray-700">{selectedBooking.guestInfo.specialRequests}</p>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="font-semibold mb-2">Pricing</h4>
                                <p><strong>Base Price:</strong> £{selectedBooking.basePrice.toFixed(2)}</p>
                                <p><strong>Total Price:</strong> £{selectedBooking.totalPrice.toFixed(2)}</p>
                              </div>
                              
                              {selectedBooking.addOns.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Add-ons</h4>
                                  <ul className="list-disc list-inside">
                                    {selectedBooking.addOns.map((addon, index) => (
                                      <li key={index}>{addon}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}