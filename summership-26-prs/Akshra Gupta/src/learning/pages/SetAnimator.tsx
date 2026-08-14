import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

// ── Source data: Nobita's original 12 stamps in arrival order ─
interface Stamp {
  id: number;
  name: string;
  emoji: string;
  color: string;
}

const SOURCE: Stamp[] = [
  { id: 0,  name: 'Triceratops',   emoji: '🦕', color: '#f59e0b' },
  { id: 1,  name: 'T-Rex',         emoji: '🦖', color: '#ef4444' },
  { id: 2,  name: 'Triceratops',   emoji: '🦕', color: '#f59e0b' },
  { id: 3,  name: 'Brachiosaurus', emoji: '🦕', color: '#10b981' },
  { id: 4,  name: 'T-Rex',         emoji: '🦖', color: '#ef4444' },
  { id: 5,  name: 'Pterodactyl',   emoji: '🦅', color: '#8b5cf6' },
  { id: 6,  name: 'Triceratops',   emoji: '🦕', color: '#f59e0b' },
  { id: 7,  name: 'Pterodactyl',   emoji: '🦅', color: '#8b5cf6' },
  { id: 8,  name: 'Stegosaurus',   emoji: '🦕', color: '#3b82f6' },
  { id: 9,  name: 'T-Rex',         emoji: '🦖', color: '#ef4444' },
  { id: 10, name: 'Brachiosaurus', emoji: '🦕', color: '#10b981' },
  { id: 11, name: 'Pterodactyl',   emoji: '🦅', color: '#8b5cf6' },
];

type StampState = 'idle' | 'active' | 'accepted' | 'ejected';

interface StampEntry extends Stamp {
  state: StampState;
  animKey: number;  // bump to re-trigger CSS animation
}

const STEP_MS = 900; // ms between auto-steps

// ── Component ─────────────────────────────────────────────────
export const SetAnimator: React.FC = () => {
  const buildInitial = (): StampEntry[] =>
    SOURCE.map(s => ({ ...s, state: 'idle', animKey: 0 }));

  const [entries, setEntries]     = useState<StampEntry[]>(buildInitial);
  const [uniqueSet, setUniqueSet] = useState<Stamp[]>([]);
  const [cursor, setCursor]       = useState<number>(-1);   // which stamp is being processed
  const [running, setRunning]     = useState(false);
  const [done, setDone]           = useState(false);
  const [log, setLog]             = useState<{ text: string; type: 'new' | 'dup' }[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Process one stamp ──────────────────────────────────────
  const processNext = useCallback((currentEntries: StampEntry[], currentSet: Stamp[], currentCursor: number) => {
    const nextIdx = currentCursor + 1;
    if (nextIdx >= SOURCE.length) {
      setRunning(false);
      setDone(true);
      return;
    }

    const stamp = currentEntries[nextIdx];
    const isDup = currentSet.some(s => s.name === stamp.name);

    // Mark active (highlight in queue)
    setEntries(prev => prev.map((e, i) =>
      i === nextIdx ? { ...e, state: 'active', animKey: e.animKey + 1 } : e
    ));

    // After brief pause apply outcome
    timerRef.current = setTimeout(() => {
      const logEntry = isDup
        ? { text: `"${stamp.name}" already exists → removed`, type: 'dup' as const }
        : { text: `"${stamp.name}" is new → added to Set`, type: 'new' as const };

      setLog(prev => [logEntry, ...prev].slice(0, 6));

      if (isDup) {
        setEntries(prev => prev.map((e, i) =>
          i === nextIdx ? { ...e, state: 'ejected', animKey: e.animKey + 1 } : e
        ));
      } else {
        setEntries(prev => prev.map((e, i) =>
          i === nextIdx ? { ...e, state: 'accepted', animKey: e.animKey + 1 } : e
        ));
        setUniqueSet(prev => [...prev, stamp]);
      }

      setCursor(nextIdx);
    }, 350);
  }, []);

  // ── Auto-run loop ──────────────────────────────────────────
  useEffect(() => {
    if (!running || done) return;

    timerRef.current = setTimeout(() => {
      setEntries(prev => {
        setUniqueSet(prevSet => {
          setCursor(prevCursor => {
            processNext(prev, prevSet, prevCursor);
            return prevCursor;
          });
          return prevSet;
        });
        return prev;
      });
    }, STEP_MS);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [running, cursor, done, processNext]);

  // ── Step once ─────────────────────────────────────────────
  const stepOnce = () => {
    if (done) return;
    setRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setEntries(prev => {
      let result = prev;
      setUniqueSet(prevSet => {
        setCursor(prevCursor => {
          processNext(result, prevSet, prevCursor);
          return prevCursor;
        });
        return prevSet;
      });
      return result;
    });
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setEntries(buildInitial());
    setUniqueSet([]);
    setCursor(-1);
    setRunning(false);
    setDone(false);
    setLog([]);
  };

  const toggleRun = () => setRunning(r => !r);

  // Count helpers
  const numDups    = entries.filter(e => e.state === 'ejected').length;
  const numAdded   = uniqueSet.length;
  const numPending = entries.filter(e => e.state === 'idle').length;

  return (
    <GlassCard style={{
      padding: '24px',
      background: 'rgba(255,255,255,0.88)',
      border: '1.5px solid rgba(0,140,255,0.12)',
    }}>
      {/* Section header */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          ⚙️ Interactive Visual
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
          Watch duplicates disappear as the Set is built
        </h3>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
          Each stamp is checked against the Set. If it's already there — it vanishes. If it's new — it joins.
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {[
          { label: 'In box',   value: numPending, bg: 'rgba(0,0,0,0.04)',          color: '#475569' },
          { label: 'Removed',  value: numDups,    bg: 'rgba(239,68,68,0.07)',       color: '#b91c1c' },
          { label: 'In Set',   value: numAdded,   bg: 'rgba(34,197,94,0.08)',       color: '#15803d' },
        ].map(s => (
          <div key={s.label} style={{
            flex: '1 1 0', padding: '10px 14px', borderRadius: '10px',
            background: s.bg, border: '1px solid rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout: queue | set */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'start', marginBottom: '18px' }}>

        {/* Left: stamp queue */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            📦 Nobita's box
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '80px' }}>
            {entries.map((e) => {
              const isActive   = e.state === 'active';
              const isEjected  = e.state === 'ejected';
              const isAccepted = e.state === 'accepted';
              const isIdle     = e.state === 'idle';

              let className = '';
              if (isEjected)  className = 'stamp-eject';
              if (isAccepted) className = 'stamp-accept';

              return (
                <div
                  key={`${e.id}-${e.animKey}`}
                  className={className}
                  style={{
                    padding: '6px 10px', borderRadius: '9px',
                    background: isActive
                      ? `${e.color}18`
                      : isAccepted
                        ? 'rgba(34,197,94,0.07)'
                        : 'white',
                    border: isActive
                      ? `2px solid ${e.color}`
                      : isAccepted
                        ? '1.5px solid rgba(34,197,94,0.35)'
                        : isEjected
                          ? '1.5px solid rgba(239,68,68,0.3)'
                          : '1px solid rgba(0,0,0,0.07)',
                    boxShadow: isActive ? `0 0 0 3px ${e.color}22` : 'none',
                    fontSize: '12px', fontWeight: 600,
                    color: isEjected ? '#b91c1c' : '#1e293b',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    opacity: isIdle ? 1 : isEjected ? 0.55 : 1,
                    transition: 'border 0.2s, background 0.2s',
                    position: 'relative',
                  }}
                >
                  {isEjected && (
                    <span style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', pointerEvents: 'none',
                    }}>❌</span>
                  )}
                  <span>{e.emoji}</span>
                  <span style={{ textDecoration: isEjected ? 'line-through' : 'none', fontSize: '11px' }}>{e.name}</span>
                  {isActive && (
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: e.color, flexShrink: 0,
                      boxShadow: `0 0 6px ${e.color}`,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '28px' }}>
          <div style={{ fontSize: '22px', color: '#94a3b8' }}>→</div>
        </div>

        {/* Right: the Set */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            ✅ The Set (unique only)
          </div>
          <div style={{
            minHeight: '80px', padding: '10px',
            borderRadius: '12px', border: '2px dashed rgba(34,197,94,0.35)',
            background: 'rgba(34,197,94,0.03)',
            display: 'flex', flexWrap: 'wrap', gap: '6px', alignContent: 'flex-start',
          }}>
            {uniqueSet.length === 0 && (
              <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', padding: '4px' }}>
                empty…
              </span>
            )}
            {uniqueSet.map((s, i) => (
              <div
                key={i}
                className="stamp-accept stamp-glow"
                style={{
                  padding: '6px 10px', borderRadius: '9px',
                  background: `${s.color}10`,
                  border: `1.5px solid ${s.color}44`,
                  fontSize: '11px', fontWeight: 700, color: s.color,
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <span>{s.emoji}</span>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live log */}
      {log.length > 0 && (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {log.map((entry, i) => (
            <div
              key={i}
              className={i === 0 ? 'animate-fade-in' : ''}
              style={{
                padding: '7px 12px', borderRadius: '8px', fontSize: '12px',
                fontWeight: i === 0 ? 700 : 500,
                background: entry.type === 'new'
                  ? 'rgba(34,197,94,0.06)'
                  : 'rgba(239,68,68,0.05)',
                border: entry.type === 'new'
                  ? '1px solid rgba(34,197,94,0.2)'
                  : '1px solid rgba(239,68,68,0.15)',
                color: entry.type === 'new' ? '#15803d' : '#b91c1c',
                opacity: 1 - i * 0.18,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span>{entry.type === 'new' ? '✅' : '🚫'}</span>
              {entry.text}
            </div>
          ))}
        </div>
      )}

      {/* Done banner */}
      {done && (
        <div style={{
          marginBottom: '16px', padding: '14px 18px', borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(255,255,255,0.6) 100%)',
          border: '1.5px solid rgba(34,197,94,0.3)',
          fontSize: '13px', color: '#15803d', fontWeight: 700, lineHeight: 1.6,
        }} className="animate-fade-in">
          🎉 Done! {SOURCE.length} stamps → <strong>{uniqueSet.length} unique</strong> kept,{' '}
          <strong>{numDups} duplicates</strong> removed automatically.
          <div style={{ fontWeight: 400, fontSize: '12px', color: '#475569', marginTop: '4px' }}>
            The Set did in one pass what took you three attempts manually — and it never needs reminding of the rule.
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={toggleRun}
          disabled={done}
          style={{
            padding: '10px 20px', borderRadius: '10px',
            background: running ? 'rgba(239,68,68,0.09)' : 'rgba(0,140,255,0.09)',
            border: running ? '1.5px solid rgba(239,68,68,0.3)' : '1.5px solid rgba(0,140,255,0.3)',
            color: running ? '#b91c1c' : '#0369a1',
            fontWeight: 700, fontSize: '13px',
            cursor: done ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            opacity: done ? 0.5 : 1,
          }}
        >
          <Play size={13} />
          {running ? 'Pause' : cursor === -1 ? 'Start animation' : 'Resume'}
        </button>

        <button
          onClick={stepOnce}
          disabled={done || running}
          style={{
            padding: '10px 18px', borderRadius: '10px',
            background: 'rgba(245,158,11,0.08)',
            border: '1.5px solid rgba(245,158,11,0.3)',
            color: '#92400e', fontWeight: 700, fontSize: '13px',
            cursor: done || running ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            opacity: done || running ? 0.5 : 1,
          }}
        >
          <SkipForward size={13} />
          Step
        </button>

        <button
          onClick={reset}
          style={{
            padding: '10px 16px', borderRadius: '10px',
            background: 'none', border: '1px solid rgba(0,0,0,0.1)',
            color: '#64748b', fontWeight: 600, fontSize: '13px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>
    </GlassCard>
  );
};

export default SetAnimator;
