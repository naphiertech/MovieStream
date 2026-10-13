'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RotateCw, 
  Film, 
  Tv, 
  Flame, 
  Copy, 
  Check, 
  Lock, 
  ShieldCheck 
} from 'lucide-react';

interface MenuPosition {
  x: number;
  y: number;
}

export function SecurityGuard() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Right-Click Interception & Custom Context Menu
  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();

    const menuWidth = 220;
    const menuHeight = 310;

    // Clamp coordinates so menu stays fully inside viewport
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 12);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 12);

    setPosition({ x: Math.max(12, x), y: Math.max(12, y) });
    setIsOpen(true);
  }, []);

  // Close custom context menu on click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDownClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDownClose);
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDownClose);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  // 2. Keyboard Shortcuts Deterrence (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isDev = process.env.NODE_ENV !== 'production' && (
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
      );

      // Only enforce strict shortcut blocking in live/production mode or outside localhost
      if (isDev) return;

      const key = e.key.toLowerCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (ctrlOrMeta && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Block Ctrl+U (View Source)
      if (ctrlOrMeta && key === 'u') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Block Ctrl+S (Save Page)
      if (ctrlOrMeta && key === 's') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleContextMenu]);

  // 3. DevTools Detection & Anti-Debug Loop (Live/Production Only)
  useEffect(() => {
    const isLive = process.env.NODE_ENV === 'production' || (
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1'
    );

    if (!isLive) return;

    // Suppress console logs in live production so internal state/requests never leak
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};

    // Anti-debug trap: Function constructor debugger halts browser inspector if opened
    const debugTrap = () => {
      try {
        const check = Function('debugger');
        check();
      } catch {
        // ignore if blocked by CSP
      }
    };

    const debugInterval = setInterval(debugTrap, 1500);

    return () => {
      clearInterval(debugInterval);
    };
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1000);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          ref={menuRef}
          style={{ top: `${position.y}px`, left: `${position.x}px` }}
          className="fixed z-[99999] w-56 rounded-2xl bg-[#090a0d]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(132,169,140,0.15)] p-1.5 font-outfit text-xs select-none transition-none md:transition-opacity md:duration-150 animate-in fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1">
            <span className="font-extrabold italic tracking-tight text-white flex items-center gap-1.5">
              <span className="font-serif italic font-normal text-sage-300">MoviesStream</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-sage-400 bg-sage-500/10 px-2 py-0.5 rounded-full border border-sage-500/20">
              <ShieldCheck size={10} />
              Secure
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => {
                setIsOpen(false);
                window.history.back();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <ArrowLeft size={13} className="text-white/40" />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                window.location.reload();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <RotateCw size={13} className="text-white/40" />
              <span>Reload Page</span>
            </button>

            <div className="h-px bg-white/5 my-1" />

            <Link
              href="/movies"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <Film size={13} className="text-sage-400" />
              <span>Explore Movies</span>
            </Link>

            <Link
              href="/tv-shows"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <Tv size={13} className="text-sage-400" />
              <span>Explore TV Shows</span>
            </Link>

            <Link
              href="/trending"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <Flame size={13} className="text-sage-400" />
              <span>Trending Now</span>
            </Link>

            <div className="h-px bg-white/5 my-1" />

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                {copied ? <Check size={13} className="text-sage-400" /> : <Copy size={13} className="text-white/40" />}
                <span>{copied ? 'Link Copied!' : 'Copy Page URL'}</span>
              </div>
            </button>
          </div>

          {/* Footer Badge */}
          <div className="mt-1 pt-1.5 border-t border-white/5 px-2 py-1 flex items-center justify-center gap-1.5 text-[9px] text-white/30">
            <Lock size={9} />
            <span>Developer Tools Restricted</span>
          </div>
        </div>
      )}
    </>
  );
}
