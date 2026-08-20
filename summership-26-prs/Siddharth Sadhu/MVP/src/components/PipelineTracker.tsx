import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  BrainCircuit,
  Lightbulb,
  Compass,
  GitBranch,
  ListTree,
  Package,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { LogEntry, QualityReport } from '../types';

interface PipelineTrackerProps {
  currentStatus: string;
  logs: LogEntry[];
  quality?: QualityReport;
  revisionCount: number;
}

interface StepDefinition {
  id: number;
  key: string;
  title: string;
  engine: string;
  promptId: string;
  icon: React.ReactNode;
  description: string;
}

const STEPS: StepDefinition[] = [
  {
    id: 1,
    key: 'MISCONCEPTION_ENGINE',
    title: 'Misconception Engine',
    engine: 'Misconception Diagnosis',
    promptId: 'PROMPT MIS-01',
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    description: 'Surfaces learner false assumptions & cognitive traps'
  },
  {
    id: 2,
    key: 'MENTAL_MODEL_ENGINE',
    title: 'Mental Model Engine',
    engine: 'Conceptual Abstraction',
    promptId: 'PROMPT MM-01',
    icon: <Lightbulb className="w-4 h-4 text-yellow-400" />,
    description: 'Constructs intuitive analogies & visual metaphors'
  },
  {
    id: 3,
    key: 'SCENARIO_ENGINE',
    title: 'Scenario Engine',
    engine: 'Procedural Generation',
    promptId: 'PROMPT SCN-01',
    icon: <Compass className="w-4 h-4 text-emerald-400" />,
    description: 'Dynamically invents authentic environments & story seeds'
  },
  {
    id: 4,
    key: 'PATTERN_ENGINE',
    title: 'Pattern Engine',
    engine: 'Structural Extraction',
    promptId: 'PROMPT PAT-01',
    icon: <GitBranch className="w-4 h-4 text-cyan-400" />,
    description: 'Extracts reusable code patterns & transfer rules'
  },
  {
    id: 5,
    key: 'EPISODE_ENGINE',
    title: 'Episode Engine',
    engine: 'Pedagogical Sequencing',
    promptId: 'PROMPT EPI-01',
    icon: <ListTree className="w-4 h-4 text-indigo-400" />,
    description: 'Sequences step-by-step instructional journey'
  },
  {
    id: 6,
    key: 'PRODUCTION_ENGINE',
    title: 'Production Engine',
    engine: 'Format Rendering',
    promptId: 'PROMPT PRO-01',
    icon: <Package className="w-4 h-4 text-purple-400" />,
    description: 'Renders complete publication-ready deliverable'
  },
  {
    id: 7,
    key: 'QUALITY_ENGINE',
    title: 'Quality Engine',
    engine: 'Constitutional Verification',
    promptId: 'PROMPT QUA-01',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    description: 'Evaluates against Constitution & Learning Science'
  }
];

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  currentStatus,
  logs,
  quality,
  revisionCount
}) => {
  const getStepStatus = (stepKey: string, stepId: number) => {
    if (currentStatus === 'COMPLETED') return 'completed';
    if (currentStatus === 'FAILED') {
      const failingEngineMap: Record<string, number> = {
        Misconception: 1,
        MentalModel: 2,
        Scenario: 3,
        Pattern: 4,
        Episode: 5,
        Production: 6,
        None: 7
      };
      const failedId = quality?.failingEngine ? (failingEngineMap[quality.failingEngine] || 1) : 1;
      if (stepId === failedId) return 'failed';
      if (stepId < failedId) return 'completed';
      return 'pending';
    }
    if (currentStatus === stepKey) return 'active';
    if (currentStatus === 'REVISING' && stepId >= 6) return 'revising';

    // Map order
    const statusOrder: Record<string, number> = {
      INITIALIZING: 0,
      MISCONCEPTION_ENGINE: 1,
      MENTAL_MODEL_ENGINE: 2,
      SCENARIO_ENGINE: 3,
      PATTERN_ENGINE: 4,
      EPISODE_ENGINE: 5,
      PRODUCTION_ENGINE: 6,
      QUALITY_ENGINE: 7,
      COMPLETED: 8
    };

    const currentOrder = statusOrder[currentStatus] || 0;
    if (currentOrder > stepId) return 'completed';
    return 'pending';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">PyBe Runtime Orchestrator Pipeline</h3>
            <p className="text-xs text-slate-400">Strict Immutable 7-Step Reasoning Sequence</p>
          </div>
        </div>

        {revisionCount > 0 && (
          <div className="flex items-center space-x-1.5 bg-amber-950/80 text-amber-300 text-xs px-3 py-1 rounded-lg border border-amber-800 font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>Revision Iteration #{revisionCount}</span>
          </div>
        )}
      </div>

      {/* 7-Step Visual Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {STEPS.map((s) => {
          const status = getStepStatus(s.key, s.id);
          return (
            <div
              key={s.id}
              className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                status === 'completed'
                  ? 'bg-slate-800/80 border-emerald-500/50 text-slate-200'
                  : status === 'active'
                  ? 'bg-indigo-950/80 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                  : status === 'failed'
                  ? 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500/30'
                  : status === 'revising'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider opacity-70">
                    Step {s.id}
                  </span>
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : status === 'active' ? (
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  ) : status === 'failed' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 opacity-40" />
                  )}
                </div>

                <div className="flex items-center space-x-1.5 font-bold mb-1 truncate text-slate-200">
                  {s.icon}
                  <span className="truncate">{s.title.replace(' Engine', '')}</span>
                </div>

                <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {s.description}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/60 font-mono text-[9px] text-slate-400 truncate">
                {s.promptId}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality Score Bar if complete */}
      {quality && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                quality.status === 'PASS'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {quality.overallScore}%
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>Quality Gate Status:</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    quality.status === 'PASS'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {quality.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{quality.reviewNotes}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Constitution</span>
              <span className="font-bold text-emerald-400">{quality.constitutionScore}/100</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Learning Science</span>
              <span className="font-bold text-purple-400">{quality.learningScienceScore}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Live Logs Terminal Drawer */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            Runtime Execution Trace
          </span>
          <span>{logs.length} Log Entries</span>
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1 pr-2">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic py-2">Waiting for pipeline execution start...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2 text-[11px]">
                <span className="text-slate-600 select-none">[{log.timestamp.split('T')[1].slice(0, 8)}]</span>
                <span className="text-indigo-400 font-bold shrink-0">[{log.step}]</span>
                <span
                  className={
                    log.level === 'error'
                      ? 'text-rose-400'
                      : log.level === 'warn'
                      ? 'text-amber-300'
                      : log.level === 'success'
                      ? 'text-emerald-300'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
