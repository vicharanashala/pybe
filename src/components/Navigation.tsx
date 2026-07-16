import { UserProgress, LearningLevel, LearningLevel as LevelType } from '../types';
import { CORE_INTERESTS } from '../predefinedData';
import { BookOpen, Gamepad2, BrainCircuit, Code, Terminal, Trophy, Hammer, Settings, Menu, X, HelpCircle, Users, LogOut, CloudLightning, Sword, Compass, FileText } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  progress: UserProgress;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  selectedScenario: string;
  onSelectScenario: (scenario: string) => void;
  selectedLevel: LearningLevel;
  onSelectLevel: (level: LearningLevel) => void;
  user: { id: string; name: string; email: string; profile_picture: string | null } | null;
  authMode: 'guest' | 'logged-in' | null;
  onLogout?: () => void;
}

export default function Navigation({
  progress,
  activeTab,
  onSelectTab,
  selectedScenario,
  onSelectScenario,
  selectedLevel,
  onSelectLevel,
  user,
  authMode,
  onLogout
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeScenarioObj = CORE_INTERESTS.find((i) => i.id === selectedScenario) || CORE_INTERESTS[0];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Trophy },
    { id: 'journey', label: 'Coding Journey', icon: Compass },
    { id: 'cheatsheet', label: 'Python Cheat Sheet', icon: FileText },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'chat', label: 'AI Tutor Chat', icon: HelpCircle },
    { id: 'peers', label: 'Peer Forum', icon: Users },
    { id: 'live-quiz', label: 'Live Quiz Arena', icon: Sword },
    { id: 'games', label: 'Mini Games', icon: Gamepad2 },
    { id: 'projects', label: 'Project Builder', icon: Hammer },
    { id: 'quizzes', label: 'Testing Panel', icon: BrainCircuit },
    { id: 'playground', label: 'Sandbox Editor', icon: Code },
    { id: 'admin', label: 'Admin Panel/Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white/95 border-b border-sky-100 sticky top-0 z-50 text-slate-800 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl shadow-md">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Pybe
              </span>
              <span className="hidden sm:inline-block text-[9px] text-blue-700 uppercase tracking-widest font-black sm:ml-2.5 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md">
                Interactive Game Suite
              </span>
            </div>
          </div>

          {/* Scenario & Difficulty Selectors (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Interest Scenario Select */}
            <div className="flex items-center bg-slate-50 px-3.5 py-1.5 rounded-xl border border-sky-100 text-xs shadow-inner">
              <span className="text-slate-500 font-bold mr-2">Scenario:</span>
              <select
                value={selectedScenario}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="bg-transparent text-blue-700 font-extrabold focus:outline-none cursor-pointer hover:text-blue-600 transition-colors"
              >
                {CORE_INTERESTS.map((interest) => (
                  <option key={interest.id} value={interest.id} className="bg-white text-slate-800 font-semibold">
                    {interest.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Learning Difficulty Switcher */}
            <div className="flex items-center bg-slate-50 px-3.5 py-1.5 rounded-xl border border-sky-100 text-xs shadow-inner">
              <span className="text-slate-500 font-bold mr-2">Difficulty:</span>
              <select
                value={selectedLevel}
                onChange={(e) => onSelectLevel(e.target.value as LevelType)}
                className="bg-transparent text-amber-600 font-extrabold focus:outline-none cursor-pointer capitalize hover:text-amber-500 transition-colors"
              >
                <option value="beginner" className="bg-white text-slate-800 font-semibold">Beginner</option>
                <option value="intermediate" className="bg-white text-slate-800 font-semibold">Intermediate</option>
                <option value="advanced" className="bg-white text-slate-800 font-semibold">Advanced</option>
                <option value="expert" className="bg-white text-slate-800 font-semibold">Expert</option>
              </select>
            </div>
          </div>

          {/* Profile Quick Stats */}
          <div className="hidden md:flex items-center gap-4">
            {/* User Details & Sync badge */}
            <div className="text-right">
              <div className="text-xs font-black text-slate-800 flex items-center justify-end gap-1">
                {user?.name || 'Guest Learner'}
                {authMode === 'logged-in' && (
                  <CloudLightning className="h-3 w-3 text-blue-500 fill-current" />
                )}
              </div>
              <div className="text-[10px] text-blue-600 font-extrabold tracking-wide">{progress.xp} XP • {progress.streak} Day Streak</div>
            </div>
            
            {/* Avatar image / default emoji */}
            <div 
              onClick={() => onSelectTab('admin')}
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-extrabold text-sm shadow-sm cursor-pointer overflow-hidden border border-slate-100 hover:scale-105 transition"
              title="Click to view Settings / Profile"
            >
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{progress.streak > 0 ? '🔥' : '🎓'}</span>
              )}
            </div>

            {authMode === 'logged-in' && onLogout && (
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Tabs */}
      <div className="hidden md:block bg-slate-50 border-t border-sky-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1.5 py-2">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow shadow-blue-500/25'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                >
                  <IconComp className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-sky-100 p-4 space-y-4 shadow-inner">
          {/* Quick Stats */}
          <div className="bg-sky-50 p-3.5 rounded-xl border border-sky-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase() || '🎓'}</span>
                )}
              </div>
              <div>
                <div className="text-xs font-black text-slate-800">{user?.name || 'Guest Learner'}</div>
                <div className="text-[10px] text-slate-500 font-bold capitalize">{selectedLevel} • {activeScenarioObj.label}</div>
              </div>
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-md text-[10px] font-black text-blue-700">
              {progress.xp} XP
            </div>
          </div>

          {/* Core selectors for Mobile */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1">Scenario Interest</label>
              <select
                value={selectedScenario}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="w-full bg-white border border-sky-100 text-slate-850 px-2 py-1.5 rounded-lg font-bold outline-none cursor-pointer"
              >
                {CORE_INTERESTS.map((i) => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1">Concept Difficulty</label>
              <select
                value={selectedLevel}
                onChange={(e) => onSelectLevel(e.target.value as LevelType)}
                className="w-full bg-white border border-sky-100 text-slate-850 px-2 py-1.5 rounded-lg font-bold capitalize outline-none cursor-pointer"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {authMode === 'logged-in' && onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-black transition-all cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
