import Link from 'next/link';
import { Github, Globe, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white/40 py-6 md:py-8 mt-10 border-t border-white/[0.06] relative">
      <div className="max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16">
        {/* Top/Main Compact Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-8 pb-5 border-b border-white/[0.05]">
          {/* Brand + Cursive MoviesStream + Tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Folded Sage Ribbon Logo */}
              <div className="relative w-6 h-6 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-[0_2px_8px_rgba(132,169,140,0.35)]"
                >
                  <path
                    d="M8 32V11C8 9.34315 9.34315 8 11 8H13.5L20 22L13.5 32H8Z"
                    fill="#52796F"
                  />
                  <path
                    d="M13 8L20 22L27 8H13Z"
                    fill="#6B8F74"
                    fillOpacity="0.85"
                  />
                  <path
                    d="M20 22L26.5 8H29C30.6569 8 32 9.34315 32 11V32H26.5L20 22Z"
                    fill="#98C1A9"
                  />
                  <path
                    d="M13.5 32L20 22L26.5 32H13.5Z"
                    fill="#84A98C"
                  />
                </svg>
              </div>

              {/* MoviesStream in Cursive Font */}
              <span className="font-cursive text-2xl md:text-[27px] font-bold text-white tracking-wide leading-none select-none">
                Movies<span className="text-sage-400">Stream</span>
              </span>
            </Link>

            <span className="hidden sm:inline text-white/20">•</span>

            <p className="text-xs text-white/45 font-normal tracking-normal">
              Premium cinematic streaming in 4K HDR.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-white/60">
            <Link href="/movies" className="hover:text-sage-400 transition-colors">
              Movies
            </Link>
            <Link href="/tv-shows" className="hover:text-sage-400 transition-colors">
              TV Shows
            </Link>
            <Link href="/trending" className="hover:text-sage-400 transition-colors">
              Trending
            </Link>
            <Link href="#" className="hover:text-sage-400 transition-colors">
              DMCA
            </Link>
            <Link href="#" className="hover:text-sage-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-sage-400 transition-colors">
              Terms
            </Link>
          </div>

          {/* Compact Social Icon Strip */}
          <div className="flex items-center gap-1.5 text-white/45">
            <a
              href="https://naphier-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
              title="Portfolio"
              className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center hover:text-sage-400 transition-colors"
            >
              <Globe size={13} />
            </a>
            <a
              href="https://github.com/naphiertech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center hover:text-sage-400 transition-colors"
            >
              <Github size={13} />
            </a>
            <a
              href="https://www.linkedin.com/in/naphier-awalie-0551983b5/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center hover:text-sage-400 transition-colors"
            >
              <Linkedin size={13} />
            </a>
            <a
              href="https://x.com/bagatata05"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              title="Twitter / X"
              className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center hover:text-sage-400 transition-colors"
            >
              <Twitter size={13} />
            </a>
            <a
              href="https://www.instagram.com/bagatata05/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center hover:text-sage-400 transition-colors"
            >
              <Instagram size={13} />
            </a>
            <a
              href="https://www.facebook.com/naph05"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center hover:text-sage-400 transition-colors"
            >
              <Facebook size={13} />
            </a>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-3.5 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] font-medium text-white/40">
          <p className="flex items-center gap-1.5">
            <span>Made with ⚡ by</span>
            <a
              href="https://naphier-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-400 hover:text-white transition-colors font-semibold"
            >
              Naphier
            </a>
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse" />
            <p>&copy; {new Date().getFullYear()} MoviesStream. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
