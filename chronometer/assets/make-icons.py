#!/usr/bin/env python3
"""Генератор иконок приложения «Хронометр».

Рисует секундомер (оранжевое кольцо + голубая стрелка) на тёмном фоне
и сохраняет PNG нужных размеров рядом с index.html.
Запуск: python3 assets/make-icons.py
"""
import math
import os
import struct
import zlib

BG = (2, 6, 23)          # slate-950
RING = (249, 115, 22)    # orange-500
HAND = (34, 211, 238)    # cyan-400
SS = 4                   # супер-сэмплинг для сглаживания


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


def coverage(cx, cy, shape):
    """Доля площади пикселя, покрытая фигурой (супер-сэмплинг SS x SS)."""
    hits = 0
    for sy in range(SS):
        for sx in range(SS):
            u = cx + (sx + 0.5) / SS
            v = cy + (sy + 0.5) / SS
            if shape(u, v):
                hits += 1
    return hits / (SS * SS)


def build(size):
    s = float(size)

    def ring(u, v):
        # кольцо циферблата
        dx, dy = u / s - 0.5, v / s - 0.56
        d = math.hypot(dx, dy)
        return 0.30 <= d <= 0.375

    def stem(u, v):
        # заводная головка сверху
        x, y = u / s, v / s
        return 0.455 <= x <= 0.545 and 0.115 <= y <= 0.205

    def hand(u, v):
        # стрелка из центра вправо-вверх
        x, y = u / s - 0.5, v / s - 0.56
        ang = math.radians(-52)
        ux, uy = math.cos(ang), math.sin(ang)
        along = x * ux + y * uy
        across = abs(-x * uy + y * ux)
        return 0.0 <= along <= 0.235 and across <= 0.026

    def pixel(px, py):
        r, g, b = BG
        for shape, color in ((ring, RING), (stem, RING), (hand, HAND)):
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
        write_png(os.path.join(out, f"icon-{n}.png"), n, build(n))
        print("icon-%d.png" % n)
