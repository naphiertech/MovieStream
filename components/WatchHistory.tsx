'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import { PLACEHOLDERS } from '@/lib/tmdb';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState<any[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    setWatchHistory(history);
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newHistory = watchHistory.filter(item => item.id !== id);
    setWatchHistory(newHistory);
    localStorage.setItem('watchHistory', JSON.stringify(newHistory));
  };

  if (watchHistory.length === 0) return null;

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="relative mt-[40px] md:-mt-[100px] pt-[60px] md:pt-[120px] px-6 md:px-10 lg:px-14"
    >

      <h2 className="text-[20px] md:text-[24px] font-black text-white mb-[25px] uppercase tracking-[1px] flex items-center gap-3 relative z-20">
        <span className="w-1.5 md:w-2 h-6 md:h-7 bg-[#2dd4bf] rounded-full shadow-[0_0_15px_rgba(45,212,191,0.4)]" />
        Continue Watching
      </h2>
      <div className="flex gap-[15px] md:gap-[20px] overflow-x-auto pb-6 custom-scrollbar scroll-smooth relative z-20">
        <AnimatePresence mode="popLayout">
          {watchHistory.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="relative group flex-shrink-0"
            >
              <Link 
                href={item.type === 'tv' ? `/watch/tv/${item.id}/${item.season || 1}/${item.episode || 1}` : `/watch/${item.id}`} 
                className="relative block w-56 sm:w-64 md:w-72 aspect-video rounded-[8px] md:rounded-[12px] overflow-hidden border border-white/5 hover:border-[#2dd4bf]/30 transition-all duration-500 shadow-2xl"
              >
                <Image 
                  src={item.posterUrl || PLACEHOLDERS.POSTER} 
                  alt={item.title} 
                  fill 
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" 
                  referrerPolicy="no-referrer" 
                  unoptimized={!item.posterUrl}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl group-hover:scale-110 transition-transform">
                    <Play size={20} className="md:w-7 md:h-7 ml-1" fill="currentColor" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <h3 className="text-white text-[12px] md:text-[15px] font-black uppercase tracking-tight truncate drop-shadow-md">{item.title}</h3>
                </div>
              </Link>
              
              {/* Remove Button */}
              <button
                onClick={(e) => handleRemove(item.id, e)}
                className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 bg-black/60 backdrop-blur-3xl rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-[#ff4b4b] hover:shadow-[0_0_15px_rgba(255,75,75,0.4)] border border-white/10 transition-all opacity-0 group-hover:opacity-100 z-30 scale-90 group-hover:scale-100"
                title="Remove from history"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
