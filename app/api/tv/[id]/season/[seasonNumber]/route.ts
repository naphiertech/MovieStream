import { NextResponse } from 'next/server';
import { getSeasonDetails } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; seasonNumber: string }> }
) {
  const { id, seasonNumber } = await params;
  const sanitizedId = (id || '').trim();
  const sNum = parseInt(seasonNumber, 10);
  
  if (!sanitizedId || !/^\d+$/.test(sanitizedId) || isNaN(sNum) || sNum < 0 || sNum > 100) {
    return NextResponse.json({ error: 'Invalid TV season parameters' }, { status: 400 });
  }

  try {
    const seasonData = await getSeasonDetails(sanitizedId, sNum);
    return NextResponse.json(seasonData, {
      headers: {
        'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error(`Error fetching Season details for ${id} S${seasonNumber}:`, error);
    return NextResponse.json({ error: 'Season not found' }, { status: 404 });
  }
}
