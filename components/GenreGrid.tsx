'use client';

import { useState, useEffect, useRef } from 'react';
import { Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Loader2 } from 'lucide-react';

interface GenreGridProps {
  initialMovies: Movie[];
  genreId: string;
  layout?: 'portrait' | 'landscape';
}

export function GenreGrid({ 
  initialMovies, 
  genreId,
  layout: initialLayout = 'landscape'
}: GenreGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMovies.length >= 20);
  const [layout, setLayout] = useState<'portrait' | 'landscape'>(initialLayout);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMovies(initialMovies);
    setPage(1);
    setHasMore(initialMovies.length >= 20);
  }, [initialMovies, genreId]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [page, hasMore, loading]);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    
    try {
      const response = await fetch(`/api/genres/${genreId}?page=${nextPage}`);
      if (!response.ok) throw new Error('Failed to fetch more movies');
      
      const newMovies: Movie[] = await response.json();
      
      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prev) => {
          const existingIds = new Set(prev.map(m => m.id));
          const filtered = newMovies.filter(m => !existingIds.has(m.id));
          return [...prev, ...filtered];
        });
        setPage(nextPage);
        if (newMovies.length < 20) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const isLandscape = layout === 'landscape';

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Cineby Layout Style Switcher */}
      <div className="flex justify-end items-center border-b border-white/5 pb-4 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[2px] text-white/30 mr-3">Layout Style:</span>
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-0.5">
          <button
            onClick={() => setLayout('landscape')}
            className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-[1px] md:transition-all md:duration-300 ${
              isLandscape
                ? 'bg-sage-600 text-white shadow-[0_0_15px_rgba(132, 169, 140,0.3)]'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Landscape
          </button>
          <button
            onClick={() => setLayout('portrait')}
            className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-[1px] md:transition-all md:duration-300 ${
              !isLandscape
                ? 'bg-sage-600 text-white shadow-[0_0_15px_rgba(132, 169, 140,0.3)]'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Portrait
          </button>
        </div>
      </div>

      <div className={`grid gap-x-[25px] gap-y-[45px] ${
        isLandscape 
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      }`}>
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} layout={layout} />
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center items-center py-10 w-full">
          <Loader2 className="animate-spin text-sage-400" size={36} />
        </div>
      )}
      
      {!hasMore && movies.length > 0 && (
        <div className="text-center py-10 text-white/20 font-black text-[10px] uppercase tracking-[3px]">
          End of Cinematic Sector
        </div>
      )}
    </div>
  );
}
