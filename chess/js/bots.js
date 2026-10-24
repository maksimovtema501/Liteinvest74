/* Боты с характером. Сильные (1500+) — Stockfish с ограничением силы
   (UCI_Elo). Слабые — свой выбор хода: движок даёт несколько кандидатов,
   бот выбирает «по-человечески» (софтмакс по оценке) и иногда зевает.
   У каждого — любимые дебюты и реплики в чате. */
import { engine } from "./engine.js";
import { makeChess, bookMoves, playUci } from "./chessutil.js";
import { scoreOf, VAL, sleep } from "./util.js";

export const BOTS = [
  { id: "chick", name: "Цыпа", av: "🐣", elo: 250, style: "Только научилась ходить. Любит хватать всё подряд.",
    hi: "Пи-пи! Я умею ходить всеми фигурами. Почти.", win: "Ой, я выиграла?!", lose: "Пи… Ты сильный! Давай ещё?", cap: ["Ням!", "Моё!"], book: [] },
  { id: "murka", name: "Мурка", av: "🐱", elo: 400, style: "Играет лапой, но иногда царапается.",
    hi: "Мур. Посмотрим, кто кого.", win: "Мяу! Победа за мной.", lose: "Фрр… В следующий раз поймаю.", cap: ["Цап!", "Мур-р"], book: ["e2e4 e7e5"] },
  { id: "petya", name: "Петя", av: "🧒", elo: 600, style: "Школьник, ходит в кружок. Обожает атаковать ферзём.",
    hi: "Привет! Я на прошлой неделе выиграл у папы!", win: "Ура! Расскажу в кружке!", lose: "Эх… Хорошо сыграл.", cap: ["Есть!", "Опа!"], book: ["e2e4 e7e5 d1h5", "e2e4 e7e5 f1c4"] },
  { id: "valya", name: "Бабушка Валя", av: "👵", elo: 800, style: "Играет с 1965 года. Не спешит и не прощает зевков.",
    hi: "Здравствуй, внучок. Не торопись, подумай.", win: "Ничего, ещё научишься. Пирожок будешь?", lose: "Ох, молодец какой! Порадовал бабушку.", cap: ["Вот и съела.", "Ай-ай, зевнул."], book: ["e2e4 e7e5 g1f3 b8c6 f1c4", "d2d4 d7d5"] },
  { id: "misha", name: "Дядя Миша", av: "🎣", elo: 1000, style: "Рыбак и любитель гамбитов. Рискует ради атаки.",
    hi: "Ну что, кто первый клюнет?", win: "Попалась рыбка!", lose: "Сорвалась… Ладно, твоя взяла.", cap: ["Клюёт!", "Подсёк!"], book: ["e2e4 e7e5 f2f4", "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 b2b4", "d2d4 d7d5 e2e4"] },
  { id: "olga", name: "Ольга Николаевна", av: "👩‍🏫", elo: 1200, style: "Учительница. Играет правильно: центр, развитие, рокировка.",
    hi: "Здравствуйте! Начнём урок. Помните про центр.", win: "Неплохо, но есть над чем поработать.", lose: "Отлично! Пять с плюсом.", cap: ["Обратите внимание.", "Фигура без защиты."], book: ["e2e4 e7e5 g1f3 b8c6 f1c4 g8f6", "d2d4 g8f6 c2c4 e7e6", "e2e4 c7c6"] },
  { id: "artem", name: "Артём", av: "🧑‍💻", elo: 1400, style: "Айтишник. Сицилианка и острые варианты.",
    hi: "Запускаю партию… Удачи!", win: "GG. Всё по алгоритму.", lose: "Баг в моей позиции. GG!", cap: ["Профит.", "Минус фигура."], book: ["e2e4 c7c5", "e2e4 e7e5 g1f3 b8c6 d2d4"] },
  { id: "colonel", name: "Полковник", av: "🎖", elo: 1600, style: "Атакует в лоб, любит королевский фланг соперника.",
    hi: "Смирно! Начинаем наступление.", win: "Операция завершена успешно.", lose: "Отступаем… Достойный противник.", cap: ["Цель уничтожена.", "Вперёд!"], book: ["e2e4 e7e5 f2f4", "e2e4 c7c5 b1c3", "d2d4 d7d5 c1f4"] },
  { id: "vera", name: "Вера", av: "👩‍🔬", elo: 1800, style: "Учёный. Позиционная игра и терпеливое давление.",
    hi: "Здравствуйте. Посмотрим на эксперимент.", win: "Гипотеза подтвердилась.", lose: "Интересно. Надо изучить эту позицию.", cap: ["Логично.", "Как и ожидалось."], book: ["d2d4 g8f6 c2c4 e7e6 g1f3 b7b6", "c2c4", "e2e4 c7c6"] },
  { id: "boris", name: "Борис", av: "🧔", elo: 2000, style: "Кандидат в мастера. Играет всё и везде.",
    hi: "Ну, давай посмотрим, что ты умеешь.", win: "Хорошая попытка.", lose: "Силён! Уважаю.", cap: ["Так-так.", "Спасибо."], book: ["e2e4 e7e5 g1f3 b8c6 f1b5", "d2d4 d7d5 c2c4 c7c6", "e2e4 c7c5 g1f3 d7d6"] },
  { id: "maestro", name: "Маэстро", av: "🎩", elo: 2200, style: "Мастер ФИДЕ. Точная игра без лишнего риска.",
    hi: "Добрый вечер. Прошу, ваш ход.", win: "Благодарю за партию.", lose: "Браво. Действительно браво.", cap: ["Merci.", "Неосторожно."], book: ["d2d4 g8f6 c2c4 g7g6", "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6"] },
  { id: "prof", name: "Профессор", av: "🦉", elo: 2500, style: "Гроссмейстер. Глубоко понимает позицию.",
    hi: "Шахматы — это борьба. Начнём.", win: "Поучительная партия, не правда ли?", lose: "Блестяще сыграно!", cap: ["Хм.", "Так тоже можно."], book: ["e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 a7a6", "d2d4 d7d5 c2c4 e7e6"] },
  { id: "kaissa", name: "Каисса", av: "🤖", elo: 2800, style: "Робот, названный в честь первого чемпиона мира среди программ.",
    hi: "Инициализация… Готова к партии.", win: "Вычисления завершены.", lose: "Ошибка… Невозможно. Поздравляю.", cap: ["Материал +1.", "Расчёт верен."], book: [] },
  { id: "stockfish", name: "Stockfish", av: "🐟", elo: 3200, style: "Полная сила движка. Сильнейший игрок на планете.",
    hi: "…", win: "…", lose: "!!!", cap: [], book: [] },
];
export const botById = id => BOTS.find(b => b.id === id) || BOTS[3];

/* параметры слабых ботов по рейтингу: глубина, «температура» выбора и шанс зевка */
function weakParams(elo) {
  const t = Math.max(0, Math.min(1, (elo - 250) / (1500 - 250)));
  return {
    depth: Math.round(1 + t * 9),
    temp: 260 - t * 235,
    blunder: 0.28 * Math.pow(1 - t, 1.6) + 0.006,
    multipv: 8,
  };
}

/* выбор хода бота; clockMs — оставшееся время бота (для партий с часами) */
export async function botMove(fen, bot, { history = [], clockMs = null, incMs = 0 } = {}) {
  const chess = makeChess(fen);
  const legal = chess.moves({ verbose: true });
  if (!legal.length) return null;
  if (legal.length === 1) return { uci: legal[0].from + legal[0].to + (legal[0].promotion || "") };

  // 1. любимый дебют, пока партия идёт по нему
  const ply = history.length;
  if (ply < 16) {
    const line = pickBookLine(bot, history);
    if (line) return { uci: line, book: true };
    // общий справочник дебютов для ботов посильнее
    if (bot.elo >= 800 && ply < 10 && Math.random() < 0.85) {
      const bm = bookMoves(fen).filter(u => playUci(makeChess(fen), u));
      if (bm.length) return { uci: bm[Math.floor(Math.random() * bm.length)], book: true };
    }
  }

  // время на ход для партии с часами
  let movetime = null;
  if (clockMs != null) {
    movetime = Math.max(80, Math.min(clockMs / 35 + incMs * 0.7, 6000));
    if (clockMs < 15000) movetime = Math.min(movetime, 250);
  }

  // 2. сильные боты — Stockfish с ограничением силы
  if (bot.elo >= 1500) {
    const full = bot.elo >= 3190;
    const r = await engine.analyse(fen, {
      elo: full ? null : bot.elo,
      movetime: movetime || (full ? 1200 : 400 + Math.random() * 500),
      tag: "bot",
    });
    return { uci: r.best };
  }

  // 3. слабые — свои правила
  const p = weakParams(bot.elo);
  if (Math.random() < p.blunder) {
    // зевок: «очевидный» ход новичка — что-нибудь взять, дать шах или просто походить
    const caps = legal.filter(m => m.captured);
    const pool = caps.length && Math.random() < 0.65 ? caps : legal;
    const m = pool[Math.floor(Math.random() * pool.length)];
    return { uci: m.from + m.to + (m.promotion || ""), blunder: true };
  }
  const r = await engine.analyse(fen, { depth: p.depth, multipv: Math.min(p.multipv, legal.length), tag: "bot" });
  const cands = r.lines.filter(l => l.pv && l.pv.length).map(l => ({ uci: l.pv[0], s: scoreOf(l) }));
  if (!cands.length) return { uci: r.best };
  const best = cands[0].s;
  // мат в один ход видят даже новички — но не всегда
  if (best > 90000 && Math.random() < 0.4 + bot.elo / 2000) return { uci: cands[0].uci };
  const w = cands.map(c => {
    let s = (c.s - best) / p.temp;
    // новички любят брать фигуры
    const mv = legal.find(m => m.from + m.to + (m.promotion || "") === c.uci);
    if (mv && mv.captured) s += (VAL[mv.captured] || 0) * 0.25 * (1 - bot.elo / 1500);
    return Math.exp(Math.max(-30, s));
  });
  let x = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < cands.length; i++) { x -= w[i]; if (x <= 0) return { uci: cands[i].uci }; }
  return { uci: cands[0].uci };
}

function pickBookLine(bot, history) {
  if (!bot.book || !bot.book.length) return null;
  const lines = bot.book.map(l => l.split(" ")).filter(l => l.length > history.length && history.every((u, i) => l[i] === u));
  if (!lines.length) return null;
  const l = lines[Math.floor(Math.random() * lines.length)];
  return l[history.length];
}

/* «человеческая» пауза перед ходом бота в партии без часов */
export async function botThinkDelay(bot, startedAt) {
  const want = bot.elo >= 3000 ? 300 : 450 + Math.random() * 900;
  const spent = performance.now() - startedAt;
  if (spent < want) await sleep(want - spent);
}

