import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Code2, GitBranch, GraduationCap, Sparkles } from 'lucide-react';
import conditionalStories from '../data/conditionalStory';
import { readLearningJourneyStatus, saveLearningJourneyStatus } from '../data/learningJourneyProgress';
import StoryScene from '../components/StoryScene';
import Quiz from '../components/Quiz';
import ConceptMapping from '../components/ConceptMapping';
import CodeExplanation from '../components/CodeExplanation';
import LessonComplete from '../components/LessonComplete';
import '../styles/learningJourney.css';

const STAGES = [
  { id: 'story-selection', label: 'Choose a story', icon: Sparkles },
  { id: 'story', label: 'Story', icon: BookOpen },
  { id: 'quiz', label: 'Quiz', icon: CheckCircle2 },
  { id: 'mapping', label: 'Mapping', icon: GitBranch },
  { id: 'code', label: 'Python', icon: Code2 },
  { id: 'complete', label: 'Complete', icon: GraduationCap }
];

function LearningJourney() {
  const [savedStatus] = useState(readLearningJourneyStatus);
  const [stage, setStage] = useState(savedStatus.stage);
  const [selectedStory, setSelectedStory] = useState(() => conditionalStories.find((story) => story.id === savedStatus.storyId) || null);
  const [sceneIndex, setSceneIndex] = useState(savedStatus.sceneIndex || 0);
  const [score, setScore] = useState(savedStatus.score);

  useEffect(() => {
    const currentStageIndex = STAGES.findIndex((item) => item.id === stage);
    const progressPercent = stage === 'complete'
      ? 100
      : Math.round((Math.max(currentStageIndex, 0) / (STAGES.length - 1)) * 100);

    saveLearningJourneyStatus({
      stage,
      stageLabel: STAGES[currentStageIndex]?.label || 'Choose a story',
      storyId: selectedStory?.id || null,
      storyTitle: selectedStory?.title || null,
      sceneIndex: stage === 'story' ? sceneIndex : null,
      sceneCount: stage === 'story' ? selectedStory?.scenes.length || null : null,
      score: stage === 'complete' ? score : null,
      progressPercent,
      updatedAt: new Date().toISOString()
    });
  }, [stage, selectedStory, sceneIndex, score]);

  function restartJourney() {
    setStage('story');
    setSceneIndex(0);
    setScore(null);
  }

  function chooseStory(story) {
    setSelectedStory(story);
    setStage('story');
    setSceneIndex(0);
    setScore(null);
  }

  function chooseAnotherStory() {
    setStage('story-selection');
    setSelectedStory(null);
    setSceneIndex(0);
    setScore(null);
  }

  function handleNextScene() {
    if (sceneIndex < selectedStory.scenes.length - 1) {
      setSceneIndex((currentIndex) => currentIndex + 1);
      return;
    }
    setStage('quiz');
  }

  function handleQuizComplete(finalScore) {
    setScore(finalScore);
    setStage('mapping');
  }

  const currentStageIndex = STAGES.findIndex((item) => item.id === stage);

  return (
    <main className="lj-page">
      <header className="lj-header">
        <div className="lj-header-copy">
          <p className="lj-eyebrow"><GraduationCap size={16} /> Interactive concept journey</p>
          <h1>{stage === 'story-selection' ? 'Learn Conditionals 🎯' : selectedStory.title}</h1>
          <p>{stage === 'story-selection' ? 'Choose a real-world story and discover how everyday decisions connect to Python.' : selectedStory.introduction}</p>
          <span className="lj-concept-pill">Conditionals</span>
        </div>
        <div className="lj-header-mark" aria-hidden="true"><BookOpen size={54} /></div>
      </header>

      <nav className="lj-stage-nav" aria-label="Learning journey progress">
        {STAGES.map((item, index) => {
          const Icon = item.icon;
          const isCurrent = item.id === stage;
          const isComplete = index < currentStageIndex;
          return (
            <React.Fragment key={item.id}>
              <div className={`lj-stage${isCurrent ? ' is-current' : ''}${isComplete ? ' is-complete' : ''}`}>
                <span><Icon size={15} /></span>
                <small>{item.label}</small>
              </div>
              {index < STAGES.length - 1 && <div className={`lj-stage-line${isComplete ? ' is-complete' : ''}`} />}
            </React.Fragment>
          );
        })}
      </nav>

      <div className="lj-content">
        {stage === 'story-selection' && (
          <section className="lj-selection-page" aria-labelledby="lj-selection-title">
            <div className="lj-selection-header">
              <p className="lj-eyebrow"><Sparkles size={16} /> Choose your starting point</p>
              <h2 id="lj-selection-title">Four stories, one powerful idea</h2>
              <p>Pick a familiar decision and follow it all the way to Python code.</p>
            </div>
            <div className="lj-story-grid">
              {conditionalStories.map((story) => (
                <article className="lj-story-card" key={story.id}>
                  <div className="lj-story-icon" aria-hidden="true">{story.icon}</div>
                  <h3>{story.title}</h3>
                  <p className="lj-story-description">{story.description}</p>
                  <button type="button" className="lj-story-start-button" onClick={() => chooseStory(story)}>
                    Start Story <ArrowRight size={17} />
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
        {stage === 'story' && selectedStory && (
          <StoryScene
            scene={selectedStory.scenes[sceneIndex]}
            sceneIndex={sceneIndex}
            sceneCount={selectedStory.scenes.length}
            fallbackImage={selectedStory.fallbackImage}
            onNext={handleNextScene}
            onBack={sceneIndex > 0 ? () => setSceneIndex((currentIndex) => currentIndex - 1) : null}
          />
        )}
        {stage !== 'story-selection' && stage !== 'story' && (
          <button type="button" className="lj-journey-back" onClick={chooseAnotherStory}>Choose Another Story</button>
        )}
        {stage === 'quiz' && selectedStory && <Quiz key={selectedStory.id} questions={selectedStory.quiz} storyTitle={selectedStory.title} onComplete={handleQuizComplete} />}
        {stage === 'mapping' && selectedStory && <ConceptMapping mapping={selectedStory.mapping} onContinue={() => setStage('code')} />}
        {stage === 'code' && (
          <CodeExplanation
            storyTitle={selectedStory.title}
            code={selectedStory.code}
            explanation={selectedStory.explanation}
            storyConnection={selectedStory.storyConnection}
            onContinue={() => setStage('complete')}
          />
        )}
        {stage === 'complete' && score && (
          <LessonComplete
            score={score}
            concept={selectedStory.concept}
            onTryAgain={restartJourney}
            onBack={chooseAnotherStory}
          />
        )}
      </div>
    </main>
  );
}

export default LearningJourney;
