import Link from 'next/link';
import { getGenres, Genre } from '@/lib/tmdb';
import { 
  Swords, 
  Compass, 
  Sparkles, 
  Laugh, 
  Fingerprint, 
  Camera, 
  Tv, 
  Users, 
  Wand2, 
  Hourglass, 
  Ghost, 
  Music, 
  HelpCircle, 
  Heart, 
  Atom, 
  Flame, 
  Bomb, 
  Sunset,
  ArrowRight,
  Film
} from 'lucide-react';

const GENRE_DETAILS: Record<string, { icon: any, description: string, colorClass: string, bgGlow: string }> = {
  "Action": {
    icon: Swords,
    description: "High-octane excitement, intense battles, and stunts.",
    colorClass: "text-sage-300 group-hover:text-sage-200",
    bgGlow: "from-sage-500/10 via-sage-500/5 to-transparent"
  },
  "Adventure": {
    icon: Compass,
    description: "Epic journeys, survival quests, and new horizons.",
    colorClass: "text-blue-400 group-hover:text-blue-300",
    bgGlow: "from-blue-500/10 via-blue-500/5 to-transparent"
  },
  "Animation": {
    icon: Sparkles,
    description: "Breathtaking artistry and digital masterpieces.",
    colorClass: "text-pink-400 group-hover:text-pink-300",
    bgGlow: "from-pink-500/10 via-pink-500/5 to-transparent"
  },
  "Comedy": {
    icon: Laugh,
    description: "Witty humor, slapstick, and lighthearted tales.",
    colorClass: "text-yellow-400 group-hover:text-yellow-300",
    bgGlow: "from-yellow-500/10 via-yellow-500/5 to-transparent"
  },
  "Crime": {
    icon: Fingerprint,
    description: "Underworld operations, investigations, and mystery.",
    colorClass: "text-zinc-400 group-hover:text-zinc-300",
    bgGlow: "from-zinc-500/10 via-zinc-500/5 to-transparent"
  },
  "Documentary": {
    icon: Camera,
    description: "Real-world accounts, nature, and cultural reports.",
    colorClass: "text-emerald-400 group-hover:text-emerald-300",
    bgGlow: "from-emerald-500/10 via-emerald-500/5 to-transparent"
  },
  "Drama": {
    icon: Film, // Fallback for Drama to keep it safe and professional
    description: "Character-driven plots, relationships, and deep emotion.",
    colorClass: "text-indigo-400 group-hover:text-indigo-300",
    bgGlow: "from-indigo-500/10 via-indigo-500/5 to-transparent"
  },
  "Family": {
    icon: Users,
    description: "Wholesome entertainment suitable for all ages.",
    colorClass: "text-teal-400 group-hover:text-teal-300",
    bgGlow: "from-teal-500/10 via-teal-500/5 to-transparent"
  },
  "Fantasy": {
    icon: Wand2,
    description: "Magical lands, mythical legends, and wizardry.",
    colorClass: "text-purple-400 group-hover:text-purple-300",
    bgGlow: "from-purple-500/10 via-purple-500/5 to-transparent"
  },
  "History": {
    icon: Hourglass,
    description: "Faithful retellings of pivotal historical milestones.",
    colorClass: "text-amber-500 group-hover:text-amber-400",
    bgGlow: "from-amber-500/10 via-amber-500/5 to-transparent"
  },
  "Horror": {
    icon: Ghost,
    description: "Creepy encounters, jumpscares, and dark forces.",
    colorClass: "text-sage-400 group-hover:text-sage-300",
    bgGlow: "from-sage-600/10 via-sage-600/5 to-transparent"
  },
  "Music": {
    icon: Music,
    description: "Melodic blockbusters, rhythm-focused stories, and concerts.",
    colorClass: "text-rose-400 group-hover:text-rose-300",
    bgGlow: "from-rose-500/10 via-rose-500/5 to-transparent"
  },
  "Mystery": {
    icon: HelpCircle,
    description: "Suspenseful whodunits and puzzling conspiracies.",
    colorClass: "text-cyan-300 group-hover:text-cyan-200",
    bgGlow: "from-cyan-500/10 via-cyan-500/5 to-transparent"
  },
  "Romance": {
    icon: Heart,
    description: "Love stories, emotional journeys, and heartwarmers.",
    colorClass: "text-rose-400 group-hover:text-rose-300",
    bgGlow: "from-rose-500/10 via-rose-500/5 to-transparent"
  },
  "Science Fiction": {
    icon: Atom,
    description: "Interstellar travel, advanced sciences, and dystopias.",
    colorClass: "text-cyan-400 group-hover:text-cyan-300",
    bgGlow: "from-cyan-500/10 via-cyan-500/5 to-transparent"
  },
  "Sci-Fi": {
    icon: Atom,
    description: "Interstellar travel, advanced sciences, and dystopias.",
    colorClass: "text-cyan-400 group-hover:text-cyan-300",
    bgGlow: "from-cyan-500/10 via-cyan-500/5 to-transparent"
  },
  "TV Movie": {
    icon: Tv,
    description: "Feature-length productions broadcast first on television.",
    colorClass: "text-sky-400 group-hover:text-sky-300",
    bgGlow: "from-sky-500/10 via-sky-500/5 to-transparent"
  },
  "Thriller": {
    icon: Flame,
    description: "Suspenseful action, mind-games, and tension.",
    colorClass: "text-orange-400 group-hover:text-orange-300",
    bgGlow: "from-orange-500/10 via-orange-500/5 to-transparent"
  },
  "War": {
    icon: Bomb,
    description: "Military operations, battlefront chronicles, and brotherhood.",
    colorClass: "text-stone-400 group-hover:text-stone-300",
    bgGlow: "from-stone-500/10 via-stone-500/5 to-transparent"
  },
  "Western": {
    icon: Sunset,
    description: "Gunslinger duels and frontier justice under the sun.",
    colorClass: "text-amber-500 group-hover:text-amber-400",
    bgGlow: "from-amber-600/10 via-amber-600/5 to-transparent"
  }
};

const DEFAULT_DETAIL = {
  icon: Film,
  description: "Browse curated premium titles under this category.",
  colorClass: "text-sage-400 group-hover:text-sage-300",
  bgGlow: "from-sage-600/10 via-sage-600/5 to-transparent"
};

export const revalidate = 3600;

export default async function GenresIndexPage() {
  const genres = await getGenres();
  
  return (
    <div className="min-h-screen bg-[#060606] relative overflow-hidden">
      
      {/* Decorative Radial Accents for Depth (Desktop Only) */}
      <div className="hidden md:block absolute top-0 left-1/4 w-[500px] h-[500px] bg-sage-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-14 lg:px-20 pt-36 pb-24 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 text-sage-400 mb-3">
            <div className="w-8 h-[2px] bg-sage-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[3px] font-outfit">Category Hub</span>
          </div>
          <h1 className="text-[34px] md:text-[54px] font-black text-white leading-[0.95] tracking-tight uppercase italic mb-5">
            Browse By <span className="text-sage-400 drop-shadow-[0_0_25px_rgba(132, 169, 140,0.25)]">Genres</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base leading-relaxed font-medium">
            Select a cinematic sector to discover premium movies, trending releases, and top-rated series matching your preferences.
          </p>
        </div>
        
        {/* Premium Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {genres.map((genre: Genre) => {
            const detail = GENRE_DETAILS[genre.name] || DEFAULT_DETAIL;
            const Icon = detail.icon;
            
            return (
              <Link 
                key={genre.id} 
                href={`/genres/${encodeURIComponent(genre.name)}`}
                className="group relative flex flex-col justify-between h-[220px] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-sage-600/30 rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-2xl overflow-hidden cursor-pointer"
              >
                {/* Custom Gradient Radial Glow */}
                <div className={`absolute -inset-px bg-gradient-to-br ${detail.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]`} />
                
                {/* Card Top: Icon & Arrow */}
                <div className="flex items-start justify-between relative z-10">
                  <div className={`p-4 rounded-2.5xl bg-white/5 border border-white/5 ${detail.colorClass} transition-colors duration-300 shadow-inner`}>
                    <Icon size={24} strokeWidth={2} className="transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/30 group-hover:text-sage-400 group-hover:border-sage-600/20 transition-all duration-300">
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
                
                {/* Card Bottom: Text Details */}
                <div className="relative z-10 mt-4">
                  <h2 className="text-lg font-black text-white group-hover:text-sage-400 transition-colors duration-300 uppercase tracking-wider font-outfit mb-1">
                    {genre.name}
                  </h2>
                  <p className="text-[11px] text-white/45 group-hover:text-white/60 transition-colors duration-300 line-clamp-2 leading-relaxed">
                    {detail.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
