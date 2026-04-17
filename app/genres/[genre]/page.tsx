import { getMoviesByGenre, GENRE_MAP, Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { notFound } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';

export default async function GenrePage({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params;
  const decodedGenre = decodeURIComponent(genre);
  
  const genreId = GENRE_MAP[decodedGenre];
  
  if (!genreId) {
    notFound();
  }

  const genreMovies = await getMoviesByGenre(genreId);

  return (
    <div className="container mx-auto px-6 md:px-14 lg:px-20 pt-32 pb-20 min-h-screen">
      <div className="mb-14 flex items-center gap-6">
        <div className="p-4 rounded-3xl bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 text-[#2dd4bf] shadow-[0_0_20px_rgba(45,212,191,0.1)]">
          <LayoutGrid size={32} strokeWidth={2.5} />
        </div>
        <div>
          <div className="flex items-center gap-3 text-[#2dd4bf] mb-2">
            <div className="w-8 h-[2px] bg-[#2dd4bf] rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[3px]">Genre Discover</span>
          </div>
          <h1 className="text-[34px] md:text-[50px] font-black text-white leading-none tracking-tight uppercase italic drop-shadow-xl">
            {decodedGenre} <span className="text-[#2dd4bf]/50">MOVIES</span>
          </h1>
        </div>
      </div>
      
      {genreMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-[25px] gap-y-[45px]">
          {genreMovies.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 border border-white/5 rounded-[3rem] bg-white/[0.02]">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-white/10">
            <LayoutGrid size={32} />
          </div>
          <p className="text-white/30 font-black text-[11px] uppercase tracking-[4px]">No productions found in this sector</p>
        </div>
      )}
    </div>
  );
}
