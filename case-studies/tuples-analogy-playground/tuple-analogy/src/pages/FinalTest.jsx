import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeSnippetActivity from '../components/CodeSnippetActivity';
import Quiz from '../components/Quiz';
import { SNIPPET_DATA } from '../data/snippets';
import { QUIZ_DATA } from '../data/quiz';

export default function FinalChallenge() {
  // We start directly on the terminal view because there is no analogy for the final test
  const [view, setView] = useState('terminal'); 
  const navigate = useNavigate();


  // --- RENDERING VIEWS ---
  if (view === 'terminal') {
    const dataArray = SNIPPET_DATA.final || [];
    return (
      <CodeSnippetActivity 
        title="Final Boss Challenge" 
        snippets={dataArray}
        // Since there's no analogy view, "Back" takes them to the previous lesson
        onPrev={() => navigate('/nested')} 
        onNext={() => setView('quiz')} 
      />
    );
  }

  if (view === 'quiz') {
    return (
      <Quiz
        title="Final Boss Challenge"
        questions={QUIZ_DATA.final || []}
        onPrev={() => setView('terminal')}
        // Routes back to the Home Dashboard when the whole tutorial is complete!
        onNextSection={() => navigate('/')} 
      />
    );
  }

  return null; // Safety fallback
}