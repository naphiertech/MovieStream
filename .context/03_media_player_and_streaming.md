# 03 Media Player & Streaming Architecture

## 1. Engine & Subsystem Architecture
* **Primary Component**: [`components/CustomPlayer.tsx`](../components/CustomPlayer.tsx)
* **Provider Layer**: [`lib/providers/stream.ts`](../lib/providers/stream.ts)
* **Anti-Tamper Layer**: [`components/SecurityGuard.tsx`](../components/SecurityGuard.tsx)
* **Core Stream Technology**: `Hls.js` (HTTP Live Streaming) + Native HTML5 Video fallback.

---

## 2. Stream Resolution Pipeline (`StreamProviderManager` & `StreamResolver`)

1. **Provider Normalization**:
   * Upstream providers (e.g. VidLink) output polymorphic payloads.
   * `StreamResolver.normalize()` guarantees output adheres to:
     ```ts
     export interface PlaybackMetadata {
       videoUrl: string;                     // Primary HLS or MP4 stream
       qualities: Record<string, string>;    // { "1080p": url, "720p": url, ... }
       captions: StreamCaption[];            // { label: string, language: string, url: string }[]
       providerId: string;
     }
     ```
2. **HLS Initialization Invariants**:
   * If `Hls.isSupported()`: Instantiates `new Hls({ enableWorker: true, lowLatencyMode: false, backBufferLength: 90 })`.
   * Attaches to `<video>` ref and listens to `Hls.Events.MANIFEST_PARSED` before calling `.play()`.
   * On Apple Safari / iOS: Falls back directly to native HLS playback (`video.canPlayType('application/vnd.apple.mpegurl')`).

---

## 3. Player UI & Interaction Invariants
* **Adaptive Bitrate (ABR)**: Users can switch qualities manually or leave on `"Auto"` managed by HLS.js bandwidth estimations.
* **Orientation Locking**: [`lib/orientation.ts`](../lib/orientation.ts) locks to landscape orientation on full-screen playback on supported mobile devices.
* **Auto-Hiding Controls**: Player controls fade out after 2.5 seconds of mouse/touch inactivity during active playback.
* **Security & Anti-Tamper (`SecurityGuard.tsx`)**:
  * Intercepts `contextmenu` (right click) inside the app viewport to prevent video URL copying and browser inspect element.
  * Clamps custom context menu coordinates within viewport boundaries (`x <= window.innerWidth - 232`).
