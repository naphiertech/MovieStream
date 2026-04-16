export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  year: number;
  rating: number;
  duration: string;
  releaseDate: string;
  genres: string[];
  trending: boolean;
  latest: boolean;
  tmdbId: string;
}

export interface VideoSource {
  id: string;
  movieId: string;
  name: string;
  url: string;
  quality: string;
}

export const genres = [
  "Action", "Adventure", "Sci-Fi", "Drama", "Comedy", "Thriller", "Horror", "Romance", "Animation"
];

export const movies: Movie[] = [
  {
    id: "m1",
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    posterUrl: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/8pt3S6YRS9pU0YjBrp9X9S9v6n.jpg",
    year: 2024,
    rating: 8.8,
    duration: "2h 46m",
    releaseDate: "2024-03-01",
    genres: ["Action", "Adventure", "Sci-Fi"],
    trending: true,
    latest: true,
    tmdbId: "693134",
  },
  {
    id: "m2",
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    posterUrl: "https://image.tmdb.org/t/p/w500/8GxvynZpEJQ0SntEaP3B3meuzv4.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/nb3xI8S2nI6S3nU3S7UNJlqaO6n.jpg",
    year: 2023,
    rating: 8.4,
    duration: "3h 0m",
    releaseDate: "2023-07-21",
    genres: ["Drama", "Thriller"],
    trending: true,
    latest: false,
    tmdbId: "872585",
  },
  {
    id: "m3",
    title: "Poor Things",
    description: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
    posterUrl: "https://image.tmdb.org/t/p/w500/kxyS7Syo4p7fAqvUn06atHscv6n.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/b9S8nI8S2nI6S3nU3S7UNJlqaO6n.jpg",
    year: 2023,
    rating: 8.0,
    duration: "2h 21m",
    releaseDate: "2023-12-08",
    genres: ["Comedy", "Drama", "Romance"],
    trending: false,
    latest: true,
    tmdbId: "792307",
  },
  {
    id: "m4",
    title: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    posterUrl: "https://image.tmdb.org/t/p/w500/8VtbiH9P9S2nI6S3nU3S7UNJlqaO6n.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/4pt3S6YRS9pU0YjBrp9X9S9v6n.jpg",
    year: 2023,
    rating: 8.6,
    duration: "2h 20m",
    releaseDate: "2023-06-02",
    genres: ["Animation", "Action", "Adventure"],
    trending: true,
    latest: false,
    tmdbId: "569094",
  },
  {
    id: "m5",
    title: "The Batman",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    posterUrl: "https://image.tmdb.org/t/p/w500/74S8nI8S2nI6S3nU3S7UNJlqaO6n.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/9pt3S6YRS9pU0YjBrp9X9S9v6n.jpg",
    year: 2022,
    rating: 7.8,
    duration: "2h 56m",
    releaseDate: "2022-03-04",
    genres: ["Action", "Crime", "Drama"],
    trending: false,
    latest: false,
    tmdbId: "414906",
  },
  {
    id: "m6",
    title: "Everything Everywhere All at Once",
    description: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
    posterUrl: "https://image.tmdb.org/t/p/w500/6pt3S6YRS9pU0YjBrp9X9S9v6n.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/0pt3S6YRS9pU0YjBrp9X9S9v6n.jpg",
    year: 2022,
    rating: 7.8,
    duration: "2h 19m",
    releaseDate: "2022-03-25",
    genres: ["Action", "Adventure", "Comedy"],
    trending: true,
    latest: false,
    tmdbId: "545611",
  },
  {
    id: "m7",
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    posterUrl: "https://image.tmdb.org/t/p/w500/t6S8nI8S2nI6S3nU3S7UNJlqaO6n.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/vpt3S6YRS9pU0YjBrp9X9S9v6n.jpg",
    year: 2022,
    rating: 7.6,
    duration: "3h 12m",
    releaseDate: "2022-12-16",
    genres: ["Action", "Adventure", "Sci-Fi"],
    trending: false,
    latest: false,
    tmdbId: "76600",
  },
  {
    id: "m8",
    title: "Top Gun: Maverick",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
    posterUrl: "https://image.tmdb.org/t/p/w500/jS8nI8S2nI6S3nU3S7UNJlqaO6n.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/ypt3S6YRS9pU0YjBrp9X9S9v6n.jpg",
    year: 2022,
    rating: 8.3,
    duration: "2h 10m",
    releaseDate: "2022-05-27",
    genres: ["Action", "Drama"],
    trending: true,
    latest: false,
    tmdbId: "361743",
  }
];

export const videoSources: VideoSource[] = movies.flatMap(movie => [
  {
    id: `vs1_${movie.id}`,
    movieId: movie.id,
    name: "VidSrc Pro",
    url: `https://vidsrc.to/embed/movie/${movie.id}`, // Placeholder URL format
    quality: "1080p"
  },
  {
    id: `vs2_${movie.id}`,
    movieId: movie.id,
    name: "SuperStream",
    url: `https://vidsrc.me/embed/movie?tmdb=${movie.id}`, // Placeholder URL format
    quality: "720p"
  },
  {
    id: `vs3_${movie.id}`,
    movieId: movie.id,
    name: "UpCloud",
    url: `https://www.youtube.com/embed/dQw4w9WgXcQ`, // Safe placeholder
    quality: "1080p"
  }
]);
