import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, RotateCcw, Terminal } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

/* ======================================================================
   THE HASHING STORY — 8 tiny scenes, one idea per scene.

   The ONE recipe used everywhere (so the numbers always agree):
     Step 1  Turn every letter into a number   (a=1, b=2 ... z=26)
     Step 2  Add the numbers up                 (the total)
     Step 3  Wrap the total into 10 drawers     (total % 10 = drawer #)
   ====================================================================== */

const DRAWERS = 10;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

const letterValue = (ch) => {
  const n = ch.toLowerCase().charCodeAt(0) - 96;
  return n >= 1 && n <= 26 ? n : 0;
};

const cleanWord = (w) => (w || '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 10);

const hashWord = (word) => {
  const letters = cleanWord(word).split('').map((ch) => ({ ch, value: letterValue(ch) }));
  const sum = letters.reduce((t, l) => t + l.value, 0);
  return { letters, sum, drawer: sum % DRAWERS };
};

const SCENES = [
  { title: 'The Million-Drawer Problem', img: '/sly_searching.png' },
  { title: 'The Letter Scroll', img: '/sly_reading.png' },
  { title: 'The Adding Pot', img: '/sly_reading.png' },
  { title: 'The Wrap-Around Walk', img: '/sly_searching.png' },
  { title: 'The Magic Formula', img: '/sly_reading.png' },
  { title: 'Hide a Treasure', img: '/sly_finding.png' },
  { title: 'Find It Again', img: '/sly_finding.png' },
  { title: 'Oops! Two in One Drawer', img: '/sly_searching.png' },
  { title: 'The Big Picture', img: '/sly_finding.png' }
];

/* ---------- small shared UI pieces ---------- */

const panelStyle = {
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  padding: '18px',
  marginBottom: '16px'
};

const Panel = ({ children, style }) => <div style={{ ...panelStyle, ...style }}>{children}</div>;

const Sly = ({ img, children }) => (
  <div className="story-speech-bubble" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
    <img
      src={img}
      alt="Sly the Goblin"
      style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--secondary)' }}
    />
    <div style={{ flex: 1 }}>
      <div className="story-speech-author"><span>🧝 SLY SAYS:</span></div>
      {children}
    </div>
  </div>
);

const NerdNote = ({ show, children }) =>
  show ? (
    <div style={{ background: 'rgba(138,43,226,0.12)', border: '1px solid rgba(138,43,226,0.35)', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', fontSize: '0.85rem', color: '#E6D3FF', fontFamily: 'monospace' }}>
      <Terminal size={14} style={{ display: 'inline', marginRight: '6px' }} />
      <strong>NERD MODE:</strong> {children}
    </div>
  ) : null;

const Say = ({ children }) => <p style={{ margin: '0 0 10px 0', lineHeight: 1.6 }}>{children}</p>;

const Chip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? 'var(--secondary)' : 'rgba(255,255,255,0.08)',
      color: active ? '#000' : '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '6px 12px',
      fontSize: '0.85rem',
      fontWeight: 700,
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

const DrawerRow = ({ contents = {}, highlight = null, marker = null }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DRAWERS}, 1fr)`, gap: '6px' }}>
    {Array.from({ length: DRAWERS }, (_, d) => {
      const items = contents[d] || [];
      const isHi = highlight === d;
      return (
        <div key={d} style={{ textAlign: 'center' }}>
          <div style={{ height: '24px', fontSize: '1.1rem' }}>{marker === d ? '🧝' : ''}</div>
          <motion.div
            animate={isHi ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background: isHi ? 'var(--success)' : 'rgba(0,0,0,0.4)',
              color: isHi ? '#000' : '#fff',
              border: isHi ? '2px solid #fff' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '10px 0',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}
          >
            #{d}
          </motion.div>
          <div style={{ minHeight: '36px', fontSize: '0.68rem', color: 'var(--accent)', marginTop: '4px', fontFamily: 'monospace', lineHeight: 1.3 }}>
            {items.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

const LetterTiles = ({ letters, showValues = true, activeIndex = -1 }) => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
    {letters.map((l, i) => (
      <div
        key={i}
        style={{
          minWidth: '52px',
          textAlign: 'center',
          background: activeIndex === i ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.06)',
          border: activeIndex === i ? '2px solid var(--secondary)' : '1px solid rgba(255,255,255,0.15)',
          borderRadius: '10px',
          padding: '8px 6px'
        }}
      >
        <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--secondary)' }}>{l.ch}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: showValues ? '#fff' : 'transparent' }}>{showValues ? l.value : '?'}</div>
      </div>
    ))}
  </div>
);

/* The formula, always visible. `highlight` lights up the part being taught: 1 letters, 2 adding, 3 wrapping */
const FormulaCard = ({ highlight = 0 }) => {
  const dim = (k) => (highlight === 0 || highlight === k ? 1 : 0.25);
  return (
    <div style={{ background: 'rgba(242,201,76,0.07)', border: '1px solid var(--accent)', borderRadius: '14px', padding: '12px 16px', marginBottom: '18px', textAlign: 'center' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
        📐 The Magic Formula (the same one all chapter)
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', color: '#fff', lineHeight: 1.7 }}>
        <span style={{ color: 'var(--success)' }}>drawer</span> = ({' '}
        <span style={{ color: 'var(--secondary)', opacity: dim(1) }}>letter₁</span>{' '}
        <span style={{ color: 'var(--accent)', opacity: dim(2) }}>+ letter₂ + letter₃ + …</span> ){' '}
        <span style={{ color: 'var(--primary)', opacity: dim(3) }}>% 10</span>
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
        In words: turn each letter into a number, add them all up, then keep only what is left over after full laps of the 10 drawers.
      </div>
    </div>
  );
};

const FORMULA_PIECES = [
  { id: 'drawer', label: 'drawer', color: 'var(--success)', title: '"drawer" is the answer we are hunting for', text: 'This is the number of the drawer Sly must open. We do not know it yet. Everything on the right side of the "=" sign calculates it for us, so nobody has to search.' },
  { id: 'letters', label: 'letter₁ + letter₂ …', color: 'var(--secondary)', title: 'letter₁, letter₂ … are the letter numbers', text: 'Every letter has a number on the Letter Scroll (a = 1, b = 2 … z = 26). A 3-letter word has 3 of these numbers and a 5-letter word has 5. For "cat" they are 3, 1 and 20.' },
  { id: 'plus', label: '( … + … )', color: 'var(--accent)', title: 'The + signs and the ( ) brackets', text: 'Every + means "add". The brackets ( ) mean "do this part FIRST". So we add all the letter numbers into ONE total: 3 + 1 + 20 = 24.' },
  { id: 'mod', label: '% 10', color: 'var(--primary)', title: '% 10 means "what is left over after full laps of 10"', text: 'Here % does NOT mean percent. It means "remainder". The 10 is simply how many drawers the chest has. Divide the total by 10, forget the full laps, keep the leftover: 24 ÷ 10 = 2 full laps and 4 left over, so 24 % 10 = 4. Easy shortcut for a 10-drawer chest: the answer is just the LAST DIGIT of the total (24 → 4, 58 → 8, 75 → 5). A chest with 1,000 drawers would use % 1000 instead.' }
];

const doneBadge = (text) => (
  <div style={{ background: 'rgba(0,255,163,0.12)', border: '1px solid var(--success)', borderRadius: '12px', padding: '12px 16px', color: '#D4FFEA', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '16px' }}>
    ✅ {text}
  </div>
);

/* ======================================================================
   SCENE 1 — The Problem
   ====================================================================== */
const SceneProblem = ({ img, onDone }) => {
  const { playClick } = useSoundFX();
  const [reads, setReads] = useState(0);
  const read = () => {
    playClick();
    const n = reads + 1;
    setReads(n);
    if (n >= 3) onDone();
  };
  return (
    <div>
      <Sly img={img}>
        <Say>"Okay, new chest. This one has <strong>1,000,000 drawers</strong> and every drawer has a sticker. I need the drawer marked <code>cat</code>."</Say>
        <Say>"Let's try the boring way first. Tap the button and read some stickers..."</Say>
      </Sly>

      <Panel>
        <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>
          Stickers read: <strong style={{ color: 'var(--primary)' }}>{(reads * 1000).toLocaleString()}</strong> / 1,000,000
        </div>
        <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{ height: '100%', width: `${Math.max(0.5, reads * 0.1)}%`, background: 'var(--primary)', transition: 'width 0.3s' }} />
        </div>
        <button className="web3-button" onClick={read} style={{ padding: '12px 22px' }}>
          📖 Read 1,000 stickers
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '12px' }}>(tap {Math.max(0, 3 - reads)} more)</span>
      </Panel>

      {reads >= 3 && (
        <>
          <Sly img={img}>
            <Say>"...that was only 3,000 stickers. We'd need <strong>1,000 taps</strong> to read them all. The dog would wake up!"</Say>
            <Say>"The Wizard's secret: <strong>never read the stickers.</strong> Instead, <em>calculate</em> where the drawer is from the word itself, using a tiny recipe with just <strong>3 steps</strong>. Ready? Let's learn them one at a time."</Say>
          </Sly>
        </>
      )}
    </div>
  );
};

/* ======================================================================
   SCENE 2 — Step 1: letters become numbers
   ====================================================================== */
const SceneLetters = ({ img, onDone, nerdMode }) => {
  const { playClick, playSuccess } = useSoundFX();
  const { letters } = hashWord('cat');
  const [shown, setShown] = useState([]);
  const tap = (i) => {
    playClick();
    if (shown.includes(i)) return;
    const next = [...shown, i];
    setShown(next);
    if (next.length === letters.length) {
      playSuccess();
      onDone();
    }
  };
  const shownLetters = shown.map((i) => letters[i].ch);

  return (
    <div>
      <Sly img={img}>
        <Say>"Recipe <strong>Step 1</strong>: computers love numbers, not letters. So the Wizard gave me a <strong>Letter Scroll</strong>: A = 1, B = 2, C = 3 ... all the way to Z = 26."</Say>
        <Say>"Our word is <code>cat</code>. Tap each letter below to look it up on the scroll!"</Say>
      </Sly>

      <Panel>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>📜 The Letter Scroll</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '18px' }}>
          {ALPHABET.map((ch) => {
            const lit = shownLetters.includes(ch);
            return (
              <div
                key={ch}
                style={{
                  width: '44px',
                  textAlign: 'center',
                  padding: '4px 0',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  background: lit ? 'var(--secondary)' : 'rgba(255,255,255,0.05)',
                  color: lit ? '#000' : '#cfd8dc',
                  fontWeight: lit ? 800 : 500
                }}
              >
                {ch.toUpperCase()}={letterValue(ch)}
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Tap a letter of "cat":</div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {letters.map((l, i) => {
            const open = shown.includes(i);
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.92 }}
                onClick={() => tap(i)}
                style={{
                  minWidth: '78px',
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: open ? 'rgba(0,255,163,0.15)' : 'rgba(255,255,255,0.08)',
                  border: open ? '2px solid var(--success)' : '2px dashed var(--secondary)',
                  color: '#fff'
                }}
              >
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--secondary)' }}>{l.ch}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{open ? `= ${l.value}` : '= ?'}</div>
              </motion.button>
            );
          })}
        </div>
      </Panel>

      {shown.length === letters.length &&
        doneBadge('Step 1 done! cat → c=3, a=1, t=20. Letters are now numbers: 3, 1, 20.')}

      <NerdNote show={nerdMode}>
        Real computers don't use A=1. They use character codes (ASCII/Unicode, where "a" is 97) and mix the bits more cleverly. The idea is the same: text → numbers.
      </NerdNote>
    </div>
  );
};

/* ======================================================================
   SCENE 3 — Step 2: add them up
   ====================================================================== */
const SceneAdd = ({ img, onDone, nerdMode }) => {
  const { playClick, playSuccess } = useSoundFX();
  const { letters, sum } = hashWord('cat');
  const [dropped, setDropped] = useState(0);
  const total = letters.slice(0, dropped).reduce((t, l) => t + l.value, 0);
  const next = letters[dropped];

  const drop = () => {
    if (!next) return;
    playClick();
    const n = dropped + 1;
    setDropped(n);
    if (n === letters.length) {
      playSuccess();
      onDone();
    }
  };

  return (
    <div>
      <Sly img={img}>
        <Say>"Recipe <strong>Step 2</strong> is the easiest one: <strong>add the numbers together</strong>. I have a magic Adding Pot. Drop the numbers in, one at a time."</Say>
      </Sly>

      <Panel style={{ textAlign: 'center' }}>
        <LetterTiles letters={letters} activeIndex={dropped < letters.length ? dropped : -1} />

        <div style={{ margin: '20px 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>🍲 The Adding Pot</div>
        <motion.div
          key={total}
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent)', fontFamily: 'monospace' }}
        >
          {total}
        </motion.div>
        <div style={{ fontFamily: 'monospace', color: '#D8F8FF', marginBottom: '14px', minHeight: '24px' }}>
          {dropped > 0 && letters.slice(0, dropped).map((l) => l.value).join(' + ')}
          {dropped === letters.length && ` = ${sum}`}
        </div>

        {next ? (
          <button className="web3-button" onClick={drop} style={{ padding: '12px 24px' }}>
            Drop {next.value} (from "{next.ch}") into the pot 🍲
          </button>
        ) : null}
      </Panel>

      {dropped === letters.length &&
        doneBadge(`Step 2 done! 3 + 1 + 20 = ${sum}. The word "cat" has become the single number ${sum}.`)}

      <NerdNote show={nerdMode}>
        Real hash functions don't just add (that would make "cat" and "act" identical, as you'll see in Scene 8!). They multiply and shuffle bits as they go, which spreads words around much more evenly.
      </NerdNote>
    </div>
  );
};

/* ======================================================================
   SCENE 4 — Step 3: wrap into 10 drawers
   ====================================================================== */
const SceneWrap = ({ img, onDone, nerdMode }) => {
  const { playClick, playSuccess } = useSoundFX();
  const TOTAL = hashWord('cat').sum; // 24
  const [hops, setHops] = useState(0);
  const pos = hops % DRAWERS;
  const laps = Math.floor(hops / DRAWERS);

  const go = (n) => {
    playClick();
    const next = Math.min(TOTAL, hops + n);
    setHops(next);
    if (next === TOTAL) {
      playSuccess();
      onDone();
    }
  };

  return (
    <div>
      <Sly img={img}>
        <Say>"Recipe <strong>Step 3</strong>. Our total is <strong>{TOTAL}</strong>... but the chest only has drawers <strong>#0 to #9</strong>. There's no drawer #24!"</Say>
        <Say>"The trick: <strong>walk along the drawers, and when you fall off the end, jump back to #0 and keep going.</strong> Let's hop {TOTAL} times starting at #0 and see where I land!"</Say>
      </Sly>

      <Panel>
        <DrawerRow marker={pos} highlight={hops === TOTAL ? pos : null} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', margin: '18px 0 14px 0', fontFamily: 'monospace', color: '#fff' }}>
          <span>Hops: <strong style={{ color: 'var(--accent)' }}>{hops}</strong> / {TOTAL}</span>
          <span>Full laps: <strong style={{ color: 'var(--secondary)' }}>{laps}</strong></span>
          <span>Standing on: <strong style={{ color: 'var(--success)' }}>#{pos}</strong></span>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="web3-button" disabled={hops >= TOTAL} onClick={() => go(1)} style={{ padding: '10px 20px' }}>
            +1 hop 🦘
          </button>
          <button className="web3-button" disabled={hops + DRAWERS > TOTAL} onClick={() => go(DRAWERS)} style={{ padding: '10px 20px' }}>
            +10 hops (one full lap) 🔄
          </button>
          <button
            onClick={() => { playClick(); setHops(0); }}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer' }}
          >
            <RotateCcw size={14} /> Start over
          </button>
        </div>
      </Panel>

      {hops === TOTAL &&
        doneBadge(`Step 3 done! ${TOTAL} hops = 2 full laps + 4 left over, so Sly lands on drawer #4. The "left over" is the answer. Computers write this as ${TOTAL} % 10 = 4 (the % sign means "remainder after full laps").`)}

      <NerdNote show={nerdMode}>
        This is the modulo operator: <code>index = hash(key) % table_size</code>. It guarantees the index always lands inside the table, no matter how large the hash number is.
      </NerdNote>
    </div>
  );
};

/* ======================================================================
   SCENE 5 — The Magic Formula, explained piece by piece
   ====================================================================== */
const SceneFormula = ({ img, onDone, nerdMode }) => {
  const { playClick, playSuccess, playWrong } = useSoundFX();
  const [seen, setSeen] = useState([]);
  const [current, setCurrent] = useState(null);
  const [answer, setAnswer] = useState('');
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const dog = hashWord('dog');
  const allSeen = seen.length === FORMULA_PIECES.length;
  const piece = FORMULA_PIECES.find((p) => p.id === current);

  const open = (id) => {
    playClick();
    setCurrent(id);
    if (!seen.includes(id)) setSeen([...seen, id]);
  };

  const check = () => {
    if (parseInt(answer, 10) === dog.drawer) {
      playSuccess();
      setSolved(true);
      setWrong(false);
      onDone();
    } else {
      playWrong();
      setWrong(true);
    }
  };

  return (
    <div>
      <Sly img={img}>
        <Say>"Nice work! You know all 3 steps. Now let's squash them into <strong>ONE line</strong>. That line is called a <strong>formula</strong>. A formula is just a recipe written with symbols so it is short."</Say>
        <Say>"Look at the formula card above. It looks scary, but it has only <strong>4 pieces</strong>. Tap each coloured piece below and I'll tell you what it means."</Say>
      </Sly>

      <Panel>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '14px' }}>
          {FORMULA_PIECES.map((p) => {
            const isSeen = seen.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => open(p.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: p.color,
                  background: current === p.id ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)',
                  border: `2px ${isSeen ? 'solid' : 'dashed'} ${p.color}`
                }}
              >
                {isSeen ? '✓ ' : ''}{p.label}
              </button>
            );
          })}
        </div>

        {piece ? (
          <div style={{ background: 'rgba(0,0,0,0.35)', borderLeft: `4px solid ${piece.color}`, borderRadius: '0 10px 10px 0', padding: '14px 16px', color: '#fff', lineHeight: 1.7 }}>
            <strong style={{ color: piece.color }}>{piece.title}</strong>
            <div style={{ color: '#D8F8FF', fontSize: '0.95rem', marginTop: '6px' }}>{piece.text}</div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>👆 Tap a piece to read what it means ({seen.length}/{FORMULA_PIECES.length} read)</div>
        )}
      </Panel>

      <Panel>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Worked example with "cat"</div>
        <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', lineHeight: 2, color: '#fff', whiteSpace: 'pre', overflowX: 'auto' }}>
          <div><span style={{ color: 'var(--success)' }}>drawer</span> = ( <span style={{ color: 'var(--secondary)' }}>3</span> <span style={{ color: 'var(--accent)' }}>+ 1 + 20</span> ) <span style={{ color: 'var(--primary)' }}>% 10</span></div>
          <div>{'       '}= <span style={{ color: 'var(--accent)' }}>24</span> <span style={{ color: 'var(--primary)' }}>% 10</span>{'          '}<span style={{ color: 'var(--text-muted)' }}>← add first (brackets)</span></div>
          <div>{'       '}= <strong style={{ color: 'var(--success)' }}>4</strong>{'                '}<span style={{ color: 'var(--text-muted)' }}>← 2 full laps, 4 left over</span></div>
        </div>
      </Panel>

      {allSeen && (
        <Panel style={{ border: '1px solid var(--secondary)' }}>
          <div style={{ color: 'var(--secondary)', fontWeight: 800, marginBottom: '6px' }}>🧪 Now you try! Word: "dog"</div>
          <div style={{ fontFamily: 'monospace', color: '#fff', marginBottom: '10px' }}>
            d = {dog.letters[0].value}, o = {dog.letters[1].value}, g = {dog.letters[2].value}<br />
            drawer = ( {dog.letters.map((l) => l.value).join(' + ')} ) % 10 = <strong>?</strong>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="number"
              className="web3-input"
              value={answer}
              onChange={(e) => { setAnswer(e.target.value); setWrong(false); }}
              placeholder="Which drawer?"
              disabled={solved}
              style={{ width: '150px', fontSize: '1.1rem' }}
            />
            <button className="web3-button" onClick={check} disabled={solved || answer === ''} style={{ padding: '10px 20px' }}>
              Check my answer
            </button>
          </div>
          {wrong && (
            <div style={{ marginTop: '10px', color: '#FFD0D0', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Not yet. Do the brackets first: 4 + 15 + 7 = {dog.sum}. Then ask: how many full laps of 10 fit in {dog.sum}, and what is left over? (Shortcut: look at the last digit.)
            </div>
          )}
        </Panel>
      )}

      {solved &&
        doneBadge(`Correct! 4 + 15 + 7 = ${dog.sum}, and ${dog.sum} % 10 = ${dog.drawer}. You can now read and use the formula yourself. Every hashmap is built on exactly this idea.`)}

      <NerdNote show={nerdMode}>
        In code this is <code>index = hash(key) % table_size</code>. Here hash(key) is "add up the letter numbers" and table_size is 10.
      </NerdNote>
    </div>
  );
};

/* ======================================================================
   SCENE 6 — Your turn: hide a treasure (all 3 steps, one button each)
   ====================================================================== */
const QUICK_WORDS = ['star', 'heart', 'skull', 'crown', 'gem', 'magic'];

const SceneStore = ({ img, onDone, stored, setStored, registerWord }) => {
  const { playClick, playSuccess } = useSoundFX();
  const [word, setWord] = useState('star');
  const [stage, setStage] = useState(0); // 0 start, 1 letters, 2 added, 3 wrapped
  const [justStored, setJustStored] = useState(null);

  const clean = cleanWord(word);
  const { letters, sum, drawer } = hashWord(clean);

  const changeWord = (w) => {
    setWord(w);
    setStage(0);
    setJustStored(null);
  };

  const advance = () => {
    playClick();
    const n = stage + 1;
    setStage(n);
    if (n === 3) registerWord(clean);
  };

  const store = () => {
    playSuccess();
    setStored((prev) => {
      const existing = prev[drawer] || [];
      if (existing.includes(clean)) return prev;
      return { ...prev, [drawer]: [...existing, clean] };
    });
    setJustStored({ word: clean, drawer, crowded: (stored[drawer] || []).filter((w) => w !== clean) });
    setStage(0);
    onDone();
  };

  const btn = [
    '① Turn letters into numbers',
    '② Add them up',
    '③ Wrap into 10 drawers'
  ];

  return (
    <div>
      <Sly img={img}>
        <Say>"Your turn, partner! Pick a treasure name (or type your own). I'll hold the lantern while <strong>you</strong> run the 3-step recipe, then we'll hide the treasure in the drawer you calculate."</Say>
      </Sly>

      <Panel>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input
            type="text"
            className="web3-input"
            value={word}
            onChange={(e) => changeWord(e.target.value)}
            placeholder="Type a word (letters only)..."
            style={{ flex: 1, fontSize: '1.1rem', borderColor: 'var(--secondary)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick words:</span>
          {QUICK_WORDS.map((w) => (
            <Chip key={w} active={clean === w} onClick={() => { playClick(); changeWord(w); }}>"{w}"</Chip>
          ))}
        </div>

        {clean.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>Type at least one letter to begin.</div>
        ) : (
          <>
            {stage >= 1 && (
              <div style={{ marginBottom: '12px' }}>
                <LetterTiles letters={letters} />
              </div>
            )}
            {stage >= 2 && (
              <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '1.15rem', color: 'var(--accent)', marginBottom: '12px' }}>
                {letters.map((l) => l.value).join(' + ')} = <strong>{sum}</strong>
              </div>
            )}
            {stage >= 3 && (
              <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '1.15rem', color: 'var(--success)', marginBottom: '12px' }}>
                {sum} % 10 = <strong>{drawer}</strong> → drawer <strong>#{drawer}</strong>
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              {stage < 3 ? (
                <button className="web3-button" onClick={advance} style={{ padding: '12px 24px' }}>
                  {btn[stage]}
                </button>
              ) : (
                <button className="web3-button" onClick={store} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, var(--success), var(--secondary))', color: '#000' }}>
                  📦 Hide "{clean}" in drawer #{drawer}
                </button>
              )}
            </div>
          </>
        )}

        <DrawerRow contents={stored} highlight={stage === 3 ? drawer : null} />
      </Panel>

      {justStored &&
        doneBadge(
          justStored.crowded.length > 0
            ? `"${justStored.word}" is now in drawer #${justStored.drawer}... but "${justStored.crowded.join(', ')}" was already there! Two words, one drawer. Don't panic, Scene 8 explains it. For now, try another word, or continue.`
            : `"${justStored.word}" is hidden in drawer #${justStored.drawer}. Hide a few more words if you like, or continue to find it again.`
        )}
    </div>
  );
};

/* ======================================================================
   SCENE 6 — Find it again (no searching!)
   ====================================================================== */
const SceneFind = ({ img, onDone, stored, registerWord }) => {
  const { playClick, playSuccess, playWrong } = useSoundFX();
  const flat = Object.values(stored).flat();
  const [word, setWord] = useState(flat[0] || 'star');
  const [result, setResult] = useState(null);

  const lookup = (w) => {
    const clean = cleanWord(w);
    if (!clean) return;
    playClick();
    registerWord(clean);
    const h = hashWord(clean);
    const tray = stored[h.drawer] || [];
    const found = tray.includes(clean);
    setResult({ ...h, word: clean, tray, found });
    if (found) {
      playSuccess();
      onDone();
    } else {
      playWrong();
    }
  };

  const options = [...new Set([...flat, 'dragon'])];

  return (
    <div>
      <Sly img={img}>
        <Say>"Now the magic part. To find a treasure later, I run the <strong>exact same 3 steps</strong> on the word. Same word, same numbers, same drawer. <em>Every single time.</em>"</Say>
        <Say>"So I never search. I do the math and walk straight to the right drawer. Pick a word you hid. Or try <code>dragon</code>, which we never hid!"</Say>
      </Sly>

      <Panel>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Look up:</span>
          {options.map((w) => (
            <Chip key={w} active={word === w} onClick={() => { playClick(); setWord(w); setResult(null); }}>"{w}"</Chip>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <button className="web3-button" onClick={() => lookup(word)} style={{ padding: '12px 26px' }}>
            🔎 Find "{cleanWord(word)}" using the recipe
          </button>
        </div>

        {result && (
          <div style={{ textAlign: 'center', fontFamily: 'monospace', color: '#D8F8FF', marginBottom: '14px', lineHeight: 1.8 }}>
            <div>① letters → {result.letters.map((l) => `${l.ch}=${l.value}`).join(', ')}</div>
            <div>② add → {result.letters.map((l) => l.value).join(' + ')} = {result.sum}</div>
            <div>③ wrap → {result.sum} % 10 = <strong style={{ color: 'var(--success)' }}>{result.drawer}</strong></div>
          </div>
        )}

        <DrawerRow contents={stored} highlight={result ? result.drawer : null} />
      </Panel>

      {result && result.found &&
        doneBadge(`Found "${result.word}" in drawer #${result.drawer}, using only 3 steps and no searching! It would be the same 3 steps even with 1,000,000 drawers.`)}

      {result && !result.found && (
        <div style={{ background: 'rgba(255,76,76,0.12)', border: '1px solid var(--error)', borderRadius: '12px', padding: '12px 16px', color: '#FFD0D0', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '16px' }}>
          🕳️ The recipe sends us to drawer #{result.drawer}, but "{result.word}" isn't in there{result.tray.length > 0 ? ` (only: ${result.tray.join(', ')})` : ' (it\'s empty)'}. That means it was never hidden. This is exactly what a missing key means! Now look up a word you did hide.
        </div>
      )}
    </div>
  );
};

/* ======================================================================
   SCENE 7 — Collisions (cat vs act)
   ====================================================================== */
const SceneCollision = ({ img, onDone, nerdMode }) => {
  const { playClick, playSuccess } = useSoundFX();
  const cat = hashWord('cat');
  const act = hashWord('act');
  const [stage, setStage] = useState(0); // 0 start, 1 cat stored, 2 act stored (collision), 3 looked up
  const [checked, setChecked] = useState([]);

  const contents = {};
  if (stage >= 1) contents[cat.drawer] = ['cat'];
  if (stage >= 2) contents[act.drawer] = ['cat', 'act'];

  const next = () => {
    playClick();
    if (stage === 2) {
      setChecked([]);
    }
    setStage(stage + 1);
  };

  const checkItem = (w) => {
    playClick();
    if (checked.includes(w)) return;
    const n = [...checked, w];
    setChecked(n);
    if (w === 'act') {
      playSuccess();
      onDone();
    }
  };

  return (
    <div>
      <Sly img={img}>
        <Say>"One more thing, and it's a fun one. Watch what happens with <code>cat</code> and <code>act</code>. Same letters, different order."</Say>
      </Sly>

      <Panel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '0.92rem' }}>
          <div style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid var(--secondary)', borderRadius: '10px', padding: '12px' }}>
            <strong style={{ color: 'var(--secondary)' }}>"cat"</strong><br />
            3 + 1 + 20 = {cat.sum}<br />
            {cat.sum} % 10 = <strong>{cat.drawer}</strong>
          </div>
          <div style={{ background: 'rgba(255,46,147,0.1)', border: '1px solid var(--primary)', borderRadius: '10px', padding: '12px' }}>
            <strong style={{ color: 'var(--primary)' }}>"act"</strong><br />
            1 + 3 + 20 = {act.sum}<br />
            {act.sum} % 10 = <strong>{act.drawer}</strong>
          </div>
        </div>

        <DrawerRow contents={contents} highlight={stage >= 2 ? cat.drawer : null} />

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          {stage === 0 && (
            <button className="web3-button" onClick={next} style={{ padding: '12px 24px' }}>
              📦 Hide "cat" (Catnip Pouch 🌿)
            </button>
          )}
          {stage === 1 && (
            <button className="web3-button" onClick={next} style={{ padding: '12px 24px' }}>
              📦 Now hide "act" (Theater Mask 🎭)
            </button>
          )}
          {stage === 2 && (
            <button className="web3-button" onClick={next} style={{ padding: '12px 24px' }}>
              🔎 Look for "act" in drawer #{act.drawer}
            </button>
          )}
        </div>

        {stage === 2 && (
          <div style={{ marginTop: '14px', background: 'rgba(242,201,76,0.1)', border: '1px solid var(--accent)', borderRadius: '10px', padding: '12px 14px', color: '#FFF1C5', fontSize: '0.92rem', lineHeight: 1.6 }}>
            💥 <strong>Collision!</strong> Both words calculate to drawer #{cat.drawer}. A collision means two different words land in the same drawer.
          </div>
        )}

        {stage === 3 && (
          <div style={{ marginTop: '14px' }}>
            <div style={{ color: '#fff', marginBottom: '10px', fontSize: '0.95rem' }}>
              Sly opens drawer #{act.drawer} and finds a small <strong>tray</strong> with 2 items. Tap each item to check its label:
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['cat', 'act'].map((w) => {
                const isChecked = checked.includes(w);
                const match = w === 'act';
                return (
                  <button
                    key={w}
                    onClick={() => checkItem(w)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      color: '#fff',
                      fontFamily: 'monospace',
                      fontSize: '1.05rem',
                      background: isChecked ? (match ? 'rgba(0,255,163,0.2)' : 'rgba(255,76,76,0.15)') : 'rgba(255,255,255,0.08)',
                      border: isChecked ? `2px solid ${match ? 'var(--success)' : 'var(--error)'}` : '2px dashed var(--secondary)'
                    }}
                  >
                    {w === 'cat' ? '🌿' : '🎭'} {isChecked ? (match ? `"${w}" ✅ match!` : `"${w}" ✖ not mine`) : 'tap to check'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Panel>

      {stage === 3 && checked.includes('act') &&
        doneBadge('Collisions are no big deal! The drawer just holds a tiny tray, and Sly checks the 2 or 3 labels inside. That is still WAY faster than checking a million drawers. This trick is called chaining.')}

      <NerdNote show={nerdMode}>
        Collision resolution by <strong>chaining</strong>: each bucket holds a small list of (key, value) pairs. Lookup is O(1) on average because good hash functions keep the lists short. Another approach is <strong>open addressing</strong> (probe the next free slot).
      </NerdNote>
    </div>
  );
};

/* ======================================================================
   SCENE 8 — The big picture
   ====================================================================== */
const SceneRecap = ({ img, onComplete, nerdMode }) => {
  const { playSuccess } = useSoundFX();
  return (
    <div>
      <Sly img={img}>
        <Say>"You did it, partner! You just learned how <strong>every hashmap</strong> works. It's the same 3 steps, every time."</Say>
      </Sly>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {[
          { n: '①', t: 'Letters → numbers', d: 'c=3, a=1, t=20', c: 'var(--secondary)' },
          { n: '②', t: 'Add them up', d: '3 + 1 + 20 = 24', c: 'var(--accent)' },
          { n: '③', t: 'Wrap into drawers', d: '24 % 10 = drawer #4', c: 'var(--success)' }
        ].map((s) => (
          <div key={s.n} style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${s.c}`, borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', color: s.c }}>{s.n}</div>
            <div style={{ color: '#fff', fontWeight: 700, margin: '4px 0' }}>{s.t}</div>
            <div style={{ fontFamily: 'monospace', color: '#D8F8FF', fontSize: '0.88rem' }}>{s.d}</div>
          </div>
        ))}
      </div>

      <Panel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase' }}>🐢 Reading every sticker</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>up to 1,000,000 checks</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>⚡ Hashmap recipe</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>3 steps, always</div>
          </div>
        </div>
        <p style={{ color: '#D8F8FF', textAlign: 'center', margin: '14px 0 0 0', fontSize: '0.92rem', lineHeight: 1.6 }}>
          That "always the same number of steps" idea is what <strong>O(1)</strong> means. It doesn't matter if the chest has 10 drawers or 1,000,000.
        </p>
      </Panel>

      <Panel>
        <div style={{ color: '#fff', fontSize: '0.92rem', lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--accent)' }}>Words you now know:</strong><br />
          <strong>Key</strong>: the word you look up (like "cat")<br />
          <strong>Value</strong>: the treasure stored for it<br />
          <strong>Hash function</strong>: the recipe that turns a key into a drawer number<br />
          <strong>Collision</strong>: two keys landing in the same drawer (solved with a tray)
        </div>
      </Panel>

      <NerdNote show={nerdMode}>
        A Python <code>dict</code> does exactly this with a far better hash function and a table that resizes itself as it fills up, keeping lookups O(1) on average.
      </NerdNote>

      <div style={{ textAlign: 'center' }}>
        <button
          className="web3-button"
          onClick={() => { playSuccess(); if (onComplete) onComplete(); }}
          style={{ padding: '16px 32px', fontSize: '1.05rem', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', color: '#000', fontWeight: 800 }}
        >
          Take the Security Riddles 🗝️ <ArrowRight size={18} style={{ verticalAlign: 'middle' }} />
        </button>
      </div>
    </div>
  );
};

/* ======================================================================
   MAIN COMPONENT
   ====================================================================== */
export const HashVisualizer = ({ onComplete }) => {
  const { registerVisualizerWord, visualizerWordsTested, nerdMode } = useGame();
  const { playClick } = useSoundFX();

  const [scene, setScene] = useState(0);
  const [done, setDone] = useState({});
  const [stored, setStored] = useState({});

  const markDone = (i) => setDone((p) => (p[i] ? p : { ...p, [i]: true }));

  // furthest scene the learner is allowed to open
  let reach = 0;
  while (reach < SCENES.length - 1 && done[reach]) reach++;

  const goTo = (i) => {
    if (i < 0 || i > reach) return;
    playClick();
    setScene(i);
  };

  const img = SCENES[scene].img;
  const common = { img, nerdMode };

  return (
    <div className="hash-visualizer-container glass-card" style={{ padding: '24px', border: '1px solid var(--secondary)', background: 'rgba(0, 240, 255, 0.04)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ color: 'var(--secondary)', margin: 0, fontSize: '1.2rem' }}>
            Scene {scene + 1} of {SCENES.length}: {SCENES[scene].title}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
            One small idea per scene. Do the tap or click to unlock the next scene.
          </p>
        </div>
        <div style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '12px', color: 'var(--accent)', border: '1px solid rgba(242,201,76,0.3)' }}>
          🐱 Curious Cat Badge: <strong>{visualizerWordsTested.length}/5</strong> words tested
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', alignItems: 'center' }}>
        {SCENES.map((s, i) => {
          const locked = i > reach;
          const active = i === scene;
          return (
            <button
              key={s.title}
              onClick={() => goTo(i)}
              disabled={locked}
              title={locked ? 'Finish the earlier scenes first' : s.title}
              style={{
                flex: 1,
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                cursor: locked ? 'not-allowed' : 'pointer',
                background: active ? 'var(--secondary)' : done[i] ? 'var(--success)' : 'rgba(255,255,255,0.12)',
                opacity: locked ? 0.4 : 1
              }}
            />
          );
        })}
      </div>

      {/* The formula stays on screen from scene 2 onward */}
      {scene >= 1 && <FormulaCard highlight={scene === 1 ? 1 : scene === 2 ? 2 : scene === 3 ? 3 : 0} />}

      {/* Scene body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {scene === 0 && <SceneProblem {...common} onDone={() => markDone(0)} />}
          {scene === 1 && <SceneLetters {...common} onDone={() => markDone(1)} />}
          {scene === 2 && <SceneAdd {...common} onDone={() => markDone(2)} />}
          {scene === 3 && <SceneWrap {...common} onDone={() => markDone(3)} />}
          {scene === 4 && <SceneFormula {...common} onDone={() => markDone(4)} />}
          {scene === 5 && (
            <SceneStore {...common} stored={stored} setStored={setStored} registerWord={registerVisualizerWord} onDone={() => markDone(5)} />
          )}
          {scene === 6 && (
            <SceneFind {...common} stored={stored} registerWord={registerVisualizerWord} onDone={() => markDone(6)} />
          )}
          {scene === 7 && <SceneCollision {...common} onDone={() => markDone(7)} />}
          {scene === 8 && <SceneRecap {...common} onComplete={onComplete} />}
        </motion.div>
      </AnimatePresence>

      {/* Back / Next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <button
          onClick={() => goTo(scene - 1)}
          disabled={scene === 0}
          style={{ background: 'none', border: 'none', color: scene === 0 ? 'transparent' : 'var(--text-muted)', cursor: scene === 0 ? 'default' : 'pointer', fontSize: '0.95rem' }}
        >
          <ArrowLeft size={14} style={{ verticalAlign: 'middle' }} /> Previous scene
        </button>

        {scene < SCENES.length - 1 && (
          <button
            className="web3-button"
            disabled={!done[scene]}
            onClick={() => goTo(scene + 1)}
            style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', opacity: done[scene] ? 1 : 0.5 }}
          >
            {done[scene] ? 'Next scene' : 'Finish this scene to continue'} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HashVisualizer;
