'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Server, Settings, Loader2, Zap, Smartphone, Timer } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RecommendationCard } from '@/components/RecommendationCard';
import { ActorList } from '@/components/ActorList';
import { SubtitleOverlay } from '@/components/SubtitleOverlay';
import { lockLandscape, isMobile } from '@/lib/orientation';

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [movie, setMovie] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [activeSource, setActiveSource] = useState<any | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShield, setShowShield] = useState(true);
  const [shieldClicks, setShieldClicks] = useState(0);
  const [showSubtitleSync, setShowSubtitleSync] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    handleOrientation();
    window.addEventListener('resize', handleOrientation);
    window.addEventListener('orientationchange', handleOrientation);
    
    return () => {
      window.removeEventListener('resize', handleOrientation);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, []);

  // Fullscreen → Auto-Landscape Link
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement
      );

      if (isFs && isMobile()) {
        // Trigger landscape lock if we entered fullscreen
        if (playerRef.current) {
          lockLandscape(playerRef.current);
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const res = await fetch(`/api/movies/${id}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Could not connect to Movie Server');
        const data = await res.json();
        
        setMovie(data);
        setRecommendations(data.recommendations || []);
        
        // Default to Vidking if possible
        const vidkingSource = {
          id: 'vidking',
          name: 'Vidking (HQ)',
          url: `https://www.vidking.net/embed/movie/${data.id}`,
          quality: '1080p'
        };
        
        const sourcesList = [vidkingSource, ...(data.sources || [])];
        setSources(sourcesList);
        setActiveSource(sourcesList[0]);
        
        // Save history
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        const newHistory = history.filter((h: any) => h.id !== data.id);
        newHistory.unshift({
          id: data.id,
          title: data.title,
          posterUrl: data.posterUrl,
          timestamp: Date.now(),
          type: 'movie'
        });
        localStorage.setItem('watchHistory', JSON.stringify(newHistory.slice(0, 20)));

      } catch (err: any) {
        console.error("Movie Data Fetch Error:", err);
        setError(err.name === 'AbortError' ? 'Signal Timeout: Server is taking too long to respond.' : err.message);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#060606] text-white">
        <Loader2 className="animate-spin text-[#2dd4bf] mb-8" size={64} />
        <p className="text-white font-black text-[12px] uppercase tracking-[4px] animate-pulse">Syncing Signal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#060606] text-white px-10 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
          <Settings size={40} className="animate-pulse" />
        </div>
        <h2 className="text-white font-black text-2xl uppercase italic tracking-tight mb-4">Signal Interrupted</h2>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[2px] max-w-md leading-relaxed mb-10">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-white text-black font-black text-[12px] uppercase tracking-[2px] rounded-2xl hover:bg-[#2dd4bf] transition-all"
        >
          Re-initialize Signal
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060606] text-white">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-6 uppercase tracking-tight italic">Resource Not Found</h2>
          <Link href="/" className="px-8 py-3 bg-[#2dd4bf] text-black font-black uppercase tracking-widest rounded-full hover:bg-[#0ed2f7] transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] flex flex-col pt-24">
      <div className="container mx-auto px-6 md:px-14 py-6 flex items-center justify-between">
        <Link href={`/movie/${movie.id}`} className="group flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl text-white/50 hover:text-white hover:border-[#2dd4bf]/40 transition-all duration-300">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[2px]">Back to details</span>
        </Link>
        <h1 className="text-white font-black text-lg md:text-2xl uppercase italic tracking-tight truncate max-w-[50%] drop-shadow-lg">
          {movie.title}
        </h1>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[#2dd4bf]/50 text-[#2dd4bf] rounded-lg font-black text-[10px] tracking-[2px] uppercase bg-[#2dd4bf]/5">
          Pro Mode
        </div>
      </div>

      {/* Video Player Container - Elite High Fidelity Shadow */}
      <div ref={playerRef} className="w-full max-w-[1400px] mx-auto aspect-video bg-black relative shadow-[0_30px_100px_rgba(45,212,191,0.15)] border-y border-white/5 md:border md:rounded-[2rem] overflow-hidden group">
        {activeSource ? (
          <div className="relative w-full h-full">
            <iframe
              src={activeSource.url}
              className="w-full h-full border-0"
              allowFullScreen
              referrerPolicy="no-referrer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            
            {/* Custom Subtitle Overlay */}
            {showSubtitleSync && <SubtitleOverlay />}
            
            {/* Ad Blocking Shield Overlay */}
            <AnimatePresence>
              {showShield && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={async () => {
                    const newCount = shieldClicks + 1;
                    if (newCount >= 3) {
                      setShowShield(false);
                      if (playerRef.current && isMobile()) {
                        await lockLandscape(playerRef.current);
                      }
                    } else {
                      setShieldClicks(newCount);
                    }
                  }}
                  className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[4px] cursor-pointer group/shield flex items-center justify-center"
                >
                  <div className="bg-black/80 backdrop-blur-3xl border border-[#2dd4bf]/20 px-10 py-8 rounded-[2.5rem] flex flex-col items-center gap-6 transform group-hover/shield:scale-105 transition-all duration-500 shadow-[0_0_50px_rgba(45,212,191,0.2)] overflow-hidden relative">
                    
                    {/* Progress Ring */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div 
                        className="w-full h-full border-[10px] border-[#2dd4bf] rounded-[2.5rem] transition-all duration-500"
                        style={{ clipPath: `inset(${100 - (shieldClicks * 33.3)}% 0 0 0)` }}
                      />
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-[#2dd4bf]/10 flex items-center justify-center text-[#2dd4bf]">
                          <Zap className={shieldClicks > 0 ? "fill-[#2dd4bf] animate-pulse" : ""} size={32} />
                        </div>
                        {shieldClicks > 0 && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="absolute -top-1 -right-1 w-6 h-6 bg-[#2dd4bf] rounded-full flex items-center justify-center text-black text-[10px] font-black"
                          >
                            {shieldClicks}/3
                          </motion.div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-[4px]">
                          {shieldClicks === 0 ? 'Initialize Signal' : shieldClicks === 1 ? 'Clearing Node 1' : 'Clearing Node 2'}
                        </h4>
                        <p className="text-[#2dd4bf] text-[10px] font-black uppercase tracking-[1px] mt-1.5 opacity-60">
                          {shieldClicks === 0 ? 'Triple-click to secure player' : 'Keep clicking to stabilize'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`w-12 h-1.5 rounded-full transition-all duration-300 ${i <= shieldClicks ? 'bg-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-white/10'}`} 
                        />
                      ))}
                    </div>

                    {/* Mobile Orientation Hint */}
                    {isPortrait && shieldClicks === 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-3 px-5 py-2.5 bg-[#2dd4bf]/10 rounded-2xl border border-[#2dd4bf]/20 sm:hidden"
                      >
                        <motion.div
                          animate={{ rotate: 90 }}
                          transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                        >
                          <Smartphone size={16} className="text-[#2dd4bf]" />
                        </motion.div>
                        <span className="text-[#2dd4bf] text-[10px] font-black uppercase tracking-[1px]">Landscape recommended</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
            <Settings size={48} className="animate-spin-slow mb-4" />
            <p className="font-black uppercase tracking-[2px] text-xs">Awaiting signal...</p>
          </div>
        )}
      </div>

      {/* Controls & Server Switch */}
      <div className="container mx-auto px-6 py-12 max-w-[1400px]">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            
            {/* Server Selection */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 text-white/30 mb-6">
                <Server size={18} className="text-[#2dd4bf]" />
                <h3 className="font-black text-[11px] uppercase tracking-[2px]">Switch Provider</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {sources.map(source => (
                  <button
                    key={source.id}
                    onClick={() => setActiveSource(source)}
                    className={`px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all duration-500 relative overflow-hidden group/btn ${
                      activeSource?.id === source.id 
                        ? 'bg-[#2dd4bf] text-black shadow-[0_10px_30px_rgba(45,212,191,0.4)] scale-105' 
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {source.name}
                    {activeSource?.id === source.id && (
                      <motion.div layoutId="activeServer" className="absolute inset-0 bg-white/20 pointer-events-none" />
                    )}
                  </button>
                ))}
                
                {/* Subtitle Sync Toggle */}
                <button
                  onClick={() => setShowSubtitleSync(!showSubtitleSync)}
                  className={`px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all duration-500 relative overflow-hidden group/btn border border-white/5 ${
                    showSubtitleSync 
                      ? 'bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]/40' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Timer size={16} className={showSubtitleSync ? 'animate-pulse' : ''} />
                    Sync Pro Subtitles
                  </div>
                </button>
              </div>
            </div>

            {/* Quality Info */}
            {activeSource && (
              <div className="flex items-center gap-6 bg-white/5 px-8 py-6 rounded-3xl border border-white/5 shadow-lg">
                <div className="flex items-center gap-3 text-white/30">
                  <Settings size={20} className="text-[#2dd4bf]" />
                  <span className="text-[11px] font-black uppercase tracking-[2px]">Delivery:</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-xl leading-none italic">{activeSource.quality}</span>
                  <span className="text-[#2dd4bf] text-[9px] font-black uppercase tracking-[1px] mt-1">Ultra Smooth</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-16">
            {movie.cast && <ActorList cast={movie.cast} />}
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-white/20 uppercase tracking-[4px] font-black italic">
              Cinema Support • High Fidelity Streaming Platform
            </p>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[2px]">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                System Balanced
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Like - Cineby Style */}
      {recommendations.length > 0 && (
        <div className="container mx-auto px-6 py-12 max-w-[1400px]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">You May Like</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 12).map((rec) => (
              <RecommendationCard key={rec.id} movie={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
