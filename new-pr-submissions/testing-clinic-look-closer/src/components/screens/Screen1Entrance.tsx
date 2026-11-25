import React, { useEffect, useState } from 'react';
import { DrMeera } from '../svg/Characters';
import { ClinicBench, PottedPlant } from '../svg/ClinicScenery';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';

const INK = '#24303C';

interface Screen1EntranceProps {
  opened: boolean;
  onOpened: () => void;
  onNext: () => void;
}

export const Screen1Entrance: React.FC<Screen1EntranceProps> = ({
  opened,
  onOpened,
  onNext,
}) => {
  const [doorsOpen, setDoorsOpen] = useState(opened);
  const [animateOpen] = useState(!opened);

  useEffect(() => {
    if (opened && doorsOpen) return;
    const timer = window.setTimeout(() => {
      setDoorsOpen(true);
      onOpened();
    }, 320);
    return () => window.clearTimeout(timer);
  }, [opened, doorsOpen, onOpened]);

  const handleStepInside = () => {
    onNext();
  };

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full">
      {/* Storybook Scene Canvas */}
      <div className="relative w-full max-w-[min(100%,calc(72dvh*16/9))] mx-auto aspect-[16/9] rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8] shadow-[0_6px_0_#24303C]">
        {/* Background Clinic Exterior SVG */}
        <svg
          viewBox="0 0 1000 562"
          className="absolute inset-0 w-full h-full object-cover select-none"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Pale blue sky */}
          <rect width="1000" height="562" fill="#A8D8E8" />

          {/* Soft picture-book clouds */}
          <g fill="#FFFDF7" fillOpacity="0.85">
            <path d="M90 88 C90 70 108 60 124 66 C132 52 156 50 168 64 C182 60 198 72 196 88 Z" />
            <path d="M775 74 C775 58 792 48 806 54 C816 40 842 40 852 54 C868 50 884 62 880 76 Z" />
          </g>

          {/* Teal Clinic Building Wall */}
          <rect
            x="95"
            y="84"
            width="810"
            height="346"
            rx="24"
            fill="#7FC4D6"
            stroke={INK}
            strokeWidth="5"
          />

          {/* Pale-blue upper facade band */}
          <path
            d="M95 108 C95 94 106 84 119 84 L881 84 C894 84 905 94 905 108 L905 160 L95 160 Z"
            fill="#A8D8E8"
            stroke={INK}
            strokeWidth="5"
          />

          {/* Clinic Windows flanking entrance */}
          <g transform="translate(148, 200)">
            <rect width="144" height="118" rx="18" fill="#FFFDF7" stroke={INK} strokeWidth="5" />
            <rect x="12" y="12" width="120" height="94" rx="11" fill="#D5F0F8" stroke={INK} strokeWidth="4" />
            <line x1="72" y1="12" x2="72" y2="106" stroke={INK} strokeWidth="4" />
            <line x1="12" y1="59" x2="132" y2="59" stroke={INK} strokeWidth="4" />
          </g>

          <g transform="translate(708, 200)">
            <rect width="144" height="118" rx="18" fill="#FFFDF7" stroke={INK} strokeWidth="5" />
            <rect x="12" y="12" width="120" height="94" rx="11" fill="#D5F0F8" stroke={INK} strokeWidth="4" />
            <line x1="72" y1="12" x2="72" y2="106" stroke={INK} strokeWidth="4" />
            <line x1="12" y1="59" x2="132" y2="59" stroke={INK} strokeWidth="4" />
          </g>

          {/* Coral-Red Sign above the doors */}
          <g transform="translate(290, 96)">
            <rect width="420" height="72" rx="18" fill="#D9544D" stroke={INK} strokeWidth="5" />
            {/* Friendly clinic cross emblem */}
            <circle cx="48" cy="36" r="19" fill="#FFFDF7" stroke={INK} strokeWidth="3.5" />
            <path d="M48 25 V47 M37 36 H59" stroke="#D9544D" strokeWidth="7" strokeLinecap="round" />
            <text
              x="236"
              y="45"
              textAnchor="middle"
              fill="#FFFDF7"
              fontFamily="Bricolage Grotesque, sans-serif"
              fontWeight="800"
              fontSize="29"
              letterSpacing="0.5"
            >
              DR. MEERA&apos;S CLINIC
            </text>
          </g>

          {/* Warm cream porch & clinic floor */}
          <rect y="424" width="1000" height="138" fill="#F5EFE0" />
          <line x1="0" y1="424" x2="1000" y2="424" stroke={INK} strokeWidth="5" />

          {/* Porch flagstones */}
          <g stroke="#E3D9C1" strokeWidth="3">
            <line x1="0" y1="472" x2="1000" y2="472" />
            <line x1="0" y1="518" x2="1000" y2="518" />
            <line x1="210" y1="424" x2="150" y2="562" />
            <line x1="790" y1="424" x2="850" y2="562" />
          </g>

          {/* Welcome Porch Step */}
          <rect
            x="332"
            y="424"
            width="336"
            height="28"
            rx="10"
            fill="#E8DFCA"
            stroke={INK}
            strokeWidth="4.5"
          />

          {/* Doorway Frame & Warm Interior Alcove */}
          <rect
            x="358"
            y="188"
            width="284"
            height="238"
            rx="16"
            fill="#FFFDF7"
            stroke={INK}
            strokeWidth="5"
          />
          <rect
            x="372"
            y="202"
            width="256"
            height="222"
            rx="10"
            fill="#F5EFE0"
            stroke={INK}
            strokeWidth="4"
          />
          {/* Peek of teal interior wall behind open doors */}
          <rect x="374" y="324" width="252" height="98" fill="#7FC4D6" fillOpacity="0.45" />

          {/* Coral-Red Benches flanking the entrance */}
          <ClinicBench x={122} y={356} width={164} />
          <ClinicBench x={714} y={356} width={164} />

          {/* Big Green Potted Plants */}
          <PottedPlant x={32} y={310} scale={1.06} />
          <PottedPlant x={862} y={310} scale={1.06} />
        </svg>

        {/* Dr. Meera stepping out of the open doorway */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-[14%] w-[21%] max-w-[185px] z-10 pointer-events-none ${
            doorsOpen ? (animateOpen ? 'animate-step-forward' : 'opacity-100') : 'opacity-0'
          }`}
        >
          <DrMeera mood="happy" waving className="w-full h-auto drop-shadow-sm" />
        </div>

        {/* Orange Wooden Double Doors Overlay aligned to SVG doorway (372..628 / 1000, 202..424 / 562) */}
        <div
          className="absolute z-20 pointer-events-none flex"
          style={{
            left: '37.2%',
            top: '35.9%',
            width: '25.6%',
            height: '39.6%',
          }}
        >
          {/* Left Orange Door */}
          <div
            className={`w-1/2 h-full bg-[#E8A33D] border-[3.5px] border-[#24303C] rounded-l-lg flex flex-col justify-between p-[8%] shadow-inner ${
              doorsOpen ? (animateOpen ? 'animate-door-left' : 'door-open-static-left') : ''
            }`}
          >
            <div className="w-full h-[38%] bg-[#D5F0F8] border-[3px] border-[#24303C] rounded-md" />
            <div className="flex justify-end items-center pr-1">
              <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#FFFDF7] border-2 border-[#24303C]" />
            </div>
            <div className="w-full h-[32%] bg-[#D48D28] border-[3px] border-[#24303C] rounded-md" />
          </div>

          {/* Right Orange Door */}
          <div
            className={`w-1/2 h-full bg-[#E8A33D] border-[3.5px] border-l-0 border-[#24303C] rounded-r-lg flex flex-col justify-between p-[8%] shadow-inner ${
              doorsOpen ? (animateOpen ? 'animate-door-right' : 'door-open-static-right') : ''
            }`}
          >
            <div className="w-full h-[38%] bg-[#D5F0F8] border-[3px] border-[#24303C] rounded-md" />
            <div className="flex justify-start items-center pl-1">
              <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#FFFDF7] border-2 border-[#24303C]" />
            </div>
            <div className="w-full h-[32%] bg-[#D48D28] border-[3px] border-[#24303C] rounded-md" />
          </div>
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          <ClinicButton variant="coral" onClick={handleStepInside}>
            Step Inside
          </ClinicButton>
        }
      >
        &ldquo;Welcome to my clinic! I&apos;m Dr. Meera. Today you&apos;ll be my helper, and first I want to see how sharp your intuition is.&rdquo;
      </DialogueBox>
    </div>
  );
};
