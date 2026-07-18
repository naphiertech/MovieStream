'use client';

import { Movie } from '@/lib/tmdb';
import { MovieCard } from './MovieCard';

interface RankedMovieCardProps {
  movie: Movie;
  index: number;
}

export function RankedMovieCard({ movie, index }: RankedMovieCardProps) {
  return (
    <div className="w-full h-full ranked-card-enter">
      <MovieCard 
        movie={movie} 
        layout="portrait" 
        index={index} 
        showRankBadge={true} 
      />
    </div>
  );
}
