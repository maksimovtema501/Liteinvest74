/* Service worker «Шахмат».
   Играть, решать задачи и разбирать партии можно без связи: оболочка,
   движок Stockfish, задачи и уроки кэшируются целиком. Онлайн-партии
   и ИИ-тренер ходят в сеть напрямую, мимо кэша. */
const CACHE = "chess-v2";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./js/ai.js",
  "./js/analysis.js",
  "./js/app.js",
  "./js/board.js",
  "./js/bots.js",
  "./js/chessutil.js",
  "./js/coach.js",
  "./js/engine.js",
  "./js/learn.js",
  "./js/lecturedata.js",
  "./js/lectures.js",
  "./js/online.js",
  "./js/play.js",
  "./js/profile.js",
  "./js/puzzles.js",
  "./js/review.js",
  "./js/router.js",
  "./js/sound.js",
  "./js/srs.js",
  "./js/store.js",
  "./js/trainers.js",
  "./js/util.js",
  "./data/classics.js",
  "./data/lectures.js",
  "./data/lessons.js",
  "./data/openings.js",
  "./data/puzzles.js",
  "./vendor/chess.js",
  "./vendor/peerjs.min.js",
  "./vendor/anthropic-sdk.mjs",
  "./vendor/stockfish/stockfish-18-lite-single.js",
  "./vendor/stockfish/stockfish-18-lite-single.wasm",
  "./pieces/cburnett/bB.svg",
  "./pieces/cburnett/bK.svg",
  "./pieces/cburnett/bN.svg",
  "./pieces/cburnett/bP.svg",
  "./pieces/cburnett/bQ.svg",
  "./pieces/cburnett/bR.svg",
  "./pieces/cburnett/wB.svg",
  "./pieces/cburnett/wK.svg",
  "./pieces/cburnett/wN.svg",
  "./pieces/cburnett/wP.svg",
  "./pieces/cburnett/wQ.svg",
  "./pieces/cburnett/wR.svg",
  "./pieces/chessnut/bB.svg",
  "./pieces/chessnut/bK.svg",
  "./pieces/chessnut/bN.svg",
  "./pieces/chessnut/bP.svg",
  "./pieces/chessnut/bQ.svg",
  "./pieces/chessnut/bR.svg",
  "./pieces/chessnut/wB.svg",
  "./pieces/chessnut/wK.svg",
  "./pieces/chessnut/wN.svg",
  "./pieces/chessnut/wP.svg",
  "./pieces/chessnut/wQ.svg",
  "./pieces/chessnut/wR.svg",
  "./pieces/merida/bB.svg",
  "./pieces/merida/bK.svg",
  "./pieces/merida/bN.svg",
  "./pieces/merida/bP.svg",
  "./pieces/merida/bQ.svg",
  "./pieces/merida/bR.svg",
  "./pieces/merida/wB.svg",
  "./pieces/merida/wK.svg",
  "./pieces/merida/wN.svg",
  "./pieces/merida/wP.svg",
  "./pieces/merida/wQ.svg",
  "./pieces/merida/wR.svg"
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
  // чужие сайты (сервер связи, Anthropic) — напрямую в сеть, мимо кэша
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

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

  // Код приложения: из кэша, но в фоне обновляем, чтобы новая версия
  // подтянулась вместе с index.html.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      });
      if (hit) {
        if (!req.url.endsWith(".wasm")) e.waitUntil(net.catch(() => {}));
        return hit;
      }
      return net;
    })
  );
});
