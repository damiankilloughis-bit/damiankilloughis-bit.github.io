const CACHE = "drill-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./assets/index-Ceaare5S.js",
  "./assets/index-DYLMr-12.css",
  "./assets/manifest-BF8Q1H_D.webmanifest",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icon-180.png",
  "./icon-192.png",
  "./voice/a-done.mp3",
  "./voice/a-m1-next.mp3",
  "./voice/a-m1.mp3",
  "./voice/a-m2.mp3",
  "./voice/a-m3.mp3",
  "./voice/a-m4.mp3",
  "./voice/a-next.mp3",
  "./voice/a-place-2.mp3",
  "./voice/b-done.mp3",
  "./voice/b-m1.mp3",
  "./voice/b-m2.mp3",
  "./voice/b-m3.mp3",
  "./voice/b-m4.mp3",
  "./voice/paused.mp3",
  "./voice/resume.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && event.request.method === "GET") {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
