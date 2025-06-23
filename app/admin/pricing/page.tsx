'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Plus, Edit, Trash2, Calendar, Percent } from 'lucide-react';
import { bookingService } from '@/lib/booking-service';
import { PricingRule, Property } from '@/lib/types';
import { toast } from 'sonner';

export default function PricingPage() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'weekend' as PricingRule['type'],
    propertyId: '',
    priceModifier: 0,
    modifierType: 'percentage' as 'percentage' | 'fixed',
    minimumStay: 1,
    startDate: '',
    endDate: '',
    daysOfWeek: [] as number[],
    isActive: true,
  });

  useEffect(() => {
    const allRules = bookingService.getPricingRules();
    const allProperties = bookingService.getProperties();
    setPricingRules(allRules);
    setProperties(allProperties);
  }, []);

  const handleCreateRule = () => {
    const newRule = bookingService.createPricingRule({
      name: formData.name,
      type: formData.type,
      propertyId: formData.propertyId || undefined,
      priceModifier: formData.priceModifier,
      modifierType: formData.modifierType,
      minimumStay: formData.minimumStay,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      daysOfWeek: formData.daysOfWeek.length > 0 ? formData.daysOfWeek : undefined,
      isActive: formData.isActive,
    });

    setPricingRules(prev => [...prev, newRule]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Pricing rule created successfully');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'weekend',
      propertyId: '',
      priceModifier: 0,
      modifierType: 'percentage',
      minimumStay: 1,
      startDate: '',
      endDate: '',
      daysOfWeek: [],
      isActive: true,
    });
  };

  const toggleRuleStatus = (ruleId: string, isActive: boolean) => {
    const updated = bookingService.updatePricingRule(ruleId, { isActive });
    if (updated) {
      setPricingRules(prev => prev.map(r => r.id === ruleId ? updated : r));
      toast.success(`Rule ${isActive ? 'activated' : 'deactivated'}`);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'weekend': return 'bg-blue-100 text-blue-800';
      case 'holiday': return 'bg-red-100 text-red-800';
      case 'seasonal': return 'bg-green-100 text-green-800';
      case 'length_of_stay': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDayNames = (days: number[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(d => dayNames[d]).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Rules</h1>
          <p className="text-gray-600">Manage dynamic pricing and discounts</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Pricing Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weekend Premium"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Rule Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekend">Weekend</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="length_of_stay">Length of Stay</SelectItem>
                      <SelectItem value="event">Special Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="property">Property (Optional)</Label>
                <Select value={formData.propertyId} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Apply to all properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Properties</SelectItem>
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
                  <Label htmlFor="modifier">Price Modifier</Label>
                  <Input
                    id="modifier"
                    type="number"
                    value={formData.priceModifier}
                    onChange={(e) => setFormData(prev => ({ ...prev, priceModifier: parseFloat(e.target.value) || 0 }))}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="modifierType">Modifier Type</Label>
                  <Select value={formData.modifierType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, modifierType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {formData.type === 'length_of_stay' && (
                <div>
                  <Label htmlFor="minimumStay">Minimum Stay (nights)</Label>
                  <Input
                    id="minimumStay"
                    type="number"
                    value={formData.minimumStay}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumStay: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>
              )}
              
              {(formData.type === 'holiday' || formData.type === 'seasonal' || formData.type === 'event') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
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
                <Button onClick={handleCreateRule} className="btn-primary">
                  Create Rule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pricing Rules List */}
      <div className="space-y-4">
        {pricingRules.map((rule) => (
          <Card key={rule.id} className={`${rule.isActive ? '' : 'opacity-60'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{rule.name}</h3>
                    <Badge className={getTypeColor(rule.type)}>
                      {rule.type.replace('_', ' ')}
                    </Badge>
                    {!rule.isActive && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Modifier:</span>
                      <p className="font-medium flex items-center">
                        {rule.modifierType === 'percentage' ? (
                          <>
                            <Percent className="h-3 w-3 mr-1" />
                            {rule.priceModifier > 0 ? '+' : ''}{rule.priceModifier}%
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-3 w-3 mr-1" />
                            {rule.priceModifier > 0 ? '+' : ''}£{Math.abs(rule.priceModifier)}
                          </>
                        )}
                      </p>
                    </div>
                    
                    {rule.minimumStay && (
                      <div>
                        <span className="text-gray-500">Min Stay:</span>
                        <p className="font-medium">{rule.minimumStay} nights</p>
                      </div>
                    )}
                    
                    {rule.startDate && rule.endDate && (
                      <div>
                        <span className="text-gray-500">Period:</span>
                        <p className="font-medium">
                          {rule.startDate.toLocaleDateString()} - {rule.endDate.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    {rule.daysOfWeek && rule.daysOfWeek.length > 0 && (
                      <div>
                        <span className="text-gray-500">Days:</span>
                        <p className="font-medium">{getDayNames(rule.daysOfWeek)}</p>
                      </div>
                    )}
                  </div>
                  
                  {rule.propertyId && (
                    <div className="mt-2">
                      <span className="text-gray-500 text-sm">Property:</span>
                      <span className="text-sm ml-1">
                        {properties.find(p => p.id === rule.propertyId)?.name || 'Unknown'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={(checked) => toggleRuleStatus(rule.id, checked)}
                  />
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pricingRules.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pricing rules yet</h3>
            <p className="text-gray-600 mb-4">Create dynamic pricing rules to optimize your revenue</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Rule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}