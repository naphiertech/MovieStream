import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { Movie } from '@/lib/db';

interface HeroSectionProps {
  movie: Movie;
}

export function HeroSection({ movie }: HeroSectionProps) {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[420px] md:h-[500px] lg:h-[600px] -mt-[70px] pt-[100px] px-10 flex flex-col justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={movie.bannerUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          referrerPolicy="no-referrer"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[600px]">
        <div className="text-[12px] uppercase tracking-[2px] mb-[15px] text-[#E50914] font-bold">
          {movie.trending ? 'Trending Now' : 'Featured'}
        </div>
        
        <h1 className="text-[50px] md:text-[82px] font-black leading-[0.9] mb-[20px] tracking-[-2px] uppercase">
          {movie.title}
        </h1>
        
        <div className="flex items-center gap-[20px] text-[14px] mb-[25px]">
          <span className="bg-[#E1B12C] text-black px-[6px] py-[2px] rounded-[3px] font-extrabold">
            IMDb {movie.rating.toFixed(1)}
          </span>
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
          <span className="text-[#999999]">• {movie.genres.slice(0, 2).join(', ')}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-[15px]">
          <Link 
            href={`/watch/${movie.id}`}
            className="flex items-center gap-[8px] bg-white text-black px-[30px] py-[12px] rounded-[4px] font-bold text-[14px] hover:bg-gray-200 transition-colors"
          >
            <Play size={18} fill="currentColor" />
            Play Now
          </Link>
          <Link 
            href={`/movie/${movie.id}`}
            className="flex items-center gap-[8px] bg-[#646464]/50 text-white px-[30px] py-[12px] rounded-[4px] font-bold text-[14px] hover:bg-[#646464]/70 transition-colors backdrop-blur-[10px]"
          >
            <Info size={18} />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
