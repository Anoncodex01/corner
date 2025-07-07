'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MessageSquare, Send, Phone, Mail, User, Calendar, Star } from 'lucide-react';
import { bookingService } from '@/lib/booking-service';
import { Booking } from '@/lib/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  bookingId: string;
  sender: 'guest' | 'host';
  content: string;
  timestamp: Date;
  read: boolean;
}

interface GuestProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastStay: Date | null;
  rating: number;
  notes: string;
  preferences: string[];
}

export default function GuestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const allBookings = bookingService.getBookings();
    setBookings(allBookings);
    
    // Generate guest profiles from bookings
    const guestMap = new Map<string, GuestProfile>();
    
    allBookings.forEach(booking => {
      const guestKey = booking.guestInfo.email;
      
      if (guestMap.has(guestKey)) {
        const guest = guestMap.get(guestKey)!;
        guest.totalBookings += 1;
        guest.totalSpent += booking.totalPrice;
        if (!guest.lastStay || booking.checkOut > guest.lastStay) {
          guest.lastStay = booking.checkOut;
        }
      } else {
        guestMap.set(guestKey, {
          id: `guest-${Date.now()}-${Math.random()}`,
          firstName: booking.guestInfo.firstName,
          lastName: booking.guestInfo.lastName,
          email: booking.guestInfo.email,
          phone: booking.guestInfo.phone,
          totalBookings: 1,
          totalSpent: booking.totalPrice,
          lastStay: booking.checkOut,
          rating: 4.5 + Math.random() * 0.5, // Mock rating
          notes: '',
          preferences: [],
        });
      }
    });
    
    setGuests(Array.from(guestMap.values()));
    
    // Mock messages
    setMessages([
      {
        id: 'msg-1',
        bookingId: allBookings[0]?.id || '',
        sender: 'guest',
        content: 'Hi, I have a question about check-in time. Can I arrive earlier than 3 PM?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: 'msg-2',
        bookingId: allBookings[0]?.id || '',
        sender: 'host',
        content: 'Hello! Yes, early check-in is possible subject to availability. I\'ll check and get back to you shortly.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: true,
      },
    ]);
    setLoading(false);
  }, []);

  const filteredGuests = guests.filter(guest =>
    guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGuestBookings = (guestEmail: string) => {
    return bookings.filter(booking => booking.guestInfo.email === guestEmail);
  };

  const getGuestMessages = (guestEmail: string) => {
    const guestBookings = getGuestBookings(guestEmail);
    return messages.filter(message => 
      guestBookings.some(booking => booking.id === message.bookingId)
    );
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedBooking) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      bookingId: selectedBooking.id,
      sender: 'host',
      content: newMessage,
      timestamp: new Date(),
      read: true,
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent successfully');
  };

  const messageTemplates = [
    {
      id: 'welcome',
      name: 'Welcome Message',
      content: 'Welcome to The Corner House! We\'re excited to host you. If you have any questions before your arrival, please don\'t hesitate to ask.',
    },
    {
      id: 'checkin',
      name: 'Check-in Instructions',
      content: 'Your check-in time is 3:00 PM. You\'ll find your room key using the animal-themed entry system. The code will be sent to you 24 hours before arrival.',
    },
    {
      id: 'checkout',
      name: 'Check-out Reminder',
      content: 'Thank you for staying with us! Check-out is at 11:00 AM. Please leave the keys in the room. We hope you enjoyed your stay!',
    },
    {
      id: 'feedback',
      name: 'Feedback Request',
      content: 'We hope you had a wonderful stay at The Corner House. We\'d love to hear about your experience and any suggestions for improvement.',
    },
  ];

  const getGuestStatusColor = (guest: GuestProfile) => {
    if (guest.totalBookings >= 5) return 'bg-gold-100 text-gold-800 border-gold-300';
    if (guest.totalBookings >= 3) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const getGuestStatusLabel = (guest: GuestProfile) => {
    if (guest.totalBookings >= 5) return 'VIP Guest';
    if (guest.totalBookings >= 3) return 'Returning Guest';
    return 'New Guest';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-12 w-1/2 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full mb-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
          <p className="text-gray-600">Manage guest profiles and communications</p>
        </div>
      </div>

      <Tabs defaultValue="guests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="guests">Guest Profiles</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="guests" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search guests by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Guest List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuests.map((guest) => (
              <Card key={guest.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-terracotta-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {guest.firstName} {guest.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{guest.email}</p>
                      </div>
                    </div>
                    <Badge className={getGuestStatusColor(guest)}>
                      {getGuestStatusLabel(guest)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Bookings:</span>
                      <span className="font-medium">{guest.totalBookings}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-medium">£{guest.totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Stay:</span>
                      <span className="font-medium">
                        {guest.lastStay ? guest.lastStay.toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{guest.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedGuest(guest)}>
                          <User className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Guest Profile: {guest.firstName} {guest.lastName}</DialogTitle>
                        </DialogHeader>
                        {selectedGuest && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>{selectedGuest.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{selectedGuest.phone}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-3">Guest Statistics</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Total Bookings:</span>
                                    <span className="font-medium">{selectedGuest.totalBookings}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Total Spent:</span>
                                    <span className="font-medium">£{selectedGuest.totalSpent.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Average per Booking:</span>
                                    <span className="font-medium">
                                      £{(selectedGuest.totalSpent / selectedGuest.totalBookings).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Guest Rating:</span>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{selectedGuest.rating.toFixed(1)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3">Booking History</h4>
                              <div className="space-y-2">
                                {getGuestBookings(selectedGuest.email).map((booking) => (
                                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                      <p className="font-medium">
                                        {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {booking.isWholeProperty ? 'Whole House' : `${booking.roomIds.length} room(s)`}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <Badge className={`${
                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                      }`}>
                                        {booking.status}
                                      </Badge>
                                      <p className="text-sm font-medium mt-1">£{booking.totalPrice.toFixed(2)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3">Recent Messages</h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {getGuestMessages(selectedGuest.email).map((message) => (
                                  <div key={message.id} className={`p-3 rounded-lg ${
                                    message.sender === 'guest' ? 'bg-gray-100' : 'bg-terracotta-100'
                                  }`}>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium">
                                        {message.sender === 'guest' ? 'Guest' : 'You'}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {message.timestamp.toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button size="sm" className="btn-primary">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedBooking?.id === booking.id ? 'bg-terracotta-100' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {booking.checkIn.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{booking.guestInfo.email}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {booking.isWholeProperty ? 'Whole House' : `${booking.roomIds.length} room(s)`}
                          </Badge>
                          {messages.some(m => m.bookingId === booking.id && !m.read && m.sender === 'guest') && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Thread */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>
                    {selectedBooking 
                      ? `${selectedBooking.guestInfo.firstName} ${selectedBooking.guestInfo.lastName}`
                      : 'Select a conversation'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {selectedBooking ? (
                    <>
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                        {messages
                          .filter(m => m.bookingId === selectedBooking.id)
                          .map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'host' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === 'host'
                                  ? 'bg-terracotta-500 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  message.sender === 'host' ? 'text-terracotta-100' : 'text-gray-500'
                                }`}>
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Message Input */}
                      <div className="border-t pt-4">
                        <div className="flex space-x-2">
                          <Textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 min-h-[80px]"
                          />
                          <Button onClick={sendMessage} className="btn-primary">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messageTemplates.map((template) => (
                  <Card key={template.id} className="border-2 border-gray-200 hover:border-terracotta-300 transition-colors">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{template.content}</p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewMessage(template.content)}
                        >
                          Use Template
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}