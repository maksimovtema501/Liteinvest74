#!/usr/bin/env python3
"""Генератор иконок приложения «Планер».

Рисует календарь с галочкой (фиолетовая рамка + бирюзовая галка)
на тёмном фоне и сохраняет PNG нужных размеров рядом с index.html.
Запуск: python3 assets/make-icons.py
"""
import math
import os
import struct
import zlib

BG     = (2, 6, 23)        # slate-950
FRAME  = (139, 92, 246)    # violet-500
CHECK  = (34, 211, 238)    # cyan-400
SS     = 4                 # супер-сэмплинг для сглаживания


def write_png(path, size, get_pixel):
    rows = []
    for y in range(size):
        row = bytearray(b"\x00")
        for x in range(size):
            row += bytes(get_pixel(x, y))
        rows.append(bytes(row))
    raw = b"".join(rows)

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    header = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    png = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", header)
           + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))
    with open(path, "wb") as fh:
        fh.write(png)


def rrect(u, v, x0, y0, x1, y1, r):
    """Прямоугольник со скруглёнными углами."""
    dx = max(x0 + r - u, 0.0, u - (x1 - r))
    dy = max(y0 + r - v, 0.0, v - (y1 - r))
    return math.hypot(dx, dy) <= r


def segment(u, v, ax, ay, bx, by, w):
    """Отрезок толщиной w с круглыми концами."""
    dx, dy = bx - ax, by - ay
    t = ((u - ax) * dx + (v - ay) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    return math.hypot(u - (ax + t * dx), v - (ay + t * dy)) <= w / 2


def coverage(cx, cy, shape):
    """Доля площади пикселя, покрытая фигурой (супер-сэмплинг SS x SS)."""
    hits = 0
    for sy in range(SS):
        for sx in range(SS):
            if shape(cx + (sx + 0.5) / SS, cy + (sy + 0.5) / SS):
                hits += 1
    return hits / (SS * SS)


def build(size):
    s = float(size)

    def frame(u, v):
        # рамка календаря: внешний скруглённый прямоугольник минус внутренний
        x, y = u / s, v / s
        outer = rrect(x, y, 0.15, 0.24, 0.85, 0.87, 0.10)
        inner = rrect(x, y, 0.215, 0.305, 0.785, 0.805, 0.055)
        return outer and not inner

    def header(u, v):
        # верхняя полоса «шапки» календаря
        x, y = u / s, v / s
        return rrect(x, y, 0.15, 0.24, 0.85, 0.40, 0.10) and y >= 0.24

    def rings(u, v):
        # два «кольца» крепления сверху
        x, y = u / s, v / s
        return (rrect(x, y, 0.315, 0.12, 0.405, 0.28, 0.045)
                or rrect(x, y, 0.595, 0.12, 0.685, 0.28, 0.045))

    def tick(u, v):
        # галочка внутри календаря
        x, y = u / s, v / s
        return (segment(x, y, 0.315, 0.615, 0.435, 0.725, 0.075)
                or segment(x, y, 0.425, 0.725, 0.695, 0.475, 0.075))

    def pixel(px, py):
        r, g, b = BG
        for shape, color in ((frame, FRAME), (header, FRAME), (rings, FRAME), (tick, CHECK)):
            a = coverage(px, py, shape)
            if a:
                r = round(r * (1 - a) + color[0] * a)
                g = round(g * (1 - a) + color[1] * a)
                b = round(b * (1 - a) + color[2] * a)
        return r, g, b

    return pixel


if __name__ == "__main__":
    out = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for n in (180, 192, 512):
        write_png(os.path.join(out, "icon-%d.png" % n), n, build(n))
        print("icon-%d.png" % n)
