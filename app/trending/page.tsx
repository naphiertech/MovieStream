import type { Metadata } from 'next';
import {
  getTrendingMovies,
  getTrendingTV,
  getTrendingAll,
  getMoviesByGenre,
  getTVByGenre,
} from '@/lib/tmdb';
import { CatalogHeader } from '@/components/CatalogHeader';
import { TrendingClient } from '@/components/TrendingClient';

export const metadata: Metadata = {
  title: 'Trending',
  description: 'Top trending movies and television series right now.',
};

export const revalidate = 3600;

export default async function TrendingPage() {
  const [
    trendingAll,
    trendingMovies,
    trendingTV,
    actionMovies,
    animationTV,
  ] = await Promise.all([
    getTrendingAll(),
    getTrendingMovies(),
    getTrendingTV(),
    getMoviesByGenre('28'), // Action
    getTVByGenre('16'), // Animation
  ]);

  return (
    <main className="min-h-screen bg-black pb-20">
      <CatalogHeader
        title="Trending"
        subtitle="Most watched movies and series right now"
        backdropItems={trendingAll}
      />

      <TrendingClient
        trendingAll={trendingAll}
        trendingMovies={trendingMovies}
        trendingTV={trendingTV}
        actionMovies={actionMovies}
        animationTV={animationTV}
      />
    </main>
  );
}

