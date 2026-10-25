/* Лекции без интерфейса: позиция каждого шага, ходы примеров и ответы в UCI.
   Используется и приложением, и проверкой assets/check-lectures.mjs. */
import { makeChess, uciOf, START_FEN } from "./chessutil.js";
import { LECTURES, LECTURE_SECTIONS } from "../data/lectures.js";

export { LECTURES, LECTURE_SECTIONS };
export const lectureById = id => LECTURES.find(l => l.id === id);

function playSans(fen, sans) {
  const c = makeChess(fen);
  const ucis = [];
  for (const san of (sans || "").split(" ").filter(Boolean)) {
    const m = c.move(san);          // бросает исключение на нелегальном ходе — это ловит проверка
    ucis.push(uciOf(m));
  }
  return { fen: c.fen(), ucis };
}

/* все матующие ходы в позиции */
export function mateMoves(fen) {
  const c = makeChess(fen);
  const out = [];
  for (const m of c.moves({ verbose: true })) {
    c.move(m);
    if (c.isCheckmate()) out.push(uciOf(m));
    c.undo();
  }
  return out;
}

const cache = new Map();
export function resolveLecture(lec) {
  if (cache.has(lec.id)) return cache.get(lec.id);
  let fen = START_FEN;
  const steps = lec.steps.map((s, i) => {
    if (s.fen) fen = s.fen === "start" ? START_FEN : makeChess(s.fen).fen();
    else if (s.line !== undefined) fen = playSans(START_FEN, s.line).fen;
    const start = fen;
    const r = { ...s, i, start, end: start, moves: null, ans: null };
    if (s.t === "demo") { const p = playSans(start, s.play); r.moves = p.ucis; r.end = p.fen; }
    if (s.t === "find") {
      if (s.seq) { const p = playSans(start, s.seq.join(" ")); r.moves = p.ucis; r.ans = [p.ucis[0]]; r.end = p.fen; }
      else if (s.ans) {
        r.ans = s.ans.map(san => playSans(start, san).ucis[0]);
        r.end = playSans(start, s.ans[0]).fen;
      } else if (s.mate) {
        r.ans = mateMoves(start);
        const c = makeChess(start);
        if (r.ans[0]) { c.move({ from: r.ans[0].slice(0, 2), to: r.ans[0].slice(2, 4), promotion: r.ans[0][4] }); r.end = c.fen(); }
      }
    }
    fen = r.end;
    return r;
  });
  cache.set(lec.id, steps);
  return steps;
}

/* шаги, которые становятся карточками повторения */
export const isCardStep = s => (s.t === "find" || s.t === "square") && s.card !== false;
