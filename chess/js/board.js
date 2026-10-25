/* Доска: отрисовка, перетаскивание и клики, анимация, превращение,
   предходы, стрелки (правая кнопка мыши) и значки оценки ходов.
   Правил шахмат доска не знает — легальные ходы ей передаёт приложение. */
import { FILES } from "./util.js";

export const pieceUrl = (set, code) => `pieces/${set}/${code}.svg`;

export function parseFen(fen) {
  const pos = new Map();
  const rows = fen.split(" ")[0].split("/");
  rows.forEach((row, i) => {
    let f = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) { f += +ch; continue; }
      const color = ch === ch.toUpperCase() ? "w" : "b";
      pos.set(FILES[f] + (8 - i), color + ch.toUpperCase());
      f++;
    }
  });
  return pos;
}

const sqFile = sq => FILES.indexOf(sq[0]);
const sqRank = sq => +sq[1] - 1;
const dist = (a, b) => Math.max(Math.abs(sqFile(a) - sqFile(b)), Math.abs(sqRank(a) - sqRank(b)));

/* предходы: геометрия хода без учёта фигур на пути, как в chessground */
function premoveDests(pos, from) {
  const code = pos.get(from);
  if (!code) return [];
  const color = code[0], t = code[1], f = sqFile(from), r = sqRank(from);
  const out = [];
  const add = (ff, rr) => { if (ff >= 0 && ff < 8 && rr >= 0 && rr < 8) out.push(FILES[ff] + (rr + 1)); };
  const ray = dirs => dirs.forEach(([df, dr]) => { for (let i = 1; i < 8; i++) add(f + df * i, r + dr * i); });
  if (t === "N") [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].forEach(([a, b]) => add(f + a, r + b));
  if (t === "K") {
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (a || b) add(f + a, r + b);
    if (from === (color === "w" ? "e1" : "e8")) { add(6, r); add(2, r); }
  }
  if (t === "B" || t === "Q") ray([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  if (t === "R" || t === "Q") ray([[1, 0], [-1, 0], [0, 1], [0, -1]]);
  if (t === "P") {
    const d = color === "w" ? 1 : -1;
    add(f, r + d);
    if (r === (color === "w" ? 1 : 6)) add(f, r + 2 * d);
    add(f - 1, r + d); add(f + 1, r + d);
  }
  return out;
}

const BRUSH = { green: "#15781B", red: "#882020", blue: "#003088", yellow: "#e68f00", best: "#3e7d1f", gray: "#4a4a4a" };

export class Board {
  constructor(el, o = {}) {
    this.el = el;
    this.o = Object.assign({
      orientation: "w", coords: true, legal: true, anim: true, set: "cburnett",
      movable: null,          // { color: "w" | "b" | "both", dests: Map(from → [to]) }
      turn: "w", premove: false, autoQueen: false, drawable: true, viewOnly: false,
      onMove: null, onPremove: null, onShapes: null,
    }, o);
    this.pos = new Map();
    this.els = new Map();
    this.sel = null; this.lastMove = null; this.check = null; this.pre = null; this.hover = null;
    this.shapes = []; this.userShapes = []; this.marks = {}; this.badges = {}; this.stars = [];
    this.build();
    if (o.fen) this.setFen(o.fen, false);
  }

  build() {
    const el = this.el;
    el.classList.add("cb");
    el.innerHTML = `<div class="cb-sqs"></div><div class="cb-pcs"></div>
      <svg class="cb-svg" viewBox="0 0 8 8"><defs>${Object.entries(BRUSH).map(([k, c]) =>
        `<marker id="ah-${k}-${this.uid = this.uid || Math.random().toString(36).slice(2, 7)}" orient="auto" markerWidth="4" markerHeight="4" refX="2.05" refY="2"><path d="M0,0 V4 L3,2 Z" fill="${c}"/></marker>`).join("")}</defs><g></g></svg>
      <div class="cb-badges"></div>`;
    this.sqEl = el.querySelector(".cb-sqs");
    this.pcEl = el.querySelector(".cb-pcs");
    this.svgG = el.querySelector(".cb-svg g");
    this.badgeEl = el.querySelector(".cb-badges");
    this.sqEl.innerHTML = Array.from({ length: 64 }, () => `<div class="sq"></div>`).join("");
    this.sqDivs = [...this.sqEl.children];
    this.layoutSquares();

    this._down = e => this.down(e);
    this._move = e => this.moveP(e);
    this._up = e => this.up(e);
    el.addEventListener("pointerdown", this._down);
    addEventListener("pointermove", this._move);
    addEventListener("pointerup", this._up);
    addEventListener("pointercancel", this._up);
    el.addEventListener("contextmenu", e => e.preventDefault());
  }

  destroy() {
    removeEventListener("pointermove", this._move);
    removeEventListener("pointerup", this._up);
    removeEventListener("pointercancel", this._up);
    this.ghost && this.ghost.remove();
  }

  /* --- координаты --- */
  xy(sq) {
    const f = sqFile(sq), r = sqRank(sq);
    return this.o.orientation === "w" ? [f, 7 - r] : [7 - f, r];
  }
  sqAtIndex(i) {
    const c = i % 8, r = Math.floor(i / 8);
    return this.o.orientation === "w" ? FILES[c] + (8 - r) : FILES[7 - c] + (r + 1);
  }
  sqAt(x, y) {
    const b = this.sqEl.getBoundingClientRect();
    const c = Math.floor((x - b.left) / b.width * 8), r = Math.floor((y - b.top) / b.height * 8);
    if (c < 0 || c > 7 || r < 0 || r > 7) return null;
    return this.sqAtIndex(r * 8 + c);
  }

  layoutSquares() {
    this.sqDivs.forEach((d, i) => {
      const sq = this.sqAtIndex(i);
      d.dataset.sq = sq;
      d.className = "sq" + ((sqFile(sq) + sqRank(sq)) % 2 === 0 ? " d" : "");
      let co = "";
      if (this.o.coords) {
        if (i % 8 === 0) co += `<span class="co r">${sq[1]}</span>`;
        if (i >= 56) co += `<span class="co f">${sq[0]}</span>`;
      }
      d.innerHTML = co;
    });
  }

  /* --- состояние --- */
  set(cfg) {
    let resq = false;
    if (cfg.orientation && cfg.orientation !== this.o.orientation) {
      this.o.orientation = cfg.orientation;
      this.layoutSquares();
      for (const [sq, el] of this.els) this.place(el, sq, false);
      resq = true;
    }
    for (const k of ["movable", "turn", "viewOnly", "premove", "autoQueen", "coords", "legal", "anim", "drawable"]) {
      if (k in cfg) this.o[k] = cfg[k];
    }
    if ("coords" in cfg) this.layoutSquares();
    if (cfg.set && cfg.set !== this.o.set) {
      this.o.set = cfg.set;
      for (const [sq, el] of this.els) el.style.backgroundImage = `url(${pieceUrl(this.o.set, this.pos.get(sq))})`;
    }
    if ("lastMove" in cfg) this.lastMove = cfg.lastMove;
    if ("check" in cfg) this.check = cfg.check;
    if ("fen" in cfg) { this.sel = null; this.setFen(cfg.fen, cfg.animate !== false); }
    if ("movable" in cfg || "viewOnly" in cfg) this.sel = null;
    if ("marks" in cfg) this.marks = cfg.marks || {};
    if ("stars" in cfg) this.stars = cfg.stars || [];
    if ("shapes" in cfg) { this.shapes = cfg.shapes || []; this.drawShapes(); }
    if ("badges" in cfg) { this.badges = cfg.badges || {}; this.drawBadges(); }
    if (resq) { this.drawShapes(); this.drawBadges(); }
    this.renderSquares();
  }

  setFen(fen, animate = true) {
    const next = parseFen(fen);
    const anim = animate && this.o.anim;
    const keep = new Map(), newLeft = [], oldLeft = [];
    for (const [sq, code] of next) {
      if (this.pos.get(sq) === code && this.els.get(sq)) keep.set(sq, this.els.get(sq));
      else newLeft.push([sq, code]);
    }
    for (const [sq, el] of this.els) if (!keep.has(sq)) oldLeft.push([sq, this.pos.get(sq), el]);
    const els = new Map(keep);
    for (const [sq, code] of newLeft) {
      let bi = -1, bd = 99;
      oldLeft.forEach(([osq, ocode], i) => { if (ocode === code) { const d = dist(osq, sq); if (d < bd) { bd = d; bi = i; } } });
      let el;
      if (bi >= 0) { el = oldLeft[bi][2]; oldLeft.splice(bi, 1); this.place(el, sq, anim); }
      else { el = this.makePiece(code); this.place(el, sq, false); }
      els.set(sq, el);
    }
    for (const [, , el] of oldLeft) {
      if (anim) { el.classList.add("fadeout"); setTimeout(() => el.remove(), 170); } else el.remove();
    }
    this.els = els;
    this.pos = next;
    if (this.pre && !this.pos.get(this.pre.from)) this.pre = null;
  }

  makePiece(code) {
    const el = document.createElement("div");
    el.className = "pc";
    el.style.backgroundImage = `url(${pieceUrl(this.o.set, code)})`;
    this.pcEl.appendChild(el);
    return el;
  }

  place(el, sq, anim) {
    const [x, y] = this.xy(sq);
    if (anim) {
      el.classList.add("anim");
      clearTimeout(el._t);
      el._t = setTimeout(() => el.classList.remove("anim"), 260);
    } else el.classList.remove("anim");
    el.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
  }

  renderSquares() {
    const dests = this.sel ? this.destsOf(this.sel) : [];
    const lm = this.lastMove || [];
    for (const d of this.sqDivs) {
      const sq = d.dataset.sq;
      const cl = d.classList;
      cl.toggle("last", lm.includes(sq));
      cl.toggle("sel", this.sel === sq);
      cl.toggle("check", this.check === sq);
      cl.toggle("pre", !!this.pre && (this.pre.from === sq || this.pre.to === sq));
      cl.toggle("dest", this.o.legal && dests.includes(sq));
      cl.toggle("occ", this.pos.has(sq));
      cl.toggle("hover", this.hover === sq);
      cl.toggle("star", this.stars.includes(sq));
      for (const m of ["hl-red", "hl-green", "hl-blue", "hl-yellow", "hl-soft"]) cl.toggle(m, this.marks[sq] === m);
    }
  }

  /* --- ввод --- */
  canPick(code) {
    const m = this.o.movable;
    if (!m || this.o.viewOnly) return false;
    if (m.color !== "both" && m.color !== code[0]) return false;
    return code[0] === this.o.turn || (this.o.premove && m.color === code[0]);
  }
  destsOf(from) {
    const code = this.pos.get(from);
    if (!code || !this.o.movable) return [];
    if (code[0] === this.o.turn) return this.o.movable.dests?.get(from) || [];
    return this.o.premove ? premoveDests(this.pos, from) : [];
  }
  isDest(from, to) { return this.destsOf(from).includes(to); }

  select(sq) { this.sel = sq; this.renderSquares(); }

  down(e) {
    const sq = this.sqAt(e.clientX, e.clientY);
    if (!sq) return;
    if (e.button === 2 || (e.button === 0 && (e.ctrlKey || e.metaKey))) {
      if (this.o.drawable) this.drawStart = { sq, color: e.shiftKey ? "red" : e.altKey ? "blue" : "green" };
      e.preventDefault();
      return;
    }
    if (e.button !== 0) return;
    if (this.userShapes.length) { this.userShapes = []; this.drawShapes(); }
    const code = this.pos.get(sq);
    if (this.sel && this.sel !== sq && this.isDest(this.sel, sq)) {
      this.userMove(this.sel, sq, true);
      return;
    }
    if (code && this.canPick(code)) {
      const wasSel = this.sel === sq;
      this.select(sq);
      this.drag = { sq, code, x: e.clientX, y: e.clientY, started: false, wasSel };
      e.preventDefault();
    } else {
      this.select(null);
      if (this.pre) { this.pre = null; this.renderSquares(); }
    }
  }

  moveP(e) {
    const d = this.drag;
    if (!d) return;
    if (!d.started) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5) return;
      d.started = true;
      const size = this.sqEl.getBoundingClientRect().width / 8;
      const g = this.ghost = document.createElement("div");
      g.className = "pc-ghost";
      g.style.width = g.style.height = size + "px";
      g.style.backgroundImage = `url(${pieceUrl(this.o.set, d.code)})`;
      document.body.appendChild(g);
      this.els.get(d.sq)?.classList.add("lift");
    }
    this.ghost.style.left = e.clientX + "px";
    this.ghost.style.top = e.clientY + "px";
    const h = this.sqAt(e.clientX, e.clientY);
    if (h !== this.hover) { this.hover = h; this.renderSquares(); }
  }

  up(e) {
    if (this.drawStart) {
      const to = this.sqAt(e.clientX, e.clientY);
      const from = this.drawStart.sq, color = this.drawStart.color;
      this.drawStart = null;
      if (!to) return;
      const shape = to === from ? { from, color } : { from, to, color };
      const i = this.userShapes.findIndex(s => s.from === shape.from && s.to === shape.to);
      if (i >= 0) this.userShapes.splice(i, 1); else this.userShapes.push(shape);
      this.drawShapes();
      this.o.onShapes && this.o.onShapes(this.userShapes);
      return;
    }
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    if (d.started) {
      this.ghost && this.ghost.remove();
      this.ghost = null;
      this.els.get(d.sq)?.classList.remove("lift");
      this.hover = null;
      const to = this.sqAt(e.clientX, e.clientY);
      if (to && to !== d.sq && this.isDest(d.sq, to)) this.userMove(d.sq, to, false);
      else if (to !== d.sq) this.select(null);
      else this.renderSquares();
    } else if (d.wasSel) this.select(null);
  }

  userMove(from, to, anim) {
    const code = this.pos.get(from);
    if (!code) return;
    if (code[0] !== this.o.turn) {
      this.pre = { from, to };
      this.sel = null;
      this.renderSquares();
      this.o.onPremove && this.o.onPremove(from, to);
      return;
    }
    const promo = code[1] === "P" && (to[1] === "8" || to[1] === "1");
    if (promo && !this.o.autoQueen) {
      this.askPromo(to, code[0]).then(p => {
        if (p) this.finishMove(from, to, p, anim);
        else this.select(null);
      });
      return;
    }
    this.finishMove(from, to, promo ? "q" : undefined, anim);
  }

  finishMove(from, to, promo, anim) {
    const code = this.pos.get(from);
    const el = this.els.get(from), cap = this.els.get(to);
    if (cap && cap !== el) cap.remove();
    this.els.delete(from); this.pos.delete(from);
    const ncode = promo ? code[0] + promo.toUpperCase() : code;
    this.els.set(to, el); this.pos.set(to, ncode);
    if (promo) el.style.backgroundImage = `url(${pieceUrl(this.o.set, ncode)})`;
    this.place(el, to, anim && this.o.anim);
    this.lastMove = [from, to];
    this.sel = null;
    this.check = null;
    this.o.turn = this.o.turn === "w" ? "b" : "w";
    this.renderSquares();
    this.o.onMove && this.o.onMove(from, to, promo);
  }

  /* выполнить сохранённый предход, если он стал легальным */
  playPremove() {
    const p = this.pre;
    this.pre = null;
    if (!p) return false;
    const code = this.pos.get(p.from);
    if (!code || code[0] !== this.o.turn || !(this.o.movable?.dests?.get(p.from) || []).includes(p.to)) {
      this.renderSquares();
      return false;
    }
    const promo = code[1] === "P" && (p.to[1] === "8" || p.to[1] === "1");
    this.finishMove(p.from, p.to, promo ? "q" : undefined, true);
    return true;
  }
  cancelPremove() { this.pre = null; this.renderSquares(); }

  askPromo(to, color) {
    return new Promise(res => {
      const ov = document.createElement("div");
      ov.className = "cb-promo";
      const [x, y] = this.xy(to);
      const down = y !== 0;   // поле внизу — колонка растёт вверх
      const order = ["q", "n", "r", "b"];
      ov.innerHTML = `<div class="col" style="left:${x * 12.5}%;${down ? `bottom:0` : `top:0`}">${(down ? [...order].reverse() : order)
        .map(p => `<button data-p="${p}" style="background-image:url(${pieceUrl(this.o.set, color + p.toUpperCase())})"></button>`).join("")}</div>`;
      ov.addEventListener("pointerdown", e => {
        e.stopPropagation();
        const b = e.target.closest("button");
        ov.remove();
        res(b ? b.dataset.p : null);
      });
      this.el.appendChild(ov);
    });
  }

  /* --- стрелки и круги --- */
  drawShapes() {
    const all = [...this.shapes, ...this.userShapes];
    const c = sq => { const [x, y] = this.xy(sq); return [x + 0.5, y + 0.5]; };
    this.svgG.innerHTML = all.map(s => {
      const col = BRUSH[s.color] || BRUSH.green;
      const op = s.opacity ?? (s.color === "gray" ? 0.5 : 0.8);
      if (!s.to) {
        const [x, y] = c(s.from);
        return `<circle cx="${x}" cy="${y}" r="0.46" fill="none" stroke="${col}" stroke-width="0.07" opacity="${op}"/>`;
      }
      const [x1, y1] = c(s.from), [x2, y2] = c(s.to);
      const w = s.width || 0.16;
      const dx = x2 - x1, dy = y2 - y1;
      const knight = (Math.abs(dx) === 1 && Math.abs(dy) === 2) || (Math.abs(dx) === 2 && Math.abs(dy) === 1);
      const marker = `marker-end="url(#ah-${s.color in BRUSH ? s.color : "green"}-${this.uid})"`;
      if (knight) {
        const [mx, my] = Math.abs(dx) > Math.abs(dy) ? [x2, y1] : [x1, y2];
        const ex = x2 - Math.sign(x2 - mx) * 0.32, ey = y2 - Math.sign(y2 - my) * 0.32;
        return `<path d="M${x1},${y1} L${mx},${my} L${ex},${ey}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" opacity="${op}" ${marker}/>`;
      }
      const len = Math.hypot(dx, dy);
      const ex = x2 - dx / len * 0.32, ey = y2 - dy / len * 0.32;
      return `<line x1="${x1}" y1="${y1}" x2="${ex}" y2="${ey}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" opacity="${op}" ${marker}/>`;
    }).join("");
  }
  clearUserShapes() { this.userShapes = []; this.drawShapes(); }

  /* --- значки: оценка хода в углу поля --- */
  drawBadges() {
    this.badgeEl.innerHTML = Object.entries(this.badges).map(([sq, b]) => {
      const [x, y] = this.xy(sq);
      return `<div class="cb-badge ${b.cls}" style="left:${(x + 1) * 12.5}%;top:${y * 12.5}%">${b.text}</div>`;
    }).join("");
  }

  flash(sq, ok) {
    const [x, y] = this.xy(sq);
    const f = document.createElement("div");
    f.className = "cb-flash";
    f.style.left = x * 12.5 + "%"; f.style.top = y * 12.5 + "%";
    f.innerHTML = `<i style="background:${ok ? "#81b64c" : "#e04f43"}">${ok ? "✓" : "✗"}</i>`;
    this.el.appendChild(f);
    setTimeout(() => f.remove(), 1100);
  }

  shake() {
    this.el.classList.remove("shake");
    void this.el.offsetWidth;
    this.el.classList.add("shake");
  }
}

/* статичная мини-доска для превью (без интерактива) */
export function miniBoard(fen, set, flip = false) {
  const pos = parseFen(fen);
  let html = "";
  for (let i = 0; i < 64; i++) {
    const c = i % 8, r = Math.floor(i / 8);
    const sq = flip ? FILES[7 - c] + (r + 1) : FILES[c] + (8 - r);
    const dark = (sqFile(sq) + sqRank(sq)) % 2 === 0;
    const code = pos.get(sq);
    html += `<i class="${dark ? "d" : ""}"${code ? ` style="background-image:url(${pieceUrl(set, code)})"` : ""}></i>`;
  }
  return `<div class="mini">${html}</div>`;
}
