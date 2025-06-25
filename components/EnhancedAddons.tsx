'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Award, Sparkles } from 'lucide-react';

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  size?: string;
  abv?: string;
  currency?: string;
  features?: string[];
}

interface EnhancedAddonsProps {
  addons: Addon[];
  selectedAddons: string[];
  onAddonsChange: (addons: string[]) => void;
}

export default function EnhancedAddons({ addons, selectedAddons, onAddonsChange }: EnhancedAddonsProps) {
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);

  // Group add-ons by category
  const grouped = addons.reduce((acc, addon) => {
    if (!acc[addon.category]) acc[addon.category] = [];
    acc[addon.category].push(addon);
    return acc;
  }, {} as Record<string, Addon[]>);

  const toggleAddon = (addonId: string) => {
    const updatedAddons = selectedAddons.includes(addonId)
      ? selectedAddons.filter(id => id !== addonId)
      : [...selectedAddons, addonId];
    onAddonsChange(updatedAddons);
  };

  return (
    <div className="space-y-8">
      {/* Premium Spirits */}
      {grouped['Premium Spirits'] && (
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
            {grouped['Premium Spirits'].map((spirit) => (
              <Card key={spirit.id} className="overflow-hidden group card-hover">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                    {spirit.image_url ? (
                      <img
                        src={spirit.image_url}
                        alt={spirit.name}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 text-xs">
                      {spirit.name.split(' ')[0]}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-terracotta-600 font-bold text-sm">{spirit.currency || '£'}{spirit.price}</span>
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
                        {spirit.size && <span>{spirit.size}</span>}
                        {spirit.abv && <><span>•</span><span>{spirit.abv}</span></>}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                        {spirit.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-terracotta-600 text-sm">
                          {spirit.currency || '£'}{spirit.price}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-7"
                              onClick={() => setSelectedAddon(spirit)}
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
                                {spirit.image_url ? (
                                  <img
                                    src={spirit.image_url}
                                    alt={spirit.name}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                )}
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-lg font-bold mb-2">{spirit.name}</h3>
                                  <div className="text-xl font-bold text-terracotta-600 mb-2">
                                    {spirit.currency || '£'}{spirit.price}
                                  </div>
                                  <p className="text-xs text-gray-600 mb-4">
                                    {spirit.currency || '£'}{spirit.price} (price per quantity, per stay)
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-700 mb-4">{spirit.description}</p>
                                  {spirit.features && spirit.features.length > 0 && (
                                    <>
                                      <h4 className="font-semibold mb-2 text-sm">Features:</h4>
                                      <ul className="space-y-1">
                                        {spirit.features.map((feature, index) => (
                                          <li key={index} className="text-xs text-gray-600">
                                            • {feature}
                                          </li>
                                        ))}
                                      </ul>
                                    </>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 pt-3 border-t">
                                  {spirit.size && <Badge variant="outline" className="text-xs">{spirit.size}</Badge>}
                                  {spirit.abv && <Badge variant="outline" className="text-xs">{spirit.abv}</Badge>}
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
      )}
      {/* Other Add-ons */}
      {Object.entries(grouped).filter(([cat]) => cat !== 'Premium Spirits').map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((addon) => (
              <Card key={addon.id} className={`card-hover ${selectedAddons.includes(addon.id) ? 'ring-2 ring-terracotta-500' : ''}`}>
                <CardContent className="p-4 flex items-center space-x-4">
                  <Checkbox
                    id={addon.id}
                    checked={selectedAddons.includes(addon.id)}
                    onCheckedChange={() => toggleAddon(addon.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1">{addon.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{addon.description}</p>
                    <span className="font-semibold text-terracotta-600 text-sm">£{addon.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}