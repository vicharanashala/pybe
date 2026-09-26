import React, { useMemo, useState } from 'react';

const COPY = {
  folk: {
    eyebrow: 'Story Bridge',
    title: ['You already know the story.', 'Now find the Python in it.'],
    lede:
      'Each of these is a tale you were told as a child. Read it, then see the exact place where ' +
      'its logic and a Python construct turn out to be the same shape.'
  },
  'real-world': {
    eyebrow: 'Story Bridge · Real world',
    title: ['This really happened.', 'Now find the Python in it.'],
    lede:
      'Each of these is a real incident, or a system you use every week. Read what happened, then ' +
      'see the exact place where it and a Python construct turn out to be the same shape.'
  }
};

export default function StoryLibrary({ collection = 'folk', stories, progress, onOpen }) {
  const copy = COPY[collection] || COPY.folk;
  const [concept, setConcept] = useState('');

  const concepts = useMemo(
    () => [...new Set(stories.map((story) => story.conceptLabel))].sort(),
    [stories]
  );

  // One card per concept. The primary telling is the lowest `order` in the group;
  // a second telling is reachable only from inside its sibling, never from here.
  const groups = useMemo(() => {
    const byConcept = new Map();
    for (const story of stories) {
      const existing = byConcept.get(story.concept);
      if (existing) existing.push(story);
      else byConcept.set(story.concept, [story]);
    }
    return [...byConcept.values()].map((tellings) => {
      const sorted = [...tellings].sort((a, b) => (a.order || 0) - (b.order || 0));
      return { concept: sorted[0].concept, primary: sorted[0], tellings: sorted };
    });
  }, [stories]);

  const visible = concept
    ? groups.filter((group) => group.primary.conceptLabel === concept)
    : groups;
  const byStory = progress?.byStory || {};

  return (
    <div className="sb-library">
      <header className="sb-library-head">
        <p className="sb-eyebrow">{copy.eyebrow}</p>
        <h1 className="sb-display">
          {copy.title[0]}
          <br />
          {copy.title[1]}
        </h1>
        <p className="sb-lede">{copy.lede}</p>

        {progress && (
          <dl className="sb-tally">
            <div>
              <dt>Concepts</dt>
              <dd>{progress.conceptsTotal}</dd>
            </div>
            <div>
              <dt>Explored</dt>
              <dd>{progress.conceptsAttempted}</dd>
            </div>
            <div>
              <dt>Full marks</dt>
              <dd>{progress.conceptsMastered}</dd>
            </div>
          </dl>
        )}
      </header>

      {concepts.length > 1 && (
        <div className="sb-filter" role="group" aria-label="Filter by concept">
          <button className={concept === '' ? 'sb-chip is-on' : 'sb-chip'} onClick={() => setConcept('')}>
            All concepts
          </button>
          {concepts.map((item) => (
            <button
              key={item}
              className={concept === item ? 'sb-chip is-on' : 'sb-chip'}
              onClick={() => setConcept(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <ul className="sb-grid">
        {visible.map((group) => {
          const story = group.primary;
          // Best score across the group — a learner who took only the alternate has
          // still done this concept, and the card must not read as untouched.
          const records = group.tellings.map((item) => byStory[item.storyId]).filter(Boolean);
          const record = records.length
            ? records.reduce((best, item) => (item.bestScore > best.bestScore ? item : best))
            : null;

          return (
            <li key={group.concept}>
              <button className="sb-card" onClick={() => onOpen(story.storyId)}>
                <span className="sb-card-art" aria-hidden="true">
                  {story.cover && <img src={story.cover} alt="" loading="lazy" />}
                </span>
                <span className="sb-card-body">
                  <span className="sb-card-concept">
                    {story.conceptLabel}
                    {group.tellings.length > 1 && (
                      <em className="sb-tellings">{group.tellings.length} tellings</em>
                    )}
                  </span>
                  <strong className="sb-card-title">{story.title}</strong>
                  <span className="sb-card-blurb">{story.blurb}</span>
                  <span className="sb-card-foot">
                    <span>{story.panelCount} panels · {story.quizCount} questions</span>
                    {record && (
                      <span className={record.bestScore === record.total ? 'sb-score is-full' : 'sb-score'}>
                        {record.bestScore}/{record.total}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="sb-empty">No stories for that concept yet. Pick another, or write one.</p>
      )}
    </div>
  );
}
