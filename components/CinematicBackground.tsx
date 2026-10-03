'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicBackgroundProps {
  id: string;
  type: 'movie' | 'tv';
  fallbackImage: string;
}

export function CinematicBackground({
  id,
  type,
  fallbackImage,
}: CinematicBackgroundProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile once on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
  }, []);

  useEffect(() => {
    setVideoKey(null);
    setIsReady(false);

    // Skip YouTube iframe on mobile — use static image only
    if (isMobile) return;

    const fetchTrailer = async () => {
      try {
        const res = await fetch(`/api/videos/${type}/${id}`);

        if (!res.ok) {
          throw new Error('Failed to fetch videos');
        }

        const videos = await res.json();

        const trailer =
          videos.find(
            (v: any) =>
              v.type === 'Trailer' && v.site === 'YouTube'
          ) ||
          videos.find(
            (v: any) =>
              v.type === 'Teaser' && v.site === 'YouTube'
          ) ||
          videos.find((v: any) => v.site === 'YouTube');

        setVideoKey(trailer?.key || null);
      } catch (error) {
        console.error(error);
        setVideoKey(null);
      }
    };

    fetchTrailer();
  }, [id, type, isMobile]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#060606]">
      {/* ───────────────────────────────────────────── */}
      {/* VIDEO BACKGROUND (desktop only) */}
      {/* ───────────────────────────────────────────── */}

      {!isMobile && (
        <AnimatePresence mode="wait">
          {videoKey ? (
            <motion.div
              key={`video-${id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isReady ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0 z-0"
            >
              {/* 
                300% trick pushes YouTube controls/icons
                outside visible viewport
              */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: '300%',
                  height: '100%',
                  left: '-100%',
                  top: 0,
                }}
              >
                <iframe
                  title="Background Trailer"
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  loading="eager"
                  src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&cc_load_policy=0&fs=0&showinfo=0&branding=0&vq=hd1080`}
                  onLoad={() => {
                    setTimeout(() => {
                      setIsReady(true);
                    }, 2500);
                  }}
                />
              </div>

              {/* Click blocker */}
              <div className="absolute inset-0 z-10 pointer-events-auto" />

              {/* Extra darkening layer */}
              <div className="absolute inset-0 z-[5] bg-black/20" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}

      {/* ───────────────────────────────────────────── */}
      {/* FALLBACK IMAGE */}
      {/* ───────────────────────────────────────────── */}

      {isMobile ? (
        <div key={`fallback-${id}`} className="absolute inset-0 z-0">
          <Image
            src={fallbackImage}
            alt="Cinematic Background"
            fill
            priority
            sizes="100vw"
            referrerPolicy="no-referrer"
            unoptimized={!fallbackImage.startsWith('http')}
            className="object-cover opacity-60"
          />
        </div>
      ) : (
        <AnimatePresence>
          {(!videoKey || !isReady) && (
            <motion.div
              key={`fallback-${id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.8, ease: 'easeOut' } }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={fallbackImage}
                alt="Cinematic Background"
                fill
                priority
                sizes="100vw"
                referrerPolicy="no-referrer"
                unoptimized={!fallbackImage.startsWith('http')}
                className="object-cover opacity-60"
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ───────────────────────────────────────────── */}
      {/* CINEMATIC OVERLAYS */}
      {/* ───────────────────────────────────────────── */}

      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#060606]" />

        {/* Left text readability fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-black/30 to-transparent opacity-80" />

        {/* Vignette */}
        <div className="absolute inset-0 hero-vignette" />

        {/* Film grain / scanlines — disabled on mobile */}
        <div className="absolute inset-0 opacity-[0.03] hidden md:block bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>
    </div>
  );
}