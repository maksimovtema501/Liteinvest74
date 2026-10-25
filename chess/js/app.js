/* «Шахматы»: каркас приложения, навигация, главная и первый запуск. */
import { $, $$, esc, modal, plural } from "./util.js";
import { S, save, streakDays, checkStreakAch } from "./store.js";
import { route, render, setNavHook, go } from "./router.js";
import { miniBoard } from "./board.js";
import { viewPlayHub, viewBots, viewGame, viewLocal, resumeSaved, suggestBot } from "./play.js";
import { viewPuzzles, viewPuzzle, viewRush, dailyPuzzle } from "./puzzles.js";
import { viewLearn, viewLesson, viewBasics, viewOpenings, viewOpening, viewPractice, nextLesson, viewMethods } from "./learn.js";
import { viewLecture } from "./lectures.js";
import { viewSrs, dueCount } from "./srs.js";
import { viewTrainers, viewTrainer } from "./trainers.js";
import { viewAnalysis, viewReview } from "./analysis.js";
import { viewCoach, todayPlan } from "./coach.js";
import { viewOnline } from "./online.js";
import { viewProfile, viewHistory, viewSettings, applyTheme, gameRow, AVATARS } from "./profile.js";

const NAV = [
  ["home", "🏠", "Главная"], ["play", "♟", "Играть"], ["puzzles", "🧩", "Задачи"],
  ["learn", "🎓", "Обучение"], ["coach", "🧑‍🏫", "Тренер"],
];
const SIDE_EXTRA = [["analysis", "🔬", "Анализ"], ["profile", "👤", "Профиль"], ["settings", "⚙️", "Настройки"]];
const GROUP = {
  home: "home", play: "play", bots: "play", local: "play", online: "play", game: "play", history: "play", review: "play",
  puzzles: "puzzles", puzzle: "puzzles", rush: "puzzles",
  learn: "learn", lesson: "learn", basics: "learn", openings: "learn", opening: "learn", practice: "learn",
  lecture: "learn", srs: "learn", trainers: "learn", trainer: "learn", methods: "learn",
  coach: "coach", analysis: "analysis", profile: "profile", settings: "settings",
};

function buildNav() {
  $("#side").innerHTML = `<div class="logo"><span>♞</span>Шахматы</div>` +
    NAV.map(([k, i, t]) => `<button data-n="${k}"><span class="ico">${i}</span>${t}</button>`).join("") +
    `<div class="grow"></div>` +
    SIDE_EXTRA.map(([k, i, t]) => `<button data-n="${k}"><span class="ico">${i}</span>${t}</button>`).join("");
  $("#nav").innerHTML = NAV.map(([k, i, t]) => `<button data-n="${k}"><span class="ico">${i}</span>${t}</button>`).join("");
  $$("[data-n]").forEach(b => b.onclick = () => go(b.dataset.n));
  setNavHook(name => {
    const g = GROUP[name] || "home";
    $$("[data-n]").forEach(b => b.classList.toggle("on", b.dataset.n === g));
  });
}

/* --- главная --- */
function viewHome(el) {
  const name = S.profile.name || "друг";
  const streak = streakDays();
  const plan = todayPlan();
  const done = plan.filter(p => p.done).length;
  const daily = dailyPuzzle();
  const bot = suggestBot();
  const les = nextLesson();
  const due = dueCount();
  const r = S.ratings;
  el.innerHTML = `
    <div class="topbar mob-only"><h1>♞ Шахматы</h1><div class="sp"></div>
      <button class="iconbtn" data-go="analysis" title="Анализ">🔬</button>
      <button class="iconbtn" data-go="profile" title="Профиль" style="font-size:22px">${S.profile.avatar}</button></div>
    <div class="hero">
      <div class="hi">${S.profile.avatar}</div>
      <div style="flex:1;min-width:0">
        <h1>Привет, ${esc(name)}!</h1>
        <div class="muted small">${streak ? `🔥 ${streak} ${plural(streak, "день", "дня", "дней")} подряд` : "Сегодня отличный день для шахмат"} · 🧩 ${r.puzzle.r}</div>
      </div>
    </div>
    ${S.current ? `<div class="card" style="margin-top:12px;display:flex;align-items:center;gap:12px">
      <div style="font-size:28px">⏸</div><div style="flex:1;min-width:0"><div class="b">Незаконченная партия</div>
      <div class="small muted">${esc(S.current.cfg.white.name)} — ${esc(S.current.cfg.black.name)}</div></div>
      <button class="btn primary" id="resume">Продолжить</button></div>` : ""}
    <div class="grid2" style="margin-top:12px">
      <button class="btn primary big" data-go="bots">♟ Играть</button>
      <button class="btn big" data-go="online">🌐 Онлайн</button>
    </div>
    <div class="sec-title">Сегодня</div>
    <div class="tiles">
      <button class="tile" data-go="coach"><div class="ti">🧑‍🏫</div><div style="flex:1"><div class="tt">План тренера</div>
        <div class="ts">${done}/${plan.length} выполнено</div><div class="bar" style="margin-top:6px"><i style="width:${done / plan.length * 100}%"></i></div></div></button>
      <button class="tile" data-go="puzzle/daily"><div style="width:64px;flex-shrink:0">${daily ? miniBoard(daily.fen, S.settings.pieces, daily.fen.split(" ")[1] === "w") : ""}</div>
        <div><div class="tt">Задача дня</div><div class="ts">${S.puzzles.daily[daily?.date]?.solved ? "✅ Решена" : `Рейтинг ${daily ? daily.rating : ""}`}</div></div></button>
      ${due ? `<button class="tile" data-go="srs" style="background:linear-gradient(135deg,#3b5a24,#262421 80%)"><div class="ti">🔁</div><div><div class="tt">Повторение</div><div class="ts">${due} ${plural(due, "позиция ждёт", "позиции ждут", "позиций ждут")} повторения</div></div></button>` : ""}
      <button class="tile" data-go="${les ? les.route : "learn"}"><div class="ti">🎓</div><div><div class="tt">${les ? esc(les.title) : "Обучение"}</div><div class="ts">${les ? (les.lecture ? "Следующая лекция" : "Следующий урок") : "Учебный план пройден!"}</div></div></button>
      <button class="tile" data-go="bots"><div class="ti">${bot.av}</div><div><div class="tt">Соперник по силе</div><div class="ts">${esc(bot.name)} · ${bot.elo}</div></div></button>
    </div>
    <div class="sec-title">Тренировка</div>
    <div class="tiles">
      <button class="tile" data-go="puzzle/rated"><div class="ti">🧩</div><div><div class="tt">Задачи</div><div class="ts">Рейтинг ${r.puzzle.r}</div></div></button>
      <button class="tile" data-go="rush"><div class="ti">🏃</div><div><div class="tt">Штурм</div><div class="ts">Рекорд ${Math.max(S.rush.best.r3, S.rush.best.r5, S.rush.best.surv)}</div></div></button>
      <button class="tile" data-go="trainers"><div class="ti">🏋️</div><div><div class="tt">Тренажёры</div><div class="ts">Координаты, память, мотивы, визуализация</div></div></button>
      <button class="tile" data-go="openings"><div class="ti">📖</div><div><div class="tt">Дебюты</div><div class="ts">Изучить и потренировать</div></div></button>
      <button class="tile" data-go="analysis"><div class="ti">🔬</div><div><div class="tt">Анализ</div><div class="ts">Доска с движком</div></div></button>
    </div>
    ${S.games.length ? `<div class="sec-title">Последние партии</div><div class="col">${S.games.slice(0, 3).map(gameRow).join("")}</div>` : ""}`;
  $$("[data-go]", el).forEach(b => b.onclick = () => go(b.dataset.go));
  $$("[data-g]", el).forEach(b => b.onclick = () => go("review/" + b.dataset.g));
  $("#resume", el)?.addEventListener("click", resumeSaved);
}

/* --- первый запуск --- */
function onboarding() {
  let av = S.profile.avatar || "🙂", level = "beginner";
  const m = modal(`<div style="text-align:center;font-size:48px">♞</div>
    <h2 style="text-align:center">Добро пожаловать!</h2>
    <p class="muted small" style="text-align:center;margin:0 0 14px">Играйте с ботами и друзьями, решайте задачи, учитесь с тренером. Всё работает без интернета.</p>
    <div class="small muted">Как вас зовут?</div>
    <input type="text" id="obName" maxlength="24" placeholder="Имя">
    <div class="small muted" style="margin-top:12px">Аватар</div>
    <div class="palette" style="grid-template-columns:repeat(8,1fr);margin-top:4px">${AVATARS.map(a => `<button data-a="${a}" class="${a === av ? "on" : ""}" style="font-size:22px">${a}</button>`).join("")}</div>
    <div class="small muted" style="margin-top:12px">Как вы играете?</div>
    <div class="col" style="gap:6px;margin-top:4px" id="obLvl">
      ${[["new", "🐣 Только учусь ходить"], ["beginner", "🙂 Знаю правила"], ["casual", "😎 Играю иногда"], ["club", "🏆 Играю в клубе, 1500+"]]
        .map(([k, t]) => `<button class="chip ${k === level ? "on" : ""}" data-l="${k}" style="text-align:left">${t}</button>`).join("")}
    </div>
    <button class="btn primary big block" id="obGo" style="margin-top:16px">Начать</button>`, { dismiss: false });
  $$("[data-a]", m).forEach(b => b.onclick = () => { av = b.dataset.a; $$("[data-a]", m).forEach(x => x.classList.toggle("on", x === b)); });
  $$("[data-l]", m).forEach(b => b.onclick = () => { level = b.dataset.l; $$("[data-l]", m).forEach(x => x.classList.toggle("on", x === b)); });
  $("#obGo", m).onclick = () => {
    S.profile.name = $("#obName", m).value.trim() || "Игрок";
    S.profile.avatar = av;
    S.profile.level = level;
    const start = { new: 500, beginner: 800, casual: 1100, club: 1500 }[level];
    S.ratings.puzzle = { r: start, n: 0, best: start };
    save(true);
    m.close();
    if (level === "new") go("learn"); else render();
  };
}

route("home", viewHome);
route("play", viewPlayHub);
route("bots", viewBots);
route("local", viewLocal);
route("game", viewGame);
route("online", viewOnline);
route("puzzles", viewPuzzles);
route("puzzle", viewPuzzle);
route("rush", viewRush);
route("learn", viewLearn);
route("lesson", viewLesson);
route("basics", viewBasics);
route("openings", viewOpenings);
route("opening", viewOpening);
route("practice", viewPractice);
route("lecture", viewLecture);
route("srs", viewSrs);
route("trainers", viewTrainers);
route("trainer", viewTrainer);
route("methods", viewMethods);
route("analysis", viewAnalysis);
route("review", viewReview);
route("coach", viewCoach);
route("profile", viewProfile);
route("history", viewHistory);
route("settings", viewSettings);

applyTheme();
buildNav();
render();
checkStreakAch();
if (!S.profile.name) onboarding();
