const CACHE_NAME = 'moviestream-pro-v3';

// Only precache immutable static PWA manifest and icon assets
const PRECACHE_ASSETS = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/screenshots/mobile.png',
  '/screenshots/desktop.png',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Do not intercept or cache HTML documents, Next.js chunks, API routes, or media
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/movie/') ||
    url.pathname.startsWith('/tv/') ||
    url.pathname.startsWith('/watch/') ||
    url.pathname.startsWith('/genres') ||
    url.pathname.startsWith('/movies') ||
    url.pathname.startsWith('/tv-shows') ||
    url.pathname.startsWith('/trending') ||
    url.pathname.startsWith('/search') ||
    url.pathname === '/'
  ) {
    return;
  }

  // Only handle precached static PWA assets (Cache-First strategy)
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/screenshots/') ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/icon.svg'
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});

