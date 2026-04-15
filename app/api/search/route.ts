import { NextResponse } from 'next/server';
import { movies } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  if (!q) {
    return NextResponse.json([]);
  }

  const results = movies.filter(m => 
    m.title.toLowerCase().includes(q) || 
    m.description.toLowerCase().includes(q)
  );

  return NextResponse.json(results);
}
