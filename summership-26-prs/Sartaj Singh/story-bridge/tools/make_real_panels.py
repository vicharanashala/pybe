#!/usr/bin/env python3
"""
Generates the flat SVG panel art for the Real World collection.

A separate generator from make_panels.py on purpose: the folk tales are drawn in
manuscript pigments, these are drawn as an incident file — newsprint ground, ink, one
signal accent, and objects (screens, tickets, counters) rather than animals. People are
plain figures with no faces. No logos. Run from the submission root:

    python tools/make_real_panels.py

Output: client/public/real/<storyId>/panel-N.svg
"""

import os
import textwrap
from xml.sax.saxutils import escape

OUT = os.path.join(os.path.dirname(__file__), "..", "client", "public", "real")

W, H = 800, 600

# Incident-file palette — must match `.sb-root.is-real` in client/src/stories/stories.css
PAPER = "#ebeae5"
PAPER_WARM = "#f7f6f2"
INK = "#17191e"
INK_SOFT = "#545a66"
SLATE = "#1d2330"
SIGNAL = "#c9481a"
TEAL = "#1f6a66"
RULE = "#cfcdc4"


def svg(body, ground=PAPER, grid=True):
    """Paper ground with a faint graph-paper grid and a single ink border."""
    lines = ""
    if grid:
        lines = "".join(
            f'<line x1="{x}" y1="0" x2="{x}" y2="{H}" stroke="{RULE}" stroke-width="1"/>'
            for x in range(40, W, 40)
        ) + "".join(
            f'<line x1="0" y1="{y}" x2="{W}" y2="{y}" stroke="{RULE}" stroke-width="1"/>'
            for y in range(40, H, 40)
        )
    return textwrap.dedent(f"""\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">
      <rect width="{W}" height="{H}" fill="{ground}"/>
      <g opacity="0.55">{lines}</g>
      {body}
      <rect x="10" y="10" width="{W-20}" height="{H-20}" fill="none" stroke="{INK}" stroke-width="1.5" opacity="0.7"/>
    </svg>
    """)


def text(x, y, value, size=22, fill=INK, anchor="middle", weight=500, family="IBM Plex Mono, monospace", spacing=0):
    # xml:space="preserve" because runs of spaces are how the register and table rows line
    # their columns up, and SVG collapses them to one by default.
    return (
        f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{fill}" font-family="{family}" '
        f'font-size="{size}" font-weight="{weight}" letter-spacing="{spacing}" '
        f'xml:space="preserve">{escape(str(value))}</text>'
    )


def figure(x, y, s=1.0, fill=SLATE):
    """A plain standing person: head and body, no face. (x, y) is the feet."""
    return f"""
    <g transform="translate({x},{y}) scale({s})" fill="{fill}">
      <circle cx="0" cy="-142" r="22"/>
      <path d="M -34 -112 Q 0 -124 34 -112 L 40 -40 L 24 -40 L 20 0 L 4 0 L 0 -38 L -4 0 L -20 0 L -24 -40 L -40 -40 Z"/>
    </g>"""


def device(x, y, w=150, h=250, screen="", body=SLATE, glass=PAPER_WARM):
    """A handheld device — phone or music player. `screen` is markup in screen coordinates
    (0,0 at the screen's top-left; the screen is w-24 by h*0.62)."""
    sw, sh = w - 24, h * 0.62
    return f"""
    <g transform="translate({x - w / 2},{y - h / 2})">
      <rect width="{w}" height="{h}" rx="18" fill="{body}"/>
      <rect x="12" y="14" width="{sw}" height="{sh}" rx="4" fill="{glass}"/>
      <g transform="translate(12,14)">{screen}</g>
      <circle cx="{w / 2}" cy="{14 + sh + (h - 14 - sh) / 2}" r="{min(w, h) * 0.13}" fill="none" stroke="{glass}" stroke-width="3" opacity="0.6"/>
    </g>"""


def keypad(x, y, s=1.0, fill=SLATE, lit=None):
    """A 3x4 PIN pad. `lit` is a set of key labels drawn in the signal colour."""
    lit = lit or set()
    keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""]
    cells = []
    for i, label in enumerate(keys):
        if not label:
            continue
        cx, cy = (i % 3) * 58, (i // 3) * 58
        colour = SIGNAL if label in lit else fill
        cells.append(f'<circle cx="{cx}" cy="{cy}" r="23" fill="none" stroke="{colour}" stroke-width="3"/>')
        cells.append(text(cx, cy + 8, label, 22, colour))
    return f'<g transform="translate({x},{y}) scale({s})">{"".join(cells)}</g>'


def digits(x, y, value, cell=46, fill=INK, box=PAPER_WARM, stroke=INK, accent=None):
    """A row of boxed characters, like an odometer or a two-digit year field.
    `accent` is a set of positions drawn in the signal colour."""
    accent = accent or set()
    value = str(value)
    left = x - len(value) * cell / 2
    parts = []
    for i, ch in enumerate(value):
        colour = SIGNAL if i in accent else fill
        bx = left + i * cell
        parts.append(f'<rect x="{bx + 2}" y="{y - cell * 0.8}" width="{cell - 4}" height="{cell * 1.1}" fill="{box}" stroke="{stroke}" stroke-width="2"/>')
        parts.append(text(bx + cell / 2, y + cell * 0.1, ch, cell * 0.62, colour))
    return "".join(parts)


def ticket(x, y, w=240, h=120, lines=(), fill=PAPER_WARM, stamp=None):
    """A printed ticket or slip with a perforated left edge. `lines` are text rows."""
    holes = "".join(f'<circle cx="0" cy="{yy}" r="5" fill="{PAPER}"/>' for yy in range(14, int(h), 18))
    rows = "".join(text(24, 34 + i * 26, line, 18, INK, "start") for i, line in enumerate(lines))
    mark = ""
    if stamp:
        mark = (
            f'<g transform="translate({w - 70},{h / 2}) rotate(-12)">'
            f'<rect x="-58" y="-20" width="116" height="40" fill="none" stroke="{SIGNAL}" stroke-width="3"/>'
            f'{text(0, 8, stamp, 20, SIGNAL, weight=700)}</g>'
        )
    return f"""
    <g transform="translate({x - w / 2},{y - h / 2})">
      <rect width="{w}" height="{h}" fill="{fill}" stroke="{INK}" stroke-width="2"/>
      {holes}{rows}{mark}
    </g>"""


def page(x, y, w=300, h=340, rows=(), header="", ticks=None, fill=PAPER_WARM):
    """A ruled register page. `rows` are text lines; `ticks` maps row index -> mark."""
    ticks = ticks or {}
    parts = [f'<rect width="{w}" height="{h}" fill="{fill}" stroke="{INK}" stroke-width="2"/>']
    if header:
        parts.append(f'<rect width="{w}" height="44" fill="{SLATE}"/>')
        parts.append(text(w / 2, 30, header, 18, PAPER_WARM, weight=700, spacing=2))
    for i, row in enumerate(rows):
        ry = 76 + i * 34
        parts.append(f'<line x1="16" y1="{ry + 10}" x2="{w - 16}" y2="{ry + 10}" stroke="{RULE}" stroke-width="2"/>')
        parts.append(text(24, ry, row, 18, INK, "start"))
        if i in ticks:
            parts.append(text(w - 34, ry, ticks[i], 20, SIGNAL, weight=700))
    return f'<g transform="translate({x - w / 2},{y - h / 2})">{"".join(parts)}</g>'


def chart(x, y, w=520, h=260, points=(), colour=SIGNAL, ghost=None):
    """Axes and a polyline. `points` are (0..1, 0..1) pairs; `ghost` is a second, dashed line."""
    def poly(pts):
        return " ".join(f"{px * w:.1f},{h - py * h:.1f}" for px, py in pts)
    extra = ""
    if ghost:
        extra = f'<polyline points="{poly(ghost)}" fill="none" stroke="{TEAL}" stroke-width="4" stroke-dasharray="10 8"/>'
    return f"""
    <g transform="translate({x - w / 2},{y - h / 2})">
      <line x1="0" y1="0" x2="0" y2="{h}" stroke="{INK}" stroke-width="2"/>
      <line x1="0" y1="{h}" x2="{w}" y2="{h}" stroke="{INK}" stroke-width="2"/>
      {extra}
      <polyline points="{poly(points)}" fill="none" stroke="{colour}" stroke-width="5" stroke-linejoin="round"/>
    </g>"""


def arrow(x1, y1, x2, y2, colour=INK, width=4):
    import math
    angle = math.atan2(y2 - y1, x2 - x1)
    hx1 = x2 - 16 * math.cos(angle - 0.45)
    hy1 = y2 - 16 * math.sin(angle - 0.45)
    hx2 = x2 - 16 * math.cos(angle + 0.45)
    hy2 = y2 - 16 * math.sin(angle + 0.45)
    return (
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{colour}" stroke-width="{width}" stroke-linecap="round"/>'
        f'<polygon points="{x2},{y2} {hx1:.1f},{hy1:.1f} {hx2:.1f},{hy2:.1f}" fill="{colour}"/>'
    )


def stamp(x, y, label, colour=SIGNAL, angle=-10, size=30):
    """A rubber-stamp mark: FROZEN, BLOCKED, REFUNDED."""
    w = len(label) * size * 0.68 + 30
    return (
        f'<g transform="translate({x},{y}) rotate({angle})">'
        f'<rect x="{-w / 2}" y="{-size * 0.85}" width="{w}" height="{size * 1.5}" fill="none" stroke="{colour}" stroke-width="4"/>'
        f'{text(0, size * 0.28, label, size, colour, weight=700, spacing=3)}</g>'
    )


def caption(value, y=None, fill=INK_SOFT):
    y = y if y is not None else H - 46
    return (
        f'<text x="{W/2}" y="{y}" text-anchor="middle" fill="{fill}" '
        f'font-family="IBM Plex Mono, monospace" font-size="19" letter-spacing="2.5">{escape(value)}</text>'
    )


def loop_back(cx, cy, r=70, colour=SIGNAL):
    """A near-full circle with an arrowhead: going round and arriving where it started."""
    return (
        f'<path d="M {cx + r} {cy} A {r} {r} 0 1 1 {cx + r * 0.7} {cy - r * 0.72}" fill="none" '
        f'stroke="{colour}" stroke-width="6" stroke-linecap="round"/>'
        f'<polygon points="{cx + r + 11},{cy - 4} {cx + r - 11},{cy - 4} {cx + r},{cy + 14}" fill="{colour}"/>'
    )


def battery(x, y, level=0.0, colour=INK):
    fill_w = 64 * level
    return (
        f'<rect x="{x}" y="{y}" width="76" height="36" rx="5" fill="none" stroke="{colour}" stroke-width="4"/>'
        f'<rect x="{x + 76}" y="{y + 11}" width="8" height="14" fill="{colour}"/>'
        + (f'<rect x="{x + 6}" y="{y + 6}" width="{fill_w}" height="24" fill="{TEAL}"/>' if level else "")
    )


def calendar(x, y, day, month, year, w=170, colour=SLATE):
    return (
        f'<g transform="translate({x - w / 2},{y})">'
        f'<rect width="{w}" height="{w * 1.05}" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
        f'<rect width="{w}" height="{w * 0.28}" fill="{colour}"/>'
        f'{text(w / 2, w * 0.2, month, w * 0.14, PAPER_WARM, weight=700, spacing=2)}'
        f'{text(w / 2, w * 0.72, day, w * 0.38, INK, weight=700, family="Karla, sans-serif")}'
        f'{text(w / 2, w * 0.94, year, w * 0.12, INK_SOFT)}</g>'
    )


def tries(x, y, used, total=3, gap=62, r=22):
    """Attempt markers: `used` of `total` crossed out in the signal colour."""
    parts = []
    for i in range(total):
        cx = x + (i - (total - 1) / 2) * gap
        if i < used:
            parts.append(f'<circle cx="{cx}" cy="{y}" r="{r}" fill="none" stroke="{SIGNAL}" stroke-width="4"/>')
            parts.append(f'<path d="M {cx - 11} {y - 11} L {cx + 11} {y + 11} M {cx + 11} {y - 11} L {cx - 11} {y + 11}" stroke="{SIGNAL}" stroke-width="4" stroke-linecap="round"/>')
        else:
            parts.append(f'<circle cx="{cx}" cy="{y}" r="{r}" fill="none" stroke="{INK_SOFT}" stroke-width="4"/>')
    return "".join(parts)


def pay_screen(amount, note="ENTER UPI PIN", note_fill=INK_SOFT):
    return (
        text(63, 44, "PAY", 13, INK_SOFT, spacing=3)
        + text(63, 82, amount, 28, INK, weight=700)
        + text(63, 128, note, 11, note_fill, spacing=1)
    )


def bubble(x, y, lines, w=270, fill=PAPER_WARM, edge=INK):
    """An SMS-style message bubble. (x, y) is the top-left corner."""
    h = 26 + len(lines) * 26
    rows = "".join(text(x + 18, y + 34 + i * 26, line, 17, INK, "start") for i, line in enumerate(lines))
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{fill}" stroke="{edge}" stroke-width="2"/>'
        f'<path d="M {x + 24} {y + h} L {x + 18} {y + h + 18} L {x + 44} {y + h}" fill="{fill}" stroke="{edge}" stroke-width="2"/>'
        + rows
    )


def bank(x, y, label, w=190, h=110):
    """A plain building block with a label: a bank, with no logo."""
    return (
        f'<g transform="translate({x - w / 2},{y - h / 2})">'
        f'<polygon points="0,26 {w / 2},0 {w},26" fill="{SLATE}"/>'
        f'<rect y="26" width="{w}" height="{h - 26}" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
        + "".join(f'<rect x="{18 + i * ((w - 36) / 4)}" y="40" width="10" height="{h - 54}" fill="{SLATE}"/>' for i in range(5))
        + f'{text(w / 2, h + 26, label, 16, INK, weight=700, spacing=2)}</g>'
    )


def cell(x, y, label, w=180, h=56, accent=False, strike=False, size=24, fill=PAPER_WARM):
    """A single boxed value: a spreadsheet cell, a name plate, a stored entry."""
    colour = SIGNAL if accent else INK
    mark = ""
    if strike:
        mark = (f'<line x1="{x - w / 2 + 10}" y1="{y}" x2="{x + w / 2 - 10}" y2="{y}" '
                f'stroke="{SIGNAL}" stroke-width="3"/>')
    return (
        f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" fill="{fill}" '
        f'stroke="{colour}" stroke-width="{3 if accent else 2}"/>'
        + text(x, y + size * 0.35, label, size, colour, weight=600) + mark
    )


def charline(x, y, value, cell_w=56, accent=None, fill=INK):
    """Boxed characters laid out left to right FROM x, so two of them line up column
    by column. `digits()` centres instead, which is wrong when you are comparing."""
    accent = accent or set()
    parts = []
    for i, ch in enumerate(value):
        colour = SIGNAL if i in accent else fill
        bx = x + i * cell_w
        parts.append(
            f'<rect x="{bx + 2}" y="{y - cell_w * 0.78}" width="{cell_w - 4}" height="{cell_w * 1.06}" '
            f'fill="{PAPER_WARM}" stroke="{colour}" stroke-width="{3 if i in accent else 2}"/>')
        parts.append(text(bx + cell_w / 2, y + cell_w * 0.1, ch, cell_w * 0.58, colour))
    return "".join(parts)


def bars(x, y, values, labels, w=320, h=180, top=1.0, accent=None):
    """Upright bars standing on a baseline at y, one label under each. `values` are 0..top."""
    accent = accent or set()
    slot = w / len(values)
    parts = [f'<line x1="{x - w / 2}" y1="{y}" x2="{x + w / 2}" y2="{y}" stroke="{INK}" stroke-width="2"/>']
    for i, (v, label) in enumerate(zip(values, labels)):
        bh = h * (v / top)
        bx = x - w / 2 + slot * i + slot * 0.22
        bw = slot * 0.56
        parts.append(f'<rect x="{bx}" y="{y - bh}" width="{bw}" height="{bh}" fill="{SIGNAL if i in accent else INK_SOFT}"/>')
        parts.append(text(bx + bw / 2, y + 26, label, 17, INK))
    return "".join(parts)


def progress(x, y, w=300, frac=1.0, h=26):
    """A progress bar. At frac=1.0 it says the copy finished, which is the whole trap."""
    return (
        f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="{x - w / 2 + 4}" y="{y - h / 2 + 4}" width="{(w - 8) * frac}" height="{h - 8}" fill="{TEAL}"/>'
    )


def pendrive(x, y, s=1.0, angle=0):
    """A pen drive, metal connector to the right. (x, y) is its centre."""
    return (
        f'<g transform="translate({x},{y}) rotate({angle}) scale({s})">'
        f'<rect x="-70" y="-26" width="112" height="52" rx="7" fill="{SLATE}"/>'
        f'<rect x="42" y="-16" width="40" height="32" fill="{INK_SOFT}"/>'
        f'<rect x="-52" y="-12" width="22" height="10" fill="{PAPER_WARM}" opacity="0.7"/></g>'
    )


def slab(x, y, label, w=150, h=96, fill=PAPER_WARM, edge=INK, mark=None, size=16):
    """A labelled block: a build machine, a server, a box of writes not yet sent."""
    parts = [
        f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" fill="{fill}" stroke="{edge}" stroke-width="2"/>']
    if label:
        parts.append(text(x, y + 6, label, size, INK, weight=600, spacing=1))
    if mark:
        parts.append(text(x, y + h / 2 + 28, mark, 30, SIGNAL, weight=700))
    return "".join(parts)


def envelope(x, y, s=1.0, fill=PAPER_WARM):
    return (
        f'<g transform="translate({x},{y}) scale({s})">'
        f'<rect x="-34" y="-23" width="68" height="46" fill="{fill}" stroke="{INK}" stroke-width="2"/>'
        f'<path d="M -34 -23 L 0 4 L 34 -23" fill="none" stroke="{INK}" stroke-width="2"/></g>'
    )


def memstrip(x, y, cells, cw=118, h=54, accent=None, bracket=None):
    """A run of adjacent memory cells. `bracket` is (start, end, label) drawn beneath."""
    accent = accent or set()
    left = x - len(cells) * cw / 2
    parts = []
    for i, label in enumerate(cells):
        cx = left + i * cw
        colour = SIGNAL if i in accent else INK
        parts.append(f'<rect x="{cx}" y="{y - h / 2}" width="{cw - 3}" height="{h}" fill="{PAPER_WARM}" stroke="{colour}" stroke-width="2"/>')
        parts.append(text(cx + (cw - 3) / 2, y + 7, label, 15, colour))
    if bracket:
        a, b, label = bracket
        x1, x2 = left + a * cw, left + b * cw - 3
        by = y + h / 2 + 16
        parts.append(f'<path d="M {x1} {by} L {x1} {by + 12} L {x2} {by + 12} L {x2} {by}" fill="none" stroke="{SIGNAL}" stroke-width="3"/>')
        parts.append(text((x1 + x2) / 2, by + 40, label, 19, SIGNAL, weight=700, spacing=2))
    return "".join(parts)


def shelf(x, y, slots, w=520, empty=None):
    """A shelf of published packages. `empty` is the set of positions drawn as a gap."""
    empty = empty or set()
    slot = w / len(slots)
    parts = [f'<line x1="{x - w / 2}" y1="{y + 34}" x2="{x + w / 2}" y2="{y + 34}" stroke="{INK}" stroke-width="4"/>']
    for i, label in enumerate(slots):
        cx = x - w / 2 + slot * i + slot / 2
        if i in empty:
            parts.append(f'<rect x="{cx - slot * 0.34}" y="{y - 26}" width="{slot * 0.68}" height="60" fill="none" stroke="{SIGNAL}" stroke-width="2" stroke-dasharray="7 6"/>')
        else:
            parts.append(f'<rect x="{cx - slot * 0.34}" y="{y - 26}" width="{slot * 0.68}" height="60" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>')
            if label:
                parts.append(text(cx, y + 10, label, 15, INK))
    return "".join(parts)


def codecard(x, y, count=11, w=230, h=200, label=""):
    """A card of numbered code lines. The lines are unreadable on purpose — the point
    is how few of them there are."""
    parts = [f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>']
    for i in range(count):
        ly = y - h / 2 + 24 + i * ((h - 36) / count)
        parts.append(text(x - w / 2 + 18, ly, str(i + 1), 11, INK_SOFT, "start"))
        parts.append(f'<line x1="{x - w / 2 + 38}" y1="{ly - 4}" x2="{x + w / 2 - 20 - (i % 3) * 24}" y2="{ly - 4}" stroke="{INK_SOFT}" stroke-width="3" opacity="0.6"/>')
    if label:
        parts.append(text(x, y + h / 2 + 28, label, 17, INK, weight=700, spacing=2))
    return "".join(parts)


def sheaf(x, y, w=190, h=210, count=7, label=""):
    """A stack of printed sheets, seen from a corner."""
    parts = []
    for i in range(count):
        off = i * 5
        parts.append(f'<rect x="{x - w / 2 + off}" y="{y - h / 2 - off}" width="{w}" height="{h}" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>')
    if label:
        parts.append(text(x, y + h / 2 + 30, label, 17, INK, weight=700, spacing=2))
    return "".join(parts)


def timer(x, y, value, note=None, size=76):
    parts = [text(x, y, value, size, INK, weight=700, family="Karla, sans-serif")]
    if note:
        parts.append(text(x, y + 36, note, 15, INK_SOFT, spacing=3))
    return "".join(parts)


def choices(x, y, options, chosen=0, w=330):
    """A settings panel: one option per row, the chosen one marked in the signal colour."""
    parts = [f'<rect x="{x - w / 2}" y="{y - 20}" width="{w}" height="{34 * len(options) + 30}" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>']
    for i, label in enumerate(options):
        ry = y + 16 + i * 34
        on = i == chosen
        parts.append(f'<circle cx="{x - w / 2 + 26}" cy="{ry - 6}" r="9" fill="none" stroke="{SIGNAL if on else INK_SOFT}" stroke-width="3"/>')
        if on:
            parts.append(f'<circle cx="{x - w / 2 + 26}" cy="{ry - 6}" r="4" fill="{SIGNAL}"/>')
        parts.append(text(x - w / 2 + 46, ry, label, 16, INK if on else INK_SOFT, "start", weight=700 if on else 500))
    return "".join(parts)


def folder(x, y, s=1.0, label="", accent=False, fill=PAPER_WARM):
    """A folder icon, centred on (x, y)."""
    colour = SIGNAL if accent else INK
    out = (
        f'<g transform="translate({x},{y}) scale({s})">'
        f'<path d="M -60 -34 L -20 -34 L -10 -22 L 60 -22 L 60 34 L -60 34 Z" '
        f'fill="{fill}" stroke="{colour}" stroke-width="3"/></g>'
    )
    if label:
        out += text(x, y + 34 * s + 24, label, 15, colour, weight=600)
    return out


def file_icon(x, y, s=1.0, label="", accent=False):
    """A sheet with a folded corner, centred on (x, y)."""
    colour = SIGNAL if accent else INK
    out = (
        f'<g transform="translate({x},{y}) scale({s})">'
        f'<path d="M -34 -44 L 14 -44 L 34 -24 L 34 44 L -34 44 Z" fill="{PAPER_WARM}" '
        f'stroke="{colour}" stroke-width="3"/>'
        f'<path d="M 14 -44 L 14 -24 L 34 -24" fill="none" stroke="{colour}" stroke-width="3"/></g>'
    )
    if label:
        out += text(x, y + 44 * s + 22, label, 14, colour)
    return out


def rocket(x, y, s=1.0, width=44, fill=SLATE):
    """A plain launcher: nose, body, two fins. (x, y) is the base of the body.
    `width` is the half-width, which is the whole point in the Ariane panels."""
    w = width
    return (
        f'<g transform="translate({x},{y}) scale({s})" fill="{fill}">'
        f'<path d="M 0 -210 Q {w} -150 {w} -60 L {w} 0 L {-w} 0 L {-w} -60 Q {-w} -150 0 -210 Z"/>'
        f'<path d="M {w} -50 L {w + 28} 10 L {w} 10 Z"/>'
        f'<path d="M {-w} -50 L {-w - 28} 10 L {-w} 10 Z"/></g>'
    )


def parachute(x, y, s=1.0, drop=150):
    """A canopy at (x, y) with lines down to a small body `drop` below it."""
    return (
        f'<g transform="translate({x},{y}) scale({s})">'
        f'<path d="M -90 0 A 90 90 0 0 1 90 0 Z" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="3"/>'
        f'<line x1="-90" y1="0" x2="-22" y2="{drop}" stroke="{INK}" stroke-width="2"/>'
        f'<line x1="0" y1="0" x2="0" y2="{drop}" stroke="{INK}" stroke-width="2"/>'
        f'<line x1="90" y1="0" x2="22" y2="{drop}" stroke="{INK}" stroke-width="2"/>'
        f'<rect x="-30" y="{drop}" width="60" height="38" fill="{SLATE}"/></g>'
    )


def book(x, y, w=110, h=150, label="", spine=SLATE):
    """A bound volume seen face on, with a dark spine."""
    out = (
        f'<g transform="translate({x - w / 2},{y - h / 2})">'
        f'<rect width="{w}" height="{h}" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
        f'<rect width="{w * 0.2}" height="{h}" fill="{spine}"/></g>'
    )
    if label:
        out += text(x, y + h / 2 + 26, label, 15, INK, weight=600, spacing=1)
    return out


def rule_scale(x, y, w=520, slots=16, label="", accent=None, colour=INK):
    """A measuring rule divided into equal slots. Two of these at different scales are
    how the SMS panels show that the unit of measurement changed."""
    accent = accent or set()
    step = w / slots
    left = x - w / 2
    parts = [f'<rect x="{left}" y="{y - 16}" width="{w}" height="32" fill="{PAPER_WARM}" stroke="{colour}" stroke-width="2"/>']
    for i in accent:
        parts.append(f'<rect x="{left + i * step}" y="{y - 16}" width="{step}" height="32" fill="{SIGNAL}"/>')
    for i in range(1, slots):
        tx = left + i * step
        parts.append(f'<line x1="{tx}" y1="{y - 16}" x2="{tx}" y2="{y + 16}" stroke="{colour}" stroke-width="1" opacity="0.55"/>')
    if label:
        parts.append(text(x, y + 44, label, 15, colour, weight=600, spacing=2))
    return "".join(parts)


def ship(x, y, s=1.0):
    """A plain hull with one mast and sail. (x, y) is the waterline."""
    return (
        f'<g transform="translate({x},{y}) scale({s})">'
        f'<path d="M -80 0 L 80 0 L 58 34 L -58 34 Z" fill="{SLATE}"/>'
        f'<line x1="0" y1="0" x2="0" y2="-88" stroke="{INK}" stroke-width="4"/>'
        f'<path d="M 4 -84 L 52 -16 L 4 -16 Z" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/></g>'
    )


def boarding_pass(x, y, gate, w=300, h=150, accent=False):
    """A paper boarding pass with the gate in large type, centred on (x, y)."""
    colour = SIGNAL if accent else INK
    return (
        f'<g transform="translate({x - w / 2},{y - h / 2})">'
        f'<rect width="{w}" height="{h}" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
        f'<line x1="{w * 0.7}" y1="10" x2="{w * 0.7}" y2="{h - 10}" stroke="{INK_SOFT}" stroke-width="2" stroke-dasharray="6 6"/>'
        + text(18, 32, "BOARDING PASS", 14, INK_SOFT, "start", spacing=2)
        + text(18, 66, "GATE", 15, INK_SOFT, "start", spacing=2)
        + text(18, 124, gate, 52, colour, "start", weight=700)
        + text(w * 0.85, 66, "SEAT", 13, INK_SOFT, spacing=2)
        + text(w * 0.85, 98, "14C", 22, INK)
        + "</g>"
    )


def departures(x, y, rows, w=420, row_h=46, highlight=None, accent=False):
    """A departures board: one row per flight — time, destination, gate. `highlight` is
    the row index outlined; `accent` draws that row's gate in the signal colour."""
    h = 48 + len(rows) * row_h + 10
    parts = [
        f'<rect width="{w}" height="{h}" rx="6" fill="{SLATE}"/>',
        text(20, 32, "DEPARTURES", 16, PAPER_WARM, "start", weight=700, spacing=3),
        text(w - 20, 32, "GATE", 14, PAPER_WARM, "end", spacing=2),
    ]
    for i, (time, dest, gate) in enumerate(rows):
        ry = 48 + i * row_h
        if i == highlight:
            parts.append(f'<rect x="8" y="{ry + 2}" width="{w - 16}" height="{row_h - 4}" fill="none" stroke="{SIGNAL}" stroke-width="3"/>')
        gate_fill = SIGNAL if (i == highlight and accent) else PAPER_WARM
        parts.append(text(20, ry + 30, time, 19, PAPER_WARM, "start"))
        parts.append(text(110, ry + 30, dest, 19, PAPER_WARM, "start", spacing=1))
        parts.append(text(w - 20, ry + 30, gate, 21, gate_fill, "end", weight=700))
    return f'<g transform="translate({x - w / 2},{y - h / 2})">{"".join(parts)}</g>'


def laptop(x, y, w=260, screen="", glass=PAPER_WARM, label=""):
    """An open laptop centred on (x, y). `screen` is markup in screen coordinates
    (0,0 at the top-left; the screen is w-24 by w*0.56)."""
    sw, sh = w - 24, w * 0.56
    out = (
        f'<g transform="translate({x - w / 2},{y - sh / 2 - 12})">'
        f'<rect width="{w}" height="{sh + 24}" rx="10" fill="{SLATE}"/>'
        f'<rect x="12" y="12" width="{sw}" height="{sh}" fill="{glass}"/>'
        f'<g transform="translate(12,12)">{screen}</g>'
        f'<path d="M -22 {sh + 24} L {w + 22} {sh + 24} L {w + 8} {sh + 42} L -8 {sh + 42} Z" fill="{SLATE}"/>'
        "</g>"
    )
    if label:
        out += text(x, y + sh / 2 + 66, label, 15, INK_SOFT, spacing=2)
    return out


def signup_screen(sw, sh):
    """The sign-up page as it appears on a laptop screen of size sw by sh."""
    fx, fw = sw * 0.2, sw * 0.6
    return (
        text(sw / 2, sh * 0.2, "SIGN UP", 16, INK, weight=700, spacing=2)
        + f'<rect x="{fx}" y="{sh * 0.3}" width="{fw}" height="{sh * 0.14}" fill="none" stroke="{INK_SOFT}" stroke-width="2"/>'
        + f'<rect x="{fx}" y="{sh * 0.5}" width="{fw}" height="{sh * 0.14}" fill="none" stroke="{INK_SOFT}" stroke-width="2"/>'
        + f'<rect x="{fx}" y="{sh * 0.72}" width="{fw}" height="{sh * 0.16}" fill="{TEAL}"/>'
    )


def doorway(x, y, label, behind="", w=120, h=190):
    """An open door in its frame, (x, y) the middle of the threshold. `behind` is markup
    drawn inside the frame, centred on (x, y - h/2)."""
    left, top = x - w / 2, y - h
    return (
        f'<rect x="{left}" y="{top}" width="{w}" height="{h}" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>'
        + behind
        + f'<path d="M {left + w} {top} L {left + w + 46} {top + 22} L {left + w + 46} {y + 12} L {left + w} {y} Z" '
          f'fill="{PAPER_WARM}" stroke="{INK}" stroke-width="3"/>'
        + text(x, top - 14, label, 20, INK, weight=700, spacing=2)
    )


def sheet(x, y, rows, w=400, row_h=40, struck=(), circled=(), marker=None, up=(), accent=()):
    """A spreadsheet: row numbers down the left, supplier and status beside them. `rows`
    are (number, name, closed). `struck` rows get a line through, `circled` an ellipse,
    `up` a short upward arrow on the right; `marker` is the row a pointer arrow aims at."""
    num_w = 58
    parts = [
        f'<rect width="{w}" height="{row_h}" fill="{SLATE}"/>',
        text(num_w + 16, row_h * 0.66, "SUPPLIER", 15, PAPER_WARM, "start", weight=700, spacing=2),
        text(w - 16, row_h * 0.66, "STATUS", 15, PAPER_WARM, "end", weight=700, spacing=2),
    ]
    for i, (num, name, closed) in enumerate(rows):
        ry = row_h + i * row_h
        parts.append(f'<rect y="{ry}" width="{w}" height="{row_h}" fill="{PAPER_WARM}" stroke="{RULE}" stroke-width="2"/>')
        parts.append(f'<rect y="{ry}" width="{num_w}" height="{row_h}" fill="{RULE}"/>')
        parts.append(text(num_w / 2, ry + row_h * 0.66, num, 17, INK_SOFT, weight=600))
        parts.append(text(num_w + 16, ry + row_h * 0.66, name, 17, SIGNAL if i in accent else INK, "start"))
        if closed:
            parts.append(text(w - 16, ry + row_h * 0.66, "CLOSED", 15, SIGNAL, "end", weight=700, spacing=1))
        if i in accent:
            parts.append(f'<rect y="{ry}" width="{w}" height="{row_h}" fill="none" stroke="{SIGNAL}" stroke-width="3"/>')
        if i in struck:
            parts.append(f'<line x1="8" y1="{ry + row_h / 2}" x2="{w - 8}" y2="{ry + row_h / 2}" stroke="{SIGNAL}" stroke-width="4"/>')
        if i in circled:
            parts.append(f'<ellipse cx="{w / 2 + num_w / 2}" cy="{ry + row_h / 2}" rx="{(w - num_w) / 2 + 12}" ry="{row_h / 2 + 5}" fill="none" stroke="{SIGNAL}" stroke-width="3"/>')
        if i in up:
            parts.append(arrow(w + 24, ry + row_h - 4, w + 24, ry + 6, SIGNAL, 3))
        if i == marker:
            parts.append(arrow(-52, ry + row_h / 2, -12, ry + row_h / 2, INK, 5))
    h = row_h * (len(rows) + 1)
    return f'<g transform="translate({x - w / 2},{y - h / 2})">{"".join(parts)}</g>'


# The gate-change board, identical in panels 1 and 3 except for the one gate that moves.
GT_ROWS = [("09:10", "PUNE", "A3"), ("09:25", "GOA", "B7"), ("09:40", "KOCHI", "D2")]

# The channel slots: ten boxes from x=110, 52 wide. Panels 2 and 3 must line up exactly.
OC_X, OC_CELL, OC_Y = 110, 52, 330


# The Zune's loading screen. Identical on every player in panel 1, and on the stuck
# player in panel 3 — the point is that nothing on the screen ever moves.
ZF_LOADING = (
    '<circle cx="63" cy="66" r="30" fill="none" stroke="#545a66" stroke-width="7"/>'
    '<path d="M 63 36 A 30 30 0 0 1 93 66" fill="none" stroke="#c9481a" stroke-width="7"/>'
    + text(63, 130, "LOADING", 13, INK_SOFT, spacing=2)
)

PANELS = {
    "zune-freeze": [
        svg(
            "".join(device(130 + i * 180, 270, 130, 220, ZF_LOADING) for i in range(4))
            + stamp(400, 452, "FROZEN", angle=-6)
            + caption("31 DEC 2008 · EVERY PLAYER, ONE SCREEN")
        ),
        svg(
            device(150, 260, 150, 250, text(63, 80, "10593", 30, INK, weight=700)
                   + text(63, 112, "DAYS", 14, INK_SOFT, spacing=3))
            + text(330, 150, "10593 days", 24, INK, "start")
            + text(330, 196, "− 366 (1980 is a leap year)", 22, SIGNAL, "start")
            + arrow(330, 226, 520, 226)
            + text(330, 276, "10227 days left", 24, INK, "start")
            + digits(420, 372, "1980", 48)
            + arrow(530, 356, 574, 356, SIGNAL)
            + digits(676, 372, "1981", 44, accent={3})
            + caption("TAKE AWAY A YEAR · MOVE THE YEAR ON")
        ),
        svg(
            device(150, 260, 150, 250, ZF_LOADING)
            + digits(420, 180, "366", 64, accent={0, 1, 2})
            + text(420, 236, "DAYS LEFT", 16, INK_SOFT, spacing=3)
            + digits(420, 330, "2008", 50)
            + text(420, 378, "LEAP YEAR", 16, INK_SOFT, spacing=3)
            + loop_back(650, 170, 56)
            + text(650, 290, "more than 365?", 18, INK)
            + text(650, 318, "YES · go round", 18, TEAL, weight=700)
            + text(650, 372, "more than 366?", 18, INK)
            + text(650, 400, "NO · change nothing", 18, SIGNAL, weight=700)
            + caption("LOOK AGAIN · SAME ANSWER")
        ),
        svg(
            device(150, 250, 150, 250, battery(26, 50, 0.0, SIGNAL)
                   + text(63, 128, "EMPTY", 14, SIGNAL, spacing=3))
            + arrow(250, 250, 320, 250)
            + calendar(420, 160, "1", "JANUARY", "2009")
            + arrow(520, 250, 590, 250)
            + device(670, 250, 150, 250, text(63, 76, "12:00", 30, INK, weight=700)
                     + battery(26, 100, 0.7))
            + caption("A NEW YEAR · THE ANSWER CHANGES")
        ),
    ],
    "three-pin-tries": [
        svg(
            device(200, 250, 150, 250, pay_screen("₹340"))
            + keypad(340, 150, 1.0)
            + tries(640, 250, 1)
            + text(640, 310, "TRY 1 · INCORRECT", 17, SIGNAL, weight=700)
            + caption("THE MEDICINE SHOP COUNTER")
        ),
        svg(
            device(150, 250, 150, 250, pay_screen("₹340"))
            + tries(390, 180, 2)
            + text(390, 240, "TRY 2 · INCORRECT", 17, SIGNAL, weight=700)
            + "".join(figure(560 + i * 70, 470, 0.85 - i * 0.08) for i in range(3))
            + caption("THE QUEUE BEHIND YOU GROWS")
        ),
        svg(
            "".join(
                f'<rect x="{90 + i * 220}" y="250" width="160" height="70" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
                + text(170 + i * 220, 293, f"TRY {i + 1}", 22, INK, weight=700)
                + arrow(170 + i * 220, 244, 170 + i * 220, 170, TEAL)
                + text(170 + i * 220, 150, "right → pay", 17, TEAL, weight=700)
                for i in range(3)
            )
            + arrow(250, 285, 306, 285) + arrow(470, 285, 526, 285)
            + arrow(690, 320, 690, 380, SIGNAL)
            + text(690, 412, "all wrong", 17, SIGNAL, weight=700)
            + text(690, 438, "→ stop asking", 17, SIGNAL, weight=700)
            + caption("FIXED BEFORE YOU START: THREE")
        ),
        svg(
            device(200, 250, 150, 250, pay_screen("₹340", "SENDING BLOCKED", SIGNAL))
            + tries(200, 430, 3)
            + stamp(520, 170, "BLOCKED 24 HRS", angle=-8, size=26)
            + arrow(680, 330, 300, 330, TEAL)
            + text(490, 310, "money in: still arrives", 17, TEAL, weight=700)
            + text(560, 400, "reset PIN: debit card + OTP", 17, INK)
            + caption("THE THIRD TRY, AND AFTER")
        ),
    ],
    "irctc-waitlist": [
        svg(
            ticket(250, 180, 330, 150, ["PUNE → PATNA", "SLEEPER CLASS", "STATUS: WL 7"])
            + "".join(figure(110 + i * 90, 470, 0.55, SIGNAL if i == 6 else SLATE) for i in range(7))
            + text(650, 350, "you", 18, SIGNAL, weight=700)
            + caption("SEVENTH IN THE WAITING LINE")
        ),
        svg(
            "".join(figure(110 + i * 90, 470, 0.55, SIGNAL if i == 6 else SLATE) for i in range(3, 7))
            + "".join(
                f'<g opacity="0.3">{figure(110 + i * 90, 470, 0.55)}</g>'
                + arrow(110 + i * 90, 360, 110 + i * 90, 300, INK_SOFT, 3)
                for i in range(3)
            )
            + text(200, 270, "cancelled ahead of you", 17, INK_SOFT)
            + text(520, 170, "WL 7", 34, INK_SOFT, weight=700)
            + arrow(580, 160, 640, 160, SIGNAL)
            + text(700, 170, "WL 4", 34, SIGNAL, weight=700)
            + caption("THE LINE MOVES · THE TICKET DOES NOT")
        ),
        svg(
            text(130, 230, "WL 7", 26, INK_SOFT, weight=700)
            + arrow(190, 222, 250, 222)
            + text(310, 230, "WL 4", 26, INK_SOFT, weight=700)
            + arrow(370, 222, 430, 222)
            + text(500, 230, "RAC 2", 26, TEAL, weight=700)
            + arrow(570, 222, 630, 222)
            + text(690, 230, "CNF", 30, SIGNAL, weight=700)
            + ticket(400, 390, 360, 130, ["PUNE → PATNA", "COACH S4 · BERTH 32"], stamp="CNF")
            + caption("FROM THE FRONT, ONE PLACE AT A TIME")
        ),
        svg(
            ticket(215, 170, 350, 120, ["YOU", "COACH S4 · BERTH 32"], stamp="CNF")
            + ticket(595, 170, 290, 120, ["YOUR FRIEND", "STATUS: WL 9"])
            + stamp(595, 282, "CANCELLED · REFUNDED", angle=-5, size=18)
            + page(595, 430, 290, 150, ["prepared a few hours", "before departure"], header="CHART")
            + caption("THE CHART IS PREPARED")
        ),
    ],
    "y2k": [
        svg(
            text(300, 318, "19", 96, RULE, weight=700)
            + digits(480, 300, "65", 90)
            + text(300, 400, "assumed", 18, INK_SOFT, spacing=2)
            + text(480, 400, "stored", 18, INK, weight=700, spacing=2)
            + caption("1965, STORED AS 65")
        ),
        svg(
            text(290, 210, "99 − 65 = 34", 44, INK, weight=700)
            + text(290, 262, "this year − born = age", 18, INK_SOFT)
            + page(610, 300, 220, 250, ["65", "71", "88", "99"], header="BY YEAR")
            + caption("EVERY YEAR BEGINS WITH 19")
        ),
        svg(
            calendar(170, 80, "1", "JANUARY", "2000", w=150)
            + text(290, 370, "00 − 65 = −65", 40, SIGNAL, weight=700)
            + text(290, 418, "this year − born = age", 18, INK_SOFT)
            + page(610, 300, 220, 250, ["00", "65", "71", "99"], header="BY YEAR", ticks={0: "!"})
            + caption("1 JANUARY 2000")
        ),
        svg(
            digits(190, 290, "65", 60)
            + arrow(270, 272, 370, 272, SIGNAL)
            + digits(530, 290, "1965", 60, accent={0, 1})
            + stamp(420, 440, "FIXED", colour=TEAL, angle=-6)
            + caption("WIDENED TO FOUR DIGITS")
        ),
    ],
    "vancouver-index": [
        svg(
            text(400, 250, "1000.000", 72, INK, weight=700)
            + text(400, 300, "THE INDEX", 18, INK_SOFT, spacing=4)
            + "".join(f'<line x1="{160 + i * 16}" y1="370" x2="{160 + i * 16}" y2="{392 - (i * 5) % 14}" stroke="{TEAL}" stroke-width="3"/>' for i in range(31))
            + text(400, 430, "worked out again after every trade", 17, INK_SOFT)
            + caption("JANUARY 1982 · IT BEGINS AT 1,000")
        ),
        svg(
            digits(400, 220, "1000.4567", 50, accent={8})
            + '<line x1="580" y1="160" x2="622" y2="240" stroke="#c9481a" stroke-width="5" stroke-linecap="round"/>'
            + arrow(400, 270, 400, 330, INK)
            + digits(375, 400, "1000.456", 50)
            + text(640, 400, "kept", 18, INK_SOFT)
            + text(690, 190, "dropped", 18, SIGNAL, weight=700)
            + caption("CUT OFF, NOT ROUNDED")
        ),
        svg(
            chart(380, 260, 520, 260,
                  [(i / 40, 0.86 - 0.42 * i / 40 + 0.03 * (((i * 7) % 5) - 2) / 2) for i in range(41)],
                  ghost=[(i / 40, 0.86 + 0.1 * i / 40 + 0.02 * (((i * 3) % 4) - 1.5) / 1.5) for i in range(41)])
            + text(705, 295, "524.811", 22, SIGNAL, weight=700)
            + text(705, 150, "the market", 17, TEAL, weight=700)
            + text(120, 420, "JAN 1982", 16, INK_SOFT)
            + text(640, 420, "NOV 1983", 16, INK_SOFT)
            + caption("22 MONTHS · EVERY CUT WENT DOWN")
        ),
        svg(
            text(250, 250, "524.811", 54, INK_SOFT, weight=700)
            + '<line x1="140" y1="232" x2="360" y2="232" stroke="#c9481a" stroke-width="5"/>'
            + arrow(390, 232, 460, 232, INK)
            + text(600, 250, "1098.892", 58, TEAL, weight=700)
            + stamp(420, 400, "RECALCULATED", colour=INK, angle=-5, size=26)
            + caption("ONE WEEKEND · THE SAME TRADES")
        ),
    ],
    "upi-pending": [
        svg(
            device(150, 250, 150, 250, pay_screen("₹1,200", "PENDING", SIGNAL))
            + bubble(270, 110, ["BANK: ₹1,200 debited", "from your account"])
            + device(660, 250, 150, 250, text(63, 70, "FRIEND", 13, INK_SOFT, spacing=3)
                     + text(63, 110, "nothing yet", 17, INK, weight=700))
            + caption("₹1,200 · PENDING")
        ),
        svg(
            bank(180, 230, "YOUR BANK")
            + bank(620, 230, "THEIR BANK")
            + arrow(290, 220, 400, 220, TEAL)
            + f'<line x1="410" y1="220" x2="505" y2="220" stroke="{SIGNAL}" stroke-width="4" stroke-dasharray="10 8"/>'
            + '<path d="M 440 200 L 476 240 M 476 200 L 440 240" stroke="#c9481a" stroke-width="5" stroke-linecap="round"/>'
            + text(180, 400, "1 · debit: done", 19, TEAL, weight=700)
            + text(620, 400, "2 · credit: failed", 19, SIGNAL, weight=700)
            + caption("STOPPED HALFWAY")
        ),
        svg(
            page(400, 270, 440, 290,
                 ["debited, but never credited", "reverse by the next day (T+1)", "late: ₹100 for each day"],
                 header="RBI · FROM OCTOBER 2019", ticks={1: "✓", 2: "₹"})
            + caption("A RULE FOR THE HALF-DONE PAYMENT")
        ),
        svg(
            device(150, 250, 150, 250, text(63, 60, "BALANCE", 13, INK_SOFT, spacing=3)
                   + text(63, 100, "whole", 22, TEAL, weight=700))
            + bubble(270, 100, ["BANK: ₹1,200 credited back", "reversal of a failed payment"], w=330)
            + stamp(440, 330, "REVERSED", colour=TEAL, angle=-6)
            + text(440, 440, "sent again · paid at once", 18, INK)
            + caption("CAUGHT · UNDONE · REPORTED")
        ),
    ],
    "pin-code-lookup": [
        svg(
            f'<rect x="170" y="110" width="460" height="290" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
            f'<path d="M 170 110 L 400 250 L 630 110" fill="none" stroke="{INK_SOFT}" stroke-width="2"/>'
            + text(230, 300, "Shri R. Kumar,", 20, INK, "start", family="Karla, sans-serif")
            + text(230, 328, "near the old temple, Rampur", 20, INK, "start", family="Karla, sans-serif")
            + text(230, 386, "PIN", 18, INK_SOFT, "start", weight=700, spacing=2)
            + "".join(f'<rect x="{290 + i * 40}" y="358" width="34" height="38" fill="none" stroke="{INK}" stroke-width="2"/>' for i in range(6))
            + caption("15 AUGUST 1972 · SIX BOXES")
        ),
        svg(
            digits(400, 230, "560034", 70, accent={0})
            + f'<line x1="405" y1="286" x2="605" y2="286" stroke="{INK}" stroke-width="3"/>'
            + text(225, 330, "region", 18, SIGNAL, weight=700)
            + text(295, 364, "sub-region", 18, INK)
            + text(365, 398, "sorting district", 18, INK)
            + text(505, 330, "post office", 18, INK)
            + text(400, 462, "9 regions · 9 = Army Postal Service", 17, INK_SOFT)
            + caption("READ FROM WIDE TO NARROW")
        ),
        svg(
            page(400, 270, 420, 250, ["PIN     560034", "CITY    Bengaluru", "STATE   Karnataka"],
                 header="CHECKOUT", ticks={1: "✓", 2: "✓"})
            + caption("TYPE SIX DIGITS · THE REST FILLS IN")
        ),
        svg(
            page(400, 270, 420, 250, ["PIN     560304", "CITY    ?", "STATE   ?"], header="CHECKOUT")
            + stamp(520, 420, "CHECK YOUR PIN", angle=-7, size=24)
            + caption("ONE DIGIT WRONG")
        ),
    ],
    "attendance-twice": [
        svg(
            f'<rect x="110" y="90" width="230" height="380" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
            f'<circle cx="310" cy="290" r="9" fill="{INK}"/>'
            f'<rect x="390" y="290" width="70" height="104" rx="8" fill="{SLATE}"/>'
            f'<rect x="404" y="306" width="42" height="20" fill="{TEAL}"/>'
            f'<rect x="478" y="316" width="72" height="48" rx="6" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
            + text(514, 347, "ID", 17, INK, weight=700)
            + figure(630, 470, 1.0)
            + caption("TAP YOUR CARD AT THE DOOR")
        ),
        svg(
            page(290, 280, 340, 250, ["enrolled   60", "present    64"], header="MATHS · MONDAY", ticks={1: "!"})
            + text(620, 110, "TAPS", 17, INK_SOFT, weight=700, spacing=3)
            + "".join(
                text(620, 150 + i * 36, sid, 22, SIGNAL if repeat else INK, weight=700 if repeat else 500)
                for i, (sid, repeat) in enumerate(
                    [("S07", False), ("S07", True), ("S12", False), ("S12", True), ("S12", True), ("S33", False), ("S34", False)]
                )
            )
            + caption("64 PRESENT · 60 ENROLLED")
        ),
        svg(
            "".join(
                text(210, 190 + i * 70, f"S12 · 09:01:0{3 + i}", 24, SIGNAL if i else INK, weight=700)
                + arrow(360, 182 + i * 70, 500, 252, INK_SOFT, 3)
                for i in range(3)
            )
            + text(610, 264, "S12 ✓", 36, TEAL, weight=700)
            + text(610, 310, "one student", 18, INK_SOFT)
            + caption("THREE TAPS · ONE STUDENT")
        ),
        svg(
            page(330, 280, 420, 290, ["enrolled   60", "present    58", "absent     S59, S60"],
                 header="MATHS · MONDAY", ticks={1: "✓"})
            + stamp(660, 440, "FIXED", colour=TEAL, angle=-6)
            + caption("EACH ID ONCE")
        ),
    ],
    "gene-names-dates": [
        svg(
            page(400, 262, 440, 330,
                 ["GENE      VALUE", "BRCA1     0.82", "TP53      0.44",
                  "1-Sep     0.31", "SEPT2     0.29", "MYC       0.12"],
                 header="SUPPLEMENTARY TABLE 3", ticks={3: "?"})
            + f'<ellipse cx="288" cy="270" rx="106" ry="20" fill="none" stroke="{SIGNAL}" stroke-width="3"/>'
            + caption("A ROW NOBODY TYPED")
        ),
        svg(
            cell(215, 250, "SEPT1", 230, 74, size=30)
            + text(215, 320, "AS TYPED", 15, INK_SOFT, spacing=3)
            + arrow(350, 250, 500, 250, SIGNAL, 5)
            + cell(635, 250, "1-Sep", 230, 74, accent=True, size=30)
            + text(635, 320, "AS SAVED", 15, SIGNAL, spacing=3)
            + text(400, 420, "opened  ·  guessed  ·  written back", 21, INK)
            + caption("NOTHING FAILED, SO NOTHING WARNED")
        ),
        svg(
            text(400, 130, "PAPERS WHOSE GENE NAMES BECAME DATES", 16, INK_SOFT, spacing=2)
            + bars(400, 430, [0.196, 0.309], ["2016", "2021"], w=360, h=250, top=0.35, accent={1})
            + text(310, 262, "19.6%", 22, INK)
            + text(490, 182, "30.9%", 24, SIGNAL, weight=700)
            + caption("THE COUNT WENT UP, NOT DOWN")
        ),
        svg(
            cell(240, 225, "SEPT1", 230, 62, strike=True, size=26)
            + arrow(240, 268, 240, 322, INK_SOFT, 3)
            + cell(240, 360, "SEPTIN1", 230, 62, size=26)
            + cell(560, 225, "MARCH1", 230, 62, strike=True, size=26)
            + arrow(560, 268, 560, 322, INK_SOFT, 3)
            + cell(560, 360, "MARCHF1", 230, 62, size=26)
            + text(400, 460, "renamed, 2020", 20, SIGNAL, spacing=2)
            + caption("THE NAMES WERE CHANGED INSTEAD")
        ),
    ],
    "safely-remove": [
        svg(
            slab(170, 270, "", 160, 210, fill=SLATE, edge=SLATE)
            + f'<rect x="248" y="252" width="26" height="38" fill="{INK_SOFT}"/>'
            + pendrive(400, 271)
            + arrow(470, 271, 620, 271, SIGNAL, 5)
            + progress(400, 400, 380, 1.0)
            + text(400, 444, "COPY COMPLETE", 16, INK_SOFT, spacing=3)
            + caption("PULLED, AND GONE")
        ),
        svg(
            page(255, 265, 320, 250, ["Quarterly review", "", "figures as of", "YESTERDAY"],
                 header="SLIDE 1", ticks={3: "!"})
            + ticket(600, 275, 270, 165, ["this morning:", "3 new figures", "2 corrections"])
            + stamp(600, 405, "MISSING", angle=-8, size=24)
            + caption("YESTERDAY'S VERSION, INTACT")
        ),
        svg(
            slab(200, 270, "", 270, 210)
            + text(200, 190, "HELD IN MEMORY", 14, INK_SOFT, spacing=2)
            + "".join(f'<rect x="100" y="{216 + i * 44}" width="200" height="30" fill="{SLATE}"/>' for i in range(3))
            + f'<line x1="345" y1="270" x2="530" y2="270" stroke="{INK_SOFT}" stroke-width="3" stroke-dasharray="9 8"/>'
            + pendrive(625, 270)
            + arrow(345, 400, 560, 400, SIGNAL, 6)
            + text(452, 442, "ON EJECT", 18, SIGNAL, weight=700, spacing=3)
            + caption("ACCEPTED IS NOT STORED")
        ),
        svg(
            choices(400, 240, ["Better performance   —   writes held back",
                               "Quick removal   —   nothing held back"], chosen=1, w=520)
            + text(400, 400, "the default from Windows 10 version 1809", 19, INK_SOFT)
            + stamp(400, 470, "SAFE TO PULL", colour=TEAL, angle=-4, size=26)
            + caption("THE DEFAULT CHANGED")
        ),
    ],
    "left-pad": [
        svg(
            codecard(205, 255, 11, 210, 200)
            + text(205, 382, "ELEVEN LINES", 17, INK, weight=700, spacing=2)
            + text(600, 215, "REGISTRY", 15, INK_SOFT, spacing=3)
            + shelf(600, 300, ["", "", ""], w=290, empty={1})
            + arrow(598, 272, 350, 240, SIGNAL, 5)   # leaves from the gap, clears the other boxes
            + caption("22 MARCH 2016 · WITHDRAWN")
        ),
        svg(
            "".join(slab(140 + i * 175, 215, "BUILD " + str(i + 1), 140, 100, mark="X") for i in range(4))
            + "".join(arrow(140 + i * 175, 300, 373 + i * 18, 392, INK_SOFT, 2) for i in range(4))
            + shelf(400, 448, [""], w=150, empty={0})
            + caption("BUILDS FAILING EVERYWHERE")
        ),
        svg(
            ticket(225, 250, 300, 155, ["package.json", "", '"left-pad": "^1.0.0"'])
            + arrow(390, 250, 555, 250, SIGNAL, 5)
            + shelf(655, 250, [""], w=150, empty={0})
            + text(655, 335, "NOT HERE", 18, SIGNAL, weight=700, spacing=2)
            + text(400, 440, "the name is the whole of it", 21, INK)
            + caption("A NAME, NOT A COPY")
        ),
        svg(
            codecard(255, 275, 11, 220, 200)
            + stamp(255, 275, "RESTORED", colour=TEAL, angle=-8, size=24)
            + page(600, 265, 290, 210, ["no withdrawal after", "24 hours if anything", "depends on it"],
                   header="NEW RULE")
            + caption("TWO HOURS LATER, FROM BACKUP")
        ),
    ],
    "gta-load-times": [
        svg(
            timer(250, 265, "6:04", note="TO REACH ONLINE MODE")
            + text(600, 150, "CPU CORES", 15, INK_SOFT, spacing=3)
            + bars(600, 430, [1.0, 0.04, 0.06, 0.03], ["1", "2", "3", "4"], w=260, h=230, accent={0})
            + caption("ONE CORE, FOUR MINUTES")
        ),
        svg(
            sheaf(270, 275, 200, 230, 8, label="10 MB · 63,000 ENTRIES")
            + text(605, 250, "4 MINUTES", 36, SIGNAL, weight=700)
            + text(605, 296, "SPENT READING IT", 15, INK_SOFT, spacing=2)
            + caption("A CATALOGUE OF THINGS TO BUY")
        ),
        svg(
            cell(150, 265, "entry 63,000", 200, 54, accent=True, size=17)
            + "".join(arrow(255, 265, 462, 145 + i * 62, INK_SOFT, 2) for i in range(6))
            + "".join(cell(560, 145 + i * 62, "stored " + str(i + 1), 190, 46, size=15) for i in range(6))
            + text(400, 512, "1,984,531,500 comparisons", 29, SIGNAL, weight=700)
            + caption("EVERY NEW ONE, AGAINST EVERY OLD ONE")
        ),
        svg(
            timer(245, 255, "1:50", note="AFTER THE FIX")
            + stamp(575, 235, "70% LESS", colour=TEAL, angle=-6, size=28)
            + ticket(575, 395, 280, 120, ["paid to the finder", "$10,000"])
            + caption("SHIPPED AS AN OFFICIAL PATCH")
        ),
    ],
    "heartbleed": [
        svg(
            slab(155, 280, "CLIENT", 170, 130)
            + slab(645, 280, "SERVER", 170, 130)
            + f'<line x1="240" y1="280" x2="560" y2="280" stroke="{INK}" stroke-width="3"/>'
            + envelope(330, 222) + arrow(372, 222, 468, 222, INK_SOFT, 3)
            + envelope(470, 338) + arrow(428, 338, 332, 338, INK_SOFT, 3)
            + text(400, 440, "say it back", 22, INK)
            + caption("A HEARTBEAT, ALL DAY, FOR YEARS")
        ),
        svg(
            ticket(400, 285, 420, 210, ["REQUEST", "", "message:   HELLO", "length:    64000"])
            + f'<ellipse cx="302" cy="286" rx="104" ry="17" fill="none" stroke="{SIGNAL}" stroke-width="3"/>'
            + text(400, 450, "one of these was never checked", 20, INK)
            + caption("TWO FIELDS, ONE OF THEM A CLAIM")
        ),
        svg(
            text(400, 170, "WHAT THE MACHINE COPIED OUT", 15, INK_SOFT, spacing=2)
            + memstrip(400, 265, ["HELLO", "sess=8f2c", "pwd:****", "card 4417", "key..."],
                       cw=140, accent={0}, bracket=(0, 5, "64 KB SENT BACK"))
            + text(400, 450, "nothing was forced open", 20, INK)
            + caption("ASKED, AND ANSWERED")
        ),
        svg(
            page(230, 280, 300, 250, ["7 April 2014", "", "compare the stated", "length against what", "actually arrived"],
                 header="PATCH")
            + cell(570, 195, "length: 64000", 250, 56, accent=True, size=19)
            + arrow(570, 228, 570, 292, INK_SOFT, 3)
            + slab(570, 332, "= len(received) ?", 250, 64, edge=SIGNAL)
            + text(570, 424, "REFUSED", 26, SIGNAL, weight=700, spacing=3)
            + caption("THE FIX WAS ONE COMPARISON")
        ),
    ],
    "file-names-sorted": [
        svg(
            "".join(cell(180 + (i % 4) * 150, 190 + (i // 4) * 62, "page" + str(i + 1), 130, 46, size=17)
                    for i in range(20))
            + caption("TWENTY PAGES, SAVED IN ORDER")
        ),
        svg(
            page(400, 280, 380, 300,
                 ["page1", "page10", "page11", "page12", "page2", "page20", "page3"],
                 header="SCANS", ticks={1: "!"})
            + caption("ALL PRESENT · NONE IN SEQUENCE")
        ),
        svg(
            charline(200, 230, "page2", 62, accent={4})
            + charline(200, 330, "page10", 62, accent={4})
            + "".join(text(231 + i * 62, 278, "=", 21, TEAL, weight=700) for i in range(4))
            + text(231 + 4 * 62, 278, "x", 24, SIGNAL, weight=700)
            + text(400, 440, "1 comes before 2, and that settles it", 21, INK)
            + caption("COMPARED CHARACTER BY CHARACTER")
        ),
        svg(
            page(215, 275, 300, 290, ["page1", "page10", "page11", "page2", "page20", "page3"],
                 header="AS WRITING")
            + page(585, 275, 300, 290, ["page1", "page2", "page3", "page10", "page11", "page20"],
                   header="AS NUMBERS")
            + caption("SAME NAMES · DIFFERENT COMPARISON")
        ),
    ],
    "ariane-501": [
        svg(
            rocket(140, 520, 0.44)
            + f'<path d="M 152 420 Q 268 320 372 268" fill="none" stroke="{INK}" stroke-width="4"/>'
            # the dashed part veers AWAY and ends in a burst; climbing on would read as success
            + f'<path d="M 372 268 L 462 316" fill="none" stroke="{SIGNAL}" stroke-width="4" stroke-dasharray="11 9"/>'
            + f'<polygon points="468,284 479,308 505,304 487,323 497,349 468,334 440,349 450,323 432,304 458,308" fill="{SIGNAL}"/>'
            + stamp(296, 192, "30 s", angle=-6, size=24)
            + text(616, 250, "3,700 m", 26, INK, weight=700)
            + text(616, 292, "NOBODY ABOARD", 14, INK_SOFT, spacing=2)
            + caption("4 JUNE 1996 · FIRST FLIGHT")
        ),
        svg(
            rocket(190, 470, 0.4, width=32)
            + text(190, 512, "ARIANE 4", 15, INK, weight=700, spacing=2)
            + rocket(560, 470, 0.4, width=62)
            + text(560, 512, "ARIANE 5", 15, INK, weight=700, spacing=2)
            + slab(190, 320, "GUIDANCE", 140, 58, size=15)
            + slab(560, 320, "GUIDANCE", 140, 58, size=15)
            + arrow(268, 320, 482, 320, SIGNAL, 5)
            + text(375, 288, "UNCHANGED", 15, SIGNAL, weight=700, spacing=2)
            + caption("THE SAME PART, THE FASTER ROCKET")
        ),
        svg(
            text(400, 140, "THE VALUE THE NEW ROCKET PRODUCED", 15, INK_SOFT, spacing=2)
            + charline(150, 250, "72000", 62, accent={0, 1})
            + f'<rect x="270" y="196" width="196" height="78" fill="none" stroke="{SIGNAL}" stroke-width="4"/>'
            + text(368, 302, "THE SPACE IT WAS PUT IN", 15, SIGNAL, spacing=2)
            + "".join(
                f'<rect x="{203 + i * 58}" y="380" width="46" height="46" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
                + (text(226 + i * 58, 412, "✓", 24, TEAL, weight=700) if i < 4 else "")
                for i in range(7))
            + text(400, 470, "FOUR OF SEVEN GUARDED", 16, INK, weight=700, spacing=2)
            + caption("TOO BIG FOR WHERE IT WAS PUT")
        ),
        svg(
            slab(190, 200, "", 160, 80)
            + text(190, 148, "UNIT A", 14, INK_SOFT, spacing=2)
            + stamp(190, 200, "STOPPED", angle=-8, size=17)
            + slab(190, 330, "", 160, 80)
            + text(190, 278, "UNIT B", 14, INK_SOFT, spacing=2)
            + stamp(190, 330, "STOPPED", angle=-8, size=17)
            + arrow(275, 205, 392, 245, SIGNAL, 4)
            + slab(555, 260, "READ AS FLIGHT DATA", 250, 82, edge=SIGNAL, size=14)
            + arrow(555, 305, 555, 370, INK_SOFT, 4)
            + text(555, 412, "NOZZLES HARD OVER", 17, INK, weight=700, spacing=2)
            + caption("A FAULT REPORT, MISTAKEN FOR A READING")
        ),
    ],
    "amend-a-commit": [
        svg(
            slab(280, 245, "", 220, 150)
            + text(280, 188, "COMMIT", 14, INK_SOFT, spacing=3)
            + "".join(f'<rect x="200" y="{216 + i * 30}" width="160" height="18" fill="{SLATE}"/>' for i in range(3))
            + arrow(398, 245, 470, 245, INK_SOFT, 3)
            + text(620, 252, "a1b2c3d4", 28, INK, weight=700)
            + text(620, 294, "WORKED OUT FROM THE CONTENTS", 13, INK_SOFT, spacing=1)
            + caption("THE NAME IS A SUMMARY")
        ),
        svg(
            cell(230, 220, "inital commit", 290, 58, size=20)
            + text(230, 282, "a1b2c3d4", 21, INK_SOFT)
            + cell(570, 220, "initial commit", 290, 58, accent=True, size=20)
            + text(570, 282, "d4e5f6a7", 21, SIGNAL, weight=700)
            + text(400, 370, "one letter different", 20, INK)
            + text(400, 412, "every letter of the name different", 20, SIGNAL, weight=700)
            + caption("A DIFFERENT SUMMARY IS A DIFFERENT COMMIT")
        ),
        svg(
            text(230, 168, "main", 18, INK_SOFT)
            + f'<line x1="230" y1="182" x2="230" y2="210" stroke="{RULE}" stroke-width="3" stroke-dasharray="6 6"/>'
            + arrow(300, 158, 496, 158, SIGNAL, 4)
            + text(570, 168, "main", 18, SIGNAL, weight=700)
            + f'<line x1="570" y1="182" x2="570" y2="210" stroke="{SIGNAL}" stroke-width="3"/>'
            + slab(230, 258, "a1b2c3d4", 200, 96)
            + slab(570, 258, "d4e5f6a7", 200, 96, edge=SIGNAL)
            + text(400, 410, "the first is not altered, and not removed", 19, INK)
            + caption("A SECOND COMMIT, AND THE MARKER MOVES")
        ),
        svg(
            slab(215, 250, "a1b2c3d4", 200, 96)
            + text(215, 336, "nothing points here", 15, INK_SOFT)
            + page(575, 265, 300, 200, ["HEAD@{0}   d4e5f6a7", "HEAD@{1}   a1b2c3d4"],
                   header="REFLOG", ticks={1: "*"})
            + caption("STILL THERE, STILL FINDABLE")
        ),
    ],
    "almanac": [
        svg(
            f'<line x1="240" y1="220" x2="240" y2="480" stroke="{INK}" stroke-width="3"/>'
            + text(240, 200, "NORTH-SOUTH: KNOWN", 14, INK, spacing=2)
            + f'<line x1="110" y1="386" x2="660" y2="386" stroke="{SIGNAL}" stroke-width="3" stroke-dasharray="12 10"/>'
            + ship(240, 420)
            + text(600, 352, "EAST-WEST: ?", 21, SIGNAL, weight=700, spacing=2)
            + caption("HALF A POSITION")
        ),
        svg(
            f'<g transform="rotate(-8 250 440)">'
            + f'<rect x="100" y="440" width="300" height="20" fill="{SLATE}"/>'
            + figure(250, 440, 0.6)
            + f'</g>'
            + page(610, 262, 250, 236, ["cos d = sin a sin b", "  + cos a cos b cos H", "and again for", "every hour"],
                   header="HOURS OF IT")
            + arrow(520, 300, 452, 262, INK_SOFT, 3)
            + caption("NOT ON A MOVING DECK")
        ),
        svg(
            "".join(figure(120 + i * 78, 326, 0.33) for i in range(3))
            + "".join(f'<rect x="{88 + i * 78}" y="330" width="64" height="12" fill="{SLATE}"/>' for i in range(3))
            + text(198, 388, "ON LAND, ONCE", 14, INK_SOFT, spacing=2)
            + arrow(330, 316, 410, 316, INK_SOFT, 4)
            + book(500, 312, 120, 160, "1767")
            + arrow(578, 312, 648, 312, SIGNAL, 4)
            + ship(712, 430, 0.5)
            + caption("PRINTED, THEN CARRIED")
        ),
        svg(
            "".join(book(140 + i * 88, 288, 70, 150) for i in range(7))
            + f'<line x1="86" y1="366" x2="714" y2="366" stroke="{INK}" stroke-width="4"/>'
            + text(140, 398, "1767", 14, INK_SOFT)
            + text(668, 398, "TODAY", 14, INK_SOFT)
            + text(400, 462, "every year since", 20, INK)
            + caption("THE WORK IS STILL DONE ONCE")
        ),
    ],
    "folder-size": [
        svg(
            page(400, 272, 380, 262,
                 ["Type       Folder", "Contains   12,404 files", "", "Size       912 MB"],
                 header="PHOTOS  —  PROPERTIES", ticks={3: "..."})
            + caption("STILL COUNTING")
        ),
        svg(
            folder(400, 198, 1.2, label="PHOTOS")
            + arrow(400, 272, 400, 312, INK_SOFT, 3)
            + file_icon(198, 400, 0.68, "cover.txt")
            + file_icon(308, 400, 0.68, "a.jpg")
            + file_icon(418, 400, 0.68, "b.jpg")
            + folder(556, 400, 0.85, label="2024", accent=True)
            + folder(692, 400, 0.85, label="2023", accent=True)
            + caption("SOME ARE FILES · SOME ARE MORE FOLDERS")
        ),
        svg(
            cell(370, 150, "Photos", 160, 44, size=17)
            + arrow(370, 174, 370, 212, INK_SOFT, 3)
            + cell(370, 238, "2024", 140, 44, size=17)
            + arrow(370, 262, 370, 300, INK_SOFT, 3)
            + cell(370, 326, "March", 140, 44, size=17)
            + arrow(370, 350, 370, 386, INK_SOFT, 3)
            + "".join(file_icon(250 + i * 80, 432, 0.44) for i in range(4))
            + text(592, 170, "the question", 15, INK_SOFT)      # staggered: side by side
            + arrow(592, 188, 592, 420, INK_SOFT, 3)            # they read as one line
            + text(710, 212, "the totals", 15, SIGNAL)
            + arrow(710, 420, 710, 230, SIGNAL, 3)
            + caption("DOWN AS A QUESTION · UP AS A NUMBER")
        ),
        svg(
            cell(290, 164, "Photos", 160, 44, size=17)
            + arrow(290, 188, 290, 228, INK_SOFT, 3)
            + cell(290, 254, "2024", 140, 44, size=17)
            + arrow(290, 278, 290, 318, INK_SOFT, 3)
            + cell(290, 344, "March", 140, 44, size=17)
            + arrow(374, 340, 384, 176, SIGNAL, 4)
            + text(520, 246, "a shortcut", 19, SIGNAL, weight=700, anchor="start")
            + text(520, 282, "pointing back up", 19, SIGNAL, anchor="start")
            + stamp(560, 400, "NEVER ENDS", angle=-6, size=22)
            + caption("TAKE AWAY THE BOTTOM")
        ),
    ],
    "sms-segments": [
        svg(
            page(320, 248, 400, 210,
                 ["Reminder: your appointment", "at the clinic is tomorrow", "at 10:30 am. Please", "bring your card."],
                 header="MESSAGE")
            + text(320, 392, "148 / 160", 28, INK, weight=700)
            + envelope(630, 240, 1.4)
            + text(630, 322, "4,000", 28, INK, weight=700)
            + caption("ONE MESSAGE EACH")
        ),
        svg(
            page(320, 248, 400, 210,
                 ["Reminder: your appointment", "at the clinic is tomorrow", "at 10:30 am. Please", "bring your card."],
                 header="MESSAGE")
            # clear of the last row of text: at cx=300 it sat on top of the final letter
            + f'<circle cx="348" cy="314" r="11" fill="none" stroke="{SIGNAL}" stroke-width="3"/>'
            + f'<circle cx="344" cy="311" r="1.7" fill="{SIGNAL}"/><circle cx="352" cy="311" r="1.7" fill="{SIGNAL}"/>'
            + f'<path d="M 343 318 Q 348 323 353 318" fill="none" stroke="{SIGNAL}" stroke-width="2"/>'
            + text(320, 392, "149 / 160", 28, SIGNAL, weight=700)
            + envelope(566, 222, 1.15) + envelope(628, 258, 1.15) + envelope(690, 294, 1.15)
            + text(628, 364, "12,000", 28, SIGNAL, weight=700)
            + caption("ONE SMALL FACE LATER")
        ),
        svg(
            rule_scale(400, 214, 560, 16, "160 SLOTS  ·  THE PLAIN ALPHABET", accent={9})
            + arrow(400, 250, 400, 336, SIGNAL, 5)
            + text(432, 300, "one character outside it", 16, SIGNAL, anchor="start")
            + rule_scale(400, 384, 560, 7, "70 SLOTS  ·  THE WIDER SCHEME", colour=SIGNAL)
            + caption("THE WHOLE MESSAGE MOVES")
        ),
        svg(
            text(240, 256, "149", 74, INK, weight=700, family="Karla, sans-serif")
            + text(240, 300, "ON THE SCREEN", 14, INK_SOFT, spacing=3)
            + text(560, 256, "150", 74, SIGNAL, weight=700, family="Karla, sans-serif")
            + text(560, 300, "ON THE BILL", 14, SIGNAL, spacing=3)
            + f'<path d="M 240 344 L 240 376 L 560 376 L 560 344" fill="none" stroke="{INK}" stroke-width="3"/>'
            + text(400, 414, "SAME MESSAGE", 18, INK, weight=700, spacing=3)
            + caption("TWO CORRECT ANSWERS")
        ),
    ],
    "polar-lander": [
        svg(
            parachute(280, 176, 0.9, drop=160)
            + f'<line x1="90" y1="474" x2="710" y2="474" stroke="{INK}" stroke-width="3"/>'
            + text(608, 232, "3 DEC 1999", 15, INK_SOFT, spacing=2)
            + f'<polyline points="500,330 522,296 544,352 566,306 588,330 610,330 730,330" fill="none" stroke="{SIGNAL}" stroke-width="3"/>'
            + text(668, 372, "SIGNAL ENDS", 14, SIGNAL, spacing=2)
            + caption("NEVER HEARD FROM AGAIN")
        ),
        svg(
            f'<path d="M 330 190 L 330 330 L 250 438" fill="none" stroke="{SLATE}" stroke-width="10"/>'
            + f'<circle cx="250" cy="438" r="18" fill="{SIGNAL}"/>'
            + text(250, 488, "SENSOR", 14, SIGNAL, spacing=2)
            + arrow(292, 424, 462, 372, INK_SOFT, 3)
            + slab(600, 356, "ENGINES", 190, 80, size=16)
            + text(600, 452, "off, and nothing holds it up", 17, INK)
            + caption("ONE JOB: NOTICE THE GROUND")
        ),
        svg(
            parachute(255, 146, 0.78, drop=150)
            + f'<path d="M 255 300 L 190 356 M 255 300 L 320 356" fill="none" stroke="{SLATE}" stroke-width="9"/>'
            + text(255, 400, "LEGS UNFOLD", 14, INK_SOFT, spacing=2)
            + f'<path d="M 344 332 l 20 -16 l -7 22 l 22 -9" fill="none" stroke="{SIGNAL}" stroke-width="4"/>'
            + text(600, 206, "STILL 1,500 m UP", 15, INK_SOFT, spacing=2)
            + cell(600, 300, "CONTACT", 210, 58, accent=True, size=20)
            + text(600, 362, "recorded, and kept", 16, SIGNAL)
            + caption("A JOLT, READ AS THE GROUND")
        ),
        svg(
            f'<line x1="210" y1="150" x2="210" y2="470" stroke="{INK}" stroke-width="3"/>'
            + "".join(f'<line x1="202" y1="{182 + i * 72}" x2="218" y2="{182 + i * 72}" stroke="{INK}" stroke-width="2"/>' for i in range(5))
            + text(190, 188, "1500 m", 14, INK_SOFT, anchor="end")
            + text(190, 404, "40 m", 14, SIGNAL, anchor="end", weight=700)
            + f'<rect x="226" y="380" width="178" height="46" fill="none" stroke="{SIGNAL}" stroke-width="3"/>'
            + text(315, 410, "WATCHING", 16, SIGNAL, weight=700, spacing=2)
            + cell(600, 246, "CONTACT", 200, 54, accent=True, size=18)
            + text(600, 296, "set at 1,500 m", 15, INK_SOFT)
            + arrow(600, 316, 600, 364, SIGNAL, 4)
            + stamp(600, 412, "ENGINES OFF", angle=-6, size=21)
            + text(400, 484, "descending at 13 m/s", 18, INK)
            + caption("THE WINDOW OPENS ON A READING ALREADY THERE")
        ),
    ],
    "gate-change": [
        svg(
            boarding_pass(200, 300, "B7")
            + text(200, 410, "in a pocket", 16, INK_SOFT)
            + departures(560, 290, GT_ROWS, w=380, highlight=1)
            + text(560, 420, "on the wall", 16, INK_SOFT)
            + caption("AT CHECK-IN, THE TWO AGREE")
        ),
        svg(
            f'<rect x="80" y="220" width="640" height="100" rx="6" fill="{SLATE}"/>'
            + text(110, 284, "09:25", 30, PAPER_WARM, "start")
            + text(270, 284, "GOA", 30, PAPER_WARM, "start", spacing=2)
            + f'<rect x="520" y="234" width="176" height="72" fill="{PAPER_WARM}" stroke="{SIGNAL}" stroke-width="3"/>'
            + f'<path d="M 540 294 L 572 246 M 562 298 L 604 242 M 594 298 L 636 242 M 626 298 L 668 244" '
              f'stroke="{INK_SOFT}" stroke-width="12" stroke-linecap="round" opacity="0.28"/>'
            + text(608, 204, "ONE PLACE FOR THE GATE", 15, SIGNAL, weight=700, spacing=2)
            + text(400, 386, "a new gate is written over the old one", 19, INK)
            + text(400, 424, "and nothing keeps the old one", 17, INK_SOFT)
            + caption("THE BOARD KEEPS NO HISTORY")
        ),
        svg(
            boarding_pass(165, 300, "B7", w=270)
            + text(165, 410, "still B7", 16, INK_SOFT)
            + departures(515, 300, [GT_ROWS[0], ("09:25", "GOA", "C12"), GT_ROWS[2]], w=360, highlight=1, accent=True)
            + cell(740, 196, "B7", 76, 44, strike=True, size=22)
            + arrow(740, 220, 704, 312, SIGNAL, 3)
            + caption("THE BOARD MOVES. THE PASS DOES NOT.")
        ),
        svg(
            slab(220, 160, "GATE B7", 180, 70, size=22)
            + slab(600, 160, "GATE C12", 180, 70, size=22)
            + figure(220, 470, 0.9)
            + f'<rect x="258" y="356" width="56" height="34" fill="{PAPER_WARM}" stroke="{INK}" stroke-width="2"/>'
            + text(286, 380, "B7", 15, INK, weight=700)
            + text(430, 290, "BOARD", 13, INK_SOFT, spacing=2)
            + cell(430, 330, "GOA   C12", 190, 50, accent=True, size=20)
            + f'<line x1="530" y1="316" x2="592" y2="212" stroke="{SIGNAL}" stroke-width="4" stroke-dasharray="10 8"/>'
            + arrow(590, 216, 597, 204, SIGNAL, 4)
            + caption("ONE LOOK AT THE BOARD")
        ),
    ],
    "localhost-link": [
        svg(
            laptop(200, 250, 280, signup_screen(256, 156.8), label="LAPTOP 1")
            + laptop(600, 250, 280,
                     text(128, 70, "CAN'T BE", 18, SIGNAL, weight=700, spacing=2)
                     + text(128, 100, "REACHED", 18, SIGNAL, weight=700, spacing=2),
                     label="LAPTOP 2")
            + bubble(290, 420, ["localhost:3000"], w=220)
            + arrow(514, 434, 470, 372, INK_SOFT, 3)
            + caption("IT OPENED A MINUTE AGO")
        ),
        svg(
            text(200, 96, "AN ORDINARY NAME", 16, INK_SOFT, spacing=2)
            + "".join(slab(100, yy, "PC", 96, 56, size=15) for yy in (180, 300, 420))
            + slab(300, 300, "SERVER", 124, 90, size=16)
            + arrow(150, 186, 236, 276, INK, 3)
            + arrow(150, 300, 236, 300, INK, 3)
            + arrow(150, 414, 236, 324, INK, 3)
            + text(300, 376, "one place", 15, INK_SOFT)
            + f'<line x1="400" y1="70" x2="400" y2="500" stroke="{INK_SOFT}" stroke-width="2" stroke-dasharray="8 8"/>'
            + text(600, 100, "localhost", 24, SIGNAL, weight=700)
            + "".join(slab(560, yy, "PC", 96, 56, size=15) + loop_back(664, yy, 26) for yy in (180, 300, 420))
            + text(600, 490, "each one means itself", 15, INK_SOFT)
            + caption("ONE NAME THAT ALWAYS MEANS HERE")
        ),
        svg(
            f'<rect x="40" y="60" width="340" height="440" fill="none" stroke="{INK}" stroke-width="2" stroke-dasharray="10 6"/>'
            + f'<rect x="420" y="60" width="340" height="440" fill="none" stroke="{INK}" stroke-width="2" stroke-dasharray="10 6"/>'
            + text(210, 100, "LAPTOP 1", 16, INK_SOFT, spacing=2)
            + text(590, 100, "LAPTOP 2", 16, INK_SOFT, spacing=2)
            + doorway(190, 450, "3000", behind=file_icon(190, 340, 1.0, "sign-up page"))
            + doorway(570, 450, "3000", behind=text(570, 366, "nothing", 17, INK_SOFT))
            + caption("THE SAME WORDS, READ IN TWO PLACES")
        ),
        svg(
            f'<g opacity="0.4">{laptop(220, 250, 240, label="LAPTOP 1")}</g>'
            + laptop(560, 250, 240, signup_screen(216, 134.4), label="LAPTOP 2")
            + f'<path d="M 538 108 L 556 128 L 590 88" fill="none" stroke="{TEAL}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'
            + loop_back(730, 250, 36)
            + text(730, 320, "its own", 15, SIGNAL, weight=600)
            + caption("IT WORKED. IT WAS THEIR OWN PAGE.")
        ),
    ],
    "deleting-rows": [
        svg(
            sheet(440, 290, [("2", "Anand Traders", False), ("3", "Bose & Sons", False),
                             ("4", "Chawla Metals", True), ("5", "Desai Paper", False),
                             ("6", "Iyer Brothers", True), ("7", "Joshi Paints", True),
                             ("8", "Kapoor Tools", False), ("9", "Lal Fabrics", False)],
                  w=420, marker=0)
            + caption("START AT ROW 2. DELETE AS YOU GO.")
        ),
        svg(
            sheet(380, 280, [("20", "Nair Cables", False), ("21", "Oberoi Foods", True),
                             ("22", "Pillai Rice", False), ("23", "Qureshi Tiles", False),
                             ("24", "Rao Steel", False), ("25", "Sethi Glass", False)],
                  w=420, struck=(1,), up=(2, 3, 4, 5))
            + text(690, 300, "each row", 15, SIGNAL, weight=600)
            + text(690, 322, "moves up one", 15, SIGNAL, weight=600)
            + caption("NO HOLES: EVERYTHING BELOW MOVES UP")
        ),
        svg(
            text(225, 160, "BEFORE", 16, INK_SOFT, weight=700, spacing=3)
            + sheet(225, 290, [("5", "Desai Paper", False), ("6", "Iyer Brothers", True),
                               ("7", "Joshi Paints", True), ("8", "Kapoor Tools", False)],
                    w=300, struck=(1,), marker=1)
            + text(612, 160, "AFTER", 16, INK_SOFT, weight=700, spacing=3)
            + sheet(612, 290, [("5", "Desai Paper", False), ("6", "Joshi Paints", True),
                               ("7", "Kapoor Tools", False), ("8", "Lal Fabrics", False)],
                    w=300, accent=(1,), marker=2)
            + text(612, 434, "moved up to 6, never read", 16, SIGNAL, weight=600)
            + caption("THE ONE THAT MOVED UP WAS NEVER READ")
        ),
        svg(
            sheet(390, 290, [("4", "Desai Paper", False), ("5", "Joshi Paints", True),
                             ("6", "Kapoor Tools", False), ("7", "Lal Fabrics", False),
                             ("8", "Menon Traders", False), ("9", "Ghosh Leather", True),
                             ("10", "Sen Printers", False), ("11", "Tandon Wires", True)],
                  w=420, circled=(1, 5, 7))
            + arrow(668, 450, 668, 140, INK, 4)
            + text(724, 290, "BOTTOM", 14, INK, weight=700, spacing=2)
            + text(724, 312, "UP", 14, INK, weight=700, spacing=2)
            + caption("THREE LEFT, EACH BENEATH ONE THAT WENT")
        ),
    ],
    "ssh-channel": [
        svg(
            page(400, 290, w=470, h=230, header="SECURITY ADVISORY",
                 rows=["DATE      7 MAR 2002", "PROGRAM   OpenSSH", "AFFECTED  2.0 to 3.0.2", "FIXED IN  3.1"],
                 ticks={3: "✓"})
            + f'<line x1="189" y1="327" x2="436" y2="327" stroke="{SIGNAL}" stroke-width="4"/>'
            + caption("EVERY VERSION FROM 2.0 TO 3.0.2")
        ),
        svg(
            slab(370, 168, "REFUSE BELOW 0 OR ABOVE 10", 480, 64, size=18)
            + arrow(150, 202, 92, 262, INK_SOFT, 3)
            + f'<line x1="85" y1="266" x2="85" y2="372" stroke="{SIGNAL}" stroke-width="8" stroke-linecap="round"/>'
            + charline(OC_X, OC_Y, "0123456789", cell_w=OC_CELL)
            + text(OC_X + OC_CELL * 5, 404, "ten slots", 16, INK_SOFT)
            + caption("TEN SLOTS, NUMBERED 0 TO 9")
        ),
        svg(
            text(360, 112, "IS 10 ABOVE 10?  NO.", 20, SIGNAL, weight=700, spacing=1)
            + f'<line x1="85" y1="266" x2="85" y2="372" stroke="{SIGNAL}" stroke-width="8" stroke-linecap="round"/>'
            + f'<path d="M 44 250 Q 360 90 646 262" fill="none" stroke="{SIGNAL}" stroke-width="4"/>'
            + arrow(636, 250, 650, 276, SIGNAL, 4)
            + charline(OC_X, OC_Y, "0123456789", cell_w=OC_CELL)
            + f'<rect x="{OC_X + OC_CELL * 10 + 2}" y="{OC_Y - OC_CELL * 0.78}" width="{OC_CELL - 4}" '
              f'height="{OC_CELL * 1.06}" fill="none" stroke="{SIGNAL}" stroke-width="3" stroke-dasharray="6 5"/>'
            + text(OC_X + OC_CELL * 10.5, OC_Y + OC_CELL * 0.1, "10", OC_CELL * 0.5, SIGNAL, weight=700)
            + text(OC_X + OC_CELL * 10.5, 400, "past the end", 14, SIGNAL, weight=600)
            + caption("TEN IS NOT ABOVE TEN")
        ),
        svg(
            text(400, 180, "BEFORE  (3.0.2)", 15, INK_SOFT, spacing=2)
            + text(400, 230, "if (id < 0 || id ", 24, INK, anchor="end")
            + text(398, 230, ">", 24, INK, anchor="start")
            + text(438, 230, " channels_alloc)", 24, INK, anchor="start")
            + text(400, 312, "AFTER  (3.1)", 15, INK_SOFT, spacing=2)
            + text(400, 362, "if (id < 0 || id ", 24, INK, anchor="end")
            + text(398, 362, ">", 24, INK, anchor="start")
            + text(425, 362, "=", 24, SIGNAL, weight=700)
            + text(438, 362, " channels_alloc)", 24, INK, anchor="start")
            + f'<ellipse cx="425" cy="354" rx="11" ry="19" fill="none" stroke="{SIGNAL}" stroke-width="3"/>'
            + text(400, 440, "at or above the count: refused", 19, INK)
            + caption("ONE CHARACTER")
        ),
    ],
}


def main():
    for story_id, panels in PANELS.items():
        folder = os.path.abspath(os.path.join(OUT, story_id))
        os.makedirs(folder, exist_ok=True)
        for i, markup in enumerate(panels, start=1):
            path = os.path.join(folder, f"panel-{i}.svg")
            with open(path, "w", encoding="utf-8") as handle:
                handle.write(markup)
            print("wrote", os.path.relpath(path))


if __name__ == "__main__":
    main()
