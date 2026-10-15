'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, ChevronLeft, ChevronRight, Volume2, VolumeX, Loader2, Plus, Check } from 'lucide-react';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
  movies: Movie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    setIsPlayingTrailer(false);
    setTrailerKey(null);
    setIsLoadingTrailer(false);
  }, [currentIndex]);

  // Auto-advance slide every 9 seconds when trailer is not active
  useEffect(() => {
    if (isPlayingTrailer || isLoadingTrailer || movies.length <= 1) return;
    const timer = setInterval(nextSlide, 9000);
    return () => clearInterval(timer);
  }, [nextSlide, isPlayingTrailer, isLoadingTrailer, movies.length]);

  const toggleInlineTrailer = async () => {
    if (isMobile) return;
    if (isPlayingTrailer) {
      setIsPlayingTrailer(false);
      return;
    }

    if (trailerKey) {
      setIsPlayingTrailer(true);
      return;
    }

    try {
      setIsLoadingTrailer(true);
      const currentMovie = movies[currentIndex];
      const res = await fetch(`/api/videos/${currentMovie.type || 'movie'}/${currentMovie.id}`);
      if (!res.ok) throw new Error('Failed to fetch videos');
      const videos = await res.json();
      
      const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || 
                      videos.find((v: any) => v.site === 'YouTube');
      
      if (trailer?.key) {
        setTrailerKey(trailer.key);
        setIsPlayingTrailer(true);
      }
    } catch (error) {
      console.error('Trailer Error:', error);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0) prevSlide();
      else nextSlide();
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const watchHref = currentMovie.type === 'tv'
    ? `/tv/${currentMovie.id}`
    : `/watch/${currentMovie.id}`;
  const detailsHref = currentMovie.type === 'tv'
    ? `/tv/${currentMovie.id}`
    : `/movie/${currentMovie.id}`;

  return (
    <section 
      aria-label="Featured Spotlight"
      className="relative w-full min-h-[580px] md:min-h-[660px] lg:h-[78vh] max-h-[820px] bg-black overflow-hidden select-none flex items-end pt-20 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Background Backdrop Layer with Smooth Crossfade ── */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={isMobile ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: isMobile ? 0 : 0.65, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {isPlayingTrailer && trailerKey ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black">
              <iframe
                width="1920"
                height="1080"
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1&enablejsapi=1`}
                className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-black">
              <Image
                src={currentMovie.bannerUrl || currentMovie.posterUrl || PLACEHOLDERS.BANNER}
                alt={currentMovie.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-[center_25%] md:object-[center_20%] opacity-90 brightness-[0.92]"
                referrerPolicy="no-referrer"
                unoptimized={!currentMovie.bannerUrl}
              />
            </div>
          )}

          {/* ── Seamless Cinematic Vignettes (No harsh edges, perfect breathing room) ── */}
          {/* Left-to-right fade for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 sm:via-black/70 md:via-black/55 to-transparent z-10 pointer-events-none" />
          {/* Bottom fade into the page body */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 sm:via-transparent to-transparent z-10 pointer-events-none" />
          {/* Top subtle bar fade for floating navbar legibility */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* ── Main Hero Content Grid ── */}
      <div className="relative z-20 max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16 w-full pb-8 md:pb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        {/* Left Column: Movie Title, Badges, Synopsis & CTAs */}
        <div className="max-w-2xl flex flex-col items-start">
          {/* Title Area: Official Transparent Logo or Authoritative Bold Typography */}
          <div className="mb-4">
            {currentMovie.logoUrl ? (
              <div className="relative h-16 sm:h-20 md:h-24 lg:h-28 w-auto min-w-[180px] max-w-[280px] sm:max-w-[360px] md:max-w-[440px]">
                <Image
                  src={currentMovie.logoUrl}
                  alt={currentMovie.title}
                  fill
                  priority
                  className="object-contain object-left drop-shadow-[0_12px_30px_rgba(0,0,0,0.9)]"
                  sizes="(max-width: 768px) 280px, 440px"
                />
              </div>
            ) : (
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-outfit drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)] leading-[1.04]">
                {currentMovie.title}
              </h1>
            )}
          </div>

          {/* Clean Metadata Row (No N/A) */}
          <div className="flex items-center gap-3 text-xs md:text-sm text-white/80 font-medium mb-3">
            <div className="flex items-center gap-1 font-semibold text-white">
              <Star size={13} className="text-sage-400 fill-sage-400" />
              <span>{currentMovie.rating > 0 ? currentMovie.rating.toFixed(1) : 'NR'}</span>
            </div>
            {currentMovie.year ? (
              <>
                <span className="text-white/30">•</span>
                <span className="text-white/70">{currentMovie.year}</span>
              </>
            ) : null}
            {currentMovie.duration && currentMovie.duration !== 'N/A' && (
              <>
                <span className="text-white/30">•</span>
                <span className="text-white/70">{currentMovie.duration}</span>
              </>
            )}
            <span className="text-white/30">•</span>
            <span className="text-white/70">{currentMovie.type === 'tv' ? 'TV Series' : 'Feature Film'}</span>
            <span className="text-white/30">•</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sage-400 bg-sage-950/60 border border-sage-500/30 px-1.5 py-0.5 rounded">
              4K HDR
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-white/70 text-xs sm:text-[13.5px] md:text-sm line-clamp-3 leading-relaxed font-normal mb-6 max-w-xl drop-shadow">
            {currentMovie.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Watch Button */}
            <Link
              href={watchHref}
              prefetch={false}
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white hover:bg-white/90 text-black font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)] md:hover:scale-[1.03] transition-all cursor-pointer"
            >
              <Play size={16} fill="black" />
              <span>Play Now</span>
            </Link>

            {/* Trailer / Audio Toggle Button */}
            <button
              type="button"
              onClick={toggleInlineTrailer}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white font-medium text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer"
            >
              {isLoadingTrailer ? (
                <Loader2 size={15} className="animate-spin text-sage-400" />
              ) : isPlayingTrailer ? (
                <Volume2 size={15} className="text-sage-300" />
              ) : (
                <VolumeX size={15} className="text-white/70" />
              )}
              <span>{isPlayingTrailer ? 'Mute Trailer' : 'Trailer Preview'}</span>
            </button>

            {/* Watchlist Toggle */}
            <button
              type="button"
              aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              onClick={() => setInWatchlist((prev) => !prev)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                inWatchlist
                  ? 'bg-sage-600/30 border-sage-500/50 text-sage-300'
                  : 'bg-white/[0.08] hover:bg-white/[0.15] border-white/[0.12] text-white/80 hover:text-white'
              }`}
            >
              {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
            </button>

            {/* Details Link */}
            <Link
              href={detailsHref}
              prefetch={false}
              className="px-4 py-2.5 text-xs font-medium text-white/55 hover:text-white transition-colors"
            >
              Details
            </Link>
          </div>
        </div>

        {/* ── Right Column: Interactive Featured Rail (No side ears!) ── */}
        <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
          {/* Desktop Compact Interactive Thumbnail Rail */}
          <div className="hidden sm:flex items-center gap-2.5 p-1.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08]">
            {movies.slice(0, 5).map((m, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`relative w-24 md:w-28 aspect-[16/9] rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'border-sage-400 ring-2 ring-sage-500/40 opacity-100 scale-[1.03]'
                      : 'border-white/[0.08] opacity-50 hover:opacity-85 hover:border-white/20'
                  }`}
                  title={m.title}
                >
                  <Image
                    src={m.bannerUrl || m.posterUrl || PLACEHOLDERS.BANNER}
                    alt={m.title}
                    fill
                    sizes="120px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    unoptimized={!m.bannerUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-1 left-1.5 right-1.5 text-[9.5px] font-semibold text-white truncate text-left">
                    {m.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slide Indicator & Arrow Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            {/* Slide Dots / Progress */}
            <div className="flex items-center gap-1.5">
              {movies.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goToSlide(i)}
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex
                      ? 'w-6 bg-sage-400 shadow-[0_0_10px_rgba(132,169,140,0.6)]'
                      : 'w-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prevSlide}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.1] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={nextSlide}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.1] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
