# PyBe visual design note

The dark theme remains a candlelit haunted study: near-black wood, parchment text, brass, and sealing wax. The light theme is the same room in daylight, built from warm parchment surfaces, ink-black text, aged brass, and deep burgundy rather than a white-and-blue inversion. Both themes use CSS tokens, so controls, SVG motifs, evidence artifacts, and code blocks inherit the active palette.

Concept visuals use the case metaphor directly: parsing is a witness strip opening into name/place/time chips; datetime sorting is a clock timeline; sets are overlapping evidence circles with the unverified gap marked; recursion is a branching decision tree with failed paths dimmed; the floor plan places a case token in the manor rooms; character cards use original line-art portraits; evidence remains pinned to a board.

The client can be checked with `npm run build --prefix client`. The server checks are `npm run audit:text --prefix server`, `npm run validate:python --prefix server`, and `npm run check:contrast --prefix server`.

At desktop widths the app uses navigation, stage, and reserved-board zones. Below 980px the board slot becomes a compact top strip and the archive becomes a stacked navigation region. Lightning is hidden in light mode, where slow dust motes replace it, and both effects stop under `prefers-reduced-motion`.
