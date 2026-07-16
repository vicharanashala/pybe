import { useState, useEffect } from 'react';
import { UserProgress, LearningLevel } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import LessonViewer from './components/LessonViewer';
import CodingJourney from './components/CodingJourney';
import PythonCheatSheet from './components/PythonCheatSheet';
import TutorBot from './components/TutorBot';
import PeerHub from './components/PeerHub';
import GamePortal from './components/GamePortal';
import ProjectPortal from './components/ProjectPortal';
import Quizzes from './components/Quizzes';
import Playground from './components/Playground';
import AdminPanel from './components/AdminPanel';
import AuthScreen from './components/AuthScreen';
import LiveQuizArena from './components/LiveQuizArena';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Sparkles, CloudLightning, Terminal } from 'lucide-react';

const DEFAULT_PROGRESS: UserProgress = {
  selectedInterests: ['story'],
  level: 'beginner',
  xp: 0,
  streak: 1,
  lastActive: new Date().toISOString(),
  completedLessons: [],
  completedQuizzes: [],
  completedChallenges: [],
  completedProjects: [],
  badges: [],
  pasteProtectionEnabled: true,
  pasteAttempts: [],
  completedDailyProblems: [],
};

export default function App() {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pyverse_token'));
  const [authMode, setAuthMode] = useState<'guest' | 'logged-in' | null>(() => {
    return (localStorage.getItem('pyverse_authmode') as 'guest' | 'logged-in' | null) || null;
  });
  const [user, setUser] = useState<{ id: string; name: string; email: string; profile_picture: string | null } | null>(() => {
    const saved = localStorage.getItem('pyverse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Check if guest has a custom saved offline avatar
    const guestAvatar = localStorage.getItem('pyverse_guest_avatar');
    if (guestAvatar) {
      return { id: 'guest_id', name: 'Guest Learner', email: 'offline', profile_picture: guestAvatar };
    }
    return null;
  });

  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [migratingProgress, setMigratingProgress] = useState<any | null>(null);

  // User Progress state
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('pyverse_user_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PROGRESS, ...parsed };
      } catch (e) {
        return DEFAULT_PROGRESS;
      }
    }
    return DEFAULT_PROGRESS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedScenario, setSelectedScenario] = useState<string>(
    progress.selectedInterests?.[0] || 'story'
  );
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel>(
    progress.level || 'beginner'
  );

  // Synchronize state with local storage (for guest or offline backup)
  useEffect(() => {
    localStorage.setItem('pyverse_user_progress', JSON.stringify({
      ...progress,
      selectedInterests: [selectedScenario],
      level: selectedLevel
    }));
  }, [progress, selectedScenario, selectedLevel]);

  // Handle auto-fetching updated cloud data when logged-in
  useEffect(() => {
    if (token && authMode === 'logged-in') {
      fetch('/api/user/data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Token expired');
      })
      .then(data => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('pyverse_user', JSON.stringify(data.user));
        }
        if (data.progress) {
          const convertedProgress: UserProgress = {
            selectedInterests: [data.progress.selected_world || 'story'],
            level: data.progress.level || 'beginner',
            xp: data.progress.xp_points || 0,
            streak: data.progress.streak || 1,
            lastActive: data.progress.updated_at || new Date().toISOString(),
            completedLessons: data.progress.completed_lessons || [],
            completedQuizzes: data.progress.completedQuizzes || [],
            completedChallenges: data.progress.completedChallenges || [],
            completedProjects: data.progress.completedProjects || [],
            badges: data.progress.badges || [],
            pasteProtectionEnabled: data.progress.pasteProtectionEnabled ?? true,
            pasteAttempts: data.progress.pasteAttempts || [],
            completedDailyProblems: data.progress.completed_daily_problems || [],
          };
          setProgress(convertedProgress);
          
          // Greet user with their custom personalized dashboard message
          setWelcomeMessage(`Welcome back, ${data.user.name}! Your ${data.progress.selected_world || 'story'} adventure is waiting for you.`);
          setTimeout(() => setWelcomeMessage(null), 6000);
        }
      })
      .catch(err => {
        console.warn("Auto-login cloud sync failed or offline:", err);
      });
    }
  }, [token, authMode]);

  // Synchronize with database on any progress change if logged-in
  useEffect(() => {
    if (authMode === 'logged-in' && token) {
      const progressPayload = {
        selected_world: selectedScenario,
        level: selectedLevel,
        xp_points: progress.xp,
        streak: progress.streak,
        completed_lessons: progress.completedLessons,
        completedQuizzes: progress.completedQuizzes,
        completedChallenges: progress.completedChallenges,
        completedProjects: progress.completedProjects,
        badges: progress.badges,
        pasteProtectionEnabled: progress.pasteProtectionEnabled,
        pasteAttempts: progress.pasteAttempts,
        completed_daily_problems: progress.completedDailyProblems || []
      };

      // Read discussion topics to back them up as well
      let peerPosts = [];
      let peerReplies = [];
      try {
        const peerSaved = localStorage.getItem('pyverse_peer_threads');
        if (peerSaved) {
          const threads = JSON.parse(peerSaved);
          peerPosts = threads.map((t: any) => ({
            id: t.id,
            title: t.title,
            content: t.content,
            code: t.code,
            category: t.category,
            scenario: t.scenario,
            created_at: t.created_at || new Date().toISOString()
          }));
          peerReplies = threads.flatMap((t: any) => t.replies.map((r: any) => ({
            id: r.id,
            post_id: t.id,
            author_name: r.author_name,
            content: r.content,
            code: r.code,
            created_at: r.created_at || new Date().toISOString()
          })));
        }
      } catch (e) {
        console.error("Failed to parse threads during cloud backup:", e);
      }

      fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          progress: progressPayload,
          peerPosts,
          peerReplies
        })
      }).catch(err => {
        console.warn("Cloud sync request failed (likely offline):", err);
      });
    }
  }, [progress, selectedScenario, selectedLevel, authMode, token]);

  // Calculate & update streak
  useEffect(() => {
    const lastActiveDate = new Date(progress.lastActive);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      setProgress((prev) => ({
        ...prev,
        streak: prev.streak + 1,
        lastActive: today.toISOString(),
      }));
    } else if (diffDays > 1) {
      setProgress((prev) => ({
        ...prev,
        streak: 1,
        lastActive: today.toISOString(),
      }));
    } else if (progress.streak === 0) {
      setProgress((prev) => ({
        ...prev,
        streak: 1,
        lastActive: today.toISOString(),
      }));
    }
  }, []);

  const [prevCompletedLength, setPrevCompletedLength] = useState(progress.completedLessons.length);

  useEffect(() => {
    if (progress.completedLessons.length > prevCompletedLength) {
      const newLessonKey = progress.completedLessons[progress.completedLessons.length - 1];
      if (newLessonKey) {
        const parts = newLessonKey.split('_');
        if (parts.length >= 3) {
          const scenario = parts[0];
          const level = parts[1];
          const concept = parts.slice(2).join('_');
          
          const lastCompletedInfo = {
            id: newLessonKey,
            title: concept,
            scenario: scenario,
            level: level,
            date: new Date().toLocaleDateString()
          };
          localStorage.setItem('pyverse_last_completed_lesson', JSON.stringify(lastCompletedInfo));
        }
      }
      setPrevCompletedLength(progress.completedLessons.length);
    } else if (progress.completedLessons.length < prevCompletedLength) {
      setPrevCompletedLength(progress.completedLessons.length);
    }
  }, [progress.completedLessons, prevCompletedLength]);

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    setSelectedScenario('story');
    setSelectedLevel('beginner');
    setActiveTab('dashboard');
  };

  const handleLoginSuccess = (data: any, receivedToken: string, isRememberMe: boolean, migratingData?: any) => {
    setToken(receivedToken);
    setUser(data.user);
    setAuthMode('logged-in');

    localStorage.setItem('pyverse_token', receivedToken);
    localStorage.setItem('pyverse_user', JSON.stringify(data.user));
    localStorage.setItem('pyverse_authmode', 'logged-in');

    if (data.progress) {
      const convertedProgress: UserProgress = {
        selectedInterests: [data.progress.selected_world || 'story'],
        level: data.progress.level || 'beginner',
        xp: data.progress.xp_points || 0,
        streak: data.progress.streak || 1,
        lastActive: data.progress.updated_at || new Date().toISOString(),
        completedLessons: data.progress.completed_lessons || [],
        completedQuizzes: data.progress.completedQuizzes || [],
        completedChallenges: data.progress.completedChallenges || [],
        completedProjects: data.progress.completedProjects || [],
        badges: data.progress.badges || [],
        pasteProtectionEnabled: data.progress.pasteProtectionEnabled ?? true,
        pasteAttempts: data.progress.pasteAttempts || [],
        completedDailyProblems: data.progress.completed_daily_problems || [],
      };

      if (migratingData) {
        // Merge guest data into the account safely
        const mergedProgress = {
          ...convertedProgress,
          xp: Math.max(convertedProgress.xp, migratingData.xp),
          streak: Math.max(convertedProgress.streak, migratingData.streak),
          completedLessons: Array.from(new Set([...convertedProgress.completedLessons, ...migratingData.completedLessons])),
          completedQuizzes: Array.from(new Set([...convertedProgress.completedQuizzes, ...migratingData.completedQuizzes])),
          completedChallenges: Array.from(new Set([...convertedProgress.completedChallenges, ...migratingData.completedChallenges])),
          completedProjects: Array.from(new Set([...convertedProgress.completedProjects, ...migratingData.completedProjects])),
          badges: Array.from(new Set([...convertedProgress.badges, ...migratingData.badges])),
          pasteAttempts: [...convertedProgress.pasteAttempts, ...(migratingData.pasteAttempts || [])],
          completedDailyProblems: Array.from(new Set([...(convertedProgress.completedDailyProblems || []), ...(migratingData.completedDailyProblems || [])])),
        };
        setProgress(mergedProgress);
        setWelcomeMessage(`Welcome, ${data.user.name}! Your offline guest achievements have been merged successfully! 🎉`);
      } else {
        setProgress(convertedProgress);
        setWelcomeMessage(`Welcome back, ${data.user.name}! Your ${data.progress.selected_world || 'story'} lesson is waiting for you.`);
      }
    } else if (migratingData) {
      setProgress(migratingData);
      setWelcomeMessage(`Welcome, ${data.user.name}! Your offline guest progress was successfully uploaded to the cloud! 🎉`);
    } else {
      setWelcomeMessage(`Welcome to Pybe, ${data.user.name}! Let's learn Python!`);
    }

    setMigratingProgress(null);
    setActiveTab('dashboard');
    setTimeout(() => setWelcomeMessage(null), 6000);
  };

  const handleContinueAsGuest = () => {
    setAuthMode('guest');
    localStorage.setItem('pyverse_authmode', 'guest');
    
    // Default user name for guest
    const guestAvatar = localStorage.getItem('pyverse_guest_avatar');
    setUser({ id: 'guest_id', name: 'Guest Learner', email: 'offline', profile_picture: guestAvatar });
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setAuthMode(null);
    localStorage.removeItem('pyverse_token');
    localStorage.removeItem('pyverse_user');
    localStorage.removeItem('pyverse_authmode');
    setProgress(DEFAULT_PROGRESS);
    setActiveTab('dashboard');
  };

  const handleDeleteAccount = async () => {
    if (authMode === 'logged-in' && token) {
      try {
        const res = await fetch('/api/user/delete-account', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to delete account");
        alert("Your account & saved cloud database data has been completely deleted.");
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      localStorage.removeItem('pyverse_user_progress');
      localStorage.removeItem('pyverse_peer_threads');
      localStorage.removeItem('pyverse_guest_avatar');
      setProgress(DEFAULT_PROGRESS);
      alert("Local guest progress has been cleared.");
    }
    handleLogout();
  };

  const handleExportData = async () => {
    if (authMode === 'logged-in' && token) {
      try {
        const res = await fetch('/api/user/export', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to export cloud portfolio");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pybe_data_export_${user?.id || 'portfolio'}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pyverse_guest_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  const handleTriggerMigration = () => {
    setMigratingProgress(progress);
    setAuthMode(null); // Triggers AuthScreen selection
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            progress={progress}
            onUpdateProgress={setProgress}
            onSelectTab={setActiveTab}
            onResetProgress={handleResetProgress}
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
            onSelectLevel={setSelectedLevel}
          />
        );
      case 'journey':
        return (
          <CodingJourney
            progress={progress}
            onUpdateProgress={setProgress}
          />
        );
      case 'cheatsheet':
        return <PythonCheatSheet />;
      case 'lessons':
        return (
          <LessonViewer
            progress={progress}
            onUpdateProgress={setProgress}
            selectedScenario={selectedScenario}
            selectedLevel={selectedLevel}
            onSelectTab={setActiveTab}
          />
        );
      case 'chat':
        return <TutorBot scenario={selectedScenario} />;
      case 'peers':
        return (
          <PeerHub
            progress={progress}
            onUpdateProgress={setProgress}
            selectedScenario={selectedScenario}
          />
        );
      case 'games':
        return (
          <GamePortal
            progress={progress}
            onUpdateProgress={setProgress}
          />
        );
      case 'projects':
        return (
          <ProjectPortal
            progress={progress}
            onUpdateProgress={setProgress}
          />
        );
      case 'quizzes':
        return (
          <Quizzes
            progress={progress}
            onUpdateProgress={setProgress}
          />
        );
      case 'live-quiz':
        return (
          <LiveQuizArena
            progress={progress}
            onUpdateProgress={setProgress}
            selectedScenario={selectedScenario}
          />
        );
      case 'playground':
        return <Playground selectedScenario={selectedScenario} selectedLevel={selectedLevel} />;
      case 'admin':
        return (
          <AdminPanel
            progress={progress}
            onUpdateProgress={setProgress}
            selectedScenario={selectedScenario}
            user={user}
            authMode={authMode}
            token={token}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            onExportData={handleExportData}
            onTriggerMigration={handleTriggerMigration}
            onUpdateUser={setUser}
          />
        );
      default:
        return (
          <Dashboard
            progress={progress}
            onSelectTab={setActiveTab}
            onResetProgress={handleResetProgress}
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
          />
        );
    }
  };

  // If AuthMode is null, they haven't logged in or chosen guest mode yet
  if (authMode === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <header className="bg-white border-b border-sky-100 py-4 px-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl shadow-md">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              Pybe
            </span>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto flex items-center justify-center p-4">
          <AuthScreen
            onLoginSuccess={handleLoginSuccess}
            onContinueAsGuest={handleContinueAsGuest}
            guestProgressToMigrate={migratingProgress}
          />
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-[11px] font-black uppercase tracking-wider">
          <div>© 2026 Pybe. All rights reserved.</div>
          <div className="mt-1 text-slate-400">Secure SHA256 Hashing & JWT Authorization System Active</div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col transition-colors duration-300">
      
      {/* 1. Global Interactive Warning Bar for Guest Users */}
      {authMode === 'guest' && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black px-4 py-2.5 text-center flex flex-col sm:flex-row items-center justify-center gap-2 shadow-md">
          <div className="flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4 animate-bounce text-amber-100" />
            <span>You are using Guest Mode.</span>
          </div>
          <span className="text-[11px] font-medium text-amber-50">
            Your progress may be lost if you clear browser data or change devices.
          </span>
          <button
            onClick={handleTriggerMigration}
            className="sm:ml-4 bg-white hover:bg-slate-50 text-amber-700 font-extrabold text-[10px] px-3.5 py-1 rounded-lg uppercase tracking-wider shadow cursor-pointer transition hover:scale-105 active:scale-95"
          >
            Create Account and Save My Progress
          </button>
        </div>
      )}

      {/* 2. Welcome Back Dynamic Dashboard Notification */}
      <AnimatePresence>
        {welcomeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-600 text-white text-xs font-black py-3 px-6 text-center flex items-center justify-center gap-2 shadow-lg z-50 border-b border-blue-500"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-sky-200" />
            <span>{welcomeMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Top sticky navigation menu */}
      <Navigation
        progress={progress}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedScenario={selectedScenario}
        onSelectScenario={setSelectedScenario}
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        user={user}
        authMode={authMode}
        onLogout={handleLogout}
      />

      {/* 4. Main viewport view container */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-slate-500 text-[11px] font-black tracking-wider uppercase">
        <div className="flex justify-center items-center gap-1">
          <span>© 2026 Pybe. All rights reserved.</span>
          {authMode === 'logged-in' && (
            <span className="text-[9px] bg-sky-50 text-blue-600 border border-sky-100 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold uppercase ml-2">
              <CloudLightning className="h-2.5 w-2.5" /> Synchronized
            </span>
          )}
        </div>
        <div className="mt-1 text-slate-400">Learn Python through highly interactive, playful scenarios.</div>
      </footer>
    </div>
  );
}
