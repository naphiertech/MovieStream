import { NextResponse } from 'next/server';
import { getMovieDetails, getRecommendations } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sanitizedId = (id || '').trim();

  if (!sanitizedId || !/^\d+$/.test(sanitizedId)) {
    return NextResponse.json({ error: 'Invalid movie ID format' }, { status: 400 });
  }
  
  try {
    const movie = await getMovieDetails(sanitizedId);
    const recommendations = await getRecommendations(sanitizedId);
    
    const sources = [
      {
        id: `viduki_${movie.id}`,
        name: "Viduki (Primary)",
        url: `https://viduki.net/1/movie/${movie.id}?color=ef4444`,
        quality: "1080p"
      },
      {
        id: `vidlink_${movie.id}`,
        name: "VidLink",
        url: `https://vidlink.pro/movie/${movie.id}`,
        quality: "1080p"
      }
    ];

    return NextResponse.json(
      { ...movie, sources, recommendations },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
}
