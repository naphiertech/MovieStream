const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const PLACEHOLDERS = {
  POSTER: 'https://placehold.co/500x750/060606/white?text=No+Poster',
  BANNER: 'https://placehold.co/1920x1080/060606/white?text=No+Preview',
  STILL: 'https://placehold.co/500x281/060606/white?text=No+Preview'
};

export const GENRE_MAP: Record<string, string> = {
  "Action": "28",
  "Adventure": "12",
  "Animation": "16",
  "Comedy": "35",
  "Crime": "80",
  "Documentary": "99",
  "Drama": "18",
  "Family": "10751",
  "Fantasy": "14",
  "History": "36",
  "Horror": "27",
  "Music": "10402",
  "Mystery": "9648",
  "Romance": "10749",
  "Sci-Fi": "878",
  "Science Fiction": "878",
  "TV Movie": "10770",
  "Thriller": "53",
  "War": "10752",
  "Western": "37"
};

const fetchTMDB = async (
  endpoint: string, 
  params: Record<string, string> = {},
  revalidate: number = 3600
) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate },
    });

    if (!response.ok) {
      console.error(`TMDB API Error: ${response.status} ${response.statusText} for ${url.toString()}`);
      throw new Error(`TMDB API Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Fetch failed for ${url.toString()}:`, error);
    throw error;
  }
};

export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  logoUrl?: string;
  year: number;
  rating: number;
  duration: string;
  releaseDate: string;
  genres: string[];
  trending: boolean;
  latest: boolean;
  tmdbId: string;
  imdbId?: string;
  type?: 'movie' | 'tv';
  cast?: CastMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episode_count: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
  runtime?: number | null;
}

export interface TVShow extends Movie {
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: Season[];
}

const mapMovie = (m: any, type: 'movie' | 'tv' = 'movie'): Movie => ({
  id: m.id.toString(),
  title: m.title || m.name,
  description: m.overview,
  posterUrl: m.poster_path ? `${TMDB_IMAGE_BASE}/w342${m.poster_path}` : '',
  bannerUrl: m.backdrop_path ? `${TMDB_IMAGE_BASE}/w1280${m.backdrop_path}` : '',
  year: new Date(m.release_date || m.first_air_date || Date.now()).getFullYear(),
  rating: parseFloat((m.vote_average || 0).toFixed(1)),
  duration: "N/A",
  releaseDate: m.release_date || m.first_air_date || '',
  genres: [],
  trending: false,
  latest: false,
  tmdbId: m.id.toString(),
  imdbId: m.imdb_id,
  type,
});

export async function getTrendingMovies(page: number = 1) {
  const data = await fetchTMDB('/trending/movie/week', { page: page.toString() });
  return data.results.map((m: any) => mapMovie(m, 'movie'));
}

export async function getTrendingTV(page: number = 1) {
  const data = await fetchTMDB('/trending/tv/week', { page: page.toString() });
  return data.results.map((m: any) => mapMovie(m, 'tv'));
}

export async function getTrendingAll(page: number = 1) {
  const data = await fetchTMDB('/trending/all/week', { page: page.toString() });
  return data.results.map((m: any) => mapMovie(m, m.media_type));
}

export async function getMovieLogo(id: string, type: 'movie' | 'tv' = 'movie'): Promise<string | undefined> {
  try {
    const data = await fetchTMDB(`/${type}/${id}/images`, { include_image_language: 'en,null' }, 86400);
    const logo = data.logos?.find((l: any) => l.iso_639_1 === 'en') || data.logos?.[0];
    return logo ? `${TMDB_IMAGE_BASE}/w500${logo.file_path}` : undefined;
  } catch (error) {
    console.error(`Error fetching logo for ${type} ${id}:`, error);
    return undefined;
  }
}

export async function getTrendingMediaWithLogos(type: 'all' | 'movie' | 'tv' = 'movie', count: number = 5) {
  let trending;
  if (type === 'all') {
    trending = await getTrendingAll();
  } else {
    trending = type === 'movie' ? await getTrendingMovies() : await getTrendingTV();
  }
  
  const limited = trending.slice(0, count);
  
  const mediaWithLogos = await Promise.all(
    limited.map(async (item: Movie) => {
      const logoUrl = await getMovieLogo(item.id, item.type || 'movie');
      return { ...item, logoUrl };
    })
  );
  
  return mediaWithLogos;
}

export async function getUpcomingMovies(page: number = 1) {
  const data = await fetchTMDB('/movie/upcoming', { page: page.toString() }, 43200);
  return data.results.map((m: any) => mapMovie(m, 'movie'));
}

export async function getTopRatedMovies(page: number = 1) {
  const data = await fetchTMDB('/movie/top_rated', { page: page.toString() }, 86400);
  return data.results.map((m: any) => mapMovie(m, 'movie'));
}

export async function getTopRatedTV(page: number = 1) {
  const data = await fetchTMDB('/tv/top_rated', { page: page.toString() }, 86400);
  return data.results.map((m: any) => mapMovie(m, 'tv'));
}

export async function getPopularTV(page: number = 1) {
  const data = await fetchTMDB('/tv/popular', { page: page.toString() }, 43200);
  return data.results.map((m: any) => mapMovie(m, 'tv'));
}

export async function searchMulti(query: string) {
  const data = await fetchTMDB('/search/multi', { query }, 1800);
  return data.results
    .filter((m: any) => m.media_type === 'movie' || m.media_type === 'tv')
    .map((m: any) => mapMovie(m, m.media_type));
}

export async function getMovieDetails(id: string) {
  const [data, credits, logoUrl] = await Promise.all([
    fetchTMDB(`/movie/${id}`, {}, 86400),
    fetchTMDB(`/movie/${id}/credits`, {}, 86400),
    getMovieLogo(id, 'movie')
  ]);
  
  return {
    ...mapMovie(data, 'movie'),
    logoUrl,
    duration: `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`,
    genres: data.genres.map((g: any) => g.name),
    cast: credits.cast.slice(0, 30).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profileUrl: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null
    }))
  };
}

export async function getTVDetails(id: string): Promise<TVShow> {
  const [data, credits, externalIds, logoUrl] = await Promise.all([
    fetchTMDB(`/tv/${id}`, {}, 43200),
    fetchTMDB(`/tv/${id}/credits`, {}, 86400),
    fetchTMDB(`/tv/${id}/external_ids`, {}, 86400),
    getMovieLogo(id, 'tv')
  ]);

  return {
    ...mapMovie(data, 'tv'),
    imdbId: externalIds.imdb_id,
    logoUrl,
    genres: data.genres.map((g: any) => g.name),
    numberOfSeasons: data.number_of_seasons,
    numberOfEpisodes: data.number_of_episodes,
    seasons: data.seasons,
    cast: credits.cast.slice(0, 30).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profileUrl: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null
    }))
  } as TVShow;
}

export async function getSeasonDetails(tvId: string, seasonNumber: number) {
  const data = await fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`, {}, 43200);
  return data;
}

export async function getMoviesByGenre(genreId: string, page: number = 1) {
  const data = await fetchTMDB('/discover/movie', { with_genres: genreId, page: page.toString() }, 43200);
  return data.results.map((m: any) => mapMovie(m, 'movie'));
}

export async function getTVByGenre(genreId: string, page: number = 1) {
  const data = await fetchTMDB('/discover/tv', { with_genres: genreId, page: page.toString() }, 43200);
  return data.results.map((m: any) => mapMovie(m, 'tv'));
}

export async function getRecommendations(id: string, type: 'movie' | 'tv' = 'movie') {
  try {
    const data = await fetchTMDB(`/${type}/${id}/recommendations`, {}, 86400);
    return data.results.map((m: any) => mapMovie(m, type));
  } catch (error) {
    console.error(`Error fetching recommendations for ${type} ${id}:`, error);
    return [];
  }
}

export async function getGenres(type: 'movie' | 'tv' = 'movie'): Promise<Genre[]> {
  try {
    const data = await fetchTMDB(`/genre/${type}/list`, {}, 604800);
    return data.genres;
  } catch (error) {
    console.error(`Error fetching genres for ${type}:`, error);
    return [];
  }
}

export async function getMovieVideos(id: string, type: 'movie' | 'tv' = 'movie') {
  try {
    const data = await fetchTMDB(`/${type}/${id}/videos`, {}, 86400);
    return data.results;
  } catch (error) {
    console.error(`Error fetching videos for ${type} ${id}:`, error);
    return [];
  }
}

export async function getSimilar(id: string, type: 'movie' | 'tv' = 'movie') {
  try {
    const data = await fetchTMDB(`/${type}/${id}/similar`, {}, 86400);
    return data.results.map((m: any) => mapMovie(m, type));
  } catch (error) {
    console.error(`Error fetching similar for ${type} ${id}:`, error);
    return [];
  }
}

export interface CountryOption {
  code: string;
  name: string;
}

export const CATALOG_COUNTRIES: CountryOption[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'KR', name: 'South Korea' },
  { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'DE', name: 'Germany' },
  { code: 'CA', name: 'Canada' },
  { code: 'IN', name: 'India' },
  { code: 'AU', name: 'Australia' },
  { code: 'IT', name: 'Italy' },
  { code: 'CN', name: 'China' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'PH', name: 'Philippines' },
  { code: 'TH', name: 'Thailand' },
  { code: 'SE', name: 'Sweden' },
  { code: 'DK', name: 'Denmark' },
];

export const CATALOG_YEARS: string[] = Array.from(
  { length: 27 },
  (_, idx) => (2026 - idx).toString()
);

export interface DiscoverOptions {
  page?: number;
  filter?: string;
  genreId?: string;
  year?: string;
  country?: string;
}

export async function discoverMedia(
  type: 'movie' | 'tv',
  options: DiscoverOptions = {}
): Promise<Movie[]> {
  const { page = 1, filter, genreId, year, country } = options;
  const hasCustomFilters = Boolean(genreId || year || country);

  if (!hasCustomFilters) {
    if (type === 'movie') {
      if (filter === 'trending') return getTrendingMovies(page);
      if (filter === 'latest' || filter === 'upcoming') return getUpcomingMovies(page);
      if (filter === 'top') return getTopRatedMovies(page);
      if (filter === 'popular') {
        const data = await fetchTMDB('/movie/popular', { page: page.toString() }, 43200);
        return data.results.map((m: any) => mapMovie(m, 'movie'));
      }
      return getTrendingMovies(page);
    } else {
      if (filter === 'trending') return getTrendingTV(page);
      if (filter === 'popular') return getPopularTV(page);
      if (filter === 'top') return getTopRatedTV(page);
      if (filter === 'anime') return getTVByGenre('16', page);
      return getTrendingTV(page);
    }
  }

  const params: Record<string, string> = {
    page: page.toString(),
    include_adult: 'false',
  };

  if (genreId) {
    params.with_genres = genreId;
  } else if (type === 'tv' && filter === 'anime') {
    params.with_genres = '16';
  }

  if (year) {
    if (type === 'movie') {
      params.primary_release_year = year;
    } else {
      params.first_air_date_year = year;
    }
  }

  if (country) {
    params.with_origin_country = country;
  }

  if (filter === 'top') {
    params.sort_by = 'vote_average.desc';
    params['vote_count.gte'] = '150';
  } else if (filter === 'latest' || filter === 'upcoming') {
    params.sort_by =
      type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc';
    const today = new Date().toISOString().split('T')[0];
    if (type === 'movie') {
      params['primary_release_date.lte'] = today;
    } else {
      params['first_air_date.lte'] = today;
    }
  } else {
    params.sort_by = 'popularity.desc';
  }

  const data = await fetchTMDB(`/discover/${type}`, params, 1800);
  return (data.results || []).map((m: any) => mapMovie(m, type));
}

