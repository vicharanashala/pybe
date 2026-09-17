const Groq = require('groq-sdk');

const SYSTEM_INSTRUCTIONS = `You are an adaptive learning evaluator for a visual-novel style learning app.
The learner is exploring a story-based saga about a zoologist discovering programming concepts through wildlife observation.

Your role is ONLY to evaluate whether the learner's observation shows the correct conceptual understanding.
You are NOT the teacher. You do NOT explain the concept. You guide them to see it themselves.

STRICT RULES:
- Before Act 3: NEVER use words like "class", "parent", "child", "inheritance", "polymorphism", "object-oriented", "Python", "method", "super", "constructor", "__init__"
- After Act 3: You may reference programming concepts only if the act itself has already revealed them
- Do NOT give away the answer. Ask a better question that points them toward noticing it themselves.
- Follow-up questions MUST reference the story characters (Dr. Priya, Pip the owl, the animals) — not programming
- Tone: warm, curious, like a wise companion in a story — Pip the owl's voice
- If answer is partially correct: push deeper, don't reject

Respond ONLY in this exact JSON format (no markdown, no code fences — raw JSON only):
{
  "understood": true or false,
  "encouragement": "short warm message when understood=true (null if false)",
  "misconception": "plain-English description of what they missed (null if understood=true)",
  "followUpQuestion": "a story-grounded question to guide them (null if understood=true)"
}`;

async function evaluate({ sagaId, actNumber, actName, arcName, concept, storyBeat, questions, expectedInsight, userAnswer }) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return localEvaluate({ sagaId, actNumber, userAnswer });
  }

  const groq = new Groq({ apiKey });

  const userMessage = `
SAGA: "${sagaId}"
ACT ${actNumber}: "${actName}" (${arcName} Arc)
CONCEPT BEING DISCOVERED (evaluator reference only — do not reveal): "${concept}"
STORY SO FAR: "${storyBeat}"
QUESTIONS ASKED TO LEARNER: ${questions.map((q, i) => `${i + 1}. ${q}`).join(' | ')}
EXPECTED INSIGHT: "${expectedInsight}"
LEARNER'S ANSWER: "${userAnswer}"

Evaluate and respond in the required JSON format.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTIONS },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 512,
      response_format: { type: 'json_object' }
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return JSON.parse(text);
  } catch (err) {
    console.error('Groq LLM evaluation error:', err.message);
    return localEvaluate({ sagaId, actNumber, userAnswer });
  }
}

// ── Rule-based fallback evaluators, keyed per saga ─────────────────────

const inheritanceEvaluator = {
  byAct: {
    1: (lower) => {
      const hits = ['breathe', 'move', 'eat', 'common', 'shared', 'same', 'all', 'similar', 'trait', 'every', 'foundation', 'general', 'together'];
      return hits.filter((h) => lower.includes(h)).length >= 2;
    },
    2: (lower) => {
      const ext = ['extra', 'plus', 'also', 'addition', 'unique', 'special', 'on top', 'adds', 'more than', 'different', 'only', 'beyond'];
      const shared = ['same', 'common', 'shared', 'all animals', 'breathe', 'move', 'eat', 'general', 'base', 'normal'];
      return ext.some((h) => lower.includes(h)) && shared.some((h) => lower.includes(h));
    },
    3: (lower) => lower.length > 30,
    4: () => true, // Code phase — evaluated by exact match in frontend
    5: (lower) => {
      const override = ['replace', 'different way', 'own way', 'same name', 'own version', 'substitut', 'change', 'differently', 'instead', 'not the same'];
      return override.some((h) => lower.includes(h));
    },
    6: (lower) => {
      const super_ = ['first', 'before', 'then', 'on top', 'reuse', 'foundation', 'original', 'base', 'normal', 'elder', 'parent', 'still'];
      return super_.filter((h) => lower.includes(h)).length >= 2;
    },
    7: (lower) => {
      const init = ['first', 'standard', 'shared', 'name', 'habitat', 'before', 'plus', 'extra', 'additional', 'basic', 'starting'];
      return init.filter((h) => lower.includes(h)).length >= 2;
    }
  },
  fallbacks: {
    1: { q: 'Look at the lion, eagle, and dolphin side by side. Name at least two specific things ALL three of them do.', miss: 'Try to name the specific shared behaviours, not just that they are similar.' },
    2: { q: 'Finish this sentence: "The eagle can do everything any animal can do, AND it can also..."', miss: 'Try describing both parts — what the eagle shares AND what only the eagle has.' },
    3: { q: 'Think of something you know in real life where one thing gets all the properties of another and adds its own. A car and a sports car? A phone and a smartphone?', miss: 'Try to think of a real-world pair where one thing "inherits" from another.' },
    5: { q: 'The chameleon eating with a tongue-flick — is it adding a brand new behaviour, or doing an existing behaviour (eating) in its own unique way?', miss: 'Focus on whether the chameleon is doing something new, or replacing how an existing trait works.' },
    6: { q: 'Before the tongue-flick, the chameleon still opens its mouth like every animal. Does it throw away the normal eating pattern, or use it first and then add to it?', miss: "Notice that the chameleon uses the normal pattern FIRST, then adds. It doesn't throw the original away." },
    7: { q: 'When a new eagle is first catalogued, which fields does it need — just its own (wingspan), or the standard animal fields too (name, habitat)? In what order would you fill them?', miss: 'Think about which information comes from the general animal pattern and which is eagle-specific. Order matters.' }
  },
  encouragements: {
    1: 'Exactly! You spotted the shared foundation — the traits that belong to every animal.',
    2: 'Perfect. You saw both parts — the shared foundation AND the eagle\u2019s unique addition.',
    3: 'Great example! You\u2019ve mapped the pattern to a new context.',
    5: 'Yes! The chameleon is doing the same behaviour — just its own way. That\u2019s the key insight.',
    6: 'Exactly right — use the original first, then layer your own on top.',
    7: 'Spot on! The shared fields come first, then the eagle-specific ones. Order is everything.'
  }
};

const polymorphismEvaluator = {
  byAct: {
    1: (lower) => {
      const hits = ['same', 'different', 'each', 'own', 'response', 'behavior', 'behaviour', 'depends', 'depended', 'request', 'animal'];
      return hits.filter((h) => lower.includes(h)).length >= 2;
    },
    2: (lower) => {
      const hits = ['same', 'name', 'method', 'own', 'different', 'implementation', 'version', 'each', 'speak', 'behaviour', 'behavior'];
      return hits.filter((h) => lower.includes(h)).length >= 2;
    },
    3: (lower) => {
      const hits = ['same', 'depends', 'object', 'call', 'own', 'version', 'method', 'each', 'compatible', 'speak'];
      return hits.filter((h) => lower.includes(h)).length >= 2;
    },
    4: (lower) => {
      const hits = ['loop', 'all', 'same', 'one', 'common', 'behavior', 'behaviour', 'compatible', 'each', 'speak'];
      return hits.filter((h) => lower.includes(h)).length >= 2;
    },
    5: (lower) => {
      const hits = ['add', 'new', 'without', 'change', 'extend', 'extensible', 'flexible', 'automatic', 'loop', 'same', 'existing', 'reuse', 'reusable'];
      return hits.filter((h) => lower.includes(h)).length >= 2;
    },
    6: (lower) => {
      const strong = ['many forms', 'polymorphism', 'one action', 'interface'];
      const general = ['same', 'different', 'method', 'object', 'own', 'depends', 'form'];
      return strong.some((h) => lower.includes(h)) || general.filter((h) => lower.includes(h)).length >= 3;
    }
  },
  fallbacks: {
    1: { q: 'Priya gave the exact same request to the dog, the cat, and the bird. In your own words, what did each one do — and was the response the same or different?', miss: 'Try comparing the dog, the cat, and the bird directly. Was the request the same? Were the responses the same?' },
    2: { q: 'All three animals perform a \u201cmake a sound\u201d behaviour. What is the action called, and how does each animal do it in its own way — dog, cat, and bird?', miss: 'Name the shared action AND describe how each animal does it differently.' },
    3: { q: 'When Priya calls speak() on the dog and then on the cat, does the same command give the same result both times? What decides the result — which object it runs on, or something else?', miss: 'Think about which object the command runs on — the dog or the cat. Does the result change?' },
    4: { q: 'Priya put all the animals in one list and used a single loop. What do all the animals need to have, so the loop can talk to each one?', miss: 'The loop can only make one request to each animal. What common behaviour must every animal provide?' },
    5: { q: 'When Priya added the Lion to the list, did she rewrite the loop? What does that tell you about adding new animals without changing existing code?', miss: 'Focus on what stayed the same when the Lion joined — the loop kept working with no changes.' },
    6: { q: 'Priya wrote POLYMORPHISM at the end. In your own words, what does the pattern in the forest mean — and why is it useful when new animals join?', miss: 'Describe \u201cone request, many different responses\u201d in your own words, and tie it back to the forest.' }
  },
  encouragements: {
    1: 'Exactly! Same request — different responses. That\u2019s the pattern the whole saga is built on.',
    2: 'Perfect. The action name is shared, but every animal fills it in with its own voice.',
    3: 'Spot on! The same method call runs the version that belongs to whichever object it is called on.',
    4: 'Yes! One loop can speak to all of them, because every animal provides the behaviour the loop expects.',
    5: 'Beautiful. New objects joined without touching the existing loop — that\u2019s the flexibility polymorphism gives you.',
    6: 'Nailed it. One action, many forms — that\u2019s polymorphism.'
  }
};

function localEvaluate({ sagaId, actNumber, userAnswer }) {
  const lower = userAnswer.toLowerCase().trim();

  if (lower.length < 15) {
    return {
      understood: false,
      encouragement: null,
      misconception: 'Try to say a bit more — describe what you noticed in detail.',
      followUpQuestion: 'Look at the story again. What specific things did you notice that stood out to you?'
    };
  }

  const module = sagaId === 'polymorphism' ? polymorphismEvaluator : inheritanceEvaluator;
  const passed = module.byAct[actNumber] ? module.byAct[actNumber](lower) : true;

  if (!passed) {
    const fb = module.fallbacks[actNumber] || {
      q: 'Look at the story again and describe what you noticed in more detail.',
      miss: 'Try to be more specific about what you observed.'
    };
    return { understood: false, encouragement: null, misconception: fb.miss, followUpQuestion: fb.q };
  }

  return {
    understood: true,
    encouragement: module.encouragements[actNumber] || 'Well observed!',
    misconception: null,
    followUpQuestion: null
  };
}

module.exports = { evaluate };