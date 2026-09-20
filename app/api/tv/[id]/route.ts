import { NextResponse } from 'next/server';
import { getTVDetails, getRecommendations } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sanitizedId = (id || '').trim();

  if (!sanitizedId || !/^\d+$/.test(sanitizedId)) {
    return NextResponse.json({ error: 'Invalid TV show ID format' }, { status: 400 });
  }
  
  try {
    const show = await getTVDetails(sanitizedId);
    const recommendations = await getRecommendations(sanitizedId, 'tv');
    
    return NextResponse.json(
      { ...show, recommendations },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error(`Error fetching TV details for ${id}:`, error);
    return NextResponse.json({ error: 'Series not found' }, { status: 404 });
  }
}
