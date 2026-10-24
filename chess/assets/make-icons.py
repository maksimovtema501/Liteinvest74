#!/usr/bin/env python3
"""Генератор иконок приложения «Шахматы».

Рисует белую пешку с тенью на зелёном фоне и сохраняет PNG нужных
размеров рядом с index.html. Запуск: python3 assets/make-icons.py
"""
import math
import os
import struct
import zlib

BG     = (129, 182, 76)    # зелёный, как кнопки приложения
SHADOW = (93, 139, 52)
PAWN   = (255, 255, 255)
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


def pawn(x, y):
    """Силуэт пешки в координатах 0..1."""
    head = math.hypot(x - 0.5, y - 0.31) <= 0.105
    collar = rrect(x, y, 0.37, 0.415, 0.63, 0.47, 0.03)
    # тело — трапеция, расширяющаяся книзу, с вогнутыми боками
    body = False
    if 0.44 <= y <= 0.72:
        t = (y - 0.44) / 0.28
        half = 0.085 + 0.13 * t * t
        body = abs(x - 0.5) <= half
    base = rrect(x, y, 0.27, 0.70, 0.73, 0.79, 0.035)
    return head or collar or body or base


def coverage(cx, cy, shape):
    hits = 0
    for sy in range(SS):
        for sx in range(SS):
            if shape(cx + (sx + 0.5) / SS, cy + (sy + 0.5) / SS):
                hits += 1
    return hits / (SS * SS)


def build(size):
    s = float(size)

    def shadow(u, v):
        return pawn(u / s - 0.025, v / s - 0.025)

    def piece(u, v):
        return pawn(u / s, v / s)

    def pixel(px, py):
        r, g, b = BG
        for shape, color in ((shadow, SHADOW), (piece, PAWN)):
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
