import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import krishnaGuide from "../../assets/illustrations/krishna-guide.png";
import type { Lesson } from "../../learning/lessons/types";

interface StoryConversationProps {
  lesson: Lesson;
  onComplete: () => void;
}

function KrishnaCard({ line }: { line: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold/60 shadow-lg">
        <img src={krishnaGuide} alt="Krishna" className="w-full h-full object-cover object-top" />
      </div>
      <p className="text-ink text-lg leading-relaxed font-display italic max-w-md">{line}</p>
    </div>
  );
}

function DialogueCard({ speaker, line, isKrishna }: { speaker: string; line: string; isKrishna: boolean }) {
  return (
    <div className={`flex flex-col ${isKrishna ? "items-end" : "items-start"} w-full max-w-lg mx-auto`}>
      <span
        className={`text-xs uppercase tracking-wider font-semibold mb-2 ${
          isKrishna ? "text-gold" : "text-vermilion"
        }`}
      >
        {speaker}
      </span>
      <div
        className={`glass-card rounded-2xl px-5 py-4 max-w-[85%] ${
          isKrishna ? "border-gold/30" : "border-vermilion/30"
        }`}
      >
        <p className="text-ink text-[15px] leading-relaxed">{line}</p>
      </div>
    </div>
  );
}

export default function StoryConversation({ lesson, onComplete }: StoryConversationProps) {
  const useDialogue = !!lesson.storyDialogue && lesson.storyDialogue.length > 0;
  const middleCards = useDialogue
    ? lesson.storyDialogue!
    : lesson.storyBody.split("\n\n").map((p) => p.trim());

  // step 0 = Krishna intro, 1..N = middle cards (dialogue or paragraphs), N+1 = Krishna outro
  const [step, setStep] = useState(0);
  const lastStep = middleCards.length + 1;

  function goNext() {
    if (step === lastStep) {
      onComplete();
      return;
    }
    setStep((s) => s + 1);
  }

  function goBack() {
    if (step === 0) return;
    setStep((s) => s - 1);
  }

  return (
    <div>
      <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 text-center font-semibold">
        The Story
      </p>
      <h2 className="text-2xl font-display font-bold text-ink mb-6 text-center text-gold-gradient">
        {lesson.storyTitle}
      </h2>

      <div className="flex justify-center gap-1.5 mb-6">
        {Array.from({ length: lastStep + 1 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? "w-6 bg-gold" : i < step ? "w-1.5 bg-gold/50" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>

      <div key={step} className="min-h-[160px] flex items-center justify-center animate-[fadeIn_0.35s_ease]">
        {step === 0 && <KrishnaCard line={lesson.storyIntroLine} />}

        {step > 0 && step <= middleCards.length && (
          <>
            {useDialogue ? (
              <DialogueCard
                speaker={(middleCards[step - 1] as { speaker: string; line: string }).speaker}
                line={(middleCards[step - 1] as { speaker: string; line: string }).line}
                isKrishna={(middleCards[step - 1] as { speaker: string; line: string }).speaker === "Krishna"}
              />
            ) : (
              <div className="glass-card rounded-2xl p-6 max-w-lg mx-auto">
                <p className="text-mutedSoft text-[15px] leading-relaxed">
                  {middleCards[step - 1] as string}
                </p>
              </div>
            )}
          </>
        )}

        {step === lastStep && <KrishnaCard line={lesson.storyOutroQuestion} />}
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-muted hover:text-ink px-5 py-2.5 rounded-full border border-line hover:border-gold/40 transition-all text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <button
          onClick={goNext}
          className="flex items-center gap-2 bg-gold text-bg font-bold px-7 py-2.5 rounded-full hover:opacity-90 transition-all text-sm shadow-lg"
        >
          {step === lastStep ? "Continue" : "Next"} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}