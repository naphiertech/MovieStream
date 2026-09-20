import { NextResponse } from 'next/server';
import { getTrendingMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trending = searchParams.get('trending');
  
  // We prioritize trending since the mock movies are gone
  const movies = await getTrendingMovies();
  let filteredMovies = [...movies];

  if (trending === 'true') {
    filteredMovies = filteredMovies.filter(m => m.trending);
  }

  return NextResponse.json(filteredMovies, {
    headers: {
      'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
