const CACHE_NAME = "v1";
const ASSETS = ["/", "/icon-512.png"];

// ✅ Install and pre-cache known assets
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// ✅ Activate immediately on update
self.addEventListener("activate", (e) => {
  e.waitUntil(
    self.clients.claim().then(() => {
      // Notify all clients that a new version is available
      return self.clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "SW_UPDATED" });
        });
      });
    }),
  );
});

// ✅ Fetch handler
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(staleWhileRevalidate(e.request));
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((fresh) => {
      if (fresh.ok) {
        cache.put(request, fresh.clone());
        notifyUpdate(request, cached, fresh);
      }
      return fresh;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

async function notifyUpdate(request, cached, fresh) {
  const url = new URL(request.url);
  const isHTML = url.origin === location.origin && (url.pathname === "/" || !url.pathname.includes(".") || url.pathname.endsWith(".html"));

  if (fresh.ok && isHTML && cached) {
    const newText = await fresh.clone().text();
    const oldText = await cached.clone().text();

    if (newText !== oldText) {
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clientsList) client.navigate(client.url);
    }
  }
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
