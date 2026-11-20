import {useTour} from '../context/TourContext';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, ChevronRight, RotateCcw, BookOpen } from 'lucide-react';

export default function Quiz({ title, questions, onPrev, onNextSection }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const [correctness,setCorrectness]=useState({});
  const {completeSection}=useTour();
  const passed=Object.values(correctness).filter(Boolean).length >= Math.ceil((questions?.length || 0)/2);
  useEffect(()=>{
    if(isFinished && passed){
      const match=title.match(/^\d+/);
      completeSection(match ? match[0] : 'final');
    }
  },[isFinished,passed,title,completeSection]);

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
    
    setCorrectness(previous=>({...previous,[currentQuestionIndex]:selectedAnswer === q.correct}));
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
    setCorrectness({});
    // Route back to the terminal/snippet view
    if (onPrev) {
      onPrev();
    }
  };

  // --- FINISHED SCREEN ---
  if (isFinished) {
    const message=passed ? 'Review complete. The next section is available.' : 'Review the feedback, then try the section again.';
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in zoom-in duration-500 relative">
        <div className="w-full bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-yellow-300 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <BookOpen size={48} className="text-black" />
          </div>
          <h2 className="text-4xl font-black uppercase">
            {passed ? "Section Complete!" : "Review Needed"}
          </h2>
          
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
                {passed ? "PROCEED TO NEXT SECTION" : "REVIEW TO CONTINUE"} <ChevronRight size={24} strokeWidth={3} />
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