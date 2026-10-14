import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { chapters } from "@/components/story/scenes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garbage Collection: The One Library Book" },
      {
        name: "description",
        content:
          "An illustrated, interactive story that teaches Python garbage collection — reference counting and reference cycles — through the Everwell Library.",
      },
      { property: "og:title", content: "Garbage Collection: The One Library Book" },
      {
        property: "og:description",
        content:
          "Learn Python reference counting and cyclic garbage collection through an interactive illustrated library story.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [step, setStep] = useState(0);
  const chapter = chapters[step] ?? chapters[0]!;
  const progress = ((step + 1) / chapters.length) * 100;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <span className="font-display text-lg font-semibold">
            <span className="text-[var(--accent-strong)]">Garbage Collection</span>
          </span>
          <span className="ml-auto text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Chapter {step + 1} / {chapters.length} — {chapter.nav}
          </span>
        </div>
        <div className="h-1 w-full bg-secondary">
          <div
            className="h-full bg-[var(--accent-strong)] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider transition-colors",
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "text-[var(--accent-strong)] hover:bg-secondary"
                    : "text-muted-foreground hover:bg-secondary",
              )}
            >
              {c.nav}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div key={chapter.id}>
          {chapter.render({
            onNext: () => setStep((s) => Math.min(chapters.length - 1, s + 1)),
          })}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-full border-2 border-border px-5 py-2 text-sm font-semibold disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="hidden text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:block">
            Story → Think → Answer → Reveal → Code
          </span>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(chapters.length - 1, s + 1))}
              disabled={step === chapters.length - 1}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
