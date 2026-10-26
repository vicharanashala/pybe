import React, { useState, useMemo } from 'react';
import {
  Train,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RefreshCw,
  Cpu,
  HelpCircle,
  Sparkles,
  Terminal,
  Sliders,
  Users,
  ShieldAlert,
  Flame,
  Award,
  RotateCcw
} from 'lucide-react';

const COACH_BAYS = Array.from({ length: 9 }, (_, bayIdx) => {
  const startBerth = bayIdx * 8 + 1;
  return {
    bayNumber: bayIdx + 1,
    berths: [
      { num: startBerth, type: 'LB', name: 'Lower Berth' },
      { num: startBerth + 1, type: 'MB', name: 'Middle Berth' },
      { num: startBerth + 2, type: 'UB', name: 'Upper Berth' },
      { num: startBerth + 3, type: 'LB', name: 'Lower Berth' },
      { num: startBerth + 4, type: 'MB', name: 'Middle Berth' },
      { num: startBerth + 5, type: 'UB', name: 'Upper Berth' },
      { num: startBerth + 6, type: 'SL', name: 'Side Lower' },
      { num: startBerth + 7, type: 'SU', name: 'Side Upper' }
    ]
  };
});

const TATKAL_ACTS = [
  {
    act: 1,
    title: 'The Senior Citizen Berth',
    concept: '0-Based Indexing',
    tag: 'Lists & Memory Offset',
    badge: 'Act 1',
    scenarioTitle: 'Tatkal Berth Rush — The Senior Citizen Berth (0-Based Indexing)',
    dilemma: 'Ramesh (Age 68) was #1 in the queue, but Priya (Age 24) received the priority Lower Berth. Why?',
    bugLine: 'assigned_passenger = passengers[1]',
    fixLine: 'assigned_passenger = passengers[0]',
    buggyCode: `# Tatkal VIP Queue: Senior Citizen Priority Allocation
passengers = ["Ramesh (Age 68)", "Priya (Age 24)", "Tanmay (Age 31)"]

# Bug: Trainee accessed index 1 expecting the first passenger!
assigned_passenger = passengers[1]
berth_allocated = "Lower Berth 12"

print(f"Allocated {berth_allocated} to: {assigned_passenger}")`,
    fixedCode: `# Tatkal VIP Queue: Senior Citizen Priority Allocation (Fixed)
passengers = ["Ramesh (Age 68)", "Priya (Age 24)", "Tanmay (Age 31)"]

# Corrected: In Python, index 0 accesses the first passenger!
assigned_passenger = passengers[0]
berth_allocated = "Lower Berth 12"

print(f"Allocated {berth_allocated} to: {assigned_passenger}")`
  },
  {
    act: 2,
    title: 'Ghost Berth 72',
    concept: 'Range Boundary Exclusion',
    tag: 'Loops & range(start, stop)',
    badge: 'Act 2',
    scenarioTitle: 'Tatkal Berth Rush — Ghost Berth 72 (Range Boundary Exclusion)',
    dilemma: 'Coach S1 reported 100% Full after 71 allocations, but Berth 72 sat empty on the platform!',
    bugLine: 'for berth_no in range(1, 72):',
    fixLine: 'for berth_no in range(1, 73):',
    buggyCode: `# Coach S1: 72 Physical Berths Total
total_berths = 72
allocated_seats = []

# Bug: In Python, range(start, stop) excludes the stop value!
for berth_no in range(1, 72):
    allocated_seats.append(berth_no)

print(f"Total berths allocated: {len(allocated_seats)}")
print(f"Was Berth 72 allocated? {72 in allocated_seats}")`,
    fixedCode: `# Coach S1: 72 Physical Berths Total (Fixed)
total_berths = 72
allocated_seats = []

# Corrected: range(1, 73) includes Berth 72!
for berth_no in range(1, 73):
    allocated_seats.append(berth_no)

print(f"Total berths allocated: {len(allocated_seats)}")
print(f"Was Berth 72 allocated? {72 in allocated_seats}")`
  },
  {
    act: 3,
    title: 'The Vanishing Audit Tally',
    concept: 'Accumulator Scope Reset',
    tag: 'Variable Lifecycle & Loops',
    badge: 'Act 3',
    scenarioTitle: 'Tatkal Berth Rush — The Vanishing Booking Tally (Accumulator Reset)',
    dilemma: '71 passengers hold printed tickets, but the midnight audit reports Total Confirmed = 1!',
    bugLine: 'total_confirmed = 0  # (inside loop)',
    fixLine: 'total_confirmed = 0  # (outside loop)',
    buggyCode: `# Midnight Audit: Tallying confirmed sleeper tickets
confirmed_passengers = ["Ramesh", "Priya", "Tanmay", "Aarav", "Deepa"]

# Bug: Accumulator reset inside the loop!
for passenger in confirmed_passengers:
    total_confirmed = 0
    total_confirmed = total_confirmed + 1

print(f"Audit Tally: {total_confirmed}")`,
    fixedCode: `# Midnight Audit: Tallying confirmed sleeper tickets (Fixed)
confirmed_passengers = ["Ramesh", "Priya", "Tanmay", "Aarav", "Deepa"]

# Corrected: Initialize accumulator OUTSIDE the loop!
total_confirmed = 0
for passenger in confirmed_passengers:
    total_confirmed = total_confirmed + 1

print(f"Audit Tally: {total_confirmed}")`
  },
  {
    act: 4,
    title: 'The Master Dispatcher',
    concept: 'Mastery & Full Verification',
    tag: 'Complete Integrated System',
    badge: 'Act 4',
    scenarioTitle: 'Tatkal Berth Rush — Master Dispatcher (Mastery & Full Coach Allocation)',
    dilemma: 'Combine all three fixes: zero-based indexing, inclusive range, and external accumulator.',
    bugLine: 'Integrated production run',
    fixLine: 'Verified: 72/72 berths allocated, zero errors',
    buggyCode: `# Master Tatkal Dispatcher - Coach S1
queue = ["Ramesh (Senior)", "Priya", "Tanmay"]
first_vip = queue[0]

total_revenue = 0
fare_per_berth = 450
allocated_berths = []

for seat in range(1, 73):
    allocated_berths.append(seat)
    total_revenue = total_revenue + fare_per_berth

print(f"First Passenger Allocated: {first_vip}")
print(f"Total Berths Assigned: {len(allocated_berths)} of 72")
print(f"Total Revenue Collected: ₹{total_revenue}")`,
    fixedCode: `# Master Tatkal Dispatcher - Coach S1
queue = ["Ramesh (Senior)", "Priya", "Tanmay"]
first_vip = queue[0]

total_revenue = 0
fare_per_berth = 450
allocated_berths = []

for seat in range(1, 73):
    allocated_berths.append(seat)
    total_revenue = total_revenue + fare_per_berth

print(f"First Passenger Allocated: {first_vip}")
print(f"Total Berths Assigned: {len(allocated_berths)} of 72")
print(f"Total Revenue Collected: ₹{total_revenue}")`
  }
];

export function TatkalCaseStudy({
  scenarios,
  selectedScenario,
  onSelectScenario,
  traceData,
  currentStepIndex,
  setCurrentStepIndex,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  stepNext,
  stepPrev,
  resetTrace,
  predictionState,
  submitPrediction,
  onRunCustomTrace,
  traceLoading
}) {
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [showFix, setShowFix] = useState(false);

  const currentAct = TATKAL_ACTS[activeActIndex];
  const currentStep = traceData?.steps?.[currentStepIndex] || null;
  const totalSteps = traceData?.steps?.length || 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Extract memory state
  const scopeMap = useMemo(() => {
    const map = {};
    if (currentStep?.variables) {
      for (const v of currentStep.variables) {
        map[v.name] = v.raw;
      }
    }
    return map;
  }, [currentStep]);

  const allocatedSeatsList = useMemo(() => {
    if (Array.isArray(scopeMap['allocated_seats'])) return scopeMap['allocated_seats'];
    if (Array.isArray(scopeMap['allocated_berths'])) return scopeMap['allocated_berths'];
    return [];
  }, [scopeMap]);

  function handleSelectAct(idx) {
    setActiveActIndex(idx);
    setShowFix(false);
    const actData = TATKAL_ACTS[idx];
    const match = scenarios.find((s) => s.title === actData.scenarioTitle);
    if (match) {
      onSelectScenario(match);
    }
  }

  function handleToggleFix() {
    const nextState = !showFix;
    setShowFix(nextState);
    const code = nextState ? currentAct.fixedCode : currentAct.buggyCode;
    const match = scenarios.find((s) => s.title === currentAct.scenarioTitle) || selectedScenario;
    if (match) {
      onRunCustomTrace(code);
    }
  }

  return (
    <div className="tatkal-case-study-container">
      {/* Station Master Header Banner */}
      <div className="rail-station-header">
        <div className="rail-badge-row">
          <div className="rail-logo-badge">
            <Train size={20} className="train-pulse-icon" />
            <span>IRCTC NORTHERN DISPATCH • PLATFORM 4</span>
          </div>
          <div className="train-status-pill">
            <span className="live-dot"></span>
            <span>12165 MUMBAI–VARANASI SUPERFAST EXPRESS</span>
          </div>
          <div className="coach-tag">COACH S1 (72 SLEEPER BERTHS)</div>
        </div>

        <div className="rail-headline-row">
          <div>
            <h2>The Tatkal Berth Rush: The Ghost Seat Allocation</h2>
            <p className="rail-subtitle">
              Interactive Python Notional Machine Case Study discovering 0-based indexing, range upper-bound exclusion, and accumulator variable lifecycles.
            </p>
          </div>
          <div className="rail-metrics-box">
            <div className="metric-cell">
              <span className="metric-label">Assigned Berths</span>
              <span className="metric-value">{allocatedSeatsList.length} / 72</span>
            </div>
            <div className="metric-cell alert-cell">
              <span className="metric-label">Ghost Vacancy</span>
              <span className="metric-value">
                {allocatedSeatsList.length === 71 && !allocatedSeatsList.includes(72) ? '1 Seat (Berth 72)' : '0'}
              </span>
            </div>
          </div>
        </div>

        {/* 4-Act Story Navigator */}
        <div className="act-selector-grid">
          {TATKAL_ACTS.map((act, idx) => {
            const isActive = activeActIndex === idx;
            return (
              <button
                key={act.act}
                className={`act-card-btn ${isActive ? 'active-act' : ''}`}
                onClick={() => handleSelectAct(idx)}
              >
                <div className="act-card-top">
                  <span className="act-pill">{act.badge}</span>
                  <span className="act-tag">{act.tag}</span>
                </div>
                <div className="act-card-title">{act.title}</div>
                <div className="act-card-concept">
                  <code>{act.concept}</code>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Dilemma & Solution Toggle Bar */}
      <div className="case-dilemma-bar">
        <div className="dilemma-left">
          <div className="dilemma-badge">
            <AlertTriangle size={16} />
            <span>Active Dilemma</span>
          </div>
          <div className="dilemma-text">{currentAct.dilemma}</div>
        </div>
        <div className="dilemma-right">
          <button
            className={`toggle-fix-btn ${showFix ? 'active-fix' : 'buggy-state'}`}
            onClick={handleToggleFix}
          >
            {showFix ? (
              <>
                <CheckCircle2 size={16} />
                <span>Verified Patch Active (Click for Buggy Code)</span>
              </>
            ) : (
              <>
                <Flame size={16} />
                <span>Inspect Buggy Dispatcher (Click to Apply Fix)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Act 1 Special Focus: VIP Queue Inspector */}
      {currentAct.act === 1 && (
        <div className="vip-queue-inspector-card">
          <div className="inspector-header">
            <Users size={18} />
            <strong>Tatkal Priority Waitlist Queue Inspector (Python List in Memory)</strong>
            <span className="memory-badge">passengers = ["Ramesh", "Priya", "Tanmay"]</span>
          </div>
          <div className="queue-slots-grid">
            <div className={`queue-slot ${scopeMap['assigned_passenger']?.includes('Ramesh') ? 'assigned-slot' : 'skipped-slot'}`}>
              <div className="slot-index">Index 0 (Offset 0)</div>
              <div className="slot-passenger">Ramesh (Age 68)</div>
              <div className="slot-role">Senior Citizen (#1 in line)</div>
              <div className="slot-status">
                {scopeMap['assigned_passenger']?.includes('Ramesh') ? (
                  <span className="badge-pass">✅ ALLOCATED LOWER BERTH</span>
                ) : (
                  <span className="badge-fail">⚠️ SKIPPED BY queue[1]!</span>
                )}
              </div>
            </div>

            <div className={`queue-slot ${scopeMap['assigned_passenger']?.includes('Priya') ? 'assigned-slot' : ''}`}>
              <div className="slot-index">Index 1 (Offset 1)</div>
              <div className="slot-passenger">Priya (Age 24)</div>
              <div className="slot-role">Standard Passenger (#2 in line)</div>
              <div className="slot-status">
                {scopeMap['assigned_passenger']?.includes('Priya') ? (
                  <span className="badge-warn">⚠️ RECEIVED BERTH (Trainee used [1])</span>
                ) : (
                  <span className="badge-pass">Awaiting Turn</span>
                )}
              </div>
            </div>

            <div className="queue-slot">
              <div className="slot-index">Index 2 (Offset 2)</div>
              <div className="slot-passenger">Tanmay (Age 31)</div>
              <div className="slot-role">Waitlisted Passenger (#3 in line)</div>
              <div className="slot-status">
                <span className="badge-idle">In Queue</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coach S1 72-Berth Interactive Layout (Acts 2 & 4 Focus) */}
      {(currentAct.act === 2 || currentAct.act === 4) && (
        <div className="coach-layout-card">
          <div className="coach-layout-header">
            <div className="title-with-icon">
              <Train size={18} />
              <strong>Coach S1 Physical Sleeper Layout (72 Berths • 9 Compartment Bays)</strong>
            </div>
            <div className="legend-row">
              <span className="legend-item"><span className="legend-dot occupied"></span> Allocated</span>
              <span className="legend-item"><span className="legend-dot vacant"></span> Vacant</span>
              <span className="legend-item"><span className="legend-dot ghost"></span> Ghost Berth 72</span>
            </div>
          </div>

          <div className="coach-bays-scroll">
            <div className="coach-bays-container">
              {COACH_BAYS.map((bay) => (
                <div key={bay.bayNumber} className="bay-block">
                  <div className="bay-title">Bay {bay.bayNumber}</div>
                  <div className="bay-berths-grid">
                    {bay.berths.map((b) => {
                      const isAllocated = allocatedSeatsList.includes(b.num);
                      const isGhost72 = b.num === 72 && !isAllocated;
                      let berthClass = 'berth-cell';
                      if (isGhost72) berthClass += ' ghost-berth';
                      else if (isAllocated) berthClass += ' allocated-berth';
                      else berthClass += ' vacant-berth';

                      return (
                        <div key={b.num} className={berthClass} title={`Berth ${b.num} (${b.name})`}>
                          <span className="berth-num">{b.num}</span>
                          <span className="berth-type">{b.type}</span>
                          {isGhost72 && <span className="ghost-tag">GHOST</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ghost Berth 72 Status Callout */}
          <div className={`ghost-berth-callout ${allocatedSeatsList.includes(72) ? 'callout-success' : 'callout-alert'}`}>
            {allocatedSeatsList.includes(72) ? (
              <>
                <CheckCircle2 size={18} />
                <span>
                  <strong>Success:</strong> Berth 72 is allocated! <code>range(1, 73)</code> included all 72 seats in Coach S1.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                <span>
                  <strong>The Range Boundary Trap:</strong> <code>range(1, 72)</code> stops at <strong>71</strong>. Berth 72 is left vacant while confirmed waitlisted passenger #72 stands outside!
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Act 3 Special Focus: Revenue Audit Counter */}
      {currentAct.act === 3 && (
        <div className="audit-counter-card">
          <div className="audit-header">
            <Award size={18} />
            <strong>Midnight Revenue Audit Terminal (Accumulator Variable Lifecycle)</strong>
          </div>
          <div className="audit-display-grid">
            <div className="audit-box">
              <span className="audit-num">5</span>
              <span className="audit-desc">Physical Passenger Slips Issued</span>
            </div>
            <div className="audit-box alert-box">
              <span className="audit-num">{scopeMap['total_confirmed'] !== undefined ? scopeMap['total_confirmed'] : 0}</span>
              <span className="audit-desc">
                System Variable <code>total_confirmed</code>
              </span>
            </div>
            <div className="audit-explanation">
              <strong>The Accumulator Bug:</strong> Notice in the Memory Watch panel how <code>total_confirmed = 0</code> runs on every iteration. Each new passenger destroys the previous tally!
            </div>
          </div>
        </div>
      )}

      {/* Central Interactive Workspace: Stepper + Memory Watch */}
      <div className="lab-dual-panel">
        {/* Left: Code Stepper */}
        <div className="glass-panel code-stepper-panel">
          <div className="panel-title-bar">
            <div className="title-with-icon">
              <Cpu size={18} />
              <span>Execution Stepper & AST Inspector</span>
            </div>
            <div className="line-counter">Line {currentStep?.line || 1}</div>
          </div>

          <div className="code-display-area">
            {traceData?.code?.split('\n').map((lineText, idx) => {
              const lineNum = idx + 1;
              const isCurrentLine = currentStep?.line === lineNum;
              return (
                <div
                  key={idx}
                  className={`code-line-row ${isCurrentLine ? 'active-exec-line' : ''}`}
                >
                  <span className="line-num">{lineNum}</span>
                  <span className="line-content">{lineText || ' '}</span>
                  {isCurrentLine && (
                    <span className="exec-pointer-badge">
                      <ChevronRight size={14} /> ACTIVE
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Description */}
          <div className="step-description-box">
            <div className="step-meta-row">
              <span className="action-type-pill">{currentStep?.actionType || 'step'}</span>
              <span className="desc-text">{currentStep?.description}</span>
            </div>
          </div>

          {/* Physical Anchor Notice */}
          {currentStep?.physicalAnchor && (
            <div className="physical-anchor-strip">
              <Sparkles size={15} />
              <span>{currentStep.physicalAnchor}</span>
            </div>
          )}

          {/* Stepper Toolbar */}
          <div className="playback-toolbar">
            <div className="playback-btn-group">
              <button className="control-btn" onClick={resetTrace} title="Reset to Step 1">
                <RefreshCw size={16} />
              </button>
              <button
                className="control-btn"
                onClick={stepPrev}
                disabled={currentStepIndex <= 0}
              >
                <ArrowLeft size={16} /> Prev
              </button>
              <button
                className={`control-btn primary-play ${isPlaying ? 'paused' : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                <span>{isPlaying ? 'Pause' : 'Auto'}</span>
              </button>
              <button
                className="control-btn"
                onClick={stepNext}
                disabled={currentStepIndex >= totalSteps - 1}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>

            <div className="speed-selector">
              <Sliders size={14} />
              <span>Speed:</span>
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  className={`speed-btn ${playbackSpeed === spd ? 'active' : ''}`}
                  onClick={() => setPlaybackSpeed(spd)}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Step Track */}
          <div className="scrub-bar-container">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="scrub-dots">
              {traceData?.steps?.map((s, idx) => (
                <button
                  key={idx}
                  className={`scrub-dot ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'passed' : ''}`}
                  onClick={() => setCurrentStepIndex(idx)}
                  title={`Step ${idx + 1}: Line ${s.line}`}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Memory Watch & Socratic Checkpoint */}
        <div className="glass-panel memory-watch-panel">
          <div className="panel-title-bar">
            <div className="title-with-icon">
              <Cpu size={18} />
              <span>Notional Machine Memory Watch</span>
            </div>
            <span className="scope-tag">{currentStep?.stackFrame || 'global_frame'}</span>
          </div>

          {/* Variable Memory Board */}
          <div className="memory-board">
            <div className="board-header">
              <span>Variable</span>
              <span>Type</span>
              <span>Memory Value</span>
            </div>
            <div className="variables-list">
              {(!currentStep?.variables || currentStep.variables.length === 0) ? (
                <div className="empty-vars">
                  <p>No variables allocated in memory at this step.</p>
                </div>
              ) : (
                currentStep.variables.map((v) => (
                  <div key={v.name} className={`var-row ${v.isUpdated ? 'mutated-flash' : ''}`}>
                    <div className="var-name-col">
                      <code>{v.name}</code>
                      {v.isUpdated && <span className="badge-mutated">Updated</span>}
                      {v.isNew && <span className="badge-new">Allocated</span>}
                    </div>
                    <div className="var-type-col">
                      <span className={`type-badge ${v.type}`}>{v.type}</span>
                    </div>
                    <div className="var-val-col">
                      <code className="val-text">{v.value}</code>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Socratic Prediction Card */}
          {currentStep?.checkpoint ? (
            <div className="socratic-prediction-box">
              <div className="predict-header">
                <HelpCircle size={18} />
                <strong>Socratic Prediction Checkpoint</strong>
              </div>
              <p className="predict-prompt">{currentStep.checkpoint.prompt}</p>
              <div className="predict-context">{currentStep.checkpoint.context}</div>

              <div className="predict-options-grid">
                {currentStep.checkpoint.options.map((opt, oIdx) => {
                  const isChosen = predictionState?.selectedIndex === oIdx;
                  let btnClass = 'predict-opt-btn';
                  if (predictionState?.answered) {
                    if (oIdx === currentStep.checkpoint.correctIndex) btnClass += ' opt-correct';
                    else if (isChosen) btnClass += ' opt-wrong';
                  }
                  return (
                    <button
                      key={oIdx}
                      className={btnClass}
                      disabled={predictionState?.answered}
                      onClick={() => submitPrediction(oIdx)}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + oIdx)}</span>
                      <span className="opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {predictionState?.answered && (
                <div className={`predict-verdict-card ${predictionState.result?.isCorrect ? 'correct' : 'incorrect'}`}>
                  <strong>{predictionState.result?.isCorrect ? '✅ Spot on!' : '💡 Think like Python:'}</strong>
                  <p>{predictionState.result?.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="socratic-idle-box">
              <Sparkles size={16} />
              <span>Step forward to watch Python state mutate in memory.</span>
            </div>
          )}

          {/* Terminal stdout */}
          <div className="console-buffer-box">
            <div className="console-title">
              <Terminal size={15} />
              <span>Standard Output (stdout)</span>
            </div>
            <div className="console-lines">
              {(!currentStep?.stdout || currentStep.stdout.length === 0) ? (
                <span className="console-empty">[No stdout output yet]</span>
              ) : (
                currentStep.stdout.map((line, lIdx) => (
                  <div key={lIdx} className="terminal-line">
                    <span className="prompt-arrow">&gt;</span> {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
