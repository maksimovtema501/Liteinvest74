#!/usr/bin/env python3
"""Сборка справочника дебютов для «Шахмат» из lichess chess-openings (CC0).

Для каждой позиции из базы сохраняется хэш (FNV-1a от EPD: расстановка,
очередь хода, рокировки, взятие на проходе), название дебюта и книжные
продолжения. В браузере справочник не строится — только читается.
Запуск: python3 assets/build-openings.py /path/to/chess-openings > data/openings.js
"""
import glob
import os
import sys

import chess


def fnv(s):
    h = 0x811C9DC5
    for ch in s.encode("utf-8"):
        h ^= ch
        h = (h * 0x01000193) & 0xFFFFFFFF
    return h


def b36(n):
    d = "0123456789abcdefghijklmnopqrstuvwxyz"
    out = ""
    while True:
        n, r = divmod(n, 36)
        out = d[r] + out
        if not n:
            return out


def main(src):
    names, name_idx = [], {}
    pos = {}   # hash -> [name index, ply, set(next)]
    for f in sorted(glob.glob(os.path.join(src, "*.tsv"))):
        for i, row in enumerate(open(f, encoding="utf-8")):
            if i == 0:
                continue
            eco, name, pgn = row.rstrip("\n").split("\t")
            key = eco + "|" + name
            if key not in name_idx:
                name_idx[key] = len(names)
                names.append(key)
            b = chess.Board()
            moves = [t for t in pgn.split() if not t.endswith(".")]
            for ply, san in enumerate(moves, 1):
                h0 = fnv(b.epd())
                mv = b.push_san(san)
                pos.setdefault(h0, [-1, 99, set()])[2].add(mv.uci())
                h = fnv(b.epd())
                e = pos.setdefault(h, [-1, 99, set()])
                if ply == len(moves) and (e[0] < 0 or ply < e[1]):
                    e[0], e[1] = name_idx[key], ply
    rows = []
    for h, (ni, _, nxt) in pos.items():
        rows.append(f'{b36(h)},{b36(ni) if ni >= 0 else ""},{" ".join(sorted(nxt))}')
    print("/* Дебюты: база lichess chess-openings (CC0, github.com/lichess-org/chess-openings),")
    print("   собрано assets/build-openings.py. OPENING_NAMES — «ECO|название»; OPENING_POS —")
    print("   «хэш позиции,номер названия,книжные продолжения» через «;». */")
    print("export const OPENING_NAMES = [")
    print(",\n".join('"' + n.replace('"', "'") + '"' for n in names))
    print("];")
    print('export const OPENING_POS = "' + ";".join(rows) + '";')
    print(f"// позиций: {len(rows)}, названий: {len(names)}", file=sys.stderr)


if __name__ == "__main__":
    main(sys.argv[1])
