import React, { useEffect } from 'react';
import ReflectionCard from './ReflectionCard';
import McqCard from './McqCard';

/**
 * CustomTagRenderer Component
 * Parses raw HTML with <z-*> tags and mounts stateful interactive React components
 * (ReflectionCard, McqCard) or renders formatted static content.
 */
export default function CustomTagRenderer({ htmlContent, isCentered = false, onProceed }) {
  if (!htmlContent) return null;

  // Check if content contains an MCQ block (<z-options>)
  if (htmlContent.includes('<z-options>')) {
    const parsedMcq = parseMcqContent(htmlContent);
    return (
      <McqCard
        titleHtml={parsedMcq.titleHtml}
        questionHtml={parsedMcq.questionHtml}
        options={parsedMcq.options}
        explanationHtml={parsedMcq.explanationHtml}
        onProceed={onProceed}
      />
    );
  }

  // Check if content contains a Reflection / Ponder block (<z-answer>)
  if (htmlContent.includes('<z-answer>') || htmlContent.includes('<z-ponder>')) {
    const parsedReflection = parseReflectionContent(htmlContent);
    return (
      <ReflectionCard
        titleHtml={parsedReflection.titleHtml}
        questionHtml={parsedReflection.questionHtml}
        answerHtml={parsedReflection.answerHtml}
        explanationHtml={parsedReflection.explanationHtml}
        onProceed={onProceed}
      />
    );
  }

  // Non-gated standard narrative beat
  useEffect(() => {
    if (onProceed) {
      onProceed(true);
    }
  }, [htmlContent, onProceed]);

  const preparedHtml = prepareStandardHtml(htmlContent);

  return (
    <div 
      className={`beat-content space-y-4 text-slate-200 text-lg leading-relaxed ${
        isCentered ? 'text-center flex flex-col items-center justify-center w-full' : ''
      }`}
      dangerouslySetInnerHTML={{ __html: preparedHtml }}
    />
  );
}

/** Helper to parse MCQ Beat HTML into structured props */
function parseMcqContent(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const titleEl = doc.querySelector('h4, h3');
  const titleHtml = titleEl ? titleEl.outerHTML : '';

  const questionEl = doc.querySelector('z-question');
  const questionHtml = questionEl ? questionEl.innerHTML : '';

  const optionsEl = doc.querySelector('z-options');
  const options = [];
  if (optionsEl) {
    const liItems = optionsEl.querySelectorAll('li');
    liItems.forEach((li) => {
      const isCorrect = !!li.querySelector('z-correct-answer') || li.innerHTML.includes('<z-correct-answer>');
      // Clean up text
      let text = li.innerHTML;
      text = text.replace(/<\/?z-correct-answer>/g, '').trim();
      options.push({ text, isCorrect });
    });
  }

  const explanationEl = doc.querySelector('z-explanation');
  const explanationHtml = explanationEl ? explanationEl.innerHTML : '';

  return { titleHtml, questionHtml, options, explanationHtml };
}

/** Helper to parse Reflection / Ponder Beat HTML into structured props */
function parseReflectionContent(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const titleEl = doc.querySelector('h4, h3');
  const titleHtml = titleEl ? titleEl.outerHTML : '';

  const ponderEl = doc.querySelector('z-ponder');
  const questionEl = doc.querySelector('z-question');
  const questionHtml = ponderEl ? ponderEl.innerHTML : (questionEl ? questionEl.innerHTML : '');

  const answerEl = doc.querySelector('z-answer');
  const answerHtml = answerEl ? answerEl.innerHTML : '';

  const explanationEl = doc.querySelector('z-explanation');
  const explanationHtml = explanationEl ? explanationEl.innerHTML : '';

  return { titleHtml, questionHtml, answerHtml, explanationHtml };
}

/** Helper to format standard non-interactive HTML content */
function prepareStandardHtml(html) {
  return html
    .replace(/style:"([^"]+)"/g, 'style="$1"')
    .replace(/<z-announcement>/g, '<div class="z-announcement-box">')
    .replace(/<\/z-announcement>/g, '</div>')
    .replace(/<z-thinking>/g, '<div class="z-thinking-box">')
    .replace(/<\/z-thinking>/g, '</div>')
    .replace(/<z-question>/g, '<div class="z-question-box">')
    .replace(/<\/z-question>/g, '</div>')
    .replace(/<z-reply>/g, '<div class="z-reply-box">')
    .replace(/<\/z-reply>/g, '</div>')
    .replace(/<z-click>/g, '<div class="z-click-box">')
    .replace(/<\/z-click>/g, '</div>');
}
