import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { ConceptIcon } from '../utils/conceptIcons';
import { getThemeMeta } from '../utils/themeStyles';

export default function ModulesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = getThemeMeta(user?.theme);

  const [concepts, setConcepts] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [cRes, pRes] = await Promise.all([
          api.get('/concepts'),
          api.get(`/progress/user/${user._id}`)
        ]);
        setConcepts(cRes.data);
        const map = pRes.data.reduce((acc, p) => {
          acc[p.conceptId._id] = p;
          return acc;
        }, {});
        setProgressMap(map);
      } catch (err) {
        console.error('Failed to load modules:', err);
        if (!err.response) {
          // The request never reached the server at all.
          setError('Could not reach the backend. Is it running? (expected at http://localhost:5000 — check the terminal running `npm run dev:backend`)');
        } else if (err.response.status === 401 || err.response.status === 403) {
          setError('Your session looks invalid. Try logging out and back in.');
        } else {
          setError(`Could not load your modules (${err.response.status}: ${err.response.data?.message || 'server error'}). If this just started happening, make sure MongoDB is running and seeded: npm run seed:concepts`);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user._id]);

  // Selecting a topic hands off to ConceptPage, which runs the full
  // AI-Powered Python Discovery Learning workflow for that concept.
  const handleSelectTopic = (topic) => {
    navigate(`/concept/${topic._id}`);
  };

  const completedCount = concepts.filter(c => progressMap[c._id]?.completed).length;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 font-sans">
      <Navbar />
      <div className="flex">
        <Sidebar
          concepts={concepts}
          progressMap={progressMap}
          onSelectTopic={handleSelectTopic}
        />

        <main className="flex-1 min-h-[calc(100vh-4rem)] p-8 overflow-y-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Modules</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {completedCount} of {concepts.length || 0} subjects completed — pick one to continue.
            </p>
          </header>

          {loading && (
            <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 animate-pulse">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-24 mb-6" />
              <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-xl w-64 mb-4" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-full" />
            </div>
          )}

          {!loading && error && (
            <div className="bg-white dark:bg-gray-900 p-10 rounded-[2rem] border border-red-100 dark:border-red-900/40 text-center">
              <p className="text-red-500 font-medium mb-2">{error}</p>
              <p className="text-sm text-gray-400">
                Run <code className="font-mono">npm run seed</code> and <code className="font-mono">npm run seed:challenges</code> in the backend, and make sure MongoDB is running.
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {concepts.map((topic) => {
                const isCompleted = !!progressMap[topic._id]?.completed;
                const prev = concepts.find(c => c.order === topic.order - 1);
                const isLocked = user.learningMode === 'guided' && topic.order > 1 && prev && !progressMap[prev._id]?.completed;

                return (
                  <button
                    key={topic._id}
                    disabled={isLocked}
                    onClick={() => handleSelectTopic(topic)}
                    className={`group text-left p-6 rounded-[1.5rem] border-2 bg-white dark:bg-gray-900 shadow-sm transition-all ${
                      isLocked
                        ? 'border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed'
                        : 'border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white shadow-sm`}>
                        <ConceptIcon name={topic.icon} size={20} />
                      </div>
                      {isCompleted && <CheckCircle2 size={18} className="text-success" />}
                      {isLocked && <Lock size={16} className="text-gray-400" />}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{topic.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{topic.description}</p>
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
