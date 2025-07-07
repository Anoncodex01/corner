'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Star, ExternalLink, Utensils, Coffee } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const establishments = [
  {
    id: 'braunston-butcher',
    name: 'Braunston Butcher',
    type: 'Butcher & Deli',
    description: 'Award-winning local butcher offering premium meats, artisanal sausages, and gourmet ready meals. Perfect for stocking up on quality ingredients for your stay.',
    specialOffer: 'Breakfast Package Available',
    menuHighlights: [
      'Premium British beef and lamb',
      'Homemade sausages and bacon',
      'Fresh local produce',
      'Ready-to-cook meals',
      'Artisanal cheeses and preserves'
    ],
    address: 'High Street, Braunston',
    phone: '01788 890123',
    hours: 'Mon-Sat: 8:00-17:00, Sun: 9:00-13:00',
    distance: '2 minutes walk',
    image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.8,
    featured: true,
    category: 'Food Shopping'
  },
  {
    id: 'old-boat',
    name: 'The Old Boat',
    type: 'Traditional Pub',
    description: 'Historic canalside pub serving traditional British fare with a modern twist. Enjoy real ales and hearty meals while watching narrowboats navigate the locks.',
    menuHighlights: [
      'Traditional fish & chips',
      'Slow-cooked beef & ale pie',
      'Fresh canal-side dining',
      'Local real ales',
      'Sunday roast dinners'
    ],
    address: 'Canal Side, Braunston',
    phone: '01788 890234',
    hours: 'Daily: 12:00-23:00, Food: 12:00-21:00',
    distance: '3 minutes walk',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.6,
    featured: true,
    category: 'Dining'
  },
  {
    id: 'gongoozlers-rest',
    name: 'Gongoozlers Rest',
    type: 'Canal Café',
    description: 'Charming waterside café perfect for watching canal life go by. Specializes in homemade cakes, light lunches, and the best coffee in Braunston.',
    menuHighlights: [
      'Homemade cakes and pastries',
      'Artisan coffee and teas',
      'Light lunches and sandwiches',
      'Cream teas',
      'Vegan and gluten-free options'
    ],
    address: 'Marina, Braunston',
    phone: '01788 890345',
    hours: 'Daily: 8:00-17:00',
    distance: '5 minutes walk',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.7,
    featured: false,
    category: 'Café'
  },
  {
    id: 'admiral-nelson',
    name: 'Admiral Nelson',
    type: 'Village Pub',
    description: 'Cozy village pub with a warm atmosphere, serving classic pub food and an excellent selection of wines and spirits. Popular with locals and visitors alike.',
    menuHighlights: [
      'Classic pub favorites',
      'Seasonal specials',
      'Wine selection',
      'Bar snacks',
      'Live music weekends'
    ],
    address: 'Dark Lane, Braunston',
    phone: '01788 890456',
    hours: 'Mon-Thu: 17:00-23:00, Fri-Sun: 12:00-23:00',
    distance: '8 minutes walk',
    image: 'https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.4,
    featured: false,
    category: 'Dining'
  },
  {
    id: 'old-plough',
    name: 'The Old Plough',
    type: 'Country Pub',
    description: 'Traditional country pub offering hearty meals and a great selection of local ales. Features a beautiful beer garden perfect for summer dining.',
    menuHighlights: [
      'Traditional British cuisine',
      'Local ales and ciders',
      'Beer garden dining',
      'Sunday carvery',
      'Children\'s menu'
    ],
    address: 'Rugby Road, Braunston',
    phone: '01788 890567',
    hours: 'Daily: 12:00-23:00, Food: 12:00-21:00',
    distance: '10 minutes walk',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.5,
    featured: false,
    category: 'Dining'
  },
  {
    id: 'braunston-fish-chips',
    name: 'Braunston Fish & Chips',
    type: 'Takeaway',
    description: 'Award-winning fish and chip shop using fresh, locally-sourced fish and hand-cut chips. Perfect for a traditional British takeaway experience.',
    menuHighlights: [
      'Fresh cod and haddock',
      'Hand-cut chips',
      'Mushy peas and curry sauce',
      'Battered sausages',
      'Vegetarian options'
    ],
    address: 'High Street, Braunston',
    phone: '01788 890678',
    hours: 'Tue-Sat: 16:30-21:00, Sun: 16:30-20:00',
    distance: '4 minutes walk',
    image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.6,
    featured: false,
    category: 'Takeaway'
  },
  {
    id: 'boat-shop-cafe',
    name: 'The Boat Shop & Café',
    type: 'Marina Café',
    description: 'Unique combination of chandlery and café located at the marina. Great for boat supplies and a relaxing coffee while watching canal activity.',
    menuHighlights: [
      'Fresh coffee and teas',
      'Light snacks and sandwiches',
      'Ice creams',
      'Boat supplies',
      'Canal maps and guides'
    ],
    address: 'Braunston Marina',
    phone: '01788 890789',
    hours: 'Daily: 9:00-17:00',
    distance: '6 minutes walk',
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.3,
    featured: false,
    category: 'Café'
  },
  {
    id: 'spice-garden',
    name: 'Spice Garden',
    type: 'Indian Restaurant',
    description: 'Authentic Indian cuisine with a modern twist. Offering both traditional favorites and contemporary dishes, with excellent vegetarian and vegan options.',
    menuHighlights: [
      'Traditional curries',
      'Tandoori specialties',
      'Fresh naan breads',
      'Vegetarian and vegan dishes',
      'Takeaway available'
    ],
    address: 'Daventry Road, Braunston',
    phone: '01788 890890',
    hours: 'Daily: 17:00-23:00',
    distance: '12 minutes walk',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.5,
    featured: false,
    category: 'Dining'
  }
];

const categories = ['All', 'Dining', 'Café', 'Takeaway', 'Food Shopping'];

export default function FoodDrinkPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEstablishments = selectedCategory === 'All' 
    ? establishments 
    : establishments.filter(est => est.category === selectedCategory);

  const featuredEstablishments = establishments.filter(est => est.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-0 text-sm px-4 py-1.5 rounded-full">
              Local Dining Guide
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair mb-6">
              Food & Drink in Braunston
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Discover the best local restaurants, pubs, and cafés within walking distance of The Corner House
            </p>
          </div>
        </div>
      </section>
   

      {/* Featured Establishments */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              Featured Recommendations
            </h2>
            <p className="text-xl text-gray-600">
              Our top picks for dining and local specialties
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featuredEstablishments.map((establishment) => (
              <Card key={establishment.id} className="overflow-hidden card-hover">
                <div className="relative">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={establishment.image}
                      alt={establishment.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-terracotta-500 text-white">
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{establishment.rating}</span>
                    </div>
                  </div>
                  {establishment.specialOffer && (
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-ivy-500 text-white">
                        {establishment.specialOffer}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{establishment.name}</h3>
                      <p className="text-terracotta-600 font-medium">{establishment.type}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {establishment.distance}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {establishment.description}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{establishment.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{establishment.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{establishment.hours}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Menu Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {establishment.menuHighlights.slice(0, 3).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {establishment.menuHighlights.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{establishment.menuHighlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Special Breakfast Package Promotion */}
          <Card className="bg-gradient-to-r from-terracotta-50 to-ivy-50 border-terracotta-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-terracotta-500 text-white">
                    <Utensils className="h-3 w-3 mr-1" />
                    Special Offer
                  </Badge>
                  <h3 className="text-2xl font-bold font-playfair mb-4 text-terracotta-800">
                    Braunston Butcher Breakfast Package
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Start your day with a premium breakfast delivered fresh to your door. Our partnership with 
                    Braunston Butcher ensures you get the finest local ingredients including award-winning sausages, 
                    fresh bacon, free-range eggs, and artisanal bread.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-terracotta-500 rounded-full"></span>
                      <span className="text-sm">Premium local sausages and bacon</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-terracotta-500 rounded-full"></span>
                      <span className="text-sm">Fresh free-range eggs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-terracotta-500 rounded-full"></span>
                      <span className="text-sm">Artisanal bread and preserves</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-terracotta-500 rounded-full"></span>
                      <span className="text-sm">Delivered fresh daily</span>
                    </div>
                  </div>
                  <Button asChild className="btn-primary">
                    <Link href="/addons">
                      Add to Your Booking - £15
                    </Link>
                  </Button>
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600&h=450&fit=crop"
                    alt="Premium breakfast spread"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* All Establishments */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              All Local Establishments
            </h2>
            <p className="text-xl text-gray-600">
              Complete guide to dining and food options in Braunston
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "btn-primary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEstablishments.map((establishment) => (
              <Card key={establishment.id} className="overflow-hidden card-hover">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={establishment.image}
                      alt={establishment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-xs">
                      {establishment.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{establishment.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{establishment.name}</h3>
                      <p className="text-terracotta-600 text-sm font-medium">{establishment.type}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {establishment.distance}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">
                    {establishment.description}
                  </p>
                  
                  <div className="space-y-1 mb-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{establishment.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{establishment.hours}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {establishment.menuHighlights.slice(0, 2).map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {establishment.menuHighlights.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{establishment.menuHighlights.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-terracotta-600 to-ivy-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4">
            Enhance Your Culinary Experience
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Add our breakfast package or other dining add-ons to make your stay even more memorable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-terracotta-600 hover:bg-gray-100 font-semibold px-8 py-4">
              <Link href="/addons">
                <Coffee className="mr-2 h-5 w-5" />
                View Add-ons
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4">
              <Link href="/booking">
                <Utensils className="mr-2 h-5 w-5" />
                Book Your Stay
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}