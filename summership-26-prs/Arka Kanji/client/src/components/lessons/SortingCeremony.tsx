import { useState, useEffect, useRef } from 'react';
import { LessonLayout } from '../LessonLayout';
import { CodeViewer } from '../CodeViewer';
import { Sparkles } from 'lucide-react';

export function SortingCeremony({ onComplete, isLastLesson }: { onComplete: () => void, isLastLesson: boolean }) {
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const code = [
    { text: 'trait = "' + (selectedTrait || '???') + '"', indent: 0 },
    { text: '', indent: 0 },
    { text: 'match trait:', indent: 0 },
    { text: 'case "Brave":', indent: 1 },
    { text: 'house = "Gryffindor"', indent: 2 },
    { text: 'case "Cunning":', indent: 1 },
    { text: 'house = "Slytherin"', indent: 2 },
    { text: 'case "Wise":', indent: 1 },
    { text: 'house = "Ravenclaw"', indent: 2 },
    { text: 'case "Loyal":', indent: 1 },
    { text: 'house = "Hufflepuff"', indent: 2 },
  ];

  const handleTraitSelect = (trait: string) => {
    if (showSuccess) return;
    setSelectedTrait(trait);
    setShowSuccess(true);
  };

  const handleRevealCode = () => {
    if (!selectedTrait) return;
    
    const runAnimation = () => {
      setActiveLines([0]);
      timeoutRef.current = window.setTimeout(() => {
        setActiveLines([2]);
        timeoutRef.current = window.setTimeout(() => {
          let caseLine = 3;
          let houseLine = 4;
          if (selectedTrait === 'Cunning') { caseLine = 5; houseLine = 6; }
          else if (selectedTrait === 'Wise') { caseLine = 7; houseLine = 8; }
          else if (selectedTrait === 'Loyal') { caseLine = 9; houseLine = 10; }
          
          setActiveLines([caseLine]);
          timeoutRef.current = window.setTimeout(() => {
            setActiveLines([houseLine]);
            timeoutRef.current = window.setTimeout(() => {
              setActiveLines([]);
              timeoutRef.current = window.setTimeout(runAnimation, 1500);
            }, 800);
          }, 600);
        }, 600);
      }, 600);
    };
    runAnimation();
  };

  const conceptExplanation = (
    <p>
      The <code>match / case</code> statement lets you compare a single variable (like <code>trait</code>) against multiple possible values cleanly. Instead of writing endless <code>if</code> and <code>elif</code> statements, you just define what to do in each specific <code>case</code>. It's like a magical sorting hat routing you to the right block of code instantly!
    </p>
  );

  const traits = [
    { name: 'Brave', color: 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100 shadow-sm', house: 'Gryffindor' },
    { name: 'Cunning', color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shadow-sm', house: 'Slytherin' },
    { name: 'Wise', color: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 shadow-sm', house: 'Ravenclaw' },
    { name: 'Loyal', color: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 shadow-sm', house: 'Hufflepuff' }
  ];

  const interaction = (
    <div className="grid grid-cols-2 gap-6 w-full max-w-md">
      {traits.map(t => (
        <button
          key={t.name}
          onClick={() => handleTraitSelect(t.name)}
          className={`w-full p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${t.color} ${selectedTrait === t.name ? 'ring-2 ring-amber-500 scale-105 shadow-md' : ''}`}
        >
          <Sparkles className="w-8 h-8" />
          <span className="font-bold text-lg">{t.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <LessonLayout
      title="The Sorting Ceremony"
      narrative={<p>You have arrived at Hogwarts and entered the Great Hall. It's time to be sorted into your house! The Sorting Hat must evaluate a single variable and match it against multiple possibilities.</p>}
      instruction={<p>Select your strongest personality trait to see how the <code>match/case</code> statement evaluates your input and determines your House.</p>}
      interactionArea={interaction}
      codeArea={<CodeViewer code={code} activeLineIndices={activeLines} />}
      showSuccess={showSuccess}
      successMessage={`The Hat has decided! You selected ${selectedTrait}, so you belong in ${traits.find(t => t.name === selectedTrait)?.house}!`}
      onComplete={onComplete}
      isLastLesson={isLastLesson}
      onRevealCode={handleRevealCode}
      conceptExplanation={conceptExplanation}
    />
  );
}
