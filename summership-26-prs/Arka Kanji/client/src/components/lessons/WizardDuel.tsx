import { useState, useEffect, useRef } from 'react';
import { LessonLayout } from '../LessonLayout';
import { CodeViewer } from '../CodeViewer';
import { SpellCanvas, SpellReference, SPELL_REFS } from './SpellCanvas';

export function WizardDuel({ onComplete, isLastLesson }: { onComplete: () => void, isLastLesson: boolean }) {
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [opponentAction, setOpponentAction] = useState<'attack' | 'distracted'>('attack');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setOpponentAction(Math.random() > 0.5 ? 'attack' : 'distracted');
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const code = [
    { text: 'if opponent_action == "attack":', indent: 0 },
    { text: 'cast_spell("Protego")', indent: 1 },
    { text: 'else:', indent: 0 },
    { text: 'cast_spell("Expelliarmus")', indent: 1 },
  ];

  const handleSpellCast = (spell: string) => {
    if (showSuccess) return;

    const expectedSpell = opponentAction === 'attack' ? 'Protego' : 'Expelliarmus';
    
    if (spell === expectedSpell) {
      setShowSuccess(true);
    }
  };

  const handleRevealCode = () => {
    const runAnimation = () => {
      setActiveLines([0]);
      timeoutRef.current = window.setTimeout(() => {
        if (opponentAction === 'attack') {
          setActiveLines([1]);
          timeoutRef.current = window.setTimeout(() => {
            setActiveLines([]);
            timeoutRef.current = window.setTimeout(runAnimation, 1500);
          }, 800);
        } else {
          setActiveLines([2]);
          timeoutRef.current = window.setTimeout(() => {
            setActiveLines([3]);
            timeoutRef.current = window.setTimeout(() => {
              setActiveLines([]);
              timeoutRef.current = window.setTimeout(runAnimation, 1500);
            }, 800);
          }, 600);
        }
      }, 800);
    };
    runAnimation();
  };

  const conceptExplanation = (
    <p>
      The <code>if / else</code> statement creates a simple two-way fork in the road. The program checks a condition (like "Is the opponent attacking?"). If it's True, the first block of code runs. If it's False, the <code>else</code> block runs instead. It ensures your program can react differently depending on the situation.
    </p>
  );

  const interaction = (
    <div className="flex flex-col items-center">
      <div className="mb-6 px-6 py-3 bg-red-100 border border-red-300 rounded-full text-red-800 font-bold tracking-wide shadow-sm">
        Opponent is {opponentAction === 'attack' ? 'attacking!' : 'distracted!'}
      </div>

      <div className="flex gap-8 mb-6">
         <SpellReference spell="Protego" hint={SPELL_REFS['Protego'].hint} path={SPELL_REFS['Protego'].path} />
         <SpellReference spell="Expelliarmus" hint={SPELL_REFS['Expelliarmus'].hint} path={SPELL_REFS['Expelliarmus'].path} />
      </div>

      <SpellCanvas onSpellCast={handleSpellCast} disabled={showSuccess || activeLines.length > 0} />

      <div className="mt-6 text-stone-500 font-medium text-sm text-center">
         <p>Draw the correct spell shape on the canvas!</p>
      </div>
    </div>
  );

  return (
    <LessonLayout
      title="The Train Duel"
      narrative={<p>While riding the Hogwarts Express, an arrogant older student challenges you to a duel in the corridor. You must react quickly. <code>if/else</code> statements allow your code to branch into exactly two paths based on a condition.</p>}
      instruction={
        <div className="space-y-2">
          <p>Read your opponent's move.</p>
          <ul className="list-disc pl-5">
            <li>If the opponent is <strong>attacking</strong>, draw a circle to cast <strong>Protego</strong>.</li>
            <li>Otherwise (else), draw a horizontal line to cast <strong>Expelliarmus</strong>.</li>
          </ul>
        </div>
      }
      interactionArea={interaction}
      codeArea={<CodeViewer code={code} activeLineIndices={activeLines} />}
      showSuccess={showSuccess}
      successMessage={`Brilliant! You checked the condition and executed the correct block of code.`}
      onComplete={onComplete}
      isLastLesson={isLastLesson}
      onRevealCode={handleRevealCode}
      conceptExplanation={conceptExplanation}
    />
  );
}
