import { Movie } from '@/lib/tmdb';
import { MovieCard } from './MovieCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllLink?: string;
  layout?: 'portrait' | 'landscape';
}

export function MovieRow({
  title,
  movies,
  viewAllLink,
  layout = 'portrait',
}: MovieRowProps) {
  if (!movies.length) return null;

  const isLandscape = layout === 'landscape';

  return (
    <section className="py-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[16px] md:text-[18px] font-semibold text-white tracking-tight flex items-center gap-2.5">
          <span className="w-1 h-5 bg-sage-500 rounded-full" />
          <span>{title}</span>
        </h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-xs font-medium text-white/55 hover:text-sage-400 transition-colors flex items-center gap-1"
          >
            <span>Explore all</span>
            <ChevronRight size={14} />
          </Link>
        )}
      </div>

      <div
        className={`grid gap-x-4 gap-y-7 ${
          isLandscape
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'
        }`}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} layout={layout} />
        ))}
      </div>
    </section>
  );
}

