import { NextResponse } from 'next/server';
import { getGenres } from '@/lib/tmdb';

export const revalidate = 3600;

export async function GET() {
  const genres = await getGenres();
  return NextResponse.json(genres, {
    headers: {
      'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}
