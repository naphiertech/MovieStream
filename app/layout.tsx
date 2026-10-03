import type { Metadata } from 'next';
import './globals.css';
import { ConditionalLayout } from '@/components/ConditionalLayout';
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
  themeColor: '#84a98c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className="bg-bg-dark text-white min-h-screen flex flex-col selection:bg-[#84a98c]/30" suppressHydrationWarning>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // In local dev, unregister service workers and clear caches to prevent Next.js HMR compilation errors
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (let registration of registrations) {
                    registration.unregister().then(function(success) {
                      if (success) console.log('Dev SW unregistered successfully');
                    });
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(keys) {
                    keys.forEach(function(key) {
                      caches.delete(key);
                    });
                  });
                }
              } else {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('SW registered:', reg.scope);
                  }).catch(function(err) {
                    console.log('SW registration failed:', err);
                  });
                });
              }
            }
          `}
        </Script>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
