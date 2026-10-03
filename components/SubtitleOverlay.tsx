'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Plus, Minus, X, Check, Upload, Play, Pause } from 'lucide-react';

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface SubtitleOverlayProps {
  onClose?: () => void;
}

export function SubtitleOverlay({ onClose }: SubtitleOverlayProps) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);

  // Parse SRT file
  const parseSRT = (data: string): Subtitle[] => {
    const subs: Subtitle[] = [];
    const blocks = data.split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.split('\n');
      if (lines.length >= 3) {
        const timeLine = lines[1];
        const match = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
        
        if (match) {
          const start = timeToSeconds(match[1]);
          const end = timeToSeconds(match[2]);
          const text = lines.slice(2).join('\n').replace(/<[^>]*>/g, '');
          subs.push({ start, end, text });
        }
      }
    }
    return subs;
  };

  const timeToSeconds = (timeStr: string): number => {
    const [h, m, s] = timeStr.replace(',', '.').split(':');
    return parseFloat(h) * 3600 + parseFloat(m) * 60 + parseFloat(s);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setSubtitles(parseSRT(text));
      };
      reader.readAsText(file);
    }
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const currentSubtitle = subtitles.find(
    (s) => currentTime + offset >= s.start && currentTime + offset <= s.end
  );

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-20 z-30">
      {/* The Subtitle Text */}
      <AnimatePresence mode="wait">
        {currentSubtitle && (
          <motion.div
            key={currentSubtitle.start}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full text-center px-10"
          >
            <span className="inline-block bg-black/90 text-white font-bold text-lg md:text-2xl px-6 py-2 rounded-xl border border-white/10 shadow-2xl">
              {currentSubtitle.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className="absolute top-6 right-6 pointer-events-auto flex flex-col gap-3">
        {showControls ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0f0f0f]/95 border border-white/10 p-5 rounded-[2rem] shadow-2xl flex flex-col gap-4 min-w-[240px]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-[#84a98c]" />
                <span className="text-[10px] font-black uppercase tracking-[2px] text-white/50">Sync Engine</span>
              </div>
              <button onClick={() => setShowControls(false)} className="text-white/20 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {!fileName ? (
              <label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-[#84a98c]/40 hover:bg-[#84a98c]/5 transition-all cursor-pointer group">
                <Upload size={24} className="text-white/20 group-hover:text-[#84a98c] transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-[1px] text-white/40 group-hover:text-white">Upload SRT</span>
                <input type="file" accept=".srt" onChange={handleFileUpload} className="hidden" />
              </label>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <Check size={14} className="text-green-500" />
                  <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{fileName}</span>
                  <button onClick={() => { setFileName(null); setSubtitles([]); setIsActive(false); }} className="ml-auto text-white/20 hover:text-sage-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[9px] uppercase tracking-[1px] transition-all ${
                      isActive ? 'bg-sage-500/20 text-sage-400 border border-sage-500/30' : 'bg-[#84a98c]/20 text-[#84a98c] border border-[#84a98c]/30'
                    }`}
                  >
                    {isActive ? <Pause size={12} /> : <Play size={12} />}
                    {isActive ? 'Pause Sync' : 'Start Sync'}
                  </button>
                  <button 
                    onClick={() => setCurrentTime(0)}
                    className="bg-white/5 text-white/50 hover:text-white border border-white/10 rounded-xl py-3 font-black text-[9px] uppercase tracking-[1px]"
                  >
                    Reset
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[9px] font-black uppercase tracking-[1px] text-white/30">Offset</span>
                    <span className={`text-[10px] font-black ${offset === 0 ? 'text-white/50' : offset > 0 ? 'text-green-500' : 'text-sage-400'}`}>
                      {offset > 0 ? '+' : ''}{offset.toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setOffset((o) => o - 0.5)} className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 flex items-center justify-center border border-white/5">
                      <Minus size={14} />
                    </button>
                    <button onClick={() => setOffset(0)} className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 text-[9px] font-black uppercase border border-white/5">
                      Clear
                    </button>
                    <button onClick={() => setOffset((o) => o + 0.5)} className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 flex items-center justify-center border border-white/5">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <button 
            onClick={() => setShowControls(true)}
            className="w-12 h-12 bg-[#0f0f0f]/95 border border-white/10 rounded-full flex items-center justify-center text-[#84a98c] hover:scale-110 transition-all shadow-2xl"
          >
            <Timer size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
