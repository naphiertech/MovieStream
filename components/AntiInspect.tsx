'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Copy, AppWindow } from 'lucide-react';

export function AntiInspect() {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, url: string } | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    // Intercept native context menu and route to our custom UI
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Block native menu globally
      
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a');
      
      if (link && link.href) {
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          url: link.href
        });
      } else {
        setContextMenu(null); // Hide menu if right-clicking empty space
      }
    };

    // Hide custom menu on normal clicks
    const handleClick = () => {
      setContextMenu(null);
    };

    // Prevent DevTools Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I')) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'j' || e.key === 'J')) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'c' || e.key === 'C')) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!contextMenu) return null;

  // Prevent menu from overflowing right or bottom edge
  const adjustedX = Math.min(contextMenu.x, typeof window !== 'undefined' ? window.innerWidth - 240 : contextMenu.x);
  const adjustedY = Math.min(contextMenu.y, typeof window !== 'undefined' ? window.innerHeight - 150 : contextMenu.y);

  const handleAction = (action: 'tab' | 'window' | 'copy', e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenu(null);
    
    if (action === 'tab') {
      window.open(contextMenu.url, '_blank');
    } else if (action === 'window') {
      window.open(contextMenu.url, '_blank', 'width=1000,height=800,menubar=no,toolbar=no,location=no');
    } else if (action === 'copy') {
      navigator.clipboard.writeText(contextMenu.url);
    }
  };

  return (
    <div 
      className="fixed z-[9999] bg-[#0f0f0f] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] w-[240px] p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150"
      style={{ left: adjustedX, top: adjustedY }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button 
        onClick={(e) => handleAction('tab', e)}
        className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full text-left"
      >
        <ExternalLink size={14} className="text-white/50" />
        Open link in new tab
      </button>
      
      <button 
        onClick={(e) => handleAction('window', e)}
        className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full text-left"
      >
        <AppWindow size={14} className="text-white/50" />
        Open link in new window
      </button>

      <div className="h-[1px] bg-white/5 my-1 mx-2" />

      <button 
        onClick={(e) => handleAction('copy', e)}
        className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full text-left"
      >
        <Copy size={14} className="text-red-500" />
        Copy link address
      </button>
    </div>
  );
}
