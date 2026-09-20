'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, Star, ArrowRight } from 'lucide-react';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';

interface SpotlightBannerProps {
  sectionTitle: string;
  movie: Movie;
  sideMovies: Movie[];
  exploreLink?: string;
}

export function SpotlightBanner({ 
  sectionTitle, 
  movie, 
  sideMovies,
  exploreLink 
}: SpotlightBannerProps) {
  if (!movie) return null;

  const bgImage = movie.bannerUrl || movie.posterUrl || PLACEHOLDERS.BANNER;

  return (
    <section className="py-8 md:py-14 px-6 md:px-14 lg:px-20 relative">
      {/* StreamCraze Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-outfit">
          {sectionTitle}
        </h2>
        {exploreLink && (
          <Link 
            href={exploreLink} 
            className="text-xs md:text-sm font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 group"
          >
            Explore all 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Main Full-Width Spotlight Container */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] min-h-[420px] md:min-h-[500px] flex items-center">
        {/* Background Image with Dark Vignette Gradients */}
        <Image
          src={bgImage}
          alt={movie.title}
          fill
          className="object-cover opacity-50"
          sizes="100vw"
          referrerPolicy="no-referrer"
          unoptimized={!bgImage.startsWith('http')}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />

        {/* Content Layout Split (Grid 12 cols) */}
        <div className="relative z-20 w-full p-6 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Title, Synopsis, Rating & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-600/20 border border-red-600/40 text-red-500 rounded-md text-[10px] md:text-xs font-black uppercase tracking-widest">
                Featured Spotlight
              </span>
              <span className="text-white/40 text-xs font-bold">•</span>
              <span className="text-white/70 text-xs font-bold">{movie.year}</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tight font-outfit leading-none">
              {movie.title}
            </h3>

            <div className="flex items-center gap-3 text-sm text-white/80 font-bold">
              <div className="flex items-center gap-1 text-red-500">
                <Star size={16} fill="currentColor" />
                <span className="text-white font-black">{movie.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span className="text-red-500 border border-red-600/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600/10">
                Cinematic
              </span>
            </div>

            <p className="text-white/60 text-xs md:text-sm line-clamp-3 md:line-clamp-4 max-w-xl font-medium leading-relaxed">
              {movie.description}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Link
                href={movie.type === 'tv' ? `/tv/${movie.id}` : `/watch/${movie.id}`}
                className="px-6 md:px-8 py-3 bg-white text-black rounded-full text-xs md:text-sm font-black uppercase tracking-wider hover:bg-white/90 transition-all flex items-center gap-2 shadow-xl hover:scale-105"
              >
                <Play size={16} fill="black" />
                Play
              </Link>
              <Link
                href={movie.type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`}
                className="px-6 md:px-8 py-3 bg-white/10 border border-white/15 text-white rounded-full text-xs md:text-sm font-black uppercase tracking-wider hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Info size={16} />
                More Info
              </Link>
            </div>
          </div>

          {/* Right Column: Side-Carousel / Stacked Related Posters */}
          {sideMovies && sideMovies.length > 0 && (
            <div className="lg:col-span-5 flex lg:justify-end gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
              {sideMovies.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={item.type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`}
                  className="group relative w-36 sm:w-44 md:w-48 aspect-[2/3] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-red-600/50"
                >
                  <Image
                    src={item.posterUrl || item.bannerUrl || PLACEHOLDERS.POSTER}
                    alt={item.title}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 150px, 200px"
                    referrerPolicy="no-referrer"
                    unoptimized={!item.posterUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <span className="text-xs font-black text-white uppercase tracking-tight line-clamp-1 group-hover:text-red-500 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-white/60 font-bold">{item.year}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
