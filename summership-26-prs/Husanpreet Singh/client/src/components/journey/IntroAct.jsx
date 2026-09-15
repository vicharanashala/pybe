import React, { useRef } from 'react';
import { INTRO_SCENES } from '../../data/story';
import { useScrollProgress, useSectionLabel, range, ease, easeOut, lerp } from './scrollUtils';

/* =========================================================
   Act 0 — the opening cinematic.
   Same seven plates and the same narration as the original
   click-through intro, re-cut so the scroll wheel is the
   "Next" button and each plate pushes back in 3D as it leaves.
   ========================================================= */

function CineScene({ scene, index, total, onActive }) {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  useSectionLabel(ref, `Prologue · ${index + 1}/${total}`, onActive);

  const inP = easeOut(range(p, 0.0, 0.32));
  const outP = ease(range(p, 0.74, 1.0));

  const plate = {
    transform: `translateZ(${lerp(-260, 0, inP) - outP * 340}px) scale(${lerp(1.14, 1.0, inP)}) translateY(${outP * -6}%)`,
    opacity: inP * (1 - outP * 0.92),
  };
  const box = {
    transform: `translateY(${lerp(70, 0, inP)}px) rotateX(${lerp(14, 0, inP)}deg) translateZ(${outP * -220}px)`,
    opacity: inP * (1 - outP),
  };

  return (
    <section className="jr-cine" ref={ref} data-scene={scene.id}>
      <div className="jr-cine-sticky">
        <div className="jr-cine-space">
          <div className="jr-cine-plate" style={plate}>
            <div className="jr-cine-img" style={{ backgroundImage: `url(${scene.bg})` }} />
            <div className="jr-cine-vignette" />
          </div>

          <div className={`jr-cine-box jr-tone-${scene.type}`} style={box}>
            {scene.type === 'title' ? (
              <>
                <div className="jr-cine-eyebrow">Chapter I · Conditional Logic</div>
                <h1 className="jr-cine-title">The Hunt for Calico Jack</h1>
                <p className="jr-cine-text">{scene.text}</p>
                <div className="jr-scroll-cue">
                  <span>scroll to sail</span>
                  <i className="jr-chevron" />
                </div>
              </>
            ) : (
              <>
                <div className="jr-speaker">{scene.speaker}</div>
                <p className="jr-cine-text">{scene.text}</p>
              </>
            )}
          </div>
        </div>

        <div className="jr-cine-dots">
          {INTRO_SCENES.map((s, i) => (
            <i key={s.id} className={i === index ? 'is-on' : ''} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function IntroAct({ onActive }) {
  return (
    <div className="jr-intro">
      {INTRO_SCENES.map((scene, i) => (
        <CineScene key={scene.id} scene={scene} index={i} total={INTRO_SCENES.length} onActive={onActive} />
      ))}
    </div>
  );
}
