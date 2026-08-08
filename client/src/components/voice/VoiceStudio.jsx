import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  Bug,
  BookOpen,
  HelpCircle,
  HelpCircle as QuizIcon,
  Briefcase,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Code,
  Send,
  X
} from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';
import AudioControls from './AudioControls';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' }
];

export default function VoiceStudio({ activeScenario, onClose, dyslexicFont, setDyslexicFont }) {
  const [activeTab, setActiveTab] = useState('ask'); // ask | logic | tutor | debug | code_reader | quiz | interview | accessibility
  const [language, setLanguage] = useState('en-US');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [handsFree, setHandsFree] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState('');

  // Form states
  const [questionInput, setQuestionInput] = useState('');
  const [userLogicInput, setUserLogicInput] = useState('');
  const [debugCode, setDebugCode] = useState('def get_first(items):\n    return items[5]\n\nprint(get_first(["a", "b"]))');
  const [debugError, setDebugError] = useState('My program gives IndexError');
  const [codeToRead, setCodeToRead] = useState('for i in range(5):\n    if i % 2 == 0:\n        print(f"Even: {i}")');
  
  // Results states
  const [history, setHistory] = useState([]);
  const [currentAiOutput, setCurrentAiOutput] = useState(null);
  const [logicAssessment, setLogicAssessment] = useState(null);
  const [debugOutput, setDebugOutput] = useState(null);
  const [codeReadOutput, setCodeReadOutput] = useState(null);
  
  // Quiz & Interview states
  const [quizState, setQuizState] = useState({ index: 0, currentQuestion: null, evaluation: null });
  const [interviewState, setInterviewState] = useState({ index: 0, currentQuestion: null, evaluation: null });

  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = language;

      rec.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);

        // Update corresponding input field based on active mode
        if (activeTab === 'ask' || activeTab === 'tutor') setQuestionInput(currentText);
        if (activeTab === 'logic') setUserLogicInput(currentText);
        if (activeTab === 'debug') setDebugError(currentText);
      };

      rec.onend = () => {
        setIsListening(false);
        if (handsFree && transcript.trim()) {
          handleVoiceSubmit();
        }
      };

      rec.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language, activeTab, handsFree, transcript]);

  // Speech Synthesis Helper
  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (handsFree) {
        startListening();
      }
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setSrAnnouncement(`AI Tutor speaking: ${text}`);
  }

  function pauseSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    pauseSpeaking();
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    } else {
      alert('Web Speech API is not supported in this browser. You can type your voice query instead!');
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }

  async function handleVoiceSubmit() {
    if (activeTab === 'ask' || activeTab === 'tutor') {
      const q = questionInput.trim() || transcript.trim() || 'What is recursion?';
      const res = await fetch(`${API_URL}/voice/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, language, history })
      }).then(r => r.json());

      setCurrentAiOutput(res);
      setHistory(prev => [...prev, { role: 'user', text: q }, { role: 'ai', text: res.textResponse }]);
      speakText(res.spokenScript);
    } else if (activeTab === 'logic') {
      const explanation = userLogicInput.trim() || transcript.trim() || 'I used a loop to check each item in the list.';
      const res = await fetch(`${API_URL}/voice/assess-logic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activeScenario?.initialCode || '', userExplanation: explanation, language })
      }).then(r => r.json());

      setLogicAssessment(res);
      speakText(res.spokenSummary);
    } else if (activeTab === 'debug') {
      const errTxt = debugError.trim() || transcript.trim() || 'My program gives IndexError';
      const res = await fetch(`${API_URL}/voice/debug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: debugCode, spokenError: errTxt, language })
      }).then(r => r.json());

      setDebugOutput(res);
      speakText(res.spokenExplanation);
    } else if (activeTab === 'code_reader') {
      const res = await fetch(`${API_URL}/voice/read-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToRead, language })
      }).then(r => r.json());

      setCodeReadOutput(res);
      speakText(res.spokenTranslation);
    } else if (activeTab === 'quiz') {
      const ans = transcript.trim() || 'Immutable';
      const res = await fetch(`${API_URL}/voice/quiz/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: quizState.currentQuestion?.id || 'q1',
          question: quizState.currentQuestion?.question || '',
          spokenAnswer: ans
        })
      }).then(r => r.json());

      setQuizState(prev => ({ ...prev, evaluation: res }));
      speakText(res.spokenFeedback);
    } else if (activeTab === 'interview') {
      const ans = transcript.trim() || 'Encapsulation, Inheritance, Polymorphism, Abstraction';
      const res = await fetch(`${API_URL}/voice/interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: interviewState.currentQuestion?.question || '',
          spokenAnswer: ans
        })
      }).then(r => r.json());

      setInterviewState(prev => ({ ...prev, evaluation: res }));
      speakText(res.spokenEvaluation);
    }
  }

  // Load next Quiz Question
  async function loadQuizQuestion(index = 0) {
    const res = await fetch(`${API_URL}/voice/quiz/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index })
    }).then(r => r.json());

    setQuizState({ index, currentQuestion: res, evaluation: null });
    speakText(res.spokenQuestion);
  }

  // Load next Interview Question
  async function loadInterviewQuestion(index = 0) {
    const res = await fetch(`${API_URL}/voice/interview/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index })
    }).then(r => r.json());

    setInterviewState({ index, currentQuestion: res, evaluation: null });
    speakText(res.spokenPrompt);
  }

  useEffect(() => {
    if (activeTab === 'quiz' && !quizState.currentQuestion) {
      loadQuizQuestion(0);
    } else if (activeTab === 'interview' && !interviewState.currentQuestion) {
      loadInterviewQuestion(0);
    }
  }, [activeTab]);

  return (
    <div className={`voice-studio-overlay ${highContrast ? 'high-contrast' : ''}`}>
      <div className={`voice-studio-modal ${dyslexicFont ? 'dyslexic-font' : ''}`} role="dialog" aria-label="PyBre Voice-Based Learning Studio">
        
        {/* Screen Reader Live Announcer */}
        <div className="sr-only" aria-live="polite">{srAnnouncement}</div>

        {/* Studio Header */}
        <header className="voice-studio-header">
          <div className="voice-brand">
            <div className="mic-badge-pulse">
              <Mic size={22} />
            </div>
            <div>
              <h2>Voice Learning Studio</h2>
              <span className="subtitle">Speak with your conversational AI Python tutor</span>
            </div>
          </div>

          <div className="header-controls">
            {/* Language Selector */}
            <label className="language-dropdown">
              <Languages size={16} />
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </label>

            {/* Accessibility Quick Toggle */}
            <button
              className={`icon-btn ${dyslexicFont ? 'active' : ''}`}
              onClick={() => setDyslexicFont(!dyslexicFont)}
              title="Toggle OpenDyslexic Accessible Font"
            >
              <Eye size={18} />
              <span>Dyslexic Font</span>
            </button>

            {onClose && (
              <button className="icon-btn close-btn" onClick={onClose} title="Close Voice Studio">
                <X size={20} />
              </button>
            )}
          </div>
        </header>

        {/* Mode Navigation Tabs */}
        <nav className="voice-mode-tabs">
          <button className={activeTab === 'ask' ? 'tab active' : 'tab'} onClick={() => setActiveTab('ask')}>
            <Sparkles size={16} /> Question Assistant
          </button>
          <button className={activeTab === 'logic' ? 'tab active' : 'tab'} onClick={() => setActiveTab('logic')}>
            <BookOpen size={16} /> Logic Assessment
          </button>
          <button className={activeTab === 'tutor' ? 'tab active' : 'tab'} onClick={() => setActiveTab('tutor')}>
            <HelpCircle size={16} /> AI Spoken Tutor
          </button>
          <button className={activeTab === 'debug' ? 'tab active' : 'tab'} onClick={() => setActiveTab('debug')}>
            <Bug size={16} /> Voice Debugger
          </button>
          <button className={activeTab === 'code_reader' ? 'tab active' : 'tab'} onClick={() => setActiveTab('code_reader')}>
            <Code size={16} /> Read Code Aloud
          </button>
          <button className={activeTab === 'quiz' ? 'tab active' : 'tab'} onClick={() => setActiveTab('quiz')}>
            <QuizIcon size={16} /> Interactive Quiz
          </button>
          <button className={activeTab === 'interview' ? 'tab active' : 'tab'} onClick={() => setActiveTab('interview')}>
            <Briefcase size={16} /> Mock Interview
          </button>
          <button className={activeTab === 'accessibility' ? 'tab active' : 'tab'} onClick={() => setActiveTab('accessibility')}>
            <Eye size={16} /> Accessibility & Hands-Free
          </button>
        </nav>

        {/* Main Recording Bar & Waveform */}
        <section className="recording-hero">
          <WaveformVisualizer isListening={isListening} isSpeaking={isSpeaking} />

          <div className="mic-action-row">
            <button
              className={`mic-pulsator-btn ${isListening ? 'recording' : ''}`}
              onClick={toggleListening}
              title={isListening ? 'Stop Recording' : 'Start Speaking'}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
            <span className="mic-hint">
              {isListening ? 'Listening to your voice... (Click mic to stop)' : 'Click Microphone or use Spacebar to talk'}
            </span>
          </div>

          {/* Audio Playback Toolbar */}
          <AudioControls
            textToSpeak={currentAiOutput?.spokenScript || logicAssessment?.spokenSummary || debugOutput?.spokenExplanation || codeReadOutput?.spokenTranslation || 'Welcome to PyBre Voice Studio!'}
            onPlay={speakText}
            onPause={pauseSpeaking}
            isPlaying={isSpeaking}
            speechRate={speechRate}
            setSpeechRate={setSpeechRate}
            showTranscript={showTranscript}
            setShowTranscript={setShowTranscript}
          />
        </section>

        {/* Tab Content Panels */}
        <div className="voice-tab-content">

          {/* 1. Voice Question Assistant */}
          {(activeTab === 'ask' || activeTab === 'tutor') && (
            <div className="mode-panel">
              <h3>Ask Python Questions by Voice</h3>
              <p className="hint-text">Examples: "What is recursion?", "Explain list comprehension", "How do dictionaries work?"</p>
              
              <div className="voice-input-box">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Ask any Python question or speak into microphone..."
                />
                <button className="primary-btn" onClick={handleVoiceSubmit}>
                  <Send size={16} /> Ask AI
                </button>
              </div>

              {currentAiOutput && (
                <div className="ai-spoken-card">
                  <div className="card-header">
                    <Sparkles size={20} className="sparkle-icon" />
                    <strong>AI Tutor Response ({currentAiOutput.topic})</strong>
                  </div>
                  {showTranscript && <p className="spoken-text">"{currentAiOutput.spokenScript}"</p>}
                  
                  {currentAiOutput.codeSnippet && (
                    <div className="code-snippet-preview">
                      <div className="code-header">Python Code Example</div>
                      <pre><code>{currentAiOutput.codeSnippet}</code></pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. Logic Explanation Assessment */}
          {activeTab === 'logic' && (
            <div className="mode-panel">
              <h3>Logic Explanation Assessment</h3>
              <p className="hint-text">Verbally explain how you solved your coding problem (e.g. "I used a loop to check every number...").</p>

              <textarea
                rows={3}
                value={userLogicInput}
                onChange={(e) => setUserLogicInput(e.target.value)}
                placeholder="Speak or type your solution reasoning here..."
              />
              <button className="primary-btn" onClick={handleVoiceSubmit}>
                <Send size={16} /> Assess My Reasoning
              </button>

              {logicAssessment && (
                <div className="logic-score-card">
                  <div className="score-summary">
                    <div className="big-score">{logicAssessment.overallScore}%</div>
                    <div className="score-label">Logic Mastery Score</div>
                  </div>

                  <div className="metrics-grid">
                    <div className="metric">
                      <span>Correctness</span>
                      <strong>{logicAssessment.metrics.correctness}%</strong>
                    </div>
                    <div className="metric">
                      <span>Reasoning</span>
                      <strong>{logicAssessment.metrics.reasoning}%</strong>
                    </div>
                    <div className="metric">
                      <span>Efficiency</span>
                      <strong>{logicAssessment.metrics.efficiency}%</strong>
                    </div>
                  </div>

                  {logicAssessment.feedback.length > 0 && (
                    <ul className="feedback-list">
                      {logicAssessment.feedback.map((fb, idx) => (
                        <li key={idx}><CheckCircle2 size={16} color="#22c55e" /> {fb}</li>
                      ))}
                    </ul>
                  )}

                  {logicAssessment.missingCases.length > 0 && (
                    <div className="missing-cases">
                      <strong>Missing Edge Cases to Consider:</strong>
                      {logicAssessment.missingCases.map((mc, i) => (
                        <span key={i} className="chip warning"><AlertTriangle size={14} /> {mc}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 3. Voice Debugger */}
          {activeTab === 'debug' && (
            <div className="mode-panel">
              <h3>Voice Debugger</h3>
              <p className="hint-text">Paste your Python code and speak your error message (e.g., "My code gives IndexError").</p>

              <div className="debug-grid">
                <div>
                  <label>Python Code</label>
                  <textarea
                    rows={6}
                    value={debugCode}
                    onChange={(e) => setDebugCode(e.target.value)}
                    className="code-editor-box"
                  />
                </div>
                <div>
                  <label>Spoken Error Description</label>
                  <input
                    type="text"
                    value={debugError}
                    onChange={(e) => setDebugError(e.target.value)}
                    placeholder="Speak error..."
                  />
                  <button className="primary-btn mt-2" onClick={handleVoiceSubmit}>
                    <Bug size={16} /> Debug Code with Voice
                  </button>

                  {debugOutput && (
                    <div className="debug-result-box">
                      <div className="error-header">
                        <AlertTriangle size={18} color="#ef4444" />
                        <strong>{debugOutput.errorType} on Line {debugOutput.lineToHighlight}</strong>
                      </div>
                      <p><strong>Cause:</strong> {debugOutput.cause}</p>
                      <p className="spoken-fix">"{debugOutput.spokenExplanation}"</p>
                      
                      <div className="code-fix-box">
                        <small>Suggested Fix:</small>
                        <pre><code>{debugOutput.suggestedCode}</code></pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. Read Code Aloud */}
          {activeTab === 'code_reader' && (
            <div className="mode-panel">
              <h3>Read Code Aloud</h3>
              <p className="hint-text">Converts Python code into human-friendly spoken explanations without literal symbols.</p>

              <textarea
                rows={5}
                value={codeToRead}
                onChange={(e) => setCodeToRead(e.target.value)}
                className="code-editor-box"
              />
              <button className="primary-btn" onClick={handleVoiceSubmit}>
                <Volume2 size={16} /> Translate & Read Code Aloud
              </button>

              {codeReadOutput && (
                <div className="code-reader-card">
                  <h4>Spoken English Translation:</h4>
                  <p className="spoken-translation">"{codeReadOutput.spokenTranslation}"</p>
                  
                  <div className="sentence-breakdown">
                    <strong>Line-by-Line Spoken Script:</strong>
                    {codeReadOutput.sentences.map((sentence, idx) => (
                      <div key={idx} className="sentence-item">
                        <Volume2 size={14} className="clickable-speaker" onClick={() => speakText(sentence)} />
                        <span>{sentence}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Interactive Voice Quiz */}
          {activeTab === 'quiz' && (
            <div className="mode-panel">
              <h3>Interactive Voice Quiz</h3>
              {quizState.currentQuestion ? (
                <div className="quiz-card">
                  <div className="quiz-header">
                    <span className="chip">{quizState.currentQuestion.topic}</span>
                    <button className="secondary-btn btn-sm" onClick={() => loadQuizQuestion(quizState.index + 1)}>
                      Next Question
                    </button>
                  </div>

                  <h4>{quizState.currentQuestion.question}</h4>
                  <p className="quiz-hint">💡 Hint: {quizState.currentQuestion.hint}</p>

                  <div className="spoken-answer-box">
                    <button className="mic-inline-btn" onClick={toggleListening}>
                      <Mic size={16} /> Speak Your Answer
                    </button>
                    <span>Recorded Answer: "{transcript || 'Waiting for spoken answer...'}"</span>
                  </div>

                  <button className="primary-btn" onClick={handleVoiceSubmit}>
                    Submit Verbal Answer
                  </button>

                  {quizState.evaluation && (
                    <div className={`quiz-eval-box ${quizState.evaluation.isCorrect ? 'correct' : 'incorrect'}`}>
                      <strong>{quizState.evaluation.isCorrect ? '✅ Correct!' : '❌ Let\'s Learn!'} (Score: {quizState.evaluation.score}%)</strong>
                      <p>{quizState.evaluation.feedback}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>Loading Quiz Question...</p>
              )}
            </div>
          )}

          {/* 6. Voice Coding Interview */}
          {activeTab === 'interview' && (
            <div className="mode-panel">
              <h3>Voice Coding Interview Practice</h3>
              {interviewState.currentQuestion ? (
                <div className="interview-card">
                  <div className="interview-header">
                    <span className="chip category">{interviewState.currentQuestion.category}</span>
                    <button className="secondary-btn btn-sm" onClick={() => loadInterviewQuestion(interviewState.index + 1)}>
                      Next Question
                    </button>
                  </div>

                  <h4>Interviewer AI Question:</h4>
                  <p className="interview-prompt">"{interviewState.currentQuestion.question}"</p>

                  <div className="spoken-answer-box">
                    <button className="mic-inline-btn" onClick={toggleListening}>
                      <Mic size={16} /> Record Voice Response
                    </button>
                    <span>Your Answer: "{transcript || 'Speak response clearly...'}"</span>
                  </div>

                  <button className="primary-btn" onClick={handleVoiceSubmit}>
                    Evaluate Interview Response
                  </button>

                  {interviewState.evaluation && (
                    <div className="interview-eval-box">
                      <div className="score-badge">
                        Interview Score: {interviewState.evaluation.scores.overallScore}%
                      </div>
                      <p>"{interviewState.evaluation.spokenEvaluation}"</p>
                      
                      <ul>
                        {interviewState.evaluation.feedback.map((fb, idx) => (
                          <li key={idx}><CheckCircle2 size={14} color="#22c55e" /> {fb}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p>Loading Interview Question...</p>
              )}
            </div>
          )}

          {/* 7. Accessibility & Hands-Free Settings */}
          {activeTab === 'accessibility' && (
            <div className="mode-panel">
              <h3>Accessibility & Hands-Free Learning Mode</h3>
              
              <div className="settings-grid">
                <div className="setting-card">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={dyslexicFont}
                      onChange={(e) => setDyslexicFont(e.target.checked)}
                    />
                    <strong>OpenDyslexic Font Mode</strong>
                  </label>
                  <p>Enhances letter spacing and weighted bottoms for dyslexic learners.</p>
                </div>

                <div className="setting-card">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                    />
                    <strong>High Contrast Theme</strong>
                  </label>
                  <p>Maximizes color contrast ratios for visually impaired learners.</p>
                </div>

                <div className="setting-card">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={handsFree}
                      onChange={(e) => setHandsFree(e.target.checked)}
                    />
                    <strong>Hands-Free Auto-Listen</strong>
                  </label>
                  <p>Automatically reactivates microphone after AI finishes speaking.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
