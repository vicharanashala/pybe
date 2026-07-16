import { useState } from 'react';
import { UserProgress } from '../types';
import { 
  Settings, BarChart2, FileText, Plus, CheckCircle, Star, Sparkles, Sliders, 
  LogOut, Trash2, Download, CloudLightning, ShieldCheck, Volume2, VolumeX, 
  Languages, Type as TypeIcon, User as UserIcon, Camera
} from 'lucide-react';

interface AdminPanelProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  selectedScenario: string;
  user: { id: string; name: string; email: string; profile_picture: string | null } | null;
  authMode: 'guest' | 'logged-in' | null;
  token: string | null;
  onLogout: () => void;
  onDeleteAccount: () => Promise<void>;
  onExportData: () => void;
  onTriggerMigration: () => void;
  onUpdateUser: (userData: any) => void;
}

export default function AdminPanel({ 
  progress, 
  onUpdateProgress, 
  selectedScenario,
  user,
  authMode,
  token,
  onLogout,
  onDeleteAccount,
  onExportData,
  onTriggerMigration,
  onUpdateUser
}: AdminPanelProps) {
  const [customInterest, setCustomInterest] = useState('');
  const [addedScenario, setAddedScenario] = useState<string | null>(null);

  // App Settings States (synced in local storage / database)
  const [theme, setTheme] = useState(() => localStorage.getItem('pyverse_theme') || 'light');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('pyverse_fontsize') || 'medium');
  const [sound, setSound] = useState(() => localStorage.getItem('pyverse_sound') !== 'muted');
  const [language, setLanguage] = useState(() => localStorage.getItem('pyverse_lang') || 'english');

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const totalLessons = progress.completedLessons.length;
  const totalQuizzes = progress.completedQuizzes.length;
  const totalGames = progress.completedChallenges.length;

  const handleAddCustomInterest = () => {
    if (!customInterest.trim()) return;
    setAddedScenario(customInterest);
    setCustomInterest('');
    alert(`Successfully registered "${customInterest}" as a personalized scenario context! Try going to Lessons or AI Tutor Chat to Master Python with it.`);
  };

  // Sound preference toggle
  const handleToggleSound = () => {
    const newVal = !sound;
    setSound(newVal);
    localStorage.setItem('pyverse_sound', newVal ? 'active' : 'muted');
    // Dispatch a custom event so other components know sound preference changed
    window.dispatchEvent(new Event('pyverse_sound_changed'));
  };

  // Font size selection
  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
    localStorage.setItem('pyverse_fontsize', val);
    window.dispatchEvent(new Event('pyverse_fontsize_changed'));
  };

  // Language selection
  const handleLanguageChange = (val: string) => {
    setLanguage(val);
    localStorage.setItem('pyverse_lang', val);
  };

  // Simulated Profile Picture Upload (Converts file to Base64)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      if (authMode === 'logged-in' && token) {
        try {
          const res = await fetch('/api/user/upload-avatar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ profile_picture: base64String })
          });
          if (res.ok) {
            onUpdateUser({ ...user, profile_picture: base64String });
          }
        } catch (err) {
          console.error("Avatar upload failed on server:", err);
        }
      } else {
        // Guest avatar save in offline state
        localStorage.setItem('pyverse_guest_avatar', base64String);
        onUpdateUser({ name: 'Guest Learner', email: 'offline', profile_picture: base64String });
      }
      setAvatarLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in" id="admin-view">
      
      {/* 1. Account & Profile Header Panel */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-sky-100/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          {/* Avatar Container with Upload trigger */}
          <div className="relative group">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md overflow-hidden border border-slate-150">
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{user?.name?.[0]?.toUpperCase() || '🎓'}</span>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-lg shadow-sm border border-white cursor-pointer hover:bg-blue-700 transition duration-150">
              <Camera className="h-3.5 w-3.5" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <h2 className="text-lg font-black text-slate-900">{user?.name || 'Guest Learner'}</h2>
              {authMode === 'logged-in' ? (
                <span className="bg-blue-100 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CloudLightning className="h-2.5 w-2.5" /> Cloud Active
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                  ⚠️ Guest Offline
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-bold">{user?.email || 'Offline Guest Learning Mode'}</p>
            {authMode === 'guest' && (
              <p className="text-[11px] text-amber-600 font-semibold leading-relaxed pt-1">
                ⚠️ Your progress is saved locally. If you clear cache or change device, progress is lost!
              </p>
            )}
          </div>
        </div>

        {/* Dynamic CTAs */}
        <div className="flex flex-wrap gap-2.5 justify-center">
          {authMode === 'guest' ? (
            <button
              onClick={onTriggerMigration}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CloudLightning className="h-3.5 w-3.5" />
              <span>Save Progress to Cloud</span>
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* 2. Core Preferences & App Settings */}
        <div className="md:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-sky-100 space-y-5">
          <div className="flex items-center gap-2 border-b border-sky-50 pb-3">
            <Sliders className="h-5 w-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
              Application Settings
            </h3>
          </div>

          <div className="space-y-4">
            {/* Font Size Preferences */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <TypeIcon className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Text Font Size</span>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-sky-50">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Sound / Audio Effects</span>
              </div>
              <button
                onClick={handleToggleSound}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                  sound 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {sound ? 'Sound ON' : 'Muted'}
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Languages className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Language Preference</span>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish (Español)</option>
                <option value="hindi">Hindi (हिन्दी)</option>
                <option value="french">French (Français)</option>
              </select>
            </div>

            {/* Paste Protection */}
            <div className="flex items-center justify-between border-t border-sky-50 pt-4">
              <div className="space-y-0.5 max-w-[70%]">
                <span className="text-xs font-black text-slate-800 uppercase block">Paste Protection</span>
                <span className="text-[10px] text-slate-400 font-semibold block leading-relaxed">
                  Prevents copying solutions in tests.
                </span>
              </div>
              <button
                onClick={() => {
                  onUpdateProgress((prev) => ({
                    ...prev,
                    pasteProtectionEnabled: !prev.pasteProtectionEnabled
                  }));
                }}
                className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer shadow-sm ${
                  progress.pasteProtectionEnabled ?? true
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {progress.pasteProtectionEnabled ?? true ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Analytics & Metrics */}
        <div className="md:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-sky-100 space-y-5">
          <div className="flex items-center gap-2 border-b border-sky-50 pb-3">
            <BarChart2 className="h-5 w-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
              Learning Analytics
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Syllabus Progress ({totalLessons} lessons completed)</span>
                  <span className="text-blue-600 font-bold">{Math.round((totalLessons / 8) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2.5 rounded-full border border-sky-50 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${(totalLessons / 8) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Mini-Games Conquered</span>
                  <span className="text-indigo-600 font-bold">{Math.round((totalGames / 4) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2.5 rounded-full border border-sky-50 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${(totalGames / 4) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Quizzes Solved</span>
                  <span className="text-amber-500 font-bold">{Math.round((totalQuizzes / 4) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2.5 rounded-full border border-sky-50 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${(totalQuizzes / 4) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-sky-50 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold">Total Skill Points Awarded:</span>
              <div className="bg-slate-900 text-sky-400 font-mono text-xs px-2.5 py-1 rounded-lg font-extrabold flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current text-sky-400 animate-pulse" />
                <span>{progress.xp} XP Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Scenario Dynamic Builder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sky-100 space-y-4">
        <div className="flex items-center gap-2 border-b border-sky-50 pb-3">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
            Bespoke Scenario Builders
          </h3>
        </div>

        <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-semibold">
          By default, we support core interests like Gaming, Storytelling, and Geography. You can inject ANY custom interest here, and our server-side Gemini prompt engines will automatically craft the textbook around it!
        </p>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Inject Custom Favorite Topic:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="e.g., Marvel Movies, PUBG, Cricket, Pokemon..."
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-blue-400 shadow-inner"
            />
            <button
              onClick={handleAddCustomInterest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Inject</span>
            </button>
          </div>
        </div>

        {addedScenario && (
          <div className="bg-blue-50 p-4 rounded-xl border border-sky-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500 animate-spin" />
            <div className="text-xs text-blue-800 font-bold leading-relaxed">
              Registered Context: <span className="text-slate-900 italic">"{addedScenario}"</span>. Try prompting our AI Tutor or generate a lesson!
            </div>
          </div>
        )}
      </div>

      {/* 5. Teachers Audit Log */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sky-100 space-y-4">
        <div className="flex items-center justify-between border-b border-sky-50 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
              Teacher Security & Honesty Audit Log
            </h3>
          </div>
          <span className="bg-sky-50 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-sky-100">
            {progress.pasteAttempts?.length || 0} Attempts Tracked
          </span>
        </div>

        {progress.pasteAttempts && progress.pasteAttempts.length > 0 ? (
          <div className="border border-sky-50 rounded-xl overflow-hidden divide-y divide-sky-50 max-h-[200px] overflow-y-auto">
            {progress.pasteAttempts.map((attempt) => (
              <div key={attempt.id} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Blocked Paste
                    </span>
                    <span className="text-slate-700 text-xs font-bold truncate">
                      {attempt.exerciseContext}
                    </span>
                    <span className="text-slate-400 text-[9px] font-semibold">
                      {new Date(attempt.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {attempt.attemptedText && (
                    <div className="bg-white px-3 py-2 rounded-lg font-mono text-[10px] text-slate-500 border border-slate-100 overflow-x-auto whitespace-pre truncate max-w-full">
                      Clipboard text: <span className="text-slate-800">{attempt.attemptedText}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <span className="text-xl">🛡️</span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              No paste attempts recorded
            </h4>
          </div>
        )}
      </div>

      {/* 6. Advanced Backup, Export, Delete Account Options */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sky-100 space-y-6">
        <div className="flex items-center gap-2 border-b border-sky-50 pb-3">
          <FileText className="h-5 w-5 text-rose-500" />
          <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider">
            Account Management & Backups
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data Export Card */}
          <div className="p-5 rounded-2xl bg-slate-50/50 border border-sky-50 space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Download className="h-4 w-4 text-slate-600" />
              Export My Portfolio Data
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              Export your full learning streak, XP scores, peer posts, custom sandbox files, and configurations into a validated JSON backup for safe portfolio records.
            </p>
            <button
              onClick={onExportData}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Account Delete Card */}
          <div className="p-5 rounded-2xl bg-rose-50/30 border border-rose-100 space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-rose-850 flex items-center gap-1.5">
              <Trash2 className="h-4 w-4 text-rose-500" />
              Danger Zone
            </h4>
            <p className="text-[11px] text-rose-400 font-semibold leading-relaxed">
              Permanently delete your account, saved codes, discussion history, scores, and progress. This operation is completely irreversible.
            </p>

            {confirmDelete ? (
              <div className="space-y-2">
                <p className="text-[10px] text-rose-700 font-bold uppercase">Are you absolutely sure? This cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onDeleteAccount}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow cursor-pointer"
                  >
                    Yes, Delete Forever
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-100 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{authMode === 'logged-in' ? 'Delete Cloud Account' : 'Reset Guest Progress'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
