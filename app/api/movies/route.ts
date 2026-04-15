import { NextResponse } from 'next/server';
import { movies } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trending = searchParams.get('trending');
  const latest = searchParams.get('latest');
  const genre = searchParams.get('genre');

  let filteredMovies = [...movies];

  if (trending === 'true') {
    filteredMovies = filteredMovies.filter(m => m.trending);
  }
  if (latest === 'true') {
    filteredMovies = filteredMovies.filter(m => m.latest);
  }
  if (genre) {
    filteredMovies = filteredMovies.filter(m => m.genres.includes(genre));
  }

  return NextResponse.json(filteredMovies);
}
