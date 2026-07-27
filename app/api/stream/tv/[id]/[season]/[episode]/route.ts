import { NextResponse } from 'next/server';
import { StreamProviderManager, StreamResolver } from '@/lib/providers/stream';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; season: string; episode: string }> }
) {
  const { id, season, episode } = await params;
  try {
    const s = parseInt(season, 10);
    const e = parseInt(episode, 10);
    
    if (isNaN(s) || isNaN(e)) {
      return NextResponse.json({ error: 'Invalid season or episode format' }, { status: 400 });
    }

    const { providerId, rawData } = await StreamProviderManager.fetchEpisodeStream(id, s, e);
    const playbackData = StreamResolver.normalize(providerId, rawData);
    return NextResponse.json(playbackData);
  } catch (error: any) {
    console.error(`[TV Stream API] Failed to resolve TV stream for ID ${id} S${season}E${episode}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to resolve stream' }, { status: 404 });
  }
}
