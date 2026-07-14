import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, StickyNote, Code2, Map, Compass, Rocket, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { getThemeMeta, THEME_META } from '../utils/themeStyles';

export default function DashboardPage() {
  const { user, changeTheme } = useAuth();
  const navigate = useNavigate();
  const theme = getThemeMeta(user?.theme);
  const ModeIcon = user?.learningMode === 'guided' ? Map : Compass;

  const [switchingTo, setSwitchingTo] = useState(null);
  const [themeError, setThemeError] = useState('');

  const handleThemeSwitch = async (themeKey) => {
    if (themeKey === user?.theme || switchingTo) return;
    setSwitchingTo(themeKey);
    setThemeError('');
    try {
      await changeTheme(themeKey);
      // Nothing else to do — ThemeSync repaints the whole app the moment
      // user.theme changes, and progress is tracked per concept, not per
      // theme, so there's nothing here that could reset or affect it.
    } catch (err) {
      setThemeError("Couldn't switch themes right now — please try again.");
    } finally {
      setSwitchingTo(null);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-14">
        {/* User info */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
            Hey {user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {user?.email}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300 border border-brand-100 dark:border-brand-800">
              <ModeIcon size={12} /> {user?.learningMode === 'guided' ? 'Guided Tour' : 'Explore Freely'}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800">
              <Rocket size={12} /> {user?.pythonLevel || 'Intermediate'}
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${theme.gradient} shadow-sm ${theme.glow}`}>
              <theme.icon size={12} /> {theme.label}
            </span>
          </div>
        </div>

        {/* Theme switcher — change your world any time, progress is untouched */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            Your world
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            {Object.entries(THEME_META).map(([key, meta]) => {
              const isActive = user?.theme === key;
              const isSwitching = switchingTo === key;
              return (
                <button
                  key={key}
                  onClick={() => handleThemeSwitch(key)}
                  disabled={!!switchingTo}
                  title={meta.label}
                  className={`group relative flex flex-col items-center gap-1.5 transition-opacity ${switchingTo && !isSwitching ? 'opacity-40' : ''}`}
                >
                  <span
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${meta.iconBg} ${
                      isActive
                        ? `ring-2 ring-offset-2 dark:ring-offset-gray-950 ${meta.ring.replace('/30', '')}`
                        : 'group-hover:scale-105'
                    }`}
                  >
                    {isSwitching ? (
                      <span className={`w-4 h-4 rounded-full border-2 border-current ${meta.accentText} border-t-transparent animate-spin`} />
                    ) : (
                      <meta.icon size={22} className={meta.accentText} />
                    )}
                  </span>
                  {isActive && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${meta.gradient} shadow-sm`}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">{meta.label}</span>
                </button>
              );
            })}
          </div>
          {themeError && <p className="text-xs text-red-500 mt-2">{themeError}</p>}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/modules')}
            className="group text-left p-8 rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <BookOpen size={26} className="text-brand-600 dark:text-brand-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">Modules</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Browse every subject and pick up your learning scenarios.
            </p>
          </button>

          <button
            onClick={() => navigate('/practice')}
            className="group text-left p-8 rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-700 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Code2 size={26} className="text-violet-600 dark:text-violet-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">Practice Questions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              LeetCode-style Python problems, organized by topic.
            </p>
          </button>

          <button
            onClick={() => navigate('/notes')}
            className="group text-left p-8 rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <StickyNote size={26} className="text-amber-600 dark:text-amber-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">Notes</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Everything you've saved while studying, organized by topic.
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}
