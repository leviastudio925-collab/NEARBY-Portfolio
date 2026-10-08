"""Original axonometric exploded-home diagram for the NEARBY portfolio.

The room arrangement is a design simulation, not sensor output.
All marks are generated as SVG vectors so the Figma graphic stays scalable.
"""
from __future__ import annotations

from html import escape
from pathlib import Path

OUT = Path(__file__).parent / "assets" / "home_exploded_axono.svg"
W, H = 1800, 1100
INK = "#65584F"
MUTED = "#9E8E82"
ORANGE = "#F28A2E"
LIGHT = "#F8F3EE"
CREAM = "#FFFDFB"
TAN = "#E5CEB9"
SHADE = "#EDE3D9"
parts: list[str] = []


def emit(s: str) -> None:
    parts.append(s)


def P(x: float, y: float, z: float = 0, dx: float = 0, dy: float = 0):
    return (900 + (x - y) * 77 + dx, 648 + (x + y) * 24 - z * 100 + dy)


def fmt(points) -> str:
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in points)


def poly(points, fill=CREAM, stroke=INK, sw=2.4, opacity=1):
    emit(
        f'<polygon points="{fmt(points)}" fill="{fill}" stroke="{stroke}" '
        f'stroke-width="{sw}" stroke-linejoin="round" opacity="{opacity}"/>'
    )


def line(points, stroke=INK, sw=2.2, dash=None, opacity=1):
    dashed = f' stroke-dasharray="{dash}"' if dash else ""
    emit(
        f'<polyline points="{fmt(points)}" fill="none" stroke="{stroke}" '
        f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"'
        f'{dashed} opacity="{opacity}"/>'
    )


def ellipse(cx, cy, rx, ry, fill, stroke=INK, sw=2):
    emit(
        f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
    )


def box(x, y, z, w, d, h, top=CREAM, left=SHADE, right=LIGHT, dx=0, dy=0, sw=2.2):
    a = P(x, y, z, dx, dy)
    b = P(x + w, y, z, dx, dy)
    c = P(x + w, y + d, z, dx, dy)
    q = P(x, y + d, z, dx, dy)
    A = P(x, y, z + h, dx, dy)
    B = P(x + w, y, z + h, dx, dy)
    C = P(x + w, y + d, z + h, dx, dy)
    Q = P(x, y + d, z + h, dx, dy)
    poly([q, c, C, Q], left, sw=sw)
    poly([b, c, C, B], right, sw=sw)
    poly([A, B, C, Q], top, sw=sw)


def label(text, x, y, size=19, fill=INK, weight=500, tracking=2):
    emit(
        f'<text x="{x:.1f}" y="{y:.1f}" fill="{fill}" '
        f'font-family="IBM Plex Sans,Arial,sans-serif" font-size="{size}" '
        f'font-weight="{weight}" letter-spacing="{tracking}">{escape(text)}</text>'
    )


def slab(x0, y0, x1, y1, z, fill=CREAM, dx=0, dy=0, sw=3.2):
    poly(
        [P(x0, y0, z, dx, dy), P(x1, y0, z, dx, dy),
         P(x1, y1, z, dx, dy), P(x0, y1, z, dx, dy)],
        fill, sw=sw
    )


emit(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
emit('<rect width="1800" height="1100" fill="#FFFFFF"/>')

# Ghosted projection lines tie the separated room studies to the base plan.
for x, y, dx, dy in [
    (0.4, 0.4, -138, -12), (4.1, 2.7, -138, -12),
    (4.7, 0.4, 156, -26), (7.6, 2.1, 156, -26),
    (1.1, 4.4, -120, 34), (7.3, 4.3, 145, 40),
]:
    line([P(x, y, 0.12), P(x, y, 4.45, dx, dy)], MUTED, 2.0, "10 11", .58)

# Low plan layer, with real room geometry matching the Figma caregiver map.
box(0, 0, 0, 8, 5, .12, top="#FCFAF7", left="#F0E9E2", right="#EDE6DE", sw=4)
slab(0.13, .13, 4.34, 3.04, .13, "#FAF7F2", sw=2)
slab(4.47, .13, 7.86, 2.35, .13, "#FFF3E8", sw=2)
slab(4.47, 2.48, 7.86, 3.02, .13, "#F6F1EC", sw=2)
slab(.13, 3.16, 4.34, 4.87, .13, "#FFF3E8", sw=2)
slab(4.47, 3.16, 7.86, 4.87, .13, "#FCEBDE", sw=2)
for path in [
    [(4.4, 0), (4.4, 5)],
    [(0, 3.1), (8, 3.1)],
    [(4.4, 2.4), (8, 2.4)],
]:
    line([P(x, y, .16) for x, y in path], INK, 5.4)
# Plan fixtures as thin architectural outlines.
slab(.75, .85, 2.6, 1.55, .16, "#FFFFFF", sw=2)
slab(5.3, .6, 7.1, 1.6, .16, "#FFFFFF", sw=2)
slab(.65, 3.6, 1.2, 4.7, .16, "#FFFFFF", sw=2)
slab(5.1, 3.55, 7.2, 4.5, .16, "#FFE3CE", sw=1.5)

# Faint orange proposed route from living stop A, through hall, to bedroom B.
route = [(2.25, 1.75), (3.55, 1.75), (4.95, 2.75), (6.3, 2.75), (6.45, 1.28)]
line([P(x, y, .2) for x, y in route], ORANGE, 8, "18 12", .94)
for t, (x, y) in [("A", route[0]), ("B", route[-1])]:
    px, py = P(x, y, .22)
    ellipse(px, py, 19, 15, ORANGE, ORANGE, 1)
    label(t, px - 7, py + 7, 21, "#FFFFFF", 700, 0)

# Middle lifted wall shell. A cutaway front makes the rooms legible.
z = 2.22
box(0, 0, z, 8, 5, .10, top="#FFFCF9", left="#EFE6DD", right="#EEE5DC", sw=3.4)
slab(.13, .13, 4.34, 3.04, z + .11, "#FBF7F2", sw=1.8)
slab(4.47, .13, 7.86, 2.35, z + .11, "#FFF5EB", sw=1.8)
slab(.13, 3.16, 4.34, 4.87, z + .11, "#FFF4EA", sw=1.8)
slab(4.47, 3.16, 7.86, 4.87, z + .11, "#FFF1E6", sw=1.8)
box(0, 0, z + .11, 8, .13, 1.30, top="#F5ECE3", left="#EADDD1", right="#F3EBE3", sw=2.6)
box(0, 0, z + .11, .13, 5, 1.30, top="#F5ECE3", left="#EADDD1", right="#F3EBE3", sw=2.6)
box(4.37, 0, z + .11, .13, 5, .72, top="#EAD7C5", left="#DCC9B6", right="#F3E5D8", sw=2.3)
box(0, 3.04, z + .11, 8, .13, .57, top="#EAD7C5", left="#DCC9B6", right="#F3E5D8", sw=2.3)
box(7.87, 0, z + .11, .13, 5, .50, top="#F5ECE3", left="#EADDD1", right="#F3EBE3", sw=2.2)
box(0, 4.87, z + .11, 8, .13, .48, top="#F5ECE3", left="#EADDD1", right="#F3EBE3", sw=2.2)

# Furniture in the middle model: cabinet in the living room and the two agreed landmarks.
box(1.02, .82, z + .12, 1.78, .73, .24, top="#FFFDFB", left="#E9DED4", right="#F5EDE5")
box(2.95, 1.10, z + .12, .40, .42, .72, top="#FFFFFF", left="#E7D3C0", right="#F4E9DD")
box(3.03, 1.13, z + .86, .25, .17, .17, top=ORANGE, left="#D66E1C", right="#F9AB62", sw=1.4)
box(5.15, .76, z + .12, 1.72, 1.0, .25, top="#FFFFFF", left="#E7DDD3", right="#F5EEE8")
box(.72, 3.55, z + .12, 2.52, .35, .53, top="#F6E7D8", left="#DECDBB", right="#FAF1E9")
box(5.17, 3.57, z + .12, 1.89, .84, .09, top="#FFE0C8", left="#F5C49D", right="#FFEAD8", sw=1.5)

# Two large separated everyday scenes above the cutaway model.
za = 4.73
dx_l, dy_l = -138, -12
slab(.32, .24, 4.05, 2.85, za, "#FFFFFF", dx_l, dy_l, 3.3)
box(.63, .62, za, 2.30, .72, .34, top="#FFFFFF", left="#E9DED5", right="#F8F1EB", dx=dx_l, dy=dy_l)
box(.58, .59, za + .34, 2.36, .16, .46, top="#E5CFBB", left="#D8BDA6", right="#EDDAC8", dx=dx_l, dy=dy_l)
box(3.10, .58, za, .36, 1.45, .78, top="#F8F2EB", left="#E4D6C9", right="#F7EDE3", dx=dx_l, dy=dy_l)
box(1.03, 2.00, za, .65, .46, .43, top="#F6E5D4", left="#DBC5AF", right="#F9EEE4", dx=dx_l, dy=dy_l)
px, py = P(2.58, 1.90, za, dx_l, dy_l)
ellipse(px, py - 22, 10, 10, INK, INK, 1)
line([(px, py - 11), (px, py + 24)], INK, 5)
line([(px, py + 1), (px - 18, py + 12)], INK, 4)
line([(px, py + 1), (px + 16, py + 10)], INK, 4)

dx_b, dy_b = 156, -26
slab(4.70, .22, 7.82, 2.22, za - .25, "#FFFFFF", dx_b, dy_b, 3.3)
box(5.18, .55, za - .25, 1.92, 1.15, .33, top="#FFFFFF", left="#E9DED5", right="#F8F1EB", dx=dx_b, dy=dy_b)
box(5.23, .59, za + .08, 1.86, .22, .08, top="#F0E4D9", left="#DDD0C4", right="#F7EDE5", dx=dx_b, dy=dy_b)
box(7.16, .72, za - .25, .42, .41, .59, top="#E4CBB5", left="#D7BAA1", right="#EEDCCB", dx=dx_b, dy=dy_b)

# Small separate kitchen and restricted bathroom fragments.
dx_k, dy_k = -108, 38
slab(.32, 3.30, 4.02, 4.74, za - .83, "#FFFFFF", dx_k, dy_k, 2.8)
box(.62, 3.52, za - .83, 2.70, .34, .48, top="#E7D0BB", left="#D7BDA6", right="#F5E5D8", dx=dx_k, dy=dy_k)
box(2.55, 4.05, za - .83, .72, .48, .42, top="#FFF8F1", left="#E9DDD1", right="#F9EFE5", dx=dx_k, dy=dy_k)
dx_w, dy_w = 142, 42
slab(4.68, 3.30, 7.82, 4.72, za - .58, "#FFEADB", dx_w, dy_w, 2.8)
for x in [5.03, 5.53, 6.03, 6.53, 7.03]:
    line([P(x, 3.37, za - .57, dx_w, dy_w),
          P(x + .50, 4.63, za - .57, dx_w, dy_w)], "#DB9D72", 1.3, opacity=.75)

# The label system is added as native, editable IBM Plex Sans text in Figma.
emit("</svg>")
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("\n".join(parts), encoding="utf-8")
print(f"{OUT} / {len(parts)} elements / {OUT.stat().st_size} bytes")
