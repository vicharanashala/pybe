import React from 'react';

interface FlipCardProps {
  isFlipped: boolean;
  hasFlippedOnce: boolean;
  onToggle: () => void;
  frontBadgeLabel?: string;
  accentColor?: string;
  frontBody: React.ReactNode;
  frontCode: string;
  term: string;
  definition: string;
  footnote?: string;
  congratsLine: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  isFlipped,
  hasFlippedOnce,
  onToggle,
  frontBadgeLabel,
  accentColor,
  frontBody,
  frontCode,
  term,
  definition,
  footnote,
  congratsLine,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFlipped}
      className="btn-press-spring flip-perspective block w-[40vw] max-w-[510px] min-w-[260px] h-[44dvh] min-h-[290px] max-h-[370px] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8A33D] rounded-3xl group shrink-0"
    >
      <div className={`flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
        {/* FRONT FACE */}
        <div className="flip-face bg-[#FFFDF7] border-[4px] border-[#24303C] rounded-3xl shadow-[0_7px_0_#24303C] p-4 sm:p-5 flex flex-col justify-between gap-2.5 group-hover:-translate-y-0.5 transition-transform">
          {(frontBadgeLabel || hasFlippedOnce) && (
            <div className="flex items-center justify-between gap-2 shrink-0">
              {frontBadgeLabel ? (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border-2 border-[#24303C] text-[#24303C]"
                  style={{ backgroundColor: accentColor ?? '#FFE38E' }}
                >
                  {frontBadgeLabel}
                </span>
              ) : (
                <span />
              )}
              {hasFlippedOnce && (
                <span className="text-[11px] font-bold text-[#3E9A4D]">Flipped</span>
              )}
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center gap-2.5 min-h-0">
            <p className="text-xs sm:text-sm md:text-[15px] font-bold text-[#24303C] leading-snug">
              {frontBody}
            </p>

            <div className="bg-[#24303C] border-2 border-[#24303C] rounded-2xl px-3.5 py-2.5 text-[#F5EFE0]">
              <pre className="font-mono text-[11px] sm:text-xs leading-relaxed m-0 overflow-x-auto whitespace-pre-wrap break-words">
                <code>{frontCode}</code>
              </pre>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-1.5 border-t-2 border-[#24303C]/10 text-xs sm:text-sm font-display font-bold text-[#D9544D] shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" aria-hidden="true">
              <path
                d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"
                stroke="#D9544D"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Tap to flip</span>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="flip-face flip-face-back bg-[#F5EFE0] border-[4px] border-[#24303C] rounded-3xl shadow-[0_7px_0_#24303C] p-4 sm:p-5 flex flex-col justify-between gap-2.5">
          <div className="space-y-1 shrink-0">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#D9544D]">
              That&apos;s called:
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#24303C] leading-tight">
              {term}
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-2 min-h-0">
            <p className="bg-[#FFFDF7] border-2 border-[#24303C] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm md:text-[15px] font-bold text-[#24303C] leading-snug">
              {definition}
            </p>
            {footnote && (
              <p className="text-[11px] sm:text-xs font-semibold text-[#465A69] px-1">
                {footnote}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 shrink-0">
            <div className="flex-1 flex items-center gap-2 bg-[#3E9A4D] text-[#FFFDF7] border-2 border-[#24303C] rounded-xl px-3 py-1.5 text-xs sm:text-sm font-display font-bold">
              <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8" fill="#FFFDF7" />
                <path
                  d="M6.5 10.2 L9 12.7 L13.8 7.5"
                  stroke="#3E9A4D"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{congratsLine}</span>
            </div>
            <span className="text-[11px] font-bold text-[#465A69] shrink-0">
              Tap to flip back
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
