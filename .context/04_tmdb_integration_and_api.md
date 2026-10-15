# 04 TMDB Integration & Metadata Architecture

## 1. Client Architecture
* **Source**: [`lib/tmdb.ts`](../lib/tmdb.ts)
* **Base URL**: `https://api.themoviedb.org/3`
* **Image CDN Base**: `https://image.tmdb.org/t/p`
* **Authentication**: Bearer token via `process.env.TMDB_ACCESS_TOKEN`.

---

## 2. Invariants & Caching Pipeline

1. **Incremental Static Regeneration (ISR)**:
   * Next.js `fetch` requests inside `fetchTMDB` enforce standard revalidation windows:
     * Catalog feeds & Trending: `revalidate: 3600` (1 hour).
     * Detail pages: `revalidate: 86400` (24 hours).
2. **Fallback Placeholders**:
   * If poster or backdrop is missing in TMDB response, `tmdb.ts` falls back to predefined dark placeholders:
     * `POSTER`: `https://placehold.co/500x750/060606/white?text=No+Poster`
     * `BANNER`: `https://placehold.co/1920x1080/060606/white?text=No+Preview`
3. **Genre Code Map**:
   * Standard numerical genre IDs (`28` for Action, `12` for Adventure, `878` for Sci-Fi, etc.) are statically mapped in `GENRE_MAP` to avoid redundant API lookups.
4. **Image Sizing Rules**:
   * Hero Banners: `original` or `w1280`.
   * Catalog Cards: `w500`.
   * Actor Avatars: `w185`.
