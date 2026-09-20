import { NextResponse } from 'next/server';
import { getMoviesByGenre } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sanitizedId = (id || '').trim();
  const { searchParams } = new URL(request.url);
  const rawPage = searchParams.get('page') || '1';
  const page = parseInt(rawPage, 10);

  if (!sanitizedId || !/^\d+$/.test(sanitizedId) || isNaN(page) || page < 1 || page > 500) {
    return NextResponse.json({ error: 'Invalid genre ID or page parameter' }, { status: 400 });
  }

  try {
    const movies = await getMoviesByGenre(sanitizedId, page);
    return NextResponse.json(movies, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error(`Error in genres API for ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
