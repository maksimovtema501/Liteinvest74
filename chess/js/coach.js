/* Тренер: план на день, сильные и слабые стороны по задачам и партиям,
   оценка уровня и разговор с ИИ-тренером. */
import { $, $$, esc, modal, toast, plural, today } from "./util.js";
import { S, save, unlock, streakDays } from "./store.js";
import { go } from "./router.js";
import { THEMES, themeCount, dailyPuzzle, puzzleById } from "./puzzles.js";
import { nextLesson } from "./learn.js";
import { suggestBot } from "./play.js";
import { BOTS } from "./bots.js";
import { unpackCls, phaseOf } from "./review.js";
import { makeChess, playUci, openingRu, START_FEN } from "./chessutil.js";
import { aiKey, aiAsk, aiHtml, aiError, aiKeyHelp, COACH_SYSTEM } from "./ai.js";
import { resultFor } from "./profile.js";

const isToday = ts => ts && today(new Date(ts)) === today();

/* слабые темы задач: худший процент при 3+ попытках */
export function weakThemes(n = 3) {
  return Object.entries(S.puzzles.themes)
    .filter(([t, s]) => THEMES[t] && s[1] >= 3 && !["crushing", "middlegame", "opening", "endgame", "oneMove", "short", "long", "veryLong"].includes(t))
    .map(([t, s]) => ({ t, ok: s[0], n: s[1], pct: s[0] / s[1] }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, n);
}

function planTheme() {
  if (S.plan.date === today() && S.plan.theme) return S.plan.theme;
  const weak = weakThemes(1)[0];
  const pool = ["fork", "pin", "mateIn2", "skewer", "discoveredAttack", "hangingPiece", "mateIn1", "backRankMate"].filter(t => themeCount(t) >= 5);
  const t = weak && themeCount(weak.t) >= 5 ? weak.t : pool[(new Date().getDate()) % Math.max(1, pool.length)] || "crushing";
  S.plan = { date: today(), theme: t, done: S.plan.date === today() ? S.plan.done : {} };
  save();
  return t;
}

export function todayPlan() {
  const d = today();
  const theme = planTheme();
  const dp = dailyPuzzle();
  const themeToday = S.puzzles.history.filter(h => isToday(h.ts) && puzzleById(h.id)?.themes.includes(theme)).length;
  const les = nextLesson();
  const a = S.activity[d] || {};
  const reviewed = S.games.some(g => g.review && isToday(g.review.ts));
  const lessonToday = Object.values(S.lessons.done).some(isToday) || (a.lessons || 0) > 0;
  const bot = suggestBot();
  const steps = [
    { id: "daily", i: "📅", t: "Задача дня", s: "Разминка для головы", go: "puzzle/daily", done: !!(dp && S.puzzles.daily[dp.date]) },
    { id: "theme", i: "🧩", t: `5 задач: ${THEMES[theme]?.[0] || theme}`, s: `Решено сегодня: ${Math.min(5, themeToday)}/5`, go: "puzzle/theme/" + theme, done: themeToday >= 5 },
    { id: "lesson", i: "🎓", t: les ? les.title : "Повторить дебют", s: les ? "Урок из программы" : "Тренажёр дебютов", go: les ? les.route : "openings", done: lessonToday },
    { id: "game", i: bot.av, t: `Партия с ботом «${bot.name}»`, s: `Рейтинг ${bot.elo} · тренер подсказывает`, go: "bots", done: (a.games || 0) > 0 },
    { id: "review", i: "🔍", t: "Разбор партии", s: "Найдите свои ошибки", go: S.games[0] && !S.games[0].review ? "review/" + S.games[0].id : "history", done: reviewed },
  ];
  if (steps.every(s => s.done)) unlock("plan-1");
  return steps;
}

/* статистика по разобранным партиям */
function gamesStats() {
  const list = S.games.filter(g => g.review && g.user).slice(0, 15);
  const phase = { opening: [], middlegame: [], endgame: [] };
  let blunders = 0, mistakes = 0, misses = 0, moves = 0;
  for (const g of list) {
    const mv = g.moves.split(" ");
    const c = makeChess(g.startFen);
    for (let i = 0; i < mv.length; i++) {
      const mover = c.turn();
      const fen = c.fen();
      if (!playUci(c, mv[i])) break;
      if (mover !== g.user) continue;
      const k = unpackCls(g.review.cls[i]);
      moves++;
      if (k === "blunder") blunders++;
      if (k === "mistake") mistakes++;
      if (k === "miss") misses++;
      // точность хода приблизительно по классу
      const acc = { brilliant: 100, great: 100, best: 100, excellent: 95, good: 85, book: 100, forced: 100, inaccuracy: 70, mistake: 45, miss: 40, blunder: 20 }[k] ?? 80;
      phase[phaseOf(fen, i)].push(acc);
    }
  }
  const avg = a => a.length >= 5 ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null;
  const all = S.games.filter(g => g.user).slice(0, 30);
  const lostOnTime = all.filter(g => resultFor(g).k === "loss" && /время/.test(g.reason || "")).length;
  return { n: list.length, moves, blunders, mistakes, misses, phase: { opening: avg(phase.opening), middlegame: avg(phase.middlegame), endgame: avg(phase.endgame) }, lostOnTime, total: all.length };
}

export function levelEstimate() {
  const beaten = BOTS.filter(b => S.bots.beaten[b.id]).map(b => b.elo);
  const bestBot = beaten.length ? Math.max(...beaten) : 0;
  const pr = S.ratings.puzzle.n >= 10 ? S.ratings.puzzle.r - 150 : null;
  const est = Math.max(bestBot, pr || 0) || ({ new: 300, beginner: 600, casual: 1000, club: 1500 }[S.profile.level] || 600);
  return Math.round(est / 50) * 50;
}

function bar(label, v, hint) {
  if (v == null) return `<div class="row" style="justify-content:space-between"><span class="small">${label}</span><span class="small dim">мало данных</span></div>`;
  const col = v >= 80 ? "var(--green)" : v >= 60 ? "var(--amber)" : "var(--red)";
  return `<div><div class="row" style="justify-content:space-between"><span class="small">${label}</span><span class="small b">${v}%</span></div>
    <div class="bar"><i style="width:${v}%;background:${col}"></i></div>${hint ? `<div class="tiny muted" style="margin-top:2px">${hint}</div>` : ""}</div>`;
}

export function viewCoach(el) {
  const plan = todayPlan();
  const done = plan.filter(p => p.done).length;
  const weak = weakThemes(3);
  const gs = gamesStats();
  const lvl = levelEstimate();
  const advice = [];
  if (gs.n && gs.blunders / Math.max(1, gs.n) >= 1.5) advice.push({ t: "Вы часто зеваете фигуры. Перед каждым ходом проверяйте, что атакует соперник.", go: "lesson/hanging", b: "Урок «Висящие фигуры»" });
  if (gs.phase.opening != null && gs.phase.opening < 75) advice.push({ t: "Дебют — слабое место. Выучите одну систему за белых и одну за чёрных.", go: "openings", b: "Дебюты" });
  if (gs.phase.endgame != null && gs.phase.endgame < 70) advice.push({ t: "В эндшпиле теряются очки. Пройдите оппозицию и правило квадрата.", go: "practice/opposition", b: "Эндшпиль" });
  if (gs.lostOnTime >= 2) advice.push({ t: `${gs.lostOnTime} ${plural(gs.lostOnTime, "партия проиграна", "партии проиграны", "партий проиграно")} по времени. Играйте с добавлением (3 | 2, 15 | 10).`, go: "bots", b: "Играть" });
  if (weak[0]) advice.push({ t: `Слабая тема задач — «${THEMES[weak[0].t][0]}» (${Math.round(weak[0].pct * 100)}%).`, go: "puzzle/theme/" + weak[0].t, b: "Тренировать" });
  if (!advice.length) advice.push({ t: S.games.length ? "Явных слабостей пока не видно. Разбирайте партии — тренер будет точнее." : "Сыграйте пару партий с ботом и разберите их — я подскажу, что тренировать.", go: "bots", b: "Играть" });

  el.innerHTML = `<div class="topbar"><h1>Тренер</h1></div>
    <div class="hero"><div class="hi">🧑‍🏫</div><div style="flex:1;min-width:0">
      <h1>${done === plan.length ? "План выполнен! 🎉" : `План на сегодня: ${done}/${plan.length}`}</h1>
      <div class="small muted">Ваш уровень ≈ <b style="color:var(--text)">${lvl}</b> · 🔥 ${streakDays()} ${plural(streakDays(), "день", "дня", "дней")} подряд</div></div></div>
    <div class="play" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);margin-top:12px">
      <div>
        <div class="card plan"><h2>📋 План на день</h2>
          ${plan.map(p => `<button class="step ${p.done ? "done" : ""}" data-go="${p.go}"><div class="ck">${p.done ? "✓" : ""}</div><div style="font-size:22px">${p.i}</div><div style="flex:1;min-width:0"><div class="st b">${esc(p.t)}</div><div class="tiny muted">${esc(p.s)}</div></div></button>`).join("")}
        </div>
        <div class="card"><h2>💡 Советы</h2>
          ${advice.map(a => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div class="small">${esc(a.t)}</div><button class="btn sm" style="margin-top:6px" data-go="${a.go}">${esc(a.b)}</button></div>`).join("")}
        </div>
      </div>
      <div>
        <div class="card"><h2>📊 Сильные и слабые стороны</h2>
          <div class="col" style="gap:10px">
            <div class="row" style="justify-content:space-between"><span class="small">Тактика (рейтинг задач)</span><b>${S.ratings.puzzle.r}</b></div>
            ${bar("Дебют", gs.phase.opening, "точность ходов в первых 10 ходах")}
            ${bar("Миттельшпиль", gs.phase.middlegame)}
            ${bar("Эндшпиль", gs.phase.endgame)}
            ${gs.n ? `<div class="tiny muted">По ${gs.n} ${plural(gs.n, "разобранной партии", "разобранным партиям", "разобранным партиям")}: зевков ${gs.blunders}, ошибок ${gs.mistakes}, упущений ${gs.misses}.</div>` : `<div class="tiny muted">Разберите хотя бы одну партию, чтобы увидеть оценку по фазам.</div>`}
            ${weak.length ? `<div class="sec-title" style="margin:6px 0 0">Темы, которые даются труднее</div>${weak.map(w => bar(THEMES[w.t][0], Math.round(w.pct * 100), `${w.ok} из ${w.n}`)).join("")}` : ""}
          </div>
        </div>
        <div class="card" id="aiCard"></div>
      </div>
    </div>`;
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
  drawChat($("#aiCard", el));
}

/* ---------- ИИ-тренер: свободный разговор ---------- */
function studentProfile() {
  const gs = gamesStats();
  const weak = weakThemes(3).map(w => `${THEMES[w.t][0]} (${Math.round(w.pct * 100)}%)`).join(", ");
  const recent = S.games.filter(g => g.user).slice(0, 5).map(g => {
    const opp = g.user === "w" ? g.black : g.white;
    return `${resultFor(g).k === "win" ? "победа" : resultFor(g).k === "loss" ? "поражение" : "ничья"} против ${opp.name}${opp.rating ? " (" + opp.rating + ")" : ""}${g.opening ? ", " + openingRu(g.opening).ru : ""}${g.review ? ", точность " + g.review.acc[g.user] + "%" : ""}`;
  }).join("; ");
  return `Профиль ученика (данные приложения):
- Имя: ${S.profile.name || "—"}; примерный уровень: ${levelEstimate()} Эло; рейтинг в задачах ${S.ratings.puzzle.r} (решено ${S.ratings.puzzle.n}).
- Слабые темы задач: ${weak || "пока нет данных"}.
- Партии: ${S.games.length}; последние: ${recent || "нет"}.
- По разобранным партиям: зевков ${gs.blunders}, ошибок ${gs.mistakes}; точность по фазам — дебют ${gs.phase.opening ?? "?"}%, миттельшпиль ${gs.phase.middlegame ?? "?"}%, эндшпиль ${gs.phase.endgame ?? "?"}%.
- Пройдено уроков: ${Object.keys(S.lessons.done).length}.
В приложении есть: игра с ботами 250–3200, задачи по темам, «Штурм», уроки (основы, тактика, техника мата, эндшпиль), тренажёр дебютов, разбор партий. Советуя, ссылайся на эти разделы.`;
}

function drawChat(box) {
  if (!aiKey()) {
    box.innerHTML = `<h2>🤖 ИИ-тренер</h2>
      <p class="small muted" style="margin:0 0 10px">Спросите что угодно: как перестать зевать, какой дебют выбрать, как играть позицию. Тренер видит вашу статистику и даёт советы под ваш уровень. Работает на Claude — нужен свой ключ API.</p>
      <button class="btn primary block" id="aiSet">Подключить ИИ-тренера</button>`;
    $("#aiSet", box).onclick = () => aiKeyHelp(() => drawChat(box));
    return;
  }
  const chat = S.coach.chat;
  box.innerHTML = `<div class="row"><h2 style="flex:1;margin:0">🤖 ИИ-тренер</h2><button class="btn sm ghost" id="aiClr">Очистить</button></div>
    <div class="chat" id="aiList" style="max-height:380px;overflow:auto;padding:10px 0">${chat.length ? "" : `<div class="msg sys">Задайте вопрос — например, нажмите на подсказку ниже.</div>`}</div>
    <div class="chips" id="aiQuick" style="margin-bottom:8px">${["Как перестать зевать фигуры?", "Какой дебют мне выучить?", "Составь план занятий на неделю", "Разбери мою последнюю партию"].map(q => `<button class="chip sm">${q}</button>`).join("")}</div>
    <div class="row"><input type="text" id="aiIn" placeholder="Ваш вопрос…" maxlength="1000"><button class="btn primary" id="aiGo">➤</button></div>`;
  const list = $("#aiList", box);
  const add = (who, html) => { const d = document.createElement("div"); d.className = "msg " + (who === "me" ? "me" : ""); d.innerHTML = html; list.appendChild(d); list.scrollTop = list.scrollHeight; return d; };
  for (const m of chat) add(m.role === "user" ? "me" : "ai", m.role === "user" ? esc(m.content) : aiHtml(m.content));
  let busy = false;
  const send = async text => {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    $("#aiGo", box).disabled = true;
    let content = text;
    if (/последн\w* парти/i.test(text)) content += "\n\n" + lastGameBrief();
    add("me", esc(text));
    const out = add("ai", `<span class="muted">думает…</span>`);
    const msgs = [...chat.map(m => ({ role: m.role, content: m.content })), { role: "user", content }];
    try {
      const answer = await aiAsk({ system: COACH_SYSTEM + "\n\n" + studentProfile(), messages: msgs, effort: "low", onText: t => { out.innerHTML = aiHtml(t); list.scrollTop = list.scrollHeight; } });
      chat.push({ role: "user", content }, { role: "assistant", content: answer });
      if (chat.length > 30) chat.splice(0, chat.length - 30);
      save();
    } catch (e) {
      out.innerHTML = `<span class="red">${esc(aiError(e))}</span>`;
    }
    busy = false;
    $("#aiGo", box).disabled = false;
  };
  $("#aiGo", box).onclick = () => { const v = $("#aiIn", box).value; $("#aiIn", box).value = ""; send(v); };
  $("#aiIn", box).onkeydown = e => { if (e.key === "Enter") $("#aiGo", box).click(); };
  $$("#aiQuick .chip", box).forEach(b => b.onclick = () => send(b.textContent));
  $("#aiClr", box).onclick = () => { S.coach.chat = []; save(); drawChat(box); };
}

function lastGameBrief() {
  const g = S.games.find(x => x.user);
  if (!g) return "(Партий ещё нет.)";
  const mv = g.moves.split(" ");
  const c = makeChess(g.startFen);
  const sans = [];
  for (const u of mv) { const m = playUci(c, u); if (!m) break; sans.push(m.san); }
  let txt = `Последняя партия: ${g.white.name} — ${g.black.name}, ${g.result} (${g.reason}). Ученик играл ${g.user === "w" ? "белыми" : "чёрными"}.\nХоды: ${sans.map((s, i) => (i % 2 === 0 ? (i / 2 + 1) + ". " : "") + s).join(" ")}`;
  if (g.review) {
    const bad = g.review.cls.split("").map((k, i) => ({ k: unpackCls(k), i })).filter(x => ["mistake", "blunder", "miss"].includes(x.k));
    txt += `\nОценки движка: точность белых ${g.review.acc.w}%, чёрных ${g.review.acc.b}%. Ошибки: ${bad.map(b => `ход ${Math.floor(b.i / 2) + 1}${b.i % 2 ? "..." : "."} ${sans[b.i]} (${b.k})`).join(", ") || "нет"}.`;
  } else txt += "\n(Партия не разобрана движком — опирайся на общие принципы.)";
  return txt;
}
