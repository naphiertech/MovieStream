import { 
  getTrendingTV,
  getPopularTV, 
  getTopRatedTV,
  getTVByGenre,
  GENRE_MAP,
  Movie
} from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';

export default async function TvShowsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  
  let displayedShows: Movie[] = [];
  let title = "All Series";
  let subtitle = "Exploring the Pro Catalog";

  if (filter === 'trending') {
    displayedShows = await getTrendingTV();
    title = "Trending Now";
    subtitle = "Most watched this week";
  } else if (filter === 'popular') {
    displayedShows = await getPopularTV();
    title = "Popular Shows";
    subtitle = "Most loved by the community";
  } else if (filter === 'top') {
    displayedShows = await getTopRatedTV();
    title = "Top Rated";
    subtitle = "All-time television legends";
  } else if (filter === 'anime') {
    displayedShows = await getTVByGenre(GENRE_MAP["Animation"]);
    title = "Epic Anime";
    subtitle = "The best in global animation";
  } else {
    displayedShows = await getTrendingTV();
    title = "TV Show Catalog";
    subtitle = "Premium high-fidelity titles";
  }

  return (
    <div className="container mx-auto px-6 md:px-14 lg:px-20 pt-32 pb-20 min-h-screen">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-[#2dd4bf] mb-3">
            <div className="w-8 h-[2px] bg-[#2dd4bf] rounded-full" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[3px] font-outfit">{subtitle}</span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] md:text-[50px] font-black text-white leading-none tracking-tight uppercase italic drop-shadow-xl font-outfit">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-1.5 p-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-x-auto scrollbar-hide flex-nowrap max-w-full scrolling-touch">
          {[
            { id: 'trending', label: 'Trending' },
            { id: 'popular', label: 'Popular' },
            { id: 'top', label: 'Top Rated' },
            { id: 'anime', label: 'Anime' }
          ].map((tab) => (
            <a
              key={tab.id}
              href={`/tv-shows?filter=${tab.id}`}
              className={`px-5 sm:px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[1px] transition-all font-outfit flex-shrink-0 ${
                (filter === tab.id || (!filter && tab.id === 'trending'))
                  ? 'bg-[#2dd4bf] text-black shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-[25px] gap-y-[45px]">
        {displayedShows.map((show: Movie) => (
          <MovieCard key={show.id} movie={show} />
        ))}
      </div>
      
      {displayedShows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 border border-white/5 rounded-[3rem] bg-white/[0.02]">
          <div className="w-20 h-20 rounded-full bg-[#2dd4bf]/10 flex items-center justify-center mb-6">
            <span className="text-[#2dd4bf] animate-pulse">⚙️</span>
          </div>
          <p className="text-white/30 font-black text-[11px] uppercase tracking-[4px]">Fetching series nodes...</p>
        </div>
      )}
    </div>
  );
}
