// sw.js - Service Worker for offline support

const CACHE_NAME = 'thinzars-day-v6';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './hearts.js',
  './songs.js',
  './manifest.json',
  './icons/favicon.svg'
];

// Install: cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
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

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        // Cache successful responses (same-origin + font/icon CDN)
        const isCacheable = event.request.url.startsWith(self.location.origin)
          || event.request.url.includes('fonts.googleapis.com')
          || event.request.url.includes('fonts.gstatic.com')
          || event.request.url.includes('cdn.jsdelivr.net');
        if (response.ok && isCacheable) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    }).catch(() => {
      // If both cache and network fail, return the cached index for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
