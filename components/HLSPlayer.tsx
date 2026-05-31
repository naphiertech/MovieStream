'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Loader2, AlertCircle, PictureInPicture, Settings
} from 'lucide-react';

interface HLSPlayerProps {
  tmdbId: number;
  imdbId?: string;
  type?: 'movie' | 'tv';
  season?: number;
  episode?: number;
  onSignalLost?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  autoSkipIntro?: boolean;
}

interface QualityLevel {
  index: number;
  height: number;
  name: string;
}

interface SubtitleTrack {
  url: string;
  lang: string;
  label: string;
}

interface FetchResult {
  url: string;
  subtitles: SubtitleTrack[];
}

// Optimized parallel endpoint fetch helper
const fetchFirstValidSource = async (urls: string[]): Promise<FetchResult | null> => {
  if (urls.length === 0) return null;

  return new Promise((resolve) => {
    let resolved = false;
    let completedCount = 0;

    urls.forEach(async (url) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.sources?.[0]?.url) {
            if (!resolved) {
              resolved = true;

              // Parse and map external WebVTT subtitles dynamically
              const rawSubtitles = data.subtitles || data.tracks || [];
              const subtitles: SubtitleTrack[] = rawSubtitles
                .map((sub: any) => ({
                  url: sub.file || sub.url || '',
                  lang: sub.label || sub.lang || 'English',
                  label: sub.label || 'English'
                }))
                .filter((sub: SubtitleTrack) => sub.url);

              resolve({
                url: data.sources[0].url,
                subtitles
              });
            }
            return;
          }
        }
      } catch (e) {
        // Silent fail
      } finally {
        completedCount++;
        if (completedCount === urls.length && !resolved) {
          resolve(null);
        }
      }
    });
  });
};

export default function HLSPlayer({ 
  tmdbId, 
  imdbId,
  type = 'movie', 
  season = 1, 
  episode = 1,
  onSignalLost,
  onEnded,
  autoPlay = true,
  autoSkipIntro = false
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsInstanceRef = useRef<Hls | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Controls State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Quality Level States
  const [levels, setLevels] = useState<QualityLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1); // -1 = Auto
  const [showSettings, setShowSettings] = useState(false);
  
  // Subtitles State
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([]);
  const [activeSubtitle, setActiveSubtitle] = useState<number>(-1); // -1 = Off

  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkippedToast, setShowSkippedToast] = useState(false);
  const skippedIntroRef = useRef(false);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync controls, quality, and subtitles state on movie/tv show change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsBuffering(false);
    setShowControls(true);
    setLevels([]);
    setCurrentLevel(-1);
    setShowSettings(false);
    setSubtitles([]);
    setActiveSubtitle(-1);
    skippedIntroRef.current = false;
    setShowSkipIntro(false);
    setShowSkippedToast(false);
  }, [tmdbId, season, episode]);

  // Sync fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, volume]);

  // Toggle active text track based on selection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      if (i === activeSubtitle) {
        tracks[i].mode = 'showing';
      } else {
        tracks[i].mode = 'disabled';
      }
    }
  }, [activeSubtitle, subtitles]);

  // Initialize HLS.js Stream and API Fetch
  useEffect(() => {
    let hls: Hls | null = null;

    const initializePlayer = async () => {
      setLoading(true);
      setError(null);

      try {
        let result = null;
        
        // Assemble parallel lookup URLs for fastest response
        if (type === 'movie') {
          const patterns = [
            `https://missourimonster-vyla.hf.space/api/movie?id=${tmdbId}`,
            imdbId ? `https://missourimonster-vyla.hf.space/api/movie?id=${imdbId}` : null
          ].filter(Boolean) as string[];

          result = await fetchFirstValidSource(patterns);
        } else {
          const ids = [tmdbId.toString(), imdbId].filter(Boolean);
          const patterns: string[] = [];
          
          ids.forEach(id => {
            patterns.push(`https://missourimonster-vyla.hf.space/api/tvshow?id=${id}&s=${season}&e=${episode}`);
            patterns.push(`https://missourimonster-vyla.hf.space/api/tv?id=${id}&s=${season}&e=${episode}`);
            patterns.push(`https://missourimonster-vyla.hf.space/api/series?id=${id}&s=${season}&e=${episode}`);
          });

          result = await fetchFirstValidSource(patterns);
        }

        if (!result) {
          if (onSignalLost) {
            onSignalLost();
            return;
          }
          throw new Error('No streamable source found for this title');
        }

        const streamUrl = result.url;
        setSubtitles(result.subtitles);

        // Smart premium default: Auto-select English subtitle if available
        if (result.subtitles.length > 0) {
          const englishIdx = result.subtitles.findIndex(
            (sub) => sub.label.toLowerCase().includes('english') || sub.lang.toLowerCase().includes('en')
          );
          if (englishIdx !== -1) {
            setActiveSubtitle(englishIdx);
          } else {
            setActiveSubtitle(-1); // Default to off if no English, or set to 0. Let's do -1 (Off) or 0 (first). Let's default to English or Off.
          }
        }

        if (Hls.isSupported() && videoRef.current) {
          hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            // Optimization: Assume a very fast 25Mbps connection initially so that ABR requests 1080p immediately on first segment
            abrEwmaDefaultEstimate: 25000000, 
            testBandwidth: false
          });

          hlsInstanceRef.current = hls;

          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            
            // Extract available quality streams
            if (hls) {
              const qualityLevels = hls.levels.map((level, idx) => ({
                index: idx,
                height: level.height,
                name: level.height ? `${level.height}p` : `Stream ${idx + 1}`
              })).reverse(); // Order from highest to lowest quality
              
              setLevels(qualityLevels);
              setCurrentLevel(hls.currentLevel);
            }

            // Automate ad-free autoplay if enabled
            if (autoPlay) {
              videoRef.current?.play().then(() => {
                setIsPlaying(true);
              }).catch(() => {
                // Blocked browser autoplay
              });
            }
          });

          // Sync current level during automatic ABR changes
          hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
            setCurrentLevel(data.level);
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
            setDuration(videoRef.current?.duration || 0);
            if (autoPlay) {
              videoRef.current?.play().then(() => {
                setIsPlaying(true);
              }).catch(() => {});
            }
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
        hlsInstanceRef.current = null;
      }
    };
  }, [tmdbId, type, season, episode, onSignalLost, imdbId]);

  // Handle Controls Fading on Mouse Inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false); // Hide settings too when controls fade
      }, 3000);
    }
  };

  // Synchronize Player Actions
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const time = video.currentTime;
    setCurrentTime(time);

    // Skip Intro overlay triggers (TV Shows only)
    if (type === 'tv') {
      const isIntroTime = time >= 5 && time <= 90;
      setShowSkipIntro(isIntroTime);

      // Auto Skip Intro if enabled (runs only once per episode start)
      if (autoSkipIntro && time > 0 && time < 5 && !skippedIntroRef.current) {
        skippedIntroRef.current = true;
        video.currentTime = 85;
        setShowSkippedToast(true);
        setTimeout(() => setShowSkippedToast(false), 3000);
      }
    }
  };

  const handleSkipIntro = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 85;
    setShowSkipIntro(false);
  };

  const handleEnded = () => {
    if (onEnded) {
      onEnded();
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    video.volume = newVol;
    setIsMuted(newVol === 0);
    video.muted = newVol === 0;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    video.muted = newMuted;
    if (!newMuted && volume === 0) {
      setVolume(0.5);
      video.volume = 0.5;
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video || document.pictureInPictureElement === video) {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  };

  // Change HLS stream level index manually
  const selectQuality = (levelIndex: number) => {
    const hls = hlsInstanceRef.current;
    if (!hls) return;
    hls.currentLevel = levelIndex;
    setCurrentLevel(levelIndex);
    setShowSettings(false);
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Helper to determine what label to show in the control bar
  const getQualityLabel = () => {
    const hls = hlsInstanceRef.current;
    if (!hls) return '';
    
    // If set to auto, show auto + current level height
    if (hls.loadLevel === -1) {
      const activeLvl = hls.levels[currentLevel];
      return activeLvl ? `Auto (${activeLvl.height}p)` : 'Auto';
    }
    
    const activeLvl = hls.levels[currentLevel];
    return activeLvl ? `${activeLvl.height}p` : 'Manual';
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && (setShowControls(false), setShowSettings(false))}
      className="relative w-full h-full bg-black group select-none overflow-hidden flex items-center justify-center"
    >
      <style dangerouslySetInnerHTML={{__html: `
        video::cue {
          background: rgba(6, 6, 6, 0.8) !important;
          color: #ffffff !important;
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif !important;
          font-size: 1.2rem !important;
          font-weight: 700 !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8) !important;
        }
        @media (max-width: 768px) {
          video::cue {
            font-size: 0.95rem !important;
          }
        }
        @media (max-width: 480px) {
          video::cue {
            font-size: 0.8rem !important;
          }
        }
      `}} />

      {/* Manual Skip Intro Button */}
      {type === 'tv' && showSkipIntro && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkipIntro();
          }}
          className={`absolute z-30 right-6 bg-black/80 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-xl text-white hover:border-[#2dd4bf]/40 hover:text-[#2dd4bf] transition-all duration-300 flex items-center gap-2 font-black text-[10px] uppercase tracking-[2px] shadow-2xl ${
            showControls ? 'bottom-24' : 'bottom-6'
          }`}
        >
          Skip Intro
        </button>
      )}

      {/* Auto-skipped Toast Notification */}
      {showSkippedToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-[#060606]/95 border border-[#2dd4bf]/20 backdrop-blur-md px-5 py-2.5 rounded-xl text-[#2dd4bf] font-black text-[10px] uppercase tracking-[2px] shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" />
          Skipped Intro Automatically
        </div>
      )}

      <video
        ref={videoRef}
        onClick={togglePlay}
        onPlay={() => {
          setIsPlaying(true);
          handleMouseMove();
        }}
        onPause={() => {
          setIsPlaying(false);
          setShowControls(true);
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      >
        {subtitles.map((sub, index) => (
          <track
            key={index}
            src={sub.url}
            label={sub.label}
            srcLang={sub.lang}
            kind="subtitles"
            default={activeSubtitle === index}
          />
        ))}
      </video>

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
            Searching Fastest Stream...
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

      {/* Buffering Spinner */}
      {isBuffering && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 pointer-events-none">
          <Loader2 className="w-12 h-12 text-[#2dd4bf] animate-spin" />
        </div>
      )}

      {/* Premium Badge */}
      <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-[#2dd4bf]/10 backdrop-blur-md border border-[#2dd4bf]/20 rounded-lg pointer-events-none">
        <span className="text-[#2dd4bf] text-[9px] font-black uppercase tracking-[2px]">Elite Ad-Free Player</span>
      </div>

      {/* Settings Selector Overlay (Quality & Subtitles Menu) */}
      {showSettings && !loading && !error && (levels.length > 0 || subtitles.length > 0) && (
        <div className="absolute bottom-24 right-6 z-30 bg-[#060606]/95 border border-white/10 backdrop-blur-xl rounded-2xl p-4 w-72 sm:w-[380px] shadow-2xl flex flex-col gap-3.5 transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Playback Quality Column */}
            <div className="flex-1 flex flex-col gap-1 min-w-[120px]">
              <p className="text-[10px] text-white/40 uppercase font-black tracking-wider px-2 py-1 border-b border-white/5 mb-1.5">
                Quality
              </p>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto scrollbar-none pr-1">
                {levels.length > 0 ? (
                  <>
                    {/* Auto ABR Button */}
                    <button 
                      onClick={() => selectQuality(-1)}
                      className={`flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-left text-xs font-bold transition-all ${
                        hlsInstanceRef.current?.loadLevel === -1
                          ? 'bg-[#2dd4bf]/10 text-[#2dd4bf]'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>Auto</span>
                      {hlsInstanceRef.current?.loadLevel === -1 && <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />}
                    </button>

                    {/* Explicit Quality Level Buttons */}
                    {levels.map((lvl) => (
                      <button
                        key={lvl.index}
                        onClick={() => selectQuality(lvl.index)}
                        className={`flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-left text-xs font-bold transition-all ${
                          hlsInstanceRef.current?.loadLevel === lvl.index
                            ? 'bg-[#2dd4bf]/10 text-[#2dd4bf]'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{lvl.name}</span>
                        {hlsInstanceRef.current?.loadLevel === lvl.index && <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />}
                      </button>
                    ))}
                  </>
                ) : (
                  <p className="text-white/30 text-[10px] italic px-2 py-1">No options available</p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-white/5 self-stretch" />
            <div className="block sm:hidden h-px bg-white/5 w-full" />

            {/* Subtitles Column */}
            <div className="flex-1 flex flex-col gap-1 min-w-[120px]">
              <p className="text-[10px] text-white/40 uppercase font-black tracking-wider px-2 py-1 border-b border-white/5 mb-1.5">
                Subtitles
              </p>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto scrollbar-none pr-1">
                {/* Subtitle Off Button */}
                <button 
                  onClick={() => {
                    setActiveSubtitle(-1);
                    setShowSettings(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-left text-xs font-bold transition-all ${
                    activeSubtitle === -1
                      ? 'bg-[#2dd4bf]/10 text-[#2dd4bf]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>Off</span>
                  {activeSubtitle === -1 && <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />}
                </button>

                {/* Subtitle Track Buttons */}
                {subtitles.length > 0 ? (
                  subtitles.map((sub, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveSubtitle(index);
                        setShowSettings(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-left text-xs font-bold transition-all ${
                        activeSubtitle === index
                          ? 'bg-[#2dd4bf]/10 text-[#2dd4bf]'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="truncate max-w-[110px]">{sub.label}</span>
                      {activeSubtitle === index && <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />}
                    </button>
                  ))
                ) : (
                  <p className="text-white/30 text-[10px] italic px-2 py-1">No subtitles found</p>
                )}
              </div>
            </div>
          </div>


        </div>
      )}

      {/* Custom Control Overlay (Only visible when loaded successfully) */}
      {!loading && !error && (
        <div 
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 pt-16 transition-all duration-500 ease-out z-20 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Timeline Scrub Container */}
          <div className="w-full flex items-center gap-4 mb-4">
            <span className="text-white/60 text-[11px] font-bold tabular-nums min-w-[36px]">
              {formatTime(currentTime)}
            </span>
            
            <div className="relative flex-1 group/timeline h-1.5 flex items-center">
              {/* Custom styled progress slider */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleScrubChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
              />
              {/* Background Track */}
              <div className="absolute inset-0 bg-white/10 rounded-full group-hover/timeline:h-2 transition-all" />
              {/* Progress Fill */}
              <div 
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#2dd4bf] to-teal-400 rounded-full group-hover/timeline:h-2 transition-all z-10"
              />
              {/* Knob Handler */}
              <div 
                style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/timeline:scale-100 transition-transform -translate-x-1/2 z-20"
              />
            </div>

            <span className="text-white/60 text-[11px] font-bold tabular-nums min-w-[36px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Controls Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Play/Pause Button */}
              <button 
                onClick={togglePlay}
                className="text-white hover:text-[#2dd4bf] transition-colors p-1"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2 group/volume">
                <button 
                  onClick={toggleMute}
                  className="text-white hover:text-[#2dd4bf] transition-colors p-1"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                
                <div className="w-0 group-hover/volume:w-20 transition-all duration-300 overflow-hidden flex items-center h-5">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/20 rounded-full appearance-none accent-[#2dd4bf] outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Action Side */}
            <div className="flex items-center gap-6">
              {/* Quality & Subtitles Settings Selector */}
              {(levels.length > 0 || subtitles.length > 0) && (
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider p-1 transition-all ${
                    showSettings ? 'text-[#2dd4bf]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Settings size={18} className={showSettings ? 'animate-spin-once' : ''} />
                  <span className="text-[10px]">
                    {levels.length > 0 
                      ? getQualityLabel() 
                      : (activeSubtitle === -1 ? 'Subtitles Off' : subtitles[activeSubtitle]?.label || 'Subtitles')}
                  </span>
                </button>
              )}

              {/* Picture in Picture */}
              <button 
                onClick={togglePictureInPicture}
                className="text-white hover:text-[#2dd4bf] transition-colors p-1"
              >
                <PictureInPicture size={18} />
              </button>

              {/* Fullscreen Toggle */}
              <button 
                onClick={toggleFullscreen}
                className="text-white hover:text-[#2dd4bf] transition-colors p-1"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
