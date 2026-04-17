import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, ArrowLeft, Tv } from 'lucide-react';
import { getTVDetails, getRecommendations, PLACEHOLDERS } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import { SeasonSelector } from '@/components/SeasonSelector';
import { MovieRow } from '@/components/MovieRow';
import { ActorList } from '@/components/ActorList';

export default async function TVDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let show;
  let recommendations = [];
  try {
    show = await getTVDetails(id);
    recommendations = await getRecommendations(id, 'tv');
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#060606] selection:bg-[#2dd4bf]/30">
      
      {/* Cinematic Hero Backdrop */}
      <div className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden">
        <Image
          src={show.bannerUrl || PLACEHOLDERS.BANNER}
          alt={show.title}
          fill
          className="object-cover opacity-30 scale-105 blur-[2px]"
          priority
          referrerPolicy="no-referrer"
          unoptimized={!show.bannerUrl}
        />
        <div className="absolute inset-0 hero-vignette" />
        
        <div className="absolute top-32 left-6 md:left-14 lg:left-20 flex items-center gap-2 z-20">
          <Link href="/tv-shows" className="group flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl text-white/50 hover:text-white hover:border-[#2dd4bf]/40 transition-all duration-300">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[2px]">Series Library</span>
          </Link>
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="container mx-auto px-6 md:px-14 lg:px-20 relative z-10 -mt-80 md:-mt-100 pb-32">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
          {/* Floating Poster */}
          <div className="w-56 md:w-80 flex-shrink-0 mx-auto md:mx-0 group">
            <div className="relative aspect-[2/3] w-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-white/5 group-hover:border-[#2dd4bf]/30 transition-all duration-700">
              <Image
                src={show.posterUrl || PLACEHOLDERS.POSTER}
                alt={show.title}
                fill
                className="object-cover scale-100 group-hover:scale-110 transition-transform duration-1000"
                sizes="(max-width: 768px) 224px, 320px"
                referrerPolicy="no-referrer"
                unoptimized={!show.posterUrl}
              />
            </div>
          </div>

          {/* Editorial Details */}
          <div className="flex-grow pt-4 md:pt-14 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 justify-center md:justify-start">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-[-2px] md:tracking-[-3px] uppercase italic drop-shadow-2xl">
                {show.title}
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center gap-2 bg-[#2dd4bf] text-black px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                <Star size={16} fill="black" />
                <span className="font-black text-sm tracking-tight">{show.rating.toFixed(1)} Rating</span>
              </div>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-xl text-white font-bold text-sm">
                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                  <Calendar size={16} className="text-white/30" />
                  <span>{show.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tv size={16} className="text-white/30" />
                  <span>{show.numberOfSeasons} Seasons</span>
                </div>
              </div>

              <div className="px-3 py-1.5 border border-[#2dd4bf]/50 text-[#2dd4bf] rounded-lg font-black text-[10px] tracking-[2px] uppercase bg-[#2dd4bf]/5">
                Full Boxset
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {show.genres.map((genre: string) => (
                <span key={genre} className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/70 text-[11px] font-black uppercase tracking-wider transition-colors cursor-default">
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-white/60 text-lg lg:text-xl leading-relaxed font-medium">
              {show.description}
            </p>
          </div>
        </div>

        <div className="mt-20 pt-16 border-t border-white/5 w-full">
          {show.cast && <ActorList cast={show.cast} />}
        </div>

        {/* Season Selector Component - Full Width below poster/info */}
        <div className="mt-20 pt-16 border-t border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-[#2dd4bf] rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Select Episode</h2>
          </div>
          <SeasonSelector tvId={show.id} seasons={show.seasons} />
        </div>

        {/* Recommendations - Full Width */}
        {recommendations.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/5">
            <MovieRow title="More Like This" movies={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
}
