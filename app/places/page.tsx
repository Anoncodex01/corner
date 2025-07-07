'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Car, Train, Star, ExternalLink, Camera, Castle, Waves } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const attractions = [
  {
    id: 'braunston-marina',
    name: 'Braunston Marina',
    type: 'Marina & Canal Junction',
    description: 'Historic canal junction where the Grand Union and Oxford canals meet. Watch narrowboats navigate the locks and explore the charming marina village.',
    distance: '2 minutes walk',
    driveTime: null,
    highlights: [
      'Historic canal junction',
      'Narrowboat watching',
      'Marina shops and cafés',
      'Canal walks',
      'Boat hire available'
    ],
    transportation: ['Walking'],
    image: 'https://images.pexels.com/photos/2351649/pexels-photo-2351649.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.6,
    category: 'Local',
    featured: true,
    website: 'https://braunstonmarina.co.uk',
    openingHours: 'Daily: 24 hours (Marina), Shops: 9:00-17:00'
  },
  {
    id: 'narrowboat-escapes',
    name: 'Narrowboat Escapes',
    type: 'Boat Hire Service',
    description: 'Experience the canals from the water with narrowboat hire. Perfect for day trips or longer canal holidays exploring the beautiful Warwickshire countryside.',
    distance: '3 minutes walk',
    driveTime: null,
    highlights: [
      'Day boat hire',
      'Weekly holidays',
      'Fully equipped boats',
      'Canal tuition available',
      'Pet-friendly options'
    ],
    transportation: ['Walking'],
    image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.8,
    category: 'Local',
    featured: true,
    website: 'https://narrowboatescapes.co.uk',
    openingHours: 'Daily: 9:00-17:00'
  },
  {
    id: 'serendipity-art',
    name: 'Serendipity Art Shop',
    type: 'Art Gallery & Shop',
    description: 'Unique art gallery featuring local artists and craftspeople. Browse original paintings, ceramics, jewelry, and handmade gifts in this charming canal-side location.',
    distance: '5 minutes walk',
    driveTime: null,
    highlights: [
      'Local artist works',
      'Handmade crafts',
      'Unique gifts',
      'Canal-side location',
      'Regular exhibitions'
    ],
    transportation: ['Walking'],
    image: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.5,
    category: 'Local',
    featured: false,
    openingHours: 'Tue-Sun: 10:00-17:00'
  },
  {
    id: 'rugby-station',
    name: 'Rugby Railway Station',
    type: 'Transport Hub',
    description: 'Major railway station with direct connections to London, Birmingham, and other major cities. Perfect for day trips or onward travel.',
    distance: '15 minutes drive',
    driveTime: '15 mins',
    highlights: [
      'Direct London trains',
      'Birmingham connections',
      'Frequent services',
      'Parking available',
      'Taxi services'
    ],
    transportation: ['Car', 'Taxi', 'Bus'],
    image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.2,
    category: 'Transport',
    featured: false,
    openingHours: 'Daily: 5:00-23:00'
  },
  {
    id: 'draycote-water',
    name: 'Draycote Water Country Park',
    type: 'Country Park & Reservoir',
    description: 'Beautiful reservoir and country park offering walking trails, cycling paths, fishing, and water sports. Perfect for outdoor enthusiasts and nature lovers.',
    distance: '20 minutes drive',
    driveTime: '20 mins',
    highlights: [
      'Scenic walking trails',
      'Cycling paths',
      'Fishing opportunities',
      'Water sports',
      'Wildlife watching'
    ],
    transportation: ['Car'],
    image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.7,
    category: 'Nature',
    featured: true,
    website: 'https://draycotewater.co.uk',
    openingHours: 'Daily: 8:00-sunset'
  },
  {
    id: 'whilton-mill',
    name: 'Whilton Mill',
    type: 'Garden Centre & Café',
    description: 'Award-winning garden centre with beautiful displays, plant nursery, and excellent café. Great for garden enthusiasts and families.',
    distance: '25 minutes drive',
    driveTime: '25 mins',
    highlights: [
      'Award-winning displays',
      'Plant nursery',
      'Garden café',
      'Gift shop',
      'Seasonal events'
    ],
    transportation: ['Car'],
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.6,
    category: 'Shopping',
    featured: false,
    website: 'https://whiltonmill.co.uk',
    openingHours: 'Daily: 9:00-17:00'
  },
  {
    id: 'stratford-upon-avon',
    name: 'Stratford-upon-Avon',
    type: 'Historic Market Town',
    description: 'Shakespeare\'s birthplace and one of England\'s most famous historic towns. Explore Tudor buildings, world-class theatre, and charming riverside walks.',
    distance: '45 minutes drive',
    driveTime: '45 mins',
    highlights: [
      'Shakespeare\'s birthplace',
      'Royal Shakespeare Company',
      'Historic Tudor buildings',
      'River Avon walks',
      'Shopping and dining'
    ],
    transportation: ['Car', 'Train'],
    image: 'https://images.pexels.com/photos/2363807/pexels-photo-2363807.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.8,
    category: 'Historic',
    featured: true,
    website: 'https://shakespeare-country.co.uk',
    openingHours: 'Varies by attraction'
  },
  {
    id: 'warwick-castle',
    name: 'Warwick Castle',
    type: 'Medieval Castle',
    description: 'One of England\'s finest medieval castles with over 1,000 years of history. Experience live shows, explore dungeons, and enjoy spectacular grounds.',
    distance: '50 minutes drive',
    driveTime: '50 mins',
    highlights: [
      '1,000 years of history',
      'Medieval architecture',
      'Live historical shows',
      'Castle dungeons',
      'Beautiful grounds'
    ],
    transportation: ['Car', 'Train + Bus'],
    image: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.7,
    category: 'Historic',
    featured: true,
    website: 'https://warwick-castle.com',
    openingHours: 'Daily: 10:00-17:00 (seasonal variations)'
  },
  {
    id: 'kenilworth-castle',
    name: 'Kenilworth Castle',
    type: 'Ruined Medieval Castle',
    description: 'Magnificent ruined castle with Elizabethan garden. Explore the romantic ruins and learn about its fascinating history including connections to Elizabeth I.',
    distance: '40 minutes drive',
    driveTime: '40 mins',
    highlights: [
      'Medieval ruins',
      'Elizabethan garden',
      'Historical exhibitions',
      'Audio tours',
      'Family activities'
    ],
    transportation: ['Car'],
    image: 'https://images.pexels.com/photos/1583340/pexels-photo-1583340.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.5,
    category: 'Historic',
    featured: false,
    website: 'https://english-heritage.org.uk',
    openingHours: 'Daily: 10:00-17:00 (seasonal variations)'
  },
  {
    id: 'silverstone-circuit',
    name: 'Silverstone Circuit',
    type: 'Racing Circuit',
    description: 'Home of the British Grand Prix and legendary motorsport venue. Experience driving experiences, museum visits, and behind-the-scenes tours.',
    distance: '35 minutes drive',
    driveTime: '35 mins',
    highlights: [
      'British Grand Prix venue',
      'Driving experiences',
      'Silverstone Museum',
      'Circuit tours',
      'Motorsport events'
    ],
    transportation: ['Car'],
    image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    rating: 4.6,
    category: 'Entertainment',
    featured: false,
    website: 'https://silverstone.co.uk',
    openingHours: 'Varies by event/experience'
  }
];

const categories = ['All', 'Local', 'Historic', 'Nature', 'Entertainment', 'Shopping', 'Transport'];

export default function PlacesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAttractions = selectedCategory === 'All' 
    ? attractions 
    : attractions.filter(attr => attr.category === selectedCategory);

  const featuredAttractions = attractions.filter(attr => attr.featured);
  const localAttractions = attractions.filter(attr => attr.category === 'Local');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-0 text-sm px-4 py-1.5 rounded-full">
              Explore the Area
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair mb-6">
              Places of Interest
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Discover amazing attractions, historic sites, and natural beauty around Braunston
            </p>
          </div>
        </div>
      </section>
    

      {/* Local Attractions - Walking Distance */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              On Your Doorstep
            </h2>
            <p className="text-xl text-gray-600">
              Attractions within walking distance of The Corner House
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {localAttractions.map((attraction) => (
              <Card key={attraction.id} className="overflow-hidden card-hover">
                <div className="relative">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-ivy-500 text-white">
                      Walking Distance
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{attraction.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{attraction.name}</h3>
                      <p className="text-terracotta-600 font-medium">{attraction.type}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {attraction.distance}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {attraction.description}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{attraction.openingHours}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Car className="h-4 w-4" />
                      <span>{attraction.transportation.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {attraction.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {attraction.highlights.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{attraction.highlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {attraction.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={attraction.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Attractions */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              Must-Visit Attractions
            </h2>
            <p className="text-xl text-gray-600">
              Top-rated destinations within driving distance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredAttractions.filter(attr => attr.category !== 'Local').map((attraction) => (
              <Card key={attraction.id} className="overflow-hidden card-hover">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-terracotta-500 text-white text-xs">
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{attraction.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{attraction.name}</h3>
                      <p className="text-terracotta-600 text-sm font-medium">{attraction.type}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {attraction.driveTime}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">
                    {attraction.description}
                  </p>
                  
                  <div className="space-y-1 mb-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{attraction.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="h-3 w-3" />
                      <span>{attraction.transportation.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {attraction.highlights.slice(0, 2).map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                    {attraction.highlights.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{attraction.highlights.length - 2}
                      </Badge>
                    )}
                  </div>

                  {attraction.website && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={attraction.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Learn More
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Attractions */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              All Attractions
            </h2>
            <p className="text-xl text-gray-600">
              Complete guide to places of interest around Braunston
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAttractions.map((attraction) => (
              <Card key={attraction.id} className="overflow-hidden card-hover">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {attraction.category}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1 py-0.5 rounded">
                    <div className="flex items-center space-x-1">
                      <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{attraction.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{attraction.name}</h3>
                    <Badge variant="outline" className="text-xs ml-1">
                      {attraction.driveTime || attraction.distance}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-terracotta-600 font-medium mb-2">{attraction.type}</p>
                  
                  <p className="text-gray-600 mb-2 text-xs leading-relaxed line-clamp-2">
                    {attraction.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {attraction.highlights.slice(0, 2).map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transportation Guide */}
      <section className="section-padding bg-gradient-to-r from-terracotta-50 to-ivy-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
                Getting Around
              </h2>
              <p className="text-xl text-gray-600">
                Transportation options for exploring the area
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">By Car</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Free parking available at The Corner House. Most attractions accessible within 30-60 minutes drive.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Free on-site parking</li>
                    <li>• M1 Junction 18 nearby</li>
                    <li>• Sat nav friendly</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-ivy-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Train className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">By Train</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Rugby Station (15 mins drive) offers direct connections to London, Birmingham, and beyond.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• London in 1 hour</li>
                    <li>• Birmingham 45 mins</li>
                    <li>• Taxi service available</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Waves className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">By Canal</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Unique way to explore with narrowboat hire from Braunston Marina, just 2 minutes walk away.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Day boat hire</li>
                    <li>• Weekly holidays</li>
                    <li>• Tuition available</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-terracotta-600 to-ivy-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4">
            Ready to Explore?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Book your stay at The Corner House and discover all these amazing attractions on your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-terracotta-600 hover:bg-gray-100 font-semibold px-8 py-4">
              <Link href="/booking">
                <Camera className="mr-2 h-5 w-5" />
                Book Your Stay
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4">
              <Link href="/contact">
                <MapPin className="mr-2 h-5 w-5" />
                Get Directions
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}