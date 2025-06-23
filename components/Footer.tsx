import Link from 'next/link';
import { Home, Mail, Phone, MapPin, Calendar, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-50 bg-hero-pattern text-gray-700 border-t">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-500 to-ivy-500 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rounded-lg group-hover:scale-105">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-playfair text-terracotta-800">The Corner House</h3>
                <p className="text-sm text-ivy-700 -mt-1 font-medium">Braunston, Daventry</p>
              </div>
            </Link>
            <p className="text-gray-600 mb-6 text-sm">
              A beautifully renovated 5-bedroom property offering luxury accommodation in the heart of Braunston.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-9 h-9 flex items-center justify-center bg-terracotta-100/80 text-terracotta-600 rounded-full transition-all duration-300 hover:bg-terracotta-500 hover:text-white hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-terracotta-800">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Make a Booking', 'Add-ons', 'Food & Drink', 'Places of Interest'].map((item, index) => (
                <li key={index}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-gray-600 hover:text-terracotta-700 hover:underline underline-offset-4 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-terracotta-800">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-terracotta-600 flex-shrink-0 mt-1" />
                <span className="text-gray-600">Braunston, Daventry,<br />Northamptonshire</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-terracotta-600 flex-shrink-0" />
                <a href="tel:+4401788890123" className="text-gray-600 hover:text-terracotta-700 transition-colors">+44 (0) 1788 890 123</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-terracotta-600 flex-shrink-0" />
                <a href="mailto:hello@cornerhouse-braunston.com" className="text-gray-600 hover:text-terracotta-700 transition-colors">hello@cornerhouse-braunston.com</a>
              </li>
            </ul>
          </div>

          {/* Booking */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-terracotta-800">Book Your Stay</h4>
            <p className="text-gray-600 mb-4 text-sm">
              Ready to experience luxury accommodation in Braunston?
            </p>
            <Button asChild className="btn-primary rounded-full shadow-md hover:shadow-lg transition-shadow">
              <Link href="/booking">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Check Availability</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-terracotta-100 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} The Corner House. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-terracotta-700 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-terracotta-700 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}