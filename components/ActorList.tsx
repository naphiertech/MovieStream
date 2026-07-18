'use client';

import Image from 'next/image';
import { CastMember } from '@/lib/tmdb';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export function ActorList({ cast }: { cast: CastMember[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!cast || cast.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-red-600 rounded-full shadow-[0_0_15px_rgba(229,9,20,0.5)]" />
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight italic font-outfit">Cast</h2>
          <span className="text-white/20 text-xs font-bold ml-1">{cast.length}</span>
        </div>
        
        {/* Carousel Navigation */}
        {cast.length > 6 && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      
      {/* Scrollable Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-2 px-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {cast.map((actor) => (
          <div key={actor.id} className="flex-shrink-0 w-[120px] md:w-[150px] group cursor-pointer">
            <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/5 mb-3 relative shadow-lg group-hover:border-red-600/40 transition-all duration-500">
              {actor.profileUrl ? (
                <Image 
                  src={actor.profileUrl} 
                  alt={actor.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  sizes="150px"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/20 bg-[#0a0a0a]">
                  <User size={32} strokeWidth={1} />
                </div>
              )}
            </div>
            <h4 className="text-white text-[12px] md:text-[13px] font-bold leading-tight mb-0.5 truncate group-hover:text-red-500 transition-colors">{actor.name}</h4>
            <p className="text-white/30 text-[10px] font-medium truncate leading-tight uppercase tracking-wider">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
