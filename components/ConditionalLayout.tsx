'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { SecurityGuard } from './SecurityGuard';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWatchPage = pathname?.startsWith('/watch');

  return (
    <>
      <SecurityGuard />
      {!isWatchPage && <Navbar />}
      <main className="flex-grow pb-16 lg:pb-0">
        {children}
      </main>
      {!isWatchPage && <MobileNav />}
      {!isWatchPage && <Footer />}
    </>
  );
}
