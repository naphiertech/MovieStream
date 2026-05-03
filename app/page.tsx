import { HeroSection } from '@/components/HeroSection';
import { CarouselRow } from '@/components/CarouselRow';
import { RankedCarousel } from '@/components/RankedCarousel';
import { WatchHistory } from '@/components/WatchHistory';
import { 
  getTrendingMovies, 
  getUpcomingMovies, 
  getTopRatedMovies, 
  getMoviesByGenre, 
  Movie, 
  getTrendingMediaWithLogos,
  getPopularTV,
  getTopRatedTV,
  getTrendingTV
} from '@/lib/tmdb';
import * as motion from 'framer-motion/client';
import { Variants } from 'framer-motion';

export default async function Home() {
  // Safe fetch wrapper to prevent whole page crash on one fetch failure
  const safeFetch = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
    try {
      return await promise;
    } catch (e) {
      console.error('Data fetch failed, using fallback:', e);
      return fallback;
    }
  };

  const [
    heroMedia,
    trendingMovies,
    trendingTV,
    topRatedMovies,
    topRatedTV,
    popularTV,
    upcomingMovies,
    actionMovies,
    sciFiMovies,
    comedyMovies
  ] = await Promise.all([
    safeFetch(getTrendingMediaWithLogos('all', 6), []),
    safeFetch(getTrendingMovies(), []),
    safeFetch(getTrendingTV(), []),
    safeFetch(getTopRatedMovies(), []),
    safeFetch(getTopRatedTV(), []),
    safeFetch(getPopularTV(), []),
    safeFetch(getUpcomingMovies(), []),
    safeFetch(getMoviesByGenre('28'), []),
    safeFetch(getMoviesByGenre('878'), []),
    safeFetch(getMoviesByGenre('35'), [])
  ]);

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="pb-20">
      <HeroSection movies={heroMedia} />
      
      <div className="relative z-20">
        {/* Watch History Section (Client Side) */}
        <WatchHistory />

        {/* Top 10 This Week - Enhanced with arrows */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <RankedCarousel title="Top 10 Today" movies={trendingMovies.slice(0, 10)} />
        </motion.div>

        {/* Trending Today - With Movies/Series Toggle */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <CarouselRow 
            title="Trending Today" 
            movies={trendingMovies} 
            altMovies={trendingTV}
            mainLabel="Movies"
            altLabel="Series"
          />
        </motion.div>

        {/* Popular TV Series */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <CarouselRow title="Popular TV Series" movies={popularTV} />
        </motion.div>

        {/* Top Rated - With Movies/Series Toggle */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <CarouselRow 
            title="Top Rated" 
            movies={topRatedMovies} 
            altMovies={topRatedTV}
            mainLabel="Movies"
            altLabel="Series"
          />
        </motion.div>

        {/* Action Hits */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <CarouselRow title="Latest Action Hits" movies={actionMovies} viewAllLink="/genres/Action" />
        </motion.div>

        {/* Sci-Fi */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <CarouselRow title="Trending Sci-Fi" movies={sciFiMovies} viewAllLink="/genres/Sci-Fi" />
        </motion.div>

        {/* Comedy */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <CarouselRow title="Comedy" movies={comedyMovies} viewAllLink="/genres/Comedy" />
        </motion.div>

        {/* Coming Soon */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <CarouselRow title="Coming Soon" movies={upcomingMovies} />
        </motion.div>
      </div>
    </div>
  );
}
