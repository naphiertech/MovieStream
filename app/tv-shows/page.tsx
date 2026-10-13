import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getTrendingTV,
  getGenres,
  discoverMedia,
  Movie,
} from '@/lib/tmdb';
import { CatalogHeader } from '@/components/CatalogHeader';
import { FeaturedPosterStrip } from '@/components/FeaturedPosterStrip';
import { CatalogFilterBar } from '@/components/CatalogFilterBar';
import { InfiniteScrollGrid } from '@/components/InfiniteScrollGrid';

export const metadata: Metadata = {
  title: 'TV Shows',
  description: 'Binge-watch and stream trending television series and episodes.',
};

export const revalidate = 3600;

const TV_SORT_OPTIONS = [
  { id: 'trending', label: 'Most popular' },
  { id: 'popular', label: 'Community favorites' },
  { id: 'top', label: 'Top rated' },
  { id: 'latest', label: 'Latest episodes' },
  { id: 'anime', label: 'Anime' },
];

export default async function TvShowsPage({
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
  let trendingTV: Movie[] = [];
  let initialItems: Movie[] = [];

  try {
    [genres, trendingTV, initialItems] = await Promise.all([
      getGenres('tv'),
      getTrendingTV(1),
      discoverMedia('tv', {
        filter,
        genreId: genre,
        year,
        country,
      }),
    ]);
  } catch (error) {
    console.error('Failed to fetch TV shows:', error);
  }

  return (
    <div className="min-h-screen bg-black">
      <CatalogHeader
        title="Shows"
        subtitle="Binge-worthy series and episodes"
        backdropItems={trendingTV.length > 0 ? trendingTV : initialItems}
      />

      <div className="max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16 pb-20">
        <FeaturedPosterStrip
          title="Current & upcoming TV shows"
          items={trendingTV}
        />

        <CatalogFilterBar
          baseUrl="/tv-shows"
          genres={genres}
          activeGenreId={genre}
          activeYear={year}
          activeCountry={country}
          activeFilter={filter}
          sortOptions={TV_SORT_OPTIONS}
        />

        {initialItems.length > 0 ? (
          <InfiniteScrollGrid
            initialItems={initialItems}
            type="tv"
            filter={filter}
            genreId={genre}
            year={year}
            country={country}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-28 border border-white/[0.06] rounded-2xl bg-white/[0.01] text-center px-6 mt-4">
            <p className="text-white/70 font-semibold text-base mb-1.5">
              No series match these filters
            </p>
            <p className="text-white/40 text-xs mb-5">
              Try adjusting your genre, release year, or country selection.
            </p>
            <Link
              href="/tv-shows"
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

