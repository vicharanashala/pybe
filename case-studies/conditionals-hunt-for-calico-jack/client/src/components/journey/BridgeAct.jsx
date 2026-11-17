import React, { useRef } from 'react';
import { BRIDGE_SCENES } from '../../data/story';
import { useScrollProgress, useSectionLabel, range, ease, easeOut, lerp } from './scrollUtils';

/* =========================================================
   Act II — the hinge.

   Whichever way Act I fell, the story has to get the Commander
   to the same place: a chain of seven islands that can only be
   searched one at a time. Caught Jack talks; escaped Jack is
   tracked. Both roads lead to elif.
   ========================================================= */

export default function BridgeAct({ caught, islandCount, onActive }) {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  const scene = caught ? BRIDGE_SCENES.caught : BRIDGE_SCENES.escaped;
  useSectionLabel(ref, `Act II · ${scene.title}`, onActive);

  const inP = easeOut(range(p, 0.02, 0.2));
  const outP = ease(range(p, 0.92, 1));

  /* Each line gets its own slice of the scroll. */
  const slice = 0.5 / scene.lines.length;

  return (
    <section className="jr-act jr-act-bridge" ref={ref}>
      <div className="jr-act-sticky">
        <div className="jr-bridge-space">
          <div
            className="jr-bridge-plate"
            style={{
              backgroundImage: `url(${scene.bg})`,
              transform: `translateZ(${lerp(-220, 0, inP) - outP * 300}px) scale(${lerp(1.12, 1.02, inP)})`,
              opacity: inP * (1 - outP * 0.9),
            }}
          />
          <div className="jr-bridge-scrim" />

          <div
            className="jr-bridge-body"
            style={{ opacity: inP * (1 - outP), transform: `translateZ(${outP * -180}px)` }}
          >
            <div className="jr-bridge-head">
              <div className={`jr-bridge-chip ${caught ? 'is-caught' : 'is-escaped'}`}>
                {caught ? '⛓ Jack is in irons' : '🏴‍☠️ Jack got away'}
              </div>
              <div className="jr-act-eyebrow">{scene.eyebrow}</div>
              <h2>{scene.title}</h2>
            </div>

            <div className="jr-bridge-lines">
              {scene.lines.map((l, i) => {
                const lp = easeOut(range(p, 0.16 + i * slice, 0.16 + i * slice + slice * 0.7));
                return (
                  <div
                    key={i}
                    className="jr-bridge-line"
                    style={{
                      opacity: lp,
                      transform: `translateY(${(1 - lp) * 26}px) rotateX(${(1 - lp) * 12}deg)`,
                    }}
                  >
                    <div className="jr-speaker">{l.speaker}</div>
                    <p>{l.text}</p>
                  </div>
                );
              })}
            </div>

            <div
              className="jr-bridge-teaser"
              style={{
                opacity: easeOut(range(p, 0.7, 0.84)),
                transform: `translateY(${(1 - easeOut(range(p, 0.7, 0.84))) * 20}px)`,
              }}
            >
              <span className="jr-teaser-count">{islandCount}</span>
              <div>
                <strong>{caught ? 'Seven islands, one chest.' : 'Seven islands, one pirate.'}</strong>
                <p>
                  Two branches were enough for one island. Seven of them need a ladder of questions
                  — <code>if</code>, then <code>elif</code>, then <code>elif</code>… and one final{' '}
                  <code>else</code> for the day it is none of them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
