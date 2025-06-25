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
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarDays, Clock, Building } from 'lucide-react';

export default function PricingPage() {
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    rule_type: 'seasonal',
    modifier_type: 'percentage',
    price_modifier: 0,
    minimum_stay: 1,
    start_date: '',
    end_date: '',
    days_of_week: [] as number[],
    is_active: true,
    property_id: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: rules } = await supabase.from('price_rules').select('*');
      setPricingRules(rules || []);
      const { data: props } = await supabase.from('properties').select('*');
      setProperties(props || []);
    };
    fetchData();
  }, []);

  const handleCreateRule = async () => {
    setCreating(true);
    const payload = {
      rule_type: formData.rule_type,
      modifier_type: formData.modifier_type,
      price_modifier: Number(formData.price_modifier),
      minimum_stay: formData.minimum_stay || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      days_of_week: formData.days_of_week.length > 0 ? formData.days_of_week.join(',') : null,
      is_active: formData.is_active,
      property_id: formData.property_id ? formData.property_id : null,
    };
    const { error } = await supabase.from('price_rules').insert([payload]);
    setCreating(false);
    if (error) {
      console.error('Supabase error:', error);
      toast.error('Failed to create pricing rule: ' + (error.message || 'Unknown error'));
      return;
    }
    toast.success('Pricing rule created successfully');
    setIsCreateDialogOpen(false);
    resetForm();
    // Refetch rules
    const { data: rules } = await supabase.from('price_rules').select('*');
    setPricingRules(rules || []);
  };

  const resetForm = () => {
    setFormData({
      rule_type: 'seasonal',
      modifier_type: 'percentage',
      price_modifier: 0,
      minimum_stay: 1,
      start_date: '',
      end_date: '',
      days_of_week: [],
      is_active: true,
      property_id: '',
    });
  };

  const toggleRuleStatus = (ruleId: string, isActive: boolean) => {
    // Implementation needed
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'seasonal': return 'bg-blue-100 text-blue-800';
      case 'day_of_week': return 'bg-green-100 text-green-800';
      case 'minimum_stay': return 'bg-purple-100 text-purple-800';
      case 'last_minute': return 'bg-orange-100 text-orange-800';
      case 'advance_booking': return 'bg-pink-100 text-pink-800';
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
                  <Label htmlFor="rule_type">Rule Type</Label>
                  <Select value={formData.rule_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, rule_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="day_of_week">Day of Week</SelectItem>
                      <SelectItem value="minimum_stay">Minimum Stay</SelectItem>
                      <SelectItem value="last_minute">Last Minute</SelectItem>
                      <SelectItem value="advance_booking">Advance Booking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="property_id">Property (Optional)</Label>
                  <Select value={formData.property_id || 'all'} onValueChange={(value) => setFormData(prev => ({ ...prev, property_id: value === 'all' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Apply to all properties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modifier_type">Modifier Type</Label>
                  <Select value={formData.modifier_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, modifier_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select modifier type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price_modifier">Price Modifier</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter price modifier"
                    value={formData.price_modifier}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_modifier: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              {formData.rule_type === 'minimum_stay' && (
                <div>
                  <Label htmlFor="minimum_stay">Minimum Stay (nights)</Label>
                  <Input
                    type="number"
                    min="1"
                    id="minimum_stay"
                    placeholder="Enter minimum stay"
                    value={formData.minimum_stay}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_stay: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              )}
              
              {(formData.rule_type === 'last_minute' || formData.rule_type === 'advance_booking') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      type="date"
                      id="start_date"
                      placeholder="Select start date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      type="date"
                      id="end_date"
                      placeholder="Select end date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
                />
                <Label htmlFor="is_active">Active</Label>
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
          rule && rule.rule_type ? (
            <Card key={rule.id} className={`${rule.is_active ? '' : 'opacity-60'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{rule.rule_type.replace('_', ' ')}</h3>
                      <Badge className={getTypeColor(rule.rule_type)}>
                        {typeof rule.rule_type === 'string' ? rule.rule_type.replace('_', ' ') : 'Unknown'}
                      </Badge>
                      {!rule.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Modifier:</span>
                        <p className="font-medium flex items-center">
                          {rule.modifier_type === 'percentage' ? (
                            <>
                              <Percent className="h-3 w-3 mr-1" />
                              {rule.price_modifier > 0 ? '+' : ''}{rule.price_modifier}%
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-3 w-3 mr-1" />
                              {rule.price_modifier > 0 ? '+' : ''}£{Math.abs(rule.price_modifier)}
                            </>
                          )}
                        </p>
                      </div>
                      
                      {rule.minimum_stay && (
                        <div>
                          <span className="text-gray-500">Min Stay:</span>
                          <p className="font-medium">{rule.minimum_stay} nights</p>
                        </div>
                      )}
                      
                      {rule.start_date && rule.end_date && (
                        <div>
                          <span className="text-gray-500">Period:</span>
                          <p className="font-medium">
                            {new Date(rule.start_date).toLocaleDateString()} - {new Date(rule.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {rule.days_of_week && rule.days_of_week.length > 0 && (
                        <div>
                          <span className="text-gray-500">Days:</span>
                          <p className="font-medium">{getDayNames(rule.days_of_week)}</p>
                        </div>
                      )}
                    </div>
                    
                    {rule.property_id && (
                      <div className="mt-2">
                        <span className="text-gray-500 text-sm">Property:</span>
                        <span className="text-sm ml-1">
                          {properties.find(p => p.id === rule.property_id)?.name || 'Unknown'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={rule.is_active}
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
          ) : null
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