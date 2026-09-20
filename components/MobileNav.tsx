'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Tv, TrendingUp, Search } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Movies', href: '/movies', icon: Film },
    { label: 'TV', href: '/tv-shows', icon: Tv },
    { label: 'Trending', href: '/trending', icon: TrendingUp },
    { label: 'Search', href: '/search', icon: Search },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 border-t border-white/5 px-4 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} className="relative flex flex-col items-center justify-center w-full h-full group active:scale-95 transition-transform duration-150">
              <div className={`${isActive ? 'text-red-500' : 'text-white/40 group-hover:text-white/70'} transition-colors duration-200`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1 font-bold tracking-tight uppercase ${isActive ? 'text-red-500' : 'text-white/30'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -top-[1px] w-8 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(229,9,20,0.5)] transition-all duration-200" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

