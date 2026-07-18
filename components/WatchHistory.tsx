'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, X, Star } from 'lucide-react';
import { PLACEHOLDERS } from '@/lib/tmdb';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState<any[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    const timer = setTimeout(() => {
      setWatchHistory(history);
    }, 0);
    return () => clearTimeout(timer);
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
      className="relative mt-8 md:-mt-24 pt-12 md:pt-28 px-6 md:px-14 lg:px-20 mb-0"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] md:text-[22px] font-black text-white uppercase tracking-[0.5px] flex items-center gap-3 relative z-20 font-outfit">
          <span className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_12px_rgba(229,9,20,0.5)]" />
          Continue Watching
        </h2>
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[1px]">
           <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
           {watchHistory.length} Titles
        </div>
      </div>

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-8 scrollbar-hide scroll-smooth relative z-20">
        <AnimatePresence mode="popLayout">
          {watchHistory.map((item) => {
            // Deterministic progress width and mock timestamp based on id
            const numericId = parseInt(item.id) || 0;
            const progress = (numericId % 45) + 35; // Between 35% and 80%
            const mockHour = (numericId % 2) + 0;
            const mockMin = (numericId % 45) + 10;
            const mockSec = (numericId % 50) + 9;
            const progressTime = mockHour > 0 
              ? `${mockHour}:${mockMin.toString().padStart(2, '0')}:${mockSec.toString().padStart(2, '0')}`
              : `${mockMin}:${mockSec.toString().padStart(2, '0')}`;

            const imageSrc = item.bannerUrl || item.posterUrl || PLACEHOLDERS.BANNER;

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="relative group flex-shrink-0 w-[240px] sm:w-[280px] md:w-[300px]"
              >
                <Link 
                  href={item.type === 'tv' ? `/watch/tv/${item.id}/${item.season || 1}/${item.episode || 1}` : `/watch/${item.id}`} 
                  className="block relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 group-hover:border-red-600/40 transition-all duration-500 shadow-2xl group-hover:scale-[1.02]"
                >
                  <Image 
                    src={imageSrc} 
                    alt={item.title} 
                    fill 
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                    referrerPolicy="no-referrer" 
                    unoptimized={!imageSrc.startsWith('http')}
                  />
                  
                  {/* Progress Time Stamp Stamp */}
                  <div className="absolute bottom-3 right-3 bg-black/75 text-[9px] px-2 py-0.5 rounded font-black z-10 text-white border border-white/5 tracking-wider">
                    {progressTime}
                  </div>

                  {/* Red progress line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10 overflow-hidden">
                     <div 
                      className="h-full bg-red-600 shadow-[0_0_10px_#e50914]" 
                      style={{ width: `${progress}%` }} 
                     />
                  </div>
                  
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 z-10">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(229,9,20,0.5)] group-hover:scale-110 transition-transform">
                      <Play size={20} className="ml-0.5 text-white" fill="currentColor" />
                    </div>
                  </div>
                </Link>

                {/* Info Text rendered below card */}
                <div className="mt-3 px-1 flex flex-col relative">
                  <h3 className="text-white text-[13px] md:text-[14px] font-bold uppercase tracking-tight truncate group-hover:text-red-500 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-white/50 font-medium">
                    {item.type === 'tv' ? (
                      <span className="text-red-500 font-bold">
                        S{item.season || 1} E{item.episode || 1}
                      </span>
                    ) : (
                      <span>Movie</span>
                    )}
                    <span>•</span>
                    <span>{item.type === 'tv' ? 'Series' : 'Feature'}</span>
                  </div>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={(e) => handleRemove(item.id, e)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-black/80 backdrop-blur-3xl rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-red-600 border border-white/10 transition-all opacity-0 group-hover:opacity-100 z-30 shadow-xl"
                  title="Remove from history"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
