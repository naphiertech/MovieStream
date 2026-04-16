'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link href={movie.type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`} className="relative cursor-pointer group block">
        <div className="aspect-[2/3] bg-white/5 rounded-2xl overflow-hidden mb-4 border border-white/5 relative shadow-2xl group-hover:border-[#2dd4bf]/40 transition-all duration-500 card-hover-glow">
          <Image
            src={movie.posterUrl || PLACEHOLDERS.POSTER}
            alt={movie.title}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-105"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
            referrerPolicy="no-referrer"
            unoptimized={!movie.posterUrl}
          />
          
          <div className="absolute top-3 right-3 glass-heavy text-[9px] px-2 py-1 rounded-lg font-black z-10 text-[#2dd4bf] tracking-wider flex items-center gap-1 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" />
            4K
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={10} className="text-[#2dd4bf] fill-[#2dd4bf]" />
              <span className="text-white font-black text-[10px]">{movie.rating.toFixed(1)}</span>
            </div>
            <p className="text-[10px] text-white/50 line-clamp-2 leading-relaxed font-medium">
              {movie.genres?.[0] || (movie.type === 'tv' ? 'Series' : 'Movie')} • {movie.year}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col px-1">
          <h4 className="text-[14px] font-black text-white whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-[#2dd4bf] transition-colors duration-300 tracking-tight uppercase">
            {movie.title}
          </h4>
        </div>
      </Link>
    </motion.div>
  );
}

interface MovieCardProps {
  movie: Movie;
}
