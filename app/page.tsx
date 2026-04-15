'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { MovieRow } from '@/components/MovieRow';
import { movies, Movie } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function Home() {
  const trendingMovies = movies.filter(m => m.trending);
  const latestMovies = movies.filter(m => m.latest);
  const actionMovies = movies.filter(m => m.genres.includes('Action'));
  const sciFiMovies = movies.filter(m => m.genres.includes('Sci-Fi'));

  const heroMovie = trendingMovies[0] || movies[0];

  const [watchHistory, setWatchHistory] = useState<any[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    setWatchHistory(history);
  }, []);

  return (
    <div className="pb-10">
      <HeroSection movie={heroMovie} />
      
      <div className="relative z-20">
        {watchHistory.length > 0 && (
          <section className="py-[30px] px-10 flex-1">
            <h2 className="text-[20px] font-bold text-white mb-[20px]">Continue Watching</h2>
            <div className="flex gap-[20px] overflow-x-auto pb-4 scrollbar-hide">
              {watchHistory.map((item) => (
                <Link key={item.id} href={`/watch/${item.id}`} className="relative flex-shrink-0 w-64 aspect-video rounded-[8px] overflow-hidden group border border-white/5">
                  <Image src={item.posterUrl} alt={item.title} fill className="object-cover opacity-85 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Play size={24} className="ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white text-[14px] font-semibold truncate">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <MovieRow title="Trending Now" movies={trendingMovies} viewAllLink="/movies?filter=trending" />
        <MovieRow title="Latest Releases" movies={latestMovies} viewAllLink="/movies?filter=latest" />
        <MovieRow title="Action & Adventure" movies={actionMovies} viewAllLink="/genres/Action" />
        <MovieRow title="Sci-Fi Movies" movies={sciFiMovies} viewAllLink="/genres/Sci-Fi" />
      </div>
    </div>
  );
}
