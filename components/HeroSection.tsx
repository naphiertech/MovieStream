'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, TrendingUp, ChevronLeft, ChevronRight, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface HeroSectionProps {
  movies: Movie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
  }, []);
  
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  useEffect(() => {
    setIsPlayingTrailer(false);
    setTrailerKey(null);
    setIsLoadingTrailer(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isPlayingTrailer || isLoadingTrailer) return;
    const timer = setInterval(nextSlide, 10000);
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

  const slideVariants: Variants = {
    enter: {
      opacity: 0,
      scale: 1.06,
    },
    center: {
      zIndex: 1,
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
      }
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      scale: 1.04,
      transition: {
        opacity: { duration: 0.6, ease: 'easeIn' },
        scale: { duration: 0.8, ease: 'easeIn' },
      }
    }
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        delay: 0.3,
        staggerChildren: 0.08,
        ease: [0.25, 1, 0.5, 1] 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
    }
  };

  return (
    <div className="relative w-full h-[100dvh] md:h-[100vh] lg:h-[105vh] -mt-[80px] md:-mt-[100px] flex flex-col justify-end overflow-hidden bg-black z-30">
      
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentMovie.id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          {...(!isMobile && {
            drag: "x" as const,
            dragConstraints: { left: 0, right: 0 },
            dragElastic: 0.2,
            onDragEnd: (_: any, info: any) => {
              if (info.offset.x > 100) prevSlide();
              else if (info.offset.x < -100) nextSlide();
            },
          })}
          className={`absolute inset-0 z-0 ${!isMobile ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          {/* Background Media */}
          <div className="absolute inset-0 bg-black">
            <AnimatePresence mode="wait">
              {!isMobile && isPlayingTrailer && trailerKey ? (
                <motion.div 
                  key="trailer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                >
                  <iframe
                    width="1920"
                    height="1080"
                    src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1&enablejsapi=1&vq=hd1080`}
                    className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </motion.div>
              ) : (
                <motion.div
                  key="image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentMovie.bannerUrl || PLACEHOLDERS.BANNER}
                    alt={currentMovie.title}
                    fill
                    sizes="100vw"
                    className="object-cover opacity-60 md:opacity-70"
                    priority
                    referrerPolicy="no-referrer"
                    unoptimized={!currentMovie.bannerUrl}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 hero-vignette bg-gradient-to-t from-black via-black/20 to-transparent md:bg-gradient-to-r md:from-black md:via-black/40 md:to-transparent" />
          </div>

          {/* Content Wrapper */}
          <div className="relative h-full flex flex-col justify-end md:justify-center px-6 md:px-14 lg:px-20 z-50 pb-20 md:pb-0 md:pt-[200px] pointer-events-none">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="max-w-[900px] mb-8 flex flex-col items-start pointer-events-auto"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="flex items-center gap-2 bg-red-600 text-white px-3 md:px-4 py-1 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[1.5px] md:tracking-[2px] shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                  <TrendingUp size={10} className="stroke-[3px] md:w-3 md:h-3" />
                  {currentMovie.trending ? 'Trending' : 'Featured'}
                </div>
                <div className="bg-white/10 md:backdrop-blur-xl border border-white/10 text-white/70 px-3 md:px-4 py-1 rounded-full font-bold text-[9px] md:text-[10px] uppercase tracking-[1.5px] md:tracking-[2px]">
                  4K Ultra HD
                </div>
              </motion.div>

              {/* Title / Logo */}
              <motion.div variants={itemVariants} className="mb-6 md:mb-8 flex justify-start w-full">
                {currentMovie.logoUrl ? (
                  <div className="relative h-20 sm:h-32 md:h-48 w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px]">
                    <Image
                      src={currentMovie.logoUrl}
                      alt={currentMovie.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-contain object-left drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      priority
                    />
                  </div>
                ) : (
                  <h1 className="text-[36px] sm:text-[50px] md:text-[80px] lg:text-[100px] font-black leading-[0.9] tracking-[-2px] uppercase text-white drop-shadow-2xl text-left font-outfit">
                    {currentMovie.title.split(':').map((part, i) => (
                      <span key={i} className={i === 0 ? "block mb-2" : "block text-[0.6em] font-light opacity-60"}>
                        {part}
                      </span>
                    ))}
                  </h1>
                )}
              </motion.div>

              {/* Stats - Cineby Style */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
                <div className="flex items-center gap-1.5 text-red-500 font-black">
                  <Star size={16} fill="currentColor" className="md:w-5 md:h-5 text-red-600" />
                  <span className="text-white font-black text-sm md:text-base tracking-tight">{currentMovie.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-white/70 font-bold text-xs md:text-[15px]">
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  <span>{currentMovie.year}</span>
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  <span className="text-red-500 border border-red-600/30 px-2 py-0.5 rounded uppercase tracking-[1px] md:tracking-[2px] text-[9px] md:text-xs bg-red-600/5">Cinematic</span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.p variants={itemVariants} className="text-white/60 text-[14px] md:text-[18px] leading-relaxed max-w-[650px] mb-8 md:mb-12 line-clamp-3 md:line-clamp-3 font-medium tracking-tight text-left">
                {currentMovie.description}
              </motion.p>

              {/* Buttons - Cineby Pixel-Perfect Style */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 md:gap-6 relative z-[60]">
                <Link 
                  href={currentMovie.type === 'tv' ? `/tv/${currentMovie.id}` : `/watch/${currentMovie.id}`}
                  className="flex items-center gap-2 md:gap-4 bg-white text-black px-8 md:px-14 py-3.5 md:py-6 rounded-full font-black text-[12px] md:text-[16px] uppercase tracking-wider hover:bg-white/95 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_15px_40px_rgba(255,255,255,0.1)] group"
                >
                  <Play size={16} fill="black" className="md:w-5 md:h-5 text-black" />
                  Play
                </Link>
                <button 
                  onClick={toggleInlineTrailer}
                  className="flex items-center gap-2 md:gap-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-8 md:px-12 py-3.5 md:py-6 rounded-full font-black text-[12px] md:text-[16px] uppercase tracking-wider transition-all active:scale-95 group"
                >
                  {isLoadingTrailer ? (
                    <Loader2 size={16} className="animate-spin text-red-500 md:w-5 md:h-5" />
                  ) : isPlayingTrailer ? (
                    <Volume2 size={16} className="md:w-5 md:h-5 group-hover:text-red-500 transition-colors" />
                  ) : (
                    <VolumeX size={16} className="md:w-5 md:h-5 group-hover:text-red-500 transition-colors" />
                  )}
                  {isPlayingTrailer ? 'Mute' : 'See Trailer'}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-10 md:translate-x-0 bottom-12 md:bottom-10 flex items-center gap-4 z-[70]">
        <button 
          onClick={prevSlide}
          className="hidden md:flex w-14 h-14 rounded-full bg-black/40 md:bg-white/5 md:backdrop-blur-xl border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-red-600/40 transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2.5">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8 md:w-10 bg-red-600 shadow-[0_0_15px_#e50914]' : 'w-1.5 md:w-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
        <button 
          onClick={nextSlide}
          className="hidden md:flex w-14 h-14 rounded-full bg-black/40 md:bg-white/5 md:backdrop-blur-xl border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-red-600/40 transition-all active:scale-90"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-red-600/20 w-full z-40 overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 10, ease: 'linear' }}
          className="h-full bg-red-600 shadow-[0_0_15px_#e50914] w-full"
        />
      </div>
    </div>
  );
}
