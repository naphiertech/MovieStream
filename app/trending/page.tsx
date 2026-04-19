import { 
  getTrendingMovies, 
  getTrendingTV, 
  getTrendingAll, 
  getMoviesByGenre, 
  getTVByGenre,
  Movie,
  TVShow
} from '@/lib/tmdb';
import { MovieRow } from '@/components/MovieRow';
import { RankedMovieCard } from '@/components/RankedMovieCard';
import * as motion from 'framer-motion/client';
import { Variants } from 'framer-motion';
import { Sparkles, TrendingUp, MonitorPlay, Clapperboard, Flame } from 'lucide-react';

export default async function TrendingPage() {
  const [
    trendingAll,
    trendingMovies,
    trendingTV,
    actionMovies,
    animationTV
  ] = await Promise.all([
    getTrendingAll(),
    getTrendingMovies(),
    getTrendingTV(),
    getMoviesByGenre('28'), // Action
    getTVByGenre('16')      // Animation
  ]);

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2dd4bf]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0ed2f7]/5 blur-[120px] rounded-full" />
      
      <div className="px-6 md:px-14 lg:px-20 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 mb-6 backdrop-blur-xl">
            <Flame size={14} className="text-[#2dd4bf]" />
            <span className="text-[10px] font-black uppercase tracking-[3px] text-[#2dd4bf]">Live Analytics</span>
          </div>
          
          <h1 className="text-[48px] md:text-[72px] font-black text-white leading-[0.9] tracking-tighter uppercase italic mb-6">
            TRENDING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-[#0ed2f7]">SPOTLIGHT</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Track the world&apos;s most watched cinematic titles in real-time. Powered by the TMDB Live Data Engine, presenting the most influential blockbusters and viral series at this very moment.
          </p>
        </motion.div>

        {/* Top 10 Ranked Board */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[24px] font-black text-white uppercase tracking-[1px] flex items-center gap-3">
              <span className="w-2 h-7 bg-gradient-to-b from-[#2dd4bf] to-[#0ed2f7] rounded-full shadow-[0_0_15px_rgba(45,212,191,0.4)]" />
              Universal Top 10
            </h2>
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-[2px]">Last 24 Hours</div>
          </div>
          
          <div className="flex gap-[10px] overflow-x-auto pb-10 custom-scrollbar scroll-smooth">
            {trendingAll.slice(0, 10).map((item: Movie, index: number) => (
              <div key={item.id} className="flex-shrink-0 w-[240px]">
                <RankedMovieCard movie={item} index={index} />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Media Specific Rows */}
        <div className="flex flex-col gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center gap-2 mb-4">
              <Clapperboard className="text-[#2dd4bf]" size={18} />
              <h3 className="text-white font-black uppercase tracking-widest text-[12px]">Cinema Hits</h3>
            </div>
            <MovieRow title="Trending Movies" movies={trendingMovies.slice(0, 12)} />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center gap-2 mb-4">
              <MonitorPlay className="text-[#0ed2f7]" size={18} />
              <h3 className="text-white font-black uppercase tracking-widest text-[12px]">Binge Worthy</h3>
            </div>
            <MovieRow title="Popular TV Series" movies={trendingTV.slice(0, 12)} />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <MovieRow title="Rising in Action" movies={actionMovies.slice(0, 6)} viewAllLink="/genres/Action" />
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <MovieRow title="Anime Spotlight" movies={animationTV.slice(0, 6)} viewAllLink="/genres/Animation" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
    </main>
  );
}
