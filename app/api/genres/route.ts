import { NextResponse } from 'next/server';
import { getGenres } from '@/lib/tmdb';

export const revalidate = 3600;

export async function GET() {
  const genres = await getGenres();
  return NextResponse.json(genres);
}
