const CACHE_NAME = "aru-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/projects.html",
  "/internships.html",
  "/books.html",
  "/skills.html",
  "/habits.html",
  "/lib.html",
  "/style.css",
  "/projects-style.css",
  "/internships.css",
  "/books.css",
  "/skills.css",
  "/habits.css",
  "/app.js",
  "/projects.js",
  "/internships.js",
  "/books.js",
  "/skills.js",
  "/habits.js",
  "/manifest.json",
];

// Install Event: Caching Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Aru: Caching shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
});

// Activate Event: Cleaning up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
    }),
  );
});

// Fetch Event: Offline First Strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});
