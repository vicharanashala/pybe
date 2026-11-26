import React from 'react';
import { KidProfile } from '../../types/story';
import { DrMeera, KidCharacter } from './Characters';
import { PottedPlant, SinkUnit } from './ClinicScenery';

const INK = '#24303C';

interface SingleSinkStationProps {
  timerText?: string;
  highlightTimer?: boolean;
  boardText?: string;
  shouldSayText?: string;
  showMatchTick?: boolean;
  drMeeraMood?: 'happy' | 'curious' | 'serious';
  activeKid?: {
    kid: KidProfile;
    pose?: 'standing' | 'hands-up';
  };
  showRulesChart?: boolean;
}

export const SingleSinkStation: React.FC<SingleSinkStationProps> = ({
  timerText = '00s',
  highlightTimer = false,
  boardText = '',
  shouldSayText,
  showMatchTick = false,
  drMeeraMood = 'happy',
  activeKid,
  showRulesChart = true,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#A8D8E8]">
      <svg
        viewBox="0 0 1000 520"
        className="w-full h-full object-contain select-none"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pale-blue upper wall */}
        <rect width="1000" height="360" fill="#A8D8E8" />
        <rect x="0" y="0" width="1000" height="34" fill="#7FC4D6" />
        <line x1="0" y1="34" x2="1000" y2="34" stroke={INK} strokeWidth="4" />

        {/* Teal tiled backsplash */}
        <rect y="196" width="1000" height="164" fill="#7FC4D6" />
        <line x1="0" y1="196" x2="1000" y2="196" stroke={INK} strokeWidth="4" />
        <g stroke="#64AEC2" strokeWidth="2.5">
          <line x1="0" y1="250" x2="1000" y2="250" />
          <line x1="0" y1="304" x2="1000" y2="304" />
          <line x1="125" y1="196" x2="125" y2="360" />
          <line x1="250" y1="196" x2="250" y2="360" />
          <line x1="375" y1="196" x2="375" y2="360" />
          <line x1="500" y1="196" x2="500" y2="360" />
          <line x1="625" y1="196" x2="625" y2="360" />
          <line x1="750" y1="196" x2="750" y2="360" />
          <line x1="875" y1="196" x2="875" y2="360" />
        </g>

        {/* Cream tiled clinic floor */}
        <rect y="360" width="1000" height="160" fill="#F5EFE0" />
        <line x1="0" y1="360" x2="1000" y2="360" stroke={INK} strokeWidth="4" />
        <g stroke="#E3D9C1" strokeWidth="3">
          <line x1="0" y1="414" x2="1000" y2="414" />
          <line x1="0" y1="472" x2="1000" y2="472" />
          <line x1="200" y1="360" x2="140" y2="520" />
          <line x1="500" y1="360" x2="500" y2="520" />
          <line x1="800" y1="360" x2="860" y2="520" />
        </g>

        {/* Display Board directly above the central sink (empty until a kid is checked) */}
        <g transform="translate(378, 52)">
          {/* Hanging bracket */}
          <line x1="48" y1="-18" x2="48" y2="0" stroke={INK} strokeWidth="4" />
          <line x1="166" y1="-18" x2="166" y2="0" stroke={INK} strokeWidth="4" />
          <rect
            width="214"
            height="76"
            rx="14"
            fill="#FFFDF7"
            stroke={INK}
            strokeWidth="4.5"
          />
          <rect
            x="8"
            y="8"
            width="198"
            height="60"
            rx="9"
            fill={boardText ? '#24303C' : '#E8E2D0'}
            stroke={INK}
            strokeWidth="2.5"
          />
          {boardText && (
            <text
              x="107"
              y="46"
              textAnchor="middle"
              fill={
                boardText === 'Well done!'
                  ? '#8EE59B'
                  : boardText === 'Sensor error'
                  ? '#FF8E87'
                  : '#FFE38E'
              }
              fontFamily="Bricolage Grotesque, sans-serif"
              fontWeight="800"
              fontSize="24"
            >
              {boardText}
            </text>
          )}
        </g>

        {/* Small "Should say" label beside the Display Board (Screen 7) */}
        {shouldSayText && (
          <g transform="translate(604, 56)">
            <rect
              width="124"
              height="68"
              rx="12"
              fill="#FFFDF7"
              stroke={INK}
              strokeWidth="3.5"
            />
            <text
              x="12"
              y="22"
              fill="#465A69"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="700"
              fontSize="11"
            >
              Should say
            </text>
            <text
              x="12"
              y="48"
              fill={INK}
              fontFamily="Bricolage Grotesque, sans-serif"
              fontWeight="700"
              fontSize="15"
            >
              {shouldSayText}
            </text>
            {showMatchTick && (
              <g transform="translate(106, 20)">
                <circle cx="0" cy="0" r="10" fill="#3E9A4D" stroke={INK} strokeWidth="2.5" />
                <path
                  d="M-4.5 0.5 L-1.2 3.8 L5 -3"
                  stroke="#FFFDF7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}
          </g>
        )}

        {/* Top-Right Clinic Rules Chart (never overlaps sink, board, or characters) */}
        {showRulesChart && (
          <g transform="translate(742, 46)">
            <rect
              width="238"
              height="108"
              rx="14"
              fill="#FFFDF7"
              stroke={INK}
              strokeWidth="4"
            />
            <rect
              x="10"
              y="10"
              width="218"
              height="28"
              rx="8"
              fill="#D9544D"
              stroke={INK}
              strokeWidth="2.5"
            />
            <text
              x="119"
              y="29"
              textAnchor="middle"
              fill="#FFFDF7"
              fontFamily="Bricolage Grotesque, sans-serif"
              fontWeight="800"
              fontSize="14"
            >
              Clinic Rules
            </text>

            <text
              x="14"
              y="62"
              fill={INK}
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="700"
              fontSize="12"
            >
              20 seconds or more = Well done!
            </text>
            <text
              x="14"
              y="90"
              fill={INK}
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="700"
              fontSize="12"
            >
              Under 20 = Wash again.
            </text>
          </g>
        )}

        {/* ONE Central Sink with Digital Timer */}
        <SinkUnit x={410} y={248} timerText={timerText} highlightTimer={highlightTimer} />

        {/* Big Green Potted Plant on the far right */}
        <PottedPlant x={864} y={248} scale={1.04} />
      </svg>

      {/* Dr. Meera positioned cleanly on the left */}
      <div className="absolute left-[4%] bottom-[6%] w-[16%] max-w-[150px] z-10 pointer-events-none animate-gentle-bob">
        <DrMeera mood={drMeeraMood} className="w-full h-auto" />
      </div>

      {/* Active Kid standing beside the central sink (Screen 7) */}
      {activeKid && (
        <div
          key={activeKid.kid.id}
          className="absolute left-[22%] bottom-[6%] w-[13.5%] max-w-[122px] z-10 pointer-events-none animate-step-forward flex flex-col items-center"
        >
          <KidCharacter
            kid={activeKid.kid}
            pose={activeKid.pose ?? 'hands-up'}
            className="w-full h-auto"
          />
          <span className="mt-0.5 font-display font-bold text-xs sm:text-sm text-[#24303C] bg-[#FFFDF7]/95 px-2.5 py-0.5 rounded-lg border-2 border-[#24303C]">
            {activeKid.kid.name}
          </span>
        </div>
      )}
    </div>
  );
};
