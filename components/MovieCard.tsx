'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';
import { Star, Play } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  layout?: 'portrait' | 'landscape';
  index?: number;
  showRankBadge?: boolean;
}

export function MovieCard({ 
  movie, 
  layout = 'landscape', 
  index, 
  showRankBadge = false 
}: MovieCardProps) {
  const isLandscape = layout === 'landscape';
  
  // Decide which image source to use
  const imageSrc = isLandscape 
    ? (movie.bannerUrl || PLACEHOLDERS.BANNER) 
    : (movie.posterUrl || PLACEHOLDERS.POSTER);

  return (
    <Link 
      href={movie.type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`} 
      className="relative cursor-pointer group block"
    >
      {/* Image Card Container */}
      <div 
        className={`relative w-full overflow-hidden bg-white/5 rounded-2xl mb-3 border border-white/5 shadow-2xl transition-all duration-500 card-hover-glow group-hover:scale-[1.03] group-hover:border-red-600/40 ${
          isLandscape ? 'aspect-[16/9]' : 'aspect-[2/3]'
        }`}
      >
        <Image
          src={imageSrc}
          alt={movie.title}
          fill
          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
          sizes={isLandscape 
            ? "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            : "(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
          }
          referrerPolicy="no-referrer"
          unoptimized={!imageSrc.startsWith('http')}
        />
        
        {/* Top-Right Resolution Badge */}
        <div className="absolute top-3 right-3 bg-black/75 text-[9px] px-2 py-1 rounded-lg font-black z-10 text-red-500 tracking-wider flex items-center gap-1 shadow-lg border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          4K
        </div>

        {/* Top-Left Rank Badge (Cineby Red Square Badge Style) */}
        {showRankBadge && index !== undefined && (
          <div className="absolute top-0 left-0 bg-red-600 text-white font-black text-xs px-3.5 py-2.5 rounded-br-2xl shadow-lg z-10 flex items-center justify-center font-outfit min-w-[36px]">
            {index + 1}
          </div>
        )}

        {/* Play Button Overlay Fades In on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(229,9,20,0.6)] scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play size={20} fill="white" className="ml-0.5 text-white" />
          </div>
        </div>
      </div>
      
      {/* Title & Metadata Details Rendered Below Card */}
      <div className="flex flex-col px-1">
        <h4 className="text-[13px] md:text-[14px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-red-500 transition-colors duration-300 uppercase tracking-tight font-outfit">
          {movie.title}
        </h4>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-white/50 font-medium">
          <Star size={11} className="text-red-500 fill-red-500" />
          <span className="text-white/80 font-bold">{movie.rating.toFixed(1)}</span>
          <span>•</span>
          <span>{movie.year}</span>
          <span>•</span>
          <span className="capitalize">{movie.type === 'tv' ? 'Series' : 'Movie'}</span>
        </div>
      </div>
    </Link>
  );
}
