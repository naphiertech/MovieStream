import { 
  getTrendingMovies, 
  getTrendingTV, 
  getTrendingAll, 
  getMoviesByGenre, 
  getTVByGenre
} from '@/lib/tmdb';
import { TrendingClient } from '@/components/TrendingClient';

export const revalidate = 3600;

export default async function TrendingPage() {
  const [
    trendingAll,
    trendingMovies,
    trendingTV,
    actionMovies,
    animationTV
  ] = await Promise.all([
    getTrendingAll(),
    getTrendingMovies(),
    getTrendingTV(),
    getMoviesByGenre('28'), // Action
    getTVByGenre('16')      // Animation
  ]);

  return (
    <main className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-[#060606]">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <TrendingClient
        trendingAll={trendingAll}
        trendingMovies={trendingMovies}
        trendingTV={trendingTV}
        actionMovies={actionMovies}
        animationTV={animationTV}
      />

      {/* Grid Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
    </main>
  );
}
