# Validation

- `npm run build`: passed.
- Python cross-check: all 14 catalogue truth values passed.
- Python cross-check: all 392 combinations (14 × 2 operators × 14) matched returned values, Python types and second-expression evaluation.
- Chromium interaction checks: all 11 screens opened successfully at 1366px and 390px viewport widths, without page-level horizontal overflow or JavaScript errors.
- Verified OR fallback and skip behavior, AND early stop, visual bell checks, quiz wrong-answer feedback and 3/3 score.
- Verified empty reflection cannot submit, saved reflection survives reload, updates save correctly, and blocked storage reports an error without false success.
- Inspected rendered desktop and mobile previews. Reduced-motion preference was enabled in automated browser checks.

The example simulator does not execute Python in the browser. Actual Python was used separately to validate its rules. No upstream integration or topic-uniqueness check was performed.

## Stage 9 simplification — 29 September 2026

- Production build passed after the revision.
- Chromium tests passed for both name-badge cases and all four ticket/wristband combinations.
- Verified user-paced first check → next action → result, with no code until explicitly requested.
- Changing a choice hides previous results/code and resets the walkthrough.
- Verified the original lab remains collapsed initially and works when opened.
- Checked guided views at 1366px and 390px widths without horizontal page overflow; visually inspected both previews.
- Confirmed quiz remains available and reflection submission survives reload. No JavaScript page errors.
- Python evaluator and original quiz questions were unchanged; original Python cross-check results above apply to that unchanged evaluator.
