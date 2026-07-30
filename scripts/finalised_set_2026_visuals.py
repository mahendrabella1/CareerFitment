# -*- coding: utf-8 -*-
"""Inline SVG artwork for the aptitude items that need it.

The 2026 set arrived with one visual item (the gears) against the old bank's
four, and two items — the paper fold and the shape series — were flagged
"artwork required" while carrying no artwork at all. A student was being asked
"how many punches appear?" with nothing to look at, which is a guess, not a
puzzle.

Everything here is inline SVG with no external references, matching how the old
bank stored its figures, so it renders inside the exam with no asset pipeline.

    Q16  two-bar chart      makes "Data Interpretation" involve reading data
    Q17  fold-and-punch     four panels; the unfolded answer is deliberately hidden
    Q20  shape series       3/5/7 groups drawn, with five drawn ANSWER options
"""

INK = "#1f2937"
GREY = "#94a3b8"
BLUE = "#2563eb"
FILL = "#ffffff"
SOFT = "#f2f3f5"


def _wrap(w, h, body, width=None, height=None):
    return (f'<svg viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg" '
            f'width="{width or w}" height="{height or h}">{body}</svg>')


# --------------------------------------------------------------------------- #
# Q16 — electricity usage, January 1,200 kWh vs February 900 kWh
# --------------------------------------------------------------------------- #
def bar_chart() -> str:
    base, top, left = 190, 30, 60
    scale = (base - top) / 1400.0
    body = [
        f'<line x1="{left - 12}" y1="{base}" x2="330" y2="{base}" stroke="{INK}" stroke-width="2.5"/>',
        f'<line x1="{left - 12}" y1="{base}" x2="{left - 12}" y2="{top - 8}" stroke="{INK}" stroke-width="2.5"/>',
    ]
    for v in (0, 400, 800, 1200):
        y = base - v * scale
        body.append(f'<line x1="{left - 18}" y1="{y:.1f}" x2="{left - 12}" y2="{y:.1f}" '
                    f'stroke="{INK}" stroke-width="2"/>')
        body.append(f'<text x="{left - 24}" y="{y + 5:.1f}" text-anchor="end" '
                    f'font-family="Inter, sans-serif" font-size="15" fill="{INK}">{v}</text>')
    for i, (label, val, colour) in enumerate((("January", 1200, BLUE), ("February", 900, GREY))):
        x = left + 30 + i * 120
        h = val * scale
        body.append(f'<rect x="{x}" y="{base - h:.1f}" width="76" height="{h:.1f}" '
                    f'fill="{colour}" rx="3"/>')
        body.append(f'<text x="{x + 38}" y="{base - h - 10:.1f}" text-anchor="middle" '
                    f'font-family="Inter, sans-serif" font-size="17" font-weight="700" '
                    f'fill="{INK}">{val:,}</text>')
        body.append(f'<text x="{x + 38}" y="{base + 24}" text-anchor="middle" '
                    f'font-family="Inter, sans-serif" font-size="16" fill="{INK}">{label}</text>')
    body.append(f'<text x="{left - 24}" y="{top - 14}" text-anchor="start" '
                f'font-family="Inter, sans-serif" font-size="14" fill="{GREY}">kWh</text>')
    return _wrap(360, 220, "".join(body))


# --------------------------------------------------------------------------- #
# Q17 — a square folded twice, then a triangular punch through all layers.
#       Four panels. The unfolded result is NOT shown; that is the question.
# --------------------------------------------------------------------------- #
def fold_and_punch() -> str:
    body, x0, y0, s = [], 16, 40, 84
    captions = ["Start", "Fold once", "Fold twice", "Punch"]
    for i in range(4):
        x = x0 + i * 108
        if i == 0:
            body.append(f'<rect x="{x}" y="{y0}" width="{s}" height="{s}" fill="{FILL}" '
                        f'stroke="{INK}" stroke-width="2.5"/>')
        elif i == 1:
            body.append(f'<rect x="{x}" y="{y0 + s / 2}" width="{s}" height="{s / 2}" fill="{SOFT}" '
                        f'stroke="{INK}" stroke-width="2.5"/>')
            body.append(f'<line x1="{x}" y1="{y0 + s / 2}" x2="{x + s}" y2="{y0 + s / 2}" '
                        f'stroke="{INK}" stroke-width="2.5" stroke-dasharray="5 4"/>')
        else:
            body.append(f'<rect x="{x}" y="{y0 + s / 2}" width="{s / 2}" height="{s / 2}" fill="{SOFT}" '
                        f'stroke="{INK}" stroke-width="2.5"/>')
            body.append(f'<line x1="{x + s / 2}" y1="{y0 + s / 2}" x2="{x + s / 2}" y2="{y0 + s}" '
                        f'stroke="{INK}" stroke-width="2.5" stroke-dasharray="5 4"/>')
            if i == 3:
                cx, cy = x + s / 4, y0 + s * 0.72
                body.append(f'<polygon points="{cx},{cy - 13} {cx + 12},{cy + 8} {cx - 12},{cy + 8}" '
                            f'fill="{FILL}" stroke="{BLUE}" stroke-width="2.5"/>')
        if i < 3:
            ax = x + s + 8
            body.append(f'<line x1="{ax}" y1="{y0 + s * 0.75}" x2="{ax + 14}" y2="{y0 + s * 0.75}" '
                        f'stroke="{GREY}" stroke-width="2.5"/>')
            body.append(f'<polygon points="{ax + 20},{y0 + s * 0.75} {ax + 12},{y0 + s * 0.75 - 5} '
                        f'{ax + 12},{y0 + s * 0.75 + 5}" fill="{GREY}"/>')
        body.append(f'<text x="{x + s / 2}" y="{y0 + s + 26}" text-anchor="middle" '
                    f'font-family="Inter, sans-serif" font-size="14" fill="{INK}">{captions[i]}</text>')
    body.append(f'<text x="228" y="26" text-anchor="middle" font-family="Inter, sans-serif" '
                f'font-size="15" font-weight="700" fill="{GREY}">Unfold it — how many holes?</text>')
    return _wrap(456, 168, "".join(body))


# --------------------------------------------------------------------------- #
# Q20 — 3 circles, 5 triangles, 7 squares, then "?"; answers are drawn too.
# --------------------------------------------------------------------------- #
def _shape(kind: str, cx: float, cy: float, r: float) -> str:
    if kind == "circle":
        return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{INK}"/>'
    if kind == "triangle":
        return (f'<polygon points="{cx},{cy - r} {cx + r * 0.95},{cy + r * 0.75} '
                f'{cx - r * 0.95},{cy + r * 0.75}" fill="{INK}"/>')
    if kind == "square":
        return f'<rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" fill="{INK}"/>'
    import math
    sides = {"pentagon": 5, "hexagon": 6, "heptagon": 7}[kind]
    pts = " ".join(
        f"{cx + r * math.sin(2 * math.pi * i / sides):.1f},{cy - r * math.cos(2 * math.pi * i / sides):.1f}"
        for i in range(sides))
    return f'<polygon points="{pts}" fill="{INK}"/>'


def _group(kind: str, n: int, x: float, y: float, r: float = 8.5, per_row: int = 4) -> str:
    out = []
    for i in range(n):
        col, row = i % per_row, i // per_row
        out.append(_shape(kind, x + col * (r * 2.6), y + row * (r * 2.6), r))
    return "".join(out)


def shape_series() -> str:
    body, groups = [], [("circle", 3), ("triangle", 5), ("square", 7)]
    for i, (kind, n) in enumerate(groups):
        x = 24 + i * 118
        body.append(_group(kind, n, x + 14, 38))
        body.append(f'<text x="{x + 46}" y="112" text-anchor="middle" '
                    f'font-family="Inter, sans-serif" font-size="15" fill="{GREY}">{n}</text>')
    body.append(f'<rect x="378" y="20" width="86" height="76" rx="6" fill="{FILL}" '
                f'stroke="{GREY}" stroke-width="2.5" stroke-dasharray="6 5"/>')
    body.append(f'<text x="421" y="72" text-anchor="middle" font-family="Inter, sans-serif" '
                f'font-size="34" font-weight="800" fill="{GREY}">?</text>')
    return _wrap(486, 126, "".join(body))


def shape_options() -> list[str]:
    """Five drawn answers, matching the option text order for Q20."""
    spec = [("hexagon", 8), ("pentagon", 9), ("hexagon", 9), ("heptagon", 10), ("hexagon", 11)]
    out = []
    for kind, n in spec:
        rows = (n + 3) // 4
        h = 30 + rows * 22
        body = (f'<rect x="2" y="2" width="130" height="{h - 4}" rx="6" fill="{FILL}" '
                f'stroke="#cbd5e1" stroke-width="2"/>' + _group(kind, n, 26, 24, r=7.5))
        out.append(_wrap(134, h, body))
    return out


MEDIA = {
    "Q16": lambda: {"type": "figure", "svg": bar_chart()},
    "Q17": lambda: {"type": "figure", "svg": fold_and_punch()},
    "Q20": lambda: {"type": "figure", "svg": shape_series()},
}
SVG_OPTIONS = {"Q20": shape_options}
