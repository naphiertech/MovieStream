import { NextResponse } from 'next/server';
import { getMovieDetails, getRecommendations } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const movie = await getMovieDetails(id);
    const recommendations = await getRecommendations(id);
    
    const sources: any[] = [];

    return NextResponse.json({ ...movie, sources, recommendations });
  } catch (error) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
}
