# Future Enhancements

This document tracks known limitations found in the current codebase, so they're
tracked rather than lost. These are not blockers for the current PR — they're
follow-up items for future iterations.

---

## Admin Panel Login
- Admins log in through the exact same `/login` form as regular learners
  (`LoginPage.jsx`); there's no dedicated admin login page or visual distinction
  until after submitting, when the app redirects based on role
- No UI-driven way to create or invite an admin account — the only way in is a
  backend seed script (`seed:admin`), which sets a default password
  (`ChangeMe123!`) if one isn't provided via env vars
- No "forgot password" flow for either learners or admins
- Planned: dedicated admin sign-in experience, and a safer way to provision
  admin accounts than a default fallback password

## Frontend & Dashboard Design
- Admin sidebar (`AdminLayout.jsx`) is a fixed-width layout with no responsive
  behavior for smaller screens (no collapse/hamburger menu)
- No loading skeletons/empty states in several places; some pages just show a
  blank area while data loads
- Planned: responsive pass on admin layout, consistent loading/empty states,
  general visual polish across dashboard pages

## Python Practice Questions
- The code editor (`CodeEditor.jsx`, built on Monaco) is wired as a fully
  controlled component (`value` + `onChange` both bound to parent state), which
  is a known pattern that can cause cursor position to jump or reset while
  typing
- `formatOnType: true` and `autoIndent: "full"` are enabled together, which can
  unexpectedly reformat/reindent code as the user types — risky for Python,
  where indentation is meaningful
- Planned: fix editor cursor behavior (move to an uncontrolled/ref-based value
  pattern or debounce updates) and revisit auto-formatting settings

---

## Notes
- This list will be updated as new items come up or existing ones are resolved.
- See PR description for the current release's known gaps summary.
