/* Партия: боты, игра вдвоём на одном устройстве, онлайн и практика позиций.
   Часы с добавлением, предходы, подсказки, возврат хода, тренер, который
   оценивает каждый твой ход сразу после него. */
import { $, $$, esc, modal, toast, confirmBox, fmtClock, scoreOf, winPct, fmtEval, copyText, plural } from "./util.js";
import { S, save, activity, setActive, unlock, eloUpdate, tcSlot, checkStreakAch } from "./store.js";
import { Board, pieceUrl } from "./board.js";
import { makeChess, dests, playUci, uciOf, checkSquare, captured, gameEnd, buildPgn, openingForMoves, openingRu, figSan, sanLine, nullMoveFen, START_FEN } from "./chessutil.js";
import { engine } from "./engine.js";
import { BOTS, botById, botMove, botThinkDelay } from "./bots.js";
import { classify, CLS, BAD } from "./review.js";
import { play as snd, moveSound } from "./sound.js";
import { go } from "./router.js";

export let G = null;

export const TCS = [
  ["none", "Без часов"], ["1+0", "1 мин"], ["2+1", "2 | 1"], ["3+0", "3 мин"], ["3+2", "3 | 2"],
  ["5+0", "5 мин"], ["10+0", "10 мин"], ["15+10", "15 | 10"], ["30+0", "30 мин"],
];
export const tcName = tc => (TCS.find(t => t[0] === tc) || [0, tc])[1];

export function me() {
  return { name: S.profile.name || "Вы", av: S.profile.avatar || "🙂", rating: null };
}

/* ======================================================================= */
class GameCtl {
  constructor(cfg) {
    this.cfg = cfg;
    this.mode = cfg.mode;
    this.bot = cfg.botId ? botById(cfg.botId) : null;
    this.chess = makeChess(cfg.startFen || START_FEN);
    this.startFen = this.chess.fen();
    this.hist = [];
    this.viewPly = null;
    this.result = null;
    this.gen = 0;
    this.preCache = new Map();
    this.waitCoach = false;
    this.thinking = false;
    this.lastEval = null;
    this.hintLevel = 0;
    this.chat = [];
    this.net = cfg.net || null;
    this.id = cfg.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const tc = cfg.tc && cfg.tc !== "none" ? cfg.tc.split("+").map(Number) : null;
    this.clock = tc ? { w: tc[0] * 60000, b: tc[0] * 60000, inc: tc[1] * 1000, turn: null, t0: 0 } : null;
    this.orientation = cfg.userColor || "w";
    for (const u of cfg.moves || []) {
      const before = this.chess.fen();
      const m = playUci(this.chess, u.uci || u);
      if (!m) break;
      this.pushHist(m, before, u);
    }
    if (cfg.clocks && this.clock) { this.clock.w = cfg.clocks.w; this.clock.b = cfg.clocks.b; }
  }

  get turn() { return this.chess.turn(); }
  get userColor() { return this.cfg.userColor; }
  isUserTurn() {
    if (this.result || this.waitCoach) return false;
    return this.mode === "local" || this.turn === this.userColor;
  }
  player(color) { return color === "w" ? this.cfg.white : this.cfg.black; }

  pushHist(m, before, extra = {}) {
    this.hist.push({
      uci: uciOf(m), san: m.san, fen: this.chess.fen(), before, from: m.from, to: m.to, color: m.color,
      captured: m.captured, flags: m.flags, promotion: m.promotion, piece: m.piece,
      cls: extra.cls, comment: extra.comment,
    });
  }

  /* --- часы --- */
  rem(c) {
    if (!this.clock) return null;
    return this.clock.turn === c ? this.clock[c] - (performance.now() - this.clock.t0) : this.clock[c];
  }
  stopClock() {
    const k = this.clock;
    if (!k || !k.turn) return;
    k[k.turn] -= performance.now() - k.t0;
    k.turn = null;
  }
  startClock(c) {
    if (!this.clock || this.result) return;
    this.clock.turn = c;
    this.clock.t0 = performance.now();
  }
  switchClock(mover) {
    if (!this.clock) return;
    this.stopClock();
    if (this.hist.length >= 2 || mover === "b") this.clock[mover] += this.clock.inc;
    // часы пошли после первого хода каждой стороны
    if (this.hist.length >= 1) this.startClock(mover === "w" ? "b" : "w");
  }
  tick() {
    if (!this.clock || this.result || !this.clock.turn) return;
    const c = this.clock.turn;
    const r = this.rem(c);
    this.renderClock();
    if (r <= 0) {
      if (this.mode === "online" && c !== this.userColor) {
        // даём сопернику секунду-другую на задержку сети
        if (r < -1500) { this.net?.send({ t: "timeout", loser: c }); this.timeout(c); }
      } else {
        if (this.mode === "online") this.net?.send({ t: "timeout", loser: c });
        this.timeout(c);
      }
    } else if (r < 10000 && c === this.userColor && Math.floor(r / 1000) !== this.lastTickSec) {
      this.lastTickSec = Math.floor(r / 1000);
      if (r < 6000) snd("tick");
    }
  }
  timeout(loser) {
    if (this.result) return;
    this.clock[loser] = 0;
    // у соперника не хватает материала для мата — ничья
    const winner = loser === "w" ? "b" : "w";
    const pcs = this.chess.board().flat().filter(p => p && p.color === winner && p.type !== "k");
    const insuff = !pcs.length || (pcs.length === 1 && "nb".includes(pcs[0].type));
    if (insuff) this.finish("1/2-1/2", "время вышло, но у соперника не хватает материала");
    else this.finish(loser === "w" ? "0-1" : "1-0", "время вышло");
  }

  /* --- ходы --- */
  onBoardMove(from, to, promo) {
    if (!this.isUserTurn() || this.viewPly != null) { this.syncBoard(false); return; }
    const before = this.chess.fen();
    let m;
    try { m = this.chess.move({ from, to, promotion: promo }); } catch { m = null; }
    if (!m) { snd("illegal"); this.syncBoard(false); return; }
    this.afterMove(m, before, true);
  }

  afterMove(m, before, byUser) {
    this.gen++;
    this.hintLevel = 0;
    this.board.set({ shapes: [] });
    this.pushHist(m, before);
    if (this.clock) this.switchClock(m.color);
    moveSound(m, this.chess);
    this.syncBoard(!byUser);
    this.renderAll();
    this.persist();
    if (this.mode === "online" && byUser) this.net.send({ t: "move", uci: uciOf(m), clock: this.clock ? this.rem(m.color) : null, ply: this.hist.length });
    const end = gameEnd(this.chess);
    if (end) {
      if (byUser && this.coachOn()) this.coachEval(before, m, this.gen);
      this.finish(end.result, end.reason);
      return;
    }
    if (this.mode === "practice") this.practiceCheck(m, byUser);
    if (this.result) return;
    if (this.cfg.evalBar && !(byUser && this.coachOn())) this.evalUpdate();
    if (byUser) this.userMoved(m, before); else this.opponentMoved(m);
  }

  /* шкала оценки без тренера: быстрая оценка позиции после хода */
  evalUpdate() {
    const gen = this.gen, fen = this.chess.fen(), sign = this.turn === "w" ? 1 : -1;
    engine.analyse(fen, { depth: 10, tag: "coach" }).then(r => {
      if (gen !== this.gen || !r.lines[0]) return;
      this.lastEval = { s: scoreOf(r.lines[0]) * sign };
      this.renderEval();
    }).catch(() => {});
  }

  coachOn() { return !!this.cfg.coach && (this.mode === "bot" || this.mode === "practice" || this.mode === "local"); }

  async userMoved(m, before) {
    const gen = this.gen;
    if (this.coachOn()) {
      const c = await this.coachEval(before, m, gen);
      if (gen !== this.gen || this.result) return;
      if (c && (c.cls === "blunder" || c.cls === "mistake" || c.cls === "miss") && this.cfg.allowTakeback && this.mode !== "local") {
        this.waitCoach = true;
        this.setMovable();
        return;      // ждём решения: вернуть ход или продолжить
      }
    }
    this.nextTurn();
  }

  nextTurn() {
    this.waitCoach = false;
    if (this.result) return;
    if ((this.mode === "bot" || this.mode === "practice") && this.turn !== this.userColor) this.botTurn();
    else this.setMovable();
  }

  opponentMoved(m) {
    if (this.mode === "bot" && this.bot && m.captured && this.bot.cap.length && Math.random() < 0.3) {
      this.botSay(this.bot.cap[Math.floor(Math.random() * this.bot.cap.length)]);
    }
    if (this.mode === "local" && this.cfg.autoFlip) {
      this.orientation = this.turn;
      this.board.set({ orientation: this.orientation });
      this.renderBars();
    }
    this.setMovable();
    if (this.board.pre) this.board.playPremove();
  }

  async botTurn() {
    const gen = this.gen;
    const fen = this.chess.fen();
    const t0 = performance.now();
    const botColor = this.turn;
    this.thinking = true;
    this.renderBars();
    this.setMovable();
    let uci = null;
    try {
      if (this.mode === "practice") {
        const r = await engine.analyse(fen, { depth: 16, movetime: 700, tag: "bot" });
        uci = r.best;
        if (r.lines[0]) this.lastEval = { s: -scoreOf(r.lines[0]), user: true };   // для пользователя
      } else {
        const std = this.startFen === START_FEN;
        const r = await botMove(fen, this.bot, {
          history: std ? this.hist.map(h => h.uci) : ["-"],
          clockMs: this.clock ? this.rem(botColor) : null,
          incMs: this.clock ? this.clock.inc : 0,
        });
        uci = r && r.uci;
      }
    } catch (e) {
      console.error(e);
      this.thinking = false;
      this.renderBars();
      toast("Движок не запустился. Обновите страницу.");
      return;
    }
    if (gen !== this.gen || this.result) return;
    if (!this.clock) await botThinkDelay(this.bot || { elo: 3000 }, t0);
    if (gen !== this.gen || this.result) return;
    this.thinking = false;
    const before = this.chess.fen();
    const m = uci && playUci(this.chess, uci);
    if (!m) { this.renderBars(); return; }
    this.afterMove(m, before, false);
  }

  setMovable() {
    const can = this.isUserTurn() && this.viewPly == null;
    const color = this.mode === "local" ? this.turn : this.userColor;
    this.board.set({
      turn: this.turn,
      movable: this.result ? null : { color, dests: can ? dests(this.chess) : new Map() },
      premove: S.settings.premove && this.mode !== "local" && !this.result,
      viewOnly: this.viewPly != null,
    });
    if (can && (this.coachOn() || this.cfg.allowHints)) this.preAnalysis(this.chess.fen());
    this.renderCtrl();
  }

  syncBoard(animate) {
    const ply = this.viewPly ?? this.hist.length;
    const fen = ply === 0 ? this.startFen : this.hist[ply - 1].fen;
    const last = ply ? [this.hist[ply - 1].from, this.hist[ply - 1].to] : null;
    const c = ply === this.hist.length ? this.chess : makeChess(fen);
    const badges = {};
    const h = ply ? this.hist[ply - 1] : null;
    if (h && h.cls && CLS[h.cls]) badges[h.to] = { cls: CLS[h.cls].c, text: CLS[h.cls].s };
    this.board.set({ fen, lastMove: last, check: checkSquare(c), animate, badges });
  }

  /* --- тренер --- */
  preAnalysis(fen) {
    if (!this.preCache.has(fen)) {
      this.preCache.set(fen, engine.analyse(fen, { depth: 12, multipv: 3, tag: "coach" }).catch(() => null));
    }
    return this.preCache.get(fen);
  }

  async coachEval(before, m, gen) {
    const pre = await this.preAnalysis(before);
    if (!pre || gen !== this.gen) return null;
    const after = m.after || this.hist[this.hist.length - 1].fen;
    const pc = makeChess(after);
    let E1;
    if (pc.isCheckmate()) E1 = { terminal: "mate", lines: [] };
    else if (pc.isStalemate() || pc.isInsufficientMaterial()) E1 = { terminal: "draw", lines: [] };
    else {
      const post = await engine.analyse(after, { depth: 12, multipv: 1, tag: "coach" });
      if (gen !== this.gen && !this.result) return null;
      E1 = { lines: post.lines, best: post.best };
    }
    const an = {
      fens: [before, after],
      moves: [{ uci: uciOf(m), san: m.san, from: m.from, to: m.to, piece: m.piece, captured: m.captured, promotion: m.promotion, color: m.color, before, after, legalCount: makeChess(before).moves().length }],
      evals: [{ lines: pre.lines, best: pre.best }, E1],
    };
    // соперник перед этим ошибся? — для «упущенной возможности»
    let prevCls = null;
    if (this.prevUserEval != null && pre.lines[0]) {
      if (winPct(scoreOf(pre.lines[0])) - winPct(this.prevUserEval) >= 10) prevCls = "mistake";
    }
    const [c] = classify(an, { coachStyle: S.settings.coachStyle, prevCls });
    this.prevUserEval = c.playedS;
    const h = this.hist.find(x => x.before === before && x.uci === an.moves[0].uci);
    if (h) { h.cls = c.cls; h.comment = c.comment; h.bestUci = c.bestUci; }
    this.lastEval = { s: c.evalW };
    this.renderEval();
    this.renderMoves();
    if (this.viewPly == null) this.syncBadgeOnly();
    this.showCoach(c, before);
    return c;
  }

  syncBadgeOnly() {
    const h = this.hist[this.hist.length - 1];
    if (h && h.cls && CLS[h.cls]) this.board.set({ badges: { [h.to]: { cls: CLS[h.cls].c, text: CLS[h.cls].s } } });
  }

  showCoach(c, before) {
    const k = CLS[c.cls];
    const bad = BAD.includes(c.cls);
    let acts = "";
    if (bad && this.cfg.allowTakeback && this.mode !== "local") {
      acts = `<div class="acts"><button class="btn sm primary" data-a="undo">↶ Вернуть ход</button>
        <button class="btn sm" data-a="best">Показать лучший</button>
        <button class="btn sm ghost" data-a="cont">Продолжить</button></div>`;
    }
    const strip = ["inaccuracy", "mistake", "miss", "blunder", "good", "excellent", "brilliant"].includes(c.cls);
    const text = strip ? c.comment.replace(/^[^.!?]*[.!?]\s*/, "") : c.comment;
    this.coachSay(`<span class="ci ${k.c}" style="display:inline-flex;vertical-align:-4px;margin-right:4px">${k.s}</span><b>${k.t}.</b> ${esc(text)}${acts}`);
    const box = this.ui.coach;
    $$("[data-a]", box).forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === "undo") this.takeback(true);
      if (a === "cont") { this.coachSay("Продолжаем. Будь внимательнее!"); this.nextTurn(); }
      if (a === "best" && c.bestUci) {
        this.board.set({ shapes: [{ from: c.bestUci.slice(0, 2), to: c.bestUci.slice(2, 4), color: "green" }] });
        const san = sanLine(before, [c.bestUci], 1).replace(/^\d+\.(…)?\s*/, "");
        b.outerHTML = `<span class="small muted">Лучше было <b>${esc(san)}</b></span>`;
      }
    });
  }

  coachSay(html, av = "🧑‍🏫") {
    const box = this.ui && this.ui.coach;
    if (!box) return;
    box.classList.remove("hidden");
    box.innerHTML = `<div class="ca">${av}</div><div class="cm">${html}</div>`;
  }

  async hint() {
    if (!this.isUserTurn()) return;
    const pre = await this.preAnalysis(this.chess.fen());
    if (!pre || !pre.best) return;
    this.cfg.usedHints = (this.cfg.usedHints || 0) + 1;
    const from = pre.best.slice(0, 2), to = pre.best.slice(2, 4);
    this.hintLevel++;
    if (this.hintLevel === 1) {
      const p = this.chess.get(from);
      this.board.set({ shapes: [{ from, color: "blue" }] });
      this.coachSay(`💡 Подумай, куда пойти <b>${{ p: "пешкой", n: "конём", b: "слоном", r: "ладьёй", q: "ферзём", k: "королём" }[p.type]}</b> с ${from}. Нажми ещё раз — покажу ход.`);
    } else {
      this.board.set({ shapes: [{ from, to, color: "blue" }] });
      const ev = pre.lines[0] ? fmtEval(scoreOf(pre.lines[0]) * (this.turn === "w" ? 1 : -1)) : "";
      this.coachSay(`💡 Лучший ход: <b>${esc(sanLine(this.chess.fen(), [pre.best], 1).replace(/^\d+\.(…)?\s*/, ""))}</b> ${ev ? `(оценка ${ev})` : ""}`);
    }
  }

  async threats() {
    if (this.chess.inCheck()) { this.coachSay("Тебе шах — сначала надо от него защититься."); return; }
    const fen = nullMoveFen(this.chess.fen());
    const r = await engine.analyse(fen, { depth: 10, tag: "coach" });
    if (!r.best) return;
    this.board.set({ shapes: [{ from: r.best.slice(0, 2), to: r.best.slice(2, 4), color: "red" }] });
    const line = sanLine(fen, r.lines[0]?.pv || [r.best], 3);
    this.coachSay(`⚠️ Если бы ход был у соперника, он сыграл бы <b>${esc(line)}</b>. Подумай, как защититься — или не обращай внимания, если угроза пустая.`);
  }

  async takeback(fromCoach = false) {
    if (!this.cfg.allowTakeback || !this.hist.length || this.result) return;
    this.gen++;
    engine.cancel("bot"); engine.cancel("coach");
    this.preCache.clear();
    let n = 1;
    if (this.mode === "bot" || this.mode === "practice") {
      n = this.turn === this.userColor ? 2 : 1;
      if (this.waitCoach) n = 1;
    }
    n = Math.min(n, this.hist.length);
    for (let i = 0; i < n; i++) { this.chess.undo(); this.hist.pop(); }
    this.cfg.takebacks = (this.cfg.takebacks || 0) + 1;
    this.waitCoach = false; this.thinking = false; this.viewPly = null; this.hintLevel = 0;
    this.prevUserEval = null;
    this.board.cancelPremove();
    this.board.set({ shapes: [] });
    this.syncBoard(true);
    if (this.coachOn()) this.coachSay(fromCoach ? "Ход возвращён. Найди ход получше — подсказка 💡, если нужно." : "Ход возвращён.");
    this.renderAll();
    this.persist();
    if ((this.mode === "bot" || this.mode === "practice") && this.turn !== this.userColor) this.botTurn();
    else this.setMovable();
  }

  /* --- практика: цель позиции --- */
  userEval() {
    const e = this.lastEval;
    if (!e) return null;
    return e.user ? e.s : this.userColor === "w" ? e.s : -e.s;
  }

  practiceCheck(m, byUser) {
    const goal = this.cfg.goal;
    if (!goal) return;
    const ue = this.userEval();
    const userMoves = this.hist.filter(h => h.color === this.userColor).length;
    if (goal.type === "promote" && byUser && m.promotion) {
      engine.analyse(this.chess.fen(), { depth: 12, tag: "coach" }).then(r => {
        const s = -scoreOf(r.lines[0]);
        if (this.result) return;
        if (s >= 400) this.finish(this.userColor === "w" ? "1-0" : "0-1", "пешка прошла в ферзи");
        else this.coachSay("Ферзь появился, но его сразу забирают. Попробуй ещё раз — ↶ вернёт ход.");
      });
    }
    if (goal.type === "draw" && !byUser && ue != null && ue <= -500) {
      this.coachSay("Позиция проиграна: движок видит выигрыш соперника. Верни пару ходов и попробуй другой план.");
    }
    if (goal.type === "draw" && byUser && userMoves >= (goal.moves || 20) && (ue == null || ue > -300)) {
      this.finish("1/2-1/2", `ничья удержана ${goal.moves || 20} ходов`);
    }
    if (goal.moves && goal.type === "mate" && userMoves > goal.moves * 2 && byUser) {
      this.coachSay(`Уже ${userMoves} ${plural(userMoves, "ход", "хода", "ходов")}. Мат можно поставить быстрее — попробуй заново.`);
    }
  }

  /* --- конец партии --- */
  finish(result, reason) {
    if (this.result) return;
    this.stopClock();
    this.result = { result, reason };
    this.gen++;
    engine.cancel("bot");
    this.thinking = false;
    this.waitCoach = false;
    this.board.cancelPremove();
    this.board.set({ movable: null });
    const uc = this.userColor;
    const userScore = this.mode === "local" ? null : result === "1/2-1/2" ? 0.5 : (result === "1-0") === (uc === "w") ? 1 : 0;
    snd(userScore === 1 ? "win" : "end");
    let rating = null;
    if (this.mode !== "practice") {
      const rec = this.saveRecord(userScore);
      if (this.mode === "online") {
        const slot = tcSlot(this.cfg.tc);
        if (slot && userScore != null) {
          const opp = this.player(uc === "w" ? "b" : "w");
          const before = S.ratings[slot].r;
          const delta = eloUpdate(slot, opp.rating || 1200, userScore);
          rating = { slot, before, after: before + delta, delta };
          rec.ratingDelta = delta;
        }
        unlock("online-1");
      }
      activity("games");
      unlock("first-game");
      if (userScore === 1) {
        unlock("first-win");
        const last = this.hist[this.hist.length - 1];
        if (reason === "мат" && last) {
          if (last.piece === "n") unlock("mate-knight");
          if (last.piece === "p") unlock("mate-pawn");
        }
        if (this.mode === "bot" && this.bot) {
          S.bots.beaten[this.bot.id] = Math.max(S.bots.beaten[this.bot.id] || 0, Date.now());
          if (this.bot.elo >= 1000) unlock("beat-1000");
          if (this.bot.elo >= 1600) unlock("beat-1600");
          if (this.bot.elo >= 2200) unlock("beat-2200");
        }
      }
      if (this.mode === "bot" && this.bot) {
        S.bots.played[this.bot.id] = (S.bots.played[this.bot.id] || 0) + 1;
        this.botSay(userScore === 1 ? this.bot.lose : userScore === 0 ? this.bot.win : "Ничья — честный результат.");
      }
      checkStreakAch();
    } else {
      const ok = userScore === 1 || (this.cfg.goal?.type === "draw" && result === "1/2-1/2");
      this.cfg.onEnd && this.cfg.onEnd(ok, this);
    }
    S.current = null;
    save();
    this.renderAll();
    if (this.mode === "online") this.net?.gameOver?.();
    setTimeout(() => { if (G === this && location.hash.startsWith("#/game")) this.resultModal(userScore, rating); }, 700);
  }

  saveRecord(userScore) {
    const rec = {
      id: this.id, ts: Date.now(), mode: this.mode,
      white: { ...this.cfg.white }, black: { ...this.cfg.black },
      user: this.mode === "local" ? null : this.userColor,
      result: this.result.result, reason: this.result.reason, tc: this.cfg.tc || "none",
      moves: this.hist.map(h => h.uci).join(" "),
      botId: this.bot?.id,
    };
    if (this.startFen !== START_FEN) rec.startFen = this.startFen;
    const op = openingForMoves(this.startFen, this.hist.map(h => h.uci));
    if (op) rec.opening = op.name;
    S.games = S.games.filter(g => g.id !== rec.id);
    S.games.unshift(rec);
    if (S.games.length > 300) S.games.length = 300;
    save();
    return rec;
  }

  resultModal(userScore, rating) {
    const r = this.result;
    let title = "Ничья";
    if (this.mode === "local") title = r.result === "1-0" ? "Победили белые" : r.result === "0-1" ? "Победили чёрные" : "Ничья";
    else if (this.mode === "practice") title = userScore === 1 || (this.cfg.goal?.type === "draw" && r.result === "1/2-1/2") ? "Задание выполнено!" : "Не получилось";
    else if (userScore === 1) title = "Победа!";
    else if (userScore === 0) title = "Поражение";
    const W = this.cfg.white, B = this.cfg.black;
    const wWin = r.result === "1-0", bWin = r.result === "0-1";
    const n = Math.ceil(this.hist.length / 2);
    const m = modal(`<div class="gameover">
      <div class="res">${title}</div>
      <div class="why">${esc(r.reason)} · ${n} ${plural(n, "ход", "хода", "ходов")}</div>
      <div class="vs">
        <div class="p ${wWin ? "win" : ""}"><div class="av">${W.av}</div><div class="b small">${esc(W.name)}</div><div class="tiny muted">белые</div></div>
        <div style="font-size:22px;font-weight:800">${r.result.replace("1/2-1/2", "½–½")}</div>
        <div class="p ${bWin ? "win" : ""}"><div class="av">${B.av}</div><div class="b small">${esc(B.name)}</div><div class="tiny muted">чёрные</div></div>
      </div>
      ${rating ? `<div class="card" style="background:var(--panel2);margin-bottom:12px">Рейтинг ${{ bullet: "пуля", blitz: "блиц", rapid: "рапид" }[rating.slot]}: <b>${rating.after}</b> <span class="${rating.delta >= 0 ? "green" : "red"}">(${rating.delta >= 0 ? "+" : ""}${rating.delta})</span></div>` : ""}
      ${this.mode !== "practice" ? `<button class="btn primary big block" id="goRev">🔍 Разбор партии</button>` : ""}
      <div class="grid2" style="margin-top:10px">
        <button class="btn" id="goRe">${this.mode === "practice" ? "Ещё раз" : "Реванш"}</button>
        <button class="btn" id="goNew">${this.mode === "practice" ? "К урокам" : "Новая партия"}</button>
      </div>
      <button class="btn ghost block" style="margin-top:10px" data-close>Посмотреть доску</button>
    </div>`);
    $("#goRev", m)?.addEventListener("click", () => { m.close(); go("review/" + this.id); });
    $("#goRe", m).onclick = () => { m.close(); this.rematch(); };
    $("#goNew", m).onclick = () => {
      m.close();
      if (this.mode === "practice") history.back();
      else go(this.mode === "online" ? "online" : this.mode === "local" ? "local" : "bots");
    };
  }

  rematch() {
    if (this.mode === "online") { this.net.send({ t: "rematch" }); toast("Предложение реванша отправлено"); return; }
    const cfg = { ...this.cfg, id: null, moves: [], clocks: null };
    if (this.mode === "bot") {
      cfg.userColor = this.userColor === "w" ? "b" : "w";
      const meP = me();
      cfg.white = cfg.userColor === "w" ? meP : botPlayer(this.bot);
      cfg.black = cfg.userColor === "b" ? meP : botPlayer(this.bot);
    }
    if (this.mode === "local") { const w = cfg.white; cfg.white = cfg.black; cfg.black = w; }
    startGame(cfg);
  }

  async resign() {
    if (this.result) return;
    if (this.hist.length < 2 && this.mode !== "online") { this.abort(); return; }
    if (S.settings.confirmResign && !(await confirmBox("Сдаться?", "Сдаться"))) return;
    if (this.mode === "local") {
      this.finish(this.turn === "w" ? "0-1" : "1-0", (this.turn === "w" ? "белые" : "чёрные") + " сдались");
      return;
    }
    if (this.mode === "online") this.net.send({ t: "resign" });
    this.finish(this.userColor === "w" ? "0-1" : "1-0", "вы сдались");
  }

  abort() {
    this.result = { result: "*", reason: "прервана" };
    this.gen++;
    engine.cancel("bot");
    this.stopClock();
    S.current = null; save();
    if (this.mode === "online") this.net?.send({ t: "abort" });
    toast("Партия прервана");
    go(this.mode === "online" ? "online" : "play");
  }

  async offerDraw() {
    if (this.result) return;
    if (this.mode === "online") { this.net.send({ t: "draw" }); toast("Предложение ничьей отправлено"); return; }
    if (this.mode === "local") {
      if (await confirmBox("Согласиться на ничью?", "Ничья")) this.finish("1/2-1/2", "по соглашению");
      return;
    }
    // бот соглашается, когда позиция равная и партия длинная, или когда он проигрывает
    const r = await engine.analyse(this.chess.fen(), { depth: 12, tag: "coach" });
    let s = scoreOf(r.lines[0]);
    if (this.turn === this.userColor) s = -s;    // с точки зрения бота
    if ((Math.abs(s) < 40 && this.hist.length > 50) || s < -250) {
      this.botSay("Хорошо, ничья.");
      this.finish("1/2-1/2", "по соглашению");
    } else {
      this.botSay(s > 150 ? "Нет уж, я играю на победу." : "Давай ещё поиграем.");
    }
  }

  /* --- онлайн-сообщения --- */
  onNet(msg) {
    if (msg.t === "move" && !this.result) {
      if (this.turn === this.userColor) return;
      const before = this.chess.fen();
      const m = playUci(this.chess, msg.uci);
      if (!m) return;
      this.afterMove(m, before, false);
      if (this.clock && msg.clock != null) { this.clock[m.color] = msg.clock + (this.hist.length >= 2 ? this.clock.inc : 0); this.renderClock(); }
    } else if (msg.t === "resign") this.finish(this.userColor === "w" ? "1-0" : "0-1", "соперник сдался");
    else if (msg.t === "timeout") this.timeout(msg.loser);
    else if (msg.t === "abort") { if (!this.result) { this.result = { result: "*", reason: "прервана" }; this.stopClock(); toast("Соперник прервал партию"); this.renderAll(); } }
    else if (msg.t === "draw") {
      confirmBox(`${esc(this.player(this.userColor === "w" ? "b" : "w").name)} предлагает ничью. Согласиться?`, "Ничья", "Играть дальше").then(ok => {
        this.net.send({ t: ok ? "draw-yes" : "draw-no" });
        if (ok) this.finish("1/2-1/2", "по соглашению");
      });
    } else if (msg.t === "draw-yes") this.finish("1/2-1/2", "по соглашению");
    else if (msg.t === "draw-no") toast("Соперник отказался от ничьей");
    else if (msg.t === "chat") { this.chat.push({ who: "op", text: String(msg.text).slice(0, 300) }); this.renderChat(); snd("notify"); }
    else if (msg.t === "rematch") {
      confirmBox("Соперник предлагает реванш. Сыграем?", "Реванш", "Нет").then(ok => {
        if (!ok) { this.net.send({ t: "rematch-no" }); return; }
        this.net.send({ t: "rematch-yes" });
        this.net.startRematch?.(this.cfg);
      });
    } else if (msg.t === "rematch-yes") this.net.startRematch?.(this.cfg);
    else if (msg.t === "rematch-no") toast("Соперник отказался от реванша");
  }
  netLost() {
    if (this.result) return;
    this.coachSay("Соперник отключился. Если он не вернётся за минуту, победа засчитается вам.", "📡");
    clearTimeout(this.lostT);
    this.lostT = setTimeout(() => {
      if (!this.result && this.net && !this.net.alive) this.finish(this.userColor === "w" ? "1-0" : "0-1", "соперник покинул партию");
    }, 60000);
  }
  netBack() { clearTimeout(this.lostT); this.coachSay("Соперник снова на связи.", "📡"); }

  /* --- сохранение незаконченной партии --- */
  persist() {
    if (this.mode === "online" || this.result) return;
    const { onEnd: _skip, ...cfg } = this.cfg;   // обработчик цели не сохраняется
    S.current = { cfg: { ...cfg, id: this.id }, moves: this.hist.map(h => ({ uci: h.uci, cls: h.cls, comment: h.comment })), clocks: this.clock ? { w: this.rem("w"), b: this.rem("b") } : null, route: location.hash };
    save();
  }

  /* --- отрисовка --- */
  renderAll() { this.renderBars(); this.renderMoves(); this.renderCtrl(); this.renderEval(); this.renderClock(); this.renderHead(); }

  renderHead() {
    const el = this.ui.head;
    if (!el) return;
    if (this.mode === "practice" && this.cfg.goal) { el.innerHTML = `<span class="small"><b>Цель:</b> ${esc(this.cfg.goal.text)}</span>`; return; }
    const op = this.hist.length && this.startFen === START_FEN ? openingForMoves(this.startFen, this.hist.map(h => h.uci)) : null;
    const tc = this.cfg.tc && this.cfg.tc !== "none" ? `⏱ ${tcName(this.cfg.tc)} · ` : "";
    el.innerHTML = `<span class="small muted">${tc}${op ? `<b style="color:var(--text)">${esc(openingRu(op.name).ru)}</b>${openingRu(op.name).rest ? " · " + esc(openingRu(op.name).rest) : ""}` : this.result ? esc(this.result.reason) : "Партия идёт"}</span>`;
  }

  renderBars() {
    const bottom = this.orientation, top = bottom === "w" ? "b" : "w";
    const ply = this.viewPly ?? this.hist.length;
    const fen = ply === 0 ? this.startFen : this.hist[ply - 1].fen;
    const cap = captured(fen);
    for (const [slot, color] of [["top", top], ["bot", bottom]]) {
      const el = this.ui[slot];
      const p = this.player(color);
      const taken = cap.takenBy[color];
      const diff = color === "w" ? cap.diff : -cap.diff;
      const oppC = color === "w" ? "b" : "w";
      const thinking = this.thinking && this.turn === color;
      el.innerHTML = `<div class="av">${p.av}</div>
        <div class="info"><div class="nm"><span>${esc(p.name)}</span>${p.rating ? `<span class="rt">(${p.rating})</span>` : ""}</div>
        <div class="caps">${thinking ? `<span class="thinking">думает<i></i><i></i><i></i></span>` :
          taken.map(t => `<img src="${pieceUrl(S.settings.pieces, oppC + t.toUpperCase())}" alt="">`).join("") + (diff > 0 ? `<b>+${diff}</b>` : "")}</div></div>
        ${this.clock ? `<div class="clock ${color === "b" ? "dark" : ""}" data-c="${color}"></div>` : ""}`;
    }
    this.renderClock();
  }

  renderClock() {
    if (!this.clock || !this.ui) return;
    for (const el of $$(".clock", this.ui.root)) {
      const c = el.dataset.c;
      const r = this.rem(c);
      el.textContent = fmtClock(r);
      el.classList.toggle("run", this.clock.turn === c && !this.result);
      el.classList.toggle("low", r < 20000);
    }
  }

  botSay(text) {
    if (!text || !this.ui) return;
    const color = this.userColor === "w" ? "b" : "w";
    const slot = this.orientation === color ? "bot" : "top";
    const bar = this.ui[slot];
    $(".say", bar)?.remove();
    const d = document.createElement("div");
    d.className = "say";
    d.textContent = text;
    bar.appendChild(d);
    clearTimeout(this.sayT);
    this.sayT = setTimeout(() => d.remove(), 3500);
  }

  renderMoves() {
    const cur = this.viewPly ?? this.hist.length;
    const shown = ["brilliant", "great", "inaccuracy", "mistake", "miss", "blunder"];
    const icon = h => shown.includes(h.cls) ? `<span class="ci ${CLS[h.cls].c}">${CLS[h.cls].s}</span>` : "";
    const startBlack = this.startFen.split(" ")[1] === "b";
    const startN = +this.startFen.split(" ")[5] || 1;
    let table = "", strip = "";
    const items = [];
    if (startBlack) items.push(null);
    items.push(...this.hist);
    for (let i = 0; i < items.length; i += 2) {
      const n = startN + i / 2;
      const cell = (h, idx) => h ? `<div class="m ${idx === cur ? "cur" : ""}" data-p="${idx}">${icon(h)}${esc(figSan(h.san))}</div>` : `<div class="m"></div>`;
      const i1 = startBlack ? i : i + 1, i2 = startBlack ? i + 1 : i + 2;
      table += `<div class="n">${n}.</div>${cell(items[i], i1)}${cell(items[i + 1], i2)}`;
      strip += `<span class="n">${n}.</span>${items[i] ? `<span class="m ${i1 === cur ? "cur" : ""}" data-p="${i1}">${icon(items[i])}${esc(figSan(items[i].san))}</span>` : `<span class="m">…</span>`}${items[i + 1] ? `<span class="m ${i2 === cur ? "cur" : ""}" data-p="${i2}">${icon(items[i + 1])}${esc(figSan(items[i + 1].san))}</span>` : ""}`;
    }
    this.ui.moves.innerHTML = table || `<div class="empty small" style="grid-column:1/-1">Ходов пока нет</div>`;
    this.ui.strip.innerHTML = strip || `<span class="dim small" style="padding:0 6px">Ходов пока нет</span>`;
    for (const el of $$("[data-p]", this.ui.root)) el.onclick = () => this.goPly(+el.dataset.p);
    const c = $(".m.cur", this.ui.strip);
    if (c) this.ui.strip.scrollLeft = c.offsetLeft - this.ui.strip.clientWidth / 2;
    const ct = $(".m.cur", this.ui.moves);
    if (ct && this.viewPly == null) this.ui.movesBox.scrollTop = this.ui.movesBox.scrollHeight;
  }

  goPly(p) {
    p = Math.max(0, Math.min(this.hist.length, p));
    this.viewPly = p === this.hist.length ? null : p;
    this.board.set({ shapes: [] });
    this.syncBoard(true);
    this.setMovable();
    this.renderBars();
    this.renderMoves();
    const h = p ? this.hist[p - 1] : null;
    if (h && h.comment && this.coachOn() && this.viewPly != null) this.coachSay(`<b>${esc(figSan(h.san))}</b>: ${esc(h.comment)}`);
  }

  renderEval() {
    const bar = this.ui.evalbar;
    if (!bar) return;
    const on = !!this.cfg.evalBar && this.mode !== "online";
    bar.classList.toggle("hidden", !on);
    if (!on || !this.lastEval) return;
    const s = this.lastEval.user ? (this.userColor === "w" ? this.lastEval.s : -this.lastEval.s) : this.lastEval.s;
    const w = winPct(s);
    bar.classList.toggle("flip", this.orientation === "b");
    $(".w", bar).style.height = w + "%";
    const t = $(".t", bar);
    t.textContent = fmtEval(s).replace("+", "");
    const whiteAhead = s >= 0;
    t.style.color = whiteAhead ? "#222" : "#fff";
    const atBottom = (this.orientation === "w") === whiteAhead;
    t.style.top = atBottom ? "auto" : "3px"; t.style.bottom = atBottom ? "3px" : "auto";
  }

  renderCtrl() {
    const el = this.ui.ctrl;
    if (!el) return;
    const live = this.viewPly == null;
    const canHint = (this.cfg.allowHints || this.coachOn()) && !this.result && this.mode !== "online";
    const canBack = this.cfg.allowTakeback && !this.result && this.hist.length > 0 && this.mode !== "online";
    el.innerHTML = `
      <button data-c="menu" title="Меню">⋯<small>Меню</small></button>
      ${canHint ? `<button data-c="hint" title="Подсказка">💡<small>Подсказка</small></button>` : ""}
      ${canHint ? `<button data-c="threat" title="Угрозы">⚠️<small>Угрозы</small></button>` : ""}
      ${canBack ? `<button data-c="back" title="Вернуть ход">↶<small>Вернуть</small></button>` : ""}
      ${this.result ? `<button data-c="review" title="Разбор">🔍<small>Разбор</small></button>` : ""}
      <button data-c="prev" ${(this.viewPly ?? this.hist.length) === 0 ? "disabled" : ""}>◀<small>Назад</small></button>
      <button data-c="next" ${live ? "disabled" : ""}>▶<small>Вперёд</small></button>`;
    for (const b of $$("button", el)) b.onclick = () => this.ctrl(b.dataset.c);
  }

  ctrl(c) {
    const ply = this.viewPly ?? this.hist.length;
    if (c === "prev") this.goPly(ply - 1);
    if (c === "next") this.goPly(ply + 1);
    if (c === "hint") this.hint();
    if (c === "threat") this.threats();
    if (c === "back") this.takeback();
    if (c === "review") go("review/" + this.id);
    if (c === "menu") this.menu();
  }

  menu() {
    const r = this.result;
    const items = [
      ["flip", "⇅ Перевернуть доску"],
      !r && this.mode !== "practice" ? ["draw", "½ Предложить ничью"] : null,
      !r ? ["resign", this.hist.length < 2 && this.mode !== "online" ? "✕ Прервать партию" : "⚑ Сдаться"] : null,
      this.mode !== "online" ? ["eval", (this.cfg.evalBar ? "✓ " : "") + "Шкала оценки"] : null,
      this.mode === "bot" || this.mode === "practice" ? ["coach", (this.cfg.coach ? "✓ " : "") + "Тренер оценивает ходы"] : null,
      r ? ["analysis", "🔬 Открыть в анализе"] : null,
      ["pgn", "📋 Скопировать PGN"],
      ["fen", "📋 Скопировать FEN"],
      ["sound", (S.settings.sound ? "🔊" : "🔇") + " Звук"],
      ["exit", "← Выйти в меню"],
    ].filter(Boolean);
    const m = modal(`<h2>Меню партии</h2><div class="col">${items.map(([k, t]) => `<button class="btn block" data-k="${k}" style="justify-content:flex-start">${t}</button>`).join("")}</div>`);
    $$("[data-k]", m).forEach(b => b.onclick = () => {
      m.close();
      const k = b.dataset.k;
      if (k === "flip") { this.orientation = this.orientation === "w" ? "b" : "w"; this.board.set({ orientation: this.orientation }); this.renderBars(); this.renderEval(); }
      if (k === "draw") this.offerDraw();
      if (k === "resign") this.resign();
      if (k === "eval") {
        this.cfg.evalBar = !this.cfg.evalBar;
        this.renderEval();
        if (this.cfg.evalBar && !this.lastEval) engine.analyse(this.chess.fen(), { depth: 12, tag: "coach" }).then(rr => {
          if (rr.lines[0]) { this.lastEval = { s: scoreOf(rr.lines[0]) * (this.turn === "w" ? 1 : -1) }; this.renderEval(); }
        });
      }
      if (k === "coach") { this.cfg.coach = !this.cfg.coach; this.ui.coach.classList.toggle("hidden", !this.cfg.coach && this.mode !== "practice"); this.renderCtrl(); if (this.cfg.coach) this.coachSay("Тренер на связи: буду оценивать твои ходы."); }
      if (k === "analysis") go(`analysis?game=${this.id}`);
      if (k === "pgn") copyText(this.pgn());
      if (k === "fen") copyText(this.chess.fen());
      if (k === "sound") { S.settings.sound = !S.settings.sound; save(); }
      if (k === "exit") go("play");
    });
  }

  pgn() {
    return buildPgn({ white: this.cfg.white.name, black: this.cfg.black.name, result: this.result?.result || "*", startFen: this.startFen, moves: this.hist.map(h => h.uci), tc: this.cfg.tc });
  }

  renderChat() {
    const el = this.ui.chat;
    if (!el || this.mode !== "online") return;
    el.classList.remove("hidden");
    $(".chat", el).innerHTML = this.chat.length ? this.chat.map(c => `<div class="msg ${c.who === "me" ? "me" : c.who === "sys" ? "sys" : ""}">${esc(c.text)}</div>`).join("") : `<div class="msg sys">Чат с соперником</div>`;
    const box = $(".chat", el);
    box.scrollTop = box.scrollHeight;
  }

  /* --- построение экрана --- */
  mount(el) {
    document.body.classList.add("immersive");
    setActive("game");
    const title = this.mode === "bot" ? `${this.bot.av} ${this.bot.name}` : this.mode === "local" ? "Вдвоём на одном устройстве" : this.mode === "online" ? "Онлайн" : (this.cfg.title || "Практика");
    el.innerHTML = `<div class="play">
      <div class="play-main">
        <div class="gtop"><button class="back" id="gBack">←</button><div class="tt">${esc(title)}</div><button class="iconbtn" id="gMenu">⋯</button></div>
        <div class="board-col">
          <div class="pbar" id="pTop"></div>
          <div class="board-row"><div class="evalbar hidden"><div class="w"></div><div class="t"></div></div><div id="gBoard"></div></div>
          <div class="pbar" id="pBot"></div>
        </div>
      </div>
      <aside class="side">
        <div class="side-head" id="gHead"></div>
        <div class="side-body" id="gMovesBox"><div class="moves desk-only" id="gMoves"></div></div>
        <div class="mstrip mob-only" id="gStrip"></div>
        <div id="gChat" class="hidden" style="border-top:1px solid var(--line)">
          <div class="chat" style="max-height:180px;overflow:auto"></div>
          <div class="row" style="padding:8px"><input type="text" id="chatIn" placeholder="Сообщение…" maxlength="200"><button class="btn sm" id="chatGo">➤</button></div>
          <div class="chips" style="padding:0 8px 8px">${["Привет!", "Удачи!", "Хорошая партия", "Спасибо!", "Упс 😅"].map(t => `<button class="chip sm" data-q="${t}">${t}</button>`).join("")}</div>
        </div>
        <div class="side-foot">
          <div class="coachbox ${this.coachOn() || this.mode === "practice" ? "" : "hidden"}" id="gCoach"></div>
          <div class="ctrl" id="gCtrl"></div>
        </div>
      </aside>
    </div>`;
    this.ui = {
      root: el, top: $("#pTop", el), bot: $("#pBot", el), moves: $("#gMoves", el), movesBox: $("#gMovesBox", el),
      strip: $("#gStrip", el), ctrl: $("#gCtrl", el), coach: $("#gCoach", el), head: $("#gHead", el),
      evalbar: $(".evalbar", el), chat: $("#gChat", el),
    };
    $("#gBack", el).onclick = () => history.length > 1 ? history.back() : go("play");
    $("#gMenu", el).onclick = () => this.menu();
    if (this.board) this.board.destroy();
    this.board = new Board($("#gBoard", el), {
      orientation: this.orientation, coords: S.settings.coords, legal: S.settings.legal, anim: S.settings.anim,
      set: S.settings.pieces, autoQueen: S.settings.autoQueen,
      onMove: (f, t, p) => this.onBoardMove(f, t, p),
    });
    this.syncBoard(false);
    this.renderAll();
    if (this.mode === "online") {
      this.renderChat();
      const send = text => { text = text.trim(); if (!text) return; this.net.send({ t: "chat", text }); this.chat.push({ who: "me", text }); this.renderChat(); };
      $("#chatGo", el).onclick = () => { send($("#chatIn", el).value); $("#chatIn", el).value = ""; };
      $("#chatIn", el).onkeydown = e => { if (e.key === "Enter") $("#chatGo", el).click(); };
      $$("[data-q]", el).forEach(b => b.onclick = () => send(b.dataset.q));
    }
    this.ticker = setInterval(() => this.tick(), 100);
    this.keys = e => {
      if (e.target.closest("input,textarea")) return;
      if (e.key === "ArrowLeft") this.ctrl("prev");
      if (e.key === "ArrowRight") this.ctrl("next");
    };
    addEventListener("keydown", this.keys);
    if (this.coachIntro) { this.coachSay(this.coachIntro); this.coachIntro = null; }
    if (!this.result) {
      if (!this.started) {
        this.started = true;
        if (this.hist.length === 0) snd("start");
        if (this.mode === "bot" && this.bot && this.hist.length === 0) setTimeout(() => this.botSay(this.bot.hi), 400);
      }
      if ((this.mode === "bot" || this.mode === "practice") && this.turn !== this.userColor && !this.thinking) this.botTurn();
      else this.setMovable();
      if (this.clock && this.hist.length >= 1 && !this.clock.turn) this.startClock(this.turn);
    } else this.setMovable();
    return () => this.unmount();
  }

  unmount() {
    clearInterval(this.ticker);
    removeEventListener("keydown", this.keys);
    if (!this.result && this.mode !== "online") {
      // уходим из незаконченной партии — замораживаем часы и сохраняем
      this.stopClock();
      this.persist();
      this.gen++;
      engine.cancel("bot");
      this.thinking = false;
    }
    this.board && this.board.destroy();
  }
}

/* ======================================================================= */
export function botPlayer(bot) { return { name: bot.name, av: bot.av, rating: bot.elo, bot: bot.id }; }

export function startGame(cfg) {
  if (G && G.mode === "online" && cfg.mode !== "online") G.net?.close?.();
  G = new GameCtl(cfg);
  if (cfg.intro) G.coachIntro = cfg.intro;
  G.persist();
  go("game");
  return G;
}

export function resumeSaved() {
  const c = S.current;
  if (!c) return false;
  G = new GameCtl({ ...c.cfg, moves: c.moves, clocks: c.clocks });
  go("game");
  return true;
}

export function viewGame(el) {
  if (!G) {
    if (S.current) { G = new GameCtl({ ...S.current.cfg, moves: S.current.moves, clocks: S.current.clocks }); }
    else { el.innerHTML = `<div class="empty">Партии нет. <a href="#/play">Начать новую</a></div>`; return; }
  }
  if (G.mode === "practice" && !G.cfg.onEnd && G.cfg.practiceId) {
    // после перезагрузки обработчик цели теряется — восстанавливаем
    import("./learn.js").then(m => m.attachPracticeEnd && m.attachPracticeEnd(G));
  }
  return G.mount(el);
}

/* --- экран «Играть» --- */
export function viewPlayHub(el) {
  const cur = S.current;
  el.innerHTML = `
    <div class="topbar"><h1>Играть</h1></div>
    ${cur ? `<div class="card" style="margin-bottom:12px;display:flex;align-items:center;gap:12px">
      <div style="font-size:30px">⏸</div><div style="flex:1"><div class="b">Незаконченная партия</div>
      <div class="small muted">${esc(cur.cfg.white.name)} — ${esc(cur.cfg.black.name)} · ${cur.moves.length} ${plural(cur.moves.length, "полуход", "полухода", "полуходов")}</div></div>
      <button class="btn primary" id="resume">Продолжить</button></div>` : ""}
    <div class="tiles">
      <button class="tile" data-go="online"><div class="ti">🌐</div><div><div class="tt">Онлайн</div><div class="ts">Быстрый поиск соперника или игра с другом по ссылке</div></div></button>
      <button class="tile" data-go="bots"><div class="ti">🤖</div><div><div class="tt">С ботами</div><div class="ts">14 соперников от 250 до 3200, тренер подсказывает</div></div></button>
      <button class="tile" data-go="local"><div class="ti">👥</div><div><div class="tt">Вдвоём на одном устройстве</div><div class="ts">Передавайте телефон друг другу</div></div></button>
      <button class="tile" data-go="analysis"><div class="ti">🔬</div><div><div class="tt">Доска анализа</div><div class="ts">Движок, варианты, расстановка позиции, PGN</div></div></button>
      <button class="tile" data-go="history"><div class="ti">📜</div><div><div class="tt">Мои партии</div><div class="ts">${S.games.length} ${plural(S.games.length, "партия", "партии", "партий")} · разбор каждой</div></div></button>
    </div>`;
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
  $("#resume", el)?.addEventListener("click", resumeSaved);
}

/* --- выбор бота --- */
export function viewBots(el) {
  let sel = botById(S.lastBot || suggestBot().id);
  let color = S.lastColor || "w";
  let tc = S.lastTc || "none";
  const opts = Object.assign({ coach: true, hints: true, evalBar: false }, S.botOpts || {});
  const draw = () => {
    el.innerHTML = `
      <div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Игра с ботом</h1></div>
      <div class="play" style="grid-template-columns:minmax(0,1fr) 360px">
        <div>
          <div class="bot-grid">${BOTS.map(b => `<button class="bot ${b.id === sel.id ? "on" : ""}" data-b="${b.id}">
            ${S.bots.beaten[b.id] ? `<span class="medal">🏅</span>` : ""}
            <div class="av">${b.av}</div><div class="nm">${esc(b.name)}</div><div class="rt">${b.elo}</div></button>`).join("")}</div>
        </div>
        <div class="card" style="position:sticky;top:20px">
          <div class="row"><div style="font-size:48px">${sel.av}</div><div><div class="b" style="font-size:19px">${esc(sel.name)}</div><div class="muted">Рейтинг ${sel.elo}</div></div></div>
          <p class="small muted" style="margin:8px 0 14px">${esc(sel.style)}${S.bots.played[sel.id] ? ` Сыграно партий: ${S.bots.played[sel.id]}.` : ""}</p>
          <div class="sec-title" style="margin-top:0">Цвет</div>
          <div class="seg" id="col">${[["w", "⚪ Белые"], ["r", "🎲 Любой"], ["b", "⚫ Чёрные"]].map(([k, t]) => `<button class="${color === k ? "on" : ""}" data-k="${k}">${t}</button>`).join("")}</div>
          <div class="sec-title">Контроль времени</div>
          <div class="chips" id="tcs">${TCS.map(([k, t]) => `<button class="chip ${tc === k ? "on" : ""}" data-k="${k}">${t}</button>`).join("")}</div>
          <div class="sec-title">Помощь</div>
          <label class="sw"><span class="lt">Тренер оценивает ходы<span class="ls">После каждого хода — оценка и объяснение, при зевке можно вернуть</span></span><input type="checkbox" class="toggle" id="oCoach" ${opts.coach ? "checked" : ""}></label>
          <label class="sw"><span class="lt">Подсказки и возврат ходов</span><input type="checkbox" class="toggle" id="oHints" ${opts.hints ? "checked" : ""}></label>
          <label class="sw"><span class="lt">Шкала оценки</span><input type="checkbox" class="toggle" id="oEval" ${opts.evalBar ? "checked" : ""}></label>
          <button class="btn primary big block" id="go" style="margin-top:14px">Играть</button>
        </div>
      </div>`;
    $$("[data-b]", el).forEach(b => b.onclick = () => { sel = botById(b.dataset.b); draw(); });
    $$("#col button", el).forEach(b => b.onclick = () => { color = b.dataset.k; draw(); });
    $$("#tcs button", el).forEach(b => b.onclick = () => { tc = b.dataset.k; draw(); });
    for (const [id, k] of [["oCoach", "coach"], ["oHints", "hints"], ["oEval", "evalBar"]]) $("#" + id, el).onchange = e => { opts[k] = e.target.checked; };
    $("#go", el).onclick = () => {
      S.lastBot = sel.id; S.lastColor = color; S.lastTc = tc; S.botOpts = opts; save();
      const uc = color === "r" ? (Math.random() < 0.5 ? "w" : "b") : color;
      const meP = me();
      startGame({
        mode: "bot", botId: sel.id, userColor: uc, tc,
        white: uc === "w" ? meP : botPlayer(sel), black: uc === "b" ? meP : botPlayer(sel),
        coach: opts.coach, allowHints: opts.hints, allowTakeback: opts.hints, evalBar: opts.evalBar,
        intro: opts.coach ? `Играем с ботом «${sel.name}» (${sel.elo}). Я буду оценивать каждый твой ход.` : null,
      });
    };
  };
  draw();
}

/* бот по силе пользователя: рейтинг задач и прошлые победы */
export function suggestBot() {
  const r = S.ratings.puzzle.n > 5 ? S.ratings.puzzle.r - 200 : ({ new: 250, beginner: 400, casual: 800, club: 1400 }[S.profile.level] || 600);
  let best = BOTS[0];
  for (const b of BOTS) if (b.elo <= r + 100) best = b;
  return best;
}

/* --- вдвоём на одном устройстве --- */
export function viewLocal(el) {
  let tc = S.localTc || "none";
  let flip = S.localFlip ?? true;
  const draw = () => {
    el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Вдвоём на одном устройстве</h1></div>
      <div class="card" style="max-width:520px">
        <div class="grid2"><div><div class="small muted">Белые</div><input type="text" id="nW" value="${esc(S.localW || "Игрок 1")}"></div>
        <div><div class="small muted">Чёрные</div><input type="text" id="nB" value="${esc(S.localB || "Игрок 2")}"></div></div>
        <div class="sec-title">Контроль времени</div>
        <div class="chips" id="tcs">${TCS.map(([k, t]) => `<button class="chip ${tc === k ? "on" : ""}" data-k="${k}">${t}</button>`).join("")}</div>
        <label class="sw" style="margin-top:8px"><span class="lt">Поворачивать доску после хода</span><input type="checkbox" class="toggle" id="flip" ${flip ? "checked" : ""}></label>
        <button class="btn primary big block" id="go" style="margin-top:12px">Начать</button>
      </div>`;
    $$("#tcs button", el).forEach(b => b.onclick = () => { S.localW = $("#nW", el).value; S.localB = $("#nB", el).value; tc = b.dataset.k; draw(); });
    $("#flip", el).onchange = e => { flip = e.target.checked; };
    $("#go", el).onclick = () => {
      S.localW = $("#nW", el).value || "Белые"; S.localB = $("#nB", el).value || "Чёрные"; S.localTc = tc; S.localFlip = flip; save();
      startGame({
        mode: "local", userColor: "w", tc, autoFlip: flip, allowTakeback: true,
        white: { name: S.localW, av: "⚪" }, black: { name: S.localB, av: "⚫" },
      });
    };
  };
  draw();
}
