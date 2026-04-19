'use client';

import { Genre } from '@/lib/tmdb';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

interface GenreSelectorProps {
  genres: Genre[];
  activeGenreId?: string;
  baseUrl: string;
}

export function GenreSelector({ genres, activeGenreId, baseUrl }: GenreSelectorProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 text-[#2dd4bf] shadow-lg">
          <LayoutGrid size={18} strokeWidth={2.5} />
        </div>
        <h3 className="text-white font-black uppercase tracking-[2px] text-[12px] opacity-70">Sector Discovery</h3>
      </div>
      
      <div className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar scroll-smooth no-scrollbar">
        {/* "All" Option */}
        <Link
          href={baseUrl}
          className={`flex-shrink-0 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[2px] border transition-all duration-300 ${
            !activeGenreId 
              ? 'bg-[#2dd4bf] text-black border-[#2dd4bf] shadow-[0_0_20px_rgba(45,212,191,0.3)]' 
              : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white'
          }`}
        >
          All Genres
        </Link>

        {genres.map((genre) => {
          const isActive = activeGenreId === genre.id.toString();
          return (
            <Link
              key={genre.id}
              href={`${baseUrl}?genre=${genre.id}`}
              className={`flex-shrink-0 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[2px] border transition-all duration-300 ${
                isActive 
                  ? 'bg-[#2dd4bf] text-black border-[#2dd4bf] shadow-[0_0_20px_rgba(45,212,191,0.3)]' 
                  : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white hover:scale-105'
              }`}
            >
              <motion.span
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                className="block"
              >
                {genre.name}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
