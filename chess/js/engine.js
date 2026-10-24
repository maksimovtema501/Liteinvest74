/* Движок Stockfish 18 (WASM, однопоточная облегчённая сборка) в Web Worker.
   Задания идут очередью: бот, подсказки тренера и разбор партии не мешают
   друг другу. Оценки — с точки зрения стороны на ходу, как в UCI. */

const SF_URL = new URL("../vendor/stockfish/stockfish-18-lite-single.js", import.meta.url).href;

export class Engine {
  constructor() {
    this.w = null; this.queue = []; this.cur = null; this.opts = {}; this.ready = null; this.failed = false;
  }

  start() {
    if (this.ready) return this.ready;
    this.ready = new Promise((res, rej) => {
      try { this.w = new Worker(SF_URL); }
      catch (e) { this.failed = true; rej(e); return; }
      const t = setTimeout(() => { this.failed = true; rej(new Error("Движок не запустился")); }, 30000);
      this.w.onmessage = e => this.onLine(String(e.data));
      this.w.onerror = e => { this.failed = true; clearTimeout(t); rej(e); };
      this.boot = l => {
        if (l === "uciok") this.send("isready");
        else if (l === "readyok") { clearTimeout(t); this.boot = null; res(); }
      };
      this.send("uci");
    });
    return this.ready;
  }

  send(c) { this.w.postMessage(c); }

  setOption(name, value) {
    if (this.opts[name] === value) return;
    this.opts[name] = value;
    this.send(`setoption name ${name} value ${value}`);
  }

  /* fen + опции: depth, movetime, nodes, multipv, elo (ограничение силы), skill, moves, onInfo, tag */
  analyse(fen, o = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fen, o, resolve, reject, lines: [] });
      this.pump();
    });
  }

  async pump() {
    if (this.cur || !this.queue.length) return;
    const job = this.cur = this.queue.shift();
    try { await this.start(); }
    catch (e) { this.cur = null; job.reject(e); this.queue.splice(0).forEach(j => j.reject(e)); return; }
    const o = job.o;
    this.setOption("MultiPV", o.multipv || 1);
    if (o.elo) { this.setOption("UCI_LimitStrength", true); this.setOption("UCI_Elo", Math.max(1320, Math.min(3190, o.elo))); }
    else this.setOption("UCI_LimitStrength", false);
    this.setOption("Skill Level", o.skill ?? 20);
    if (o.newGame) this.send("ucinewgame");
    this.send(`position fen ${job.fen}${o.moves && o.moves.length ? " moves " + o.moves.join(" ") : ""}`);
    let go = "go";
    if (o.depth) go += ` depth ${o.depth}`;
    if (o.movetime) go += ` movetime ${o.movetime}`;
    if (o.nodes) go += ` nodes ${o.nodes}`;
    if (o.infinite) go = "go infinite";
    if (go === "go") go += " depth 12";
    job.started = performance.now();
    this.send(go);
  }

  onLine(l) {
    if (this.boot) { this.boot(l); return; }
    const job = this.cur;
    if (!job) return;
    if (l.startsWith("info") && l.includes(" pv ")) {
      const g = k => { const m = l.match(new RegExp(` ${k} (-?\\d+)`)); return m ? +m[1] : null; };
      if (l.includes("lowerbound") || l.includes("upperbound")) return;
      const mpv = g("multipv") || 1;
      const line = { depth: g("depth"), multipv: mpv, pv: l.split(" pv ")[1].trim().split(" ") };
      const cp = l.match(/score cp (-?\d+)/), mate = l.match(/score mate (-?\d+)/);
      if (cp) line.cp = +cp[1];
      if (mate) line.mate = +mate[1];
      line.nodes = g("nodes");
      job.lines[mpv - 1] = line;
      job.depth = line.depth;
      job.o.onInfo && job.o.onInfo(job.lines.filter(Boolean), line.depth);
    } else if (l.startsWith("bestmove")) {
      const p = l.split(" ");
      const best = p[1] === "(none)" ? null : p[1];
      this.cur = null;
      // мат или пат: движок отвечает без строк info
      job.resolve({ best, ponder: p[3] || null, lines: job.lines.filter(Boolean), depth: job.depth || 0 });
      this.pump();
    }
  }

  /* остановить текущий поиск (результат придёт с тем, что успел найти) */
  stop() { if (this.cur) this.send("stop"); }

  /* снять задания с меткой: из очереди — сразу, текущее — остановкой */
  cancel(tag) {
    this.queue = this.queue.filter(j => {
      if (j.o.tag === tag) { j.resolve({ best: null, lines: [], depth: 0, cancelled: true }); return false; }
      return true;
    });
    if (this.cur && this.cur.o.tag === tag) this.send("stop");
  }
}

/* два движка: основной (боты, тренер, разбор) и для живого анализа */
export const engine = new Engine();
export const liveEngine = new Engine();
