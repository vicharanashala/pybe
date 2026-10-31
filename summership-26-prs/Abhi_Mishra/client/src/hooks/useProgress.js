import { useState } from 'react';
import { CONFIDENCE, MAX_MISTAKES } from '../data/story';
import { shuffle } from '../lib/shuffle';

const clamp = (value) => Math.max(0, Math.min(100, value));

export function useProgress() {
  const [stage, setStage] = useState('welcome');
  const [order, setOrder] = useState([]);          // question ids in this session's (shuffled) order
  const [plotIndex, setPlotIndex] = useState(0);
  const [confidence, setConfidence] = useState(CONFIDENCE.start);
  const [mistakes, setMistakes] = useState(0);
  const [failure, setFailure] = useState(null);    // { questionId, chosenId } when the deal breaks
  const [quizResults, setQuizResults] = useState([]);
  const [reflection, setReflection] = useState([]);

  const startPlots = (ids) => { setOrder(shuffle(ids)); setPlotIndex(0); setMistakes(0); setStage('plots'); };
  const correct = () => {
    setConfidence((v) => clamp(v + CONFIDENCE.correct));
    setMistakes(0);
    if (plotIndex + 1 >= order.length) setStage('close'); else setPlotIndex(plotIndex + 1);
  };
  const wrong = () => { setMistakes((v) => v + 1); setConfidence((v) => clamp(v + CONFIDENCE.wrong)); };
  const breakDeal = (questionId, chosenId) => { setFailure({ questionId, chosenId }); setStage('rejected'); };
  const retry = () => { setMistakes(0); setFailure(null); setStage('plots'); };
  const recordQuizAnswer = (isRight, topic) => {
    setConfidence((v) => clamp(v + (isRight ? CONFIDENCE.quizRight : CONFIDENCE.quizWrong)));
    setQuizResults((list) => [...list, { topic, correct: isRight }]);
  };

  return {
    stage, setStage, order, plotIndex, confidence, failure, reflection, setReflection, quizResults,
    mistakesLeft: Math.max(0, MAX_MISTAKES - mistakes),
    quizScore: quizResults.filter((r) => r.correct).length,
    startPlots, correct, wrong, breakDeal, retry, recordQuizAnswer
  };
}
