const OUTCOME_POLICY = Object.freeze({ minimumReasoningLength: 40, successReasoningLength: 100, successEvidenceCategories: 2 });

const EVIDENCE_PATTERNS = [
  /\b(first|then|next|finally|step|after)\b/i,
  /\b(because|since|so that|therefore|reason)\b/i,
  /\b(if|otherwise|edge case|empty|invalid|boundary)\b/i,
  /\b(function|loop|list|dictionary|condition|variable|algorithm|input|output)\b/i,
];

function evaluateOutcome(reasoning, policy = OUTCOME_POLICY) {
  if (typeof reasoning !== 'string' || reasoning.trim().length === 0) {
    return { outcome: 'incomplete', evidenceCount: 0, reason: 'No reasoning was submitted for this scenario.' };
  }
  if (reasoning.trim().length < policy.minimumReasoningLength) {
    return { outcome: 'struggle', evidenceCount: EVIDENCE_PATTERNS.filter((pattern) => pattern.test(reasoning)).length, reason: `Reasoning was shorter than the ${policy.minimumReasoningLength}-character minimum evidence threshold.` };
  }
  const evidenceCount = EVIDENCE_PATTERNS.filter((pattern) => pattern.test(reasoning)).length;
  if (reasoning.trim().length >= policy.successReasoningLength && evidenceCount >= policy.successEvidenceCategories) {
    return { outcome: 'success', evidenceCount, reason: `Reasoning met the ${policy.successReasoningLength}-character threshold and showed ${evidenceCount} distinct evidence categories.` };
  }
  return { outcome: 'struggle', evidenceCount, reason: 'Reasoning met the minimum length but did not meet the transparent success rubric.' };
}

module.exports = { EVIDENCE_PATTERNS, OUTCOME_POLICY, evaluateOutcome };