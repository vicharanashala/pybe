import React, { useEffect, useRef, useState } from 'react';
import { KIDS } from '../../types/story';
import { DrMeera } from '../svg/Characters';
import { KidHandsInspection, hasGermUnderLens } from '../svg/KidHandsInspection';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';

interface Screen5FlashbackProps {
  rewound: boolean;
  onRewound: () => void;
  germsRevealed: boolean;
  onGermsRevealed: () => void;
  onNext: () => void;
}

export const Screen5Flashback: React.FC<Screen5FlashbackProps> = ({
  rewound,
  onRewound,
  germsRevealed,
  onGermsRevealed,
  onNext,
}) => {
  const [rewinding, setRewinding] = useState(!rewound);
  const [lensPos, setLensPos] = useState(() =>
    germsRevealed ? { x: 202, y: 248 } : { x: 320, y: 148 }
  );
  const [fadingOut, setFadingOut] = useState(false);
  const fadeTimerRef = useRef<number | null>(null);

  const meena = KIDS.find((k) => k.id === 'meena')!;

  useEffect(() => {
    if (rewound) {
      setRewinding(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setRewinding(false);
      onRewound();
    }, 780);
    return () => window.clearTimeout(timer);
  }, [rewound, onRewound]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  const handleMagnifierMove = (x: number, y: number) => {
    setLensPos({ x, y });
    if (!germsRevealed && hasGermUnderLens(x, y)) {
      onGermsRevealed();
    }
  };

  const handleNext = () => {
    if (fadingOut) return;
    setFadingOut(true);
    fadeTimerRef.current = window.setTimeout(() => {
      onNext();
    }, 280);
  };

  return (
    <div
      className={`flex flex-col gap-[1.4dvh] w-full transition-opacity duration-300 ease-out ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Storybook Flashback Scene Canvas */}
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#7FC4D6] shadow-[0_6px_0_#24303C] flex flex-col justify-between p-3 sm:p-5">
        {/* Warm flashback background band */}
        <div
          className="absolute inset-x-0 top-0 h-[38%] bg-[#E8D9B8] border-b-[4px] border-[#24303C] pointer-events-none"
          aria-hidden="true"
        />

        {/* Soft sepia flashback vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            boxShadow: 'inset 0 0 60px rgba(36, 48, 60, 0.24)',
          }}
          aria-hidden="true"
        />

        {/* Rewind Flash Overlay */}
        {rewinding && (
          <div className="absolute inset-0 z-30 bg-[#F5EFE0]/90 flex flex-col items-center justify-center gap-2 animate-rewind-flash pointer-events-none">
            <div className="flex items-center gap-2 font-display font-extrabold text-2xl sm:text-3xl text-[#D9544D]">
              <svg viewBox="0 0 28 24" className="w-8 h-7" fill="none" aria-hidden="true">
                <path
                  d="M13 4 L3 12 L13 20 V4 Z M25 4 L15 12 L25 20 V4 Z"
                  fill="#D9544D"
                  stroke="#24303C"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Rewinding to Meena&apos;s hands...</span>
            </div>
          </div>
        )}

        {/* Top Header Row inside Canvas */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center bg-[#FFFDF7] border-[3px] border-[#24303C] rounded-2xl px-4 py-2 shadow-[0_3px_0_#24303C]">
            <span className="font-display font-bold text-base sm:text-xl text-[#24303C]">
              Flashback · Meena&apos;s Hands
            </span>
          </div>
        </div>

        {/* Main Stage: Frozen Hand + Draggable Magnifying Glass + Dr. Meera */}
        <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 gap-4 pt-1">
          <div className="flex-1 flex items-center justify-center h-full min-h-0">
            <KidHandsInspection
              kid={meena}
              magnifier={{
                x: lensPos.x,
                y: lensPos.y,
                active: !rewinding,
              }}
              pulseMagnifier={!rewinding && !germsRevealed}
              onMagnifierMove={handleMagnifierMove}
              className="aspect-[640/420] h-full w-auto max-w-full max-h-full"
            />
          </div>

          <div className="hidden md:flex flex-col items-center justify-end w-[15%] max-w-[145px] shrink-0 self-end">
            <DrMeera
              mood="serious"
              holdingMagnifier={false}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          germsRevealed ? (
            <ClinicButton variant="coral" disabled={fadingOut} onClick={handleNext}>
              Next
            </ClinicButton>
          ) : null
        }
      >
        {germsRevealed ? (
          <>&ldquo;Your eyes can&apos;t see this small. Looking wasn&apos;t enough. You have to look closer.&rdquo;</>
        ) : (
          <>&ldquo;Look at Meena&apos;s hands from a moment ago...&rdquo;</>
        )}
      </DialogueBox>
    </div>
  );
};
