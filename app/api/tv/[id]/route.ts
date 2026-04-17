import { NextResponse } from 'next/server';
import { getTVDetails, getRecommendations } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const show = await getTVDetails(id);
    const recommendations = await getRecommendations(id, 'tv');
    
    return NextResponse.json({ ...show, recommendations });
  } catch (error) {
    console.error(`Error fetching TV details for ${id}:`, error);
    return NextResponse.json({ error: 'Series not found' }, { status: 404 });
  }
}
