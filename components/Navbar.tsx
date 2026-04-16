'use client';

import Link from 'next/link';
import { Search, User, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'bg-black/30 backdrop-blur-xl border-b border-white/5 py-2 md:py-3' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="px-5 md:px-14 flex items-center justify-between max-w-[1920px] mx-auto">
        <div className="flex items-center gap-[60px]">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-white font-black text-[18px] md:text-[22px] tracking-tighter uppercase group italic"
            >
              <Zap className="text-[#2dd4bf] fill-[#2dd4bf] mr-1.5 md:mr-2 -rotate-12 group-hover:rotate-0 transition-transform duration-300 md:w-[26px] md:h-[26px]" size={22} />
              <div className="flex flex-col leading-[0.8]">
                <span>MOVIE</span>
                <span className="text-[#2dd4bf] drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">STREAM PRO</span>
              </div>
            </motion.div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-[35px] text-[12px] font-black uppercase tracking-[2px]">
            {[
              { label: 'Home', href: '/' },
              { label: 'Movies', href: '/movies' },
              { label: 'TV Shows', href: '/tv-shows' },
              { label: 'Trending', href: '/trending' },
              { label: 'API', href: 'https://www.vidking.net/', accent: true }
            ].map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className={`${item.accent ? 'text-[#2dd4bf]' : 'text-white/50'} hover:text-white transition-all duration-300 relative group flex items-center gap-1.5`}
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#2dd4bf] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <form onSubmit={handleSearch} className="hidden md:flex items-center group">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-[13px] rounded-full pl-11 pr-5 py-2.5 focus:outline-none focus:border-[#2dd4bf]/40 focus:bg-white/10 w-[240px] lg:w-[320px] transition-all duration-500 placeholder:text-white/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#2dd4bf] transition-colors" size={16} />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 md:px-6 py-2 md:py-2.5 rounded-full bg-[#2dd4bf] text-black font-black text-[10px] md:text-[12px] uppercase tracking-wider hover:bg-[#0ed2f7] transition-all duration-300 shadow-[0_4px_15px_rgba(45,212,191,0.2)]"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
