import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Ghost,
  GraduationCap,
  Lightbulb,
  PencilLine,
  TerminalSquare,
  Trophy,
  Wrench
} from 'lucide-react';
import BetaalRiddle from './BetaalRiddle';
import CodeLab from './CodeLab';
import Reflection from './Reflection';
import { generateQuestion } from '../lib/questionGenerator';
import { generateRiddle } from '../lib/riddleGenerator';
import { generateReflection } from '../lib/reflectionGenerator';

const RIDDLE_XP = 15;

const STEPS = [
  { key: 'story', label: 'Story', icon: BookOpen },
  { key: 'riddle', label: 'Riddle', icon: Ghost },
  { key: 'reflection', label: 'Reflection', icon: PencilLine },
  { key: 'concept', label: 'Idea', icon: Lightbulb },
  { key: 'lesson', label: 'Lesson', icon: GraduationCap },
  { key: 'challenge', label: 'Practice', icon: TerminalSquare },
  { key: 'project', label: 'Project', icon: Wrench },
  { key: 'done', label: 'Done', icon: Trophy }
];

export default function StoryPlayer({ story, pyodide, pyodideLoading, pyodideError, onRecord, onExit }) {
  const [step, setStep] = useState(0);
  const [page, setPage] = useState(0);
  const [riddleDone, setRiddleDone] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState(null);
  const [riddleFirstTry, setRiddleFirstTry] = useState(true);
  const [challengeDone, setChallengeDone] = useState(false);
  const [projectDone, setProjectDone] = useState(false);
  const [challengeVariant, setChallengeVariant] = useState(null);
  const [projectVariant, setProjectVariant] = useState(null);
  const [challengeRegenKey, setChallengeRegenKey] = useState(0);
  const [projectRegenKey, setProjectRegenKey] = useState(0);
  const [riddleVariant] = useState(() => generateRiddle(story.id, story.riddle));
  const [reflection] = useState(() => generateReflection(story));

  const lastPage = story.fable.length - 1;

  function regenChallenge() {
    setChallengeVariant(generateQuestion(story.id, 'challenge'));
    setChallengeRegenKey((k) => k + 1);
  }

  function regenProject() {
    setProjectVariant(generateQuestion(story.id, 'project'));
    setProjectRegenKey((k) => k + 1);
  }

  const ch = challengeVariant || story.challenge;
  const pr = projectVariant || story.project;

  function next() {
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
    setPage(0);
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0));
    setPage(0);
  }

  function recordRiddle(firstTry) {
    if (riddleDone) return;
    setRiddleDone(true);
    setRiddleAnswer(riddleVariant.correctIndex);
    setRiddleFirstTry(firstTry);
    onRecord({ event: 'riddle', xp: firstTry ? RIDDLE_XP : 0, firstTry, passed: true });
  }

  function recordChallenge() {
    if (challengeDone) return;
    setChallengeDone(true);
    onRecord({ event: 'challenge', xp: story.xp, passed: true });
  }

  function recordProject() {
    if (projectDone) return;
    setProjectDone(true);
    onRecord({ event: 'project', xp: story.projectXp, passed: true });
  }

  const earnedXp = story.xp + story.projectXp + (riddleDone ? RIDDLE_XP : 0);

  return (
    <div className="player">
      <header className="player-header">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          <ArrowLeft size={16} aria-hidden="true" /> Story map
        </button>
        <div className="player-title">
          <span className="player-concept">{story.concept}</span>
          <h2>{story.title}</h2>
        </div>
        <span className="chip chip-xp">+{earnedXp} XP</span>
      </header>

      <nav className="stepper" aria-label="Lesson progress">
        {STEPS.map((item, index) => {
          const reached = index <= step;
          const complete = item.key === 'riddle' ? riddleDone
            : item.key === 'challenge' ? challengeDone
            : item.key === 'project' ? projectDone
            : false;
          const Icon = item.icon;
          return (
            <div key={item.key} className={`stepper-step ${reached ? 'reached' : ''} ${complete ? 'complete' : ''}`}>
              <span className="stepper-dot">
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="stepper-label">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <main className="stage" aria-live="polite">
        {step === 0 && (
          <section className="fable" aria-label="The story">
            <div className="fable-card">
              <div className="fable-meta">
                <span className="chip">{story.concept}</span>
                <span className="chip chip-difficulty">{story.difficulty}</span>
              </div>
              <p className="fable-page">{story.fable[page]}</p>
              <div className="fable-pager" aria-label={`Page ${page + 1} of ${story.fable.length}`}>
                <span>
                  {page + 1} / {story.fable.length}
                </span>
                <div className="fable-dots" aria-hidden="true">
                  {story.fable.map((_, index) => (
                    <span key={index} className={`dot ${index === page ? 'active' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="stage-actions">
              {page < lastPage ? (
                <button type="button" className="btn btn-primary" onClick={() => setPage((p) => p + 1)}>
                  Next page <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={next}>
                  Betaal awaits <Ghost size={16} aria-hidden="true" />
                </button>
              )}
            </div>
            <p className="moral">
              <em>{story.moral}</em>
            </p>
          </section>
        )}

        {step === 1 && (
          <>
            <BetaalRiddle
              riddle={riddleVariant}
              rewardXp={RIDDLE_XP}
              onSuccess={recordRiddle}
              disabled={riddleDone}
              defaultSelected={riddleAnswer}
              defaultAnswered={riddleDone}
              defaultFailed={!riddleFirstTry}
            />
            <div className="stage-actions">
              {step > 0 && (
                <button type="button" className="btn btn-ghost" onClick={back}>
                  <ArrowLeft size={16} aria-hidden="true" /> Back
                </button>
              )}
              {riddleDone && (
                <button type="button" className="btn btn-primary" onClick={next}>
                  Pause to reflect <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <Reflection
            message={reflection.message}
            prompt={reflection.prompt}
            revealed={reflection.revealed}
            onReady={next}
            onBack={back}
          />
        )}

        {step === 3 && (
          <section className="concept-reveal" aria-label="Concept reveal">
            <div className="section-kicker">The hidden idea</div>
            <h2>{story.conceptReveal.title}</h2>
            <p className="concept-summary">{story.conceptReveal.summary}</p>
            <pre className="code-example">{story.conceptReveal.codeExample}</pre>
            <ul className="concept-points">
              {story.conceptReveal.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="stage-actions">
              <button type="button" className="btn btn-ghost" onClick={back}>
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
              <button type="button" className="btn btn-primary" onClick={next}>
                Take the micro-lesson <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="micro-lesson" aria-label="Micro-lesson">
            <div className="section-kicker">Micro-lesson</div>
            <h2>{story.microLesson.headline}</h2>
            {story.microLesson.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <h3 className="lesson-key-title">Remember this</h3>
            <ul className="key-points">
              {story.microLesson.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="stage-actions">
              <button type="button" className="btn btn-ghost" onClick={back}>
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
              <button type="button" className="btn btn-primary" onClick={next}>
                Let's practice <TerminalSquare size={16} aria-hidden="true" />
              </button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="practice-stage" aria-label="Hands-on practice">
            <CodeLab
              key={`ch-${challengeRegenKey}`}
              title={story.challenge.title}
              instruction={ch.instruction}
              starterCode={ch.starterCode}
              hint={ch.hint}
              check={ch.check}
              pyodide={pyodide}
              loading={pyodideLoading}
              pyodideError={pyodideError}
              rewardXp={story.xp}
              onSuccess={recordChallenge}
              onRegenerate={regenChallenge}
            />
            <div className="stage-actions">
              <button type="button" className="btn btn-ghost" onClick={back}>
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
              {challengeDone && (
                <button type="button" className="btn btn-primary" onClick={next}>
                  Mini-project <Wrench size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="practice-stage" aria-label="Mini project">
            <CodeLab
              key={`pr-${projectRegenKey}`}
              title={story.project.title}
              instruction={pr.instruction}
              starterCode={pr.starterCode}
              hint={pr.hint}
              check={pr.check}
              pyodide={pyodide}
              loading={pyodideLoading}
              pyodideError={pyodideError}
              rewardXp={story.projectXp}
              onSuccess={recordProject}
              onRegenerate={regenProject}
            />
            <div className="stage-actions">
              <button type="button" className="btn btn-ghost" onClick={back}>
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
              {projectDone && (
                <button type="button" className="btn btn-primary" onClick={next}>
                  Finish the tale <Trophy size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </section>
        )}

        {step === 7 && (
          <section className="celebration" aria-label="Story complete">
            <div className="celebration-icon">
              <Trophy size={56} aria-hidden="true" />
            </div>
            <div className="section-kicker">Tale complete</div>
            <h2>{story.title}</h2>
            <p>
              You solved Betaal's riddle, learned <strong className="learned-concept">{story.concept}</strong>, wrote working Python, and
              built a mini-project.
            </p>
            <div className="celebration-xp">
              <strong>+{earnedXp} XP</strong>
              <span>earned on this tale</span>
            </div>
            <div className="stage-actions">
              <button type="button" className="btn btn-primary" onClick={onExit}>
                Return to the story map <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
