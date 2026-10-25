/* Тренажёры шахматного зрения и мышления:
   координаты, «запомни позицию» (узнавание образов), «узнай мотив»,
   визуализация (ход в уме) и «угадай ход мастера» на классических партиях. */
import { $, $$, esc, plural, sleep, fmtClock, scoreOf, MATE } from "./util.js";
import { S, save, activity, setActive, unlock } from "./store.js";
import { Board, parseFen, pieceUrl } from "./board.js";
import { makeChess, dests, playUci, uciOf, checkSquare, sanList, sanLine, figSan, START_FEN } from "./chessutil.js";
import { ALL as PUZZLES, THEMES } from "./puzzles.js";
import { engine } from "./engine.js";
import { CLASSICS } from "../data/classics.js";
import { play as snd, moveSound } from "./sound.js";
import { go } from "./router.js";

const FILES = "abcdefgh";
const T = () => S.trainers;
const rnd = a => a[Math.floor(Math.random() * a.length)];
function used(id) {
  const u = T().used || (T().used = {});
  u[id] = (u[id] || 0) + 1;
  if (["coords", "memory", "motif", "visual", "classics"].every(k => u[k])) unlock("trainer-1");
  activity("lessons");
  save();
}

export const TRAINERS = [
  { id: "coords", i: "🔤", t: "Координаты", s: "Находите поля за 30 секунд — без этого не прочитать ни одну книгу и не посчитать вариант" },
  { id: "memory", i: "🧠", t: "Запомни позицию", s: "Позиция показывается на несколько секунд — восстановите её. Так тренируется узнавание образов" },
  { id: "motif", i: "👁", t: "Узнай мотив", s: "Какой приём решает? Быстрое узнавание тактики — главное отличие сильных игроков" },
  { id: "visual", i: "🌫", t: "Визуализация", s: "Ходы не показаны на доске — найдите ответ в уме" },
  { id: "classics", i: "📜", t: "Угадай ход мастера", s: "Играйте за Морфи, Андерсена, Фишера и сравнивайте свои ходы с ходами мастеров" },
];

export function viewTrainers(el) {
  const best = { coords: Math.max(T().coords?.w || 0, T().coords?.b || 0), memory: T().memory?.best, motif: T().motif?.best, visual: T().visual?.best };
  el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Тренажёры</h1></div>
    <p class="small muted" style="margin:-6px 2px 12px">Короткие упражнения на 2–5 минут. Шахматная сила во многом — это быстрое узнавание позиций и точный счёт в уме.</p>
    <div class="tiles">${TRAINERS.map(t => `<button class="tile" data-go="trainer/${t.id}"><div class="ti">${t.i}</div><div style="flex:1;min-width:0"><div class="tt">${t.t}</div><div class="ts">${t.s}</div></div>
      <div class="tr">${best[t.id] != null ? `🏆 ${best[t.id]}${t.id === "memory" ? "%" : ""}` : ""}</div></button>`).join("")}</div>`;
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
}

export function viewTrainer(el, arg) {
  const [id, sub] = arg.split("/");
  document.body.classList.add("immersive");
  setActive("learn");
  if (id === "coords") return coords(el);
  if (id === "memory") return memory(el);
  if (id === "motif") return motif(el);
  if (id === "visual") return visual(el);
  if (id === "classics") return sub ? classicGame(el, sub) : classicsList(el);
  go("trainers");
}

function frame(el, title, back = "trainers") {
  el.innerHTML = `<div class="play">
    <div class="play-main">
      <div class="gtop"><button class="back" data-back>←</button><div class="tt">${esc(title)}</div></div>
      <div class="board-col"><div id="tBoard"></div></div>
    </div>
    <aside class="side">
      <div class="side-head desk-only"><button class="back" data-back style="width:32px;height:32px">←</button><b>${esc(title)}</b></div>
      <div class="side-body" style="padding:12px;display:flex;flex-direction:column;gap:10px" id="tInfo"></div>
      <div class="side-foot"><div class="ctrl" id="tCtrl"></div></div>
    </aside></div>`;
  $$("[data-back]", el).forEach(b => b.onclick = () => go(back));
  return { info: $("#tInfo", el), ctrl: $("#tCtrl", el), boardEl: $("#tBoard", el) };
}

/* ---------- координаты ---------- */
function coords(el) {
  const { info, ctrl, boardEl } = frame(el, "🔤 Координаты");
  let side = T().coordsSide || "w", score = 0, target = null, timer = 0, end = 0, running = false;
  const board = new Board(boardEl, { fen: "8/8/8/8/8/8/8/8 w - - 0 1", coords: false, orientation: side, anim: false });
  board.set({ movable: null });
  const newTarget = () => { let t; do t = FILES[Math.floor(Math.random() * 8)] + (1 + Math.floor(Math.random() * 8)); while (t === target); target = t; $("#cTarget", info).textContent = t; };
  const idle = () => {
    const best = T().coords || {};
    info.innerHTML = `<div class="small muted">Нажимайте на названное поле как можно быстрее. 30 секунд.</div>
      <div class="seg" id="cSide"><button data-s="w" class="${side === "w" ? "on" : ""}">За белых</button><button data-s="b" class="${side === "b" ? "on" : ""}">За чёрных</button></div>
      <div class="small muted">Рекорд: за белых ${best.w || 0}, за чёрных ${best.b || 0}</div>
      <button class="btn primary big block" id="cGo">Старт</button>`;
    $$("#cSide button", info).forEach(b => b.onclick = () => { side = b.dataset.s; T().coordsSide = side; save(); board.set({ orientation: side }); idle(); });
    $("#cGo", info).onclick = start;
    ctrl.innerHTML = "";
  };
  const start = () => {
    score = 0; running = true; end = performance.now() + 30000;
    info.innerHTML = `<div class="bigtimer" id="cTime">0:30</div><div style="text-align:center;font-size:64px;font-weight:800;line-height:1" id="cTarget"></div><div class="small muted" style="text-align:center">Очки: <b id="cScore">0</b></div>`;
    newTarget();
    timer = setInterval(() => {
      const left = end - performance.now();
      const t = $("#cTime", info);
      if (t) t.textContent = fmtClock(left);
      if (left <= 0) stop();
    }, 100);
  };
  const stop = () => {
    clearInterval(timer); running = false;
    const c = T().coords || (T().coords = {});
    const rec = score > (c[side] || 0);
    if (rec) c[side] = score;
    used("coords");
    snd(rec ? "win" : "end");
    board.set({ marks: {} });
    info.innerHTML = `<div style="text-align:center"><div style="font-size:44px">${rec ? "🏆" : "🎯"}</div><div class="b" style="font-size:22px">${score} ${plural(score, "поле", "поля", "полей")}</div><div class="muted">${rec ? "Новый рекорд!" : `Рекорд: ${c[side]}`}</div></div>
      <div class="small muted">Хороший уровень — 20+ полей. Мастера находят 30–40.</div><button class="btn primary block" id="cAgain">Ещё раз</button><button class="btn ghost block" id="cMenu">Настройки</button>`;
    $("#cAgain", info).onclick = start;
    $("#cMenu", info).onclick = idle;
  };
  board.el.addEventListener("pointerdown", e => {
    if (!running) return;
    const sq = board.sqAt(e.clientX, e.clientY);
    if (!sq) return;
    const ok = sq === target;
    board.set({ marks: { [sq]: ok ? "hl-green" : "hl-red" } });
    if (ok) { score++; $("#cScore", info).textContent = score; newTarget(); snd("move"); } else snd("illegal");
  });
  idle();
  return () => { clearInterval(timer); board.destroy(); };
}

/* ---------- запомни позицию ---------- */
const pieceCount = fen => fen.split(" ")[0].replace(/[^a-zA-Z]/g, "").length;
const LEVELS = { easy: { t: "Лёгкий", max: 8, sec: 10 }, mid: { t: "Средний", max: 14, sec: 10 }, hard: { t: "Трудный", max: 32, sec: 8 } };
function memory(el) {
  const { info, ctrl, boardEl } = frame(el, "🧠 Запомни позицию");
  let level = T().memLevel || "easy", board = null, timer = 0, target = null, placed = new Map(), pick = "wP";
  const newBoard = (fen, orient = "w") => { if (board) board.destroy(); board = new Board(boardEl, { fen, coords: true, orientation: orient, anim: false, set: S.settings.pieces, drawable: false }); board.set({ movable: null }); return board; };
  const idle = () => {
    newBoard(START_FEN);
    const m = T().memory || {};
    info.innerHTML = `<div class="small muted">Позиция из настоящей партии покажется на несколько секунд. Потом расставьте фигуры по памяти.</div>
      <div class="seg" id="mLvl">${Object.entries(LEVELS).map(([k, v]) => `<button data-l="${k}" class="${level === k ? "on" : ""}">${v.t}</button>`).join("")}</div>
      <div class="small muted">Фигур: до ${LEVELS[level].max}, показ ${LEVELS[level].sec} с. ${m[level] != null ? `Рекорд: ${m[level]}%` : ""}</div>
      <p class="tiny dim" style="margin:0">Чейз и Саймон (1973): мастера запоминают позицию из партии почти целиком за 5 секунд, а случайную расстановку — не лучше новичков. Они видят не фигуры, а знакомые «блоки».</p>
      <button class="btn primary big block" id="mGo">Старт</button>`;
    $$("#mLvl button", info).forEach(b => b.onclick = () => { level = b.dataset.l; T().memLevel = level; save(); idle(); });
    $("#mGo", info).onclick = round;
    ctrl.innerHTML = "";
  };
  const round = () => {
    const L = LEVELS[level];
    const pool = PUZZLES.filter(p => { const n = pieceCount(p.fen); return n <= L.max && n >= Math.min(L.max - 6, 5); });
    target = rnd(pool.length ? pool : PUZZLES).fen;
    const orient = target.split(" ")[1] === "w" ? "b" : "w";
    newBoard(target, orient);
    let left = L.sec * 1000;
    info.innerHTML = `<div class="b">Запоминайте!</div><div class="bar" style="height:10px"><i id="mBar" style="width:100%"></i></div><div class="small muted">Фигур на доске: ${pieceCount(target)}</div>`;
    const t0 = performance.now();
    timer = setInterval(() => {
      left = L.sec * 1000 - (performance.now() - t0);
      $("#mBar", info).style.width = Math.max(0, left / (L.sec * 10)) + "%";
      if (left <= 0) { clearInterval(timer); recall(orient); }
    }, 50);
  };
  const recall = orient => {
    placed = new Map();
    newBoard("8/8/8/8/8/8/8/8 w - - 0 1", orient);
    const pieces = ["wK", "wQ", "wR", "wB", "wN", "wP", "x", "bK", "bQ", "bR", "bB", "bN", "bP", "x"];
    info.innerHTML = `<div class="b">Расставьте фигуры</div>
      <div class="palette">${pieces.map(p => p === "x" ? `<button data-p="x" title="Стереть">🧽</button>` : `<button data-p="${p}" style="background-image:url(${pieceUrl(S.settings.pieces, p)})"></button>`).join("")}</div>
      <div class="small muted" id="mCnt">Поставлено: 0 из ${pieceCount(target)}</div>
      <button class="btn primary block" id="mCheck">Проверить</button>`;
    const drawPal = () => $$("[data-p]", info).forEach(b => b.classList.toggle("on", b.dataset.p === pick));
    $$("[data-p]", info).forEach(b => b.onclick = () => { pick = b.dataset.p; drawPal(); });
    drawPal();
    board.el.addEventListener("pointerdown", e => {
      if (board.checked) return;
      const sq = board.sqAt(e.clientX, e.clientY);
      if (!sq) return;
      if (pick === "x" || placed.get(sq) === pick) placed.delete(sq); else placed.set(sq, pick);
      board.set({ fen: fenOf(placed), animate: false });
      $("#mCnt", info).textContent = `Поставлено: ${placed.size} из ${pieceCount(target)}`;
    });
    $("#mCheck", info).onclick = () => check();
  };
  const check = () => {
    board.checked = true;
    const truth = parseFen(target);
    let right = 0, extra = 0;
    const marks = {};
    for (const [sq, p] of placed) { if (truth.get(sq) === p) { right++; marks[sq] = "hl-green"; } else { extra++; marks[sq] = "hl-red"; } }
    for (const [sq] of truth) if (!placed.has(sq) || placed.get(sq) !== truth.get(sq)) marks[sq] = marks[sq] || "hl-yellow";
    const pct = Math.max(0, Math.round((right - extra * 0.5) / truth.size * 100));
    const m = T().memory || (T().memory = {});
    const rec = pct > (m[level] ?? -1);
    if (rec) m[level] = pct;
    m.best = Math.max(m.best || 0, pct);
    used("memory");
    board.set({ marks });
    snd(pct >= 80 ? "right" : "end");
    info.innerHTML = `<div style="text-align:center"><div class="b" style="font-size:26px">${pct}%</div><div class="muted small">Верно ${right} из ${truth.size}${extra ? `, лишних или не на месте ${extra}` : ""}${rec ? " · рекорд!" : ""}</div></div>
      <div class="small muted">🟩 верно · 🟥 ошибка · 🟨 здесь стояла фигура</div>
      <div class="grid2"><button class="btn" id="mShow">Показать позицию</button><button class="btn primary" id="mNext">Дальше</button></div>
      <button class="btn ghost block" id="mMenu">Уровень</button>`;
    $("#mShow", info).onclick = () => board.set({ fen: target, animate: false });
    $("#mNext", info).onclick = round;
    $("#mMenu", info).onclick = idle;
  };
  idle();
  return () => { clearInterval(timer); board && board.destroy(); };
}
function fenOf(map) {
  const rows = [];
  for (let r = 8; r >= 1; r--) {
    let row = "", e = 0;
    for (const f of FILES) {
      const p = map.get(f + r);
      if (!p) { e++; continue; }
      if (e) { row += e; e = 0; }
      row += p[0] === "w" ? p[1] : p[1].toLowerCase();
    }
    rows.push(row + (e || ""));
  }
  return rows.join("/") + " w - - 0 1";
}

/* ---------- узнай мотив ---------- */
const MOTIFS = ["backRankMate", "smotheredMate", "fork", "pin", "skewer", "discoveredAttack", "promotion", "mateIn1", "mateIn2", "hangingPiece", "sacrifice"];
function primaryMotif(p) { return MOTIFS.find(m => p.themes.includes(m)); }
function motif(el) {
  const { info, ctrl, boardEl } = frame(el, "👁 Узнай мотив");
  let board = null, round = 0, score = 0, cur = null;
  const ROUNDS = 10;
  const newBoard = (fen, orient) => { if (board) board.destroy(); board = new Board(boardEl, { fen, orientation: orient, coords: S.settings.coords, set: S.settings.pieces, anim: S.settings.anim }); board.set({ movable: null }); };
  const next = () => {
    if (round >= ROUNDS) return finish();
    round++;
    const pool = PUZZLES.filter(p => primaryMotif(p));
    const p = rnd(pool);
    const right = primaryMotif(p);
    const wrong = MOTIFS.filter(m => !p.themes.includes(m) && m !== "smotheredMate").sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [right, ...wrong].sort(() => Math.random() - 0.5);
    const c = makeChess(p.fen);
    const m0 = playUci(c, p.moves[0]);
    cur = { p, right, fen: c.fen() };
    newBoard(c.fen(), c.turn());
    board.set({ lastMove: [m0.from, m0.to], check: checkSquare(c) });
    info.innerHTML = `<div class="row" style="justify-content:space-between"><span class="small muted">Вопрос ${round} из ${ROUNDS}</span><b>Очки: ${score}</b></div>
      <div class="pz-head"><div class="who ${c.turn()}"></div><div class="tx">Ход ${c.turn() === "w" ? "белых" : "чёрных"}. Какой приём решает?</div></div>
      <div class="col" style="gap:6px">${opts.map(o => `<button class="btn block" data-m="${o}" style="justify-content:flex-start">${THEMES[o][0]}</button>`).join("")}</div>
      <div id="mtMsg" class="small"></div>`;
    $$("[data-m]", info).forEach(b => b.onclick = () => answer(b.dataset.m));
    ctrl.innerHTML = "";
  };
  const answer = async m => {
    if (!cur || cur.done) return;
    cur.done = true;
    const ok = m === cur.right;
    if (ok) score++;
    snd(ok ? "right" : "wrong");
    $$("[data-m]", info).forEach(b => { if (b.dataset.m === cur.right) b.style.background = "#3c5a24"; else if (b.dataset.m === m) b.style.background = "#6b2a24"; });
    const c = makeChess(cur.fen);
    const line = sanList(cur.fen, cur.p.moves.slice(1)).map(figSan).join(" ");
    $("#mtMsg", info).innerHTML = `${ok ? "<b class='green'>Верно!</b>" : `<b class='red'>Это ${THEMES[cur.right][0].toLowerCase()}.</b>`} Решение: <b>${esc(line)}</b>`;
    ctrl.innerHTML = `<button class="on" style="max-width:none;flex:1" id="mtNext">▶<small>${round >= ROUNDS ? "Итог" : "Дальше"}</small></button>`;
    $("#mtNext", el).onclick = next;
    const p = cur.p;
    for (const u of p.moves.slice(1)) {
      await sleep(700);
      if (!cur || cur.p !== p) return;
      const mv = playUci(c, u);
      if (!mv) break;
      board.set({ fen: c.fen(), lastMove: [mv.from, mv.to], check: checkSquare(c) });
      moveSound(mv, c);
    }
  };
  const finish = () => {
    const t = T().motif || (T().motif = {});
    const rec = score > (t.best || 0);
    if (rec) t.best = score;
    used("motif");
    info.innerHTML = `<div style="text-align:center"><div style="font-size:44px">${rec ? "🏆" : "👁"}</div><div class="b" style="font-size:22px">${score} из ${ROUNDS}</div><div class="muted">${rec ? "Новый рекорд!" : `Рекорд: ${t.best}`}</div></div>
      <p class="small muted">Узнавание приёма с первого взгляда приходит с тысячами решённых задач — продолжайте решать вперемешку.</p>
      <button class="btn primary block" id="mtAgain">Ещё раз</button>`;
    $("#mtAgain", info).onclick = () => { round = 0; score = 0; next(); };
    ctrl.innerHTML = "";
  };
  next();
  return () => { cur = null; board && board.destroy(); };
}

/* ---------- визуализация ---------- */
function visual(el) {
  const { info, ctrl, boardEl } = frame(el, "🌫 Визуализация");
  let level = T().visLevel || 1, board = null, round = 0, score = 0, cur = null;
  const ROUNDS = 10;
  const newBoard = (fen, orient) => { if (board) board.destroy(); board = new Board(boardEl, { fen, orientation: orient, coords: true, set: S.settings.pieces, anim: S.settings.anim }); board.set({ movable: null }); };
  const idle = () => {
    newBoard(START_FEN, "w");
    const best = T().visual || {};
    info.innerHTML = `<div class="small muted">На доске — позиция до нескольких ходов. Эти ходы написаны текстом, но не сыграны. Представьте позицию после них и выберите лучший ход.</div>
      <div class="seg" id="vLvl"><button data-l="1" class="${level === 1 ? "on" : ""}">1 ход в уме</button><button data-l="3" class="${level === 3 ? "on" : ""}">3 хода в уме</button></div>
      <div class="small muted">${best["l" + level] != null ? `Рекорд: ${best["l" + level]} из ${ROUNDS}` : ""}</div>
      <button class="btn primary big block" id="vGo">Старт</button>`;
    $$("#vLvl button", info).forEach(b => b.onclick = () => { level = +b.dataset.l; T().visLevel = level; save(); idle(); });
    $("#vGo", info).onclick = () => { round = 0; score = 0; next(); };
    ctrl.innerHTML = "";
  };
  const next = () => {
    if (round >= ROUNDS) return finish();
    round++;
    const pool = PUZZLES.filter(p => p.moves.length >= level + 1);
    const p = rnd(pool);
    const hidden = p.moves.slice(0, level);
    const answerUci = p.moves[level];
    const c = makeChess(p.fen);
    for (const u of hidden) playUci(c, u);
    const fenAfter = c.fen();
    const legal = c.moves({ verbose: true });
    const right = legal.find(m => uciOf(m) === answerUci);
    // неверные варианты не должны оказаться таким же сильным ходом (другим матом)
    const others = legal.filter(m => uciOf(m) !== answerUci && !m.san.includes("#")).sort((a, b) => ((b.captured ? 2 : 0) + (b.san.includes("+") ? 2 : 0) + Math.random()) - ((a.captured ? 2 : 0) + (a.san.includes("+") ? 2 : 0) + Math.random())).slice(0, 3);
    const opts = [right, ...others].sort(() => Math.random() - 0.5);
    cur = { p, fenAfter, right: uciOf(right), hidden };
    const solver = c.turn();
    newBoard(p.fen, solver);
    info.innerHTML = `<div class="row" style="justify-content:space-between"><span class="small muted">Вопрос ${round} из ${ROUNDS}</span><b>Очки: ${score}</b></div>
      <div class="card" style="background:var(--panel2)"><div class="tiny muted">Ходы, которых нет на доске:</div><div class="b" style="font-size:17px;margin-top:2px">${esc(sanLine(p.fen, hidden, 9))}</div></div>
      <div class="pz-head"><div class="who ${solver}"></div><div class="tx">Ход ${solver === "w" ? "белых" : "чёрных"}. Лучший ход?</div></div>
      <div class="grid2">${opts.map(m => `<button class="btn" data-u="${uciOf(m)}">${esc(figSan(m.san))}</button>`).join("")}</div>
      <div id="vMsg" class="small"></div>`;
    $$("[data-u]", info).forEach(b => b.onclick = () => answer(b.dataset.u));
    ctrl.innerHTML = "";
  };
  const answer = async u => {
    if (!cur || cur.done) return;
    cur.done = true;
    const ok = u === cur.right;
    if (ok) score++;
    snd(ok ? "right" : "wrong");
    $$("[data-u]", info).forEach(b => { if (b.dataset.u === cur.right) b.style.background = "#3c5a24"; else if (b.dataset.u === u) b.style.background = "#6b2a24"; });
    $("#vMsg", info).innerHTML = ok ? "<b class='green'>Верно!</b> Смотрите, как это выглядит на доске." : "<b class='red'>Не то.</b> Смотрите позицию на доске.";
    ctrl.innerHTML = `<button class="on" style="max-width:none;flex:1" id="vNext">▶<small>${round >= ROUNDS ? "Итог" : "Дальше"}</small></button>`;
    $("#vNext", el).onclick = next;
    const c = makeChess(cur.p.fen);
    const p = cur.p;
    for (const mv of [...cur.hidden, cur.right]) {
      await sleep(650);
      if (!cur || cur.p !== p) return;
      const m = playUci(c, mv);
      board.set({ fen: c.fen(), lastMove: [m.from, m.to], check: checkSquare(c) });
      moveSound(m, c);
    }
  };
  const finish = () => {
    const t = T().visual || (T().visual = {});
    const k = "l" + level;
    const rec = score > (t[k] ?? -1);
    if (rec) t[k] = score;
    t.best = Math.max(t.best || 0, score);
    used("visual");
    info.innerHTML = `<div style="text-align:center"><div style="font-size:44px">${rec ? "🏆" : "🌫"}</div><div class="b" style="font-size:22px">${score} из ${ROUNDS}</div><div class="muted">${rec ? "Новый рекорд!" : ""}</div></div>
      <p class="small muted">Умение видеть позицию в конце варианта — основа расчёта. Когда 1 ход станет лёгким, переходите на 3.</p>
      <button class="btn primary block" id="vAgain">Ещё раз</button><button class="btn ghost block" id="vMenu">Уровень</button>`;
    $("#vAgain", info).onclick = () => { round = 0; score = 0; next(); };
    $("#vMenu", info).onclick = idle;
    ctrl.innerHTML = "";
  };
  idle();
  return () => { cur = null; board && board.destroy(); };
}

/* ---------- угадай ход мастера ---------- */
function classicsList(el) {
  el.innerHTML = `<div class="topbar"><button class="back" data-back>←</button><h1>Угадай ход мастера</h1></div>
    <div class="card prose small"><p>Классический метод тренировки: играйте за победителя и на каждом ходу угадывайте ход мастера. <b>3 очка</b> — ход мастера, <b>2</b> — ход не хуже по оценке движка, <b>1</b> — немного слабее. После каждого хода — ход мастера и комментарий.</p></div>
    <div class="tiles" style="margin-top:12px">${CLASSICS.map(g => {
      const best = T().classics?.[g.id];
      return `<button class="tile" data-g="${g.id}"><div class="ti">${g.side === "w" ? "⚪" : "⚫"}</div><div style="flex:1;min-width:0"><div class="tt">${esc(g.t)}</div>
        <div class="ts">${esc(g.w)} — ${esc(g.b)}, ${esc(g.place)} ${g.year} · ${esc(g.level)}</div></div><div class="tr">${best != null ? `🏆 ${best}%` : ""}</div></button>`;
    }).join("")}</div>`;
  $("[data-back]", el).onclick = () => go("trainers");
  $$("[data-g]", el).forEach(b => b.onclick = () => go("trainer/classics/" + b.dataset.g));
}

function classicGame(el, id) {
  const g = CLASSICS.find(x => x.id === id);
  if (!g) { go("trainer/classics"); return; }
  const { info, ctrl, boardEl } = frame(el, `📜 ${g.t}`, "trainer/classics");
  const sans = g.moves.split(" ");
  const c = makeChess();
  const ucis = [];
  { const t = makeChess(); for (const s of sans) ucis.push(uciOf(t.move(s))); }
  let ply = 0, points = 0, max = 0, busy = false, gen = 0;
  const board = new Board(boardEl, {
    orientation: g.side, coords: S.settings.coords, legal: S.settings.legal, anim: S.settings.anim, set: S.settings.pieces,
    onMove: (f, t, p) => guess(f + t + (p || "")),
  });
  const userTurn = () => (ply % 2 === 0) === (g.side === "w");
  const sync = (anim = true) => {
    const last = ply ? [ucis[ply - 1].slice(0, 2), ucis[ply - 1].slice(2, 4)] : null;
    board.set({ fen: c.fen(), lastMove: last, check: checkSquare(c), animate: anim, turn: c.turn(),
      movable: userTurn() && ply < sans.length && !busy ? { color: g.side, dests: dests(c) } : null });
  };
  const head = msg => {
    info.innerHTML = `<div class="small muted">${esc(g.w)} — ${esc(g.b)}, ${esc(g.place)} ${g.year}</div>
      <div class="small">${esc(g.about)}</div>
      <div class="row" style="justify-content:space-between"><b>Очки: ${points} из ${max}</b><span class="small muted">ход ${Math.floor(ply / 2) + 1}</span></div>
      <div id="clMsg">${msg || ""}</div>`;
  };
  const playMaster = async () => {
    const m = c.move(sans[ply]);
    ply++;
    sync(true);
    moveSound(m, c);
  };
  const autoOpponent = async () => {
    const my = ++gen;
    while (ply < sans.length && !userTurn()) {
      await sleep(650);
      if (my !== gen) return;
      await playMaster();
      const note = g.notes[ply - 1];
      if (note) $("#clMsg", info) && ($("#clMsg", info).innerHTML = `<div class="small muted">${esc(figSan(sans[ply - 1]))}: ${esc(note)}</div>`);
    }
    if (ply >= sans.length) return finish();
    sync(false);
    const pz = $("#clMsg", info);
    if (pz) pz.insertAdjacentHTML("beforeend", `<div class="pz-head" style="margin-top:6px"><div class="who ${g.side}"></div><div class="tx">Ваш ход: как сыграл бы ${esc(g.side === "w" ? g.w : g.b)}?</div></div>`);
  };
  const evalAfter = async (fen, uci) => {
    const t = makeChess(fen);
    playUci(t, uci);
    if (t.isCheckmate()) return MATE;
    if (t.isDraw()) return 0;
    const r = await engine.analyse(t.fen(), { depth: 12, tag: "trainer" });
    return r.lines[0] ? -scoreOf(r.lines[0]) : 0;
  };
  async function guess(uci) {
    if (busy || !userTurn()) return;
    busy = true;
    const fen = c.fen();
    const master = ucis[ply];
    max += 3;
    let pts = 0, verdict;
    if (uci === master || (uci.length === 4 && master.startsWith(uci))) { pts = 3; verdict = "🎯 Ход мастера! +3"; }
    else {
      $("#clMsg", info).innerHTML = `<span class="muted small">Движок сравнивает ходы…</span>`;
      const [a, b] = await Promise.all([evalAfter(fen, master), evalAfter(fen, uci)]);
      const diff = a - b;
      pts = diff <= 30 ? 2 : diff <= 100 ? 1 : 0;
      verdict = pts === 2 ? "👍 Не хуже хода мастера по оценке движка. +2" : pts === 1 ? "Неплохо, но мастер сыграл сильнее. +1" : "Мастер сыграл иначе. 0";
    }
    points += pts;
    snd(pts >= 2 ? "right" : pts === 1 ? "move" : "wrong");
    const masterSan = figSan(sans[ply]);
    const note = g.notes[ply];
    await playMaster();
    head(`<div class="pz-head ${pts >= 2 ? "ok" : pts === 0 ? "bad" : ""}"><div class="tx">${esc(verdict)}</div></div>
      <div class="small" style="margin-top:6px">Мастер: <b>${esc(masterSan)}</b>${note ? ` — ${esc(note)}` : ""}</div>`);
    busy = false;
    autoOpponent();
  }
  const finish = () => {
    const pct = max ? Math.round(points / max * 100) : 0;
    const t = T().classics || (T().classics = {});
    const rec = pct > (t[g.id] ?? -1);
    if (rec) t[g.id] = pct;
    used("classics");
    unlock("classic-1");
    sync(false);
    board.set({ movable: null });
    head(`<div style="text-align:center;margin-top:8px"><div style="font-size:40px">📜</div><div class="b" style="font-size:22px">${pct}%</div><div class="muted small">${points} из ${max} очков${rec ? " · рекорд!" : ""}</div></div>`);
    ctrl.innerHTML = `<button class="on" style="max-width:none;flex:1" id="clList">✓<small>К партиям</small></button>`;
    $("#clList", el).onclick = () => go("trainer/classics");
  };
  head("");
  ctrl.innerHTML = `<button id="clSkip">⏩<small>Пропустить дебют</small></button>`;
  $("#clSkip", el).onclick = async () => {
    if (busy || ply >= 12) return;
    gen++;
    while (ply < 12 && ply < sans.length) { c.move(sans[ply]); ply++; }
    sync(false);
    head(`<div class="small muted">Дебют пропущен.</div>`);
    autoOpponent();
  };
  sync(false);
  autoOpponent();
  return () => { gen++; board.destroy(); };
}
