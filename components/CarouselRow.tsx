'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Movie } from '@/lib/tmdb';
import { MovieCard } from './MovieCard';

interface CarouselRowProps {
  title: string;
  movies: Movie[];
  /** If provided, shows a Movies/Series toggle and switches between the two datasets */
  altMovies?: Movie[];
  altLabel?: string;
  mainLabel?: string;
  viewAllLink?: string;
  layout?: 'portrait' | 'landscape';
}

export function CarouselRow({ 
  title, 
  movies, 
  altMovies, 
  altLabel = 'Series', 
  mainLabel = 'Movies',
  viewAllLink,
  layout = 'portrait'
}: CarouselRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeTab, setActiveTab] = useState<'main' | 'alt'>('main');

  const activeData = activeTab === 'main' ? movies : (altMovies || movies);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const canLeft = el.scrollLeft > 10;
    const canRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 10;
    setCanScrollLeft(prev => (prev !== canLeft ? canLeft : prev));
    setCanScrollRight(prev => (prev !== canRight ? canRight : prev));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        checkScroll();
        rafId = null;
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [checkScroll, activeData]);

  // Reset scroll position when switching tabs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!movies.length) return null;

  return (
    <section className="py-3 md:py-4 max-w-[1920px] mx-auto relative group/section">
      {/* Editorial Section Header (Synced with Movies, TV Shows & Trending) */}
      <div className="flex items-center justify-between mb-3.5 px-5 md:px-12 lg:px-16">
        <h2 className="text-[16px] md:text-[18px] font-semibold text-white tracking-tight flex items-center gap-2.5">
          <span className="w-1 h-4 md:h-5 bg-sage-500 rounded-full" />
          <span>{title}</span>
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Movies / Series Segmented Pill Toggle */}
          {altMovies && (
            <div className="flex items-center bg-[#141416] rounded-full p-0.5 border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveTab('main')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'main'
                    ? 'bg-white/[0.14] text-white font-semibold'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {mainLabel}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('alt')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'alt'
                    ? 'bg-white/[0.14] text-white font-semibold'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {altLabel}
              </button>
            </div>
          )}

          {/* Explore all Link */}
          <Link 
            href={viewAllLink || (title.toLowerCase().includes('tv') ? '/tv-shows' : '/movies')}
            className="text-xs font-medium text-white/55 hover:text-sage-400 transition-colors flex items-center gap-1 group"
          >
            <span>Explore all</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative px-5 md:px-12 lg:px-16">
        {/* Left Arrow (Desktop Only) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-2 md:left-4 top-[42%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/85 border border-white/15 items-center justify-center text-white/75 hover:text-white hover:bg-black hover:border-sage-500/40 transition-all duration-200 shadow-xl opacity-0 group-hover/section:opacity-100 focus:opacity-100 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Right Arrow (Desktop Only) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-2 md:right-4 top-[42%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/85 border border-white/15 items-center justify-center text-white/75 hover:text-white hover:bg-black hover:border-sage-500/40 transition-all duration-200 shadow-xl opacity-0 group-hover/section:opacity-100 focus:opacity-100 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-3.5 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {activeData.map((movie) => (
            <div
              key={movie.id}
              className={`flex-shrink-0 ${
                layout === 'landscape'
                  ? 'w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px]'
                  : 'w-[140px] sm:w-[155px] md:w-[170px] lg:w-[185px]'
              }`}
              style={{ scrollSnapAlign: 'start' }}
            >
              <MovieCard movie={movie} layout={layout} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
