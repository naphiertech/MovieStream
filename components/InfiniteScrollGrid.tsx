'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { useCatalogLayout } from '@/components/CatalogFilterBar';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollGridProps {
  initialItems: Movie[];
  type: 'movie' | 'tv';
  filter?: string;
  genreId?: string;
  year?: string;
  country?: string;
  providerId?: string;
  layout?: 'portrait' | 'landscape';
}

export function InfiniteScrollGrid({
  initialItems,
  type,
  filter,
  genreId,
  year,
  country,
  providerId,
  layout,
}: InfiniteScrollGridProps) {
  const sharedLayout = useCatalogLayout();
  const activeLayout = layout ?? sharedLayout;
  const [items, setItems] = useState<Movie[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialItems.length >= 20);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(2);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(initialItems.length >= 20);

  useEffect(() => {
    setItems(initialItems);
    pageRef.current = 2;
    loadingRef.current = false;
    const more = initialItems.length >= 20;
    hasMoreRef.current = more;
    setHasMore(more);
    setLoading(false);
  }, [initialItems, type, filter, genreId, year, country, providerId]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        type,
        page: pageRef.current.toString(),
      });
      if (filter) params.set('filter', filter);
      if (genreId) params.set('genre', genreId);
      if (year) params.set('year', year);
      if (country) params.set('country', country);
      if (providerId) params.set('provider', providerId);

      const res = await fetch(`/api/discover?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const newItems: Movie[] = await res.json();

      if (!Array.isArray(newItems) || newItems.length === 0) {
        hasMoreRef.current = false;
        setHasMore(false);
      } else {
        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const filtered = newItems.filter((i) => !existingIds.has(i.id));
          return [...prev, ...filtered];
        });
        pageRef.current += 1;
        if (newItems.length < 20) {
          hasMoreRef.current = false;
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading more content:', error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [type, filter, genreId, year, country, providerId]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMoreRef.current && !loadingRef.current) {
          loadMore();
        }
      },
      {
        threshold: 0,
        rootMargin: '600px',
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, items.length]);

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
          <MovieCard key={`${item.type || type}-${item.id}`} movie={item} layout={activeLayout} />
        ))}
      </div>

      {/* Sentinel & Loading Indicator */}
      <div
        ref={sentinelRef}
        className="flex items-center justify-center py-16 min-h-[80px]"
      >
        {loading ? (
          <div className="flex items-center gap-2.5 text-white/50 text-xs font-medium">
            <Loader2 size={16} className="animate-spin text-sage-400" />
            <span>Loading more titles...</span>
          </div>
        ) : hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            className="px-5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white/60 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Load more
          </button>
        ) : null}
      </div>
    </div>
  );
}
