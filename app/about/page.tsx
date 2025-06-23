import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Heart, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-r from-terracotta-600 to-ivy-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-0">
              Our Story
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair mb-6">
              About The Corner House
            </h1>
            <p className="text-xl sm:text-2xl opacity-90 leading-relaxed">
              A beautifully renovated 5-bedroom semi-detached house in the heart of Braunston, 
              where luxury meets character and every detail tells a story.
            </p>
          </div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-6 heading-gradient">
                Our Renovation Journey
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  The Corner House began as a charming but tired semi-detached property in Braunston, 
                  Daventry. What caught our eye wasn't just the building itself, but the stunning 
                  natural stone exterior and the beautiful ivy that had made itself at home on the walls.
                </p>
                <p>
                  Our renovation journey was guided by a simple principle: honor the property's 
                  natural character while creating a truly unique guest experience. Each of our 
                  five bedrooms was carefully designed around a different animal theme, complete 
                  with corresponding animal-themed key entry systems that add a touch of whimsy 
                  to your stay.
                </p>
                <p>
                  The terracotta tones of the stone exterior and the rich green of the ivy became 
                  our inspiration, creating a color palette that flows throughout the property 
                  and connects each themed room to the building's natural beauty.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="The Corner House exterior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-terracotta-500 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <Home className="h-8 w-8" />
                  <div>
                    <p className="text-2xl font-bold">2024</p>
                    <p className="text-sm opacity-90">Renovation Complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animal Themed Rooms Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              Our Five Themed Suites
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each room tells its own story through carefully curated animal themes, 
              from the majestic Lion Suite to the elegant Leopard Room.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Lion Suite',
                description: 'Our flagship room featuring golden accents and royal luxury.',
                image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                color: 'from-yellow-500 to-orange-600',
              },
              {
                name: 'Elephant Room',
                description: 'Spacious and serene with earthy tones and natural textures.',
                image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                color: 'from-gray-500 to-gray-700',
              },
              {
                name: 'Buffalo Room',
                description: 'Rustic charm meets modern comfort in warm, rich tones.',
                image: 'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                color: 'from-amber-600 to-red-700',
              },
              {
                name: 'Rhino Room',
                description: 'Contemporary design with strong, geometric patterns.',
                image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                color: 'from-slate-500 to-slate-700',
              },
              {
                name: 'Leopard Room',
                description: 'Elegant spotted patterns with sophisticated styling.',
                image: 'https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                color: 'from-yellow-600 to-amber-800',
              },
            ].map((room, index) => (
              <Card key={index} className="card-hover overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 left-4 bg-gradient-to-r ${room.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {room.name.split(' ')[0]}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                  <p className="text-gray-600">{room.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Amenities */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              Modern Amenities & Character Features
            </h2>
            <p className="text-xl text-gray-600">
              Every detail has been carefully considered for your comfort and enjoyment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Home,
                title: 'Unique Key System',
                description: 'Each room features an animal-themed electronic key system for added security and character.',
              },
              {
                icon: Heart,
                title: 'Luxury Comfort',
                description: 'Premium mattresses, high-thread-count linens, and luxury toiletries in every room.',
              },
              {
                icon: Award,
                title: 'Award-Winning Design',
                description: 'Our renovation has been recognized for its creative blend of character and modern luxury.',
              },
              {
                icon: Users,
                title: 'Flexible Booking',
                description: 'Book individual themed rooms or reserve the entire house for your group or event.',
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-terracotta-500 to-ivy-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* House Rules & Policies */}
      <section className="section-padding bg-gradient-to-r from-terracotta-50 to-ivy-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
                House Rules & Policies
              </h2>
              <p className="text-xl text-gray-600">
                To ensure all our guests have a wonderful stay, we ask that you respect our house rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-terracotta-700">Check-in & Check-out</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Check-in: 3:00 PM - 8:00 PM</li>
                    <li>• Check-out: 11:00 AM</li>
                    <li>• Late check-in available by arrangement</li>
                    <li>• Early check-in subject to availability</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-ivy-700">Guest Guidelines</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• No smoking anywhere on the property</li>
                    <li>• Quiet hours: 10:00 PM - 8:00 AM</li>
                    <li>• Maximum occupancy as stated per room</li>
                    <li>• Pets welcome with prior arrangement</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-terracotta-700">Cancellation Policy</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Free cancellation up to 48 hours before check-in</li>
                    <li>• 50% refund for cancellations within 48 hours</li>
                    <li>• No refund for no-shows</li>
                    <li>• Flexible policies during exceptional circumstances</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-ivy-700">What's Included</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Complimentary Wi-Fi throughout</li>
                    <li>• Welcome refreshments on arrival</li>
                    <li>• Free parking on-site</li>
                    <li>• Fresh towels and luxury toiletries</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}