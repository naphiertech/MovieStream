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
  layout?: 'portrait' | 'landscape';
}

export function InfiniteScrollGrid({ 
  initialItems, 
  type, 
  filter, 
  genreId,
  layout: initialLayout = 'landscape'
}: InfiniteScrollGridProps) {
  const [items, setItems] = useState<Movie[]>(initialItems);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState<'portrait' | 'landscape'>(initialLayout);
  
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
        rootMargin: '400px'
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

  const isLandscape = layout === 'landscape';

  return (
    <div className="flex flex-col gap-6">
      {/* Cineby Layout Style Switcher */}
      <div className="flex justify-end items-center border-b border-white/5 pb-4 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[2px] text-white/30 mr-3">Layout Style:</span>
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-0.5">
          <button
            onClick={() => setLayout('landscape')}
            className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-[1px] transition-all duration-300 ${
              isLandscape
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Landscape
          </button>
          <button
            onClick={() => setLayout('portrait')}
            className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-[1px] transition-all duration-300 ${
              !isLandscape
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
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
        {items.map((item) => (
          <MovieCard key={item.id} movie={item} layout={layout} />
        ))}
      </div>

      {/* Sentinel & Loading Indicator */}
      <div 
        ref={sentinelRef} 
        className="flex items-center justify-center py-20 min-h-[100px]"
      >
        {loading && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin shadow-[0_0_15px_rgba(229,9,20,0.2)]" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[2px] animate-pulse">
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
