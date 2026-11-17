import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { CodeEditor } from '../../gadgets/CodeEditor';
import { Terminal } from '../../gadgets/Terminal';
import { usePython } from '../../gadgets/usePython';
import type { TestResult } from '../../gadgets/types';
import type { CodingChallenge } from '../types';
import { 
  Sparkles, 
  Check, 
  X, 
  AlertTriangle, 
  Lightbulb, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  Code2
} from 'lucide-react';

export const SETS_CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'challenge-1-sets-dedup',
    title: '1. Pocket Gadgets Deduplicator',
    instructions: 'Help Nobita filter duplicate gadgets from his 4D pocket.\n\n1. Define a set named `unique_pocket` using the `set()` constructor on `pocket_items`.\n2. Print `unique_pocket` to verify duplicates are gone.\n3. Print True if `"Bamboo Copter"` is in `unique_pocket`.',
    starterCode: `# Pocket items list with duplicate strings\npocket_items = ["Anywhere Door", "Bamboo Copter", "Anywhere Door", "Small Light", "Bamboo Copter"]\n\n# Step 1: Create a set named unique_pocket from pocket_items\nunique_pocket = set(pocket_items)\n\n# Step 2: Print the unique_pocket set\nprint(unique_pocket)\n\n# Step 3: Check if "Bamboo Copter" is in unique_pocket\nprint("Bamboo Copter" in unique_pocket)\n`,
    tests: [
      {
        description: 'Verify "unique_pocket" is a set with 3 unique gadgets',
        testCode: 'assert isinstance(unique_pocket, set) and len(unique_pocket) == 3 and "Anywhere Door" in unique_pocket and "Bamboo Copter" in unique_pocket and "Small Light" in unique_pocket'
      },
      {
        description: 'Verify "Bamboo Copter" membership check evaluates to True',
        testCode: 'assert "Bamboo Copter" in unique_pocket'
      }
    ],
    hints: [
      'Call `set(pocket_items)` to convert the list with duplicates into a clean Set.',
      'Check membership using `"Bamboo Copter" in unique_pocket`.'
    ]
  },
  {
    id: 'challenge-2-sets-ops',
    title: "2. Stamp Collector's Trade (Intersection & Union)",
    instructions: 'Nobita and Suneo want to trade dinosaur stamps.\n\n1. Find stamps BOTH collectors own using intersection (`&`) and store in `common_stamps`.\n2. Combine ALL unique stamps across both collectors using union (`|`) and store in `all_stamps`.\n3. Print both sets.',
    starterCode: `nobita_stamps = {"T-Rex", "Triceratops", "Brachiosaurus"}\nsuneo_stamps = {"Pterodactyl", "T-Rex", "Triceratops"}\n\n# Step 1: Calculate common stamps present in BOTH sets using &\ncommon_stamps = nobita_stamps & suneo_stamps\n\n# Step 2: Combine all unique stamps across both sets using |\nall_stamps = nobita_stamps | suneo_stamps\n\nprint("Common:", common_stamps)\nprint("All Combined:", all_stamps)\n`,
    tests: [
      {
        description: 'Verify "common_stamps" is intersection containing {"T-Rex", "Triceratops"}',
        testCode: 'assert isinstance(common_stamps, set) and common_stamps == {"T-Rex", "Triceratops"}'
      },
      {
        description: 'Verify "all_stamps" is union containing all 4 unique stamps',
        testCode: 'assert isinstance(all_stamps, set) and len(all_stamps) == 4 and "Pterodactyl" in all_stamps'
      }
    ],
    hints: [
      'Use `&` for intersection: `nobita_stamps & suneo_stamps`.',
      'Use `|` for union: `nobita_stamps | suneo_stamps`.'
    ]
  },
  {
    id: 'challenge-3-sets-methods',
    title: "3. Gian's Concert Guest List (Methods & Difference)",
    instructions: 'Help Gian manage his concert guest list.\n\n1. Add `"Dekisugi"` to `guests` using `.add("Dekisugi")`.\n2. Safely remove `"Nobita"` from `guests` using `.discard("Nobita")`.\n3. Find guests on `guests` list who are NOT in `busy_friends` using difference (`-`) and store in `attending`.',
    starterCode: `guests = {"Shizuka", "Suneo", "Nobita"}\n\n# Step 1: Add "Dekisugi" to guests using .add()\nguests.add("Dekisugi")\n\n# Step 2: Safely remove "Nobita" using .discard()\nguests.discard("Nobita")\n\n# Step 3: Find guests NOT in busy_friends using -\nbusy_friends = {"Suneo"}\nattending = guests - busy_friends\n\nprint("Final Attending:", attending)\n`,
    tests: [
      {
        description: 'Verify "Dekisugi" was added and "Nobita" was removed from guests',
        testCode: 'assert "Dekisugi" in guests and "Nobita" not in guests'
      },
      {
        description: 'Verify "attending" difference equals {"Shizuka", "Dekisugi"}',
        testCode: 'assert attending == {"Shizuka", "Dekisugi"}'
      }
    ],
    hints: [
      'Call `guests.add("Dekisugi")` to add an element.',
      'Call `guests.discard("Nobita")` to safely discard an element.',
      'Use `-` to subtract sets: `guests - busy_friends`.'
    ]
  }
];

interface CodingPageProps {
  challenge?: CodingChallenge;
  onVerify?: (passed: boolean) => void;
}

export const CodingPage: React.FC<CodingPageProps> = ({
  challenge = SETS_CODING_CHALLENGES[0],
  onVerify
}) => {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const currentChallenge = SETS_CODING_CHALLENGES[activeChallengeIndex] || challenge;

  const [code, setCode] = useState<string>(currentChallenge.starterCode);
  const [stdout, setStdout] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [hasVerified, setHasVerified] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const { isLoading: isPyodideLoading, runPython, verifyCode } = usePython();

  // Reset code state when switching challenges
  useEffect(() => {
    setCode(currentChallenge.starterCode);
    setStdout('');
    setError(null);
    setTestResults([]);
    setHasVerified(false);
    setShowHint(false);
  }, [activeChallengeIndex, currentChallenge]);

  const handleRunCode = async () => {
    if (isPyodideLoading || isRunning) return;
    setIsRunning(true);
    setError(null);
    setHasVerified(false);

    // 1. Run main execution to capture stdout & runtime errors
    const result = await runPython(code);
    setStdout(result.stdout);
    setError(result.error);

    // 2. Run assertion verification tests
    const verification = await verifyCode(code, currentChallenge.tests);
    setTestResults(verification.results);
    setHasVerified(true);
    setIsRunning(false);

    if (onVerify) {
      onVerify(verification.success);
    }
  };

  const handleClearConsole = () => {
    setStdout('');
    setError(null);
    setTestResults([]);
    setHasVerified(false);
  };

  const handleResetCode = () => {
    setCode(currentChallenge.starterCode);
    handleClearConsole();
  };

  const allPassed = hasVerified && testResults.length > 0 && testResults.every(t => t.passed);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Challenge Level Selector Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={18} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            PYTHON SETS CODING CHALLENGES
          </span>
        </div>

        {/* Level Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {SETS_CODING_CHALLENGES.map((ch, idx) => {
            const isActive = idx === activeChallengeIndex;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChallengeIndex(idx)}
                style={{
                  padding: '6px 14px', borderRadius: '10px',
                  border: isActive ? '1.5px solid #f59e0b' : '1px solid rgba(0,0,0,0.1)',
                  background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'white',
                  color: isActive ? '#b45309' : '#64748b',
                  fontSize: '12px', fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                Level {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Coding Workspace Grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        minHeight: '480px',
        flexWrap: 'wrap',
        width: '100%'
      }}>
        
        {/* Left Column: Instructions & Verification Checklist */}
        <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <GlassCard style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', background: 'white', border: '1.5px solid rgba(245, 158, 11, 0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  CHALLENGE {activeChallengeIndex + 1} OF 3
                </span>
              </div>

              <button
                onClick={handleResetCode}
                title="Reset starter code"
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.1)', background: 'white',
                  color: '#64748b', fontSize: '11px', fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              {currentChallenge.title}
            </h2>

            <div style={{
              fontSize: '13px',
              color: '#334155',
              lineHeight: 1.6,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {currentChallenge.instructions.split('\n\n').map((para, i) => (
                <p key={i} style={{ margin: 0, whiteSpace: 'pre-line' }}>{para}</p>
              ))}
            </div>

            {/* Hint Drawer Toggle Button */}
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px',
                  background: showHint ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#b45309', fontSize: '12px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                <Lightbulb size={14} style={{ color: '#d97706' }} />
                <span>{showHint ? 'Hide Hint' : '🤖 Need a Hint?'}</span>
              </button>

              {showHint && currentChallenge.hints && (
                <div style={{
                  marginTop: '10px', padding: '12px 14px', borderRadius: '10px',
                  background: 'rgba(254, 240, 138, 0.25)', border: '1px solid rgba(245, 158, 11, 0.3)',
                  fontSize: '12px', color: '#854d0e', lineHeight: 1.5
                }} className="animate-fade-in">
                  <div style={{ fontWeight: 800, marginBottom: '4px' }}>💡 Doraemon's Hint:</div>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    {currentChallenge.hints.map((hintText, hi) => (
                      <li key={hi}>{hintText}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Success Celebration Banner */}
            {allPassed && (
              <div style={{
                padding: '14px 16px', borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
                border: '1.5px solid #22c55e', color: '#15803d',
                display: 'flex', flexDirection: 'column', gap: '8px'
              }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '14px' }}>
                  <Award size={18} />
                  <span>🎉 Level {activeChallengeIndex + 1} Complete!</span>
                </div>
                <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
                  All test assertions passed cleanly! Great job mastering Python Sets.
                </p>
                {activeChallengeIndex < SETS_CODING_CHALLENGES.length - 1 && (
                  <button
                    onClick={() => setActiveChallengeIndex(prev => prev + 1)}
                    className="btn btn-primary"
                    style={{
                      padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800,
                      alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '4px',
                      marginTop: '4px'
                    }}
                  >
                    <span>Next Level ({activeChallengeIndex + 2})</span>
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Verification Checklist */}
            <div style={{
              padding: '16px',
              background: 'rgba(245, 158, 11, 0.04)',
              border: '1px dashed rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#d97706', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                VERIFICATION CHECKLIST
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentChallenge.tests.map((test, index) => {
                  const result = testResults[index];
                  const isPassed = result?.passed;
                  const hasError = result?.error;

                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          backgroundColor: !hasVerified ? 'rgba(0,0,0,0.04)' : isPassed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          border: `1px solid ${!hasVerified ? 'rgba(0,0,0,0.1)' : isPassed ? '#22c55e' : '#ef4444'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isPassed ? '#22c55e' : '#ef4444',
                          flexShrink: 0,
                          marginTop: '1px'
                        }}>
                          {!hasVerified ? (
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                          ) : isPassed ? (
                            <Check size={11} strokeWidth={3} />
                          ) : (
                            <X size={11} strokeWidth={3} />
                          )}
                        </div>
                        <span style={{ fontSize: '12px', lineHeight: 1.4, color: !hasVerified ? '#64748b' : isPassed ? '#15803d' : '#b91c1c', fontWeight: isPassed ? 700 : 500 }}>
                          {test.description}
                        </span>
                      </div>
                      {hasError && (
                        <div style={{
                          fontSize: '11px',
                          color: '#b91c1c',
                          paddingLeft: '26px',
                          display: 'flex',
                          gap: '4px',
                          alignItems: 'center'
                        }}>
                          <AlertTriangle size={10} />
                          <span>{result.error}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </GlassCard>
        </div>

        {/* Right Column: Code Editor & Live Console Output */}
        <div style={{ flex: '2 2 480px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Code Editor */}
          <div style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRunCode}
            />
          </div>

          {/* Terminal Console Output */}
          <div style={{ height: '220px', display: 'flex', flexDirection: 'column' }}>
            <Terminal
              stdout={stdout}
              error={error}
              isLoading={isPyodideLoading}
              isRunning={isRunning}
              onClear={handleClearConsole}
              onRun={handleRunCode}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default CodingPage;
