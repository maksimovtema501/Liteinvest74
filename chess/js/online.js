/* Онлайн без своего сервера: устройства соединяются напрямую (WebRTC),
   а знакомит их публичный сервер PeerJS. Игра с другом — по ссылке или коду.
   Быстрый поиск — «лобби» из нескольких известных адресов: кто пришёл первым,
   занимает адрес и ждёт, следующий подключается к нему. */
import { $, $$, esc, toast, copyText, sleep, plural } from "./util.js";
import { S, save, tcSlot } from "./store.js";
import { go } from "./router.js";
import { startGame, me, G, TCS, tcName } from "./play.js";
import { play as snd } from "./sound.js";

const PREFIX = "lc74chess-";
const ONLINE_TCS = TCS.filter(t => t[0] !== "none");
const SLOTS = 4;

let PeerCls = null;
function loadPeer() {
  if (PeerCls) return Promise.resolve(PeerCls);
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = new URL("../vendor/peerjs.min.js", import.meta.url).href;
    s.onload = () => { PeerCls = window.Peer; res(PeerCls); };
    s.onerror = () => rej(new Error("Не удалось загрузить модуль связи"));
    document.head.appendChild(s);
  });
}
function peerOpts() {
  // для проверки на своём сервере PeerJS: localStorage["chess-peer-host"] = '{"host":"localhost","port":9000,"path":"/","secure":false}'
  try { const o = JSON.parse(localStorage.getItem("chess-peer-host") || "null"); if (o) return { ...o, debug: 0 }; } catch {}
  return { debug: 0 };
}
const code6 = () => Array.from({ length: 6 }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");

/* ======================================================================= */
class Net {
  constructor() {
    this.peer = null; this.conn = null; this.alive = false; this.role = null;
    this.handler = null; this.closed = false;
  }
  send(msg) { try { if (this.conn && this.conn.open) this.conn.send(msg); } catch {} }
  bind(conn) {
    this.conn = conn;
    conn.on("data", m => this.onData(m));
    conn.on("close", () => this.lost());
    conn.on("error", () => this.lost());
  }
  onData(m) {
    if (!m || typeof m !== "object") return;
    if (m.t === "ping") return;
    if (m.t === "sync" && G && G.net === this) { syncMoves(m); return; }
    if (m.t === "resume" && G && G.net === this) { syncMoves(m); this.send({ t: "sync", moves: G.hist.map(h => h.uci) }); return; }
    if (m.t === "bye") { this.closed = true; this.lost(); return; }
    if (this.handler) this.handler(m);
    else if (G && G.net === this) G.onNet(m);
  }
  lost() {
    if (!this.alive) return;
    this.alive = false;
    if (G && G.net === this && !G.result) {
      G.netLost();
      if (this.role === "guest" && !this.closed) this.reconnect();
    }
  }
  async reconnect() {
    const t0 = Date.now();
    while (!this.closed && !this.alive && Date.now() - t0 < 60000) {
      await sleep(3000);
      if (this.alive || this.closed) return;
      try {
        const c = this.peer.connect(this.hostId, { reliable: true });
        await new Promise((res, rej) => { c.on("open", res); setTimeout(() => rej(new Error("timeout")), 5000); });
        this.bind(c);
        this.alive = true;
        this.send({ t: "resume", ply: G ? G.hist.length : 0, moves: G ? G.hist.map(h => h.uci) : [] });
        G && G.netBack();
      } catch {}
    }
  }
  gameOver() {}
  close() {
    this.closed = true;
    try { this.send({ t: "bye" }); } catch {}
    setTimeout(() => { try { this.conn && this.conn.close(); } catch {} try { this.peer && this.peer.destroy(); } catch {} }, 200);
  }
  startRematch(cfg) {
    const uc = cfg.userColor === "w" ? "b" : "w";
    const op = cfg.userColor === "w" ? cfg.black : cfg.white;
    launch(this, { tc: cfg.tc, userColor: uc, me: myCard(cfg.tc), op });
  }
}

/* догоняем ходы после переподключения */
function syncMoves(m) {
  if (!G || !Array.isArray(m.moves)) return;
  const mine = G.hist.map(h => h.uci);
  if (m.moves.length > mine.length && m.moves.slice(0, mine.length).join() === mine.join()) {
    for (const u of m.moves.slice(mine.length)) G.onNet({ t: "move", uci: u });
  }
}

function launch(net, { tc, userColor, me: meP, op }) {
  net.handler = null;
  net.alive = true;
  startGame({
    mode: "online", net, tc, userColor,
    white: userColor === "w" ? meP : op, black: userColor === "b" ? meP : op,
    allowTakeback: false, allowHints: false, coach: false,
  });
}

function myCard(tc) {
  const slot = tcSlot(tc) || "blitz";
  return { name: S.profile.name || "Игрок", av: S.profile.avatar || "🙂", rating: S.ratings[slot].r };
}

/* хост: ждёт гостя, сообщает правила партии */
function hostAccept(net, conn, { tc, color }) {
  if (net.conn && net.conn.open) {
    conn.on("open", () => { conn.send({ t: "busy" }); setTimeout(() => conn.close(), 400); });
    return;
  }
  conn.on("open", () => {
    if (G && G.net === net && !G.result) {
      // возвращение гостя в идущую партию
      net.bind(conn); net.alive = true;
      net.send({ t: "sync", moves: G.hist.map(h => h.uci) });
      G.netBack();
      return;
    }
    net.bind(conn);
    const hostColor = color === "r" ? (Math.random() < 0.5 ? "w" : "b") : color;
    net.handler = m => {
      if (m.t === "hello") {
        const op = { name: String(m.name || "Соперник").slice(0, 24), av: String(m.av || "♟").slice(0, 4), rating: +m.rating || 1200 };
        snd("notify");
        launch(net, { tc, userColor: hostColor, me: myCard(tc), op });
      }
    };
    net.send({ t: "hello", v: 1, ...myCard(tc), tc, hostColor });
  });
}

/* гость: подключается к адресу, ждёт приветствия хоста */
function guestConnect(net, hostId, { timeout = 8000 } = {}) {
  return new Promise(resolve => {
    let done = false, won = false;
    const finish = r => { if (done) return; done = true; net.peer.off("error", onErr); resolve(r); };
    const onErr = e => { if (e && e.type === "peer-unavailable" && String(e.message || "").includes(hostId)) finish({ free: true }); };
    net.peer.on("error", onErr);
    const conn = net.peer.connect(hostId, { reliable: true });
    conn.on("data", m => {
      if (done) { if (!won) try { conn.close(); } catch {} return; }
      if (m && m.t === "busy") { finish({ busy: true }); try { conn.close(); } catch {} }
      if (m && m.t === "hello") {
        won = true;
        net.role = "guest"; net.hostId = hostId;
        net.bind(conn);
        const tc = m.tc;
        conn.send({ t: "hello", v: 1, ...myCard(tc) });
        const op = { name: String(m.name || "Соперник").slice(0, 24), av: String(m.av || "♟").slice(0, 4), rating: +m.rating || 1200 };
        finish({ ok: true });
        snd("notify");
        launch(net, { tc, userColor: m.hostColor === "w" ? "b" : "w", me: myCard(tc), op });
      }
    });
    setTimeout(() => { finish({ timeout: true }); }, timeout);
  });
}

function newPeer(id) {
  return new Promise((res, rej) => {
    const p = id ? new PeerCls(id, peerOpts()) : new PeerCls(peerOpts());
    const t = setTimeout(() => rej(new Error("Сервер связи не отвечает. Проверьте интернет.")), 12000);
    p.on("open", () => { clearTimeout(t); res(p); });
    p.on("error", e => { clearTimeout(t); rej(e); });
  });
}

/* ======================================================================= */
export function viewOnline(el, arg, params) {
  let tc = S.onlineTc || "5+0", color = "r";
  let net = null, cancelled = false;
  const cleanup = () => {
    cancelled = true;
    if (net && !(G && G.net === net)) net.close();
  };
  const R = S.ratings;
  const draw = () => {
    el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Онлайн</h1></div>
      <div class="grid3">
        <div class="stat"><div class="v">🔫 ${R.bullet.r}</div><div class="l">Пуля</div></div>
        <div class="stat"><div class="v">⚡ ${R.blitz.r}</div><div class="l">Блиц</div></div>
        <div class="stat"><div class="v">🐢 ${R.rapid.r}</div><div class="l">Рапид</div></div>
      </div>
      <div class="sec-title">Контроль времени</div>
      <div class="chips" id="tcs">${ONLINE_TCS.map(([k, t]) => `<button class="chip ${tc === k ? "on" : ""}" data-k="${k}">${t}</button>`).join("")}</div>
      <div class="play" style="grid-template-columns:1fr 1fr;margin-top:14px">
        <div class="card"><h2>⚡ Быстрый поиск</h2>
          <p class="small muted" style="margin:0 0 10px">Соперник из тех, кто сейчас тоже ищет партию с этим контролем.</p>
          <button class="btn primary big block" id="quick">Найти соперника</button></div>
        <div class="card"><h2>🔗 С другом</h2>
          <div class="seg" id="col" style="margin-bottom:10px">${[["w", "⚪ Белые"], ["r", "🎲 Любой"], ["b", "⚫ Чёрные"]].map(([k, t]) => `<button class="${color === k ? "on" : ""}" data-k="${k}">${t}</button>`).join("")}</div>
          <button class="btn big block" id="host">Создать приглашение</button>
          <div class="row" style="margin-top:10px"><input type="text" id="code" placeholder="Код от друга" maxlength="12" autocapitalize="off"><button class="btn" id="join">Войти</button></div></div>
      </div>
      <p class="tiny dim" style="margin-top:12px">Партия идёт напрямую между устройствами. Нужен интернет у обоих игроков. Рейтинг онлайн считается на этом устройстве.</p>`;
    $$("#tcs button", el).forEach(b => b.onclick = () => { tc = b.dataset.k; S.onlineTc = tc; save(); draw(); });
    $$("#col button", el).forEach(b => b.onclick = () => { color = b.dataset.k; draw(); });
    $("#quick", el).onclick = quick;
    $("#host", el).onclick = host;
    $("#join", el).onclick = () => { const c = $("#code", el).value.trim().toLowerCase(); if (c) join(c); };
  };

  const waitScreen = (title, body) => {
    el.innerHTML = `<div class="topbar"><button class="back" id="wBack">←</button><h1>${esc(title)}</h1></div>
      <div class="card" style="max-width:520px;margin:0 auto;text-align:center"><div id="wBody">${body}</div>
      <button class="btn ghost block" id="wCancel" style="margin-top:14px">Отмена</button></div>`;
    const stop = () => { cancelled = true; if (net) net.close(); net = null; cancelled = false; draw(); };
    $("#wBack", el).onclick = stop; $("#wCancel", el).onclick = stop;
  };
  const fail = e => {
    if (cancelled) return;
    const msg = e && e.type === "peer-unavailable" ? "Игра не найдена: проверьте код или попросите друга создать новое приглашение." :
      e && e.type === "network" ? "Нет связи с сервером. Проверьте интернет." : e && e.type === "browser-incompatible" ? "Браузер не поддерживает прямое соединение." : (e && e.message) || "Не удалось соединиться";
    const b = $("#wBody", el);
    if (b) b.innerHTML = `<div style="font-size:40px">📡</div><p class="red">${esc(msg)}</p>`;
    else toast(msg);
  };

  async function host() {
    const code = code6();
    const link = location.href.split("#")[0] + "#join=" + code;
    waitScreen("Приглашение", `<div style="font-size:40px">🔗</div><p class="muted">Подключаюсь к серверу связи…</p>`);
    try {
      await loadPeer();
      net = new Net();
      net.role = "host";
      net.peer = await newPeer(PREFIX + code);
      if (cancelled) return;
      $("#wBody", el).innerHTML = `<div style="font-size:40px">🔗</div>
        <p>Отправьте другу ссылку или код. Партия начнётся, как только он откроет её.</p>
        <div class="kbd" style="font-size:26px;padding:8px 14px;display:inline-block;letter-spacing:3px;margin:6px 0">${code}</div>
        <div class="small muted" style="word-break:break-all;margin:6px 0 12px">${esc(link)}</div>
        <div class="grid2"><button class="btn primary" id="share">📤 Поделиться</button><button class="btn" id="copy">📋 Копировать</button></div>
        <p class="small muted" style="margin-top:12px">⏱ ${tcName(tc)} · ждём соперника…</p>`;
      $("#copy", el).onclick = () => copyText(link);
      $("#share", el).onclick = () => navigator.share ? navigator.share({ title: "Сыграем в шахматы?", text: `Сыграем партию ${tcName(tc)}! Код: ${code}`, url: link }).catch(() => {}) : copyText(link);
      net.peer.on("connection", c => hostAccept(net, c, { tc, color }));
      net.peer.on("error", e => { if (!(G && G.net === net)) fail(e); });
    } catch (e) { fail(e); }
  }

  async function join(code) {
    code = code.replace(/^.*#join=/, "");
    waitScreen("Подключение", `<div style="font-size:40px">🤝</div><p class="muted">Подключаюсь к игре ${esc(code)}…</p>`);
    try {
      await loadPeer();
      net = new Net();
      net.peer = await newPeer();
      if (cancelled) return;
      const r = await guestConnect(net, PREFIX + code, { timeout: 15000 });
      if (cancelled) return;
      if (r.free) fail({ type: "peer-unavailable" });
      else if (r.busy) fail({ message: "В этой игре уже два игрока." });
      else if (r.timeout) fail({ message: "Создатель игры не отвечает. Попробуйте ещё раз." });
    } catch (e) { fail(e); }
  }

  async function quick() {
    waitScreen("Поиск соперника", `<div style="font-size:40px" class="thinking">🔎</div><p class="muted" id="qTxt">Подключаюсь к серверу связи…</p><p class="small muted">⏱ ${tcName(tc)}</p>`);
    const t0 = Date.now();
    const txt = s => { const e = $("#qTxt", el); if (e) e.textContent = s; };
    try {
      await loadPeer();
      while (!cancelled && Date.now() - t0 < 120000) {
        // 1) ищем того, кто уже ждёт
        net = new Net();
        net.peer = await newPeer();
        if (cancelled) return;
        txt("Ищу соперника…");
        let free = null;
        for (let n = 1; n <= SLOTS && !cancelled; n++) {
          const id = `${PREFIX}q-${tc.replace("+", "-")}-${n}`;
          const r = await guestConnect(net, id, { timeout: 5000 });
          if (r.ok) return;
          if ((r.free || r.timeout) && free == null) free = n;
        }
        net.close();
        if (cancelled) return;
        // 2) никого нет — занимаем свободный адрес и ждём
        const n = free || 1 + Math.floor(Math.random() * SLOTS);
        try {
          net = new Net();
          net.role = "host";
          net.peer = await newPeer(`${PREFIX}q-${tc.replace("+", "-")}-${n}`);
        } catch (e) {
          if (e && e.type === "unavailable-id") { await sleep(500); continue; }   // адрес успели занять — снова ищем
          throw e;
        }
        txt("Соперников пока нет. Ждём, когда кто-нибудь начнёт поиск…");
        net.peer.on("connection", c => hostAccept(net, c, { tc, color: "r" }));
        const waitUntil = Date.now() + 45000;
        while (!cancelled && Date.now() < waitUntil && !(G && G.net === net)) {
          await sleep(500);
          const left = Math.round((waitUntil - Date.now()) / 1000);
          if (left % 5 === 0) txt(`Ждём соперника… (${Math.round((Date.now() - t0) / 1000)} с)`);
        }
        if (G && G.net === net) return;
        net.close();
      }
      if (!cancelled) {
        const b = $("#wBody", el);
        if (b) b.innerHTML = `<div style="font-size:40px">😴</div><p>Сейчас никто не ищет партию с контролем ${tcName(tc)}.</p>
          <p class="small muted">Пригласите друга по ссылке или сыграйте с ботом.</p>
          <div class="grid2"><button class="btn primary" id="toBot">🤖 С ботом</button><button class="btn" id="again">Искать ещё</button></div>`;
        $("#toBot", el)?.addEventListener("click", () => go("bots"));
        $("#again", el)?.addEventListener("click", quick);
      }
    } catch (e) { fail(e); }
  }

  draw();
  if (params && params.join) join(params.join);
  return cleanup;
}
