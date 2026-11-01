'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Movie, WatchProvider, PLACEHOLDERS } from '@/lib/tmdb';
import { InfiniteScrollGrid } from '@/components/InfiniteScrollGrid';

interface ProviderCatalogClientProps {
  provider: WatchProvider;
  initialMovies: Movie[];
  initialTV: Movie[];
}

export function ProviderCatalogClient({
  provider,
  initialMovies,
  initialTV,
}: ProviderCatalogClientProps) {
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [layout, setLayout] = useState<'portrait' | 'landscape'>('portrait');

  const activeItems = mediaType === 'movie' ? initialMovies : initialTV;
  const wallPosters = (activeItems.length > 0 ? activeItems : initialMovies).slice(0, 12);
  const isLandscape = layout === 'landscape';

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Tilted Poster Collage Wall + Provider Branding + Movies/Series Toggle */}
      <section className="relative w-full overflow-hidden pt-28 pb-8 md:pt-36 md:pb-10 border-b border-white/[0.04]">
        {wallPosters.length > 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-16 -right-12 w-[78%] md:w-[68%] h-[160%] -rotate-12 opacity-35 md:opacity-45">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {wallPosters.map((item, idx) => {
                  const src =
                    item.posterUrl || item.bannerUrl || PLACEHOLDERS.POSTER;
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="180px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                        unoptimized={!src.startsWith('http')}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Directional Vignettes to Blend Collage into Deep Black */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/80" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16">
          {/* Provider Icon + Title (Matches Image 2) */}
          <div className="flex items-center gap-4 md:gap-5 mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[20px] md:rounded-[24px] overflow-hidden border border-white/15 bg-zinc-900 shadow-2xl flex-shrink-0">
              <Image
                src={provider.logoUrl}
                alt={provider.name}
                fill
                sizes="96px"
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-none drop-shadow-md">
              {provider.name}
            </h1>
          </div>

          {/* Controls Row: Frosted Movies/Series Pill Toggle (Image 2) + Landscape/Portrait Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-full p-1">
              <button
                type="button"
                onClick={() => setMediaType('movie')}
                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  mediaType === 'movie'
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Movies
              </button>
              <button
                type="button"
                onClick={() => setMediaType('tv')}
                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  mediaType === 'tv'
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Series
              </button>
            </div>

            <div className="flex items-center bg-[#141416] border border-white/[0.08] rounded-full p-1">
              <button
                type="button"
                onClick={() => setLayout('landscape')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isLandscape
                    ? 'bg-white/[0.14] text-white font-semibold'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                Landscape
              </button>
              <button
                type="button"
                onClick={() => setLayout('portrait')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  !isLandscape
                    ? 'bg-white/[0.14] text-white font-semibold'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                Portrait
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <div className="max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16 pt-6 pb-20">
        {activeItems.length > 0 ? (
          <InfiniteScrollGrid
            key={`${provider.id}-${mediaType}`}
            initialItems={activeItems}
            type={mediaType}
            providerId={provider.id}
            layout={layout}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-28 border border-white/[0.06] rounded-2xl bg-white/[0.01] text-center px-6 mt-4">
            <p className="text-white/70 font-semibold text-base mb-1.5">
              No {mediaType === 'movie' ? 'movies' : 'series'} found for {provider.name}
            </p>
            <p className="text-white/40 text-xs">
              Try switching to {mediaType === 'movie' ? 'Series' : 'Movies'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
