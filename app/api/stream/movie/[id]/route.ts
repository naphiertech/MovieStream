import { NextResponse } from 'next/server';
import { StreamProviderManager, StreamResolver } from '@/lib/providers/stream';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sanitizedId = (id || '').trim();

  if (!sanitizedId || !/^\d+$/.test(sanitizedId)) {
    return NextResponse.json({ error: 'Invalid movie ID format' }, { status: 400 });
  }

  try {
    const { providerId, rawData } = await StreamProviderManager.fetchMovieStream(sanitizedId);
    const playbackData = StreamResolver.normalize(providerId, rawData);
    return NextResponse.json(playbackData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error(`[Movie Stream API] Failed to resolve movie stream for ID ${id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to resolve stream' }, { status: 404 });
  }
}
