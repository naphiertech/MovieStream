'use client';

import { useState, useEffect, useRef } from 'react';
import { getSeasonDetails, Season, Episode, PLACEHOLDERS } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Loader2, Calendar } from 'lucide-react';

interface SeasonSelectorProps {
  tvId: string;
  seasons: Season[];
}

export function SeasonSelector({ tvId, seasons }: SeasonSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState(() => {
    const firstFullSeason = seasons.find(s => s.season_number > 0);
    return firstFullSeason ? firstFullSeason.season_number : (seasons[0]?.season_number ?? 1);
  });
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tv/${tvId}/season/${selectedSeason}`);
        if (!res.ok) throw new Error('Failed to fetch season data');
        const data = await res.json();
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error("Failed to fetch episodes", error);
      } finally {
        setLoading(false);
      }
    };

    if (tvId) {
      fetchEpisodes();
    }
  }, [tvId, selectedSeason]);

  return (
    <div className="mt-12">
      {/* Season Tabs - Cineby Style */}
      <div 
        className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide h-20 scrolling-touch"
      >
        {seasons.filter(s => s.season_number > 0).map((season) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season.season_number)}
            className={`flex-shrink-0 px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-[2px] border transition-all duration-300 ${
              selectedSeason === season.season_number
                ? 'bg-sage-600 text-white border-sage-600 shadow-[0_10px_30px_rgba(132, 169, 140,0.3)]'
                : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            Season {season.season_number}
          </button>
        ))}
      </div>

      {/* Episode Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-sage-400 mb-4" size={40} />
            <p className="text-white/20 font-black uppercase tracking-[2px] text-xs">Loading Episodes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="group relative animate-in fade-in duration-200"
              >
                <Link href={`/watch/tv/${tvId}/${selectedSeason}/${episode.episode_number}`} className="block">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 group-hover:border-sage-600/40 transition-all duration-300 shadow-xl">
                    <Image
                      src={episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : PLACEHOLDERS.STILL}
                      alt={episode.name}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                      referrerPolicy="no-referrer"
                      unoptimized={!episode.still_path}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-sage-400 uppercase tracking-[1px]">Ep {episode.episode_number}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-[1px]">
                          {episode.air_date ? new Date(episode.air_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBA'}
                        </span>
                      </div>
                      <h4 className="text-white font-black text-[13px] uppercase tracking-tight line-clamp-1 group-hover:text-sage-400 transition-colors">
                        {episode.name}
                      </h4>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                       <div className="w-12 h-12 rounded-full bg-sage-600 text-white flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-200">
                          <Play size={20} fill="currentColor" />
                       </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
