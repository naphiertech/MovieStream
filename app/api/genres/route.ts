import { NextResponse } from 'next/server';
import { getGenres } from '@/lib/tmdb';

export async function GET() {
  const genres = await getGenres();
  return NextResponse.json(genres);
}
