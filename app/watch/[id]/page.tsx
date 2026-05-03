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
  const [isStabilizing, setIsStabilizing] = useState(false);
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
        
        // Premium Sources
        const sourcesList = [
          {
            id: 'vidlink',
            name: 'VidLink (Pro)',
            url: `https://vidlink.pro/movie/${data.id}?primaryColor=2dd4bf`,
            quality: '4K/1080p'
          },
          {
            id: 'vidsrc-pro',
            name: 'VidSrc (Pro)',
            url: `https://vidsrc.pro/embed/movie/${data.id}`,
            quality: '1080p'
          },
          {
            id: 'vixsrc',
            name: 'VixSrc (Direct)',
            url: `https://vixsrc.to/embed/movie/${data.id}`,
            quality: '1080p'
          },
          {
            id: 'vidking',
            name: 'Vidking (HQ)',
            url: `https://www.vidking.net/embed/movie/${data.id}`,
            quality: '1080p'
          }
        ];
        
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

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[#060606] flex flex-col">
      {/* Cinematic Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="bg-gradient-to-b from-black/80 to-transparent pt-10 pb-20 px-6 md:px-14">
          <div className="container mx-auto flex items-center justify-between pointer-events-auto">
            <div className="w-20" /> {/* Spacer for symmetry if needed, or just leave empty */}
            
            <div className="flex flex-col items-center text-center">
              <h1 className="text-white font-black text-lg md:text-2xl uppercase italic tracking-tight truncate max-w-[300px] md:max-w-xl drop-shadow-2xl">
                {movie.title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[#2dd4bf] text-[10px] font-black uppercase tracking-[2px]">{movie.releaseDate?.split('-')[0]}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[2px]">{movie.runtime}m</span>
              </div>
            </div>

            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Video Player - Full Viewport Elite Mode */}
      <div ref={playerRef} className="w-full h-[60vh] md:h-[85vh] bg-black relative overflow-hidden group">
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
            
            {/* Ad Blocking Shield Overlay - Premium Play Button Style */}
            <AnimatePresence>
              {showShield && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={async () => {
                    if (isStabilizing) return;
                    const newCount = shieldClicks + 1;
                    if (newCount >= 3) {
                      setShieldClicks(3);
                      setIsStabilizing(true);
                      setTimeout(async () => {
                        setShowShield(false);
                        if (playerRef.current && isMobile()) {
                          await lockLandscape(playerRef.current);
                        }
                      }, 1200);
                    } else {
                      setShieldClicks(newCount);
                    }
                  }}
                  className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] cursor-pointer flex items-center justify-center"
                >
                  {/* Premium Play Button */}
                  <div className="relative group/play">
                    {/* Ripple Effects */}
                    <div className="absolute inset-0 bg-[#2dd4bf]/20 rounded-full animate-ping scale-150 opacity-20" />
                    <div className="absolute inset-0 bg-[#2dd4bf]/10 rounded-full animate-pulse scale-125 opacity-30" />
                    
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 group-hover/play:scale-110 group-hover/play:border-[#2dd4bf]/50 group-hover/play:shadow-[0_0_50px_rgba(45,212,191,0.3)]">
                      {isStabilizing ? (
                        <Loader2 className="text-[#2dd4bf] animate-spin" size={48} />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Zap 
                            className={`transition-all duration-300 ${shieldClicks > 0 ? "fill-[#2dd4bf] text-[#2dd4bf]" : "text-white"}`} 
                            size={shieldClicks > 0 ? 48 : 40} 
                          />
                          {shieldClicks > 0 && (
                            <span className="text-white text-[10px] font-black mt-2">
                              {3 - shieldClicks} CLICKS LEFT
                            </span>
                          )}
                        </div>
                      )}

                      {/* Progress Fill Overlay */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-[#2dd4bf]/20 transition-all duration-500 pointer-events-none"
                        style={{ height: `${(shieldClicks / 3) * 100}%` }}
                      />
                    </div>
                    
                    {!isStabilizing && shieldClicks === 0 && (
                      <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <p className="text-white font-black text-[12px] uppercase tracking-[4px] drop-shadow-lg text-center">
                          Initialize High-Fidelity Signal
                        </p>
                        <p className="text-[#2dd4bf] text-[9px] font-black uppercase tracking-[2px] mt-2 text-center opacity-70">
                          Secure Connection Protocol Active
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
            <Loader2 className="animate-spin mb-4" />
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
