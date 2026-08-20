import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { LesForm } from './components/LesForm';
import { PipelineTracker } from './components/PipelineTracker';
import { DeliverableViewer } from './components/DeliverableViewer';
import { InternalReasoningDrawer } from './components/InternalReasoningDrawer';
import { AmbientBackground } from './components/AmbientBackground';
import {
  LearningRequest,
  Production,
  EducationalAnalysis,
  QualityReport,
  LogEntry
} from './types';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[React Error Boundary Caught]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900 border border-rose-800/80 rounded-3xl p-8 max-w-2xl mx-auto my-auto text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="p-3 bg-rose-950/80 border border-rose-700/60 rounded-2xl text-rose-400 w-fit mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Rendering Error Prevented</h3>
          <p className="text-xs text-rose-300 bg-rose-950/50 p-3 rounded-xl border border-rose-900/60 font-mono text-left overflow-x-auto max-h-32">
            {this.state.error?.message || 'An unexpected rendering error occurred in the viewer.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all"
            >
              Try Re-rendering View
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-5 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              Return to Intake Form
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [serverStatus, setServerStatus] = useState<'connected' | 'busy' | 'offline'>('connected');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('IDLE');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [production, setProduction] = useState<Production | null>(null);
  const [educationalAnalysis, setEducationalAnalysis] = useState<EducationalAnalysis | undefined>(undefined);
  const [quality, setQuality] = useState<QualityReport | undefined>(undefined);
  const [revisionCount, setRevisionCount] = useState<number>(0);
  const [executionId, setExecutionId] = useState<string>('');
  const [lastTopic, setLastTopic] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Phase State: INTAKE -> PIPELINE -> STUDIO
  const [activePhase, setActivePhase] = useState<'INTAKE' | 'PIPELINE' | 'STUDIO'>('INTAKE');

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setServerStatus('connected');
      })
      .catch(() => setServerStatus('offline'));
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSubmitRequest = async (request: LearningRequest, includeReasoning: boolean) => {
    setIsGenerating(true);
    setServerStatus('busy');
    setCurrentStatus('INITIALIZING');
    setActivePhase('PIPELINE'); // Automatically switch to Phase 2 (Pipeline Execution)

    setLogs([
      {
        timestamp: new Date().toISOString(),
        step: 'NORMALIZATION',
        message: `Normalizing Learning Request [Form: ${request.isSimpleForm ? 'Simple' : 'Advanced'}]...`
      }
    ]);
    setProduction(null);
    setEducationalAnalysis(undefined);
    setQuality(undefined);
    setRevisionCount(0);
    setLastTopic(request.topic);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/cklis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...request,
          includeReasoning
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Pipeline execution failed.');
      }

      const data = await response.json();

      setExecutionId(data.executionId);
      setCurrentStatus(data.status || 'COMPLETED');
      setProduction(data.production);
      setQuality(data.quality);

      if (data.educationalAnalysis) {
        setEducationalAnalysis(data.educationalAnalysis);
      }
      if (data.logs) {
        setLogs(data.logs);
      }
      if (data.revisionCount !== undefined) {
        setRevisionCount(data.revisionCount);
      }

      setServerStatus('connected');
      if (data.status === 'FAILED') {
        setCurrentStatus('FAILED');
        setErrorMessage(data.quality?.reviewNotes || 'Pipeline halted due to step failure.');
        setActivePhase('PIPELINE');
      } else {
        setCurrentStatus('COMPLETED');
        setActivePhase('STUDIO'); // Automatically advance to Phase 3 on success
      }
    } catch (err) {
      console.error('[PyBe App Error]:', err);
      setErrorMessage((err as Error).message);
      setCurrentStatus('FAILED');
      setActivePhase('PIPELINE');
      setServerStatus('connected');
    } finally {
      setIsGenerating(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`h-screen w-screen overflow-hidden font-sans selection:bg-indigo-500 selection:text-white flex flex-col relative transition-colors duration-500 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* Fullscreen Ambient Video Background & Sound Control */}
      <AmbientBackground theme={theme} onToggleTheme={toggleTheme} />

      {/* Fixed Header Bar with Phase Navigation */}
      <Header
        serverStatus={serverStatus}
        theme={theme}
        activePhase={activePhase}
        onSelectPhase={setActivePhase}
        hasProduction={!!production}
      />

      {/* Main Container Viewport Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 relative z-10 overflow-y-auto flex flex-col justify-start pb-16 scrollbar-thin">
        {/* Error Alert Overlay */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 bg-rose-950/90 border border-rose-800/90 text-rose-200 p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-2xl shrink-0 backdrop-blur-xl z-20"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong>Execution Error:</strong> {errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white text-xs underline font-bold"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase-Based Content Container with ErrorBoundary */}
        <div className="flex-1 relative flex flex-col min-h-0">
          <ErrorBoundary onReset={() => setActivePhase('INTAKE')}>
            <AnimatePresence mode="wait">
              {/* PHASE 1: INTAKE STUDIO */}
              {activePhase === 'INTAKE' && (
                <motion.div
                  key="INTAKE"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl mx-auto my-auto py-4 flex flex-col"
                >
                  {/* PyBe Welcome Header */}
                  <div className="mb-4 text-center shrink-0">
                    <div className={`inline-flex items-center space-x-2 border px-3.5 py-1 rounded-full text-xs font-bold mb-2 backdrop-blur-md shadow-md ${
                      isDark
                        ? 'bg-slate-900/90 text-indigo-300 border-indigo-500/40'
                        : 'bg-white/90 text-indigo-800 border-indigo-300'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>PyBe v2.0 • Educational Intelligence System</span>
                    </div>
                    <h2 className={`text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md ${
                      isDark ? 'text-white' : 'text-slate-950 font-extrabold'
                    }`}>
                      Transform Concepts into Visual Deliverables
                    </h2>
                    <p className={`text-xs sm:text-sm mt-1 max-w-xl mx-auto ${
                      isDark ? 'text-slate-200' : 'text-slate-800 font-semibold'
                    }`}>
                      Enter your learning goal below to trigger the 7-step PyBe educational reasoning engine.
                    </p>
                  </div>

                  {/* Form Component */}
                  <div className="w-full flex-1">
                    <LesForm onSubmit={handleSubmitRequest} isLoading={isGenerating} theme={theme} />
                  </div>
                </motion.div>
              )}

              {/* PHASE 2: LIVE REASONING MATRIX */}
              {activePhase === 'PIPELINE' && (
                <motion.div
                  key="PIPELINE"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-center max-w-5xl mx-auto w-full my-auto overflow-y-auto py-2"
                >
                  <PipelineTracker
                    currentStatus={currentStatus}
                    logs={logs}
                    quality={quality}
                    revisionCount={revisionCount}
                  />

                  {/* Direct Action Link when complete */}
                  {production && (
                    <div className="mt-4 text-center shrink-0">
                      <button
                        type="button"
                        onClick={() => setActivePhase('STUDIO')}
                        className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-xl shadow-emerald-600/30 transition-all hover:scale-105"
                      >
                        <span>View PyBe Studio Deliverable</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* PHASE 3: STUDIO DELIVERABLE */}
              {activePhase === 'STUDIO' && production && (
                <motion.div
                  key="STUDIO"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-between space-y-3 overflow-hidden"
                >
                  <DeliverableViewer production={production} quality={quality} topic={lastTopic} />

                  {/* Drawer Toggle for Internal Reasoning */}
                  {educationalAnalysis && (
                    <div className="shrink-0">
                      <InternalReasoningDrawer
                        analysis={educationalAnalysis}
                        quality={quality}
                        executionId={executionId}
                        revisionCount={revisionCount}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
