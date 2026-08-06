import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Code2, Eye, Database } from 'lucide-react';

const INSPECTOR_DATA = {
  red_hood: {
    grandma: {
      vars: [
        { name: 'guest_type', type: 'str',    val: '"grandma"'                 },
        { name: 'guest',      type: 'object', val: '<Grandma Object>'           },
      ],
      avail:   ['.bake_pastries()', '.speak()', '.hug()'],
      missing: [],
      status: 'SAFE — No exception raised',
      statusOk: true,
    },
    wolf: {
      vars: [
        { name: 'guest_type', type: 'str',    val: '"wolf"'                    },
        { name: 'guest',      type: 'object', val: '<Wolf Object>'              },
      ],
      avail:   ['.growl()', '.speak()', '.sleep()'],
      missing: ['.bake_pastries()  ← AttributeError!'],
      status: '⚠️ AttributeError — Wolf has no .bake_pastries()',
      statusOk: false,
    },
  },
  tortoise_hare: {
    0: {
      vars: [
        { name: 'distance',   type: 'int',  val: '100' },
        { name: 'hare_speed', type: 'int',  val: '0'   },
        { name: 'is_napping', type: 'bool', val: 'True' },
      ],
      avail:   ['distance', 'hare_speed'],
      missing: ['100 / 0  ← ZeroDivisionError!'],
      status: '⚠️ ZeroDivisionError — Cannot divide by zero!',
      statusOk: false,
    },
    10: {
      vars: [
        { name: 'distance',   type: 'int',  val: '100'   },
        { name: 'hare_speed', type: 'int',  val: '10'    },
        { name: 'time_taken', type: 'float',val: '10.0'  },
      ],
      avail:   ['distance', 'hare_speed', 'time_taken = 10.0'],
      missing: [],
      status: 'SAFE — else: block runs, time_taken = 10.0',
      statusOk: true,
    },
  },
  goldilocks: {
    2: {
      vars: [
        { name: 'porridge_bowls', type: 'list[3]', val: '["Hot","Cold","Right"]' },
        { name: 'selected_index', type: 'int',     val: '2'                      },
        { name: 'choice',         type: 'str',     val: '"Just Right ✨"'         },
      ],
      avail:   ['bowls[0]', 'bowls[1]', 'bowls[2]'],
      missing: [],
      status: 'SAFE — bowls[2] = "Just Right ✨"',
      statusOk: true,
    },
    5: {
      vars: [
        { name: 'porridge_bowls', type: 'list[3]', val: '["Hot","Cold","Right"]' },
        { name: 'selected_index', type: 'int',     val: '5'                      },
      ],
      avail:   ['bowls[0]', 'bowls[1]', 'bowls[2]'],
      missing: ['bowls[5]  ← IndexError! Only index 0-2 valid'],
      status: '⚠️ IndexError — Index 5 out of range (length 3)',
      statusOk: false,
    },
  },
  three_pigs: {
    straw: {
      vars: [
        { name: 'material',     type: 'str',  val: '"straw"' },
        { name: 'site_locked',  type: 'bool', val: 'False → True (finally)' },
      ],
      avail:   ['build_house()', 'cleanup_tools()', 'lock_site()'],
      missing: ['straw house  ← Wolf blows it down! Exception raised'],
      status: '⚠️ Exception — Straw house blown down; finally: still runs!',
      statusOk: false,
    },
    brick: {
      vars: [
        { name: 'material',    type: 'str',  val: '"brick"'              },
        { name: 'site_locked', type: 'bool', val: 'False → True (finally)' },
      ],
      avail:   ['build_house()', 'cleanup_tools()', 'lock_site()'],
      missing: [],
      status: 'SAFE — Brick house stands; finally: still runs!',
      statusOk: true,
    },
  },
  hansel_gretel: {
    eaten: {
      vars: [
        { name: 'trail_file',    type: 'str',  val: '"breadcrumbs_trail.txt"' },
        { name: 'file_exists',   type: 'bool', val: 'False'                   },
      ],
      avail:   ['compass.navigate()'],
      missing: ['"breadcrumbs_trail.txt"  ← FileNotFoundError!'],
      status: '⚠️ FileNotFoundError — Birds ate all the breadcrumbs!',
      statusOk: false,
    },
    intact: {
      vars: [
        { name: 'trail_file', type: 'str',  val: '"breadcrumbs_trail.txt"' },
        { name: 'file_exists',type: 'bool', val: 'True'                    },
        { name: 'path_data',  type: 'str',  val: '"HOME: N52 E13"'          },
      ],
      avail:   ['trail_file.read()', 'path_data'],
      missing: [],
      status: 'SAFE — Trail file found, path read successfully',
      statusOk: true,
    },
  },
  jack_beanstalk: {
    str_val: {
      vars: [
        { name: 'magic_beans', type: 'str', val: '"5"  ← String, not int!' },
      ],
      avail:   ['int(magic_beans)', 'str(magic_beans)'],
      missing: ['"5" + 3  ← TypeError! str + int invalid'],
      status: '⚠️ TypeError — Cannot add str "5" and int 3',
      statusOk: false,
    },
    int_val: {
      vars: [
        { name: 'magic_beans', type: 'int',  val: '5'        },
        { name: 'total',       type: 'int',  val: '8'        },
      ],
      avail:   ['magic_beans + 3', 'magic_beans * 2'],
      missing: [],
      status: 'SAFE — 5 + 3 = 8 magic potions',
      statusOk: true,
    },
  },
  aladdin_genie: {
    excess: {
      vars: [
        { name: 'requested_wishes', type: 'int', val: '5 (exceeds max=3!)' },
        { name: 'cosmic_rule',      type: 'int', val: 'MAX_WISHES = 3'     },
      ],
      avail:   ['genie.grant(1)', 'genie.grant(2)', 'genie.grant(3)'],
      missing: ['genie.grant(4)', 'genie.grant(5)  ← PermissionError!'],
      status: '⚠️ PermissionError — Max 3 wishes allowed by cosmic law!',
      statusOk: false,
    },
    normal: {
      vars: [
        { name: 'requested_wishes', type: 'int', val: '2'               },
        { name: 'wishes_granted',   type: 'int', val: '2'               },
      ],
      avail:   ['genie.grant(1)', 'genie.grant(2)'],
      missing: [],
      status: 'SAFE — 2 wishes granted within cosmic limit!',
      statusOk: true,
    },
  },
  cinderella: {
    past_midnight: {
      vars: [
        { name: 'current_time',   type: 'str',  val: '"00:01 AM"'        },
        { name: 'time_remaining', type: 'int',  val: '0 (spell expired!)' },
      ],
      avail:   ['escape_to_carriage()', 'remove_glass_slipper()'],
      missing: ['dance_at_ball()  ← TimeoutError! Spell expired'],
      status: '⚠️ TimeoutError — Fairy godmother spell expired at midnight!',
      statusOk: false,
    },
    before_midnight: {
      vars: [
        { name: 'current_time',   type: 'str', val: '"11:45 PM"'    },
        { name: 'time_remaining', type: 'int', val: '15 (minutes)'  },
      ],
      avail:   ['dance_at_ball()', 'talk_to_prince()'],
      missing: [],
      status: 'SAFE — 15 minutes remaining, dancing continues!',
      statusOk: true,
    },
  },
  pied_piper: {
    infinite: {
      vars: [
        { name: 'rat_count',     type: 'int',     val: '10**12'                   },
        { name: 'memory_needed', type: 'str',     val: '~8 TB RAM  ← Impossible!' },
      ],
      avail:   ['process_in_batches(100)'],
      missing: ['[0] * (10**12)  ← MemoryError! System RAM exhausted'],
      status: '⚠️ MemoryError — Cannot allocate 8 TB for rat array!',
      statusOk: false,
    },
    batch: {
      vars: [
        { name: 'batch_size',     type: 'int', val: '100'          },
        { name: 'rats_processed', type: 'int', val: '0 → 100 → ...' },
      ],
      avail:   ['process_in_batches(100)', 'rats_array[0:100]'],
      missing: [],
      status: 'SAFE — Processing 100 rats at a time; memory safe!',
      statusOk: true,
    },
  },
  cried_wolf: {
    prank: {
      vars: [
        { name: 'alarm_type', type: 'str', val: '"prank"' },
        { name: 'error_raised', type: 'class', val: 'ValueError' },
      ],
      avail:   ['raise ValueError()', 'catch_prank_alarm()'],
      missing: [],
      status: '⚠️ ValueError raised — Prank alarm detected!',
      statusOk: false,
    },
    real_wolf: {
      vars: [
        { name: 'alarm_type',   type: 'str',   val: '"real_wolf"'     },
        { name: 'error_raised', type: 'class', val: 'WolfAlarmError'  },
      ],
      avail:   ['raise WolfAlarmError()', 'assemble_villagers()'],
      missing: [],
      status: '🚨 WolfAlarmError raised — REAL WOLF SPOTTED!',
      statusOk: false,
    },
  },
};

export function DebuggerSimulator({ story, currentCondition, onConditionChange, onActivityDone }) {
  const [lineIdx, setLineIdx]     = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs]           = useState([]);
  const intervalRef               = useRef(null);
  const activityFiredRef          = useRef(false);

  const lines = story.sentenceMappings;
  const total = lines.length;

  // Generate a log message for each step based on story + condition
  const logForStep = (idx) => {
    const map = lines[idx];
    if (!map) return null;
    if (idx === 0) return `▶ Entering try: block — ${map.sentence}`;
    if (map.conceptTag.includes('EXCEPT') || map.conceptTag.includes('ERROR')) {
      return `🚨 ${map.conceptTag}: ${map.explanation}`;
    }
    if (map.conceptTag.includes('FINALLY')) {
      return `🔒 FINALLY executing: ${map.explanation}`;
    }
    if (map.conceptTag.includes('ELSE')) {
      return `✅ else: block: ${map.explanation}`;
    }
    return `  → L${idx + 1}: ${map.explanation}`;
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setLineIdx(0);
    setLogs([]);
  };

  // Fire activity done when user reaches the last step
  useEffect(() => {
    if (lineIdx >= total - 1 && total > 0) {
      onActivityDone && onActivityDone();
    }
  }, [lineIdx, total]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { reset(); }, [story.id, currentCondition]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setLineIdx(prev => {
          if (prev >= total - 1) { setIsPlaying(false); return prev; }
          const next = prev + 1;
          const msg  = logForStep(next);
          if (msg) setLogs(l => [...l, msg]);
          return next;
        });
      }, 900);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, total]);

  const stepNext = () => {
    if (lineIdx < total - 1) {
      const next = lineIdx + 1;
      setLineIdx(next);
      const msg = logForStep(next);
      if (msg) setLogs(l => [...l, msg]);
    }
  };
  const stepBack = () => {
    if (lineIdx > 0) {
      setLineIdx(prev => prev - 1);
      setLogs(l => l.slice(0, -1));
    }
  };

  const condKey    = String(currentCondition);
  const storyInsp  = INSPECTOR_DATA[story.id] || {};
  const inspector  = storyInsp[condKey] || storyInsp[currentCondition] || { vars: [], avail: [], missing: [], status: '', statusOk: true };
  const currentMap = lines[lineIdx] || lines[0];

  // line type → css class
  const lineClass = (map) => {
    const t = map.conceptTag || '';
    if (t.includes('TRY') || t.includes('SETUP') || t.includes('DEFINITION') || t.includes('DATA') || t.includes('START')) return 'ct-try';
    if (t.includes('EXCEPT') || t.includes('ERROR') || t.includes('CATCH') || t.includes('MEMORY') || t.includes('TIMEOUT') || t.includes('PERMISSION') || t.includes('COLLAPSE') || t.includes('CONVERSION') || t.includes('RECOVERY') || t.includes('ESCAPE') || t.includes('BATCH') || t.includes('HANDLER')) return 'ct-except';
    if (t.includes('ELSE') || t.includes('SUCCESS') || t.includes('CLEAN FINISH')) return 'ct-else';
    if (t.includes('FINALLY') || t.includes('CLEANUP')) return 'ct-finally';
    if (t.includes('RISKY') || t.includes('FILE') || t.includes('CHECK') || t.includes('RAISE') || t.includes('PERMISSION CHECK') || t.includes('RESOURCE') || t.includes('ACTION')) return 'ct-risky';
    return 'ct-code';
  };

  return (
    <div className="dbg-root">
      {/* Condition Switcher */}
      <div className="dbg-header">
        <div className="dbg-condition-box">
          <span className="dbg-label">Story Condition:</span>
          <div className="opt-buttons-row">
            {story.animationState.options.map(opt => (
              <button
                key={String(opt.val)}
                className={`opt-btn ${currentCondition === opt.val ? 'active' : ''}`}
                onClick={() => {
                  onConditionChange(opt.val);
                  if (!activityFiredRef.current) {
                    activityFiredRef.current = true;
                    onActivityDone && onActivityDone();
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <small className="dbg-condition-desc">
            {(story.animationState.options.find(o => o.val === currentCondition) || {}).desc || ''}
          </small>
        </div>

        {/* Debugger Controls */}
        <div className="dbg-controls">
          <button className="dbg-btn" onClick={stepBack}  disabled={lineIdx === 0}>
            <SkipBack size={15} /> Back
          </button>
          <button className={`dbg-btn play ${isPlaying ? 'pause' : ''}`} onClick={() => setIsPlaying(p => !p)}>
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? 'Pause' : 'Auto Play'}
          </button>
          <button className="dbg-btn" onClick={stepNext} disabled={lineIdx === total - 1}>
            Next <SkipForward size={15} />
          </button>
          <button className="dbg-btn reset" onClick={reset}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="dbg-main-grid">
        {/* LEFT: Animated Visual Stage + Code Tracer */}
        <div className="dbg-left">
          {/* Stage */}
          <div className="dbg-stage-card">
            <div className="dbg-stage-header">
              <h4>🎬 Animated Stage</h4>
              <span className="step-chip">Step {lineIdx + 1} / {total}</span>
            </div>
            <div className="dbg-stage-body">
              <div className="stage-character">{story.icon} {story.character}</div>
              <div className="stage-sentence-box">
                <p className="stage-sentence">"{currentMap?.sentence}"</p>
                <span className={`stage-tag-pill ${inspector.statusOk ? 'tag-ok' : 'tag-err'}`}>
                  {currentMap?.conceptTag}
                </span>
              </div>
              <div className={`stage-status-bar ${inspector.statusOk ? 'status-ok' : 'status-err'}`}>
                {inspector.status}
              </div>
            </div>
          </div>

          {/* Code Line Tracer */}
          <div className="dbg-tracer-card">
            <div className="dbg-tracer-header"><Code2 size={15} /> Code Line Tracer</div>
            <div className="dbg-tracer-window">
              {lines.map((map, idx) => (
                <div key={map.stepNumber} className={`dbg-code-line ${lineClass(map)} ${idx === lineIdx ? 'active-line' : idx < lineIdx ? 'done-line' : ''}`}>
                  <span className="dbg-line-num">{String(idx + 1).padStart(2, '0')}</span>
                  <code>{map.codeLine}</code>
                </div>
              ))}
            </div>

            {/* Console */}
            <div className="dbg-console">
              <div className="dbg-console-hdr">▶ Console Output</div>
              <div className="dbg-console-body">
                {logs.length === 0
                  ? <span className="console-idle">Click "Auto Play" or "Next" to step through code...</span>
                  : logs.map((l, i) => <div key={i} className="console-log">{l}</div>)
                }
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Variable + Object Inspector */}
        <div className="dbg-inspector-card">
          <div className="insp-header">
            <Database size={15} />
            <h4>Live Variable & Object Inspector</h4>
          </div>

          <div className="insp-section">
            <div className="insp-section-label">🔢 Active Scope Variables</div>
            <div className="insp-vars">
              {inspector.vars.map(v => (
                <div key={v.name} className="insp-var-row">
                  <code className="insp-var-name">{v.name}</code>
                  <span className="insp-var-type">{v.type}</span>
                  <code className="insp-var-val">{v.val}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="insp-section">
            <div className="insp-section-label">✅ Available Methods / Operations</div>
            <div className="insp-avail">
              {inspector.avail.map(m => (
                <span key={m} className="insp-avail-pill">{m}</span>
              ))}
            </div>
          </div>

          {inspector.missing.length > 0 && (
            <div className="insp-section">
              <div className="insp-section-label error-label">🚨 Missing / Error Methods</div>
              <div className="insp-missing">
                {inspector.missing.map(m => (
                  <span key={m} className="insp-missing-pill">{m}</span>
                ))}
              </div>
            </div>
          )}

          <div className={`insp-status-box ${inspector.statusOk ? 'status-ok' : 'status-err'}`}>
            <Eye size={14} />
            <span>{inspector.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
