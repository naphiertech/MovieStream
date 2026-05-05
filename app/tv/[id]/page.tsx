import NextImage from 'next/image';
import Link from 'next/link';
import { Star, Calendar, ArrowLeft, Tv, ArrowDown, Play } from 'lucide-react';
import { getTVDetails, getRecommendations, PLACEHOLDERS } from '@/lib/tmdb';
import { CinematicBackground } from '@/components/CinematicBackground';
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

  if (!show) {
    notFound();
  }

  const titleParts = show.title.split(' ');
  const mainTitle = titleParts.slice(0, -1).join(' ');
  const accentTitle = titleParts[titleParts.length - 1];

  return (
    <div className="min-h-screen bg-[#060606] selection:bg-[#2dd4bf]/30 overflow-x-hidden relative">
      
      {/* Cinematic Hero Backdrop with Auto-playing Trailer */}
      <div className="absolute top-0 left-0 w-full h-[75vh] md:h-[85vh] overflow-hidden pointer-events-none">
        <CinematicBackground 
          id={show.id} 
          type="tv" 
          fallbackImage={show.bannerUrl || PLACEHOLDERS.BANNER} 
        />
        {/* Added a gradient overlay to blend the bottom of the video into the background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/40 to-transparent z-10" />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-20 pt-32 pb-32">
        <div className="container mx-auto px-6 md:px-14 lg:px-20">
          
          <div className="mb-10">
            <Link href="/tv-shows" className="group inline-flex items-center gap-3 bg-black/40 backdrop-blur-3xl border border-white/10 px-5 py-2.5 rounded-2xl text-white/50 hover:text-white hover:border-[#2dd4bf]/40 transition-all duration-300">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-[2px]">Series Library</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
          {/* Floating Poster */}
          <div className="w-56 md:w-80 flex-shrink-0 mx-auto md:mx-0 group">
            <div className="relative aspect-[2/3] w-full rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,1)] border-2 border-white/5 group-hover:border-[#2dd4bf]/30 transition-all duration-700">
              <NextImage
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
            <div className="mb-10 flex justify-center md:justify-start w-full">
              {show.logoUrl ? (
                <div className="relative h-20 sm:h-28 md:h-36 lg:h-40 w-full max-w-[250px] sm:max-w-[350px] md:max-w-[450px]">
                  <NextImage
                    src={show.logoUrl}
                    alt={show.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-contain object-center md:object-left drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    priority
                  />
                </div>
              ) : (
                <h1 className="text-[40px] md:text-[60px] lg:text-[80px] font-black text-white leading-[0.85] tracking-[-3px] uppercase italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                  {mainTitle && <span className="opacity-90 block mb-2">{mainTitle}</span>}
                  <span className="text-[#2dd4bf] drop-shadow-[0_0_30px_rgba(45,212,191,0.5)] block">{accentTitle}</span>
                </h1>
              )}
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center gap-2 bg-[#2dd4bf] text-black px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(45,212,191,0.4)]">
                <Star size={16} fill="black" />
                <span className="font-black text-sm tracking-tight">{show.rating.toFixed(1)} Rating</span>
              </div>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl border border-white/10 px-5 py-2 rounded-xl text-white/90 font-bold text-sm shadow-xl">
                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                  <Calendar size={16} className="text-[#2dd4bf]" />
                  <span>{show.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tv size={16} className="text-[#2dd4bf]" />
                  <span>{show.numberOfSeasons} Seasons</span>
                </div>
              </div>

              <div className="px-4 py-2 border-2 border-[#2dd4bf]/20 text-[#2dd4bf] rounded-xl font-black text-[10px] tracking-[2.5px] uppercase bg-[#2dd4bf]/5 backdrop-blur-md">
                Full Boxset
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
              {show.genres.map((genre: string) => (
                <span key={genre} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 text-[11px] font-black uppercase tracking-widest transition-all duration-300 cursor-default hover:text-[#2dd4bf] hover:border-[#2dd4bf]/30 shadow-lg">
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-white/50 text-lg lg:text-xl leading-relaxed font-medium drop-shadow-sm">
              {show.description}
            </p>

            <Link 
              href="#episodes" 
              className="mt-10 inline-flex items-center gap-4 bg-[#2dd4bf] text-black px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[3px] shadow-[0_20px_40px_rgba(45,212,191,0.3)] hover:bg-[#0ed2f7] hover:scale-110 transition-all duration-500 group overflow-hidden"
            >
              Watch Episodes
              <ArrowDown size={20} className="group-hover:translate-y-1.5 transition-transform duration-500 ease-out" />
            </Link>
          </div>
        </div>

        <div className="mt-20 pt-16 border-t border-white/5 w-full">
          {show.cast && <ActorList cast={show.cast} />}
        </div>

        {/* Season Selector Component - Full Width below poster/info */}
        <div id="episodes" className="mt-20 pt-16 border-t border-white/5 scroll-mt-24">
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
    </div>
  );
}
