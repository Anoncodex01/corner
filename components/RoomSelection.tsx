'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Bed, Bath, Wifi, Tv, Coffee, Star, Check } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  bed_type: string;
  bathroom: string;
  base_price: number;
  images: string[];
  features: string[];
  is_active: boolean;
}

interface RoomSelectionProps {
  bookingData: {
    bookingType: string;
    selectedRooms: string[];
    guests: number;
  };
  updateBookingData: (updates: any) => void;
  rooms: Room[];
}

const animalThemes = [
  { id: 'lion', name: 'Lion', color: 'from-yellow-500 to-orange-600' },
  { id: 'elephant', name: 'Elephant', color: 'from-gray-500 to-gray-700' },
  { id: 'buffalo', name: 'Buffalo', color: 'from-amber-600 to-red-700' },
  { id: 'rhino', name: 'Rhino', color: 'from-slate-500 to-slate-700' },
  { id: 'leopard', name: 'Leopard', color: 'from-yellow-600 to-amber-800' },
];

export default function RoomSelection({ bookingData, updateBookingData, rooms }: RoomSelectionProps) {
  const handleBookingTypeChange = (value: string) => {
    updateBookingData({
      bookingType: value,
      selectedRooms: value === 'house' ? [] : bookingData.selectedRooms,
    });
  };

  const handleRoomSelection = (roomId: string, checked: boolean) => {
    const updatedRooms = checked
      ? [...bookingData.selectedRooms, roomId]
      : bookingData.selectedRooms.filter(id => id !== roomId);
    
    updateBookingData({
      selectedRooms: updatedRooms,
    });
  };

  const getTotalCapacity = () => {
    if (bookingData.bookingType === 'house') {
      return rooms.reduce((total, room) => total + room.capacity, 0);
    }
    return bookingData.selectedRooms.reduce((total, roomId) => {
      const room = rooms.find(r => r.id === roomId);
      return total + (room?.capacity || 0);
    }, 0);
  };

  const getTotalPrice = () => {
    if (bookingData.bookingType === 'house') {
      return 400; // Special whole house price
    }
    return bookingData.selectedRooms.reduce((total, roomId) => {
      const room = rooms.find(r => r.id === roomId);
      return total + (room?.base_price || 0);
    }, 0);
  };

  const getAnimalTheme = (roomName: string) => {
    const theme = animalThemes.find(t => roomName.toLowerCase().includes(t.name.toLowerCase()));
    return theme || animalThemes[0];
  };

  const activeRooms = rooms.filter(room => room.is_active);

  return (
    <div className="space-y-6">
      {/* Booking Type Selection */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Choose Your Stay</Label>
        <RadioGroup
          value={bookingData.bookingType}
          onValueChange={handleBookingTypeChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="room" id="room" />
            <Label htmlFor="room" className="flex-1 cursor-pointer">
              <div>
                <h3 className="font-semibold">Individual Rooms</h3>
                <p className="text-sm text-gray-600">Select specific themed rooms</p>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="house" id="house" />
            <Label htmlFor="house" className="flex-1 cursor-pointer">
              <div>
                <h3 className="font-semibold">Entire House</h3>
                <p className="text-sm text-gray-600">Book all {activeRooms.length} rooms (£400/night)</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Room Selection */}
      {bookingData.bookingType === 'room' && (
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Select Your Rooms</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeRooms.map((room) => {
              const theme = getAnimalTheme(room.name);
              return (
                <Card key={room.id} className={`overflow-hidden ${bookingData.selectedRooms.includes(room.id) ? 'ring-2 ring-terracotta-500' : ''}`}>
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      {room.images && room.images.length > 0 ? (
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Bed className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className={`absolute top-3 left-3 bg-gradient-to-r ${theme.color} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                      {theme.name}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <span className="text-terracotta-600 font-bold text-sm">£{room.base_price}</span>
                      <span className="text-gray-600 text-xs">/night</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                      </div>
                      <Checkbox
                        id={room.id}
                        checked={bookingData.selectedRooms.includes(room.id)}
                        onCheckedChange={(checked) => handleRoomSelection(room.id, checked as boolean)}
                        className="ml-2"
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Bed className="h-4 w-4 text-gray-500" />
                          <span>{room.bed_type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{room.capacity} guest{room.capacity > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Bath className="h-4 w-4 text-gray-500" />
                        <span className="capitalize">{room.bathroom} Bathroom</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {room.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{room.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">5.0</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        Available
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Whole House Preview */}
      {bookingData.bookingType === 'house' ? (
        <Card className="bg-gradient-to-r from-terracotta-50 to-orange-50 border-terracotta-200">
          <CardHeader>
            <CardTitle className="text-2xl font-playfair text-terracotta-800">
              Entire House Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-3">What's Included</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>All {activeRooms.length} themed rooms</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Exclusive use of the entire property</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Perfect for groups and events</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Private dining and entertainment areas</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3">Room Overview</h4>
                <div className="space-y-2">
                  {activeRooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between text-sm">
                      <span>{room.name}</span>
                      <span className="text-terracotta-600 font-medium">£{room.base_price}/night</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-3">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total Capacity</span>
                      <span>{getTotalCapacity()} guests</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-lg text-terracotta-600">
                      <span>Special Rate</span>
                      <span>£400/night</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}