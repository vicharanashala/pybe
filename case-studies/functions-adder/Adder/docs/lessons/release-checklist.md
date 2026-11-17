# Release Checklist — Story-Based Lesson Module (Adder)

Final pre-submission checklist for updating PR #25 with this
implementation. Every item below was verified during Versions 0.1–0.6;
this file consolidates them into one place for the actual submission
step, which happens outside this documentation (pushing commits to the
`main` branch of the fork, per the plan agreed at the start of this
work).

## Code

- [x] All 11 files under `client/src/lessons/` present: `AdderLesson.jsx`,
      `errors/{errorCodes,errorMessages,index}.js`,
      `content/adderContent.js`, `components/LessonUI.jsx`,
      `screens/{Story,Questions,Discovery,Python,Summary}Screen.jsx`.
- [x] No TypeScript, no Tailwind config, no `react-router-dom` anywhere
      in the tree — confirmed by file extension (`.jsx`/`.js` only) and
      by `package.json` diff (see Version 0.5 in `version-history.md`).
- [x] No dead files — no unused `HomePage`/`LessonCard`/lesson registry,
      no unused simulation screen, no leftover scaffolding from earlier
      drafts (this was an explicit check during Version 0.3's "Final
      verification pass" equivalent — see the Version 0.3 entry).
- [x] `client/src/main.jsx` diff is minimal and additive-only: 4 hunks,
      0 removed lines, 0 reformatted lines — confirmed via `diff`
      (Version 0.5).
- [x] `client/src/styles.css` diff is additive-only across both of its
      two lesson-related blocks (Versions 0.2 and 0.3) — confirmed via
      `diff` both times.
- [x] Every error raised anywhere in `client/src/lessons/` goes through
      `createLessonError()` — no bare `new Error(...)` calls introduced
      by this module (spot-checked across all 11 files).

## Testing

- [x] `adderContent.js` self-validates on load (`validateAdderContent()`)
      — both the pass case and a deliberately broken case were run and
      produced the expected result (Version 0.1).
- [x] All three `LessonUI.jsx` components' prop-guard behavior confirmed
      via an isolated `esbuild` bundle check (Version 0.2).
- [x] All five screens mounted and interacted with via real DOM events
      in a jsdom + React 18 test harness — 30 assertions, all passing,
      covering every interactive branch plus all 8
      `SCREEN_CONTENT_MISSING` guard cases (Version 0.3).
- [x] The full lesson (`AdderLesson`) driven end-to-end — story through
      restart — via real DOM events, confirming correct content is
      threaded to every screen, not just that transitions occur — 6
      assertions, all passing (Version 0.4).
- [x] A real `vite build` of the actual official client succeeded with
      the full patch applied (1582 modules vs. 1571 baseline — the
      delta matches the added file count exactly) (Version 0.5).
- [x] The real Express backend (untouched by this contribution) was
      installed, seeded, started, and its three existing endpoints
      queried live via `curl`, confirming no regression to the server
      this client depends on (Version 0.5).
- [x] The production bundle was inspected directly and confirmed to
      contain both existing mentor-UI strings and new lesson strings
      together, in the same shipped file (Version 0.5).

## Error handling

- [x] 5 centralized error codes defined, each with a description,
      possible cause, and recovery step in `error-catalogue.md`:
      `CONTENT_SECTION_MISSING`, `CONTENT_SHAPE_INVALID`,
      `COMPONENT_PROP_MISSING`, `SCREEN_CONTENT_MISSING`,
      `ORCHESTRATOR_UNKNOWN_SCREEN`.
- [x] Every code in `errorCodes.js` has a matching entry in
      `errorMessages.js` and a matching row in `error-catalogue.md` —
      verified by direct comparison (Version 0.6).
- [x] Every code's verification status is stated honestly — 4 of 5 were
      verified by real execution; 1
      (`ORCHESTRATOR_UNKNOWN_SCREEN`) is stated plainly as verified by
      code inspection only, since it guards a state unreachable through
      any exposed prop or interaction.

## Documentation

- [x] `docs/lessons/formal-specification.md`, `system-design.md`,
      `version-history.md`, `error-catalogue.md` all maintained
      incrementally, append-only, across Versions 0.1–0.5 — no earlier
      version's documented content was rewritten or removed.
- [x] `docs/lessons/README.md` added as the documentation entry point,
      with a table of contents to the four documents above.
- [x] `docs/essential-docs.md`, `docs/product-document.md`,
      `docs/design-principles.md` — the original PR's top-level docs —
      revised to accurately scope this contribution to one lesson
      (Adder), clearly distinguishing it from the two external
      prototype lessons (Thirsty Crow, Crane and Fish) referenced as
      philosophical context, not as part of this PR.
- [x] Every cross-reference between all 7 markdown files (3 top-level +
      4 internal, checked programmatically) resolves to a real file.
      Three broken references were found and fixed during this version
      (two pointing at `client/src/lessons/README.md` before the file's
      actual location at `docs/lessons/README.md` was settled; one
      pre-existing bug in the original `essential-docs.md` pointing at
      `02_Product_Document.md`/`03_Design_Principles.md`, filenames
      that don't match the real `product-document.md`/
      `design-principles.md`).
- [x] Terminology checked for consistency across all documents:
      "learner" (never "user"/"student"), "screen" (never "page"),
      "content" (never bare "data"), "lesson orchestrator"/
      "orchestrator" (never "lesson engine"/"framework" — those terms
      are reserved for a hypothetical multi-lesson system this PR does
      not build).
- [x] Function-level documentation (purpose/inputs/outputs/errors/side
      effects) present on every exported function across all 11 source
      files.

## Scope honesty (the maintainer-facing check)

- [x] Nothing in any document claims Thirsty Crow or Crane and Fish are
      part of this PR's codebase — both are explicitly labeled as
      external prototypes in `essential-docs.md`'s scope table and
      throughout `product-document.md`.
- [x] Nothing claims the six-stage target flow is what was built —
      `product-document.md`'s "Status of this contribution" and
      `design-principles.md`'s opening note both state plainly that
      Adder implements a five-screen version, with the Reflection stage
      folded into Discovery and no standalone Interactive Simulation
      stage.
- [x] No TypeScript/Tailwind/router framing anywhere implies this PR
      changes the client's overall architecture — `essential-docs.md`
      explicitly lists what was kept out and why.

## Not part of this checklist

Pushing the actual commits, opening/updating the PR description on
GitHub, and requesting re-review from Prakash sir are next steps
outside this documentation set — this checklist covers what should be
true of the repository's contents before that happens, not the
submission mechanics themselves.
