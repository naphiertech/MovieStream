'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicBackgroundProps {
  id: string;
  type: 'movie' | 'tv';
  fallbackImage: string;
}

export function CinematicBackground({ id, type, fallbackImage }: CinematicBackgroundProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(`/api/videos/${type}/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const videos = await res.json();
        
        // Prioritize "Trailer" then "Teaser" then any YouTube video
        const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || 
                        videos.find((v: any) => v.type === 'Teaser' && v.site === 'YouTube') ||
                        videos.find((v: any) => v.site === 'YouTube');
        
        setVideoKey(trailer?.key || null);
      } catch (error) {
        console.error('Background Trailer Error:', error);
      }
    };

    fetchTrailer();
  }, [id, type]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {videoKey ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
             {/* YouTube Background Player */}
            <div className="absolute inset-0 pointer-events-none scale-150 transform">
              <iframe
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                onLoad={() => setIsLoaded(true)}
              />
            </div>
            {/* Dark Overlays to ensure text readability */}
            <div className="absolute inset-0 bg-[#060606]/40 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#060606]" />
            <div className="absolute inset-0 hero-vignette" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <img 
              src={fallbackImage} 
              alt="Backdrop" 
              className="w-full h-full object-cover opacity-30 blur-[1px]" 
            />
            <div className="absolute inset-0 hero-vignette" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#060606]" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Cinematic Scanline Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
