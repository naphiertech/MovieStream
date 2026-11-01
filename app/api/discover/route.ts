import { NextResponse } from 'next/server';
import { discoverMedia } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const pageRaw = parseInt(searchParams.get('page') || '1', 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 && pageRaw <= 500 ? pageRaw : 1;

  const filter = searchParams.get('filter') || undefined;
  const genreId = searchParams.get('genre') || undefined;
  const year = searchParams.get('year') || undefined;
  const country = searchParams.get('country') || undefined;
  const providerId = searchParams.get('provider') || undefined;

  try {
    const results = await discoverMedia(type, {
      page,
      filter,
      genreId,
      year,
      country,
      providerId,
    });

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[Discover API] Error fetching catalog page:', error);
    return NextResponse.json({ error: 'Failed to load catalog page' }, { status: 500 });
  }
}
