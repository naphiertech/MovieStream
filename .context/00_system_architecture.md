# 00 System Architecture & Manifest

## 1. Project Profile
* **Archetype**: FULL-STACK APPLICATION (Next.js 15 App Router + Edge Route Handlers)
* **Lifecycle Phase**: MATURE / BROWNFIELD (Established Architecture)
* **Active Source Files**: 72 source files
* **Framework**: Next.js 15.4.9 (React 19.2.1, TypeScript 5.9.3)
* **Styling**: Tailwind CSS v4.1.11 with CSS-first `@theme` configuration
* **Edge Target**: Cloudflare Workers via `@opennextjs/cloudflare` + `wrangler`
* **Data Sources**: The Movie Database (TMDB v3 API) & Dynamic Streaming Providers (VidLink API)

---

## 2. Directory Layout & Module Inventory

* `/app`: Next.js 15 App Router tree:
  * `/app/page.tsx`: Streaming landing view with featured hero trailer & curated carousel rows.
  * `/app/movies/page.tsx` & `/app/tv-shows/page.tsx`: Catalog browse with dynamic filtering.
  * `/app/movie/[id]/page.tsx` & `/app/tv/[id]/page.tsx`: Detailed metadata, cast, related titles, and seasons/episodes picker.
  * `/app/watch/[type]/[id]/page.tsx`: Dedicated full-viewport cinematic player interface.
  * `/app/search/page.tsx` & `/app/trending/page.tsx`: Real-time catalog search and trending feeds.
  * `/app/api`: Edge route handlers (`/api/stream/movie/[id]`, `/api/stream/tv/[id]/[season]/[episode]`, `/api/search`, `/api/movies/[id]`, `/api/tv/[id]`).
  * `/app/manifest.ts` & `/public/sw.js`: Progressive Web App (PWA) manifest and caching service worker.
* `/components`: 25 modular UI components:
  * `CustomPlayer.tsx`: HLS video player with custom controls, buffer tracking, and caption selector.
  * `SecurityGuard.tsx`: Viewport-clamped custom context menu intercepting right-click / devtools inspection.
  * `CinematicBackground.tsx`: Ambient blurred backdrop responsive to featured media art.
  * `CarouselRow.tsx`, `FeaturedPosterStrip.tsx`, `ActorList.tsx`: Media catalog carousels.
* `/lib`: Core infrastructural services:
  * `tmdb.ts`: Direct TMDB API client with ISR revalidation and image CDN URL formatters.
  * `providers/stream.ts`: Provider abstraction (`StreamProviderManager`, `StreamResolver`, `PlaybackMetadata`).
  * `orientation.ts`: Fullscreen orientation lock & screen rotation utilities.
  * `utils.ts`: Tailwind CSS class merge (`clsx` + `tailwind-merge`).

---

## 3. Dynamic Contract Index

* [`01_design_tokens.md`](01_design_tokens.md): Tailwind CSS v4 tokens, sage palette, typography, and mobile zero-animation rule.
* [`02_api_and_server_boundaries.md`](02_api_and_server_boundaries.md): Edge route handlers, CDN caching contracts, parameter sanitation.
* [`03_media_player_and_streaming.md`](03_media_player_and_streaming.md): HLS playback pipeline, quality ladder, stream resolver, and anti-tamper guards.
* [`04_tmdb_integration_and_api.md`](04_tmdb_integration_and_api.md): TMDB endpoints, genre mappings, image CDN URLs, and Next.js ISR.
* [`99_icm_execution_protocol.md`](99_icm_execution_protocol.md): Verification pipeline, worker compile, and surgical diff rules.
