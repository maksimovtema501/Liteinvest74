/* Профиль: рейтинги, статистика, достижения, история партий и настройки. */
import { $, $$, esc, modal, toast, confirmBox, plural, today, fmtDate, downloadText } from "./util.js";
import { S, save, ACHIEVEMENTS, streakDays, resetAll, exportData, importData } from "./store.js";
import { go } from "./router.js";
import { setNotation, openingRu } from "./chessutil.js";
import { tcName } from "./play.js";
import { aiKey, setAiKey, aiKeyHelp } from "./ai.js";

export const BOARD_THEMES = {
  green: ["Зелёная", "#ebecd0", "#739552"],
  brown: ["Дерево", "#f0d9b5", "#b58863"],
  blue: ["Синяя", "#dee3e6", "#8ca2ad"],
  purple: ["Фиолетовая", "#e9e4f5", "#8f7cc0"],
  gray: ["Серая", "#dcdcdc", "#a0a0a0"],
  coral: ["Коралл", "#f3dfd2", "#d08a73"],
};
export const PIECE_SETS = { cburnett: "Классика", merida: "Мерида", chessnut: "Каштан" };
export const AVATARS = ["🙂", "😎", "🦊", "🐼", "🐯", "🦁", "🐸", "🐙", "🦄", "🐲", "👾", "🤠", "🧙", "🦸", "🐺", "🦉"];

export function applyTheme() {
  const t = BOARD_THEMES[S.settings.board] || BOARD_THEMES.green;
  document.documentElement.style.setProperty("--sq-light", t[1]);
  document.documentElement.style.setProperty("--sq-dark", t[2]);
  setNotation(S.settings.notation || "ru");
}

export function resultFor(g) {
  if (g.result === "1/2-1/2") return { k: "draw", t: "½", c: "muted" };
  if (!g.user || (g.result !== "1-0" && g.result !== "0-1")) return { k: "none", t: g.result, c: "muted" };
  const win = (g.result === "1-0") === (g.user === "w");
  return win ? { k: "win", t: "+", c: "green" } : { k: "loss", t: "−", c: "red" };
}

export function gameRow(g) {
  const r = resultFor(g);
  const opp = g.user === "b" ? g.white : g.user === "w" ? g.black : null;
  const n = g.moves ? Math.ceil(g.moves.split(" ").length / 2) : 0;
  const acc = g.review && g.user ? g.review.acc[g.user] : null;
  return `<button class="tile" data-g="${g.id}">
    <div class="ti" style="font-size:24px">${opp ? opp.av : "👥"}</div>
    <div style="min-width:0;flex:1"><div class="tt">${opp ? esc(opp.name) + (opp.rating ? ` <span class="dim">(${opp.rating})</span>` : "") : esc(g.white.name) + " — " + esc(g.black.name)}</div>
    <div class="ts">${{ bot: "🤖", online: "🌐", local: "👥" }[g.mode] || ""} ${tcName(g.tc)} · ${n} ${plural(n, "ход", "хода", "ходов")} · ${esc(g.reason || "")}${g.opening ? " · " + esc(openingRu(g.opening).ru) : ""}</div></div>
    <div class="tr"><div class="${r.c} b" style="font-size:18px">${g.result.replace("1/2-1/2", "½–½")}</div>${acc != null ? `<div class="tiny">точность ${acc}%</div>` : `<div class="tiny">${fmtDate(g.ts)}</div>`}</div>
  </button>`;
}

export function viewProfile(el) {
  const games = S.games;
  const mine = games.filter(g => g.user);
  const wins = mine.filter(g => resultFor(g).k === "win").length;
  const draws = mine.filter(g => resultFor(g).k === "draw").length;
  const losses = mine.filter(g => resultFor(g).k === "loss").length;
  const reviewed = mine.filter(g => g.review);
  const avgAcc = reviewed.length ? Math.round(reviewed.reduce((a, g) => a + (g.review.acc[g.user] || 0), 0) / reviewed.length) : null;
  const solved = Object.values(S.puzzles.done).filter(x => x[0]).length;
  const tried = Object.keys(S.puzzles.done).length;
  const r = S.ratings;
  // календарь за 12 недель
  const days = [];
  const start = new Date(); start.setDate(start.getDate() - 83 - ((start.getDay() + 6) % 7));
  for (let i = 0; i < 84 + ((new Date().getDay() + 6) % 7) + 1; i++) {
    const x = new Date(start); x.setDate(start.getDate() + i);
    const a = S.activity[today(x)];
    const score = a ? (a.min || 0) + (a.puzzles || 0) * 1.5 + (a.games || 0) * 6 + (a.lessons || 0) * 4 : 0;
    days.push(`<i class="${score >= 40 ? "l4" : score >= 20 ? "l3" : score >= 8 ? "l2" : score > 0 ? "l1" : ""}" title="${today(x)}"></i>`);
  }
  const beaten = Object.keys(S.bots.beaten).length;
  el.innerHTML = `
    <div class="topbar"><h1>Профиль</h1><div class="sp"></div><button class="iconbtn" data-go="settings">⚙️</button></div>
    <div class="hero">
      <button class="hi" id="ava" title="Сменить аватар">${S.profile.avatar}</button>
      <div style="flex:1;min-width:0"><h1>${esc(S.profile.name || "Игрок")}</h1>
      <div class="muted small">🔥 ${streakDays()} ${plural(streakDays(), "день", "дня", "дней")} подряд · с нами с ${new Date(S.profile.created).toLocaleDateString("ru-RU")}</div></div>
      <button class="btn sm" id="ren">✎</button>
    </div>
    <div class="sec-title">Рейтинги</div>
    <div class="grid3">
      <div class="stat"><div class="v">🧩 ${r.puzzle.r}</div><div class="l">Задачи · рекорд ${r.puzzle.best}</div></div>
      <div class="stat"><div class="v">⚡ ${r.blitz.r}</div><div class="l">Блиц · ${r.blitz.n} ${plural(r.blitz.n, "партия", "партии", "партий")}</div></div>
      <div class="stat"><div class="v">🐢 ${r.rapid.r}</div><div class="l">Рапид · ${r.rapid.n}</div></div>
      <div class="stat"><div class="v">🔫 ${r.bullet.r}</div><div class="l">Пуля · ${r.bullet.n}</div></div>
      <div class="stat"><div class="v">🏃 ${Math.max(S.rush.best.r3, S.rush.best.r5, S.rush.best.surv)}</div><div class="l">Штурм · лучший</div></div>
      <div class="stat"><div class="v">🤖 ${beaten}/14</div><div class="l">Боты побеждены</div></div>
    </div>
    <div class="sec-title">Статистика</div>
    <div class="card">
      <div class="grid3">
        <div><div class="b green" style="font-size:22px">${wins}</div><div class="small muted">побед</div></div>
        <div><div class="b" style="font-size:22px">${draws}</div><div class="small muted">ничьих</div></div>
        <div><div class="b red" style="font-size:22px">${losses}</div><div class="small muted">поражений</div></div>
      </div>
      ${wins + draws + losses ? `<div class="bar" style="display:flex;margin-top:10px;height:10px"><i style="width:${wins / (wins + draws + losses) * 100}%;border-radius:0"></i><i style="width:${draws / (wins + draws + losses) * 100}%;background:#888;border-radius:0"></i><i style="width:${losses / (wins + draws + losses) * 100}%;background:var(--red);border-radius:0"></i></div>` : ""}
      <div class="grid2" style="margin-top:12px">
        <div class="small muted">Средняя точность: <b style="color:var(--text)">${avgAcc != null ? avgAcc + "%" : "—"}</b></div>
        <div class="small muted">Разобрано партий: <b style="color:var(--text)">${reviewed.length}</b></div>
        <div class="small muted">Задач решено: <b style="color:var(--text)">${solved} из ${tried}</b></div>
        <div class="small muted">Уроков пройдено: <b style="color:var(--text)">${Object.keys(S.lessons.done).length}</b></div>
      </div>
    </div>
    <div class="sec-title">Занятия за 12 недель</div>
    <div class="card"><div class="heat">${days.join("")}</div></div>
    <div class="sec-title">Достижения · ${Object.keys(S.ach).length} из ${ACHIEVEMENTS.length}</div>
    <div class="ach">${ACHIEVEMENTS.map(a => `<div class="a ${S.ach[a.id] ? "got" : ""}"><div class="ai">${a.i}</div><div><div class="at">${a.t}</div><div class="as">${a.s}</div></div></div>`).join("")}</div>
    <div class="sec-title">Последние партии</div>
    <div class="col">${games.slice(0, 5).map(gameRow).join("") || `<div class="empty">Партий пока нет</div>`}</div>
    ${games.length > 5 ? `<button class="btn block ghost" style="margin-top:10px" data-go="history">Все партии (${games.length})</button>` : ""}`;
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
  $$("[data-g]", el).forEach(b => b.onclick = () => go("review/" + b.dataset.g));
  $("#ava", el).onclick = () => pickAvatar(() => viewProfile(el));
  $("#ren", el).onclick = () => {
    const m = modal(`<h2>Имя</h2><input type="text" id="nm" value="${esc(S.profile.name)}" maxlength="24">
      <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" id="ok">Сохранить</button></div>`);
    $("#ok", m).onclick = () => { S.profile.name = $("#nm", m).value.trim() || "Игрок"; save(); m.close(); viewProfile(el); };
  };
}

export function pickAvatar(done) {
  const m = modal(`<h2>Аватар</h2><div class="palette" style="grid-template-columns:repeat(8,1fr)">${AVATARS.map(a => `<button data-a="${a}" class="${a === S.profile.avatar ? "on" : ""}" style="font-size:24px">${a}</button>`).join("")}</div>`);
  $$("[data-a]", m).forEach(b => b.onclick = () => { S.profile.avatar = b.dataset.a; save(); m.close(); done && done(); });
}

export function viewHistory(el) {
  let filter = "all";
  const draw = () => {
    const list = S.games.filter(g => filter === "all" || g.mode === filter || (filter === "win" && resultFor(g).k === "win") || (filter === "loss" && resultFor(g).k === "loss"));
    el.innerHTML = `<div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Мои партии</h1><div class="sp"></div><button class="btn sm" id="exp">⬇ PGN</button></div>
      <div class="chips" style="margin-bottom:12px">${[["all", "Все"], ["bot", "🤖 Боты"], ["online", "🌐 Онлайн"], ["local", "👥 Вдвоём"], ["win", "Победы"], ["loss", "Поражения"]]
        .map(([k, t]) => `<button class="chip ${filter === k ? "on" : ""}" data-f="${k}">${t}</button>`).join("")}</div>
      <div class="col">${list.map(gameRow).join("") || `<div class="empty">Здесь появятся сыгранные партии</div>`}</div>`;
    $$("[data-f]", el).forEach(b => b.onclick = () => { filter = b.dataset.f; draw(); });
    $$("[data-g]", el).forEach(b => b.onclick = () => go("review/" + b.dataset.g));
    $("#exp", el).onclick = async () => {
      const { buildPgn } = await import("./chessutil.js");
      const all = S.games.map(g => buildPgn({ white: g.white.name, black: g.black.name, result: g.result, startFen: g.startFen, moves: g.moves ? g.moves.split(" ") : [], date: g.ts, tc: g.tc })).join("\n\n");
      downloadText("chess-games.pgn", all, "application/x-chess-pgn");
    };
  };
  draw();
}

export function viewSettings(el) {
  const st = S.settings;
  const sw = (k, t, sub = "") => `<label class="sw"><span class="lt">${t}${sub ? `<span class="ls">${sub}</span>` : ""}</span><input type="checkbox" class="toggle" data-s="${k}" ${st[k] ? "checked" : ""}></label>`;
  el.innerHTML = `
    <div class="topbar"><button class="back" onclick="history.back()">←</button><h1>Настройки</h1></div>
    <div class="play" style="grid-template-columns:minmax(0,1fr) 320px">
    <div>
      <div class="card"><h2>Доска</h2>
        <div class="chips" id="themes">${Object.entries(BOARD_THEMES).map(([k, [t, l, d]]) => `<button class="chip ${st.board === k ? "on" : ""}" data-t="${k}"><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:linear-gradient(135deg,${l} 50%,${d} 50%);vertical-align:-2px;margin-right:6px"></span>${t}</button>`).join("")}</div>
        <div class="sec-title">Фигуры</div>
        <div class="chips" id="sets">${Object.entries(PIECE_SETS).map(([k, t]) => `<button class="chip ${st.pieces === k ? "on" : ""}" data-p="${k}"><img src="pieces/${k}/wN.svg" style="width:18px;height:18px;vertical-align:-4px;margin-right:4px">${t}</button>`).join("")}</div>
        <div class="sec-title">Запись ходов</div>
        <div class="seg" id="notation">${[["ru", "Кf3 (русская)"], ["en", "Nf3"], ["fig", "♘f3"]].map(([k, t]) => `<button class="${(st.notation || "ru") === k ? "on" : ""}" data-n="${k}">${t}</button>`).join("")}</div>
      </div>
      <div class="card"><h2>Игра</h2>
        ${sw("sound", "Звук")}
        ${sw("coords", "Координаты на доске")}
        ${sw("legal", "Показывать возможные ходы")}
        ${sw("anim", "Анимация фигур")}
        ${sw("premove", "Предходы", "Можно сделать ход, пока думает соперник")}
        ${sw("autoQueen", "Сразу превращать в ферзя")}
        ${sw("confirmResign", "Спрашивать перед сдачей")}
      </div>
      <div class="card"><h2>Тренер</h2>
        <div class="seg" id="coachStyle">${[["kind", "😊 Мягкий"], ["strict", "😤 Строгий"]].map(([k, t]) => `<button class="${st.coachStyle === k ? "on" : ""}" data-c="${k}">${t}</button>`).join("")}</div>
        <div class="sec-title">Глубина разбора партий</div>
        <div class="seg" id="depth">${[[10, "Быстро"], [12, "Обычно"], [15, "Точно"], [18, "Глубоко"]].map(([k, t]) => `<button class="${st.reviewDepth === k ? "on" : ""}" data-d="${k}">${t}</button>`).join("")}</div>
        <p class="small muted" style="margin:8px 0 0">Чем глубже, тем точнее оценки, но разбор дольше: «Обычно» — около 30 секунд на партию.</p>
      </div>
    </div>
    <div>
      <div class="card"><h2>🤖 ИИ-тренер</h2>
        <p class="small muted" style="margin:0 0 8px">Подробные объяснения ходов и разговор с тренером работают через Claude. Нужен свой ключ API.</p>
        <input type="password" id="key" placeholder="sk-ant-…" value="${esc(aiKey())}">
        <div class="row" style="margin-top:8px"><button class="btn sm primary" id="saveKey">Сохранить</button><button class="btn sm ghost" id="help">Как получить ключ</button></div>
      </div>
      <div class="card"><h2>Данные</h2>
        <p class="small muted" style="margin:0 0 8px">Всё хранится только на этом устройстве. Сделайте копию, чтобы перенести на другое.</p>
        <div class="col">
          <button class="btn sm" id="exp">⬇ Сохранить копию</button>
          <button class="btn sm" id="imp">⬆ Загрузить копию</button>
          <button class="btn sm danger" id="reset">Сбросить всё</button>
        </div>
      </div>
      <p class="tiny dim" style="padding:0 6px">Движок Stockfish 18 (GPLv3), правила — chess.js (BSD), фигуры — Colin M.L. Burnett и Armando H. Marroquin (GPLv2+), Alexis Luengas (Apache 2.0), дебюты — lichess chess-openings (CC0).</p>
    </div></div>`;
  $$("[data-s]", el).forEach(i => i.onchange = () => { st[i.dataset.s] = i.checked; save(); });
  $$("[data-t]", el).forEach(b => b.onclick = () => { st.board = b.dataset.t; save(); applyTheme(); viewSettings(el); });
  $$("[data-p]", el).forEach(b => b.onclick = () => { st.pieces = b.dataset.p; save(); viewSettings(el); });
  $$("[data-n]", el).forEach(b => b.onclick = () => { st.notation = b.dataset.n; save(); applyTheme(); viewSettings(el); });
  $$("[data-c]", el).forEach(b => b.onclick = () => { st.coachStyle = b.dataset.c; save(); viewSettings(el); });
  $$("[data-d]", el).forEach(b => b.onclick = () => { st.reviewDepth = +b.dataset.d; save(); viewSettings(el); });
  $("#saveKey", el).onclick = () => { setAiKey($("#key", el).value.trim()); toast("Ключ сохранён"); };
  $("#help", el).onclick = aiKeyHelp;
  $("#exp", el).onclick = () => downloadText(`chess-backup-${today()}.json`, exportData(), "application/json");
  $("#imp", el).onclick = () => {
    const i = document.createElement("input");
    i.type = "file"; i.accept = ".json,application/json";
    i.onchange = async () => { try { importData(await i.files[0].text()); } catch (e) { toast(e.message || "Не удалось прочитать файл"); } };
    i.click();
  };
  $("#reset", el).onclick = async () => { if (await confirmBox("Удалить все партии, рейтинги и прогресс?", "Удалить")) resetAll(); };
}
