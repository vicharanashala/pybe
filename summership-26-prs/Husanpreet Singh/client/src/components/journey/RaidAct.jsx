import React, { useRef } from 'react';
import Scene2D, { Prop, Wake } from './Scene2D';
import CodeCard, { py } from './CodeCard';
import { ActTitle, Caption, Banner, BranchScore } from './Overlays';
import { ShipArt, RowboatArt, SoldierArt, PirateArt, CuffsArt, IslandArt } from './Sprites';
import { useScrollProgress, useSectionLabel, useFraming, range, ease, easeOut, lerp } from './scrollUtils';

/* =========================================================
   Act I — the if / else raid.

   One island, one yes-or-no question, two possible endings —
   and only ever one of them actually happens. Every position
   here is a pure function of scroll progress, so scrubbing
   back up the page replays the beat exactly.
   ========================================================= */

/* Actors are placed as offsets from the island. One unit of x is one percent of
   the strip, so these hold their proportions at any viewport width. */
const ISLAND = { x: 62, z: 42 };
const SHIP_FROM = { x: ISLAND.x - 19, z: 52 };
const SHIP_NEAR = { x: ISLAND.x - 4.8, z: 52 };
const SHORE = { x: ISLAND.x - 2.1, z: 47 };
const STAND = { x: ISLAND.x - 0.7, z: 44 };

export default function RaidAct({ expedition, islandName, caught, onReroll, onActive }) {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  const framing = useFraming();
  useSectionLabel(ref, `Act I · if / else — ${islandName}`, onActive);

  const px = (n) => Math.round(n * framing.scale);

  /* ---- camera: drift in from the west, then settle on the island ---- */
  const approach = ease(range(p, 0.04, 0.34));
  const panX = framing.centreOn(lerp(ISLAND.x - 7, ISLAND.x, approach));

  /* ---- ship ---- */
  const sail = ease(range(p, 0.04, 0.32));
  const ship = {
    x: lerp(SHIP_FROM.x, SHIP_NEAR.x, sail),
    z: lerp(SHIP_FROM.z, SHIP_NEAR.z, sail),
  };

  /* ---- landing party ---- */
  const row = ease(range(p, 0.34, 0.46));
  const rowBack = ease(range(p, 0.8, 0.88));
  const boatOut = p > 0.32 && p < 0.92;
  const launch = { x: ship.x + 0.5, z: ship.z - 1 };
  const boat = {
    x: lerp(lerp(launch.x, SHORE.x, row), launch.x, rowBack),
    z: lerp(lerp(launch.z, SHORE.z, row), launch.z, rowBack),
  };

  const march = ease(range(p, 0.46, 0.55));
  const marchBack = ease(range(p, 0.74, 0.8));
  const soldierOut = p > 0.45 && p < 0.82;
  const soldier = {
    x: lerp(lerp(SHORE.x, STAND.x, march), SHORE.x, marchBack),
    z: lerp(lerp(SHORE.z, STAND.z, march), SHORE.z, marchBack),
  };

  const searching = p >= 0.55 && p < 0.62;
  const resolved = p >= 0.62;
  const pose = resolved ? (caught ? 'catch' : 'shrug') : searching ? 'search' : 'stand';

  /* ---- code panel ---- */
  const codeEnter = easeOut(range(p, 0.22, 0.34));
  const evaluating = p >= 0.36 && p < 0.62;

  const lines = [
    {
      key: 'a',
      html: py(`jack_is_here = search("${islandName}")`),
      state: p >= 0.3 && p < 0.44 ? 'active' : p >= 0.44 ? (caught ? 'hit' : 'miss') : 'idle',
      tag: p >= 0.44 ? (caught ? 'True' : 'False') : p >= 0.3 ? 'searching…' : null,
    },
    { key: 'b', html: '&nbsp;', state: 'idle' },
    {
      key: 'c',
      html: py('if jack_is_here:'),
      state: evaluating && p >= 0.44 ? 'active' : resolved ? (caught ? 'hit' : 'miss') : 'idle',
      tag: resolved ? (caught ? 'True → runs' : 'False → skip') : null,
    },
    {
      key: 'd',
      html: py('    print("Catch him!")'),
      state: resolved ? (caught ? 'hit' : 'skipped') : 'idle',
      tag: resolved && !caught ? 'never ran' : null,
    },
    {
      key: 'e',
      html: py('else:'),
      state: resolved ? (caught ? 'skipped' : 'hit') : 'idle',
      tag: resolved ? (caught ? 'skipped' : 'the fallback') : null,
    },
    {
      key: 'f',
      html: py('    print("Raid unsuccessful, return to ship")'),
      state: resolved ? (caught ? 'skipped' : 'hit') : 'idle',
      tag: resolved && caught ? 'never ran' : null,
    },
  ];

  /* ---- narration ---- */
  let chapter = 'The Approach';
  let tone = 'neutral';
  let text = `HMS Resolute comes about and runs east under full sail. Somewhere ahead lies <b>${islandName}</b>.`;

  if (p >= 0.3) {
    chapter = 'The Landing';
    text = 'The longboat is lowered. One soldier rows for the beach with a single question in his head — <b>is Jack here?</b>';
  }
  if (p >= 0.46) {
    chapter = 'The Search';
    text = 'He works the treeline, the caves, the wreck on the sandbar. The whole raid comes down to one answer: yes or no.';
  }
  if (resolved) {
    chapter = caught ? 'Caught' : 'Vanished';
    tone = caught ? 'win' : 'loss';
    text = caught
      ? 'A shout from the palms — <b>"Catch him!"</b> Calico Jack is dragged out of the brush and put in irons.'
      : 'Cold ashes, an empty hammock, no Jack. <b>"Raid unsuccessful, return to ship."</b>';
  }
  if (p >= 0.74) {
    chapter = 'What the code did';
    tone = 'teach';
    text = caught
      ? 'The condition was <b>True</b>, so Python ran the <b>if</b> body and jumped clean over the <b>else</b>. The else branch was written, loaded, ready — and never touched.'
      : 'The condition was <b>False</b>, so Python skipped the <b>if</b> body entirely and ran the <b>else</b> instead. Exactly one of the two always runs. Never both, never neither.';
  }

  return (
    <section className="jr-act jr-act-raid" ref={ref}>
      <div className="jr-act-sticky">
        <Scene2D
          panX={panX}
          horizon={framing.horizon}
          top0={framing.top0}
          span={framing.span}
          scale={framing.scale}
          stripWidth={framing.stripWidth}
          sky="day"
        >
          <Prop x={ISLAND.x} z={ISLAND.z} width={px(380)} shadow={px(300)}>
            <div className={`jr-island ${resolved ? (caught ? 'is-found' : 'is-empty') : ''}`}>
              <IslandArt variant={expedition % 4} />
              <span className="jr-island-label">{islandName}</span>
            </div>
          </Prop>

          <Wake x={ship.x - 0.9} z={ship.z} width={px(190)} />
          <Prop x={ship.x} z={ship.z} width={px(168)} shadow={px(132)}>
            <div className="jr-sprite jr-ship">
              <ShipArt />
            </div>
          </Prop>

          {boatOut && (
            <Prop x={boat.x} z={boat.z} width={px(78)} shadow={px(60)}>
              <div className="jr-sprite jr-rowboat">
                <RowboatArt />
              </div>
            </Prop>
          )}

          {soldierOut && (
            <Prop x={soldier.x} z={soldier.z} width={px(50)} lift={2} shadow={px(34)}>
              <div className={`jr-sprite jr-soldier jr-pose-${pose} ${searching ? 'is-searching' : ''}`}>
                <SoldierArt />
              </div>
            </Prop>
          )}

          {resolved && caught && (
            <>
              <Prop x={STAND.x + 0.75} z={STAND.z - 0.4} width={px(50)} lift={2} shadow={px(34)}>
                <div className="jr-sprite jr-pirate is-pop">
                  <PirateArt />
                </div>
              </Prop>
              <Prop x={STAND.x + 0.38} z={STAND.z} width={px(38)} lift={px(52)}>
                <div className="jr-sprite jr-cuffs is-pop">
                  <CuffsArt />
                </div>
              </Prop>
            </>
          )}
        </Scene2D>

        <div className="jr-hud-layer">
          <ActTitle
            eyebrow="Act I"
            title="One Island, One Question"
            sub="if / else — the two-way fork"
            enter={1 - ease(range(p, 0.1, 0.2))}
          />

          <Banner show={resolved && p < 0.74} tone={caught ? 'gold' : 'red'}>
            {caught ? '🗣️ “Catch him!”' : '❌ Raid unsuccessful'}
          </Banner>

          <div className="jr-code-slot">
            <CodeCard
              title="raid.py"
              subtitle="One condition. Two branches. One outcome."
              lines={lines}
              enter={codeEnter}
              note={
                resolved
                  ? caught
                    ? '<b>if</b> won the fork — the <b>else</b> block was skipped without being read.'
                    : '<b>if</b> lost the fork — Python fell through to <b>else</b>, which is the guaranteed backup.'
                  : 'Python asks the question once, then commits to a single branch.'
              }
            />
          </div>

          <Caption chapter={chapter} text={text} tone={tone} enter={easeOut(range(p, 0.16, 0.26))} />

          <BranchScore
            show={p >= 0.74}
            branches={[
              {
                label: 'if',
                text: 'print("Catch him!")',
                taken: caught,
                reason: 'condition was False',
              },
              {
                label: 'else',
                text: 'print("Raid unsuccessful, return to ship")',
                taken: !caught,
                reason: 'if already ran',
              },
            ]}
          />

          <button className="jr-reroll" onClick={onReroll} type="button">
            ⟲ Re-run with the other answer
            <span>same code · flips the branch</span>
          </button>
        </div>
      </div>
    </section>
  );
}
