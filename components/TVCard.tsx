'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TVCardProps {
  show: Movie;
}

export function TVCard({ show }: TVCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative group cursor-pointer"
    >
      <Link href={`/tv/${show.id}`} className="block h-full">
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-[#2dd4bf]/40 transition-all duration-500 shadow-2xl">
          <Image
            src={show.posterUrl || PLACEHOLDERS.POSTER}
            alt={show.title}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            referrerPolicy="no-referrer"
            unoptimized={!show.posterUrl}
          />
          
          {/* Top-Left Tag - "SERIES" or "ANIME" */}
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 z-10">
            <span className="text-white text-[9px] font-black uppercase tracking-widest">
              {show.genres.includes('Animation') ? 'Anime' : 'Series'}
            </span>
          </div>

          {/* Top-Right Tag - Rating */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 z-10 flex items-center gap-1.5">
            <Star size={10} className="text-[#2dd4bf] fill-[#2dd4bf]" />
            <span className="text-white text-[10px] font-black">{show.rating.toFixed(1)}</span>
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end">
            <h4 className="text-[13px] md:text-[14px] font-black text-white uppercase tracking-tight line-clamp-2 group-hover:text-[#2dd4bf] transition-colors duration-300">
              {show.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[9px] font-black text-[#2dd4bf] uppercase tracking-[1px]">{show.year}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
