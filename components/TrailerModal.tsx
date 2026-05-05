'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string | null;
  title: string;
}

export function TrailerModal({ isOpen, onClose, videoKey, title }: TrailerModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoaded(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl aspect-video bg-[#060606] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.2)] border border-white/10"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/10 flex items-center justify-center text-[#2dd4bf]">
                    <Play size={20} fill="currentColor" />
                </div>
                <div>
                    <span className="text-white/40 text-[9px] font-black uppercase tracking-[2px]">Official Trailer</span>
                    <h3 className="text-white font-black text-sm md:text-lg uppercase italic tracking-tight">{title}</h3>
                </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&modestbranding=1&rel=0`}
              title={`${title} Trailer`}
              className={`w-full h-full border-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-4">
               <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                  <Play size={32} />
               </div>
               <p className="font-black uppercase tracking-[2px] text-xs text-center">No official trailer available for this node</p>
            </div>
          )}
          
          {!isLoaded && videoKey && (
             <div className="absolute inset-0 flex items-center justify-center bg-[#060606]">
                <div className="w-12 h-12 border-4 border-[#2dd4bf]/20 border-t-[#2dd4bf] rounded-full animate-spin" />
             </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
