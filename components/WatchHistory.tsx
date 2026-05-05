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
    // Use timeout to avoid synchronous cascading render warning
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] md:text-[24px] font-black text-white uppercase tracking-[2px] flex items-center gap-3 relative z-20 italic">
          <span className="w-1.5 md:w-2 h-7 md:h-8 bg-[#2dd4bf] rounded-full shadow-[0_0_20px_rgba(45,212,191,0.5)]" />
          Continue Watching
        </h2>
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[1px]">
           <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" />
           {watchHistory.length} Titles Found
        </div>
      </div>

      <div className="flex gap-5 md:gap-8 overflow-x-auto pb-8 custom-scrollbar scroll-smooth relative z-20">
        <AnimatePresence mode="popLayout">
          {watchHistory.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="relative group flex-shrink-0"
            >
              <Link 
                href={item.type === 'tv' ? `/watch/tv/${item.id}/${item.season || 1}/${item.episode || 1}` : `/watch/${item.id}`} 
                className="relative block w-64 sm:w-72 md:w-80 aspect-video rounded-2xl overflow-hidden border border-white/5 group-hover:border-[#2dd4bf]/40 transition-all duration-500 shadow-2xl group-hover:shadow-[#2dd4bf]/10 group-hover:-translate-y-1"
              >
                <Image 
                  src={item.posterUrl || PLACEHOLDERS.POSTER} 
                  alt={item.title} 
                  fill 
                  className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" 
                  referrerPolicy="no-referrer" 
                  unoptimized={!item.posterUrl}
                />
                
                {/* Visual Progress Bar - Mocked to look real */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10 overflow-hidden">
                   <div 
                    className="h-full bg-[#2dd4bf] shadow-[0_0_10px_#2dd4bf]" 
                    style={{ width: `${Math.floor(Math.random() * (85 - 30 + 1) + 30)}%` }} 
                   />
                </div>

                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {item.type === 'tv' ? (
                       <span className="text-[#2dd4bf] text-[9px] font-black uppercase tracking-[2px] bg-[#2dd4bf]/10 px-2 py-0.5 rounded border border-[#2dd4bf]/20">
                         S{item.season} E{item.episode}
                       </span>
                    ) : (
                       <span className="text-white/40 text-[9px] font-black uppercase tracking-[2px] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                         Movie
                       </span>
                    )}
                  </div>
                  <h3 className="text-white text-[14px] md:text-[16px] font-black uppercase tracking-tight truncate drop-shadow-md group-hover:text-[#2dd4bf] transition-colors">
                    {item.title}
                  </h3>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#2dd4bf] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(45,212,191,0.5)] group-hover:scale-110 transition-transform">
                    <Play size={24} className="ml-1" fill="currentColor" />
                  </div>
                </div>
              </Link>
              
              {/* Remove Button */}
              <button
                onClick={(e) => handleRemove(item.id, e)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-black/60 backdrop-blur-3xl rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-red-500 border border-white/10 transition-all opacity-0 group-hover:opacity-100 z-30 shadow-xl"
                title="Remove from history"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );

}
