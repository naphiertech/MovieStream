'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { CarouselRow } from '@/components/CarouselRow';
import { RankedCarousel } from '@/components/RankedCarousel';
import { WatchHistory } from '@/components/WatchHistory';
import { Movie } from '@/lib/tmdb';

interface HomeClientProps {
  heroMedia: Movie[];
  trendingMovies: Movie[];
  trendingTV: Movie[];
  topRatedMovies: Movie[];
  topRatedTV: Movie[];
  popularTV: Movie[];
  upcomingMovies: Movie[];
  actionMovies: Movie[];
  sciFiMovies: Movie[];
  comedyMovies: Movie[];
}

export function HomeClient({
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
}: HomeClientProps) {
  const [layout, setLayout] = useState<'portrait' | 'landscape'>('landscape');

  const isLandscape = layout === 'landscape';

  return (
    <div className="pb-20">
      <HeroSection movies={heroMedia} />
      
      <div className="relative z-20">
        {/* Dynamic Layout Control Bar */}
        <div className="flex justify-end items-center px-6 md:px-14 lg:px-20 pt-6 pb-4 mb-4 border-b border-white/5">
          <span className="text-[10px] font-black uppercase tracking-[2px] text-white/30 mr-3">Layout Style:</span>
          <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-0.5">
            <button
              onClick={() => setLayout('landscape')}
              className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-[1px] transition-all duration-300 ${
                isLandscape
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Landscape
            </button>
            <button
              onClick={() => setLayout('portrait')}
              className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-[1px] transition-all duration-300 ${
                !isLandscape
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Portrait
            </button>
          </div>
        </div>

        {/* Watch History Section (Client Side) */}
        <WatchHistory />

        {/* Top 10 This Week (always portrait ranked layout as per Cineby) */}
        <RankedCarousel title="Top 10 Today" movies={trendingMovies.slice(0, 10)} />

        {/* Trending Today - With Movies/Series Toggle */}
        <CarouselRow 
          title="Trending Today" 
          movies={trendingMovies} 
          altMovies={trendingTV}
          mainLabel="Movies"
          altLabel="Series"
          layout={layout}
        />

        {/* Popular TV Series */}
        <CarouselRow title="Popular TV Series" movies={popularTV} layout={layout} />

        {/* Top Rated - With Movies/Series Toggle */}
        <CarouselRow 
          title="Top Rated" 
          movies={topRatedMovies} 
          altMovies={topRatedTV}
          mainLabel="Movies"
          altLabel="Series"
          layout={layout}
        />

        {/* Action Hits */}
        <CarouselRow title="Latest Action Hits" movies={actionMovies} viewAllLink="/genres/Action" layout={layout} />

        {/* Sci-Fi */}
        <CarouselRow title="Trending Sci-Fi" movies={sciFiMovies} viewAllLink="/genres/Sci-Fi" layout={layout} />

        {/* Comedy */}
        <CarouselRow title="Comedy" movies={comedyMovies} viewAllLink="/genres/Comedy" layout={layout} />

        {/* Coming Soon */}
        <CarouselRow title="Coming Soon" movies={upcomingMovies} layout={layout} />
      </div>
    </div>
  );
}
