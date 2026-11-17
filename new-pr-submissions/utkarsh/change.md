# Change Log: The Savage Mountain (PyBe Rebuild)

## Files Added / Rebuilt

All module files have been rebuilt from scratch to match the PyBe architecture from `summership-26-prs/Ayush_Anand`:

```
k2/
├── index.html              (Rebuilt clean 1.3 KB semantic shell)
├── css/base.css            (Rebuilt 3-color design tokens & responsive backdrop)
├── css/storybook.css       (Rebuilt centered 640px card & reveal panel)
├── css/interactions.css    (Rebuilt unified two-tray tap interaction)
├── js/lessonData.js        (Rebuilt pure content for 6 scenes)
├── js/lessonEngine.js      (Rebuilt pure state machine)
├── js/interactions.js      (Rebuilt unified two-tray interaction & membership)
├── js/renderer.js          (Rebuilt centered card injector & code reveal)
├── js/navigation.js        (Rebuilt progress segments & keyboard controls)
├── README.md               (New documentation)
├── product.md              (New product specification)
├── context.md              (New educational context)
└── change.md               (This change log)
```

## Files Changed

- Nothing outside the `k2/` folder was modified (`c:\Users\hs488\Downloads\pybe` remains completely untouched).
- Deleted 6 unused background photos from `assets/bg/` (`acclimatise.jpg`, `basecamp.jpg`, `chimney.jpg`, `concordia.jpg`, `darjeeling_toy_train.jpg`, `weather.jpg`). Exactly 6 background photos remain.
- Cleaned out obsolete monolithic code, sound synthesizers, timers, score gauges, duel cards, and canvas certificate generation.

## Design Decisions

- **Strict adherence to the 6-scene, 5-concept scope:** Kept strictly to deduplication, union, intersection, difference, and membership. Eliminated extraneous concepts (symmetric difference, subsets, frozenset).
- **Hard size budget strictly met:**
  - `index.html`: 1,362 bytes (< 3 KB limit).
  - Total CSS (3 files): 8,740 bytes (< 12 KB limit).
  - Total JS (5 files): 28,138 bytes (< 30 KB limit).
  - All story paragraphs are <= 41 words (< 60 word limit).
  - All Python code snippets are <= 4 lines.
- **Unified interaction primitive:** One reusable two-tray tap interaction mechanic powers Scenes 1 through 4.
