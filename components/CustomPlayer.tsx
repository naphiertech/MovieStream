'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Settings, 
  Subtitles, 
  Loader2,
  Tv
} from 'lucide-react';

interface StreamCaption {
  label: string;
  language: string;
  url: string;
}

interface CustomPlayerProps {
  videoUrl: string;
  qualities: Record<string, string>; // maps quality label to URL
  captions: StreamCaption[];
  providerId: string;
  autoPlay?: boolean;
  onFatalError?: (error: any) => void;
  onEnded?: () => void;
}

export function CustomPlayer({
  videoUrl,
  qualities,
  captions,
  providerId,
  autoPlay = true,
  onFatalError,
  onEnded
}: CustomPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Source & Quality States
  const [currentUrl, setCurrentUrl] = useState(videoUrl);
  const [activeQuality, setActiveQuality] = useState('');
  
  // Playback States
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Overlay / Menu dropdown states
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showCaptionMenu, setShowCaptionMenu] = useState(false);
  const [activeCaption, setActiveCaption] = useState<StreamCaption | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize currentUrl if videoUrl changes from parent
  useEffect(() => {
    setCurrentUrl(videoUrl);
    // Find initial quality label matching the videoUrl
    const match = Object.entries(qualities).find(([_, url]) => url === videoUrl);
    setActiveQuality(match ? match[0] : Object.keys(qualities)[0] || 'Auto');
  }, [videoUrl, qualities]);

  // Hls.js loader & initialization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: any = null;
    setLoading(true);

    const isHlsUrl =
      currentUrl.includes('.m3u8') ||
      currentUrl.includes('mpegurl') ||
      currentUrl.includes('application/x-mpegURL');

    if (isHlsUrl) {
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls({
            maxMaxBufferLength: 30,
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstance = hls;
          hls.loadSource(currentUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            if (autoPlay) {
              video.play().catch(() => {});
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.warn('[HlsPlayer] Fatal network error, attempting recovery...');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.warn('[HlsPlayer] Fatal media error, attempting recovery...');
                  hls.recoverMediaError();
                  break;
                default:
                  console.error('[HlsPlayer] Fatal non-recoverable error:', data);
                  if (onFatalError) onFatalError(data);
                  break;
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native Safari playback
          video.src = currentUrl;
          const handleLoaded = () => {
            setLoading(false);
            if (autoPlay) video.play().catch(() => {});
          };
          video.addEventListener('loadedmetadata', handleLoaded);
          return () => {
            video.removeEventListener('loadedmetadata', handleLoaded);
          };
        } else {
          setLoading(false);
          console.error('[CustomPlayer] HLS is not supported in this browser.');
          if (onFatalError) onFatalError(new Error('HLS not supported'));
        }
      });
    } else {
      // Normal direct stream (e.g. mp4)
      video.src = currentUrl;
      const handleLoaded = () => {
        setLoading(false);
        if (autoPlay) video.play().catch(() => {});
      };
      video.addEventListener('loadedmetadata', handleLoaded);
      return () => {
        video.removeEventListener('loadedmetadata', handleLoaded);
      };
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [currentUrl, autoPlay, onFatalError]);

  // Video Events Syncing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Update buffered state
      if (video.buffered.length > 0) {
        const d = video.duration || 1;
        const b = video.buffered.end(video.buffered.length - 1);
        setBuffered((b / d) * 100);
      }
    };

    const handleDurationChange = () => setDuration(video.duration);
    const handleWaiting = () => setLoading(true);
    const handlePlaying = () => setLoading(false);
    
    const handleEndedEvent = () => {
      setPlaying(false);
      if (onEnded) onEnded();
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ended', handleEndedEvent);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ended', handleEndedEvent);
    };
  }, [onEnded]);

  // Sync volume & muted states
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Sync playback speed state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Auto-hiding control overlay
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        // Only hide controls if no dropdown menus are open
        if (!showQualityMenu && !showSpeedMenu && !showCaptionMenu) {
          setShowControls(false);
        }
      }, 3500);
    }
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [playing, showQualityMenu, showSpeedMenu, showCaptionMenu]);

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  // Play/Pause Action
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
    resetControlsTimeout();
  };

  // Mute Action
  const toggleMute = () => {
    setMuted(!muted);
    resetControlsTimeout();
  };

  // Fullscreen Action
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    resetControlsTimeout();
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Time formatter helper
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const paddedSecs = secs < 10 ? `0${secs}` : secs;

    if (hrs > 0) {
      const paddedMins = mins < 10 ? `0${mins}` : mins;
      return `${hrs}:${paddedMins}:${paddedSecs}`;
    }
    return `${mins}:${paddedSecs}`;
  };

  // Quality Switch with playback position recovery
  const handleQualityChange = (qualityLabel: string, url: string) => {
    if (!videoRef.current) return;
    
    // Save current playback position
    const savedTime = videoRef.current.currentTime;
    const wasPlaying = !videoRef.current.paused;

    setActiveQuality(qualityLabel);
    setCurrentUrl(url);
    setShowQualityMenu(false);
    setLoading(true);

    // Re-seek to saved position after metadata re-binds
    const handleSeekOnLoad = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = savedTime;
        if (wasPlaying) {
          videoRef.current.play().catch(() => {});
        }
      }
      videoRef.current?.removeEventListener('loadedmetadata', handleSeekOnLoad);
    };

    videoRef.current.addEventListener('loadedmetadata', handleSeekOnLoad);
  };

  // Keyboard Shortcuts (Space for play/pause, Left/Right for seek, Up/Down for volume, F for Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events in forms/inputs
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'BUTTON')) {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime = Math.min(video.currentTime + 10, video.duration || 0);
          resetControlsTimeout();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(video.currentTime - 10, 0);
          resetControlsTimeout();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => Math.min(v + 0.1, 1));
          setMuted(false);
          resetControlsTimeout();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => Math.max(v - 0.1, 0));
          resetControlsTimeout();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playing, muted, volume]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
      className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden select-none"
    >
      {/* Video tag */}
      <video 
        ref={videoRef}
        playsInline
        crossOrigin="anonymous"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        className="w-full h-full object-contain cursor-pointer"
      >
        {activeCaption && (
          <track 
            kind="captions"
            label={activeCaption.label}
            srcLang={activeCaption.language}
            src={activeCaption.url}
            default
          />
        )}
      </video>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center pointer-events-none z-30">
          <Loader2 className="animate-spin text-sage-400 mb-3" size={48} />
          <p className="text-white/60 font-black text-[9px] uppercase tracking-[3px]">Syncing stream...</p>
        </div>
      )}

      {/* Big Play Overlay (Centered) */}
      {!playing && !loading && (
        <button 
          onClick={togglePlay}
          className="absolute w-20 h-20 rounded-full bg-sage-600 hover:bg-sage-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(132, 169, 140,0.5)] transform hover:scale-110 transition-all duration-300 z-20"
        >
          <Play size={32} fill="currentColor" className="ml-1" />
        </button>
      )}

      {/* Control Overlay Bar */}
      <div 
        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-black/60 transition-opacity duration-300 z-10 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Info Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-sage-600 animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">Custom Player Active</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <Tv size={12} className="text-sage-400" />
            <span className="text-[9px] font-black text-white/60 uppercase tracking-[1px]">{providerId} source</span>
          </div>
        </div>

        {/* Bottom controls panel */}
        <div className="w-full px-6 pb-6 pt-10 flex flex-col gap-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-auto">
          {/* Progress Timeline bar */}
          <div className="relative group/timeline w-full flex items-center h-2 cursor-pointer">
            <div className="absolute left-0 right-0 h-1 rounded bg-white/20 group-hover/timeline:h-1.5 transition-all duration-200" />
            {/* Buffered Stream Range */}
            <div 
              style={{ width: `${buffered}%` }}
              className="absolute left-0 h-1 bg-white/10 group-hover/timeline:h-1.5 transition-all duration-200 rounded"
            />
            {/* Play progress */}
            <div 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              className="absolute left-0 h-1 bg-sage-600 group-hover/timeline:h-1.5 transition-all duration-200 rounded shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            />
            {/* Range Input element overlapping */}
            <input 
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const video = videoRef.current;
                if (video) {
                  video.currentTime = parseFloat(e.target.value);
                  setCurrentTime(video.currentTime);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Action buttons row */}
          <div className="flex items-center justify-between w-full">
            {/* Playback Controls Left */}
            <div className="flex items-center gap-5">
              <button 
                onClick={togglePlay} 
                className="text-white/80 hover:text-white transition-colors transform hover:scale-105"
              >
                {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>

              <button 
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
                }} 
                className="text-white/40 hover:text-white transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw size={16} />
              </button>

              {/* Volume Controller */}
              <div className="flex items-center gap-2 group/volume relative">
                <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                  {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input 
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (v > 0) setMuted(false);
                  }}
                  className="w-0 group-hover/volume:w-16 h-1 rounded bg-white/20 accent-sage-500 transition-all duration-300 cursor-pointer overflow-hidden"
                />
              </div>

              {/* Timing Display */}
              <div className="text-[11px] font-bold text-white/50 select-none">
                <span className="text-white">{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Quality & Settings Controls Right */}
            <div className="flex items-center gap-5 relative">
              {/* Captions Selector */}
              {captions.length > 0 && (
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowCaptionMenu(!showCaptionMenu);
                      setShowQualityMenu(false);
                      setShowSpeedMenu(false);
                    }}
                    className={`transition-colors ${activeCaption ? 'text-sage-400 hover:text-sage-300' : 'text-white/50 hover:text-white'}`}
                    title="Subtitles/Captions"
                  >
                    <Subtitles size={20} />
                  </button>

                  {showCaptionMenu && (
                    <div className="absolute bottom-full right-0 mb-3 bg-black/95 border border-white/10 rounded-2xl p-2 min-w-[140px] shadow-2xl flex flex-col gap-1 z-50">
                      <div className="text-[9px] font-black text-white/30 uppercase px-3 py-1 border-b border-white/5 select-none">Captions</div>
                      <button 
                        onClick={() => {
                          setActiveCaption(null);
                          setShowCaptionMenu(false);
                        }}
                        className={`text-left px-3 py-1.5 rounded-xl text-[10px] font-bold ${!activeCaption ? 'text-sage-400 bg-sage-600/10' : 'text-white/60 hover:bg-white/5'}`}
                      >
                        Off
                      </button>
                      {captions.map((cap) => (
                        <button 
                          key={cap.language}
                          onClick={() => {
                            setActiveCaption(cap);
                            setShowCaptionMenu(false);
                          }}
                          className={`text-left px-3 py-1.5 rounded-xl text-[10px] font-bold truncate ${activeCaption?.language === cap.language ? 'text-sage-400 bg-sage-600/10' : 'text-white/60 hover:bg-white/5'}`}
                        >
                          {cap.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Playback speed selector */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowSpeedMenu(!showSpeedMenu);
                    setShowQualityMenu(false);
                    setShowCaptionMenu(false);
                  }}
                  className="text-white/50 hover:text-white transition-colors text-[10px] font-black uppercase tracking-wider"
                  title="Playback Speed"
                >
                  {playbackSpeed === 1 ? 'Speed' : `${playbackSpeed}x`}
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-3 bg-black/95 border border-white/10 rounded-2xl p-2 min-w-[120px] shadow-2xl flex flex-col gap-1 z-50">
                    <div className="text-[9px] font-black text-white/30 uppercase px-3 py-1 border-b border-white/5 select-none">Speed</div>
                    {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                      <button 
                        key={speed}
                        onClick={() => {
                          setPlaybackSpeed(speed);
                          setShowSpeedMenu(false);
                        }}
                        className={`text-left px-3 py-1.5 rounded-xl text-[10px] font-bold ${playbackSpeed === speed ? 'text-sage-400 bg-sage-600/10' : 'text-white/60 hover:bg-white/5'}`}
                      >
                        {speed === 1 ? 'Normal' : `${speed}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Qualities Selector */}
              {Object.keys(qualities).length > 1 && (
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowQualityMenu(!showQualityMenu);
                      setShowSpeedMenu(false);
                      setShowCaptionMenu(false);
                    }}
                    className="text-white/50 hover:text-white transition-all hover:scale-105 flex items-center gap-1.5"
                    title="Video Quality"
                  >
                    <Settings size={20} />
                    <span className="text-[9px] font-black uppercase tracking-wider">{activeQuality}</span>
                  </button>

                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 mb-3 bg-black/95 border border-white/10 rounded-2xl p-2 min-w-[140px] shadow-2xl flex flex-col gap-1 z-50">
                      <div className="text-[9px] font-black text-white/30 uppercase px-3 py-1 border-b border-white/5 select-none">Quality</div>
                      {Object.entries(qualities).map(([label, url]) => (
                        <button 
                          key={label}
                          onClick={() => handleQualityChange(label, url)}
                          className={`text-left px-3 py-1.5 rounded-xl text-[10px] font-bold ${activeQuality === label ? 'text-sage-400 bg-sage-600/10' : 'text-white/60 hover:bg-white/5'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen Toggle */}
              <button 
                onClick={toggleFullscreen} 
                className="text-white/80 hover:text-white transition-colors"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
