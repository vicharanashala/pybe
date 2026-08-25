import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Code2, Star, X, ChevronRight, ArrowRight, Zap } from 'lucide-react';
import { StoryCartoonBanner } from './StoryCartoonBanner';
import { StepCartoonBadge } from './StepCartoonBadge';

const RICH_NARRATIVES = {
  red_hood: {
    start: "Red Riding Hood sets off into the deep forest carrying a basket of warm pastries to visit her grandmother.",
    plot: "She arrives at the cottage and enters the room. However, the Big Bad Wolf has already sneaked in and disguised himself in Grandma's nightgown, lying in bed. Confused by the guest's look, Red Riding Hood calls the Grandma action: guest.bake_pastries().",
    mapping: "Because guest is a Wolf object and not a Grandma, it lacks the bake_pastries method, which triggers an AttributeError exception. The program catches this risk, triggering the woodcutter rescue unit immediately to save her."
  },
  tortoise_hare: {
    start: "The proud Hare challenges the steady Tortoise to a race. Sure of winning, the Hare sprints ahead.",
    plot: "Halfway through, the Hare decides to take a quick nap, setting his speed to 0. The race system calculates completion time: distance / speed.",
    mapping: "Since speed is 0, this division throws a ZeroDivisionError! The code catches this error, wakes the Hare up, and awards the win to the Tortoise who ran at a constant speed. The else: block only runs if the race finishes cleanly without speed dropping to zero."
  },
  goldilocks: {
    start: "Goldilocks wanders into the Bears' empty cottage and discovers three bowls of porridge on the table.",
    plot: "She checks bowls at indices 0 to 2. Greedy for more, she attempts to taste bowls[5], which exceeds the list's capacity.",
    mapping: "This lookup throws an IndexError! Later, searching for her name in the bear_beds dictionary throws a KeyError. The except blocks catch both bounds and key errors to safely escort her out before the bears return."
  },
  cried_wolf: {
    start: "A shepherd boy stands bored on a hill watching the village flock of sheep.",
    plot: "To prank the village, he deliberately decides to trigger an alarm: raise ValueError('Prank!'). Later, a real predator emerges.",
    mapping: "To alert the village for real, the boy raises a custom exception: raise WolfAlarmError('REAL WOLF!'). The villagers catch this custom exception to mobilize the guards. Using raise lets you trigger exceptions manually based on rules."
  },
  three_pigs: {
    start: "Three little pigs construct houses using straw, wood, and sturdy bricks.",
    plot: "The Wolf blows down the straw and wood houses, raising collapse exceptions. The brick house stands firm.",
    mapping: "No matter if a house collapses (exception) or stands (success), the construction tools must be put away. The finally: block guarantees that lock_site() and cleanup_tools() always execute in both success and failure cases."
  },
  hansel_gretel: {
    start: "Hansel and Gretel drop breadcrumbs along the forest path to save their navigation trail.",
    plot: "Overnight, hungry forest birds devour all the breadcrumbs. When the children try to execute open('breadcrumbs_trail.txt'), the file is missing.",
    mapping: "The missing file raises a FileNotFoundError. The children catch this error and switch to their emergency backup: a brass compass. This allows them to navigate home safely."
  },
  jack_beanstalk: {
    start: "Jack trades his cow for magic beans, but the count is stored as a string value '5'.",
    plot: "He attempts to add 3 magic potions directly to the bean count: magic_beans + 3.",
    mapping: "Python throws a TypeError because you cannot add a string and an integer. Jack catches the TypeError and converts the bean count using int(magic_beans) + 3 to successfully complete the recipe."
  },
  aladdin_genie: {
    start: "Aladdin rubs the magic lamp and asks the Genie to grant his wishes.",
    plot: "Aladdin asks for 5 wishes. However, cosmic rules allow a maximum of 3 wishes per rub.",
    mapping: "Attempting to request more wishes raises a PermissionError. Aladdin's lamp controller catches the permission error and automatically resets the wish count to the maximum allowed limit of 3."
  },
  cinderella: {
    start: "Cinderella receives a beautiful carriage and gown from her Fairy Godmother to attend the royal ball.",
    plot: "The magic is bound to a strict midnight timer. As she dances, the clock strikes 12:01 AM.",
    mapping: "Exceeding the time limit raises a TimeoutError. Her handler catches this timeout, instantly reverts the coach to a pumpkin, and prompts her to escape before the Prince notices her dress has turned back to rags."
  },
  pied_piper: {
    start: "The Pied Piper plays his magic flute to lead all the rats out of the town of Hamelin.",
    plot: "He tries to load trillions of rats into a single massive array list all at once: rats = [0] * (10 ** 12).",
    mapping: "This massive allocation exceeds the system's RAM capacity, raising a MemoryError. The Piper catches the memory exception and resolves it by processing the rats in safe, small batches of 100 rats at a time."
  }
};

function StoryModal({ story, onClose, onLoadDebugger, onActivityDone }) {
  const narrative = RICH_NARRATIVES[story.id] || { start: '', plot: '', mapping: '' };

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="story-modal-backdrop" onClick={onClose}>
      <div className="story-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Floating Close Button */}
        <button className="story-modal-close-floating" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Scrollable Container containing all 3 sequential parts */}
        <div className="story-modal-scroll-container">
          
          {/* FIRST: Story Header Illustration Image */}
          <div className="story-detail-part part-1-header-image">
            <StoryCartoonBanner story={story} mode="imageOnly" />
          </div>

          {/* Story Title & Meta Info Header */}
          <div className="story-modal-header-block">
            <div className="story-modal-hero">
              <span className="story-modal-icon">{story.icon}</span>
              <div>
                <span className="story-modal-error-badge">{story.errorType}</span>
                <h2 className="story-modal-title">{story.title}</h2>
                <p className="story-modal-concept">🐍 Python Concept: <strong>{story.pythonConcept}</strong></p>
              </div>
            </div>
          </div>

          {/* THIRD: The rest of the text content below it */}
          <div className="story-detail-part part-3-text-content">
            {/* Full Story Section */}
            <div className="story-modal-section">
              <div className="story-modal-section-title">
                <Sparkles size={16} />
                <span>Full Story</span>
              </div>
              <div className="story-modal-narrative">
                <div className="story-modal-narrative-block start">
                  <span className="snb-label">🎬 The Start</span>
                  <p>{narrative.start}</p>
                </div>
                <div className="story-modal-narrative-block conflict">
                  <span className="snb-label">⚡ The Conflict</span>
                  <p>{narrative.plot}</p>
                </div>
                <div className="story-modal-narrative-block mapping">
                  <span className="snb-label">🛠️ Python Exception Mapping</span>
                  <p>{narrative.mapping}</p>
                </div>
              </div>
            </div>

            {/* Story Sentences to Code Line Mapping Section */}
            <div className="story-modal-section">
              <div className="story-modal-section-title">
                <BookOpen size={16} />
                <span>Story Sentences to Code Line Mapping</span>
              </div>
              <div className="story-modal-steps">
                {story.sentenceMappings.map((map) => (
                  <div key={map.stepNumber} className="story-modal-step">
                    <div className="sms-header-row">
                      <div className="sms-num">Step {map.stepNumber}</div>
                      <StepCartoonBadge storyId={story.id} stepNumber={map.stepNumber} />
                    </div>
                    <div className="sms-body">
                      <p className="sms-sentence">"{map.sentence}"</p>
                      <div className="sms-code-row">
                        <ArrowRight size={13} className="sms-arrow" />
                        <code className="sms-code">{map.codeLine}</code>
                        <span className="sms-tag">{map.conceptTag}</span>
                      </div>
                      <small className="sms-exp">💡 {map.explanation}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="story-modal-cta">
              <button
                className="story-modal-debugger-btn"
                onClick={() => { onActivityDone && onActivityDone(); onClose(); onLoadDebugger(story.id); }}
              >
                <Zap size={17} />
                Open in Debugger Simulator
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Page1Stories({
  stories,
  activeStory,
  onSelectStory,
  onLoadDebugger,
  onActivityDone,
  completedStories = [],
  unlockedStories = ['red_hood']
}) {
  const [filterError, setFilterError] = useState('ALL');
  const [modalStory, setModalStory] = useState(null);
  const [lockedToast, setLockedToast] = useState(null);

  const filteredStories = filterError === 'ALL'
    ? stories
    : filterError === 'COMPLETED'
    ? stories.filter(s => completedStories.includes(s.id))
    : stories.filter(s => s.errorType.includes(filterError));


  const handleCardClick = (story, isUnlocked, storyIndex) => {
    if (!isUnlocked) {
      const prevStory = stories[storyIndex - 1];
      setLockedToast(`🔒 Story Locked! Complete Story ${storyIndex} (${prevStory?.character || 'previous story'}) to unlock!`);
      setTimeout(() => setLockedToast(null), 3000);
      return;
    }
    onSelectStory(story.id);
    setModalStory(story);
    onActivityDone && onActivityDone();
  };

  return (
    <div className="page1-root">
      {/* Locked Story Toast Notification */}
      {lockedToast && (
        <div className="story-locked-toast">
          <span>{lockedToast}</span>
        </div>
      )}

      {/* Modal */}
      {modalStory && (
        <StoryModal
          story={modalStory}
          onClose={() => setModalStory(null)}
          onLoadDebugger={onLoadDebugger}
          onActivityDone={onActivityDone}
        />
      )}

      {/* 1. Hero Block */}
      <div className="page1-hero">
        <div className="page1-hero-text">
          <span className="page1-badge"><Sparkles size={14} /> Stage 1: Sequential Fairytale Learning Foundation</span>
          <h2>The Magic of Code: 10 Sequential Fairytale Exception Stories</h2>
          <p>Complete each story's 8 stages to unlock the next fairytale story in order!</p>
        </div>

        {/* Filter Pills */}
        <div className="page1-filter-pills">
          {['ALL', 'COMPLETED', 'AttributeError', 'ZeroDivisionError', 'IndexError', 'FileNotFoundError', 'TypeError', 'PermissionError', 'TimeoutError', 'MemoryError'].map(f => (
            <button
              key={f}
              className={`filter-pill ${filterError === f ? 'active' : ''}`}
              onClick={() => setFilterError(f)}
            >
              {f === 'COMPLETED' ? `✓ Completed (${completedStories.length}/10)` : f}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Story Cards Grid */}
      <div className="page1-grid-title">
        <Star size={18} />
        <h3>Select an Unlocked Fairytale to View Full Story &amp; Code Mapping:</h3>
      </div>

      <div className="page1-stories-grid">
        {filteredStories.map((story, idx) => {
          const isActive = story.id === activeStory?.id;
          const isStoryDone = completedStories.includes(story.id);
          const isUnlocked = unlockedStories.includes(story.id);
          const globalIdx = stories.findIndex(s => s.id === story.id);

          return (
            <div
              key={story.id}
              className={`story-card-full expanded-card story-card-clickable ${
                isActive ? 'selected' : ''
              } ${isStoryDone ? 'completed-story-card' : ''} ${!isUnlocked ? 'locked-story-card' : ''}`}
              onClick={() => handleCardClick(story, isUnlocked, globalIdx)}
              title={!isUnlocked ? `Complete Story ${globalIdx} to unlock` : `Click to open ${story.title}`}
            >
              <StoryCartoonBanner story={story} isThumbnail={true} />
              <div className="sc-header">
                <span className="sc-icon">{isUnlocked ? story.icon : '🔒'}</span>
                <div className="sc-badges-wrap">
                  {isStoryDone && (
                    <span className="sc-completed-badge">✓ Completed</span>
                  )}
                  {!isStoryDone && isUnlocked && (
                    <span className="sc-unlocked-badge">✨ Unlocked</span>
                  )}
                  {!isUnlocked && (
                    <span className="sc-locked-badge">🔒 Locked</span>
                  )}
                  <span className="sc-error-badge">{story.errorType}</span>
                </div>
              </div>
              <h4 className="sc-title">{story.title}</h4>
              <p className="sc-concept-mapping-label">🐍 Concept: {story.pythonConcept}</p>
              <div className="sc-footer">
                <span className="sc-concept">
                  {isStoryDone
                    ? '✓ Story Mastered — Click to Review'
                    : isUnlocked
                    ? 'Click to open full story & debug'
                    : `🔒 Complete Story ${globalIdx} to unlock`}
                </span>
                <ChevronRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
