import { NextResponse } from 'next/server';
import { getSeasonDetails } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; seasonNumber: string }> }
) {
  const { id, seasonNumber } = await params;
  
  try {
    const seasonData = await getSeasonDetails(id, parseInt(seasonNumber));
    return NextResponse.json(seasonData);
  } catch (error) {
    console.error(`Error fetching Season details for ${id} S${seasonNumber}:`, error);
    return NextResponse.json({ error: 'Season not found' }, { status: 404 });
  }
}
