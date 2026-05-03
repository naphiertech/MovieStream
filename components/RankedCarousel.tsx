'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/lib/tmdb';
import { RankedMovieCard } from './RankedMovieCard';

interface RankedCarouselProps {
  title: string;
  movies: Movie[];
}

export function RankedCarousel({ title, movies }: RankedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!movies.length) return null;

  return (
    <section className="pt-8 pb-10 md:pt-10 md:pb-14 relative group/section overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8 px-6 md:px-14 lg:px-20">
        <h2 className="text-[20px] md:text-[24px] font-black text-white uppercase tracking-[0.5px] flex items-center gap-3">
          <span className="w-1.5 h-6 bg-[#2dd4bf] rounded-full shadow-[0_0_12px_rgba(45,212,191,0.5)]" />
          {title}
        </h2>
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
          className="flex gap-[30px] overflow-x-auto scrollbar-hide scroll-smooth px-6 md:px-14 lg:px-20 pb-6"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[220px] md:w-[240px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <RankedMovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
