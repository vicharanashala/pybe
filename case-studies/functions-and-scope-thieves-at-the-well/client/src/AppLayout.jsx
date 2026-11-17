import React, { useState, useEffect } from 'react';
import { BookOpen, Check, ChevronRight, Code2 } from 'lucide-react';
import './AppLayout.css';
import './styles.css';

function ActSection({ actData, onComplete }) {
  const [mcqSolved, setMcqSolved] = useState(false);
  const [mcqAttempts, setMcqAttempts] = useState(0);
  const [mcqFeedback, setMcqFeedback] = useState(null);
  const [mcqSelected, setMcqSelected] = useState(null);

  const handleMcqClick = (opt, index) => {
    if (mcqSolved) return;
    setMcqSelected(index);
    const isCorrect = opt.startsWith(actData.mcq.correct + ")");
    
    if (isCorrect) {
      setMcqSolved(true);
      setMcqFeedback({ correct: true, text: actData.mcq.explanation });
    } else {
      setMcqAttempts(prev => prev + 1);
      setMcqFeedback({ correct: false, text: actData.mcq.hint });
    }
  };

  return (
    <div className="act-section animate-fade-in">
      <img src={actData.image} alt={actData.title} className="hero-story-image" />
      
      <div className="act-content-wrapper">
        <h2 className="story-title">Page {actData.page_number}: {actData.title}</h2>
        <p className="story-paragraph">{actData.story}</p>

      <div className="act-mcq">
        <h4 className="act-question">{actData.mcq.question}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          {actData.mcq.options.map((opt, i) => {
            let btnClass = "option-btn";
            if (mcqSelected === i) {
              btnClass += opt.startsWith(actData.mcq.correct + ")") ? " option-btn--correct" : " option-btn--wrong";
            } else if (mcqSolved && opt.startsWith(actData.mcq.correct + ")")) {
              btnClass += " option-btn--correct";
            }
            return (
              <button key={i} disabled={mcqSolved} className={btnClass} onClick={() => handleMcqClick(opt, i)}>
                {opt}
              </button>
            );
          })}
        </div>
        
        {mcqFeedback && (
          <div className={`feedback-panel ${mcqFeedback.correct ? 'feedback-panel--correct' : 'feedback-panel--wrong'}`}>
            <h4 className={`feedback-panel__title ${mcqFeedback.correct ? 'feedback-panel__title--correct' : 'feedback-panel__title--wrong'}`}>
              {mcqFeedback.correct ? 'Correct!' : 'Not quite'}
            </h4>
            <p className="feedback-panel__text">{mcqFeedback.text}</p>
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" disabled={!mcqSolved} onClick={onComplete} style={{ opacity: mcqSolved ? 1 : 0.5 }}>
            Continue
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

function CodingTrialsSection({ trialsData, onComplete }) {
  const [activeTrialIndex, setActiveTrialIndex] = useState(0);
  const [solvedTrials, setSolvedTrials] = useState([]);
  const [codeAttempts, setCodeAttempts] = useState(0);
  const [codeFeedback, setCodeFeedback] = useState(null);
  const [codeSelected, setCodeSelected] = useState(null);

  const handleCodeClick = (opt, index, correct) => {
    if (solvedTrials.includes(activeTrialIndex)) return;
    setCodeSelected(index);
    const isCorrect = opt === correct;

    if (isCorrect) {
      setSolvedTrials(prev => [...prev, activeTrialIndex]);
      setCodeFeedback({ correct: true, text: "Excellent! The logic is complete." });
    } else {
      setCodeAttempts(prev => prev + 1);
      setCodeFeedback({ correct: false, text: "That doesn't seem right. Try again!" });
    }
  };

  const handleNextTrial = () => {
    if (activeTrialIndex < trialsData.challenges.length - 1) {
      setActiveTrialIndex(prev => prev + 1);
      setCodeFeedback(null);
      setCodeSelected(null);
    }
  };

  const isAllSolved = solvedTrials.length === trialsData.challenges.length;
  const challenge = trialsData.challenges[activeTrialIndex];
  const isSolved = solvedTrials.includes(activeTrialIndex);
  let displayCode = challenge.starter_code;
  
  if (isSolved) {
    displayCode = displayCode.replace(/_{4,}/, challenge.correct);
  }

  return (
    <div className="act-section animate-fade-in">
      <div className="act-content-wrapper">
        <h2 className="story-title">{trialsData.title}</h2>
        <p className="story-paragraph">{trialsData.description}</p>

        {isAllSolved ? (
          <div className="act-section animate-fade-in" style={{ borderLeft: 'none', paddingLeft: 0, marginTop: '32px' }}>
            <h2 className="story-title" style={{ color: 'var(--success)' }}>Adventure Complete!</h2>
            <p className="story-paragraph">
              Congratulations! You have mastered the Python logic of the Royal Vault.
            </p>
          </div>
        ) : (
        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px dashed var(--border)' }}>
          <h4 className="act-question">Challenge {activeTrialIndex + 1}: {challenge.concept}</h4>
          
          <div className="code-display">
            {displayCode.split('\n').map((line, lIdx) => {
              if (isSolved && line.includes(challenge.correct)) {
                const parts = line.split(challenge.correct);
                return (
                  <div key={lIdx}>
                    {parts.map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < parts.length - 1 && <span className="highlight">{challenge.correct}</span>}
                      </React.Fragment>
                    ))}
                  </div>
                );
              }
              return <div key={lIdx}>{line}</div>;
            })}
          </div>

          {!isSolved && (
            <div className="animate-slide-up">
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Fill in the blank:
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {challenge.options.map((opt, i) => {
                  let btnClass = "option-btn";
                  if (codeSelected === i) {
                    btnClass += opt === challenge.correct ? " option-btn--correct" : " option-btn--wrong";
                  }
                  return (
                    <button 
                      key={i} 
                      disabled={isSolved}
                      className={btnClass} 
                      style={{ flex: '1 1 auto', fontFamily: 'monospace' }}
                      onClick={() => handleCodeClick(opt, i, challenge.correct)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {codeFeedback && (
            <div className={`feedback-panel ${codeFeedback.correct ? 'feedback-panel--correct' : 'feedback-panel--wrong'} animate-slide-up`}>
              <h4 className={`feedback-panel__title ${codeFeedback.correct ? 'feedback-panel__title--correct' : 'feedback-panel__title--wrong'}`}>
                {codeFeedback.correct ? 'Well done!' : 'Try Again'}
              </h4>
              <p className="feedback-panel__text">{codeFeedback.text}</p>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" disabled={!isSolved} onClick={handleNextTrial} style={{ opacity: isSolved ? 1 : 0.5 }}>
              {activeTrialIndex < trialsData.challenges.length - 1 ? 'Next Challenge' : 'Finish'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function AppLayout() {
  const [moduleData, setModuleData] = useState(null);
  
  // 0: Prologue
  // 1-5: Acts 1-5
  // 6: Epilogue
  // 7: Coding Trials
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem('currentStep');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/modules`);
        if (res.ok) {
          const data = await res.json();
          const targetModule = data.find(m => m.id === 'thieves-at-the-well');
          if (targetModule) setModuleData(targetModule);
        }
      } catch (err) {
        console.error('Failed to load modules:', err);
      }
    };
    fetchModules();
  }, []);

  useEffect(() => {
    // Smooth scroll to top when currentStep changes
    const feed = document.getElementById('main-feed');
    if (feed) {
      feed.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleNextStep = () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    sessionStorage.setItem('currentStep', newStep.toString());
  };

  if (!moduleData) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading story...</div>;
  }

  const storyPages = moduleData.pages ? moduleData.pages.slice(0, 5) : [];
  const epiloguePage = moduleData.pages ? moduleData.pages[5] : null;
  
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <div className="app-header__logo">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="app-header__title" style={{ fontSize: '1rem' }}>PyBe</div>
          </div>
        </div>
        
        <div className="app-sidebar__nav">
          {/* Prologue (Step 0) */}
          <div className={`sidebar-item ${currentStep === 0 ? 'sidebar-item--active' : currentStep > 0 ? 'sidebar-item--completed' : ''}`}>
             <div className="sidebar-icon">{currentStep > 0 ? <Check size={14} /> : "P"}</div>
             <span>Prologue</span>
          </div>

          {/* Acts 1-5 (Steps 1-5) */}
          {storyPages.map((page, index) => {
            const stepIndex = index + 1;
            const isCompleted = currentStep > stepIndex;
            const isActive = currentStep === stepIndex;
            
            let itemClass = "sidebar-item";
            if (isActive) itemClass += " sidebar-item--active";
            if (isCompleted) itemClass += " sidebar-item--completed";
            
            return (
              <div key={page.page_number} className={itemClass}>
                <div className="sidebar-icon">
                  {isCompleted ? <Check size={14} /> : page.page_number}
                </div>
                <span>{page.title}</span>
              </div>
            );
          })}

          {/* Epilogue (Step 6) */}
          <div className={`sidebar-item ${currentStep === 6 ? 'sidebar-item--active' : currentStep > 6 ? 'sidebar-item--completed' : ''}`}>
             <div className="sidebar-icon">{currentStep > 6 ? <Check size={14} /> : "E"}</div>
             <span>Epilogue</span>
          </div>

          {/* Coding Trials (Step 7) */}
          <div className={`sidebar-item ${currentStep === 7 ? 'sidebar-item--active' : ''}`}>
             <div className="sidebar-icon">
               <Code2 size={12} />
             </div>
             <span>The Royal Trials</span>
          </div>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="app-feed" id="main-feed">
        <div className="feed-header">
          <h1 className="feed-header__title">{moduleData.title}</h1>
        </div>

        <div className="feed-container">
          
          {currentStep === 0 && (
            <div className="act-section animate-fade-in">
              <div className="act-content-wrapper">
                <h2 className="story-title">Prologue</h2>
                <p className="story-paragraph">{moduleData.prologue}</p>
                
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-primary" onClick={handleNextStep}>
                    Begin Construction
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep >= 1 && currentStep <= 5 && (
            <ActSection 
              key={currentStep} 
              actData={storyPages[currentStep - 1]} 
              onComplete={handleNextStep}
            />
          )}

          {currentStep === 6 && epiloguePage && (
            <div className="act-section animate-fade-in">
              <div className="act-content-wrapper">
                <h2 className="story-title" style={{ color: 'var(--accent-primary)' }}>Epilogue</h2>
                <div className="story-paragraph" style={{ whiteSpace: 'pre-wrap' }}>
                  {epiloguePage.story}
                </div>
                
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-primary" onClick={handleNextStep}>
                    Start the Coding Trials
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <CodingTrialsSection 
              trialsData={moduleData.coding_trials}
              onComplete={() => {}}
            />
          )}
          
        </div>
      </main>
    </div>
  );
}
