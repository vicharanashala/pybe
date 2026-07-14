import { CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConceptIcon } from '../../utils/conceptIcons';

export default function Sidebar({ concepts = [], progressMap = {}, selectedTopic, onSelectTopic }) {
  const { user } = useAuth();
  const learningMode = user?.learningMode || 'explore';

  return (
    <aside className="w-[25%] min-w-[280px] shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-gray-100 bg-white py-6 custom-scrollbar">
      <div className="px-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Python Tutorial</h2>
      </div>

      {concepts.length === 0 ? (
        <p className="px-6 text-sm text-gray-400 leading-relaxed">
          No concepts yet — run <code className="font-mono">npm run seed</code> in the backend.
        </p>
      ) : (
        <ul className="space-y-0.5">
          {concepts.map((topic, index) => {
            const isCompleted = !!progressMap[topic._id]?.completed;
            const prev = concepts.find(c => c.order === topic.order - 1);
            const isLocked = learningMode === 'guided' && topic.order > 1 && prev && !progressMap[prev._id]?.completed;
            const isActive = selectedTopic?._id === topic._id;

            return (
              <li key={topic._id}>
                <button
                  disabled={isLocked}
                  onClick={() => onSelectTopic(topic)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 border-r-4 border-brand-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <ConceptIcon name={topic.icon} size={16} className="shrink-0" />
                    {topic.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {isCompleted && <CheckCircle2 size={16} className="text-success" />}
                    {isLocked && <Lock size={14} className="text-gray-400" />}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}


