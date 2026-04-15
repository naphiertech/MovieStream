import { movies } from '@/lib/db';
import { MovieCard } from '@/components/MovieCard';

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  
  let displayedMovies = [...movies];
  let title = "All Movies";

  if (filter === 'trending') {
    displayedMovies = displayedMovies.filter(m => m.trending);
    title = "Trending Movies";
  } else if (filter === 'latest') {
    displayedMovies = displayedMovies.filter(m => m.latest);
    title = "Latest Releases";
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">{title}</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {displayedMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
