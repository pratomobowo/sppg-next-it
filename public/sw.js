const CACHE_NAME = 'sppg-mbg-v1';
const PRECACHE_ASSETS = [
  '/',
  '/favicon.ico',
  '/favicon-96x96.png',
  '/site.webmanifest',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/apple-touch-icon.png'
];

// Install Event: Pre-cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching App Shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Force the waiting service worker to become active
      return self.skipWaiting();
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients immediately so active SW takes control
      return self.clients.claim();
    })
  );
});

// Fetch Event: Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests, chrome extensions, etc.
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Static Assets (CSS, JS, Fonts, Images) -> Cache First
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.includes('/images/') ||
    url.pathname.includes('/avatars/') ||
    PRECACHE_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch updated version in the background (stale-while-revalidate style for hashed assets)
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {/* ignore background fetch errors */});
          return cachedResponse;
        }

        // Cache miss -> Fetch and Cache
        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        }).catch((err) => {
          console.error('[Service Worker] Fetch failed for static asset:', err);
        });
      })
    );
    return;
  }

  // 2. Navigation Requests (HTML / Page Navigation) -> Network First with App Shell Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        console.log('[Service Worker] Navigation failed, serving App Shell from cache');
        return caches.match('/');
      })
    );
    return;
  }

  // 3. API Requests or other files -> Network First, fallback to Cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache valid GET responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        console.log('[Service Worker] Fetch failed, checking cache for API/Resource:', request.url);
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Custom JSON offline response for APIs
          if (request.headers.get('accept')?.includes('application/json')) {
            return new Response(
              JSON.stringify({ error: 'Anda sedang offline. Data akan disinkronkan saat terhubung kembali.' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          }
          // General offline response
          return new Response('Koneksi terputus. Silakan periksa jaringan Anda.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      })
  );
});
