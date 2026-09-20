'use client';

import Link from 'next/link';
import { Search, User, Zap, Sparkles, Star, Clapperboard, MonitorPlay } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const navbarSearchCache = new Map<string, any[]>();

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const scrolled = window.scrollY > 10;
        setIsScrolled(prev => (prev !== scrolled ? scrolled : prev));
        rafId = null;
      });
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (navbarSearchCache.has(trimmed)) {
      setSuggestions(navbarSearchCache.get(trimmed) || []);
      setShowSuggestions(true);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal
        });
        if (response.ok) {
          const data = await response.json();
          const topSix = data.slice(0, 6);
          navbarSearchCache.set(trimmed, topSix);
          setSuggestions(topSix);
          setShowSuggestions(true);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
        }
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  const handleSignInClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    
    if (suggestion.type === 'tv') {
      router.push(`/tv/${suggestion.id}`);
    } else {
      router.push(`/movie/${suggestion.id}`);
    }
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0a]/95 border-b border-white/5 py-2 md:py-3 shadow-2xl' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="px-5 md:px-14 flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-[60px]">
            <Link href="/">
              <div className="flex items-center gap-2 group cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                  <svg className="w-4 h-4 md:w-5 md:h-5 fill-white ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-white font-black text-xl md:text-2xl tracking-tighter uppercase font-outfit italic">
                  Movie<span className="text-red-500">Stream</span>
                </span>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-[35px] text-[12px] font-black uppercase tracking-[2px]">
              {[
                { label: 'Home', href: '/' },
                { label: 'Movies', href: '/movies' },
                { label: 'TV Shows', href: '/tv-shows' },
                { label: 'Genres', href: '/genres' },
                { label: 'Trending', href: '/trending' }
              ].map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className="text-white/50 hover:text-white transition-all duration-200 relative group flex items-center gap-1.5"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-red-600 transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div ref={searchRef} className="hidden md:flex items-center group relative">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                  className="bg-white/5 border border-white/10 text-white text-[13px] rounded-full pl-11 pr-5 py-2.5 focus:outline-none focus:border-red-600/40 focus:bg-white/10 w-[240px] lg:w-[320px] transition-all duration-300 placeholder:text-white/20"
                />
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-red-500 animate-pulse' : 'text-white/20 group-focus-within:text-red-500'}`} size={16} />
              </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-3 right-0 w-[320px] lg:w-[400px] bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl transition-all group text-left"
                    >
                      <div className="relative w-12 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                        {item.posterUrl ? (
                          <Image 
                            src={item.posterUrl} 
                            alt={item.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <Clapperboard size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-[13px] font-black uppercase tracking-tight truncate group-hover:text-red-500 transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold py-0.5 px-1.5 rounded bg-white/5 text-white/40 uppercase tracking-tighter">
                            {item.type === 'tv' ? <MonitorPlay size={10} /> : <Clapperboard size={10} />}
                            {item.type === 'tv' ? 'Series' : 'Movie'}
                          </span>
                          <span className="text-[10px] text-white/20 font-bold">{item.year}</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-red-500 font-black">
                            <Star size={10} fill="currentColor" />
                            {item.rating}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleSignInClick}
                className="px-5 md:px-6 py-2 md:py-2.5 rounded-full bg-red-600 text-white font-black text-[10px] md:text-[12px] uppercase tracking-wider hover:bg-red-500 active:scale-95 transition-all duration-200 shadow-[0_4px_15px_rgba(229,9,20,0.3)]"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {showComingSoon && (
        <div className="fixed bottom-10 right-6 md:right-14 z-[100] px-6 py-4 bg-[#0a0a0a]/95 border border-red-600/30 rounded-2xl flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(229,9,20,0.2)] animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center text-red-500">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-white font-black text-[11px] uppercase tracking-[2px]">Authenticating Protocol</p>
            <p className="text-red-500 font-bold text-[13px]">User Hub Coming Early Next Week</p>
          </div>
        </div>
      )}
    </>
  );
}
