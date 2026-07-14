import { useState } from 'react';
import { ThumbsUp, ThumbsDown, PartyPopper, HeartHandshake } from 'lucide-react';
import api from '../../utils/api';

export default function FeedbackWidget({ conceptId }) {
  const [choice, setChoice] = useState(null);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const pick = (helpful) => {
    if (submitted || loading) return;
    setChoice(helpful);
    setShowComment(true);
  };

  const submit = async () => {
    if (submitted || loading || choice === null) return;
    setLoading(true);
    try {
      await api.post('/feedback', { conceptId, helpful: choice, comment: comment.trim() });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card p-5 text-center">
        <div className="flex justify-center mb-1 text-brand-500">
          {choice ? <PartyPopper size={24} /> : <HeartHandshake size={24} />}
        </div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {choice ? 'Glad it helped!' : 'Thanks for the feedback — we\'ll improve.'}
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center mb-4">
        Did this lesson help you?
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => pick(true)}
          disabled={loading}
          className={`flex flex-col items-center gap-1.5 group ${choice === true ? 'scale-110' : ''}`}
        >
          <span className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:text-emerald-600 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:scale-110 transition-all">
            <ThumbsUp size={18} />
          </span>
          <span className="text-xs font-medium text-gray-500 group-hover:text-emerald-600 transition-colors">Yes</span>
        </button>
        <button
          onClick={() => pick(false)}
          disabled={loading}
          className={`flex flex-col items-center gap-1.5 group ${choice === false ? 'scale-110' : ''}`}
        >
          <span className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:text-red-500 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:scale-110 transition-all">
            <ThumbsDown size={18} />
          </span>
          <span className="text-xs font-medium text-gray-500 group-hover:text-red-500 transition-colors">No</span>
        </button>
      </div>

      {showComment && (
        <div className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Anything specific? (optional)"
            className="w-full h-20 p-3 text-sm resize-none input"
          />
          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit feedback'}
          </button>
        </div>
      )}
    </div>
  );
}
