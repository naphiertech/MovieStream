'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Search as SearchIcon } from 'lucide-react';

const searchPageCache = new Map<string, Movie[]>();

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  
  const [localQuery, setLocalQuery] = useState(q);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState<'portrait' | 'landscape'>('landscape');

  useEffect(() => {
    const trimmed = q.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      return;
    }

    if (searchPageCache.has(trimmed)) {
      setResults(searchPageCache.get(trimmed) || []);
      return;
    }
    
    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal
        });
        if (res.ok) {
          const data = await res.json();
          searchPageCache.set(trimmed, data);
          setResults(data);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Search failed", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    return () => {
      controller.abort();
    };
  }, [q]);

  useEffect(() => {
    setLocalQuery(q);
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery)}`);
    } else {
      router.push(`/search`);
    }
  };

  const isLandscape = layout === 'landscape';

  return (
    <div className="container mx-auto px-6 md:px-14 lg:px-20 pt-32 pb-20 min-h-screen">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-sage-600/10 border border-sage-600/20 text-sage-400 shadow-[0_0_20px_rgba(132, 169, 140,0.1)] flex-shrink-0">
            <SearchIcon size={24} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-[28px] sm:text-[32px] md:text-[45px] font-black text-white leading-none tracking-tight uppercase italic break-words font-outfit">
              {q ? `Results for "${q}"` : 'Search Movies'}
            </h1>
            <p className="text-white/30 text-[10px] sm:text-[11px] font-bold uppercase tracking-[2px] mt-2">
              Browsing MovieStream Database
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-2xl group">
          <input
            type="text"
            placeholder="Type a movie or tv show..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-14 pr-24 py-4 md:py-5 text-base md:text-lg focus:outline-none focus:border-sage-600/40 focus:bg-white/10 md:transition-all md:duration-300 placeholder:text-white/20 font-medium shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            autoFocus
          />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sage-400 transition-colors duration-300" size={22} />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-sage-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider hover:bg-sage-500 md:transition-all md:duration-300 shadow-[0_0_15px_rgba(132, 169, 140,0.3)]">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-40">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-sage-500 border-r-transparent border-b-transparent border-l-transparent animate-spin shadow-[0_0_15px_rgba(132, 169, 140,0.5)]"></div>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="flex flex-col gap-6">
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

          <div className={`grid gap-x-[25px] gap-y-[40px] ${
            isLandscape
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
          }`}>
            {results.map(movie => (
              <MovieCard key={movie.id} movie={movie} layout={layout} />
            ))}
          </div>
        </div>
      ) : q ? (
        <div className="text-center py-40 animate-in fade-in duration-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6 text-white/20">
            <SearchIcon size={32} />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight uppercase">No results found</h3>
          <p className="mt-2 text-white/30 font-bold text-[11px] uppercase tracking-[2px]">Try different keywords or genres</p>
        </div>
      ) : (
        <div className="text-center py-40">
          <p className="text-white/20 font-black text-[12px] uppercase tracking-[4px]">
            Start typing to explore
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060606] pt-32 text-center text-white/20 font-black uppercase tracking-[4px]">Loading Catalog...</div>}>
      <SearchContent />
    </Suspense>
  );
}
