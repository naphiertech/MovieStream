# 02 API & Server Boundaries

## 1. Scope & Edge Endpoints
All API endpoints execute as Next.js 15 Route Handlers optimized for Cloudflare Workers edge runtime:

* `GET /api/stream/movie/[id]`: Resolves playback URL, adaptive qualities, and subtitles for a movie.
* `GET /api/stream/tv/[id]/[season]/[episode]`: Resolves stream data for a specific television episode.
* `GET /api/search?q={query}&page={page}`: Catalog search proxying TMDB with query sanitization.
* `GET /api/movies/[id]`: Fetches full movie metadata, recommendations, and trailers.
* `GET /api/tv/[id]`: Fetches TV series metadata, seasons array, and cast.
* `GET /api/tv/[id]/season/[seasonNumber]`: Fetches episode list and stills for a season.

---

## 2. Invariants & Caching Contracts

1. **Parameter Sanitization**:
   * Numeric IDs (TMDB ID, Season, Episode) must be strictly validated against `/^\d+$/` before triggering upstream provider requests:
     ```ts
     if (!sanitizedId || !/^\d+$/.test(sanitizedId)) {
       return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
     }
     ```
2. **Multi-Tier Edge Cache Headers**:
   * Stream resolution routes return standardized edge CDN cache directives:
     ```ts
     headers: {
       'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
       'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
       'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
     }
     ```
3. **Upstream Failure Grace**:
   * When an upstream stream provider returns 404/500, the API returns clean `{ error: string }` JSON with HTTP 404/502—never leaking raw HTML stack traces or upstream API keys.
