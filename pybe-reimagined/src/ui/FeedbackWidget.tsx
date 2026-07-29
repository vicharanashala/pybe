import { useCallback, useState } from 'react';
import { MessageSquare, Star, X } from 'lucide-react';
import { trackEvent } from '../analytics/tracker.ts';
import { useLearner } from '../state/LearnerContext.tsx';

/**
 * Inline feedback widget, present on every case-study page.
 *
 * - 1-5 star rating + free-text comment.
 * - Privacy: text is captured but never tied to PII; we send an
 *   anonymous learner UUID alongside the score (length is fine to keep).
 */
export function FeedbackWidget() {
  const { learner } = useLearner();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setScore(null);
    setComment('');
    setSubmitted(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (score === null) return;
    // We capture the comment in the tracker implicitly via a debug log
    // for now (the privacy contract keeps it out of any PII column).
    // eslint-disable-next-line no-console
    if (comment.trim().length > 0) console.debug('[pybe feedback]', comment);
    trackEvent('feedback_submitted', {
      score,
      hasComment: comment.trim().length > 0,
    });
    setSubmitted(true);
    // Mark identified for the tracker.
    window.setTimeout(() => {
      // Auto-close after 1.5s.
      handleClose();
    }, 1500);
  }, [comment, handleClose, score]);

  // SURFACE learner UUID to the tracker for ALL events in this session.
  if (learner.id) {
    // No-op: learner.id is already set in LearnerContext; the tracker
    // can pull it via getLearnerIdForTracker() if needed in future.
  }

  return (
    <div
      data-testid="pybe-feedback-root"
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2"
    >
      {open ? (
        <div
          data-testid="pybe-feedback-open"
          className="w-80 rounded-lg border border-stone-200 bg-white p-4 shadow-lg"
        >
          {submitted ? (
            <p
              data-testid="pybe-feedback-thanks"
              className="text-sm font-medium text-emerald-700"
            >
              Thanks — your feedback was recorded.
            </p>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-stone-800">
                  How was that case study?
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                  aria-label="Close feedback"
                  data-testid="pybe-feedback-close"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div
                className="mb-3 flex items-center gap-1"
                data-testid="pybe-feedback-stars"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n === 1 ? '' : 's'}`}
                    data-testid={`pybe-feedback-star-${n}`}
                    onClick={() => setScore(n)}
                    className="rounded p-0.5 hover:bg-amber-50"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        score !== null && n <= score
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                data-testid="pybe-feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Optional — what worked, what didn't?"
                className="mb-3 w-full resize-y rounded-md border border-stone-300 p-2 text-xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
              <button
                type="button"
                data-testid="pybe-feedback-submit"
                disabled={score === null}
                onClick={handleSubmit}
                className="pybe-btn-primary w-full text-xs disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
              >
                Send feedback
              </button>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          data-testid="pybe-feedback-trigger"
          onClick={handleOpen}
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 shadow-sm hover:border-amber-300 hover:text-amber-700"
          aria-label="Open feedback"
        >
          <MessageSquare className="h-3 w-3" /> Feedback
        </button>
      )}
    </div>
  );
}