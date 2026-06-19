'use client';

import { useState, useEffect, useRef } from 'react';
import { Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Loader2 } from 'lucide-react';

interface GenreGridProps {
  initialMovies: Movie[];
  genreId: string;
}

export function GenreGrid({ initialMovies, genreId }: GenreGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMovies.length >= 20);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state when genre changes (e.g. if navigation happens)
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
          // Avoid duplicate entries just in case API returns overlapping items
          const existingIds = new Set(prev.map(m => m.id));
          const filtered = newMovies.filter(m => !existingIds.has(m.id));
          return [...prev, ...filtered];
        });
        setPage(nextPage);
        // If TMDB returns less than a full page (20), assume there is no more data
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

  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-[25px] gap-y-[45px]">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center items-center py-10 w-full">
          <Loader2 className="animate-spin text-[#2dd4bf]" size={36} />
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
