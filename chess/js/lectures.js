/* Интерактивные лекции: вопрос до объяснения, теория на доске, разбор
   примера, «ваш ход», «нажмите на поле», проверочные вопросы и итог.
   Ключевые позиции после лекции уходят в интервальное повторение. */
import { $, $$, esc, toast } from "./util.js";
import { S, save, activity, setActive, unlock } from "./store.js";
import { Board } from "./board.js";
import { makeChess, checkSquare } from "./chessutil.js";
import { LECTURES, LECTURE_SECTIONS, lectureById, resolveLecture, isCardStep } from "./lecturedata.js";
import { PuzzleRunner, ALL as PUZZLES } from "./puzzles.js";
import { addCard } from "./srs.js";
import { moveSound, play as snd } from "./sound.js";
import { go } from "./router.js";

export { LECTURES, LECTURE_SECTIONS };
const MARK = { green: "hl-green", red: "hl-red", blue: "hl-blue", yellow: "hl-yellow" };
const FILES = "abcdefgh";

export function nextLecture() {
  const l = LECTURES.find(x => !S.lectures[x.id]?.done);
  return l ? { title: l.t, route: "lecture/" + l.id } : null;
}

function regionMarks(spec) {
  if (!spec) return {};
  const [a, b] = spec.split(":");
  const out = {};
  for (let f = FILES.indexOf(a[0]); f <= FILES.indexOf(b[0]); f++)
    for (let r = +a[1]; r <= +b[1]; r++) out[FILES[f] + r] = "hl-soft";
  return out;
}
function stepMarks(s) {
  const m = regionMarks(s.region);
  for (const [sq, c] of Object.entries(s.marks || {})) m[sq] = MARK[c] || c;
  return m;
}
const arrowsOf = s => (s.arrows || []).map(u => ({ from: u.slice(0, 2), to: u.slice(2, 4), color: "green" }));

/* задача из базы на тему: самая лёгкая из нерешённых */
function puzzleFor(theme) {
  const list = PUZZLES.filter(p => p.themes.includes(theme)).sort((a, b) => a.rating - b.rating);
  return list.find(p => !S.puzzles.done[p.id]) || list[0] || null;
}

export function viewLecture(el, id) {
  const lec = lectureById(id);
  if (!lec) { go("learn"); return; }
  document.body.classList.add("immersive");
  setActive("learn");
  const steps = resolveLecture(lec);
  const results = {};
  let i = 0, board = null, runner = null, answered = false;
  el.innerHTML = `<div class="play">
    <div class="play-main">
      <div class="gtop"><button class="back" data-back>←</button><div class="tt">${lec.i} ${esc(lec.t)}</div></div>
      <div class="board-col"><div id="lcBoard"></div></div>
    </div>
    <aside class="side">
      <div class="side-head desk-only"><button class="back" data-back style="width:32px;height:32px">←</button><b>${lec.i} ${esc(lec.t)}</b></div>
      <div style="padding:10px 14px 0"><div class="bar"><i id="lcBar" style="width:0%"></i></div><div class="tiny muted" id="lcStep" style="margin-top:4px"></div></div>
      <div class="side-body" style="padding:12px 14px" id="lcBody"></div>
      <div class="side-foot"><div class="ctrl" id="lcCtrl"></div></div>
    </aside></div>`;
  $$("[data-back]", el).forEach(b => b.onclick = () => go("learn"));
  const body = $("#lcBody", el), ctrl = $("#lcCtrl", el);

  const freshBoard = (fen, opts = {}) => {
    if (runner) { runner.destroy(); runner = null; }
    if (board) { board.destroy(); board = null; }
    const flip = opts.flip ?? false;
    board = new Board($("#lcBoard", el), { fen, orientation: flip ? "b" : "w", coords: S.settings.coords, legal: S.settings.legal, anim: S.settings.anim, set: S.settings.pieces });
    board.set({ movable: null, check: checkSquare(makeChess(fen)) });
    return board;
  };

  function controls({ canNext = true, extra = "" } = {}) {
    const last = i === steps.length - 1;
    ctrl.innerHTML = `${i > 0 ? `<button data-c="prev">◀<small>Назад</small></button>` : ""}${extra}
      <button data-c="next" class="${canNext ? "on" : ""}" ${canNext ? "" : "disabled"} style="max-width:none;flex:2">${last ? "✓" : "▶"}<small>${last ? "Завершить" : "Дальше"}</small></button>`;
    $$("[data-c]", ctrl).forEach(b => b.onclick = () => action(b.dataset.c));
  }
  function enableNext() { const b = $("[data-c=next]", ctrl); if (b) { b.disabled = false; b.classList.add("on"); } }

  function action(c) {
    if (c === "prev" && i > 0) { i--; show(); }
    if (c === "next") { if (i === steps.length - 1) finish(); else { i++; show(); } }
    if (c === "hint" && runner) runner.hint();
    if (c === "sol" && runner) runner.showSolution();
  }

  function record(ok) { if (!(i in results)) results[i] = ok; }

  function show() {
    const s = steps[i];
    answered = false;
    $("#lcBar", el).style.width = Math.round(i / (steps.length - 1) * 100) + "%";
    $("#lcStep", el).textContent = `Шаг ${i + 1} из ${steps.length}`;
    const flip = !!s.flip || (s.start.split(" ")[1] === "b" && s.t === "find");
    if (s.t === "pre" || s.t === "quiz") return showQuiz(s);
    if (s.t === "text") {
      freshBoard(s.start).set({ marks: stepMarks(s), shapes: arrowsOf(s) });
      body.innerHTML = `<div class="lesson-text">${s.html}</div>`;
      controls();
      return;
    }
    if (s.t === "demo") return showDemo(s);
    if (s.t === "find") return showFind(s, flip);
    if (s.t === "square") return showSquare(s, flip);
    if (s.t === "pz") return showPz(s);
    if (s.t === "sum") {
      freshBoard(s.start);
      body.innerHTML = `<div class="b" style="font-size:17px;margin-bottom:8px">Главное</div><ul class="lesson-text" style="padding-left:20px">${s.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`;
      controls();
    }
  }

  function showQuiz(s) {
    freshBoard(s.start).set({ marks: stepMarks(s), shapes: arrowsOf(s) });
    body.innerHTML = `${s.t === "pre" ? `<div class="tag" style="margin-bottom:8px">🤔 Вопрос до объяснения — даже неверный ответ помогает запомнить</div>` : `<div class="tag" style="margin-bottom:8px">✅ Проверка</div>`}
      <div class="b" style="font-size:16px;margin-bottom:10px">${esc(s.q)}</div>
      <div class="col" style="gap:6px">${s.opts.map((o, k) => `<button class="btn block" data-o="${k}" style="justify-content:flex-start;text-align:left">${esc(o)}</button>`).join("")}</div>
      <div id="lcWhy" class="small" style="margin-top:10px"></div>`;
    $$("[data-o]", body).forEach(b => b.onclick = () => {
      if (answered) return;
      const k = +b.dataset.o;
      const ok = k === s.a;
      record(ok);
      answered = true;
      $$("[data-o]", body).forEach(x => { const j = +x.dataset.o; if (j === s.a) x.style.background = "#3c5a24"; else if (j === k) x.style.background = "#6b2a24"; });
      snd(ok ? "right" : "wrong");
      $("#lcWhy", body).innerHTML = `<b class="${ok ? "green" : "red"}">${ok ? "Верно!" : "Не совсем."}</b> ${esc(s.why || "")}`;
      enableNext();
    });
    controls({ canNext: false });
  }

  function showDemo(s) {
    let k = 0;
    const ucis = s.moves;
    const fens = [s.start];
    { const c = makeChess(s.start); for (const u of ucis) { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); fens.push(c.fen()); } }
    freshBoard(s.start);
    const draw = anim => {
      const last = k ? [ucis[k - 1].slice(0, 2), ucis[k - 1].slice(2, 4)] : null;
      board.set({ fen: fens[k], lastMove: last, animate: anim, check: checkSquare(makeChess(fens[k])), shapes: k < ucis.length ? [{ from: ucis[k].slice(0, 2), to: ucis[k].slice(2, 4), color: "blue", opacity: 0.35 }] : [] });
      const note = k ? (s.notes || [])[k - 1] : "";
      $("#dmNote", body).innerHTML = k === 0 ? "Нажимайте ▶, чтобы смотреть ходы." : note ? esc(note) : "<span class='dim'>…</span>";
      $("#dmPos", body).textContent = `${k}/${ucis.length}`;
    };
    body.innerHTML = `<div class="lesson-text">${s.html || ""}</div>
      <div class="coachbox" style="background:var(--panel2);margin-top:8px"><div class="ca">🧑‍🏫</div><div class="cm" id="dmNote"></div></div>
      <div class="row" style="margin-top:8px;justify-content:center"><button class="btn sm" id="dmFirst">⏮</button><button class="btn sm" id="dmPrev">◀</button><span class="small muted" id="dmPos" style="min-width:50px;text-align:center"></span><button class="btn sm primary" id="dmNext">▶</button><button class="btn sm" id="dmLast">⏭</button></div>`;
    const go_ = (nk, anim = true) => {
      nk = Math.max(0, Math.min(ucis.length, nk));
      if (nk === k + 1) { const c = makeChess(fens[k]); const m = c.move({ from: ucis[k].slice(0, 2), to: ucis[k].slice(2, 4), promotion: ucis[k][4] }); moveSound(m, c); }
      k = nk; draw(anim);
    };
    $("#dmFirst", body).onclick = () => go_(0, false);
    $("#dmPrev", body).onclick = () => go_(k - 1);
    $("#dmNext", body).onclick = () => go_(k + 1);
    $("#dmLast", body).onclick = () => go_(ucis.length, false);
    draw(false);
    controls();
  }

  function showFind(s, flip) {
    if (board) { board.destroy(); board = null; }
    if (runner) { runner.destroy(); runner = null; }
    const p = { id: "lec", fen: s.start, moves: s.moves && s.seq ? s.moves : [s.ans[0]], selfStart: true, themes: [], altOk: (b, u) => s.ans.includes(u) };
    body.innerHTML = `<div class="pz-head"><div class="who ${s.start.split(" ")[1]}"></div><div class="tx">${esc(s.task)}</div></div>
      <div id="fdMsg" class="small" style="margin-top:10px"></div>`;
    let wrong = 0;
    runner = new PuzzleRunner($("#lcBoard", el), p, {
      onWrong: () => {
        wrong++;
        $("#fdMsg", body).innerHTML = `<span class="red">Не то.</span> ${s.hint && wrong >= 1 ? `Подсказка: ${esc(s.hint)}` : "Попробуйте ещё."}`;
      },
      onRight: () => { $("#fdMsg", body).innerHTML = `<span class="green">Верно! Продолжайте.</span>`; },
      onSolved: r => {
        record(!r.failed);
        $("#fdMsg", body).innerHTML = `<div class="pz-head ok" style="margin-bottom:8px"><div class="tx">${r.failed ? "Решение" : "Верно! ✓"}</div></div>${esc(s.after || "")}`;
        controls();
      },
    });
    if (flip) runner.board.set({ orientation: "b" });
    runner.start();
    controls({ canNext: false, extra: `<button data-c="hint">💡<small>Подсказка</small></button><button data-c="sol">👁<small>Ответ</small></button>` });
  }

  function showSquare(s, flip) {
    freshBoard(s.start, { flip });
    body.innerHTML = `<div class="pz-head"><div class="tx">👆 ${esc(s.task)}</div></div><div id="sqMsg" class="small" style="margin-top:10px"></div>`;
    const ok = sq => (s.sq || []).includes(sq) || (s.files || []).includes(sq[0]);
    board.el.addEventListener("pointerdown", e => {
      if (answered) return;
      const sq = board.sqAt(e.clientX, e.clientY);
      if (!sq) return;
      if (ok(sq)) {
        answered = true;
        record(true);
        board.set({ marks: { [sq]: "hl-green" } });
        snd("right");
        $("#sqMsg", body).innerHTML = `<b class="green">Верно!</b> ${esc(s.after || "")}`;
        enableNext();
      } else {
        record(false);
        board.set({ marks: { [sq]: "hl-red" } });
        snd("wrong");
        board.shake();
        $("#sqMsg", body).innerHTML = `<span class="red">Не это поле.</span> Попробуйте ещё.`;
      }
    });
    controls({ canNext: false, extra: `<button data-c="showsq">👁<small>Ответ</small></button>` });
    $("[data-c=showsq]", ctrl).onclick = () => {
      if (answered) return;
      answered = true; record(false);
      const marks = {};
      (s.sq || []).forEach(q => marks[q] = "hl-green");
      if (!s.sq && s.files) for (let r = 1; r <= 8; r++) s.files.forEach(f => marks[f + r] = "hl-green");
      board.set({ marks });
      $("#sqMsg", body).innerHTML = esc(s.after || "");
      enableNext();
    };
  }

  function showPz(s) {
    const p = puzzleFor(s.theme);
    if (!p) { body.innerHTML = `<div class="muted">Задач на эту тему пока нет.</div>`; controls(); return; }
    if (board) { board.destroy(); board = null; }
    if (runner) { runner.destroy(); runner = null; }
    body.innerHTML = `<div class="tag" style="margin-bottom:8px">🧩 Задача из базы · рейтинг ${p.rating}</div><div class="pz-head"><div class="tx">${esc(s.task)}</div></div><div id="pzMsg" class="small" style="margin-top:10px">Сначала соперник сделает ход.</div>`;
    runner = new PuzzleRunner($("#lcBoard", el), p, {
      onReady: r => { $("#pzMsg", body).textContent = `Ход ${r.solver === "w" ? "белых" : "чёрных"}. Найдите лучшее продолжение.`; },
      onWrong: () => { $("#pzMsg", body).innerHTML = `<span class="red">Не то.</span> Попробуйте ещё или возьмите подсказку.`; },
      onRight: () => { $("#pzMsg", body).innerHTML = `<span class="green">Верно! Продолжайте.</span>`; },
      onSolved: r => {
        record(!r.failed);
        $("#pzMsg", body).innerHTML = `<div class="pz-head ok"><div class="tx">${r.failed ? "Решение" : "Решено! ✓"}</div></div><div class="small muted" style="margin-top:6px">${esc(r.solutionSan())}</div>`;
        controls();
      },
    });
    runner.start();
    controls({ canNext: false, extra: `<button data-c="hint">💡<small>Подсказка</small></button><button data-c="sol">👁<small>Ответ</small></button>` });
  }

  function finish() {
    const scored = Object.values(results);
    const right = scored.filter(Boolean).length;
    let added = 0;
    steps.forEach(st => { if (isCardStep(st) && addCard(`lec:${lec.id}:${st.i}`, "lec", { l: lec.id, i: st.i })) added++; });
    const first = !S.lectures[lec.id]?.done;
    S.lectures[lec.id] = { done: Date.now(), right, total: scored.length };
    if (first) activity("lessons");
    const n = Object.values(S.lectures).filter(x => x.done).length;
    unlock("lecture-1");
    if (n >= 5) unlock("lectures-5");
    if (n >= LECTURES.length) unlock("lectures-all");
    save();
    toast(`Лекция пройдена: ${right} из ${scored.length} с первой попытки${added ? ` · в повторение: ${added}` : ""}`, 3200);
    go("learn");
  }

  const keys = e => { if (e.key === "ArrowRight" && !$("[data-c=next]", ctrl)?.disabled) action("next"); };
  addEventListener("keydown", keys);
  show();
  return () => { removeEventListener("keydown", keys); runner && runner.destroy(); board && board.destroy(); };
}
