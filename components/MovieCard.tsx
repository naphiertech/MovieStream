'use client';

import { useState, useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { Star, Play, Volume2, VolumeX, Loader2 } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  layout?: 'portrait' | 'landscape';
  index?: number;
  showRankBadge?: boolean;
}

const trailerCache = new Map<string, string | null>();

function getCardImageSrc(movie: Movie, isLandscape: boolean): string {
  if (isLandscape) {
    const raw = movie.bannerUrl || movie.posterUrl || PLACEHOLDERS.BANNER;
    return raw.includes('/w1280/') ? raw.replace('/w1280/', '/w780/') : raw;
  }
  return movie.posterUrl || movie.bannerUrl || PLACEHOLDERS.POSTER;
}

export const MovieCard = memo(function MovieCard({
  movie,
  layout = 'portrait',
  index,
  showRankBadge = false,
}: MovieCardProps) {
  const isLandscape = layout === 'landscape';

  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const imageSrc = getCardImageSrc(movie, isLandscape);

  const handleMouseEnter = () => {
    if (
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || window.matchMedia('(hover: none)').matches)
    ) {
      return;
    }

    if (!isLandscape) return;

    hoverTimerRef.current = setTimeout(async () => {
      setIsLoadingTrailer(true);

      const cacheKey = `${movie.type || 'movie'}_${movie.id}`;

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
          const res = await fetch(
            `/api/videos/${movie.type || 'movie'}/${movie.id}`
          );
          if (res.ok) {
            const data = await res.json();
            const trailer =
              data.find(
                (v: any) =>
                  v.site === 'YouTube' &&
                  (v.type === 'Trailer' || v.type === 'Teaser')
              ) || data.find((v: any) => v.site === 'YouTube');
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
    }, 2500);
  };

  const handleMouseLeave = () => {
    if (
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || window.matchMedia('(hover: none)').matches)
    ) {
      return;
    }
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
      prefetch={false}
      className="relative cursor-pointer group block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail Container */}
      <div
        className={`relative w-full overflow-hidden bg-zinc-900 rounded-xl mb-2.5 border border-white/[0.07] shadow-lg md:transition-transform md:duration-300 card-hover-glow md:group-hover:scale-[1.02] md:group-hover:border-sage-500/40 ${
          isLandscape ? 'aspect-[16/9]' : 'aspect-[2/3]'
        }`}
      >
        <Image
          src={imageSrc}
          alt={movie.title}
          fill
          className={`object-cover md:transition-opacity md:duration-300 ${
            isTrailerPlaying
              ? 'opacity-0'
              : 'opacity-95 md:group-hover:opacity-100'
          }`}
          sizes={
            isLandscape
              ? '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 285px'
              : '(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 190px'
          }
          referrerPolicy="no-referrer"
          unoptimized={!imageSrc.startsWith('http')}
        />

        {/* Video Trailer Preview Overlay (Landscape desktop hover) */}
        {isLandscape && isTrailerPlaying && trailerKey && (
          <div className="absolute inset-0 z-10 overflow-hidden rounded-xl bg-black pointer-events-none">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&loop=1&showinfo=0&autohide=1&playlist=${trailerKey}&enablejsapi=1&playsinline=1`}
              title={`${movie.title} Trailer`}
              className="absolute top-1/2 left-1/2 w-[165%] h-[165%] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none border-0"
              allow="autoplay; encrypted-media"
            />
            <div className="absolute inset-0 z-15 bg-black/10 pointer-events-none" />

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMuted((prev) => !prev);
              }}
              className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/85 border border-white/15 flex items-center justify-center text-white hover:bg-black transition-transform shadow-xl cursor-pointer pointer-events-auto"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX size={13} className="text-white" />
              ) : (
                <Volume2 size={13} className="text-white" />
              )}
            </button>
          </div>
        )}

        {/* Rank Badge */}
        {showRankBadge && index !== undefined && (
          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-white/15 text-white font-bold text-xs px-2.5 py-1 rounded-lg z-10 flex items-center justify-center">
            #{index + 1}
          </div>
        )}

        {/* Restrained Desktop Hover Scrim & Play Indicator */}
        {!isTrailerPlaying && (
          <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center z-10 pointer-events-none">
            {isLoadingTrailer ? (
              <div className="w-10 h-10 rounded-full bg-black/80 border border-white/15 flex items-center justify-center text-sage-400 shadow-xl">
                <Loader2 size={17} className="animate-spin text-sage-400" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-white group-hover:bg-sage-600 group-hover:border-sage-500 scale-95 group-hover:scale-100 transition-all duration-200 shadow-xl">
                <Play size={15} fill="white" className="ml-0.5 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title & Metadata Details Below Card (Matching Image 3) */}
      <div className="flex flex-col px-0.5">
        <h4 className="text-[13px] md:text-[13.5px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-sage-400 transition-colors duration-200 tracking-normal">
          {movie.title}
        </h4>
        <div className="flex items-center gap-2.5 mt-1 text-[11.5px] text-white/45 font-medium">
          <span className="flex items-center gap-1 text-white/75 font-semibold">
            <Star size={11} className="text-sage-400 fill-sage-400" />
            {movie.rating > 0 ? movie.rating.toFixed(1) : 'NR'}
          </span>
          {movie.year ? <span>{movie.year}</span> : null}
          <span>{movie.type === 'tv' ? 'TV Show' : 'Movie'}</span>
        </div>
      </div>
    </Link>
  );
});


