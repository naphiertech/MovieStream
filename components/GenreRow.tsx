'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface GenreTile {
  name: string;
  id: string;
  image: string;
}

const GENRE_TILES: GenreTile[] = [
  {
    name: 'Action',
    id: '28',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Comedy',
    id: '35',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Romance',
    id: '10749',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Horror',
    id: '27',
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Animation',
    id: '16',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Documentary',
    id: '99',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  },
];

export function GenreRow() {
  return (
    <section className="py-8 md:py-12 px-6 md:px-14 lg:px-20">
      {/* StreamCraze Style Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight font-outfit">
          Genres
        </h2>
        <Link 
          href="/genres" 
          className="text-xs md:text-sm font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 group"
        >
          Explore all 
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Genre Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {GENRE_TILES.map((genre) => (
          <Link
            key={genre.name}
            href={`/genres/${genre.name}`}
            className="group relative h-28 md:h-36 rounded-2xl overflow-hidden border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.04] hover:border-red-600/50 hover:shadow-red-600/20"
          >
            <Image
              src={genre.image}
              alt={genre.name}
              fill
              className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <span className="text-sm md:text-base font-black text-white uppercase tracking-wider text-center drop-shadow-lg font-outfit group-hover:text-red-400 group-hover:scale-105 transition-all">
                {genre.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
