import api from '../../utils/api';

// The practice backend just wants an opaque `userId` string to key progress
// by — we pass through the real, logged-in PYBE user's _id instead of
// generating a separate anonymous id, so practice progress is tied to the
// same account as everything else in the app.
function getUserId() {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    return JSON.parse(stored)?._id || null;
  } catch {
    return null;
  }
}

export const practiceApi = {
  getTopics: () =>
    api.get(`/practice/topics`, { params: { userId: getUserId() } }).then((r) => r.data),

  getTopicProblems: (topic) =>
    api.get(`/practice/problems/topic/${encodeURIComponent(topic)}`, { params: { userId: getUserId() } })
      .then((r) => r.data),

  getProblem: (slug) =>
    api.get(`/practice/problems/${encodeURIComponent(slug)}`, { params: { userId: getUserId() } })
      .then((r) => r.data),

  runCode: (slug, code) =>
    api.post(`/practice/execute`, { slug, code, mode: 'run', userId: getUserId() }).then((r) => r.data),

  submitCode: (slug, code) =>
    api.post(`/practice/execute`, { slug, code, mode: 'submit', userId: getUserId() }).then((r) => r.data),

  saveDraft: (slug, code) =>
    api.put(`/practice/progress/draft`, { slug, code, userId: getUserId() }).then((r) => r.data),

  getSummary: () =>
    api.get(`/practice/progress/summary`, { params: { userId: getUserId() } }).then((r) => r.data),
};
