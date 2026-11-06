# PyBe art direction

PyBe is an ink-and-paper noir investigation desk. Every visual is built from layered paper shapes, ink outlines, brass registration marks, sealing-wax accents, and soft paper shadows. The dark theme is a candlelit mahogany desk; the light theme is the same desk in morning light, with parchment, warm ivory, burgundy, and aged brass.

Illustrations use a consistent 1.5px outline, flat cut-paper fills, small 2px corner cuts, and no emoji or stock imagery. Foreground objects sit on two or three offset paper layers to create depth. Grain is a restrained CSS/SVG texture, never a noisy full-screen effect. Lighting comes from warm radial gradients and soft tokenized shadows.

The reusable SVG kit supplies five distinct portrait silhouettes, part scenes, clue artifacts, floor plans, timelines, comparisons, and decision boards. Each slide gives one visual the full stage; captions remain short and story-facing. Motion is limited to opacity and transform over 150-400ms, with all illustration motion disabled for reduced-motion users.

Palette tokens live in `styles.css`: ink and wine for the night desk, parchment and ivory for daylight, brass for focus, burgundy for danger, and verdigris for cleared evidence. Components use `currentColor` or CSS tokens so switching themes updates the entire illustration immediately.
