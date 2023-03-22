const cacheName = 'simple-counter-cache-v1';
const assetsToCache = [
  '/simple-counter',
  '/simple-counter/index.html',
  '/simple-counter/styles.css',
  '/simple-counter/script.js',
  'simple-counter/manifest.json',
  // Add the paths to your app's icons here
  '/simple-counter/icon-192x192.png',
  '/simple-counter/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});