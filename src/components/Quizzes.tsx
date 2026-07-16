import { useState, useEffect } from 'react';
import { QuizQuestion, UserProgress } from '../types';
import { OFFLINE_QUIZZES } from '../predefinedData';
import { REFRESHED_QUIZZES } from '../variablesAndIoData';
import { BrainCircuit, Check, X, HelpCircle, Trophy, Zap, RefreshCw, Star, Award, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizzesProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export default function Quizzes({ progress, onUpdateProgress }: QuizzesProps) {
  // Topics list
  const TOPICS = [
    'All Topics',
    'Variables & Data Types',
    'Input and Output',
    'Other Topics'
  ];

  const [selectedTopic, setSelectedTopic] = useState<string>(() => {
    // If last completed lesson is Variables, default to Variables quiz
    const lastLesson = progress.completedLessons[progress.completedLessons.length - 1] || '';
    if (lastLesson.includes('Variables')) return 'Variables & Data Types';
    if (lastLesson.includes('Input and Output')) return 'Input and Output';
    return 'All Topics';
  });

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [perfectQuiz, setPerfectQuiz] = useState(true);

  // Combine standard and our custom refreshed quizzes
  const baseQuizzes = OFFLINE_QUIZZES.filter(
    (q) => q.concept !== 'Variables & Data Types' && q.concept !== 'Input and Output'
  );
  
  // Format REFRESHED_QUIZZES to fit QuizQuestion type
  const refreshedQuizzesMapped: QuizQuestion[] = REFRESHED_QUIZZES.map((q) => ({
    id: q.id,
    type: q.type,
    concept: q.concept,
    question: q.question,
    codeContext: q.codeContext,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation
  }));

  const allMergedQuizzes = [...refreshedQuizzesMapped, ...baseQuizzes];

  // Filter quizzes based on selected topic
  const filteredQuizzes = allMergedQuizzes.filter((q) => {
    if (selectedTopic === 'All Topics') return true;
    if (selectedTopic === 'Other Topics') {
      return q.concept !== 'Variables & Data Types' && q.concept !== 'Input and Output';
    }
    return q.concept === selectedTopic;
  });

  // Reset indices and states when topic shifts
  useEffect(() => {
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setHasSubmitted(false);
    setWrongCount(0);
    setPerfectQuiz(true);
  }, [selectedTopic]);

  const activeQuestion = filteredQuizzes[activeQuestionIndex] || null;
  const totalQuestions = filteredQuizzes.length;
  const isQuestionCompleted = activeQuestion ? progress.completedQuizzes.includes(activeQuestion.id) : false;

  const handleOptionSelect = (option: string) => {
    if (hasSubmitted) return;
    setSelectedOption(option);
  };

  const checkAnswer = () => {
    if (hasSubmitted || !activeQuestion) return;

    let correct = false;
    if (activeQuestion.type === 'mcq' || activeQuestion.type === 'predict_output') {
      correct = selectedOption === activeQuestion.correctAnswer;
    } else if (activeQuestion.type === 'fill_blank') {
      correct = typedAnswer.trim().toLowerCase() === activeQuestion.correctAnswer.toLowerCase();
    } else if (activeQuestion.type === 'debug') {
      // Compare without spaces to make it user friendly
      const cleanTyped = typedAnswer.trim().replace(/\s+/g, '').replace(/["']/g, '"');
      const cleanCorrect = activeQuestion.correctAnswer.replace(/\s+/g, '').replace(/["']/g, '"');
      correct = cleanTyped === cleanCorrect;
    }

    setIsCorrect(correct);
    if (!correct) {
      setWrongCount((prev) => prev + 1);
      setPerfectQuiz(false);
    }
    setHasSubmitted(true);

    if (correct && !isQuestionCompleted) {
      onUpdateProgress((prev) => {
        const nextXP = prev.xp + 30; // Quizzes grant 30 XP
        const nextCompleted = [...prev.completedQuizzes, activeQuestion.id];

        // Unlock quiz master badge if completed all quizzes
        const nextBadges = [...prev.badges];
        if (nextCompleted.length >= allMergedQuizzes.length && !nextBadges.includes('Quiz Master')) {
          nextBadges.push('Quiz Master');
        }

        return {
          ...prev,
          xp: nextXP,
          completedQuizzes: nextCompleted,
          badges: nextBadges
        };
      });
    }
  };

  const nextQuestion = () => {
    if (activeQuestionIndex < totalQuestions - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTypedAnswer('');
      setHasSubmitted(false);
    }
  };

  const resetQuizSession = () => {
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setHasSubmitted(false);
    setWrongCount(0);
    setPerfectQuiz(true);
  };

  const showFinishedSummary = hasSubmitted && activeQuestionIndex === totalQuestions - 1;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6" id="quizzes-view">
      
      {/* Dynamic White & Blue Topic Switcher Card */}
      <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
          Select Skill Test Challenge
        </span>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-sky-50/50 text-slate-600 border-sky-100 hover:bg-sky-100/50 hover:text-slate-900'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {totalQuestions === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-sky-100 shadow-sm space-y-3">
          <HelpCircle className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-800">No questions found</h3>
          <p className="text-xs text-slate-500">No active test challenges available in this category.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-sky-100 overflow-hidden">
          {/* Progress header with Sky Blue theme */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50/30 px-6 py-5 flex items-center justify-between border-b border-sky-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                  COMPULSORY LEVEL CHECKS ({selectedTopic})
                </span>
                <h2 className="text-sm font-black text-slate-800">
                  Question {activeQuestionIndex + 1} of {totalQuestions}
                </h2>
              </div>
            </div>
            <div className="text-xs text-blue-700 font-black tracking-wider uppercase bg-white border border-sky-100 px-3 py-1 rounded-full shadow-sm">
              {Math.round(((activeQuestionIndex + (hasSubmitted && isCorrect ? 1 : 0)) / totalQuestions) * 100)}% COMPLETE
            </div>
          </div>

          {/* Question Area */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="bg-sky-100/70 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-sky-100 tracking-wider">
                  {activeQuestion.concept}
                </span>
                <span className="text-xs text-amber-500 font-black flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                  <Zap className="h-3.5 w-3.5 fill-amber-500" />
                  +30 XP POINTS
                </span>
              </div>
              <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-relaxed">
                {activeQuestion.question}
              </h3>
            </div>

            {/* Optional Code Context with Clean styling */}
            {activeQuestion.codeContext && (
              <div className="bg-slate-900 rounded-2xl p-5 overflow-x-auto font-mono text-xs text-sky-100 border border-slate-800 leading-relaxed shadow-inner">
                <pre>{activeQuestion.codeContext}</pre>
              </div>
            )}

            {/* Interactive Answer Input */}
            <div className="space-y-3">
              {/* MCQ / Options list */}
              {activeQuestion.options && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeQuestion.options.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={opt}
                        disabled={hasSubmitted}
                        onClick={() => handleOptionSelect(opt)}
                        className={`text-left p-4 rounded-2xl border text-xs md:text-sm font-extrabold transition-all duration-200 flex justify-between items-center cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow shadow-blue-500/20'
                            : 'bg-slate-50 border-sky-50 text-slate-700 hover:bg-slate-100/70 hover:border-sky-100'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="h-4.5 w-4.5" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Direct Inputs (Fill-blank/Debug) */}
              {!activeQuestion.options && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={typedAnswer}
                    disabled={hasSubmitted}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    placeholder="Type your exact response here..."
                    className="w-full px-4 py-3 rounded-2xl border border-sky-100 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold shadow-inner"
                  />
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                    Ensure strict casing and spelling matching.
                  </p>
                </div>
              )}
            </div>

            {/* Submission and Next buttons */}
            <div className="flex justify-between items-center gap-4 pt-5 border-t border-sky-50">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                {isQuestionCompleted ? "✓ Completed & XP Awarded" : "Compulsory Level Check"}
              </div>

              <div className="flex gap-2">
                {!hasSubmitted ? (
                  <button
                    onClick={checkAnswer}
                    disabled={activeQuestion.options ? !selectedOption : !typedAnswer.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black uppercase tracking-wider px-5 py-3 rounded-xl text-xs shadow cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    disabled={activeQuestionIndex === totalQuestions - 1}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black uppercase tracking-wider px-5 py-3 rounded-xl text-xs shadow cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-1"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Instant correction explain box */}
          <AnimatePresence>
            {hasSubmitted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className={`p-6 border-t ${
                  isCorrect
                    ? 'bg-emerald-50/40 border-emerald-100 text-emerald-900'
                    : 'bg-rose-50/40 border-rose-150 text-rose-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      {isCorrect ? 'Correct! Magical spell executed.' : 'Incorrect incantation! Try again:'}
                    </h4>
                    <p className="text-xs leading-relaxed font-semibold">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Finished Summary / Trophy Box */}
      {showFinishedSummary && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-3xl p-8 text-center space-y-5 shadow-lg relative overflow-hidden"
        >
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="p-4 bg-white/10 rounded-full inline-block">
            <Trophy className="h-10 w-10 text-amber-300 animate-bounce" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Arena Completed!</h2>
            <p className="text-xs md:text-sm text-sky-100 font-bold leading-relaxed">
              {perfectQuiz 
                ? "Incredible spellcast! You achieved a perfect score and proved your python mastery!" 
                : "Great practice! Review incorrect entries below and take the assessment again for a perfect score shield."}
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={resetQuizSession}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-700 text-xs font-black uppercase tracking-wider rounded-xl transition shadow cursor-pointer hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Restart Arena Checks</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
