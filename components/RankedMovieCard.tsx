'use client';

import { Movie } from '@/lib/tmdb';
import { MovieCard } from './MovieCard';

interface RankedMovieCardProps {
  movie: Movie;
  index: number;
}

export function RankedMovieCard({ movie, index }: RankedMovieCardProps) {
  const rankNumber = index + 1;

  return (
    <div className="flex items-center gap-1 sm:gap-2 group/ranked select-none">
      {/* StreamCraze Outlined Large Numeral */}
      <span 
        className="font-black text-[90px] sm:text-[110px] md:text-[140px] leading-none tracking-tighter text-transparent select-none font-outfit transition-all duration-500 group-hover/ranked:text-red-600/30 group-hover/ranked:scale-105"
        style={{
          WebkitTextStroke: '2.5px rgba(255, 255, 255, 0.4)',
          textShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}
      >
        {rankNumber}
      </span>

      {/* Portrait Movie Card */}
      <div className="w-[135px] sm:w-[155px] md:w-[180px] flex-shrink-0">
        <MovieCard 
          movie={movie} 
          layout="portrait" 
          showRankBadge={false} 
        />
      </div>
    </div>
  );
}
