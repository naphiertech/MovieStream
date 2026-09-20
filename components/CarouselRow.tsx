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
  layout = 'landscape'
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
    <section className="py-8 md:py-12 relative group/section">
      {/* StreamCraze Style Header */}
      <div className="flex items-center justify-between mb-6 px-6 md:px-14 lg:px-20">
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-outfit">
          {title}
        </h2>
        
        <div className="flex items-center gap-4">
          {/* Movies / Series Toggle */}
          {altMovies && (
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/5">
              <button
                onClick={() => setActiveTab('main')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-[1.5px] transition-all duration-300 ${
                  activeTab === 'main'
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {mainLabel}
              </button>
              <button
                onClick={() => setActiveTab('alt')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-[1.5px] transition-all duration-300 ${
                  activeTab === 'alt'
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {altLabel}
              </button>
            </div>
          )}

          {/* Explore all Link */}
          <Link 
            href={viewAllLink || (title.toLowerCase().includes('tv') ? '/tv-shows' : '/movies')}
            className="text-xs md:text-sm font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 group"
          >
            Explore all 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative px-6 md:px-14 lg:px-20">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/90 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black hover:border-red-600/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] opacity-0 group-hover/section:opacity-100 focus:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/90 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black hover:border-red-600/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] opacity-0 group-hover/section:opacity-100 focus:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Scrollable Track with Partial Right Cutoff Hint */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pr-12 md:pr-20"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {activeData.map((movie) => (
            <div
              key={movie.id}
              className={`flex-shrink-0 transition-all duration-300 ${
                layout === 'landscape'
                  ? 'w-[220px] sm:w-[240px] md:w-[260px] lg:w-[285px]'
                  : 'w-[140px] sm:w-[155px] md:w-[175px] lg:w-[190px]'
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
