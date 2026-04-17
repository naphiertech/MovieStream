import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { Footer } from '@/components/Footer';
import { ClientTransition } from '@/components/ClientTransition';
import { AntiInspect } from '@/components/AntiInspect';

export const metadata: Metadata = {
  title: 'MovieStream Pro - Premium Cinematic Streaming',
  description: 'The elite destination for movies and TV shows online.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className="bg-bg-dark text-white min-h-screen flex flex-col selection:bg-[#2dd4bf]/30" suppressHydrationWarning>
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
