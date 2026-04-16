'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export function RankedMovieCard({ movie, index }: RankedMovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative flex items-center group cursor-pointer h-[320px]"
    >
      {/* Huge Background Number - Signature Cineby Style */}
      <div className="absolute -left-2 bottom-0 select-none z-0 pointer-events-none translate-y-4">
        <span className="text-[220px] font-black leading-none text-outline group-hover:text-neon group-hover:scale-105 transition-all duration-700 block italic opacity-40 group-hover:opacity-100">
          {index + 1}
        </span>
      </div>

      {/* Poster Container */}
      <Link href={movie.type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`} className="relative z-10 block ml-20 w-full h-[280px]">
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative h-full aspect-[2/3] bg-white/5 rounded-2xl overflow-hidden border border-white/5 shadow-2xl group-hover:border-[#2dd4bf]/40 transition-all duration-500 card-hover-glow"
        >
          <Image
            src={movie.posterUrl || PLACEHOLDERS.POSTER}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
            sizes="(max-width: 768px) 33vw, 20vw"
            referrerPolicy="no-referrer"
            unoptimized={!movie.posterUrl}
          />
          
          <div className="absolute top-3 right-3 glass-heavy text-[9px] px-2 py-1 rounded-lg font-black text-[#2dd4bf] shadow-lg">
            PRO
          </div>
          
          {/* Interaction Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-full bg-[#2dd4bf] flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.6)] group/btnTransition"
            >
              <Play size={24} fill="black" className="ml-1 text-black" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

interface RankedMovieCardProps {
  movie: Movie;
  index: number;
}
