import Link from 'next/link';
import { 
  getTrendingTV,
  getPopularTV, 
  getTopRatedTV, 
  getTVByGenre,
  getGenres,
  Movie 
} from '@/lib/tmdb';
import { GenreSelector } from '@/components/GenreSelector';
import { InfiniteScrollGrid } from '@/components/InfiniteScrollGrid';

// Enable 1-hour Incremental Static Regeneration (ISR) on Vercel CDN Edge
export const revalidate = 3600;

export default async function TvShowsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string, genre?: string }>;
}) {
  const { filter, genre } = await searchParams;
  const genres = await getGenres('tv');
  
  let initialItems: Movie[] = [];
  let title = "All Series";
  let subtitle = "Exploring the Pro Catalog";

  try {
    if (genre) {
      const activeGenre = genres.find(g => g.id.toString() === genre);
      initialItems = await getTVByGenre(genre);
      title = activeGenre ? `${activeGenre.name} Series` : "Genre Collection";
      subtitle = "Sector Specific Discovery";
    } else if (filter === 'trending') {
      initialItems = await getTrendingTV();
      title = "Trending Now";
      subtitle = "Most watched this week";
    } else if (filter === 'popular') {
      initialItems = await getPopularTV();
      title = "Popular Shows";
      subtitle = "Most loved by the community";
    } else if (filter === 'top') {
      initialItems = await getTopRatedTV();
      title = "Top Rated";
      subtitle = "All-time television legends";
    } else if (filter === 'anime') {
      const animeGenre = genres.find(g => g.name === 'Animation');
      initialItems = await getTVByGenre(animeGenre?.id.toString() || '16');
      title = "Epic Anime";
      subtitle = "The best in global animation";
    } else {
      initialItems = await getTrendingTV();
      title = "TV Show Catalog";
      subtitle = "Premium high-fidelity titles";
    }
  } catch (error) {
    console.error("Failed to fetch TV shows:", error);
    initialItems = [];
  }

  return (
    <div className="container mx-auto px-6 md:px-14 lg:px-20 pt-32 pb-20 min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-sage-400 mb-3">
            <div className="w-8 h-[2px] bg-sage-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[3px]">{subtitle}</span>
          </div>
          <h1 className="text-[34px] md:text-[50px] font-black text-white leading-none tracking-tight uppercase italic drop-shadow-xl font-outfit">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-1.5 p-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'trending', label: 'Trending' },
            { id: 'popular', label: 'Popular' },
            { id: 'top', label: 'Top Rated' },
            { id: 'anime', label: 'Anime' }
          ].map((tab) => {
            const isActive = filter === tab.id || (!filter && !genre && tab.id === 'trending');
            return (
              <Link
                key={tab.id}
                href={`/tv-shows?filter=${tab.id}`}
                scroll={false}
                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[1px] transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sage-600 text-white shadow-[0_0_20px_rgba(132, 169, 140,0.3)]'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <GenreSelector 
        genres={genres} 
        activeGenreId={genre} 
        baseUrl="/tv-shows" 
      />
      
      {initialItems.length > 0 ? (
        <InfiniteScrollGrid 
          initialItems={initialItems} 
          type="tv" 
          filter={filter} 
          genreId={genre} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-40 border border-white/5 rounded-[3rem] bg-white/[0.02]">
          <div className="w-20 h-20 rounded-full bg-sage-600/10 flex items-center justify-center mb-6 text-white/10">
            <span className="text-sage-400 animate-pulse">⚙️</span>
          </div>
          <p className="text-white/30 font-black text-[11px] uppercase tracking-[4px]">No productions found in this sector</p>
        </div>
      )}
    </div>
  );
}
