import Link from 'next/link';
import { Zap, Github, Globe, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-bg-dark text-white/40 py-20 mt-20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-600/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-14 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                <svg className="w-4 h-4 fill-white ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-white font-black text-xl tracking-tighter uppercase font-outfit italic">
                Movie<span className="text-red-500">Stream</span>
              </span>
            </div>
            <p className="text-[13px] leading-relaxed font-medium">
              The ultimate destination for premium cinematic experiences. Stream the latest movies and TV shows in 4K HDR.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-20">
            <div className="space-y-4">
              <h4 className="text-white font-black text-[11px] uppercase tracking-[2px]">Platform</h4>
              <ul className="space-y-3 text-[13px]">
                <li><Link href="/movies" className="hover:text-red-500 transition-colors">Movies</Link></li>
                <li><Link href="/tv-shows" className="hover:text-red-500 transition-colors">TV Shows</Link></li>
                <li><Link href="/genres" className="hover:text-red-500 transition-colors">Genres</Link></li>
                <li><Link href="/trending" className="hover:text-red-500 transition-colors">Trending</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-black text-[11px] uppercase tracking-[2px]">Legal</h4>
              <ul className="space-y-3 text-[13px]">
                <li><Link href="#" className="hover:text-red-500 transition-colors">DMCA</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-black text-[11px] uppercase tracking-[2px]">Connect</h4>
              <ul className="space-y-3 text-[13px]">
                <li>
                  <a 
                    href="https://naphier-portfolio.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <Globe size={14} className="text-white/20 group-hover:text-red-500 transition-colors" />
                    <span>Portfolio</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/bagatata05" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <Github size={14} className="text-white/20 group-hover:text-red-500 transition-colors" />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/in/awalie-naphier-b-0551983b5" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <Linkedin size={14} className="text-white/20 group-hover:text-red-500 transition-colors" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://x.com/bagatata05" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <Twitter size={14} className="text-white/20 group-hover:text-red-500 transition-colors" />
                    <span>Twitter / X</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.instagram.com/bagatata05/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <Instagram size={14} className="text-white/20 group-hover:text-red-500 transition-colors" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.facebook.com/naph05" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <Facebook size={14} className="text-white/20 group-hover:text-red-500 transition-colors" />
                    <span>Facebook</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-[1px]">
          <p className="flex items-center gap-2">
            <span>Made with ⚡ by</span>
            <a 
              href="https://naphier-portfolio.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-red-500 hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(229,9,20,0.3)] font-black"
            >
              Naphier
            </a>
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <p>&copy; {new Date().getFullYear()} MovieStream. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
