/* Задачи: рейтинговые, «Штурм», задача дня, по темам, работа над ошибками
   и задачи из собственных партий. Первый ход в задаче — ошибка соперника,
   его приложение делает само, дальше ищешь лучшее продолжение. */
import { $, $$, esc, modal, toast, plural, today, seeded, hashId, sleep, fmtClock } from "./util.js";
import { S, save, activity, setActive, unlock, checkStreakAch } from "./store.js";
import { Board } from "./board.js";
import { makeChess, dests, playUci, checkSquare, figSan, sanList, parseUci } from "./chessutil.js";
import { play as snd, moveSound } from "./sound.js";
import { go } from "./router.js";
import { PUZZLES } from "../data/puzzles.js";
import { unpackCls } from "./review.js";

export const THEMES = {
  mate: ["Мат", "Найдите форсированный мат"],
  mateIn1: ["Мат в 1 ход", "Один ход — и партия окончена"],
  mateIn2: ["Мат в 2 хода", "Шах, ответ соперника, мат"],
  mateIn3: ["Мат в 3 хода", "Комбинация на три хода"],
  mateIn4: ["Мат в 4 хода", "Длинная матовая атака"],
  mateIn5: ["Мат в 5 ходов", "Очень длинная матовая атака"],
  backRankMate: ["Мат по последней горизонтали", "Король заперт своими пешками"],
  smotheredMate: ["Спёртый мат", "Конь матует короля, окружённого своими фигурами"],
  fork: ["Вилка", "Одна фигура нападает на две"],
  pin: ["Связка", "Фигура не может уйти — за ней король или ферзь"],
  skewer: ["Сквозной удар", "Нападение на ценную фигуру, за которой стоит другая"],
  discoveredAttack: ["Вскрытое нападение", "Уходящая фигура открывает удар другой"],
  doubleCheck: ["Двойной шах", "Шах сразу двумя фигурами — спасает только ход королём"],
  hangingPiece: ["Висящая фигура", "Заберите то, что плохо лежит"],
  sacrifice: ["Жертва", "Отдать материал ради атаки"],
  promotion: ["Превращение пешки", "Проведите пешку в ферзи"],
  underPromotion: ["Слабое превращение", "Иногда конь лучше ферзя"],
  quietMove: ["Тихий ход", "Не шах и не взятие, но решает"],
  enPassant: ["Взятие на проходе", "Редкое правило в деле"],
  crushing: ["Выигрыш материала", "Комбинация с решающим перевесом"],
  opening: ["Дебют", "Ловушки первых ходов"],
  middlegame: ["Миттельшпиль", "Тактика в середине партии"],
  endgame: ["Эндшпиль", "Точность в окончании"],
  oneMove: ["В один ход", "Быстрые задачи"],
  short: ["Короткие", "Решение в 2 хода"],
  long: ["Длинные", "Решение в 3 хода"],
  veryLong: ["Очень длинные", "4 хода и больше"],
};
export const THEME_ORDER = ["mateIn1", "mateIn2", "mateIn3", "mateIn4", "backRankMate", "smotheredMate", "fork", "pin", "skewer", "discoveredAttack",
  "doubleCheck", "hangingPiece", "sacrifice", "quietMove", "promotion", "underPromotion", "crushing", "opening", "middlegame", "endgame", "oneMove", "short", "long", "veryLong"];

/* --- база --- */
export const ALL = PUZZLES.map(([fen, moves, rating, themes]) => ({
  id: hashId(fen + moves), fen, moves: moves.split(" "), rating, themes: themes.split(" "),
}));
const byId = new Map(ALL.map(p => [p.id, p]));
export const puzzleById = id => byId.get(id);
export function themeCount(t) { return ALL.filter(p => p.themes.includes(t)).length; }

export function pickPuzzle({ theme = null, near = null, exclude = new Set(), allowDone = false } = {}) {
  const r = near ?? S.ratings.puzzle.r;
  let pool = ALL.filter(p => !exclude.has(p.id) && (!theme || p.themes.includes(theme)));
  const fresh = pool.filter(p => !S.puzzles.done[p.id]);
  if (fresh.length) pool = fresh;
  else if (!allowDone && !pool.length) return null;
  pool.sort((a, b) => Math.abs(a.rating - r) - Math.abs(b.rating - r));
  const top = pool.slice(0, Math.min(pool.length, 12));
  return top[Math.floor(Math.random() * top.length)] || null;
}

export function dailyPuzzle() {
  if (!ALL.length) return null;
  const d = today();
  const rnd = seeded(+d.replace(/-/g, ""));
  const pool = ALL.filter(p => p.rating >= 1000 && p.rating <= 1900 && p.moves.length >= 4);
  const list = pool.length ? pool : ALL;
  const p = list[Math.floor(rnd() * list.length)];
  return { ...p, date: d };
}

/* --- рейтинг задач: Эло с K, убывающим по числу решённых --- */
function ratePuzzle(p, ok) {
  const R = S.ratings.puzzle;
  const K = R.n < 20 ? 40 : R.n < 60 ? 24 : 16;
  const exp = 1 / (1 + Math.pow(10, (p.rating - R.r) / 400));
  let d = Math.round(K * ((ok ? 1 : 0) - exp));
  if (d === 0) d = ok ? 1 : -1;
  R.r = Math.max(100, R.r + d);
  R.n++;
  R.best = Math.max(R.best, R.r);
  if (R.r >= 1500) unlock("pz-1500");
  if (R.r >= 2000) unlock("pz-2000");
  return d;
}

function record(p, ok, { rated = true, mode = "rated" } = {}) {
  const P = S.puzzles;
  const first = !P.done[p.id];
  let delta = 0;
  if (rated && first) delta = ratePuzzle(p, ok);
  P.done[p.id] = [ok ? 1 : 0, Date.now()];
  for (const t of p.themes) {
    const s = P.themes[t] || (P.themes[t] = [0, 0]);
    if (first) { s[1]++; if (ok) s[0]++; }
  }
  if (!ok && !P.retry.includes(p.id)) P.retry.push(p.id);
  if (ok && mode === "retry") P.retry = P.retry.filter(x => x !== p.id);
  if (ok) { P.streak = (P.streak || 0) + 1; P.bestStreak = Math.max(P.bestStreak || 0, P.streak); }
  else P.streak = 0;
  if (P.streak >= 5) unlock("streak-5");
  P.history.push({ id: p.id, ok: ok ? 1 : 0, r: S.ratings.puzzle.r, ts: Date.now() });
  if (P.history.length > 400) P.history.splice(0, P.history.length - 400);
  const solved = Object.values(P.done).filter(x => x[0]).length;
  if (solved >= 10) unlock("pz-10");
  if (solved >= 100) unlock("pz-100");
  activity("puzzles");
  checkStreakAch();
  save();
  return delta;
}

/* ======================================================================= */
/* Решатель одной задачи. onResult(ok) вызывается один раз — на первой
   ошибке (ok=false) или при решении без ошибок (ok=true). */
export class PuzzleRunner {
  constructor(boardEl, p, o = {}) {
    this.p = p; this.o = o;
    this.chess = makeChess(p.fen);
    this.idx = 0; this.failed = false; this.done = false; this.reported = false; this.hints = 0;
    this.solver = this.chess.turn() === "w" ? "b" : "w";
    if (p.selfStart) this.solver = this.chess.turn();     // задачи из своих партий: без хода соперника
    this.board = new Board(boardEl, {
      orientation: this.solver, coords: S.settings.coords, legal: S.settings.legal, anim: S.settings.anim,
      set: S.settings.pieces, autoQueen: S.settings.autoQueen, fen: p.fen,
      onMove: (f, t, pr) => this.userMove(f, t, pr),
    });
    this.board.set({ movable: null });
    this.gen = 0;
  }

  async start() {
    const g = this.gen;
    if (this.p.selfStart) { this.ready(); return; }
    await sleep(this.o.fast ? 250 : 650);
    if (g !== this.gen) return;
    this.autoMove();
    this.ready();
  }

  autoMove() {
    const m = playUci(this.chess, this.p.moves[this.idx]);
    this.idx++;
    this.board.set({ fen: this.chess.fen(), lastMove: [m.from, m.to], check: checkSquare(this.chess) });
    moveSound(m, this.chess);
  }

  ready() {
    this.board.set({ turn: this.chess.turn(), movable: { color: this.solver, dests: dests(this.chess) } });
    this.o.onReady && this.o.onReady(this);
  }

  userMove(from, to, promo) {
    if (this.done) return;
    const expected = this.p.moves[this.idx];
    const before = this.chess.fen();
    let m;
    try { m = this.chess.move({ from, to, promotion: promo }); } catch { m = null; }
    if (!m) { this.board.set({ fen: before }); return; }
    const uci = m.from + m.to + (m.promotion || "");
    const isMate = this.chess.isCheckmate();
    const correct = uci === expected || isMate || (this.p.altOk && this.p.altOk(before, uci));
    if (!correct) {
      this.chess.undo();
      snd("wrong");
      this.board.flash(to, false);
      this.board.shake();
      this.board.set({ movable: null, shapes: [] });
      setTimeout(() => {
        if (this.done) return;
        this.board.set({ fen: this.chess.fen(), lastMove: this.lastAuto(), check: checkSquare(this.chess) });
        if (!this.o.noRetry) this.board.set({ turn: this.chess.turn(), movable: { color: this.solver, dests: dests(this.chess) } });
      }, 550);
      if (!this.failed) { this.failed = true; this.report(false); }
      this.o.onWrong && this.o.onWrong(this, uci);
      return;
    }
    moveSound(m, this.chess);
    this.board.set({ fen: this.chess.fen(), lastMove: [m.from, m.to], check: checkSquare(this.chess), shapes: [] });
    this.board.flash(to, true);
    this.idx++;
    this.hintStage = 0;
    if (this.idx >= this.p.moves.length || isMate) { this.solve(); return; }
    this.board.set({ movable: null });
    this.o.onRight && this.o.onRight(this);
    const g = this.gen;
    setTimeout(() => {
      if (g !== this.gen || this.done) return;
      this.autoMove();
      if (this.idx >= this.p.moves.length) { this.solve(); return; }
      this.ready();
    }, this.o.fast ? 250 : 450);
  }

  lastAuto() {
    const h = this.chess.history({ verbose: true });
    const l = h[h.length - 1];
    return l ? [l.from, l.to] : null;
  }

  solve() {
    this.done = true;
    this.board.set({ movable: null });
    snd("right");
    if (!this.failed) this.report(true);
    this.o.onSolved && this.o.onSolved(this);
  }

  report(ok) {
    if (this.reported) return;
    this.reported = true;
    this.o.onResult && this.o.onResult(ok, this);
  }

  hint() {
    if (this.done) return;
    const u = this.p.moves[this.idx];
    if (!u) return;
    this.hints++;
    if (!this.failed) { this.failed = true; this.report(false); }
    this.hintStage = (this.hintStage || 0) + 1;
    const { from, to } = parseUci(u);
    this.board.set({ shapes: this.hintStage === 1 ? [{ from, color: "blue" }] : [{ from, to, color: "blue" }] });
  }

  async showSolution() {
    if (this.done) return;
    if (!this.failed) { this.failed = true; this.report(false); }
    this.done = true;
    this.gen++;
    this.board.set({ movable: null });
    while (this.idx < this.p.moves.length) {
      const u = this.p.moves[this.idx];
      const { from, to } = parseUci(u);
      this.board.set({ shapes: [{ from, to, color: "green" }] });
      await sleep(500);
      this.autoMove();
      this.board.set({ shapes: [] });
      await sleep(400);
    }
    this.o.onSolved && this.o.onSolved(this);
  }

  solutionSan() {
    const c = makeChess(this.p.fen);
    const moves = this.p.selfStart ? this.p.moves : this.p.moves.slice(1);
    if (!this.p.selfStart) playUci(c, this.p.moves[0]);
    return sanList(c.fen(), moves).map(figSan).join(" ");
  }

  destroy() { this.gen++; this.board.destroy(); }
}

/* ======================================================================= */
function spark(hist) {
  const pts = hist.slice(-60).map(h => h.r);
  if (pts.length < 2) return "";
  const min = Math.min(...pts), max = Math.max(...pts), w = 300, h = 60;
  const d = pts.map((v, i) => `${(i / (pts.length - 1) * w).toFixed(1)},${(h - 4 - (v - min) / Math.max(1, max - min) * (h - 8)).toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:60px;display:block"><polyline points="${d}" fill="none" stroke="#81b64c" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
}

export function viewPuzzles(el) {
  const P = S.puzzles, R = S.ratings.puzzle;
  const solved = Object.values(P.done).filter(x => x[0]).length;
  const daily = dailyPuzzle();
  const mine = myMistakes();
  el.innerHTML = `
    <div class="topbar"><h1>Задачи</h1></div>
    <div class="card">
      <div class="row"><div style="font-size:34px">🧩</div><div style="flex:1"><div class="muted small">Рейтинг в задачах</div><div style="font-size:30px;font-weight:800;line-height:1.1">${R.r}</div></div>
      <div style="text-align:right" class="small muted">Решено: <b style="color:var(--text)">${solved}</b><br>Серия: <b style="color:var(--text)">${P.streak || 0}</b> · рекорд ${P.bestStreak || 0}</div></div>
      ${spark(P.history)}
      <button class="btn primary big block" style="margin-top:10px" data-go="puzzle/rated">Решать задачи</button>
    </div>
    <div class="sec-title">Режимы</div>
    <div class="tiles">
      <button class="tile" data-go="rush"><div class="ti">🏃</div><div><div class="tt">Штурм</div><div class="ts">Сколько решишь за 3 или 5 минут? Три ошибки — конец</div></div><div class="tr">🏆 ${Math.max(S.rush.best.r3, S.rush.best.r5, S.rush.best.surv)}</div></button>
      <button class="tile" data-go="puzzle/daily"><div class="ti">📅</div><div><div class="tt">Задача дня</div><div class="ts">${daily && P.daily[daily.date]?.solved ? "✅ Решена сегодня" : "Одна задача на всех, каждый день новая"}</div></div></button>
      <button class="tile" data-go="puzzle/retry"><div class="ti">🔁</div><div><div class="tt">Работа над ошибками</div><div class="ts">Задачи, где ошибся: ${P.retry.length}</div></div></button>
      <button class="tile" data-go="puzzle/mine"><div class="ti">🎯</div><div><div class="tt">Задачи из моих партий</div><div class="ts">${mine.length ? `Ошибки из разобранных партий: ${mine.length}` : "Разберите партию — здесь появятся ваши ошибки"}</div></div></button>
    </div>
    <div class="sec-title">По темам</div>
    <div class="tiles">${THEME_ORDER.filter(t => themeCount(t)).map(t => {
      const s = P.themes[t];
      return `<button class="tile" data-go="puzzle/theme/${t}"><div style="min-width:0;flex:1"><div class="tt">${THEMES[t][0]}</div><div class="ts">${THEMES[t][1]}</div></div>
        <div class="tr">${themeCount(t)}${s && s[1] ? `<div class="tiny ${s[0] / s[1] >= 0.7 ? "green" : s[0] / s[1] < 0.5 ? "red" : ""}">${Math.round(s[0] / s[1] * 100)}%</div>` : ""}</div></button>`;
    }).join("")}</div>`;
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
}

/* ошибки пользователя из разобранных партий — как задачи «найди лучший ход» */
export function myMistakes() {
  const out = [];
  for (const g of S.games) {
    if (!g.review || !g.user || !g.moves) continue;
    const moves = g.moves.split(" ");
    const best = g.review.best.split(" ");
    const c = makeChess(g.startFen);
    for (let i = 0; i < moves.length; i++) {
      const cls = unpackCls(g.review.cls[i]);
      const mover = c.turn();
      if (mover === g.user && ["mistake", "blunder", "miss"].includes(cls) && best[i]) {
        const fen = c.fen();
        out.push({ id: "g" + g.id + "-" + i, fen, moves: [best[i]], rating: null, themes: [], selfStart: true, game: g, ply: i, cls });
      }
      if (!playUci(c, moves[i])) break;
    }
    if (out.length > 60) break;
  }
  return out;
}

/* --- экран решения: rated | daily | retry | mine | theme/<t> | id/<id> --- */
export function viewPuzzle(el, arg) {
  document.body.classList.add("immersive");
  setActive("puzzles");
  const [mode, sub] = arg.split("/");
  const exclude = new Set();
  let runner = null, cur = null, queue = null;
  if (mode === "mine") queue = myMistakes();
  if (mode === "retry") queue = S.puzzles.retry.map(puzzleById).filter(Boolean);
  const title = mode === "daily" ? "Задача дня" : mode === "retry" ? "Работа над ошибками" : mode === "mine" ? "Задачи из моих партий" : mode === "theme" ? THEMES[sub]?.[0] || "Тема" : "Задачи";

  el.innerHTML = `<div class="play">
    <div class="play-main">
      <div class="gtop"><button class="back" id="pzBack">←</button><div class="tt">${esc(title)}</div><div class="b" id="pzRt" style="padding-right:6px">🧩 ${S.ratings.puzzle.r}</div></div>
      <div class="board-col"><div id="pzBoard"></div></div>
    </div>
    <aside class="side">
      <div class="side-head desk-only"><button class="back" id="pzBack2" style="width:32px;height:32px">←</button><b style="flex:1">${esc(title)}</b><span class="b" id="pzRt2">🧩 ${S.ratings.puzzle.r}</span></div>
      <div class="side-body" style="padding:12px;display:flex;flex-direction:column;gap:10px" id="pzInfo"></div>
      <div class="side-foot"><div class="ctrl" id="pzCtrl"></div></div>
    </aside></div>`;
  const back = () => go("puzzles");
  $("#pzBack", el).onclick = back; $("#pzBack2", el).onclick = back;

  const info = $("#pzInfo", el), ctrl = $("#pzCtrl", el);
  const setRating = () => { $("#pzRt", el).textContent = "🧩 " + S.ratings.puzzle.r; $("#pzRt2", el).textContent = "🧩 " + S.ratings.puzzle.r; };

  function head(cls, text) {
    const who = runner ? runner.solver : "w";
    return `<div class="pz-head ${cls}"><div class="who ${who}"></div><div class="tx">${text}</div></div>`;
  }

  function next() {
    if (runner) runner.destroy();
    let p = null;
    if (mode === "daily") p = dailyPuzzle();
    else if (mode === "id") p = puzzleById(sub);
    else if (queue) { p = queue.find(x => !exclude.has(x.id)) || null; }
    else p = pickPuzzle({ theme: mode === "theme" ? sub : null, exclude });
    if (!p) {
      info.innerHTML = `<div class="empty">${mode === "retry" ? "Ошибок для повторения нет — отлично!" : mode === "mine" ? "Пока нет ошибок из разобранных партий. Сыграйте и разберите партию." : "Задачи в этой подборке закончились."}</div>
        <button class="btn primary block" id="toHub">К задачам</button>`;
      $("#toHub", info).onclick = back;
      ctrl.innerHTML = "";
      $("#pzBoard", el).innerHTML = "";
      return;
    }
    cur = p;
    exclude.add(p.id);
    const rated = mode !== "mine" && mode !== "daily" ? !S.puzzles.done[p.id] : false;
    runner = new PuzzleRunner($("#pzBoard", el), p, {
      onReady: r => {
        if (r.idx <= 1 || p.selfStart) info.innerHTML = head("", `Ход ${r.solver === "w" ? "белых" : "чёрных"}`) + `<div class="small muted">${p.selfStart ? `Вы сыграли здесь хуже. Найдите лучший ход.` : "Найдите лучшее продолжение."}${rated ? ` Рейтинг задачи скрыт до решения.` : ""}</div>`;
        else info.innerHTML = head("ok", "Верно! Продолжайте") + `<div class="small muted">Найдите следующий ход.</div>`;
      },
      onWrong: () => { info.innerHTML = head("bad", "Неверно") + `<div class="small muted">Попробуйте ещё раз или посмотрите решение.</div>`; drawCtrl(); },
      onResult: ok => {
        let d = 0;
        if (mode === "mine") { /* без рейтинга */ }
        else if (mode === "daily") {
          if (!S.puzzles.daily[p.date]) S.puzzles.daily[p.date] = { solved: ok };
          record(p, ok, { rated: false, mode });
        } else d = record(p, ok, { rated, mode });
        cur.delta = d;
        setRating();
      },
      onSolved: r => {
        const ok = !r.failed;
        const themes = p.themes.filter(t => THEMES[t]).map(t => `<span class="tag">${THEMES[t][0]}</span>`).join(" ");
        info.innerHTML = head(ok ? "ok" : "", ok ? "Решено!" : "Решение") +
          `${cur.delta ? `<div class="b ${cur.delta > 0 ? "green" : "red"}" style="font-size:18px">${cur.delta > 0 ? "+" : ""}${cur.delta} → ${S.ratings.puzzle.r}</div>` : ""}
          <div class="small muted">Решение: <b style="color:var(--text)">${esc(r.solutionSan())}</b></div>
          ${p.rating ? `<div class="small muted">Рейтинг задачи: ${p.rating}</div>` : ""}
          ${themes ? `<div class="chips">${themes}</div>` : ""}
          ${p.game ? `<button class="btn sm" id="toGame">Открыть партию</button>` : ""}`;
        $("#toGame", info)?.addEventListener("click", () => go(`review/${p.game.id}?ply=${p.ply}`));
        drawCtrl(true);
      },
    });
    runner.start();
    drawCtrl();
  }

  function drawCtrl(finished = false) {
    if (!runner) return;
    const isLast = mode === "daily" || mode === "id";
    ctrl.innerHTML = finished
      ? `<button data-c="analyse">🔬<small>Анализ</small></button>${!isLast ? `<button data-c="next" class="on" style="max-width:none;flex:2">▶<small>Следующая</small></button>` : `<button data-c="hub" class="on" style="max-width:none;flex:2">✓<small>К задачам</small></button>`}`
      : `<button data-c="hint">💡<small>Подсказка</small></button><button data-c="sol">👁<small>Решение</small></button>${!isLast ? `<button data-c="skip">⏭<small>Пропустить</small></button>` : ""}`;
    $$("button", ctrl).forEach(b => b.onclick = () => {
      const c = b.dataset.c;
      if (c === "hint") runner.hint();
      if (c === "sol") runner.showSolution();
      if (c === "skip") { if (!runner.reported && mode !== "mine") { runner.failed = true; runner.report(false); } next(); }
      if (c === "next") next();
      if (c === "hub") back();
      if (c === "analyse") {
        go(`analysis?fen=${encodeURIComponent(cur.fen)}&moves=${encodeURIComponent(cur.moves.join(" "))}`);
      }
    });
  }

  next();
  return () => runner && runner.destroy();
}

/* --- Штурм --- */
export function viewRush(el, arg) {
  if (!arg) {
    const B = S.rush.best;
    el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Штурм</h1></div>
      <div class="card prose"><p>Решайте задачи на скорость: каждая следующая чуть сложнее. <b>Три ошибки — штурм окончен.</b> Рейтинг задач не меняется.</p></div>
      <div class="tiles" style="margin-top:12px">
        <button class="tile" data-m="r3"><div class="ti">⚡</div><div><div class="tt">3 минуты</div><div class="ts">Рекорд: ${B.r3}</div></div></button>
        <button class="tile" data-m="r5"><div class="ti">⏱</div><div><div class="tt">5 минут</div><div class="ts">Рекорд: ${B.r5}</div></div></button>
        <button class="tile" data-m="surv"><div class="ti">🛡</div><div><div class="tt">Выживание</div><div class="ts">Без времени, до трёх ошибок. Рекорд: ${B.surv}</div></div></button>
      </div>
      ${S.rush.runs.length ? `<div class="sec-title">Последние забеги</div><div class="card">${S.rush.runs.slice(-8).reverse().map(r => `<div class="row" style="justify-content:space-between;padding:4px 0"><span class="muted small">${{ r3: "3 минуты", r5: "5 минут", surv: "Выживание" }[r.m]} · ${new Date(r.ts).toLocaleDateString("ru-RU")}</span><b>${r.score}</b></div>`).join("")}</div>` : ""}`;
    $$("[data-m]", el).forEach(b => b.onclick = () => go("rush/" + b.dataset.m));
    return;
  }
  document.body.classList.add("immersive");
  setActive("puzzles");
  const mode = arg;
  const limit = mode === "r3" ? 180000 : mode === "r5" ? 300000 : null;
  let solved = 0, strikes = 0, results = [], runner = null, over = false, t0 = 0, timer = 0;
  const used = new Set();
  el.innerHTML = `<div class="play">
    <div class="play-main">
      <div class="gtop"><button class="back" id="rBack">←</button><div class="tt">Штурм</div></div>
      <div class="board-col"><div id="rBoard"></div></div>
    </div>
    <aside class="side">
      <div class="side-body" style="padding:12px;display:flex;flex-direction:column;gap:10px">
        <div class="row" style="justify-content:space-between"><div class="bigtimer" id="rTime">${limit ? fmtClock(limit) : "🛡"}</div>
        <div style="text-align:center"><div style="font-size:34px;font-weight:800" id="rScore">0</div><div class="tiny muted">решено</div></div>
        <div class="strikes" id="rStrikes"><i></i><i></i><i></i></div></div>
        <div id="rHead"></div>
        <div class="rushlist" id="rList"></div>
      </div>
      <div class="side-foot"><div class="ctrl"><button id="rStop">⏹<small>Закончить</small></button></div></div>
    </aside></div>`;
  $("#rBack", el).onclick = () => go("rush");
  $("#rStop", el).onclick = () => finish();
  const drawState = () => {
    $("#rScore", el).textContent = solved;
    $("#rStrikes", el).innerHTML = [0, 1, 2].map(i => `<i class="${i < strikes ? "x" : ""}">${i < strikes ? "✗" : ""}</i>`).join("");
    $("#rList", el).innerHTML = results.map(r => `<i class="${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"}</i>`).join("");
  };
  function nextP() {
    if (over) return;
    if (runner) runner.destroy();
    const target = 450 + solved * 55 + strikes * 20;
    const p = pickPuzzle({ near: target, exclude: used, allowDone: true }) || pickPuzzle({ near: target, exclude: new Set(), allowDone: true });
    if (!p) { finish(); return; }
    used.add(p.id);
    runner = new PuzzleRunner($("#rBoard", el), p, {
      fast: true, noRetry: true,
      onReady: r => { $("#rHead", el).innerHTML = `<div class="pz-head"><div class="who ${r.solver}"></div><div class="tx">Ход ${r.solver === "w" ? "белых" : "чёрных"}</div></div>`; },
      onResult: ok => {
        results.push({ id: p.id, ok });
        if (ok) solved++; else strikes++;
        drawState();
        if (strikes >= 3) setTimeout(finish, 600);
        else if (!ok) setTimeout(nextP, 700);
      },
      onSolved: () => { if (!runner.failed) setTimeout(nextP, 250); },
    });
    runner.start();
  }
  function finish() {
    if (over) return;
    over = true;
    clearInterval(timer);
    if (runner) runner.board.set({ movable: null });
    const B = S.rush.best;
    const rec = solved > (B[mode] || 0);
    if (rec) B[mode] = solved;
    S.rush.runs.push({ m: mode, score: solved, ts: Date.now() });
    if (S.rush.runs.length > 50) S.rush.runs.shift();
    if (solved >= 15) unlock("rush-15");
    if (solved >= 30) unlock("rush-30");
    activity("puzzles", Math.max(1, Math.round(solved / 3)));
    save();
    snd(rec ? "win" : "end");
    const m = modal(`<div class="gameover"><div style="font-size:48px">${rec ? "🏆" : "🏃"}</div><div class="res">${solved} ${plural(solved, "задача", "задачи", "задач")}</div>
      <div class="why">${rec ? "Новый рекорд!" : `Рекорд: ${B[mode]}`}</div>
      <div class="rushlist" style="justify-content:center;margin:12px 0">${results.map(r => `<i class="${r.ok ? "ok" : "bad"}" data-id="${r.id}" style="cursor:pointer">${r.ok ? "✓" : "✗"}</i>`).join("")}</div>
      <div class="small muted" style="margin-bottom:12px">Нажмите на задачу, чтобы решить её ещё раз.</div>
      <div class="grid2"><button class="btn primary" id="again">Ещё раз</button><button class="btn" id="hub">К задачам</button></div></div>`, { dismiss: false });
    $("#again", m).onclick = () => { m.close(); go("rush/" + mode); };
    $("#hub", m).onclick = () => { m.close(); go("puzzles"); };
    $$("[data-id]", m).forEach(i => i.onclick = () => { m.close(); go("puzzle/id/" + i.dataset.id); });
  }
  // отсчёт перед стартом
  const cd = modal(`<div style="text-align:center"><div class="muted">Штурм начинается</div><div style="font-size:64px;font-weight:800" id="cd">3</div></div>`, { dismiss: false });
  let n = 3;
  const cdT = setInterval(() => {
    n--;
    if (n > 0) { $("#cd", cd).textContent = n; snd("tick"); return; }
    clearInterval(cdT);
    cd.close();
    snd("start");
    t0 = performance.now();
    if (limit) timer = setInterval(() => {
      const left = limit - (performance.now() - t0);
      const te = $("#rTime", el);
      if (!te) return;
      te.textContent = fmtClock(left);
      te.style.color = left < 20000 ? "#ff7b6e" : "";
      if (left <= 0) finish();
    }, 100);
    nextP();
  }, 700);
  drawState();
  return () => { clearInterval(timer); clearInterval(cdT); over = true; runner && runner.destroy(); };
}
