import { useState } from "react";
import { Star, Check } from "lucide-react";

const STORAGE_KEY = "codegita:feedback";

interface FeedbackEntry {
  rating: number;
  comment: string;
  submittedAt: string;
}

function saveFeedback(slug: string, entry: FeedbackEntry) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[slug] = entry;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable — feedback just won't persist, not worth blocking the UI over
  }
}

export default function LessonFeedback({ lessonSlug }: { lessonSlug: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (rating === 0) return;
    saveFeedback(lessonSlug, { rating, comment, submittedAt: new Date().toISOString() });
    // TODO: also POST this to a backend once one exists, so feedback isn't only local to this browser
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="glass-card rounded-2xl p-5 flex items-center gap-2 text-[#7FBF9E] text-sm">
        <Check size={16} /> Thanks — your feedback on this lesson was recorded.
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="text-ink text-sm font-semibold font-display mb-3">How was this lesson?</p>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${n} out of 5`}
          >
            <Star
              size={22}
              className={
                n <= (hoverRating || rating)
                  ? "fill-gold text-gold"
                  : "text-muted"
              }
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Anything that was confusing, or that clicked well? (optional)"
        className="w-full bg-panel/60 border border-line rounded-xl p-3 text-ink text-sm min-h-[80px] mb-3 focus:outline-none focus:border-gold"
      />
      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="bg-gold text-bg text-xs font-semibold px-4 py-2 rounded-full disabled:opacity-40 transition-opacity"
      >
        Submit feedback
      </button>
    </div>
  );
}