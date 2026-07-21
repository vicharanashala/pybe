import React, { useState } from 'react';
import { ArrowRight, BookOpen, BrainCircuit, Sparkles } from 'lucide-react';

const STORY_PROGRESS_KEY = 'pybe-story-learning-progress';

function readStoryProgress() {
  if (typeof window === 'undefined') {
    return { scores: {}, recentStory: null };
  }

  try {
    const stored = window.localStorage.getItem(STORY_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : { scores: {}, recentStory: null };
  } catch (error) {
    return { scores: {}, recentStory: null };
  }
}

function saveStoryProgress(progress) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORY_PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event('story-progress-updated'));
}

const STORY_CATALOG = [
  {
    id: 'conditionals',
    title: 'The Lantern Trail',
    concept: 'Conditionals',
    summary:
      'Mina wandered through a moonlit garden, carrying a small lantern and following a narrow path between tall hedges. At every gate, she paused to read the color of the lock. If the lock was blue, she turned left; if it was red, she turned right. She kept moving carefully, one step after another, until the final gate opened and revealed the light she had been searching for.',
    assignmentQuestions: [
      {
        id: 'c1',
        prompt: 'What did Mina do when she reached each gate?',
        options: [
          { id: 'c1-a', label: 'She followed a rule and made a choice', isCorrect: true, explanation: 'Correct! Mina used a clear rule at each gate, which is similar to making a decision in a program.' },
          { id: 'c1-b', label: 'She ignored the gate and ran past it', isCorrect: false, explanation: 'Not quite. She paused and paid attention to the gate, which is more like following instructions carefully.' },
          { id: 'c1-c', label: 'She waited for someone else to guide her', isCorrect: false, explanation: 'Not quite. Mina made the choice herself based on the rule she knew.' }
        ]
      },
      {
        id: 'c2',
        prompt: 'What best describes the way Mina moved through the garden?',
        options: [
          { id: 'c2-a', label: 'She moved step by step until the goal was reached', isCorrect: true, explanation: 'Correct! Her path was built from repeated steps that eventually led to the goal.' },
          { id: 'c2-b', label: 'She changed direction randomly every time', isCorrect: false, explanation: 'Not quite. Her choices were guided by a pattern, not random movement.' },
          { id: 'c2-c', label: 'She stopped after the first gate', isCorrect: false, explanation: 'Not quite. She kept going through the sequence until she reached the end.' }
        ]
      },
      {
        id: 'c3',
        prompt: 'What did the story teach about making choices?',
        options: [
          { id: 'c3-a', label: 'Choices can be made by following a clear condition', isCorrect: true, explanation: 'Correct! The story shows that choices can be based on a condition or rule.' },
          { id: 'c3-b', label: 'Choices should be made by guessing', isCorrect: false, explanation: 'Not quite. Guessing does not explain the pattern in the story.' },
          { id: 'c3-c', label: 'Choices should be postponed', isCorrect: false, explanation: 'Not quite. The story shows that the choice was made at each step and carried forward.' }
        ]
      },
      {
        id: 'c4',
        prompt: 'Which idea feels most similar to Mina’s journey?',
        options: [
          { id: 'c4-a', label: 'A sequence of actions that repeats until something happens', isCorrect: true, explanation: 'Correct! Mina kept repeating the same kind of action until she reached the final goal.' },
          { id: 'c4-b', label: 'A story that never reaches the end', isCorrect: false, explanation: 'Not quite. The story clearly reaches a final destination and a completed path.' },
          { id: 'c4-c', label: 'A random event with no pattern', isCorrect: false, explanation: 'Not quite. The journey is structured and follows a meaningful pattern.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows a decision point that resembles an if/else condition in Python.',
      'The repeated walk through the gates mirrors a loop that repeats until a goal is reached.',
      'Programming becomes easier when stories help us see rules, repetition, and outcomes.'
    ],
    pythonConcept: 'Conditionals',
    pythonExplanation: 'Python uses if/elif/else statements for decisions.',
    sampleCode: `for gate in ['blue', 'red', 'green']:\n    if gate == 'blue':\n        print('Turn left')\n    else:\n        print('Turn right')`
  },
  {
    id: 'variables',
    title: 'The Name in the Lantern',
    concept: 'Variables',
    summary:
      'Ari found a lantern beside a fountain and noticed that each time he whispered the keeper’s name, the light changed color. He learned that the name could be saved in his memory and used again whenever he needed to call the keeper, and he felt proud that one small piece of information could stay ready for later in his mind.',
    assignmentQuestions: [
      {
        id: 'v1',
        prompt: 'What did Ari learn about the keeper’s name?',
        options: [
          { id: 'v1-a', label: 'It could be remembered and used later', isCorrect: true, explanation: 'Correct! The name was stored in memory and reused later.' },
          { id: 'v1-b', label: 'It disappeared after one use', isCorrect: false, explanation: 'Not quite. The story shows the name stayed available for later use.' },
          { id: 'v1-c', label: 'It only worked at night', isCorrect: false, explanation: 'Not quite. The idea is about saving information, not about time.' }
        ]
      },
      {
        id: 'v2',
        prompt: 'What does the lantern represent in this story?',
        options: [
          { id: 'v2-a', label: 'A place to keep information for later', isCorrect: true, explanation: 'Correct! The lantern acts like a container for stored information.' },
          { id: 'v2-b', label: 'A random object with no use', isCorrect: false, explanation: 'Not quite. It has an important purpose in the story.' },
          { id: 'v2-c', label: 'A map that stays hidden', isCorrect: false, explanation: 'Not quite. The focus is on remembering and reusing information.' }
        ]
      },
      {
        id: 'v3',
        prompt: 'What is the main lesson of the story?',
        options: [
          { id: 'v3-a', label: 'Information can be saved and used again', isCorrect: true, explanation: 'Correct! That is the key idea behind variables.' },
          { id: 'v3-b', label: 'Information should be forgotten quickly', isCorrect: false, explanation: 'Not quite. The story highlights keeping information available.' },
          { id: 'v3-c', label: 'Information only matters once', isCorrect: false, explanation: 'Not quite. The story shows it matters more than once.' }
        ]
      }
    ],
    keyFindings: [
      'The story introduces the idea of storing information for later use.',
      'It shows that a value can be kept in one place and used again when needed.',
      'This is similar to how variables hold data in Python.'
    ],
    pythonConcept: 'Variables',
    pythonExplanation: 'In Python, variables store values so they can be used later in a program.',
    sampleCode: `name = "Ari"\nprint("Hello, " + name)`
  },
  {
    id: 'loops',
    title: 'The Clockmaker’s Path',
    concept: 'Loops',
    summary:
      'A clockmaker placed tiny gears on a table and turned the same handle again and again until every gear clicked into place. He kept repeating the same motion while the morning light grew brighter, and he smiled when he saw the clock begin to tick with steady rhythm and announce that the work was finally done for everyone nearby that day.',
    assignmentQuestions: [
      {
        id: 'l1',
        prompt: 'What did the clockmaker keep doing?',
        options: [
          { id: 'l1-a', label: 'He repeated the same action until the goal was reached', isCorrect: true, explanation: 'Correct! Repeating the same action helped complete the task.' },
          { id: 'l1-b', label: 'He stopped after one turn', isCorrect: false, explanation: 'Not quite. The story shows that he kept going until the clock was ready.' },
          { id: 'l1-c', label: 'He changed the goal each time', isCorrect: false, explanation: 'Not quite. The goal stayed the same throughout the story.' }
        ]
      },
      {
        id: 'l2',
        prompt: 'What is the main idea in the story?',
        options: [
          { id: 'l2-a', label: 'Doing something again and again can finish a task', isCorrect: true, explanation: 'Correct! Repeating the same action leads to completion.' },
          { id: 'l2-b', label: 'Doing it once is enough', isCorrect: false, explanation: 'Not quite. Repetition is the important idea here.' },
          { id: 'l2-c', label: 'Changing plans every time is best', isCorrect: false, explanation: 'Not quite. The story points to steady repetition.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows how repeated actions can build toward a final result.',
      'It highlights the idea of doing something again until a goal is finished.',
      'This connects closely to loops in Python.'
    ],
    pythonConcept: 'Loops',
    pythonExplanation: 'Loops let a program repeat actions multiple times without rewriting the same code.',
    sampleCode: `for step in range(3):\n    print("Turn the handle")`
  },
  {
    id: 'lists',
    title: 'The Market Basket',
    concept: 'Lists',
    summary:
      'Tara visited a market and placed each item she wanted into a basket one by one. She noticed that the basket could hold many things at once, and she could look at them in order whenever she wanted. As she walked home, she realized the basket had become a simple way to keep several things together in one place for later.',
    assignmentQuestions: [
      {
        id: 'm1',
        prompt: 'What did Tara place into the basket?',
        options: [
          { id: 'm1-a', label: 'Several items one by one', isCorrect: true, explanation: 'Correct! Tara collected multiple things in the basket.' },
          { id: 'm1-b', label: 'Only one item', isCorrect: false, explanation: 'Not quite. The basket was meant to hold more than one thing.' },
          { id: 'm1-c', label: 'Nothing at all', isCorrect: false, explanation: 'Not quite. Tara clearly collected items for the basket.' }
        ]
      },
      {
        id: 'm2',
        prompt: 'What does the basket represent?',
        options: [
          { id: 'm2-a', label: 'A group of items stored together', isCorrect: true, explanation: 'Correct! The basket represents a collection of values.' },
          { id: 'm2-b', label: 'A single piece of information', isCorrect: false, explanation: 'Not quite. The basket holds many items at once.' },
          { id: 'm2-c', label: 'A hidden path', isCorrect: false, explanation: 'Not quite. The focus is on grouping items together.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows that many items can be grouped together.',
      'It introduces the idea of keeping things in a collection.',
      'This is similar to lists in Python.'
    ],
    pythonConcept: 'Lists',
    pythonExplanation: 'Lists let you store multiple items in one place and access them in order.',
    sampleCode: `items = ["apple", "bread", "milk"]\nprint(items[0])`
  },
  {
    id: 'functions',
    title: 'The Mapmaker’s Helper',
    concept: 'Functions',
    summary:
      'A mapmaker had a special helper who could draw a path whenever the village needed directions. Instead of drawing the path from scratch each time, the helper followed a known set of steps and completed the job quickly, making the mapmaker’s work easier and saving precious time during busy days for every traveler who came to town at sunrise.',
    assignmentQuestions: [
      {
        id: 'f1',
        prompt: 'What did the helper do for the mapmaker?',
        options: [
          { id: 'f1-a', label: 'It completed a repeated task whenever it was needed', isCorrect: true, explanation: 'Correct! The helper performed the same job whenever called upon.' },
          { id: 'f1-b', label: 'It made a new map every time without guidance', isCorrect: false, explanation: 'Not quite. The helper used a known set of steps.' },
          { id: 'f1-c', label: 'It did nothing helpful', isCorrect: false, explanation: 'Not quite. The helper had a clear purpose in the story.' }
        ]
      },
      {
        id: 'f2',
        prompt: 'What is the important lesson here?',
        options: [
          { id: 'f2-a', label: 'A task can be reused by following the same steps', isCorrect: true, explanation: 'Correct! This is the core idea behind functions.' },
          { id: 'f2-b', label: 'Each task should be redrawn from scratch', isCorrect: false, explanation: 'Not quite. The helper avoids doing that by following a set routine.' },
          { id: 'f2-c', label: 'Only people can solve these tasks', isCorrect: false, explanation: 'Not quite. The helper is a symbol for a reusable process.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows that a task can be repeated through a shared process.',
      'It introduces the idea of using the same steps whenever needed.',
      'This is similar to functions in Python.'
    ],
    pythonConcept: 'Functions',
    pythonExplanation: 'Functions let you group a set of instructions into one reusable block of code.',
    sampleCode: `def draw_path():\n    print("Follow the road")\n\ndraw_path()`
  },
  {
    id: 'dictionaries',
    title: 'The Keeper’s Desk',
    concept: 'Dictionaries',
    summary:
      'At the keeper’s desk, every object had a special label that told the caretaker exactly where it belonged. When the keeper needed something, the label helped them find it quickly without searching the whole room, and the careful system made every task feel easier and more organized for the busy morning ahead in the old house that day for everyone.',
    assignmentQuestions: [
      {
        id: 'd1',
        prompt: 'What did the labels help the keeper do?',
        options: [
          { id: 'd1-a', label: 'Find items quickly', isCorrect: true, explanation: 'Correct! The labels gave a clear way to locate things.' },
          { id: 'd1-b', label: 'Hide items from sight', isCorrect: false, explanation: 'Not quite. The labels helped with finding, not hiding.' },
          { id: 'd1-c', label: 'Break the desk apart', isCorrect: false, explanation: 'Not quite. The story is about organization, not destruction.' }
        ]
      },
      {
        id: 'd2',
        prompt: 'What idea does the desk represent?',
        options: [
          { id: 'd2-a', label: 'A way to connect names with values', isCorrect: true, explanation: 'Correct! This is similar to how dictionaries pair keys with values.' },
          { id: 'd2-b', label: 'A single random item', isCorrect: false, explanation: 'Not quite. The desk organizes many pieces of information.' },
          { id: 'd2-c', label: 'A path with no direction', isCorrect: false, explanation: 'Not quite. The labels make the items easy to find.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows that information can be organized using labels.',
      'It introduces the idea of connecting one thing to another.',
      'This is similar to dictionaries in Python.'
    ],
    pythonConcept: 'Dictionaries',
    pythonExplanation: 'Dictionaries store data as key-value pairs, so each item can be found by its label.',
    sampleCode: `student = {"name": "Ava", "age": 12}\nprint(student["name"])`
  },
  {
    id: 'strings',
    title: 'The Whispering River',
    concept: 'Strings',
    summary:
      'A traveler stood by a whispering river and listened as the water carried secret messages from one shore to another. Each message was made of letters that could be read and repeated aloud, and the traveler smiled because every small string of words seemed to carry a hidden meaning waiting to be understood by the listening wind at dusk that evening.',
    assignmentQuestions: [
      {
        id: 's1',
        prompt: 'What was moving through the river?',
        options: [
          { id: 's1-a', label: 'Messages made of letters', isCorrect: true, explanation: 'Correct! The river carried text-like messages.' },
          { id: 's1-b', label: 'Only numbers', isCorrect: false, explanation: 'Not quite. The story focuses on words and letters.' },
          { id: 's1-c', label: 'No message at all', isCorrect: false, explanation: 'Not quite. The river carried something meaningful.' }
        ]
      },
      {
        id: 's2',
        prompt: 'What is the main lesson of the story?',
        options: [
          { id: 's2-a', label: 'Text can be read and used as information', isCorrect: true, explanation: 'Correct! The story is about messages made of letters.' },
          { id: 's2-b', label: 'Only sounds matter', isCorrect: false, explanation: 'Not quite. The messages are made of written characters.' },
          { id: 's2-c', label: 'Numbers are better than words', isCorrect: false, explanation: 'Not quite. The story centers on text rather than numbers.' }
        ]
      }
    ],
    keyFindings: [
      'The story is about communicating through text.',
      'It shows that letters can be combined to form messages.',
      'This is similar to strings in Python.'
    ],
    pythonConcept: 'Strings',
    pythonExplanation: 'Strings are sequences of characters used to represent text in Python.',
    sampleCode: `message = "hello"\nprint(message)`
  },
  {
    id: 'classes',
    title: 'The Toymaker’s Workshop',
    concept: 'Classes and Objects',
    summary:
      'A toymaker built a special kind of toy that always knew how to smile, dance, and wave. Each toy was made from the same design, but each one could still have its own personality and color, and the toymaker loved how one shared plan could create many different little companions for children across the village that winter.',
    assignmentQuestions: [
      {
        id: 'o1',
        prompt: 'What did the toymaker build?',
        options: [
          { id: 'o1-a', label: 'Toys from the same design', isCorrect: true, explanation: 'Correct! The toys were created from one shared blueprint.' },
          { id: 'o1-b', label: 'Only one toy', isCorrect: false, explanation: 'Not quite. The story describes many toys made from the same idea.' },
          { id: 'o1-c', label: 'A broken machine', isCorrect: false, explanation: 'Not quite. The toys were made carefully and worked well.' }
        ]
      },
      {
        id: 'o2',
        prompt: 'What is the important lesson here?',
        options: [
          { id: 'o2-a', label: 'Many objects can come from one shared blueprint', isCorrect: true, explanation: 'Correct! This is similar to how classes and objects work.' },
          { id: 'o2-b', label: 'Every object must be completely different', isCorrect: false, explanation: 'Not quite. The story shows they can share the same design but still vary.' },
          { id: 'o2-c', label: 'Objects cannot have their own features', isCorrect: false, explanation: 'Not quite. The toys had unique personality and color.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows that many objects can be created from one design.',
      'It highlights the idea of shared structure with individual differences.',
      'This is similar to classes and objects in Python.'
    ],
    pythonConcept: 'Classes and Objects',
    pythonExplanation: 'Classes define a blueprint, and objects are individual instances created from that blueprint.',
    sampleCode: `class Toy:\n    def __init__(self, color):\n        self.color = color\n\nmy_toy = Toy("blue")`
  }
];

function StoryLearningFlow() {
  const [step, setStep] = useState('intro');
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPythonMapping, setShowPythonMapping] = useState(false);
  const [feedback, setFeedback] = useState([]);

  const currentQuestion = selectedStory?.assignmentQuestions?.[currentQuestionIndex];

  function resetFlow() {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmitted(false);
    setShowPythonMapping(false);
    setFeedback([]);
  }

  function handleStorySelect(story) {
    resetFlow();
    setSelectedStory(story);
    setStep('story');

    const progress = readStoryProgress();
    progress.recentStory = {
      id: story.id,
      title: story.title,
      concept: story.concept,
      viewedAt: new Date().toISOString()
    };
    saveStoryProgress(progress);
  }

  function handleAnswerSelect(questionId, optionId) {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }));
  }

  function handleNextQuestion(event) {
    event.preventDefault();

    if (!selectedStory) {
      return;
    }

    if (currentQuestionIndex < selectedStory.assignmentQuestions.length - 1) {
      setCurrentQuestionIndex((value) => value + 1);
      return;
    }

    const result = selectedStory.assignmentQuestions.map((question) => {
      const selectedOptionId = answers[question.id];
      const selectedOption = question.options.find((option) => option.id === selectedOptionId);
      return {
        questionId: question.id,
        prompt: question.prompt,
        selectedOption,
        isCorrect: Boolean(selectedOption?.isCorrect)
      };
    });

    const correctAnswers = result.filter((item) => item.isCorrect).length;
    const score = Math.round((correctAnswers / result.length) * 100);
    const progress = readStoryProgress();
    progress.scores[selectedStory.id] = {
      id: selectedStory.id,
      title: selectedStory.title,
      concept: selectedStory.concept,
      score,
      correctAnswers,
      totalQuestions: result.length,
      completedAt: new Date().toISOString()
    };
    saveStoryProgress(progress);

    setFeedback(result);
    setSubmitted(true);
    setStep('results');
  }

  return (
    <section className="story-flow-shell">
      <div className="story-flow-card">
        <div className="story-flow-header">
          <span className="story-flow-tag">Interactive Python Story Lab</span>
          <h2>Learn by following a story from start to insight</h2>
          <p>
            Each step helps the learner connect a simple narrative to a Python idea in a natural way.
          </p>
        </div>

        {step === 'intro' && (
          <div className="story-step">
            <div className="story-spotlight">
              <BookOpen size={24} />
              <div>
                <h3>Ready to begin?</h3>
                <p>Pick a beginner story and follow it from the opening scene to the Python explanation.</p>
              </div>
            </div>
            <button type="button" className="primary story-button" onClick={() => setStep('menu')}>
              <Sparkles size={16} /> Choose a story
            </button>
          </div>
        )}

        {step === 'menu' && (
          <div className="story-step">
            <h3>Choose a story</h3>
            <p className="story-text">
              Each story introduces a beginner-friendly Python concept in a simple, memorable way.
            </p>
            <div className="story-menu-grid">
              {STORY_CATALOG.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  className="story-card"
                  onClick={() => handleStorySelect(story)}
                >
                  <strong>{story.title}</strong>
                  <span>{story.concept}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'story' && selectedStory && (
          <div className="story-step">
            <div className="story-step-actions">
              <button type="button" className="secondary story-button" onClick={() => setStep('menu')}>
                Back to stories
              </button>
            </div>
            <h3>{selectedStory.title}</h3>
            <p className="story-text">{selectedStory.summary}</p>
            <button type="button" className="primary story-button" onClick={() => setStep('assignment')}>
              Next <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 'assignment' && selectedStory && (
          <div className="story-step">
            <div className="story-step-actions">
              <button type="button" className="secondary story-button" onClick={() => setStep('menu')}>
                Back to stories
              </button>
            </div>
            <h3>Assignment</h3>
            <p className="story-text">
              Read each question carefully and choose the answer that fits the story best. After you finish the last question, you will move to the key findings and the Python explanation.
            </p>
            <form className="story-form" onSubmit={handleNextQuestion}>
              <div className="assignment-progress">
                Question {currentQuestionIndex + 1} of {selectedStory.assignmentQuestions.length}
              </div>
              <h4>{currentQuestion.prompt}</h4>
              <div className="mcq-options">
                {currentQuestion.options.map((option) => (
                  <label key={option.id} className={`mcq-option ${answers[currentQuestion.id] === option.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option.id}
                      checked={answers[currentQuestion.id] === option.id}
                      onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <button type="submit" className="primary story-button">
                {currentQuestionIndex < selectedStory.assignmentQuestions.length - 1 ? 'Next question' : 'Finish assignment'}
              </button>
            </form>
          </div>
        )}

        {step === 'results' && selectedStory && (
          <div className="story-step">
            <div className="story-step-actions">
              <button type="button" className="secondary story-button" onClick={() => setStep('menu')}>
                Back to stories
              </button>
            </div>
            <h3>Key findings</h3>
            <ul className="story-bullets">
              {selectedStory.keyFindings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="story-insight-card">
              {feedback.length > 0 && (
                <>
                  <div className="story-insight-title">
                    <BrainCircuit size={18} />
                    <strong>Answers</strong>
                  </div>
                  <div className="feedback-stack">
                    {feedback.map((item) => (
                      <div key={item.questionId} className={`feedback-box ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                        <strong>{item.isCorrect ? 'Correct answer' : 'Needs a second look'}</strong>
                        <p>{item.prompt}</p>
                        <p><strong>Your choice:</strong> {item.selectedOption?.label || 'No answer selected'}</p>
                        {!item.isCorrect && <p><strong>Reasoning:</strong> {item.selectedOption?.explanation}</p>}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="story-insight-title">
                <BrainCircuit size={18} />
                <strong>How Python maps this concept</strong>
              </div>
              <p className="story-text">
                <strong>{selectedStory.pythonConcept}</strong> — {selectedStory.pythonExplanation}
              </p>
              <button
                type="button"
                className="secondary story-button"
                onClick={() => setShowPythonMapping((value) => !value)}
              >
                {showPythonMapping ? 'Hide explanation' : 'Show Python concept'}
              </button>

              {showPythonMapping && (
                <div className="python-explanation">
                  <p>{selectedStory.pythonExplanation}</p>
                  <pre>{selectedStory.sampleCode}</pre>
                </div>
              )}
            </div>

            {submitted ? (
              <p className="story-submission">
                Your answer has been recorded. The story now connects to the Python idea of {selectedStory.pythonConcept.toLowerCase()}.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export default StoryLearningFlow;
