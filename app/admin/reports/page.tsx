'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [property, setProperty] = useState('');
  const [bookingType, setBookingType] = useState('all');
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch bookings with filters (placeholder logic)
    async function fetchBookings() {
      let query = supabase.from('bookings').select('*');
      if (startDate) query = query.gte('check_in', startDate);
      if (endDate) query = query.lte('check_out', endDate);
      if (property) query = query.eq('property_id', property);
      if (bookingType !== 'all') query = query.eq('is_whole_property', bookingType === 'house');
      const { data } = await query;
      setBookings(data || []);
    }
    fetchBookings();
    setLoading(false);
  }, [startDate, endDate, property, bookingType]);

  useEffect(() => {
    // Fetch all rooms for mapping room_ids to names
    async function fetchRooms() {
      const { data } = await supabase.from('rooms').select('id, name');
      setRooms(data || []);
    }
    fetchRooms();
  }, []);

  // Helper to get room names from room_ids
  const getRoomNames = (roomIds: string[]) => {
    if (!Array.isArray(roomIds) || rooms.length === 0) return 'N/A';
    const names = roomIds.map(id => {
      const room = rooms.find((r: any) => r.id === id);
      return room ? room.name : id;
    });
    return names.join(', ');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">View and export detailed booking analytics</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold mb-1">Start Date</label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">End Date</label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Booking Type</label>
              <Select value={bookingType} onValueChange={setBookingType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="room">Individual Room</SelectItem>
                  <SelectItem value="house">Entire House</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Add property filter if needed */}
            <Button className="btn-primary">Export CSV</Button>
            <Button className="btn-secondary">Export PDF</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bookings Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1">Guest</th>
                  <th className="px-2 py-1">Check-in</th>
                  <th className="px-2 py-1">Check-out</th>
                  <th className="px-2 py-1">Type</th>
                  <th className="px-2 py-1">Rooms</th>
                  <th className="px-2 py-1">Total</th>
                  <th className="px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="px-2 py-1">{b.guest_info?.firstName} {b.guest_info?.lastName}</td>
                    <td className="px-2 py-1">{b.check_in}</td>
                    <td className="px-2 py-1">{b.check_out}</td>
                    <td className="px-2 py-1">{b.is_whole_property ? 'Whole House' : 'Room(s)'}</td>
                    <td className="px-2 py-1">{b.is_whole_property ? '-' : getRoomNames(b.room_ids)}</td>
                    <td className="px-2 py-1">£{b.total_price}</td>
                    <td className="px-2 py-1">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 