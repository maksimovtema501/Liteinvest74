/* Интервальное повторение. Расписание строит FSRS-5 (алгоритм из Anki,
   параметры по умолчанию): модель «стабильность — трудность — вероятность
   вспомнить», цель — помнить 90% позиций к моменту повторения.
   Карточки — ключевые позиции из лекций, уроков, дебютов, задач с ошибкой
   и ваших собственных ошибок в партиях. Повторение идёт вперемешку. */
import { $, $$, esc, plural, today } from "./util.js";
import { S, save, activity, setActive, checkStreakAch, unlock, addCard } from "./store.js";
import { Board } from "./board.js";
import { makeChess, playUci, sanList, figSan, uciOf, START_FEN } from "./chessutil.js";
import { LESSONS, OPENINGS_LIB } from "../data/lessons.js";
import { lectureById, resolveLecture } from "./lecturedata.js";
import { PuzzleRunner, puzzleById } from "./puzzles.js";
import { play as snd } from "./sound.js";
import { go } from "./router.js";

const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
const DECAY = -0.5, FACTOR = 19 / 81, DAY = 864e5, RETENTION = 0.9;
const clampD = d => Math.min(10, Math.max(1, d));
const d0 = g => clampD(W[4] - Math.exp(W[5] * (g - 1)) + 1);

export function retrievability(card, now = Date.now()) {
  if (!card.s) return 0;
  const t = Math.max(0, (now - card.last) / DAY);
  return Math.pow(1 + FACTOR * t / card.s, DECAY);
}

/* оценка: 1 — забыл, 2 — трудно, 3 — хорошо, 4 — легко; возвращает интервал в днях */
export function schedule(card, g, now = Date.now()) {
  if (!card.s) { card.s = W[g - 1]; card.d = d0(g); }
  else {
    const t = Math.max(0, (now - card.last) / DAY);
    const r = Math.pow(1 + FACTOR * t / card.s, DECAY);
    let d = card.d - W[6] * (g - 3) * (10 - card.d) / 9;
    card.d = clampD(W[7] * d0(4) + (1 - W[7]) * d);
    if (t < 1) card.s = card.s * Math.exp(W[17] * (g - 3 + W[18]));
    else if (g === 1) card.s = Math.min(card.s, W[11] * Math.pow(card.d, -W[12]) * (Math.pow(card.s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
    else card.s = card.s * (1 + Math.exp(W[8]) * (11 - card.d) * Math.pow(card.s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * (g === 2 ? W[15] : 1) * (g === 4 ? W[16] : 1));
  }
  card.s = Math.max(0.1, card.s);
  card.reps = (card.reps || 0) + 1;
  if (g === 1) card.lapses = (card.lapses || 0) + 1;
  card.last = now;
  const days = g === 1 ? 1 : Math.max(1, Math.round(card.s / FACTOR * (Math.pow(RETENTION, 1 / DECAY) - 1)));
  card.due = now + days * DAY;
  return days;
}

/* --- колода --- */
export { addCard };
export function removeCard(id) { delete S.srs.cards[id]; save(); }

const dayOf = ts => today(new Date(ts));
export function dueCards(now = Date.now()) {
  const t = today(new Date(now));
  return Object.values(S.srs.cards).filter(c => dayOf(c.due) <= t);
}
export const dueCount = () => dueCards().length;
export const cardCount = () => Object.keys(S.srs.cards).length;

/* вперемешку: по очереди из каждого источника, внутри — самые просроченные первыми */
function interleave(cards) {
  const by = {};
  for (const c of cards.sort((a, b) => a.due - b.due)) (by[c.kind] = by[c.kind] || []).push(c);
  const out = [], kinds = Object.keys(by);
  while (kinds.some(k => by[k].length)) for (const k of kinds) if (by[k].length) out.push(by[k].shift());
  return out;
}

const KIND_RU = { lec: "Лекция", drill: "Урок", op: "Дебют", pz: "Задача", gm: "Ваша партия" };

/* содержимое карточки: позиция, что нужно сделать и что считается верным */
export function cardContent(card) {
  const r = card.ref;
  try {
    if (card.kind === "lec") {
      const lec = lectureById(r.l);
      const s = lec && resolveLecture(lec)[r.i];
      if (!s) return null;
      const base = { src: `${lec.i} ${lec.t}`, prompt: s.task, explain: s.after || "", fen: s.start };
      if (s.t === "square") return { ...base, type: "square", squares: s.sq || [], files: s.files || [] };
      if (s.seq) return { ...base, type: "move", moves: s.moves };
      return { ...base, type: "move", moves: [s.ans[0]], accept: s.ans, mate: !!s.mate };
    }
    if (card.kind === "drill") {
      const l = LESSONS.find(x => x.id === r.l);
      const d = l && l.drills[r.i];
      if (!d) return null;
      return { src: `${l.i} ${l.t}`, prompt: d.task, explain: d.after || "", fen: d.fen, type: "move", moves: d.moves || [], mate: d.any === "mate", check: d.any === "check" };
    }
    if (card.kind === "op") {
      const o = OPENINGS_LIB.find(x => x.id === r.o);
      if (!o) return null;
      const sans = o.moves.split(" ");
      const c = makeChess();
      for (let i = 0; i < r.ply; i++) c.move(sans[i]);
      const fen = c.fen();
      const m = c.move(sans[r.ply]);
      return { src: `${o.i} ${o.t}`, prompt: `Дебют «${o.t}»: ход по теории`, explain: o.notes[r.ply] || "", fen, type: "move", moves: [uciOf(m)], flip: o.user === "b" };
    }
    if (card.kind === "pz") {
      const p = puzzleById(r);
      if (!p) return null;
      return { src: "🧩 Задача, где вы ошиблись", prompt: "Найдите лучшее продолжение", explain: "", type: "puzzle", puzzle: p };
    }
    if (card.kind === "gm") {
      const g = S.games.find(x => x.id === r.g);
      if (!g) return null;
      const moves = g.moves.split(" ");
      const c = makeChess(g.startFen || START_FEN);
      for (let i = 0; i < r.i; i++) playUci(c, moves[i]);
      const fen = c.fen();
      const played = sanList(fen, [moves[r.i]])[0];
      const opp = g.user === "w" ? g.black.name : g.white.name;
      return { src: `🎯 Партия против ${opp}`, prompt: `Здесь вы сыграли ${figSan(played || "?")}. Найдите ход сильнее`, explain: "", fen, type: "move", moves: [r.best], flip: g.user === "b" };
    }
  } catch { return null; }
  return null;
}

/* --- экран повторения --- */
export function viewSrs(el) {
  const due = dueCards();
  if (!due.length) { drawEmpty(el); return; }
  document.body.classList.add("immersive");
  setActive("srs");
  const queue = interleave(due).slice(0, 40);
  const total = queue.length;
  let done = 0, right = 0, runner = null, board = null, t0 = 0;
  const relearn = new Set();
  el.innerHTML = `<div class="play">
    <div class="play-main">
      <div class="gtop"><button class="back" data-back>←</button><div class="tt">Повторение</div><div class="b" id="sCnt" style="padding-right:6px"></div></div>
      <div class="board-col"><div id="sBoard"></div></div>
    </div>
    <aside class="side">
      <div class="side-head desk-only"><button class="back" data-back style="width:32px;height:32px">←</button><b style="flex:1">🔁 Повторение</b><span class="b" id="sCnt2"></span></div>
      <div class="side-body" style="padding:12px;display:flex;flex-direction:column;gap:10px" id="sInfo"></div>
      <div class="side-foot"><div class="ctrl" id="sCtrl"></div></div>
    </aside></div>`;
  $$("[data-back]", el).forEach(b => b.onclick = () => go("learn"));
  const info = $("#sInfo", el), ctrl = $("#sCtrl", el);
  const counter = () => { const t = `${done}/${total}`; $("#sCnt", el).textContent = t; $("#sCnt2", el).textContent = t; };

  function finishCard(card, g, content, extra = "") {
    const isRelearn = relearn.has(card.id);
    let days = null;
    if (!isRelearn) {
      days = schedule(card, g);
      S.srs.log.push({ ts: Date.now(), id: card.id, g });
      S.srs.total = (S.srs.total || 0) + 1;
      if (S.srs.total >= 100) unlock("srs-100");
      if (S.srs.log.length > 600) S.srs.log.splice(0, S.srs.log.length - 600);
      done++;
      if (g > 1) right++;
      save();
    }
    if (g === 1 && !isRelearn) { relearn.add(card.id); queue.push(card); }
    counter();
    const ok = g > 1;
    info.insertAdjacentHTML("beforeend", `<div class="pz-head ${ok ? "ok" : "bad"}"><div class="tx">${ok ? (g === 4 ? "Легко! ✓" : g === 2 ? "Верно, но с подсказкой" : "Верно ✓") : "Не получилось"}</div></div>
      ${content.explain ? `<div class="small">${esc(content.explain)}</div>` : ""}${extra}
      ${days ? `<div class="tiny muted">Следующее повторение через ${days} ${plural(days, "день", "дня", "дней")}</div>` : isRelearn ? `<div class="tiny muted">Повтор для закрепления</div>` : ""}
      ${g === 1 ? `<div class="tiny muted">Карточка вернётся в конце сессии и завтра.</div>` : ""}`);
    ctrl.innerHTML = `<button class="on" id="sNext" style="max-width:none;flex:1">▶<small>Дальше</small></button>`;
    $("#sNext", el).onclick = next;
  }

  function next() {
    if (runner) { runner.destroy(); runner = null; }
    if (board) { board.destroy(); board = null; }
    const card = queue.shift();
    if (!card) { summary(); return; }
    const c = cardContent(card);
    if (!c) { removeCard(card.id); next(); return; }
    counter();
    let hinted = false, failed = false;
    info.innerHTML = `<div class="tiny muted">${esc(KIND_RU[card.kind] || "")} · ${esc(c.src)}${relearn.has(card.id) ? " · повтор" : ""}</div>
      <div class="pz-head"><div class="tx">${esc(c.prompt)}</div></div>`;
    ctrl.innerHTML = `<button data-c="hint">💡<small>Подсказка</small></button><button data-c="show">👁<small>Ответ</small></button>`;
    const grade = () => { const sec = (performance.now() - t0) / 1000; return failed ? 1 : hinted ? 2 : sec < 8 ? 4 : 3; };
    if (c.type === "square") {
      const target = new Set(c.squares);
      board = new Board($("#sBoard", el), { fen: c.fen, coords: S.settings.coords, set: S.settings.pieces, orientation: c.fen.split(" ")[1] === "b" ? "b" : "w", anim: false });
      board.set({ movable: null });
      const correct = sq => target.has(sq) || (c.files || []).includes(sq[0]);
      board.el.addEventListener("pointerdown", e => {
        if (board.answered) return;
        const sq = board.sqAt(e.clientX, e.clientY);
        if (!sq) return;
        if (correct(sq)) {
          board.answered = true;
          board.set({ marks: { [sq]: "hl-green" } });
          snd("right");
          finishCard(card, grade(), c);
        } else {
          failed = true;
          board.set({ marks: { [sq]: "hl-red" } });
          snd("wrong");
          board.shake();
        }
      });
      $$("button", ctrl).forEach(b => b.onclick = () => {
        const marks = {};
        c.squares.forEach(s => marks[s] = "hl-green");
        if (b.dataset.c === "hint") { hinted = true; board.set({ marks: { [c.squares[0] || c.files[0] + "4"]: "hl-blue" } }); }
        else { failed = true; board.answered = true; board.set({ marks }); finishCard(card, 1, c); }
      });
      t0 = performance.now();
      return;
    }
    const p = c.type === "puzzle" ? c.puzzle : {
      id: "card", fen: c.fen, moves: c.moves, selfStart: true, themes: [],
      altOk: (before, uci) => {
        if (c.accept && c.accept.includes(uci)) return true;
        if (c.check) { const x = makeChess(before); return !!playUci(x, uci) && x.inCheck(); }
        return false;
      },
    };
    runner = new PuzzleRunner($("#sBoard", el), p, {
      onReady: () => { if (!t0) t0 = performance.now(); },
      onWrong: () => { failed = true; },
      onSolved: r => {
        if (r.failed && !failed && !hinted) failed = true;
        const line = r.solutionSan();
        finishCard(card, grade(), c, line ? `<div class="small muted">Решение: <b style="color:var(--text)">${esc(line)}</b></div>` : "");
      },
    });
    if (c.flip) runner.board.set({ orientation: "b" });
    t0 = 0;
    runner.start();
    $$("button", ctrl).forEach(b => b.onclick = () => {
      if (b.dataset.c === "hint") { hinted = true; runner.hint(); }
      else { failed = true; runner.showSolution(); }
    });
  }

  function summary() {
    activity("lessons");
    checkStreakAch();
    const tomorrow = Object.values(S.srs.cards).filter(c => dayOf(c.due) === today(new Date(Date.now() + DAY))).length;
    $("#sBoard", el).innerHTML = "";
    info.innerHTML = `<div style="text-align:center"><div style="font-size:44px">✅</div><div class="b" style="font-size:20px">Повторение закончено</div>
      <div class="muted" style="margin-top:6px">Верно ${right} из ${done}. Завтра — ${tomorrow} ${plural(tomorrow, "карточка", "карточки", "карточек")}.</div></div>
      <p class="small muted">Каждая карточка возвращается тогда, когда вы почти готовы её забыть: так память укрепляется сильнее всего, а времени уходит меньше.</p>`;
    ctrl.innerHTML = `<button class="on" style="max-width:none;flex:1" data-c="hub">✓<small>К обучению</small></button>`;
    $("[data-c=hub]", ctrl).onclick = () => go("learn");
  }

  next();
  return () => { runner && runner.destroy(); board && board.destroy(); };
}

function drawEmpty(el) {
  const cards = Object.values(S.srs.cards);
  const byKind = k => cards.filter(c => c.kind === k).length;
  const next = cards.length ? Math.min(...cards.map(c => c.due)) : null;
  const mature = cards.filter(c => c.s >= 21).length;
  el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Повторение</h1></div>
    <div class="card" style="text-align:center"><div style="font-size:44px">${cards.length ? "🎉" : "🗂"}</div>
      <div class="b" style="font-size:18px">${cards.length ? "На сегодня всё повторено" : "Карточек пока нет"}</div>
      <div class="muted small" style="margin-top:4px">${next ? `Следующее повторение: ${new Date(next).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}` : "Пройдите лекцию, урок или разберите партию — ключевые позиции попадут сюда."}</div></div>
    <div class="grid3" style="margin-top:12px">
      <div class="stat"><div class="v">${cards.length}</div><div class="l">карточек</div></div>
      <div class="stat"><div class="v">${mature}</div><div class="l">выучено (3+ нед.)</div></div>
      <div class="stat"><div class="v">${S.srs.log.filter(l => dayOf(l.ts) === today()).length}</div><div class="l">сегодня</div></div>
    </div>
    <div class="card" style="margin-top:12px"><h2>Откуда карточки</h2>
      <div class="small muted" style="line-height:1.8">🎓 Лекции: ${byKind("lec")} · 📘 Уроки: ${byKind("drill")} · 📖 Дебюты: ${byKind("op")} · 🧩 Задачи с ошибкой: ${byKind("pz")} · 🎯 Ваши партии: ${byKind("gm")}</div>
      <p class="small muted" style="margin:8px 0 0">Расписание строит FSRS — тот же алгоритм, что в Anki. Позиция возвращается, когда вероятность её вспомнить падает до 90%: сначала через день-три, потом через недели и месяцы.</p></div>`;
}
