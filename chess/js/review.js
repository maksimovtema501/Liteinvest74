/* Разбор партии: анализ каждой позиции движком, оценка ходов
   (блестящий, лучший, неточность, зевок…), точность по формуле lichess
   и комментарии тренера простыми словами. */
import { engine } from "./engine.js";
import { makeChess, playUci, sanLine, figSan, isBook, openingOf, openingRu, see, START_FEN } from "./chessutil.js";
import { scoreOf, winPct, fmtEval, MATE, VAL, PIECE_ACC, clamp } from "./util.js";

export const CLS = {
  brilliant: { t: "Блестящий ход", s: "!!", c: "c-brilliant" },
  great: { t: "Отличный ход", s: "!", c: "c-great" },
  best: { t: "Лучший ход", s: "★", c: "c-best" },
  excellent: { t: "Превосходно", s: "👍", c: "c-excellent" },
  good: { t: "Хороший ход", s: "✓", c: "c-good" },
  book: { t: "Книжный ход", s: "📖", c: "c-book" },
  inaccuracy: { t: "Неточность", s: "?!", c: "c-inaccuracy" },
  mistake: { t: "Ошибка", s: "?", c: "c-mistake" },
  miss: { t: "Упущенная возможность", s: "✗", c: "c-miss" },
  blunder: { t: "Зевок", s: "??", c: "c-blunder" },
  forced: { t: "Вынужденный ход", s: "→", c: "c-forced" },
};
export const CLS_ORDER = ["brilliant", "great", "best", "excellent", "good", "book", "inaccuracy", "mistake", "miss", "blunder"];
export const BAD = ["inaccuracy", "mistake", "miss", "blunder"];
const CODE = { brilliant: "B", great: "G", best: "*", excellent: "E", good: "g", book: "k", inaccuracy: "i", mistake: "m", miss: "x", blunder: "b", forced: "f" };
const DECODE = Object.fromEntries(Object.entries(CODE).map(([k, v]) => [v, k]));

/* оценка позиции для стороны на ходу, с учётом конца партии */
function posScore(e) {
  if (e.terminal === "mate") return -MATE;
  if (e.terminal === "draw") return 0;
  return e.lines && e.lines[0] ? scoreOf(e.lines[0]) : 0;
}

/* анализ всех позиций партии */
export async function analyseGame(startFen, moves, { depth = 12, onProgress = null, tag = "review" } = {}) {
  const c = makeChess(startFen || START_FEN);
  const fens = [c.fen()];
  const mv = [];
  for (const u of moves) {
    const legalCount = c.moves().length;
    const before = c.fen();
    const m = playUci(c, u);
    if (!m) break;
    mv.push({ uci: u, san: m.san, from: m.from, to: m.to, piece: m.piece, captured: m.captured, promotion: m.promotion, color: m.color, before, after: c.fen(), legalCount });
    fens.push(c.fen());
  }
  const evals = [];
  for (let i = 0; i < fens.length; i++) {
    const p = makeChess(fens[i]);
    if (p.isCheckmate()) evals.push({ terminal: "mate", lines: [] });
    else if (p.isStalemate() || p.isInsufficientMaterial()) evals.push({ terminal: "draw", lines: [] });
    else {
      const r = await engine.analyse(fens[i], { depth, multipv: 2, tag });
      if (r.cancelled) return null;
      evals.push({ lines: r.lines.map(l => ({ cp: l.cp, mate: l.mate, pv: l.pv.slice(0, 10) })), best: r.best });
    }
    onProgress && onProgress((i + 1) / fens.length);
  }
  return { fens, moves: mv, evals };
}

/* материал, который сторона на ходу выигрывает по варианту */
function swing(fen, pv, plies = 4) {
  const c = makeChess(fen);
  const me = c.turn();
  let net = 0, firstLoss = null, firstGain = null;
  for (const u of (pv || []).slice(0, plies)) {
    const m = playUci(c, u);
    if (!m) break;
    if (m.captured) {
      const v = VAL[m.captured];
      if (m.color === me) { net += v; if (!firstGain || v > VAL[firstGain]) firstGain = m.captured; }
      else { net -= v; if (!firstLoss || v > VAL[firstLoss]) firstLoss = m.captured; }
    }
    if (m.promotion) net += (m.color === me ? 1 : -1) * (VAL[m.promotion] - 1);
  }
  return { net, firstLoss, firstGain };
}

function mateN(s) { return MATE - Math.abs(s); }

/* оценка ходов и комментарии */
export function classify(an, { coachStyle = "kind", prevCls = null } = {}) {
  const { fens, moves, evals } = an;
  const out = [];
  let inBook = true;
  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    const E0 = evals[i], E1 = evals[i + 1];
    const bestS = posScore(E0);
    let playedS = -posScore(E1);
    const bestUci = E0.lines[0]?.pv?.[0] || E0.best;
    const isBest = m.uci === bestUci;
    if (isBest) playedS = Math.max(playedS, bestS);
    const secondS = E0.lines[1] ? scoreOf(E0.lines[1]) : null;
    const wb = winPct(bestS), wp = winPct(playedS);
    let loss = isBest ? 0 : Math.max(0, wb - wp);
    let cls;
    if (inBook && i < 30 && isBook(m.after)) cls = "book";
    else {
      inBook = false;
      if (m.legalCount === 1) cls = "forced";
      else if (isBest || loss < 0.6) cls = "best";
      else if (loss <= 2) cls = "excellent";
      else if (loss <= 5) cls = "good";
      else if (loss <= 10) cls = "inaccuracy";
      else if (loss <= 20) cls = "mistake";
      else cls = "blunder";
    }
    if (cls === "book") inBook = true;

    // блестящий: жертва фигуры, которая остаётся лучшим или почти лучшим ходом
    if ((cls === "best" || cls === "excellent") && m.piece !== "p" && wp >= 50 && wb < 97) {
      const lose = see(m.after, m.to);
      if (lose >= 2 && (!m.captured || VAL[m.piece] - VAL[m.captured] >= 2)) cls = "brilliant";
    }
    // отличный: единственный хороший ход в напряжённой позиции
    if (cls === "best" && secondS != null && wb - winPct(secondS) >= 15 && wb > 8 && wb < 92) {
      const prev = moves[i - 1];
      const recapture = prev && prev.captured && prev.to === m.to && m.captured;
      if (!recapture) cls = "great";
    }
    // упущенная возможность: соперник ошибся, а ты не наказал
    const before = i ? out[i - 1]?.cls : prevCls;
    if (["inaccuracy", "mistake", "blunder"].includes(cls) && wb >= 70 && loss >= 10 &&
        (["mistake", "blunder", "miss"].includes(before) || bestS > MATE / 2) && wp >= 35) cls = "miss";

    const acc = cls === "book" || cls === "forced" ? 100 : clamp(103.1668 * Math.exp(-0.04354 * loss) - 3.1669, 0, 100);
    out.push({
      cls, loss, acc, bestUci, bestS, playedS, secondS,
      white: m.color === "w",
      evalW: m.color === "w" ? playedS : -playedS,        // оценка после хода, с точки зрения белых
      comment: comment(m, cls, { fen: fens[i], E0, E1, bestS, playedS, coachStyle }),
    });
  }
  return out;
}

const pick = a => a[Math.floor(Math.random() * a.length)];

function comment(m, cls, { fen, E0, E1, bestS, playedS, coachStyle }) {
  const strict = coachStyle === "strict";
  const bestLine = E0.lines[0]?.pv || [];
  const bestTxt = bestLine.length ? sanLine(fen, bestLine, 5) : "";
  const bestSan = bestLine.length ? sanLine(fen, bestLine, 1).replace(/^\d+\.(…)?\s*/, "") : "";
  const replyLine = E1.lines?.[0]?.pv || [];
  const replyTxt = replyLine.length ? sanLine(m.after, replyLine, 4) : "";
  const evW = s => fmtEval(m.color === "w" ? s : -s);
  if (E1.terminal === "mate") return "Мат! Партия окончена.";
  switch (cls) {
    case "forced": return "Единственный возможный ход.";
    case "book": {
      const o = openingOf(m.after);
      return o ? `Теория: ${openingRu(o.name).ru}${openingRu(o.name).rest ? " — " + openingRu(o.name).rest : ""}.` : "Известный дебютный ход.";
    }
    case "brilliant": return `Блестящая жертва! ${cap(PIECE_ACC[m.piece])} можно забрать, но тогда ${bestTxt ? "игра пойдёт так: " + sanLine(m.after, replyLine, 5) : "соперник попадёт под атаку"}.`;
    case "great": return playedS > 300 ? "Отличный ход — единственный, который сохраняет перевес." : playedS > -150 ? "Отличный ход — единственный, который держит позицию." : "Единственный ход, который продлевает борьбу.";
    case "best": {
      if (playedS > MATE / 2) return `Лучший ход: мат в ${mateN(playedS)}.`;
      if (m.captured) return pick([`Лучший ход — забираешь ${PIECE_ACC[m.captured]}.`, "Лучший ход. Взятие по делу."]);
      return pick(["Лучший ход.", "Так сыграл бы движок.", "Точно!", "Лучшее в позиции."]);
    }
    case "excellent": return pick(["Превосходный ход.", "Очень хорошо — почти как у движка."]);
    case "good": return `Хороший ход. Чуть точнее было ${figSan(bestSan)}.`;
  }
  // плохие ходы — объясняем почему
  const head = { inaccuracy: strict ? "Неточность." : "Небольшая неточность.", mistake: strict ? "Ошибка." : "Ошибка, бывает.", blunder: strict ? "Грубый зевок!" : "Ой, зевок.", miss: "Упущенная возможность." }[cls];
  if (playedS < -MATE / 2) return `${head} Теперь у соперника мат в ${mateN(playedS)}: ${replyTxt}.`;
  if (bestS > MATE / 2 && playedS < MATE / 2) return `${head} Здесь был мат в ${mateN(bestS)}: ${bestTxt}.`;
  const rep = swing(m.after, replyLine, 4);
  if (-rep.net <= -2 || rep.net >= 2) {
    const piece = rep.firstGain;
    const what = piece ? PIECE_ACC[piece] : "материал";
    if (cls !== "miss") return `${head} Соперник выигрывает ${what}: ${replyTxt}. Лучше было ${figSan(bestSan)}.`;
  }
  const bs = swing(fen, bestLine, 4);
  if (bs.net >= 2) return `${head} Можно было выиграть ${bs.firstGain ? PIECE_ACC[bs.firstGain] : "материал"}: ${bestTxt}.`;
  return `${head} Оценка ${evW(bestS)} → ${evW(playedS)}. Сильнее ${figSan(bestSan)}${bestTxt ? ` (${bestTxt})` : ""}.`;
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* точность по сторонам — взвешенное и гармоническое среднее, как на lichess */
export function accuracy(an, cl) {
  const wps = [winPct(posScore(an.evals[0]) * (an.fens[0].split(" ")[1] === "w" ? 1 : -1))];
  cl.forEach(c => wps.push(winPct(c.evalW)));
  const win = clamp(Math.floor(cl.length / 10), 2, 8);
  const res = {};
  for (const side of ["w", "b"]) {
    let ws = 0, wsum = 0, hs = 0, n = 0;
    cl.forEach((c, i) => {
      if ((c.white ? "w" : "b") !== side) return;
      const slice = wps.slice(Math.max(0, i + 1 - win), i + 2);
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
      const sd = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / slice.length);
      const w = clamp(sd, 0.5, 12);
      ws += c.acc * w; wsum += w;
      hs += 1 / Math.max(c.acc, 5); n++;
    });
    res[side] = n ? Math.round(((ws / wsum) + n / hs) / 2 * 10) / 10 : null;
  }
  return res;
}

/* фаза партии по номеру хода и материалу */
export function phaseOf(fen, ply) {
  let heavy = 0;
  for (const ch of fen.split(" ")[0]) { const t = ch.toLowerCase(); if ("nbrq".includes(t)) heavy += VAL[t]; }
  if (heavy <= 26) return "endgame";
  if (ply < 20) return "opening";
  return "middlegame";
}

/* компактное хранение разбора в партии */
export function packReview(an, cl, acc) {
  return {
    v: 1, acc,
    cls: cl.map(c => CODE[c.cls]).join(""),
    ev: cl.map(c => Math.round(clamp(c.evalW, -MATE, MATE))),
    best: cl.map(c => c.bestUci || "").join(" "),
    e0: Math.round(posScore(an.evals[0]) * (an.fens[0].split(" ")[1] === "w" ? 1 : -1)),
  };
}
export function unpackCls(code) { return DECODE[code]; }

/* итог от тренера без ИИ: что получилось, что нет, что учить */
export function coachSummary(an, cl, acc, userColor) {
  const me = userColor || "w";
  const mine = cl.map((c, i) => ({ ...c, i, m: an.moves[i] })).filter(c => (c.white ? "w" : "b") === me);
  const count = k => mine.filter(c => c.cls === k).length;
  const phases = { opening: [], middlegame: [], endgame: [] };
  mine.forEach(c => phases[phaseOf(an.fens[c.i], c.i)].push(c.acc));
  const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null;
  const ph = { opening: avg(phases.opening), middlegame: avg(phases.middlegame), endgame: avg(phases.endgame) };
  const tips = [];
  const hangs = mine.filter(c => ["mistake", "blunder"].includes(c.cls) && swing(c.m.after, an.evals[c.i + 1].lines?.[0]?.pv, 4).net >= 2).length;
  const missedMates = mine.filter(c => c.bestS > MATE / 2 && c.playedS < MATE / 2).length;
  const allowedMates = mine.filter(c => c.playedS < -MATE / 2 && c.bestS > -MATE / 2).length;
  if (hangs) tips.push({ t: `${hangs} раз${hangs > 1 && hangs < 5 ? "а" : ""} фигура осталась под боем. Перед ходом спрашивай себя: «Что атакует соперник после моего хода?»`, lesson: "hanging" });
  if (missedMates) tips.push({ t: "Был мат, а ты его не увидел. Каждый ход проверяй шахи, взятия и угрозы — в таком порядке.", theme: "mate" });
  if (allowedMates) tips.push({ t: "Ты пропустил мат от соперника. Следи за безопасностью короля и последней горизонталью.", lesson: "backrank" });
  if (count("miss")) tips.push({ t: "Соперник ошибался, а ты не наказал. Решай задачи — они тренируют видеть удары.", theme: "crushing" });
  if (ph.opening != null && ph.opening < 75) tips.push({ t: "Дебют сыгран слабо. Повтори принципы: центр, развитие лёгких фигур, рокировка.", lesson: "principles" });
  if (ph.endgame != null && ph.endgame < 70) tips.push({ t: "В эндшпиле много потерь. Пройди уроки эндшпиля: оппозиция, правило квадрата.", section: "endgames" });
  if (!tips.length) tips.push({ t: "Хорошая партия без грубых ошибок. Так держать — попробуй бота посильнее." });
  return { counts: Object.fromEntries(CLS_ORDER.map(k => [k, count(k)])), phases: ph, tips, acc: acc[me] };
}
