import Link from 'next/link';
import { getGenres } from '@/lib/tmdb';

export default async function GenresIndexPage() {
  const genres = await getGenres();
  
  return (
    <div className="container mx-auto px-4 pt-32 pb-12 min-h-screen">
      <h1 className="text-2xl md:text-5xl font-black text-white mb-12 uppercase italic tracking-tighter italic">Browse by Genre</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {genres.map(genre => (
          <Link 
            key={genre} 
            href={`/genres/${encodeURIComponent(genre)}`}
            className="bg-white/5 hover:bg-[#2dd4bf] group border border-white/5 hover:border-[#2dd4bf]/50 rounded-2xl p-8 text-center transition-all duration-500 hover:scale-105 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-x-0 h-[2px] top-0 bg-gradient-to-r from-transparent via-[#2dd4bf]/50 to-transparent group-hover:via-black/20" />
            <h2 className="text-xl font-black text-white group-hover:text-black uppercase tracking-widest">{genre}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
