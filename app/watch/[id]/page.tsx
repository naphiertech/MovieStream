'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Server, Settings } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Movie, VideoSource } from '@/lib/db';

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [activeSource, setActiveSource] = useState<VideoSource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch movie and sources from our API
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMovie(data);
          setSources(data.sources || []);
          if (data.sources && data.sources.length > 0) {
            setActiveSource(data.sources[0]);
          }
          
          // Save to watch history
          const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
          const newHistory = history.filter((h: any) => h.id !== data.id);
          newHistory.unshift({
            id: data.id,
            title: data.title,
            posterUrl: data.posterUrl,
            timestamp: Date.now()
          });
          localStorage.setItem('watchHistory', JSON.stringify(newHistory.slice(0, 20))); // Keep last 20
        }
      } catch (error) {
        console.error("Failed to fetch movie", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white">Loading...</div>;
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white">Movie not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col pt-16">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/movie/${movie.id}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Details</span>
        </Link>
        <h1 className="text-white font-bold text-lg md:text-xl truncate max-w-[50%]">{movie.title}</h1>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Video Player Container */}
      <div className="w-full max-w-6xl mx-auto aspect-video bg-black relative shadow-2xl shadow-black/50 border border-gray-800 rounded-lg overflow-hidden">
        {activeSource ? (
          <iframe
            src={activeSource.url}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No video sources available
          </div>
        )}
      </div>

      {/* Controls & Server Switch */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-[#141414] rounded-xl p-6 border border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Server Selection */}
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <Server size={18} />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Select Server</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {sources.map(source => (
                  <button
                    key={source.id}
                    onClick={() => setActiveSource(source)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeSource?.id === source.id 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {source.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Info */}
            {activeSource && (
              <div className="flex items-center gap-4 bg-gray-900 px-4 py-3 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 text-gray-400">
                  <Settings size={18} />
                  <span className="text-sm">Quality:</span>
                </div>
                <span className="text-green-500 font-bold">{activeSource.quality}</span>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              If the current server doesn't work, please try another one. We do not host any files on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
