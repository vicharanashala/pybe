import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, Circle, PartyPopper } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useActiveConcept } from '../context/ConceptContext';
import api from '../utils/api';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PythonDiscoveryComponent from '../components/concept/PythonDiscoveryComponent';
import CodeVisualizerComponent from '../components/concept/CodeVisualizerComponent';
import FillBlankDragDrop from '../components/concept/FillBlankDragDrop';
import FeedbackWidget from '../components/concept/FeedbackWidget';
import LessonRightRail from '../components/concept/LessonRightRail';
import { getPracticeTopicForConcept } from '../utils/practiceTopicMap';
import { ConceptIcon } from '../utils/conceptIcons';
import { getThemeMeta } from '../utils/themeStyles';

export default function ConceptPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const theme = getThemeMeta(user?.theme);
  const { setActiveConcept } = useActiveConcept();
  const navigate = useNavigate();

  const [concept, setConcept] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [blanks, setBlanks] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [myProgress, setMyProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [justCompleted, setJustCompleted] = useState(false);
  const [nextConcept, setNextConcept] = useState(null);

  // Refs to each section, so completing one can smoothly scroll the next
  // one into view — it should feel like moving on to the next module, not
  // like a quiz quietly appearing below the fold.
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);


  const isLocked = () => {
    if (!concept || user.learningMode === 'explore') return false;
    if (concept.order === 1) return false;
    const prev = concepts.find(c => c.order === concept.order - 1);
    if (!prev) return false;
    return !progressMap[prev._id]?.completed;
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setJustCompleted(false);
      setAiExplanation('');
      setBlanks(null);
      setError('');
      try {
        const [cRes, allRes, pRes, bRes] = await Promise.all([
          api.get(`/concepts/${id}`),
          api.get('/concepts'),
          api.get(`/progress/user/${user._id}`),
          api.get(`/discovery/blanks/${id}`).catch(() => null)
        ]);

        setConcept(cRes.data);
        setActiveConcept(cRes.data);
        setConcepts(allRes.data);
        if (bRes) setBlanks(bRes.data);

        const map = pRes.data.reduce((acc, p) => {
          acc[p.conceptId._id] = p;
          return acc;
        }, {});
        setProgressMap(map);
        setMyProgress(map[cRes.data._id] || null);
      } catch (err) {
        setError('Could not load this concept. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, user._id]);

  const updateProgress = async (field) => {
    try {
      const payload = { conceptId: id, [field]: true };
      const res = await api.post('/progress/update', payload);
      const p = res.data.progress;
      setMyProgress(p);
      setProgressMap(prev => ({ ...prev, [id]: p }));

      if (p.completed) {
        setJustCompleted(true);
        if (res.data.nextConcept) setNextConcept(res.data.nextConcept);
      }

      // Bring the newly-unlocked section into view instead of leaving it
      // to quietly appear below the fold — this is what makes it read as
      // "moving on to the next module" rather than a stack getting taller.
      // The tiny delay lets React actually render the new section first.
      const targetRef = field === 'discoveryCompleted' ? section2Ref
        : field === 'codingCompleted' ? section3Ref
        : null;
      if (targetRef) {
        setTimeout(() => {
          targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err) {
      console.error('Progress update failed', err);
    }
  };

  const handleDiscoveryComplete = () => updateProgress('discoveryCompleted');
  const handlePracticeComplete = () => updateProgress('codingCompleted');
  const handleBlanksComplete = () => updateProgress('blanksCompleted');

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading concept...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-64 flex-col gap-4">
          <p className="text-red-500">{error}</p>
          <Link to="/dashboard" className="btn-secondary">← Dashboard</Link>
        </div>
      </div>
    );
  }

  if (isLocked()) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Navbar />
        <div className="flex">
          <Sidebar concepts={concepts} progressMap={progressMap} selectedTopic={concept} onSelectTopic={(topic) => navigate(`/concept/${topic._id}`)} />
          <main className="flex-1 flex items-center justify-center py-24 flex-col gap-4">
            <Lock size={40} className="text-gray-300 dark:text-gray-700" />
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">This concept is locked</h2>
            <p className="text-sm text-gray-400 max-w-xs text-center">
              Complete the previous concept to unlock {concept?.title}.
            </p>
            <Link to="/dashboard" className="btn-primary mt-2">← Back to dashboard</Link>
          </main>
        </div>
      </div>
    );
  }

  const prevConcept = concepts.find(c => c.order === concept.order - 1);
  const nextConceptInList = concepts.find(c => c.order === concept.order + 1);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="flex">
        <Sidebar concepts={concepts} progressMap={progressMap} selectedTopic={concept} onSelectTopic={(topic) => navigate(`/concept/${topic._id}`)} />

        <main className="flex-1 min-w-0 px-6 lg:px-10 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link to="/dashboard" className="hover:text-brand-500">Dashboard</Link>
            <span>›</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">{concept.title}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white shrink-0 shadow-md ${theme.glow}`}>
                <ConceptIcon name={concept.icon} size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={concept.difficulty === 'easy' ? 'badge-easy' : 'badge-medium'}>
                    {concept.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">Lesson {concept.order} of {concepts.length || concept.order}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{concept.title}</h1>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{concept.description}</p>
          </div>

          {/* Progress tracker */}
          <div className="card p-4 mb-6 flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm font-medium ${myProgress?.discoveryCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
              {myProgress?.discoveryCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              Discovery Learning
            </div>
            <div className="h-0.5 flex-1 bg-gray-100 dark:bg-gray-800" />
            <div className={`flex items-center gap-2 text-sm font-medium ${myProgress?.codingCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
              {myProgress?.codingCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              Visualize & Code
            </div>
            <div className="h-0.5 flex-1 bg-gray-100 dark:bg-gray-800" />
            <div className={`flex items-center gap-2 text-sm font-medium ${myProgress?.blanksCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
              {myProgress?.blanksCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              Fill in the Blanks
            </div>
          </div>

          {/* Just completed banner */}
          {justCompleted && (
            <div className="card p-5 mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800 text-center">
              <div className="flex justify-center mb-1 text-emerald-500">
                <PartyPopper size={24} />
              </div>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">Lesson Completed!</p>
              {nextConcept && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Next up: <span className="font-medium">{nextConcept.title}</span>
                </p>
              )}
              <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
                <Link
                  to={
                    getPracticeTopicForConcept(concept.slug)
                      ? `/practice/topic/${encodeURIComponent(getPracticeTopicForConcept(concept.slug))}`
                      : '/practice'
                  }
                  className="btn-secondary inline-flex"
                >
                  Practice Questions →
                </Link>
              </div>
            </div>
          )}

          {/* AI-Powered Python Discovery Learning */}
          <div className="space-y-6">
            {/**
             * SECTION 1: Discovery Learning
             * Three real-world scenarios, answered one at a time -> all
             * three responses submitted together in ONE request -> ONE
             * AI call (Groq) returns a segmented, always-encouraging
             * response that bridges to the real concept. No local scoring,
             * no retries — every response goes straight to the AI.
             */}
            <PythonDiscoveryComponent
              concept={concept}
              onComplete={handleDiscoveryComplete}
              isCompleted={!!myProgress?.discoveryCompleted}
              onExplanationReady={(text) => setAiExplanation(text)}
            />

            {/**
             * SECTION 2: Python concept + themed worked example.
             * Only unlocked once discovery learning is complete, so the
             * concept lands after the learner has already reasoned about
             * it. Visualize-only, unlimited use — the learner proceeds to
             * the next module whenever they decide they're ready.
             */}
            {myProgress?.discoveryCompleted && (
              <div ref={section2Ref} className="scroll-mt-24">
                <CodeVisualizerComponent
                  concept={concept}
                  onComplete={handlePracticeComplete}
                  isCompleted={!!myProgress?.codingCompleted}
                />
              </div>
            )}

            {/**
             * SECTION 3: Two drag-and-drop fill-in-the-blank questions (one
             * conceptual, one a small piece of code) — a required layer
             * between the visualizer and moving on to the next concept.
             * Only unlocked once Section 2 (visualize/code) is complete.
             */}
            {myProgress?.codingCompleted && blanks && (
              <div ref={section3Ref} className="scroll-mt-24">
                <FillBlankDragDrop
                  concept={concept}
                  blanks={blanks}
                  onComplete={handleBlanksComplete}
                  isCompleted={!!myProgress?.blanksCompleted}
                />
              </div>
            )}
          </div>

          {/* Feedback (shown only after both completed) */}
          {myProgress?.completed && (
            <div className="mt-6">
              <FeedbackWidget conceptId={concept._id} />
            </div>
          )}

          {/* Continue to next lesson — only appears once this concept is
              fully completed. Kept right below the feedback widget so it
              never shows up early. */}
          {myProgress?.completed && (nextConcept || nextConceptInList) && (
            <div className="mt-6 flex justify-center">
              <Link
                to={`/concept/${(nextConcept || nextConceptInList)._id}`}
                className="btn-primary inline-flex"
              >
                Continue to next lesson: {(nextConcept || nextConceptInList).title} →
              </Link>
            </div>
          )}

          {/* Navigation — previous lesson is always reachable; next lesson
              is intentionally NOT here, so it can't appear before the
              current concept is completed. */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            {prevConcept ? (
              <Link to={`/concept/${prevConcept._id}`} className="btn-ghost">
                ← {prevConcept.title}
              </Link>
            ) : <div />}
          </div>
        </main>

        <LessonRightRail concept={concept} disableNarrator={!!myProgress?.discoveryCompleted} aiExplanation={aiExplanation} />
      </div>
    </div>
  );
}
