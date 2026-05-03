'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
}

export function CarouselRow({ 
  title, 
  movies, 
  altMovies, 
  altLabel = 'Series', 
  mainLabel = 'Movies',
  viewAllLink 
}: CarouselRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeTab, setActiveTab] = useState<'main' | 'alt'>('main');

  const activeData = activeTab === 'main' ? movies : (altMovies || movies);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
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
    // Scroll by ~4 card widths
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!movies.length) return null;

  return (
    <section className="py-6 md:py-8 relative group/section">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 md:mb-6 px-6 md:px-14 lg:px-20">
        <div className="flex items-center gap-4">
          <h2 className="text-[18px] md:text-[22px] font-black text-white uppercase tracking-[0.5px] flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#2dd4bf] rounded-full shadow-[0_0_12px_rgba(45,212,191,0.5)]" />
            {title}
          </h2>
          
          {!altMovies && viewAllLink && (
            <a 
              href={viewAllLink}
              className="text-[10px] md:text-[11px] font-black uppercase tracking-[2px] text-white/30 hover:text-[#2dd4bf] transition-colors flex items-center gap-2 group/link"
            >
              View All
              <div className="w-4 h-[1px] bg-white/20 group-hover/link:bg-[#2dd4bf] group-hover/link:w-8 transition-all" />
            </a>
          )}
        </div>

        {/* Movies / Series Toggle */}
        {altMovies && (
          <div className="flex items-center gap-3">
            {viewAllLink && (
              <a 
                href={viewAllLink}
                className="hidden sm:flex text-[10px] font-black uppercase tracking-[2px] text-white/20 hover:text-[#2dd4bf] transition-colors items-center gap-2 mr-4"
              >
                View All
              </a>
            )}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/5">
              <button
                onClick={() => setActiveTab('main')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-[1.5px] transition-all duration-300 ${
                  activeTab === 'main'
                    ? 'bg-[#2dd4bf] text-black shadow-[0_0_15px_rgba(45,212,191,0.3)]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {mainLabel}
              </button>
              <button
                onClick={() => setActiveTab('alt')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-[1.5px] transition-all duration-300 ${
                  activeTab === 'alt'
                    ? 'bg-[#2dd4bf] text-black shadow-[0_0_15px_rgba(45,212,191,0.3)]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {altLabel}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 hover:border-[#2dd4bf]/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] opacity-0 group-hover/section:opacity-100 focus:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 hover:border-[#2dd4bf]/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] opacity-0 group-hover/section:opacity-100 focus:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Left Fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#060606] to-transparent z-10 pointer-events-none" />
        )}

        {/* Right Fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#060606] to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-6 md:px-14 lg:px-20"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {activeData.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[140px] sm:w-[155px] md:w-[175px] lg:w-[190px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
