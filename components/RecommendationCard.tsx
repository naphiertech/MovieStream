'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface RecommendationCardProps {
  movie: Movie;
}

export function RecommendationCard({ movie }: RecommendationCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative group cursor-pointer"
    >
      <Link href={movie.type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`} className="block h-full">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 group-hover:border-red-600/40 transition-all duration-500 shadow-2xl">
          <Image
            src={movie.bannerUrl || movie.posterUrl || PLACEHOLDERS.BANNER}
            alt={movie.title}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            referrerPolicy="no-referrer"
            unoptimized={!movie.bannerUrl && !movie.posterUrl}
          />
          
          {/* Top-Left Tag - "MOVIE" or "TV SHOW" */}
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 z-10">
            <span className="text-white text-[9px] font-black uppercase tracking-widest">
              {movie.type === 'tv' ? 'TV Show' : 'Movie'}
            </span>
          </div>

          {/* Top-Right Tag - Rating */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 z-10 flex items-center gap-1.5">
            <Star size={10} className="text-red-500 fill-red-500" />
            <span className="text-white text-[10px] font-black">{movie.rating.toFixed(1)}</span>
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end">
            <h4 className="text-[13px] md:text-[14px] font-black text-white uppercase tracking-tight line-clamp-1 group-hover:text-red-500 transition-colors duration-300">
              {movie.title}
            </h4>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
