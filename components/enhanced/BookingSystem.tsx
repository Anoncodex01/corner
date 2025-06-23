'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { bookingService } from '@/lib/booking-service';
import { AvailabilityCheck, PriceCalculation } from '@/lib/types';

interface EnhancedBookingSystemProps {
  propertyId: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  selectedRooms: string[];
  isWholeProperty: boolean;
  onPriceUpdate: (calculation: PriceCalculation | null) => void;
}

export default function EnhancedBookingSystem({
  propertyId,
  checkIn,
  checkOut,
  guests,
  selectedRooms,
  isWholeProperty,
  onPriceUpdate,
}: EnhancedBookingSystemProps) {
  const [availability, setAvailability] = useState<{
    isAvailable: boolean;
    conflicts: string[];
    priceCalculation: PriceCalculation | null;
  }>({
    isAvailable: true,
    conflicts: [],
    priceCalculation: null,
  });

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setAvailability({
        isAvailable: true,
        conflicts: [],
        priceCalculation: null,
      });
      onPriceUpdate(null);
      return;
    }

    const availabilityCheck: AvailabilityCheck = {
      propertyId,
      checkIn,
      checkOut,
      roomIds: selectedRooms,
      isWholeProperty,
    };

    // Check availability
    const isAvailable = bookingService.checkAvailability(availabilityCheck);
    
    // Calculate pricing
    const priceCalculation = bookingService.calculatePrice(availabilityCheck);
    
    // Generate conflict messages
    const conflicts: string[] = [];
    
    if (!isAvailable) {
      if (isWholeProperty) {
        conflicts.push('Entire property is not available for selected dates');
      } else {
        conflicts.push('Some selected rooms are not available for selected dates');
      }
    }

    // Check weekend minimum stay for whole property
    if (isWholeProperty && checkIn && checkOut) {
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const isWeekend = checkIn.getDay() >= 5 || checkOut.getDay() >= 5; // Friday or Saturday
      
      if (isWeekend && nights < 2) {
        conflicts.push('Weekend bookings for entire property require minimum 2 nights');
      }
    }

    const newAvailability = {
      isAvailable: isAvailable && conflicts.length === 0,
      conflicts,
      priceCalculation,
    };

    setAvailability(newAvailability);
    onPriceUpdate(priceCalculation);
  }, [propertyId, checkIn, checkOut, selectedRooms, isWholeProperty, guests, onPriceUpdate]);

  if (!checkIn || !checkOut) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Booking Validation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Availability Status */}
        <div className="flex items-center space-x-2">
          {availability.isAvailable ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">Available</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 font-medium">Not Available</span>
            </>
          )}
        </div>

        {/* Conflicts */}
        {availability.conflicts.length > 0 && (
          <div className="space-y-2">
            {availability.conflicts.map((conflict, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{conflict}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Price Breakdown */}
        {availability.priceCalculation && (
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price ({availability.priceCalculation.nights} nights):</span>
                  <span>£{availability.priceCalculation.basePrice.toFixed(2)}</span>
                </div>
                
                {availability.priceCalculation.pricingRules.map((ruleApplication, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="flex items-center space-x-2">
                      <span>{ruleApplication.rule.name}:</span>
                      <Badge variant="outline" className="text-xs">
                        {ruleApplication.rule.modifierType === 'percentage' 
                          ? `${ruleApplication.rule.priceModifier > 0 ? '+' : ''}${ruleApplication.rule.priceModifier}%`
                          : `${ruleApplication.rule.priceModifier > 0 ? '+' : ''}£${Math.abs(ruleApplication.rule.priceModifier)}`
                        }
                      </Badge>
                    </span>
                    <span className={ruleApplication.adjustment >= 0 ? 'text-red-600' : 'text-green-600'}>
                      {ruleApplication.adjustment >= 0 ? '+' : ''}£{ruleApplication.adjustment.toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>£{availability.priceCalculation.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Booking Summary</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span>{checkIn.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span>{checkOut.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span>{guests}</span>
            </div>
            <div className="flex justify-between">
              <span>Accommodation:</span>
              <span>
                {isWholeProperty 
                  ? 'Entire Property' 
                  : `${selectedRooms.length} Room${selectedRooms.length > 1 ? 's' : ''}`
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}