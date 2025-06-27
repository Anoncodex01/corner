'use client';

import Link from 'next/link';
import { Calendar, Users, MapPin, Star, ChevronRight, Wifi, Car, Coffee, Bath, Tv, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookingWidget from '@/components/BookingWidget';
import RoomPreview from '@/components/RoomPreview';

const features = [
  { icon: Wifi, title: 'Free Wi-Fi', description: 'High-speed internet throughout' },
  { icon: Car, title: 'Free Parking', description: 'Dedicated parking spaces' },
  { icon: Coffee, title: 'Welcome Drinks', description: 'Complimentary refreshments' },
  { icon: Bath, title: 'Luxury Bathrooms', description: 'Premium fixtures & amenities' },
  { icon: Tv, title: 'Smart TVs', description: 'Entertainment in every room' },
  { icon: Shield, title: 'Secure Entry', description: 'Animal-themed key system' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'London',
    rating: 5,
    comment: 'Absolutely stunning property! The Lion Suite was magnificent and the location perfect for exploring the countryside.',
  },
  {
    name: 'Michael Thompson',
    location: 'Birmingham',
    rating: 5,
    comment: 'Booked the entire house for a family gathering. Exceeded all expectations with beautiful rooms and excellent service.',
  },
  {
    name: 'Emma Wilson',
    location: 'Manchester',
    rating: 5,
    comment: 'The attention to detail is incredible. Each animal-themed room tells its own story. Will definitely return!',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url("/images/1.jpg")',
          }}
        />
        <div className="relative z-10 container text-center text-white">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <Badge className="mb-6 bg-brand-primary-500/90 text-white border-0 text-sm px-4 py-1.5 rounded-full shadow-lg">
              Luxury Accommodation in Braunston
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold font-playfair mb-6 leading-tight drop-shadow-lg">
              Welcome to
              <span className="block text-brand-primary-200">The Corner House</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-95 drop-shadow-md">
              A beautifully renovated 5-bedroom property featuring unique animal-themed suites in the heart of Braunston, Daventry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="btn-primary rounded-full text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Your Stay
                </Link>
              </Button>
              <Button asChild variant="outline-white" size="lg" className="rounded-full text-lg px-8 py-4">
                <Link href="/about">
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Quick Booking Widget */}
      <section className="relative -mt-24 z-20">
        <div className="container">
          <BookingWidget />
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-b from-white to-brand-primary-50/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              Why Choose The Corner House?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience luxury accommodation with modern amenities and unique character in every detail.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden rounded-xl border border-brand-primary-100/80 bg-white/50 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-brand-primary-200 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50 opacity-0 transition-opacity duration-500 group-hover:opacity-20"></div>
                <div className="relative">
                  <div className="mb-4">
                    <feature.icon className="h-8 w-8 text-brand-primary-600 transition-colors duration-300 group-hover:text-brand-primary-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 font-playfair">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Room Preview Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              Our Themed Suites
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our five uniquely designed animal-themed rooms, each offering luxury and character.
            </p>
          </div>
          
          <RoomPreview />
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="btn-secondary">
              <Link href="/booking">
                View All Rooms & Book
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location Highlights */}
      <section className="section-padding bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-6 heading-gradient">
                Perfect Location in Braunston
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Discover the charm of Braunston village with its historic marina, excellent dining, and proximity to major attractions.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-brand-primary-500" />
                  <span>2 minutes walk to Braunston Marina</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-brand-primary-500" />
                  <span>15 minutes to Daventry town center</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-brand-primary-500" />
                  <span>45 minutes to Stratford-upon-Avon</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-brand-primary-500" />
                  <span>1 hour to Warwick Castle</span>
                </div>
              </div>
              
              <Button asChild className="btn-primary">
                <Link href="/places">
                  Explore Local Attractions
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/3.jpeg"
                  alt="Braunston Marina"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">5.0 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-brand-primary-50/70">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              What Our Guests Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover why our guests love The Corner House experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardContent className="p-8 relative">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-brand-primary-400 fill-brand-primary-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 font-playfair text-lg italic leading-relaxed">"{testimonial.comment}"</p>
                  <div className="text-right">
                    <p className="font-bold text-brand-primary-800">{testimonial.name}</p>
                    <p className="text-sm text-brand-secondary-700 font-medium">{testimonial.location}</p>
                  </div>
                  <div className="absolute top-4 right-6 text-brand-primary-100 text-8xl font-serif opacity-80 z-0">
                    "
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="relative bg-cover bg-center" 
        style={{backgroundImage: 'url(/images/4.jpg)'}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary-900/80 via-brand-secondary-900/60 to-brand-primary-900/40"></div>
        <div className="relative container section-padding text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold font-playfair mb-4">
            Ready for an Unforgettable Stay?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Book your suite at The Corner House today and experience the perfect blend of luxury, character, and comfort in the heart of Braunston.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary rounded-full text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Stay
              </Link>
            </Button>
            <Button asChild variant="outline-white" size="lg" className="rounded-full text-lg px-8 py-4">
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}