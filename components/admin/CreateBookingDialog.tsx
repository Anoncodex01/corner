'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Users, Building, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { calendarService } from '@/lib/calendar-service';

interface CreateBookingDialogProps {
  onBookingCreated: () => void;
  trigger?: React.ReactNode;
}

export default function CreateBookingDialog({ onBookingCreated, trigger }: CreateBookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    propertyId: '',
    roomIds: [] as string[],
    isWholeProperty: false,
    checkIn: '',
    checkOut: '',
    guests: 1,
    guestInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: '',
    },
    addOns: [] as string[],
    basePrice: 0,
    totalPrice: 0,
    status: 'pending' as const,
    paymentStatus: 'pending' as const,
    source: 'direct' as const,
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      // Load properties
      const { data: props } = await supabase.from('properties').select('*');
      setProperties(props || []);
      
      // Load rooms
      const { data: roomsData } = await supabase.from('rooms').select('*');
      setRooms(roomsData || []);
      
      // Load addons
      const { data: addonsData } = await supabase.from('addons').select('*');
      setAddons(addonsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };

  const calculatePrice = () => {
    let basePrice = 0;
    
    // Calculate room prices
    if (formData.isWholeProperty) {
      basePrice = rooms.reduce((sum, room) => sum + (room.base_price || 0), 0);
    } else {
      basePrice = formData.roomIds.reduce((sum, roomId) => {
        const room = rooms.find(r => r.id === roomId);
        return sum + (room?.base_price || 0);
      }, 0);
    }
    
    // Calculate nights
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      basePrice *= nights;
    }
    
    // Add addon prices
    const addonPrice = formData.addOns.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    
    const totalPrice = basePrice + addonPrice;
    
    setFormData(prev => ({
      ...prev,
      basePrice,
      totalPrice,
    }));
  };

  useEffect(() => {
    calculatePrice();
  }, [formData.roomIds, formData.isWholeProperty, formData.checkIn, formData.checkOut, formData.addOns]);

  const handleSubmit = async () => {
    if (!formData.checkIn || !formData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    
    if (!formData.guestInfo.firstName || !formData.guestInfo.lastName || !formData.guestInfo.email) {
      toast.error('Please fill in guest information');
      return;
    }
    
    if (!formData.isWholeProperty && formData.roomIds.length === 0) {
      toast.error('Please select at least one room');
      return;
    }

    setLoading(true);
    try {
      // Check availability
      const isAvailable = await calendarService.checkAvailability(
        formData.roomIds,
        new Date(formData.checkIn),
        new Date(formData.checkOut)
      );
      
      if (!isAvailable) {
        toast.error('Selected rooms are not available for the chosen dates');
        return;
      }

      // Create booking
      const { error } = await supabase.from('bookings').insert([{
        property_id: formData.propertyId,
        room_ids: formData.roomIds,
        is_whole_property: formData.isWholeProperty,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        guests: formData.guests,
        guest_info: formData.guestInfo,
        add_ons: formData.addOns,
        base_price: formData.basePrice,
        total_price: formData.totalPrice,
        status: formData.status,
        payment_status: formData.paymentStatus,
        source: formData.source,
      }]);

      if (error) {
        console.error('Error creating booking:', error);
        toast.error('Failed to create booking');
        return;
      }

      toast.success('Booking created successfully');
      setIsOpen(false);
      resetForm();
      onBookingCreated();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: '',
      roomIds: [],
      isWholeProperty: false,
      checkIn: '',
      checkOut: '',
      guests: 1,
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
      },
      addOns: [],
      basePrice: 0,
      totalPrice: 0,
      status: 'pending',
      paymentStatus: 'pending',
      source: 'direct',
    });
  };

  const getAvailableRooms = () => {
    if (!formData.propertyId) return [];
    return rooms.filter(room => room.property_id === formData.propertyId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Booking
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property and Room Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property">Property</Label>
              <Select 
                value={formData.propertyId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value, roomIds: [] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isWholeProperty"
                checked={formData.isWholeProperty}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  isWholeProperty: checked as boolean,
                  roomIds: checked ? [] : prev.roomIds 
                }))}
              />
              <Label htmlFor="isWholeProperty">Book entire property</Label>
            </div>
          </div>

          {!formData.isWholeProperty && formData.propertyId && (
            <div>
              <Label>Select Rooms</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {getAvailableRooms().map(room => (
                  <div key={room.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={room.id}
                      checked={formData.roomIds.includes(room.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            roomIds: [...prev.roomIds, room.id] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            roomIds: prev.roomIds.filter(id => id !== room.id) 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={room.id} className="text-sm">
                      {room.name} - £{room.base_price}/night
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates and Guests */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in Date</Label>
              <Input
                type="date"
                id="checkIn"
                value={formData.checkIn}
                onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Input
                type="date"
                id="checkOut"
                value={formData.checkOut}
                onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                type="number"
                id="guests"
                min="1"
                value={formData.guests}
                onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          {/* Guest Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.guestInfo.firstName}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  guestInfo: { ...prev.guestInfo, firstName: e.target.value } 
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.guestInfo.lastName}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  guestInfo: { ...prev.guestInfo, lastName: e.target.value } 
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={formData.guestInfo.email}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  guestInfo: { ...prev.guestInfo, email: e.target.value } 
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.guestInfo.phone}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  guestInfo: { ...prev.guestInfo, phone: e.target.value } 
                }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={formData.guestInfo.specialRequests}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                guestInfo: { ...prev.guestInfo, specialRequests: e.target.value } 
              }))}
              placeholder="Any special requests or notes..."
            />
          </div>

          {/* Add-ons */}
          {addons.length > 0 && (
            <div>
              <Label>Add-ons</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {addons.map(addon => (
                  <div key={addon.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={addon.id}
                      checked={formData.addOns.includes(addon.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            addOns: [...prev.addOns, addon.id] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            addOns: prev.addOns.filter(id => id !== addon.id) 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={addon.id} className="text-sm">
                      {addon.name} - £{addon.price}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pricing Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>£{formData.basePrice.toFixed(2)}</span>
              </div>
              {formData.addOns.length > 0 && (
                <div className="flex justify-between">
                  <span>Add-ons:</span>
                  <span>£{(formData.totalPrice - formData.basePrice).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-1 flex justify-between font-semibold">
                <span>Total:</span>
                <span>£{formData.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Booking'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 