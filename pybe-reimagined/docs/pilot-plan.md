# Pybe — Pilot Plan (Phase 9)

> **Goal:** Run Pybe with 20+ students for one week. Capture adoption, engagement, and outcome metrics.

---

## 1. Cohort

- **Target:** 20-30 students
- **Source:** Sir's classroom (or a parallel batch)
- **Duration:** 5 school days (Mon-Fri)
- **Onboarding session:** First 30 minutes of Day 1 (script in `OnboardingModal.tsx`)

**Inclusion criterion:** Has an email + consent to participate + ≥ Class 8 English.

---

## 2. Daily schedule (per student)

| Time | Activity |
|---|---|
| Day 1, 0:00-0:30 | Onboarding session (script-led) |
| Day 1, 0:30+ | Free exploration — pick any case study |
| Day 2-5 | Goal: complete at least 5 case studies, reach Level 2 |

There is **no fixed curriculum**. Students pick what they want. The Phase-1 prompt invites this: "I want to learn in terms of Harry Potter."

---

## 3. Metrics we capture

Tracked via `LocalStorageTracker` (offline-first) → can be POSTed to a Plausible-style endpoint if `PYBE_ANALYTICS_ENDPOINT` env var is set. **Never PII.** Only an anonymous UUID.

| Event | When | Props |
|---|---|---|
| `case_started` | Open a case study URL | caseStudyId, metaphorId, piagetStage |
| `reasoning_submitted` | Click Submit on a reasoning box | caseStudyId, length |
| `reveal_unlocked` | Reveal becomes visible | caseStudyId, constructs |
| `run_code_success` | TryItEditor run ok | caseStudyId, ms |
| `run_code_failure` | TryItEditor run threw | caseStudyId, ms, errorType |
| `level_unlocked` | Score crosses a threshold | from, to, totalScore |
| `metaphor_changed` | Header dropdown select | fromId, toId |
| `feedback_submitted` | Click Send feedback | score (1-5), hasComment |

---

## 4. Daily check-in (TA runs)

- Open the anonymous analytics dashboard (TBD Phase-9 follow-up; for now: parse localStorage dump).
- Note total events per student per day.
- Flag any student with 0 events for 24h.
- Note any `run_code_failure` events for case studies (suggests the scenario is unclear).

---

## 5. Privacy posture

- No email collected.
- No IP stored.
- All events go through the `AnalyticsTracker` interface; production wiring can be Plausible-style (no cookies).
- Voice recordings (when used) never leave the browser. The mic button tooltip says so.
- Feedback text is logged at `console.debug` only and not sent to any server in Phase 9.

---

## 6. Acceptance criteria

- [x] Tracker.ts + tracker tests
- [x] Events.ts registered with 8 events
- [x] FeedbackWidget on every case-study page
- [x] OnboardingModal with 6-step script
- [x] Pilot plan + post-pilot report filed in `docs/pilot-plan.md` and `docs/pilot-week-1.md`

---

## 7. Open questions

1. Where is the cohort (Sir's classroom? a parallel batch?)?
2. Analytics endpoint — Plausible (hosted) or self-hosted PostHog?
3. Server-side persistence — needed across devices? (Phase 9 says "local + leaderboard"; cross-device is Phase 10.)
4. Privacy review — does the institution require a Data Protection Officer sign-off?
