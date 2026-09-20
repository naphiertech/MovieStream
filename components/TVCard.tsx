'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { Star } from 'lucide-react';

interface TVCardProps {
  show: Movie;
}

export const TVCard = memo(function TVCard({ show }: TVCardProps) {
  return (
    <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]">
      <Link href={`/tv/${show.id}`} prefetch={false} className="block h-full">
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-[#2dd4bf]/40 transition-all duration-300 shadow-xl">
          <Image
            src={show.posterUrl || PLACEHOLDERS.POSTER}
            alt={show.title}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 190px"
            referrerPolicy="no-referrer"
            unoptimized={!show.posterUrl}
          />
          
          {/* Top-Left Tag - "SERIES" or "ANIME" */}
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 rounded-md border border-white/10 z-10">
            <span className="text-white text-[9px] font-black uppercase tracking-widest">
              {show.genres.includes('Animation') ? 'Anime' : 'Series'}
            </span>
          </div>

          {/* Top-Right Tag - Rating */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 rounded-md border border-white/10 z-10 flex items-center gap-1.5">
            <Star size={10} className="text-[#2dd4bf] fill-[#2dd4bf]" />
            <span className="text-white text-[10px] font-black">{show.rating.toFixed(1)}</span>
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end">
            <h4 className="text-[13px] md:text-[14px] font-black text-white uppercase tracking-tight line-clamp-2 group-hover:text-[#2dd4bf] transition-colors duration-200">
              {show.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-[9px] font-black text-[#2dd4bf] uppercase tracking-[1px]">{show.year}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

