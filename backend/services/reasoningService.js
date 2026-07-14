/**
 * reasoningService.js
 *
 * Runs a Sentence Transformer model locally, inside this Node process
 * (via @xenova/transformers, an ONNX-runtime port of Sentence Transformers),
 * to semantically score a learner's free-text reasoning against a small set
 * of reference "key point" sentences for the current concept.
 *
 * No external API call is made for this step — it is 100% local analysis,
 * per the "Local reasoning analysis using Sentence Transformers" requirement.
 */

let extractorPromise = null;

// Lazily load the model once and reuse it across requests.
function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline } = await import('@xenova/transformers');
      return pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    })();
  }
  return extractorPromise;
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embed(text) {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// Tunable via env so it can be adjusted without a code change/redeploy.
// NOTE: all-MiniLM-L6-v2 cosine similarities for genuinely related but
// differently-worded sentences commonly land in the 0.3-0.5 range — treating
// this like a strict "same meaning" score (0.6+) causes reasonable answers
// to be rejected. 0.32 is a more realistic bar for "in the right direction".
const PASS_THRESHOLD = Number(process.env.REASONING_PASS_THRESHOLD) || 0.32;

const STOPWORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'to', 'of', 'in',
  'on', 'for', 'and', 'or', 'it', 'this', 'that', 'you', 'your', 'i', 'so', 'as', 'with', 'by',
  'can', 'would', 'could', 'should', 'will', 'we', 'they', 'them', 'has', 'have', 'had', 'do', 'does']);

function keywordOverlapScore(a, b) {
  const tokenize = (s) => new Set(
    s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w))
  );
  const setA = tokenize(a);
  const setB = tokenize(b);
  if (!setA.size || !setB.size) return 0;
  let overlap = 0;
  for (const w of setA) if (setB.has(w)) overlap++;
  return overlap / Math.min(setA.size, setB.size);
}

/**
 * Scores a learner's reasoning against a list of reference key-point
 * sentences. Returns the best (max) similarity across key points, since a
 * learner only needs to have touched on one of the core ideas to show they
 * are reasoning in the right direction.
 *
 * Combines the Sentence Transformer's semantic similarity with a simple
 * keyword-overlap heuristic and takes the more generous of the two, so a
 * learner who uses the right domain words (even if the model's embedding
 * similarity happens to land just under the threshold) still passes.
 */
async function scoreReasoning(reasoningText, keyPoints = []) {
  const cleaned = (reasoningText || '').trim();
  if (!cleaned) {
    return { score: 0, passed: false, bestMatch: null };
  }
  if (!keyPoints.length) {
    // No reference points configured — fall back to a lenient length check
    // rather than blocking the learner.
    const passed = cleaned.split(/\s+/).length >= 8;
    return { score: passed ? PASS_THRESHOLD : 0, passed, bestMatch: null };
  }

  const reasoningVec = await embed(cleaned);
  let best = { score: -1, point: null };

  for (const point of keyPoints) {
    const pointVec = await embed(point);
    const semanticSim = cosineSimilarity(reasoningVec, pointVec);
    const lexicalSim = keywordOverlapScore(cleaned, point);
    const combined = Math.max(semanticSim, lexicalSim * 0.6);
    if (combined > best.score) best = { score: combined, point };
  }

  return {
    score: Number(best.score.toFixed(3)),
    passed: best.score >= PASS_THRESHOLD,
    bestMatch: best.point
  };
}

module.exports = { scoreReasoning, PASS_THRESHOLD };
