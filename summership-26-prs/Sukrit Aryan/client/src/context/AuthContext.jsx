import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'pybe_user';
const PROGRESS_KEY = 'pybe_progress';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  function signup({ name, email, password }) {
    const existing = getAllUsers();
    if (existing.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // not encrypted — prototype only
      createdAt: new Date().toISOString(),
      avatar: name.charAt(0).toUpperCase(),
    };
    const updated = [...existing, newUser];
    localStorage.setItem('pybe_all_users', JSON.stringify(updated));
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }

  function login({ email, password }) {
    const existing = getAllUsers();
    const found = existing.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Incorrect email or password. Please try again.');
    const { password: _, ...safeUser } = found;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  // Progress management
  function getProgress() {
    try {
      if (!user) return {};
      const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
      return all[user.id] || {};
    } catch { return {}; }
  }

  function markChapterComplete(chapterId) {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    if (!all[user.id]) all[user.id] = {};
    all[user.id][chapterId] = {
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  }

  function getChapterStatus(chapterId) {
    const progress = getProgress();
    return progress[chapterId]?.status || 'not-started';
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signup,
      login,
      logout,
      getProgress,
      markChapterComplete,
      getChapterStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function getAllUsers() {
  try {
    return JSON.parse(localStorage.getItem('pybe_all_users') || '[]');
  } catch { return []; }
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
