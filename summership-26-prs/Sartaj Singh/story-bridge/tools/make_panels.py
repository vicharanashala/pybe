#!/usr/bin/env python3
"""
Generates the flat SVG panel art for every story.

These are placeholders in the sense that they are meant to be replaced by
rendered illustrations, but they are drawn to the real palette and composition
rules so the app is presentable without them. Run from the submission root:

    python3 tools/make_panels.py

Output: client/public/stories/<storyId>/panel-N.svg
"""

import os
import textwrap

OUT = os.path.join(os.path.dirname(__file__), "..", "client", "public", "stories")

W, H = 800, 600

# Manuscript pigments — must match client/src/stories/stories.css
NIGHT = "#141c39"
INDIGO = "#1e2a52"
INDIGO_SOFT = "#3a4a7d"
PALM = "#e7dfc6"
PALM_WARM = "#f3eddc"
HALDI = "#c98a14"
SINDOOR = "#b33f35"
VERDIGRIS = "#35705e"
SOOT = "#241e19"


def svg(body, sky=INDIGO, ground=None):
    ground_layer = (
        f'<rect x="0" y="{H*0.68:.0f}" width="{W}" height="{H*0.32:.0f}" fill="{ground}"/>'
        if ground
        else ""
    )
    return textwrap.dedent(f"""\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">
      <rect width="{W}" height="{H}" fill="{sky}"/>
      {ground_layer}
      {body}
      <rect x="8" y="8" width="{W-16}" height="{H-16}" fill="none" stroke="{HALDI}" stroke-width="1.5" opacity="0.5"/>
      <rect x="15" y="15" width="{W-30}" height="{H-30}" fill="none" stroke="{HALDI}" stroke-width="0.75" opacity="0.3"/>
    </svg>
    """)


def crow(x, y, s=1.0, fill=SOOT, flip=False):
    """A crow silhouette: body, wing, head, beak, legs."""
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="46" ry="28" fill="{fill}"/>
      <path d="M -30 -8 Q 5 -34 40 -12 Q 10 -6 -30 -8 Z" fill="{fill}" opacity="0.75"/>
      <circle cx="38" cy="-22" r="19" fill="{fill}"/>
      <path d="M 54 -24 L 78 -18 L 54 -13 Z" fill="{HALDI}"/>
      <circle cx="44" cy="-27" r="3.2" fill="{PALM_WARM}"/>
      <path d="M -44 4 Q -68 12 -78 2" stroke="{fill}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M -8 26 L -10 46 M 12 26 L 14 46" stroke="{fill}" stroke-width="4.5" stroke-linecap="round"/>
    </g>"""


def pot(x, y, s=1.0, water_frac=0.18, pebbles=0):
    """A narrow-necked clay pot with a visible water level and stacked pebbles."""
    body_top, body_bot = -110, 90
    inner_w = 62
    water_y = body_bot - (body_bot - body_top + 40) * water_frac
    peb = ""
    for i in range(pebbles):
        row, col = divmod(i, 5)
        px = -inner_w + 14 + col * 26 + (13 if row % 2 else 0)
        py = body_bot - 12 - row * 15
        peb += f'<ellipse cx="{px}" cy="{py}" rx="10" ry="8" fill="{SOOT}" opacity="0.85"/>'
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <path d="M -34 {body_top} L -38 {body_top+34} Q -92 {body_top+90} -84 {body_bot-46}
               Q -76 {body_bot} 0 {body_bot} Q 76 {body_bot} 84 {body_bot-46}
               Q 92 {body_top+90} 38 {body_top+34} L 34 {body_top} Z"
            fill="#8d5a3c"/>
      <path d="M -34 {body_top} L -38 {body_top+34} Q -92 {body_top+90} -84 {body_bot-46}
               Q -76 {body_bot} 0 {body_bot} L 0 {body_top} Z"
            fill="#7a4a30"/>
      <ellipse cx="0" cy="{body_top}" rx="34" ry="10" fill="#5e3624"/>
      <ellipse cx="0" cy="{body_top}" rx="26" ry="7" fill="{NIGHT}"/>
      <clipPath id="potclip{int(x)}{int(y)}{pebbles}">
        <path d="M -30 {body_top} Q -80 {body_top+92} -74 {body_bot-46}
                 Q -68 {body_bot-6} 0 {body_bot-6} Q 68 {body_bot-6} 74 {body_bot-46}
                 Q 80 {body_top+92} 30 {body_top} Z"/>
      </clipPath>
      <g clip-path="url(#potclip{int(x)}{int(y)}{pebbles})">
        <rect x="-90" y="{water_y}" width="180" height="{body_bot - water_y + 10}" fill="{VERDIGRIS}" opacity="0.85"/>
        <rect x="-90" y="{water_y}" width="180" height="5" fill="{PALM}" opacity="0.6"/>
        {peb}
      </g>
      <path d="M -60 {body_top+60} Q -66 {body_bot-60} -58 {body_bot-30}"
            stroke="{HALDI}" stroke-width="2" fill="none" opacity="0.35"/>
    </g>"""


def sun(x, y, r=54, fill=HALDI):
    rays = "".join(
        f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y-r-26}" stroke="{fill}" stroke-width="3" '
        f'opacity="0.5" transform="rotate({a},{x},{y})"/>'
        for a in range(0, 360, 30)
    )
    return f'{rays}<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" opacity="0.9"/>'


def cracks(y, fill=SOOT):
    out = ""
    for i, x in enumerate(range(40, W, 95)):
        out += (
            f'<path d="M {x} {y+18+i%3*12} l 34 -16 l 30 20 l 26 -12" '
            f'stroke="{fill}" stroke-width="2" fill="none" opacity="0.35"/>'
        )
    return out


def jackal(x, y, s=1.0, coat="#8a6a45", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="78" ry="40" fill="{coat}"/>
      <path d="M -74 -6 Q -122 -30 -136 -66 Q -104 -44 -80 -30 Z" fill="{coat}"/>
      <path d="M 58 -18 Q 92 -30 104 -58 L 118 -30 Q 126 -14 108 -6 L 74 2 Z" fill="{coat}"/>
      <path d="M 96 -56 L 88 -92 L 112 -68 Z" fill="{coat}"/>
      <path d="M 116 -54 L 122 -88 L 134 -58 Z" fill="{coat}"/>
      <path d="M 108 -6 L 140 -2 L 138 8 L 106 6 Z" fill="{coat}"/>
      <circle cx="112" cy="-40" r="4" fill="{NIGHT}"/>
      <path d="M -44 34 L -48 74 M -14 36 L -16 74 M 20 36 L 22 74 M 50 30 L 54 72"
            stroke="{coat}" stroke-width="11" stroke-linecap="round"/>
    </g>"""


def elephant(x, y, s=1.0, fill="#6c7a94"):
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <ellipse cx="0" cy="0" rx="150" ry="102" fill="{fill}"/>
      <circle cx="-146" cy="-34" r="72" fill="{fill}"/>
      <path d="M -108 -78 Q -46 -110 -34 -46 Q -52 -8 -104 -22 Z" fill="{fill}" opacity="0.72"/>
      <path d="M -196 -6 Q -228 74 -196 124 Q -172 150 -156 122 Q -180 84 -166 24 Z" fill="{fill}"/>
      <path d="M -178 34 Q -218 62 -232 44" stroke="{PALM_WARM}" stroke-width="13"
            fill="none" stroke-linecap="round"/>
      <circle cx="-160" cy="-46" r="6" fill="{NIGHT}"/>
      <path d="M -96 84 L -100 172 M -22 96 L -24 176 M 62 94 L 66 174 M 122 76 L 128 166"
            stroke="{fill}" stroke-width="40" stroke-linecap="round"/>
      <path d="M 148 -22 Q 186 -6 178 46" stroke="{fill}" stroke-width="9"
            fill="none" stroke-linecap="round"/>
    </g>"""


def person(x, y, s=1.0, robe=PALM_WARM, reach=1):
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <path d="M -26 76 L -14 -6 Q 0 -20 14 -6 L 26 76 Z" fill="{robe}"/>
      <circle cx="0" cy="-32" r="18" fill="{robe}"/>
      <path d="M -6 -38 Q 0 -44 6 -38" stroke="{SOOT}" stroke-width="2.5" fill="none"/>
      <path d="M 10 -4 Q {30*reach} -18 {52*reach} -12" stroke="{robe}" stroke-width="10"
            fill="none" stroke-linecap="round"/>
    </g>"""


def goat(x, y, s=1.0, coat="#d8c9a0", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="54" ry="30" fill="{coat}"/>
      <path d="M -50 -14 L -76 -30 L -70 -6 Z" fill="{coat}"/>
      <circle cx="52" cy="-24" r="21" fill="{coat}"/>
      <path d="M 66 -14 L 88 -10 L 66 -4 Z" fill="{coat}"/>
      <path d="M 46 -42 Q 34 -70 52 -78" stroke="{coat}" stroke-width="7"
            fill="none" stroke-linecap="round"/>
      <path d="M 60 -42 Q 54 -72 72 -76" stroke="{coat}" stroke-width="7"
            fill="none" stroke-linecap="round"/>
      <path d="M 58 -4 L 62 14" stroke="{coat}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="58" cy="-30" r="3.2" fill="{NIGHT}"/>
      <path d="M -34 26 L -36 66 M -6 28 L -8 68 M 22 28 L 24 68 M 44 24 L 46 64"
            stroke="{coat}" stroke-width="9" stroke-linecap="round"/>
    </g>"""


def monkey(x, y, s=1.0, coat="#7a5b3a", cap_fill=None, flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    hat = ""
    if cap_fill:
        hat = (f'<path d="M -19 -66 Q 0 -88 19 -66 Z" fill="{cap_fill}"/>'
               f'<rect x="-24" y="-68" width="48" height="7" rx="3.5" fill="{cap_fill}"/>')
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="30" ry="38" fill="{coat}"/>
      <circle cx="0" cy="-52" r="24" fill="{coat}"/>
      <circle cx="-24" cy="-58" r="9" fill="{coat}"/>
      <circle cx="24" cy="-58" r="9" fill="{coat}"/>
      <ellipse cx="0" cy="-46" rx="14" ry="12" fill="{PALM_WARM}" opacity="0.5"/>
      <circle cx="-7" cy="-56" r="3" fill="{NIGHT}"/>
      <circle cx="7" cy="-56" r="3" fill="{NIGHT}"/>
      <path d="M -26 -12 Q -52 6 -46 30" stroke="{coat}" stroke-width="10"
            fill="none" stroke-linecap="round"/>
      <path d="M 26 -12 Q 52 6 46 30" stroke="{coat}" stroke-width="10"
            fill="none" stroke-linecap="round"/>
      <path d="M -14 32 L -18 62 M 14 32 L 18 62" stroke="{coat}" stroke-width="10"
            stroke-linecap="round"/>
      <path d="M 26 22 Q 62 34 58 -4 Q 56 -20 42 -18" stroke="{coat}" stroke-width="7"
            fill="none" stroke-linecap="round"/>
      {hat}
    </g>"""


def tree(x, y, s=1.0, canopy="#2f5a44", trunk="#5e3624", roots=False, fruit=None):
    hang = ""
    if roots:
        hang = "".join(
            f'<path d="M {rx} -150 L {rx + 5} -4" stroke="{trunk}" stroke-width="5" opacity="0.65"/>'
            for rx in (-148, -98, -54, 62, 108, 150)
        )
    berries = ""
    if fruit:
        spots = [(-150, -176), (-88, -214), (-24, -168), (46, -206),
                 (118, -172), (162, -196), (-116, -132), (96, -126)]
        berries = "".join(
            f'<circle cx="{bx}" cy="{by}" r="8" fill="{fruit}" opacity="0.9"/>'
            for bx, by in spots
        )
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <path d="M -26 0 L -18 -152 L 18 -152 L 26 0 Z" fill="{trunk}"/>
      {hang}
      <ellipse cx="0" cy="-186" rx="196" ry="86" fill="{canopy}"/>
      <ellipse cx="-118" cy="-152" rx="96" ry="52" fill="{canopy}"/>
      <ellipse cx="122" cy="-150" rx="92" ry="50" fill="{canopy}"/>
      <ellipse cx="0" cy="-232" rx="120" ry="56" fill="{canopy}" opacity="0.88"/>
      {berries}
    </g>"""


def tortoise(x, y, s=1.0, shell="#4a6b3f", skin="#8a7f5c", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <path d="M -56 6 Q -50 -46 0 -46 Q 50 -46 56 6 Z" fill="{shell}"/>
      <path d="M -56 6 Q 0 22 56 6 L 56 13 Q 0 29 -56 13 Z" fill="{skin}"/>
      <path d="M -28 -40 L -24 4 M 0 -46 L 0 6 M 28 -40 L 24 4"
            stroke="{NIGHT}" stroke-width="2" opacity="0.32" fill="none"/>
      <circle cx="70" cy="-6" r="15" fill="{skin}"/>
      <circle cx="76" cy="-10" r="2.8" fill="{NIGHT}"/>
      <path d="M -40 14 L -42 30 M -12 16 L -14 32 M 16 16 L 18 32 M 42 14 L 44 30"
            stroke="{skin}" stroke-width="9" stroke-linecap="round"/>
    </g>"""


def goose(x, y, s=1.0, body=PALM_WARM, flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="48" ry="26" fill="{body}"/>
      <path d="M -34 -6 Q 2 -32 38 -10 Q 4 -2 -34 -6 Z" fill="{body}" opacity="0.65"/>
      <path d="M 30 -14 Q 52 -32 50 -56" stroke="{body}" stroke-width="15"
            fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="-62" r="13" fill="{body}"/>
      <path d="M 60 -64 L 82 -60 L 60 -55 Z" fill="{HALDI}"/>
      <circle cx="54" cy="-66" r="2.8" fill="{NIGHT}"/>
      <path d="M -46 6 Q -68 12 -76 4" stroke="{body}" stroke-width="8"
            fill="none" stroke-linecap="round"/>
    </g>"""


def lion(x, y, s=1.0, coat="#b8873f", mane="#8a5a1e", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="86" ry="44" fill="{coat}"/>
      <path d="M -80 -10 Q -128 -34 -142 -72 Q -110 -46 -84 -34 Z" fill="{coat}"/>
      <circle cx="78" cy="-40" r="44" fill="{mane}"/>
      <circle cx="80" cy="-40" r="28" fill="{coat}"/>
      <path d="M 104 -34 L 126 -30 L 104 -24 Z" fill="{coat}"/>
      <circle cx="90" cy="-46" r="3.4" fill="{NIGHT}"/>
      <circle cx="70" cy="-46" r="3.4" fill="{NIGHT}"/>
      <path d="M -50 38 L -54 84 M -16 40 L -18 86 M 22 40 L 24 86 M 56 34 L 60 82"
            stroke="{coat}" stroke-width="13" stroke-linecap="round"/>
    </g>"""


def rabbit(x, y, s=1.0, coat="#cfc3a4", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="34" ry="24" fill="{coat}"/>
      <circle cx="30" cy="-24" r="17" fill="{coat}"/>
      <path d="M 26 -40 Q 20 -78 30 -82 Q 39 -76 34 -40 Z" fill="{coat}"/>
      <path d="M 40 -40 Q 43 -76 53 -76 Q 57 -68 46 -38 Z" fill="{coat}"/>
      <circle cx="38" cy="-28" r="2.8" fill="{NIGHT}"/>
      <circle cx="-34" cy="2" r="10" fill="{coat}" opacity="0.85"/>
      <path d="M -14 20 L -16 40 M 12 20 L 14 40" stroke="{coat}" stroke-width="7"
            stroke-linecap="round"/>
    </g>"""


def deer(x, y, s=1.0, coat="#a9764a", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="66" ry="34" fill="{coat}"/>
      <path d="M 46 -20 Q 76 -36 82 -66" stroke="{coat}" stroke-width="17"
            fill="none" stroke-linecap="round"/>
      <circle cx="86" cy="-76" r="17" fill="{coat}"/>
      <path d="M 98 -80 L 118 -74 L 98 -70 Z" fill="{coat}"/>
      <path d="M 78 -92 L 70 -126 M 78 -92 L 92 -118 M 92 -118 L 84 -140 M 92 -118 L 110 -134"
            stroke="{coat}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="92" cy="-80" r="3" fill="{NIGHT}"/>
      <path d="M -60 -12 Q -86 -22 -90 -44" stroke="{coat}" stroke-width="7"
            fill="none" stroke-linecap="round"/>
      <path d="M -40 30 L -44 78 M -12 32 L -14 80 M 18 32 L 20 80 M 44 26 L 48 76"
            stroke="{coat}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="-20" cy="-8" r="4" fill="{PALM_WARM}" opacity="0.45"/>
      <circle cx="10" cy="-14" r="4" fill="{PALM_WARM}" opacity="0.45"/>
      <circle cx="-2" cy="8" r="4" fill="{PALM_WARM}" opacity="0.45"/>
    </g>"""


def mouse(x, y, s=1.0, coat="#8a7f72", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="30" ry="20" fill="{coat}"/>
      <circle cx="26" cy="-8" r="14" fill="{coat}"/>
      <circle cx="15" cy="-23" r="10" fill="{coat}"/>
      <path d="M 39 -6 L 54 -3 L 39 1 Z" fill="{coat}"/>
      <circle cx="33" cy="-12" r="2.4" fill="{NIGHT}"/>
      <path d="M -28 -4 Q -62 -12 -68 -34" stroke="{coat}" stroke-width="4"
            fill="none" stroke-linecap="round"/>
      <path d="M -12 18 L -14 32 M 10 16 L 12 32" stroke="{coat}" stroke-width="6"
            stroke-linecap="round"/>
    </g>"""


def crocodile(x, y, s=1.0, fill="#3d5c3a", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <path d="M -150 10 Q -80 -14 0 -10 Q 90 -6 148 -2 L 154 16 Q 80 28 0 24
               Q -80 22 -150 28 Z" fill="{fill}"/>
      <path d="M 100 -6 L 188 2 L 190 16 L 100 18 Z" fill="{fill}"/>
      <path d="M 188 5 L 204 8 L 188 12 Z" fill="{SINDOOR}" opacity="0.8"/>
      <circle cx="120" cy="-12" r="10" fill="{fill}"/>
      <circle cx="120" cy="-14" r="3.4" fill="{HALDI}"/>
      <path d="M -62 -12 l 12 -18 l 12 18 M -22 -12 l 12 -18 l 12 18
               M 18 -10 l 12 -18 l 12 18" fill="{fill}"/>
      <path d="M -150 12 Q -190 -6 -200 -36" stroke="{fill}" stroke-width="14"
            fill="none" stroke-linecap="round"/>
    </g>"""


def serpent(x, y, s=1.0, fill="#16241c", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <path d="M -92 62 Q 32 70 22 8 Q 14 -36 -30 -32 Q -64 -28 -60 4 Q -57 27 -30 25"
            stroke="{fill}" stroke-width="22" fill="none" stroke-linecap="round"/>
      <circle cx="-30" cy="25" r="14" fill="{fill}"/>
      <path d="M -42 23 L -64 21 L -51 30 Z" fill="{SINDOOR}"/>
      <circle cx="-30" cy="19" r="3" fill="{HALDI}"/>
    </g>"""


def sack(x, y, s=1.0, fill="#a8946b"):
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <path d="M -54 40 Q -70 -40 -26 -62 L 26 -62 Q 70 -40 54 40 Z" fill="{fill}"/>
      <path d="M -30 -62 Q 0 -80 30 -62" stroke="{SOOT}" stroke-width="6" fill="none"/>
      <path d="M -32 -48 L 32 -48" stroke="{SOOT}" stroke-width="3" opacity="0.35"/>
    </g>"""


def well(x, y, s=1.0, stone="#6f6553"):
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <ellipse cx="0" cy="-70" rx="88" ry="27" fill="{stone}"/>
      <ellipse cx="0" cy="-70" rx="66" ry="18" fill="{NIGHT}"/>
      <path d="M -88 -70 L -78 62 L 78 62 L 88 -70 Z" fill="{stone}"/>
      <path d="M -88 -70 L -78 62 L 0 62 L 0 -70 Z" fill="{stone}" opacity="0.7"/>
      <path d="M -82 -30 L 82 -30 M -79 6 L 79 6" stroke="{NIGHT}" stroke-width="2.5"
            opacity="0.28"/>
      <path d="M -30 -30 L -30 6 M 30 -30 L 30 6 M 0 6 L 0 44" stroke="{NIGHT}"
            stroke-width="2.5" opacity="0.28"/>
    </g>"""


def cap(x, y, s=1.0, fill=SINDOOR, flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <path d="M -20 0 Q 0 -27 20 0 Z" fill="{fill}"/>
      <rect x="-25" y="-2" width="50" height="7" rx="3.5" fill="{fill}"/>
    </g>"""


def bundle(x, y, s=1.0, count=6, fill=SINDOOR, cloth="#c9b98d"):
    stack = "".join(
        f'<ellipse cx="0" cy="{-i * 13}" rx="{40 - i}" ry="10" fill="{fill}" '
        f'opacity="{0.95 - i * 0.05:.2f}"/>'
        for i in range(count)
    )
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <ellipse cx="0" cy="7" rx="52" ry="14" fill="{cloth}"/>
      {stack}
    </g>"""


def necklace(x, y, s=1.0, fill=HALDI):
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <path d="M -34 -20 Q 0 36 34 -20" stroke="{fill}" stroke-width="4" fill="none"/>
      <circle cx="-34" cy="-20" r="5" fill="{fill}"/>
      <circle cx="-22" cy="4" r="5" fill="{fill}"/>
      <circle cx="0" cy="13" r="6.5" fill="{fill}"/>
      <circle cx="22" cy="4" r="5" fill="{fill}"/>
      <circle cx="34" cy="-20" r="5" fill="{fill}"/>
    </g>"""


def netting(x, y, w=260, h=170, fill=PALM, opacity=0.5):
    """A loose mesh drawn over a region — the hunter's net."""
    out = ""
    for i in range(0, w + 1, 26):
        out += (f'<path d="M {x + i} {y} L {x + i - 18} {y + h}" stroke="{fill}" '
                f'stroke-width="2.5" opacity="{opacity}"/>')
    for j in range(0, h + 1, 26):
        out += (f'<path d="M {x} {y + j} L {x + w} {y + j - 10}" stroke="{fill}" '
                f'stroke-width="2.5" opacity="{opacity}"/>')
    return out


def waves(y, fill=PALM, rows=3, gap=36, opacity=0.26):
    return "".join(
        f'<path d="M 0 {y + r * gap} q 40 -12 80 0 t 80 0 t 80 0 t 80 0 t 80 0 '
        f't 80 0 t 80 0 t 80 0 t 80 0 t 80 0" stroke="{fill}" stroke-width="2.5" '
        f'fill="none" opacity="{opacity}"/>'
        for r in range(rows)
    )


def moon(x, y, r=44, fill=PALM_WARM, sky=NIGHT):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" opacity="0.9"/>'
            f'<circle cx="{x - 17}" cy="{y - 9}" r="{r}" fill="{sky}"/>')


def stick(x1, y1, x2, y2, fill="#7a5c33", width=7):
    return (f'<path d="M {x1} {y1} L {x2} {y2}" stroke="{fill}" stroke-width="{width}" '
            f'stroke-linecap="round"/>')


def lying(markup, x, y, angle=-78):
    """Rotates a figure about its own origin so it reads as lying down."""
    return f'<g transform="rotate({angle},{x},{y})">{markup}</g>'


def frog(x, y, s=1.0, fill="#4a7c3f", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="42" ry="27" fill="{fill}"/>
      <path d="M -40 -8 Q -20 -40 2 -34 Q 26 -40 44 -10 Z" fill="{fill}"/>
      <circle cx="-16" cy="-34" r="12" fill="{fill}"/>
      <circle cx="18" cy="-34" r="12" fill="{fill}"/>
      <circle cx="-16" cy="-36" r="5" fill="{PALM_WARM}"/>
      <circle cx="18" cy="-36" r="5" fill="{PALM_WARM}"/>
      <circle cx="-16" cy="-36" r="2.4" fill="{NIGHT}"/>
      <circle cx="18" cy="-36" r="2.4" fill="{NIGHT}"/>
      <path d="M -14 -4 Q 2 6 16 -4" stroke="{NIGHT}" stroke-width="2.5"
            fill="none" opacity="0.45"/>
      <path d="M -36 14 Q -60 20 -56 40 L -32 32 Z" fill="{fill}"/>
      <path d="M 36 14 Q 60 20 56 40 L 32 32 Z" fill="{fill}"/>
    </g>"""


def fox(x, y, s=1.0, coat="#b5622f", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="70" ry="33" fill="{coat}"/>
      <path d="M -62 -6 Q -118 -18 -144 -62 Q -132 -16 -104 4 Q -84 12 -62 14 Z" fill="{coat}"/>
      <path d="M -140 -58 Q -152 -72 -147 -82 Q -128 -74 -125 -59 Z" fill="{PALM_WARM}"/>
      <path d="M 54 -16 Q 88 -28 100 -56 L 116 -28 Q 122 -12 104 -6 L 70 4 Z" fill="{coat}"/>
      <path d="M 92 -54 L 84 -94 L 110 -66 Z" fill="{coat}"/>
      <path d="M 112 -52 L 120 -90 L 132 -56 Z" fill="{coat}"/>
      <path d="M 104 -6 L 140 -2 L 138 8 L 102 6 Z" fill="{coat}"/>
      <circle cx="110" cy="-38" r="4" fill="{NIGHT}"/>
      <path d="M -40 30 L -44 70 M -12 32 L -14 72 M 18 32 L 20 72 M 46 28 L 50 68"
            stroke="{coat}" stroke-width="10" stroke-linecap="round"/>
    </g>"""


def cheese(x, y, s=1.0, fill=HALDI):
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <path d="M -22 10 L 22 10 L 16 -12 L -16 -12 Z" fill="{fill}"/>
      <path d="M -16 -12 L 16 -12 L 14 -19 L -14 -19 Z" fill="{fill}" opacity="0.65"/>
      <circle cx="-6" cy="2" r="3" fill="{SOOT}" opacity="0.3"/>
      <circle cx="8" cy="-2" r="2.4" fill="{SOOT}" opacity="0.3"/>
    </g>"""


def split_log(x, y, s=1.0, fill="#7a5c33", gap=17, wedge=True):
    """A half-split log; gap=0 closes it. The wedge is what holds the gap open."""
    wedge_art = ""
    if wedge:
        wedge_art = (f'<path d="M 24 {-gap - 5} L 24 {gap + 5} L 76 {gap - 7} '
                     f'L 76 {-gap + 7} Z" fill="#6f6553"/>')
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <rect x="-150" y="{-gap - 30}" width="300" height="30" fill="{fill}"/>
      <rect x="-150" y="{gap}" width="300" height="30" fill="{fill}"/>
      <ellipse cx="-150" cy="{-gap - 15}" rx="11" ry="15" fill="#5e3624"/>
      <ellipse cx="-150" cy="{gap + 15}" rx="11" ry="15" fill="#5e3624"/>
      {wedge_art}
    </g>"""


def burrow(x, y, s=1.0, mound="#8a7648", hole=NIGHT, crushed=False):
    if crushed:
        return (f'<g transform="translate({x},{y}) scale({s})">'
                f'<ellipse cx="0" cy="2" rx="40" ry="10" fill="{mound}" opacity="0.55"/></g>')
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <ellipse cx="0" cy="0" rx="38" ry="16" fill="{mound}"/>
      <ellipse cx="0" cy="-3" rx="13" ry="7" fill="{hole}"/>
    </g>"""


def ruins(y, fill="#6f6553"):
    out = ""
    for i, (rx, rw, rh) in enumerate(
        [(50, 52, 74), (186, 38, 44), (300, 60, 100), (466, 42, 52), (598, 56, 80), (716, 36, 40)]
    ):
        out += (f'<rect x="{rx}" y="{y - rh}" width="{rw}" height="{rh}" fill="{fill}" '
                f'opacity="{0.78 - i * 0.04:.2f}"/>')
    return out


def hut(x, y, s=1.0, wall="#8a6a45", roof="#6f5a33"):
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <rect x="-58" y="-68" width="116" height="68" fill="{wall}"/>
      <path d="M -78 -68 L 0 -126 L 78 -68 Z" fill="{roof}"/>
      <rect x="-15" y="-38" width="30" height="38" fill="{NIGHT}"/>
    </g>"""


def well_shaft(stone="#6f6553", water=470):
    """Cross-section of a well: sky strip, two stone walls, dark shaft, water."""
    courses = "".join(
        f'<path d="M 242 {yy} L 558 {yy}" stroke="{stone}" stroke-width="2" opacity="0.22"/>'
        for yy in range(168, water, 52)
    )
    return (f'<rect x="0" y="0" width="{W}" height="116" fill="{INDIGO_SOFT}"/>'
            f'<rect x="0" y="116" width="242" height="{H - 116}" fill="{stone}"/>'
            f'<rect x="558" y="116" width="242" height="{H - 116}" fill="{stone}"/>'
            f'<rect x="242" y="116" width="316" height="{H - 116}" fill="{NIGHT}"/>'
            f'{courses}'
            f'<rect x="242" y="{water}" width="316" height="{H - water}" '
            f'fill="{VERDIGRIS}" opacity="0.85"/>')


def donkey(x, y, s=1.0, coat="#9a8a72", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="70" ry="38" fill="{coat}"/>
      <path d="M -66 -12 Q -92 -6 -96 26 L -87 27 Q -83 4 -62 2 Z" fill="{coat}"/>
      <path d="M 44 -20 Q 76 -38 84 -72 L 108 -68 Q 118 -38 94 -18 L 62 2 Z" fill="{coat}"/>
      <ellipse cx="100" cy="-78" rx="16" ry="26" fill="{coat}"/>
      <ellipse cx="104" cy="-99" rx="13" ry="11" fill="#6e6152"/>
      <path d="M 86 -96 Q 80 -136 90 -147 Q 99 -132 96 -98 Z" fill="{coat}"/>
      <path d="M 108 -97 Q 115 -137 125 -144 Q 129 -127 118 -95 Z" fill="{coat}"/>
      <circle cx="108" cy="-84" r="4" fill="{NIGHT}"/>
      <path d="M 68 -44 Q 82 -68 92 -92" stroke="#5f5446" stroke-width="8"
            fill="none" stroke-linecap="round"/>
      <path d="M -40 30 L -44 76 M -12 34 L -14 78 M 18 34 L 20 78 M 44 26 L 48 74"
            stroke="{coat}" stroke-width="12" stroke-linecap="round"/>
    </g>"""


def pail(x, y, s=1.0, fill="#a8a49b", milk_frac=0.8, milk=PALM_WARM, tipped=False):
    rot = ' rotate(-72)' if tipped else ''
    surface = (
        f'<ellipse cx="0" cy="-30" rx="31" ry="7" fill="{milk}"/>' if milk_frac > 0 else ''
    )
    return f"""
    <g transform="translate({x},{y}) scale({s}){rot}">
      <path d="M -34 -32 L -27 30 L 27 30 L 34 -32 Z" fill="{fill}"/>
      {surface}
      <ellipse cx="0" cy="-32" rx="34" ry="8" fill="none" stroke="{fill}" stroke-width="5"/>
      <path d="M -33 -34 Q 0 -60 33 -34" stroke="{fill}" stroke-width="4" fill="none"/>
    </g>"""


def bones(x, y, s=1.0, count=6, fill="#d8d2c0"):
    parts = []
    for i in range(count):
        bx = -70 + i * 28
        by = (i % 3) * 9
        parts.append(
            f'<rect x="{bx}" y="{by}" width="24" height="7" rx="3.5" fill="{fill}" '
            f'transform="rotate({-20 + i * 13} {bx + 12} {by + 3})"/>'
        )
    return f'<g transform="translate({x},{y}) scale({s})">{"".join(parts)}</g>'


def tiger_skin(x, y, s=1.0, fill="#c8862f", stripe=SOOT, flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    stripes = "".join(
        f'<path d="M {-58 + i*26} -32 q 7 32 0 62" stroke="{stripe}" stroke-width="7" '
        f'fill="none" stroke-linecap="round"/>'
        for i in range(6)
    )
    return f"""
    <g transform="{t}">
      <path d="M -86 -34 Q 0 -54 86 -34 L 92 28 Q 0 50 -92 28 Z" fill="{fill}"/>
      {stripes}
      <circle cx="104" cy="-20" r="26" fill="{fill}"/>
      <path d="M 88 -42 l 10 -16 l 12 12 Z M 118 -42 l 12 -14 l 8 16 Z" fill="{fill}"/>
      <circle cx="97" cy="-24" r="3.5" fill="{NIGHT}"/>
      <circle cx="113" cy="-24" r="3.5" fill="{NIGHT}"/>
    </g>"""


def cat(x, y, s=1.0, coat="#8a8275", flip=False):
    """Eyes drawn shut on purpose — the piety is the whole disguise."""
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <path d="M -34 34 Q -46 -6 -22 -30 L 22 -30 Q 46 -6 34 34 Z" fill="{coat}"/>
      <circle cx="0" cy="-46" r="28" fill="{coat}"/>
      <path d="M -26 -62 l -4 -30 l 26 16 Z M 26 -62 l 4 -30 l -26 16 Z" fill="{coat}"/>
      <path d="M -14 -48 q 5 6 0 10 M 14 -48 q -5 6 0 10" stroke="{NIGHT}"
            stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 32 30 Q 62 26 58 -8" stroke="{coat}" stroke-width="11"
            fill="none" stroke-linecap="round"/>
      <ellipse cx="0" cy="34" rx="36" ry="7" fill="{coat}"/>
    </g>"""


def drum(x, y, s=1.0, body="#7a5c33", skin=PALM_WARM, hoop=SINDOOR):
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <path d="M -54 -46 Q -70 0 -54 46 L 54 46 Q 70 0 54 -46 Z" fill="{body}"/>
      <ellipse cx="0" cy="-46" rx="54" ry="15" fill="{skin}"/>
      <ellipse cx="0" cy="-46" rx="54" ry="15" fill="none" stroke="{hoop}" stroke-width="4"/>
      <path d="M -62 -28 L 62 -28 M -68 2 L 68 2 M -60 32 L 60 32" stroke="{hoop}"
            stroke-width="4" opacity="0.7"/>
    </g>"""


def boom(x, y, s=1.0, rings=3, fill=SINDOOR, flip=False):
    """Sound, drawn as expanding arcs. Used for the drum and for the bray."""
    arcs = "".join(
        f'<path d="M 0 {-26 - i*20} Q {30 + i*22} 0 0 {26 + i*20}" stroke="{fill}" '
        f'stroke-width="{5 - i*0.7:.1f}" fill="none" opacity="{0.85 - i*0.22:.2f}"/>'
        for i in range(rings)
    )
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f'<g transform="{t}">{arcs}</g>'


def titibha(x, y, s=1.0, fill="#b8935a", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="0" cy="0" rx="34" ry="24" fill="{fill}"/>
      <path d="M -30 -8 Q -58 -22 -66 -44 Q -44 -30 -26 -22 Z" fill="{fill}"/>
      <circle cx="28" cy="-26" r="16" fill="{fill}"/>
      <path d="M 42 -30 L 80 -23 L 42 -16 Z" fill="{HALDI}"/>
      <circle cx="33" cy="-31" r="3.5" fill="{NIGHT}"/>
      <path d="M -8 22 L -12 54 M 12 22 L 16 54" stroke="{HALDI}"
            stroke-width="5" stroke-linecap="round"/>
      <path d="M -22 54 L -4 54 M 8 54 L 26 54" stroke="{HALDI}"
            stroke-width="5" stroke-linecap="round"/>
    </g>"""


def ant(x, y, s=1.0, fill=SOOT, flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="-34" cy="0" rx="22" ry="17" fill="{fill}"/>
      <ellipse cx="-2" cy="-2" rx="13" ry="11" fill="{fill}"/>
      <circle cx="24" cy="-6" r="14" fill="{fill}"/>
      <path d="M 32 -18 L 46 -36 M 38 -12 L 56 -22" stroke="{fill}"
            stroke-width="3.5" stroke-linecap="round"/>
      <path d="M -26 14 L -34 34 M -6 14 L -4 36 M 12 12 L 22 34" stroke="{fill}"
            stroke-width="4" stroke-linecap="round"/>
    </g>"""


def grasshopper(x, y, s=1.0, fill="#6f8a3a", flip=False):
    t = f'translate({x},{y}) scale({-s if flip else s},{s})'
    return f"""
    <g transform="{t}">
      <ellipse cx="-8" cy="0" rx="42" ry="15" fill="{fill}"/>
      <ellipse cx="-14" cy="-7" rx="34" ry="10" fill="#87a44e"/>
      <circle cx="34" cy="-6" r="13" fill="{fill}"/>
      <circle cx="39" cy="-9" r="3" fill="{NIGHT}"/>
      <path d="M 42 -16 L 60 -34 M 44 -12 L 64 -24" stroke="{fill}"
            stroke-width="3.5" stroke-linecap="round"/>
      <path d="M -18 8 Q -48 -14 -30 -32 Q -22 -6 -6 10 Z" fill="{fill}"/>
      <path d="M -30 14 L -44 34 M 2 14 L 8 34" stroke="{fill}"
            stroke-width="4" stroke-linecap="round"/>
    </g>"""


def seed_store(x, y, s=1.0, seeds=8, stone="#6f6553"):
    """Pass the ground line as y. The chamber is drawn below it as a cutaway so it
    reads as a hole under a stone; a box sitting on the surface reads as luggage."""
    dots = "".join(
        f'<ellipse cx="{-42 + (i % 5) * 21}" cy="{46 - (i // 5) * 20}" '
        f'rx="8" ry="6" fill="{HALDI}"/>'
        for i in range(seeds)
    )
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <path d="M -66 4 Q -70 66 0 68 Q 70 66 66 4 Z" fill="#241e19"/>
      {dots}
      <ellipse cx="0" cy="-6" rx="82" ry="16" fill="{stone}"/>
      <ellipse cx="0" cy="-12" rx="76" ry="12" fill="#7d7261"/>
    </g>"""


def hydra(x, y, s=1.0, heads=5, fill="#2f5a52", flip=False):
    """Head count is the whole point — the panels run 9, 10, 5, 0 so the descent
    (and the one panel where it goes the wrong way) is visible at a glance."""
    necks = []
    spread = 150
    step = (spread * 2) / (heads - 1) if heads > 1 else 0
    for i in range(heads):
        hx = (-spread + i * step) if heads > 1 else 0
        tip_x = hx * 1.45
        tip_y = -152 - abs(hx) * 0.10
        necks.append(
            f'<path d="M {hx*0.34:.0f} -22 Q {hx:.0f} {tip_y*0.58:.0f} '
            f'{tip_x:.0f} {tip_y:.0f}" stroke="{fill}" stroke-width="14" '
            f'fill="none" stroke-linecap="round"/>'
            f'<ellipse cx="{tip_x:.0f}" cy="{tip_y:.0f}" rx="17" ry="12" fill="{fill}"/>'
            f'<circle cx="{tip_x+7:.0f}" cy="{tip_y-3:.0f}" r="3" fill="{NIGHT}"/>'
        )
    return f"""
    <g transform="translate({x},{y}) scale({-s if flip else s},{s})">
      {''.join(necks)}
      <ellipse cx="0" cy="0" rx="120" ry="46" fill="{fill}"/>
    </g>"""


def torch(x, y, s=1.0, lit=True):
    flame = (
        f'<ellipse cx="0" cy="-46" rx="13" ry="21" fill="{HALDI}"/>'
        f'<ellipse cx="0" cy="-50" rx="7" ry="12" fill="{PALM_WARM}"/>'
        if lit else ""
    )
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <rect x="-4" y="-30" width="8" height="60" rx="3" fill="#6f5a33"/>
      {flame}
    </g>"""


def stele(x, y, s=1.0, lines=3, stone="#6f6553", ink=NIGHT):
    # Wide rather than tall, with a cap and a plinth: an edict tablet. A rounded-top
    # slab reads as a gravestone, which is the wrong note entirely for this tale.
    marks = "".join(
        f'<rect x="-46" y="{-30 + i * 22}" width="92" height="7" rx="3" '
        f'fill="{ink}" opacity="0.5"/>'
        for i in range(lines)
    )
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <rect x="-64" y="-52" width="128" height="96" rx="5" fill="{stone}"/>
      <rect x="-72" y="-64" width="144" height="14" rx="4" fill="#7d7261"/>
      <rect x="-76" y="44" width="152" height="18" rx="4" fill="#5d5449"/>
      {marks}
    </g>"""


def store(x, y, s=1.0, coins=8, wood="#6f5a33", coin=HALDI):
    dots = "".join(
        f'<circle cx="{-52 + (i % 5) * 26}" cy="{-4 - (i // 5) * 24}" r="10" fill="{coin}"/>'
        for i in range(coins)
    )
    return f"""
    <g transform="translate({x},{y}) scale({s})">
      <rect x="-74" y="-52" width="148" height="86" rx="6" fill="{wood}"/>
      <rect x="-80" y="-62" width="160" height="16" rx="5" fill="#7a6339"/>
      {dots}
      <rect x="-74" y="26" width="148" height="8" fill="#5b4a2b"/>
    </g>"""


def caption(text, y=None, fill=PALM):
    y = y if y is not None else H - 46
    return (
        f'<text x="{W/2}" y="{y}" text-anchor="middle" fill="{fill}" opacity="0.68" '
        f'font-family="IBM Plex Mono, monospace" font-size="19" letter-spacing="2.5">{text}</text>'
    )


# Nasruddin's herd. Nine animals walk ahead at one scale; the tenth is under him and
# drawn larger because it is nearest — which is also why he never counts it. The dots
# mark what each count reaches, so they must stay in step with the animals below them.
ND_HERD = "".join(
    donkey(68 + i * 62, 393, 0.28,
           coat=("#8d7d66" if i % 2 else "#9a8a72"), flip=True)
    for i in range(9)
)
ND_DOTS = "".join(
    f'<circle cx="{40 + i * 62}" cy="336" r="8" fill="{HALDI}"/>' for i in range(9)
)
ND_RIDER = (
    f'<path d="M 662 370 L 657 400" stroke="{PALM_WARM}" stroke-width="9" '
    f'stroke-linecap="round"/>'
    + person(655, 348, 0.55, PALM_WARM, reach=-1)
)

# The titibha's sea. This block is byte-identical in all four of her panels and that
# is the entire point of the story: the body runs, the water does not move. If you
# ever find yourself tempted to vary the level between panels, the mapping is broken.
TB_SEA = (
    '<rect x="0" y="300" width="800" height="130" fill="#2a4a68"/>'
    + waves(330, fill=PALM, rows=3, gap=30, opacity=0.20)
    + '<rect x="0" y="430" width="800" height="170" fill="#c9b98d"/>'
)
TB_INK = "#5a4a2e"

PANELS = {
    "thirsty-crow": [
        svg(sun(660, 110) + cracks(H * 0.72) + crow(230, 210, 1.15)
            + caption("no water anywhere"),
            sky="#3f4a7a", ground="#a8763f"),
        svg(pot(500, 330, 1.0, water_frac=0.16) + crow(215, 240, 1.0)
            + caption("too far down to reach"),
            sky=INDIGO, ground="#7d5c38"),
        svg(pot(500, 330, 1.0, water_frac=0.42, pebbles=7)
            + crow(215, 190, 0.95)
            + f'<circle cx="452" cy="150" r="11" fill="{SOOT}"/>'
            + f'<circle cx="470" cy="196" r="8" fill="{SOOT}" opacity="0.6"/>'
            + caption("one more, and check again"),
            sky=INDIGO, ground="#7d5c38"),
        svg(pot(500, 330, 1.0, water_frac=0.94, pebbles=14)
            + crow(360, 165, 0.9, flip=True)
            + caption("close enough to drink"),
            sky=INDIGO_SOFT, ground="#7d5c38"),
    ],
    "blue-jackal": [
        svg(f'<rect x="470" y="220" width="290" height="300" rx="10" fill="#243a6e"/>'
            f'<ellipse cx="615" cy="222" rx="145" ry="30" fill="#16264d"/>'
            f'<ellipse cx="615" cy="222" rx="120" ry="22" fill="#2f4f96"/>'
            + jackal(300, 330, 0.85, coat="#8a6a45")
            + f'<path d="M 430 300 Q 490 250 540 214" stroke="{PALM}" stroke-width="3" '
              f'fill="none" stroke-dasharray="9 9" opacity="0.6"/>'
            + caption("into the dyer's vat"),
            sky=NIGHT, ground="#2a2418"),
        svg(jackal(300, 330, 0.9, coat="#3f6fd8")
            + f'<g opacity="0.85">{elephant(650, 300, 0.5)}</g>'
            + caption("nobody recognised it"),
            sky=INDIGO, ground="#2f4a34"),
        svg(f'<ellipse cx="400" cy="470" rx="190" ry="34" fill="#3a3020"/>'
            + jackal(400, 400, 0.95, coat="#3f6fd8")
            + sun(690, 130, 44)
            + caption("and so it ruled"),
            sky=INDIGO_SOFT, ground="#2f4a34"),
        svg(f'<circle cx="660" cy="120" r="46" fill="{PALM_WARM}" opacity="0.9"/>'
            f'<circle cx="644" cy="112" r="46" fill="{NIGHT}"/>'
            + jackal(340, 360, 0.95, coat="#3f6fd8")
            + f'<path d="M 470 270 q 22 -22 0 -44 M 496 276 q 34 -32 0 -64" '
              f'stroke="{HALDI}" stroke-width="3" fill="none" opacity="0.85"/>'
            + caption("the howl gave it away"),
            sky=NIGHT, ground="#1e3226"),
    ],
    "blind-men-elephant": [
        svg(elephant(430, 300, 0.82)
            + person(120, 400, 0.9, PALM_WARM, reach=1)
            + person(700, 400, 0.9, "#d8c9a0", reach=-1)
            + caption("six men, one elephant"),
            sky=INDIGO, ground="#4a4028"),
        svg(elephant(430, 290, 0.8)
            + person(110, 400, 0.85, PALM_WARM, reach=1)
            + person(720, 396, 0.85, "#d8c9a0", reach=-1)
            + f'<text x="86" y="330" fill="{HALDI}" font-family="IBM Plex Mono, monospace" '
              f'font-size="17">"a pillar"</text>'
            + f'<text x="600" y="300" fill="{HALDI}" font-family="IBM Plex Mono, monospace" '
              f'font-size="17">"a rope"</text>'
            + caption("each one certain"),
            sky=INDIGO, ground="#4a4028"),
        svg(sun(120, 470, 62, SINDOOR)
            + elephant(470, 290, 0.78)
            + person(150, 400, 0.85, "#d8c9a0", reach=1)
            + person(760, 396, 0.85, PALM_WARM, reach=-1)
            + caption("and none of them wrong"),
            sky="#5a3a58", ground="#3d3020"),
        svg(f'<rect x="150" y="120" width="500" height="330" rx="6" fill="{NIGHT}" '
            f'stroke="{HALDI}" stroke-width="3"/>'
            + "".join(
                f'<text x="192" y="{186 + i*54}" fill="{PALM}" '
                f'font-family="IBM Plex Mono, monospace" font-size="21">{k}</text>'
                f'<text x="330" y="{186 + i*54}" fill="{HALDI}" '
                f'font-family="IBM Plex Mono, monospace" font-size="21">→  {v}</text>'
                for i, (k, v) in enumerate(
                    [("leg", "a pillar"), ("trunk", "a snake"), ("ear", "a fan"),
                     ("tusk", "a spear"), ("tail", "a rope")]
                )
            )
            + caption("all six, written down together"),
            sky=INDIGO_SOFT, ground=None),
    ],
    "brahmin-three-thieves": [
        svg(tree(700, 470, 0.62)
            + person(230, 440, 1.0, PALM_WARM, reach=1)
            + goat(250, 392, 0.55)
            + person(628, 458, 0.55, "#6d5f48", reach=1)
            + person(690, 462, 0.55, "#7b6a4e", reach=-1)
            + person(752, 458, 0.55, "#6d5f48", reach=1)
            + caption("a goat, bought and paid for"),
            sky=INDIGO, ground="#6b5a34"),
        svg(tree(96, 480, 0.5)
            + person(330, 440, 1.0, PALM_WARM, reach=1)
            + goat(350, 392, 0.55)
            + person(600, 442, 0.9, "#7b6a4e", reach=-1)
            + f'<text x="560" y="316" text-anchor="end" fill="{HALDI}" '
              f'font-family="IBM Plex Mono, monospace" font-size="19">"why a dog?"</text>'
            + caption("the first thief"),
            sky=INDIGO, ground="#6b5a34"),
        svg(person(300, 442, 1.0, PALM_WARM, reach=-1)
            + goat(320, 394, 0.55)
            + person(662, 448, 0.8, "#6d5f48", reach=1)
            + f'<text x="120" y="300" fill="{HALDI}" '
              f'font-family="IBM Plex Mono, monospace" font-size="19">"a dead calf?"</text>'
            + caption("and then the second"),
            sky="#2a3560", ground="#6b5a34"),
        svg(goat(420, 400, 1.0)
            + person(120, 430, 0.7, PALM_WARM, reach=-1)
            + person(640, 430, 0.7, "#6d5f48", reach=1)
            + person(700, 434, 0.7, "#7b6a4e", reach=-1)
            + person(760, 430, 0.7, "#6d5f48", reach=1)
            + caption("still a goat, the whole time"),
            sky=INDIGO_SOFT, ground="#6b5a34"),
    ],
    "monkey-cap-seller": [
        svg(tree(560, 500, 0.95, roots=True)
            + lying(person(220, 470, 0.95, PALM_WARM, reach=1), 220, 470)
            + bundle(348, 496, 0.85)
            + sun(96, 112, 46)
            + caption("the hottest part of the afternoon"),
            sky="#3f4a7a", ground="#7a6a3e"),
        svg(tree(400, 520, 1.0, roots=True)
            + monkey(250, 330, 0.6, cap_fill=SINDOOR)
            + monkey(400, 302, 0.6, cap_fill=SINDOOR, flip=True)
            + monkey(548, 336, 0.6, cap_fill=SINDOOR)
            + bundle(136, 500, 0.8, count=0)
            + caption("the bundle is empty"),
            sky=INDIGO, ground="#7a6a3e"),
        svg(tree(430, 530, 1.0, roots=True)
            + monkey(256, 342, 0.6, cap_fill=SINDOOR)
            + monkey(430, 312, 0.6, cap_fill=SINDOOR, flip=True)
            + monkey(600, 346, 0.6, cap_fill=SINDOOR)
            + person(118, 460, 1.0, PALM_WARM, reach=1)
            + cap(118, 398, 0.9)
            + caption("whatever he did, they did"),
            sky=INDIGO, ground="#7a6a3e"),
        svg(tree(566, 540, 0.95, roots=True)
            + monkey(438, 332, 0.55)
            + monkey(604, 352, 0.55, flip=True)
            + "".join(
                cap(cx, cy, 0.85)
                for cx, cy in [(176, 478), (250, 500), (324, 476), (392, 502),
                               (196, 522), (292, 528), (364, 520)]
            )
            + person(110, 448, 0.95, PALM_WARM, reach=1)
            + caption("all of them back, in a new order"),
            sky=INDIGO_SOFT, ground="#7a6a3e"),
    ],
    "talkative-tortoise": [
        svg(sun(680, 120, 50)
            + cracks(H * 0.74)
            + tortoise(240, 470, 1.0)
            + goose(470, 440, 0.9)
            + goose(626, 452, 0.9, flip=True)
            + caption("the lake went to mud"),
            sky="#3f4a7a", ground="#8a6a3c"),
        svg(goose(180, 300, 0.95)
            + goose(620, 300, 0.95, flip=True)
            + stick(256, 243, 544, 243, width=9)
            + tortoise(400, 306, 0.8)
            + stick(400, 245, 400, 274, fill=SOOT, width=6)
            + caption("bite down, and do not speak"),
            sky=INDIGO, ground="#7a6a3e"),
        svg(goose(200, 190, 0.85)
            + goose(600, 190, 0.85, flip=True)
            + stick(268, 139, 532, 139, width=8)
            + tortoise(400, 198, 0.7)
            + stick(400, 141, 400, 170, fill=SOOT, width=6)
            + person(140, 470, 0.85, PALM_WARM, reach=1)
            + person(300, 476, 0.85, "#d8c9a0", reach=1)
            + person(560, 472, 0.85, PALM_WARM, reach=-1)
            + person(700, 478, 0.85, "#d8c9a0", reach=-1)
            + caption("three villages, and not a word"),
            sky=INDIGO, ground="#3f5a34"),
        svg(moon(660, 118, 44)
            + goose(200, 200, 0.85)
            + goose(600, 200, 0.85, flip=True)
            + stick(268, 149, 532, 149, width=8)
            + f'<path d="M 392 206 q 12 24 -6 46 M 420 212 q 14 28 -6 52" '
              f'stroke="{PALM}" stroke-width="3" fill="none" opacity="0.5"/>'
            + person(360, 462, 0.8, "#d8c9a0", reach=1)
            + person(474, 466, 0.8, PALM_WARM, reach=-1)
            + caption("it opened its mouth"),
            sky=NIGHT, ground="#2f4a34"),
    ],
    "lion-and-rabbit": [
        svg('<path d="M 470 462 Q 520 340 620 348 Q 730 356 762 462 Z" fill="#5f5647"/>'
            + lion(620, 330, 0.72)
            + deer(180, 470, 0.6)
            + monkey(322, 452, 0.55)
            + rabbit(412, 486, 0.7)
            + caption("an arrangement was proposed"),
            sky=INDIGO, ground="#3f5a34"),
        svg(f'<path d="M 60 528 Q 400 474 744 452" stroke="{PALM}" stroke-width="3" '
            f'fill="none" stroke-dasharray="10 10" opacity="0.35"/>'
            + lion(692, 400, 0.62)
            + deer(120, 454, 0.5)
            + monkey(252, 442, 0.45)
            + tortoise(352, 472, 0.5)
            + rabbit(442, 476, 0.55)
            + goat(542, 454, 0.45)
            + caption("one each day, in order"),
            sky=INDIGO, ground="#3f5a34"),
        svg(lion(560, 380, 0.9)
            + rabbit(200, 466, 0.95)
            + f'<text x="120" y="300" fill="{HALDI}" '
              f'font-family="IBM Plex Mono, monospace" font-size="19">'
              f'"there is another lion"</text>'
            + caption("late, and sorry about it"),
            sky=INDIGO, ground="#3f5a34"),
        svg(well(470, 420, 1.0)
            + lion(470, 300, 0.62, flip=True)
            + rabbit(168, 470, 0.85)
            + caption("he looked, and he jumped"),
            sky=NIGHT, ground="#3a4a30"),
    ],
    "four-friends": [
        svg(f'<ellipse cx="400" cy="502" rx="300" ry="56" fill="{VERDIGRIS}" opacity="0.7"/>'
            + deer(196, 400, 0.72)
            + crow(432, 300, 0.8)
            + mouse(560, 430, 0.9)
            + tortoise(684, 442, 0.8)
            + caption("one skill each, and four of them"),
            sky=INDIGO, ground="#3f5a34"),
        svg(tree(120, 524, 0.6)
            + tree(722, 502, 0.55)
            + deer(400, 400, 0.95)
            + netting(250, 258, 300, 220)
            + caption("it ran into a hunter's net"),
            sky=INDIGO, ground="#3f5a34"),
        svg(tree(118, 540, 0.7)
            + crow(184, 300, 0.65)
            + deer(474, 400, 0.85)
            + netting(330, 268, 300, 210)
            + mouse(342, 470, 1.0)
            + caption("the mouse cut the cords"),
            sky=INDIGO, ground="#3f5a34"),
        svg(tree(704, 522, 0.6)
            + sack(400, 430, 1.15)
            + mouse(300, 478, 1.0)
            + tortoise(566, 480, 0.7)
            + caption("the same skill, a second time"),
            sky=INDIGO_SOFT, ground="#3f5a34"),
    ],
    "crows-and-serpent": [
        svg(tree(400, 540, 1.0)
            + serpent(400, 420, 1.0)
            + crow(248, 300, 0.7)
            + crow(560, 286, 0.7, flip=True)
            + caption("every season, the same"),
            sky=INDIGO, ground="#3f5a34"),
        svg(tree(664, 540, 0.72)
            + jackal(500, 442, 0.8)
            + crow(180, 420, 0.8)
            + crow(302, 438, 0.8)
            + caption("the jackal thought about it"),
            sky=INDIGO, ground="#3f5a34"),
        svg(f'<rect x="0" y="{H * 0.68:.0f}" width="{W}" height="{H * 0.32:.0f}" '
            f'fill="{VERDIGRIS}" opacity="0.7"/>'
            + waves(430, rows=3, gap=34)
            + crow(300, 220, 1.0)
            + necklace(392, 238, 1.0)
            + person(664, 430, 0.8, PALM_WARM, reach=-1)
            + caption("let them see you take it"),
            sky="#3f4a7a", ground=None),
        svg(tree(430, 520, 0.85)
            + f'<ellipse cx="430" cy="516" rx="88" ry="30" fill="{NIGHT}"/>'
            + serpent(432, 500, 0.55)
            + necklace(430, 512, 0.9)
            + person(180, 452, 0.9, PALM_WARM, reach=1)
            + stick(214, 380, 236, 502, width=6)
            + person(680, 452, 0.9, "#d8c9a0", reach=-1)
            + stick(646, 380, 624, 502, width=6)
            + caption("the guards had their own sticks"),
            sky=INDIGO_SOFT, ground="#3f5a34"),
    ],
    "monkey-crocodile": [
        svg(f'<rect x="0" y="{H * 0.87:.0f}" width="{W}" height="{H * 0.13:.0f}" '
            f'fill="{VERDIGRIS}" opacity="0.8"/>'
            + tree(292, 528, 0.95, fruit="#5a3a72")
            + monkey(292, 306, 0.72)
            + crocodile(572, 486, 0.68)
            + '<circle cx="404" cy="392" r="8" fill="#5a3a72"/>'
            + '<circle cx="436" cy="446" r="8" fill="#5a3a72" opacity="0.7"/>'
            + caption("fruit, every day, for months"),
            sky=INDIGO, ground="#8a7648"),
        svg(f'<rect x="0" y="{H * 0.87:.0f}" width="{W}" height="{H * 0.13:.0f}" '
            f'fill="{VERDIGRIS}" opacity="0.8"/>'
            + tree(300, 528, 0.95, fruit="#5a3a72")
            + monkey(300, 306, 0.72)
            + crocodile(576, 484, 0.76, flip=True)
            + caption("a ride across the river"),
            sky=INDIGO, ground="#8a7648"),
        svg(f'<rect x="0" y="{H * 0.55:.0f}" width="{W}" height="{H * 0.45:.0f}" '
            f'fill="{VERDIGRIS}" opacity="0.8"/>'
            + waves(356, rows=5, gap=42)
            + crocodile(400, 400, 0.9)
            + monkey(368, 330, 0.6)
            + caption("no bank in reach"),
            sky="#26325e", ground=None),
        svg(f'<rect x="0" y="{H * 0.72:.0f}" width="{W}" height="{H * 0.28:.0f}" '
            f'fill="{VERDIGRIS}" opacity="0.75"/>'
            + waves(452, rows=3, gap=34)
            + tree(280, 470, 0.95, fruit="#5a3a72")
            + monkey(280, 268, 0.7)
            + crocodile(606, 470, 0.7, flip=True)
            + caption("and stayed there"),
            sky=INDIGO_SOFT, ground=None),
    ],
    "frog-in-the-well": [
        svg(well_shaft()
            + sun(96, 52, 28)
            + frog(400, 452, 0.95)
            + caption("the whole world, measured end to end"),
            sky=INDIGO, ground=None),
        svg(well_shaft()
            + f'<path d="M 502 148 Q 466 300 494 416" stroke="{PALM}" stroke-width="3" '
              f'fill="none" stroke-dasharray="9 9" opacity="0.45"/>'
            + frog(330, 452, 0.9)
            + frog(494, 456, 0.9, fill="#35607c", flip=True)
            + caption("a visitor, from somewhere else"),
            sky=INDIGO, ground=None),
        svg(well_shaft()
            + f'<ellipse cx="386" cy="500" rx="112" ry="28" fill="none" stroke="{PALM}" '
              f'stroke-width="3" stroke-dasharray="10 8" opacity="0.5"/>'
            + frog(300, 448, 0.85)
            + frog(502, 456, 0.85, fill="#35607c", flip=True)
            + caption("is the sea this big?"),
            sky=INDIGO, ground=None),
        svg(well_shaft()
            + "".join(
                f'<circle cx="{cx}" cy="{cy}" r="4" fill="{HALDI}" opacity="0.7"/>'
                for cx, cy in [(330, 332), (392, 296), (460, 342), (352, 254), (450, 258)]
            )
            + frog(400, 452, 0.95)
            + caption("back to counting insects"),
            sky=INDIGO, ground=None),
    ],
    "fox-and-crow": [
        svg(tree(300, 540, 0.9)
            + crow(300, 330, 0.85)
            + cheese(384, 322, 1.1)
            + fox(624, 478, 0.7, flip=True)
            + caption("out of reach, and it knew it"),
            sky=INDIGO, ground="#4a5a30"),
        svg(tree(300, 540, 0.9)
            + crow(300, 330, 0.85)
            + cheese(384, 322, 1.1)
            + fox(624, 478, 0.7, flip=True)
            + f'<text x="470" y="252" fill="{HALDI}" '
              f'font-family="IBM Plex Mono, monospace" font-size="18">"the finest feathers</text>'
            + f'<text x="470" y="280" fill="{HALDI}" '
              f'font-family="IBM Plex Mono, monospace" font-size="18">I have ever seen"</text>'
            + caption("so it spoke instead"),
            sky=INDIGO, ground="#4a5a30"),
        svg(tree(300, 540, 0.9)
            + crow(300, 330, 0.85)
            + f'<path d="M 386 344 q 10 26 6 46" stroke="{PALM}" stroke-width="3" '
              f'fill="none" stroke-dasharray="7 7" opacity="0.55"/>'
            + cheese(398, 408, 1.1)
            + fox(624, 478, 0.7, flip=True)
            + caption("it opened its beak"),
            sky=INDIGO, ground="#4a5a30"),
        svg(tree(300, 540, 0.9)
            + crow(300, 330, 0.85)
            + fox(556, 478, 0.7)
            + cheese(650, 458, 1.1)
            + caption("who was asking?"),
            sky=INDIGO_SOFT, ground="#4a5a30"),
    ],
    "mice-and-elephants": [
        svg(ruins(H * 0.68)
            + "".join(burrow(bx, 502, 0.9) for bx in (140, 300, 460, 620))
            + mouse(212, 470, 0.7)
            + mouse(388, 486, 0.7, flip=True)
            + mouse(558, 464, 0.7)
            + caption("thousands of them, for generations"),
            sky=INDIGO, ground="#6b5a34"),
        svg(ruins(H * 0.68)
            + "".join(
                burrow(bx, 526, 0.85, crushed=(bx in (140, 300)))
                for bx in (140, 300, 460, 620)
            )
            + elephant(300, 428, 0.4)
            + elephant(580, 440, 0.4)
            + caption("hundreds of them, twice a day"),
            sky=INDIGO, ground="#6b5a34"),
        svg("".join(
                f'<path d="M {ex} 252 L {bx} 448" stroke="{HALDI}" stroke-width="1.5" '
                f'opacity="0.32"/>'
                for ex in (200, 400, 600)
                for bx in (110, 250, 400, 550, 690)
            )
            + "".join(elephant(ex, 214, 0.2) for ex in (200, 400, 600))
            + "".join(burrow(bx, 460, 0.66) for bx in (110, 250, 400, 550, 690))
            + f'<text x="400" y="516" text-anchor="middle" fill="{PALM}" '
              f'font-family="IBM Plex Mono, monospace" font-size="26">3 x 5 = 15</text>'
            + caption("every elephant, every burrow"),
            sky=INDIGO, ground=None),
        svg(ruins(H * 0.68)
            + f'<path d="M 40 300 Q 400 242 780 296" stroke="{PALM}" stroke-width="3" '
              f'fill="none" stroke-dasharray="12 10" opacity="0.45"/>'
            + "".join(burrow(bx, 502, 0.9) for bx in (140, 300, 460, 620))
            + elephant(320, 288, 0.34)
            + elephant(590, 298, 0.34)
            + mouse(224, 470, 0.7)
            + caption("a different road to the lake"),
            sky=INDIGO_SOFT, ground="#6b5a34"),
    ],
    "monkey-and-wedge": [
        svg(f'<rect x="0" y="318" width="{W}" height="{H - 318}" fill="#7a6a3e"/>'
            + split_log(400, 452, 1.3)
            + person(672, 402, 0.85, PALM_WARM, reach=1)
            + person(742, 406, 0.85, "#d8c9a0", reach=1)
            + '<rect x="110" y="516" width="104" height="10" rx="5" fill="#6f6553"/>'
            + '<rect x="132" y="538" width="72" height="8" rx="4" fill="#6f6553"/>'
            + caption("left open, and left alone"),
            sky=INDIGO, ground=None),
        svg(f'<rect x="0" y="318" width="{W}" height="{H - 318}" fill="#7a6a3e"/>'
            + split_log(400, 452, 1.3)
            + monkey(148, 432, 0.72)
            + monkey(692, 438, 0.72, flip=True)
            + monkey(436, 402, 0.66)
            + caption("one of them found the gap"),
            sky=INDIGO, ground=None),
        svg(f'<rect x="0" y="318" width="{W}" height="{H - 318}" fill="#7a6a3e"/>'
            + split_log(400, 452, 1.3)
            + monkey(446, 394, 0.66)
            + f'<path d="M 428 424 L 442 450 M 466 424 L 480 450" stroke="#7a5b3a" '
              f'stroke-width="8" stroke-linecap="round"/>'
            + f'<path d="M 520 436 q 30 -8 52 -26 M 520 470 q 30 8 52 26" stroke="{PALM}" '
              f'stroke-width="3" fill="none" opacity="0.5"/>'
            + monkey(148, 436, 0.66)
            + caption("it worked the thing loose"),
            sky=INDIGO, ground=None),
        svg(f'<rect x="0" y="318" width="{W}" height="{H - 318}" fill="#7a6a3e"/>'
            + split_log(400, 452, 1.3, gap=0, wedge=False)
            + '<path d="M 596 500 L 596 530 L 692 520 L 692 510 Z" fill="#6f6553"/>'
            + monkey(148, 436, 0.66, flip=True)
            + caption("from the inside"),
            sky=INDIGO_SOFT, ground=None),
    ],
    "brahmins-dream": [
        svg(f'<rect x="199" y="122" width="14" height="10" fill="{HALDI}"/>'
            + stick(206, 130, 206, 242, fill=PALM, width=3)
            + pot(206, 302, 0.55, water_frac=0.0)
            + lying(person(300, 500, 0.9, PALM_WARM, reach=1), 300, 500)
            + caption("hung where nothing could reach it"),
            sky=NIGHT, ground="#3a3020"),
        svg(f'<rect x="199" y="122" width="14" height="10" fill="{HALDI}"/>'
            + stick(206, 130, 206, 242, fill=PALM, width=3)
            + pot(206, 302, 0.55, water_frac=0.0)
            + f'<ellipse cx="540" cy="236" rx="234" ry="126" fill="{INDIGO_SOFT}" '
              f'opacity="0.42"/>'
            + goat(452, 262, 0.46)
            + goat(566, 274, 0.46, flip=True)
            + hut(676, 282, 0.5)
            + f'<circle cx="352" cy="418" r="8" fill="{INDIGO_SOFT}" opacity="0.45"/>'
              f'<circle cx="382" cy="382" r="12" fill="{INDIGO_SOFT}" opacity="0.45"/>'
            + lying(person(300, 500, 0.9, PALM_WARM, reach=1), 300, 500)
            + caption("goats, then cattle, then a house"),
            sky=NIGHT, ground="#3a3020"),
        svg(f'<rect x="199" y="122" width="14" height="10" fill="{HALDI}"/>'
            + stick(206, 130, 206, 242, fill=PALM, width=3)
            + pot(206, 302, 0.55, water_frac=0.0)
            + f'<ellipse cx="540" cy="236" rx="234" ry="126" fill="{INDIGO_SOFT}" '
              f'opacity="0.42"/>'
            + hut(690, 288, 0.46)
            + person(470, 268, 0.8, "#d8c9a0", reach=1)
            + person(576, 288, 0.46, PALM_WARM, reach=-1)
            + f'<circle cx="352" cy="418" r="8" fill="{INDIGO_SOFT}" opacity="0.45"/>'
              f'<circle cx="382" cy="382" r="12" fill="{INDIGO_SOFT}" opacity="0.45"/>'
            + lying(person(300, 500, 0.9, PALM_WARM, reach=1), 300, 500)
            + caption("and then a son, running underfoot"),
            sky=NIGHT, ground="#3a3020"),
        svg(f'<rect x="199" y="122" width="14" height="10" fill="{HALDI}"/>'
            + f'<path d="M 206 132 L 208 198" stroke="{PALM}" stroke-width="3" opacity="0.55"/>'
            + f'<ellipse cx="286" cy="482" rx="172" ry="34" fill="{PALM_WARM}" opacity="0.75"/>'
            + '<path d="M 156 462 q 26 -30 56 -14 L 198 472 Z" fill="#8d5a3c"/>'
              '<path d="M 336 490 q 30 -26 58 -6 L 356 500 Z" fill="#7a4a30"/>'
              '<path d="M 246 508 l 34 -16 l 14 18 Z" fill="#8d5a3c"/>'
            + lying(person(596, 458, 0.9, PALM_WARM, reach=-1), 596, 458)
            + caption("everything had been standing on it"),
            sky=NIGHT, ground="#3a3020"),
    ],
    # The number IS the mechanism here, so the herd is drawn literally: nine small
    # animals walking ahead plus the ridden one, larger because it is nearest. The
    # haldi dots mark what the count reaches — nine in panel 2, ten in panel 3.
    "nasruddin-donkeys": [
        svg(sun(672, 96)
            + ND_HERD
            + donkey(660, 376, 0.5, coat="#8d7d66", flip=True)
            + ND_RIDER
            + caption("ten bought, and a long road home"),
            sky="#3f4a7a", ground="#a8763f"),
        svg(ND_HERD
            + f'<g opacity="0.5">{donkey(660, 376, 0.5, coat="#c8bda6", flip=True)}</g>'
            + ND_RIDER
            + ND_DOTS
            + f'<circle cx="598" cy="288" r="11" fill="none" stroke="{HALDI}" '
              f'stroke-width="3" stroke-dasharray="6 5" opacity="0.9"/>'
            + caption("nine, every time"),
            sky=INDIGO, ground="#a8763f"),
        svg(ND_HERD
            + donkey(660, 376, 0.5, coat="#8d7d66", flip=True)
            + person(736, 350, 0.85, PALM_WARM, reach=-1)
            + ND_DOTS
            + f'<circle cx="598" cy="288" r="11" fill="{HALDI}"/>'
            + caption("ten, standing in the dust"),
            sky=INDIGO, ground="#9c6d3a"),
        svg(f'<rect x="30" y="298" width="16" height="117" fill="#6f5a33"/>'
            f'<rect x="176" y="298" width="16" height="117" fill="#6f5a33"/>'
            f'<rect x="30" y="316" width="162" height="11" fill="#7a6339"/>'
            f'<rect x="30" y="352" width="162" height="11" fill="#7a6339"/>'
            f'<rect x="30" y="388" width="162" height="11" fill="#7a6339"/>'
            + "".join(donkey(348 + i * 48, 393, 0.28,
                             coat=("#8d7d66" if i % 2 else "#9a8a72"), flip=True)
                      for i in range(9))
            + donkey(272, 388, 0.36, coat="#a4947c", flip=True)
            + person(232, 350, 0.85, PALM_WARM, reach=1)
            + caption("he walked the rest of the way"),
            sky=INDIGO_SOFT, ground="#7d5c38"),
    ],
    # The cut stone is the fixed thing: same position, same three marks, every panel.
    # What moves is around it — the court empties, a second shorter stone appears
    # beside the first, and the store the words named loses its coin.
    "word-of-harishchandra": [
        svg(hut(96, 300, 0.62)
            + store(700, 381, 0.62, coins=8)
            + stele(566, 353, 1.0, lines=3)
            + person(250, 339, 1.0, PALM_WARM, reach=1)
            + person(392, 350, 0.85, "#c9b98d", reach=-1)
            + caption("whatever you name is yours"),
            sky=INDIGO, ground="#5e4a2e"),
        svg(stele(566, 353, 1.0, lines=3)
            + person(214, 339, 1.0, "#c9b98d", reach=1)
            + person(330, 350, 0.85, PALM_WARM, reach=1)
            + person(436, 352, 0.8, "#c9b98d", reach=1)
            + caption("it cannot be reached into"),
            sky=NIGHT, ground="#4a3a24"),
        svg(stele(500, 353, 1.0, lines=3)
            + stele(660, 370, 0.72, lines=1, stone="#8a7f6d")
            + person(258, 339, 1.0, PALM_WARM, reach=1)
            + caption("a second one, set beside it"),
            sky=INDIGO, ground="#5e4a2e"),
        svg(stele(178, 353, 1.0, lines=3)
            + stele(330, 370, 0.72, lines=1, stone="#8a7f6d")
            + store(620, 381, 0.62, coins=2)
            + caption("the words held; the store did not"),
            sky=INDIGO_SOFT, ground="#6b5432"),
    ],
    # Told as the solution, so the head count must descend: 9, then 10 when cutting
    # alone (the case with no descent), then 5 once the torch arrives, then 0.
    "hydra": [
        svg(waves(430, fill="#2a4a52", rows=3, gap=30, opacity=0.35)
            + hydra(470, 386, 0.82, heads=9)
            + person(112, 339, 1.0, PALM_WARM, reach=1)
            + f'<path d="M 168 302 L 214 244" stroke="{PALM}" stroke-width="7" '
              f'stroke-linecap="round"/>'
            + caption("nine, and the first one came off easily"),
            sky=NIGHT, ground="#2b3a2f"),
        svg(waves(430, fill="#2a4a52", rows=3, gap=30, opacity=0.35)
            + hydra(470, 386, 0.82, heads=8)
            + f'<path d="M 448 368 Q 400 300 372 236" stroke="#7fc0ac" stroke-width="8" '
              f'fill="none" stroke-linecap="round"/>'
              f'<ellipse cx="372" cy="236" rx="13" ry="9" fill="#7fc0ac"/>'
              f'<path d="M 452 368 Q 470 296 452 228" stroke="#7fc0ac" stroke-width="8" '
              f'fill="none" stroke-linecap="round"/>'
              f'<ellipse cx="452" cy="228" rx="13" ry="9" fill="#7fc0ac"/>'
            + person(112, 339, 1.0, PALM_WARM, reach=1)
            + f'<path d="M 168 302 L 214 244" stroke="{PALM}" stroke-width="7" '
              f'stroke-linecap="round"/>'
            + caption("two came back for every one taken"),
            sky=NIGHT, ground="#2b3a2f"),
        svg(waves(430, fill="#2a4a52", rows=3, gap=30, opacity=0.35)
            + hydra(490, 386, 0.82, heads=5)
            + person(112, 339, 1.0, PALM_WARM, reach=1)
            + f'<path d="M 168 302 L 214 244" stroke="{PALM}" stroke-width="7" '
              f'stroke-linecap="round"/>'
            + person(238, 350, 0.85, "#c9b98d", reach=1)
            + torch(288, 336, 1.0, lit=True)
            + caption("cut, then burn, and one fewer"),
            sky=NIGHT, ground="#2b3a2f"),
        svg(waves(430, fill="#2a4a52", rows=3, gap=30, opacity=0.35)
            + hydra(490, 386, 0.82, heads=0)
            + person(150, 339, 1.0, PALM_WARM, reach=1)
            + person(268, 350, 0.85, "#c9b98d", reach=1)
            + torch(312, 360, 0.85, lit=False)
            + caption("none left, and nothing to do"),
            sky=INDIGO, ground="#2b3a2f"),
    ],
    # What must read across the four: the store fills in summer and stays full in
    # winter, while the grasshopper's ground goes from thick with stems to bare. The
    # cost did not rise — it was simply never paid in advance.
    "ant-and-grasshopper": [
        svg(sun(668, 96)
            + "".join(f'<path d="M {90 + i*46} 415 L {84 + i*46} 344" stroke="#7f9a46" '
                      f'stroke-width="5" stroke-linecap="round"/>'
                      f'<ellipse cx="{84 + i*46}" cy="340" rx="7" ry="11" fill="{HALDI}"/>'
                      for i in range(6))
            + seed_store(474, 408, 1.0, seeds=4)
            + ant(348, 380, 0.9)
            + grasshopper(668, 381, 0.9, flip=True)
            + caption("out and back, all season"),
            sky=INDIGO_SOFT, ground="#6f7c3e"),
        svg(sun(140, 104)
            + "".join(f'<path d="M {70 + i*58} 415 L {62 + i*58} 330" stroke="#7f9a46" '
                      f'stroke-width="5" stroke-linecap="round"/>'
                      f'<ellipse cx="{62 + i*58}" cy="326" rx="7" ry="11" fill="{HALDI}"/>'
                      for i in range(12))
            + grasshopper(408, 381, 1.15)
            + f'<ellipse cx="516" cy="404" rx="9" ry="7" fill="{HALDI}"/>'
            + caption("an hour a day, and that was fair"),
            sky=INDIGO_SOFT, ground="#6f7c3e"),
        svg(moon(150, 110, 40)
            + seed_store(286, 408, 1.0, seeds=10)
            + ant(400, 380, 0.9, flip=True)
            + "".join(f'<path d="M {560 + i*54} 415 L {556 + i*54} 386" stroke="#6e6a5c" '
                      f'stroke-width="4" stroke-linecap="round"/>' for i in range(4))
            + grasshopper(700, 388, 0.62, fill="#8f9a6a")
            + caption("she had spent it all in july"),
            sky=NIGHT, ground="#8d8a7e"),
        # Panel 4 must not restate panel 3: it turns to day, the ant is carrying a
        # seed out, and the grasshopper's ground is stripped to nothing.
        svg(seed_store(226, 408, 1.0, seeds=10)
            + ant(340, 380, 0.9, flip=True)
            + f'<ellipse cx="292" cy="362" rx="10" ry="7.5" fill="{HALDI}"/>'
            + grasshopper(690, 388, 0.62, fill="#8f9a6a")
            + caption("one day the price was more than he had"),
            sky=INDIGO, ground="#a09c8c"),
    ],
    "titibha-and-sea": [
        svg(TB_SEA
            + f'<ellipse cx="470" cy="502" rx="62" ry="20" fill="#a8956d"/>'
              f'<ellipse cx="470" cy="500" rx="44" ry="12" fill="#b5a479"/>'
            + titibha(268, 470, 1.0)
            + caption("the nest had been above the tideline", fill=TB_INK),
            sky=INDIGO_SOFT),
        svg(TB_SEA
            + titibha(360, 458, 1.0)
            + caption("the sea did what it had been doing", fill=TB_INK),
            sky=INDIGO_SOFT),
        svg(TB_SEA
            + "".join(f'<ellipse cx="{330 + i*58}" cy="{478 + (i % 2) * 14}" rx="17" ry="7" '
                      f'fill="#a8956d"/>' for i in range(6))
            + titibha(262, 470, 0.95)
            + f'<path d="M 344 444 Q 356 458 350 472" stroke="#5f8fae" stroke-width="5" '
              f'fill="none" stroke-linecap="round"/>'
              f'<ellipse cx="350" cy="478" rx="13" ry="5" fill="#a8956d"/>'
            + caption("look at the water, and there was still sea", fill=TB_INK),
            sky=INDIGO_SOFT),
        svg(TB_SEA
            + titibha(150, 462, 0.72)
            + titibha(300, 468, 0.86)
            + titibha(470, 458, 0.66)
            + titibha(596, 472, 0.92)
            + titibha(700, 452, 0.58)
            + caption("a thousand beaks, and the same sea", fill=TB_INK),
            sky=INDIGO_SOFT),
    ],
    "donkey-in-tiger-skin": [
        svg(moon(690, 108, 38)
            + hut(112, 300, 0.62)
            + donkey(420, 376, 0.5, coat="#8d7d66", flip=True)
            + tiger_skin(648, 352, 0.62, flip=True)
            + person(516, 339, 1.0, PALM_WARM, reach=1)
            + caption("thin, and the fields were not his"),
            sky=NIGHT, ground="#3d4a2e"),
        svg(moon(690, 108, 38)
            + hut(112, 300, 0.62)
            + "".join(f'<path d="M {200 + i*54} 415 L {194 + i*54} 356" stroke="#7f9a46" '
                      f'stroke-width="5" stroke-linecap="round"/>'
                      f'<ellipse cx="{194 + i*54}" cy="352" rx="7" ry="11" fill="{HALDI}"/>'
                      for i in range(9))
            + donkey(470, 376, 0.62, coat="#8d7d66", flip=True)
            + tiger_skin(470, 366, 0.62, flip=True)
            + caption("night after night, and it held"),
            sky=NIGHT, ground="#3d4a2e"),
        svg(moon(690, 108, 38)
            + donkey(160, 384, 0.4, coat="#7d6e5a", flip=False)
            + donkey(470, 376, 0.62, coat="#8d7d66", flip=True)
            + tiger_skin(470, 366, 0.62, flip=True)
            + boom(372, 330, 1.0, rings=3, flip=True)
            + caption("and then he answered"),
            sky=NIGHT, ground="#3d4a2e"),
        svg(hut(112, 300, 0.62)
            + f'<path d="M -0 0" fill="none"/>'
            + tiger_skin(300, 402, 0.42)
            + donkey(470, 376, 0.62, coat="#8d7d66", flip=True)
            + person(628, 339, 1.0, PALM_WARM, reach=-1)
            + f'<path d="M 592 300 L 566 250" stroke="#7a5c33" stroke-width="7" '
              f'stroke-linecap="round"/>'
            + person(716, 350, 0.85, "#c9b98d", reach=-1)
            + caption("the skin was never what they feared"),
            sky=INDIGO, ground="#3d4a2e"),
    ],
    "cat-as-judge": [
        svg(burrow(470, 392, 0.9)
            + titibha(250, 470, 0.9)
            + rabbit(360, 392, 0.9)
            + caption("both of them were sure"),
            sky=INDIGO, ground="#6b6a3e"),
        svg(waves(300, fill=PALM, rows=3, gap=28, opacity=0.18)
            + f'<rect x="0" y="286" width="800" height="96" fill="#2a4a68"/>'
            + cat(560, 374, 1.0)
            + f'<circle cx="560" cy="300" r="34" fill="none" stroke="{HALDI}" '
              f'stroke-width="3" opacity="0.55"/>'
            + titibha(180, 470, 0.8)
            + rabbit(292, 396, 0.78)
            + caption("everyone said he had given up meat"),
            sky=INDIGO, ground="#6b6a3e"),
        svg(f'<rect x="0" y="286" width="800" height="96" fill="#2a4a68"/>'
            + cat(560, 374, 1.0)
            + titibha(340, 470, 0.8)
            + rabbit(430, 396, 0.78)
            + boom(496, 350, 0.7, rings=2, fill=HALDI, flip=True)
            + caption("come closer, i cannot hear you"),
            sky=INDIGO, ground="#6b6a3e"),
        svg(f'<rect x="0" y="286" width="800" height="96" fill="#2a4a68"/>'
            + burrow(180, 392, 0.9)
            + cat(560, 374, 1.0, coat="#96907f")
            + caption("he had told them so himself"),
            sky=NIGHT, ground="#5a5a34"),
    ],
    "jackal-and-drum": [
        svg(tree(150, 380, 0.8, canopy="#3f5a3a")
            + tree(260, 392, 0.6, canopy="#35502f")
            + jackal(560, 372, 0.72, flip=True)
            + boom(330, 320, 1.1, rings=3)
            + caption("something in the thicket, and loud"),
            sky=NIGHT, ground="#4a4529"),
        svg(tree(150, 380, 0.8, canopy="#3f5a3a")
            + jackal(650, 372, 0.72, flip=False)
            + boom(330, 320, 1.3, rings=3)
            + caption("everything in him said leave"),
            sky=NIGHT, ground="#4a4529"),
        svg(tree(150, 380, 0.8, canopy="#3f5a3a")
            + drum(300, 369, 1.0)
            + f'<path d="M 210 250 Q 262 296 288 330" stroke="#6f5a33" stroke-width="8" '
              f'fill="none" stroke-linecap="round"/>'
            + boom(372, 340, 0.7, rings=2)
            + jackal(560, 372, 0.72, flip=True)
            + caption("a branch, and a skin stretched over wood"),
            sky=INDIGO, ground="#4a4529"),
        svg(drum(300, 369, 1.0)
            + f'<ellipse cx="300" cy="323" rx="54" ry="15" fill="#241e19"/>'
            + jackal(520, 372, 0.72, flip=True)
            + caption("nothing inside it, and now he knew that"),
            sky=INDIGO_SOFT, ground="#4a4529"),
    ],
    # The lion's colour is the state: bone-pale, then hide-dull, then alive. Each
    # panel is one more call applied to the same object.
    "four-scholars-lion": [
        svg(tree(120, 384, 0.72, canopy="#2f5a44")
            + person(330, 339, 1.0, PALM_WARM, reach=1)
            + person(430, 348, 0.9, "#c9b98d", reach=1)
            + person(520, 352, 0.84, "#b9a9d0", reach=1)
            + person(618, 350, 0.86, "#d8c9a0", reach=1)
            + caption("three of them had read everything"),
            sky=INDIGO, ground="#5e5236"),
        svg(bones(400, 370, 1.7, count=8)
            + person(200, 339, 1.0, PALM_WARM, reach=1)
            + person(660, 350, 0.86, "#d8c9a0", reach=-1)
            + caption("bones by the side of the road"),
            sky=INDIGO, ground="#5e5236"),
        svg(tree(660, 384, 0.78, canopy="#2f5a44")
            + lion(400, 372, 0.9, coat="#cfc9b8", mane="#b3ab98")
            + person(150, 339, 1.0, PALM_WARM, reach=1)
            + person(246, 348, 0.9, "#c9b98d", reach=1)
            + person(690, 300, 0.6, "#d8c9a0", reach=-1)
            + caption("one of them started for the tree"),
            sky=INDIGO, ground="#5e5236"),
        svg(tree(660, 384, 0.78, canopy="#2f5a44")
            + lion(360, 372, 0.95, coat="#b8873f", mane="#8a5a1e")
            + person(690, 300, 0.6, "#d8c9a0", reach=-1)
            + caption("it worked exactly as he said it would"),
            sky=NIGHT, ground="#4a4029"),
    ],
    "milkmaids-pail": [
        svg(hut(120, 300, 0.66)
            + person(430, 339, 1.0, PALM_WARM, reach=1)
            + pail(430, 259, 1.0, milk_frac=0.9)
            + caption("the whole morning's milk, in one pail"),
            sky=INDIGO_SOFT, ground="#7d6a3e"),
        svg(person(300, 339, 1.0, PALM_WARM, reach=1)
            + pail(300, 259, 1.0, milk_frac=0.9)
            + f'<ellipse cx="470" cy="212" rx="15" ry="19" fill="{PALM_WARM}"/>'
              f'<ellipse cx="506" cy="216" rx="15" ry="19" fill="{PALM_WARM}"/>'
            + goose(600, 236, 0.62, body=PALM_WARM)
            + f'<path d="M 700 196 L 726 196 L 742 262 L 684 262 Z" fill="{SINDOOR}"/>'
            + caption("eggs, then birds, then the dress"),
            sky=INDIGO_SOFT, ground="#7d6a3e"),
        svg(hut(88, 336, 0.30)
            + f'<path d="M 150 404 L 760 404" stroke="#6b5a32" stroke-width="3" '
              f'opacity="0.6" stroke-dasharray="26 20"/>'
            + person(470, 339, 1.0, PALM_WARM, reach=1)
            + pail(470, 259, 1.0, milk_frac=0.9)
            + f'<path d="M 442 262 Q 470 246 498 262" stroke="{HALDI}" stroke-width="3" '
              f'fill="none" stroke-dasharray="6 5"/>'
            + caption("balanced, and not held"),
            sky=INDIGO_SOFT, ground="#7d6a3e"),
        svg(person(300, 339, 1.0, PALM_WARM, reach=-1)
            + pail(470, 392, 1.0, milk_frac=0.0, tipped=True)
            + f'<ellipse cx="520" cy="414" rx="96" ry="18" fill="{PALM_WARM}" opacity="0.9"/>'
              f'<ellipse cx="600" cy="420" rx="34" ry="9" fill="{PALM_WARM}" opacity="0.75"/>'
            + caption("it had only ever been in the pail"),
            sky=INDIGO, ground="#7d6a3e"),
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
