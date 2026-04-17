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
    
    // Dynamically generate sources for the TMDB ID
    const sources = [
      {
        id: `vs1_${movie.id}`,
        movieId: movie.id,
        name: "VidSrc Pro",
        url: `https://vidsrc.to/embed/movie/${movie.id}`,
        quality: "1080p"
      },
      {
        id: `vs2_${movie.id}`,
        movieId: movie.id,
        name: "SuperStream",
        url: `https://vidsrc.me/embed/movie?tmdb=${movie.id}`,
        quality: "720p"
      }
    ];

    return NextResponse.json({ ...movie, sources, recommendations });
  } catch (error) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
}
