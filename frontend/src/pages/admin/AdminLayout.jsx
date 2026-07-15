import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ListChecks, BarChart3, ScrollText, MessageSquareText, LogOut, ShieldCheck } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/questions', label: 'Questions', icon: ListChecks },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/logs', label: 'Login Logs', icon: ScrollText },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquareText },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar — intentionally distinct (dark slate) from the learner UI */}
      <aside className="w-64 shrink-0 bg-slate-900 text-slate-200 flex flex-col">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800">
          <ShieldCheck size={22} className="text-brand-400" />
          <span className="font-black text-lg tracking-tight text-white">PyBe Admin</span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-2 truncate">Signed in as<br /><span className="text-slate-300 font-medium">{user?.name}</span></p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
