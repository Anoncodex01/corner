'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Users, CreditCard, Shield, Check, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import BookingCalendar from '@/components/BookingCalendar';
import RoomSelection from '@/components/RoomSelection';
import EnhancedAddons from '@/components/EnhancedAddons';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';

// Update BookingData type for BookingCalendar usage
// If imported, override locally for this file
interface BookingDataForCalendar {
  checkIn: string;
  checkOut: string;
  guests: number;
  selectedRooms: string[];
  bookingType: string;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  
  // Helper function to parse date from string
  const parseDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const [bookingData, setBookingData] = useState(() => {
    const typeParam = searchParams.get('type') || 'room';
    // We'll check for room availability after rooms are loaded, but for now, default to 'room' if type is 'house'
    return {
      checkIn: parseDate(searchParams.get('checkIn')) ? parseDate(searchParams.get('checkIn'))!.toISOString() : '',
      checkOut: parseDate(searchParams.get('checkOut')) ? parseDate(searchParams.get('checkOut'))!.toISOString() : '',
      guests: parseInt(searchParams.get('guests') || '2'),
      bookingType: typeParam,
      selectedRooms: [] as string[],
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
      },
      addOns: (searchParams.get('addons')?.split(',') || []).filter(Boolean),
      totalPrice: 0,
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [priceRules, setPriceRules] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('rooms').select('*').then(({ data }) => setRooms(data || []));
    supabase.from('addons').select('*').then(({ data }) => setAddons(data || []));
    supabase.from('price_rules').select('*').then(({ data }) => setPriceRules(data || []));
  }, []);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setStep(5);
    }
  }, [searchParams]);

  // After rooms and unavailableRoomIds are loaded, if bookingType is 'house' but not all rooms are available, switch to 'room'
  useEffect(() => {
    if (
      bookingData.bookingType === 'house' &&
      rooms.length > 0 &&
      typeof window !== 'undefined'
    ) {
      // Find unavailableRoomIds logic (same as in RoomSelection)
      const propertyId = rooms[0]?.property_id || null;
      const checkIn = bookingData.checkIn ? new Date(bookingData.checkIn).toISOString().slice(0, 10) : '';
      const checkOut = bookingData.checkOut ? new Date(bookingData.checkOut).toISOString().slice(0, 10) : '';
      if (propertyId && checkIn && checkOut) {
        supabase
          .from('bookings')
          .select('room_ids, is_whole_property, check_in, check_out')
          .eq('property_id', propertyId)
          .or('status.eq.confirmed,status.eq.pending')
          .then(({ data: bookings }) => {
            let unavailable: string[] = [];
            const selectedCheckIn = new Date(checkIn);
            const selectedCheckOut = new Date(checkOut);
            for (const b of bookings || []) {
              const bCheckIn = new Date(b.check_in);
              const bCheckOut = new Date(b.check_out);
              const overlaps = bCheckIn <= selectedCheckOut && bCheckOut >= selectedCheckIn;
              if (overlaps) {
                let ids: string[] = [];
                if (Array.isArray(b.room_ids)) {
                  ids = b.room_ids;
                } else if (typeof b.room_ids === 'string') {
                  try {
                    ids = JSON.parse(b.room_ids);
                  } catch {
                    ids = b.room_ids.replace(/[{}\"]+/g, '').split(',').map(s => s.trim()).filter(Boolean);
                  }
                }
                const validRoomIds = ids.filter(id => rooms.some(r => r.id === id));
                unavailable.push(...validRoomIds);
              }
            }
            if (unavailable.length > 0) {
              setBookingData(prev => ({ ...prev, bookingType: 'room' }));
            }
          });
      }
    }
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.bookingType, rooms]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleStepNext = () => {
    if (step === 1 && (!bookingData.checkIn || !bookingData.checkOut)) {
      toast.error('Please select your check-in and check-out dates');
      return;
    }
    if (step === 2 && bookingData.bookingType === 'room' && bookingData.selectedRooms.length === 0) {
      toast.error('Please select at least one room');
      return;
    }
    setStep(step + 1);
  };

  const handleStepBack = () => {
    setStep(step - 1);
  };

  const handleBookingSubmit = async () => {
    setIsLoading(true);
    try {
      // Prepare selectedRooms and dates
      let selectedRooms = bookingData.selectedRooms;
      let propertyId = rooms.find(r => r.id === bookingData.selectedRooms[0])?.property_id || '';
      if (bookingData.bookingType === 'house') {
        // All room IDs for the property
        const allRooms = rooms.filter(r => r.property_id === propertyId);
        selectedRooms = allRooms.map(r => r.id);
      }
      const checkIn = bookingData.checkIn ? new Date(bookingData.checkIn).toISOString().slice(0, 10) : '';
      const checkOut = bookingData.checkOut ? new Date(bookingData.checkOut).toISOString().slice(0, 10) : '';
      const res = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: bookingData.totalPrice * 100, // Stripe expects amount in pence
          description: `Booking for ${bookingData.guestInfo.firstName} ${bookingData.guestInfo.lastName || ''}`.trim(),
          guestInfo: bookingData.guestInfo,
          bookingType: bookingData.bookingType,
          checkIn,
          checkOut,
          selectedRooms,
          addOns: bookingData.addOns,
          guests: bookingData.guests,
          totalPrice: bookingData.totalPrice,
          propertyId,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to start payment.');
      }
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingData = (updates: any) => {
    setBookingData(prev => {
      // Always store checkIn and checkOut as strings (or empty string)
      let updated = { ...prev, ...updates };
      if (updates.checkIn instanceof Date) {
        updated.checkIn = updates.checkIn.toISOString();
      } else if (updates.checkIn === null) {
        updated.checkIn = '';
      }
      if (updates.checkOut instanceof Date) {
        updated.checkOut = updates.checkOut.toISOString();
      } else if (updates.checkOut === null) {
        updated.checkOut = '';
      }
      // Calculate total price based on selected rooms and add-ons
      let totalPrice = 0;
      // Parse dates for calculation
      const checkInDate = updated.checkIn ? new Date(updated.checkIn) : null;
      const checkOutDate = updated.checkOut ? new Date(updated.checkOut) : null;
      const nights = checkInDate && checkOutDate 
        ? Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
        : 1;
      if (updated.bookingType === 'house') {
        // Special whole house price per night
        totalPrice = 400 * nights;
      } else if (updated.selectedRooms.length > 0) {
        // Calculate based on selected rooms
        const selectedRoomData = rooms.filter(room => updated.selectedRooms.includes(room.id));
        const roomPrice = selectedRoomData.reduce((total, room) => total + room.base_price, 0);
        totalPrice = roomPrice * nights;
      }
      // Add add-on prices
      const selectedAddons = addons.filter(addon => updated.addOns.includes(addon.id));
      const addonPrice = selectedAddons.reduce((total, addon) => total + getAddonPrice(addon, checkInDate), 0);
      totalPrice += addonPrice;
      return { ...updated, totalPrice };
    });
  };

  const handleAddonsChange = (addons: string[]) => {
    updateBookingData({ addOns: addons });
  };

  // Helper to get price rule for an addon
  const getAddonPrice = (addon: any, checkIn: Date | null) => {
    if (!addon) return 0;
    let price = addon.price || 0;
    if (!checkIn) return price;
    const today = checkIn;
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. 'Fri'
    const rules = priceRules.filter((rule: any) =>
      rule.addon_id === addon.id &&
      rule.is_active &&
      (!rule.start_date || new Date(rule.start_date) <= today) &&
      (!rule.end_date || new Date(rule.end_date) >= today) &&
      (!rule.days_of_week || rule.days_of_week.split(',').includes(dayOfWeek))
    );
    for (const rule of rules) {
      if (rule.modifier_type === 'percent') {
        price += price * (rule.price_modifier / 100);
      } else {
        price += rule.price_modifier;
      }
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-hero-pattern pb-24">
      {/* Progress Indicator */}
      <section className="py-6 bg-white/80 backdrop-blur-md border-b sticky top-20 z-30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: 'Dates', icon: Calendar },
                { step: 2, title: 'Rooms', icon: Users },
                { step: 3, title: 'Details', icon: CreditCard },
                { step: 4, title: 'Payment', icon: Shield },
              ].map((item, index) => {
                const isDone = step > item.step;
                const isActive = step === item.step;
                const isInactive = step < item.step;
                return (
                  <div key={item.step} className="flex items-center w-full">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                        ${isDone ? 'bg-brand-primary-500 text-white shadow-md' :
                          isActive ? 'bg-brand-primary-100 text-brand-primary-700 ring-2 ring-brand-primary-500' :
                          'bg-gray-200 text-gray-500'}
                      `}
                    >
                      {isDone ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <item.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className={`font-medium transition-colors ${
                        isDone ? 'text-brand-primary-700' :
                        isActive ? 'text-brand-primary-700' :
                        'text-gray-500'
                      }`}>
                        {item.title}
                      </p>
                    </div>
                    {index < 3 && (
                      <div className={`flex-1 h-1 mx-4 rounded-full ${
                        isDone ? 'bg-brand-primary-500' :
                        isActive ? 'bg-brand-primary-100' :
                        'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {step === 1 && (
                  <Card className="shadow-xl rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3 text-2xl font-playfair text-terracotta-800">
                        <Calendar className="h-6 w-6" />
                        <span>Select Your Dates</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BookingCalendar
                        bookingData={bookingData as BookingDataForCalendar}
                        updateBookingData={updateBookingData}
                      />
                    </CardContent>
                  </Card>
                )}

                {step === 2 && (
                  <Card className="shadow-xl rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3 text-2xl font-playfair text-terracotta-800">
                        <Users className="h-6 w-6" />
                        <span>Choose Your Accommodation</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RoomSelection
                        bookingData={bookingData}
                        updateBookingData={updateBookingData}
                        rooms={rooms}
                      />
                    </CardContent>
                  </Card>
                )}

                {step === 3 && (
                  <Card className="shadow-xl rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3 text-2xl font-playfair text-terracotta-800">
                        <CreditCard className="h-6 w-6" />
                        <span>Guest & Add-on Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-semibold mb-6 font-playfair">Guest Information</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input id="firstName" value={bookingData.guestInfo.firstName} onChange={(e) => updateBookingData({ guestInfo: {...bookingData.guestInfo, firstName: e.target.value }})} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input id="lastName" value={bookingData.guestInfo.lastName} onChange={(e) => updateBookingData({ guestInfo: {...bookingData.guestInfo, lastName: e.target.value }})} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input id="email" type="email" value={bookingData.guestInfo.email} onChange={(e) => updateBookingData({ guestInfo: {...bookingData.guestInfo, email: e.target.value }})} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input id="phone" type="tel" value={bookingData.guestInfo.phone} onChange={(e) => updateBookingData({ guestInfo: {...bookingData.guestInfo, phone: e.target.value }})} />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                              <Label htmlFor="specialRequests">Special Requests</Label>
                              <Textarea id="specialRequests" value={bookingData.guestInfo.specialRequests} onChange={(e) => updateBookingData({ guestInfo: {...bookingData.guestInfo, specialRequests: e.target.value }})} />
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-xl font-semibold mb-6 font-playfair">Enhance Your Stay</h3>
                          <EnhancedAddons
                            addons={addons}
                            selectedAddons={bookingData.addOns}
                            onAddonsChange={handleAddonsChange}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {step === 4 && (
                  <Card className="shadow-xl rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3 text-2xl font-playfair text-terracotta-800">
                        <Shield className="h-6 w-6" />
                        <span>Review & Pay</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Payment integration would go here.</p>
                      {/* Add payment form elements here */}
                      <Button
                        className="btn-primary mt-6"
                        disabled={isLoading}
                        onClick={handleBookingSubmit}
                      >
                        {isLoading ? 'Redirecting to Payment...' : 'Pay with Card'}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {step === 5 && (
                  <Card className="shadow-xl rounded-xl text-center p-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold font-playfair mb-4">Booking Confirmed!</h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for booking with The Corner House. A confirmation email with your booking details has been sent to your email address.
                    </p>
                    <Button asChild className="btn-primary">
                      <a href="/">Return to Homepage</a>
                    </Button>
                  </Card>
                )}
              </div>

              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-44 space-y-6">
                  <Card className="shadow-xl rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-playfair text-terracotta-800">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <img src="/images/3.jpeg" alt="The Corner House" className="rounded-lg mb-4" />
                        <h3 className="font-semibold text-terracotta-800">The Corner House</h3>
                        <p className="text-sm text-gray-500">Braunston, Daventry</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-terracotta-400 fill-terracotta-400" />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">5.0</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in:</span>
                          <span className="font-medium">{bookingData.checkIn ? format(bookingData.checkIn, 'd MMM, yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-out:</span>
                          <span className="font-medium">{bookingData.checkOut ? format(bookingData.checkOut, 'd MMM, yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Guests:</span>
                          <span className="font-medium">{bookingData.guests}</span>
                        </div>
                      </div>
                      
                      {/* Selected Rooms */}
                      <Separator />
                      <div className="space-y-1 text-sm">
                        <h4 className="font-medium text-gray-600">Room{bookingData.bookingType === 'room' && bookingData.selectedRooms.length > 1 ? 's' : ''}</h4>
                        {bookingData.bookingType === 'house' ? (
                          <div className="font-medium text-terracotta-700">Whole House</div>
                        ) : bookingData.selectedRooms.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {bookingData.selectedRooms.map(roomId => {
                              const room = rooms.find(r => r.id === roomId);
                              return (
                                <li key={roomId} className="text-terracotta-700 font-medium">{room ? room.name : roomId}</li>
                              );
                            })}
                          </ul>
                        ) : (
                          <div className="text-gray-400">No room selected</div>
                        )}
                      </div>

                      {/* Selected Add-ons */}
                      <Separator />
                      <div className="space-y-1 text-sm">
                        <h4 className="font-medium text-gray-600">Add-ons</h4>
                        {bookingData.addOns.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {bookingData.addOns.map(addOnId => {
                              const addOn = addons.find(a => a.id === addOnId);
                              return addOn ? (
                                <li key={addOn.id} className="flex justify-between">
                                  <span className="text-terracotta-700 font-medium">{addOn.name}</span>
                                  <span className="text-gray-600 font-semibold">+£{getAddonPrice(addOn, bookingData.checkIn ? new Date(bookingData.checkIn) : null)}</span>
                                </li>
                              ) : null;
                            })}
                          </ul>
                        ) : (
                          <div className="text-gray-400">No add-ons selected</div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <h4 className="font-medium text-gray-600">Total Price</h4>
                        <p className="text-3xl font-bold text-terracotta-800 font-playfair">
                          £{bookingData.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Prices include all taxes and fees.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Footer Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t z-40">
        <div className="container">
          <div className="max-w-6xl mx-auto py-3">
            <div className="flex justify-end">
              {step < 5 && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleStepBack}
                    disabled={step === 1}
                    className="w-28"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={step === 4 ? handleBookingSubmit : handleStepNext}
                    disabled={isLoading}
                    className="btn-primary w-28"
                  >
                    {isLoading ? 'Processing...' : (step >= 3 ? 'Confirm & Pay' : 'Next')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Booking() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}