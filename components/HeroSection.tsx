'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star, Calendar, Clock, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface HeroSectionProps {
  movies: Movie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  // Auto-play timer (10 seconds)
  useEffect(() => {
    const timer = setInterval(nextSlide, 10000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      opacity: 0,
      scale: 1.1,
      filter: 'blur(20px)',
    }),
    center: {
      zIndex: 1,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.25, 1, 0.5, 1], // Custom cinematic ease
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(20px)',
      transition: {
        duration: 0.8,
        ease: 'easeInOut'
      }
    })
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, x: -50, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.8, 
        delay: 0.5,
        staggerChildren: 0.1,
        ease: [0.25, 1, 0.5, 1] 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative w-full h-[100dvh] md:h-[95vh] -mt-[80px] md:-mt-[100px] flex flex-col justify-center overflow-hidden bg-black z-30">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
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
            if (info.offset.x > 100) prevSlide();
            else if (info.offset.x < -100) nextSlide();
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing z-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={currentMovie.bannerUrl || PLACEHOLDERS.BANNER}
              alt={currentMovie.title}
              fill
              className="object-cover opacity-60 md:opacity-70"
              priority
              referrerPolicy="no-referrer"
              unoptimized={!currentMovie.bannerUrl}
            />
            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 hero-vignette bg-gradient-to-t from-black via-black/20 to-transparent md:bg-gradient-to-r md:from-black md:via-black/40 md:to-transparent" />
          </div>

          {/* Content Wrapper */}
          <div className="relative h-full flex flex-col justify-end md:justify-center px-6 md:px-14 lg:px-20 z-50 pb-20 md:pb-0 md:pt-[200px]">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="max-w-[900px] mb-8 flex flex-col items-start"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="flex items-center gap-2 bg-[#2dd4bf] text-black px-3 md:px-4 py-1 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[1.5px] md:tracking-[2px] shadow-[0_0_20px_rgba(45,212,191,0.5)]">
                  <TrendingUp size={10} className="stroke-[3px] md:w-3 md:h-3" />
                  {currentMovie.trending ? 'Trending' : 'Featured'}
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 text-white/70 px-3 md:px-4 py-1 rounded-full font-bold text-[9px] md:text-[10px] uppercase tracking-[1.5px] md:tracking-[2px]">
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
                      className="object-contain object-left drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      priority
                    />
                  </div>
                ) : (
                  <h1 className="text-[36px] sm:text-[50px] md:text-[80px] lg:text-[100px] font-extralight leading-[0.9] tracking-[-2px] uppercase text-white drop-shadow-2xl text-left">
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
                <div className="flex items-center gap-2 bg-[#2dd4bf] text-black px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                  <Star size={14} fill="black" className="md:w-4 md:h-4" />
                  <span className="font-black text-xs md:text-sm tracking-tight">{currentMovie.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-white/70 font-bold text-xs md:text-[15px]">
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  <span>{currentMovie.year}</span>
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  <span className="text-[#2dd4bf] border border-[#2dd4bf]/30 px-2 py-0.5 rounded uppercase tracking-[1px] md:tracking-[2px] text-[9px] md:text-xs bg-[#2dd4bf]/5">Cinematic</span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.p variants={itemVariants} className="text-white/60 text-[14px] md:text-[18px] leading-relaxed max-w-[650px] mb-8 md:mb-12 line-clamp-3 md:line-clamp-3 font-medium italic tracking-tight text-left">
                {currentMovie.description}
              </motion.p>

              {/* Buttons */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 md:gap-6 relative z-[60]">
                <Link 
                  href={currentMovie.type === 'tv' ? `/tv/${currentMovie.id}` : `/watch/${currentMovie.id}`}
                  className="flex items-center gap-2 md:gap-4 bg-[#2dd4bf] text-black px-8 md:px-14 py-3.5 md:py-6 rounded-full font-black text-[12px] md:text-[16px] uppercase tracking-wider hover:bg-[#0ed2f7] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_15px_40px_rgba(45,212,191,0.4)] group"
                >
                  <Play size={16} fill="currentColor" className="md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                  Watch Now
                </Link>
                <Link 
                  href={currentMovie.type === 'tv' ? `/tv/${currentMovie.id}` : `/movie/${currentMovie.id}`}
                  className="flex items-center gap-2 md:gap-4 bg-white/5 text-white px-5 md:px-12 py-3.5 md:py-6 rounded-full font-black text-[12px] md:text-[16px] uppercase tracking-wider hover:bg-white/10 transition-all duration-300 backdrop-blur-3xl border border-white/10 hover:border-white/20 active:scale-95 group"
                >
                  <Info size={16} className="md:w-5 md:h-5 transition-transform group-hover:rotate-12" />
                  <span className="hidden sm:inline">Details</span>
                  <span className="sm:hidden">Info</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Hidden on mobile, except dots */}
      <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-10 md:translate-x-0 bottom-12 md:bottom-10 flex items-center gap-4 z-30">
        <button 
          onClick={prevSlide}
          className="hidden md:flex w-14 h-14 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2.5">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8 md:w-10 bg-[#2dd4bf] shadow-[0_0_15px_#2dd4bf]' : 'w-1.5 md:w-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
        <button 
          onClick={nextSlide}
          className="hidden md:flex w-14 h-14 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-[#2dd4bf]/20 w-full z-40 overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 10, ease: 'linear' }}
          className="h-full bg-[#2dd4bf] shadow-[0_0_15px_#2dd4bf] w-full"
        />
      </div>
    </div>
  );
}
