import { useState } from 'react';
import { MAX_MISTAKES } from '../data/story';
import { shuffle } from '../lib/shuffle';


export function useProgress() {
  const [stage, setStage] = useState('welcome');
  const [order, setOrder] = useState([]);          // question ids in this session's (shuffled) order
  const [plotIndex, setPlotIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [failure, setFailure] = useState(null);    // { questionId, chosenId } when the deal breaks
  const [quizResults, setQuizResults] = useState([]);
  const [reflection, setReflection] = useState([]);

  const startPlots = (ids) => { setOrder(shuffle(ids)); setPlotIndex(0); setMistakes(0); setStage('plots'); };
  const correct = () => {
    setMistakes(0);
    if (plotIndex + 1 >= order.length) setStage('close'); else setPlotIndex(plotIndex + 1);
  };
  const wrong = () => setMistakes(v=>v+1);
  const breakDeal = (questionId, chosenId) => { setFailure({ questionId, chosenId }); setStage('rejected'); };
  const retry = () => { setMistakes(0); setFailure(null); setStage('plots'); };
  const recordQuizAnswer = (isRight, topic) => {
    setQuizResults((list) => [...list, { topic, correct: isRight }]);
  };

  return {
    stage, setStage, order, plotIndex, failure, reflection, setReflection, quizResults,
    mistakesLeft: Math.max(0, MAX_MISTAKES - mistakes),
    startPlots, correct, wrong, breakDeal, retry, recordQuizAnswer
  };
}
