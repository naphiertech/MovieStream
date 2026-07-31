import { NextRequest, NextResponse } from 'next/server';
import { getMovieVideos } from '@/lib/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string, id: string }> }
) {
  try {
    const { type, id } = await params;
    const videos = await getMovieVideos(id, type as any);
    return NextResponse.json(videos, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Video API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

