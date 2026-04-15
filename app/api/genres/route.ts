import { NextResponse } from 'next/server';
import { genres } from '@/lib/db';

export async function GET() {
  return NextResponse.json(genres);
}
