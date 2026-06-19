import { getMoviesByGenre, GENRE_MAP, Movie } from '@/lib/tmdb';
import { GenreGrid } from '@/components/GenreGrid';
import { notFound } from 'next/navigation';
import { LayoutGrid, ArrowLeft, Film } from 'lucide-react';
import Link from 'next/link';

export default async function GenrePage({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params;
  const decodedGenre = decodeURIComponent(genre);
  
  const genreId = GENRE_MAP[decodedGenre];
  
  if (!genreId) {
    notFound();
  }

  const genreMovies = await getMoviesByGenre(genreId);

  // Render the cinematic discovery page
  return (
    <div className="min-h-screen bg-[#060606] relative overflow-hidden">
      
      {/* Cinematic Background Glow */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#2dd4bf]/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-14 lg:px-20 pt-36 pb-24 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/genres" 
            className="group inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 font-bold text-xs uppercase tracking-[2px]"
          >
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Genres
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/5 pb-8">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2.5xl bg-white/5 border border-white/5 text-[#2dd4bf] shadow-inner">
              <LayoutGrid size={28} strokeWidth={2} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[#2dd4bf] mb-2">
                <span className="text-[10px] font-black uppercase tracking-[3px] font-outfit">Discovery Portal</span>
              </div>
              <h1 className="text-[34px] md:text-[50px] font-black text-white leading-none tracking-tight uppercase italic font-outfit">
                {decodedGenre} <span className="text-[#2dd4bf]/40 not-italic">Movies</span>
              </h1>
            </div>
          </div>
          
          {genreMovies.length > 0 && (
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-white/50 font-black text-[10px] uppercase tracking-[2px]">
              <Film size={12} className="text-[#2dd4bf]" />
              <span>{genreMovies.length} Productions Available</span>
            </div>
          )}
        </div>
        
        {/* Grid or Empty State */}
        {genreMovies.length > 0 ? (
          <GenreGrid initialMovies={genreMovies} genreId={genreId} />
        ) : (
          <div className="flex flex-col items-center justify-center py-40 border border-white/5 rounded-[3rem] bg-white/[0.01] backdrop-blur-3xl">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-6 text-white/20 shadow-inner">
              <LayoutGrid size={32} strokeWidth={1.5} />
            </div>
            <p className="text-white/30 font-black text-[11px] uppercase tracking-[4px]">No productions found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
