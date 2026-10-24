#!/usr/bin/env python3
"""Генератор задач для «Шахмат».

Задачи строятся так же, как на lichess: движок играет партии «по-человечески»
(иногда ошибается), а сильный анализ ищет момент, когда соперник ошибся и
у стороны на ходу появился единственный выигрывающий ход. Дальше решение
продлевается, пока каждый ход решающего остаётся единственным.

Стартовые позиции — дебюты из базы lichess chess-openings (CC0).
Нужны python-chess и Stockfish:
    python3 assets/gen-puzzles.py --engine /path/to/stockfish \
        --openings /path/to/chess-openings --out /tmp/puzzles-1.jsonl \
        --seed 1 --minutes 60
Несколько процессов с разными --seed можно запускать параллельно, потом
собрать результат: python3 assets/gen-puzzles.py --build out1.jsonl ... > puzzles.js
"""
import argparse
import glob
import json
import math
import os
import random
import sys
import time

import chess
import chess.engine
import chess.pgn

VAL = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}
MATE = 100000


def win_pct(cp):
    return 50 + 50 * (2 / (1 + math.exp(-0.00368208 * cp)) - 1)


def score_cp(score):
    """Оценка в сантипешках с точки зрения стороны на ходу (мат — большое число)."""
    s = score.relative
    if s.is_mate():
        m = s.mate()
        return MATE - abs(m) * 10 if m > 0 else -MATE + abs(m) * 10
    return s.score()


def mate_in(score):
    s = score.relative
    return s.mate() if s.is_mate() else None


def material(board, color):
    return sum(VAL[p.piece_type] * (1 if p.color == color else -1) for p in board.piece_map().values())


def load_openings(path):
    lines = []
    for f in sorted(glob.glob(os.path.join(path, "*.tsv"))):
        with open(f, encoding="utf-8") as fh:
            next(fh)
            for row in fh:
                eco, name, pgn = row.rstrip("\n").split("\t")
                board = chess.Board()
                moves = []
                ok = True
                for tok in pgn.split():
                    if tok.endswith("."):
                        continue
                    try:
                        mv = board.push_san(tok)
                    except ValueError:
                        ok = False
                        break
                    moves.append(mv)
                if ok and 4 <= len(moves) <= 16:
                    lines.append(moves)
    return lines


class Gen:
    def __init__(self, engine_path, seed):
        self.rng = random.Random(seed)
        self.eng = chess.engine.SimpleEngine.popen_uci(engine_path)
        self.eng.configure({"Threads": 1, "Hash": 64})

    def analyse(self, board, depth, multipv=1):
        info = self.eng.analyse(board, chess.engine.Limit(depth=depth), multipv=multipv)
        return info if isinstance(info, list) else [info]

    # --- политика «человека»: софтмакс по оценкам кандидатов ---
    def human_move(self, board, temp):
        if self.rng.random() < 0.015:
            moves = list(board.legal_moves)
            caps = [m for m in moves if board.is_capture(m) or board.gives_check(m)]
            return self.rng.choice(caps if caps and self.rng.random() < 0.6 else moves), None
        infos = self.analyse(board, self.rng.choice([1, 2, 2, 3, 3, 4, 5]), multipv=6)
        cands = [(i["pv"][0], score_cp(i["score"])) for i in infos if "pv" in i and i["pv"]]
        best = cands[0][1]
        weights = [math.exp(max(-50, (cp - best) / temp)) for _, cp in cands]
        r = self.rng.random() * sum(weights)
        for (mv, cp), w in zip(cands, weights):
            r -= w
            if r <= 0:
                return mv, infos[0]
        return cands[0][0], infos[0]

    def only_move(self, board, depth):
        """Есть ли у стороны на ходу единственный сильный ход. Возвращает (ход, оценка, оценка второго)."""
        infos = self.analyse(board, depth, multipv=2)
        if not infos or "pv" not in infos[0]:
            return None
        b1 = infos[0]
        e1 = score_cp(b1["score"])
        if len(infos) < 2 or "pv" not in infos[1]:
            return b1["pv"][0], e1, -MATE, b1   # единственный легальный ход
        e2 = score_cp(infos[1]["score"])
        return b1["pv"][0], e1, e2, b1

    def build_puzzle(self, board_before, blunder, eval_before_solver):
        """board_before — позиция до ошибки соперника. Возвращает словарь задачи или None."""
        b = board_before.copy()
        b.push(blunder)
        solver = b.turn
        r = self.only_move(b, 16)
        if not r:
            return None
        mv, e1, e2, info = r
        m1 = mate_in(info["score"])
        is_mate = m1 is not None and m1 > 0
        if is_mate:
            # до ошибки соперника форсированного мата не было
            if m1 > 5 or eval_before_solver >= MATE - 100:
                return None
            if e2 >= MATE - 60:      # второй ход тоже матует быстро — не уникально
                return None
        else:
            if e1 < 250 or eval_before_solver > 150:
                return None
            if win_pct(e1) - win_pct(e2) < 28 or e2 > 180:
                return None
        line = [blunder]
        mat0 = material(b, solver) + (VAL[board_before.piece_at(blunder.to_square).piece_type]
                                      if board_before.is_capture(blunder) and board_before.piece_at(blunder.to_square) else 0)
        cur = b.copy()
        while True:
            line.append(mv)
            cur.push(mv)
            if cur.is_game_over():
                break
            # ответ соперника — лучший ход
            reply = self.analyse(cur, 14)[0]
            if "pv" not in reply:
                break
            rmv = reply["pv"][0]
            nxt = cur.copy()
            nxt.push(rmv)
            if nxt.is_game_over():
                break
            r = self.only_move(nxt, 16)
            if not r:
                break
            mv2, f1, f2, info2 = r
            mi = mate_in(info2["score"])
            if is_mate:
                if mi is None or mi <= 0:
                    return None
                if f2 >= MATE - 60 and not (mi == 1 and len(line) > 2):
                    # альтернативный мат — допустим только мат в 1 на последнем ходу (его примет приложение)
                    if mi != 1:
                        return None
                line.append(rmv)
                cur = nxt
                mv = mv2
                continue
            # материальная задача: продолжаем, пока ход единственный и решение не обналичено
            gained = material(cur, solver) - mat0
            if gained >= 2 and (win_pct(f1) - win_pct(f2) < 25 or f2 > 300):
                break
            if win_pct(f1) - win_pct(f2) < 25 or f2 > 300:
                # ход больше не единственный — заканчиваем на предыдущем ходу решающего
                break
            if len(line) >= 13:
                break
            line.append(rmv)
            cur = nxt
            mv = mv2
        if is_mate and not cur.is_checkmate():
            return None
        if not is_mate:
            gained = material(cur, solver) - mat0
            promo = any(m.promotion for m in line[1::2])
            if gained < 2 and not promo:
                return None
            # проверка, что итог действительно выигран
            fin = self.analyse(cur, 14)[0]
            if score_cp(fin["score"]) > -200:   # оценка со стороны соперника
                return None
        if len(line) < 2:
            return None
        if not is_mate and len(line) == 2:
            # «забери висящую фигуру» — оставляем немного, для новичков
            first = line[1]
            victim = b.piece_at(first.to_square)
            if victim and not b.attackers(not solver, first.to_square) and self.rng.random() < 0.8:
                return None
            if self.rng.random() < 0.5:
                return None
        return self.finish(board_before, line, is_mate)

    def finish(self, board_before, line, is_mate):
        b = board_before.copy()
        b.push(line[0])
        # глубина, на которой движок впервые находит первый ход решения
        found = 20
        for d in (1, 2, 3, 4, 6, 8, 10, 12, 14):
            if self.analyse(b, d)[0]["pv"][0] == line[1]:
                found = d
                break
        themes = tag_themes(board_before, line, is_mate)
        nsol = len(line[1::2])
        first = line[1]
        quiet = not b.is_capture(first) and not b.gives_check(first)
        rating = 600 + 230 * (nsol - 1) + 55 * found
        if quiet:
            rating += 260
        if "sacrifice" in themes:
            rating += 160
        if is_mate and nsol == 1:
            rating -= 150
        if "hangingPiece" in themes:
            rating -= 200
        rating += self.rng.randint(-90, 90)
        rating = max(400, min(2800, rating))
        return {
            "fen": board_before.fen(),
            "moves": " ".join(m.uci() for m in line),
            "rating": rating,
            "themes": themes,
        }

    def play_game(self, openings, out):
        board = chess.Board()
        for mv in self.rng.choice(openings):
            board.push(mv)
        temp = self.rng.choice([15, 25, 40, 60])
        found = 0
        prev_eval = None          # оценка позиции с точки зрения стороны на ходу
        decided = 0
        while not board.is_game_over() and board.fullmove_number < 90:
            before = board.copy()
            mv, info = self.human_move(board, temp)
            if info is not None:
                prev_eval = score_cp(info["score"])
            else:
                prev_eval = score_cp(self.analyse(board, 8)[0]["score"])
            board.push(mv)
            if board.is_game_over():
                break
            # дешёвая проверка: стало ли резко лучше для стороны на ходу
            quick = self.analyse(board, 9)[0]
            q = score_cp(quick["score"])
            eval_before_solver = -prev_eval
            if ((q - eval_before_solver >= 220 and eval_before_solver < 150)
                    or (q >= MATE - 100 and eval_before_solver < MATE - 100)):
                p = self.build_puzzle(before, mv, eval_before_solver)
                if p:
                    out.write(json.dumps(p) + "\n")
                    out.flush()
                    found += 1
            decided = decided + 1 if abs(q) > 900 else 0
            if decided > 16:
                break
        return found


SLIDERS = (chess.BISHOP, chess.ROOK, chess.QUEEN)


def tag_themes(board_before, line, is_mate):
    t = set()
    b = board_before.copy()
    b.push(line[0])
    solver = b.turn
    nsol = len(line[1::2])
    pieces = len(b.piece_map())
    if pieces <= 12 or (not b.pieces(chess.QUEEN, chess.WHITE) and not b.pieces(chess.QUEEN, chess.BLACK) and pieces <= 16):
        t.add("endgame")
    elif b.fullmove_number <= 12:
        t.add("opening")
    else:
        t.add("middlegame")
    if is_mate:
        t.add("mate")
        t.add("mateIn%d" % min(nsol, 5))
    else:
        t.add("crushing")
    t.add({1: "oneMove", 2: "short", 3: "long"}.get(nsol, "veryLong"))
    cur = b.copy()
    first_solver = True
    for i, mv in enumerate(line[1:]):
        mover = cur.turn
        piece = cur.piece_at(mv.from_square)
        if mover == solver:
            if mv.promotion:
                t.add("promotion")
                if mv.promotion != chess.QUEEN:
                    t.add("underPromotion")
            if cur.is_en_passant(mv):
                t.add("enPassant")
            if cur.is_castling(mv):
                t.add("castling")
            captured = cur.piece_at(mv.to_square)
            if first_solver and captured and nsol == 1 and not cur.is_attacked_by(not solver, mv.to_square):
                t.add("hangingPiece")
            if first_solver and captured and not cur.attackers(not solver, mv.to_square) and nsol <= 2 and VAL[captured.piece_type] >= 3:
                t.add("hangingPiece")
            if not captured and not cur.gives_check(mv) and i < len(line) - 2:
                t.add("quietMove")
            # вскрытый шах / атака: какие фигуры атаковали до и после хода
            nxt = cur.copy()
            nxt.push(mv)
            if nxt.is_check():
                checkers = nxt.checkers()
                if len(checkers) >= 2:
                    t.add("doubleCheck")
                if mv.to_square not in checkers:
                    t.add("discoveredAttack")
            # вилка: ход фигурой (не пешкой-ладьёй-ферзём на края) — атакует два ценных объекта
            if piece and piece.piece_type in (chess.KNIGHT, chess.BISHOP, chess.PAWN, chess.QUEEN, chess.ROOK, chess.KING):
                targets = []
                for sq in nxt.attacks(mv.to_square):
                    tp = nxt.piece_at(sq)
                    if tp and tp.color != solver:
                        if tp.piece_type == chess.KING or VAL[tp.piece_type] > VAL[piece.piece_type] or not nxt.attackers(not solver, sq):
                            if tp.piece_type != chess.PAWN:
                                targets.append(sq)
                if len(targets) >= 2:
                    # фигура позже берёт одну из целей
                    later = line[1 + i + 1:]
                    tmp = nxt.copy()
                    sq_now = mv.to_square
                    for j, lm in enumerate(later):
                        if tmp.turn == solver and lm.from_square == sq_now and lm.to_square in targets:
                            t.add("fork")
                            break
                        if tmp.turn == solver and lm.from_square == sq_now:
                            sq_now = lm.to_square
                        tmp.push(lm)
            # связка / сквозной удар: дальнобойная фигура бьёт по линии через фигуру соперника
            if piece and piece.piece_type in SLIDERS:
                for sq in nxt.attacks(mv.to_square):
                    tp = nxt.piece_at(sq)
                    if not tp or tp.color == solver:
                        continue
                    if nxt.is_pinned(not solver, sq) and nxt.pin(not solver, sq) and mv.to_square in nxt.pin(not solver, sq):
                        later = [m.to_square for m in line[1 + i + 1:][1::2]]
                        if sq in later:
                            t.add("pin")
                    if tp.piece_type in (chess.KING, chess.QUEEN):
                        ray = chess.ray(mv.to_square, sq)
                        beyond = [s for s in chess.SquareSet(ray)
                                  if chess.BB_SQUARES[sq] & chess.between(mv.to_square, s)]
                        beyond.sort(key=lambda s: chess.square_distance(s, mv.to_square))
                        for s in beyond:
                            bp = nxt.piece_at(s)
                            if bp:
                                if (bp.color != solver and bp.piece_type != chess.PAWN
                                        and (tp.piece_type == chess.KING or VAL[bp.piece_type] < VAL[tp.piece_type])):
                                    later = [m.to_square for m in line[1 + i + 1:][1::2]]
                                    if s in later:
                                        t.add("skewer")
                                break
            # жертва: фигура решающего тут же забита, а задача всё равно выиграна
            reply_idx = 1 + i + 1
            if reply_idx < len(line):
                rep = line[reply_idx]
                if rep.to_square == mv.to_square and piece and piece.piece_type != chess.PAWN:
                    cap_val = VAL[captured.piece_type] if captured else 0
                    if VAL[piece.piece_type] - cap_val >= 2:
                        t.add("sacrifice")
            first_solver = False
        cur.push(mv)
    if is_mate and cur.is_checkmate():
        k = cur.king(cur.turn)
        last = line[-1]
        mp = cur.piece_at(last.to_square)
        rank = chess.square_rank(k)
        if mp and mp.piece_type == chess.KNIGHT:
            neigh = [s for s in chess.SquareSet(chess.BB_KING_ATTACKS[k])]
            if all(cur.piece_at(s) and cur.piece_at(s).color == cur.turn for s in neigh):
                t.add("smotheredMate")
        if rank in (0, 7) and mp and mp.piece_type in (chess.ROOK, chess.QUEEN) and chess.square_rank(last.to_square) == rank:
            front = 1 if rank == 0 else -1
            blockers = [chess.square(f, rank + front) for f in range(max(0, chess.square_file(k) - 1), min(7, chess.square_file(k) + 1) + 1)]
            if all(cur.piece_at(s) and cur.piece_at(s).color == cur.turn for s in blockers):
                t.add("backRankMate")
    return sorted(t)


def inv_norm(p):
    """Обратная функция нормального распределения (приближение Акклама)."""
    a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.3577518672690, -30.66479806614716, 2.506628277459239]
    b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771720, -13.28068155288572]
    c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
    d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416]
    if p < 0.02425:
        q = math.sqrt(-2 * math.log(p))
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    if p > 1 - 0.02425:
        return -inv_norm(1 - p)
    q = p - 0.5
    r = q * q
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)


def build(paths):
    seen = set()
    items = []
    for p in paths:
        with open(p) as fh:
            for row in fh:
                try:
                    d = json.loads(row)
                except ValueError:
                    continue
                key = d["fen"].rsplit(" ", 2)[0]
                if key in seen:
                    continue
                seen.add(key)
                items.append(d)
    # оценка сложности эвристическая — растягиваем её по рангу на распределение
    # рейтингов 400–2700 (порядок «легче — сложнее» сохраняется)
    rng = random.Random(7)
    items.sort(key=lambda d: d["rating"] + rng.uniform(-40, 40))
    n = len(items)
    for i, d in enumerate(items):
        q = (i + 0.5) / n
        d["rating"] = int(max(400, min(2700, 1300 + 430 * inv_norm(q))))
    themes = sorted({t for d in items for t in d["themes"]})
    out = ["/* Задачи «Шахмат»: сгенерированы движком Stockfish из партий с дебютными",
           "   позициями lichess chess-openings (CC0) — см. assets/gen-puzzles.py.",
           "   Формат: [FEN до ошибки соперника, ходы UCI (первый — ошибка соперника),",
           "   рейтинг, темы через пробел]. */",
           "export const PUZZLES = ["]
    for d in items:
        out.append(json.dumps([d["fen"], d["moves"], d["rating"], " ".join(d["themes"])], ensure_ascii=False) + ",")
    out.append("];")
    print("\n".join(out))
    print("// всего %d, темы: %s" % (len(items), ", ".join(themes)), file=sys.stderr)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine")
    ap.add_argument("--openings")
    ap.add_argument("--out")
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--minutes", type=float, default=30)
    ap.add_argument("--build", nargs="*")
    a = ap.parse_args()
    if a.build:
        build(a.build)
        return
    openings = load_openings(a.openings)
    g = Gen(a.engine, a.seed)
    end = time.time() + a.minutes * 60
    total = games = 0
    with open(a.out, "a") as out:
        while time.time() < end:
            try:
                total += g.play_game(openings, out)
            except chess.engine.EngineTerminatedError:
                g = Gen(a.engine, a.seed + games + 1000)
            games += 1
            if games % 10 == 0:
                print("seed %d: партий %d, задач %d" % (a.seed, games, total), file=sys.stderr, flush=True)
    g.eng.quit()


if __name__ == "__main__":
    main()
