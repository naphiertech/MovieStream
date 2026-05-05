'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Server, Settings, Loader2, ChevronRight, Zap, Smartphone, Timer } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getTVDetails, getSeasonDetails, TVShow, Episode } from '@/lib/tmdb';
import { ActorList } from '@/components/ActorList';
import { SubtitleOverlay } from '@/components/SubtitleOverlay';
import { lockLandscape, isMobile, unlockOrientation } from '@/lib/orientation';

export default function TVWatchPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const season = parseInt(params.season as string);
  const episode = parseInt(params.episode as string);
  
  const [show, setShow] = useState<TVShow | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [activeSource, setActiveSource] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
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
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const showRes = await fetch(`/api/tv/${id}`, { signal: controller.signal });
        if (!showRes.ok) throw new Error('Could not connect to Series Server');
        const showData = await showRes.json();
        setShow(showData);
        
        const seasonRes = await fetch(`/api/tv/${id}/season/${season}`, { signal: controller.signal });
        if (!seasonRes.ok) throw new Error('Could not connect to Season Server');
        const seasonData = await seasonRes.json();
        
        const epData = seasonData.episodes?.find((e: any) => e.episode_number === episode);
        if (!epData) throw new Error('Episode not found in this season');
        setCurrentEpisode(epData);
        
        // Find next episode
        let next = seasonData.episodes?.find((e: any) => e.episode_number === episode + 1);
        if (!next && season < showData.numberOfSeasons) {
           const nextSeasonRes = await fetch(`/api/tv/${id}/season/${season + 1}`, { signal: controller.signal });
           if (nextSeasonRes.ok) {
             const nextSeasonData = await nextSeasonRes.json();
             next = nextSeasonData.episodes?.[0];
           }
        }
        setNextEpisode(next);

        // Map sources
        const sourcesList = [
          {
            id: 'vidlink',
            name: 'VidLink (Pro)',
            url: `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=2dd4bf&autoplay=1`,
            quality: '1080p'
          },
          {
            id: 'vidsrc-pro',
            name: 'VidSrc (Pro)',
            url: `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}?autoplay=1`,
            quality: '1080p'
          },
          {
            id: 'vixsrc',
            name: 'VixSrc (Direct)',
            url: `https://vixsrc.to/embed/tv/${id}/${season}/${episode}?autoplay=1`,
            quality: '1080p'
          },
          {
            id: 'vidking',
            name: 'Vidking (HQ)',
            url: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}`,
            quality: '1080p'
          }
        ];
        setSources(sourcesList);
        setActiveSource(sourcesList[0]);

        // Save history
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        const newHistory = history.filter((h: any) => h.id !== id);
        newHistory.unshift({
          id: id,
          title: showData.title,
          posterUrl: showData.posterUrl,
          timestamp: Date.now(),
          type: 'tv',
          season,
          episode
        });
        localStorage.setItem('watchHistory', JSON.stringify(newHistory.slice(0, 20)));

      } catch (err: any) {
        console.error("TV Data Fetch Error:", err);
        setError(err.name === 'AbortError' ? 'Signal Timeout: Server is taking too long to respond.' : err.message);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, season, episode]);

  // Handle manual "Next Episode"
  const handleNext = () => {
    if (nextEpisode) {
      router.push(`/watch/tv/${id}/${nextEpisode.season_number}/${nextEpisode.episode_number}`);
    }
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

  if (!show || !currentEpisode) return null;

  return (
    <div className="min-h-screen bg-[#060606] flex flex-col">
      {/* Cinematic Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="bg-gradient-to-b from-black/80 to-transparent pt-10 pb-20 px-6 md:px-14">
          <div className="container mx-auto flex items-center justify-between pointer-events-auto">
            <Link 
              href={`/tv/${id}`} 
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
                {show.title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[#2dd4bf] text-[10px] font-black uppercase tracking-[2px]">S{season} E{episode}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[2px] truncate max-w-[150px]">{currentEpisode.name}</span>
              </div>
            </div>

            <div className="w-24 hidden sm:block" />
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
                          Initialize TV Signal
                        </p>
                        <p className="text-[#2dd4bf] text-[9px] font-black uppercase tracking-[2px] mt-2 text-center opacity-70">
                          Secure Episode Link Active
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
            <p className="font-black uppercase tracking-[2px] text-xs">Awaiting TV signal...</p>
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 py-12 max-w-[1400px]">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col md:flex-row items-center gap-10 w-full">
              <div className="flex flex-col gap-6 flex-grow w-full md:w-auto">
                <div className="flex flex-col">
                  <span className="text-white/30 text-[9px] font-black uppercase tracking-[2px] mb-2">Current Episode</span>
                  <h3 className="text-white font-black text-lg md:text-xl italic uppercase tracking-tight">{currentEpisode.name}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {sources.map(source => (
                    <button
                      key={source.id}
                      onClick={() => setActiveSource(source)}
                      className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                        activeSource?.id === source.id 
                          ? 'bg-[#2dd4bf] text-black shadow-[0_10px_25px_rgba(45,212,191,0.3)]' 
                          : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'
                      }`}
                    >
                      {source.name}
                    </button>
                  ))}
                  
                  {/* Subtitle Sync Toggle */}
                  <button
                    onClick={() => setShowSubtitleSync(!showSubtitleSync)}
                    className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border border-white/5 ${
                      showSubtitleSync 
                        ? 'bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]/40 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Timer size={14} className={showSubtitleSync ? 'animate-pulse' : ''} />
                    Sync Subtitles
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 w-full md:w-auto">
                {nextEpisode && (
                  <button 
                      onClick={handleNext}
                      className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 hover:border-[#2dd4bf]/40 px-6 md:px-8 py-4 rounded-2xl group transition-all w-full sm:w-auto"
                  >
                      <div className="flex flex-col text-left">
                          <span className="text-[#2dd4bf] text-[9px] font-black uppercase tracking-[2px]">Up Next</span>
                          <span className="text-white/60 font-bold text-xs md:text-sm tracking-tight line-clamp-1">{nextEpisode.name}</span>
                      </div>
                      <ChevronRight className="text-[#2dd4bf] group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                <div className="flex items-center gap-6 bg-white/5 px-8 py-5 md:py-6 rounded-3xl border border-white/5 w-full sm:min-w-[180px] justify-center text-center font-outfit">
                  <div className="flex flex-col items-center">
                    <span className="text-white font-black text-lg md:text-xl leading-none italic">{activeSource?.quality}</span>
                    <span className="text-[#2dd4bf] text-[9px] font-black uppercase tracking-[1px] mt-1">Fiber Connection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            {show.cast && <ActorList cast={show.cast} />}
          </div>

        </div>
      </div>
    </div>
  );
}


