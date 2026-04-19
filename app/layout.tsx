import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { Footer } from '@/components/Footer';
import { ClientTransition } from '@/components/ClientTransition';
import { AntiInspect } from '@/components/AntiInspect';
import Script from 'next/script';

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
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(reg) {
                  console.log('SW registered:', reg.scope);
                }).catch(function(err) {
                  console.log('SW registration failed:', err);
                });
              });
            }
          `}
        </Script>
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
