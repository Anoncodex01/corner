'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, X, ShoppingCart, Star, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

const premiumSpirits = [
  {
    id: 'giraffe-gin',
    name: 'Giraffe Gin Mango & Passion Fruit',
    animal: 'Giraffe',
    size: '70cl',
    abv: '40%',
    price: 51.10,
    currency: 'US$',
    image: 'https://l.icdbcdn.com/oh/c37fa026-91c8-4eff-b2b0-6e08ca0535ff.png?w=400&h=400&mode=freesize',
    shortDescription: 'Embark on a vibrant journey with Giraffe Gin, where the lush tropical flavours of mango and passion fruit from Zanzibar meet the refined elegance of a premium London dry gin.',
    fullDescription: 'Crafted to perfection, this best gin captures the essence of the exotic savannah, bringing you the sweetness of ripe mangoes and the zesty kick of passion fruit for a delightful, refreshing experience.',
    features: [
      'Flavour Profile: A tropical burst of juicy mango and tangy passion fruit, perfectly balanced with the crispness of London Dry Gin',
      'Inspired By: The majestic Maasai giraffe, with its golden hues symbolizing elegance, grace, and adventure',
      'Perfect for summer cocktails, sipping neat, or gifting to those who appreciate bold, exotic flavours'
    ],
    color: 'from-yellow-500 to-orange-600',
    category: 'Premium Gin'
  },
  {
    id: 'hakuna-matata-gin',
    name: 'Hakuna Matata Gin Kiwi & Lemon',
    animal: 'Lion',
    size: '50cl',
    abv: '38%',
    price: 37.64,
    currency: 'US$',
    image: 'https://l.icdbcdn.com/oh/54389fc7-f1f2-4c6b-9422-ed64aa33e144.png?w=400&h=400&mode=freesize',
    shortDescription: 'Experience the refreshing taste of Hakuna Matata Gin, a delightful blend that embodies the true spirit of relaxation.',
    fullDescription: 'Infused with vibrant kiwi and zesty lemon, this lemon gin offers a perfect balance of sweet and sour flavours — inviting you to sit back, unwind, and enjoy life with no worries.',
    features: [
      'Flavour Profile: A refreshing combination of kiwi and lemon, delivering a smooth, stress-relieving taste',
      'Crafted to capture the essence of "Hakuna Matata", this gin is ideal for easy-going moments and carefree celebrations',
      'Perfect for tropical cocktails and relaxed evening sipping'
    ],
    color: 'from-green-500 to-lime-600',
    category: 'Craft Gin'
  },
  {
    id: 'rhino-rum',
    name: 'Rhino Rum Blackberry & Blueberry',
    animal: 'Rhino',
    size: '70cl',
    abv: '40%',
    price: 51.10,
    currency: 'US$',
    image: 'https://l.icdbcdn.com/oh/b15deb40-5361-4cb0-9172-459f18a1b74e.png?w=400&h=400&mode=freesize',
    shortDescription: 'Unleash the wild essence of the African savannah with Rhino Rum, a rich and robust creation from Serengeti Spirits.',
    fullDescription: 'Crafted from the finest Guyanese white rum and infused with succulent blackberries and blueberries from Tanzania, this spirit embodies strength, resilience, and adventure. With its striking deep purple hue, Rhino Rum stands as a tribute to the mighty African rhino – bold, powerful, and unforgettable.',
    features: [
      'Flavour Profile: A daring fusion of ripe blackberries and juicy blueberries, delivering a deep, fruity punch with a velvety smooth finish',
      'Inspired by: The indomitable spirit of the African rhino, a symbol of endurance and strength',
      'Perfect For: Sipping neat, over ice, or as the bold backbone of adventurous cocktails'
    ],
    color: 'from-purple-600 to-indigo-800',
    category: 'Premium Rum'
  }
];

const standardAddons = [
  {
    id: 'breakfast',
    name: 'Braunston Butcher Breakfast Package',
    price: 15,
    description: 'Local breakfast delivered fresh daily with premium ingredients from local suppliers',
    icon: '🍳',
    category: 'Food & Dining'
  },
  {
    id: 'welcome-drinks',
    name: 'Welcome Drinks Package',
    price: 25,
    description: 'Curated selection of local beverages including craft beers and artisanal sodas',
    icon: '🥂',
    category: 'Beverages'
  },
  {
    id: 'late-checkout',
    name: 'Late Check-out (2 PM)',
    price: 20,
    description: 'Extend your stay until 2 PM and enjoy a leisurely morning',
    icon: '🕐',
    category: 'Services'
  },
  {
    id: 'parking',
    name: 'Additional Parking Space',
    price: 5,
    description: 'Extra secure parking space per night for additional vehicles',
    icon: '🚗',
    category: 'Services'
  },
  {
    id: 'spa-package',
    name: 'Relaxation Spa Package',
    price: 85,
    description: 'In-room massage and wellness treatments by certified therapists',
    icon: '💆',
    category: 'Wellness'
  },
  {
    id: 'picnic-basket',
    name: 'Countryside Picnic Basket',
    price: 45,
    description: 'Gourmet picnic basket perfect for exploring the beautiful Braunston countryside',
    icon: '🧺',
    category: 'Food & Dining'
  }
];

export default function AddonsPage() {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedSpirit, setSelectedSpirit] = useState<typeof premiumSpirits[0] | null>(null);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getTotalPrice = () => {
    const standardTotal = selectedAddons.reduce((total, addonId) => {
      const addon = standardAddons.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);

    const spiritsTotal = selectedAddons.reduce((total, addonId) => {
      const spirit = premiumSpirits.find(s => s.id === addonId);
      return total + (spirit?.price || 0);
    }, 0);

    return standardTotal + spiritsTotal;
  };

  const groupedStandardAddons = standardAddons.reduce((acc, addon) => {
    if (!acc[addon.category]) {
      acc[addon.category] = [];
    }
    acc[addon.category].push(addon);
    return acc;
  }, {} as Record<string, typeof standardAddons>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-terracotta-600 to-ivy-600 text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-0">
              Enhance Your Stay
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4">
              Premium Add-ons
            </h1>
            <p className="text-xl opacity-90">
              Enjoy an exceptional stay by adding extras that make your visit truly memorable
            </p>
          </div>
        </div>
      </section>

      {/* Premium Spirits Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-terracotta-500" />
              <h2 className="text-3xl lg:text-4xl font-bold font-playfair heading-gradient">
                Premium Animal Spirits Collection
              </h2>
              <Sparkles className="h-6 w-6 text-ivy-500" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our exclusive collection of animal-themed premium spirits, perfectly curated to complement your themed room experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {premiumSpirits.map((spirit) => (
              <Card key={spirit.id} className="card-hover overflow-hidden group relative">
                <div className="absolute top-4 left-4 z-10">
                  <Badge className={`bg-gradient-to-r ${spirit.color} text-white border-0`}>
                    <Award className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg">
                    <span className="text-terracotta-600 font-bold">{spirit.currency}{spirit.price}</span>
                  </div>
                </div>
                
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                  <img
                    src={spirit.image}
                    alt={spirit.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{spirit.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{spirit.size}</span>
                      <span>{spirit.abv}</span>
                      <Badge variant="outline" className="text-xs">{spirit.category}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {spirit.shortDescription}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSpirit(spirit)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-playfair">{spirit.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center p-8">
                            <img
                              src={spirit.image}
                              alt={spirit.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold mb-2">{spirit.name}</h3>
                              <div className="text-2xl font-bold text-terracotta-600 mb-4">
                                {spirit.currency}{spirit.price}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {spirit.currency}{spirit.price} (price per quantity, per stay)
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-gray-700 mb-4">{spirit.fullDescription}</p>
                              
                              <h4 className="font-semibold mb-2">{spirit.category} Features:</h4>
                              <ul className="space-y-2">
                                {spirit.features.map((feature, index) => (
                                  <li key={index} className="text-sm text-gray-600">
                                    • {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex items-center space-x-2 pt-4 border-t">
                              <span className="text-sm text-gray-600">Bottle Size:</span>
                              <Badge variant="outline">{spirit.size}</Badge>
                              <span className="text-sm text-gray-600">ABV:</span>
                              <Badge variant="outline">{spirit.abv}</Badge>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      onClick={() => toggleAddon(spirit.id)}
                      className={`${
                        selectedAddons.includes(spirit.id)
                          ? 'bg-terracotta-500 hover:bg-terracotta-600 text-white'
                          : 'btn-primary'
                      }`}
                      size="sm"
                    >
                      {selectedAddons.includes(spirit.id) ? (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Standard Add-ons */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              Essential Add-ons
            </h2>
            <p className="text-xl text-gray-600">
              Complete your stay with our carefully selected services and amenities
            </p>
          </div>

          {Object.entries(groupedStandardAddons).map(([category, addons]) => (
            <div key={category} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">{addons[0].icon}</span>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addons.map((addon) => (
                  <Card key={addon.id} className={`card-hover ${selectedAddons.includes(addon.id) ? 'ring-2 ring-terracotta-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{addon.icon}</span>
                            <h4 className="font-semibold text-gray-800">{addon.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{addon.description}</p>
                          <div className="text-lg font-bold text-terracotta-600">
                            £{addon.price}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-full ${
                          selectedAddons.includes(addon.id)
                            ? 'bg-terracotta-500 hover:bg-terracotta-600 text-white'
                            : 'btn-primary'
                        }`}
                        size="sm"
                      >
                        {selectedAddons.includes(addon.id) ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Stay
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selection Summary & Checkout */}
      {selectedAddons.length > 0 && (
        <section className="sticky bottom-0 bg-white border-t shadow-lg">
          <div className="container py-6">
            <Card className="bg-terracotta-50 border-terracotta-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-terracotta-800 mb-2">
                      Selected Add-ons ({selectedAddons.length})
                    </h3>
                    <p className="text-sm text-terracotta-700">
                      Total additional cost: <span className="font-bold">£{getTotalPrice().toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAddons([])}
                      className="border-terracotta-300 text-terracotta-700 hover:bg-terracotta-100"
                    >
                      Clear All
                    </Button>
                    <Button asChild className="btn-primary">
                      <Link href={`/booking?addons=${selectedAddons.join(',')}`}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Continue to Booking
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}