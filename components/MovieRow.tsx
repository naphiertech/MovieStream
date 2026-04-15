import { Movie } from '@/lib/db';
import { MovieCard } from './MovieCard';
import Link from 'next/link';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllLink?: string;
}

export function MovieRow({ title, movies, viewAllLink }: MovieRowProps) {
  if (!movies.length) return null;

  return (
    <section className="py-[30px] px-10 flex-1">
      <div className="flex justify-between items-end mb-[20px]">
        <h2 className="text-[20px] font-bold text-white">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-[12px] text-[#999999] uppercase tracking-[1px] hover:text-white transition-colors">
            View More &rarr;
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[20px]">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
