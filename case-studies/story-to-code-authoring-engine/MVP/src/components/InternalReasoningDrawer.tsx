import React, { useState } from 'react';
import {
  Brain,
  AlertTriangle,
  Lightbulb,
  Compass,
  GitBranch,
  ListTree,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { EducationalAnalysis, QualityReport } from '../types';

interface InternalReasoningDrawerProps {
  analysis?: EducationalAnalysis;
  quality?: QualityReport;
  executionId?: string;
  revisionCount?: number;
}

function renderSafeText(val: any): React.ReactNode {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  if (Array.isArray(val)) {
    return (
      <span className="space-y-1 block">
        {val.map((v, i) => (
          <span key={i} className="block">• {typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
        ))}
      </span>
    );
  }
  if (typeof val === 'object') {
    return (
      <span className="space-y-1 block">
        {Object.entries(val).map(([k, v]) => (
          <span key={k} className="block">• <strong className="capitalize text-slate-200">{k}:</strong> {typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
        ))}
      </span>
    );
  }
  return String(val);
}

export const InternalReasoningDrawer: React.FC<InternalReasoningDrawerProps> = ({
  analysis,
  quality,
  executionId,
  revisionCount
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'misconceptions' | 'mentalModel' | 'scenarios' | 'patterns' | 'episodes' | 'quality'>('misconceptions');

  if (!analysis) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100">
      {/* Drawer Bar Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-sm">PyBe Internal Educational Reasoning Context</h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                {executionId || 'Internal State'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hidden 7-step reasoning steps preserved for auditability and educational debugging
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border border-slate-700"
        >
          {isOpen ? (
            <>
              <EyeOff className="w-4 h-4 text-purple-400" />
              <span>Hide Reasoning Drawer</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Inspect Reasoning State</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="p-6">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 mb-6">
            <button
              onClick={() => setActiveTab('misconceptions')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'misconceptions'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Misconceptions ({(analysis.misconceptions || []).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('mentalModel')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'mentalModel'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
              <span>Mental Model ({analysis.mentalModel ? 1 : 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('scenarios')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'scenarios'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Procedural Scenarios ({(analysis.scenarios || []).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('patterns')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'patterns'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>Patterns ({(analysis.patterns || []).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('episodes')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'episodes'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ListTree className="w-3.5 h-3.5 text-indigo-400" />
              <span>Episodes ({(analysis.episodes || []).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('quality')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'quality'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quality Report ({quality ? 1 : 0})</span>
            </button>
          </div>

          {/* Tab Content */}

          {/* MISCONCEPTIONS TAB */}
          {activeTab === 'misconceptions' && (
            <div className="space-y-3">
              {(analysis.misconceptions || []).map((m, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-sm">{renderSafeText(m.misconception)}</span>
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                        Severity: {renderSafeText(m.severity)}
                      </span>
                      <span className="bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                        Prob: {renderSafeText(m.probability)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-emerald-400">Correction Strategy:</strong> {renderSafeText(m.correctionStrategy)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* MENTAL MODEL TAB */}
          {activeTab === 'mentalModel' && (
            analysis.mentalModel ? (
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-950/80 border border-yellow-800/60 px-2 py-0.5 rounded uppercase tracking-wider">
                      Target Mental Model (1)
                    </span>
                    <h4 className="text-base font-bold text-yellow-300">{renderSafeText(analysis.mentalModel.modelName)}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                    CL-07 Constitutional Analogy
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">{renderSafeText(analysis.mentalModel.description)}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-purple-400 block text-xs">Core Analogy</span>
                    <div className="text-slate-300 leading-relaxed block">{renderSafeText(analysis.mentalModel.coreAnalogy)}</div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-cyan-400 block text-xs">Visualization Strategy</span>
                    <div className="text-slate-300 leading-relaxed block">{renderSafeText(analysis.mentalModel.visualizationStrategy)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl text-center text-xs text-slate-400">
                Mental Model Engine initializing or processing...
              </div>
            )
          )}

          {/* SCENARIOS TAB */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              {(analysis.scenarios || []).map((s, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 font-mono">{renderSafeText(s.scenarioId)}</span>
                    {s.characters && s.characters.length > 0 && (
                      <span className="text-slate-400 text-[11px]">
                        Characters: {renderSafeText(s.characters.join(', '))}
                      </span>
                    )}
                  </div>

                  <div>
                    <strong className="text-slate-300 block mb-0.5">Procedural Setting & Context:</strong>
                    <div className="text-slate-400">{renderSafeText(s.context)}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
                    <div>
                      <strong className="text-rose-300 block mb-0.5">Problem / Dilemma:</strong>
                      <div className="text-slate-300">{renderSafeText(s.problem)}</div>
                    </div>
                    <div>
                      <strong className="text-indigo-300 block mb-0.5">Concept Mapping:</strong>
                      <div className="text-slate-300">{renderSafeText(s.conceptMapping)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PATTERNS TAB */}
          {activeTab === 'patterns' && (
            <div className="space-y-4">
              {(analysis.patterns || []).map((p, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-sm">{renderSafeText(p.patternName)} ({renderSafeText(p.patternId)})</span>
                  </div>

                  <div className="text-slate-300">
                    <strong className="text-indigo-400">Rule / Invariant:</strong> {renderSafeText(p.rule)}
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
                    {renderSafeText(p.example)}
                  </div>

                  <div className="text-slate-400 text-[11px]">
                    <strong className="text-purple-400">Transfer Opportunity:</strong> {renderSafeText(p.transferOpportunity)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EPISODES TAB */}
          {activeTab === 'episodes' && (
            <div className="space-y-3">
              {(analysis.episodes || []).map((e, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300">
                      Episode {renderSafeText(e.episodeNumber)}: {renderSafeText(e.title)}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{renderSafeText(e.estimatedTime)}</span>
                  </div>

                  <p className="text-slate-300">
                    <strong className="text-purple-400">Objective:</strong> {renderSafeText(e.objective)}
                  </p>

                  <p className="text-slate-400">
                    <strong className="text-slate-300">Teaching Flow:</strong> {renderSafeText(e.teachingFlow)}
                  </p>

                  <p className="text-slate-500 italic text-[11px]">
                    Transition: {renderSafeText(e.transition)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* QUALITY REPORT TAB */}
          {activeTab === 'quality' && quality && (
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Constitutional Quality Review</h4>
                  <p className="text-slate-400">{quality.reviewNotes}</p>
                </div>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-lg ${
                    quality.status === 'PASS'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {quality.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Constitution Alignment</span>
                  <span className="text-lg font-bold text-emerald-400">{quality.constitutionScore}/100</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Learning Science Score</span>
                  <span className="text-lg font-bold text-purple-400">{quality.learningScienceScore}/100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
