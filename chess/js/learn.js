/* Обучение: основы (звёзды), правила, тактика, техника мата и эндшпиль
   против движка, дебюты с тренажёром. */
import { $, $$, esc, modal, toast, plural, today, sleep } from "./util.js";
import { S, save, activity, setActive, unlock } from "./store.js";
import { Board, miniBoard } from "./board.js";
import { makeChess, playUci, checkSquare, dests, figSan, START_FEN } from "./chessutil.js";
import { SECTIONS, LESSONS, OPENINGS_LIB, OPENING_PRINCIPLES } from "../data/lessons.js";
import { PuzzleRunner, themeCount, THEMES } from "./puzzles.js";
import { startGame, me, botPlayer } from "./play.js";
import { botById } from "./bots.js";
import { play as snd, moveSound } from "./sound.js";
import { go } from "./router.js";
import { FILES } from "./util.js";

const lessonById = id => LESSONS.find(l => l.id === id);
export const routeOf = l => (l.type === "stars" || l.type === "drill" ? "basics/" : l.type === "theme" ? "lesson/" : "practice/") + l.id;

function markDone(id) {
  if (S.lessons.done[id]) return;
  S.lessons.done[id] = Date.now();
  activity("lessons");
  unlock("lesson-1");
  if (Object.keys(S.lessons.done).length >= 10) unlock("lessons-10");
  const l = lessonById(id);
  if (l && l.sec === "endgames") unlock("endgame-1");
  save();
}

/* уроки, видимые в программе: тема без задач в базе показывается, только если есть упражнения */
function visible(l) { return l.type !== "theme" || themeCount(l.theme) >= 3 || (l.drills && l.drills.length); }

export function nextLesson() {
  for (const l of LESSONS) if (visible(l) && !S.lessons.done[l.id]) return { title: l.t, route: routeOf(l) };
  for (const o of OPENINGS_LIB) if (!(S.openings[o.id] || {}).learned) return { title: o.t, route: "opening/" + o.id };
  return null;
}

export function viewLearn(el) {
  const done = id => !!S.lessons.done[id];
  el.innerHTML = `<div class="topbar"><h1>Обучение</h1></div>
    ${SECTIONS.map(sec => {
      if (sec.id === "openings") {
        const n = OPENINGS_LIB.filter(o => (S.openings[o.id] || {}).learned).length;
        return `<div class="sec-title">${sec.i} ${sec.t} · ${n}/${OPENINGS_LIB.length}</div>
          <div class="tiles"><button class="tile" data-go="openings"><div class="ti">📖</div><div><div class="tt">Дебюты</div><div class="ts">${sec.s}</div></div><div class="tr">${n}/${OPENINGS_LIB.length}</div></button></div>`;
      }
      const list = LESSONS.filter(l => l.sec === sec.id && visible(l));
      const n = list.filter(l => done(l.id)).length;
      return `<div class="sec-title">${sec.i} ${sec.t} · ${n}/${list.length}</div>
        <div class="tiles">${list.map(l => `<button class="tile" data-go="${routeOf(l)}"><div class="ti">${l.i}</div>
          <div style="flex:1;min-width:0"><div class="tt">${esc(l.t)}</div><div class="ts">${lessonSub(l)}</div></div>
          <div class="tr">${done(l.id) ? `<span class="green" style="font-size:20px">✓</span>` : ""}</div></button>`).join("")}</div>`;
    }).join("")}`;
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
}
function lessonSub(l) {
  if (l.type === "stars") return `${l.levels.length} ${plural(l.levels.length, "уровень", "уровня", "уровней")}`;
  if (l.type === "drill") return `${l.drills.length} ${plural(l.drills.length, "упражнение", "упражнения", "упражнений")}`;
  if (l.type === "theme") { const s = S.puzzles.themes[l.theme]; return `Объяснение и задачи${s ? ` · решено ${s[0]}` : ""}`; }
  if (l.type === "practice") return l.goal.text;
  return "";
}

/* ======================================================================= */
/* звёзды: одна фигура, звёзды и чёрные фигуры-цели */
function pieceMoves(type, sq, foes) {
  const f = FILES.indexOf(sq[0]), r = +sq[1] - 1;
  const out = [];
  const at = (ff, rr) => ff >= 0 && ff < 8 && rr >= 0 && rr < 8 ? FILES[ff] + (rr + 1) : null;
  const ray = dirs => dirs.forEach(([a, b]) => { for (let i = 1; i < 8; i++) { const s = at(f + a * i, r + b * i); if (!s) break; out.push(s); if (foes.has(s)) break; } });
  if (type === "R" || type === "Q") ray([[1, 0], [-1, 0], [0, 1], [0, -1]]);
  if (type === "B" || type === "Q") ray([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  if (type === "N") [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].forEach(([a, b]) => { const s = at(f + a, r + b); if (s) out.push(s); });
  if (type === "K") for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (a || b) { const s = at(f + a, r + b); if (s) out.push(s); }
  if (type === "P") {
    const s1 = at(f, r + 1);
    if (s1 && !foes.has(s1)) { out.push(s1); const s2 = at(f, r + 2); if (r === 1 && s2 && !foes.has(s2)) out.push(s2); }
    for (const a of [-1, 1]) { const s = at(f + a, r + 1); if (s && foes.has(s)) out.push(s); }
  }
  return out;
}
/* минимум ходов — поиск в ширину по состояниям (поле, фигура, что собрано) */
function optimal(level) {
  const targets = [...level.stars, ...(level.foes || [])];
  const full = (1 << targets.length) - 1;
  const start = [level.at, level.p[1], 0];
  const key = s => s.join("|");
  const seen = new Set([key(start)]);
  let frontier = [start];
  for (let d = 0; d < 40 && frontier.length; d++) {
    const next = [];
    for (const [sq, type, mask] of frontier) {
      const foes = new Set((level.foes || []).filter((f, i) => !(mask & (1 << (level.stars.length + i)))));
      for (const to of pieceMoves(type, sq, foes)) {
        let m = mask;
        const ti = targets.indexOf(to);
        if (ti >= 0) m |= 1 << ti;
        const nt = type === "P" && to[1] === "8" ? "Q" : type;
        if (m === full) return d + 1;
        const st = [to, nt, m];
        if (!seen.has(key(st))) { seen.add(key(st)); next.push(st); }
      }
    }
    frontier = next;
  }
  return null;
}

function starsLesson(el, l) {
  let li = 0, board = null;
  const FOE_TYPES = ["p", "n", "b", "r", "q"];
  const drawLevel = () => {
    const lv = l.levels[li];
    const best = optimal(lv);
    let sq = lv.at, type = lv.p[1], moves = 0;
    const stars = new Set(lv.stars), foes = new Set(lv.foes || []);
    const fen = () => {
      const rows = [];
      for (let r = 7; r >= 0; r--) {
        let row = "", empty = 0;
        for (let f = 0; f < 8; f++) {
          const s = FILES[f] + (r + 1);
          let ch = null;
          if (s === sq) ch = type;
          else if (foes.has(s)) ch = FOE_TYPES[(lv.foes.indexOf(s)) % 5];
          if (ch) { if (empty) row += empty; empty = 0; row += ch; } else empty++;
        }
        if (empty) row += empty;
        rows.push(row);
      }
      return rows.join("/") + " w - - 0 1";
    };
    $("#lvInfo", el).innerHTML = `<div class="progress-dots">${l.levels.map((_, i) => `<i class="${i < li ? "ok" : i === li ? "cur" : ""}"></i>`).join("")}</div>
      <div class="small muted" style="margin-top:6px">Уровень ${li + 1} из ${l.levels.length}. ${lv.foes ? "Возьмите все фигуры" : "Соберите все звёзды"}${lv.stars.length && lv.foes ? " и звёзды" : ""}. Лучший результат: ${best} ${plural(best, "ход", "хода", "ходов")}.</div>
      <div class="b" id="lvMoves" style="margin-top:6px">Ходов: 0</div>`;
    const sync = anim => {
      const ds = new Map([[sq, pieceMoves(type, sq, foes)]]);
      board.set({ fen: fen(), turn: "w", movable: { color: "w", dests: ds }, stars: [...stars], animate: anim });
    };
    if (board) board.destroy();
    board = new Board($("#lvBoard", el), { coords: S.settings.coords, anim: S.settings.anim, set: S.settings.pieces, legal: true,
      onMove: (from, to) => {
        moves++;
        const cap = foes.has(to);
        sq = to; stars.delete(to); foes.delete(to);
        if (type === "P" && to[1] === "8") { type = "Q"; snd("promote"); } else snd(cap ? "capture" : "move");
        $("#lvMoves", el).textContent = `Ходов: ${moves}`;
        if (!stars.size && !foes.size) {
          board.set({ fen: fen(), movable: null, stars: [] });
          const st = moves <= best ? 3 : moves <= best + 2 ? 2 : 1;
          setTimeout(() => {
            snd("right");
            const last = li === l.levels.length - 1;
            const m = modal(`<div class="gameover"><div style="font-size:40px">${"⭐".repeat(st)}${"☆".repeat(3 - st)}</div>
              <div class="res">${st === 3 ? "Идеально!" : "Готово!"}</div><div class="why">${moves} ${plural(moves, "ход", "хода", "ходов")}${st < 3 ? `, а можно за ${best}` : ""}</div>
              <div class="grid2" style="margin-top:14px"><button class="btn" id="re">Ещё раз</button><button class="btn primary" id="nx">${last ? "Готово" : "Дальше"}</button></div></div>`, { dismiss: false });
            $("#re", m).onclick = () => { m.close(); drawLevel(); };
            $("#nx", m).onclick = () => {
              m.close();
              if (last) { markDone(l.id); go("learn"); }
              else { li++; drawLevel(); }
            };
          }, 350);
          return;
        }
        sync(false);
      } });
    sync(false);
  };
  el.innerHTML = lessonFrame(l, `<div id="lvInfo"></div>`, `<div id="lvBoard"></div>`);
  bindBack(el);
  drawLevel();
  return () => board && board.destroy();
}

function lessonFrame(l, side, main) {
  return `<div class="play">
    <div class="play-main">
      <div class="gtop"><button class="back" data-back>←</button><div class="tt">${l.i} ${esc(l.t)}</div></div>
      <div class="board-col">${main}</div>
    </div>
    <aside class="side">
      <div class="side-head desk-only"><button class="back" data-back style="width:32px;height:32px">←</button><b>${l.i} ${esc(l.t)}</b></div>
      <div class="side-body" style="padding:14px"><div class="lesson-text">${l.text}</div>${side}</div>
    </aside></div>`;
}
function bindBack(el) {
  document.body.classList.add("immersive");
  setActive("learn");
  $$("[data-back]", el).forEach(b => b.onclick = () => go("learn"));
}

/* упражнения «найди ход» — для правил и для тактических тем */
function drillRunner(el, drills, { onAllDone, boardSel = "#lvBoard", infoSel = "#lvInfo" }) {
  let di = 0, runner = null;
  const doneSet = new Set();
  const next = () => {
    if (runner) runner.destroy();
    const d = drills[di];
    const p = {
      id: "drill", fen: d.fen, moves: d.moves || [], selfStart: true, themes: [],
      altOk: d.any === "check" ? (before, uci) => { const c = makeChess(before); const m = playUci(c, uci); return !!m && c.inCheck(); } : null,
    };
    $(infoSel, el).innerHTML = `<div class="progress-dots" style="margin:10px 0 6px">${drills.map((_, i) => `<i class="${doneSet.has(i) ? "ok" : i === di ? "cur" : ""}"></i>`).join("")}</div>
      <div class="pz-head"><div class="who ${makeChess(d.fen).turn()}"></div><div class="tx">${esc(d.task)}</div></div>
      <div id="drMsg" class="small muted" style="margin-top:8px"></div>
      <div class="row" style="margin-top:10px"><button class="btn sm" id="drHint">💡 Подсказка</button></div>`;
    runner = new PuzzleRunner($(boardSel, el), p, {
      onWrong: () => { $("#drMsg", el).innerHTML = `<span class="red">Не то. Попробуйте ещё.</span>`; },
      onRight: () => { $("#drMsg", el).innerHTML = `<span class="green">Верно! Продолжайте.</span>`; },
      onSolved: () => {
        doneSet.add(di);
        $("#drMsg", el).innerHTML = `<span class="green b">✓ ${esc(d.after || "Верно!")}</span>`;
        const last = doneSet.size === drills.length;
        $("#drHint", el).outerHTML = last ? `<button class="btn sm primary" id="drNext">Готово</button>` : `<button class="btn sm primary" id="drNext">Дальше →</button>`;
        $("#drNext", el).onclick = () => {
          if (last) { onAllDone(); return; }
          di = drills.findIndex((_, i) => !doneSet.has(i));
          next();
        };
      },
    });
    $("#drHint", el).onclick = () => {
      if (d.moves && d.moves.length) runner.hint();
      else $("#drMsg", el).textContent = d.any === "mate" ? "Ищите шах, после которого королю некуда уйти." : "Любой ход, который нападает на короля.";
    };
    runner.start();
  };
  next();
  return () => runner && runner.destroy();
}

export function viewBasics(el, id) {
  const l = lessonById(id);
  if (!l) { go("learn"); return; }
  if (l.type === "stars") return starsLesson(el, l);
  el.innerHTML = lessonFrame(l, `<div id="lvInfo"></div>`, `<div id="lvBoard"></div>`);
  bindBack(el);
  return drillRunner(el, l.drills, { onAllDone: () => { markDone(l.id); toast("Урок пройден! ✓"); go("learn"); } });
}

/* тактическая тема: объяснение, упражнения, задачи из базы */
export function viewLesson(el, id) {
  const l = lessonById(id);
  if (!l) { go("learn"); return; }
  const s = S.puzzles.themes[l.theme] || [0, 0];
  const need = Math.min(5, themeCount(l.theme));
  const practice = `<div class="card" style="background:var(--panel2);margin-top:14px">
    <div class="b">🧩 Практика: задачи на тему «${esc(THEMES[l.theme]?.[0] || l.t)}»</div>
    <div class="small muted" style="margin:4px 0 8px">В базе ${themeCount(l.theme)} · решено ${s[0]}${need ? ` · для зачёта решите ${need}` : ""}</div>
    <div class="bar"><i style="width:${need ? Math.min(100, s[0] / need * 100) : 100}%"></i></div>
    <button class="btn primary block" id="toPz" style="margin-top:10px" ${themeCount(l.theme) ? "" : "disabled"}>Решать задачи</button></div>`;
  const check = () => {
    const st = S.puzzles.themes[l.theme] || [0, 0];
    if ((S.lessons.steps[l.id] || 0) >= 1 && st[0] >= need) markDone(l.id);
  };
  if (!l.drills.length) {
    el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>${l.i} ${esc(l.t)}</h1></div>
      <div class="card lesson-text">${l.text}</div>${practice}`;
    S.lessons.steps[l.id] = 1; save(); check();
    $("#toPz", el).onclick = () => go("puzzle/theme/" + l.theme);
    return;
  }
  el.innerHTML = lessonFrame(l, `<div id="lvInfo"></div>${practice}`, `<div id="lvBoard"></div>`);
  bindBack(el);
  $("#toPz", el).onclick = () => go("puzzle/theme/" + l.theme);
  check();
  return drillRunner(el, l.drills, { onAllDone: () => {
    S.lessons.steps[l.id] = 1; save(); check();
    toast(S.lessons.done[l.id] ? "Урок пройден! ✓" : `Упражнения пройдены. Теперь решите ${need} задач на тему.`);
    if (themeCount(l.theme)) go("puzzle/theme/" + l.theme); else go("learn");
  } });
}

/* практика против движка: техника мата и эндшпиль */
export function viewPractice(el, id) {
  const l = lessonById(id);
  if (!l) { go("learn"); return; }
  const best = S.endgames[l.id];
  el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>${l.i} ${esc(l.t)}</h1></div>
    <div class="play" style="grid-template-columns:minmax(0,1fr) 340px">
      <div class="card lesson-text">${l.text}</div>
      <div class="card"><div style="max-width:300px;margin:0 auto">${miniBoard(l.fen, S.settings.pieces, l.user === "b")}</div>
        <div class="b" style="margin-top:10px">🎯 ${esc(l.goal.text)}</div>
        <div class="small muted" style="margin:4px 0 10px">Соперник — движок в полную силу. Можно брать подсказки и возвращать ходы.${best ? ` Ваш лучший результат: ${best} ${plural(best, "ход", "хода", "ходов")}.` : ""}</div>
        <button class="btn primary big block" id="go">${S.lessons.done[l.id] ? "Пройти ещё раз" : "Начать"}</button></div>
    </div>`;
  $("#go", el).onclick = () => startPractice(l);
}

function startPractice(l) {
  const uc = l.user || "w";
  const meP = me(), eng = { name: "Движок", av: "🤖", rating: null };
  const g = startGame({
    mode: "practice", practiceId: l.id, title: l.t, startFen: l.fen, userColor: uc, tc: "none",
    white: uc === "w" ? meP : eng, black: uc === "b" ? meP : eng,
    goal: l.goal, coach: false, allowHints: true, allowTakeback: true,
    intro: `🎯 ${l.goal.text}.`,
  });
  attachPracticeEnd(g);
}

export function attachPracticeEnd(g) {
  const l = lessonById(g.cfg.practiceId);
  if (!l) return;
  g.cfg.onEnd = (ok, game) => {
    const n = game.hist.filter(h => h.color === game.userColor).length;
    if (!ok) return;
    const inLimit = !l.goal.moves || l.goal.type !== "mate" || n <= l.goal.moves;
    if (l.goal.type === "mate") S.endgames[l.id] = Math.min(S.endgames[l.id] || 999, n);
    if (inLimit) markDone(l.id);
    save();
    game.coachSay(inLimit ? `✅ Задание выполнено${l.goal.type === "mate" ? ` за ${n} ${plural(n, "ход", "хода", "ходов")}` : ""}!` : `Мат за ${n} ходов — а нужно уложиться в ${l.goal.moves}. Попробуйте ещё раз!`);
  };
}

/* ======================================================================= */
/* дебюты */
export function viewOpenings(el) {
  el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Дебюты</h1></div>
    <div class="card prose">${OPENING_PRINCIPLES}</div>
    <div class="sec-title">За белых</div>
    <div class="tiles">${OPENINGS_LIB.filter(o => o.user === "w").map(openTile).join("")}</div>
    <div class="sec-title">За чёрных</div>
    <div class="tiles">${OPENINGS_LIB.filter(o => o.user === "b").map(openTile).join("")}</div>`;
  $$("[data-o]", el).forEach(b => b.onclick = () => go("opening/" + b.dataset.o));
}
function openTile(o) {
  const st = S.openings[o.id] || {};
  return `<button class="tile" data-o="${o.id}"><div class="ti">${o.i}</div><div style="flex:1;min-width:0"><div class="tt">${esc(o.t)}</div>
    <div class="ts">${esc(o.level)} · ${o.moves.split(" ").length} полуходов${st.runs ? ` · попыток ${st.runs}` : ""}</div></div>
    <div class="tr">${st.learned ? `<span class="green" style="font-size:20px">✓</span>` : st.perfect ? `<span class="amber">${st.perfect}/2</span>` : ""}</div></button>`;
}

export function viewOpening(el, id) {
  const o = OPENINGS_LIB.find(x => x.id === id);
  if (!o) { go("openings"); return; }
  document.body.classList.add("immersive");
  setActive("learn");
  const sans = o.moves.split(" ");
  const ucis = [];
  const fens = [START_FEN];
  { const c = makeChess(); for (const s of sans) { const m = c.move(s); ucis.push(m.from + m.to + (m.promotion || "")); fens.push(c.fen()); } }
  let mode = "learn", ply = 0, board = null, errors = 0, wrongHere = 0;
  el.innerHTML = `<div class="play">
    <div class="play-main">
      <div class="gtop"><button class="back" data-back>←</button><div class="tt">${o.i} ${esc(o.t)}</div></div>
      <div class="board-col"><div id="opBoard"></div></div>
    </div>
    <aside class="side">
      <div class="side-head desk-only"><button class="back" data-back style="width:32px;height:32px">←</button><b>${o.i} ${esc(o.t)}</b></div>
      <div class="side-body" style="padding:14px">
        <div class="small muted">${esc(o.about)}</div>
        <div class="seg" style="margin:12px 0" id="opMode"><button data-m="learn" class="on">📘 Изучить</button><button data-m="train">🎯 Тренировать</button></div>
        <div id="opInfo"></div>
      </div>
      <div class="side-foot"><div class="ctrl" id="opCtrl"></div></div>
    </aside></div>`;
  $$("[data-back]", el).forEach(b => b.onclick = () => go("openings"));
  board = new Board($("#opBoard", el), { orientation: o.user, coords: S.settings.coords, legal: S.settings.legal, anim: S.settings.anim, set: S.settings.pieces,
    onMove: (f, t, p) => trainMove(f + t + (p || "")) });
  const line = () => sans.map((s, i) => `${i % 2 === 0 ? `<span class="dim">${i / 2 + 1}.</span> ` : ""}<span style="${i < ply ? "color:#fff;font-weight:700" : "color:var(--dim)"}">${esc(figSan(s))}</span>`).join(" ");
  const show = anim => {
    const last = ply ? [ucis[ply - 1].slice(0, 2), ucis[ply - 1].slice(2, 4)] : null;
    board.set({ fen: fens[ply], lastMove: last, check: checkSquare(makeChess(fens[ply])), animate: anim, shapes: [] });
  };
  function drawLearn() {
    board.set({ movable: null, viewOnly: true });
    const note = ply ? o.notes[ply - 1] : null;
    const nextNote = mode === "learn" && ply < sans.length && ply % 2 === (o.user === "w" ? 0 : 1) && ucis[ply] ? [{ from: ucis[ply].slice(0, 2), to: ucis[ply].slice(2, 4), color: "green", opacity: 0.5 }] : [];
    $("#opInfo", el).innerHTML = `<div style="line-height:1.9;font-size:14.5px">${line()}</div>
      <div class="coachbox" style="background:var(--panel2);margin-top:10px"><div class="ca">🧑‍🏫</div><div class="cm">${note ? `<b>${esc(figSan(sans[ply - 1]))}</b> — ${esc(note)}` : ply === 0 ? "Листайте ходы стрелками. Пояснения — к ходам вашего цвета." : ply === sans.length ? "Это основная позиция дебюта. Теперь потренируйтесь играть по памяти!" : "Ход соперника."}</div></div>`;
    $("#opCtrl", el).innerHTML = `<button data-c="first">⏮<small>Начало</small></button><button data-c="prev">◀<small>Назад</small></button><button data-c="next">▶<small>Вперёд</small></button><button data-c="bot">🤖<small>Сыграть</small></button>`;
    $$("#opCtrl button", el).forEach(b => b.onclick = () => {
      const c = b.dataset.c;
      if (c === "first") { ply = 0; show(true); }
      if (c === "prev" && ply > 0) { ply--; show(true); }
      if (c === "next" && ply < sans.length) { ply++; show(true); const m = makeChess(fens[ply - 1]); moveSound(m.move(sans[ply - 1]), m); }
      if (c === "bot") playFrom();
      drawLearn();
    });
    board.set({ shapes: nextNote });
  }
  function drawTrain(msg = "") {
    const userTurn = ply < sans.length && ply % 2 === (o.user === "w" ? 0 : 1);
    board.set({ viewOnly: false, turn: makeChess(fens[ply]).turn(), movable: userTurn ? { color: o.user, dests: dests(makeChess(fens[ply])) } : null });
    $("#opInfo", el).innerHTML = `<div style="line-height:1.9;font-size:14.5px">${line()}</div>
      <div class="pz-head" style="margin-top:10px"><div class="who ${o.user}"></div><div class="tx">${ply >= sans.length ? "Вариант пройден!" : "Ваш ход по теории"}</div></div>
      <div class="small" style="margin-top:8px">${msg}</div><div class="small muted" style="margin-top:6px">Ошибок: ${errors}</div>`;
    $("#opCtrl", el).innerHTML = `<button data-c="restart">↺<small>Заново</small></button><button data-c="hint">💡<small>Подсказка</small></button><button data-c="bot">🤖<small>Сыграть</small></button>`;
    $$("#opCtrl button", el).forEach(b => b.onclick = () => {
      const c = b.dataset.c;
      if (c === "restart") startTrain();
      if (c === "hint" && ply < sans.length) { errors++; board.set({ shapes: [{ from: ucis[ply].slice(0, 2), to: ucis[ply].slice(2, 4), color: "blue" }] }); }
      if (c === "bot") playFrom();
    });
  }
  async function autoOpp() {
    await sleep(450);
    if (mode !== "train" || ply >= sans.length) return;
    const c = makeChess(fens[ply]);
    const m = c.move(sans[ply]);
    ply++;
    show(true);
    moveSound(m, c);
    if (ply >= sans.length) finishTrain(); else drawTrain();
  }
  function trainMove(uci) {
    if (mode !== "train") return;
    if (uci === ucis[ply] || (uci.length === 4 && ucis[ply].startsWith(uci) && ucis[ply].length === 5)) {
      const c = makeChess(fens[ply]);
      const m = c.move(sans[ply]);
      moveSound(m, c);
      const note = o.notes[ply];
      ply++;
      wrongHere = 0;
      show(false);
      if (ply >= sans.length) { finishTrain(); return; }
      drawTrain(note ? `<span class="green">✓</span> ${esc(note)}` : `<span class="green">✓ Верно</span>`);
      autoOpp();
    } else {
      errors++; wrongHere++;
      snd("wrong");
      board.shake();
      show(false);
      const hint = wrongHere >= 2 ? [{ from: ucis[ply].slice(0, 2), to: ucis[ply].slice(2, 4), color: "blue" }] : [];
      board.set({ shapes: hint });
      drawTrain(`<span class="red">Не по теории.</span> ${wrongHere >= 2 ? "Правильный ход показан стрелкой." : "Попробуйте ещё раз."}`);
    }
  }
  function startTrain() {
    mode = "train"; ply = 0; errors = 0; wrongHere = 0;
    show(false);
    drawTrain("Сыграйте вариант по памяти.");
    if (o.user === "b") autoOpp();
  }
  function finishTrain() {
    const st = S.openings[o.id] || (S.openings[o.id] = { runs: 0, perfect: 0, days: [] });
    st.runs++;
    const d = today();
    if (!errors && !st.days.includes(d)) { st.days.push(d); st.perfect = st.days.length; }
    const learnedNow = !st.learned && st.perfect >= 2;
    if (learnedNow) { st.learned = Date.now(); unlock("opening-1"); }
    activity("lessons");
    save();
    snd(errors ? "end" : "right");
    drawTrain(errors ? `Пройдено с ошибками: ${errors}. Повторите ещё раз.` : learnedNow ? `🎉 Вариант выучен!` : st.perfect >= 2 ? "Без ошибок!" : `Без ошибок! Повторите завтра — после двух чистых дней вариант засчитается выученным.`);
  }
  function playFrom() {
    const bot = botById(S.lastBot || "olga");
    const meP = me();
    startGame({
      mode: "bot", botId: bot.id, userColor: o.user, tc: "none", startFen: fens[Math.min(ply || sans.length, sans.length)],
      white: o.user === "w" ? meP : botPlayer(bot), black: o.user === "b" ? meP : botPlayer(bot),
      coach: true, allowHints: true, allowTakeback: true,
      intro: `Играем дальше с позиции дебюта «${o.t}» против бота «${bot.name}».`,
    });
  }
  $$("#opMode button", el).forEach(b => b.onclick = () => {
    $$("#opMode button", el).forEach(x => x.classList.toggle("on", x === b));
    if (b.dataset.m === "train") startTrain();
    else { mode = "learn"; ply = 0; show(false); drawLearn(); }
  });
  show(false);
  drawLearn();
  return () => board && board.destroy();
}
