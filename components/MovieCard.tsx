'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { Star, Play, Volume2, VolumeX, Loader2, Plus, ThumbsUp, Info } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  layout?: 'portrait' | 'landscape';
  index?: number;
  showRankBadge?: boolean;
}

// Module-level in-memory cache to prevent duplicate API requests across card hovers
const trailerCache = new Map<string, string | null>();

export function MovieCard({ 
  movie, 
  layout = 'landscape', 
  index, 
  showRankBadge = false 
}: MovieCardProps) {
  const isLandscape = layout === 'landscape';

  const [isHovered, setIsHovered] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Decide which image source to use
  const imageSrc = isLandscape 
    ? (movie.bannerUrl || PLACEHOLDERS.BANNER) 
    : (movie.posterUrl || PLACEHOLDERS.POSTER);

  const handleMouseEnter = () => {
    setIsHovered(true);

    if (!isLandscape) return;

    // 2-second hover timer before playing trailer preview
    hoverTimerRef.current = setTimeout(async () => {
      setIsLoadingTrailer(true);

      const cacheKey = `${movie.type || 'movie'}_${movie.id}`;
      
      // Check in-memory client cache first
      if (trailerCache.has(cacheKey)) {
        const cached = trailerCache.get(cacheKey);
        setIsLoadingTrailer(false);
        if (cached) {
          setTrailerKey(cached);
          setIsTrailerPlaying(true);
        }
        return;
      }

      let key = trailerKey;
      if (!key) {
        try {
          const res = await fetch(`/api/videos/${movie.type || 'movie'}/${movie.id}`);
          if (res.ok) {
            const data = await res.json();
            const trailer = data.find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || data.find((v: any) => v.site === 'YouTube');
            if (trailer?.key) {
              key = trailer.key;
              setTrailerKey(key);
              trailerCache.set(cacheKey, key);
            } else {
              trailerCache.set(cacheKey, null);
            }
          }
        } catch (error) {
          console.error('Failed to fetch trailer:', error);
          trailerCache.set(cacheKey, null);
        }
      }

      setIsLoadingTrailer(false);
      if (key) {
        setIsTrailerPlaying(true);
      }
    }, 2000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsTrailerPlaying(false);
    setIsLoadingTrailer(false);

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  return (
    <Link 
      href={movie.type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`} 
      className="relative cursor-pointer group block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image / Video Card Container */}
      <div 
        className={`relative w-full overflow-hidden bg-white/5 rounded-2xl mb-3 border border-white/5 shadow-2xl transition-all duration-500 card-hover-glow group-hover:scale-[1.03] group-hover:border-red-600/40 ${
          isLandscape ? 'aspect-[16/9]' : 'aspect-[2/3]'
        }`}
      >
        <Image
          src={imageSrc}
          alt={movie.title}
          fill
          className={`object-cover transition-opacity duration-500 ${
            isTrailerPlaying ? 'opacity-0' : 'opacity-90 group-hover:opacity-100'
          }`}
          sizes={isLandscape 
            ? "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            : "(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
          }
          referrerPolicy="no-referrer"
          unoptimized={!imageSrc.startsWith('http')}
        />

        {/* Video Trailer Overlay (Landscape mode only after 2s hover) */}
        {isLandscape && isTrailerPlaying && trailerKey && (
          <div className="absolute inset-0 z-10 overflow-hidden rounded-2xl bg-black pointer-events-none">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&loop=1&showinfo=0&autohide=1&playlist=${trailerKey}&enablejsapi=1&playsinline=1`}
              title={`${movie.title} Trailer`}
              className="absolute top-1/2 left-1/2 w-[165%] h-[165%] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none border-0"
              allow="autoplay; encrypted-media"
            />
            {/* Protective Overlay Shield */}
            <div className="absolute inset-0 z-15 bg-black/10 pointer-events-none" />

            {/* Audio Mute/Unmute Toggle Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMuted((prev) => !prev);
              }}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black hover:scale-110 transition-all shadow-xl cursor-pointer pointer-events-auto"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={14} className="text-white" /> : <Volume2 size={14} className="text-white" />}
            </button>
          </div>
        )}
        
        {/* Top-Right Resolution Badge (Only visible when trailer is not playing) */}
        {!isTrailerPlaying && (
          <div className="absolute top-3 right-3 bg-black/75 text-[9px] px-2 py-1 rounded-lg font-black z-10 text-red-500 tracking-wider flex items-center gap-1 shadow-lg border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            4K
          </div>
        )}

        {/* Top-Left Rank Badge */}
        {showRankBadge && index !== undefined && (
          <div className="absolute top-0 left-0 bg-red-600 text-white font-black text-xs px-3.5 py-2.5 rounded-br-2xl shadow-lg z-10 flex items-center justify-center font-outfit min-w-[36px]">
            {index + 1}
          </div>
        )}

        {/* StreamCraze Inline Hover Action Controls */}
        {!isTrailerPlaying && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-10">
            {/* Top row rating */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-red-500 bg-black/80 px-2 py-0.5 rounded border border-white/10">
                {movie.rating.toFixed(1)} ★
              </span>
            </div>

            {/* Center Play Button */}
            <div className="flex items-center justify-center">
              {isLoadingTrailer ? (
                <div className="w-10 h-10 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-red-500 shadow-xl animate-pulse">
                  <Loader2 size={18} className="animate-spin text-red-500" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(229,9,20,0.6)] scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Play size={16} fill="white" className="ml-0.5 text-white" />
                </div>
              )}
            </div>

            {/* Bottom Row StreamCraze Quick Icons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                  <Plus size={12} />
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                  <ThumbsUp size={11} />
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                <Info size={12} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Title & Metadata Details Rendered Below Card */}
      <div className="flex flex-col px-1">
        <h4 className="text-[13px] md:text-[14px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-red-500 transition-colors duration-300 uppercase tracking-tight font-outfit">
          {movie.title}
        </h4>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-white/50 font-medium">
          <Star size={11} className="text-red-500 fill-red-500" />
          <span className="text-white/80 font-bold">{movie.rating.toFixed(1)}</span>
          <span>•</span>
          <span>{movie.year}</span>
          <span>•</span>
          <span className="capitalize">{movie.type === 'tv' ? 'Series' : 'Movie'}</span>
        </div>
      </div>
    </Link>
  );
}
