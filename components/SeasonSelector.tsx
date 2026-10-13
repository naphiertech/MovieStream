'use client';

import { useState, useEffect, useMemo } from 'react';
import { Season, Episode, PLACEHOLDERS } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Calendar, 
  Clock, 
  Search, 
  X, 
  LayoutGrid, 
  List, 
  Star, 
  Film 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeasonSelectorProps {
  tvId: string;
  seasons: Season[];
}

export function SeasonSelector({ tvId, seasons }: SeasonSelectorProps) {
  // Sort seasons with regular seasons first (1, 2, 3...) and specials (0) at the end
  const displayedSeasons = useMemo(() => {
    const regular = seasons.filter(s => s.season_number > 0).sort((a, b) => a.season_number - b.season_number);
    const specials = seasons.filter(s => s.season_number === 0);
    return [...regular, ...specials];
  }, [seasons]);

  const [selectedSeason, setSelectedSeason] = useState<number>(() => {
    const firstRegular = displayedSeasons.find(s => s.season_number > 0);
    return firstRegular ? firstRegular.season_number : (displayedSeasons[0]?.season_number ?? 1);
  });

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let isMounted = true;
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tv/${tvId}/season/${selectedSeason}`);
        if (!res.ok) throw new Error('Failed to fetch season data');
        const data = await res.json();
        if (isMounted) {
          setEpisodes(data.episodes || []);
        }
      } catch (error) {
        console.error("Failed to fetch episodes", error);
        if (isMounted) {
          setEpisodes([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (tvId) {
      fetchEpisodes();
    }

    return () => {
      isMounted = false;
    };
  }, [tvId, selectedSeason]);

  const activeSeason = useMemo(() => {
    return displayedSeasons.find(s => s.season_number === selectedSeason);
  }, [displayedSeasons, selectedSeason]);

  const filteredEpisodes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return episodes;

    return episodes.filter(ep => {
      const epNum = ep.episode_number.toString();
      const name = (ep.name || '').toLowerCase();
      const overview = (ep.overview || '').toLowerCase();
      return (
        epNum === q ||
        `e${epNum}` === q ||
        `ep ${epNum}` === q ||
        name.includes(q) ||
        overview.includes(q)
      );
    });
  }, [episodes, searchQuery]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBA';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? 'TBA' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'TBA';
    }
  };

  const formatRuntime = (mins?: number | null) => {
    if (!mins || mins <= 0) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ''}`;
    return `${m}m`;
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Control Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5">
        {/* Season Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide scrolling-touch max-w-full">
          {displayedSeasons.map((season) => {
            const isSelected = selectedSeason === season.season_number;
            const label = season.season_number === 0 ? 'Specials' : `Season ${season.season_number}`;
            return (
              <button
                key={season.id}
                onClick={() => {
                  setSelectedSeason(season.season_number);
                  setSearchQuery('');
                }}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-none md:transition-all duration-200 flex items-center gap-2",
                  isSelected
                    ? "bg-sage-600 text-white border-sage-500 shadow-[0_4px_16px_rgba(132,169,140,0.35)]"
                    : "bg-white/5 text-white/50 border-white/5 hover:border-white/20 hover:text-white"
                )}
              >
                <span>{label}</span>
                {season.episode_count > 0 && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-mono font-medium",
                    isSelected ? "bg-black/30 text-white" : "bg-white/10 text-white/40"
                  )}>
                    {season.episode_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex items-center gap-3">
          {/* Episode Search */}
          <div className="relative flex-1 sm:w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find episode by name or #..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sage-500/60 focus:ring-1 focus:ring-sage-500/40 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                aria-label="Clear episode search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'grid' ? "bg-sage-600 text-white shadow-sm" : "text-white/40 hover:text-white"
              )}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'list' ? "bg-sage-600 text-white shadow-sm" : "text-white/40 hover:text-white"
              )}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Season Info Status Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-white/40 font-medium">
        <div className="flex items-center gap-2">
          <span className="text-white/80 font-bold">
            {activeSeason?.season_number === 0 ? 'Specials' : `Season ${selectedSeason}`}
          </span>
          <span>•</span>
          <span>
            {loading ? 'Loading episodes...' : `${filteredEpisodes.length} ${filteredEpisodes.length === 1 ? 'Episode' : 'Episodes'}`}
          </span>
          {searchQuery && !loading && (
            <span className="text-sage-400 font-normal">
              (filtered from {episodes.length})
            </span>
          )}
        </div>
        {activeSeason?.overview && (
          <p className="line-clamp-1 text-white/40 text-[11px] max-w-xl italic">
            &ldquo;{activeSeason.overview}&rdquo;
          </p>
        )}
      </div>

      {/* Episode Content */}
      {loading ? (
        // Loading Skeleton
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 max-md:animate-none animate-pulse">
                <div className="aspect-video bg-white/5 rounded-2xl border border-white/5" />
                <div className="h-3 bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/5 rounded-2xl border border-white/5 max-md:animate-none animate-pulse" />
            ))}
          </div>
        )
      ) : filteredEpisodes.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
          <Film className="w-12 h-12 text-white/20 mb-3" />
          <h4 className="text-white font-bold text-base">No episodes found</h4>
          <p className="text-white/40 text-xs mt-1 max-w-sm">
            {searchQuery 
              ? `No episodes matching "${searchQuery}" in ${activeSeason?.season_number === 0 ? 'Specials' : `Season ${selectedSeason}`}.` 
              : `Episodes for this season have not been released or are currently unavailable.`}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold hover:bg-sage-500 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEpisodes.map((episode) => {
            const runtimeLabel = formatRuntime(episode.runtime);
            return (
              <Link
                key={episode.id}
                href={`/watch/tv/${tvId}/${selectedSeason}/${episode.episode_number}`}
                className="group flex flex-col focus:outline-none"
              >
                {/* 16:9 Thumbnail Stage */}
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group-hover:border-sage-500/40 bg-zinc-950 transition-none md:transition-all duration-300 shadow-md">
                  <Image
                    src={episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : PLACEHOLDERS.STILL}
                    alt={episode.name || `Episode ${episode.episode_number}`}
                    fill
                    className="object-cover opacity-85 group-hover:opacity-100 transition-none md:transition-transform md:duration-500 md:group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    unoptimized={!episode.still_path}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />

                  {/* Gradient Tints */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Badges Over Image */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-black/80 backdrop-blur-md text-sage-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border border-white/10 shadow-sm">
                      EP {episode.episode_number}
                    </span>
                  </div>

                  {episode.vote_average > 0 && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-black/80 backdrop-blur-md text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-white/10 shadow-sm flex items-center gap-1">
                        <Star size={10} className="fill-amber-300 text-amber-300" />
                        {episode.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {runtimeLabel && (
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="bg-black/80 backdrop-blur-md text-white/80 font-medium text-[10px] px-1.5 py-0.5 rounded-md border border-white/10 shadow-sm flex items-center gap-1">
                        <Clock size={10} className="text-sage-400" />
                        {runtimeLabel}
                      </span>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-none md:transition-opacity duration-200 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-sage-600 text-white flex items-center justify-center shadow-2xl shadow-sage-950/70 transform transition-none md:transition-transform md:duration-200 md:scale-90 md:group-hover:scale-100">
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Text Content Below Thumbnail */}
                <div className="mt-3 flex flex-col">
                  <div className="flex items-center gap-2 text-[11px] text-white/45 font-medium">
                    <span className="flex items-center gap-1 text-white/50">
                      <Calendar size={11} className="text-sage-400" />
                      {formatDate(episode.air_date)}
                    </span>
                    {runtimeLabel && (
                      <>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span>{runtimeLabel}</span>
                      </>
                    )}
                  </div>

                  <h4 className="mt-1 text-white font-bold text-sm tracking-tight line-clamp-1 group-hover:text-sage-300 transition-colors font-outfit">
                    {episode.name || `Episode ${episode.episode_number}`}
                  </h4>

                  <p className="mt-1 text-white/50 text-xs line-clamp-2 leading-relaxed font-normal">
                    {episode.overview || 'No synopsis available for this episode.'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="flex flex-col gap-3">
          {filteredEpisodes.map((episode) => {
            const runtimeLabel = formatRuntime(episode.runtime);
            return (
              <Link
                key={episode.id}
                href={`/watch/tv/${tvId}/${selectedSeason}/${episode.episode_number}`}
                className="group p-3 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-sage-500/40 transition-none md:transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 focus:outline-none"
              >
                {/* Episode Number Column */}
                <div className="hidden sm:flex flex-col items-center justify-center w-10 flex-shrink-0 text-center font-outfit">
                  <span className="text-white/20 group-hover:text-sage-400/80 font-black text-2xl md:text-3xl transition-colors">
                    {String(episode.episode_number).padStart(2, '0')}
                  </span>
                </div>

                {/* Thumbnail */}
                <div className="relative w-full sm:w-48 md:w-60 aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-sage-500/40 flex-shrink-0 transition-colors">
                  <Image
                    src={episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : PLACEHOLDERS.STILL}
                    alt={episode.name || `Episode ${episode.episode_number}`}
                    fill
                    className="object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                    unoptimized={!episode.still_path}
                    sizes="(max-width: 640px) 100vw, 240px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="sm:hidden absolute top-2 left-2">
                    <span className="bg-black/80 backdrop-blur-md text-sage-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border border-white/10">
                      EP {episode.episode_number}
                    </span>
                  </div>

                  {runtimeLabel && (
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-black/80 backdrop-blur-md text-white/80 font-medium text-[10px] px-1.5 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                        <Clock size={10} className="text-sage-400" />
                        {runtimeLabel}
                      </span>
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-none md:transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center shadow-lg">
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/40 mb-1">
                    <span className="text-sage-400 font-bold uppercase tracking-wider text-[10px]">
                      Episode {episode.episode_number}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-sage-400" />
                      {formatDate(episode.air_date)}
                    </span>
                    {episode.vote_average > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-300 font-semibold">
                          <Star size={10} className="fill-amber-300" />
                          {episode.vote_average.toFixed(1)}
                        </span>
                      </>
                    )}
                  </div>

                  <h4 className="text-white font-bold text-base md:text-lg group-hover:text-sage-300 transition-colors font-outfit truncate">
                    {episode.name || `Episode ${episode.episode_number}`}
                  </h4>

                  <p className="mt-1 text-white/55 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed font-normal">
                    {episode.overview || 'No description available for this episode.'}
                  </p>
                </div>

                {/* Watch Button (Desktop) */}
                <div className="hidden lg:flex items-center gap-2 text-sage-400 text-xs font-bold px-3 py-2 rounded-xl bg-sage-600/10 border border-sage-600/20 group-hover:bg-sage-600 group-hover:text-white transition-all flex-shrink-0">
                  <Play size={12} fill="currentColor" />
                  <span>Play</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
