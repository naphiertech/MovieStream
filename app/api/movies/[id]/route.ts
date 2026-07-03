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
    
    const sources = [
      {
        id: `vidlink_${movie.id}`,
        name: "VidLink (Pro)",
        url: `https://vidlink.pro/movie/${movie.id}`,
        quality: "1080p"
      },
      {
        id: `vidfast_${movie.id}`,
        name: "VidFast (Pro)",
        url: `https://vidfast.pro/movie/${movie.id}`,
        quality: "1080p"
      }
    ];

    return NextResponse.json({ ...movie, sources, recommendations });
  } catch (error) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
}
