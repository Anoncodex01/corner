'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building, Plus, Edit, Eye, MapPin } from 'lucide-react';
import { bookingService } from '@/lib/booking-service';
import { Property } from '@/lib/types';
import { toast } from 'sonner';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    amenities: '',
    rules: '',
  });

  useEffect(() => {
    const allProperties = bookingService.getProperties();
    setProperties(allProperties);
  }, []);

  const handleCreateProperty = () => {
    const amenitiesArray = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
    const rulesArray = formData.rules.split(',').map(r => r.trim()).filter(Boolean);
    
    const newProperty = bookingService.createProperty({
      name: formData.name,
      description: formData.description,
      address: formData.address,
      checkInTime: formData.checkInTime,
      checkOutTime: formData.checkOutTime,
      amenities: amenitiesArray,
      rules: rulesArray,
      images: [], // Would be handled by file upload in real implementation
    });

    setProperties(prev => [...prev, newProperty]);
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      address: '',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      amenities: '',
      rules: '',
    });
    toast.success('Property created successfully');
  };

  const getRoomCount = (propertyId: string) => {
    return bookingService.getRooms(propertyId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your rental properties</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Property</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., The Corner House"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your property..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in Time</Label>
                  <Input
                    id="checkIn"
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, checkInTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out Time</Label>
                  <Input
                    id="checkOut"
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, checkOutTime: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
                  placeholder="WiFi, Parking, Kitchen, Garden"
                />
              </div>
              
              <div>
                <Label htmlFor="rules">House Rules (comma-separated)</Label>
                <Input
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                  placeholder="No smoking, Quiet hours 10PM-8AM"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProperty} className="btn-primary">
                  Create Property
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address}
                  </div>
                </div>
                <Badge variant="outline">
                  {getRoomCount(property.id)} rooms
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {property.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Check-in:</span>
                  <span>{property.checkInTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Check-out:</span>
                  <span>{property.checkOutTime}</span>
                </div>
              </div>
              
              {property.amenities.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{property.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first property</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}