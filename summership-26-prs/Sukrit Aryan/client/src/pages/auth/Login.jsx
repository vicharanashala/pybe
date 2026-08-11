import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import PublicNavbar from '../../components/PublicNavbar.jsx';
import { gsap } from 'gsap';
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cardRef  = useRef(null);
  const logoRef  = useRef(null);

  useEffect(() => {
    if (user) { navigate(from, { replace: true }); return; }
    const tl = gsap.timeline();
    if (logoRef.current) tl.from(logoRef.current, { y: -20, opacity: 0, duration: 0.5, ease: 'power2.out' });
    if (cardRef.current) tl.from(cardRef.current, { y: 30, opacity: 0, duration: 0.55, ease: 'power3.out' }, '-=0.2');
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      gsap.from(cardRef.current, { x: -8, duration: 0.06, repeat: 4, yoyo: true, ease: 'none' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <PublicNavbar />

      <div className="aurora-blob aurora-blob--1" style={{ width: 400, height: 400, top: -100, left: -100 }} />
      <div className="aurora-blob aurora-blob--2" style={{ width: 300, height: 300, bottom: -50, right: -50 }} />

      <div className="auth-card" ref={cardRef}>
        <div className="auth-brand-badge">
          <Sparkles size={13} /> Student Portal
        </div>

        <h2>Welcome Back</h2>
        <p className="auth-card__sub">Sign in to continue your Python discovery journey</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            id="login-btn"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup">Create one free</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: calc(var(--navbar-h) + 24px) 24px 40px;
          position: relative; overflow: hidden;
        }
        .auth-brand-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--accent);
          background: var(--accent-glow); border: 1px solid var(--border-accent);
          padding: 4px 12px; border-radius: 20px; margin-bottom: 16px;
        }
        .auth-card {
          width: 100%; max-width: 420px;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: 20px; padding: 36px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: var(--shadow-lg); z-index: 1;
        }
        [data-theme="light"] .auth-card {
          background: rgba(255, 255, 255, 0.92);
        }
        .auth-card h2 { font-size: 1.65rem; font-weight: 800; margin-bottom: 6px; color: var(--text-primary); }
        .auth-card__sub { font-size: 0.875rem; color: var(--text-muted); margin: 0 0 24px; }
        .auth-error {
          background: rgba(244,114,182,0.12); border: 1px solid rgba(244,114,182,0.3);
          color: #E11D48; border-radius: 10px; padding: 12px 16px;
          font-size: 0.85rem; margin-bottom: 20px; font-weight: 500;
        }
        .auth-form { display: flex; flex-direction: column; gap: 18px; }
        .auth-field { display: flex; flex-direction: column; gap: 7px; }
        .auth-field label { font-size: 0.83rem; font-weight: 600; color: var(--text-secondary); }
        .auth-input-wrap { position: relative; display: flex; align-items: center; }
        .auth-input-icon { position: absolute; left: 14px; color: var(--text-muted); pointer-events: none; }
        .auth-field input {
          width: 100%;
          background: var(--bg-elevated); border: 1px solid var(--border);
          border-radius: 10px; padding: 12px 16px 12px 42px; font-size: 0.95rem;
          color: var(--text-primary); transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-field input:focus {
          border-color: var(--accent-dim); box-shadow: 0 0 0 3px var(--accent-glow); outline: none;
        }
        .auth-submit {
          margin-top: 6px; padding: 14px;
          background: var(--accent); color: #0D1117;
          border: none; border-radius: 10px;
          font-size: 0.95rem; font-weight: 700; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px;
        }
        [data-theme="light"] .auth-submit { color: #ffffff; background: #15803D; }
        .auth-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-glow); }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #ffffff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        .auth-switch { text-align: center; margin: 24px 0 0; font-size: 0.85rem; color: var(--text-muted); }
        .auth-switch a { color: var(--accent); font-weight: 600; text-decoration: none; }
        .auth-switch a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
