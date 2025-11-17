const CACHE_NAME = "v1";
const ASSETS = ["/", "/media/icon-512.png"];

// ✅ Install and pre-cache known assets
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// ✅ Activate immediately on update
self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

// ✅ Fetch handler
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;

  // Detect "HTML-like" routes: root, clean URLs, or .html
  const isHTML = url.origin === location.origin && (url.pathname === "/" || !url.pathname.includes(".") || url.pathname.endsWith(".html"));

  if (isHTML) {
    e.respondWith(staleWhileRevalidateAndReload(e.request));
  } else {
    e.respondWith(cacheFirst(e.request));
  }
});

// 🧩 Cache First for static assets (auto-cache)
async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  const response = await fetch(req);
  const cache = await caches.open(CACHE_NAME);
  cache.put(req, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_STATIC);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    cache.put(request, response.clone());
    return response;
  });

  return cached || fetchPromise;
}

// 🧩 Stale-While-Revalidate with auto-reload + auto-cache
async function staleWhileRevalidateAndReload(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);

  const networkFetch = fetch(req).then(async (res) => {
    if (res.ok) {
      // 🔥 compare HTML to detect new version
      const newText = await res.clone().text();
      const oldText = cached ? await cached.clone().text() : null;

      if (oldText && newText !== oldText) {
        // New version detected → reload all open tabs
        const clientsList = await self.clients.matchAll({ type: "window" });
        for (const client of clientsList) client.navigate(client.url);
      }
      cache.put(req, res.clone());
    }
    return res;
  });
  return cached || networkFetch;
}

/* NOTIFICATIONS */
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(self.registration.showNotification(data.title, data.options));
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data?.url || "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
