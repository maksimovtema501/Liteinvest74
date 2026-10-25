#!/usr/bin/env node
/* Проверка лекций «Шахмат»: все позиции и ходы легальны, а ответы в шагах
   «ваш ход» — лучшие по Stockfish (или не хуже лучшего на 0.4 пешки).
   Запуск: node assets/check-lectures.mjs /path/to/stockfish */
import { spawn } from "node:child_process";
import { LECTURES, resolveLecture } from "../js/lecturedata.js";
import { makeChess } from "../js/chessutil.js";

const enginePath = process.argv[2];
if (!enginePath) { console.error("Укажите путь к Stockfish"); process.exit(2); }

const eng = spawn(enginePath);
let buf = "", waiters = [];
eng.stdout.on("data", d => {
  buf += d;
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    waiters.forEach(w => w(line));
  }
});
const send = c => eng.stdin.write(c + "\n");
const until = (pred, onLine) => new Promise(res => {
  const w = l => { onLine && onLine(l); if (pred(l)) { waiters = waiters.filter(x => x !== w); res(l); } };
  waiters.push(w);
});

async function analyse(fen, depth = 18, multipv = 3) {
  send(`setoption name MultiPV value ${multipv}`);
  send(`position fen ${fen}`);
  const lines = [];
  send(`go depth ${depth}`);
  await until(l => l.startsWith("bestmove"), l => {
    if (!l.startsWith("info") || !l.includes(" pv ")) return;
    const k = +(l.match(/ multipv (\d+)/) || [0, 1])[1];
    const cp = l.match(/score cp (-?\d+)/), mate = l.match(/score mate (-?\d+)/);
    lines[k - 1] = { uci: l.split(" pv ")[1].split(" ")[0], s: mate ? (+mate[1] > 0 ? 100000 - +mate[1] : -100000 - +mate[1]) : +cp[1] };
  });
  return lines.filter(Boolean);
}
async function scoreOf(fen, uci) {
  const c = makeChess(fen);
  c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
  if (c.isCheckmate()) return 100000;
  const l = await analyse(c.fen(), 16, 1);
  return l[0] ? -l[0].s : 0;
}

send("uci");
await until(l => l === "uciok");
let ok = true;
for (const lec of LECTURES) {
  let steps;
  try { steps = resolveLecture(lec); }
  catch (e) { console.log(`✗ ${lec.id}: ${e.message}`); ok = false; continue; }
  for (const s of steps) {
    if (s.t === "square" && !s.sq && !s.files) { console.log(`✗ ${lec.id}#${s.i}: нет ответа`); ok = false; }
    if (s.t !== "find") continue;
    if (!s.ans || !s.ans.length) { console.log(`✗ ${lec.id}#${s.i}: нет ответа (мата нет?)`); ok = false; continue; }
    const userMoves = s.seq ? s.moves.filter((_, j) => j % 2 === 0) : [s.ans[0]];
    let fen = s.start;
    for (let j = 0; j < (s.seq ? s.moves.length : 1); j++) {
      const mine = s.seq ? s.moves[j] : null;
      if (s.seq && j % 2 === 1) { const c = makeChess(fen); c.move({ from: mine.slice(0, 2), to: mine.slice(2, 4), promotion: mine[4] }); fen = c.fen(); continue; }
      const lines = await analyse(fen);
      const best = lines[0];
      const accepted = s.seq ? [mine] : s.ans;
      let mark = "ok";
      if (!s.mate && !accepted.includes(best.uci)) {
        const sc = await scoreOf(fen, accepted[0]);
        mark = best.s - sc <= 40 ? `ok (≈ лучшему ${best.uci})` : `НЕ ЛУЧШИЙ: движок ${best.uci} ${best.s}, ответ ${sc}`;
        if (!mark.startsWith("ok")) ok = false;
      }
      if (s.mate && !s.ans.length) { mark = "нет мата"; ok = false; }
      console.log(`${lec.id.padEnd(14)}#${String(s.i).padEnd(2)} ${accepted.join("/").padEnd(22)} ${mark}   [${lines.map(l => l.uci + " " + l.s).join(", ")}]`);
      if (s.seq) { const c = makeChess(fen); c.move({ from: mine.slice(0, 2), to: mine.slice(2, 4), promotion: mine[4] }); fen = c.fen(); }
    }
    void userMoves;
  }
}
console.log(ok ? "ВСЁ ВЕРНО" : "ЕСТЬ ОШИБКИ");
send("quit");
