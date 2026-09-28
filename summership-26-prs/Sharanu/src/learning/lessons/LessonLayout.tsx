import { useState } from "react";
import { ArrowRight, ArrowLeft, Eye } from "lucide-react";
import type { Lesson } from "./types";
import ProgressRail from "../../shared-components/layout/ProgressRail";
import CodeBlock from "../../shared-components/ui/CodeBlock";
import PredictBeforeReveal from "../../gadgets/predict-before-reveal/PredictBeforeReveal";
import CodeEditor from "../../gadgets/code-editor/CodeEditor";
import LessonChatbot from "../../gadgets/lesson-chat/LessonChatbot";
import StoryConversation from "../../gadgets/story-conversation/StoryConversation";

const BEATS = ["story", "pause", "concept", "example", "practice", "reflection"] as const;
type Beat = (typeof BEATS)[number];

interface LessonLayoutProps {
  lesson: Lesson;
  onComplete?: () => void;
  onBeatChange?: (beat: Beat, index: number) => void;
}

// Injects the dark-blue shining card style once. Same technique used on the
// welcome screen's card — scoped plain CSS so it doesn't need anything added
// to the Tailwind config.
function LessonCardStyles() {
  return (
    <style>{`
      @keyframes cardShine {
        0% { transform: translateX(-120%) skewX(-20deg); }
        100% { transform: translateX(220%) skewX(-20deg); }
      }
      .dark-blue-card {
        background: linear-gradient(135deg, #0a1128 0%, #131b3a 45%, #1e2f6b 100%);
      }
      .dark-blue-card .shine-sweep {
        position: absolute;
        top: 0;
        left: 0;
        width: 35%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.25), transparent);
        animation: cardShine 3.5s ease-in-out infinite;
        pointer-events: none;
      }
    `}</style>
  );
}

export default function LessonLayout({ lesson, onComplete, onBeatChange }: LessonLayoutProps) {
  const [beatIndex, setBeatIndex] = useState(0);
  const [nameRevealed, setNameRevealed] = useState(false);
  const beat = BEATS[beatIndex];
  const isFirst = beatIndex === 0;
  const isLast = beatIndex === BEATS.length - 1;

  function goNext() {
    if (isLast) {
      onComplete?.();
      return;
    }
    const next = beatIndex + 1;
    setBeatIndex(next);
    onBeatChange?.(BEATS[next], next);
  }

  function goBack() {
    if (isFirst) return;
    const prev = beatIndex - 1;
    setBeatIndex(prev);
    onBeatChange?.(BEATS[prev], prev);
  }

  const runnableExample = lesson.codeExamples.find((ex) =>
    ex.label.toLowerCase().includes("handled") || ex.label.toLowerCase().includes("correct")
  ) ?? lesson.codeExamples[lesson.codeExamples.length - 1];

  return (
    <div className="max-w-2xl mx-auto w-full">
      <LessonCardStyles />
      <div className="mb-8 animate-slide-right">
        <ProgressRail total={BEATS.length} current={beatIndex} labels={[...BEATS]} />
      </div>

      <div
        key={beat}
        className="dark-blue-card rounded-3xl p-6 sm:p-10 animate-[fadeIn_0.4s_ease] min-h-[340px] shadow-[0_0_40px_rgba(30,58,138,0.5)] border border-blue-400/30 relative overflow-hidden"
      >
        <div className="shine-sweep" />

        {beat === "story" && <StoryConversation lesson={lesson} onComplete={goNext} />}

        {beat === "pause" && (
          <div className="space-y-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6 text-center font-semibold animate-slide-right delay-1">
              The Pause
            </p>
            {lesson.pauseChoices && lesson.pauseCorrectChoice !== undefined ? (
              <div className="animate-slide-right delay-2">
                <PredictBeforeReveal
                  question={lesson.pauseQuestion}
                  choices={lesson.pauseChoices}
                  correctChoice={lesson.pauseCorrectChoice}
                />
              </div>
            ) : (
              <p className="text-ink text-lg text-center font-display animate-slide-right delay-2">
                {lesson.pauseQuestion}
              </p>
            )}
          </div>
        )}

        {beat === "concept" && (
          <div className="space-y-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 text-center font-semibold animate-slide-right delay-1">
              The Concept, Named
            </p>

            {!nameRevealed ? (
              <div className="text-center animate-slide-right delay-2 py-6">
                <p className="text-mutedSoft text-[15px] leading-relaxed mb-6 max-w-md mx-auto">
                  Match what you just read to a real Python problem — take a guess before we tell you what
                  it's actually called.
                </p>
                <button
                  onClick={() => setNameRevealed(true)}
                  className="inline-flex items-center gap-2 bg-gold/15 hover:bg-gold/25 text-gold border border-gold/40 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
                >
                  <Eye size={16} /> Reveal the name
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-display font-bold text-ink mb-5 text-center text-gold-gradient animate-slide-right delay-2">
                  {lesson.title}
                </h2>
                <div className="bg-panel/60 border border-gold/20 rounded-2xl p-5 shadow-md animate-slide-right delay-3">
                  <p className="text-mutedSoft text-[15px] leading-relaxed whitespace-pre-line">
                    {lesson.conceptExplainer}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {beat === "example" && (
          <div className="space-y-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 text-center font-semibold animate-slide-right delay-1">
              See It Break, See It Handled
            </p>
            <div className="flex flex-col gap-4 mb-6">
              {lesson.codeExamples.map((ex, i) => (
                <div key={i} className={`animate-slide-right ${i === 0 ? "delay-2" : "delay-3"}`}>
                  <CodeBlock
                    label={ex.label}
                    code={ex.code}
                    tone={ex.label.toLowerCase().includes("unhandled") ? "danger" : "success"}
                  />
                </div>
              ))}
            </div>
            {runnableExample && (
              <div className="animate-slide-right delay-4">
                <CodeEditor
                  initialCode={runnableExample.code}
                  label="Try it yourself — edit the code and run it for real"
                />
              </div>
            )}
          </div>
        )}

        {beat === "practice" && (
          <div className="space-y-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 text-center font-semibold animate-slide-right delay-1">
              Practice Ladder
            </p>
            <div className="flex flex-col gap-6">
              {lesson.practiceLadder.map((item, i) => (
                <div
                  key={i}
                  className={`glass-card rounded-2xl p-5 border border-gold/20 shadow-md animate-slide-right ${
                    i === 0 ? "delay-2" : i === 1 ? "delay-3" : "delay-4"
                  }`}
                >
                  <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-gold bg-gold/10 border border-gold/30 px-2.5 py-0.5 rounded-full mb-3">
                    Stage: {item.stage}
                  </span>
                  <p className="text-ink text-sm font-semibold mb-3 leading-relaxed">{item.prompt}</p>
                  {item.starterCode && (
                    <CodeEditor initialCode={item.starterCode} label="Run it and see what happens" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {beat === "reflection" && (
          <div className="space-y-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 text-center font-semibold animate-slide-right delay-1">
              Reflection
            </p>
            <p className="text-ink text-[15px] leading-relaxed text-center mb-6 animate-slide-right delay-2 font-display">
              {lesson.reflectionPrompt}
            </p>
            <div className="animate-slide-right delay-3">
              <LessonChatbot lesson={lesson} />
            </div>
          </div>
        )}
      </div>

      {/* Footer Beat Navigation */}
      <div className="flex justify-between items-center gap-3 mt-8">
        {!isFirst ? (
          <button
            onClick={goBack}
            className="flex items-center gap-2 bg-panel/80 hover:bg-gold/15 text-mutedSoft hover:text-ink px-5 py-2.5 rounded-full border border-line hover:border-gold/40 transition-all text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Previous Beat
          </button>
        ) : <div />}
        {beat !== "story" && (
          <button
            onClick={goNext}
            className="flex items-center gap-2 bg-gold text-bg font-bold px-7 py-3 rounded-full hover:opacity-90 transition-all text-sm shadow-lg hover:scale-[1.02]"
          >
            {isLast ? "Finish Lesson" : "Continue"} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}