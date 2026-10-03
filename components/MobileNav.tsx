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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c0c0c] border-t border-white/10 px-4 pb-[env(safe-area-inset-bottom,0px)] select-none">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              prefetch={false}
              className="relative flex flex-col items-center justify-center w-full h-full group"
            >
              <div className={isActive ? 'text-sage-400' : 'text-white/40'}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1 font-bold tracking-tight uppercase ${isActive ? 'text-sage-400' : 'text-white/30'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -top-[1px] w-8 h-[2px] bg-sage-600 shadow-[0_0_8px_rgba(132,169,140,0.6)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

