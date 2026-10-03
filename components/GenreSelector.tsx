'use client';

import { Genre } from '@/lib/tmdb';
import Link from 'next/link';
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
        <div className="p-2.5 rounded-xl bg-[#84a98c]/10 border border-[#84a98c]/20 text-[#84a98c] shadow-lg">
          <LayoutGrid size={18} strokeWidth={2.5} />
        </div>
        <h3 className="text-white font-black uppercase tracking-[2px] text-[12px] opacity-70">Sector Discovery</h3>
      </div>
      
      <div className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar scroll-smooth no-scrollbar">
        {/* "All" Option */}
        <Link
          href={baseUrl}
          className={`flex-shrink-0 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[2px] border md:transition-all md:duration-300 ${
            !activeGenreId 
              ? 'bg-[#84a98c] text-black border-[#84a98c] shadow-[0_0_20px_rgba(132,169,140,0.3)]' 
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
              className={`flex-shrink-0 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[2px] border md:transition-all md:duration-300 ${
                isActive 
                  ? 'bg-[#84a98c] text-black border-[#84a98c] shadow-[0_0_20px_rgba(132,169,140,0.3)]' 
                  : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white md:hover:scale-105'
              }`}
            >
              <span className="block">
                {genre.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

