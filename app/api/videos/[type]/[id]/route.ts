import { NextRequest, NextResponse } from 'next/server';
import { getMovieVideos } from '@/lib/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;
    const sanitizedId = (id || '').trim();

    if ((type !== 'movie' && type !== 'tv') || !/^\d+$/.test(sanitizedId)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const videos = await getMovieVideos(sanitizedId, type);
    return NextResponse.json(videos, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Video API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
