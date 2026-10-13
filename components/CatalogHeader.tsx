import Image from 'next/image';
import { Movie, PLACEHOLDERS } from '@/lib/tmdb';

interface CatalogHeaderProps {
  title: string;
  subtitle: string;
  backdropItems: Movie[];
}

export function CatalogHeader({
  title,
  subtitle,
  backdropItems,
}: CatalogHeaderProps) {
  const wallPosters = backdropItems.slice(0, 12);

  return (
    <section className="relative w-full overflow-hidden pt-28 pb-8 md:pt-36 md:pb-12 border-b border-white/[0.04]">
      {/* Atmospheric Tilted Poster Collage Background */}
      {wallPosters.length > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-16 -right-12 w-[78%] md:w-[68%] h-[160%] -rotate-12 opacity-35 md:opacity-45">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {wallPosters.map((item, idx) => {
                const src =
                  item.posterUrl || item.bannerUrl || PLACEHOLDERS.POSTER;
                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="180px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      unoptimized={!src.startsWith('http')}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Directional Vignettes to Blend Collage into Deep Black */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/80" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
        </div>
      )}

      {/* Title Content */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-5 md:px-12 lg:px-16">
        <div className="flex items-stretch gap-4">
          <div className="w-[3px] rounded-full bg-sage-500 shadow-[0_0_12px_rgba(132,169,140,0.6)] flex-shrink-0 my-1" />
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-white tracking-tight leading-none">
              {title}
            </h1>
            <p className="text-xs sm:text-[13.5px] text-white/55 mt-2 font-normal tracking-normal">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
