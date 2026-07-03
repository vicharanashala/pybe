# PyBe Known Issues

This document tracks known development issues, bugs, and limitations that are either intentionally deferred or awaiting a proper fix. It is maintained by developers for the benefit of future contributors.

| Issue Title | Description | When It Occurs | Root Cause | Temporary Workaround | Status | Priority | Suggested Future Fix |
|-------------|-------------|----------------|------------|---------------------|--------|----------|---------------------|
| Layout does not fill full viewport width on large desktop screens | On ~1512px viewport, pages occupy only part of the viewport. At ~1200px the layout is correct. Nav shows tiny collapsed "Sc" instead of full labels. Dashboard second row (Concept Analytics / Learning Roadmap / Recent Sessions) stuck at narrow width. | Full-screen desktop at 1512px+ resolution | Not definitively identified — CSS grid auto-placement may place `.page-content` into the 320px sidebar column | Remove `max-width: 1440px` from `.page` CSS rule; clear browser cache | Known | Medium | Use DevTools to measure rendered widths of `.app-shell`, `.page-content`, `.dashboard-layout`. Inspect grid placement. |
| `npm run dev` fails with EADDRINUSE if servers already running | Ports 5000 and 5173 may still be bound after Ctrl+C or unexpected process termination | After unclean shutdown or multiple `npm run dev` invocations | Processes not fully terminated | Manually kill processes: `Get-NetTCPConnection -LocalPort 5000,5173 \| Stop-Process` | Known | Low | Add pre-start port checking script or auto-portFinder logic |
| Package lock files auto-modified on Windows | `package-lock.json` and `server/package-lock.json` show as modified after running build or install due to CRLF line ending normalization | Windows environment with Git auto-CRLF conversion | Git CRLF settings differ from Vite/Node defaults | Run `git update-index --assume-unchanged` on lock files, or configure Git `.gitattributes` to prevent conversion | Known | Low | Add `.gitattributes` with `*.json text eol=lf` directive |
| No TypeScript validation | Project uses plain JavaScript with no type checking | N/A — intentional for prototype simplicity | No TypeScript configuration | Use JSDoc comments for documentation; rely on runtime testing | Known | Low | Migrate to TypeScript when project matures |
| No unit tests | No automated test suite exists | N/A — prototype stage | Not in scope for V0 | Manual testing via browser; use `npm run build` to verify compilation | Known | Low | Add Vitest or Jest tests before V1 |
| SpeechRecognition not supported in all browsers | Voice input silently fails in browsers without Web Speech API (Safari, older Edge) | Non-Chromium browsers | Browser API availability | Feature detection returns null; component gracefully returns null | Known | Low | Add polyfill or Web Speech API fallback |
| JSON storage has no atomic writes | Session data may be corrupted if server crashes mid-write | Unexpected server termination during active session | No transaction or write-atomicity | Ensure clean server shutdown; consider adding write-ahead logging | Known | Low | Switch to SQLite or another ACID-compliant store |
| No input sanitization on user content | Learner reasoning text stored directly without sanitization | Users submit malformed or malicious text as reasoning | No sanitization layer | No action needed — local prototype only | Known | Medium | Add DOMPurify or equivalent before any user-generated HTML rendering |
| Responsive breakpoint gaps | Some views may not fully adapt between 768px and 1024px | Tablet-sized viewports | CSS breakpoints may not cover all cases | Test on physical devices; refine media queries | Known | Low | Audit all responsive rules and add tablet-specific breakpoints |
| Hardcoded scenario IDs in quiz recommendations | `recommendNextScenario` may recommend scenarios that no longer exist | After scenarios are deleted from db.json | No foreign key validation between quiz engine and scenario store | Verify scenario existence before navigation | Known | Low | Add scenario existence check in `recommendNextScenario` |
| No pagination on session list | Session history shows all sessions; no lazy loading | Users with extensive session history | No pagination implemented | Limit display to 6 recent sessions in UI; rest accessible via API pagination | Known | Low | Add `limit` and `skip` params to GET /api/sessions |
| No rate limiting on API | API endpoints have no request throttling | N/A — local prototype | No rate limiting middleware | Do not expose to public internet | Known | Low | Add express-rate-limit middleware when deploying |
| Confetti animation performance on low-end devices | 50-piece confetti animation may cause visible lag on older hardware | Quiz completion with 100% score on low-end devices | Large DOM manipulation with CSS animations | Reduce confetti piece count to 20, or use canvas-based animation | Known | Low | Replace CSS confetti with lightweight canvas implementation |

---

## Issue Status Definitions

| Status | Meaning |
|--------|---------|
| **Known** | Issue is acknowledged and documented |
| **In Progress** | A fix is actively being developed |
| **Resolved** | A fix has been applied and verified |

## Priority Definitions

| Priority | Meaning |
|----------|---------|
| **Critical** | Breaks core functionality; must fix before release |
| **High** | Significant UX degradation; fix soon |
| **Medium** | Noticeable issue; fix when practical |
| **Low** | Minor inconvenience; fix when capacity allows |

---

*Last updated: 2026-07-03*