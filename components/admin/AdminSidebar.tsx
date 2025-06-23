'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Building, 
  Bed, 
  DollarSign, 
  Settings, 
  BarChart3,
  Users,
  Tag,
  CalendarDays
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Calendar', href: '/admin/calendar', icon: CalendarDays },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Properties', href: '/admin/properties', icon: Building },
  { name: 'Rooms', href: '/admin/rooms', icon: Bed },
  { name: 'Pricing Rules', href: '/admin/pricing', icon: DollarSign },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Guests', href: '/admin/guests', icon: Users },
  { name: 'Add-ons', href: '/admin/addons', icon: Tag },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-terracotta-500 to-ivy-500 rounded-lg flex items-center justify-center">
            <Home className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-600">The Corner House</p>
          </div>
        </div>
      </div>

      <nav className="px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-terracotta-100 text-terracotta-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}