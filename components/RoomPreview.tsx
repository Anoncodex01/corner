'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, Tv, Coffee, Bath, Users, Bed } from 'lucide-react';
import Link from 'next/link';

const rooms = [
  {
    id: 'lion-suite',
    name: 'Lion Suite',
    animal: 'Lion',
    description: 'The majestic Lion Suite features a king-size bed, luxury ensuite, and golden accents throughout.',
    image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 120,
    capacity: 2,
    features: ['King Bed', 'Ensuite Bathroom', 'Smart TV', 'Mini Fridge'],
    color: 'from-yellow-500 to-orange-600',
  },
  {
    id: 'elephant-room',
    name: 'Elephant Room',
    animal: 'Elephant',
    description: 'Spacious and comfortable, the Elephant Room offers a peaceful retreat with earthy tones.',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 100,
    capacity: 2,
    features: ['Queen Bed', 'Ensuite Bathroom', 'Work Desk', 'Tea Station'],
    color: 'from-gray-500 to-gray-700',
  },
  {
    id: 'buffalo-room',
    name: 'Buffalo Room',
    animal: 'Buffalo',
    description: 'Rustic charm meets modern comfort in the Buffalo Room with rich, warm textures.',
    image: 'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 95,
    capacity: 2,
    features: ['Double Bed', 'Shared Bathroom', 'Reading Nook', 'Storage Space'],
    color: 'from-amber-600 to-red-700',
  },
  {
    id: 'rhino-room',
    name: 'Rhino Room',
    animal: 'Rhino',
    description: 'Strong and sturdy design characterizes the Rhino Room with contemporary fixtures.',
    image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 90,
    capacity: 1,
    features: ['Single Bed', 'Shared Bathroom', 'Study Area', 'Built-in Wardrobe'],
    color: 'from-slate-500 to-slate-700',
  },
  {
    id: 'leopard-room',
    name: 'Leopard Room',
    animal: 'Leopard',
    description: 'Elegant and stylish, the Leopard Room features spotted patterns and modern amenities.',
    image: 'https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    price: 85,
    capacity: 1,
    features: ['Single Bed', 'Shared Bathroom', 'Vanity Area', 'Window Seat'],
    color: 'from-yellow-600 to-amber-800',
  },
];

const commonAmenities = [
  { icon: Wifi, label: 'Free Wi-Fi' },
  { icon: Tv, label: 'Smart TV' },
  { icon: Coffee, label: 'Tea/Coffee' },
  { icon: Bath, label: 'Premium Toiletries' },
];

export default function RoomPreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room) => (
        <Card key={room.id} className="card-hover overflow-hidden group">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className={`absolute top-4 left-4 bg-gradient-to-r ${room.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
              {room.animal}
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span className="text-terracotta-600 font-bold">£{room.price}</span>
              <span className="text-gray-600 text-sm">/night</span>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
              <div className="flex items-center space-x-1 text-gray-600">
                <Users className="h-4 w-4" />
                <span className="text-sm">{room.capacity} guest{room.capacity > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {room.description}
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex flex-wrap gap-2">
                {room.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-gray-500">
                {commonAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <amenity.icon className="h-3 w-3" />
                    <span className="text-xs">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">From £{room.price}</span> per night
              </div>
              <Button asChild size="sm" className="btn-primary">
                <Link href={`/booking?room=${room.id}`}>
                  Book Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}