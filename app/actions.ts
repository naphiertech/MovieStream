'use server';

import { discoverMedia, Movie } from '@/lib/tmdb';

export async function loadMoreContentAction(
  type: 'movie' | 'tv',
  page: number,
  filter?: string,
  genreId?: string,
  year?: string,
  country?: string
): Promise<Movie[]> {
  return discoverMedia(type, {
    page,
    filter,
    genreId,
    year,
    country,
  });
}

