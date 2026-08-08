import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Compass, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

// ── Shared stamp data ─────────────────────────────────────────
const ALL_STAMPS = [
  'Triceratops', 'T-Rex', 'Triceratops', 'Brachiosaurus',
  'T-Rex', 'Pterodactyl', 'Triceratops', 'Pterodactyl',
  'Stegosaurus', 'T-Rex', 'Brachiosaurus', 'Pterodactyl',
];

const EMOJI: Record<string, string> = {
  Triceratops: '🦕', 'T-Rex': '🦖',
  Brachiosaurus: '🦕', Pterodactyl: '🦅', Stegosaurus: '🦕',
};

const COLOR: Record<string, string> = {
  Triceratops: '#f59e0b', 'T-Rex': '#ef4444',
  Brachiosaurus: '#10b981', Pterodactyl: '#8b5cf6', Stegosaurus: '#3b82f6',
};

// ── Approach tabs ─────────────────────────────────────────────
type ApproachId = 'sort' | 'check' | 'pile';

interface Approach {
  id: ApproachId;
  label: string;
  icon: string;
  tagline: string;
}

const APPROACHES: Approach[] = [
  { id: 'sort',  label: 'Sort & Group',      icon: '🗂️', tagline: "Arrange stamps by type, then check each pile." },
  { id: 'check', label: 'Check-as-you-add',  icon: '✋', tagline: "Go one by one — only keep a stamp if it's new." },
  { id: 'pile',  label: 'Unique Pile',        icon: '📋', tagline: "Build a separate pile of stamps you've already seen." },
];

// ══════════════════════════════════════════════════════════════
// Approach A — Sort & Group
// Drag stamps into sorted bins, then count unique bins
// ══════════════════════════════════════════════════════════════
const SortApproach: React.FC = () => {
  const [bins, setBins] = useState<Record<string, string[]>>({});
  const [queue, setQueue] = useState<string[]>([...ALL_STAMPS]);
  const [result, setResult] = useState<string | null>(null);

  const addToBin = (stamp: string) => {
    if (queue.length === 0) return;
    const next = queue[0];
    if (next !== stamp) {
      setResult(`That pile is for ${stamp}, but the next stamp is ${next}. Try placing it in the right bin!`);
      return;
    }
    setResult(null);
    setBins(prev => ({
      ...prev,
      [stamp]: [...(prev[stamp] || []), stamp],
    }));
    setQueue(prev => prev.slice(1));
  };

  const reset = () => { setBins({}); setQueue([...ALL_STAMPS]); setResult(null); };
  const done  = queue.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
        Nobita spreads all stamps on the floor and groups identical ones together.
        Click each stamp in the queue below to sort it into the correct bin.
      </p>

      {/* Queue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          📦 Remaining in box ({queue.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '38px' }}>
          {queue.slice(0, 6).map((s, i) => (
            <div key={i} style={{
              padding: '6px 12px', borderRadius: '8px', background: 'white',
              border: `1.5px solid ${i === 0 ? COLOR[s] : 'rgba(0,0,0,0.07)'}`,
              fontSize: '12px', fontWeight: 600, color: '#1e293b',
              display: 'flex', alignItems: 'center', gap: '4px',
              boxShadow: i === 0 ? `0 0 0 3px ${COLOR[s]}22` : 'none',
              opacity: i === 0 ? 1 : 0.45,
            }}>
              {EMOJI[s]} {s}
            </div>
          ))}
          {queue.length > 6 && (
            <div style={{ padding: '6px 10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
              +{queue.length - 6} more
            </div>
          )}
        </div>
      </div>

      {/* Sorting bins */}
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        🗂️ Sorted Bins — click a bin to place the next stamp
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {['Triceratops','T-Rex','Brachiosaurus','Pterodactyl','Stegosaurus'].map((name) => (
          <button
            key={name}
            onClick={() => addToBin(name)}
            disabled={done}
            style={{
              padding: '10px 14px', borderRadius: '12px',
              background: `${COLOR[name]}11`,
              border: `1.5px solid ${COLOR[name]}44`,
              cursor: done ? 'default' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              minWidth: '90px', transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '20px' }}>{EMOJI[name]}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: COLOR[name] }}>{name}</span>
            <span style={{
              fontSize: '18px', fontWeight: 900, color: COLOR[name],
              background: `${COLOR[name]}18`, borderRadius: '6px',
              padding: '2px 10px', minWidth: '28px', textAlign: 'center',
            }}>
              {(bins[name] || []).length}
            </span>
          </button>
        ))}
      </div>

      {result && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px dashed rgba(239,68,68,0.3)', fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>
          {result}
        </div>
      )}

      {done && (
        <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', fontSize: '13px', color: '#15803d', fontWeight: 600, lineHeight: 1.6 }}>
          <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Done! You found <strong>{Object.keys(bins).length} unique stamp types</strong> from {ALL_STAMPS.length} total stamps.
          <br />
          <span style={{ fontWeight: 400, color: '#475569', fontSize: '12px' }}>
            But Nobita had to touch every stamp to sort them — how long would this take with 1,000 stamps?
          </span>
        </div>
      )}

      <button onClick={reset} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
        <RotateCcw size={12} /> Reset
      </button>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Approach B — Check-as-you-add
// Process stamps one by one; decide keep or skip
// ══════════════════════════════════════════════════════════════
const CheckApproach: React.FC = () => {
  const [kept, setKept]       = useState<string[]>([]);
  const [skipped, setSkipped] = useState<number>(0);
  const [queue, setQueue]     = useState<string[]>([...ALL_STAMPS]);
  const [lastAction, setLastAction] = useState<{ stamp: string; kept: boolean } | null>(null);

  const currentStamp = queue[0] ?? null;
  const alreadySeen  = currentStamp ? kept.includes(currentStamp) : false;

  const handle = (keepIt: boolean) => {
    if (!currentStamp) return;
    if (keepIt && !alreadySeen) { setKept(prev => [...prev, currentStamp]); }
    else if (keepIt && alreadySeen) {
      setLastAction({ stamp: currentStamp, kept: false });
      setSkipped(s => s + 1);
      setQueue(prev => prev.slice(1));
      return;
    } else { setSkipped(s => s + 1); }
    setLastAction({ stamp: currentStamp, kept: keepIt && !alreadySeen });
    setQueue(prev => prev.slice(1));
  };

  const reset = () => { setKept([]); setSkipped(0); setQueue([...ALL_STAMPS]); setLastAction(null); };
  const done  = queue.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
        Nobita checks each stamp one at a time. If he already has it, he puts it back. Otherwise, he keeps it.
        You decide for each stamp below.
      </p>

      {/* Current stamp on the table */}
      {currentStamp ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '1.5px dashed rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Next stamp from the box ({queue.length} remaining)
          </div>
          <div style={{ padding: '14px 22px', borderRadius: '14px', background: 'white', border: `2px solid ${COLOR[currentStamp]}`, boxShadow: `0 4px 16px ${COLOR[currentStamp]}22`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>{EMOJI[currentStamp]}</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{currentStamp}</span>
          </div>

          {alreadySeen && (
            <div style={{ fontSize: '12px', color: '#b45309', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', padding: '6px 12px', borderRadius: '8px', fontWeight: 600 }}>
              👀 Nobita has already seen this stamp in his kept pile…
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handle(true)}
              style={{ padding: '10px 22px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.35)', color: '#15803d', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              ✅ Keep it
            </button>
            <button
              onClick={() => handle(false)}
              style={{ padding: '10px 22px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.3)', color: '#b91c1c', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              🗑️ Toss it
            </button>
          </div>
        </div>
      ) : done ? (
        <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', fontSize: '13px', color: '#15803d', fontWeight: 600, lineHeight: 1.6 }}>
          <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Done! <strong>{kept.length} unique stamps</strong> kept, <strong>{skipped} tossed</strong>.
          <br />
          <span style={{ fontWeight: 400, color: '#475569', fontSize: '12px' }}>
            For every new stamp Nobita had to scan his whole kept pile to check. The bigger the pile grows, the slower each check gets.
          </span>
        </div>
      ) : null}

      {lastAction && !done && (
        <div style={{ padding: '8px 12px', borderRadius: '8px', background: lastAction.kept ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.05)', border: `1px dashed ${lastAction.kept ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'}`, fontSize: '12px', color: lastAction.kept ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
          {lastAction.kept ? `✅ Kept ${lastAction.stamp}` : `🗑️ Tossed ${lastAction.stamp} (already had it)`}
        </div>
      )}

      {/* Kept pile preview */}
      {kept.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>KEPT SO FAR:</span>
          {kept.map((s) => (
            <span key={s} style={{ padding: '4px 10px', borderRadius: '6px', background: `${COLOR[s]}11`, border: `1px solid ${COLOR[s]}44`, fontSize: '12px', fontWeight: 700, color: COLOR[s], display: 'flex', alignItems: 'center', gap: '4px' }}>
              {EMOJI[s]} {s}
            </span>
          ))}
        </div>
      )}

      <button onClick={reset} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
        <RotateCcw size={12} /> Reset
      </button>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Approach C — Unique Pile (drag stamps into seen / new)
// ══════════════════════════════════════════════════════════════
const PileApproach: React.FC = () => {
  const [uniquePile, setUnique] = useState<string[]>([]);
  const [discarded, setDiscard] = useState<string[]>([]);
  const [queue, setQueue]       = useState<string[]>([...ALL_STAMPS]);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  const current = queue[0] ?? null;
  const done    = queue.length === 0;

  const place = (toUnique: boolean) => {
    if (!current) return;
    const alreadyIn = uniquePile.includes(current);

    if (toUnique && alreadyIn) {
      setFeedback({ msg: `${current} is already in your unique pile! It should go to discarded.`, ok: false });
      return;
    }
    if (!toUnique && !alreadyIn) {
      setFeedback({ msg: `${current} is new — it belongs in the unique pile!`, ok: false });
      return;
    }
    setFeedback(null);
    if (toUnique) setUnique(prev => [...prev, current]);
    else setDiscard(prev => [...prev, current]);
    setQueue(prev => prev.slice(1));
  };

  const reset = () => { setUnique([]); setDiscard([]); setQueue([...ALL_STAMPS]); setFeedback(null); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
        Nobita builds two piles: <strong>Unique stamps I've never seen</strong> and <strong>Duplicates to discard</strong>.
        Decide where each stamp belongs.
      </p>

      {current && !done && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '1.5px dashed rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            From box ({queue.length} left) — where does this go?
          </div>
          <div style={{ padding: '14px 22px', borderRadius: '14px', background: 'white', border: `2px solid ${COLOR[current]}`, boxShadow: `0 4px 16px ${COLOR[current]}22`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>{EMOJI[current]}</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{current}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => place(true)} style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(0,140,255,0.08)', border: '1.5px solid rgba(0,140,255,0.3)', color: '#0369a1', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              📋 Unique Pile
            </button>
            <button onClick={() => place(false)} style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.3)', color: '#b91c1c', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              🗑️ Discard
            </button>
          </div>
          {feedback && (
            <div style={{ padding: '8px 14px', borderRadius: '8px', background: feedback.ok ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.06)', border: `1px dashed ${feedback.ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'}`, fontSize: '12px', color: feedback.ok ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      {done && (
        <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', fontSize: '13px', color: '#15803d', fontWeight: 600, lineHeight: 1.6 }}>
          <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Unique pile has <strong>{uniquePile.length} stamps</strong>. Discarded <strong>{discarded.length}</strong>.
          <br />
          <span style={{ fontWeight: 400, color: '#475569', fontSize: '12px' }}>
            The unique pile is exactly what Suneo needs to check against — no repeats, no noise.
          </span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        {uniquePile.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', marginBottom: '6px' }}>UNIQUE PILE ({uniquePile.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {uniquePile.map((s, i) => (
                <span key={i} style={{ padding: '4px 9px', borderRadius: '6px', background: 'rgba(0,140,255,0.08)', border: '1px solid rgba(0,140,255,0.2)', fontSize: '11px', fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {EMOJI[s]} {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {discarded.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', marginBottom: '6px' }}>DISCARDED ({discarded.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {discarded.map((s, i) => (
                <span key={i} style={{ padding: '4px 9px', borderRadius: '6px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '11px', fontWeight: 600, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '3px', opacity: 0.7 }}>
                  {EMOJI[s]} {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button onClick={reset} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
        <RotateCcw size={12} /> Reset
      </button>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Main Exploration component
// ══════════════════════════════════════════════════════════════
export const Exploration: React.FC = () => {
  const [active, setActive] = useState<ApproachId>('sort');
  const [triedAll, setTried] = useState<Set<ApproachId>>(new Set(['sort']));

  const select = (id: ApproachId) => {
    setActive(id);
    setTried(prev => new Set([...prev, id]));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={16} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>EXPLORATION</span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>Help Nobita Solve It</h2>
        <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
          Suneo is counting down. Doraemon steps back: <em>"Try it yourself first, Nobita."</em><br />
          Pick an approach below and see how far you get.
        </p>
      </div>

      {/* Approach selector */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {APPROACHES.map((a) => {
          const isActive  = active === a.id;
          const hasTried  = triedAll.has(a.id);
          return (
            <button
              key={a.id}
              onClick={() => select(a.id)}
              style={{
                flex: '1 1 0', minWidth: '130px',
                padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                background: isActive ? 'rgba(245,158,11,0.08)' : 'white',
                border: isActive ? '2px solid #f59e0b' : '1.5px solid rgba(0,0,0,0.07)',
                boxShadow: isActive ? '0 0 0 3px rgba(245,158,11,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease', textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{a.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: isActive ? '#92400e' : '#0f172a', marginBottom: '2px' }}>
                {a.label}
                {hasTried && !isActive && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#22c55e' }}>✓ tried</span>}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>{a.tagline}</div>
            </button>
          );
        })}
      </div>

      {/* Active approach panel */}
      <GlassCard style={{ padding: '22px 24px', background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(245,158,11,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '18px' }}>{APPROACHES.find(a => a.id === active)?.icon}</span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400e' }}>
            {APPROACHES.find(a => a.id === active)?.label}
          </span>
          <ArrowRight size={13} style={{ color: '#d97706' }} />
          <span style={{ fontSize: '12px', color: '#78716c' }}>
            {APPROACHES.find(a => a.id === active)?.tagline}
          </span>
        </div>

        {active === 'sort'  && <SortApproach />}
        {active === 'check' && <CheckApproach />}
        {active === 'pile'  && <PileApproach />}
      </GlassCard>

      {/* Reflection nudge once all 3 tried */}
      {triedAll.size === 3 && (
        <GlassCard style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(255,255,255,0.75) 100%)',
          border: '1.5px solid rgba(245,158,11,0.25)',
        }} className="animate-fade-in">
          <p style={{ fontSize: '13px', color: '#78350f', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
            🤔 You tried all three approaches. Each one works — but each one requires <em>you</em> to check for duplicates yourself.
            What if the box could refuse to hold duplicates in the first place?
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default Exploration;
