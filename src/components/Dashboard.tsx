import { useState, useEffect, useMemo } from 'react';
import { UserProgress } from '../types';
import { 
  Award, Zap, CheckCircle, Flame, Star, BookOpen, Clock, 
  AlertTriangle, ShieldCheck, TrendingUp, Globe, Gamepad2, 
  Check, Sparkles, Users, Milestone, Rocket, Music, ArrowRight, Trophy,
  Bug, ShieldAlert, Wand2, Settings, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CORE_INTERESTS, DAILY_PROBLEMS } from '../predefinedData';
import CodeEditor from './CodeEditor';

interface DashboardProps {
  progress: UserProgress;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
  onSelectTab: (tab: string) => void;
  onResetProgress: () => void;
  selectedScenario: string;
  onSelectScenario: (scenario: string) => void;
  onSelectLevel?: (level: any) => void;
}

export default function Dashboard({ 
  progress, 
  onUpdateProgress,
  onSelectTab, 
  onResetProgress, 
  selectedScenario, 
  onSelectScenario,
  onSelectLevel
}: DashboardProps) {
  const [selectedProblemNo, setSelectedProblemNo] = useState<number>(1);
  const [justSolved, setJustSolved] = useState<boolean>(false);

  const [debuggerState, setDebuggerState] = useState<{
    status: 'idle' | 'success' | 'error' | 'validation_fail';
    errorMsg?: string;
    actualOutput?: string;
    expectedKeywords?: string[];
    failedLineNumber?: number;
  }>({ status: 'idle' });

  const activeProblem = DAILY_PROBLEMS.find((p) => p.no === selectedProblemNo) || DAILY_PROBLEMS[0];
  const isCompleted = progress.completedDailyProblems?.includes(selectedProblemNo) || false;

  // --- DAILY GOALS & FLASHBACK STATES ---
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('pyverse_daily_goals');
      return saved ? JSON.parse(saved) : { lessons: 2, xp: 100, quizzes: 1 };
    } catch (e) {
      return { lessons: 2, xp: 100, quizzes: 1 };
    }
  });

  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editLessons, setEditLessons] = useState(goals.lessons);
  const [editXp, setEditXp] = useState(goals.xp);
  const [editQuizzes, setEditQuizzes] = useState(goals.quizzes);
  const [showCelebration, setShowCelebration] = useState(false);

  const lastCompletedLesson = useMemo(() => {
    try {
      const saved = localStorage.getItem('pyverse_last_completed_lesson');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }, [progress.completedLessons]);

  const todayStr = useMemo(() => new Date().toDateString(), []);

  const dailyStats = useMemo(() => {
    const savedDate = localStorage.getItem('pyverse_daily_date');
    let startLessons: string[] = [];
    let startQuizzes: string[] = [];
    let startXp = progress.xp;

    if (savedDate !== todayStr) {
      localStorage.setItem('pyverse_daily_date', todayStr);
      localStorage.setItem('pyverse_start_of_day_completed_lessons', JSON.stringify(progress.completedLessons));
      localStorage.setItem('pyverse_start_of_day_completed_quizzes', JSON.stringify(progress.completedQuizzes));
      localStorage.setItem('pyverse_start_of_day_xp', progress.xp.toString());
      localStorage.removeItem('pyverse_daily_goals_celebrated');
      startLessons = progress.completedLessons;
      startQuizzes = progress.completedQuizzes;
      startXp = progress.xp;
    } else {
      try {
        startLessons = JSON.parse(localStorage.getItem('pyverse_start_of_day_completed_lessons') || '[]');
        startQuizzes = JSON.parse(localStorage.getItem('pyverse_start_of_day_completed_quizzes') || '[]');
        startXp = parseInt(localStorage.getItem('pyverse_start_of_day_xp') || '0', 10);
      } catch (e) {
        startLessons = [];
        startQuizzes = [];
        startXp = progress.xp;
      }
    }

    const lessonsCount = progress.completedLessons.filter(x => !startLessons.includes(x)).length;
    const quizzesCount = progress.completedQuizzes.filter(x => !startQuizzes.includes(x)).length;
    const xpCount = Math.max(0, progress.xp - startXp);

    const lessonsPercent = Math.min(100, Math.round((lessonsCount / goals.lessons) * 100));
    const xpPercent = Math.min(100, Math.round((xpCount / goals.xp) * 100));
    const quizzesPercent = Math.min(100, Math.round((quizzesCount / goals.quizzes) * 100));

    const allCompleted = lessonsCount >= goals.lessons && xpCount >= goals.xp && quizzesCount >= goals.quizzes;

    return {
      lessonsCount,
      quizzesCount,
      xpCount,
      lessonsPercent,
      xpPercent,
      quizzesPercent,
      allCompleted
    };
  }, [progress, goals, todayStr]);

  useEffect(() => {
    if (dailyStats.allCompleted) {
      const alreadyCelebrated = localStorage.getItem('pyverse_daily_goals_celebrated');
      if (alreadyCelebrated !== todayStr) {
        localStorage.setItem('pyverse_daily_goals_celebrated', todayStr);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
    }
  }, [dailyStats.allCompleted, todayStr]);

  const handleSaveGoals = () => {
    const updated = {
      lessons: Math.max(1, editLessons),
      xp: Math.max(10, editXp),
      quizzes: Math.max(1, editQuizzes)
    };
    setGoals(updated);
    localStorage.setItem('pyverse_daily_goals', JSON.stringify(updated));
    setIsEditingGoals(false);
  };

  const handleQuickReview = () => {
    if (!lastCompletedLesson) return;
    
    if (lastCompletedLesson.scenario === 'journey') {
      localStorage.setItem('pyverse_journey_selected_topic_id', lastCompletedLesson.id);
      onSelectTab('journey');
      return;
    }

    const LESSON_CONCEPTS = [
      { concept: 'Variables & Data Types', id: 'concept_vars' },
      { concept: 'Input and Output', id: 'concept_io' },
      { concept: 'Operators & Strings', id: 'concept_operators' },
      { concept: 'Lists, Tuples, Dictionaries & Sets', id: 'concept_collections' },
      { concept: 'Conditions (if-else)', id: 'concept_conditions' },
      { concept: 'Loops (for/while)', id: 'concept_loops' },
      { concept: 'Functions & Modules', id: 'concept_funcs' },
      { concept: 'Object-Oriented Programming', id: 'concept_oop' }
    ];
    
    const index = LESSON_CONCEPTS.findIndex(c => c.concept.toLowerCase() === lastCompletedLesson.title.toLowerCase());
    const finalIndex = index !== -1 ? index : 0;
    
    localStorage.setItem('pyverse_review_concept_index', finalIndex.toString());
    onSelectScenario(lastCompletedLesson.scenario);
    if (onSelectLevel) {
      onSelectLevel(lastCompletedLesson.level);
    }
    onSelectTab('lessons');
  };

  const handleValidationSuccess = () => {
    setDebuggerState({ status: 'success' });
    setJustSolved(true);
    if (!isCompleted && onUpdateProgress) {
      onUpdateProgress((prev) => {
        const completed = prev.completedDailyProblems || [];
        if (completed.includes(selectedProblemNo)) return prev;

        const newXP = prev.xp + activeProblem.xpReward;
        const newBadges = [...prev.badges];
        const badgeName = `Daily Solved #${selectedProblemNo}`;
        if (!newBadges.includes(badgeName)) {
          newBadges.push(badgeName);
        }

        return {
          ...prev,
          xp: newXP,
          completedDailyProblems: [...completed, selectedProblemNo],
          badges: newBadges
        };
      });
    }
  };

  const handleValidationFailure = (actual: string, expected: string[]) => {
    setDebuggerState({
      status: 'validation_fail',
      actualOutput: actual,
      expectedKeywords: expected
    });
  };

  const handleRunFailure = (stderr: string) => {
    const lineMatch = stderr.match(/line (\d+)/i);
    const failedLine = lineMatch ? parseInt(lineMatch[1]) : undefined;
    setDebuggerState({
      status: 'error',
      errorMsg: stderr,
      failedLineNumber: failedLine
    });
  };

  const totalLessons = 8; // Number of unique core topics
  const lessonsCompletedCount = progress.completedLessons.length;
  const progressPercent = Math.min(100, Math.round((lessonsCompletedCount / totalLessons) * 100));

  // Determine skill rank
  let pythonRank = "Python Novice";
  if (progress.xp > 1500) pythonRank = "Senior Pythonic Wizard";
  else if (progress.xp > 850) pythonRank = "Intermediate Code Sage";
  else if (progress.xp > 350) pythonRank = "Apprentice Caster";
  else if (progress.xp > 50) pythonRank = "Variables Cadet";

  // Map icons to respective world items
  const iconMap: Record<string, any> = {
    BookOpen: BookOpen,
    Gamepad2: Gamepad2,
    Milestone: Milestone,
    Globe: Globe,
    Rocket: Rocket,
    TrendingUp: TrendingUp,
    Music: Music,
    ShieldCheck: ShieldCheck
  };

  const handleWorldClick = (worldId: string) => {
    onSelectScenario(worldId);
    onSelectTab('lessons');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6" id="dashboard-view">
      
      {/* Playful & Clean Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-sky-50 to-white text-slate-800 rounded-3xl p-8 md:p-10 shadow-md border border-sky-150/50">
        {/* Dynamic decorative shapes */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 border border-sky-200 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              🚀 {progress.level.toUpperCase()} LEVEL ACTIVE
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none text-slate-900">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Pybe</span>
            </h1>
            <p className="text-blue-900 text-sm md:text-base font-bold">
              "Learn Python through the worlds you love." ✨
            </p>
            <p className="text-slate-600 text-xs md:text-sm max-w-xl leading-relaxed">
              Ditch the boring templates. Program a car's fuel grid, check the legislative checks & balances, or cast fantasy spells. Your current level: <span className="text-blue-600 font-extrabold underline decoration-blue-500/20">{pythonRank}</span>
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/80 backdrop-blur-md border border-sky-100 p-4.5 rounded-2xl text-center min-w-[105px] shadow-sm">
              <Zap className="h-5 w-5 text-sky-500 mx-auto mb-1.5 animate-bounce" />
              <div className="text-2xl font-black font-mono tracking-tight text-slate-900">{progress.xp}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">TOTAL XP</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-sky-100 p-4.5 rounded-2xl text-center min-w-[105px] shadow-sm">
              <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1.5" />
              <div className="text-2xl font-black font-mono tracking-tight text-slate-900">{progress.streak}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">DAY STREAK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rebuilt Learning Journey Selection Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
              <span className="text-slate-800">Choose Your Educational Learning World</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1.5">
              Click any world card to load your interactive Python lesson, live visual grid simulator, and customized task sets!
            </p>
          </div>
          <div className="bg-sky-50 px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-700 border border-sky-100 flex items-center gap-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-bounce"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="uppercase tracking-widest text-[9px] font-black">
              Current Active World:{' '}
              {CORE_INTERESTS.find((i) => i.id === selectedScenario)?.label || 'Gaming World'}
            </span>
          </div>
        </div>

        {/* Playful Scenario Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CORE_INTERESTS.map((mode) => {
            const isSelected = selectedScenario === mode.id;
            const IconComp = iconMap[mode.icon] || BookOpen;
            
            return (
              <div
                key={mode.id}
                onClick={() => handleWorldClick(mode.id)}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer group relative ${
                  isSelected 
                    ? 'border-blue-500 bg-sky-50/50 shadow-md ring-2 ring-blue-400/20' 
                    : 'border-slate-100 hover:border-sky-300 bg-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      isSelected ? 'text-blue-700 bg-sky-100' : 'text-slate-500 bg-slate-100 group-hover:bg-sky-50 group-hover:text-sky-600'
                    }`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    {isSelected && (
                      <span className="p-1 bg-blue-600 rounded-full text-white shadow shadow-blue-500/30">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                      {mode.label}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      {mode.desc || 'Explore python constructs in depth through this personalized scenario.'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-[10px] text-blue-600 font-black uppercase tracking-wider">
                  <span>Enter World</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Statistics Box */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syllabus Completion</h3>
              <div className="p-2 bg-sky-50 rounded-xl text-sky-500">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-slate-950 mb-2 tracking-tight">
              {lessonsCompletedCount} <span className="text-lg font-bold text-slate-400">/ {totalLessons}</span>
            </div>
            <p className="text-slate-500 text-xs mb-5 leading-relaxed">
              Complete lessons to unlock intermediate and advanced modules, then challenge yourself in the Test Panel.
            </p>
          </div>
          <div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="text-right text-[10px] text-blue-600 font-extrabold tracking-wide">{progressPercent}% COMPLETE</div>
          </div>
        </div>

        {/* Current Mission Target */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Quest</h3>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-base font-extrabold text-slate-900 mb-3">
              Automate 1 Python Concept
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Earn 50 XP by passing quizzes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                <CheckCircle className={`h-4 w-4 flex-shrink-0 ${progress.streak > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span>Keep your streak multiplier active</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onSelectTab('lessons')}
            className="mt-5 w-full bg-sky-50 hover:bg-sky-100 text-blue-700 text-xs py-2.5 rounded-xl font-black uppercase tracking-wider transition-all border border-sky-150 cursor-pointer text-center"
          >
            Go to Lessons &rarr;
          </button>
        </div>

        {/* Dynamic Skill Strength Analysis */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mastery Level</h3>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                <Star className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Strong: Variables & Logic</span>
                  <span className="text-emerald-600 font-extrabold">100% Accuracy</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Developing: Control Structures</span>
                  <span className="text-amber-600 font-extrabold">60% Accuracy</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full w-[60%]" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-450 italic mt-3 font-semibold">
            * Challenge live games to increase control score!
          </p>
        </div>
      </div>

      {/* Daily Routine & Revision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="daily-goals-and-flashback-row">
        
        {/* Daily Goals Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <AnimatePresence>
            {showCelebration && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-blue-600/95 text-white flex flex-col items-center justify-center text-center p-6 z-20"
              >
                <Sparkles className="h-12 w-12 text-yellow-300 animate-bounce mb-3" />
                <h3 className="text-xl font-black uppercase tracking-wider">All Goals Completed! 🎉</h3>
                <p className="text-xs text-sky-100 mt-1 max-w-xs font-semibold">
                  Excellent work! You have cleared all your learning targets for today. Keep it up!
                </p>
                <button 
                  onClick={() => setShowCelebration(false)}
                  className="mt-4 bg-white text-blue-700 font-extrabold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl shadow cursor-pointer transition hover:scale-105 active:scale-95"
                >
                  Awesome
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-500" /> Daily Goals
              </h3>
              {!isEditingGoals && (
                <button
                  onClick={() => {
                    setEditLessons(goals.lessons);
                    setEditXp(goals.xp);
                    setEditQuizzes(goals.quizzes);
                    setIsEditingGoals(true);
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
                  title="Configure Goals"
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {isEditingGoals ? (
              <div className="space-y-3.5 bg-slate-50/70 p-4 rounded-2xl border text-xs">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase">Lessons goal per day</label>
                  <input
                    type="number"
                    min="1"
                    value={editLessons}
                    onChange={(e) => setEditLessons(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border px-3 py-1.5 rounded-lg font-bold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase">XP goal per day</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={editXp}
                    onChange={(e) => setEditXp(parseInt(e.target.value) || 10)}
                    className="w-full bg-white border px-3 py-1.5 rounded-lg font-bold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase">Quizzes goal per day</label>
                  <input
                    type="number"
                    min="1"
                    value={editQuizzes}
                    onChange={(e) => setEditQuizzes(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border px-3 py-1.5 rounded-lg font-bold outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-1.5">
                  <button
                    onClick={handleSaveGoals}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-2 rounded-xl cursor-pointer text-center text-[10px] uppercase tracking-wider shadow"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingGoals(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-350 text-slate-700 font-black py-2 rounded-xl cursor-pointer text-center text-[10px] uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Lessons goal */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-black text-slate-700">
                    <span>Lessons Completed</span>
                    <span className="text-blue-600 font-mono font-bold">{dailyStats.lessonsCount} / {goals.lessons}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${dailyStats.lessonsPercent}%` }}
                    />
                  </div>
                </div>

                {/* XP goal */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-black text-slate-700">
                    <span>XP Earned Today</span>
                    <span className="text-blue-600 font-mono font-bold">{dailyStats.xpCount} / {goals.xp}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${dailyStats.xpPercent}%` }}
                    />
                  </div>
                </div>

                {/* Quizzes goal */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-black text-slate-700">
                    <span>Quizzes Solved</span>
                    <span className="text-blue-600 font-mono font-bold">{dailyStats.quizzesCount} / {goals.quizzes}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${dailyStats.quizzesPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isEditingGoals && (
            <div className="border-t border-slate-100 mt-5 pt-3.5 flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
              <span>Goal status</span>
              {dailyStats.allCompleted ? (
                <span className="text-emerald-650 flex items-center gap-1 font-bold"><CheckCircle className="h-3.5 w-3.5" /> All Done</span>
              ) : (
                <span className="text-amber-500 flex items-center gap-1 font-bold"><Clock className="h-3.5 w-3.5" /> In Progress</span>
              )}
            </div>
          )}
        </div>

        {/* Revision Flashback Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Milestone className="h-4 w-4 text-indigo-500" /> Revision Flashback
              </h3>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
                <Clock className="h-4 w-4" />
              </div>
            </div>

            {lastCompletedLesson ? (
              <div className="space-y-3 text-left">
                <div className="text-base font-extrabold text-slate-900 leading-snug">
                  {lastCompletedLesson.title}
                </div>
                <div className="text-xs text-slate-500 font-semibold space-y-1">
                  <div><span className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Completed:</span> {lastCompletedLesson.date}</div>
                  <div><span className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Context:</span> <span className="capitalize">{lastCompletedLesson.scenario}</span> • <span className="capitalize">{lastCompletedLesson.level}</span></div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-450 border border-dashed rounded-2xl p-4 bg-slate-50/50">
                <Info className="h-6 w-6 text-slate-350 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500 leading-relaxed">No lesson completed yet!</p>
                <p className="text-[10px] text-slate-450 mt-1 max-w-[200px] mx-auto font-medium">Complete any lesson in the Lessons tab to unlock revision flashback cards.</p>
              </div>
            )}
          </div>

          {lastCompletedLesson && (
            <button 
              onClick={handleQuickReview}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2.5 rounded-xl font-black uppercase tracking-wider transition-all shadow cursor-pointer text-center"
            >
              Quick Review &rarr;
            </button>
          )}
        </div>

      </div>

      {/* Daily Coding Challenge Row */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6" id="daily-challenge-panel">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Star className="h-3 w-3 fill-current animate-pulse" /> DAILY CODING CHALLENGE
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mt-2">
              Solve Daily Problems, Earn Badges & Level Up!
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Select a challenge number to load its requirements, test your logic in the inline compiler, and unlock custom trophies.
            </p>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-3 shadow-sm">
            <Award className="h-5 w-5 text-indigo-650" />
            <div>
              <div className="text-xs font-black text-indigo-900 uppercase tracking-wide">
                Daily Progress
              </div>
              <div className="text-[11px] text-indigo-600 font-extrabold">
                {progress.completedDailyProblems?.length || 0} / {DAILY_PROBLEMS.length} Solved
              </div>
            </div>
          </div>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Selector and Requirements */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">
                  Select Challenge Number
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {DAILY_PROBLEMS.map((problem) => {
                    const isProbCompleted = progress.completedDailyProblems?.includes(problem.no);
                    const isSelected = selectedProblemNo === problem.no;
                    return (
                      <button
                        key={problem.no}
                        onClick={() => {
                          setSelectedProblemNo(problem.no);
                          setJustSolved(false);
                          setDebuggerState({ status: 'idle' });
                        }}
                        className={`h-11 w-11 rounded-full font-black text-sm flex items-center justify-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-500/20 hover:bg-blue-700'
                            : isProbCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-650 border border-slate-200 hover:border-slate-350 hover:bg-slate-100'
                        }`}
                      >
                        {problem.no}
                        {isProbCompleted && (
                          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow-sm border border-white">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problem Details Panel */}
              <div className="bg-slate-50/70 border border-slate-150 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                      activeProblem.difficulty === 'easy'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : activeProblem.difficulty === 'medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {activeProblem.difficulty}
                    </span>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {activeProblem.concept}
                    </span>
                  </div>

                  <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    ⚡ +{activeProblem.xpReward} XP
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    Challenge #{activeProblem.no}: {activeProblem.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-2 bg-white border border-slate-150 p-4 rounded-xl shadow-inner">
                    {activeProblem.description}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="pt-2">
                  {isCompleted ? (
                    <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-800 border border-emerald-250 px-4 py-3 rounded-xl font-extrabold text-xs shadow-sm">
                      <div className="p-1 bg-emerald-500 text-white rounded-full">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>Success! Problem Solved (+{activeProblem.xpReward} XP Claimed)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 bg-slate-100 text-slate-605 border border-slate-200 px-4 py-3 rounded-xl font-extrabold text-xs">
                      <div className="h-4.5 w-4.5 rounded-full border-2 border-slate-450 flex items-center justify-center text-[10px] text-slate-500 font-black">
                        ○
                      </div>
                      <span>Unsolved — Submit correct code on the right to complete</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick tips panel */}
            <div className="bg-sky-50/55 border border-sky-100 p-4 rounded-2xl text-[11px] text-slate-500 font-semibold flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-sky-500 flex-shrink-0 mt-0.5 animate-pulse" />
              <span>
                Make sure your code prints the exact expected outputs. Variables are case-sensitive in Python!
              </span>
            </div>
          </div>

          {/* Right Column: Code Editor solved overlay */}
          <div className="lg:col-span-7 flex flex-col justify-center min-h-[300px]">
            {isCompleted || justSolved ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-center space-y-5 flex flex-col justify-center items-center h-full shadow-inner min-h-[400px]"
              >
                <div className="p-4 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full shadow-lg shadow-emerald-400/25 animate-bounce">
                  <Trophy className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-emerald-950 uppercase tracking-wide">
                    Challenge #{activeProblem.no} Solved!
                  </h3>
                  <p className="text-xs text-emerald-800 font-bold max-w-sm">
                    Awesome job! You successfully wrote and executed the Python script to satisfy the constraints.
                  </p>
                </div>

                <div className="bg-white border border-emerald-100 rounded-2xl p-4.5 text-xs text-slate-700 font-mono text-left w-full shadow-sm max-w-md">
                  <div className="text-[10px] font-black uppercase text-emerald-600 tracking-wider mb-1">
                    Your Solved Code:
                  </div>
                  <pre className="whitespace-pre-wrap font-semibold leading-relaxed">
                    {localStorage.getItem(`pyverse_saved_code_Daily Problem #${selectedProblemNo}`) || activeProblem.starterCode}
                  </pre>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (onUpdateProgress) {
                        onUpdateProgress((prev) => {
                          const completed = prev.completedDailyProblems || [];
                          return {
                            ...prev,
                            completedDailyProblems: completed.filter((c) => c !== selectedProblemNo),
                          };
                        });
                        setJustSolved(false);
                        setDebuggerState({ status: 'idle' });
                      }
                    }}
                    className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Reset & Try Again
                  </button>
                  {selectedProblemNo < DAILY_PROBLEMS.length && (
                    <button
                      onClick={() => {
                        setSelectedProblemNo((prev) => prev + 1);
                        setJustSolved(false);
                        setDebuggerState({ status: 'idle' });
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow hover:scale-102 flex items-center gap-1.5"
                    >
                      <span>Next Problem</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-2.5 h-full flex flex-col">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Write Python Code Here:
                </label>
                <div className="flex-1 min-h-[460px]">
                  <CodeEditor
                    initialCode={activeProblem.starterCode}
                    expectedOutputContains={activeProblem.expectedOutputContains}
                    lessonContext={`Daily Problem #${selectedProblemNo}`}
                    isSecureExercise={true}
                    progress={progress}
                    onUpdateProgress={onUpdateProgress}
                    onValidationSuccess={handleValidationSuccess}
                    onValidationFailure={handleValidationFailure}
                    onRunFailure={handleRunFailure}
                  />
                </div>

                {/* Visual Debugger & Bug Analyzer Panel */}
                <AnimatePresence>
                  {debuggerState.status !== 'idle' && debuggerState.status !== 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className={`mt-4 p-5 rounded-2xl border transition-all duration-300 shadow-sm space-y-4 ${
                        debuggerState.status === 'error'
                          ? 'bg-rose-50 border-rose-250 text-rose-900 shadow-rose-100/50'
                          : 'bg-amber-50 border-amber-250 text-amber-900 shadow-amber-100/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {debuggerState.status === 'error' ? (
                            <div className="p-1.5 bg-rose-500 text-white rounded-xl shadow-sm animate-pulse">
                              <Bug className="h-4.5 w-4.5" />
                            </div>
                          ) : (
                            <div className="p-1.5 bg-amber-500 text-white rounded-xl shadow-sm">
                              <ShieldAlert className="h-4.5 w-4.5" />
                            </div>
                          )}
                          <h4 className="text-xs font-black uppercase tracking-wider">
                            {debuggerState.status === 'error'
                              ? '⚡ Visual Syntax & Run Compiler Error'
                              : '⚠️ Challenge Output Mismatch Warning'}
                          </h4>
                        </div>
                        <button
                          onClick={() => setDebuggerState({ status: 'idle' })}
                          className="text-[10px] uppercase font-black text-slate-500 hover:text-slate-700 bg-white/60 px-2 py-1 rounded-md border border-slate-200 shadow-sm cursor-pointer transition hover:bg-white"
                        >
                          Clear diagnostics
                        </button>
                      </div>

                      {debuggerState.status === 'error' ? (
                        <div className="space-y-3">
                          <p className="text-xs font-bold leading-relaxed">
                            A bug was identified in your script, originating around{' '}
                            <span className="bg-rose-100 text-rose-850 px-1.5 py-0.5 rounded font-black border border-rose-200">
                              Line {debuggerState.failedLineNumber || 'Unknown'}
                            </span>
                            :
                          </p>

                          <div className="bg-slate-950 border border-slate-900 rounded-xl p-3.5 text-xs text-rose-300 font-mono overflow-x-auto shadow-inner leading-relaxed whitespace-pre max-w-full">
                            {debuggerState.errorMsg}
                          </div>

                          {/* Interactive diagnostics suggestions */}
                          <div className="bg-white/80 border border-rose-100 p-3.5 rounded-xl space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-800">
                              <Wand2 className="h-4 w-4 text-rose-600 animate-pulse" />
                              <span>AI Diagnostic Advice:</span>
                            </div>
                            <ul className="list-disc list-inside text-[11px] text-slate-650 font-semibold space-y-1">
                              {debuggerState.errorMsg?.includes('IndentationError') ? (
                                <li>
                                  <strong>Indentation mismatch:</strong> Python requires strict 4-space blocks after conditions/loops. Verify spaces.
                                </li>
                              ) : debuggerState.errorMsg?.includes('NameError') ? (
                                <li>
                                  <strong>Misspelled names:</strong> You referred to a variable or function that has not been defined yet. Check spelling.
                                </li>
                              ) : debuggerState.errorMsg?.includes('SyntaxError') ? (
                                <li>
                                  <strong>Syntax mismatch:</strong> Check if you forgot closing parentheses `()`, quotes `""`, or a colon `:` at the end of checks.
                                </li>
                              ) : (
                                <li>
                                  Verify variable declarations, matching brackets, spelling, and types in your code.
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs font-bold leading-relaxed">
                            Code compiled successfully, but the console output did not satisfy the challenge validation filters.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <div className="bg-rose-100/30 border border-rose-200 p-3.5 rounded-xl">
                              <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest block mb-1">
                                Your Output
                              </span>
                              <pre className="font-mono text-xs text-rose-850 bg-white/60 p-2 rounded border border-rose-100 min-h-[36px] flex items-center overflow-x-auto">
                                {debuggerState.actualOutput || '(Empty stdout)'}
                              </pre>
                            </div>
                            <div className="bg-emerald-100/30 border border-emerald-200 p-3.5 rounded-xl">
                              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block mb-1">
                                Expected to Contain
                              </span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {debuggerState.expectedKeywords?.map((kw, i) => (
                                  <span
                                    key={i}
                                    className="font-mono text-xs text-emerald-800 bg-white/80 px-2 py-1 rounded border border-emerald-100 font-extrabold"
                                  >
                                    "{kw}"
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/80 border border-amber-100 p-3.5 rounded-xl space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800">
                              <Wand2 className="h-4 w-4 text-amber-600 animate-pulse" />
                              <span>AI Diagnostic Advice:</span>
                            </div>
                            <p className="text-[11px] text-slate-650 font-semibold leading-relaxed">
                              Check that you print exactly what the challenge asks. Make sure your strings match capitalization rules (e.g. "Even Number" instead of "even number").
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Peer Discussion Hub Invitation Box */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="space-y-2 relative z-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-sky-200 flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-100" />
            <span>Interactive Peer Q&A Forum</span>
          </h3>
          <h2 className="text-lg md:text-xl font-black tracking-tight leading-tight">
            Having trouble with a python syntax error?
          </h2>
          <p className="text-xs text-sky-100 font-semibold max-w-2xl leading-relaxed">
            Discuss directly underneath your active lessons! Upload code snippets, vote on helper explanations, and receive instant feedback from the peer discussion blocks.
          </p>
        </div>
        <button
          onClick={() => onSelectTab('peers')}
          className="relative z-10 bg-white hover:bg-slate-50 text-blue-700 rounded-2xl py-3 px-5 font-black text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer self-stretch md:self-auto text-center shadow"
        >
          Open Forum &rarr;
        </button>
      </div>

      {/* Unlocked Credentials Badges */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <h3 className="text-sm font-black text-slate-900 mb-5 uppercase tracking-widest flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-500 animate-pulse" />
          <span>Earned Trophies & Badges ({progress.badges.length})</span>
        </h3>
        {progress.badges.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-bold max-w-md mx-auto">
            No badges unlocked yet! Begin your first lesson with code submission to receive your trophy crest!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {progress.badges.map((badge, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.03, y: -2 }}
                className="relative overflow-hidden bg-sky-50/20 border border-sky-100 p-5 rounded-2xl text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="p-3 bg-sky-100 border border-sky-200 rounded-2xl text-blue-600 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800 tracking-tight">{badge}</div>
                  <div className="text-[9px] text-blue-500 uppercase font-black tracking-widest mt-1">UNLOCKED</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reset progress block */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-5 bg-slate-50 border border-slate-100 rounded-2xl">
        <div className="text-[11px] text-slate-500 flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <span>Local storage is tracking your milestones. You can wipe execution history here.</span>
        </div>
        <button
          onClick={() => {
            if (confirm("Reset everything? Your streaks, custom code runs, and badges will be deleted!")) {
              onResetProgress();
            }
          }}
          className="text-xs text-red-500 hover:text-red-600 font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
}
