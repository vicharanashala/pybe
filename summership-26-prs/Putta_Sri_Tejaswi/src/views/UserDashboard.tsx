import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard } from '../components/Ornaments';
import { WelcomeView } from './WelcomeView';
import { 
  LayoutDashboard, BookOpen, Bug, Code, Zap, 
  Trophy, Settings, ArrowRight, Clock, Star,
  TrendingUp, Flame, Menu, X, Sparkles,
  Layers, Grid3x3, ClipboardList, Medal, BarChart3,
  Bell, ChevronDown
} from 'lucide-react';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'story-library', label: 'Story Library', icon: BookOpen },
  { id: 'all-levels', label: 'All Levels', icon: Layers },
  { id: 'all-concepts', label: 'All Concepts', icon: Grid3x3 },
  { id: 'python-mysteries', label: 'Python Mysteries', icon: Sparkles },
  { id: 'error-detective', label: 'Error Detective', icon: Bug },
  { id: 'practice-zone', label: 'Practice Zone', icon: Code },
  { id: 'daily-challenge', label: 'Daily Challenge', icon: Zap },
  { id: 'detective-notebook', label: 'Detective Notebook', icon: ClipboardList },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const pageTitles: Record<string, string> = {
  'dashboard': 'Dashboard',
  'story-library': 'Story Library',
  'all-levels': 'All Levels',
  'all-concepts': 'All Concepts',
  'python-mysteries': 'Python Mysteries',
  'error-detective': 'Error Detective',
  'practice-zone': 'Practice Zone',
  'daily-challenge': 'Daily Challenge',
  'detective-notebook': 'Detective Notebook',
  'achievements': 'Achievements',
  'leaderboard': 'Leaderboard',
  'settings': 'Settings',
};

const mockRecentActivity = [
  { id: 1, action: 'Completed Variables', topic: 'Python Basics', time: '2 hours ago', icon: '📖' },
  { id: 2, action: 'Solved 5 Bugs', topic: 'Error Detective', time: '3 hours ago', icon: '🐞' },
  { id: 3, action: 'Earned 50 XP', topic: 'Practice Zone', time: '5 hours ago', icon: '⭐' },
  { id: 4, action: 'Daily Streak', topic: '5 Days in a row', time: '1 day ago', icon: '🔥' },
  { id: 5, action: 'Unlocked Card', topic: 'Sage Birbal', time: '2 days ago', icon: '🃏' },
];

export const UserDashboard: React.FC = () => {
  const { setStep, completedTopics } = useProgress();
  const [activeNav, setActiveNav] = useState('python-mysteries');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setSidebarOpen(false);
  };

  const xpEarned = completedTopics.length * 150;
  const xpToNext = 900;
  const xpPercent = Math.min((xpEarned / xpToNext) * 100, 100);

  const renderMainContent = () => {
    if (activeNav === 'python-mysteries') {
      return (
        <div className="animate-fade-in -mt-4">
          <div className="max-w-3xl mx-auto scale-[0.92] origin-top">
            <WelcomeView onBeginChronicle={() => { setStep(1); window.history.pushState({}, '', '/'); window.dispatchEvent(new Event('pybe-route-change')); }} />
          </div>
        </div>
      );
    }

    if (activeNav === 'dashboard') {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl" aria-hidden="true">👋</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-royal-indigo dark:text-white">
                  Welcome Back
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Continue your Python learning journey.
                </p>
              </div>
            </div>
          </div>

          <ManuscriptCard className="w-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Continue Learning</p>
                <h2 className="text-lg font-serif font-bold text-royal-indigo dark:text-white">
                  Python Variables
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Story: The Royal Treasury
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal-crimson hover:bg-royal-crimsonHover text-white transition-all duration-300 text-sm font-semibold shadow-md"
              >
                <span>Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ManuscriptCard>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ManuscriptCard className="w-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-royal-crimson/10 dark:bg-royal-gold/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-royal-crimson dark:text-royal-gold" />
                </div>
                <div>
                  <p className="text-2xl font-mono font-bold text-royal-indigo dark:text-white">1 / 21</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stories</p>
                </div>
              </div>
            </ManuscriptCard>

            <ManuscriptCard className="w-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-royal-gold/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-royal-gold" />
                </div>
                <div>
                  <p className="text-2xl font-mono font-bold text-royal-indigo dark:text-white">120 XP</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">XP Earned</p>
                </div>
              </div>
            </ManuscriptCard>

            <ManuscriptCard className="w-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-mono font-bold text-royal-indigo dark:text-white">5 Days</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Streak</p>
                </div>
              </div>
            </ManuscriptCard>
          </div>

          <ManuscriptCard className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-royal-crimson dark:text-royal-gold" />
              <h2 className="text-lg font-serif font-bold text-royal-indigo dark:text-white">Overall Progress</h2>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-300">Stories Completed</span>
              <span className="text-xs font-mono font-semibold text-royal-crimson dark:text-royal-gold">45%</span>
            </div>
            <div className="w-full h-3 bg-parchment-border dark:bg-parchment-darkBorder rounded-full overflow-hidden">
              <div className="h-full bg-royal-gold rounded-full transition-all duration-500" style={{ width: '45%' }} />
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">1 of 21 stories completed</p>
          </ManuscriptCard>

          <ManuscriptCard className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-royal-crimson dark:text-royal-gold" />
              <h2 className="text-lg font-serif font-bold text-royal-indigo dark:text-white">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-parchment-darkCard/40 border border-parchment-border dark:border-parchment-darkBorder transition-all duration-300 hover:-translate-y-0.5">
                  <span className="text-lg" aria-hidden="true">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-serif font-bold text-royal-indigo dark:text-white truncate">{activity.action}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{activity.topic}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 flex-shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </ManuscriptCard>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <ManuscriptCard className="w-full text-center">
          <p className="text-lg font-serif font-bold text-royal-indigo dark:text-white mb-2">{pageTitles[activeNav]}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">This feature is coming soon.</p>
        </ManuscriptCard>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-parchment-light dark:bg-parchment-dark">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-parchment-card dark:bg-parchment-darkCard border border-parchment-border dark:border-parchment-darkBorder shadow-md"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          <X className="w-5 h-5 text-royal-indigo dark:text-white" />
        ) : (
          <Menu className="w-5 h-5 text-royal-indigo dark:text-white" />
        )}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-parchment-card dark:bg-parchment-darkCard border-r border-parchment-border dark:border-parchment-darkBorder z-40 transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-parchment-border dark:border-parchment-darkBorder">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-royal-crimson flex items-center justify-center shadow-lg border border-royal-gold/40">
              <span className="text-white font-serif text-xl font-bold italic">Py</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-serif font-bold text-royal-crimson dark:text-royal-gold tracking-wide">
                PyBe
              </h1>
            </div>
            <button className="text-gray-400 hover:text-royal-crimson dark:hover:text-royal-gold transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Dashboard navigation">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-royal-indigo dark:bg-royal-crimson text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-parchment-border dark:hover:bg-parchment-darkBorder hover:text-royal-crimson dark:hover:text-royal-gold'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Detective Level Card */}
        <div className="p-4">
          <div className="p-4 rounded-xl bg-royal-indigo dark:bg-royal-crimson text-white">
            <div className="flex items-center gap-2 mb-2">
              <Medal className="w-4 h-4 text-royal-gold" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-300">Detective Level</span>
            </div>
            <p className="text-2xl font-serif font-bold text-royal-gold mb-1">Level 5</p>
            <p className="text-[10px] text-gray-300 mb-2">{xpEarned} / {xpToNext} XP</p>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-royal-gold rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-parchment-light/80 dark:bg-parchment-dark/80 backdrop-blur-md border-b border-parchment-border dark:border-parchment-darkBorder">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-500 dark:text-gray-400"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-serif font-bold text-royal-indigo dark:text-white">
                {pageTitles[activeNav]}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-royal-crimson dark:hover:text-royal-gold transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-royal-crimson rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-royal-crimson to-royal-gold flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <span className="text-sm font-semibold text-royal-indigo dark:text-white hidden sm:block">Learner</span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};
