import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import CaseClosedReveal from './CaseClosedReveal';

export default function CodeModal({ part, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!part) return null;

  // Find the code reveal slide for this part
  const revealSlide = part.slides?.find((s) => s.isCodeReveal || s.kind === 'code-reveal') || {
    id: `${part._id}-closed`,
    kind: 'code-reveal',
    isCodeReveal: true,
    title: 'Case file closed',
    storyRecap: part.prompt,
    conceptName: part.concepts?.[0] || 'Python deduction',
    analogy: 'Like testing keys in a lock to find the single match.',
    code: part.idealSolution
  };

  return (
    <div className="code-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="code-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Code reveal for ${part.partLabel || part.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="code-modal-close-btn"
          onClick={onClose}
          aria-label="Close code reveal"
        >
          <X size={20} />
        </button>
        <CaseClosedReveal
          slide={revealSlide}
          scenario={part}
          isModal={true}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
