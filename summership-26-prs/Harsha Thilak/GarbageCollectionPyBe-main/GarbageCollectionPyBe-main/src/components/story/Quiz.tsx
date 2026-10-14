import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type QuizOption = { text: string; correct?: boolean };

export function QuizCard({
  index,
  question,
  options,
  reason,
  visual,
}: {
  index: number;
  question: string;
  options: QuizOption[];
  reason: ReactNode;
  visual: ReactNode;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const isCorrect = answered && !!options[picked]?.correct;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
      <div className="scene-card p-6 sm:p-8">
        <span className="label-chip">Question {index} of 5</span>
        <h3 className="mt-4 text-2xl font-semibold">{question}</h3>
        <ul className="mt-6 grid gap-3">
          {options.map((o, i) => {
            const chosen = picked === i;
            const reveal = answered && o.correct;
            return (
              <li key={i}>
                <button
                  type="button"
                  disabled={answered}
                  onClick={() => setPicked(i)}
                  className={cn(
                    "w-full rounded-2xl border-2 border-border bg-paper px-4 py-3 text-left text-[0.95rem] transition-all",
                    !answered && "hover:-translate-y-0.5 hover:border-[var(--accent-strong)] hover:shadow-md",
                    reveal && "border-[var(--accent-strong)] bg-accent text-accent-foreground",
                    chosen && !o.correct && "border-[var(--danger)] bg-[oklch(0.93_0.05_26)] text-[var(--danger)]",
                    answered && !chosen && !o.correct && "opacity-55",
                  )}
                >
                  <span className="mr-2 font-mono text-xs opacity-60">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {o.text}
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div className="scene-enter mt-6 rounded-2xl border border-border bg-secondary/60 p-5">
            <p className="font-display text-lg font-semibold">
              {isCorrect ? "Exactly right." : "Not quite — here's the librarian's logic."}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason}</p>
          </div>
        )}
      </div>

      <div className="scene-card flex min-h-[320px] flex-col items-center justify-center gap-5 p-6 sm:p-8">
        <span className="label-chip">The scene again</span>
        {visual}
      </div>
    </div>
  );
}
