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
  const [score, setScore] = useState(0);

  // Calculate the total possible score for the final boss section!
  const totalScore = (SNIPPET_DATA.final?.length || 0) + (QUIZ_DATA.final?.length || 0);

  // --- RENDERING VIEWS ---
  if (view === 'terminal') {
    const dataArray = SNIPPET_DATA.final || [];
    return (
      <CodeSnippetActivity 
        title="Final Boss Challenge" 
        score={score}
        setScore={setScore}
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
        score={score}
        setScore={setScore}
        totalPossibleScore={totalScore}
        onPrev={() => setView('terminal')}
        // Routes back to the Home Dashboard when the whole tutorial is complete!
        onNextSection={() => navigate('/')} 
      />
    );
  }

  return null; // Safety fallback
}