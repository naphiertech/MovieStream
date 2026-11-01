import { NextResponse } from 'next/server';
import { discoverMedia } from '@/lib/tmdb';

const ALLOWED_FILTERS = new Set(['trending', 'popular', 'top', 'latest', 'upcoming', 'anime']);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const pageRaw = parseInt(searchParams.get('page') || '1', 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 && pageRaw <= 500 ? pageRaw : 1;

  const rawFilter = (searchParams.get('filter') || '').trim();
  const rawGenre = (searchParams.get('genre') || '').trim();
  const rawYear = (searchParams.get('year') || '').trim();
  const rawCountry = (searchParams.get('country') || '').trim().toUpperCase();
  const rawProvider = (searchParams.get('provider') || '').trim();

  if (
    (rawFilter && !ALLOWED_FILTERS.has(rawFilter)) ||
    (rawGenre && !/^\d{1,7}$/.test(rawGenre)) ||
    (rawYear && !/^\d{4}$/.test(rawYear)) ||
    (rawCountry && !/^[A-Z]{2}$/.test(rawCountry)) ||
    (rawProvider && !/^\d{1,7}$/.test(rawProvider))
  ) {
    return NextResponse.json({ error: 'Invalid filter parameters' }, { status: 400 });
  }

  try {
    const results = await discoverMedia(type, {
      page,
      filter: rawFilter || undefined,
      genreId: rawGenre || undefined,
      year: rawYear || undefined,
      country: rawCountry || undefined,
      providerId: rawProvider || undefined,
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
