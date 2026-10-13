'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GenreTile {
  name: string;
  id: string;
  image: string;
  tintClass: string;
}

const GENRE_TILES: GenreTile[] = [
  {
    name: 'Comedy',
    id: '35',
    image: 'https://image.tmdb.org/t/p/w780/qdIMHd4sEfJSckfVJfKQvisL02a.jpg',
    tintClass: 'from-[#284b6e]/95 via-[#284b6e]/55 to-transparent',
  },
  {
    name: 'Action',
    id: '28',
    image: 'https://image.tmdb.org/t/p/w780/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    tintClass: 'from-[#7a281d]/95 via-[#7a281d]/55 to-transparent',
  },
  {
    name: 'Drama',
    id: '18',
    image: 'https://image.tmdb.org/t/p/w780/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    tintClass: 'from-[#134e5e]/95 via-[#134e5e]/55 to-transparent',
  },
  {
    name: 'Horror',
    id: '27',
    image: 'https://image.tmdb.org/t/p/w780/tcheoA2nPATCm2vvXw2hVQoaEFD.jpg',
    tintClass: 'from-[#44207a]/95 via-[#44207a]/55 to-transparent',
  },
  {
    name: 'Romance',
    id: '10749',
    image: 'https://image.tmdb.org/t/p/w780/qJeU7KM4nT2C1WpOrwPcSDGFUWE.jpg',
    tintClass: 'from-[#821c35]/95 via-[#821c35]/55 to-transparent',
  },
  {
    name: 'Sci-Fi',
    id: '878',
    image: 'https://image.tmdb.org/t/p/w780/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    tintClass: 'from-[#1a4d36]/95 via-[#1a4d36]/55 to-transparent',
  },
  {
    name: 'Animation',
    id: '16',
    image: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    tintClass: 'from-[#743a15]/95 via-[#743a15]/55 to-transparent',
  },
  {
    name: 'Thriller',
    id: '53',
    image: 'https://image.tmdb.org/t/p/w780/i91mfvFcPPlaegcbOyjGgiWfZzh.jpg',
    tintClass: 'from-[#1f344d]/95 via-[#1f344d]/55 to-transparent',
  },
];

export function GenreRow() {
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
    <section className="py-3 md:py-4 max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[16px] md:text-[18px] font-semibold text-white tracking-tight">
          Genres
        </h2>
      </div>

      <div className="relative group/genres">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll genres left"
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black border border-white/15 items-center justify-center text-white shadow-xl transition-opacity cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll genres right"
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black border border-white/15 items-center justify-center text-white shadow-xl transition-opacity cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex items-center gap-3.5 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
        >
          {GENRE_TILES.map((genre) => (
            <Link
              key={genre.name}
              href={`/movies?genre=${genre.id}`}
              className="group relative flex-shrink-0 w-[210px] sm:w-[235px] md:w-[255px] h-[118px] sm:h-[130px] md:h-[140px] rounded-2xl overflow-hidden border border-white/[0.08] bg-zinc-900 shadow-lg md:transition-all md:duration-300 md:hover:scale-[1.02] md:hover:border-white/25"
            >
              <Image
                src={genre.image}
                alt={genre.name}
                fill
                className="object-cover object-center opacity-90 md:group-hover:opacity-100 md:group-hover:scale-105 md:transition-all md:duration-500 ease-out"
                sizes="260px"
                referrerPolicy="no-referrer"
              />
              {/* Left-to-right color-tinted atmospheric gradient (Matching Image 1) */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${genre.tintClass}`}
              />
              {/* Subtle bottom vignette for crisp title contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <span className="absolute bottom-3.5 left-4 z-10 text-[15px] md:text-[17px] font-bold text-white tracking-tight drop-shadow-md">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
