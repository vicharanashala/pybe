import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StickyNote, Pencil, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/layout/Navbar';
import { ConceptIcon } from '../utils/conceptIcons';

// Matches the key format used by LessonRightRail.jsx:
//   scopeKey = `${user._id}_${concept.slug || concept._id}`
//   noteStoreKey = `pybe_note_${scopeKey}`
function buildPrefix(userId) {
  return `pybe_note_${userId}_`;
}

function readAllNotes(userId) {
  const prefix = buildPrefix(userId);
  const notes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(prefix)) continue;
    const text = localStorage.getItem(key) || '';
    if (!text.trim()) continue; // skip empty saved notes
    notes.push({ key, identifier: key.slice(prefix.length), text });
  }
  return notes;
}

export default function NotesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [concepts, setConcepts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [draft, setDraft] = useState('');

  const refreshNotes = useCallback(() => {
    setNotes(readAllNotes(user._id));
  }, [user._id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/concepts');
        setConcepts(res.data);
      } catch {
        setConcepts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    refreshNotes();
  }, [refreshNotes]);

  // Match each stored note back to its concept (by slug, falling back to _id)
  const matchConcept = (identifier) =>
    concepts.find(c => c.slug === identifier || c._id === identifier);

  const startEdit = (note) => {
    setEditingKey(note.key);
    setDraft(note.text);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setDraft('');
  };

  const saveEdit = (key) => {
    try { localStorage.setItem(key, draft); } catch {}
    setEditingKey(null);
    setDraft('');
    refreshNotes();
  };

  const deleteNote = (key) => {
    try { localStorage.removeItem(key); } catch {}
    if (editingKey === key) cancelEdit();
    refreshNotes();
  };

  // Group by concept order so components appear in the same order as the course
  const enriched = notes
    .map(n => ({ ...n, concept: matchConcept(n.identifier) }))
    .sort((a, b) => (a.concept?.order ?? 999) - (b.concept?.order ?? 999));

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft size={15} /> Back to dashboard
        </button>

        <header className="mb-8 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <StickyNote size={20} className="text-amber-600 dark:text-amber-300" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Your Notes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Saved while studying, one card per subject.
            </p>
          </div>
        </header>

        {loading && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-32 mb-4" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-full" />
          </div>
        )}

        {!loading && enriched.length === 0 && (
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-1">No notes saved yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Open any module and use the Notes panel on the right while you study — it'll show up here.
            </p>
            <button onClick={() => navigate('/modules')} className="btn-primary mt-6">
              Go to Modules →
            </button>
          </div>
        )}

        {!loading && enriched.length > 0 && (
          <div className="grid gap-4">
            {enriched.map((note) => {
              const isEditing = editingKey === note.key;
              const title = note.concept?.title || 'Untitled subject';

              return (
                <div
                  key={note.key}
                  className="bg-white dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <ConceptIcon name={note.concept?.icon} size={18} className="text-brand-500" />
                      <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {!isEditing ? (
                        <button
                          onClick={() => startEdit(note)}
                          title="Edit note"
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => saveEdit(note.key)}
                            title="Save"
                            className="w-8 h-8 rounded-lg bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition-colors"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            title="Cancel"
                            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteNote(note.key)}
                        title="Delete note"
                        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      {note.concept && (
                        <button
                          onClick={() => navigate(`/concept/${note.concept._id}`)}
                          className="ml-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline whitespace-nowrap"
                        >
                          Open module →
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full h-40 p-3 text-sm resize-y input font-normal leading-relaxed"
                    />
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {note.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
