import { NextResponse } from 'next/server';
import { StreamProviderManager, StreamResolver } from '@/lib/providers/stream';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { providerId, rawData } = await StreamProviderManager.fetchMovieStream(id);
    const playbackData = StreamResolver.normalize(providerId, rawData);
    return NextResponse.json(playbackData);
  } catch (error: any) {
    console.error(`[Movie Stream API] Failed to resolve movie stream for ID ${id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to resolve stream' }, { status: 404 });
  }
}
