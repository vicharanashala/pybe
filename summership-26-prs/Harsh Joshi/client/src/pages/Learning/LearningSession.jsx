import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Code, BookOpen, Lightbulb, PartyPopper } from 'lucide-react';

/**
 * Visual Storytelling Utility
 * Uses Gemini to construct an optimal prompt, then renders an image via Pollinations.ai.
 */
export async function fetchGeminiIllustration(storyText, apiKey = import.meta.env.VITE_GEMINI_API_KEY) {
  const shortStory = storyText.substring(0, 300);
  const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent("Kid friendly vibrant cartoon illustration: " + shortStory)}?width=800&height=400&nologo=true`;
  
  if (!apiKey) return fallbackUrl;
  
  const prompt = `You are an expert prompt engineer. Create a short (max 40 words), highly descriptive, comma-separated image generation prompt for a kid-friendly, vibrant, 3D cartoon style illustration capturing this story. Output ONLY the image prompt text without any other words: ${storyText}`;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) return fallbackUrl;
    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (resultText) {
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(resultText)}?width=800&height=400&nologo=true`;
    }
    return fallbackUrl;
  } catch (err) {
    console.error("Gemini API Error:", err);
    return fallbackUrl;
  }
}

export default function LearningSession({ topicId = 'variables', themeId = 'pets', onBackToDashboard }) {
  const [step, setStep] = useState(1);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ name: 'Explorer', level: 1, score: 0, completedTopics: [] });
  
  // Step 1 Gemini visual state
  const [geminiVisual, setGeminiVisual] = useState(null);
  const [loadingVisual, setLoadingVisual] = useState(false);

  // Step 4 Practice state
  const [userInputs, setUserInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [failCount, setFailCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isCelebration, setIsCelebration] = useState(false);

  // Map topic name/id to theme key (e.g. 'pets_var', 'pets_cond', 'pets_loop', 'pets_list', 'pets_func')
  const getThemeKey = (tId, catId) => {
    const base = catId.split('_')[0] || 'pets';
    const shortMap = {
      'variables': 'var', 'var': 'var',
      'if/else logic': 'cond', 'cond': 'cond',
      'while loop': 'loop', 'loop': 'loop',
      'lists': 'list', 'list': 'list',
      'functions': 'func', 'func': 'func'
    };
    const suffix = shortMap[tId.toLowerCase()] || 'var';
    return `${base}_${suffix}`;
  };

  const loadJourney = async (activeTopicId, activeThemeId) => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setUserInputs({});
    const fullThemeKey = getThemeKey(activeTopicId, activeThemeId);

    const storedUser = localStorage.getItem('pybe_user');
    let uName = 'Explorer';
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        uName = parsed.name || 'Explorer';
      } catch (e) {}
    }

    try {
      const res = await fetch('/api/journey/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uName, themeId: fullThemeKey })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setJourney(data.data);
        
        // Trigger Gemini illustration fetch
        setLoadingVisual(true);
        fetchGeminiIllustration(data.data.step1_exampleStory)
          .then(res => setGeminiVisual(res))
          .finally(() => setLoadingVisual(false));
      } else {
        setError(data.error || "Failed to load learning journey.");
      }
    } catch (err) {
      setError("Network error loading story universe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourney(topicId, themeId);
  }, [topicId, themeId]);

  const handleInputChange = (key, val) => {
    setUserInputs(prev => ({ ...prev, [key]: val }));
    if (feedback) setFeedback(null);
  };

  const handlePracticeSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const currentTier = journey?.currentLevel || 1;
    const options = journey?.step4_evaluation?.options || {};
    let isCorrect = false;

    if (currentTier === 1 && options.blank_1 && options.blank_2) {
      const b1Correct = userInputs['blank_1'] === options.blank_1[0];
      const b2Correct = userInputs['blank_2'] === options.blank_2[0];
      isCorrect = b1Correct && b2Correct;
    } else {
      // Levels 2, 3, 4 free typing check
      const combined = Object.values(userInputs).join(' ').toLowerCase().trim();
      isCorrect = combined.length > 2 && (
        combined.includes('while') || combined.includes('=') || combined.includes('if') || 
        combined.includes('def') || combined.includes('print') || combined.includes('<') || combined.includes('>')
      );
    }

    try {
      // POST evaluation to backend Aggregate
      const res = await fetch('/api/journey/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.name, topic: journey.topic, isCorrect })
      });
      const evalData = await res.json();

      if (isCorrect) {
        setIsCelebration(true);
        setStep(5); // Move to Celebration Step
        
        // Update LocalStorage persistence
        const updatedCompleted = Array.from(new Set([...(user.completedTopics || []), topicId]));
        const updatedUser = {
          ...user,
          completedTopics: updatedCompleted,
          level: evalData.data?.newLevel || (user.level < 4 ? user.level + 1 : 4),
          score: (user.score || 0) + 10
        };
        setUser(updatedUser);
        localStorage.setItem('pybe_user', JSON.stringify(updatedUser));
      } else {
        const newFailCount = failCount + 1;
        setFailCount(newFailCount);

        // Productive Struggle / Contradiction handling
        if (newFailCount >= 2) {
          setFeedback({
            type: 'struggle_retry',
            message: "You've experimented bravely! To build a stronger mental model, let's explore a fresh Practice Story in a different universe!"
          });
          setTimeout(() => {
            // Dynamic fallback theme for productive struggle
            const fallbackThemes = ['space', 'magic', 'heroes', 'games', 'dinosaurs'];
            const nextTheme = fallbackThemes[Math.floor(Math.random() * fallbackThemes.length)];
            setFailCount(0);
            loadJourney(topicId, nextTheme);
          }, 3500);
        } else {
          const exps = journey?.step4_evaluation?.explanations || {};
          const hint = exps.wrong_blank_1 || exps.wrong_blank_2 || "Look closely at how the variables and actions were named in the story!";
          setFeedback({
            type: 'error',
            message: `Not quite! Notice the contradiction: ${hint}`
          });
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', message: "Evaluation check failed. Try again!" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="panel" style={{ padding: '4rem', textAlign: 'center', fontSize: '1.2rem' }}>✨ Opening your enchanted Python universe...</div>;
  }

  if (error || !journey) {
    return (
      <div className="panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <AlertTriangle size={40} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
        <h3>Story Universe Offline</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || "Could not load this topic."}</p>
        <button onClick={onBackToDashboard} style={{ padding: '0.75rem 1.5rem', background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { step1_exampleStory, step2_discovery, step3_practiceStory, step4_evaluation, currentLevel } = journey;

  return (
    <div className="panel learning-session-container" style={{ maxWidth: '950px', margin: '1.5rem auto', padding: '2.5rem', position: 'relative' }}>
      {/* Step Indicator Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize', color: '#ec4899' }}>{journey.topic}</span>
          <span style={{ color: 'var(--text-muted)' }}>| Level {currentLevel} Tier</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              style={{
                width: '32px',
                height: '8px',
                borderRadius: '4px',
                background: step >= s ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'var(--border)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: The Example Story & Gemini Visual */}
      {step === 1 && (
        <div className="step-content animation-fade-in">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} style={{ color: '#ec4899' }} /> Step 1: The Example Story
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Read what happens in our story universe before writing any code!</p>

          {/* Visual Illustration Layer */}
          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <Sparkles size={18} /> Visual Storyteller
            </div>
            
            {loadingVisual ? (
              <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>🎨 Painting your story illustration...</div>
            ) : geminiVisual ? (
              <div style={{ padding: '0', background: 'var(--bg)', borderRadius: '10px', textAlign: 'center' }}>
                <img src={geminiVisual} alt="Story Illustration" style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', display: 'block', margin: '0 auto' }} />
              </div>
            ) : (
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))', borderRadius: '12px', border: '1px dashed #ec4899' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎨 ✨ 🚀</div>
                <strong style={{ display: 'block', color: 'var(--text)' }}>Visual Universe Scene</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Imagine the character interacting with their magic containers in vivid detail!</span>
              </div>
            )}
          </div>

          <div style={{ fontSize: '1.2rem', lineHeight: '1.8', padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: '12px', borderLeft: '4px solid #ec4899', marginBottom: '2.5rem' }}>
            {step1_exampleStory}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={onBackToDashboard} style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={18} /> Dashboard
            </button>
            <button onClick={() => setStep(2)} style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>
              Next: Discover the Logic <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Narrative Pseudo-code */}
      {step === 2 && (
        <div className="step-content animation-fade-in">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={24} style={{ color: '#f59e0b' }} /> Step 2: Notice the Hidden Pattern
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Did you notice the main process happening here? The character followed a strict rule in their adventure!
          </p>

          <div style={{ background: '#1e1e2e', color: '#a6accd', padding: '1.75rem', borderRadius: '12px', fontFamily: 'monospace', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '2.5rem', border: '1px solid #303040', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            {step2_discovery?.pseudo || "Rule pattern discovered in story."}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={18} /> Story
            </button>
            <button onClick={() => setStep(3)} style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>
              Next: Python Syntax Translation <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Side-by-Side Code Translation */}
      {step === 3 && (
        <div className="step-content animation-fade-in">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={24} style={{ color: '#3b82f6' }} /> Step 3: Side-by-Side Python Translation
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            In Python, we can write this exact same story using this syntax. Here is how the story rules translate directly into real code:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', marginBottom: '0.75rem', color: '#f59e0b', fontSize: '0.95rem' }}>📖 Story Logic (Pseudo-code)</strong>
              <pre style={{ fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
                {step2_discovery?.pseudo}
              </pre>
            </div>

            <div style={{ background: '#1e1e2e', color: '#a6accd', padding: '1.5rem', borderRadius: '12px', border: '1px solid #303040' }}>
              <strong style={{ display: 'block', marginBottom: '0.75rem', color: '#38bdf8', fontSize: '0.95rem' }}>🐍 Real Python Code</strong>
              <pre style={{ fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: '#e0e6ff' }}>
                {step2_discovery?.python}
              </pre>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(2)} style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={18} /> Pattern
            </button>
            <button onClick={() => setStep(4)} style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #ec4899, #10b981)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>
              Next: Try the Practice Challenge! <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Adaptive Practice & Feedback Loop */}
      {step === 4 && (
        <div className="step-content animation-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={24} style={{ color: '#10b981' }} /> Step 4: Your Practice Challenge
            </h2>
            <span style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', fontWeight: 'bold', border: '1px solid #10b981' }}>
              Adaptive Tier {currentLevel}
            </span>
          </div>

          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: '10px', marginBottom: '1.5rem', borderLeft: '4px solid #10b981' }}>
            {step3_practiceStory}
          </p>

          <form onSubmit={handlePracticeSubmit}>
            {/* Level 1: Dropdown Options */}
            {currentLevel === 1 && step4_evaluation?.options && (
              <div style={{ background: '#1e1e2e', padding: '1.75rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #303040' }}>
                <strong style={{ display: 'block', color: '#38bdf8', marginBottom: '1rem', fontSize: '1rem' }}>🐍 Complete the Python Syntax Blanks:</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#a6accd', marginBottom: '0.5rem', fontSize: '0.9rem' }}>[ BLANK 1 ] Container/Rule Name:</label>
                    <select
                      value={userInputs['blank_1'] || ''}
                      onChange={e => handleInputChange('blank_1', e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#282a36', color: 'white', border: '1px solid #44475a', fontSize: '1rem' }}
                    >
                      <option value="">-- Choose Option --</option>
                      {(step4_evaluation.options.blank_1 || []).map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#a6accd', marginBottom: '0.5rem', fontSize: '0.9rem' }}>[ BLANK 2 ] Target Value/Condition:</label>
                    <select
                      value={userInputs['blank_2'] || ''}
                      onChange={e => handleInputChange('blank_2', e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#282a36', color: 'white', border: '1px solid #44475a', fontSize: '1rem' }}
                    >
                      <option value="">-- Choose Option --</option>
                      {(step4_evaluation.options.blank_2 || []).map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Levels 2, 3, 4: Free Typing / Minimal Blanks */}
            {currentLevel > 1 && (
              <div style={{ background: '#1e1e2e', padding: '1.75rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #303040' }}>
                <strong style={{ display: 'block', color: '#38bdf8', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  🐍 {currentLevel === 4 ? "Write Full Code Block (No Scaffolding):" : "Fill in the Missing Code Syntax:"}
                </strong>
                <p style={{ color: '#6272a4', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {step4_evaluation?.python_template || "Write your Python code below:"}
                </p>
                <textarea
                  rows={4}
                  value={userInputs['code_input'] || ''}
                  onChange={e => handleInputChange('code_input', e.target.value)}
                  placeholder="e.g., while nest_size < 20:"
                  required
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: '#282a36', color: '#50fa7b', border: '1px solid #44475a', fontFamily: 'monospace', fontSize: '1.05rem', lineHeight: '1.6' }}
                />
              </div>
            )}

            {/* Inline Narrative Error / Productive Struggle Feedback */}
            {feedback && (
              <div style={{
                padding: '1.25rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                background: feedback.type === 'struggle_retry' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: feedback.type === 'struggle_retry' ? '1px solid #8b5cf6' : '1px solid #ef4444',
                color: feedback.type === 'struggle_retry' ? '#8b5cf6' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                lineHeight: '1.5'
              }}>
                {feedback.type === 'struggle_retry' ? <RefreshCw size={24} className="spin-icon" /> : <AlertTriangle size={24} />}
                <div>
                  <strong style={{ display: 'block' }}>{feedback.type === 'struggle_retry' ? 'Productive Struggle Triggered! 🌟' : 'Contradiction Detected!'}</strong>
                  <span>{feedback.message}</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={() => setStep(3)} style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={18} /> Translation
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '0.85rem 2.5rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                {submitting ? 'Checking Logic...' : 'Submit Practice Code ✨'} <CheckCircle2 size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 5: Celebration Confetti Screen */}
      {step === 5 && (
        <div className="step-content animation-fade-in" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 1s infinite' }}>🎉 🏆 ✨</div>
          <h1 style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <PartyPopper size={36} /> Concept Mastered!
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
            Incredible job, {user.name}! You mastered <strong>{journey.topic}</strong> in the <strong>{themeId}</strong> universe and gained +10 XP!
          </p>

          <div style={{ display: 'inline-block', background: 'var(--bg-subtle)', padding: '1.5rem 3rem', borderRadius: '16px', border: '2px solid #10b981', marginBottom: '2.5rem' }}>
            <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Next Tier Unlocked</span>
            <strong style={{ fontSize: '1.8rem', color: '#ec4899' }}>Level {user.level || 2} Motivation Tier</strong>
          </div>

          <div>
            <button
              onClick={onBackToDashboard}
              style={{
                padding: '1rem 3rem',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.5)'
              }}
            >
              Choose Next Concept <ArrowRight size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
