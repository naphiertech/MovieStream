'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { Star, Info } from 'lucide-react';

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={movie.type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`} className="relative cursor-pointer group block">
      <div className="aspect-[2/3] bg-white/5 rounded-2xl overflow-hidden mb-4 border border-white/5 relative shadow-2xl group-hover:border-[#2dd4bf]/40 transition-all duration-500 card-hover-glow group-hover:scale-[1.03]">
        <Image
          src={movie.posterUrl || PLACEHOLDERS.POSTER}
          alt={movie.title}
          fill
          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
          referrerPolicy="no-referrer"
          unoptimized={!movie.posterUrl}
        />
        
        <div className="absolute top-3 right-3 bg-black/70 text-[9px] px-2 py-1 rounded-lg font-black z-10 text-[#2dd4bf] tracking-wider flex items-center gap-1 shadow-lg border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
          4K
        </div>

        {/* Default State Bottom Gradient (Rating/Genre) */}
        <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <div className="flex items-center gap-1.5 mb-1">
            <Star size={10} className="text-[#2dd4bf] fill-[#2dd4bf]" />
            <span className="text-white font-black text-[10px]">{movie.rating.toFixed(1)}</span>
          </div>
          <p className="text-[10px] text-white/70 font-medium">
            {movie.genres?.[0] || (movie.type === 'tv' ? 'Series' : 'Movie')} • {movie.year}
          </p>
        </div>

        {/* Hover Details Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 z-20">
          <p className="text-[11px] md:text-xs text-white/90 line-clamp-4 mb-4 leading-relaxed font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {movie.description || "No description available."}
          </p>
          <div className="flex justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-white/20 bg-black/40 text-white text-[11px] font-medium shadow-xl">
              <Info size={12} />
              Details
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col px-1">
        <h4 className="text-[14px] font-black text-white whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-[#2dd4bf] transition-colors duration-300 tracking-tight uppercase">
          {movie.title}
        </h4>
      </div>
    </Link>
  );
}

interface MovieCardProps {
  movie: Movie;
}
