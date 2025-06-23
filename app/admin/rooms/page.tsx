'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Bed, Plus, Edit, Eye, Users, Bath, Wifi, Tv, Coffee, Star } from 'lucide-react';
import { bookingService } from '@/lib/booking-service';
import { Room, Property } from '@/lib/types';
import { toast } from 'sonner';

const animalThemes = [
  { id: 'lion', name: 'Lion', color: 'from-yellow-500 to-orange-600', description: 'Majestic and royal' },
  { id: 'elephant', name: 'Elephant', color: 'from-gray-500 to-gray-700', description: 'Spacious and serene' },
  { id: 'buffalo', name: 'Buffalo', color: 'from-amber-600 to-red-700', description: 'Rustic and strong' },
  { id: 'rhino', name: 'Rhino', color: 'from-slate-500 to-slate-700', description: 'Contemporary and bold' },
  { id: 'leopard', name: 'Leopard', color: 'from-yellow-600 to-amber-800', description: 'Elegant and sophisticated' },
  { id: 'giraffe', name: 'Giraffe', color: 'from-orange-400 to-yellow-500', description: 'Tall and graceful' },
  { id: 'zebra', name: 'Zebra', color: 'from-gray-800 to-gray-600', description: 'Striking patterns' },
];

const bedTypes = ['Single', 'Double', 'Queen', 'King', 'Twin'];
const bathroomTypes = ['ensuite', 'shared'];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    name: '',
    description: '',
    animalTheme: '',
    capacity: 1,
    bedType: 'Single',
    bathroom: 'shared' as 'ensuite' | 'shared',
    basePrice: 85,
    features: '',
    keySystemDescription: '',
    isActive: true,
  });

  useEffect(() => {
    const allRooms = bookingService.getRooms();
    const allProperties = bookingService.getProperties();
    setRooms(allRooms);
    setProperties(allProperties);
  }, []);

  const handleCreateRoom = () => {
    const featuresArray = formData.features.split(',').map(f => f.trim()).filter(Boolean);
    
    const newRoom = bookingService.createRoom({
      propertyId: formData.propertyId,
      name: formData.name,
      description: formData.description,
      capacity: formData.capacity,
      bedType: formData.bedType,
      bathroom: formData.bathroom,
      basePrice: formData.basePrice,
      features: featuresArray,
      images: [], // Would be handled by file upload in real implementation
      isActive: formData.isActive,
    });

    setRooms(prev => [...prev, newRoom]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Room created successfully');
  };

  const resetForm = () => {
    setFormData({
      propertyId: '',
      name: '',
      description: '',
      animalTheme: '',
      capacity: 1,
      bedType: 'Single',
      bathroom: 'shared',
      basePrice: 85,
      features: '',
      keySystemDescription: '',
      isActive: true,
    });
  };

  const toggleRoomStatus = (roomId: string, isActive: boolean) => {
    const updated = bookingService.updateRoom(roomId, { isActive });
    if (updated) {
      setRooms(prev => prev.map(r => r.id === roomId ? updated : r));
      toast.success(`Room ${isActive ? 'activated' : 'deactivated'}`);
    }
  };

  const getAnimalTheme = (roomName: string) => {
    const theme = animalThemes.find(t => roomName.toLowerCase().includes(t.name.toLowerCase()));
    return theme || animalThemes[0];
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Manage themed rooms and their configurations</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="property">Property</Label>
                <Select value={formData.propertyId} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Lion Suite"
                  />
                </div>
                <div>
                  <Label htmlFor="animalTheme">Animal Theme</Label>
                  <Select value={formData.animalTheme} onValueChange={(value) => setFormData(prev => ({ ...prev, animalTheme: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select animal theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {animalThemes.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.color}`}></div>
                            <span>{theme.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the room's character and features..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="4"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bedType">Bed Type</Label>
                  <Select value={formData.bedType} onValueChange={(value) => setFormData(prev => ({ ...prev, bedType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bedTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bathroom">Bathroom</Label>
                  <Select value={formData.bathroom} onValueChange={(value: any) => setFormData(prev => ({ ...prev, bathroom: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bathroomTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'ensuite' ? 'En-suite' : 'Shared'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="basePrice">Base Price (per night)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="5"
                  value={formData.basePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="Smart TV, Mini Fridge, Work Desk, Premium Toiletries"
                />
              </div>

              <div>
                <Label htmlFor="keySystem">Animal-Themed Key System Description</Label>
                <Textarea
                  id="keySystem"
                  value={formData.keySystemDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, keySystemDescription: e.target.value }))}
                  placeholder="Describe the unique animal-themed key entry system for this room..."
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRoom} className="btn-primary">
                  Create Room
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const theme = getAnimalTheme(room.name);
          return (
            <Card key={room.id} className={`overflow-hidden card-hover ${room.isActive ? '' : 'opacity-60'}`}>
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Bed className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Room Image</p>
                  </div>
                </div>
                <div className={`absolute top-3 left-3 bg-gradient-to-r ${theme.color} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                  {theme.name}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="text-terracotta-600 font-bold text-sm">£{room.basePrice}</span>
                </div>
                {!room.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
                    <p className="text-sm text-gray-600">{getPropertyName(room.propertyId)}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="h-3 w-3" />
                    <span className="text-xs">{room.capacity}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">
                  {room.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Bed className="h-3 w-3 text-gray-500" />
                      <span>{room.bedType}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="h-3 w-3 text-gray-500" />
                      <span className="capitalize">{room.bathroom}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
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
                  <div className="flex space-x-1">
                    <Dialog open={isViewDialogOpen && selectedRoom?.id === room.id} onOpenChange={setIsViewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedRoom(room)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedRoom?.name} Details</DialogTitle>
                        </DialogHeader>
                        {selectedRoom && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Room Information</h4>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Property:</strong> {getPropertyName(selectedRoom.propertyId)}</p>
                                  <p><strong>Capacity:</strong> {selectedRoom.capacity} guest{selectedRoom.capacity > 1 ? 's' : ''}</p>
                                  <p><strong>Bed Type:</strong> {selectedRoom.bedType}</p>
                                  <p><strong>Bathroom:</strong> {selectedRoom.bathroom === 'ensuite' ? 'En-suite' : 'Shared'}</p>
                                  <p><strong>Base Price:</strong> £{selectedRoom.basePrice}/night</p>
                                  <p><strong>Status:</strong> {selectedRoom.isActive ? 'Active' : 'Inactive'}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Theme & Features</h4>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Animal Theme:</strong> {getAnimalTheme(selectedRoom.name).name}</p>
                                  <div>
                                    <strong>Features:</strong>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {selectedRoom.features.map((feature, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {feature}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-gray-700">{selectedRoom.description}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Switch
                    checked={room.isActive}
                    onCheckedChange={(checked) => toggleRoomStatus(room.id, checked)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {rooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bed className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms yet</h3>
            <p className="text-gray-600 mb-4">Create your first themed room to get started</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Room
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Animal Themes Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Animal Theme Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {animalThemes.map((theme) => (
              <div key={theme.id} className="text-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.color} mx-auto mb-2`}></div>
                <h4 className="font-semibold text-sm">{theme.name}</h4>
                <p className="text-xs text-gray-600">{theme.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}