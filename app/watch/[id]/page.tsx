'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Server, Settings, Loader2, Timer } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RecommendationCard } from '@/components/RecommendationCard';
import { ActorList } from '@/components/ActorList';
import { SubtitleOverlay } from '@/components/SubtitleOverlay';
import HLSPlayer from '@/components/HLSPlayer';
import { lockLandscape, isMobile, unlockOrientation } from '@/lib/orientation';
import { Movie } from '@/lib/tmdb';

export interface VideoSource {
  id: string;
  name: string;
  url: string;
  quality: string;
}

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [activeSource, setActiveSource] = useState<VideoSource | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubtitleSync, setShowSubtitleSync] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isLightsOff, setIsLightsOff] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
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

  // Sync preferences on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAutoPlay(localStorage.getItem('movieStream_autoPlay') !== 'false');
    }
  }, []);

  // Pre-warm Hugging Face scraper container in the background
  useEffect(() => {
    fetch('https://missourimonster-vyla.hf.space/').catch(() => {});
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

  // Programmatically intercept and block popup ad tabs from providers
  useEffect(() => {
    const originalWindowOpen = window.open;
    window.open = function (url, target, features) {
      console.warn('🛡️ Popup blocked programmatically:', url);
      return null;
    };
    return () => {
      window.open = originalWindowOpen;
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
            url: `https://vidlink.pro/movie/${data.id}?primaryColor=2dd4bf&autoplay=1`,
            quality: '4K/1080p'
          },
          {
            id: 'ultra',
            name: 'Elite Ad-Free (HLS)',
            url: '', // Handled by HLSPlayer
            quality: '4K/1080p'
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

  // Get dynamic source URL respecting preferences
  const getSourceUrl = (sourceId: string) => {
    if (sourceId === 'vidlink') {
      return `https://vidlink.pro/movie/${movie?.id}?primaryColor=2dd4bf&autoplay=${autoPlay ? 1 : 0}`;
    }
    if (sourceId === 'vidking') {
      return `https://www.vidking.net/embed/movie/${movie?.id}`;
    }
    return '';
  };

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
    <div className="min-h-screen bg-[#060606] flex flex-col relative overflow-x-hidden">
      
      {/* Cinematic Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="bg-gradient-to-b from-black/80 to-transparent pt-10 pb-20 px-6 md:px-14">
          <div className="container mx-auto flex items-center justify-between pointer-events-auto">
            <Link 
              href={`/movie/${movie.id}`} 
              onClick={() => {
                if (typeof window !== 'undefined' && (document.fullscreenElement || (document as any).webkitFullscreenElement)) {
                  unlockOrientation();
                }
              }}
              className="group flex items-center gap-3 bg-white/5 backdrop-blur-3xl border border-white/10 px-5 py-2.5 rounded-2xl text-white/50 hover:text-white hover:border-[#2dd4bf]/40 transition-all duration-300"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-[2px]">Exit</span>
            </Link>
            
            <div className="flex flex-col items-center text-center">
              <h1 className="text-white font-black text-lg md:text-2xl uppercase italic tracking-tight truncate max-w-[300px] md:max-w-xl drop-shadow-2xl">
                {movie.title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[#2dd4bf] text-[10px] font-black uppercase tracking-[2px]">{movie.releaseDate?.split('-')[0]}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[2px]">{movie.duration}</span>
              </div>
            </div>

            <div className="w-24 hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Video Player - Full Viewport Elite Mode */}
      <div ref={playerRef} className="w-full h-screen bg-black relative overflow-hidden group z-20">
        {activeSource ? (
          <div className="relative w-full h-full">
            {activeSource.id === 'ultra' ? (
              <HLSPlayer 
                tmdbId={Number(id)} 
                imdbId={movie.imdbId}
                type="movie" 
                onSignalLost={() => {
                  const fallback = sources.find(s => s.id === 'vidlink');
                  if (fallback) setActiveSource(fallback);
                }}
                autoPlay={autoPlay}
              />
            ) : (
              <iframe
                src={getSourceUrl(activeSource.id)}
                className="w-full h-full border-0"
                allowFullScreen
                referrerPolicy="no-referrer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
            
            {/* Custom Subtitle Overlay */}
            {showSubtitleSync && <SubtitleOverlay />}

          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
            <Loader2 className="animate-spin mb-4" />
            <p className="font-black uppercase tracking-[2px] text-xs">Awaiting signal...</p>
          </div>
        )}
      </div>

      {/* Controls & Server Switch */}
      <div className="container mx-auto px-6 py-12 max-w-[1400px] z-20">
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

              {/* Premium Playback Option Toggles */}
              <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/5 text-[10px] md:text-[11px] font-black uppercase tracking-[1px] text-white/50 select-none">
                {/* Autoplay checkbox */}
                <button 
                  onClick={() => {
                    const newVal = !autoPlay;
                    setAutoPlay(newVal);
                    localStorage.setItem('movieStream_autoPlay', String(newVal));
                  }}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${autoPlay ? 'bg-[#2dd4bf] text-black' : 'bg-white/5 border border-white/20'}`}>
                    {autoPlay && <span className="text-[9px] font-bold">✓</span>}
                  </div>
                  <span>Autoplay</span>
                </button>

                {/* Shortcuts dialog toggle */}
                <button 
                  onClick={() => setShowShortcuts(true)}
                  className="hover:text-white transition-colors flex items-center gap-1 ml-auto"
                >
                  <span>⌘ Shortcuts</span>
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
        <div className="container mx-auto px-6 py-12 max-w-[1400px] z-20">
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

      {/* Keyboard Shortcuts Dialog */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0b0c10] border border-white/10 p-6 md:p-8 rounded-[2rem] max-w-sm w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-black text-lg italic uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
                <span>⌨ Keyboard Controls</span>
                <span className="text-[#2dd4bf] text-[10px] tracking-normal not-italic font-medium bg-[#2dd4bf]/10 px-2 py-0.5 rounded">HLS Only</span>
              </h3>
              
              <div className="flex flex-col gap-3.5 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40 uppercase font-black tracking-wider">Play / Pause</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded font-mono font-bold text-white">Space</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40 uppercase font-black tracking-wider">Mute / Unmute</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded font-mono font-bold text-white">M</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40 uppercase font-black tracking-wider">Fullscreen</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded font-mono font-bold text-white">F</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40 uppercase font-black tracking-wider">Seek Backward</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded font-mono font-bold text-white">← Left Arrow</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40 uppercase font-black tracking-wider">Seek Forward</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded font-mono font-bold text-white">→ Right Arrow</span>
                </div>
              </div>

              <button 
                onClick={() => setShowShortcuts(false)}
                className="w-full py-3 bg-white text-black hover:bg-[#2dd4bf] transition-all font-black text-[11px] uppercase tracking-[2px] rounded-xl"
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
