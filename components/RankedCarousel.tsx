'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Movie } from '@/lib/tmdb';
import { RankedMovieCard } from './RankedMovieCard';

interface RankedCarouselProps {
  title: string;
  movies: Movie[];
  exploreLink?: string;
}

export function RankedCarousel({ title, movies, exploreLink = '/trending' }: RankedCarouselProps) {
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
    <section className="py-8 md:py-12 relative group/section overflow-hidden">
      {/* StreamCraze Style Header */}
      <div className="flex items-center justify-between mb-6 px-6 md:px-14 lg:px-20">
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-outfit">
          {title}
        </h2>
        {exploreLink && (
          <Link 
            href={exploreLink} 
            className="text-xs md:text-sm font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 group"
          >
            Explore all 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative px-6 md:px-14 lg:px-20">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black hover:border-red-600/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] opacity-0 group-hover/section:opacity-100 focus:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black hover:border-red-600/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] opacity-0 group-hover/section:opacity-100 focus:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4 pr-12 md:pr-20"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="flex-shrink-0"
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
