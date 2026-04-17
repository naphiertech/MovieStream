'use client';

import Image from 'next/image';
import { CastMember } from '@/lib/tmdb';
import { User } from 'lucide-react';

export function ActorList({ cast }: { cast: CastMember[] }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-3 mb-[30px]">
        <div className="w-2 h-7 bg-[#2dd4bf] rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
        <h2 className="text-[22px] md:text-[24px] font-black text-white uppercase tracking-[1px]">Top Cast</h2>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-[20px] gap-y-[35px]">
        {cast.slice(0, 6).map((actor) => (
          <div key={actor.id} className="w-full group cursor-pointer text-center md:text-left">
            <div className="w-full aspect-[2/3] rounded-[2rem] overflow-hidden bg-white/5 border border-white/5 mb-4 relative shadow-lg group-hover:border-[#2dd4bf]/40 transition-all duration-700">
              {actor.profileUrl ? (
                <Image 
                  src={actor.profileUrl} 
                  alt={actor.name} 
                  fill 
                  className="object-cover scale-100 group-hover:scale-110 transition-transform duration-1000" 
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/20 bg-[#060606]">
                  <User size={40} strokeWidth={1} />
                </div>
              )}
            </div>
            <h4 className="text-white text-[12px] md:text-[14px] font-black leading-tight mb-1 truncate group-hover:text-[#2dd4bf] transition-colors">{actor.name}</h4>
            <p className="text-white/40 text-[10px] md:text-[11px] font-bold truncate leading-tight uppercase tracking-wider">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
