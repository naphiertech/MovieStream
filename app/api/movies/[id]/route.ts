import { NextResponse } from 'next/server';
import { movies, videoSources } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }

  const sources = videoSources.filter(vs => vs.movieId === id);

  return NextResponse.json({ ...movie, sources });
}
