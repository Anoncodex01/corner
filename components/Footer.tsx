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
              <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center bg-white">
                <img src="/images/logo.png" alt="Logo" className="object-contain w-12 h-12" />
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
                  className="w-9 h-9 flex items-center justify-center bg-brand-primary-100/80 text-brand-primary-600 rounded-full transition-all duration-300 hover:bg-brand-primary-500 hover:text-white hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
              </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
                  Our Rooms
                </Link>
              </li>
              <li>
                <Link href="/places" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
                  Places of Interest
                </Link>
              </li>
              <li>
                <Link href="/addons" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
                  Add-ons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-brand-primary-500 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-sm">Braunston, Daventry</p>
                  <p className="text-gray-600 text-sm">Northamptonshire, UK</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-brand-primary-500" />
                <a href="tel:+441788890123" className="text-gray-600 hover:text-brand-primary-600 transition-colors text-sm">
                  +44 (0) 1788 890 123
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-brand-primary-500" />
                <a href="mailto:hello@cornerhouse-braunston.com" className="text-gray-600 hover:text-brand-primary-600 transition-colors text-sm">
                  hello@cornerhouse-braunston.com
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for special offers and updates.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
              />
              <Button size="sm" className="bg-brand-primary-600 hover:bg-brand-primary-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © 2024 The Corner House. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}