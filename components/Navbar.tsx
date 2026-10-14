'use client';

import Link from 'next/link';
import {
  Search,
  User,
  Sparkles,
  Star,
  Clapperboard,
  MonitorPlay,
  Home,
  Film,
  Tv,
  Flame,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const navbarSearchCache = new Map<string, any[]>();

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Movies', href: '/movies', icon: Film },
  { label: 'TV Shows', href: '/tv-shows', icon: Tv },
  { label: 'Trending', href: '/trending', icon: Flame },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isDetailPage = Boolean(pathname?.startsWith('/movie/') || pathname?.startsWith('/tv/'));

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const scrolled = window.scrollY > 10;
        setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
        rafId = null;
      });
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if (!searchQuery.trim()) {
          setIsSearchOpen(false);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

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
          signal: controller.signal,
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
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearchOpen(false);

    if (suggestion.type === 'tv') {
      router.push(`/tv/${suggestion.id}`);
    } else {
      router.push(`/movie/${suggestion.id}`);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gradient-to-b from-black/90 via-black/60 to-transparent py-3'
            : 'bg-gradient-to-b from-black/70 via-black/25 to-transparent py-4 md:py-5'
        }`}
      >
        <div className="px-5 md:px-12 lg:px-16 flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Left: Folded 'M' Ribbon Emblem + Optional Back Button */}
          <div className="flex items-center gap-2.5 md:gap-3.5">
            {isDetailPage && (
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.history.length > 1) {
                    router.back();
                  } else {
                    router.push(pathname?.startsWith('/tv') ? '/tv-shows' : '/movies');
                  }
                }}
                aria-label="Go back"
                className="group flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-[#18181b]/85 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer active:scale-95 shadow-md"
              >
                <ArrowLeft size={16} className="md:group-hover:-translate-x-0.5 md:transition-transform" />
              </button>
            )}

            <Link
              href="/"
              aria-label="MovieStream Home"
              className="group relative flex items-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <svg
                viewBox="0 0 40 40"
                className="w-8 h-8 md:w-9 md:h-9 drop-shadow-[0_4px_14px_rgba(132,169,140,0.45)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="ms-stem-left" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6b8f74" />
                    <stop offset="100%" stopColor="#354f52" />
                  </linearGradient>
                  <linearGradient id="ms-stem-right" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6b8f74" />
                    <stop offset="100%" stopColor="#354f52" />
                  </linearGradient>
                  <linearGradient id="ms-ribbon-fold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a7c2af" />
                    <stop offset="50%" stopColor="#84a98c" />
                    <stop offset="100%" stopColor="#52796f" />
                  </linearGradient>
                </defs>
                {/* Left Stem */}
                <path d="M5 4H12V36H5V4Z" fill="url(#ms-stem-left)" />
                {/* Right Stem */}
                <path d="M28 4H35V36H28V4Z" fill="url(#ms-stem-right)" />
                {/* Right Inner Fold */}
                <path d="M28 4H35L23 29H17L28 4Z" fill="#52796f" />
                {/* Left Top-Over Fold Ribbon */}
                <path
                  d="M5 4H12L23 29H17L5 4Z"
                  fill="url(#ms-ribbon-fold)"
                  style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))' }}
                />
              </svg>
            </Link>
          </div>

          {/* Right: Unified Floating Glass Pill Dock */}
          <div
            ref={searchRef}
            className="relative flex items-center bg-[#18181b]/85 backdrop-blur-xl border border-white/[0.08] rounded-xl p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.75)]"
          >
            {/* Desktop Navigation Links inside Pill */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[9px] text-[13px] transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white/[0.14] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                        : 'text-white/65 hover:text-white hover:bg-white/[0.06] font-medium'
                    }`}
                  >
                    <Icon
                      size={15}
                      strokeWidth={isActive ? 2.3 : 1.9}
                      className={isActive ? 'text-white' : 'text-white/65'}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Subtle Divider */}
            <div className="hidden lg:block w-[1px] h-4 bg-white/[0.12] mx-1.5" />

            {/* Expandable Inline Search + Action Icons */}
            <div className="flex items-center gap-1">
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-white/[0.08] border border-white/[0.12] focus-within:border-sage-400/50 rounded-[9px] px-2.5 py-1 transition-all duration-200"
                >
                  <Search
                    size={15}
                    className={`mr-2 flex-shrink-0 ${
                      isSearching ? 'text-sage-400 animate-pulse' : 'text-white/50'
                    }`}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search titles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                    className="bg-transparent text-white text-[13px] w-[150px] sm:w-[210px] focus:outline-none placeholder:text-white/35"
                  />
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                      setIsSearchOpen(false);
                    }}
                    className="ml-1.5 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  aria-label="Search titles"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-[9px] text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors duration-200 cursor-pointer"
                >
                  <Search size={16} strokeWidth={2} />
                </button>
              )}

              <button
                type="button"
                aria-label="User Account"
                onClick={handleSignInClick}
                className="p-2 rounded-[9px] text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors duration-200 cursor-pointer"
              >
                <User size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Search Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2.5 right-0 w-[300px] sm:w-[360px] lg:w-[400px] bg-[#121214]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full flex items-center gap-3.5 p-2 hover:bg-white/[0.06] rounded-xl transition-all group text-left cursor-pointer"
                    >
                      <div className="relative w-11 h-15 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                        {item.posterUrl ? (
                          <Image
                            src={item.posterUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="44px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <Clapperboard size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-[13px] font-semibold truncate group-hover:text-sage-400 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold py-0.5 px-1.5 rounded bg-white/5 text-white/45 uppercase tracking-tight">
                            {item.type === 'tv' ? (
                              <MonitorPlay size={10} />
                            ) : (
                              <Clapperboard size={10} />
                            )}
                            {item.type === 'tv' ? 'Series' : 'Movie'}
                          </span>
                          <span className="text-[11px] text-white/30 font-medium">
                            {item.year}
                          </span>
                          <span className="flex items-center gap-0.5 text-[11px] text-sage-400 font-bold">
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
        </div>
      </header>

      {showComingSoon && (
        <div className="fixed bottom-10 right-6 md:right-14 z-[100] px-6 py-4 bg-[#0a0a0a]/95 border border-sage-600/30 rounded-2xl flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(132,169,140,0.2)] animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-10 h-10 rounded-full bg-sage-600/10 flex items-center justify-center text-sage-400">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-white font-black text-[11px] uppercase tracking-[2px]">
              Authenticating Protocol
            </p>
            <p className="text-sage-400 font-bold text-[13px]">
              User Hub Coming Early Next Week
            </p>
          </div>
        </div>
      )}
    </>
  );
}

