import React from 'react';

interface DialogueBoxProps {
  speaker?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  subdued?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker = 'Dr. Meera',
  children,
  actions,
  subdued = false,
}) => {
  return (
    <div
      className={`w-full shrink-0 rounded-2xl border-[3px] border-[#24303C] px-4 py-2.5 sm:px-6 sm:py-3.5 shadow-[0_4px_0_#24303C] transition-colors duration-200 ${
        subdued ? 'bg-[#EFE8D6]' : 'bg-[#FFFDF7]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {speaker && (
            <div className="text-xs font-bold uppercase tracking-wider text-[#D9544D] mb-0.5">
              {speaker}
            </div>
          )}
          <div className="text-[clamp(0.92rem,1.25vw,1.14rem)] leading-snug font-semibold text-[#24303C]">
            {children}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
