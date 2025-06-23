'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Clock, Car, Train, Facebook, Instagram, Twitter, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-terracotta-600 to-ivy-600 text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-0">
              Get in Touch
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4">
              Contact Us
            </h1>
            <p className="text-xl opacity-90">
              We're here to help make your stay at The Corner House perfect
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold font-playfair mb-6 heading-gradient">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Whether you have questions about booking, need local recommendations, or require assistance during your stay, we're here to help.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-terracotta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-terracotta-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                        <p className="text-gray-600">
                          The Corner House<br />
                          Braunston, Daventry<br />
                          Northamptonshire<br />
                          NN11 7HH
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-ivy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-ivy-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                        <p className="text-gray-600 mb-1">
                          <a href="tel:+441788890123" className="hover:text-terracotta-600 transition-colors">
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
                      <div className="w-12 h-12 bg-terracotta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-terracotta-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                        <p className="text-gray-600 mb-1">
                          <a href="mailto:hello@cornerhouse-braunston.com" className="hover:text-terracotta-600 transition-colors">
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
                      <div className="w-12 h-12 bg-ivy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-ivy-600" />
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
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-terracotta-100 rounded-lg flex items-center justify-center hover:bg-terracotta-200 transition-colors">
                    <Facebook className="h-5 w-5 text-terracotta-600" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-terracotta-100 rounded-lg flex items-center justify-center hover:bg-terracotta-200 transition-colors">
                    <Instagram className="h-5 w-5 text-terracotta-600" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-terracotta-100 rounded-lg flex items-center justify-center hover:bg-terracotta-200 transition-colors">
                    <Twitter className="h-5 w-5 text-terracotta-600" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
                      <p className="text-gray-600 mb-4">
                        Thank you for contacting us. We'll get back to you within 2 hours.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+44 1234 567890"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            placeholder="What can we help you with?"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <p className="text-sm text-gray-500 text-center">
                        We respect your privacy and will never share your information with third parties.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
              Find Us
            </h2>
            <p className="text-xl text-gray-600">
              Located in the heart of Braunston village
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Placeholder */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="aspect-[16/10] bg-gradient-to-br from-terracotta-100 to-ivy-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-terracotta-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
                    <p className="text-gray-600 mb-4">
                      Detailed map integration would be implemented here
                    </p>
                    <Button variant="outline" asChild>
                      <a 
                        href="https://maps.google.com/?q=Braunston,Daventry,Northamptonshire" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Open in Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Directions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-5 w-5" />
                    <span>By Car</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">From M1 (Junction 18):</p>
                      <p className="text-gray-600">Follow A428 towards Daventry, then A45 to Braunston (8 minutes)</p>
                    </div>
                    <div>
                      <p className="font-medium">From Birmingham:</p>
                      <p className="text-gray-600">M6 to M1 South, exit Junction 18 (45 minutes)</p>
                    </div>
                    <div>
                      <p className="font-medium">From London:</p>
                      <p className="text-gray-600">M1 North to Junction 18 (1 hour 15 minutes)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Train className="h-5 w-5" />
                    <span>By Train</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Nearest Station:</p>
                      <p className="text-gray-600">Rugby (15 minutes by car/taxi)</p>
                    </div>
                    <div>
                      <p className="font-medium">From London:</p>
                      <p className="text-gray-600">Direct trains from Euston (1 hour)</p>
                    </div>
                    <div>
                      <p className="font-medium">From Birmingham:</p>
                      <p className="text-gray-600">Direct trains (45 minutes)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-terracotta-50 border-terracotta-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-terracotta-800 mb-2">Parking</h4>
                  <p className="text-sm text-terracotta-700">
                    Free on-site parking available for all guests. Additional spaces can be arranged if needed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 heading-gradient">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">What time is check-in?</h3>
                  <p className="text-gray-600 text-sm">
                    Check-in is from 3:00 PM to 8:00 PM. Late check-in can be arranged by contacting us in advance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Is parking included?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes, free on-site parking is included for all guests. Additional spaces available if needed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Can I book individual rooms?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes, you can book individual themed rooms or the entire house depending on your needs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Are pets allowed?</h3>
                  <p className="text-gray-600 text-sm">
                    Pets are welcome with prior arrangement. Please contact us to discuss your requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">What's included in the breakfast package?</h3>
                  <p className="text-gray-600 text-sm">
                    Premium local sausages, bacon, free-range eggs, artisanal bread, and preserves delivered fresh daily.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">How do I cancel my booking?</h3>
                  <p className="text-gray-600 text-sm">
                    Free cancellation up to 48 hours before check-in. Contact us by phone or email to cancel.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}