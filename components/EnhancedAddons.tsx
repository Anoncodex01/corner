'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Award, Sparkles } from 'lucide-react';

const premiumSpirits = [
  {
    id: 'giraffe-gin',
    name: 'Giraffe Gin Mango & Passion Fruit',
    animal: 'Giraffe',
    size: '70cl',
    abv: '40%',
    price: 51.10,
    currency: 'US$',
    image: 'https://l.icdbcdn.com/oh/c37fa026-91c8-4eff-b2b0-6e08ca0535ff.png?w=300&h=300&mode=freesize',
    shortDescription: 'Embark on a vibrant journey with Giraffe Gin, where the lush tropical flavours of mango and passion fruit from Zanzibar meet the refined elegance of a premium London dry gin.',
    fullDescription: 'Crafted to perfection, this best gin captures the essence of the exotic savannah, bringing you the sweetness of ripe mangoes and the zesty kick of passion fruit for a delightful, refreshing experience.',
    features: [
      'Flavour Profile: A tropical burst of juicy mango and tangy passion fruit, perfectly balanced with the crispness of London Dry Gin',
      'Inspired By: The majestic Maasai giraffe, with its golden hues symbolizing elegance, grace, and adventure',
      'Perfect for summer cocktails, sipping neat, or gifting to those who appreciate bold, exotic flavours'
    ],
    color: 'from-yellow-500 to-orange-600',
  },
  {
    id: 'hakuna-matata-gin',
    name: 'Hakuna Matata Gin Kiwi & Lemon',
    animal: 'Lion',
    size: '50cl',
    abv: '38%',
    price: 37.64,
    currency: 'US$',
    image: 'https://l.icdbcdn.com/oh/54389fc7-f1f2-4c6b-9422-ed64aa33e144.png?w=300&h=300&mode=freesize',
    shortDescription: 'Experience the refreshing taste of Hakuna Matata Gin, a delightful blend that embodies the true spirit of relaxation.',
    fullDescription: 'Infused with vibrant kiwi and zesty lemon, this lemon gin offers a perfect balance of sweet and sour flavours — inviting you to sit back, unwind, and enjoy life with no worries.',
    features: [
      'Flavour Profile: A refreshing combination of kiwi and lemon, delivering a smooth, stress-relieving taste',
      'Crafted to capture the essence of "Hakuna Matata", this gin is ideal for easy-going moments and carefree celebrations',
      'Perfect for tropical cocktails and relaxed evening sipping'
    ],
    color: 'from-green-500 to-lime-600',
  },
  {
    id: 'rhino-rum',
    name: 'Rhino Rum Blackberry & Blueberry',
    animal: 'Rhino',
    size: '70cl',
    abv: '40%',
    price: 51.10,
    currency: 'US$',
    image: 'https://l.icdbcdn.com/oh/b15deb40-5361-4cb0-9172-459f18a1b74e.png?w=300&h=300&mode=freesize',
    shortDescription: 'Unleash the wild essence of the African savannah with Rhino Rum, a rich and robust creation from Serengeti Spirits.',
    fullDescription: 'Crafted from the finest Guyanese white rum and infused with succulent blackberries and blueberries from Tanzania, this spirit embodies strength, resilience, and adventure. With its striking deep purple hue, Rhino Rum stands as a tribute to the mighty African rhino – bold, powerful, and unforgettable.',
    features: [
      'Flavour Profile: A daring fusion of ripe blackberries and juicy blueberries, delivering a deep, fruity punch with a velvety smooth finish',
      'Inspired by: The indomitable spirit of the African rhino, a symbol of endurance and strength',
      'Perfect For: Sipping neat, over ice, or as the bold backbone of adventurous cocktails'
    ],
    color: 'from-purple-600 to-indigo-800',
  }
];

const standardAddons = [
  { id: 'breakfast', name: 'Braunston Butcher Breakfast Package', price: 15, description: 'Local breakfast delivered fresh daily' },
  { id: 'welcome-drinks', name: 'Welcome Drinks Package', price: 25, description: 'Curated selection of local beverages' },
  { id: 'late-checkout', name: 'Late Check-out (2 PM)', price: 20, description: 'Extend your stay until 2 PM' },
  { id: 'parking', name: 'Additional Parking Space', price: 5, description: 'Extra parking space per night' },
];

interface EnhancedAddonsProps {
  selectedAddons: string[];
  onAddonsChange: (addons: string[]) => void;
}

export default function EnhancedAddons({ selectedAddons, onAddonsChange }: EnhancedAddonsProps) {
  const [selectedSpirit, setSelectedSpirit] = useState<typeof premiumSpirits[0] | null>(null);

  const toggleAddon = (addonId: string) => {
    const updatedAddons = selectedAddons.includes(addonId)
      ? selectedAddons.filter(id => id !== addonId)
      : [...selectedAddons, addonId];
    onAddonsChange(updatedAddons);
  };

  return (
    <div className="space-y-8">
      {/* Premium Spirits */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="h-5 w-5 text-terracotta-500" />
          <h3 className="text-xl font-semibold">Premium Animal Spirits Collection</h3>
          <Badge className="bg-terracotta-500 text-white">
            <Award className="h-3 w-3 mr-1" />
            Exclusive
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {premiumSpirits.map((spirit) => (
            <Card key={spirit.id} className="overflow-hidden group card-hover">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                  <img
                    src={spirit.image}
                    alt={spirit.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className={`bg-gradient-to-r ${spirit.color} text-white border-0 text-xs`}>
                    {spirit.animal}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="text-terracotta-600 font-bold text-sm">{spirit.currency}{spirit.price}</span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={spirit.id}
                    checked={selectedAddons.includes(spirit.id)}
                    onCheckedChange={() => toggleAddon(spirit.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm leading-tight mb-1">{spirit.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                      <span>{spirit.size}</span>
                      <span>•</span>
                      <span>{spirit.abv}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {spirit.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-terracotta-600 text-sm">
                        {spirit.currency}{spirit.price}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-7"
                            onClick={() => setSelectedSpirit(spirit)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-playfair">{spirit.name}</DialogTitle>
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
                                <h3 className="text-lg font-bold mb-2">{spirit.name}</h3>
                                <div className="text-xl font-bold text-terracotta-600 mb-2">
                                  {spirit.currency}{spirit.price}
                                </div>
                                <p className="text-xs text-gray-600 mb-4">
                                  {spirit.currency}{spirit.price} (price per quantity, per stay)
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-700 mb-4">{spirit.fullDescription}</p>
                                
                                <h4 className="font-semibold mb-2 text-sm">Features:</h4>
                                <ul className="space-y-1">
                                  {spirit.features.map((feature, index) => (
                                    <li key={index} className="text-xs text-gray-600">
                                      • {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="flex items-center space-x-2 pt-3 border-t">
                                <Badge variant="outline" className="text-xs">{spirit.size}</Badge>
                                <Badge variant="outline" className="text-xs">{spirit.abv}</Badge>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Standard Add-ons */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Essential Add-ons</h3>
        <div className="space-y-4">
          {standardAddons.map((addon) => (
            <div key={addon.id} className="flex items-start space-x-3 p-4 border rounded-lg">
              <Checkbox
                id={addon.id}
                checked={selectedAddons.includes(addon.id)}
                onCheckedChange={() => toggleAddon(addon.id)}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{addon.name}</h4>
                  <span className="font-semibold text-terracotta-600">+£{addon.price}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}