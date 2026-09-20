import { NextResponse } from 'next/server';
import { StreamProviderManager, StreamResolver } from '@/lib/providers/stream';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; season: string; episode: string }> }
) {
  const { id, season, episode } = await params;
  const sanitizedId = (id || '').trim();
  const s = parseInt(season, 10);
  const e = parseInt(episode, 10);
  
  if (!sanitizedId || !/^\d+$/.test(sanitizedId) || isNaN(s) || isNaN(e) || s < 0 || e < 0) {
    return NextResponse.json({ error: 'Invalid season or episode format' }, { status: 400 });
  }

  try {
    const { providerId, rawData } = await StreamProviderManager.fetchEpisodeStream(sanitizedId, s, e);
    const playbackData = StreamResolver.normalize(providerId, rawData);
    return NextResponse.json(playbackData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error(`[TV Stream API] Failed to resolve TV stream for ID ${id} S${season}E${episode}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to resolve stream' }, { status: 404 });
  }
}
