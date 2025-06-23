import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Corner House - Luxury Accommodation in Braunston',
  description: 'Book your stay at The Corner House, a beautifully renovated 5-bedroom property in Braunston, Daventry. Choose from themed suites or book the entire house.',
  keywords: 'accommodation, booking, Braunston, Daventry, luxury, B&B, vacation rental',
  authors: [{ name: 'The Corner House' }],
  openGraph: {
    title: 'The Corner House - Luxury Accommodation in Braunston',
    description: 'Book your stay at The Corner House, a beautifully renovated 5-bedroom property in Braunston, Daventry.',
    url: 'https://thecornerhouse-braunston.com',
    siteName: 'The Corner House',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Corner House Braunston',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Corner House - Luxury Accommodation in Braunston',
    description: 'Book your stay at The Corner House, a beautifully renovated 5-bedroom property in Braunston, Daventry.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}