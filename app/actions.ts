'use server';

import { 
  getTrendingMovies, 
  getUpcomingMovies, 
  getTopRatedMovies, 
  getMoviesByGenre,
  getTrendingTV,
  getPopularTV,
  getTopRatedTV,
  getTVByGenre,
  Movie
} from '@/lib/tmdb';

export async function loadMoreContentAction(
  type: 'movie' | 'tv',
  page: number,
  filter?: string,
  genreId?: string
): Promise<Movie[]> {
  if (type === 'movie') {
    if (genreId) {
      return await getMoviesByGenre(genreId, page);
    }
    
    switch (filter) {
      case 'trending': return await getTrendingMovies(page);
      case 'latest':
      case 'upcoming': return await getUpcomingMovies(page);
      case 'top': return await getTopRatedMovies(page);
      default: return await getTrendingMovies(page);
    }
  } else {
    // TV Shows
    if (genreId) {
      return await getTVByGenre(genreId, page);
    }

    switch (filter) {
      case 'trending': return await getTrendingTV(page);
      case 'popular': return await getPopularTV(page);
      case 'top': return await getTopRatedTV(page);
      case 'anime': return await getTVByGenre('16', page); // Constant for Animation
      default: return await getTrendingTV(page);
    }
  }
}
