'use client';

import { useState } from 'react';
import { Movie } from '@/lib/tmdb';
import { MovieRow } from '@/components/MovieRow';
import { MovieCard } from '@/components/MovieCard';
import { RankedMovieCard } from '@/components/RankedMovieCard';

interface TrendingClientProps {
  trendingAll: Movie[];
  trendingMovies: Movie[];
  trendingTV: Movie[];
  actionMovies: Movie[];
  animationTV: Movie[];
}

type CategoryTab = 'all' | 'movies' | 'tv' | 'action' | 'anime';

export function TrendingClient({
  trendingAll,
  trendingMovies,
  trendingTV,
  actionMovies,
  animationTV,
}: TrendingClientProps) {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [layout, setLayout] = useState<'portrait' | 'landscape'>('portrait');

  const isLandscape = layout === 'landscape';

  const tabs: { id: CategoryTab; label: string }[] = [
    { id: 'all', label: 'All Trending' },
    { id: 'movies', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'action', label: 'Action' },
    { id: 'anime', label: 'Animation' },
  ];

  const getFilteredSingleGrid = (): Movie[] => {
    switch (activeTab) {
      case 'movies':
        return trendingMovies;
      case 'tv':
        return trendingTV;
      case 'action':
        return actionMovies;
      case 'anime':
        return animationTV;
      default:
        return trendingAll;
    }
  };

  return (
    <div className="max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16 relative z-10">
      {/* Top 10 Ranked Strip */}
      <section className="py-6 border-b border-white/[0.05]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] md:text-[15px] font-semibold text-white/90 tracking-tight">
            Top 10 Today
          </h2>
          <span className="text-xs font-medium text-white/40">
            Updated daily
          </span>
        </div>

        <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-2 scrollbar-hide carousel-track">
          {trendingAll.slice(0, 10).map((item: Movie, index: number) => (
            <div
              key={item.id}
              className="flex-shrink-0"
            >
              <RankedMovieCard movie={item} index={index} />
            </div>
          ))}
        </div>
      </section>

      {/* Filter Pills + View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sage-600/20 border-sage-500/40 text-sage-300 font-semibold'
                    : 'bg-[#151517] hover:bg-[#1e1e22] border-white/[0.07] text-white/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center bg-[#141416] border border-white/[0.08] rounded-full p-1 ml-auto">
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

      {/* Content Sections */}
      {activeTab === 'all' ? (
        <div className="flex flex-col gap-6">
          <MovieRow
            title="Trending Movies"
            movies={trendingMovies.slice(0, 12)}
            viewAllLink="/movies?filter=trending"
            layout={layout}
          />

          <div className="content-visibility-auto">
            <MovieRow
              title="Trending TV Shows"
              movies={trendingTV.slice(0, 12)}
              viewAllLink="/tv-shows?filter=trending"
              layout={layout}
            />
          </div>

          <div className="content-visibility-auto">
            <MovieRow
              title="Rising in Action"
              movies={actionMovies.slice(0, 12)}
              viewAllLink="/movies?genre=28"
              layout={layout}
            />
          </div>

          <div className="content-visibility-auto">
            <MovieRow
              title="Animation & Anime Spotlight"
              movies={animationTV.slice(0, 12)}
              viewAllLink="/tv-shows?genre=16"
              layout={layout}
            />
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-x-4 gap-y-7 pt-2 ${
            isLandscape
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'
          }`}
        >
          {getFilteredSingleGrid().map((movie) => (
            <MovieCard key={movie.id} movie={movie} layout={layout} />
          ))}
        </div>
      )}
    </div>
  );
}


