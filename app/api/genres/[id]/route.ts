import { NextResponse } from 'next/server';
import { getMoviesByGenre } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');

  try {
    const movies = await getMoviesByGenre(id, page);
    return NextResponse.json(movies);
  } catch (error) {
    console.error(`Error in genres API:`, error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
