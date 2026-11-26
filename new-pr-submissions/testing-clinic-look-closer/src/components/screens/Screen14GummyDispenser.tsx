import React, { useState } from 'react';
import type { TryEntry14 } from '../../types/story';
import { DrMeera } from '../svg/Characters';
import { DialogueBox } from '../DialogueBox';
import { ClinicButton } from '../ClinicButton';
import {
  GummyAssertResult,
  GummyAssertSpec,
  INITIAL_GUMMY_CODE,
  expectedGummiesValue,
  formatGummyLabel,
  runGummiesAsserts,
  runGummiesCode,
} from '../../utils/pyodide';

interface Screen14GummyDispenserProps {
  stage: 'trial' | 'summary' | 'write-tests' | 'fix-and-test';
  tries: TryEntry14[];
  test1Age: string;
  test1Out: string;
  test2Age: string;
  test2Out: string;
  writtenSpecs: GummyAssertSpec[];
  selectedBoundary: string;
  selectedEdge: string;
  testRunResults: GummyAssertResult[];
  onStateChange: (patch: {
    stage?: 'trial' | 'summary' | 'write-tests' | 'fix-and-test';
    tries?: TryEntry14[];
    test1Age?: string;
    test1Out?: string;
    test2Age?: string;
    test2Out?: string;
    writtenSpecs?: GummyAssertSpec[];
    selectedBoundary?: string;
    selectedEdge?: string;
    testRunResults?: GummyAssertResult[];
  }) => void;
  onNext: () => void;
}

const INK = '#24303C';
const MAX_TRIES = 6;

interface FixOption {
  id: string;
  line: string;
}

const BOUNDARY_OPTIONS: FixOption[] = [
  { id: 'b-lt12', line: 'elif age < 12:' },
  { id: 'b-lte12', line: 'elif age <= 12:' },
  { id: 'b-eq12', line: 'elif age == 12:' },
  { id: 'b-gt12', line: 'elif age > 12:' },
];

const EDGE_OPTIONS: FixOption[] = [
  { id: 'e-and', line: 'if age < 0 and age > 15:' },
  { id: 'e-or', line: 'if age < 0 or age > 15:' },
  { id: 'e-lte', line: 'if age <= 0 or age >= 15:' },
  { id: 'e-flipped', line: 'if age > 0 or age < 15:' },
];

function parseExpectedGummyInput(
  raw: string
): number | 'Ask the nurse' | null {
  const cleaned = raw.trim().replace(/^["']|["']$/g, '').trim();
  if (cleaned === 'Ask the nurse') return 'Ask the nurse';
  if (/^[123]$/.test(cleaned)) return Number.parseInt(cleaned, 10);
  return null;
}

export const Screen14GummyDispenser: React.FC<Screen14GummyDispenserProps> = ({
  stage,
  tries,
  test1Age,
  test1Out,
  test2Age,
  test2Out,
  writtenSpecs,
  selectedBoundary,
  selectedEdge,
  testRunResults,
  onStateChange,
  onNext,
}) => {
  const [ageInput, setAgeInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [test1Err, setTest1Err] = useState(false);
  const [test2Err, setTest2Err] = useState(false);

  const foundBoundary12 = tries.some((t) => t.age === 12 && t.isMismatch);
  const foundNegative = tries.some((t) => t.age < 0 && t.isMismatch);
  const foundOver15 = tries.some((t) => t.age > 15 && t.isMismatch);
  const foundAllThree = foundBoundary12 && foundNegative && foundOver15;

  const latestTry = tries[tries.length - 1];

  const allTestsGreen =
    testRunResults.length > 0 && testRunResults.every((r) => r.passed);

  const handleSubmitAge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRunning || tries.length >= MAX_TRIES || stage !== 'trial' || foundAllThree) return;

    const trimmed = ageInput.trim();
    if (trimmed === '' || !/^-?\d+$/.test(trimmed)) {
      setInputError('Enter a whole number.');
      return;
    }

    const age = Number.parseInt(trimmed, 10);
    setInputError(null);
    setIsRunning(true);

    const rawDispenser = await runGummiesCode(INITIAL_GUMMY_CODE, age);
    const rawExpected = expectedGummiesValue(age);

    const dispenserGives = formatGummyLabel(rawDispenser);
    const shouldGive = formatGummyLabel(rawExpected);
    const isMismatch = String(rawDispenser) !== String(rawExpected);

    const nextTries: TryEntry14[] = [
      ...tries,
      { age, shouldGive, dispenserGives, isMismatch },
    ];
    const nextFoundAllThree =
      nextTries.some((t) => t.age === 12 && t.isMismatch) &&
      nextTries.some((t) => t.age < 0 && t.isMismatch) &&
      nextTries.some((t) => t.age > 15 && t.isMismatch);

    setAgeInput('');
    setIsRunning(false);
    onStateChange({
      tries: nextTries,
      stage:
        nextTries.length >= MAX_TRIES && !nextFoundAllThree
          ? 'summary'
          : 'trial',
    });
  };

  const handleSaveWrittenTests = () => {
    const a1Valid = /^-?\d+$/.test(test1Age.trim());
    const a2Valid = /^-?\d+$/.test(test2Age.trim());
    const o1 = parseExpectedGummyInput(test1Out);
    const o2 = parseExpectedGummyInput(test2Out);

    const age1 = a1Valid ? Number.parseInt(test1Age.trim(), 10) : NaN;
    const age2 = a2Valid ? Number.parseInt(test2Age.trim(), 10) : NaN;

    const row1Ok =
      a1Valid && o1 !== null && String(expectedGummiesValue(age1)) === String(o1);
    const row2Ok =
      a2Valid &&
      o2 !== null &&
      String(expectedGummiesValue(age2)) === String(o2) &&
      age2 !== age1;

    setTest1Err(!row1Ok);
    setTest2Err(!row2Ok);

    if (!row1Ok || !row2Ok) {
      return;
    }

    const userSpecs: GummyAssertSpec[] = [
      {
        id: 'user-1',
        label: `assert gummies(${age1}) == ${typeof o1 === 'number' ? o1 : `"${o1}"`}`,
        age: age1,
        expected: o1!,
      },
      {
        id: 'user-2',
        label: `assert gummies(${age2}) == ${typeof o2 === 'number' ? o2 : `"${o2}"`}`,
        age: age2,
        expected: o2!,
      },
    ];

    const baseClinicChecks: GummyAssertSpec[] = [
      {
        id: 'clinic-12',
        label: 'assert gummies(12) == 2',
        age: 12,
        expected: 2,
      },
      {
        id: 'clinic--1',
        label: 'assert gummies(-1) == "Ask the nurse"',
        age: -1,
        expected: 'Ask the nurse',
      },
      {
        id: 'clinic-16',
        label: 'assert gummies(16) == "Ask the nurse"',
        age: 16,
        expected: 'Ask the nurse',
      },
    ];
    const clinicChecks = baseClinicChecks.filter(
      (c) => c.age !== age1 && c.age !== age2
    );

    onStateChange({
      writtenSpecs: [...userSpecs, ...clinicChecks],
      stage: 'fix-and-test',
    });
  };

  const candidateCode = `def gummies(age):
    ${selectedEdge}
        return "Ask the nurse"
    if age < 5:
        return 1
    ${selectedBoundary}
        return 2
    else:
        return 3`;

  const currentCode =
    stage === 'fix-and-test' ? candidateCode : INITIAL_GUMMY_CODE;

  const handleRunSuite = async () => {
    if (isRunning) return;
    setIsRunning(true);
    const res = await runGummiesAsserts(candidateCode, writtenSpecs);
    setIsRunning(false);
    onStateChange({ testRunResults: res });
  };

  return (
    <div className="flex flex-col gap-[1.4dvh] w-full animate-slide-in-up">
      {/* Side-by-side: Dispenser + Rules Sign on Left | Code + Input/Checks on Right */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3 w-full">
        {/* Left: Dispenser + Gummy Rules Sign */}
        <div className="w-full lg:w-[54%] relative rounded-3xl border-[4px] border-[#24303C] overflow-hidden bg-[#A8D8E8] shadow-[0_6px_0_#24303C] aspect-[16/10] lg:aspect-auto lg:h-[68dvh] lg:max-h-[540px]">
          <svg
            viewBox="0 0 770 480"
            className="w-full h-full object-contain select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pale-blue & Teal Clinic Wall */}
            <rect width="770" height="320" fill="#A8D8E8" />
            <rect y="190" width="770" height="130" fill="#7FC4D6" />
            <line x1="0" y1="190" x2="770" y2="190" stroke={INK} strokeWidth="4" />

            {/* Cream Clinic Floor */}
            <rect y="320" width="770" height="160" fill="#F5EFE0" />
            <line x1="0" y1="320" x2="770" y2="320" stroke={INK} strokeWidth="4" />

            {/* Centered Wooden Counter */}
            <rect x="280" y="302" width="188" height="24" rx="8" fill="#E8A33D" stroke={INK} strokeWidth="4" />
            <rect x="296" y="326" width="156" height="118" fill="#D48D28" stroke={INK} strokeWidth="4" />

            {/* Centered Vitamin Gummy Dispenser */}
            <g transform="translate(292, 74)">
              <rect x="44" y="0" width="76" height="16" rx="8" fill="#D9544D" stroke={INK} strokeWidth="4" />
              <circle cx="82" cy="70" r="56" fill="#FFFDF7" stroke={INK} strokeWidth="4.5" />
              <g stroke={INK} strokeWidth="2.5">
                <circle cx="62" cy="56" r="11" fill="#D9544D" />
                <circle cx="86" cy="52" r="11" fill="#E8A33D" />
                <circle cx="106" cy="64" r="11" fill="#3E9A4D" />
                <circle cx="56" cy="80" r="11" fill="#3E9A4D" />
                <circle cx="78" cy="76" r="11" fill="#D9544D" />
                <circle cx="98" cy="88" r="11" fill="#E8A33D" />
                <circle cx="66" cy="100" r="11" fill="#E8A33D" />
                <circle cx="114" cy="84" r="10" fill="#7FC4D6" />
              </g>
              <path d="M44 46 A42 42 0 0 1 70 26" stroke="#A8D8E8" strokeWidth="6" strokeLinecap="round" />

              <path
                d="M36 122 H128 L138 228 H26 Z"
                fill="#D9544D"
                stroke={INK}
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <rect x="44" y="136" width="76" height="34" rx="8" fill="#24303C" stroke={INK} strokeWidth="3" />
              <text
                x="82"
                y="158"
                textAnchor="middle"
                fill="#FFE38E"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
                fontSize="13"
              >
                {latestTry ? `Age ${latestTry.age}` : 'Ready'}
              </text>
              <rect x="56" y="182" width="52" height="32" rx="8" fill="#24303C" stroke={INK} strokeWidth="3" />
              {latestTry && (
                <text
                  x="82"
                  y="203"
                  textAnchor="middle"
                  fill="#FFFDF7"
                  fontFamily="Bricolage Grotesque, sans-serif"
                  fontWeight="700"
                  fontSize="12"
                >
                  {latestTry.dispenserGives.replace(/"/g, '')}
                </text>
              )}
            </g>

            {/* High-Contrast Gummy Rules Sign */}
            <g transform="translate(470, 26)">
              <rect x="4" y="6" width="276" height="266" rx="18" fill={INK} />
              <rect width="276" height="266" rx="18" fill="#FFFFFF" stroke={INK} strokeWidth="4.5" />
              <rect x="12" y="12" width="252" height="40" rx="10" fill="#D9544D" stroke={INK} strokeWidth="3" />
              <text
                x="138"
                y="39"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="Bricolage Grotesque, sans-serif"
                fontWeight="800"
                fontSize="20"
              >
                Gummy Rules
              </text>

              <rect x="14" y="64" width="248" height="40" rx="9" fill="#F5EFE0" stroke="#24303C" strokeWidth="2" />
              <text x="26" y="90" fill="#111827" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="15.5">
                Under 5 = 1 gummy
              </text>

              <rect x="14" y="112" width="248" height="44" rx="9" fill="#F5EFE0" stroke="#24303C" strokeWidth="2" />
              <text x="26" y="133" fill="#111827" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="15">
                5 to 12 (12 included)
              </text>
              <text x="26" y="150" fill="#111827" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="15">
                = 2 gummies
              </text>

              <rect x="14" y="164" width="248" height="40" rx="9" fill="#F5EFE0" stroke="#24303C" strokeWidth="2" />
              <text x="26" y="190" fill="#111827" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="15.5">
                Over 12 = 3 gummies
              </text>

              <rect x="14" y="212" width="248" height="44" rx="9" fill="#FEE2E2" stroke="#991B1B" strokeWidth="2.5" />
              <text x="26" y="232" fill="#7F1D1D" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="14.5">
                Below 0 or above 15
              </text>
              <text x="26" y="249" fill="#7F1D1D" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="14.5">
                = &ldquo;Ask the nurse&rdquo;
              </text>
            </g>
          </svg>

          {/* Dr. Meera standing cleanly on the left */}
          <div className="absolute left-[2.5%] bottom-[4%] w-[25%] max-w-[140px] z-10 pointer-events-none">
            <DrMeera mood={allTestsGreen ? 'happy' : 'curious'} className="w-full h-auto" />
          </div>
        </div>

        {/* Right: Code Block + Active Stage Panel */}
        <div className="w-full lg:w-[46%] rounded-3xl border-[4px] border-[#24303C] bg-[#FFFDF7] shadow-[0_6px_0_#24303C] p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 lg:h-[68dvh] lg:max-h-[540px] overflow-y-auto">
          {/* Code Card (hidden when all tests pass so only the Passed section shows) */}
          {!(stage === 'fix-and-test' && allTestsGreen) && (
            <div className="shrink-0">
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b-2 border-[#24303C]/15 mb-2">
                <h2 className="font-display font-bold text-sm sm:text-base text-[#24303C]">
                  Your Turn: Gummy Dispenser
                </h2>
                {stage === 'trial' && (
                  <span className="text-xs font-bold text-[#465A69] tabular-nums">
                    {tries.length} of {MAX_TRIES} tries
                  </span>
                )}
              </div>

              <div className="bg-[#24303C] border-[3px] border-[#24303C] rounded-2xl p-2.5 text-[#F5EFE0] max-h-[175px] overflow-y-auto">
                <pre className="font-mono text-[11px] sm:text-xs leading-snug overflow-x-auto m-0">
                  <code>{currentCode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Stage 1: Typing Ages */}
          {stage === 'trial' && (
            <div className="flex-1 flex flex-col justify-between gap-2 min-h-0">
              {foundAllThree ? (
                <div className="flex items-center justify-between gap-2 rounded-xl bg-[#3E9A4D] text-[#FFFDF7] border-[2.5px] border-[#24303C] px-3.5 py-2 font-display font-bold text-sm sm:text-base shadow-[0_3px_0_#24303C]">
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
                      <circle cx="10" cy="10" r="8" fill="#FFFDF7" />
                      <path d="M6.5 10.2 L9 12.7 L13.8 7.5" stroke="#3E9A4D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    You found them all!
                  </span>
                </div>
              ) : (
                <form onSubmit={(e) => void handleSubmitAge(e)} className="flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ageInput}
                    onChange={(e) => {
                      setAgeInput(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="Type an age"
                    aria-label="Type an age"
                    className="flex-1 min-w-0 font-mono font-bold text-sm sm:text-base px-3 py-1.5 rounded-xl bg-[#F5EFE0] border-[2.5px] border-[#24303C] text-[#24303C] placeholder:font-sans placeholder:font-medium placeholder:text-[#465A69]/70 focus:outline-none focus:ring-4 focus:ring-[#7FC4D6]"
                  />
                  <ClinicButton
                    type="submit"
                    variant="amber"
                    size="sm"
                    disabled={isRunning}
                  >
                    Test Age
                  </ClinicButton>
                </form>
              )}

              {inputError && (
                <div className="text-xs font-bold text-[#D9544D] shrink-0">{inputError}</div>
              )}

              <div className="flex-1 min-h-0 bg-[#F5EFE0] rounded-2xl border-2 border-[#24303C]/20 p-2 flex flex-col">
                <div className="grid grid-cols-[44px_1fr_1fr_28px] gap-x-2 text-[11px] font-bold text-[#465A69] pb-1 border-b border-[#24303C]/15">
                  <div>Age</div>
                  <div>Should give</div>
                  <div>Dispenser gives</div>
                  <div className="text-right">Ok</div>
                </div>
                <div className="flex-1 overflow-y-auto flex flex-col gap-1 pt-1 max-h-[155px]">
                  {tries.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-xs font-semibold text-[#465A69] text-center py-3">
                      Type an age above and press Test Age.
                    </div>
                  ) : (
                    tries.map((entry, i) => (
                      <div
                        key={`${entry.age}-${i}`}
                        className={`grid grid-cols-[44px_1fr_1fr_28px] gap-x-2 items-center rounded-lg px-2 py-1 text-xs font-semibold border ${
                          entry.isMismatch
                            ? 'bg-[#D9544D]/12 border-[#D9544D] text-[#B32E27]'
                            : 'bg-[#FFFDF7] border-[#24303C]/15 text-[#24303C]'
                        }`}
                      >
                        <div className="font-mono font-bold tabular-nums">{entry.age}</div>
                        <div className="truncate">{entry.shouldGive}</div>
                        <div className="font-bold truncate">{entry.dispenserGives}</div>
                        <div className="flex justify-end">
                          {entry.isMismatch ? (
                            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-label="Mismatch">
                              <circle cx="10" cy="10" r="8" fill="#D9544D" />
                              <path d="M7 7 L13 13 M13 7 L7 13" stroke="#FFFDF7" strokeWidth="2.2" strokeLinecap="round" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-label="Match">
                              <circle cx="10" cy="10" r="8" fill="#3E9A4D" />
                              <path d="M6.5 10.2 L9 12.7 L13.8 7.5" stroke="#FFFDF7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stage 2: Found vs Missed Summary after 6 tries */}
          {stage === 'summary' && (
            <div className="animate-slide-in-up flex-1 flex flex-col justify-between gap-2.5 min-h-0">
              <div className="bg-[#F5EFE0] rounded-2xl border-2 border-[#24303C] p-3 space-y-2">
                <div className="font-display font-bold text-sm sm:text-base text-[#24303C]">
                  {foundAllThree ? 'All 3 mismatches found!' : 'Found & missed after 6 tries:'}
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm font-semibold">
                  <div className="flex items-center justify-between bg-[#FFFDF7] rounded-xl px-3 py-1.5 border border-[#24303C]/20">
                    <span>Age 12</span>
                    <span className={foundBoundary12 ? 'text-[#3E9A4D] font-bold' : 'text-[#D9544D] font-bold'}>
                      {foundBoundary12 ? 'Found' : 'Missed'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-[#FFFDF7] rounded-xl px-3 py-1.5 border border-[#24303C]/20">
                    <span>Negatives (&lt; 0)</span>
                    <span className={foundNegative ? 'text-[#3E9A4D] font-bold' : 'text-[#D9544D] font-bold'}>
                      {foundNegative ? 'Found' : 'Missed'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-[#FFFDF7] rounded-xl px-3 py-1.5 border border-[#24303C]/20">
                    <span>Ages above 15 (&gt; 15)</span>
                    <span className={foundOver15 ? 'text-[#3E9A4D] font-bold' : 'text-[#D9544D] font-bold'}>
                      {foundOver15 ? 'Found' : 'Missed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 3: Write two assert gummies(__) == __ test lines */}
          {stage === 'write-tests' && (
            <div className="animate-slide-in-up flex-1 flex flex-col justify-between gap-2.5 min-h-0">
              <div className="space-y-1.5">
                <div className="text-xs sm:text-sm font-bold text-[#24303C]">
                  Dr. Meera: &ldquo;Now write your own promises for this machine.&rdquo;
                </div>
                <div className="text-xs font-bold text-[#465A69]">
                  Use the Gummy Rules (1, 2, 3 or Ask the nurse):
                </div>

                <div className="bg-[#24303C] rounded-2xl p-3 space-y-2 font-mono text-xs sm:text-sm text-[#F5EFE0]">
                  <div className="flex flex-wrap items-center gap-1">
                    <span>assert gummies(</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={test1Age}
                      onChange={(e) => {
                        onStateChange({ test1Age: e.target.value, testRunResults: [] });
                        if (test1Err) setTest1Err(false);
                      }}
                      placeholder="__"
                      aria-label="Test 1 age"
                      className={`w-14 text-center font-bold rounded-lg px-1.5 py-0.5 bg-[#FFFDF7] text-[#24303C] border-2 focus:outline-none ${
                        test1Err ? 'border-[#D9544D]' : 'border-[#7FC4D6]'
                      }`}
                    />
                    <span>) ==</span>
                    <input
                      type="text"
                      value={test1Out}
                      onChange={(e) => {
                        onStateChange({ test1Out: e.target.value, testRunResults: [] });
                        if (test1Err) setTest1Err(false);
                      }}
                      placeholder="__"
                      aria-label="Test 1 expected output"
                      className={`w-32 text-center font-bold rounded-lg px-1.5 py-0.5 bg-[#FFFDF7] text-[#24303C] border-2 focus:outline-none ${
                        test1Err ? 'border-[#D9544D]' : 'border-[#7FC4D6]'
                      }`}
                    />
                    {test1Err && (
                      <span className="font-sans text-xs font-bold text-[#FCA5A5] ml-1">
                        Try again
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    <span>assert gummies(</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={test2Age}
                      onChange={(e) => {
                        onStateChange({ test2Age: e.target.value, testRunResults: [] });
                        if (test2Err) setTest2Err(false);
                      }}
                      placeholder="__"
                      aria-label="Test 2 age"
                      className={`w-14 text-center font-bold rounded-lg px-1.5 py-0.5 bg-[#FFFDF7] text-[#24303C] border-2 focus:outline-none ${
                        test2Err ? 'border-[#D9544D]' : 'border-[#7FC4D6]'
                      }`}
                    />
                    <span>) ==</span>
                    <input
                      type="text"
                      value={test2Out}
                      onChange={(e) => {
                        onStateChange({ test2Out: e.target.value, testRunResults: [] });
                        if (test2Err) setTest2Err(false);
                      }}
                      placeholder="__"
                      aria-label="Test 2 expected output"
                      className={`w-32 text-center font-bold rounded-lg px-1.5 py-0.5 bg-[#FFFDF7] text-[#24303C] border-2 focus:outline-none ${
                        test2Err ? 'border-[#D9544D]' : 'border-[#7FC4D6]'
                      }`}
                    />
                    {test2Err && (
                      <span className="font-sans text-xs font-bold text-[#FCA5A5] ml-1">
                        Try again
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ClinicButton
                variant="coral"
                size="sm"
                onClick={handleSaveWrittenTests}
                className="w-full"
              >
                Save Tests &amp; Fix the Code
              </ClinicButton>
            </div>
          )}

          {/* Stage 4: Fix Both Lines & Run Tests (shows only Passed section once all tests pass) */}
          {stage === 'fix-and-test' &&
            (allTestsGreen ? (
              <div className="animate-slide-in-up flex-1 flex flex-col justify-center min-h-0">
                <div className="bg-[#F5EFE0] rounded-2xl border-2 border-[#24303C]/20 p-3.5 space-y-2 overflow-y-auto">
                  {testRunResults.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between gap-3 text-xs sm:text-sm font-mono font-bold px-3 py-2 rounded-xl bg-[#FFFDF7] text-[#3E9A4D] border border-[#3E9A4D]/30"
                    >
                      <span className="truncate">{res.label}</span>
                      <span className="shrink-0 font-sans font-extrabold">PASSED</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-slide-in-up flex-1 flex flex-col justify-between gap-2 min-h-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0">
                  <div>
                    <div className="text-[11px] font-bold text-[#465A69] mb-1">
                      Top check (&lt; 0 or &gt; 15):
                    </div>
                    <div className="space-y-1">
                      {EDGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            onStateChange({ selectedEdge: opt.line, testRunResults: [] });
                          }}
                          className={`btn-press-spring w-full cursor-pointer text-left font-mono font-bold text-[11px] px-2 py-1 rounded-lg border-2 ${
                            selectedEdge === opt.line
                              ? 'bg-[#E8A33D] border-[#24303C] text-[#24303C]'
                              : 'bg-[#F5EFE0] hover:bg-[#A8D8E8] border-[#24303C]/30 text-[#24303C]'
                          }`}
                        >
                          {opt.line}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-[#465A69] mb-1">
                      Middle check (5 to 12 included):
                    </div>
                    <div className="space-y-1">
                      {BOUNDARY_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            onStateChange({ selectedBoundary: opt.line, testRunResults: [] });
                          }}
                          className={`btn-press-spring w-full cursor-pointer text-left font-mono font-bold text-[11px] px-2 py-1 rounded-lg border-2 ${
                            selectedBoundary === opt.line
                              ? 'bg-[#E8A33D] border-[#24303C] text-[#24303C]'
                              : 'bg-[#F5EFE0] hover:bg-[#A8D8E8] border-[#24303C]/30 text-[#24303C]'
                          }`}
                        >
                          {opt.line}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {testRunResults.length === 0 ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <ClinicButton
                      variant="green"
                      size="sm"
                      onClick={() => void handleRunSuite()}
                      disabled={isRunning}
                      className="flex-1"
                    >
                      Run Tests
                    </ClinicButton>
                  </div>
                ) : (
                  <div className="bg-[#F5EFE0] rounded-xl border-2 border-[#24303C]/20 p-2 max-h-[82px] overflow-y-auto space-y-1">
                    {testRunResults.map((res) => (
                      <div
                        key={res.id}
                        className={`flex items-center justify-between gap-2 text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                          res.passed
                            ? 'bg-[#FFFDF7] text-[#3E9A4D]'
                            : 'bg-[#D9544D]/15 text-[#B32E27]'
                        }`}
                      >
                        <span className="truncate">{res.label}</span>
                        <span>{res.passed ? 'PASSED' : 'FAILED'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Story Dialogue Bar */}
      <DialogueBox
        speaker="Dr. Meera"
        actions={
          stage === 'trial' && foundAllThree ? (
            <ClinicButton
              variant="green"
              onClick={() => onStateChange({ stage: 'write-tests' })}
            >
              Next
            </ClinicButton>
          ) : stage === 'summary' ? (
            <ClinicButton
              variant="amber"
              onClick={() => onStateChange({ stage: 'write-tests' })}
            >
              Next
            </ClinicButton>
          ) : stage === 'write-tests' ? (
            <ClinicButton variant="coral" onClick={handleSaveWrittenTests}>
              Next
            </ClinicButton>
          ) : stage === 'fix-and-test' && allTestsGreen ? (
            <ClinicButton variant="green" onClick={onNext}>
              Next
            </ClinicButton>
          ) : stage === 'fix-and-test' && testRunResults.length === 0 ? (
            <ClinicButton
              variant="green"
              onClick={() => void handleRunSuite()}
              disabled={isRunning}
            >
              Run Tests
            </ClinicButton>
          ) : null
        }
      >
        {stage === 'trial' && (
          <>
            {foundAllThree ? (
              <>&ldquo;You found them all! Press Next to write two checks for the dispenser.&rdquo;</>
            ) : (
              <>&ldquo;Now it&apos;s your turn! Type ages into the gummy dispenser, up to 6 tries, to see where the code disagrees with the sign.&rdquo;</>
            )}
          </>
        )}
        {stage === 'summary' && (
          <>
            {foundAllThree
              ? '"You caught all three mismatches! Next, write two tests for the dispenser."'
              : '"Your 6 tries are up! Look at which mismatches you found and which ones you missed."'}
          </>
        )}
        {stage === 'write-tests' && (
          <>&ldquo;Write two <code className="font-mono font-bold">assert gummies(__) == __</code> lines to guard the gummy rules.&rdquo;</>
        )}
        {stage === 'fix-and-test' && (
          <>
            {allTestsGreen
              ? '"All tests are green! Every rule matches the sign."'
              : testRunResults.length > 0
              ? '"Some tests failed. Pick better lines above and run the tests again until all go green!"'
              : '"Pick the right lines above and press Run Tests to check your fix."'}
          </>
        )}
      </DialogueBox>
    </div>
  );
};
