/* Хранилище: всё лежит в localStorage этого устройства, сервера нет. */
import { today, toast } from "./util.js";

const KEY = "chess-v1";

const DEFAULTS = () => ({
  v: 1,
  profile: { name: "", avatar: "🙂", created: Date.now(), level: null },
  settings: {
    board: "green", pieces: "cburnett", sound: true, coords: true, legal: true, anim: true,
    autoQueen: false, premove: true, confirmResign: true, coachStyle: "kind", evalBar: false,
    reviewDepth: 12, figurine: false,
  },
  ratings: {
    puzzle: { r: 1000, n: 0, best: 1000 },
    bullet: { r: 1200, n: 0, best: 1200 },
    blitz: { r: 1200, n: 0, best: 1200 },
    rapid: { r: 1200, n: 0, best: 1200 },
  },
  rush: { best: { r3: 0, r5: 0, surv: 0 }, runs: [] },
  games: [],
  puzzles: { done: {}, retry: [], themes: {}, daily: {}, streak: 0, bestStreak: 0, history: [] },
  lessons: { done: {}, steps: {} },
  openings: {},
  endgames: {},
  bots: { beaten: {}, played: {} },
  activity: {},
  plan: { date: "", done: {} },
  ach: {},
  coach: { chat: [] },
  lastBot: null,
  lastTc: "none",
});

function merge(base, saved) {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return saved ?? base;
  const out = { ...base };
  for (const k of Object.keys(saved)) {
    out[k] = base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) ? merge(base[k], saved[k]) : saved[k];
  }
  return out;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return merge(DEFAULTS(), JSON.parse(raw));
  } catch {}
  return DEFAULTS();
}

export const S = load();

let saveTimer = 0;
export function save(now = false) {
  clearTimeout(saveTimer);
  const doSave = () => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch {
      // место кончилось — выкидываем разборы старых партий
      S.games.slice(60).forEach(g => { delete g.review; });
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {}
    }
  };
  if (now) doSave(); else saveTimer = setTimeout(doSave, 150);
}
addEventListener("pagehide", () => save(true));
addEventListener("visibilitychange", () => { if (document.hidden) save(true); });

export function resetAll() {
  localStorage.removeItem(KEY);
  location.reload();
}
export function exportData() { return JSON.stringify(S); }
export function importData(text) {
  const d = JSON.parse(text);
  if (!d || d.v !== 1) throw new Error("Это не копия данных «Шахмат»");
  localStorage.setItem(KEY, JSON.stringify(d));
  location.reload();
}

/* --- активность по дням: минуты, задачи, партии --- */
export function activity(field, n = 1) {
  const d = today();
  const a = S.activity[d] || (S.activity[d] = { min: 0, puzzles: 0, games: 0, lessons: 0 });
  a[field] = (a[field] || 0) + n;
  save();
}
export function streakDays() {
  let n = 0;
  const d = new Date();
  // сегодняшний день ещё может быть впереди — серия не рвётся до полуночи
  if (!busy(today(d))) d.setDate(d.getDate() - 1);
  while (busy(today(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function busy(day) {
  const a = S.activity[day];
  return !!a && (a.puzzles > 0 || a.games > 0 || a.lessons > 0 || a.min >= 5);
}

/* учёт времени занятий: тикает, пока экран тренировки открыт и виден */
let activeKind = null;
setInterval(() => {
  if (activeKind && !document.hidden) activity("min", 0.5);
}, 30000);
export function setActive(kind) { activeKind = kind; }

/* --- достижения --- */
export const ACHIEVEMENTS = [
  { id: "first-game", i: "♟", t: "Первая партия", s: "Сыграть партию до конца" },
  { id: "first-win", i: "🏆", t: "Первая победа", s: "Выиграть любую партию" },
  { id: "mate-knight", i: "🐴", t: "Конём по голове", s: "Поставить мат конём" },
  { id: "mate-pawn", i: "👣", t: "Пешка-убийца", s: "Поставить мат пешкой" },
  { id: "beat-1000", i: "🥉", t: "Победа над 1000", s: "Обыграть бота с рейтингом 1000+" },
  { id: "beat-1600", i: "🥈", t: "Победа над 1600", s: "Обыграть бота с рейтингом 1600+" },
  { id: "beat-2200", i: "🥇", t: "Победа над мастером", s: "Обыграть бота с рейтингом 2200+" },
  { id: "brilliant", i: "💎", t: "Блестяще!", s: "Найти блестящий ход в партии" },
  { id: "acc-90", i: "🎯", t: "Снайпер", s: "Точность 90%+ в партии от 20 ходов" },
  { id: "review-1", i: "🔍", t: "Работа над собой", s: "Разобрать партию" },
  { id: "pz-10", i: "🧩", t: "Решатель", s: "Решить 10 задач" },
  { id: "pz-100", i: "🧠", t: "Тактик", s: "Решить 100 задач" },
  { id: "pz-1500", i: "⚡", t: "Рейтинг 1500", s: "Набрать 1500 в задачах" },
  { id: "pz-2000", i: "🔥", t: "Рейтинг 2000", s: "Набрать 2000 в задачах" },
  { id: "streak-5", i: "📈", t: "Пять подряд", s: "Решить 5 задач подряд без ошибок" },
  { id: "rush-15", i: "🏃", t: "Штурмовик", s: "Решить 15+ задач в штурме" },
  { id: "rush-30", i: "🚀", t: "Ураган", s: "Решить 30+ задач в штурме" },
  { id: "lesson-1", i: "🎓", t: "Ученик", s: "Пройти первый урок" },
  { id: "lessons-10", i: "📚", t: "Отличник", s: "Пройти 10 уроков" },
  { id: "opening-1", i: "📖", t: "Дебютант", s: "Выучить вариант дебюта" },
  { id: "endgame-1", i: "🏁", t: "Техника", s: "Пройти позицию эндшпиля" },
  { id: "online-1", i: "🌐", t: "По сети", s: "Сыграть партию онлайн" },
  { id: "days-3", i: "📅", t: "Три дня подряд", s: "Заниматься 3 дня подряд" },
  { id: "days-7", i: "🗓", t: "Неделя без пропусков", s: "Заниматься 7 дней подряд" },
  { id: "days-30", i: "👑", t: "Месяц без пропусков", s: "Заниматься 30 дней подряд" },
  { id: "plan-1", i: "✅", t: "План выполнен", s: "Выполнить план тренера на день" },
];
export function unlock(id) {
  if (S.ach[id]) return;
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if (!a) return;
  S.ach[id] = Date.now();
  save();
  setTimeout(() => toast(`${a.i} Достижение: ${a.t}`, 3200), 600);
}
export function checkStreakAch() {
  const n = streakDays();
  if (n >= 3) unlock("days-3");
  if (n >= 7) unlock("days-7");
  if (n >= 30) unlock("days-30");
}

/* --- рейтинги: Эло с K, убывающим по числу партий --- */
export function eloUpdate(slot, oppRating, score) {
  const r = S.ratings[slot];
  const K = r.n < 10 ? 40 : r.n < 30 ? 28 : 20;
  const exp = 1 / (1 + Math.pow(10, (oppRating - r.r) / 400));
  const delta = Math.round(K * (score - exp));
  r.r = Math.max(100, r.r + delta);
  r.n++;
  r.best = Math.max(r.best || 0, r.r);
  save();
  return delta;
}
export function tcSlot(tc) {
  if (!tc || tc === "none") return null;
  const [m, inc] = tc.split("+").map(Number);
  const est = m * 60 + 40 * inc;
  return est < 180 ? "bullet" : est < 600 ? "blitz" : "rapid";
}
