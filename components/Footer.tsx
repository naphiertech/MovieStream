import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-bg-dark text-white/40 py-20 mt-20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2dd4bf]/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-14 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-2 text-white font-black text-2xl uppercase tracking-tighter italic">
              <Zap className="text-[#2dd4bf] fill-[#2dd4bf] -rotate-12" size={28} />
              <div className="flex flex-col leading-tight">
                <span>MOVIE</span>
                <span className="text-[#2dd4bf] -mt-1 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">STREAM PRO</span>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed font-medium">
              The ultimate destination for premium cinematic experiences. Stream the latest movies and TV shows in 4K HDR.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-20">
            <div className="space-y-4">
              <h4 className="text-white font-black text-[11px] uppercase tracking-[2px]">Platform</h4>
              <ul className="space-y-3 text-[13px]">
                <li><Link href="/movies" className="hover:text-[#2dd4bf] transition-colors">Movies</Link></li>
                <li><Link href="/tv-shows" className="hover:text-[#2dd4bf] transition-colors">TV Shows</Link></li>
                <li><Link href="/genres" className="hover:text-[#2dd4bf] transition-colors">Genres</Link></li>
                <li><Link href="/trending" className="hover:text-[#2dd4bf] transition-colors">Trending</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-black text-[11px] uppercase tracking-[2px]">Legal</h4>
              <ul className="space-y-3 text-[13px]">
                <li><Link href="#" className="hover:text-[#2dd4bf] transition-colors">DMCA</Link></li>
                <li><Link href="#" className="hover:text-[#2dd4bf] transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-[#2dd4bf] transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-black text-[11px] uppercase tracking-[2px]">Connect</h4>
              <ul className="space-y-3 text-[13px]">
                <li><Link href="#" className="hover:text-[#2dd4bf] transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-[#2dd4bf] transition-colors">Discord</Link></li>
                <li><Link href="#" className="hover:text-[#2dd4bf] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-[1px]">
          <p>Built for elite high-fidelity digital experiences.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
            <p>&copy; {new Date().getFullYear()} MovieStream Pro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
