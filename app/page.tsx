import { HeroSection } from '@/components/HeroSection';
import { CarouselRow } from '@/components/CarouselRow';
import { RankedCarousel } from '@/components/RankedCarousel';
import { WatchHistory } from '@/components/WatchHistory';
import { 
  getTrendingMovies, 
  getUpcomingMovies, 
  getTopRatedMovies, 
  getMoviesByGenre, 
  Movie, 
  getTrendingMediaWithLogos,
  getPopularTV,
  getTopRatedTV,
  getTrendingTV
} from '@/lib/tmdb';

export const revalidate = 3600;

export default async function Home() {
  // Safe fetch wrapper to prevent whole page crash on one fetch failure
  const safeFetch = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
    try {
      return await promise;
    } catch (e) {
      console.error('Data fetch failed, using fallback:', e);
      return fallback;
    }
  };

  const [
    heroMedia,
    trendingMovies,
    trendingTV,
    topRatedMovies,
    topRatedTV,
    popularTV,
    upcomingMovies,
    actionMovies,
    sciFiMovies,
    comedyMovies
  ] = await Promise.all([
    safeFetch(getTrendingMediaWithLogos('all', 6), []),
    safeFetch(getTrendingMovies(), []),
    safeFetch(getTrendingTV(), []),
    safeFetch(getTopRatedMovies(), []),
    safeFetch(getTopRatedTV(), []),
    safeFetch(getPopularTV(), []),
    safeFetch(getUpcomingMovies(), []),
    safeFetch(getMoviesByGenre('28'), []),
    safeFetch(getMoviesByGenre('878'), []),
    safeFetch(getMoviesByGenre('35'), [])
  ]);

  return (
    <div className="pb-20">
      <HeroSection movies={heroMedia} />
      
      <div className="relative z-20">
        {/* Watch History Section (Client Side) */}
        <WatchHistory />

        {/* Top 10 This Week */}
        <RankedCarousel title="Top 10 Today" movies={trendingMovies.slice(0, 10)} />

        {/* Trending Today - With Movies/Series Toggle */}
        <CarouselRow 
          title="Trending Today" 
          movies={trendingMovies} 
          altMovies={trendingTV}
          mainLabel="Movies"
          altLabel="Series"
        />

        {/* Popular TV Series */}
        <CarouselRow title="Popular TV Series" movies={popularTV} />

        {/* Top Rated - With Movies/Series Toggle */}
        <CarouselRow 
          title="Top Rated" 
          movies={topRatedMovies} 
          altMovies={topRatedTV}
          mainLabel="Movies"
          altLabel="Series"
        />

        {/* Action Hits */}
        <CarouselRow title="Latest Action Hits" movies={actionMovies} viewAllLink="/genres/Action" />

        {/* Sci-Fi */}
        <CarouselRow title="Trending Sci-Fi" movies={sciFiMovies} viewAllLink="/genres/Sci-Fi" />

        {/* Comedy */}
        <CarouselRow title="Comedy" movies={comedyMovies} viewAllLink="/genres/Comedy" />

        {/* Coming Soon */}
        <CarouselRow title="Coming Soon" movies={upcomingMovies} />
      </div>
    </div>
  );
}
