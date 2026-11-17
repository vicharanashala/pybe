import { useState, useEffect, useRef } from 'react';
import { LessonLayout } from '../LessonLayout';
import { CodeViewer } from '../CodeViewer';
import { SpellCanvas, SpellReference, SPELL_REFS } from './SpellCanvas';

type Creature = 'Boggart' | 'Dementor' | 'Pixie';

export function DefenseAgainstTheDarkArts({ onComplete, isLastLesson }: { onComplete: () => void, isLastLesson: boolean }) {
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [creature, setCreature] = useState<Creature>('Boggart');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const creatures: Creature[] = ['Boggart', 'Dementor', 'Pixie'];
    setCreature(creatures[Math.floor(Math.random() * creatures.length)]);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const code = [
    { text: 'if creature == "Boggart":', indent: 0 },
    { text: 'cast_spell("Riddikulus")', indent: 1 },
    { text: 'elif creature == "Dementor":', indent: 0 },
    { text: 'cast_spell("Expecto Patronum")', indent: 1 },
    { text: 'else:', indent: 0 },
    { text: 'cast_spell("Stupefy")', indent: 1 },
  ];

  const handleSpellCast = (spell: string) => {
    if (showSuccess) return;

    const expectedSpell = creature === 'Boggart' ? 'Riddikulus' : (creature === 'Dementor' ? 'Expecto Patronum' : 'Stupefy');
    
    if (spell === expectedSpell) {
      setShowSuccess(true);
    }
  };

  const handleRevealCode = () => {
    const runAnimation = () => {
      setActiveLines([0]);
      timeoutRef.current = window.setTimeout(() => {
        if (creature === 'Boggart') {
          setActiveLines([1]);
          timeoutRef.current = window.setTimeout(() => {
            setActiveLines([]);
            timeoutRef.current = window.setTimeout(runAnimation, 1500);
          }, 800);
        } else {
          setActiveLines([2]);
          timeoutRef.current = window.setTimeout(() => {
            if (creature === 'Dementor') {
              setActiveLines([3]);
              timeoutRef.current = window.setTimeout(() => {
                setActiveLines([]);
                timeoutRef.current = window.setTimeout(runAnimation, 1500);
              }, 800);
            } else {
              setActiveLines([4]);
              timeoutRef.current = window.setTimeout(() => {
                setActiveLines([5]);
                timeoutRef.current = window.setTimeout(() => {
                  setActiveLines([]);
                  timeoutRef.current = window.setTimeout(runAnimation, 1500);
                }, 800);
              }, 600);
            }
          }, 600);
        }
      }, 800);
    };
    runAnimation();
  };

  const conceptExplanation = (
    <p>
      The <code>elif</code> (else if) statement allows you to check multiple different conditions sequentially. The program evaluates each condition top-to-bottom. As soon as it finds one that is True, it runs that block of code and skips the rest. If none of the conditions are True, it falls back to the final <code>else</code> block.
    </p>
  );

  const interaction = (
    <div className="flex flex-col items-center">
      <div className="mb-6 px-6 py-3 bg-purple-100 border border-purple-300 rounded-full text-purple-800 font-bold tracking-wide shadow-sm">
        A wild {creature} appears!
      </div>

      <div className="flex gap-4 mb-6">
         <SpellReference spell="Riddikulus" hint={SPELL_REFS['Riddikulus'].hint} path={SPELL_REFS['Riddikulus'].path} />
         <SpellReference spell="Patronus" hint={SPELL_REFS['Expecto Patronum'].hint} path={SPELL_REFS['Expecto Patronum'].path} />
         <SpellReference spell="Stupefy" hint={SPELL_REFS['Stupefy'].hint} path={SPELL_REFS['Stupefy'].path} />
      </div>

      <SpellCanvas onSpellCast={handleSpellCast} disabled={showSuccess || activeLines.length > 0} />

      <div className="mt-6 text-stone-500 font-medium text-sm text-center">
         <p>Match the creature to its counter-spell using <code>elif</code> logic!</p>
         <p className="mt-1 opacity-75">Draw the correct shape on the canvas.</p>
      </div>
    </div>
  );

  return (
    <LessonLayout
      title="Defense Against the Dark Arts"
      narrative={<p>It's your first Defense Against the Dark Arts class. A magical creature has escaped! Sometimes you need to check more than two possibilities. Use <code>elif</code> (else if) to chain multiple conditions together before hitting a final <code>else</code>.</p>}
      instruction={
        <div className="space-y-2">
          <p>Read the creature type.</p>
          <ul className="list-disc pl-5">
            <li>If the creature is a <strong>Boggart</strong>, draw a <strong>zig-zag</strong> to cast Riddikulus.</li>
            <li>Else if (elif) it's a <strong>Dementor</strong>, draw a <strong>swirl or arc</strong> to cast Expecto Patronum.</li>
            <li>Else, draw a <strong>vertical line</strong> to cast Stupefy.</li>
          </ul>
        </div>
      }
      interactionArea={interaction}
      codeArea={<CodeViewer code={code} activeLineIndices={activeLines} />}
      showSuccess={showSuccess}
      successMessage={`Perfect! You navigated multiple conditions to select the exact right spell.`}
      onComplete={onComplete}
      isLastLesson={isLastLesson}
      onRevealCode={handleRevealCode}
      conceptExplanation={conceptExplanation}
    />
  );
}
