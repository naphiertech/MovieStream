import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { Footer } from '@/components/Footer';
import { ClientTransition } from '@/components/ClientTransition';
import { AntiInspect } from '@/components/AntiInspect';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'MovieStream Pro - Premium Cinematic Streaming',
  description: 'The elite destination for movies and TV shows online.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MovieStream Pro',
  },
};

export const viewport = {
  themeColor: '#2dd4bf',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className="bg-bg-dark text-white min-h-screen flex flex-col selection:bg-[#2dd4bf]/30" suppressHydrationWarning>
        <ServiceWorkerRegister />
        <AntiInspect />
        <Navbar />
        <main className="flex-grow">
          <ClientTransition>
            {children}
          </ClientTransition>
        </main>
        <MobileNav />
        <Footer />
      </body>
    </html>
  );
}
