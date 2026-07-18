import { Movie } from '@/lib/tmdb';
import { MovieCard } from './MovieCard';
import Link from 'next/link';

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
  layout = 'landscape' 
}: MovieRowProps) {
  if (!movies.length) return null;

  const isLandscape = layout === 'landscape';

  return (
    <section className="py-6 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[18px] md:text-[22px] font-black text-white uppercase tracking-[0.5px] flex items-center gap-3 font-outfit">
          <span className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_12px_rgba(229,9,20,0.5)]" />
          {title}
        </h2>
        {viewAllLink && (
          <Link 
            href={viewAllLink} 
            className="text-[10px] font-black text-white/30 uppercase tracking-[2px] hover:text-red-500 transition-all bg-white/5 px-5 py-2.5 rounded-full border border-white/5 hover:border-red-600/40 shadow-sm"
          >
            VIEW ALL
          </Link>
        )}
      </div>
      
      <div className={`grid gap-x-[20px] gap-y-[35px] ${
        isLandscape 
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      }`}>
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} layout={layout} />
        ))}
      </div>
    </section>
  );
}
