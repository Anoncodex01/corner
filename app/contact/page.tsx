'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Send
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-0 text-sm px-4 py-1.5 rounded-full">
              Get in Touch
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair mb-6">
              Contact Us
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Have questions about your stay? We're here to help! Reach out to us 
              and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold font-playfair mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>
                
                <Button type="submit" className="w-full bg-brand-primary-600 hover:bg-brand-primary-700 text-white py-3">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold font-playfair mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-brand-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-brand-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                        <p className="text-gray-600 mb-1">
                          <a href="tel:+441788890123" className="hover:text-brand-primary-600 transition-colors">
                            +44 (0) 1788 890 123
                          </a>
                        </p>
                        <p className="text-sm text-gray-500">Available 9:00 AM - 8:00 PM daily</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-brand-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-brand-secondary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                        <p className="text-gray-600 mb-1">
                          <a href="mailto:hello@cornerhouse-braunston.com" className="hover:text-brand-primary-600 transition-colors">
                            hello@cornerhouse-braunston.com
                          </a>
                        </p>
                        <p className="text-sm text-gray-500">We typically respond within 2 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-brand-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-brand-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Check-in Hours</h3>
                        <div className="text-gray-600 space-y-1">
                          <p>Check-in: 3:00 PM - 8:00 PM</p>
                          <p>Check-out: 11:00 AM</p>
                          <p className="text-sm text-gray-500">Late check-in available by arrangement</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-brand-primary-100 rounded-lg flex items-center justify-center hover:bg-brand-primary-200 transition-colors">
                    <Facebook className="h-5 w-5 text-brand-primary-600" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-brand-primary-100 rounded-lg flex items-center justify-center hover:bg-brand-primary-200 transition-colors">
                    <Instagram className="h-5 w-5 text-brand-primary-600" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-brand-primary-100 rounded-lg flex items-center justify-center hover:bg-brand-primary-200 transition-colors">
                    <Twitter className="h-5 w-5 text-brand-primary-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair mb-4">Find Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Located in the heart of Braunston, Daventry, we're easily accessible 
              and close to all local attractions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gradient-to-br from-brand-primary-100 to-brand-secondary-100 rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-brand-primary-500 mx-auto mb-4" />
                  <p className="text-brand-primary-700 font-semibold">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Address</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>The Corner House</p>
                    <p>Braunston, Daventry</p>
                    <p>Northamptonshire, UK</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Getting Here</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">By Car:</p>
                      <p>Free parking available on-site</p>
                    </div>
                    <div>
                      <p className="font-medium">By Train:</p>
                      <p>Daventry Station (15 min drive)</p>
                    </div>
                    <div>
                      <p className="font-medium">By Bus:</p>
                      <p>Braunston bus stop (5 min walk)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}