'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Movie } from '@/lib/db';
import { MovieCard } from '@/components/MovieCard';
import { Search as SearchIcon } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!q) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <div className="mb-8 flex items-center gap-3">
        <SearchIcon size={28} className="text-gray-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {q ? `Search results for "${q}"` : 'Search Movies'}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {results.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : q ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No movies found matching your search.</p>
          <p className="mt-2">Try different keywords.</p>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          Enter a search term above to find movies.
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#141414] pt-24 text-center text-white">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
