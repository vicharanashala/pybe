const mongoose = require('mongoose');

/**
 * Challenge — holds all content for the AI-Powered Python Discovery Learning
 * workflow for a single Concept. One Challenge document per Concept (matched
 * by conceptSlug, mirroring Concept.slug).
 *
 * Themes: every concept is told through FIVE parallel real-world genres —
 * sports, daily-life, philosophy, food, environmental. Onboarding asks the learner
 * which genre interests them, and everything they ever see for a concept —
 * the three scenario steps AND the worked code example — is pulled from
 * `themes[<their theme>]`.
 *
 * There is no pass/fail gate anywhere in this flow anymore: every learner
 * response is treated as showing real understanding and is sent straight to
 * the AI to be woven into the explanation. There is nothing left in this
 * schema that scores a learner's reasoning — see routes/discovery.js.
 */
const scenarioStepSchema = new mongoose.Schema({
  scenario: { type: String, required: true },
  // The open-ended question posed to the learner about this scenario —
  // the learner types their own free-text response, there is no A/B
  // choice here. All three responses (for the 3 scenario steps) are sent
  // together to the AI, which reflects them back and bridges to the
  // concept (see routes/discovery.js POST /respond).
  prompt: { type: String, required: true },
  // Optional path/URL to an SVG (or other image) illustrating this
  // scenario step, e.g. '/scenario-art/sports/variables-1.svg'. Left
  // empty until the artwork is ready — the frontend shows a placeholder
  // box in its place so the layout is already correct.
  image: { type: String, default: '' },
  // Optional list of the specific reasoning angles this scenario is
  // getting at (e.g. "Update the remembered amount", "The previous amount
  // changes"). Not shown to the learner and never used to mark anything
  // right/wrong — passed to the AI as extra texture so its explanation can
  // draw on the actual reasoning the scenario was designed to surface,
  // instead of speaking generically.
  reasoningKeyPoints: { type: [String], default: [] }
}, { _id: false });

// The SINGLE follow-up decision scenario shown AFTER the AI has reflected
// on the 3 free-text answers above. Unlike the 3 scenarios, this one gives
// the learner two concrete options (A/B) to choose from — but it's a real-
// life analogy for the concept, deliberately NOT about Python code or
// syntax, so it tests whether the underlying idea landed before syntax is
// even introduced.
const decisionScenarioSchema = new mongoose.Schema({
  scenario: { type: String, required: true },
  question: { type: String, required: true },
  optionA: { type: String, required: true },
  optionB: { type: String, required: true },
  correctOption: { type: String, enum: ['A', 'B'], required: true },
  image: { type: String, default: '' }
}, { _id: false });

// A single drag-and-drop fill-in-the-blank exercise. `text` contains a
// literal "____" token marking where the blank goes. `options` is the word
// bank shown as draggable chips (includes the correct answer plus
// distractors); `answer` must be one of the members of `options`. `hint`
// is a short 1-2 sentence explanation of what belongs there, shown to the
// learner if they get it wrong — they can still move on either way.
const fillBlankSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  hint: { type: String, default: '' }
}, { _id: false });

const themeVariantSchema = new mongoose.Schema({
  // Optional short title for this theme's story world (e.g. "Making Tea
  // for the Whole Family"). Not currently displayed anywhere in the UI —
  // stored for future use / authoring reference.
  storyTitle: { type: String, default: '' },
  // Optional shared background/context text for this theme's three
  // scenarios (e.g. a case-study setup paragraph). When present, the
  // frontend shows this text — persistently, the same across all three
  // scenario steps — in place of the per-scenario artwork placeholder.
  // Left empty for themes/concepts that don't have this content yet.
  background: { type: String, default: '' },
  // Exactly three scenario-based steps per theme, per concept — free-text,
  // answered one at a time.
  scenarios: {
    type: [scenarioStepSchema],
    required: true,
    validate: v => Array.isArray(v) && v.length === 3
  },
  // The single A/B decision scenario shown after the AI's reflection on
  // the 3 free-text answers above — a real-life analogy, not code.
  decisionScenario: {
    type: decisionScenarioSchema,
    required: true
  },
  // The worked Python example for this concept, told through this theme's
  // story world (e.g. a cricket scoreboard for "variables" under sports).
  // Shown in Section 2 as an editable, runnable, visualize-only example —
  // there's no test to pass here, just unlimited step-through visualization.
  example: {
    code: { type: String, required: true },
    explanation: { type: String, default: '' },
    // A true line-by-line syntax breakdown of `code` above — for every
    // line, an ordered list of plain-English points, one per meaningful
    // syntactic piece (keyword, function name, each punctuation mark,
    // each quote, each operator). This is authored content, not
    // generated at request time — every theme's example needs its own
    // matching breakdown, since the code itself differs per theme.
    syntaxBreakdown: {
      type: [{
        code: { type: String, required: true },
        points: { type: [String], required: true }
      }],
      default: []
    }
  }
}, { _id: false });

const challengeSchema = new mongoose.Schema({
  conceptSlug: {
    type: String,
    required: true,
    unique: true
  },

  // Real-world scenarios AND worked example, one variant per theme. Keys
  // are exactly 'sports' | 'daily-life' | 'philosophy' | 'food' | 'environmental'.
  themes: {
    type: Map,
    of: themeVariantSchema,
    required: true
  },

  // Optional steer for the AI's final "here's the actual concept" segment —
  // never shown to the learner directly, just context for the model.
  conceptHint: {
    type: String,
    default: ''
  },

  // Python concept introduction
  conceptIntro: {
    type: String,
    required: true
  },

  // Reinforcement challenge — a separate, optional follow-up exercise
  // (unrelated to the Section 1 scenario flow above).
  reinforcement: {
    prompt: { type: String, required: true },
    hint: { type: String, default: '' },
    keyPoints: { type: [String], default: [] }
  },

  // SECTION 3 — shown right after the Section 2 visualizer, before the
  // learner can move to the next concept. Two drag-and-drop fill-in-the-
  // blank exercises, theme-agnostic (same for every learner regardless of
  // their chosen theme): one about the concept itself, one about a small
  // piece of code that uses it.
  blanks: {
    conceptual: { type: fillBlankSchema, required: true },
    code: { type: fillBlankSchema, required: true }
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
