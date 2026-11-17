import React, { useState, useMemo, Component } from 'react';
import { parseModuleMD } from '../utils/moduleParser';
import ContentRenderer from './ContentRenderer';
import { rawModuleText } from '../data/moduleContent';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

/**
 * Component to display Left Pane Image with automatic fallback to placeholder if error occurs
 */
function LeftPaneImage({ src }) {
  const [hasError, setHasError] = useState(false);

  const getImageFilename = (path) => {
    if (!path) return 'image-placeholder.png';
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  };

  if (hasError || !src) {
    return (
      <div className="w-full max-w-lg aspect-video h-64 bg-slate-800 border border-dashed border-slate-600 flex flex-col items-center justify-center text-slate-500 text-sm rounded-md p-6 shadow-inner transition-all">
        <span className="font-mono text-slate-400 text-base font-medium">
          {getImageFilename(src)}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg flex items-center justify-center p-2">
      <img
        src={src}
        alt={getImageFilename(src)}
        onError={() => setHasError(true)}
        className="w-full h-auto max-h-[70vh] aspect-video object-contain rounded-lg border border-slate-700/80 shadow-2xl transition-all"
      />
    </div>
  );
}

/**
 * Error Boundary for catching rendering errors in Zone B content
 */
class ContentErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ContentRenderer Error:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentBeat !== this.props.currentBeat) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-950/80 border border-red-500 rounded-xl text-red-200 my-4 shadow-xl">
          <div className="flex items-center gap-2 text-red-400 font-bold text-lg mb-2">
            <AlertTriangle className="w-5 h-5" />
            Content Rendering Error
          </div>
          <p className="text-sm text-red-300 font-mono">
            {this.state.error?.message || 'An error occurred while displaying beat content.'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ModuleView({
  content = rawModuleText,
  currentBeat = 1,
  onBeatChange,
  onBackToModules
}) {
  // Solved state tracking per beat number
  const [solvedBeats, setSolvedBeats] = useState({});

  // Parse markdown into beat array
  const beats = useMemo(() => parseModuleMD(content), [content]);

  const totalBeats = beats.length > 0 ? (beats[0].totalBeats || beats.length) : 18;
  const currentBeatIndex = Math.min(Math.max(1, currentBeat), totalBeats) - 1;
  const beatData = beats[currentBeatIndex] || {
    beatNumber: currentBeat,
    totalBeats: 18,
    leftPane: { type: 'text', content: '' },
    rightPaneHtml: '',
    hasMcq: false
  };

  const isCurrentMcqSolved = !beatData.hasMcq || !!solvedBeats[currentBeat];

  const handleMcqSolved = () => {
    setSolvedBeats((prev) => ({
      ...prev,
      [currentBeat]: true
    }));
  };

  const handleNext = () => {
    if (currentBeat < totalBeats) {
      onBeatChange(currentBeat + 1);
    }
  };

  const handlePrev = () => {
    if (currentBeat > 1) {
      onBeatChange(currentBeat - 1);
    }
  };

  return (
    <div className="flex w-full h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans">
      {/* Left Section (40vw) */}
      <section className="w-[40vw] h-screen flex flex-col justify-center items-center px-8 bg-slate-950 border-r border-slate-800/80 relative select-none">
        {beatData.leftPane.type === 'image' ? (
          <LeftPaneImage key={beatData.leftPane.src} src={beatData.leftPane.src} />
        ) : (
          <div className="w-full max-w-md text-center">
            <ContentErrorBoundary currentBeat={currentBeat}>
              <ContentRenderer htmlString={beatData.leftPane.content} />
            </ContentErrorBoundary>
          </div>
        )}
      </section>

      {/* Right Section (60vw) */}
      <section className="w-[40vw] sm:w-[60vw] h-screen flex flex-col p-12 relative bg-slate-900 justify-between">
        {/* Zone A: Top Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 select-none shrink-0">
          <button
            onClick={onBackToModules}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            id="back-to-modules-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Modules
          </button>
          <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
            Beat {currentBeat} of {totalBeats}
          </span>
        </div>

        {/* Zone B: Main Content (flex-1 flex flex-col justify-start pt-6 overflow-y-auto) */}
        <div className="flex-1 flex flex-col justify-start pt-6 overflow-y-auto">
          <ContentErrorBoundary currentBeat={currentBeat}>
            <ContentRenderer
              key={currentBeat}
              htmlString={beatData.rightPaneHtml}
              onAnswerCorrect={handleMcqSolved}
            />
          </ContentErrorBoundary>
        </div>

        {/* Zone C: Bottom Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-700/80 mt-auto select-none shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentBeat === 1}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            id="prev-beat-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentBeat === totalBeats ? (
            <button
              onClick={onBackToModules}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-green-900/30 transition-all cursor-pointer"
              id="finish-module-btn"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finish Module
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isCurrentMcqSolved}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-blue-900/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              id="next-beat-btn"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
