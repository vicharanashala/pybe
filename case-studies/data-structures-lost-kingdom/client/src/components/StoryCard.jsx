import React from 'react';

/**
 * StoryCard — renders the illustrated story section for a chapter.
 *
 * Props:
 *   story          — { title, illustration, scenery, paragraphs, analogy }
 *   chapterColor   — CSS colour string
 *   chapterColorDim
 *   chapterGlow
 */
export default function StoryCard({ story, chapterColor, chapterColorDim, chapterGlow }) {
  return (
    <div
      className="story-card"
      style={{
        '--chapter-color': chapterColor,
        '--chapter-color-dim': chapterColorDim,
        '--chapter-glow': chapterGlow
      }}
    >
      {/* Illustration area */}
      <div className="story-illustration">
        <span className="story-main-emoji" role="img" aria-label="chapter illustration">
          {story.illustration}
        </span>
        {story.scenery && (
          <div className="story-scenery" aria-hidden="true">{story.scenery}</div>
        )}
      </div>

      {/* Story text */}
      <div className="story-body">
        <h2 className="story-title">{story.title}</h2>

        {story.paragraphs.map((para, i) => (
          <p className="story-paragraph" key={i}>{para}</p>
        ))}

        {story.analogy && (
          <blockquote className="story-analogy">
            💡 {story.analogy}
          </blockquote>
        )}
      </div>
    </div>
  );
}
