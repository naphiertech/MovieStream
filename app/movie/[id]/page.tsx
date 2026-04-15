import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { movies } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Banner */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <Image
          src={movie.bannerUrl}
          alt={movie.title}
          fill
          className="object-cover opacity-40"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        
        <Link href="/" className="absolute top-24 left-4 md:left-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors z-10">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 -mt-32 md:-mt-48 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 md:w-72 flex-shrink-0 mx-auto md:mx-0 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-800">
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 288px"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-grow pt-4 md:pt-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm text-gray-300 mb-6">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="font-semibold text-white">{movie.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{movie.duration}</span>
              </div>
              <span className="border border-gray-600 px-2 py-0.5 rounded text-xs">HD</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
              {movie.genres.map(genre => (
                <span key={genre} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
              {movie.description}
            </p>

            <Link 
              href={`/watch/${movie.id}`}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
            >
              <Play size={24} fill="currentColor" />
              Watch Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
