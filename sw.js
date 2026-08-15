/* Journeys SW – network first, never break navigation */
const VERSION = '20260815f';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Only handle same-origin requests
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => res)
      .catch(() => {
        // Offline fallback: try cache, else let browser show error (don't invent 404)
        return caches.match(req).then((c) => c || Response.error());
      })
  );
});
