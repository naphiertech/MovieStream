import { HomeClient } from '@/components/HomeClient';
import { 
  getTrendingMovies, 
  getUpcomingMovies, 
  getTopRatedMovies, 
  getMoviesByGenre, 
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
    <HomeClient
      heroMedia={heroMedia}
      trendingMovies={trendingMovies}
      trendingTV={trendingTV}
      topRatedMovies={topRatedMovies}
      topRatedTV={topRatedTV}
      popularTV={popularTV}
      upcomingMovies={upcomingMovies}
      actionMovies={actionMovies}
      sciFiMovies={sciFiMovies}
      comedyMovies={comedyMovies}
    />
  );
}
