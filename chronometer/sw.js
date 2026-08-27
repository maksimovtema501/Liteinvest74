/* Service worker «Хронометра».
   Приложение обязано работать без сети (лес, мороз, нет связи),
   поэтому оболочка кэшируется целиком и отдаётся из кэша. */
const CACHE = "hronometr-v8";
const SHELL = [
  "./",
  "./index.html",
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

  // Навигация: мгновенно отдаём кэш, параллельно тянем свежую версию и кладём
  // в кэш — следующий запуск покажет обновление. Без этого установленное
  // приложение осталось бы на старой версии навсегда.
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
      if (hit) {
        // фоновое обновление кэша, если сеть есть
        fetch(req).then(res => {
          if (res && res.ok && new URL(req.url).origin === self.location.origin) {
            caches.open(CACHE).then(c => c.put(req, res.clone()));
          }
        }).catch(() => {});
        return hit;
      }
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
