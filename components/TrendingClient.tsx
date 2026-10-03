'use client';

import { useState } from 'react';
import { Movie } from '@/lib/tmdb';
import { MovieRow } from '@/components/MovieRow';
import { RankedMovieCard } from '@/components/RankedMovieCard';
import { Flame, Clapperboard, MonitorPlay } from 'lucide-react';

interface TrendingClientProps {
  trendingAll: Movie[];
  trendingMovies: Movie[];
  trendingTV: Movie[];
  actionMovies: Movie[];
  animationTV: Movie[];
}

export function TrendingClient({
  trendingAll,
  trendingMovies,
  trendingTV,
  actionMovies,
  animationTV
}: TrendingClientProps) {
  const [layout, setLayout] = useState<'portrait' | 'landscape'>('landscape');

  const isLandscape = layout === 'landscape';

  return (
    <div className="px-6 md:px-14 lg:px-20 relative z-10">
      {/* Header Section */}
      <div className="mb-16 animate-in fade-in duration-300">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-600/10 border border-sage-600/20 mb-6">
          <Flame size={14} className="text-sage-400" />
          <span className="text-[10px] font-black uppercase tracking-[3px] text-sage-400">Live Analytics</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-[48px] md:text-[72px] font-black text-white leading-[0.9] tracking-tighter uppercase italic mb-6">
              TRENDING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-sage-400">SPOTLIGHT</span>
            </h1>
            <p className="text-white/40 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
              Track the world&apos;s most watched cinematic titles in real-time. Powered by the TMDB Live Data Engine, presenting the most influential blockbusters and viral series at this very moment.
            </p>
          </div>

          {/* Cineby Layout Style Switcher */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-0.5 mt-4 self-start md:self-end">
            <span className="text-[10px] font-black uppercase tracking-[2px] text-white/30 mr-2 ml-2">Layout:</span>
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

      {/* Top 10 Ranked Board (Always Portrait Poster Style with rank badges per Cineby) */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] md:text-[24px] font-black text-white uppercase tracking-[1px] flex items-center gap-3 font-outfit">
            <span className="w-2 h-7 bg-gradient-to-b from-sage-600 to-sage-400 rounded-full shadow-[0_0_15px_rgba(132, 169, 140,0.4)]" />
            Universal Top 10 Today
          </h2>
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-[2px]">Last 24 Hours</div>
        </div>
        
        <div className="flex gap-[25px] overflow-x-auto pb-10 scrollbar-hide scroll-smooth">
          {trendingAll.slice(0, 10).map((item: Movie, index: number) => (
            <div key={item.id} className="flex-shrink-0 w-[160px] md:w-[190px]">
              <RankedMovieCard movie={item} index={index} />
            </div>
          ))}
        </div>
      </section>

      {/* Media Specific Rows with Layout Propagation */}
      <div className="flex flex-col gap-16">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clapperboard className="text-sage-400" size={18} />
            <h3 className="text-white font-black uppercase tracking-widest text-[12px] font-outfit">Cinema Hits</h3>
          </div>
          <MovieRow title="Trending Movies" movies={trendingMovies.slice(0, 12)} layout={layout} />
        </div>

        <div className="content-visibility-auto">
          <div className="flex items-center gap-2 mb-4">
            <MonitorPlay className="text-sage-400" size={18} />
            <h3 className="text-white font-black uppercase tracking-widest text-[12px] font-outfit">Binge Worthy</h3>
          </div>
          <MovieRow title="Popular TV Series" movies={trendingTV.slice(0, 12)} layout={layout} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 content-visibility-auto">
          <div>
            <MovieRow title="Rising in Action" movies={actionMovies.slice(0, 6)} viewAllLink="/genres/Action" layout={layout} />
          </div>
          
          <div>
            <MovieRow title="Anime Spotlight" movies={animationTV.slice(0, 6)} viewAllLink="/genres/Animation" layout={layout} />
          </div>
        </div>
      </div>
    </div>
  );
}

