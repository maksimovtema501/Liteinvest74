/* Service worker «Лингво».
   Заниматься надо и в метро без связи, поэтому оболочка, словарь и курс
   кэшируются целиком; прогресс и так лежит в localStorage. */
const CACHE = "lingvo-v11";
const SHELL = [
  "./",
  "./index.html",
  "./words.js",
  "./words-ext.js",
  "./course.js",
  "./topics.js",
  "./reading.js",
  "./books.js",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Навигация: мгновенно отдаём кэш, параллельно тянем свежую версию —
  // следующий запуск покажет обновление.
  if (req.mode === "navigate") {
    e.respondWith(
      caches.match("./index.html").then(hit => {
        const fresh = fetch("./index.html", { cache: "no-cache" }).then(res => {
          if (res && res.ok) caches.open(CACHE).then(c => c.put("./index.html", res.clone()));
          return res;
        });
        if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
        return fresh.catch(() => caches.match("./"));
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok && new URL(req.url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
