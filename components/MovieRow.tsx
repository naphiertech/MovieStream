import { Movie } from '@/lib/tmdb';
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
    <section className="py-[40px] flex-1">
      <div className="flex justify-between items-center mb-[30px]">
        <h2 className="text-[22px] md:text-[24px] font-black text-white uppercase tracking-[1px] flex items-center gap-3">
          <span className="w-2 h-7 bg-[#2dd4bf] rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
          {title}
        </h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-[10px] font-black text-white/30 uppercase tracking-[2px] hover:text-[#2dd4bf] transition-all bg-white/5 px-5 py-2.5 rounded-full border border-white/5 hover:border-[#2dd4bf]/40 shadow-sm">
            VIEW ALL
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-[20px] gap-y-[35px]">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
