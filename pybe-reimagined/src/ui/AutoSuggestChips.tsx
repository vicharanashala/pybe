import { Sparkles } from 'lucide-react';

interface Props {
  /** Constructs to suggest. These come from the case-study `constructHint`. */
  constructs: readonly string[];
  /** Called when the learner clicks a chip. The text is APPENDED to the textarea. */
  onInsert: (construct: string) => void;
}

/**
 * AutoSuggestChips — shown after the learner has stalled (30 s idle or
 * first submit click). INV-PB-9: NEVER pre-fills chips before the user has
 * started typing.
 *
 * Clicking a chip inserts the construct name into the ReasoningPanel's
 * textarea (it does NOT auto-submit).
 */
export function AutoSuggestChips({ constructs, onInsert }: Props) {
  if (constructs.length === 0) return null;

  return (
    <div
      data-testid="pybe-auto-suggest"
      className="mt-3 flex flex-wrap items-center gap-2"
    >
      <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500">
        <Sparkles className="h-3 w-3" /> Try one of these:
      </span>
      {constructs.map((c) => (
        <button
          key={c}
          type="button"
          data-testid={`pybe-auto-suggest-chip-${c}`}
          onClick={() => onInsert(c)}
          className="rounded-full border border-stone-300 bg-white px-3 py-1 font-mono text-xs text-stone-700 transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
        >
          {c}
        </button>
      ))}
    </div>
  );
}