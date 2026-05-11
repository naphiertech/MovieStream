'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { Play } from 'lucide-react';

export function RankedMovieCard({ movie, index }: RankedMovieCardProps) {
  return (
    <div className="relative flex items-center group cursor-pointer h-[320px] ranked-card-enter">
      {/* Huge Background Number */}
      <div className="absolute -left-2 bottom-0 select-none z-0 pointer-events-none translate-y-4">
        <span className="text-[220px] font-black leading-none text-outline group-hover:text-neon group-hover:scale-105 transition-all duration-700 block italic opacity-40 group-hover:opacity-100">
          {index + 1}
        </span>
      </div>

      {/* Poster Container */}
      <Link href={movie.type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`} className="relative z-10 block ml-20 w-full h-[280px]">
        <div className="relative h-full aspect-[2/3] bg-white/5 rounded-2xl overflow-hidden border border-white/5 shadow-2xl group-hover:border-[#2dd4bf]/40 group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500 card-hover-glow">
          <Image
            src={movie.posterUrl || PLACEHOLDERS.POSTER}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 33vw, 20vw"
            referrerPolicy="no-referrer"
            unoptimized={!movie.posterUrl}
          />
          
          <div className="absolute top-3 right-3 bg-black/70 border border-white/10 text-[9px] px-2 py-1 rounded-lg font-black text-[#2dd4bf] shadow-lg">
            PRO
          </div>
          
          {/* Interaction Overlay — no backdrop-blur */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#2dd4bf] flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.6)] scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play size={24} fill="black" className="ml-1 text-black" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

interface RankedMovieCardProps {
  movie: Movie;
  index: number;
}
