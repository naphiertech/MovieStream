'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, ChevronLeft, ChevronRight, Volume2, VolumeX, Loader2, Info, Plus, ThumbsUp } from 'lucide-react';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface HeroSectionProps {
  movies: Movie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const prevIndex = (currentIndex - 1 + movies.length) % movies.length;
  const nextIndex = (currentIndex + 1) % movies.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  useEffect(() => {
    setIsPlayingTrailer(false);
    setTrailerKey(null);
    setIsLoadingTrailer(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isPlayingTrailer || isLoadingTrailer) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide, isPlayingTrailer, isLoadingTrailer]);

  const toggleInlineTrailer = async () => {
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

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const prevMovie = movies[prevIndex];
  const nextMovie = movies[nextIndex];

  // Motion variants for seamless sliding carousel transition (No blank gap!)
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { duration: 0.45, ease: 'easeOut' },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { duration: 0.45, ease: 'easeIn' },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 }
      }
    })
  };

  return (
    <div className="relative w-full pt-[85px] md:pt-[105px] pb-8 bg-black overflow-hidden select-none">
      
      {/* StreamCraze Edge-Peek Carousel Container */}
      <div className="relative w-full max-w-[1720px] mx-auto px-4 md:px-10 flex items-center justify-center min-h-[460px] md:min-h-[560px]">
        
        {/* Left Peek Slide (Live Previous Item) */}
        <div 
          onClick={prevSlide}
          className="hidden lg:block absolute left-4 xl:left-8 w-[15%] h-[82%] rounded-3xl overflow-hidden border border-white/15 opacity-60 hover:opacity-100 hover:scale-100 transition-all duration-500 cursor-pointer shadow-2xl z-10 group/peek scale-95"
          title={`Previous: ${prevMovie.title}`}
        >
          <Image
            src={prevMovie.bannerUrl || prevMovie.posterUrl || PLACEHOLDERS.BANNER}
            alt={prevMovie.title}
            fill
            className="object-cover group-hover/peek:scale-110 transition-transform duration-700 opacity-90"
            sizes="300px"
            referrerPolicy="no-referrer"
            unoptimized={!prevMovie.bannerUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <span className="text-[10px] font-black uppercase text-red-500 tracking-wider block mb-1">Previous</span>
            <p className="text-xs font-bold text-white uppercase truncate font-outfit">{prevMovie.title}</p>
          </div>
        </div>

        {/* Center Main Hero Card Wrapper (Seamless Slide + Drag Swipe Support!) */}
        <div className="relative w-full lg:w-[80%] h-[480px] md:h-[560px] z-20">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentMovie.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80) prevSlide();
                else if (info.offset.x < -80) nextSlide();
              }}
              className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.9)] bg-black cursor-grab active:cursor-grabbing"
            >
              {/* Background Media (Image or Trailer) */}
              {isPlayingTrailer && trailerKey ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black">
                  <iframe
                    width="1920"
                    height="1080"
                    src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1&enablejsapi=1`}
                    className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black">
                  <Image
                    src={currentMovie.bannerUrl || PLACEHOLDERS.BANNER}
                    alt={currentMovie.title}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1400px"
                    className="object-cover opacity-95"
                    priority
                    referrerPolicy="no-referrer"
                    unoptimized={!currentMovie.bannerUrl}
                  />
                </div>
              )}

              {/* Lightened Gradient Vignette Overlays for Maximum Image Clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent z-10" />

              {/* Hero Content Overlay */}
              <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-12 lg:p-14 max-w-3xl">
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tight leading-none mb-3 font-outfit drop-shadow-2xl">
                  {currentMovie.title}
                </h1>

                {/* Metadata Badges */}
                <div className="flex items-center gap-3 mb-3 text-xs md:text-sm font-bold text-white/90">
                  <div className="flex items-center gap-1 text-red-500 font-black">
                    <Star size={16} fill="currentColor" />
                    <span className="text-white font-black">{currentMovie.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{currentMovie.year}</span>
                  <span>•</span>
                  <span className="text-red-500 border border-red-600/40 px-2.5 py-0.5 rounded text-[10px] uppercase font-black tracking-widest bg-red-600/15">
                    Cinematic
                  </span>
                </div>

                {/* Description */}
                <p className="text-white/80 text-xs md:text-sm line-clamp-3 mb-6 font-medium leading-relaxed max-w-xl drop-shadow">
                  {currentMovie.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <Link 
                    href={currentMovie.type === 'tv' ? `/tv/${currentMovie.id}` : `/watch/${currentMovie.id}`}
                    className="px-6 md:px-8 py-3 bg-white text-black rounded-full text-xs md:text-sm font-black uppercase tracking-wider hover:bg-white/95 hover:scale-105 transition-all flex items-center gap-2 shadow-xl"
                  >
                    <Play size={16} fill="black" />
                    Play
                  </Link>
                  <button 
                    onClick={toggleInlineTrailer}
                    className="px-6 md:px-8 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-full text-xs md:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-md"
                  >
                    {isLoadingTrailer ? (
                      <Loader2 size={16} className="animate-spin text-red-500" />
                    ) : isPlayingTrailer ? (
                      <Volume2 size={16} />
                    ) : (
                      <VolumeX size={16} />
                    )}
                    {isPlayingTrailer ? 'Mute' : 'More Info'}
                  </button>

                  {/* StreamCraze Quick Action Buttons */}
                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <button className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all">
                      <Plus size={16} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all">
                      <ThumbsUp size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Peek Slide (Live Next Item) */}
        <div 
          onClick={nextSlide}
          className="hidden lg:block absolute right-4 xl:right-8 w-[15%] h-[82%] rounded-3xl overflow-hidden border border-white/15 opacity-60 hover:opacity-100 hover:scale-100 transition-all duration-500 cursor-pointer shadow-2xl z-10 group/peek scale-95"
          title={`Next: ${nextMovie.title}`}
        >
          <Image
            src={nextMovie.bannerUrl || nextMovie.posterUrl || PLACEHOLDERS.BANNER}
            alt={nextMovie.title}
            fill
            className="object-cover group-hover/peek:scale-110 transition-transform duration-700 opacity-90"
            sizes="300px"
            referrerPolicy="no-referrer"
            unoptimized={!nextMovie.bannerUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <span className="text-[10px] font-black uppercase text-red-500 tracking-wider block mb-1">Next Up</span>
            <p className="text-xs font-bold text-white uppercase truncate font-outfit">{nextMovie.title}</p>
          </div>
        </div>
      </div>

      {/* StreamCraze Dots & Arrows Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6 z-30">
        <button 
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                i === currentIndex ? 'w-8 bg-red-600 shadow-[0_0_12px_#e50914]' : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
