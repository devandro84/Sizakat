// Service Worker for SiZakat App
const CACHE_NAME = 'sizakat-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/LogoZakat.png',
  '/assets/index.css',
  '/assets/index.js',
  '/assets/Infaq-Sodakoh.png',
  '/assets/Panah.png',
  '/assets/kurban.png',
  '/assets/laporan-penerima.png',
  '/assets/umroh.png',
  '/assets/zakat-fitrah.png',
  '/assets/zakat-mal.png',
  '/assets/zakat-penghasilan.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event Handler
self.addEventListener('fetch', (event) => {
  // Skip handling for development server and HMR requests
  if (
    event.request.url.includes('localhost:') ||
    event.request.url.includes('127.0.0.1:') ||
    event.request.url.includes('/@vite/') ||
    event.request.url.includes('/@react-refresh') ||
    event.request.url.includes('hot-update') ||
    event.request.url.startsWith('chrome-extension:') // Skip chrome extension requests
  ) {
    return;
  }

  // Handle only GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip non-HTTP/HTTPS requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Don't cache if not a successful response
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone the response before caching
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                try {
                  // Skip caching for chrome-extension and other unsupported schemes
                  const requestUrl = new URL(event.request.url);
                  if (requestUrl.protocol !== 'chrome-extension:') {
                    cache.put(event.request, responseToCache);
                  }
                } catch (err) {
                  console.warn('Cache put error:', err);
                }
              })
              .catch((err) => {
                console.warn('Cache put error:', err);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.warn('Network fetch error:', error);
            // Return cached response if network fails
            return caches.match(event.request);
          });
      })
  );
});

// Handle offline data synchronization
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Implement data synchronization logic here
      console.log('Syncing data...')
    );
  }
});