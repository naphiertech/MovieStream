'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { useCatalogLayout } from '@/components/CatalogFilterBar';
import { loadMoreContentAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollGridProps {
  initialItems: Movie[];
  type: 'movie' | 'tv';
  filter?: string;
  genreId?: string;
  year?: string;
  country?: string;
  layout?: 'portrait' | 'landscape';
}

export function InfiniteScrollGrid({
  initialItems,
  type,
  filter,
  genreId,
  year,
  country,
  layout,
}: InfiniteScrollGridProps) {
  const sharedLayout = useCatalogLayout();
  const activeLayout = layout ?? sharedLayout;
  const [items, setItems] = useState<Movie[]>(initialItems);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(initialItems);
    setPage(2);
    setHasMore(true);
    setLoading(false);
  }, [initialItems, filter, genreId, year, country]);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const newItems = await loadMoreContentAction(
        type,
        page,
        filter,
        genreId,
        year,
        country
      );

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const filtered = newItems.filter((i) => !existingIds.has(i.id));
          return [...prev, ...filtered];
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more content:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [type, page, filter, genreId, year, country]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: 0,
        rootMargin: '400px',
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const isLandscape = activeLayout === 'landscape';

  return (
    <div className="flex flex-col">
      <div
        className={`grid gap-x-4 gap-y-7 ${
          isLandscape
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'
        }`}
      >
        {items.map((item) => (
          <MovieCard key={item.id} movie={item} layout={activeLayout} />
        ))}
      </div>

      {/* Sentinel & Loading Indicator */}
      <div
        ref={sentinelRef}
        className="flex items-center justify-center py-16 min-h-[80px]"
      >
        {loading && (
          <div className="flex items-center gap-2.5 text-white/50 text-xs font-medium">
            <Loader2 size={16} className="animate-spin text-sage-400" />
            <span>Loading more titles...</span>
          </div>
        )}
      </div>
    </div>
  );
}

