'use client';

import Link from 'next/link';
import { Search, Menu, User, Film } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#050505]/90 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="px-10 h-[70px] flex items-center justify-between">
        <div className="flex items-center gap-[30px]">
          <Link href="/" className="flex items-center text-[#E50914] font-extrabold text-[24px] tracking-[-1px] uppercase">
            <span>CineStream</span>
          </Link>
          <nav className="hidden md:flex items-center gap-[30px] text-[14px] font-medium text-[#999999]">
            <Link href="/" className="hover:text-white transition-colors active:text-white">Home</Link>
            <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/tv-shows" className="hover:text-white transition-colors">TV Shows</Link>
            <Link href="/movies?filter=latest" className="hover:text-white transition-colors">Latest</Link>
            <Link href="/genres" className="hover:text-white transition-colors">Genres</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Search for movies, series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 border border-white/20 text-[#999999] text-[13px] rounded-[4px] pl-10 pr-[15px] py-[8px] focus:outline-none focus:border-white/40 w-[250px] transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" size={16} />
          </form>
          <button className="sm:hidden text-[#999999] hover:text-white">
            <Search size={20} />
          </button>
          <button className="text-[#999999] hover:text-white">
            <User size={20} />
          </button>
          <button className="md:hidden text-[#999999] hover:text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
