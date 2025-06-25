'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, Tv, Coffee, Bath, Users, Bed } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

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

const animalThemes = [
  { id: 'lion', name: 'Lion', color: 'from-yellow-500 to-orange-600' },
  { id: 'elephant', name: 'Elephant', color: 'from-gray-500 to-gray-700' },
  { id: 'buffalo', name: 'Buffalo', color: 'from-amber-600 to-red-700' },
  { id: 'rhino', name: 'Rhino', color: 'from-slate-500 to-slate-700' },
  { id: 'leopard', name: 'Leopard', color: 'from-yellow-600 to-amber-800' },
];

const commonAmenities = [
  { icon: Wifi, label: 'Free Wi-Fi' },
  { icon: Tv, label: 'Smart TV' },
  { icon: Coffee, label: 'Tea/Coffee' },
  { icon: Bath, label: 'Premium Toiletries' },
];

export default function RoomPreview() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('is_active', true)
          .order('base_price', { ascending: false });

        if (error) {
          console.error('Error fetching rooms:', error);
          setRooms([]);
        } else {
          setRooms(data || []);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getAnimalTheme = (roomName: string) => {
    const theme = animalThemes.find(t => roomName.toLowerCase().includes(t.name.toLowerCase()));
    return theme || animalThemes[0];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        const theme = getAnimalTheme(room.name);
        return (
          <Card key={room.id} className="card-hover overflow-hidden group">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <span className="font-semibold">From £{room.base_price}</span> per night
                </div>
                <Button asChild size="sm" className="btn-primary">
                  <Link href={`/booking?room=${room.id}`}>
                    Book Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}