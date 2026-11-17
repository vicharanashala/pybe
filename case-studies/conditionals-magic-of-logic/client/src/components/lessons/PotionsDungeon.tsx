import { useState, useEffect, useRef } from 'react';
import { LessonLayout } from '../LessonLayout';
import { CodeViewer } from '../CodeViewer';
import { FlaskConical, Flame, Snowflake } from 'lucide-react';

export function PotionsDungeon({ onComplete, isLastLesson }: { onComplete: () => void, isLastLesson: boolean }) {
  const [temperature, setTemperature] = useState(50);
  const [color, setColor] = useState<'Green' | 'Purple'>('Green');
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tempDirection, setTempDirection] = useState<'idle' | 'heating' | 'cooling'>('idle');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (showSuccess) return;
    const interval = setInterval(() => {
      setColor(c => c === 'Green' ? 'Purple' : 'Green');
    }, 3000);
    return () => clearInterval(interval);
  }, [showSuccess]);

  useEffect(() => {
    if (tempDirection === 'idle' || showSuccess) return;
    const interval = setInterval(() => {
      setTemperature(t => {
        const amount = tempDirection === 'heating' ? 1 : -1;
        const newT = t + amount;
        if (newT <= 0) {
          setTempDirection('idle');
          return 0;
        }
        if (newT >= 100) {
          setTempDirection('idle');
          return 100;
        }
        return newT;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [tempDirection, showSuccess]);

  const handleTempToggle = (dir: 'heating' | 'cooling') => {
    if (showSuccess || activeLines.length > 0) return;
    setFailed(false);
    
    if (tempDirection === dir) {
      setTempDirection('idle');
    } else {
      setTempDirection(dir);
    }
  };

  const code = [
    { text: 'if potion_color == "Purple":', indent: 0 },
    { text: 'if 80 <= temperature <= 90:', indent: 1 },
    { text: 'add_ingredient("Moonstone")', indent: 2 },
    { text: 'else:', indent: 1 },
    { text: 'trigger_explosion("Wrong temperature!")', indent: 2 },
    { text: 'else:', indent: 0 },
    { text: 'trigger_explosion("Wrong color!")', indent: 1 },
  ];

  const evaluate = () => {
    if (showSuccess) return;
    
    setTempDirection('idle');
    setFailed(false);

    if (color === 'Purple' && temperature >= 80 && temperature <= 90) {
      setShowSuccess(true);
    } else {
      setFailed(true);
    }
  };

  const handleRevealCode = () => {
    const runAnimation = () => {
      setActiveLines([0]);
      timeoutRef.current = window.setTimeout(() => {
        setActiveLines([1]);
        timeoutRef.current = window.setTimeout(() => {
          setActiveLines([2]);
          timeoutRef.current = window.setTimeout(() => {
            setActiveLines([]);
            timeoutRef.current = window.setTimeout(runAnimation, 1500);
          }, 1000);
        }, 800);
      }, 800);
    };
    runAnimation();
  };

  const conceptExplanation = (
    <p>
      Nested <code>if</code> statements happen when you put one <code>if</code> block inside another. The inner code only runs if <strong>both</strong> the outer condition and the inner condition are True. It's like a series of locked doors: you must pass the first check (the right color) before you can even attempt the second check (the right temperature).
    </p>
  );

  const interaction = (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-amber-200 shadow-sm">
        <h4 className="font-bold text-stone-900 text-lg mb-4">The Cauldron</h4>
        
        {/* Dynamic Cauldron Representation */}
        <div className={`relative w-40 h-40 bg-stone-800 rounded-full border-4 border-amber-900 flex items-end justify-center overflow-hidden mb-6 shadow-xl ${failed ? 'animate-bounce' : ''}`}>
          <div 
            className={`absolute bottom-0 w-full transition-colors duration-1000 ease-in-out ${color === 'Purple' ? 'bg-purple-500' : 'bg-green-500'}`}
            style={{ height: `${Math.max(20, temperature)}%` }}
          >
            {/* Bubbles */}
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] animate-[ping_2s_infinite]"></div>
          </div>
          {/* Cauldron Rim Highlight */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] pointer-events-none"></div>
        </div>

        <div className="w-full">
          <div className="flex justify-between text-sm text-stone-500 mb-4 font-mono font-bold">
            <span>0°</span>
            <span className={temperature >= 80 && temperature <= 90 ? 'text-emerald-600 font-bold text-base' : 'text-stone-800'}>{Math.round(temperature)}°</span>
            <span>100°</span>
          </div>
          
          <div className="flex gap-4 w-full">
            <button
              onClick={() => handleTempToggle('cooling')}
              className={`flex-1 py-3 border rounded-xl font-bold transition-colors flex items-center justify-center gap-2 select-none cursor-pointer ${
                tempDirection === 'cooling' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
              }`}
            >
              <Snowflake className="w-5 h-5" /> Cool
            </button>
            <button
              onClick={() => handleTempToggle('heating')}
              className={`flex-1 py-3 border rounded-xl font-bold transition-colors flex items-center justify-center gap-2 select-none cursor-pointer ${
                tempDirection === 'heating' 
                  ? 'bg-red-600 text-white border-red-600 shadow-md' 
                  : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
              }`}
            >
              <Flame className="w-5 h-5" /> Heat
            </button>
          </div>
        </div>
      </div>

      {failed && (
        <div className="text-red-600 text-center font-bold">
          The potion exploded! Adjust the conditions and try again.
        </div>
      )}

      <button
        onClick={evaluate}
        disabled={showSuccess || activeLines.length > 0}
        className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        <FlaskConical className="w-5 h-5" />
        Add Moonstone
      </button>
    </div>
  );

  return (
    <LessonLayout
      title="The Potions Dungeon"
      narrative={<p>Deep in the dungeons, you must brew a delicate potion. You have to check multiple conditions (color, then temperature) before adding the final ingredient to avoid an explosion. You can place one <code>if</code> statement inside another to check a sequence of conditions.</p>}
      instruction={<p>Keep the temperature in the sweet spot (80° to 90°) and click Add Moonstone ONLY when the potion changes to Purple.</p>}
      interactionArea={interaction}
      codeArea={<CodeViewer code={code} activeLineIndices={activeLines} />}
      showSuccess={showSuccess}
      successMessage={`Perfection! The outer condition (color == "Purple") and inner condition (80 <= temperature <= 90) both evaluated to True.`}
      onComplete={onComplete}
      isLastLesson={isLastLesson}
      onRevealCode={handleRevealCode}
      conceptExplanation={conceptExplanation}
    />
  );
}
