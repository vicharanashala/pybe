// Krishna's narration lines, keyed by route pathname.
// useGuideNarration.ts looks up the current route here.
// Lesson routes (/lessons/:slug) fall back to the lesson's own content instead — see the hook.
//
// Guide narration content removed — kept as empty exports so useGuideNarration.ts
// and anything importing this file doesn't break.

export const NARRATION_BY_ROUTE: Record<string, string> = {};

export const DEFAULT_NARRATION = "";