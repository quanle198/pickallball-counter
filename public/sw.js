event.waitUntil(
  caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Cache opened');
      return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
    })
    .catch(error => {
      console.error('Cache failed:', error);
    })
);
self.skipWaiting();

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          // Check if cache is stale (older than 1 hour for API calls)
          const cacheTime = response.headers.get('cache-time');
          if (cacheTime && Date.now() - parseInt(cacheTime) > 3600000) {
            // Cache is stale, fetch new version
            return fetchAndCache(event.request);
          }
          return response;
        }

        // Not in cache, fetch from network
        return fetchAndCache(event.request);
      })
      .catch(() => {
        // Network failed, try to serve offline page
        if (event.request.destination === 'document') {
          return caches.match('/');
        }

        // For other resources, return offline indicator
        if (event.request.destination === 'image') {
          return new Response('', { status: 204 });
        }
      })
  );
});

function fetchAndCache(request) {
  return fetch(request).then(response => {
    // Check if valid response
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    // Clone response to cache
    const responseToCache = response.clone();

    caches.open(CACHE_NAME)
      .then(cache => {
        // Add cache timestamp for API responses
        if (request.url.includes('api') || request.url.includes('firebase')) {
          const headers = new Headers(responseToCache.headers);
          headers.set('cache-time', Date.now().toString());
          const cachedResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers
          });
          cache.put(request, cachedResponse);
        } else {
          cache.put(request, responseToCache);
        }
      });

    return response;
  });
}

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-places') {
    event.waitUntil(syncOfflinePlaces());
  }
});

async function syncOfflinePlaces() {
  try {
    // Get pending places from IndexedDB
    const pendingPlaces = await getPendingPlaces();

    for (const place of pendingPlaces) {
      try {
        // Try to sync with Firebase
        await syncPlaceToFirebase(place);
        // Remove from pending if successful
        await removePendingPlace(place.id);
      } catch (error) {
        console.error('Failed to sync place:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB operations for offline data
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WhereToGoOfflineDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingPlaces')) {
        db.createObjectStore('pendingPlaces', { keyPath: 'id' });
      }
    };
  });
}

async function getPendingPlaces() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingPlaces'], 'readonly');
    const store = transaction.objectStore('pendingPlaces');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function removePendingPlace(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingPlaces'], 'readwrite');
    const store = transaction.objectStore('pendingPlaces');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function syncPlaceToFirebase(place) {
  // This would normally make an API call to Firebase
  const response = await fetch('/api/places', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(place)
  });

  if (!response.ok) {
    throw new Error('Failed to sync place');
  }

  return response.json();
}

// Push notification handling
self.addEventListener('push', event => {
  let notificationData = {
    title: 'Where To Go',
    body: 'Có địa điểm mới được thêm!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'new-place'
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/'
    },
    actions: [
      {
        action: 'explore',
        title: 'Xem ngay',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Đóng',
        icon: '/icons/close-icon.png'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Check if app is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If not open, open new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  // Sync content in background
  console.log('Periodic background sync triggered');
  // This could sync places data, check for updates, etc.
}

// Error handling
self.addEventListener('error', event => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('Service Worker loaded successfully');