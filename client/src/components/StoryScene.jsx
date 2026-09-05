import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, ChevronLeft } from 'lucide-react';

function StoryScene({ scene, sceneIndex, sceneCount, fallbackImage, onNext, onBack }) {
  const isLastScene = sceneIndex === sceneCount - 1;
  const [imageSrc, setImageSrc] = useState(scene.image);

  useEffect(() => {
    setImageSrc(scene.image);
  }, [scene.image]);

  return (
    <article className="lj-story-layout" key={scene.id}>
      <div className="lj-image-card">
        <img
          className="lj-story-image"
          src={imageSrc}
          alt={scene.imageAlt}
          onError={(event) => {
            event.currentTarget.onerror = null;
            setImageSrc(fallbackImage);
          }}
        />
        <span className="lj-scene-number">{scene.label}</span>
      </div>
      <div className="lj-content-card">
        <div className="lj-kicker"><BookOpen size={16} /> A story about decisions</div>
        <p className="lj-progress-label">Scene {sceneIndex + 1} of {sceneCount}</p>
        <div className="lj-progress-bar" aria-hidden="true"><span style={{ width: `${((sceneIndex + 1) / sceneCount) * 100}%` }} /></div>
        <p className="lj-story-text">{scene.text}</p>
        <div className="lj-actions">
          {onBack && (
            <button type="button" className="lj-button lj-button-secondary" onClick={onBack}>
              <ChevronLeft size={17} /> Back
            </button>
          )}
          <button type="button" className="lj-button lj-button-primary" onClick={onNext}>
            {isLastScene ? 'Start Quiz' : 'Next'} <ArrowRight size={17} />
            {isLastScene && <span aria-hidden="true">🧠</span>}
          </button>
        </div>
      </div>
    </article>
  );
}

export default StoryScene;
