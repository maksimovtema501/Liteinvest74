/* Доска анализа (движок, варианты, расстановка, PGN) и разбор партии:
   оценка каждого хода, график, точность, советы тренера и ИИ-тренер. */
import { $, $$, esc, modal, toast, copyText, scoreOf, winPct, fmtEval, MATE } from "./util.js";
import { S, save, setActive, unlock } from "./store.js";
import { Board, parseFen, pieceUrl } from "./board.js";
import { Chess, makeChess, dests, playUci, checkSquare, sanLine, figSan, buildPgn, parseInput, openingOf, openingRu, bookMoves, START_FEN } from "./chessutil.js";
import { engine, liveEngine } from "./engine.js";
import { analyseGame, classify, accuracy, packReview, unpackCls, CLS, CLS_ORDER, BAD } from "./review.js";
import { PuzzleRunner } from "./puzzles.js";
import { startGame, me, botPlayer, suggestBot } from "./play.js";
import { aiKey, aiAsk, aiHtml, aiError, aiKeyHelp } from "./ai.js";
import { moveSound } from "./sound.js";
import { go } from "./router.js";

/* ======================================================================= */
/* дерево ходов с вариантами */
class Tree {
  constructor(fen) {
    this.seq = 0;
    this.root = { id: 0, fen, children: [], parent: null, ply: 0 };
    this.byId = new Map([[0, this.root]]);
    this.cur = this.root;
  }
  add(parent, uci) {
    const ex = parent.children.find(c => c.uci === uci);
    if (ex) return ex;
    const c = makeChess(parent.fen);
    const m = playUci(c, uci);
    if (!m) return null;
    const n = { id: ++this.seq, fen: c.fen(), san: m.san, uci, parent, children: [], ply: parent.ply + 1, m };
    parent.children.push(n);
    this.byId.set(n.id, n);
    return n;
  }
  mainline() { const out = []; let n = this.root; while (n.children.length) { n = n.children[0]; out.push(n); } return out; }
  path(n = this.cur) { const out = []; while (n.parent) { out.unshift(n); n = n.parent; } return out; }
  remove(n) {
    if (!n.parent) return;
    n.parent.children = n.parent.children.filter(c => c !== n);
    if (this.path().includes(n)) this.cur = n.parent;
  }
  promote(n) {
    // поднять вариант до главной линии
    let x = n;
    while (x.parent) { const p = x.parent; p.children = [x, ...p.children.filter(c => c !== x)]; x = p; }
  }
}

function moveNo(node, force) {
  const white = node.parent.fen.split(" ")[1] === "w";
  const num = +node.parent.fen.split(" ")[5] || 1;
  return white ? `${num}. ` : force ? `${num}… ` : "";
}

/* ======================================================================= */
export function viewAnalysis(el, arg, params) {
  document.body.classList.add("immersive");
  setActive("analysis");
  let start = START_FEN, moves = [];
  let title = "Анализ";
  if (params.game) {
    const g = S.games.find(x => x.id === params.game);
    if (g) { start = g.startFen || START_FEN; moves = g.moves ? g.moves.split(" ") : []; title = `${g.white.name} — ${g.black.name}`; }
  } else if (params.fen) {
    start = makeChess(params.fen).fen();
    moves = params.moves ? params.moves.split(" ") : [];
  } else if (S.analysisFen) {
    start = S.analysisFen; moves = S.analysisMoves || [];
  }
  const A = new AnalysisCtl(el, start, moves, { title, gameId: params.game, jumpEnd: !params.fen });
  return () => A.destroy();
}

class AnalysisCtl {
  constructor(el, start, moves, o = {}) {
    this.el = el; this.o = o;
    this.tree = new Tree(start);
    let n = this.tree.root;
    for (const u of moves) { const c = this.tree.add(n, u); if (!c) break; n = c; }
    this.tree.cur = o.jumpEnd === false ? this.tree.root : (o.fenStartAtRoot ? this.tree.root : n);
    if (o.startPly != null) { const ml = this.tree.mainline(); this.tree.cur = o.startPly ? ml[o.startPly - 1] || n : this.tree.root; }
    this.engineOn = o.engineOn ?? true;
    this.orientation = o.orientation || "w";
    this.token = 0;
    this.lines = [];
    this.mount();
  }

  mount() {
    const el = this.el;
    el.innerHTML = `<div class="play">
      <div class="play-main">
        <div class="gtop"><button class="back" id="aBack">←</button><div class="tt">${esc(this.o.title || "Анализ")}</div><button class="iconbtn" id="aMenu2">⋯</button></div>
        <div class="board-col">
          <div class="board-row"><div class="evalbar"><div class="w"></div><div class="t"></div></div><div id="aBoard"></div></div>
        </div>
      </div>
      <aside class="side">
        <div class="side-head"><button class="back desk-only" id="aBack2" style="width:32px;height:32px">←</button>
          <label class="row small" style="gap:8px;cursor:pointer"><input type="checkbox" class="toggle" id="aEng" ${this.engineOn ? "checked" : ""}>Движок</label>
          <span class="small muted" id="aDepth" style="margin-left:auto"></span></div>
        <div class="lines" id="aLines"></div>
        <div class="small muted" id="aOpen" style="padding:6px 12px"></div>
        <div class="side-body" id="aMoves" style="padding:8px 12px;line-height:1.9;font-size:14.5px"></div>
        <div class="side-foot"><div class="ctrl" id="aCtrl">
          <button data-c="menu">⋯<small>Меню</small></button><button data-c="flip">⇅<small>Развернуть</small></button>
          <button data-c="first">⏮<small>Начало</small></button><button data-c="prev">◀<small>Назад</small></button><button data-c="next">▶<small>Вперёд</small></button><button data-c="last">⏭<small>Конец</small></button></div></div>
      </aside></div>`;
    $("#aBack", el).onclick = $("#aBack2", el).onclick = () => history.length > 1 ? history.back() : go("play");
    $("#aMenu2", el).onclick = () => this.menu();
    $("#aEng", el).onchange = e => { this.engineOn = e.target.checked; this.update(false); };
    $$("#aCtrl button", el).forEach(b => b.onclick = () => this.ctrl(b.dataset.c));
    this.board = new Board($("#aBoard", el), {
      orientation: this.orientation, coords: S.settings.coords, legal: S.settings.legal, anim: S.settings.anim, set: S.settings.pieces,
      onMove: (f, t, p) => this.userMove(f + t + (p || "")),
    });
    this.keys = e => {
      if (e.target.closest("input,textarea")) return;
      if (e.key === "ArrowLeft") this.ctrl("prev");
      if (e.key === "ArrowRight") this.ctrl("next");
      if (e.key === "ArrowUp") this.ctrl("first");
      if (e.key === "ArrowDown") this.ctrl("last");
    };
    addEventListener("keydown", this.keys);
    this.update(false);
  }

  destroy() {
    this.token++;
    liveEngine.stop();
    removeEventListener("keydown", this.keys);
    this.board.destroy();
    // запоминаем доску анализа между заходами
    if (!this.o.gameId && !this.o.review) {
      S.analysisFen = this.tree.root.fen;
      S.analysisMoves = this.tree.mainline().map(n => n.uci).slice(0, 300);
      save();
    }
  }

  userMove(uci) {
    const n = this.tree.add(this.tree.cur, uci);
    if (!n) { this.update(false); return; }
    this.tree.cur = n;
    moveSound(n.m, makeChess(n.fen));
    this.update(false);
  }

  ctrl(c) {
    const t = this.tree;
    if (c === "prev" && t.cur.parent) t.cur = t.cur.parent;
    else if (c === "next" && t.cur.children.length) t.cur = t.cur.children[0];
    else if (c === "first") t.cur = t.root;
    else if (c === "last") { while (t.cur.children.length) t.cur = t.cur.children[0]; }
    else if (c === "flip") { this.orientation = this.orientation === "w" ? "b" : "w"; this.board.set({ orientation: this.orientation }); this.renderEval(); return; }
    else if (c === "menu") { this.menu(); return; }
    else return;
    if (c === "next" && t.cur.m) moveSound(t.cur.m, makeChess(t.cur.fen));
    this.update(true);
  }

  update(animate) {
    const n = this.tree.cur;
    const c = makeChess(n.fen);
    this.board.set({
      fen: n.fen, lastMove: n.uci ? [n.uci.slice(0, 2), n.uci.slice(2, 4)] : null, check: checkSquare(c), animate,
      turn: c.turn(), movable: { color: "both", dests: dests(c) }, shapes: [], badges: this.badgeFor ? this.badgeFor(n) : {},
    });
    this.renderMoves();
    const op = openingOf(n.fen) || this.lastOpening(n);
    const book = this.o.review ? [] : bookMoves(n.fen).map(u => { const cc = makeChess(n.fen); const m = playUci(cc, u); return m ? { u, san: m.san } : null; }).filter(Boolean);
    $("#aOpen", this.el).innerHTML = (op ? `📖 <b style="color:var(--text)">${esc(openingRu(op.name).ru)}</b>${openingRu(op.name).rest ? " · " + esc(openingRu(op.name).rest) : ""} <span class="dim">${op.eco}</span>` : "") +
      (book.length ? `<div class="chips" style="margin-top:6px;gap:4px"><span class="tiny dim" style="align-self:center">Теория:</span>${book.slice(0, 12).map(b => `<button class="chip sm" data-u="${b.u}">${esc(figSan(b.san))}</button>`).join("")}</div>` : "");
    $$("#aOpen [data-u]", this.el).forEach(b => b.onclick = () => this.userMove(b.dataset.u));
    this.onNode && this.onNode(n);
    this.runEngine();
  }

  lastOpening(n) {
    while (n) { const o = openingOf(n.fen); if (o) return o; n = n.parent; }
    return null;
  }

  runEngine() {
    const tok = ++this.token;
    const n = this.tree.cur;
    liveEngine.stop();
    this.lines = [];
    const box = $("#aLines", this.el);
    const c = makeChess(n.fen);
    if (!this.engineOn) { box.innerHTML = ""; $("#aDepth", this.el).textContent = ""; this.renderEval(this.evalWhenOff ? this.evalWhenOff(n) : null); return; }
    if (c.isGameOver()) {
      box.innerHTML = `<div class="ln"><span class="muted">${c.isCheckmate() ? "Мат" : "Ничья"}</span></div>`;
      this.renderEval(c.isCheckmate() ? (c.turn() === "w" ? -MATE : MATE) : 0);
      return;
    }
    box.innerHTML = `<div class="ln"><span class="muted">Движок думает…</span></div>`;
    const sign = c.turn() === "w" ? 1 : -1;
    liveEngine.analyse(n.fen, {
      depth: 22, multipv: 3, tag: "live",
      onInfo: (lines, depth) => {
        if (tok !== this.token) return;
        this.lines = lines;
        $("#aDepth", this.el).textContent = `глубина ${depth}`;
        box.innerHTML = lines.map((l, i) => {
          const s = scoreOf(l) * sign;
          return `<div class="ln" data-i="${i}"><span class="ev ${s < 0 ? "neg" : ""}">${fmtEval(s)}</span><span class="pv">${esc(sanLine(n.fen, l.pv, 10))}</span></div>`;
        }).join("");
        $$(".ln[data-i]", box).forEach(d => d.onclick = () => {
          const l = this.lines[+d.dataset.i];
          if (l && l.pv[0]) this.userMove(l.pv[0]);
        });
        if (lines[0]) {
          this.renderEval(scoreOf(lines[0]) * sign);
          if (!this.o.review || !this.o.hideArrows) {
            const b = lines[0].pv[0];
            this.board.set({ shapes: [{ from: b.slice(0, 2), to: b.slice(2, 4), color: "best", opacity: 0.55 }].concat(this.extraShapes ? this.extraShapes(n) : []) });
          }
        }
      },
    }).catch(() => { if (tok === this.token) box.innerHTML = `<div class="ln"><span class="red">Движок не запустился</span></div>`; });
  }

  renderEval(s = this.lastEval) {
    this.lastEval = s;
    const bar = $(".evalbar", this.el);
    if (!bar) return;
    bar.classList.toggle("hidden", s == null);
    if (s == null) return;
    bar.classList.toggle("flip", this.orientation === "b");
    $(".w", bar).style.height = winPct(s) + "%";
    const t = $(".t", bar);
    t.textContent = fmtEval(s).replace("+", "");
    t.style.color = s >= 0 ? "#222" : "#fff";
    const atBottom = (this.orientation === "w") === (s >= 0);
    t.style.top = atBottom ? "auto" : "3px"; t.style.bottom = atBottom ? "3px" : "auto";
  }

  renderMoves() {
    const t = this.tree;
    const icon = n => this.iconFor ? this.iconFor(n) : "";
    const mv = (n, force) => `<span class="am ${n === t.cur ? "cur" : ""}" data-n="${n.id}" style="cursor:pointer;padding:2px 4px;border-radius:4px;font-weight:600;${n === t.cur ? "background:#4b4847;color:#fff" : ""}">${moveNo(n, force)}${icon(n)}${esc(figSan(n.san))}</span> `;
    const line = (node, force) => {
      let html = "", n = node;
      while (n.children.length) {
        const main = n.children[0];
        html += mv(main, force);
        for (const v of n.children.slice(1)) html += `<span class="dim" style="font-size:13px">(${mv(v, true)}${line(v, false)})</span> `;
        force = n.children.length > 1;
        n = main;
      }
      return html;
    };
    const box = $("#aMoves", this.el);
    box.innerHTML = line(t.root, true) || `<span class="dim small">Сделайте ход на доске или загрузите партию через меню ⋯</span>`;
    $$("[data-n]", box).forEach(s => s.onclick = () => { t.cur = t.byId.get(+s.dataset.n); this.update(true); });
    const cur = $(".am.cur", box);
    if (cur) cur.scrollIntoView({ block: "nearest" });
  }

  menu() {
    const n = this.tree.cur;
    const m = modal(`<h2>Анализ</h2><div class="col">
      <button class="btn block" data-k="load" style="justify-content:flex-start">📥 Загрузить PGN или FEN</button>
      <button class="btn block" data-k="setup" style="justify-content:flex-start">✏️ Расставить позицию</button>
      <button class="btn block" data-k="bot" style="justify-content:flex-start">🤖 Сыграть с этой позиции против бота</button>
      <button class="btn block" data-k="pgn" style="justify-content:flex-start">📋 Скопировать PGN</button>
      <button class="btn block" data-k="fen" style="justify-content:flex-start">📋 Скопировать FEN</button>
      ${n.parent ? `<button class="btn block" data-k="promote" style="justify-content:flex-start">⬆ Сделать вариант главным</button>
      <button class="btn block" data-k="del" style="justify-content:flex-start">✂ Удалить ход и продолжение</button>` : ""}
      <button class="btn block" data-k="clear" style="justify-content:flex-start">♻ Начальная позиция</button>
      </div>`);
    $$("[data-k]", m).forEach(b => b.onclick = () => {
      m.close();
      const k = b.dataset.k;
      if (k === "load") this.loadDialog();
      if (k === "setup") this.editor();
      if (k === "bot") this.playBot();
      if (k === "pgn") copyText(buildPgn({ white: "?", black: "?", startFen: this.tree.root.fen, moves: this.tree.path().map(x => x.uci) }));
      if (k === "fen") copyText(n.fen);
      if (k === "promote") { this.tree.promote(n); this.update(false); }
      if (k === "del") { this.tree.remove(n); this.update(false); }
      if (k === "clear") this.reset(START_FEN, []);
    });
  }

  reset(fen, moves) {
    this.tree = new Tree(fen);
    let n = this.tree.root;
    for (const u of moves) { const c = this.tree.add(n, u); if (!c) break; n = c; }
    this.tree.cur = n;
    this.update(false);
  }

  loadDialog() {
    const m = modal(`<h2>Загрузить</h2><p class="small muted" style="margin:0 0 8px">Вставьте PGN партии (например, из chess.com или lichess) или FEN позиции.</p>
      <textarea id="ldIn" style="min-height:160px" placeholder="1. e4 e5 2. Nf3 …"></textarea>
      <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn ghost" data-close>Отмена</button><button class="btn primary" id="ldGo">Загрузить</button></div>`, { wide: true });
    $("#ldGo", m).onclick = () => {
      const r = parseInput($("#ldIn", m).value);
      if (!r) { toast("Не получилось разобрать текст"); return; }
      m.close();
      this.reset(r.startFen, r.moves);
      if (r.moves.length && r.headers) this.offerImport(r);
    };
  }

  offerImport(r) {
    const h = r.headers || {};
    const m = modal(`<h2>Партия загружена</h2><p class="small muted">${esc(h.White || "Белые")} — ${esc(h.Black || "Чёрные")} · ${Math.ceil(r.moves.length / 2)} ходов. Сохранить её в «Мои партии» и сделать разбор с оценкой каждого хода?</p>
      <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn ghost" data-close>Только анализ</button><button class="btn primary" id="imp">🔍 Разбор партии</button></div>`);
    $("#imp", m).onclick = () => {
      m.close();
      const name = S.profile.name || "Вы";
      const W = h.White || "Белые", B = h.Black || "Чёрные";
      const user = W === name ? "w" : B === name ? "b" : "w";
      const rec = { id: "imp" + Date.now().toString(36), ts: Date.now(), mode: "import", white: { name: W, av: "⚪" }, black: { name: B, av: "⚫" }, user, result: h.Result && h.Result !== "*" ? h.Result : "*", reason: "загружена", tc: "none", moves: r.moves.join(" ") };
      if (r.startFen !== START_FEN) rec.startFen = r.startFen;
      S.games.unshift(rec); save();
      go("review/" + rec.id);
    };
  }

  editor() {
    let pos = parseFen(this.tree.cur.fen), turn = this.tree.cur.fen.split(" ")[1], pick = "wP";
    const pieces = ["wK", "wQ", "wR", "wB", "wN", "wP", "x", "bK", "bQ", "bR", "bB", "bN", "bP", "x2"];
    const m = modal(`<h2>Расстановка</h2>
      <div id="edBoard" style="max-width:380px;margin:0 auto"></div>
      <div class="palette" style="margin-top:10px">${pieces.map(p => p.startsWith("x") ? `<button data-p="x" title="Стереть">🧽</button>` : `<button data-p="${p}" style="background-image:url(${pieceUrl(S.settings.pieces, p)})"></button>`).join("")}</div>
      <div class="seg" style="margin-top:10px" id="edTurn"><button data-t="w">Ход белых</button><button data-t="b">Ход чёрных</button></div>
      <div class="row wrap" style="margin-top:10px"><button class="btn sm" id="edStart">Начальная</button><button class="btn sm" id="edClear">Очистить</button><div style="flex:1"></div><button class="btn primary" id="edOk">Готово</button></div>`, { wide: true });
    const b = new Board($("#edBoard", m), { coords: true, set: S.settings.pieces, anim: false, drawable: false });
    const fenOf = () => {
      const rows = [];
      for (let r = 8; r >= 1; r--) {
        let row = "", e = 0;
        for (const f of "abcdefgh") {
          const p = pos.get(f + r);
          if (!p) { e++; continue; }
          if (e) { row += e; e = 0; }
          row += p[0] === "w" ? p[1] : p[1].toLowerCase();
        }
        rows.push(row + (e || ""));
      }
      let cast = "";
      if (pos.get("e1") === "wK") { if (pos.get("h1") === "wR") cast += "K"; if (pos.get("a1") === "wR") cast += "Q"; }
      if (pos.get("e8") === "bK") { if (pos.get("h8") === "bR") cast += "k"; if (pos.get("a8") === "bR") cast += "q"; }
      return `${rows.join("/")} ${turn} ${cast || "-"} - 0 1`;
    };
    const draw = () => {
      b.set({ fen: fenOf(), animate: false });
      $$("[data-p]", m).forEach(x => x.classList.toggle("on", x.dataset.p === pick));
      $$("#edTurn button", m).forEach(x => x.classList.toggle("on", x.dataset.t === turn));
    };
    b.el.addEventListener("pointerdown", e => {
      const sq = b.sqAt(e.clientX, e.clientY);
      if (!sq) return;
      if (pick === "x" || pos.get(sq) === pick) pos.delete(sq);
      else {
        if (pick[1] === "K") for (const [s, p] of pos) if (p === pick) pos.delete(s);
        pos.set(sq, pick);
      }
      draw();
    });
    $$("[data-p]", m).forEach(x => x.onclick = () => { pick = x.dataset.p; draw(); });
    $$("#edTurn button", m).forEach(x => x.onclick = () => { turn = x.dataset.t; draw(); });
    $("#edStart", m).onclick = () => { pos = parseFen(START_FEN); turn = "w"; draw(); };
    $("#edClear", m).onclick = () => { pos = new Map([["e1", "wK"], ["e8", "bK"]]); draw(); };
    $("#edOk", m).onclick = () => {
      const fen = fenOf();
      try { new Chess(fen); } catch (e) { toast("Позиция невозможна: " + String(e.message || e).replace(/^Invalid FEN: /, "")); return; }
      b.destroy();
      m.close();
      this.reset(fen, []);
    };
    draw();
  }

  playBot() {
    const fen = this.tree.cur.fen;
    const c = makeChess(fen);
    if (c.isGameOver()) { toast("Партия уже окончена"); return; }
    const bot = suggestBot();
    const uc = c.turn();
    const meP = me();
    startGame({
      mode: "bot", botId: bot.id, userColor: uc, tc: "none", startFen: fen,
      white: uc === "w" ? meP : botPlayer(bot), black: uc === "b" ? meP : botPlayer(bot),
      coach: true, allowHints: true, allowTakeback: true,
    });
  }
}

/* ======================================================================= */
/* разбор партии */
export function viewReview(el, id, params) {
  const g = S.games.find(x => x.id === id);
  if (!g) { el.innerHTML = `<div class="empty">Партия не найдена. <a href="#/history">Мои партии</a></div>`; return; }
  document.body.classList.add("immersive");
  setActive("review");
  const moves = g.moves ? g.moves.split(" ") : [];
  if (!moves.length) { el.innerHTML = `<div class="empty">В партии нет ходов.</div>`; return; }
  if (!g.review || !g.review.cm) return runReview(el, g, moves);
  return showReview(el, g, moves, params);
}

function runReview(el, g, moves) {
  let alive = true;
  el.innerHTML = `<div class="topbar" style="padding:10px"><button class="back" onclick="history.back()">←</button><h1>Разбор партии</h1></div>
    <div class="card" style="max-width:520px;margin:0 auto;text-align:center">
      <div style="font-size:48px">🔍</div>
      <div class="b" style="font-size:18px">${esc(g.white.name)} — ${esc(g.black.name)}</div>
      <p class="small muted">Движок оценивает каждую позицию. Это займёт ${moves.length > 60 ? "минуту-другую" : "около полуминуты"}.</p>
      <div class="bar" style="height:12px;margin:14px 0"><i id="rvBar" style="width:0%"></i></div>
      <div class="small muted" id="rvTxt">Запуск движка…</div>
    </div>`;
  const t0 = performance.now();
  analyseGame(g.startFen, moves, {
    depth: S.settings.reviewDepth || 12, tag: "review",
    onProgress: p => {
      if (!alive) return;
      $("#rvBar", el).style.width = Math.round(p * 100) + "%";
      const el2 = $("#rvTxt", el);
      const sec = (performance.now() - t0) / 1000;
      el2.textContent = `${Math.round(p * 100)}% · осталось ~${Math.max(1, Math.round(sec / p * (1 - p)))} с`;
    },
  }).then(an => {
    if (!alive || !an) return;
    const cl = classify(an, { coachStyle: S.settings.coachStyle });
    const acc = accuracy(an, cl);
    g.review = { ...packReview(an, cl, acc), cm: cl.map(c => c.comment), ts: Date.now() };
    unlock("review-1");
    if (g.user && cl.some(c => c.cls === "brilliant" && (c.white ? "w" : "b") === g.user)) unlock("brilliant");
    if (g.user && acc[g.user] >= 90 && moves.length >= 40) unlock("acc-90");
    save();
    if (location.hash.startsWith("#/review/" + g.id)) showReview(el, g, moves, {});
  }).catch(e => {
    if (!alive) return;
    $("#rvTxt", el).innerHTML = `<span class="red">Не удалось запустить движок: ${esc(e.message || e)}</span>`;
  });
  return () => { alive = false; engine.cancel("review"); };
}

function graphSvg(g, n) {
  const ev = [g.review.e0, ...g.review.ev];
  const W = 600, H = 110;
  const x = i => (i / Math.max(1, ev.length - 1)) * W;
  const y = s => H - winPct(s) / 100 * H;
  let d = `M0,${H} `;
  ev.forEach((s, i) => { d += `L${x(i).toFixed(1)},${y(s).toFixed(1)} `; });
  d += `L${W},${H} Z`;
  const dots = g.review.cls.split("").map((c, i) => {
    const k = unpackCls(c);
    if (!["brilliant", "great", "mistake", "miss", "blunder"].includes(k)) return "";
    const col = { brilliant: "#1baca6", great: "#5c8bb0", mistake: "#ffa459", miss: "#ff7769", blunder: "#fa412d" }[k];
    return `<circle cx="${x(i + 1)}" cy="${y(ev[i + 1])}" r="5" fill="${col}" stroke="#222" stroke-width="1.5"/>`;
  }).join("");
  return `<svg class="graph" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" id="rvGraph">
    <path d="${d}" fill="#fff"/><line x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}" stroke="#888" stroke-dasharray="4 4" stroke-width="1"/>
    <line id="rvCur" x1="${x(n)}" y1="0" x2="${x(n)}" y2="${H}" stroke="#81b64c" stroke-width="3"/>${dots}</svg>`;
}

function showReview(el, g, moves, params) {
  const R = g.review;
  const user = g.user || "w";
  const firstWhite = (g.startFen || START_FEN).split(" ")[1] === "w";
  const plyColor = i => (i % 2 === 0) === firstWhite ? "w" : "b";
  const counts = side => {
    const o = {};
    R.cls.split("").forEach((c, i) => { if (plyColor(i) === side) o[unpackCls(c)] = (o[unpackCls(c)] || 0) + 1; });
    return o;
  };
  const cw = counts("w"), cb = counts("b");
  const best = R.best.split(" ");
  // советы тренера: нужна полная структура — строим облегчённую из сохранённого
  const mineIdx = R.cls.split("").map((c, i) => ({ k: unpackCls(c), i })).filter(x => plyColor(x.i) === user);
  const bad = mineIdx.filter(x => ["mistake", "blunder", "miss"].includes(x.k));
  const startPly = params && params.ply != null ? +params.ply : null;

  el.innerHTML = "";
  const A = new AnalysisCtl(el, g.startFen || START_FEN, moves, {
    title: "Разбор партии", review: true, gameId: g.id, orientation: user, jumpEnd: false, startPly: startPly != null ? startPly : 0, engineOn: false,
  });
  const side = $(".side", el);
  const sumBox = document.createElement("div");
  sumBox.style.cssText = "padding:12px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:10px";
  const resTxt = g.result === "1/2-1/2" ? "½–½" : g.result;
  sumBox.innerHTML = `
    <div class="acc">
      <div class="p w"><div class="small muted">${esc(g.white.name)}</div><div class="v">${R.acc.w ?? "—"}</div><div class="tiny muted">точность</div></div>
      <div style="display:flex;align-items:center;font-weight:800">${resTxt}</div>
      <div class="p bk"><div class="small muted">${esc(g.black.name)}</div><div class="v">${R.acc.b ?? "—"}</div><div class="tiny muted">точность</div></div>
    </div>
    ${graphSvg(g, startPly || 0)}
    <details><summary class="small b" style="cursor:pointer">Оценки ходов</summary>
      <table class="cls-table" style="margin-top:6px">${CLS_ORDER.map(k => `<tr><td>${cw[k] || 0}</td><td><span class="ci ${CLS[k].c}">${CLS[k].s}</span></td><td>${CLS[k].t}</td><td>${cb[k] || 0}</td></tr>`).join("")}</table>
    </details>
    <div class="coachbox" style="background:var(--panel2)" id="rvCoach"><div class="ca">🧑‍🏫</div><div class="cm" id="rvCm"></div></div>
    <div class="row wrap" style="gap:6px">
      ${bad.length ? `<button class="btn sm primary" id="rvRetry">🎯 Повторить ошибки (${bad.length})</button>` : ""}
      <button class="btn sm" id="rvAiGame">🤖 Разбор от ИИ-тренера</button>
      <button class="btn sm ghost" id="rvAiMove">❓ Почему?</button>
    </div>`;
  side.insertBefore(sumBox, $("#aLines", el));
  $("#aLines", el).style.display = "none";
  const engToggle = $("#aEng", el);
  engToggle.onchange = e => { A.engineOn = e.target.checked; $("#aLines", el).style.display = A.engineOn ? "" : "none"; A.update(false); };

  const ml = () => A.tree.mainline();
  const idxOf = n => ml().indexOf(n);
  A.iconFor = n => {
    const i = idxOf(n);
    if (i < 0) return "";
    const k = unpackCls(R.cls[i]);
    return ["brilliant", "great", "inaccuracy", "mistake", "miss", "blunder"].includes(k) ? `<span class="ci ${CLS[k].c}" style="width:15px;height:15px;font-size:8.5px;vertical-align:-2px;margin-right:2px">${CLS[k].s}</span>` : "";
  };
  A.badgeFor = n => {
    const i = idxOf(n);
    if (i < 0 || !n.uci) return {};
    const k = unpackCls(R.cls[i]);
    return { [n.uci.slice(2, 4)]: { cls: CLS[k].c, text: CLS[k].s } };
  };
  A.extraShapes = () => [];
  A.evalWhenOff = n => { const i = idxOf(n); return i >= 0 ? R.ev[i] : n === A.tree.root ? R.e0 : null; };
  const cm = $("#rvCm", el);
  const graph = () => $("#rvGraph", el);
  A.onNode = n => {
    const i = idxOf(n);
    const cur = $("#rvCur", el);
    const ev = [R.e0, ...R.ev];
    if (cur && i >= -1) {
      const x = ((i + 1) / Math.max(1, ev.length - 1)) * 600;
      cur.setAttribute("x1", x); cur.setAttribute("x2", x);
    }
    if (n === A.tree.root) {
      const sumT = summaryText(g, mineIdx, bad);
      cm.innerHTML = sumT;
      return;
    }
    if (i < 0) { cm.innerHTML = `<span class="muted">Свой вариант. Включите движок, чтобы видеть оценку.</span>`; return; }
    const k = unpackCls(R.cls[i]);
    const shapes = [];
    if (best[i] && best[i] !== n.uci && !["book", "forced", "best", "brilliant", "great"].includes(k)) {
      shapes.push({ from: best[i].slice(0, 2), to: best[i].slice(2, 4), color: "best", opacity: 0.75 });
    }
    setTimeout(() => A.board.set({ shapes }), 0);
    A.extraShapes = () => shapes;
    const ev2 = R.ev[i];
    cm.innerHTML = `<div class="row" style="gap:6px;margin-bottom:3px"><span class="ci ${CLS[k].c}">${CLS[k].s}</span><b>${esc(figSan(n.san))} — ${CLS[k].t.toLowerCase()}</b><span class="tag" style="margin-left:auto">${fmtEval(ev2)}</span></div>
      <div>${esc(R.cm[i] || "")}</div>`;
  };
  graph()?.addEventListener("click", e => {
    const r = graph().getBoundingClientRect();
    const n = Math.round((e.clientX - r.left) / r.width * moves.length);
    const list = ml();
    A.tree.cur = n <= 0 ? A.tree.root : list[Math.min(list.length, n) - 1];
    A.update(true);
  });
  $("#rvRetry", el)?.addEventListener("click", () => retryMistakes(g, moves, bad.map(b => b.i)));
  $("#rvAiGame", el).onclick = () => aiGameReview(g, moves, mineIdx);
  $("#rvAiMove", el).onclick = () => {
    const n = A.tree.cur, i = idxOf(n);
    if (i < 0) { toast("Выберите ход партии"); return; }
    aiMoveExplain(g, moves, i);
  };
  A.update(false);
  return () => A.destroy();
}

function summaryText(g, mineIdx, bad) {
  const user = g.user || "w";
  const acc = g.review.acc[user];
  const cnt = k => mineIdx.filter(x => x.k === k).length;
  const brill = cnt("brilliant") + cnt("great");
  const tips = [];
  if (cnt("blunder")) tips.push(`зевков: <b>${cnt("blunder")}</b>`);
  if (cnt("mistake")) tips.push(`ошибок: <b>${cnt("mistake")}</b>`);
  if (cnt("miss")) tips.push(`упущенных возможностей: <b>${cnt("miss")}</b>`);
  const verdict = acc >= 90 ? "Отличная партия!" : acc >= 80 ? "Хорошая партия." : acc >= 65 ? "Неплохо, но есть над чем поработать." : "Трудная партия — разберём ошибки.";
  return `<b>${verdict}</b> Ваша точность — ${acc ?? "—"}%.${brill ? ` Сильных ходов (!, !!): ${brill}.` : ""} ${tips.length ? "Было " + tips.join(", ") + "." : "Грубых ошибок нет."}
    ${bad.length ? `<br>Листайте ходы стрелками: зелёная стрелка покажет, как было лучше. Нажмите «Повторить ошибки», чтобы найти правильные ходы самому.` : ""}`;
}

/* повтор ошибок: позиция перед ошибкой, найдите ход движка */
function retryMistakes(g, moves, idxs) {
  const c = makeChess(g.startFen);
  const fens = [c.fen()];
  for (const u of moves) { playUci(c, u); fens.push(c.fen()); }
  const best = g.review.best.split(" ");
  let k = 0, runner = null, okCount = 0;
  const m = modal(`<h2>Повторить ошибки</h2><div id="rtInfo" class="small muted" style="margin-bottom:8px"></div><div id="rtBoard" style="max-width:420px;margin:0 auto"></div>
    <div class="row" style="margin-top:10px;justify-content:space-between"><button class="btn sm" id="rtHint">💡 Подсказка</button><button class="btn sm" id="rtSkip">Дальше →</button></div>`,
    { wide: true, onClose: () => runner && runner.destroy() });
  const next = () => {
    if (runner) runner.destroy();
    if (k >= idxs.length) {
      $("#rtInfo", m).innerHTML = `<b style="color:var(--text);font-size:16px">Готово: ${okCount} из ${idxs.length} с первой попытки.</b>`;
      $("#rtBoard", m).innerHTML = ""; $("#rtHint", m).remove(); $("#rtSkip", m).textContent = "Закрыть"; $("#rtSkip", m).onclick = () => m.close();
      return;
    }
    const i = idxs[k];
    const fen = fens[i];
    const n = +fen.split(" ")[5];
    $("#rtInfo", m).innerHTML = `Ошибка ${k + 1} из ${idxs.length} · ход ${n}${fen.split(" ")[1] === "w" ? "" : "…"}: в партии было <b style="color:var(--text)">${esc(figSan(makeChess(fen).move(parseU(moves[i])).san))}</b>. Найдите ход сильнее.`;
    runner = new PuzzleRunner($("#rtBoard", m), { id: "rt", fen, moves: [best[i]], selfStart: true, themes: [] }, {
      onResult: ok => { if (ok) okCount++; },
      onWrong: () => { $("#rtInfo", m).insertAdjacentHTML("beforeend", ` <span class="red">Не тот ход.</span>`); },
      onSolved: () => { $("#rtInfo", m).innerHTML += ` <span class="green b">✓ Верно!</span>`; setTimeout(() => { k++; next(); }, 900); },
    });
    runner.start();
  };
  $("#rtHint", m).onclick = () => runner && runner.hint();
  $("#rtSkip", m).onclick = () => { k++; next(); };
  next();
}
const parseU = u => ({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });

/* ---------- ИИ-тренер ---------- */
function aiModal(title) {
  const m = modal(`<h2>🤖 ${esc(title)}</h2><div class="prose" id="aiOut" style="user-select:text;-webkit-user-select:text"><p class="muted">Тренер думает…</p></div>
    <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn" data-close>Закрыть</button></div>`, { wide: true });
  return m;
}

function gameContext(g, moves) {
  const c = makeChess(g.startFen);
  const sans = [];
  for (const u of moves) { const m = playUci(c, u); if (!m) break; sans.push(m.san); }
  const startN = +(g.startFen || START_FEN).split(" ")[5] || 1;
  const firstWhite = (g.startFen || START_FEN).split(" ")[1] === "w";
  const rows = sans.map((s, i) => {
    const k = unpackCls(g.review.cls[i]);
    const n = startN + Math.floor((i + (firstWhite ? 0 : 1)) / 2);
    const white = (i % 2 === 0) === firstWhite;
    const b = g.review.best.split(" ")[i];
    return `${n}${white ? "." : "..."} ${s} [${CLS[k].t}; оценка после хода ${fmtEval(g.review.ev[i])}${b && b !== moves[i] && BAD.includes(k) ? `; движок предлагал ${uciToSan(c, g, moves, i, b)}` : ""}]`;
  });
  return { sans, rows };
}
function uciToSan(_c, g, moves, i, uci) {
  const c = makeChess(g.startFen);
  for (let j = 0; j < i; j++) playUci(c, moves[j]);
  try { return c.move(parseU(uci)).san; } catch { return uci; }
}

async function aiGameReview(g, moves, mineIdx) {
  if (!aiKey()) { aiKeyHelp(() => aiGameReview(g, moves, mineIdx)); return; }
  const m = aiModal("Разбор от ИИ-тренера");
  const out = $("#aiOut", m);
  const { rows } = gameContext(g, moves);
  const user = g.user || "w";
  const prompt = `Разбери партию ученика как тренер. Ученик играл ${user === "w" ? "белыми" : "чёрными"}${g.white.rating || g.black.rating ? ` (соперник: ${user === "w" ? g.black.name + " " + (g.black.rating || "") : g.white.name + " " + (g.white.rating || "")})` : ""}.
Результат: ${g.result} (${g.reason || ""}). Дебют: ${g.opening ? openingRu(g.opening).ru + " / " + g.opening : "не определён"}.
Точность (Stockfish): белые ${g.review.acc.w}%, чёрные ${g.review.acc.b}%.
Ходы с оценками движка:
${rows.join("\n")}

Напиши разбор для ученика:
1. Общее впечатление в 1–2 предложениях.
2. Что получилось хорошо.
3. Два-три ключевых момента, где ученик ошибся: номер хода, что сыграл, что было лучше и почему (идея, а не только ход).
4. Одно-два правила на будущее.
5. Что потренировать в приложении (задачи на конкретную тему, уроки эндшпиля, дебюты, игра с ботом).
Используй короткие абзацы, можно выделять **жирным**.`;
  try {
    await aiAsk({ messages: [{ role: "user", content: prompt }], effort: "medium", onText: t => { out.innerHTML = aiHtml(t); } });
  } catch (e) { out.innerHTML = `<p class="red">${esc(aiError(e))}</p>`; }
}

async function aiMoveExplain(g, moves, i) {
  if (!aiKey()) { aiKeyHelp(() => aiMoveExplain(g, moves, i)); return; }
  const c = makeChess(g.startFen);
  for (let j = 0; j < i; j++) playUci(c, moves[j]);
  const fen = c.fen();
  const played = c.move(parseU(moves[i])).san;
  const k = unpackCls(g.review.cls[i]);
  const bestU = g.review.best.split(" ")[i];
  const bestSan = bestU ? uciToSan(null, g, moves, i, bestU) : "";
  const evBefore = i ? g.review.ev[i - 1] : g.review.e0;
  const m = aiModal(`Ход ${played}`);
  const out = $("#aiOut", m);
  // свежие варианты движка для объяснения
  out.innerHTML = `<p class="muted">Считаю варианты…</p>`;
  let bestLine = "", replyLine = "";
  try {
    const r1 = await engine.analyse(fen, { depth: 14, tag: "ai" });
    bestLine = r1.lines[0] ? sanLine(fen, r1.lines[0].pv, 8, false) : "";
    const after = c.fen();
    if (!c.isGameOver()) {
      const r2 = await engine.analyse(after, { depth: 14, tag: "ai" });
      replyLine = r2.lines[0] ? sanLine(after, r2.lines[0].pv, 6, false) : "";
    }
  } catch {}
  const { rows } = gameContext(g, moves.slice(0, i + 1));
  const prompt = `Позиция (FEN): ${fen}
Ход ${fen.split(" ")[1] === "w" ? "белых" : "чёрных"}. Ученик играл ${(g.user || "w") === fen.split(" ")[1] ? "этой стороной" : "за соперника — этот ход сделал соперник"}.
Партия до этого момента: ${rows.slice(Math.max(0, i - 8)).join(" ")}
Сыгранный ход: ${played} — оценка движка: «${CLS[k].t}».
Оценка до хода: ${fmtEval(evBefore)}, после хода: ${fmtEval(g.review.ev[i])} (с точки зрения белых).
Лучший ход движка: ${bestSan || "—"}; главный вариант: ${bestLine || "—"}.
Лучший ответ соперника на сыгранный ход: ${replyLine || "—"}.
Объясни простыми словами, почему сыгранный ход ${BAD.includes(k) ? "плохой и в чём идея лучшего хода" : "хороший"}. 3–6 предложений.`;
  try {
    await aiAsk({ messages: [{ role: "user", content: prompt }], effort: "low", onText: t => { out.innerHTML = aiHtml(t); } });
  } catch (e) { out.innerHTML = `<p class="red">${esc(aiError(e))}</p>`; }
}
