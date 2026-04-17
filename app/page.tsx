import { HeroSection } from '@/components/HeroSection';
import { MovieRow } from '@/components/MovieRow';
import { RankedMovieCard } from '@/components/RankedMovieCard';
import { WatchHistory } from '@/components/WatchHistory';
import { 
  getTrendingMovies, 
  getUpcomingMovies, 
  getTopRatedMovies, 
  getMoviesByGenre, 
  Movie, 
  getTrendingMediaWithLogos,
  getPopularTV,
  getTopRatedTV
} from '@/lib/tmdb';
import * as motion from 'framer-motion/client';
import { Variants } from 'framer-motion';

export default async function Home() {
  const [
    heroMedia,
    trendingMovies,
    topRatedMovies,
    popularTV,
    topRatedTV,
    upcomingMovies,
    actionMovies,
    sciFiMovies
  ] = await Promise.all([
    getTrendingMediaWithLogos('all', 6), // 6 items for the mixed hero
    getTrendingMovies(),
    getTopRatedMovies(),
    getPopularTV(),
    getTopRatedTV(),
    getUpcomingMovies(),
    getMoviesByGenre('28'),
    getMoviesByGenre('878')
  ]);

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="pb-20">
      <HeroSection movies={heroMedia} />
      
      <div className="relative z-20">
        {/* Watch History Section (Client Side) */}
        <WatchHistory />

        {/* Top 10 Ranked Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="pt-[40px] pb-[60px] px-6 md:px-14 lg:px-20 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] font-black text-white uppercase tracking-[1px] flex items-center gap-3">
              <span className="w-2 h-7 bg-[#2dd4bf] rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
              Top 10 This Week
            </h2>
          </div>
          <div className="flex gap-[30px] overflow-x-auto pb-10 custom-scrollbar scroll-smooth">
            {trendingMovies.slice(0, 10).map((movie: Movie, index: number) => (
              <div key={movie.id} className="flex-shrink-0 w-[240px]">
                <RankedMovieCard movie={movie} index={index} />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Combined Media Rows */}
        <div className="px-6 md:px-14 lg:px-20 flex flex-col gap-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <MovieRow title="Popular TV Series" movies={popularTV} />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <MovieRow title="Latest Action Hits" movies={actionMovies} viewAllLink="/genres/Action" />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <MovieRow title="Acclaimed Series" movies={topRatedTV} />
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <MovieRow title="Trending Sci-Fi" movies={sciFiMovies} viewAllLink="/genres/Sci-Fi" />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <MovieRow title="Top Rated Classics" movies={topRatedMovies} viewAllLink="/movies?filter=top" />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <MovieRow title="Coming Soon" movies={upcomingMovies} viewAllLink="/movies?filter=upcoming" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
