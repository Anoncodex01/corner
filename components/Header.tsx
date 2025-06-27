'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Calendar, MapPin, Utensils, Phone, Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Rooms & Booking', href: '/booking', icon: Calendar },
  { name: 'Our Add-ons', href: '/addons', icon: Plus },
  { name: 'Food & Drink', href: '/food-drink', icon: Utensils },
  { name: 'Local Area', href: '/places', icon: MapPin },
  { name: 'Contact Us', href: '/contact', icon: Phone },
];

const mobileNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Rooms', href: '/rooms', icon: Calendar },
  { name: 'Food & Drink', href: '/food-drink', icon: Utensils },
  { name: 'Add-ons', href: '/addons', icon: Plus },
  { name: 'Contact', href: '/contact', icon: Phone },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm'
          : 'bg-white/50'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-18 h-18 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:rounded-lg group-hover:scale-105 bg-white">
              <img src="https://l.icdbcdn.com/oh/ae2c3d70-aade-4076-96e7-f8fe48bb6611.png?w=400" alt="Logo" className="object-contain w-16 h-16" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 bg-white/60 backdrop-blur-sm p-1 rounded-full border shadow-sm">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-primary-500 text-white shadow'
                      : 'text-gray-600 hover:text-brand-primary-700 hover:bg-brand-primary-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA and Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Button asChild className="hidden lg:flex btn-primary rounded-full shadow-md hover:shadow-lg transition-shadow">
              <Link href="/booking">Book Your Stay</Link>
            </Button>

            <Sheet>
            <SheetTrigger asChild>
              <Button
                  variant="outline"
                size="icon"
                  className="lg:hidden rounded-full"
              >
                  <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle asChild>
                    <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-lg flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-playfair text-brand-primary-800">
                      The Corner House
                    </h2>
                  </div>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="mt-8 flex flex-col space-y-2">
                  {mobileNavigation.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                          pathname === item.href
                            ? 'bg-brand-primary-100 text-brand-primary-800'
                            : 'text-gray-700 hover:bg-brand-primary-50'
                        }`}
                      >
                        <item.icon className="h-5 w-5 text-brand-primary-600" />
                        <span>{item.name}</span>
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t">
                  <SheetClose asChild>
                    <Button asChild className="w-full btn-primary rounded-full">
                      <Link href="/booking">
                      Book Your Stay
                    </Link>
                  </Button>
                  </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}