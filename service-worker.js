const CACHE_NAME = "deutschapp-cache-v1";
const urlsToCache = [
  "/Language-Solutions/",
  "/Language-Solutions/index.html",
  "/Language-Solutions/app.js",
  "/Language-Solutions/style.css",
  "/Language-Solutions/manifest.json",
  "/Language-Solutions/icons/icon-192.png",
  "/Language-Solutions/icons/icon-512.png"
];

// Instalación
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activación
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});