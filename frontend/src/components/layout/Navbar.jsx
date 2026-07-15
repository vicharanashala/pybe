import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={30} />
            <span className="font-black text-2xl text-gray-900 tracking-tight">PyBe</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(d => !d)}
              className="btn-ghost text-lg"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
                <button onClick={handleLogout} className="btn-secondary text-sm">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/register" className="btn-primary">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
