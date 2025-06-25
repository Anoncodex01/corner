"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
    </div>
  );
} 