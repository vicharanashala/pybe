import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const userData = res.data;
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const userData = res.data;
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  const completeOnboarding = async (theme, learningGoal, pythonLevel, learningMode) => {
    const res = await api.put('/auth/onboarding', { theme, learningGoal, pythonLevel, learningMode });
    updateUser(res.data);
    return res.data;
  };

  // Standalone theme switch, usable any time after onboarding (e.g. from
  // the Dashboard) — deliberately its own call, not a wrapper around
  // completeOnboarding, so it can never touch learningGoal/pythonLevel/
  // learningMode or reset onboardingComplete. Doesn't touch progress
  // either — progress is tracked per concept, not per theme.
  const changeTheme = async (theme) => {
    const res = await api.patch('/auth/theme', { theme });
    updateUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, completeOnboarding, changeTheme, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
