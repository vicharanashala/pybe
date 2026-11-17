import React from 'react';
import Maya from './Maya';
import PyCode from './PyCode';

// The story beats around the challenge, one screen at a time. Each screen is a
// small step forward rather than a page of text — the learner should be able to
// read it at a glance and move on.

function MayaLine({ mood, children }) {
  return (
    <div className="pf-dialogue">
      <Maya mood={mood} size={72} />
      <blockquote className="pf-bubble">
        <p>{children}</p>
        <cite>Maya</cite>
      </blockquote>
    </div>
  );
}

function Scene({ chapter, onNext }) {
  const { scene } = chapter;
  return (
    <>
      <p className="pf-eyebrow">Chapter {chapter.id} · {chapter.concept}</p>
      <h2>{scene.heading}</h2>
      {scene.lines.map((line) => (
        <p key={line} className="pf-story-line">{line}</p>
      ))}

      {scene.note && (
        <figure className="pf-note">
          <blockquote>{scene.note.text}</blockquote>
          <figcaption>{scene.note.from}</figcaption>
        </figure>
      )}

      <MayaLine mood={scene.mayaMood}>{scene.mayaLine}</MayaLine>
      <button type="button" className="pf-btn pf-btn-primary" onClick={onNext}>
        Look around the farm <span aria-hidden="true">→</span>
      </button>
    </>
  );
}

function Problem({ chapter, onNext }) {
  const { problem } = chapter;
  return (
    <>
      <p className="pf-eyebrow">The problem</p>
      <h2>{problem.heading}</h2>
      <p className="pf-story-line">{problem.body}</p>

      <ul className="pf-tally">
        {problem.tally.map((item) => (
          <li key={item.label}>
            <span className="pf-tally-icon" aria-hidden="true">{item.icon}</span>
            <span className="pf-tally-label">{item.label}</span>
            <span className="pf-tally-value">{item.value}</span>
          </li>
        ))}
      </ul>

      <MayaLine mood={problem.mayaMood}>{problem.mayaLine}</MayaLine>
      <button type="button" className="pf-btn pf-btn-primary" onClick={onNext}>
        Help Maya decide <span aria-hidden="true">→</span>
      </button>
    </>
  );
}

// The decision comes BEFORE the concept is named, so the learner reasons their
// way to it rather than being handed a definition. A wrong choice explains the
// consequence and lets them choose again — nothing is locked.
function Think({ chapter, choiceId, onChoose, onNext }) {
  const { think } = chapter;
  const chosen = think.options.find((o) => o.id === choiceId) ?? null;

  return (
    <>
      <p className="pf-eyebrow">Think it through</p>
      <h2>{think.heading}</h2>
      <p className="pf-story-line">{think.prompt}</p>

      <div className="pf-choices" role="group" aria-label={think.heading}>
        {think.options.map((option) => {
          const isChosen = option.id === choiceId;
          return (
            <button
              key={option.id}
              type="button"
              className={`pf-choice${isChosen ? (option.correct ? ' pf-choice-right' : ' pf-choice-wrong') : ''}`}
              aria-pressed={isChosen}
              onClick={() => onChoose(option.id)}
            >
              <span className="pf-choice-mark" aria-hidden="true">
                {isChosen ? (option.correct ? '✔' : '✖') : '○'}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {chosen && (
          <div className={`pf-feedback ${chosen.correct ? 'pf-feedback-pass' : 'pf-feedback-fail'}`}>
            <span aria-hidden="true">{chosen.correct ? '✔' : '✖'}</span>
            <div>
              <strong>{chosen.correct ? "That's the one" : 'Not quite'}</strong>
              <p>{chosen.response}</p>
            </div>
          </div>
        )}
      </div>

      {chosen?.correct && (
        <button type="button" className="pf-btn pf-btn-primary" onClick={onNext}>
          So what is that called? <span aria-hidden="true">→</span>
        </button>
      )}
    </>
  );
}

function Reveal({ chapter, onNext }) {
  const { reveal } = chapter;
  return (
    <>
      <p className="pf-eyebrow">Concept</p>
      <h2>
        <span className="pf-concept-chip">{reveal.conceptLabel}</span>
        {reveal.heading}
      </h2>
      <p className="pf-story-line">{reveal.body}</p>

      <PyCode code={reveal.code} className="pf-code-feature" />
      <p className="pf-code-caption">{reveal.caption}</p>

      <MayaLine mood={reveal.mayaMood}>Show me how it works.</MayaLine>
      <button type="button" className="pf-btn pf-btn-primary" onClick={onNext}>
        Break it down <span aria-hidden="true">→</span>
      </button>
    </>
  );
}

function Explain({ chapter, onNext }) {
  const { explain } = chapter;
  return (
    <>
      <p className="pf-eyebrow">How it works</p>
      <h2>{explain.heading}</h2>

      <ol className="pf-explain">
        {explain.points.map((point) => (
          <li key={point.code}>
            <PyCode code={point.code} className="pf-code-inline" />
            <p>{point.text}</p>
          </li>
        ))}
      </ol>

      {explain.warning && (
        <p className="pf-callout">
          <span aria-hidden="true">⚠</span> {explain.warning}
        </p>
      )}

      <MayaLine mood={explain.mayaMood}>{explain.mayaLine}</MayaLine>
      <button type="button" className="pf-btn pf-btn-primary" onClick={onNext}>
        Write the code <span aria-hidden="true">→</span>
      </button>
    </>
  );
}

// Beats 10 to 12: the mission is done, the XP is awarded, and the next chapter
// opens. The XP figure is announced so it is not delivered by animation alone.
function Complete({ chapter, mission, farm, hintsUsed, nextChapterTitle, onNextChapter, onBackToChapters }) {
  const { complete } = chapter;

  return (
    <div className="pf-complete">
      <Maya mood={complete.mayaMood} size={148} />

      <p className="pf-eyebrow">
        <span aria-hidden="true">🎉</span> {complete.heading}
      </p>
      <h2>{mission.title}</h2>

      <p className="pf-reward" aria-live="polite">
        <span aria-hidden="true">⭐</span> +{mission.xp} XP
      </p>
      <p className="pf-reward-total">
        Total XP: {farm.xp}
        {hintsUsed > 0 && ` · ${hintsUsed} hint${hintsUsed === 1 ? '' : 's'} used`}
      </p>

      <MayaLine mood={complete.mayaMood}>{complete.mayaLine}</MayaLine>

      <p className="pf-unlock">{complete.unlockText}</p>

      <div className="pf-complete-actions">
        {onNextChapter && (
          <button type="button" className="pf-btn pf-btn-primary" onClick={onNextChapter}>
            Start {nextChapterTitle} <span aria-hidden="true">→</span>
          </button>
        )}
        <button type="button" className="pf-btn pf-btn-ghost" onClick={onBackToChapters}>
          Back to chapters
        </button>
      </div>
    </div>
  );
}

export default function StoryPanel(props) {
  switch (props.stage) {
    case 'scene':
      return <Scene {...props} />;
    case 'problem':
      return <Problem {...props} />;
    case 'think':
      return <Think {...props} />;
    case 'reveal':
      return <Reveal {...props} />;
    case 'explain':
      return <Explain {...props} />;
    case 'complete':
      return <Complete {...props} />;
    default:
      return null;
  }
}
