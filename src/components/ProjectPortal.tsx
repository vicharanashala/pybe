import { useState } from 'react';
import { ProjectTemplate, UserProgress } from '../types';
import { PROJECT_TEMPLATES } from '../predefinedData';
import { Hammer, Check, ArrowRight, BookOpen, Star, RefreshCw, Trophy } from 'lucide-react';
import CodeEditor from './CodeEditor';
import { motion } from 'motion/react';

interface ProjectPortalProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export default function ProjectPortal({ progress, onUpdateProgress }: ProjectPortalProps) {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [stepSuccess, setStepSuccess] = useState(false);
  const [projectComplete, setProjectComplete] = useState(false);

  const activeProject = PROJECT_TEMPLATES[activeProjectIdx];
  const totalSteps = activeProject.steps.length;
  const isProjectCompleted = progress.completedProjects.includes(activeProject.id);

  const handleStepRun = (stdout: string) => {
    const activeStep = activeProject.steps[activeStepIdx];
    // Check if the stdout or code itself solves the step requirements using simple keyword checks
    const lowercaseOut = stdout.toLowerCase();
    const matches = lowercaseOut.includes(activeStep.solutionKeyword.toLowerCase()) || 
                    // Fallback to accepting run completion as progress
                    stdout.trim().length > 0;

    if (matches) {
      setStepSuccess(true);
    }
  };

  const handleNextStep = () => {
    if (activeStepIdx < totalSteps - 1) {
      setActiveStepIdx(prev => prev + 1);
      setStepSuccess(false);
    } else {
      setProjectComplete(true);
      if (!isProjectCompleted) {
        onUpdateProgress((prev) => {
          const nextXP = prev.xp + 150; // High XP for projects
          const nextCompleted = [...prev.completedProjects, activeProject.id];

          // Award Project Completion Badges
          const nextBadges = [...prev.badges];
          const badgeName = `${activeProject.title} Architect`;
          if (!nextBadges.includes(badgeName)) {
            nextBadges.push(badgeName);
          }

          return {
            ...prev,
            xp: nextXP,
            completedProjects: nextCompleted,
            badges: nextBadges
          };
        });
      }
    }
  };

  const restartProject = () => {
    setActiveStepIdx(0);
    setStepSuccess(false);
    setProjectComplete(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6" id="projects-view">
      {/* Project selector */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECT_TEMPLATES.map((proj, idx) => {
          const completed = progress.completedProjects.includes(proj.id);
          const active = idx === activeProjectIdx;
          return (
            <button
              key={proj.id}
              onClick={() => {
                setActiveProjectIdx(idx);
                restartProject();
              }}
              className={`p-5 rounded-2xl border text-left flex justify-between items-start transition-all cursor-pointer ${
                active
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-650'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Hammer className="h-4 w-4 text-indigo-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{proj.title}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>
              {completed && (
                <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide border border-emerald-100 dark:border-emerald-900 flex-shrink-0">
                  ✓ Done
                </span>
              )}
            </button>
          );
        })}
      </div>

      {projectComplete ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow border border-slate-100 dark:border-slate-800/80 text-center space-y-6"
        >
          <Trophy className="h-16 w-16 text-amber-500 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Project Completed Successfully! 🎉
            </h2>
            <p className="text-slate-500 dark:text-slate-300 text-xs md:text-sm font-semibold max-w-md mx-auto leading-relaxed">
              Congratulations! You built the "{activeProject.title}" from scratch. You gained 150 XP and unlocked the achievement badge!
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={restartProject}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Rebuild Project</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* Active guided steps workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Step Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Guided Milestones: Step {activeStepIdx + 1} of {totalSteps}
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  +150 XP Reward
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-950 dark:text-white leading-relaxed">
                {activeProject.steps[activeStepIdx].instruction}
              </h3>

              <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full" 
                  style={{ width: `${((activeStepIdx + 1) / totalSteps) * 100}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Write appropriate code blocks inside the editor on the right, run it, and click "Proceed" to continue.
              </p>
            </div>

            {/* Verification trigger */}
            {stepSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl text-center space-y-3 shadow-sm"
              >
                <div className="text-emerald-800 dark:text-emerald-400 font-extrabold text-xs md:text-sm">
                  Milestone Completed!
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Proceed to Next Step</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Project editor panels */}
          <div className="lg:col-span-8">
            <CodeEditor
              initialCode={activeProject.steps[activeStepIdx].starterCode}
              onRunSuccess={handleStepRun}
              lessonContext={`${activeProject.title} - Step ${activeStepIdx + 1}`}
              isSecureExercise={true}
              progress={progress}
              onUpdateProgress={onUpdateProgress}
            />
          </div>
        </div>
      )}
    </div>
  );
}
