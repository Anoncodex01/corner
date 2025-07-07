'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Search, Filter, Eye, Edit, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Booking } from '@/lib/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('bookings').select('*');
      if (error) {
        toast.error('Failed to load bookings');
        setBookings([]);
        setFilteredBookings([]);
      } else {
        // Map fields from snake_case to camelCase and ensure all fields are present
        const mapped = (data || []).map((b: any) => ({
          id: b.id,
          guestInfo: b.guest_info || { firstName: '', lastName: '', email: '', phone: '', specialRequests: '' },
          checkIn: b.check_in ? new Date(b.check_in) : new Date(),
          checkOut: b.check_out ? new Date(b.check_out) : new Date(),
          guests: b.guests ?? 1,
          status: b.status || 'pending',
          paymentStatus: b.payment_status || 'pending',
          totalPrice: b.total_price ?? 0,
          basePrice: b.base_price ?? 0,
          isWholeProperty: b.is_whole_property ?? false,
          roomIds: b.room_ids || [],
          addOns: b.add_ons || [],
          propertyId: b.property_id || '',
          source: b.source || 'direct',
          createdAt: b.created_at ? new Date(b.created_at) : new Date(),
          updatedAt: b.updated_at ? new Date(b.updated_at) : new Date(),
        }));
        setBookings(mapped);
        setFilteredBookings(mapped);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    // Fetch all rooms for mapping roomIds to names
    const fetchRooms = async () => {
      const { data, error } = await supabase.from('rooms').select('id, name');
      if (!error && data) setRooms(data);
    };
    fetchRooms();
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

  // Helper to get room names from roomIds
  const getRoomNames = (roomIds: string[]) => {
    if (!Array.isArray(roomIds) || rooms.length === 0) return 'N/A';
    const names = roomIds.map(id => {
      const room = rooms.find(r => r.id === id);
      return room ? room.name : id;
    });
    return names.join(', ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-gray-300 text-gray-700 border border-gray-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase.from('bookings').update({ status: newStatus as Booking['status'] }).eq('id', bookingId);
    if (error) {
      toast.error('Failed to update booking status');
      return;
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b));
    setFilteredBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b));
      toast.success(`Booking ${newStatus}`);
  };

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' as Booking['status'] }).eq('id', bookingId);
    if (error) {
      toast.error('Failed to cancel booking');
      return;
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as Booking['status'] } : b));
    setFilteredBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as Booking['status'] } : b));
      toast.success('Booking cancelled');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-16 w-full mb-4" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full mb-2" />
        ))}
      </div>
    );
  }

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
                <SelectItem value="blocked">Blocked</SelectItem>
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
                            {booking.status === 'blocked' ? 'Blocked (external iCal)' : (booking.guestInfo?.firstName || 'N/A') + ' ' + (booking.guestInfo?.lastName || '')}
                          </h3>
                          {booking.status !== 'blocked' && (
                            <p className="text-sm text-gray-600">{booking.guestInfo?.email || 'N/A'}</p>
                          )}
                          <p className="text-xs text-gray-500">ID: {booking.id}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status === 'blocked' ? 'Blocked' : booking.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Check-in:</span>
                          <p className="font-medium">
                            {booking.checkIn
                              ? (typeof booking.checkIn === 'string'
                                  ? new Date(booking.checkIn).toLocaleDateString()
                                  : booking.checkIn.toLocaleDateString())
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Check-out:</span>
                          <p className="font-medium">
                            {booking.checkOut
                              ? (typeof booking.checkOut === 'string'
                                  ? new Date(booking.checkOut).toLocaleDateString()
                                  : booking.checkOut.toLocaleDateString())
                              : 'N/A'}
                          </p>
                        </div>
                        {booking.status !== 'blocked' ? (
                          <>
                            <div>
                              <span className="text-gray-500">Guests:</span>
                              <p className="font-medium">{booking.guests}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Total:</span>
                              <p className="font-medium">£{typeof booking.totalPrice === 'number' ? booking.totalPrice.toFixed(2) : '0.00'}</p>
                            </div>
                          </>
                        ) : (
                          <div className="col-span-2">
                            <span className="text-gray-500">Source:</span>
                            <p className="font-medium">Blocked by iCal</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-gray-500 text-sm">Accommodation:</span>
                        <p className="text-sm">
                          {booking.isWholeProperty
                            ? 'Entire Property'
                            : `Rooms: ${getRoomNames(booking.roomIds)}`}
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
                                  <p><strong>Name:</strong> {(selectedBooking.guestInfo?.firstName || 'N/A')} {(selectedBooking.guestInfo?.lastName || '')}</p>
                                  <p><strong>Email:</strong> {selectedBooking.guestInfo?.email || 'N/A'}</p>
                                  <p><strong>Phone:</strong> {selectedBooking.guestInfo?.phone || 'N/A'}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Booking Details</h4>
                                  <p><strong>Check-in:</strong> {selectedBooking.checkIn
                                    ? (typeof selectedBooking.checkIn === 'string'
                                        ? new Date(selectedBooking.checkIn).toLocaleDateString()
                                        : selectedBooking.checkIn.toLocaleDateString())
                                    : 'N/A'}</p>
                                  <p><strong>Check-out:</strong> {selectedBooking.checkOut
                                    ? (typeof selectedBooking.checkOut === 'string'
                                        ? new Date(selectedBooking.checkOut).toLocaleDateString()
                                        : selectedBooking.checkOut.toLocaleDateString())
                                    : 'N/A'}</p>
                                  <p><strong>Guests:</strong> {selectedBooking.guests}</p>
                                  <p><strong>Status:</strong> <Badge className={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Badge></p>
                                </div>
                              </div>
                              
                              {selectedBooking.guestInfo?.specialRequests && (
                                <div>
                                  <h4 className="font-semibold mb-2">Special Requests</h4>
                                  <p className="text-gray-700">{selectedBooking.guestInfo.specialRequests}</p>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="font-semibold mb-2">Pricing</h4>
                                <p><strong>Base Price:</strong> £{typeof selectedBooking.basePrice === 'number' ? selectedBooking.basePrice.toFixed(2) : '0.00'}</p>
                                <p><strong>Total Price:</strong> £{typeof selectedBooking.totalPrice === 'number' ? selectedBooking.totalPrice.toFixed(2) : '0.00'}</p>
                              </div>
                              
                              {selectedBooking.addOns && Array.isArray(selectedBooking.addOns) && selectedBooking.addOns.length > 0 && (
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