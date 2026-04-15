import Link from 'next/link';
import { genres } from '@/lib/db';

export default function GenresIndexPage() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Browse by Genre</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map(genre => (
          <Link 
            key={genre} 
            href={`/genres/${encodeURIComponent(genre)}`}
            className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 rounded-xl p-6 text-center transition-all hover:scale-105"
          >
            <h2 className="text-xl font-semibold text-white">{genre}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
