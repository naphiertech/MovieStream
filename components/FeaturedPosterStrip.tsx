'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';

interface FeaturedPosterStripProps {
  title: string;
  items: Movie[];
}

function formatShortReleaseDate(dateStr?: string, fallbackYear?: number): string {
  if (!dateStr) return fallbackYear ? String(fallbackYear) : '';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return fallbackYear ? String(fallbackYear) : '';
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function FeaturedPosterStrip({ title, items }: FeaturedPosterStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const distance = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative py-6">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[13.5px] md:text-[14.5px] font-semibold text-white/90 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="relative group/strip">
        <div
          ref={scrollRef}
          className="flex items-start gap-3.5 overflow-x-auto scrollbar-hide carousel-track pb-2"
        >
          {items.slice(0, 18).map((item) => {
            const posterSrc = item.posterUrl || PLACEHOLDERS.POSTER;
            const href =
              item.type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
            const dateLabel = formatShortReleaseDate(
              item.releaseDate,
              item.year
            );

            return (
              <Link
                key={item.id}
                href={href}
                prefetch={false}
                className="flex-shrink-0 w-[118px] sm:w-[130px] md:w-[142px] group cursor-pointer"
              >
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.07] mb-2 md:transition-transform md:duration-300 md:group-hover:scale-[1.02] md:group-hover:border-sage-500/40">
                  <Image
                    src={posterSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 125px, 145px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    unoptimized={!posterSrc.startsWith('http')}
                  />
                </div>
                <h3 className="text-[12px] font-semibold text-white truncate group-hover:text-sage-400 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-medium">
                  <span className="text-sage-400 font-semibold flex items-center gap-0.5">
                    <Star size={10} className="fill-sage-400 text-sage-400" />
                    {item.rating > 0 ? item.rating.toFixed(1) : 'NR'}
                  </span>
                  {dateLabel && (
                    <>
                      <span className="text-white/25">•</span>
                      <span className="text-white/45">{dateLabel}</span>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Left / Right Scroll Arrows */}
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByAmount('left')}
          className="hidden md:flex absolute left-2 top-[38%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/75 hover:bg-black border border-white/15 text-white items-center justify-center opacity-0 group-hover/strip:opacity-100 transition-opacity cursor-pointer shadow-xl"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByAmount('right')}
          className="hidden md:flex absolute right-2 top-[38%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/75 hover:bg-black border border-white/15 text-white items-center justify-center opacity-90 group-hover/strip:opacity-100 transition-opacity cursor-pointer shadow-xl"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
