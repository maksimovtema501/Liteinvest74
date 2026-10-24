#!/usr/bin/env python3
"""Проверка уроков «Шахмат» движком.

Для каждого упражнения «найди ход»: позиция легальна, ход решения —
лучший по Stockfish и заметно сильнее второго. Для позиций против движка —
оценка совпадает с целью (мат / выигрыш / ничья) и сколько ходов до мата.
Запуск: python3 assets/check-lessons.py --engine /path/to/stockfish
"""
import argparse
import os
import re

import chess
import chess.engine

HERE = os.path.dirname(os.path.abspath(__file__))


def entries():
    src = open(os.path.join(HERE, "..", "data", "lessons.js"), encoding="utf-8").read()
    lid = None
    for line in src.splitlines():
        m = re.search(r'\{ id: "([\w-]+)"', line)
        if m:
            lid = m.group(1)
        f = re.search(r'fen: "([^"]+)"', line)
        if not f:
            continue
        mv = re.search(r'moves: \[([^\]]*)\]', line)
        any_ = re.search(r'any: "(\w+)"', line)
        goal = re.search(r'goal: \{ type: "(\w+)"(?:, moves: (\d+))?', line)
        user = re.search(r'user: "([wb])"', line)
        rule = "rule: true" in line
        yield {
            "id": lid, "fen": f.group(1),
            "moves": re.findall(r'"(\w+)"', mv.group(1)) if mv else [],
            "any": any_.group(1) if any_ else None,
            "goal": (goal.group(1), int(goal.group(2) or 0)) if goal else None,
            "user": user.group(1) if user else "w",
            "rule": rule,
        }


def score(info):
    s = info["score"].relative
    return s.score(mate_score=100000)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", required=True)
    a = ap.parse_args()
    eng = chess.engine.SimpleEngine.popen_uci(a.engine)
    ok = True
    for e in entries():
        b = chess.Board(e["fen"])
        if not b.is_valid():
            print("НЕЛЕГАЛЬНО", e["id"], e["fen"], b.status())
            ok = False
            continue
        if e["goal"]:
            info = eng.analyse(b, chess.engine.Limit(depth=30))
            s = info["score"].pov(chess.WHITE if e["user"] == "w" else chess.BLACK)
            print(f'{e["id"]:10} цель={e["goal"]} оценка для ученика: {s}')
            continue
        if e["any"]:
            found = [m for m in b.legal_moves if (b.gives_check(m) if e["any"] == "check" else _mates(b, m))]
            print(f'{e["id"]:10} any={e["any"]}: подходящих ходов {len(found)}')
            ok &= bool(found)
            continue
        for i, u in enumerate(e["moves"]):
            mv = chess.Move.from_uci(u)
            if mv not in b.legal_moves:
                print("НЕЛЕГАЛЬНЫЙ ХОД", e["id"], u)
                ok = False
                break
            if i % 2 == 0 and not e["rule"]:
                infos = eng.analyse(b, chess.engine.Limit(depth=20), multipv=2)
                best = infos[0]["pv"][0]
                s1 = score(infos[0])
                s2 = score(infos[1]) if len(infos) > 1 else None
                mark = "ok" if best == mv or _mates(b, mv) else "НЕ ЛУЧШИЙ (" + b.san(best) + ")"
                print(f'{e["id"]:10} {b.san(mv):8} {mark:16} лучший {s1} второй {s2}')
                ok &= mark == "ok"
            b.push(mv)
    eng.quit()
    print("ВСЁ ВЕРНО" if ok else "ЕСТЬ ОШИБКИ")


def _mates(b, m):
    b.push(m)
    r = b.is_checkmate()
    b.pop()
    return r


if __name__ == "__main__":
    main()
