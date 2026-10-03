'use client';

import { useState, useMemo } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { CarouselRow } from '@/components/CarouselRow';
import { RankedCarousel } from '@/components/RankedCarousel';
import { GenreRow } from '@/components/GenreRow';
import { SpotlightBanner } from '@/components/SpotlightBanner';
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

  // 1. Gather all Hero movie IDs so we don't repeat the hero movie as spotlight titles
  const heroIds = useMemo(() => new Set(heroMedia.map(m => m.id)), [heroMedia]);

  // 2. Action Spotlight: Pick a distinct Action movie NOT featured in Hero
  const actionSpotlight = useMemo(() => {
    return actionMovies.find(m => !heroIds.has(m.id)) || actionMovies[1] || actionMovies[0];
  }, [actionMovies, heroIds]);

  const actionSideMovies = useMemo(() => {
    if (!actionSpotlight) return [];
    return actionMovies.filter(m => m.id !== actionSpotlight.id && !heroIds.has(m.id)).slice(0, 3);
  }, [actionMovies, actionSpotlight, heroIds]);

  // 3. Sci-Fi Spotlight: Pick a distinct Sci-Fi movie NOT featured in Hero AND NOT Action Spotlight
  const sciFiSpotlight = useMemo(() => {
    return sciFiMovies.find(m => !heroIds.has(m.id) && m.id !== actionSpotlight?.id) || sciFiMovies[1] || sciFiMovies[0];
  }, [sciFiMovies, heroIds, actionSpotlight]);

  const sciFiSideMovies = useMemo(() => {
    if (!sciFiSpotlight) return [];
    return sciFiMovies.filter(m => m.id !== sciFiSpotlight.id && m.id !== actionSpotlight?.id).slice(0, 3);
  }, [sciFiMovies, sciFiSpotlight, actionSpotlight]);

  // 4. Algorithmically rotate subsets so rows don't repeat identical top 5 in identical order
  const distinctTrendingMovies = useMemo(() => {
    if (trendingMovies.length <= 3) return trendingMovies;
    // Rotate slightly so Trending Row order is distinct from Top 10 Today order
    return [...trendingMovies.slice(2), ...trendingMovies.slice(0, 2)];
  }, [trendingMovies]);

  const distinctActionHits = useMemo(() => {
    if (!actionSpotlight) return actionMovies;
    return actionMovies.filter(m => m.id !== actionSpotlight.id);
  }, [actionMovies, actionSpotlight]);

  const distinctSciFiHits = useMemo(() => {
    if (!sciFiSpotlight) return sciFiMovies;
    return sciFiMovies.filter(m => m.id !== sciFiSpotlight.id);
  }, [sciFiMovies, sciFiSpotlight]);

  return (
    <div className="pb-20 space-y-4 md:space-y-8">
      {/* 1. StreamCraze Brightened Edge-Peek Carousel Hero */}
      <HeroSection movies={heroMedia} />
      
      <div className="relative z-20 space-y-4 md:space-y-6">
        {/* Dynamic Layout Style Control Bar */}
        <div className="flex justify-between items-center px-6 md:px-14 lg:px-20 pt-2 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sage-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[2px] text-white/50">
              Curated Catalog • Updated Today
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-[10px] font-black uppercase tracking-[2px] text-white/30 mr-3 hidden sm:inline">Layout Style:</span>
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-0.5">
              <button
                onClick={() => setLayout('landscape')}
                className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-[1px] md:transition-all md:duration-300 ${
                  isLandscape
                    ? 'bg-sage-600 text-white shadow-[0_0_15px_rgba(132, 169, 140,0.3)]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Landscape
              </button>
              <button
                onClick={() => setLayout('portrait')}
                className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-[1px] md:transition-all md:duration-300 ${
                  !isLandscape
                    ? 'bg-sage-600 text-white shadow-[0_0_15px_rgba(132, 169, 140,0.3)]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Portrait
              </button>
            </div>
          </div>
        </div>

        {/* 2. Continue Watching (Client Local Storage) */}
        <WatchHistory />

        {/* 3. Trending Today (Rotated Distinct Subset with Movies/Series Toggle) */}
        <CarouselRow 
          title="Trending Today" 
          movies={distinctTrendingMovies} 
          altMovies={trendingTV}
          mainLabel="Movies"
          altLabel="Series"
          layout={layout}
        />

        {/* 4. StreamCraze Genres Category Tiles */}
        <GenreRow />

        {/* 5. Top 10 Today (StreamCraze Outlined Numerals) */}
        <RankedCarousel 
          title="Top 10 Movies Today" 
          movies={trendingMovies.slice(0, 10)} 
        />

        {/* 6. Mid-Page Full-Width Split Spotlight 1: Action Blockbuster Showcase (Distinct Action Pick) */}
        {actionSpotlight && (
          <div className="content-visibility-spotlight">
            <SpotlightBanner
              sectionTitle="Action Blockbuster Showcase"
              movie={actionSpotlight}
              sideMovies={actionSideMovies}
              exploreLink="/genres/Action"
            />
          </div>
        )}

        {/* 7. Popular TV Series */}
        <div className="content-visibility-auto">
          <CarouselRow 
            title="Popular TV Series" 
            movies={popularTV} 
            layout={layout} 
          />
        </div>

        {/* 8. Top Rated Picks (With Movies/Series Toggle) */}
        <div className="content-visibility-auto">
          <CarouselRow 
            title="Top Rated Picks" 
            movies={topRatedMovies} 
            altMovies={topRatedTV}
            mainLabel="Movies"
            altLabel="Series"
            layout={layout}
          />
        </div>

        {/* 9. Mid-Page Full-Width Split Spotlight 2: Captivating Sci-Fi Experience (Distinct Sci-Fi Pick) */}
        {sciFiSpotlight && (
          <div className="content-visibility-spotlight">
            <SpotlightBanner
              sectionTitle="Captivating Sci-Fi Experience"
              movie={sciFiSpotlight}
              sideMovies={sciFiSideMovies}
              exploreLink="/genres/Sci-Fi"
            />
          </div>
        )}

        {/* 10. Latest Action Hits */}
        <div className="content-visibility-auto">
          <CarouselRow 
            title="Latest Action Hits" 
            movies={distinctActionHits} 
            viewAllLink="/genres/Action" 
            layout={layout} 
          />
        </div>

        {/* 11. Trending Sci-Fi */}
        <div className="content-visibility-auto">
          <CarouselRow 
            title="Trending Sci-Fi" 
            movies={distinctSciFiHits} 
            viewAllLink="/genres/Sci-Fi" 
            layout={layout} 
          />
        </div>

        {/* 12. Comedy Hits */}
        <div className="content-visibility-auto">
          <CarouselRow 
            title="Comedy Hits" 
            movies={comedyMovies} 
            viewAllLink="/genres/Comedy" 
            layout={layout} 
          />
        </div>

        {/* 13. Coming Soon */}
        <div className="content-visibility-auto">
          <CarouselRow 
            title="Coming Soon to MovieStream" 
            movies={upcomingMovies} 
            layout={layout} 
          />
        </div>
      </div>
    </div>
  );
}
