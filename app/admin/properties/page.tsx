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
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    region: '',
    country: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    amenities: '',
    numRooms: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    region: '',
    country: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    amenities: '',
    numRooms: '',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError('Failed to load properties');
        setProperties([]);
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const handleCreateProperty = async () => {
    const amenitiesArray = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
    const { error } = await supabase.from('properties').insert([
      {
      name: formData.name,
      description: formData.description,
      address: formData.address,
        city: formData.city,
        region: formData.region,
        country: formData.country,
        check_in_time: formData.checkInTime,
        check_out_time: formData.checkOutTime,
      amenities: amenitiesArray,
        num_rooms: Number(formData.numRooms),
      },
    ]);
    if (error) {
      toast.error('Failed to create property');
      return;
    }
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      region: '',
      country: '',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      amenities: '',
      numRooms: '',
    });
    toast.success('Property created successfully');
    // Refetch properties
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    setProperties(data || []);
  };

  const getRoomCount = () => 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full mb-2" />
        ))}
      </div>
    );
  }

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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g., Braunston"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="e.g., Northamptonshire"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="e.g., UK"
                  />
                </div>
              <div>
                  <Label htmlFor="numRooms">Number of Rooms</Label>
                <Input
                    id="numRooms"
                    type="number"
                    min="1"
                    value={formData.numRooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, numRooms: e.target.value }))}
                    placeholder="e.g., 5"
                />
                </div>
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
                    {property.city}, {property.region}, {property.country}
                  </div>
                </div>
                <Badge variant="outline">
                  {property.num_rooms || 0} rooms
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
                  <span>{property.check_in_time || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Check-out:</span>
                  <span>{property.check_out_time || '-'}</span>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setViewProperty(property)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditProperty(property);
                    setEditFormData({
                      name: property.name || '',
                      description: property.description || '',
                      address: property.address || '',
                      city: property.city || '',
                      region: property.region || '',
                      country: property.country || '',
                      checkInTime: property.check_in_time || '15:00',
                      checkOutTime: property.check_out_time || '11:00',
                      amenities: (property.amenities || []).join(', '),
                      numRooms: property.num_rooms ? String(property.num_rooms) : '',
                    });
                  }}
                >
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

      {viewProperty && (
        <Dialog open={!!viewProperty} onOpenChange={() => setViewProperty(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{viewProperty.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <MapPin className="inline h-4 w-4 mr-1" />
                {viewProperty.address}, {viewProperty.city}, {viewProperty.region}, {viewProperty.country}
              </div>
              <div className="text-gray-700 text-base mb-2">{viewProperty.description}</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-in:</span>
                <span>{viewProperty.check_in_time || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-out:</span>
                <span>{viewProperty.check_out_time || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rooms:</span>
                <span>{viewProperty.num_rooms || '-'}</span>
              </div>
              {viewProperty.amenities && viewProperty.amenities.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {viewProperty.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{amenity}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setViewProperty(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editProperty && (
        <Dialog open={!!editProperty} onOpenChange={() => setEditProperty(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit {editProperty.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName">Property Name</Label>
                  <Input
                    id="editName"
                    value={editFormData.name}
                    onChange={e => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editAddress">Address</Label>
                  <Input
                    id="editAddress"
                    value={editFormData.address}
                    onChange={e => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCity">City</Label>
                  <Input
                    id="editCity"
                    value={editFormData.city}
                    onChange={e => setEditFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editRegion">Region</Label>
                  <Input
                    id="editRegion"
                    value={editFormData.region}
                    onChange={e => setEditFormData(prev => ({ ...prev, region: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCountry">Country</Label>
                  <Input
                    id="editCountry"
                    value={editFormData.country}
                    onChange={e => setEditFormData(prev => ({ ...prev, country: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editNumRooms">Number of Rooms</Label>
                  <Input
                    id="editNumRooms"
                    type="number"
                    min="1"
                    value={editFormData.numRooms}
                    onChange={e => setEditFormData(prev => ({ ...prev, numRooms: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editFormData.description}
                  onChange={e => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCheckIn">Check-in Time</Label>
                  <Input
                    id="editCheckIn"
                    type="time"
                    value={editFormData.checkInTime}
                    onChange={e => setEditFormData(prev => ({ ...prev, checkInTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editCheckOut">Check-out Time</Label>
                  <Input
                    id="editCheckOut"
                    type="time"
                    value={editFormData.checkOutTime}
                    onChange={e => setEditFormData(prev => ({ ...prev, checkOutTime: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editAmenities">Amenities (comma-separated)</Label>
                <Input
                  id="editAmenities"
                  value={editFormData.amenities}
                  onChange={e => setEditFormData(prev => ({ ...prev, amenities: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setEditProperty(null)}>Cancel</Button>
              <Button
                className="btn-primary"
                onClick={async () => {
                  const amenitiesArray = editFormData.amenities.split(',').map(a => a.trim()).filter(Boolean);
                  const { error } = await supabase.from('properties').update({
                    name: editFormData.name,
                    description: editFormData.description,
                    address: editFormData.address,
                    city: editFormData.city,
                    region: editFormData.region,
                    country: editFormData.country,
                    check_in_time: editFormData.checkInTime,
                    check_out_time: editFormData.checkOutTime,
                    amenities: amenitiesArray,
                    num_rooms: Number(editFormData.numRooms),
                  }).eq('id', editProperty.id);
                  if (error) {
                    toast.error('Failed to update property');
                  } else {
                    toast.success('Property updated successfully');
                    setEditProperty(null);
                    // Refetch properties
                    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
                    setProperties(data || []);
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}