import { NextResponse } from 'next/server';
import { searchMulti } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get('q') || '';
  const q = rawQ.trim().slice(0, 100).toLowerCase();

  if (!q) {
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }

  try {
    const results = await searchMulti(q);
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error(`[Search API] Error searching for "${q}":`, error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
