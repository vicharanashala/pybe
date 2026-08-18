import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Brain, Moon, Sun } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const body = { username, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        login(data.token, data.user);
        navigate(data.user.role === 'ADMIN' ? '/admin' : '/');
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-secondary)' }}>

      <header style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={24} color="#fff" />
          </div>
          <strong style={{ fontSize: '1.25rem', color: 'var(--text)' }}>PyBe</strong>
        </div>
        <button onClick={toggleTheme} style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '8px' }} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div className="panel" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem 2rem' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-dim)' }}>
              {isLogin ? 'Sign in to continue your learning journey' : 'Sign up to start mastering Python'}
            </p>
          </div>

          {error && (
            <div style={{
              color: error.includes('successful') ? 'var(--success)' : 'var(--error)',
              marginBottom: '1.5rem',
              padding: '0.75rem 1rem',
              background: error.includes('successful') ? 'var(--success-bg)' : 'var(--error-bg)',
              borderRadius: '8px',
              border: `1px solid ${error.includes('successful') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              fontSize: '0.95rem',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 500, color: 'var(--text)' }}>
              Username
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 500, color: 'var(--text)' }}>
              Password
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </label>

            {!isLogin && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 500, color: 'var(--text)' }}>
                Role
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="STUDENT">Student</option>
                  {/* <option value="ADMIN">Admin</option> */}
                </select>
              </label>
            )}

            <button type="submit" className="primary" style={{ marginTop: '0.5rem', width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-dim)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
