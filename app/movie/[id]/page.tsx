import NextImage from 'next/image';
import Link from 'next/link';
import { Play, Star, ArrowLeft, Plus } from 'lucide-react';
import { getMovieDetails, getRecommendations, getSimilar, PLACEHOLDERS } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import { ActorList } from '@/components/ActorList';
import { CinematicBackground } from '@/components/CinematicBackground';
import { MovieRow } from '@/components/MovieRow';

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let movie;
  let recommendations: any[] = [];
  let similar: any[] = [];
  try {
    movie = await getMovieDetails(id);
    [recommendations, similar] = await Promise.all([
      getRecommendations(id, 'movie'),
      getSimilar(id, 'movie'),
    ]);
  } catch (error) {
    notFound();
  }

  if (!movie) {
    notFound();
  }

  const titleParts = movie.title.split(' ');
  const mainTitle = titleParts.slice(0, -1).join(' ');
  const accentTitle = titleParts[titleParts.length - 1];

  return (
    <div className="min-h-screen bg-[#060606] selection:bg-[#2dd4bf]/30 overflow-x-hidden relative">
      {/* Cinematic Hero Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[75vh] md:h-[85vh] overflow-hidden pointer-events-none">
        <CinematicBackground 
          id={movie.id} 
          type="movie" 
          fallbackImage={movie.bannerUrl || PLACEHOLDERS.BANNER} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/40 to-transparent z-10" />
      </div>

      {/* Main Content — positioned at bottom of hero */}
      <div className="relative z-20 flex flex-col justify-end min-h-[70vh] md:min-h-[78vh] pb-6 md:pb-10">
        <div className="container mx-auto px-6 md:px-14 lg:px-20">
          
          {/* Back Button */}
          <div className="fixed top-6 left-6 z-50">
            <Link href="/" className="group inline-flex items-center justify-center w-10 h-10 bg-black/50 md:backdrop-blur-xl border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white/30 transition-all duration-300">
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex items-end gap-6 md:gap-8">
            {/* Compact Poster */}
            <div className="hidden sm:block flex-shrink-0 w-40 md:w-52 lg:w-60">
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)] border border-white/10">
                <NextImage
                  src={movie.posterUrl || PLACEHOLDERS.POSTER}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 240px"
                  referrerPolicy="no-referrer"
                  unoptimized={!movie.posterUrl}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-grow min-w-0">
              {/* Movie Logo / Title */}
              <div className="mb-3 max-w-xl">
                {movie.logoUrl ? (
                  <div className="relative h-14 sm:h-18 md:h-22 lg:h-24 w-full max-w-[180px] sm:max-w-[260px] md:max-w-[340px]">
                    <NextImage
                      src={movie.logoUrl}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 768px) 180px, 340px"
                      className="object-contain object-left drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                      priority
                    />
                  </div>
                ) : (
                  <h1 className="text-[28px] md:text-[42px] lg:text-[50px] font-black text-white leading-[0.9] tracking-[-2px] uppercase italic drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                    {mainTitle && <span className="opacity-90 block">{mainTitle}</span>}
                    <span className="text-[#2dd4bf] drop-shadow-[0_0_20px_rgba(45,212,191,0.4)] block">{accentTitle}</span>
                  </h1>
                )}
              </div>
              
              {/* Inline Metadata — Cineby style */}
              <div className="flex items-center gap-2 text-sm text-white/70 mb-3 flex-wrap">
                <span className="flex items-center gap-1 text-[#f5c518]">
                  <Star size={14} fill="currentColor" />
                  <span className="font-bold text-white">{movie.rating.toFixed(1)}</span>
                </span>
                <span className="text-white/30">·</span>
                <span>{movie.year}</span>
                <span className="text-white/30">·</span>
                <span>{movie.duration}</span>
                {movie.genres.length > 0 && (
                  <>
                    <span className="text-white/30">·</span>
                    <span>{movie.genres.join(' · ')}</span>
                  </>
                )}
              </div>

              {/* Description — compact */}
              <p className="text-white/50 text-sm md:text-base leading-relaxed mb-5 max-w-xl line-clamp-3">
                {movie.description}
              </p>

              {/* Action Buttons — Cineby style */}
              <div className="flex items-center gap-3">
                <Link 
                  href={`/watch/${movie.id}`}
                  className="group inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-white/90 transition-all duration-300 active:scale-95"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Play</span>
                </Link>

                <button className="inline-flex items-center justify-center w-10 h-10 bg-white/10 border border-white/15 rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Below-the-fold Content */}
      <div className="relative z-20 pb-32">
        <div className="container mx-auto px-6 md:px-14 lg:px-20">
          {/* Cast Carousel */}
          <div className="pt-10 border-t border-white/5 w-full">
            {movie.cast && <ActorList cast={movie.cast} />}
          </div>

          {/* Recommended */}
          {recommendations.length > 0 && (
            <div className="mt-16 pt-10 border-t border-white/5">
              <MovieRow title="Recommended" movies={recommendations} />
            </div>
          )}

          {/* Similar Movies */}
          {similar.length > 0 && (
            <div className="mt-16 pt-10 border-t border-white/5">
              <MovieRow title="Similar Movies" movies={similar} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
