import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen,
  Terminal,
  HelpCircle,
  CheckSquare,
  Sparkles,
  Send,
  MessageSquareText,
  Moon,
  Sun,
  ChevronLeft
} from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function api(path, options = {}, token) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export function LevelView() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('theory');

  const [mcqAnswers, setMcqAnswers] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  // Scenario state
  const [scenario, setScenario] = useState(null);
  const [form, setForm] = useState({
    learnerName: user?.username || 'Learner',
    reasoning: '',
    promptText: '',
    reflection: ''
  });
  const [scenarioResult, setScenarioResult] = useState(null);
  const [submittingScenario, setSubmittingScenario] = useState(false);

  useEffect(() => {
    async function loadLevel() {
      try {
        const data = await api(`/levels/${id}`, {}, token);
        setLevel(data);

        // Load a specific scenario for the Scenario Challenge
        const query =
          data.scenarioQuery || '?difficulty=Beginner';

        const scenarios = await api(
          `/scenarios${query}`,
          {},
          token
        );

        if (scenarios && scenarios.length > 0) {
          setScenario(scenarios[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    loadLevel();
  }, [id, token]);

  const submitScenario = async (e) => {
    e.preventDefault();

    if (!scenario || !form.reasoning.trim()) {
      return;
    }

    setSubmittingScenario(true);

    try {
      const result = await api(
        '/sessions',
        {
          method: 'POST',
          body: JSON.stringify({
            ...form,
            scenarioId: scenario._id
          })
        },
        token
      );

      setScenarioResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingScenario(false);
    }
  };

  const submitTest = async (e) => {
    e.preventDefault();

    try {
      const result = await api(
        `/levels/${id}/submit`,
        {
          method: 'POST',
          body: JSON.stringify({
            mcqAnswers,
            codingAnswers
          })
        },
        token
      );

      setTestResult(result);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <main className="loading">Loading Level...</main>;
  }

  if (!level) {
    return <main className="loading">Level not found.</main>;
  }

  const tabs = [
    {
      id: 'theory',
      icon: BookOpen,
      label: 'Theory & Syntax'
    },
    {
      id: 'practice',
      icon: HelpCircle,
      label: 'Practice & Scenarios'
    },
    {
      id: 'interview',
      icon: MessageSquareText,
      label: 'Interview Qs'
    },
    {
      id: 'mcqs',
      icon: CheckSquare,
      label: 'MCQs'
    },
    {
      id: 'coding',
      icon: Terminal,
      label: 'Coding'
    },
    {
      id: 'test',
      icon: Sparkles,
      label: 'Final Test'
    }
  ];

  return (
    <div
      className="app-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '1rem 2rem',
          background: 'var(--panel)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '0.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Back to Dashboard"
          >
            <ChevronLeft size={20} />
          </button>

          <h1
            style={{
              margin: 0,
              fontSize: '1.25rem',
              color: 'var(--text)',
              fontWeight: 600
            }}
          >
            {level.title}
          </h1>
        </div>

        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>
      </header>

      {/* Main Layout */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: '280px',
            background: 'var(--panel)',
            borderRight: '1px solid var(--border)',
            overflowY: 'auto',
            padding: '1.5rem 1rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  background:
                    activeTab === tab.id
                      ? 'var(--primary)'
                      : 'transparent',
                  color:
                    activeTab === tab.id
                      ? 'var(--primary-text)'
                      : 'var(--text-dim)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight:
                    activeTab === tab.id ? 600 : 500,
                  transition: 'background 0.2s, color 0.2s'
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2.5rem',
            background: 'var(--bg-secondary)'
          }}
        >
          <div
            style={{
              maxWidth: '850px',
              margin: '0 auto'
            }}
          >
            {/* THEORY */}
            {activeTab === 'theory' && (
              <div
                className="panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                <h2
                  style={{
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem'
                  }}
                >
                  Theory
                </h2>

                <div
                  style={{
                    display: 'grid',
                    gap: '1.5rem'
                  }}
                >
                  {level.theory.map((theory, index) => (
                    <div key={index}>
                      <h3
                        style={{
                          fontSize: '1.1rem',
                          marginBottom: '0.5rem',
                          color: 'var(--text)'
                        }}
                      >
                        {theory.title}
                      </h3>

                      <p
                        style={{
                          color: 'var(--text-dim)',
                          lineHeight: 1.6,
                          margin: 0
                        }}
                      >
                        {theory.content}
                      </p>
                    </div>
                  ))}
                </div>

                <h2
                  style={{
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem',
                    marginTop: '1rem'
                  }}
                >
                  Syntax
                </h2>

                <pre>{level.syntax}</pre>

                <h2
                  style={{
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem',
                    marginTop: '1rem'
                  }}
                >
                  Examples
                </h2>

                {level.examples.map((example, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '1rem',
                      background: 'var(--bg)',
                      padding: '1.25rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        marginBottom: '0.75rem',
                        color: 'var(--text)'
                      }}
                    >
                      {example.title}
                    </strong>

                    <pre
                      style={{
                        margin: '0 0 0.75rem 0'
                      }}
                    >
                      {example.code}
                    </pre>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        color: 'var(--text-dim)'
                      }}
                    >
                      {example.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* PRACTICE */}
            {activeTab === 'practice' && (
              <div
                className="panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                <h2
                  style={{
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem'
                  }}
                >
                  Guided Practice
                </h2>

                {level.guidedPractice.map((practice, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '1rem',
                      background: 'var(--bg)',
                      padding: '1.25rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                        alignItems: 'center'
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '1.1rem',
                          color: 'var(--text)'
                        }}
                      >
                        {practice.title}
                      </strong>

                      <span
                        style={{
                          fontSize: '0.8rem',
                          background: 'var(--primary)',
                          color: 'var(--primary-text)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          fontWeight: 600
                        }}
                      >
                        {practice.concept}
                      </span>
                    </div>

                    <p
                      style={{
                        marginBottom: '1.25rem',
                        color: 'var(--text-dim)'
                      }}
                    >
                      {practice.question}
                    </p>

                    <details>
                      <summary
                        style={{
                          cursor: 'pointer',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      >
                        View Solution & Explanation
                      </summary>

                      <div
                        style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          background: 'var(--panel)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px'
                        }}
                      >
                        <p
                          style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-dim)',
                            marginBottom: '0.75rem'
                          }}
                        >
                          <strong>Approach:</strong>{' '}
                          {practice.expectedApproach}
                        </p>

                        <pre
                          style={{
                            marginBottom: '0.75rem'
                          }}
                        >
                          {practice.solution}
                        </pre>

                        <p
                          style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-dim)',
                            margin: 0
                          }}
                        >
                          <strong>Explanation:</strong>{' '}
                          {practice.explanation}
                        </p>
                      </div>
                    </details>
                  </div>
                ))}

                <h2
                  style={{
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem',
                    marginTop: '2rem'
                  }}
                >
                  Scenario Challenge
                </h2>

                {scenario && (
                  <div
                    style={{
                      background: 'var(--bg)',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      border: '2px solid var(--primary)'
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: '0.5rem',
                        color: 'var(--text)'
                      }}
                    >
                      {scenario.title}
                    </h3>

                    <p
                      style={{
                        marginBottom: '1rem',
                        color: 'var(--text-dim)'
                      }}
                    >
                      {scenario.context}
                    </p>

                    <p
                      style={{
                        fontWeight: 600,
                        marginBottom: '1.5rem',
                        color: 'var(--text)'
                      }}
                    >
                      {scenario.prompt}
                    </p>

                    <form
                      onSubmit={submitScenario}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          fontWeight: 600,
                          color: 'var(--text)'
                        }}
                      >
                        Your reasoning

                        <textarea
                          required
                          value={form.reasoning}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              reasoning: e.target.value
                            })
                          }
                          placeholder="Type your thought process here..."
                        />
                      </label>

                      <button
                        type="submit"
                        className="primary"
                        disabled={submittingScenario}
                        style={{
                          alignSelf: 'flex-start'
                        }}
                      >
                        <Send size={18} />
                        {submittingScenario
                          ? 'Thinking...'
                          : 'Consult AI Mentor'}
                      </button>
                    </form>

                    {scenarioResult && (
                      <div
                        style={{
                          marginTop: '2rem',
                          padding: '1.5rem',
                          background: 'var(--panel)',
                          borderRadius: '8px',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <h4
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--primary)',
                            marginBottom: '1.25rem'
                          }}
                        >
                          <Sparkles size={18} />
                          Mentor Feedback
                        </h4>

                        {scenarioResult.abstractionMap.map((item) => (
                          <div
                            key={item.pattern}
                            style={{
                              marginBottom: '1rem'
                            }}
                          >
                            <strong
                              style={{
                                display: 'block',
                                color: 'var(--text)',
                                marginBottom: '0.25rem'
                              }}
                            >
                              {item.pattern} &rarr;{' '}
                              {item.pythonConcept}
                            </strong>

                            <span
                              style={{
                                fontSize: '0.95rem',
                                color: 'var(--text-dim)'
                              }}
                            >
                              {item.explanation}
                            </span>
                          </div>
                        ))}

                        <div
                          style={{
                            marginTop: '1.5rem'
                          }}
                        >
                          <strong
                            style={{
                              display: 'block',
                              marginBottom: '0.75rem',
                              color: 'var(--text)'
                            }}
                          >
                            Suggested Python Structure:
                          </strong>

                          <pre>
                            {scenarioResult.generatedCode}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* INTERVIEW */}
            {activeTab === 'interview' && (
              <div
                className="panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                <h2
                  style={{
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem'
                  }}
                >
                  Interview Questions
                </h2>

                {level.interviewQuestions.map((question, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'var(--bg)',
                      padding: '1.25rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: 'var(--text)',
                        fontSize: '1.05rem'
                      }}
                    >
                      Q: {question.question}
                    </p>

                    <details>
                      <summary
                        style={{
                          cursor: 'pointer',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      >
                        View Answer
                      </summary>

                      <div
                        style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          background: 'var(--panel)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px'
                        }}
                      >
                        <p
                          style={{
                            color: 'var(--text)',
                            marginBottom: '0.5rem'
                          }}
                        >
                          <strong>A:</strong> {question.answer}
                        </p>

                        <p
                          style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-dim)',
                            margin: 0,
                            fontStyle: 'italic'
                          }}
                        >
                          {question.explanation}
                        </p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}

            {/* MCQs */}
            {activeTab === 'mcqs' && (
              <div
                className="panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                <h2
                  style={{
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem'
                  }}
                >
                  Practice MCQs
                </h2>

                {level.mcqs.map((mcq, index) => (
                  <div
                    key={mcq.id}
                    style={{
                      background: 'var(--bg)',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        marginBottom: '1.25rem',
                        color: 'var(--text)',
                        fontSize: '1.05rem'
                      }}
                    >
                      {index + 1}. {mcq.question}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      {mcq.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          style={{
                            padding: '0.85rem 1rem',
                            background: 'var(--panel)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            color: 'var(--text-dim)'
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>

                    <details
                      style={{
                        marginTop: '1.5rem'
                      }}
                    >
                      <summary
                        style={{
                          cursor: 'pointer',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      >
                        View Correct Answer
                      </summary>

                      <div
                        style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          background: 'var(--success-bg)',
                          color: 'var(--success)',
                          borderRadius: '8px',
                          border:
                            '1px solid rgba(34, 197, 94, 0.2)'
                        }}
                      >
                        <strong
                          style={{
                            display: 'block',
                            marginBottom: '0.25rem'
                          }}
                        >
                          Answer:{' '}
                          {mcq.options[mcq.correctAnswer]}
                        </strong>

                        <span
                          style={{
                            fontSize: '0.95rem'
                          }}
                        >
                          {mcq.explanation}
                        </span>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}

            {/* CODING */}
            {activeTab === 'coding' && (
              <div
                className="panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                <h2
                  style={{
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem'
                  }}
                >
                  Coding Practice
                </h2>

                <div
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'var(--warning-bg)',
                    color: 'var(--warning)',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    border:
                      '1px solid rgba(234, 179, 8, 0.2)'
                  }}
                >
                  <strong>Note:</strong> Real Python execution will
                  be integrated in future phases (e.g. Judge0). For
                  this MVP, use this interface to practice writing
                  code locally.
                </div>

                {level.codingQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    style={{
                      background: 'var(--bg)',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: '0.75rem',
                        color: 'var(--text)'
                      }}
                    >
                      Task {index + 1}
                    </h3>

                    <p
                      style={{
                        marginBottom: '1.25rem',
                        color: 'var(--text-dim)'
                      }}
                    >
                      {question.problem}
                    </p>

                    <pre
                      contentEditable
                      suppressContentEditableWarning
                      style={{
                        minHeight: '120px',
                        outline: 'none'
                      }}
                    >
                      {question.starterCode}
                    </pre>

                    <details
                      style={{
                        marginTop: '1.5rem'
                      }}
                    >
                      <summary
                        style={{
                          cursor: 'pointer',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      >
                        Need a hint?
                      </summary>

                      <div
                        style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          background: 'var(--panel)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px'
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            color: 'var(--text-dim)'
                          }}
                        >
                          {question.explanation}
                        </p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}

            {/* FINAL TEST */}
            {activeTab === 'test' && (
              <div
                className="panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                <h2
                  style={{
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem'
                  }}
                >
                  Final Level Test
                </h2>

                {testResult ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '3rem 2rem',
                      background: testResult.passed
                        ? 'var(--success-bg)'
                        : 'var(--error-bg)',
                      borderRadius: '12px',
                      border: `2px solid ${
                        testResult.passed
                          ? 'var(--success)'
                          : 'var(--error)'
                      }`
                    }}
                  >
                    <h1
                      style={{
                        color: testResult.passed
                          ? 'var(--success)'
                          : 'var(--error)',
                        margin: '0 0 1rem 0',
                        fontSize: '2.5rem'
                      }}
                    >
                      {testResult.passed
                        ? 'Level Passed!'
                        : 'Keep Trying!'}
                    </h1>

                    <h2
                      style={{
                        fontSize: '4rem',
                        margin: '0 0 1.5rem 0',
                        color: testResult.passed
                          ? 'var(--success)'
                          : 'var(--error)'
                      }}
                    >
                      {testResult.score}%
                    </h2>

                    {testResult.passed &&
                      testResult.xpAwarded > 0 && (
                        <div
                          style={{
                            display: 'inline-block',
                            background: 'var(--warning)',
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '999px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            marginBottom: '1.5rem'
                          }}
                        >
                          🎉 You earned +{testResult.xpAwarded} XP!
                        </div>
                      )}

                    <p
                      style={{
                        color: testResult.passed
                          ? 'var(--success)'
                          : 'var(--error)',
                        opacity: 0.8,
                        marginBottom: '2rem',
                        fontSize: '1.1rem'
                      }}
                    >
                      {testResult.feedback}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem'
                      }}
                    >
                      <button
                        onClick={() => navigate('/')}
                        className="primary"
                      >
                        Return to Dashboard
                      </button>

                      {!testResult.passed && (
                        <button
                          onClick={() => {
                            setTestResult(null);
                            setMcqAnswers({});
                          }}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: 'var(--panel)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          Retake Test
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submitTest}>
                    <p
                      style={{
                        marginBottom: '2rem',
                        color: 'var(--text-dim)',
                        fontSize: '1.05rem'
                      }}
                    >
                      Complete this assessment to unlock the next
                      level. You need a score of 70% or higher to
                      pass.
                    </p>

                    <h3
                      style={{
                        marginBottom: '1.25rem',
                        color: 'var(--text)'
                      }}
                    >
                      Multiple Choice Questions
                    </h3>

                    {level.assessment.mcqs.map((question, index) => (
                      <div
                        key={question.id}
                        style={{
                          background: 'var(--bg)',
                          padding: '1.5rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          marginBottom: '1.5rem'
                        }}
                      >
                        <p
                          style={{
                            fontWeight: 600,
                            marginBottom: '1.25rem',
                            color: 'var(--text)'
                          }}
                        >
                          {index + 1}. {question.question}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                          }}
                        >
                          {question.options.map(
                            (option, optionIndex) => (
                              <label
                                key={optionIndex}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  cursor: 'pointer',
                                  padding: '0.85rem 1rem',
                                  background: 'var(--panel)',
                                  border: `1px solid ${
                                    mcqAnswers[question.id] ===
                                    optionIndex
                                      ? 'var(--primary)'
                                      : 'var(--border)'
                                  }`,
                                  borderRadius: '6px',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  required
                                  checked={
                                    mcqAnswers[question.id] ===
                                    optionIndex
                                  }
                                  onChange={() =>
                                    setMcqAnswers((previous) => ({
                                      ...previous,
                                      [question.id]: optionIndex
                                    }))
                                  }
                                  style={{
                                    margin: 0
                                  }}
                                />

                                <span
                                  style={{
                                    color:
                                      mcqAnswers[question.id] ===
                                      optionIndex
                                        ? 'var(--text)'
                                        : 'var(--text-dim)',
                                    fontWeight:
                                      mcqAnswers[question.id] ===
                                      optionIndex
                                        ? 500
                                        : 400
                                  }}
                                >
                                  {option}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    ))}

                    <h3
                      style={{
                        marginBottom: '1.25rem',
                        marginTop: '2.5rem',
                        color: 'var(--text)'
                      }}
                    >
                      Coding Challenges
                    </h3>

                    <div
                      style={{
                        padding: '1rem 1.25rem',
                        background: 'var(--warning-bg)',
                        color: 'var(--warning)',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border:
                          '1px solid rgba(234, 179, 8, 0.2)'
                      }}
                    >
                      <strong>MVP Note:</strong> For this version,
                      your score will be calculated purely based on
                      the MCQs above. Real coding evaluation will be
                      added in Phase 8.
                    </div>

                    {level.assessment.coding.map(
                      (question, index) => (
                        <div
                          key={question.id}
                          style={{
                            background: 'var(--bg)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            marginBottom: '1.5rem'
                          }}
                        >
                          <p
                            style={{
                              fontWeight: 600,
                              marginBottom: '1.25rem',
                              color: 'var(--text)'
                            }}
                          >
                            Coding {index + 1}:{' '}
                            {question.problem}
                          </p>

                          <textarea
                            placeholder="Type your Python code here..."
                            value={codingAnswers[question.id] || ''}
                            onChange={(e) =>
                              setCodingAnswers((previous) => ({
                                ...previous,
                                [question.id]: e.target.value
                              }))
                            }
                            style={{
                              fontFamily:
                                'ui-monospace, monospace'
                            }}
                          />
                        </div>
                      )
                    )}

                    <div
                      style={{
                        marginTop: '2.5rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <button
                        type="submit"
                        className="primary"
                        style={{
                          padding: '1rem 2.5rem',
                          fontSize: '1.1rem'
                        }}
                      >
                        Submit Assessment
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}