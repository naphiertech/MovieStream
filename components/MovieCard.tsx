import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/lib/db';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} className="relative cursor-pointer group block">
      <div className="aspect-[2/3] bg-[#111111] rounded-[8px] overflow-hidden mb-[10px] border border-white/5 relative">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-[10px] right-[10px] bg-black/60 text-[10px] px-[4px] py-[2px] border border-white/30 rounded-[2px] font-semibold z-10 text-white">
          HD
        </div>
      </div>
      
      <div className="flex flex-col">
        <h4 className="text-[14px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
          {movie.title}
        </h4>
        <span className="text-[12px] text-[#999999]">
          {movie.year} • {movie.duration}
        </span>
      </div>
    </Link>
  );
}
