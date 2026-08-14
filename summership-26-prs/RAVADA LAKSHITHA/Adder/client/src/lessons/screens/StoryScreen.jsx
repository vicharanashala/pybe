import React, { useState } from 'react';
import { LessonPrimaryButton, LessonIllustration } from '../components/LessonUI';
import { createLessonError, LessonErrorCodes } from '../errors';

/**
 * Screen 1 — renders `story.scenes` one at a time, in order, and calls
 * `onComplete` after the learner advances past the last scene.
 *
 * Purpose:
 *   Tell the Adder story, scene by scene, at the learner's own pace.
 *
 * Inputs (props):
 * @param {Object} story - The `adderStory` content object
 *   (`{ id, title, scenes: [...] }`). Required.
 * @param {Function} onComplete - Called once, when the learner advances
 *   past the final scene. Required.
 *
 * Outputs:
 * @returns {JSX.Element} The current scene's optional illustration
 *   (left, via `LessonIllustration`, only when `scene.image` is set),
 *   its lines, its optional interaction, and a continue button (right).
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.SCREEN_CONTENT_MISSING` if `story`
 *   or `onComplete` is not provided.
 *
 * Side effects:
 *   Calls the caller-supplied `onComplete` exactly once, when the
 *   learner finishes the last scene.
 *
 * State owned by this component:
 *   - `sceneIndex` — which scene is currently showing.
 *   - `interactionTriggered` — whether the current scene's optional
 *     interaction (e.g. "hand Adder the two slips") has been clicked.
 *   No other screen reads or writes this state. Unchanged from before
 *   this pass — this update only changed what's rendered, not what
 *   state exists or how it's computed.
 *
 * Layout note (UI refinement, Phase 4): a single layout structure is
 * always rendered — `LessonIllustration` is always called, and it
 * renders nothing itself when a scene has no `image` (see its own doc
 * comment in components/LessonUI.jsx). This keeps StoryScreen from
 * needing two different layouts for "scene with image" vs. "scene
 * without" — the surrounding structure is identical either way. No
 * scene in `adderContent.js` currently sets `image`, so this behaves
 * identically to before until real illustration paths are added.
 */
export function StoryScreen({ story, onComplete }) {
  if (!story || typeof onComplete !== 'function') {
    throw createLessonError(LessonErrorCodes.SCREEN_CONTENT_MISSING, {
      screen: 'StoryScreen',
      missing: !story ? 'story' : 'onComplete',
    });
  }

  const [sceneIndex, setSceneIndex] = useState(0);
  const [interactionTriggered, setInteractionTriggered] = useState(false);

  const scene = story.scenes[sceneIndex];
  const isLastScene = sceneIndex === story.scenes.length - 1;
  const canContinue = !scene.interaction || interactionTriggered;

  function handleContinue() {
    if (isLastScene) {
      onComplete();
      return;
    }
    setSceneIndex(sceneIndex + 1);
    setInteractionTriggered(false);
  }

  return (
    <section className="lesson-screen lesson-story-screen">
      <div className="lesson-story-layout">
        <div className="lesson-story-layout__image">
          <LessonIllustration src={scene.image} alt={scene.imageAlt} />
        </div>
        <div className="lesson-story-layout__content">
          {scene.lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}

          {scene.interaction && !interactionTriggered ? (
            <LessonPrimaryButton
              label={scene.interaction.promptLabel}
              onClick={() => setInteractionTriggered(true)}
            />
          ) : null}

          {scene.interaction && interactionTriggered ? (
            <p className="lesson-story-result">{scene.interaction.resultLabel}</p>
          ) : null}

          {canContinue ? (
            <LessonPrimaryButton label={scene.continueLabel} onClick={handleContinue} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
