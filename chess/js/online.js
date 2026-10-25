/* Онлайн без своего сервера: сообщения идут через публичные MQTT-брокеры
   (relay.js), прямое соединение между устройствами не нужно.
   Поверх канала — сеанс с нумерацией, подтверждениями и повторами: ход
   дойдёт, даже если связь моргнула или страницу ненадолго свернули.
   Игра с другом — по ссылке или коду; быстрый поиск — общее «лобби»
   для каждого контроля времени. */
import { $, $$, esc, toast, copyText, sleep } from "./util.js";
import { S, save, tcSlot } from "./store.js";
import { go } from "./router.js";
import { startGame, G, TCS, tcName } from "./play.js";
import { play as snd } from "./sound.js";
import { relay, NS, rid } from "./relay.js";

const V = 2;                                        // версия протокола
const ONLINE_TCS = TCS.filter(t => t[0] !== "none");
const inbox = id => NS + "u/" + id;
const tcKey = tc => tc.replace("+", "-");           // «+» в имени темы MQTT запрещён
const code6 = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), x => "abcdefghjkmnpqrstuvwxyz23456789"[x % 31]).join("");
const NET_T = new Set(["d", "a", "hb", "bye", "busy"]);

/* ======================================================================= */
/* сеанс с одним соперником */
class Net {
  constructor(sid, peer = null) {
    this.sid = sid; this.peer = peer;
    this.out = new Map(); this.outSeq = 0;          // отправленные, ждут подтверждения
    this.inSeq = 0; this.pend = new Map();          // принятые по порядку / пришедшие раньше времени
    this.handler = null; this.closed = false;
    this.alive = true; this.down = null;
    this.last = Date.now(); this.lastTx = 0; this.probeAt = 0;
    this.key = "net-" + sid;
    relay.hold(this.key);
    this.off = relay.on(inbox(relay.me), p => this.onPacket(p));
    this.timer = setInterval(() => this.pump(), 1000);
  }
  onPacket(p) {
    if (this.closed || p.sid !== this.sid || !NET_T.has(p.t)) return;
    if (p.t === "busy") { this.onBusy && this.onBusy(); return; }
    if (this.peer && p.from !== this.peer) return;
    this.peer = p.from;
    this.last = Date.now();
    if (Number.isInteger(p.a)) for (const s of [...this.out.keys()]) if (s <= p.a) this.out.delete(s);
    if (p.t === "bye") { this.closed = true; this.stop(); this.setAlive(false); return; }
    this.setAlive(true);
    if (p.t === "d" && Number.isInteger(p.s)) {
      if (p.s > this.inSeq) this.pend.set(p.s, p.m);
      if (!this.ackT) this.ackT = setTimeout(() => { this.ackT = 0; this.tx({ t: "a" }); }, 40);
      while (this.pend.has(this.inSeq + 1)) {
        const m = this.pend.get(this.inSeq + 1);
        this.pend.delete(++this.inSeq);
        this.deliver(m);
      }
    }
  }
  deliver(m) {
    if (!m || typeof m !== "object") return;
    if (this.handler) this.handler(m);
    else if (G && G.net === this) G.onNet(m);
  }
  /* связь с соперником: есть / пропала у него / пропала у нас */
  setAlive(v, selfDown = false) {
    if (v) {
      if (!this.alive) { this.alive = true; this.down = null; if (G && G.net === this && !G.result) G.netBack(); }
      return;
    }
    this.alive = false;
    const mode = selfDown ? "self" : "peer";
    if (this.down === mode) return;
    this.down = mode;
    if (G && G.net === this && !G.result) G.netLost(selfDown);
  }
  tx(p) {
    if (!this.peer) return;
    this.lastTx = Date.now();
    relay.pub(inbox(this.peer), { ...p, sid: this.sid, a: this.inSeq });
  }
  send(m) {
    if (this.closed) return;
    this.out.set(++this.outSeq, { m, at: 0 });
    this.flush();
  }
  flush() {
    if (!this.peer) return;
    const now = Date.now();
    let k = 0;
    for (const [s, o] of this.out) {
      if (now - o.at < 1500) continue;
      o.at = now;
      this.tx({ t: "d", s, m: o.m });
      if (++k >= 20) break;
    }
  }
  pump() {
    if (this.closed || !this.peer) return;
    this.flush();
    const now = Date.now();
    if (now - this.lastTx > 2500) this.tx({ t: "hb" });
    const quiet = now - this.last;
    // соперник молчит — сначала проверяем собственную связь: вдруг пропала у нас
    if (quiet > 6000 && (this.probeAt < this.last || now - this.probeAt > 10000)) { this.probeAt = now; relay.kick(); }
    if (quiet > 13000 && now - this.probeAt > 5500) this.setAlive(false, relay.up === 0);
  }
  stop() {
    clearInterval(this.timer); clearTimeout(this.ackT);
    this.off();
    relay.release(this.key);
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    this.tx({ t: "bye" });
    this.stop();
  }
  gameOver() {}
  startRematch(cfg) {
    const uc = cfg.userColor === "w" ? "b" : "w";
    const op = cfg.userColor === "w" ? cfg.black : cfg.white;
    launch(this, { tc: cfg.tc, userColor: uc, me: myCard(cfg.tc), op });
  }
}

function launch(net, { tc, userColor, me: meP, op }) {
  net.handler = null;
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
const opCard = m => ({ name: String(m.name || "Соперник").slice(0, 24), av: String(m.av || "♟").slice(0, 4), rating: Math.round(+m.rating) || 1200 });
const validTc = tc => ONLINE_TCS.some(t => t[0] === tc) ? tc : "5+0";

/* создатель партии: сообщает правила и ждёт ответного приветствия */
function hostStart(net, { tc, color }) {
  const hostColor = color === "r" ? (Math.random() < 0.5 ? "w" : "b") : color;
  net.handler = m => {
    if (m.t !== "hello") return;
    snd("notify");
    launch(net, { tc, userColor: hostColor, me: myCard(tc), op: opCard(m) });
  };
  net.send({ t: "hello", v: V, ...myCard(tc), tc, hostColor });
}
/* второй игрок: на приветствие отвечает своим и начинает партию */
function guestHandler(net, alive) {
  net.handler = m => {
    if (m.t !== "hello" || !alive()) return;
    const tc = validTc(m.tc);
    net.send({ t: "hello", v: V, ...myCard(tc) });
    snd("notify");
    launch(net, { tc, userColor: m.hostColor === "w" ? "b" : "w", me: myCard(tc), op: opCard(m) });
  };
}

/* ======================================================================= */
export function viewOnline(el, arg, params) {
  let tc = S.onlineTc || "5+0", color = "r";
  let net = null, run = 0;                  // run — номер текущего действия; отмена = run++
  const offs = [];
  const seekers = new Map();                // контроль → Map(игрок → когда видели)

  relay.hold("view");
  const offLobby = relay.on(NS + "lobby/+", (m, topic) => {
    if (m.t !== "seek" || m.v !== V) return;
    const k = topic.slice(topic.lastIndexOf("/") + 1);
    if (!seekers.has(k)) seekers.set(k, new Map());
    seekers.get(k).set(m.from, Date.now());
  });
  const count = k => {
    const s = seekers.get(k);
    if (!s) return 0;
    const now = Date.now();
    for (const [id, t] of s) if (now - t > 5000) s.delete(id);
    return s.size;
  };

  const statHtml = () => `<details id="netStat" class="tiny dim" style="margin:10px 0"><summary style="cursor:pointer"></summary><div class="list" style="margin-top:4px"></div></details>`;
  const paintStat = () => {
    const box = $("#netStat", el);
    if (box) {
      const st = relay.status(), up = st.filter(s => s.st === "up").length;
      $("summary", box).innerHTML = up ? `<span class="green">●</span> Связь есть: серверов ${up} из ${st.length}` :
        st.some(s => s.st === "connecting") ? `<span class="amber">●</span> Подключаюсь к серверам…` : `<span class="red">●</span> Нет связи с серверами игры`;
      $(".list", box).innerHTML = st.map(s => `${s.st === "up" ? "✅" : s.st === "connecting" ? "⏳" : "❌"} ${esc(s.name)}`).join(" · ");
    }
    $$("#tcs [data-k]", el).forEach(b => { const n = count(tcKey(b.dataset.k)); $(".cnt", b).textContent = n ? ` · 👤${n}` : ""; });
    const q = $("#qCnt", el);
    if (q) { const n = count(tcKey(tc)); q.textContent = n ? `сейчас ищут: ${n}` : ""; }
  };
  const offWatch = relay.watch(paintStat);
  const tickT = setInterval(paintStat, 1000);

  const stopAction = () => {
    run++;
    offs.splice(0).forEach(f => f());
    if (net && !(G && G.net === net)) net.close();
    net = null;
  };
  const cleanup = () => { stopAction(); offLobby(); offWatch(); clearInterval(tickT); relay.release("view"); };

  const R = S.ratings;
  const draw = () => {
    el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Онлайн</h1></div>
      <div class="grid3">
        <div class="stat"><div class="v">🔫 ${R.bullet.r}</div><div class="l">Пуля</div></div>
        <div class="stat"><div class="v">⚡ ${R.blitz.r}</div><div class="l">Блиц</div></div>
        <div class="stat"><div class="v">🐢 ${R.rapid.r}</div><div class="l">Рапид</div></div>
      </div>
      ${statHtml()}
      <div class="sec-title" style="margin-top:6px">Контроль времени</div>
      <div class="chips" id="tcs">${ONLINE_TCS.map(([k, t]) => `<button class="chip ${tc === k ? "on" : ""}" data-k="${k}">${t}<span class="cnt"></span></button>`).join("")}</div>
      <div class="play" style="grid-template-columns:1fr 1fr;margin-top:14px">
        <div class="card"><h2>⚡ Быстрый поиск</h2>
          <p class="small muted" style="margin:0 0 10px">Соперник из тех, кто сейчас тоже ищет партию с этим контролем. 👤 — сколько человек ищут прямо сейчас.</p>
          <button class="btn primary big block" id="quick">Найти соперника</button></div>
        <div class="card"><h2>🔗 С другом</h2>
          <div class="seg" id="col" style="margin-bottom:10px">${[["w", "⚪ Белые"], ["r", "🎲 Любой"], ["b", "⚫ Чёрные"]].map(([k, t]) => `<button class="${color === k ? "on" : ""}" data-k="${k}">${t}</button>`).join("")}</div>
          <button class="btn big block" id="host">Создать приглашение</button>
          <div class="row" style="margin-top:10px"><input type="text" id="code" placeholder="Код от друга" maxlength="80" autocapitalize="off"><button class="btn" id="join">Войти</button></div></div>
      </div>
      <p class="tiny dim" style="margin-top:12px">Ходы передаются через несколько публичных серверов сразу: если один недоступен, работают остальные. Рейтинг онлайн считается на этом устройстве.</p>`;
    $$("#tcs button", el).forEach(b => b.onclick = () => { tc = b.dataset.k; S.onlineTc = tc; save(); draw(); });
    $$("#col button", el).forEach(b => b.onclick = () => { color = b.dataset.k; draw(); });
    $("#quick", el).onclick = quick;
    $("#host", el).onclick = host;
    $("#join", el).onclick = () => { const c = $("#code", el).value.trim(); if (c) join(c); };
    $("#code", el).onkeydown = e => { if (e.key === "Enter") $("#join", el).click(); };
    paintStat();
  };

  const waitScreen = (title, body) => {
    el.innerHTML = `<div class="topbar"><button class="back" id="wBack">←</button><h1>${esc(title)}</h1></div>
      <div class="card" style="max-width:520px;margin:0 auto;text-align:center"><div id="wBody">${body}</div>
      ${statHtml()}
      <button class="btn ghost block" id="wCancel" style="margin-top:6px">Отмена</button></div>`;
    const stop = () => { stopAction(); draw(); };
    $("#wBack", el).onclick = stop; $("#wCancel", el).onclick = stop;
    paintStat();
  };
  const txt = (id, s) => { const e = $("#" + id, el); if (e) e.textContent = s; };
  const fail = (e, my) => {
    if (my !== run) return;
    stopAction();
    const msg = (e && e.message) || "Не удалось соединиться";
    const b = $("#wBody", el);
    if (b) b.innerHTML = `<div style="font-size:40px">📡</div><p class="red">${esc(msg)}</p>`;
    else toast(msg);
    const c = $("#wCancel", el);
    if (c) c.textContent = "Назад";
  };

  async function host() {
    stopAction();
    const my = run;
    const code = code6();
    const link = location.href.split("#")[0] + "#join=" + code;
    waitScreen("Приглашение", `<div style="font-size:40px">🔗</div><p class="muted">Подключаюсь к серверам…</p>`);
    try {
      await relay.ready();
      if (my !== run) return;
      $("#wBody", el).innerHTML = `<div style="font-size:40px">🔗</div>
        <p>Отправьте другу ссылку или код. Партия начнётся, как только он откроет её.</p>
        <div class="kbd" style="font-size:26px;padding:8px 14px;display:inline-block;letter-spacing:3px;margin:6px 0">${code}</div>
        <div class="small muted" style="word-break:break-all;margin:6px 0 12px">${esc(link)}</div>
        <div class="grid2"><button class="btn primary" id="share">📤 Поделиться</button><button class="btn" id="copy">📋 Копировать</button></div>
        <p class="small muted" style="margin-top:12px" id="hTxt">⏱ ${tcName(tc)} · ждём соперника…</p>
        <p class="tiny dim">Страницу можно свернуть, чтобы отправить ссылку: приглашение действует, пока вы не нажмёте «Отмена».</p>`;
      $("#copy", el).onclick = () => copyText(link);
      $("#share", el).onclick = () => navigator.share ? navigator.share({ title: "Сыграем в шахматы?", text: `Сыграем партию ${tcName(tc)}! Код: ${code}`, url: link }).catch(() => {}) : copyText(link);
      offs.push(relay.on(NS + "inv/" + code, m => {
        if (my !== run || m.t !== "join" || typeof m.sid !== "string") return;
        if (net) {
          if (m.sid === net.sid) return;
          // прежний гость пропал, не начав партию — пускаем нового
          if (!(G && G.net === net) && Date.now() - net.last > 15000) { net.close(); net = null; }
          else { relay.pub(inbox(m.from), { t: "busy", sid: m.sid }); return; }
        }
        net = new Net(m.sid, m.from);
        hostStart(net, { tc, color });
        txt("hTxt", "Соперник подключается…");
      }));
    } catch (e) { fail(e, my); }
  }

  async function join(code) {
    stopAction();
    const my = run;
    code = code.replace(/^.*#join=/, "").trim().toLowerCase();
    if (!/^[a-z0-9]{4,12}$/.test(code)) { toast("Неверный код приглашения"); draw(); return; }
    waitScreen("Подключение", `<div style="font-size:40px">🤝</div><p class="muted" id="jTxt">Подключаюсь к серверам…</p>`);
    try {
      await relay.ready();
      if (my !== run) return;
      const n = net = new Net(rid(10));
      let busy = false;
      n.onBusy = () => { busy = true; };
      guestHandler(n, () => my === run);
      txt("jTxt", `Ищу игру ${code}…`);
      const t0 = Date.now();
      while (my === run && !n.peer && !busy) {
        relay.pub(NS + "inv/" + code, { t: "join", sid: n.sid });
        const s = Math.round((Date.now() - t0) / 1000);
        if (s > 120) { fail({ message: "Создатель игры не отвечает. Проверьте код или попросите друга создать новое приглашение и не нажимать «Отмена»." }, my); return; }
        if (s >= 8) txt("jTxt", `Создатель игры пока не отвечает (${s} с). Возможно, он свернул страницу — ждём, когда вернётся…`);
        await sleep(2000);
      }
      if (my !== run) return;
      if (busy) { fail({ message: "В этой игре уже два игрока." }, my); return; }
      txt("jTxt", "Соединились, начинаем партию…");
      await sleep(20000);
      if (my === run && !(G && G.net === n)) fail({ message: "Соединение оборвалось. Попробуйте ещё раз." }, my);
    } catch (e) { fail(e, my); }
  }

  async function quick() {
    stopAction();
    const my = run;
    const k = tcKey(tc), lobby = NS + "lobby/" + k;
    waitScreen("Поиск соперника", `<div style="font-size:40px" class="thinking">🔎</div><p class="muted" id="qTxt">Подключаюсь к серверам…</p><p class="small muted">⏱ ${tcName(tc)} <span id="qCnt"></span></p>`);
    try {
      await relay.ready();
      if (my !== run) return;
      const t0 = Date.now();
      const pause = new Map();              // с кем не вышло — не предлагаем партию до указанного времени
      let phase = "seek", target = null, sid = null, phaseT = 0, lastSeek = 0;
      const reset = (ms) => {
        if (target && ms) pause.set(target, Date.now() + ms);
        if (net && !(G && G.net === net)) net.close();
        net = null; phase = "seek"; target = sid = null;
      };
      // предложение делает игрок с меньшим id, второй соглашается — так пара собирается один раз
      offs.push(relay.on(lobby, m => {
        if (my !== run || m.t !== "seek" || m.v !== V || phase !== "seek") return;
        if (relay.me < m.from && !((pause.get(m.from) || 0) > Date.now())) {
          phase = "propose"; target = m.from; sid = rid(10); phaseT = Date.now();
          relay.pub(inbox(target), { t: "propose", sid, tc, v: V });
        }
      }));
      offs.push(relay.on(inbox(relay.me), m => {
        if (my !== run || typeof m.sid !== "string") return;
        if (m.t === "propose" && m.tc === tc && m.v === V) {
          if (phase !== "seek" || (pause.get(m.from) || 0) > Date.now()) { relay.pub(inbox(m.from), { t: "decline", sid: m.sid }); return; }
          phase = "guest"; target = m.from; sid = m.sid; phaseT = Date.now();
          net = new Net(sid, target);
          guestHandler(net, () => my === run);
          relay.pub(inbox(target), { t: "accept", sid });
          txt("qTxt", "Соперник найден, соединяемся…");
        } else if (m.t === "accept" && phase === "propose" && m.sid === sid && m.from === target) {
          phase = "host"; phaseT = Date.now();
          net = new Net(sid, target);
          hostStart(net, { tc, color: "r" });
          txt("qTxt", "Соперник найден, соединяемся…");
        } else if (m.t === "decline" && phase === "propose" && m.sid === sid) reset(4000);
      }));
      while (my === run && Date.now() - t0 < 180000) {
        const now = Date.now();
        if (phase === "propose" && now - phaseT > 5000) reset(8000);
        if ((phase === "guest" || phase === "host") && now - phaseT > 12000) reset(30000);
        if (phase === "seek" && now - lastSeek >= 2000) {
          relay.pub(lobby, { t: "seek", v: V, tc, r: myCard(tc).rating });
          lastSeek = now;
          txt("qTxt", `Ищу соперника… ${Math.round((now - t0) / 1000)} с`);
        }
        await sleep(250);
      }
      if (my !== run) return;
      stopAction();
      const b = $("#wBody", el);
      if (b) b.innerHTML = `<div style="font-size:40px">😴</div><p>Сейчас никто не ищет партию с контролем ${tcName(tc)}.</p>
        <p class="small muted">Пригласите друга по ссылке или сыграйте с ботом. Если друг тоже ищет — выберите одинаковый контроль времени.</p>
        <div class="grid2"><button class="btn primary" id="toBot">🤖 С ботом</button><button class="btn" id="again">Искать ещё</button></div>`;
      $("#toBot", el)?.addEventListener("click", () => go("bots"));
      $("#again", el)?.addEventListener("click", quick);
    } catch (e) { fail(e, my); }
  }

  draw();
  if (params && params.join) join(params.join);
  return cleanup;
}
