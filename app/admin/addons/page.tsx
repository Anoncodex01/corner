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
import { Plus, Edit, Eye, Tag, DollarSign, Package, Star, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

const categories = [
  'Food & Beverage',
  'Services',
  'Wellness',
  'Premium Spirits',
  'Transportation',
  'Entertainment',
  'Special Events'
];

export default function AddonsPage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Services',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editAddon, setEditAddon] = useState<Addon | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Services',
    isActive: true,
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase
        .from('addons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching addons:', error);
        toast.error('Failed to load add-ons');
        setAddons([]);
      } else {
        setAddons(data || []);
      }
    } catch (error) {
      console.error('Error fetching addons:', error);
      toast.error('Failed to load add-ons');
      setAddons([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      if (isEdit) {
        setEditImageFile(file);
        setEditImagePreview(URL.createObjectURL(file));
      } else {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const uploadImage = async (file: File): Promise<string | undefined> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `addon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('addon-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload image');
        return undefined;
      }

      const { data: urlData } = supabase.storage
        .from('addon-images')
        .getPublicUrl(fileName);

      return urlData?.publicUrl || undefined;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
      return undefined;
    }
  };

  const handleCreateAddon = async () => {
    if (!formData.name || !formData.description || formData.price < 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if image is required for Premium Spirits
    if (formData.category === 'Premium Spirits' && !imageFile) {
      toast.error('Image is required for Premium Spirits');
      return;
    }

    setCreating(true);
    try {
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) {
          setCreating(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const { error } = await supabase.from('addons').insert([
        {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          is_active: formData.isActive,
          image_url: imageUrl,
        },
      ]);

      if (error) {
        toast.error('Failed to create add-on');
        console.error('Error creating addon:', error);
      } else {
        toast.success('Add-on created successfully');
        setIsCreateDialogOpen(false);
        resetForm();
        fetchAddons();
      }
    } catch (error) {
      toast.error('Failed to create add-on');
      console.error('Error creating addon:', error);
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Services',
      isActive: true,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const toggleAddonStatus = async (addonId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('addons')
        .update({ is_active: isActive })
        .eq('id', addonId);

      if (error) {
        toast.error('Failed to update add-on status');
        console.error('Error updating addon status:', error);
      } else {
        setAddons(prev => prev.map(a => a.id === addonId ? { ...a, is_active: isActive } : a));
        toast.success(`Add-on ${isActive ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      toast.error('Failed to update add-on status');
      console.error('Error updating addon status:', error);
    }
  };

  const handleEditAddon = async () => {
    if (!editAddon || !editFormData.name || !editFormData.description || editFormData.price < 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if image is required for Premium Spirits
    if (editFormData.category === 'Premium Spirits' && !editImageFile && !editAddon.image_url) {
      toast.error('Image is required for Premium Spirits');
      return;
    }

    setEditing(true);
    try {
      let imageUrl = editAddon.image_url;
      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
        if (!imageUrl) {
          setEditing(false);
          return;
        }
      }

      const { error } = await supabase
        .from('addons')
        .update({
          name: editFormData.name,
          description: editFormData.description,
          price: editFormData.price,
          category: editFormData.category,
          is_active: editFormData.isActive,
          image_url: imageUrl,
        })
        .eq('id', editAddon.id);

      if (error) {
        toast.error('Failed to update add-on');
        console.error('Error updating addon:', error);
      } else {
        toast.success('Add-on updated successfully');
        setEditAddon(null);
        setEditImageFile(null);
        setEditImagePreview(null);
        fetchAddons();
      }
    } catch (error) {
      toast.error('Failed to update add-on');
      console.error('Error updating addon:', error);
    } finally {
      setEditing(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Beverage':
        return '🍽️';
      case 'Services':
        return '🛎️';
      case 'Wellness':
        return '💆';
      case 'Premium Spirits':
        return '🥃';
      case 'Transportation':
        return '🚗';
      case 'Entertainment':
        return '🎭';
      case 'Special Events':
        return '🎉';
      default:
        return '📦';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Food & Beverage':
        return 'bg-orange-100 text-orange-800';
      case 'Services':
        return 'bg-blue-100 text-blue-800';
      case 'Wellness':
        return 'bg-green-100 text-green-800';
      case 'Premium Spirits':
        return 'bg-purple-100 text-purple-800';
      case 'Transportation':
        return 'bg-gray-100 text-gray-800';
      case 'Entertainment':
        return 'bg-pink-100 text-pink-800';
      case 'Special Events':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add-ons Management</h1>
          <p className="text-gray-600">Manage additional services and amenities for guests</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Add-on
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Add-on</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Add-on Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Breakfast Package"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this add-on includes..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (£)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {getCategoryIcon(category)} {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload for Premium Spirits */}
              {formData.category === 'Premium Spirits' && (
                <div>
                  <Label htmlFor="image">Product Image *</Label>
                  <div className="mt-2">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Upload product image</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e)}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
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
                <Button onClick={handleCreateAddon} className="btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Add-on'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add-ons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addons.map((addon) => (
          <Card key={addon.id} className={`overflow-hidden card-hover ${addon.is_active ? '' : 'opacity-60'}`}>
            {addon.image_url && (
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={addon.image_url}
                  alt={addon.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getCategoryIcon(addon.category)}</span>
                    <h3 className="text-lg font-bold text-gray-800">{addon.name}</h3>
                  </div>
                  <Badge className={`${getCategoryColor(addon.category)} text-xs`}>
                    {addon.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Dialog open={isViewDialogOpen && selectedAddon?.id === addon.id} onOpenChange={setIsViewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAddon(addon)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{selectedAddon?.name} Details</DialogTitle>
                      </DialogHeader>
                      {selectedAddon && (
                        <div className="space-y-4">
                          {selectedAddon.image_url && (
                            <div className="aspect-[4/3] overflow-hidden rounded-lg">
                              <img
                                src={selectedAddon.image_url}
                                alt={selectedAddon.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Add-on Information</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Category:</strong> {selectedAddon.category}</p>
                                <p><strong>Price:</strong> £{selectedAddon.price.toFixed(2)}</p>
                                <p><strong>Status:</strong> {selectedAddon.is_active ? 'Active' : 'Inactive'}</p>
                                <p><strong>Created:</strong> {new Date(selectedAddon.created_at || '').toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-gray-700">{selectedAddon.description}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEditAddon(addon);
                      setEditFormData({
                        name: addon.name,
                        description: addon.description,
                        price: addon.price,
                        category: addon.category,
                        isActive: addon.is_active,
                      });
                      setEditImagePreview(addon.image_url || null);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                {addon.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-terracotta-600">
                  £{addon.price.toFixed(2)}
                </div>
                <Switch
                  checked={addon.is_active}
                  onCheckedChange={(checked) => toggleAddonStatus(addon.id, checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {addons.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No add-ons yet</h3>
            <p className="text-gray-600 mb-4">Create your first add-on to enhance guest experiences</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Add-on
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editAddon && (
        <Dialog open={!!editAddon} onOpenChange={() => {
          setEditAddon(null);
          setEditImageFile(null);
          setEditImagePreview(null);
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Add-on</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Add-on Name</Label>
                <Input
                  id="editName"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editPrice">Price (£)</Label>
                  <Input
                    id="editPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editCategory">Category</Label>
                  <Select value={editFormData.category} onValueChange={(value) => setEditFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {getCategoryIcon(category)} {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload for Premium Spirits in Edit */}
              {editFormData.category === 'Premium Spirits' && (
                <div>
                  <Label htmlFor="editImage">Product Image *</Label>
                  <div className="mt-2">
                    {editImagePreview ? (
                      <div className="relative">
                        <img
                          src={editImagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setEditImageFile(null);
                            setEditImagePreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Upload product image</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        <Input
                          id="editImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, true)}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsActive"
                  checked={editFormData.isActive}
                  onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="editIsActive">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setEditAddon(null);
                  setEditImageFile(null);
                  setEditImagePreview(null);
                }}>Cancel</Button>
                <Button
                  className="btn-primary"
                  disabled={editing}
                  onClick={handleEditAddon}
                >
                  {editing ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 