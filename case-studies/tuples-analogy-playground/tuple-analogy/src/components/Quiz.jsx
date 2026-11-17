import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';

export default function Quiz({ title, questions, onPrev, score, setScore, totalPossibleScore, onNextSection }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Track local score for the end-of-quiz screen
  const [localQuizScore, setLocalQuizScore] = useState(0);
  const [awardedQuestions, setAwardedQuestions] = useState([]);

  // Calculate passing mechanics
  const percentage = questions?.length ? Math.round((localQuizScore / questions.length) * 100) : 0;
  const passed = percentage >= 50;

  // WHEN QUIZ FINISHES: If they scored >= 50%, unlock the next section!
  useEffect(() => {
    if (isFinished && passed) {
      // Pull the section number from the title (e.g., "1. Ordered" -> 1)
      const match = title.match(/^\d+/);
      const currentLevel = match ? parseInt(match[0]) : 0;
      
      if (currentLevel > 0) {
        const maxUnlocked = parseInt(localStorage.getItem('unlockedLevel') || '1');
        // If the next level isn't unlocked yet, unlock it!
        if (currentLevel + 1 > maxUnlocked) {
          localStorage.setItem('unlockedLevel', (currentLevel + 1).toString());
          // Tell the Sidebar to refresh its locks immediately
          window.dispatchEvent(new Event('levelUnlocked'));
        }
      }
    }
  }, [isFinished, passed, title]);

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto min-h-[60vh] flex items-center justify-center">
        <p className="font-bold text-xl">No quiz questions available for this section yet.</p>
      </div>
    );
  }

  const q = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    if (selectedAnswer === q.correct) {
      setLocalQuizScore((prev) => prev + 1);
      
      if (setScore && !awardedQuestions.includes(currentQuestionIndex)) {
        setScore((prev) => prev + 1);
        setAwardedQuestions((prev) => [...prev, currentQuestionIndex]);
      }
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsFinished(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    }
  };

  const handleRetry = () => {
    // FIX: Reset the global score back to 0!
    if (setScore) setScore(0);
    
    // Also reset local quiz trackers just in case
    setLocalQuizScore(0);
    setAwardedQuestions([]);
    
    // Route back to the terminal/snippet view
    if (onPrev) {
      onPrev();
    }
  };

  // --- FINISHED SCREEN ---
  if (isFinished) {
    // Dynamic text based on passing status
    let message = "Keep practicing! You need at least 50% to unlock the next section.";
    if (percentage === 100) message = "Perfect Score! Next section unlocked!";
    else if (passed) message = "Great job! You passed and unlocked the next section.";

    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in zoom-in duration-500 relative">
        <div className="w-full bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-yellow-300 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Trophy size={48} className="text-black" />
          </div>
          <h2 className="text-4xl font-black uppercase">
            {passed ? "Section Complete!" : "Section Failed"}
          </h2>
          
          <div className="text-2xl font-bold bg-zinc-100 px-6 py-4 border-4 border-black rounded-xl inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Total Overall Score: <span className="text-3xl text-emerald-600">{score || 0}</span> 
            {totalPossibleScore && <span className="text-zinc-400"> / {totalPossibleScore}</span>}
          </div>
          
          <p className="text-xl font-bold text-gray-600">{message}</p>
          
          <div className="flex gap-4 mt-6 w-full justify-center">
            {onNextSection ? (
              <button 
                onClick={onNextSection}
                disabled={!passed}
                className={`px-8 py-4 w-full max-w-sm border-4 border-black rounded-xl font-black text-xl transition-all flex items-center justify-center gap-2 ${
                  passed 
                    ? 'bg-emerald-400 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none' 
                    : 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-75' // Locked Button Style
                }`}
              >
                {passed ? "PROCEED TO NEXT SECTION" : "SCORE 50% TO PROCEED"} <ChevronRight size={24} strokeWidth={3} />
              </button>
            ) : (
              <button 
                onClick={onPrev}
                className="px-8 py-4 bg-zinc-200 border-4 border-black rounded-xl font-black text-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
              >
                <ChevronLeft size={24} strokeWidth={3} /> BACK TO CODE
              </button>
            )}
            
            <button 
              onClick={handleRetry}
              className="px-6 py-4 bg-sky-300 border-4 border-black rounded-xl font-black text-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
            >
              <RotateCcw size={24} strokeWidth={3} /> RETRY SECTION
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTION SCREEN ---
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in slide-in-from-right duration-500 pb-16 relative">
      
      <div className="flex justify-between items-end w-full pr-32">
        <h2 className="text-4xl font-black uppercase bg-purple-400 inline-block px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
          {title} - Quiz
        </h2>

      </div>

      <div className="w-full bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <h3 className="text-2xl font-bold mb-8 text-gray-800">{q.question}</h3>
        
        <div className="space-y-4 mb-8">
          {q.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = isSubmitted && isSelected && index === q.correct;
            const isWrong = isSubmitted && isSelected && index !== q.correct;

            let btnStyle = "bg-zinc-100 hover:bg-zinc-200 border-black text-gray-700";
            if (isSelected && !isSubmitted) btnStyle = "bg-sky-200 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1";
            if (isCorrect) btnStyle = "bg-green-400 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black";
            if (isWrong) btnStyle = "bg-red-400 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black";

            return (
              <button
                key={index}
                disabled={isSubmitted}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full p-4 border-4 rounded-xl font-bold text-lg text-left transition-all flex justify-between items-center ${btnStyle}`}
              >
                {option}
                {isCorrect && <CheckCircle2 size={24} />}
                {isWrong && <XCircle size={24} />}
              </button>
            );
          })}
        </div>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full py-4 bg-emerald-400 disabled:opacity-50 border-4 border-black rounded-xl font-black text-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all"
          >
            SUBMIT ANSWER
          </button>
        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
            <div className={`p-4 border-4 border-black rounded-xl font-bold text-lg text-center ${selectedAnswer === q.correct ? 'bg-green-200' : 'bg-red-200'}`}>
              {selectedAnswer === q.correct 
                ? (q.explanation || "Awesome job! You nailed it.") 
                : "Not quite right. Let's move on!"}
            </div>
            
            <button
              onClick={handleNext}
              className="w-full py-4 bg-yellow-300 border-4 border-black rounded-xl font-black text-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {isLastQuestion ? "FINISH QUIZ" : "NEXT QUESTION"} <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {!isFinished && (
        <div className="flex justify-start w-full pt-4">
          <button 
            onClick={onPrev}
            className="px-6 py-4 bg-zinc-200 border-4 border-black rounded-xl font-black text-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
          >
            <ChevronLeft size={24} strokeWidth={3} /> BACK TO CODE
          </button>
        </div>
      )}
    </div>
  );
}