import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import PracticeLayout from '../PracticeLayout';
import { practiceApi } from '../api/client';
import QuestionPanel from '../components/QuestionPanel';
import CodeEditor from '../components/CodeEditor';
import ResultsPanel from '../components/ResultsPanel';

export default function PracticeProblemWorkspace() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  const [runStatus, setRunStatus] = useState('idle'); // idle | running | done | error
  const [response, setResponse] = useState(null);
  const [solved, setSolved] = useState(false);

  const draftTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setProblem(null);
    setResponse(null);
    setRunStatus('idle');
    setError(null);

    practiceApi
      .getProblem(slug)
      .then((data) => {
        if (cancelled) return;
        setProblem(data);
        setCode(data.savedCode || data.starterCode);
        setSolved(data.status === 'solved');
      })
      .catch((e) => !cancelled && setError(e.message));

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const scheduleDraftSave = useCallback(
    (nextCode) => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
      draftTimer.current = setTimeout(() => {
        practiceApi.saveDraft(slug, nextCode).catch(() => {});
      }, 800);
    },
    [slug]
  );

  function handleCodeChange(next) {
    setCode(next);
    scheduleDraftSave(next);
  }

  async function handleRun() {
    setRunStatus('running');
    try {
      const res = await practiceApi.runCode(slug, code);
      setResponse(res);
      setRunStatus('done');
    } catch (e) {
      setResponse(null);
      setRunStatus('error');
    }
  }

  async function handleSubmit() {
    setRunStatus('running');
    try {
      const res = await practiceApi.submitCode(slug, code);
      setResponse(res);
      setRunStatus('done');
      if (res.allPassed) setSolved(true);
    } catch (e) {
      setResponse(null);
      setRunStatus('error');
    }
  }

  function handleReset() {
    if (!problem) return;
    if (window.confirm('Reset your code back to the starter template?')) {
      setCode(problem.starterCode);
      scheduleDraftSave(problem.starterCode);
    }
  }

  if (error) {
    return (
      <PracticeLayout>
        <div className="page-pad"><p className="error-text">Couldn't load this problem: {error}</p></div>
      </PracticeLayout>
    );
  }
  if (!problem) {
    return (
      <PracticeLayout>
        <div className="page-pad"><p className="muted">Loading…</p></div>
      </PracticeLayout>
    );
  }

  return (
    <PracticeLayout>
      <div className="workspace">
        <div className="workspace-topbar">
          <Link to={`/practice/topic/${encodeURIComponent(problem.topic)}`} className="back-link" style={{ marginBottom: 0 }}>
            ← {problem.topic}
          </Link>
          <span className="workspace-progress">
            Question {problem.order} of {problem.totalInTopic}
          </span>
          {solved && <span className="solved-chip flex items-center gap-1"><Check size={12} /> Solved</span>}
          <div className="workspace-nav">
            <button
              className="btn btn-ghost"
              disabled={!problem.prev}
              onClick={() => navigate(`/practice/problem/${problem.prev}`)}
            >
              ← Prev
            </button>
            <button
              className="btn btn-ghost"
              disabled={!problem.next}
              onClick={() => navigate(`/practice/problem/${problem.next}`)}
            >
              Next →
            </button>
          </div>
        </div>

        <div className="workspace-body">
          <div className="pane pane-question">
            <QuestionPanel problem={problem} />
          </div>

          <div className="pane pane-editor">
            <div className="editor-toolbar">
              <span className="editor-toolbar-title">Solution</span>
              <div className="editor-toolbar-actions">
                <button className="btn btn-ghost" onClick={handleReset}>
                  Reset
                </button>
                <button className="btn btn-outline" onClick={handleRun} disabled={runStatus === 'running'}>
                  {runStatus === 'running' ? 'Running…' : 'Run'}
                </button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={runStatus === 'running'}>
                  Submit
                </button>
              </div>
            </div>

            <div className="editor-wrap">
              <CodeEditor value={code} onChange={handleCodeChange} />
            </div>

            <div className="results-wrap">
              <ResultsPanel status={runStatus} response={response} samples={problem.samples} />
            </div>
          </div>
        </div>
      </div>
    </PracticeLayout>
  );
}
