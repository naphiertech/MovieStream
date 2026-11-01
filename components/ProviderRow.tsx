'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WATCH_PROVIDERS } from '@/lib/tmdb';

export function ProviderRow() {
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
    const distance = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-3 md:py-4 max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16 relative z-20">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[16px] md:text-[18px] font-semibold text-white tracking-tight flex items-center gap-2.5">
          <span className="w-1 h-4 md:h-5 bg-sage-500 rounded-full" />
          <span>Browse by Provider</span>
        </h2>
      </div>

      <div className="relative group/providers">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll providers left"
            className="hidden md:flex absolute left-2 top-8 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/85 hover:bg-black border border-white/15 items-center justify-center text-white shadow-xl opacity-0 group-hover/providers:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll providers right"
            className="hidden md:flex absolute right-2 top-8 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/85 hover:bg-black border border-white/15 items-center justify-center text-white shadow-xl opacity-0 group-hover/providers:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex items-start gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
        >
          {WATCH_PROVIDERS.map((provider) => (
            <Link
              key={provider.id}
              href={`/provider/${provider.id}`}
              className="group flex flex-col items-center flex-shrink-0 w-[68px] sm:w-[74px] md:w-[80px] text-center"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] rounded-[16px] overflow-hidden border border-white/[0.1] bg-zinc-900 shadow-lg md:transition-all md:duration-300 md:group-hover:scale-105 md:group-hover:border-sage-400/50 md:group-hover:shadow-[0_0_20px_rgba(132,169,140,0.25)]">
                <Image
                  src={provider.logoUrl}
                  alt={provider.name}
                  fill
                  sizes="76px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-medium text-white/60 group-hover:text-white leading-tight line-clamp-2 transition-colors">
                {provider.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
