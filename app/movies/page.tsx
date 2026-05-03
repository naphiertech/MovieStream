import { 
  getTrendingMovies, 
  getUpcomingMovies, 
  getTopRatedMovies, 
  getMoviesByGenre,
  getGenres,
  Movie 
} from '@/lib/tmdb';
import { GenreSelector } from '@/components/GenreSelector';
import { InfiniteScrollGrid } from '@/components/InfiniteScrollGrid';

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string, genre?: string }>;
}) {
  const { filter, genre } = await searchParams;
  const genres = await getGenres('movie');
  
  let initialItems: Movie[] = [];
  let title = "All Movies";
  let subtitle = "Exploring the Pro Catalog";

  try {
    if (genre) {
      const activeGenre = genres.find(g => g.id.toString() === genre);
      initialItems = await getMoviesByGenre(genre);
      title = activeGenre ? `${activeGenre.name} Movies` : "Genre Collection";
      subtitle = "Sector Specific Discovery";
    } else if (filter === 'trending') {
      initialItems = await getTrendingMovies();
      title = "Trending Now";
      subtitle = "Most watched this week";
    } else if (filter === 'latest' || filter === 'upcoming') {
      initialItems = await getUpcomingMovies();
      title = "Coming Soon";
      subtitle = "Be the first to watch";
    } else if (filter === 'top') {
      initialItems = await getTopRatedMovies();
      title = "Top Rated";
      subtitle = "All-time cinematic classics";
    } else {
      initialItems = await getTrendingMovies();
      title = "Movie Catalog";
      subtitle = "Premium high-fidelity titles";
    }
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    initialItems = [];
  }

  return (
    <div className="container mx-auto px-6 md:px-14 lg:px-20 pt-32 pb-20 min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-[#2dd4bf] mb-3">
            <div className="w-8 h-[2px] bg-[#2dd4bf] rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[3px]">{subtitle}</span>
          </div>
          <h1 className="text-[34px] md:text-[50px] font-black text-white leading-none tracking-tight uppercase italic drop-shadow-xl font-outfit">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-1.5 p-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl">
          {[
            { id: 'trending', label: 'Trending' },
            { id: 'latest', label: 'Upcoming' },
            { id: 'top', label: 'Top Rated' }
          ].map((tab) => {
            const isActive = filter === tab.id || (!filter && !genre && tab.id === 'trending');
            return (
              <a
                key={tab.id}
                href={`/movies?filter=${tab.id}`}
                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[1px] transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2dd4bf] text-black shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </div>
      </div>

      <GenreSelector 
        genres={genres} 
        activeGenreId={genre} 
        baseUrl="/movies" 
      />
      
      {initialItems.length > 0 ? (
        <InfiniteScrollGrid 
          initialItems={initialItems} 
          type="movie" 
          filter={filter} 
          genreId={genre} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-40 border border-white/5 rounded-[3rem] bg-white/[0.02]">
          <div className="w-20 h-20 rounded-full bg-[#2dd4bf]/10 flex items-center justify-center mb-6 text-white/10">
            <span className="text-[#2dd4bf] animate-pulse">⚙️</span>
          </div>
          <p className="text-white/30 font-black text-[11px] uppercase tracking-[4px]">No productions found in this sector</p>
        </div>
      )}
    </div>
  );
}
