import type { AIScores } from '../context/ProgressContext';
import type { TopicDefinition } from '../data/curriculum';

export interface EvaluationResult {
  scores: AIScores;
  feedback: string;
}

// Generic keyword categories that apply across all Python topics
const genericKeywords = {
  concept: ['rule', 'concept', 'pattern', 'structure', 'syntax', 'operation', 'behavior'],
  prediction: ['predict', 'expect', 'result', 'output', 'return', 'produce', 'display'],
  reasoning: ['because', 'therefore', 'since', 'reason', 'why', 'explain', 'understand', 'means'],
  reflection: ['story', 'problem', 'real', 'world', 'use', 'help', 'solve', 'practice', 'apply'],
  critical: ['edge', 'case', 'error', 'wrong', 'mistake', 'check', 'test', 'validate', 'limit', 'compare'],
};

export const evaluateReflection = (text: string, topic?: TopicDefinition): EvaluationResult => {
  const normalizedText = text.toLowerCase();
  const topicTerms = topic?.mentorKeywords ?? [];
  const words = normalizedText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // 1. Generic keyword matching across categories
  const matches = {
    concept: 0,
    prediction: 0,
    reasoning: 0,
    reflection: 0,
    critical: 0,
  };

  Object.entries(genericKeywords).forEach(([category, keywords]) => {
    keywords.forEach(kw => {
      if (normalizedText.includes(kw)) {
        matches[category as keyof typeof matches]++;
      }
    });
  });

  // Also count topic-specific keyword usage
  let topicKeywordHits = 0;
  topicTerms.forEach(term => {
    if (normalizedText.includes(term.toLowerCase())) topicKeywordHits++;
  });

  // 2. Score calculations (0-100 scale)

  // Communication: clarity, vocabulary, articulation length
  let communication = 40;
  if (wordCount > 5) communication += 15;
  if (wordCount > 15) communication += 15;
  if (wordCount > 25) communication += 15;
  if (wordCount > 40) communication += 10;
  if (/[.,!?;:]/.test(text)) communication += 5;
  communication = Math.min(communication, 100);

  // Reasoning: understanding the concept and its mechanics
  let reasoning = 40;
  if (matches.reasoning > 0) reasoning += 20;
  if (matches.concept > 0) reasoning += 15;
  if (matches.prediction > 0) reasoning += 10;
  if (topicKeywordHits > 0) reasoning += 10;
  reasoning = Math.min(reasoning, 100);

  // Reflection: connecting story to concept
  let reflection = 40;
  if (matches.reflection > 0) reflection += 25;
  if (wordCount > 20) reflection += 15;
  if (matches.prediction > 0 && matches.reasoning > 0) reflection += 10;
  if (topicKeywordHits > 1) reflection += 10;
  reflection = Math.min(reflection, 100);

  // Critical Thinking: edge cases, comparisons, limitations
  let criticalThinking = 40;
  if (matches.critical > 0) criticalThinking += 25;
  if (matches.critical > 2) criticalThinking += 15;
  if (normalizedText.includes('compare') || normalizedText.includes('difference') || normalizedText.includes('versus') || normalizedText.includes('vs')) {
    criticalThinking += 10;
  }
  criticalThinking = Math.min(criticalThinking, 100);

  // Creativity: expression depth, novel descriptions
  let creativity = 35;
  if (wordCount > 25) creativity += 20;
  const allGenericWords = Object.values(genericKeywords).flat();
  const novelWords = words.filter(w =>
    w.length > 5 &&
    !allGenericWords.includes(w) &&
    !topicTerms.some(t => t.toLowerCase() === w)
  );
  if (novelWords.length > 5) creativity += 25;
  if (novelWords.length > 10) creativity += 10;
  creativity = Math.min(creativity, 100);

  // Prompt Quality: overall alignment with educational goal
  let promptQuality = Math.round((communication + reasoning + criticalThinking) / 3);
  if (wordCount < 5) promptQuality = Math.max(10, promptQuality - 30);
  if (topicKeywordHits > 0) promptQuality = Math.min(100, promptQuality + 10);

  const scores: AIScores = {
    reasoning,
    reflection,
    criticalThinking,
    creativity,
    communication,
    promptQuality,
  };

  // 3. Generate structured royal feedback
  let feedback = '';

  if (wordCount < 6) {
    feedback = topic
      ? `Mentor's Counsel: Your response is extremely brief, seeker of wisdom. Reflect more deeply on ${topic.title}: name the story problem, explain the Python rule, and predict the result it produces.`
      : "Mentor's Counsel: Your response is extremely brief, seeker of wisdom. Reflect deeper on the story problem, the Python rule, and the expected result.";
  } else {
    const topicTitle = topic?.title ?? 'this concept';
    const storyContext = topic?.learningReflection.memoryTrick ?? 'the story';

    feedback = `Your ${topicTitle} reflection has been reviewed!\n\n`;

    // Reasoning feedback
    if (reasoning >= 80) {
      feedback += `• **Reasoning (Excellent):** You clearly connected the story situation to the Python construct and explained its expected result.\n`;
    } else if (reasoning >= 60) {
      feedback += `• **Reasoning (Good):** Your reasoning shows understanding. To strengthen it, explicitly state what the Python rule does and why it produces that result.\n`;
    } else {
      feedback += `• **Reasoning (Developing):** Try to explain the Python rule in your own words. What does it do step by step? What result do you predict?\n`;
    }

    // Reflection feedback
    if (reflection >= 75) {
      feedback += `• **Reflection (Strong):** You successfully linked the story elements to the abstract Python concept using ${storyContext}.\n`;
    } else if (reflection >= 55) {
      feedback += `• **Reflection (Good):** You made some connections. To deepen your reflection, name the specific story detail and explain how the code handles it.\n`;
    } else {
      feedback += `• **Reflection (Developing):** Connect the physical story elements directly to the abstract concepts. How does what happened in the story map to what the code does?\n`;
    }

    // Critical Thinking feedback
    if (criticalThinking >= 80) {
      feedback += `• **Critical Thinking (Superb):** You identified edge cases, compared alternatives, or recognized limitations. This shows mature computational thinking.\n`;
    } else if (criticalThinking >= 60) {
      feedback += `• **Critical Thinking (Good):** Consider what could go wrong or what happens in unusual cases. How does this concept compare to alternatives?\n`;
    } else {
      feedback += `• **Critical Thinking (Developing):** Ask yourself: what are the limits? What happens with edge cases? Is there a faster or clearer approach?\n`;
    }

    // Personalized next step based on topic
    if (topic) {
      const reflection = topic.learningReflection;
      feedback += `\n**Mentor's Blessing:** ${reflection.keyTakeaway} You are ready to cross the visual bridge and translate the story into Python syntax.`;
    } else {
      feedback += `\n**Mentor's Blessing:** You have shown computational thinking. You are ready to cross the visual bridge and translate the story into Python syntax.`;
    }
  }

  return { scores, feedback };
};
