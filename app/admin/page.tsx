"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Home, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { bookingService } from '@/lib/booking-service';
import { Booking, Property } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { calendarService } from '@/lib/calendar-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    avgBookingValue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setIsAuthenticated(true);
      } else {
        router.replace('/admin-login');
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    async function fetchStats() {
      // Get stats for current month
      const now = new Date();
      const monthStats = await calendarService.getMonthStats(now.getFullYear(), now.getMonth() + 1);
      setStats({
        totalBookings: monthStats.totalBookings,
        confirmedBookings: monthStats.confirmedBookings,
        pendingBookings: monthStats.pendingBookings,
        totalRevenue: monthStats.totalRevenue,
        occupancyRate: Math.round((monthStats.occupancyRate || 0) * 100),
        avgBookingValue: monthStats.avgBookingValue,
      });
      // Optionally, fetch all bookings/properties as before
      const allBookings = bookingService.getBookings();
      setBookings(allBookings);
      setProperties(bookingService.getProperties());
      setLoading(false);
    }
    fetchStats();
    // Fetch 5 most recent bookings
    async function fetchRecent() {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('check_in', { ascending: false })
        .limit(5);
      setRecentBookings(data || []);
    }
    fetchRecent();
    // Fetch all rooms for mapping room_ids to names
    async function fetchRooms() {
      const { data } = await supabase.from('rooms').select('id, name');
      setRooms(data || []);
    }
    fetchRooms();
  }, [isAuthenticated]);

  if (checkingAuth) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>;
  }
  if (!isAuthenticated) {
    return null;
  }
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-1/4 mt-8 mb-2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get room names from room_ids
  const getRoomNames = (roomIds: string[]) => {
    if (!Array.isArray(roomIds) || rooms.length === 0) return 'N/A';
    const names = roomIds.map(id => {
      const room = rooms.find((r: any) => r.id === id);
      return room ? room.name : id;
    });
    return names.join(', ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your booking system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.confirmedBookings} confirmed, {stats.pendingBookings} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">
              Active properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: £{stats.avgBookingValue.toFixed(2)} per booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Current month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookings yet</p>
            </div>
          ) : (
            <ul className="divide-y">
              {recentBookings.map(b => (
                <li key={b.id} className="py-2 flex justify-between items-center">
                  <span>{b.guest_info?.firstName} {b.guest_info?.lastName}</span>
                  <span>{b.check_in} - {b.check_out}</span>
                  <span>{b.is_whole_property ? 'Whole House' : getRoomNames(b.room_ids)}</span>
                  <span>£{b.total_price}</span>
                  <span>{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Analytics Section */}
      
    </div>
  );
}