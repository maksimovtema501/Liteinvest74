/* Обвязка над chess.js: легальные ходы для доски, SAN-строки, материал,
   итог партии, PGN, размен на поле (SEE) и справочник дебютов. */
import { Chess } from "../vendor/chess.js";
import { VAL, FILES } from "./util.js";
import { OPENING_NAMES, OPENING_POS } from "../data/openings.js";

export { Chess };
export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function makeChess(fen = START_FEN) {
  try { return new Chess(fen); }
  catch { return new Chess(fen, { skipValidation: true }); }
}

export function dests(chess) {
  const m = new Map();
  for (const mv of chess.moves({ verbose: true })) {
    if (!m.has(mv.from)) m.set(mv.from, []);
    const a = m.get(mv.from);
    if (!a.includes(mv.to)) a.push(mv.to);
  }
  return m;
}

export const uciOf = m => m.from + m.to + (m.promotion || "");
export function parseUci(u) { return { from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || undefined }; }

/* ход по UCI; null, если нелегален */
export function playUci(chess, uci) {
  try { return chess.move(parseUci(uci)); } catch { return null; }
}

export function checkSquare(chess) {
  if (!chess.inCheck()) return null;
  const turn = chess.turn();
  for (const row of chess.board()) for (const p of row) if (p && p.type === "k" && p.color === turn) return p.square;
  return null;
}

/* SAN-ходы из UCI-строки: ["Кf3", ...] */
export function sanList(fen, ucis, max = 99) {
  const c = makeChess(fen);
  const out = [];
  for (const u of ucis.slice(0, max)) {
    const m = playUci(c, u);
    if (!m) break;
    out.push(m.san);
  }
  return out;
}
/* «12. Кf3 Кc6 13. Сb5» — с номерами ходов */
export function sanLine(fen, ucis, max = 8, fig = true) {
  const parts = fen.split(" ");
  let n = +parts[5] || 1, white = parts[1] === "w";
  const sans = sanList(fen, ucis, max);
  let s = "";
  sans.forEach((san, i) => {
    if (white) s += `${n}. `;
    else if (i === 0) s += `${n}… `;
    s += (fig ? figSan(san) : san) + " ";
    if (!white) n++;
    white = !white;
  });
  return s.trim();
}

/* русская нотация: Кр, Ф, Л, С, К */
const RU_LETTER = { K: "Кр", Q: "Ф", R: "Л", B: "С", N: "К" };
export function ruSan(san) { return san.replace(/^[KQRBN]/, c => RU_LETTER[c]).replace(/=([QRBN])/, (_, c) => "=" + RU_LETTER[c]); }
const FIG = { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘" };
let figMode = "ru";
export function setNotation(mode) { figMode = mode; }
export function figSan(san) {
  if (figMode === "fig") return san.replace(/^[KQRBN]/, c => FIG[c]).replace(/=([QRBN])/, (_, c) => "=" + FIG[c]);
  if (figMode === "ru") return ruSan(san);
  return san;
}

/* материал и съеденные фигуры для плашек игроков */
const FULL = { p: 8, n: 2, b: 2, r: 2, q: 1 };
export function captured(fen) {
  const cnt = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };
  for (const ch of fen.split(" ")[0]) {
    const t = ch.toLowerCase();
    if (!"pnbrq".includes(t)) continue;
    cnt[ch === t ? "b" : "w"][t]++;
  }
  // белые взяли то, чего не хватает у чёрных; превращения учитываем грубо
  const takenBy = { w: [], b: [] };
  let mat = 0;
  for (const t of ["q", "r", "b", "n", "p"]) {
    for (let i = cnt.b[t]; i < FULL[t]; i++) takenBy.w.push(t);
    for (let i = cnt.w[t]; i < FULL[t]; i++) takenBy.b.push(t);
    mat += (cnt.w[t] - cnt.b[t]) * VAL[t];
  }
  return { takenBy, diff: mat };
}
export function materialOf(fen, color) {
  let m = 0;
  for (const ch of fen.split(" ")[0]) {
    const t = ch.toLowerCase();
    if (!VAL[t]) continue;
    m += (ch === t ? -1 : 1) * VAL[t];
  }
  return color === "w" ? m : -m;
}

/* итог партии по позиции */
export function gameEnd(chess) {
  if (chess.isCheckmate()) return { result: chess.turn() === "w" ? "0-1" : "1-0", reason: "мат" };
  if (chess.isStalemate()) return { result: "1/2-1/2", reason: "пат" };
  if (chess.isInsufficientMaterial()) return { result: "1/2-1/2", reason: "недостаточно материала" };
  if (chess.isThreefoldRepetition()) return { result: "1/2-1/2", reason: "троекратное повторение" };
  if (chess.isDrawByFiftyMoves()) return { result: "1/2-1/2", reason: "правило 50 ходов" };
  return null;
}

export function buildPgn({ white, black, result, startFen, moves, date, event = "Шахматы", tc }) {
  const c = makeChess(startFen || START_FEN);
  const sans = [];
  for (const u of moves) { const m = playUci(c, u); if (!m) break; sans.push(m.san); }
  const d = new Date(date || Date.now());
  const head = [
    ["Event", event], ["Site", "Шахматы (офлайн)"],
    ["Date", `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`],
    ["White", white || "?"], ["Black", black || "?"], ["Result", result || "*"],
  ];
  if (tc && tc !== "none") head.push(["TimeControl", tc.replace("+", "+").split("+").map((x, i) => i ? x : x * 60).join("+")]);
  if (startFen && startFen !== START_FEN) head.push(["SetUp", "1"], ["FEN", startFen]);
  let body = "";
  const parts = (startFen || START_FEN).split(" ");
  let n = +parts[5] || 1, white_ = parts[1] === "w";
  sans.forEach((s, i) => {
    if (white_) body += `${n}. `; else if (i === 0) body += `${n}... `;
    body += s + " ";
    if (!white_) n++;
    white_ = !white_;
  });
  return head.map(([k, v]) => `[${k} "${String(v).replace(/"/g, "'")}"]`).join("\n") + "\n\n" + (body + (result || "*")).replace(/(.{1,78})(\s|$)/g, "$1\n").trim() + "\n";
}

/* разбор PGN или FEN, введённого пользователем */
export function parseInput(text) {
  text = text.trim();
  if (!text) return null;
  const fenLike = /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+(\s|$)/.test(text);
  if (fenLike) {
    let fen = text.split(/\s+/).slice(0, 6).join(" ");
    const p = fen.split(" ");
    while (p.length < 6) p.push(["w", "-", "-", "0", "1"][p.length - 1]);
    fen = p.join(" ");
    const c = makeChess(fen);
    return { startFen: c.fen(), moves: [], headers: {} };
  }
  const c = new Chess();
  try { c.loadPgn(text); }
  catch {
    // голые ходы без заголовков: «1. e4 e5 2. Nf3»
    const toks = text.replace(/\{[^}]*\}/g, " ").replace(/\d+\.(\.\.)?/g, " ").split(/\s+/).filter(t => t && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
    const c2 = new Chess();
    for (const t of toks) { try { c2.move(t); } catch { return null; } }
    return { startFen: START_FEN, moves: c2.history({ verbose: true }).map(uciOf), headers: {} };
  }
  const h = c.getHeaders();
  const hist = c.history({ verbose: true });
  return { startFen: h.FEN || START_FEN, moves: hist.map(uciOf), headers: h };
}

/* позиция без счётчиков ходов — ключ для дебютов и повторений */
export const epd = fen => fen.split(" ").slice(0, 4).join(" ");

/* фен с передачей хода сопернику — чтобы спросить движок об угрозах */
export function nullMoveFen(fen) {
  const p = fen.split(" ");
  p[1] = p[1] === "w" ? "b" : "w";
  p[3] = "-";
  return p.join(" ");
}

/* --- размен на поле: сколько теряет сторона, поставившая фигуру на sq --- */
export function see(fen, sq) {
  const c = makeChess(fen);
  const target = c.get(sq);
  if (!target) return 0;
  const gain = [];
  let side = target.color === "w" ? "b" : "w";
  let onSq = VAL[target.type];
  let d = 0;
  for (let guard = 0; guard < 16; guard++) {
    const att = cheapestAttacker(c, sq, side);
    if (!att) break;
    gain[d] = onSq - (d ? gain[d - 1] : 0);
    onSq = VAL[att.type] || 50;
    // переставляем фигуру вручную, без проверки шахов — для оценки достаточно
    c.remove(att.square);
    c.remove(sq);
    c.put({ type: att.type, color: side }, sq);
    side = side === "w" ? "b" : "w";
    d++;
  }
  while (--d > 0) gain[d - 1] = -Math.max(-gain[d - 1], gain[d]);
  return gain.length ? gain[0] : 0;
}
function cheapestAttacker(c, sq, color) {
  let best = null;
  for (const s of c.attackers(sq, color)) {
    const p = c.get(s);
    if (!p) continue;
    const v = p.type === "k" ? 100 : VAL[p.type];
    if (!best || v < best.v) best = { square: s, type: p.type, v };
  }
  return best;
}

/* --- справочник дебютов: дерево строится лениво при первом обращении --- */
const RU_FAMILY = {
  "Sicilian Defense": "Сицилианская защита", "Ruy Lopez": "Испанская партия", "Queen's Gambit Declined": "Отказанный ферзевый гамбит",
  "French Defense": "Французская защита", "Italian Game": "Итальянская партия", "English Opening": "Английское начало",
  "King's Gambit Accepted": "Принятый королевский гамбит", "King's Indian Defense": "Староиндийская защита",
  "Caro-Kann Defense": "Защита Каро — Канн", "Nimzo-Indian Defense": "Защита Нимцовича (нимцо-индийская)",
  "Queen's Pawn Game": "Дебют ферзевой пешки", "Semi-Slav Defense": "Полуславянская защита", "Dutch Defense": "Голландская защита",
  "Benoni Defense": "Защита Бенони", "Queen's Gambit Accepted": "Принятый ферзевый гамбит", "Grünfeld Defense": "Защита Грюнфельда",
  "Queen's Indian Defense": "Новоиндийская защита", "Alekhine Defense": "Защита Алехина", "Scotch Game": "Шотландская партия",
  "King's Gambit Declined": "Отказанный королевский гамбит", "Indian Defense": "Индийская защита", "Slav Defense": "Славянская защита",
  "Petrov's Defense": "Русская партия (защита Петрова)", "Four Knights Game": "Партия четырёх коней", "Zukertort Opening": "Дебют Цукерторта",
  "Scandinavian Defense": "Скандинавская защита", "Philidor Defense": "Защита Филидора", "Réti Opening": "Дебют Рети",
  "Nimzowitsch Defense": "Защита Нимцовича (1.e4 Кc6)", "Vienna Game": "Венская партия", "Bishop's Opening": "Дебют слона",
  "Modern Defense": "Современная защита", "King's Pawn Game": "Дебют королевской пешки", "Van Geet Opening": "Дебют Ван Гета",
  "Pterodactyl Defense": "Защита «Птеродактиль»", "Catalan Opening": "Каталонское начало", "Pirc Defense": "Защита Пирца — Уфимцева",
  "Bird Opening": "Дебют Бёрда", "Tarrasch Defense": "Защита Тарраша", "Polish Opening": "Польское начало",
  "Neo-Grünfeld Defense": "Нео-Грюнфельд", "Blackmar-Diemer Gambit Accepted": "Гамбит Блэкмара — Димера",
  "Blackmar-Diemer Gambit": "Гамбит Блэкмара — Димера", "Blackmar-Diemer Gambit Declined": "Гамбит Блэкмара — Димера (отказанный)",
  "Bogo-Indian Defense": "Защита Боголюбова", "King's Indian Attack": "Староиндийская атака", "Hungarian Opening": "Венгерское начало",
  "Grob Opening": "Дебют Гроба", "Nimzo-Larsen Attack": "Дебют Ларсена", "Center Game": "Центральный дебют", "Latvian Gambit": "Латышский гамбит",
  "Latvian Gambit Accepted": "Латышский гамбит", "Ponziani Opening": "Дебют Понциани", "Vienna Gambit, with Max Lange Defense": "Венский гамбит",
  "Old Indian Defense": "Старая индийская защита", "Rat Defense": "Крысиная защита", "Trompowsky Attack": "Атака Тромповского",
  "Benko Gambit": "Волжский гамбит", "Benko Gambit Accepted": "Волжский гамбит (принятый)", "Benko Gambit Declined": "Волжский гамбит (отказанный)",
  "Englund Gambit": "Гамбит Энглунда", "Englund Gambit Declined": "Гамбит Энглунда (отказанный)", "Richter-Veresov Attack": "Атака Рихтера — Верезова",
  "Owen Defense": "Защита Оуэна", "English Defense": "Английская защита", "Torre Attack": "Атака Торре", "Three Knights Opening": "Партия трёх коней",
  "Danish Gambit": "Датский гамбит", "Danish Gambit Accepted": "Датский гамбит (принятый)", "London System": "Лондонская система",
  "Colle System": "Система Колле", "Elephant Gambit": "Гамбит «Слон»", "King's Knight Opening": "Дебют королевского коня",
  "King's Pawn Opening": "Дебют королевской пешки", "Queen's Gambit": "Ферзевый гамбит", "King's Gambit": "Королевский гамбит",
  "Hippopotamus Defense": "Защита «Бегемот»", "English Orangutan": "Дебют Сокольского", "Polish Defense": "Польская защита",
  "Mikenas Defense": "Защита Микенаса", "Czech Defense": "Чешская защита", "Rapport-Jobava System": "Система Раппорта — Йобавы",
  "Queen's Indian Defense, with e3": "Новоиндийская защита", "Kádas Opening": "Дебют Кадаша", "Borg Defense": "Защита Борг",
  "Bongcloud Attack": "Атака «Бонгклауд»", "Amar Opening": "Дебют Амара", "Barnes Opening": "Дебют Барнса", "Ware Opening": "Дебют Уэра",
};
/* самые частые названия вариантов; редкие остаются как в базе */
const RU_PART = {
  "Classical Variation": "классический вариант", "Exchange Variation": "разменный вариант", "Closed": "закрытый вариант",
  "Main Line": "главная линия", "Fianchetto Variation": "вариант с фианкетто", "Symmetrical Variation": "симметричный вариант",
  "Advance Variation": "вариант с продвижением", "Winawer Variation": "вариант Винавера", "King's English Variation": "королевский вариант",
  "Normal Variation": "обычный вариант", "Two Knights Defense": "защита двух коней", "Modern Variation": "современный вариант",
  "Dragon Variation": "вариант дракона", "Morphy Defense": "защита Морфи", "Evans Gambit": "гамбит Эванса",
  "Orthodox Defense": "ортодоксальная защита", "Open": "открытый вариант", "Rubinstein Variation": "вариант Рубинштейна",
  "Berlin Defense": "берлинская защита", "Anglo-Slav Variation": "англо-славянский вариант", "Najdorf Variation": "вариант Найдорфа",
  "Giuoco Pianissimo": "джуоко пьяниссимо", "Giuoco Piano": "джуоко пиано", "Classical Defense": "классическая защита",
  "Sämisch Variation": "вариант Земиша", "Spanish Variation": "испанский вариант", "Tarrasch Variation": "вариант Тарраша",
  "Chigorin Defense": "защита Чигорина", "Four Knights Variation": "вариант четырёх коней", "Bishop's Gambit": "гамбит слона",
  "Anglo-Indian Defense": "англо-индийская защита", "Orthodox Variation": "ортодоксальный вариант", "Steinitz Variation": "вариант Стейница",
  "Bogoljubow Variation": "вариант Боголюбова", "Scotch Gambit": "шотландский гамбит", "Four Pawns Attack": "атака четырёх пешек",
  "Smith-Morra Gambit": "гамбит Морра", "Smith-Morra Gambit Accepted": "принятый гамбит Морра", "Scheveningen Variation": "шевенингенский вариант",
  "Richter-Rauzer Variation": "атака Рихтера — Раузера", "Falkbeer Countergambit": "контргамбит Фалькбеера", "Yugoslav Attack": "югославская атака",
  "Nimzowitsch Variation": "вариант Нимцовича", "Meran Variation": "меранский вариант", "Alapin Variation": "вариант Алапина",
  "Three Knights Variation": "вариант трёх коней", "Semi-Tarrasch Defense": "защита полутарраш", "Kieseritzky Gambit": "гамбит Кизерицкого",
  "Alekhine Variation": "вариант Алехина", "St. Petersburg Variation": "петербургский вариант", "Chigorin Variation": "вариант Чигорина",
  "Torre Attack": "атака Торре", "Retreat Variation": "вариант с отступлением", "Positional Variation": "позиционный вариант",
  "Kan Variation": "вариант Кана", "Classical Attack": "классическая атака", "Taimanov Variation": "вариант Тайманова",
  "Panov Attack": "атака Панова", "Modern Line": "современная линия", "Modern Defense": "современная защита", "Fianchetto Line": "линия с фианкетто",
  "Czech Variation": "чешский вариант", "Botvinnik Variation": "вариант Ботвинника", "Wing Gambit": "фланговый гамбит",
  "McCutcheon Variation": "вариант Маккатчена", "Keres Variation": "вариант Кереса", "Capablanca Variation": "вариант Капабланки",
  "Averbakh Variation": "вариант Авербаха", "Two Knights Variation": "вариант двух коней", "Smyslov Variation": "вариант Смыслова",
  "Russian Variation": "русский вариант", "Maróczy Bind": "бинд Мароци", "Albin Countergambit": "контргамбит Альбина",
  "Paulsen Variation": "вариант Паульсена", "Modern Steinitz Defense": "улучшенная защита Стейница",
  "Kasparov-Petrosian Variation": "вариант Петросяна — Каспарова", "Greco Gambit": "гамбит Греко", "Fianchetto Defense": "защита с фианкетто",
  "Colle System": "система Колле", "Spielmann Variation": "вариант Шпильмана", "Closed Variation": "закрытый вариант",
  "Accelerated Dragon": "ускоренный дракон", "Tartakower Variation": "вариант Тартаковера", "Stonewall Variation": "каменная стена",
  "Marshall Attack": "атака Маршалла", "Leningrad Variation": "ленинградский вариант", "Lasker Defense": "защита Ласкера",
  "Max Lange Attack": "атака Макса Ланге", "Poisoned Pawn Variation": "вариант с отравленной пешкой", "Schliemann Defense": "защита Шлимана",
  "English Attack": "английская атака", "Austrian Attack": "австрийская атака", "Vienna Gambit": "венский гамбит", "Sozin Attack": "атака Зозина",
  "Petrosian Variation": "вариант Петросяна", "Spassky Variation": "вариант Спасского", "Moscow Variation": "московский вариант",
  "Breyer Variation": "вариант Брейера", "Bronstein Variation": "вариант Бронштейна", "Karpov Variation": "вариант Карпова",
  "Lasker Variation": "вариант Ласкера", "Lasker-Pelikan Variation": "вариант Ласкера — Пеликана (Свешникова)", "Grünfeld Variation": "вариант Грюнфельда",
  "London System": "лондонская система", "Evans Gambit Declined": "отказанный гамбит Эванса", "Open Defense": "открытая защита",
  "Open System": "открытая система", "Classical System": "классическая система", "Central Variation": "центральный вариант",
  "Carlsbad Variation": "карлсбадский вариант", "Steinitz Defense": "защита Стейница", "Hanham Variation": "вариант Ханхема",
  "Traditional Variation": "традиционный вариант", "Quiet Variation": "спокойный вариант", "Modern Attack": "современная атака",
  "Budapest Gambit Accepted": "принятый будапештский гамбит", "Scandinavian Variation": "скандинавский вариант", "Accepted": "принятый",
  "Declined": "отказанный", "Sveshnikov Variation": "вариант Свешникова", "Fried Liver Attack": "атака «жареной печени»",
  "Traxler Counterattack": "контратака Тракслера", "Italian Variation": "итальянский вариант", "Scotch Variation": "шотландский вариант",
};
export function openingRu(name) {
  if (!name) return { ru: "", rest: "" };
  const i = name.indexOf(":");
  const fam = i >= 0 ? name.slice(0, i) : name;
  const rest = i >= 0 ? name.slice(i + 1).trim().split(", ").map(p => RU_PART[p] || p.replace(/^with /, "с ")).join(", ") : "";
  return { ru: RU_FAMILY[fam] || fam, rest, en: name };
}

/* справочник собран заранее (assets/build-openings.py): хэш позиции → название и продолжения */
function fnv(str) {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(str)) { h ^= b; h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}
let book = null;
export function openingBook() {
  if (book) return book;
  book = new Map();
  for (const row of OPENING_POS.split(";")) {
    const [h, ni, next] = row.split(",");
    const e = { next: next ? next.split(" ") : [] };
    if (ni) { const [eco, name] = OPENING_NAMES[parseInt(ni, 36)].split("|"); e.eco = eco; e.name = name; }
    book.set(h, e);
  }
  return book;
}
const bookEntry = fen => openingBook().get(fnv(epd(fen)));
export function openingOf(fen) {
  const e = bookEntry(fen);
  return e && e.name ? e : null;
}
/* название дебюта для партии: самая глубокая позиция из справочника */
export function openingForMoves(startFen, moves) {
  if (startFen && epd(startFen) !== epd(START_FEN)) return null;
  const c = makeChess();
  let found = null;
  for (let i = 0; i < Math.min(moves.length, 30); i++) {
    if (!playUci(c, moves[i])) break;
    const o = openingOf(c.fen());
    if (o) found = { ...o, ply: i + 1 };
  }
  return found;
}
export function isBook(fen) { return !!bookEntry(fen); }
export function bookMoves(fen) { return [...(bookEntry(fen)?.next || [])]; }

export const sqColor = sq => (FILES.indexOf(sq[0]) + +sq[1] - 1) % 2 === 0 ? "d" : "l";
