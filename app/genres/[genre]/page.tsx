import { movies, genres } from '@/lib/db';
import { MovieCard } from '@/components/MovieCard';
import { notFound } from 'next/navigation';

export default async function GenrePage({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params;
  const decodedGenre = decodeURIComponent(genre);
  
  if (!genres.includes(decodedGenre)) {
    notFound();
  }

  const genreMovies = movies.filter(m => m.genres.includes(decodedGenre));

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">{decodedGenre} Movies</h1>
      
      {genreMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {genreMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          No movies found in this genre yet.
        </div>
      )}
    </div>
  );
}
