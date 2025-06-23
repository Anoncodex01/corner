'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Bed, Bath, Wifi, Tv, Coffee, Star } from 'lucide-react';

interface RoomSelectionProps {
  bookingData: {
    bookingType: string;
    selectedRooms: string[];
    guests: number;
  };
  updateBookingData: (updates: any) => void;
}

const rooms = [
  {
    id: 'lion-suite',
    name: 'Lion Suite',
    animal: 'Lion',
    description: 'Our flagship room featuring golden accents and royal luxury with a king-size bed.',
    image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 120,
    capacity: 2,
    bedType: 'King Bed',
    bathroom: 'Ensuite',
    features: ['Smart TV', 'Mini Fridge', 'Work Desk', 'Premium Toiletries'],
    color: 'from-yellow-500 to-orange-600',
    available: true,
  },
  {
    id: 'elephant-room',
    name: 'Elephant Room',
    animal: 'Elephant',
    description: 'Spacious and serene with earthy tones, natural textures, and comfortable queen bed.',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 100,
    capacity: 2,
    bedType: 'Queen Bed',
    bathroom: 'Ensuite',
    features: ['Smart TV', 'Tea Station', 'Reading Chair', 'Garden View'],
    color: 'from-gray-500 to-gray-700',
    available: true,
  },
  {
    id: 'buffalo-room',
    name: 'Buffalo Room',
    animal: 'Buffalo',
    description: 'Rustic charm meets modern comfort in warm, rich tones with double bed.',
    image: 'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 95,
    capacity: 2,
    bedType: 'Double Bed',
    bathroom: 'Shared',
    features: ['Smart TV', 'Storage Space', 'Reading Nook', 'Rustic Decor'],
    color: 'from-amber-600 to-red-700',
    available: true,
  },
  {
    id: 'rhino-room',
    name: 'Rhino Room',
    animal: 'Rhino',
    description: 'Contemporary design with strong, geometric patterns and single bed.',
    image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 90,
    capacity: 1,
    bedType: 'Single Bed',
    bathroom: 'Shared',
    features: ['Smart TV', 'Study Area', 'Built-in Wardrobe', 'Modern Design'],
    color: 'from-slate-500 to-slate-700',
    available: true,
  },
  {
    id: 'leopard-room',
    name: 'Leopard Room',
    animal: 'Leopard',
    description: 'Elegant spotted patterns with sophisticated styling and single bed.',
    image: 'https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 85,
    capacity: 1,
    bedType: 'Single Bed',
    bathroom: 'Shared',
    features: ['Smart TV', 'Vanity Area', 'Window Seat', 'Elegant Decor'],
    color: 'from-yellow-600 to-amber-800',
    available: true,
  },
];

export default function RoomSelection({ bookingData, updateBookingData }: RoomSelectionProps) {
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
      return total + (room?.price || 0);
    }, 0);
  };

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
                <p className="text-sm text-gray-600">Book all 5 rooms (£400/night)</p>
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
            {rooms.map((room) => (
              <Card key={room.id} className={`overflow-hidden ${bookingData.selectedRooms.includes(room.id) ? 'ring-2 ring-terracotta-500' : ''}`}>
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute top-3 left-3 bg-gradient-to-r ${room.color} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                    {room.animal}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-terracotta-600 font-bold text-sm">£{room.price}</span>
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
                        <span>{room.bedType}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{room.capacity} guest{room.capacity > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Bath className="h-4 w-4 text-gray-500" />
                      <span>{room.bathroom} Bathroom</span>
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
                    <span className={`text-sm font-semibold ${room.available ? 'text-green-600' : 'text-red-600'}`}>
                      {room.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Whole House Preview */}
      {bookingData.bookingType === 'house' && (
        <Card className="border-2 border-terracotta-200 bg-terracotta-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Entire House Booking</span>
              <Badge className="bg-terracotta-500 text-white">Premium</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">What's Included:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• All 5 themed animal rooms</li>
                  <li>• Exclusive use of entire property</li>
                  <li>• All bathrooms and common areas</li>
                  <li>• Private parking spaces</li>
                  <li>• Welcome drinks package included</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Perfect For:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Large family gatherings</li>
                  <li>• Group celebrations</li>
                  <li>• Corporate retreats</li>
                  <li>• Special occasions</li>
                  <li>• Extended stays</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Capacity:</span>
                <span>{getTotalCapacity()} guests</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Special House Rate:</span>
                <span className="text-terracotta-600 font-bold">£400/night</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {(bookingData.bookingType === 'room' && bookingData.selectedRooms.length > 0) || bookingData.bookingType === 'house' ? (
        <Card className="bg-ivy-50 border-ivy-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-ivy-800 mb-2">Selection Summary</h3>
            <div className="space-y-1 text-sm text-ivy-700">
              <div className="flex justify-between">
                <span>Accommodation:</span>
                <span className="font-medium">
                  {bookingData.bookingType === 'house' 
                    ? 'Entire House' 
                    : `${bookingData.selectedRooms.length} Room${bookingData.selectedRooms.length > 1 ? 's' : ''}`
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Capacity:</span>
                <span className="font-medium">{getTotalCapacity()} guests</span>
              </div>
              <div className="flex justify-between">
                <span>Requested Guests:</span>
                <span className={`font-medium ${bookingData.guests > getTotalCapacity() ? 'text-red-600' : ''}`}>
                  {bookingData.guests} guests
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-ivy-200 pt-2 mt-2">
                <span>Total per night:</span>
                <span className="text-ivy-800">£{getTotalPrice()}</span>
              </div>
            </div>
            {bookingData.guests > getTotalCapacity() && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                ⚠️ Your selection accommodates {getTotalCapacity()} guests, but you've requested {bookingData.guests}. Please adjust your selection.
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}