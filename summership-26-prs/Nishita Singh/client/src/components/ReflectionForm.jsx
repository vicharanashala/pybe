import React, { useState } from 'react';
import { Send } from 'lucide-react';

const QUESTIONS = [
  { key: 'whatLearned', label: 'What did you learn?', required: true },
  { key: 'doDifferently', label: 'What would you do differently?' },
  { key: 'clearerConcept', label: 'Which Python concept became clearer?' },
  { key: 'helpfulSkill', label: 'Which computational thinking skill helped the most?' }
];

/**
 * Reflection questions shown after the learner has compared their own
 * solution to the official one. Submitting this is what marks the scenario
 * as completed.
 */
function ReflectionForm({ onSubmit, submitting }) {
  const [answers, setAnswers] = useState({ whatLearned: '', doDifferently: '', clearerConcept: '', helpfulSkill: '' });

  function handleSubmit(event) {
    event.preventDefault();
    if (!answers.whatLearned.trim()) return;
    onSubmit(answers);
  }

  return (
    <form className="reflection-form" onSubmit={handleSubmit}>
      {QUESTIONS.map((question) => (
        <label key={question.key}>
          {question.label}{question.required && ' *'}
          <textarea
            required={question.required}
            value={answers[question.key]}
            onChange={(event) => setAnswers({ ...answers, [question.key]: event.target.value })}
          />
        </label>
      ))}
      <button type="submit" className="primary" disabled={submitting}>
        <Send size={16} /> {submitting ? 'Saving reflection...' : 'Submit reflection'}
      </button>
    </form>
  );
}

export default ReflectionForm;
