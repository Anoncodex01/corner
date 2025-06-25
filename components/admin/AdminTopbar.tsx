"use client";
import { Bell, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminTopbar() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdmin');
      window.location.href = '/admin-login';
    }
  };
  return (
    <div className="flex items-center justify-end w-full h-16 px-6 bg-white border-b shadow-sm">
      <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors mr-4">
        <Bell className="h-6 w-6 text-gray-500" />
        {/* Notification dot (optional) */}
        {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
      </button>
      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2">
        <User className="h-6 w-6 text-gray-500" />
      </button>
      <button
        onClick={handleLogout}
        className="ml-2 px-3 py-1 rounded bg-terracotta-600 text-white text-sm font-medium hover:bg-terracotta-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
} 