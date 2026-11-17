import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Badge } from '../../shared-components/Badge';
import type { QuizQuestion, QuestionType } from '../types';
import { 
  Award, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ArrowRight, 
  Code2, 
  Zap,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const SETS_TEST_QUESTIONS: QuizQuestion[] = [
  // --- PREDICT THE OUTPUT (EASY - MEDIUM) ---
  {
    id: 'test-predict-1',
    type: 'predict',
    question: '1. Predict the Output: What will len(gadgets) print after these operations?',
    codeSnippet: `gadgets = {"Anywhere Door", "Bamboo Copter", "Bamboo Copter"}\ngadgets.add("Small Light")\ngadgets.add("Anywhere Door")\nprint(len(gadgets))`,
    options: [
      'A) 5',
      'B) 3',
      'C) 2',
      'D) TypeError: duplicate keys'
    ],
    correctOptionIndex: 1,
    explanation: 'Initial set contains {"Anywhere Door", "Bamboo Copter"} (duplicates removed). Adding "Small Light" makes it 3 items. Re-adding "Anywhere Door" is ignored because Sets only hold unique elements!',
    whyReasoning: `Step 1: When the Set is created, duplicate values are automatically removed. {"Anywhere Door", "Bamboo Copter", "Bamboo Copter"} becomes {"Anywhere Door", "Bamboo Copter"} (length = 2).\nStep 2: .add("Small Light") inserts a new unique gadget -> {"Anywhere Door", "Bamboo Copter", "Small Light"} (length = 3).\nStep 3: .add("Anywhere Door") attempts to re-insert an item already in the Set. The Set ignores it silently.\nFinal length is 3.`
  },
  {
    id: 'test-predict-2',
    type: 'predict',
    question: '2. Predict the Output: What is the result of set intersection (&)?',
    codeSnippet: `nobita_stamps = {"T-Rex", "Triceratops", "Brachiosaurus"}\nsuneo_stamps = {"Pterodactyl", "T-Rex", "Triceratops"}\n\ncommon = nobita_stamps & suneo_stamps\nprint(sorted(list(common)))`,
    options: [
      "A) ['Brachiosaurus', 'Pterodactyl']",
      "B) ['T-Rex', 'Triceratops']",
      "C) ['T-Rex', 'Triceratops', 'Brachiosaurus', 'Pterodactyl']",
      "D) []"
    ],
    correctOptionIndex: 1,
    explanation: 'The intersection operator (&) keeps items present in BOTH sets. Both Nobita and Suneo have "T-Rex" and "Triceratops".',
    whyReasoning: `The & operator performs set INTERSECTION — keeping ONLY items that exist in BOTH sets.\n• "T-Rex" exists in both Nobita & Suneo -> kept\n• "Triceratops" exists in both -> kept\n• "Brachiosaurus" is only in Nobita's set -> excluded\n• "Pterodactyl" is only in Suneo's set -> excluded\nResult set {"T-Rex", "Triceratops"} sorted alphabetically returns ['T-Rex', 'Triceratops'].`
  },

  // --- TRUE / FALSE (EASY - MEDIUM) ---
  {
    id: 'test-tf-1',
    type: 'true_false',
    question: '3. True or False: Python Sets allow element indexing, so my_set[0] retrieves the first element.',
    options: [
      'A) True — Sets behave like Lists with 0-based indexing',
      'B) False — Sets are unordered and non-indexable; my_set[0] raises TypeError'
    ],
    correctOptionIndex: 1,
    explanation: 'False! Sets have no guaranteed order or positional indices. Attempting to index a set like `my_set[0]` throws `TypeError: "set" object is not subscriptable`.',
    whyReasoning: `Sets in Python are UNORDERED and backed by Hash Tables. Because elements do not have fixed positional indices (like index 0, 1, 2 in a list), Python does not support bracket indexing. Writing my_set[0] immediately raises TypeError: 'set' object is not subscriptable.`
  },
  {
    id: 'test-tf-2',
    type: 'true_false',
    question: '4. True or False: Calling .discard("missing_item") on a Set raises a KeyError crash.',
    options: [
      'A) True — Both .remove() and .discard() crash on missing items',
      'B) False — .discard() safely ignores missing items without raising an error'
    ],
    correctOptionIndex: 1,
    explanation: 'False! Unlike `.remove()` which raises `KeyError`, `.discard()` safely ignores items if they are not in the set.',
    whyReasoning: `Python provides two deletion methods for Sets with distinct safety behaviors:\n1. .remove(x) -> throws a KeyError crash if x is missing.\n2. .discard(x) -> removes x if present, or DOES NOTHING silently if missing.\nBecause .discard() is crash-safe, calling it on a missing item returns normally.`
  },

  // --- MULTIPLE CHOICE QUESTIONS (MCQs) (EASY - MEDIUM) ---
  {
    id: 'test-mcq-1',
    type: 'mcq',
    question: '5. MCQ: How do you instantiate a truly EMPTY Set in Python?',
    options: [
      'A) s = {}',
      'B) s = set()',
      'C) s = []',
      'D) s = set({})'
    ],
    correctOptionIndex: 1,
    explanation: 'Using empty braces `{}` initializes an empty Dictionary (`dict`). To create an empty Set, you must call `set()`.',
    whyReasoning: `In Python syntax, empty curly braces {} were historically assigned to Dictionaries (dict). Writing s = {} creates an empty dictionary. To create a Set with 0 elements, you MUST use the set() constructor.`
  },
  {
    id: 'test-mcq-2',
    type: 'mcq',
    question: '6. MCQ: Why is checking "item in set_data" O(1) time complexity compared to O(N) for lists?',
    options: [
      'A) Sets automatically keep items sorted alphabetically',
      'B) Sets use Hash Tables to jump directly to memory locations',
      'C) Sets use binary search trees internally',
      'D) Sets compress strings into integers'
    ],
    correctOptionIndex: 1,
    explanation: 'Sets use Hash Tables. When looking up an item, Python calculates its hash value and jumps straight to its slot in O(1) constant average time!',
    whyReasoning: `Lists store elements sequentially in memory, so checking 'x in list' requires checking every element from beginning to end in O(N) linear time.\nSets use a HASH TABLE: Python computes the hash key of 'x' and jumps directly to its bucket address in O(1) constant time, making lookups instant regardless of dataset size!`
  }
];

interface TestPageProps {
  questions?: QuizQuestion[];
  onProceedToCoding?: () => void;
}

export const TestPage: React.FC<TestPageProps> = ({
  questions = SETS_TEST_QUESTIONS,
  onProceedToCoding
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showWhy, setShowWhy] = useState<Record<number, boolean>>({});
  const [shake, setShake] = useState<boolean>(false);

  const currentQ = questions[currentIndex] || questions[0];
  const selectedOption = userAnswers[currentIndex];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && selectedOption === currentQ.correctOptionIndex;
  const isWhyOpen = showWhy[currentIndex] ?? true; // Open by default when answered

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: index }));
    setShowWhy(prev => ({ ...prev, [currentIndex]: true })); // Auto-expand "Why?" on answer
    
    if (index !== currentQ.correctOptionIndex) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const toggleWhy = () => {
    setShowWhy(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(
    ([idx, ans]) => ans === questions[+idx].correctOptionIndex
  ).length;

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getTypeBadge = (type?: QuestionType) => {
    switch (type) {
      case 'predict':
        return { label: 'Predict Output', icon: Terminal, color: '#008cff', bg: 'rgba(0,140,255,0.1)' };
      case 'true_false':
        return { label: 'True / False', icon: Zap, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
      case 'mcq':
      default:
        return { label: 'Multiple Choice', icon: Code2, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' };
    }
  };

  const typeInfo = getTypeBadge(currentQ.type);
  const TypeIcon = typeInfo.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Test Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} style={{ color: '#ec4899' }} />
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#ec4899', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            PYTHON SETS KNOWLEDGE TEST
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="warning">
            Difficulty: Easy-Medium
          </Badge>
          <Badge variant="primary">
            Score: {correctCount}/{answeredCount}
          </Badge>
        </div>
      </div>

      {/* Question Stepper Indicator Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {questions.map((q, idx) => {
          const ans = userAnswers[idx];
          const isCurrent = idx === currentIndex;
          const isRight = ans !== undefined && ans === q.correctOptionIndex;
          const isWrong = ans !== undefined && ans !== q.correctOptionIndex;

          let bg = 'white';
          let border = '1px solid rgba(0,0,0,0.1)';
          let color = '#64748b';

          if (isRight) { bg = 'rgba(34,197,94,0.1)'; border = '1.5px solid #22c55e'; color = '#15803d'; }
          else if (isWrong) { bg = 'rgba(239,68,68,0.08)'; border = '1.5px solid #ef4444'; color = '#b91c1c'; }
          else if (isCurrent) { bg = 'rgba(0,140,255,0.08)'; border = '2px solid #008cff'; color = '#0369a1'; }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                padding: '6px 12px', borderRadius: '8px',
                background: bg, border, color,
                fontSize: '11px', fontWeight: isCurrent ? 800 : 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                whiteSpace: 'nowrap', transition: 'all 0.15s ease'
              }}
            >
              <span>Q{idx + 1}</span>
              {isRight && <CheckCircle2 size={12} style={{ color: '#22c55e' }} />}
              {isWrong && <XCircle size={12} style={{ color: '#ef4444' }} />}
            </button>
          );
        })}
      </div>

      {/* Question Container Card */}
      <GlassCard style={{ padding: '28px', background: 'white', border: '1.5px solid rgba(0, 140, 255, 0.18)', borderRadius: '20px' }}>
        
        {/* Type Badge & Q Number */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '8px',
            background: typeInfo.bg, color: typeInfo.color,
            fontSize: '11px', fontWeight: 800, textTransform: 'uppercase'
          }}>
            <TypeIcon size={14} />
            <span>{typeInfo.label}</span>
          </div>

          <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Question Text */}
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', lineHeight: 1.5, margin: '0 0 16px' }}>
          {currentQ.question}
        </h3>

        {/* Code Snippet Box for Predict Output Questions */}
        {currentQ.codeSnippet && (
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0, 140, 255, 0.2)', marginBottom: '20px' }}>
            <div style={{ padding: '6px 14px', background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
              <Terminal size={13} />
              <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>PYTHON CODE SNIPPET</span>
            </div>
            <pre style={{
              margin: 0, padding: '16px 18px',
              background: '#091124', color: '#f1f5f9',
              fontFamily: 'var(--font-mono)', fontSize: '13px',
              lineHeight: 1.6, overflowX: 'auto'
            }}>
              <code>{currentQ.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Options List */}
        <div 
          className={shake ? 'animate-shake' : ''}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}
        >
          {currentQ.options.map((option, optIdx) => {
            const isOptionSelected = selectedOption === optIdx;
            const isOptionCorrect = optIdx === currentQ.correctOptionIndex;

            let bg = 'white';
            let border = '1px solid rgba(0, 0, 0, 0.08)';
            let color = '#334155';

            if (isAnswered) {
              if (isOptionSelected) {
                if (isOptionCorrect) {
                  bg = 'rgba(34, 197, 94, 0.08)';
                  border = '1.5px solid #22c55e';
                  color = '#15803d';
                } else {
                  bg = 'rgba(239, 68, 68, 0.06)';
                  border = '1.5px solid #ef4444';
                  color = '#b91c1c';
                }
              } else if (isOptionCorrect) {
                bg = 'rgba(34, 197, 94, 0.04)';
                border = '1.5px dashed #22c55e';
                color = '#15803d';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                style={{
                  textAlign: 'left', padding: '14px 18px', borderRadius: '12px',
                  background: bg, border, color,
                  fontSize: '13px', fontWeight: isOptionSelected ? 700 : 500,
                  cursor: isAnswered ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  background: isOptionSelected 
                    ? (isOptionCorrect ? '#22c55e' : '#ef4444') 
                    : isAnswered && isOptionCorrect ? '#22c55e' : 'rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: 'white', fontWeight: 900
                }}>
                  {isAnswered && isOptionSelected ? (isOptionCorrect ? '✓' : '✗') : isAnswered && isOptionCorrect ? '✓' : String.fromCharCode(65 + optIdx)}
                </div>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Answer Feedback & "Why?" Reasoning Card */}
        {isAnswered && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '12px',
            marginBottom: '20px'
          }} className="animate-fade-in">
            
            {/* Status Bar + "Why?" Button */}
            <div style={{
              padding: '14px 18px', borderRadius: '12px',
              background: isCorrect ? 'rgba(34, 197, 94, 0.06)' : 'rgba(239, 68, 68, 0.05)',
              border: `1.5px solid ${isCorrect ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.25)'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              gap: '12px', flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isCorrect ? '#15803d' : '#b91c1c', fontWeight: 800, fontSize: '13px' }}>
                {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <span>{isCorrect ? '✅ Correct Answer!' : '❌ Incorrect Choice'}</span>
              </div>

              {/* Interactive "Why?" Button */}
              <button
                onClick={toggleWhy}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: '8px',
                  background: isWhyOpen ? 'rgba(245, 158, 11, 0.15)' : 'white',
                  border: '1.5px solid #f59e0b',
                  color: '#b45309', fontWeight: 800, fontSize: '12px',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.15)'
                }}
              >
                <Lightbulb size={14} style={{ color: '#d97706' }} />
                <span>{isWhyOpen ? 'Hide Why?' : 'Why?'}</span>
              </button>
            </div>

            {/* Expandable "Why?" Step-by-Step Reasoning Breakdown */}
            {isWhyOpen && (
              <div style={{
                padding: '18px 20px', borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.2) 0%, rgba(255, 255, 255, 0.95) 100%)',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.06)'
              }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 900, fontSize: '13px', marginBottom: '8px' }}>
                  <HelpCircle size={16} />
                  <span>Why is this the answer?</span>
                </div>

                <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line', fontWeight: 500 }}>
                  {currentQ.whyReasoning || currentQ.explanation}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Question Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              background: 'none', border: '1px solid rgba(0,0,0,0.1)',
              color: '#64748b', fontWeight: 700, fontSize: '12px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === 0 ? 0.4 : 1
            }}
          >
            ← Previous Question
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Next Question</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={onProceedToCoding}
              className="btn btn-yellow"
              style={{
                padding: '10px 22px', borderRadius: '10px',
                fontSize: '13px', fontWeight: 900,
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none', color: 'white', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
              }}
            >
              <span>Proceed to Coding Challenge</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

      </GlassCard>

    </div>
  );
};

export default TestPage;
