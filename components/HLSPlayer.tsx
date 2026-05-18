'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader2, AlertCircle, Maximize, Play, Pause, Volume2, Settings } from 'lucide-react';

interface HLSPlayerProps {
  tmdbId: number;
  imdbId?: string;
  type?: 'movie' | 'tv';
  season?: number;
  episode?: number;
  onSignalLost?: () => void;
}

export default function HLSPlayer({ 
  tmdbId, 
  imdbId,
  type = 'movie', 
  season = 1, 
  episode = 1,
  onSignalLost 
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let hls: Hls | null = null;

    const initializePlayer = async () => {
      setLoading(true);
      setError(null);

      try {
        let streamUrl = null;
        if (type === 'movie') {
          const patterns = [
            `https://missourimonster-vyla-api.hf.space/api/movie?id=${tmdbId}`,
            imdbId ? `https://missourimonster-vyla-api.hf.space/api/movie?id=${imdbId}` : null
          ].filter(Boolean) as string[];

          for (const url of patterns) {
            try {
              const res = await fetch(url);
              if (res.ok) {
                const data = await res.json();
                if (data.sources?.[0]?.url) {
                  streamUrl = data.sources[0].url;
                  break;
                }
              }
            } catch (e) {}
          }

          if (!streamUrl && onSignalLost) {
            onSignalLost();
            return;
          }
        } else {
          // TV Self-Healing: Try multiple common patterns + IMDB ID
          const ids = [tmdbId.toString(), imdbId].filter(Boolean);
          const patterns: string[] = [];
          
          ids.forEach(id => {
            patterns.push(`https://missourimonster-vyla-api.hf.space/api/tvshow?id=${id}&s=${season}&e=${episode}`);
            patterns.push(`https://missourimonster-vyla-api.hf.space/api/tv?id=${id}&s=${season}&e=${episode}`);
            patterns.push(`https://missourimonster-vyla-api.hf.space/api/series?id=${id}&s=${season}&e=${episode}`);
          });

          for (const url of patterns) {
            try {
              const res = await fetch(url);
              if (res.ok) {
                const data = await res.json();
                if (data.sources?.[0]?.url) {
                  streamUrl = data.sources[0].url;
                  break; 
                }
              }
            } catch (e) {
              // Silent fail for pattern hunting
            }
          }

          if (!streamUrl && onSignalLost) {
            onSignalLost();
            return;
          }
        }

         if (!streamUrl) {
           if (onSignalLost) {
             onSignalLost();
             return;
           }
           throw new Error('No streamable source found for this title');
         }

        if (Hls.isSupported() && videoRef.current) {
          hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });

          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls?.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls?.recoverMediaError();
                  break;
                default:
                  setError('Fatal playback error occurred');
                  hls?.destroy();
                  break;
              }
            }
          });
        } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          videoRef.current.src = streamUrl;
          videoRef.current.addEventListener('loadedmetadata', () => {
            setLoading(false);
          });
        } else {
          setError('Your browser does not support HLS playback');
        }
      } catch (err: any) {
        console.error('HLS Player Error:', err);
        setError(err.message || 'Signal lost: Could not initialize ad-free player');
        setLoading(false);
      }
    };

    initializePlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [tmdbId, type, season, episode, onSignalLost]);

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (videoRef.current.paused) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      } catch (err) {
        console.warn("Playback interaction handled:", err);
      }
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black group overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-[#060606] flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-[#2dd4bf]/20 animate-ping absolute inset-0" />
            <Loader2 className="text-[#2dd4bf] animate-spin relative z-10" size={48} />
          </div>
          <p className="mt-8 text-white font-black text-[12px] uppercase tracking-[4px] animate-pulse">
            Initializing Elite Signal
          </p>
          <p className="mt-2 text-white/30 text-[9px] font-black uppercase tracking-[2px]">
            Bypassing Ad-Networks...
          </p>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 z-40 bg-[#060606]/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-white font-black text-xl uppercase italic tracking-tight mb-2">Signal Lost</h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[2px] max-w-xs leading-relaxed mb-8">
            {error}
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.location.reload();
            }}
            className="px-8 py-3 bg-white text-black font-black text-[11px] uppercase tracking-[2px] rounded-xl hover:bg-[#2dd4bf] transition-all"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Custom Minimal Controls Overlay */}
      <div 
        className={`absolute inset-x-0 bottom-0 z-20 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={togglePlay} className="text-white hover:text-[#2dd4bf] transition-colors">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <div className="flex items-center gap-3">
              <Volume2 size={20} className="text-white/50" />
              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-[#2dd4bf]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-white/50 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
            <button onClick={toggleFullscreen} className="text-white/50 hover:text-white transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 w-full h-1 bg-white/10 rounded-full overflow-hidden group/progress cursor-pointer">
          <div className="w-1/3 h-full bg-[#2dd4bf] relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform" />
          </div>
        </div>
      </div>

      {/* Premium Badge */}
      <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-[#2dd4bf]/10 backdrop-blur-md border border-[#2dd4bf]/20 rounded-lg">
        <span className="text-[#2dd4bf] text-[9px] font-black uppercase tracking-[2px]">Elite Ad-Free Player</span>
      </div>
    </div>
  );
}
