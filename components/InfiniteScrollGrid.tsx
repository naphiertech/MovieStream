'use client';

import { useState, useEffect, useRef } from 'react';
import { Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { loadMoreContentAction } from '@/app/actions';

interface InfiniteScrollGridProps {
  initialItems: Movie[];
  type: 'movie' | 'tv';
  filter?: string;
  genreId?: string;
}

export function InfiniteScrollGrid({ 
  initialItems, 
  type, 
  filter, 
  genreId 
}: InfiniteScrollGridProps) {
  const [items, setItems] = useState<Movie[]>(initialItems);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset state when filters change
  useEffect(() => {
    setItems(initialItems);
    setPage(2);
    setHasMore(true);
    setLoading(false);
  }, [initialItems, filter, genreId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { 
        threshold: 0,
        rootMargin: '400px' // Fetch earlier for smoother experience
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page, filter, genreId]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const newItems = await loadMoreContentAction(type, page, filter, genreId);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        // Prevent accidental duplicates from TMDB API
        setItems(prev => {
          const existingIds = new Set(prev.map(i => i.id));
          const filtered = newItems.filter(i => !existingIds.has(i.id));
          return [...prev, ...filtered];
        });
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more content:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-[25px] gap-y-[45px]">
        {items.map((item) => (
          <MovieCard key={item.id} movie={item} />
        ))}
      </div>

      {/* Sentinel & Loading Indicator */}
      <div 
        ref={sentinelRef} 
        className="flex items-center justify-center py-20 min-h-[100px]"
      >
        {loading && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#2dd4bf]/20 border-t-[#2dd4bf] rounded-full animate-spin shadow-[0_0_15px_rgba(45,212,191,0.2)]" />
            <span className="text-[10px] font-black text-[#2dd4bf] uppercase tracking-[2px] animate-pulse">
              Buffering Catalog...
            </span>
          </div>
        )}
        
        {!hasMore && items.length > 0 && (
          <div className="flex flex-col items-center gap-2 opacity-30">
            <div className="w-8 h-[1px] bg-white/20 rounded-full mb-2" />
            <p className="text-[10px] font-black text-white uppercase tracking-[3px]">End of Sector</p>
          </div>
        )}
      </div>
    </div>
  );
}
