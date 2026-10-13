import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getUpcomingMovies,
  getGenres,
  discoverMedia,
  Movie,
} from '@/lib/tmdb';
import { CatalogHeader } from '@/components/CatalogHeader';
import { FeaturedPosterStrip } from '@/components/FeaturedPosterStrip';
import { CatalogFilterBar } from '@/components/CatalogFilterBar';
import { InfiniteScrollGrid } from '@/components/InfiniteScrollGrid';

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Explore and stream top movies online in high definition.',
};

export const revalidate = 3600;

const MOVIE_SORT_OPTIONS = [
  { id: 'trending', label: 'Most popular' },
  { id: 'top', label: 'Top rated' },
  { id: 'latest', label: 'Latest releases' },
];

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string;
    genre?: string;
    year?: string;
    country?: string;
  }>;
}) {
  const { filter, genre, year, country } = await searchParams;

  let genres: Awaited<ReturnType<typeof getGenres>> = [];
  let upcomingMovies: Movie[] = [];
  let initialItems: Movie[] = [];

  try {
    [genres, upcomingMovies, initialItems] = await Promise.all([
      getGenres('movie'),
      getUpcomingMovies(1),
      discoverMedia('movie', {
        filter,
        genreId: genre,
        year,
        country,
      }),
    ]);
  } catch (error) {
    console.error('Failed to fetch movies:', error);
  }

  return (
    <div className="min-h-screen bg-black">
      <CatalogHeader
        title="Movies"
        subtitle="Blockbuster cinema, indie gems, and timeless classics"
        backdropItems={upcomingMovies.length > 0 ? upcomingMovies : initialItems}
      />

      <div className="max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16 pb-20">
        <FeaturedPosterStrip
          title="Current & upcoming movies"
          items={upcomingMovies}
        />

        <CatalogFilterBar
          baseUrl="/movies"
          genres={genres}
          activeGenreId={genre}
          activeYear={year}
          activeCountry={country}
          activeFilter={filter}
          sortOptions={MOVIE_SORT_OPTIONS}
        />

        {initialItems.length > 0 ? (
          <InfiniteScrollGrid
            initialItems={initialItems}
            type="movie"
            filter={filter}
            genreId={genre}
            year={year}
            country={country}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-28 border border-white/[0.06] rounded-2xl bg-white/[0.01] text-center px-6 mt-4">
            <p className="text-white/70 font-semibold text-base mb-1.5">
              No movies match these filters
            </p>
            <p className="text-white/40 text-xs mb-5">
              Try adjusting your genre, release year, or country selection.
            </p>
            <Link
              href="/movies"
              className="px-5 py-2 rounded-full bg-sage-600 hover:bg-sage-500 text-white text-xs font-semibold transition-colors"
            >
              Reset filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

