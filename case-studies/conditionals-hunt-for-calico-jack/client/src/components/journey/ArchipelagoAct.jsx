import React, { useRef } from 'react';
import Scene2D, { Prop, Wake } from './Scene2D';
import CodeCard, { py } from './CodeCard';
import { ActTitle, Caption, Banner } from './Overlays';
import { ShipArt, IslandArt, ChestArt, PirateArt, CuffsArt, SoldierArt } from './Sprites';
import { ARCHIPELAGO_LAYOUT } from '../../data/story';
import { useScrollProgress, useSectionLabel, useFraming, clamp, range, ease, easeOut, lerp } from './scrollUtils';

/* =========================================================
   Act III — the if / elif / else chain.

   Seven islands, checked strictly in order. The first island
   that answers True ends the hunt, and every island after it is
   never visited at all — the single most often missed fact about
   an elif ladder. The else at the bottom only speaks if all
   seven came back False.

   What the chain is hunting for is decided by Act I: a caught
   Jack gives up a buried chest, an escaped Jack becomes the
   quarry himself. Only one of the two ever runs.
   ========================================================= */

const START = { x: -6, z: 52 };
const INTRO_END = 0.1;
const OUTRO_START = 0.86;

export default function ArchipelagoAct({ expedition, islands, target, caught, onReroll, onActive }) {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  const framing = useFraming();

  const huntingJack = !caught;
  const verb = huntingJack ? 'raid' : 'dig';
  const n = islands.length;
  useSectionLabel(ref, `Act III · if / elif / else — ${n} islands`, onActive);

  const px = (v) => Math.round(v * framing.scale);
  /* The Resolute stands off each island: a little west, a little nearer the front. */
  const port = (i) => ({ x: ARCHIPELAGO_LAYOUT[i].x - 2.2, z: ARCHIPELAGO_LAYOUT[i].z + 9 });

  /* ---------- where are we in the chain? ---------- */
  const slot = (OUTRO_START - INTRO_END) / n;
  const walked = (p - INTRO_END) / slot;
  const rawIdx = Math.floor(walked);
  const stopAt = target >= 0 ? target : n - 1;
  const idx = clamp(rawIdx, 0, stopAt);
  const sub = clamp(walked - idx, 0, 1);

  const started = p > INTRO_END;
  const settled = sub > 0.72;
  const hit = started && settled && idx === target;
  const elseRan = started && settled && target < 0 && idx === n - 1;
  const chainOver = hit || elseRan;

  /* ---------- camera follows the search ---------- */
  const travel = ease(clamp(sub / 0.45));
  const from = idx === 0 ? START : port(idx - 1);
  const to = port(idx);
  const ship = started
    ? { x: lerp(from.x, to.x, travel), z: lerp(from.z, to.z, travel) }
    : { x: lerp(START.x, port(0).x, ease(range(p, 0.03, INTRO_END))), z: START.z };

  const fromX = idx === 0 ? START.x + 6 : ARCHIPELAGO_LAYOUT[idx - 1].x;
  const focusX = started ? lerp(fromX, ARCHIPELAGO_LAYOUT[idx].x, travel) : START.x + 10;
  const panX = framing.centreOn(focusX);

  /* ---------- per-island state ---------- */
  const islandState = islands.map((_, i) => {
    if (!started) return 'idle';
    if (i < idx) return 'empty';
    if (i === idx) {
      if (!settled) return sub > 0.45 ? 'searching' : 'approaching';
      return i === target ? 'found' : 'empty';
    }
    return chainOver ? 'skipped' : 'idle';
  });

  /* ---------- the source ---------- */
  const foundMsg = (name) =>
    huntingJack ? `print("Jack is hiding on ${name} — seize him!")` : `print("The chest is buried on ${name}!")`;
  const elseMsg = huntingJack
    ? 'print("Seven islands raided. The trail is cold.")'
    : 'print("Seven islands dug up. Jack lied — there is no chest.")';

  const lines = [];
  islands.forEach((name, i) => {
    const st = islandState[i];
    const kw = i === 0 ? 'if' : 'elif';
    let condState = 'idle';
    let condTag = null;
    if (st === 'approaching' || st === 'searching') {
      condState = 'active';
      condTag = 'evaluating…';
    } else if (st === 'empty') {
      condState = 'miss';
      condTag = 'False';
    } else if (st === 'found') {
      condState = 'hit';
      condTag = 'True → runs';
    } else if (st === 'skipped') {
      condState = 'skipped';
      condTag = 'never checked';
    }
    lines.push({ key: `c${i}`, html: py(`${kw} ${verb}("${name}"):`), state: condState, tag: condTag });
    lines.push({
      key: `b${i}`,
      html: py(`    ${foundMsg(name)}`),
      state: st === 'found' ? 'hit' : st === 'idle' ? 'idle' : 'skipped',
      tag: null,
    });
  });
  lines.push({
    key: 'else',
    html: py('else:'),
    state: elseRan ? 'hit' : chainOver ? 'skipped' : 'idle',
    tag: elseRan ? 'all False → runs' : chainOver ? 'skipped' : null,
  });
  lines.push({
    key: 'elseb',
    html: py(`    ${elseMsg}`),
    state: elseRan ? 'hit' : 'skipped',
    tag: null,
  });

  /* ---------- narration ---------- */
  const name = islands[idx];
  const left = n - idx - 1;
  let chapter = 'The Chain';
  let tone = 'neutral';
  let text = huntingJack
    ? 'Seven islands lie east in a broken line. Jack is on exactly one of them — and there is no way to check them all at once.'
    : "Seven islands, one buried chest, and Jack's word that it is on exactly one of them.";

  if (started) {
    chapter = `Island ${idx + 1} of ${n} — ${name}`;
    if (!settled) {
      text =
        sub > 0.45
          ? `Boats away at <b>${name}</b>. ${huntingJack ? 'Every cove, every cave.' : 'Spades into the sand.'} Python is sitting on this one condition, waiting for an answer.`
          : `The Resolute swings toward <b>${name}</b>. The chain will not skip ahead — condition <b>${idx + 1}</b> has to be answered before condition <b>${idx + 2}</b> is even read.`;
    } else if (hit) {
      tone = 'win';
      chapter = 'Found';
      text = huntingJack
        ? `There he is. <b>${name}</b> gives up Calico Jack, and the hunt stops dead — the remaining ${left} island${left === 1 ? '' : 's'} ${left === 1 ? 'is' : 'are'} never even sighted.`
        : `The spade hits iron. The chest comes out of the sand at <b>${name}</b>, and the remaining ${left} island${left === 1 ? '' : 's'} ${left === 1 ? 'stays' : 'stay'} unsearched.`;
    } else if (elseRan) {
      tone = 'loss';
      chapter = 'All seven, nothing';
      text = huntingJack
        ? 'Seven islands raided, seven times nothing. Every condition came back False, so the <b>else</b> at the bottom finally gets to speak.'
        : 'Seven islands turned over, no chest anywhere. Jack lied. With every condition False, only the <b>else</b> is left.';
    } else {
      tone = 'loss';
      text = `Nothing on <b>${name}</b>. That condition is False, so Python moves down to the next <b>elif</b> — and only then.`;
    }
  }
  if (p >= OUTRO_START) {
    tone = 'teach';
    chapter = 'What the chain did';
    text =
      chainOver && !elseRan
        ? 'An <b>if / elif / else</b> ladder is one decision, not many. Python walks it top to bottom, stops at the <b>first</b> True, runs that block, and jumps past everything below it — including the <b>else</b>.'
        : 'Every condition was False, so nothing in the ladder ran and the <b>else</b> caught the fall. That is the whole job of <b>else</b>: be the answer when there is no other answer.';
  }

  const codeEnter = easeOut(range(p, 0.03, 0.12));
  const win = ARCHIPELAGO_LAYOUT[idx];

  return (
    <section className="jr-act jr-act-chain" ref={ref}>
      <div className="jr-act-sticky">
        <Scene2D
          panX={panX}
          horizon={framing.horizon}
          top0={framing.top0}
          span={framing.span}
          scale={framing.scale}
          stripWidth={framing.stripWidth}
          sky="dusk"
        >
          {islands.map((label, i) => {
            const st = islandState[i];
            return (
              <Prop key={label} x={ARCHIPELAGO_LAYOUT[i].x} z={ARCHIPELAGO_LAYOUT[i].z} width={px(300)} shadow={px(235)}>
                <div className={`jr-island jr-island-sm is-${st}`}>
                  <IslandArt variant={(i + expedition) % 4} />
                  <span className="jr-island-label">
                    <b>{i + 1}</b> {label}
                  </span>
                  {st === 'empty' && <span className="jr-island-mark jr-mark-no">✗</span>}
                  {st === 'found' && <span className="jr-island-mark jr-mark-yes">✓</span>}
                  {st === 'skipped' && <span className="jr-island-mark jr-mark-skip">⏭</span>}
                  {st === 'searching' && <span className="jr-island-mark jr-mark-ask">?</span>}
                </div>
              </Prop>
            );
          })}

          {/* the payoff, on whichever island answered True */}
          {hit && (
            <>
              <Prop x={win.x} z={win.z} width={px(150)}>
                <div className="jr-beam" />
              </Prop>
              <Prop x={win.x + 0.3} z={win.z + 1.5} width={px(huntingJack ? 46 : 70)} lift={2} shadow={px(44)}>
                <div className="jr-sprite is-pop">{huntingJack ? <PirateArt /> : <ChestArt />}</div>
              </Prop>
              {huntingJack && (
                <>
                  <Prop x={win.x - 0.45} z={win.z + 1.5} width={px(46)} lift={2} shadow={px(34)}>
                    <div className="jr-sprite jr-soldier jr-pose-catch">
                      <SoldierArt />
                    </div>
                  </Prop>
                  <Prop x={win.x - 0.08} z={win.z + 1.5} width={px(35)} lift={px(45)}>
                    <div className="jr-sprite is-pop">
                      <CuffsArt />
                    </div>
                  </Prop>
                </>
              )}
            </>
          )}

          <Wake x={ship.x - 0.9} z={ship.z} width={px(180)} />
          <Prop x={ship.x} z={ship.z} width={px(154)} shadow={px(120)}>
            <div className="jr-sprite jr-ship">
              <ShipArt />
            </div>
          </Prop>
        </Scene2D>

        <div className="jr-hud-layer">
          <ActTitle
            eyebrow="Act III"
            title={huntingJack ? 'Seven Islands, One Pirate' : 'Seven Islands, One Chest'}
            sub="if / elif / else — the ladder"
            enter={1 - ease(range(p, 0.06, 0.14))}
          />

          {/* the ladder as a scoreboard */}
          <div className={`jr-rail ${started ? 'is-on' : ''}`}>
            {islands.map((label, i) => (
              <div key={label} className={`jr-rail-item is-${islandState[i]}`} title={label}>
                <span className="jr-rail-kw">{i === 0 ? 'if' : 'elif'}</span>
                <span className="jr-rail-name">{label}</span>
              </div>
            ))}
            <div className={`jr-rail-item jr-rail-else ${elseRan ? 'is-found' : chainOver ? 'is-skipped' : 'is-idle'}`}>
              <span className="jr-rail-kw">else</span>
              <span className="jr-rail-name">no island left</span>
            </div>
          </div>

          <Banner show={settled && (hit || elseRan) && p < OUTRO_START} tone={hit ? 'gold' : 'red'}>
            {hit
              ? huntingJack
                ? `⚓ Jack taken on ${name}`
                : `💰 Chest recovered on ${name}`
              : '❌ All seven conditions False — else runs'}
          </Banner>

          <div className="jr-code-slot">
            <CodeCard
              title={huntingJack ? 'manhunt.py' : 'treasure.py'}
              subtitle="Read top to bottom. Stop at the first True."
              lines={lines}
              enter={codeEnter}
              compact
              note={
                chainOver
                  ? hit
                    ? `Branch <b>${idx + 1}</b> was the first True, so it ran — and the ${n - idx} block${n - idx === 1 ? '' : 's'} below it never executed.`
                    : 'No condition was True, so <b>else</b> ran. Exactly one block out of the whole ladder always runs.'
                  : 'Only the condition Python is standing on gets evaluated. The rest have not been read yet.'
              }
            />
          </div>

          <Caption chapter={chapter} text={text} tone={tone} enter={easeOut(range(p, 0.04, 0.1))} />

          <button className="jr-reroll" onClick={onReroll} type="button">
            ⟲ Re-run this expedition
            <span>same ladder · new island</span>
          </button>
        </div>
      </div>
    </section>
  );
}
