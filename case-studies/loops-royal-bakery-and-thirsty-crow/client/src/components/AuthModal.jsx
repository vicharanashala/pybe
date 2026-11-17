import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import api from '../lib/api';
import { X, LogIn, UserPlus, AlertTriangle } from 'lucide-react';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAppStore((s) => s.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { email, password, name };
      const { data } = await api.post(endpoint, payload);

      if (data.success) {
        setAuth({ token: data.token, user: data.user });
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="python-sandbox-overlay" onClick={onClose}>
      <div className="python-sandbox" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', height: 'auto' }}>
        <div className="sandbox-header">
          <div className="sandbox-header-left">
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            <strong>{isLogin ? 'Login to PyBe' : 'Create an Account'}</strong>
          </div>
          <button className="sandbox-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sandbox-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {error && (
            <div className="error-banner">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              Name
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', color: '#000' }}
              />
            </label>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', color: '#000' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', color: '#000' }}
            />
          </label>

          <button type="submit" className="primary" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
          
          <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
