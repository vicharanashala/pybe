import React, { useState } from 'react';
import Markdown from 'react-markdown';
import {
  Copy,
  Check,
  Download,
  BookOpen,
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  User,
  MessageSquare,
  Image as ImageIcon,
  Tv,
  Layers,
  Award,
  CheckCircle,
  Code
} from 'lucide-react';
import { Production, QualityReport, ComicPanelItem } from '../types';

interface DeliverableViewerProps {
  production: Production;
  quality?: QualityReport;
  topic: string;
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
          <span key={k} className="block">• <strong className="capitalize text-indigo-300">{k}:</strong> {typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
        ))}
      </span>
    );
  }
  return String(val);
}

export const DeliverableViewer: React.FC<DeliverableViewerProps> = ({ production, quality, topic }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'MARKDOWN' | 'BLUEPRINT'>('VISUAL');
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);

  const panels: ComicPanelItem[] = Array.isArray(production.blueprint?.panels) ? production.blueprint.panels : [];
  const safeIndex = Math.min(currentPanelIndex, Math.max(0, panels.length - 1));
  const activePanel = panels[safeIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(production.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([production.content || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${(production.deliverableType || 'deliverable').toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderVisualPanels = () => {
    const isStorybook = (production.blueprint?.type === 'storybook' || production.deliverableType === 'Storybook');

    if (isStorybook && panels.length > 0 && activePanel) {
      return (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Storybook Scene Illustration Card */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full bg-slate-950/90 border border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden group">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Scene {activePanel.panelNumber || safeIndex + 1} Illustration
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Copy Full Package: Image Prompt + Dialogue Overlay"
                      onClick={() => {
                        const fullPkg = `[SCENE ${activePanel.panelNumber || safeIndex + 1} AI IMAGE PROMPT PACKAGE]\n\nIMAGE GENERATION PROMPT:\n${activePanel.imagePrompt}\n\nEMBEDDED CHARACTER DIALOGUE / SPEECH BALLOON:\n"${activePanel.speechBubble || ''}"\n\nVISUAL SCENE ACTION:\n${activePanel.purpose || ''} — ${activePanel.characterEmotion || ''}`;
                        navigator.clipboard.writeText(fullPkg);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied Full!' : 'Copy Full Pkg'}</span>
                    </button>

                    <button
                      type="button"
                      title="Copy Visual Prompt Only"
                      onClick={() => {
                        navigator.clipboard.writeText(activePanel.imagePrompt || '');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border border-slate-700"
                    >
                      <Copy className="w-3 h-3 text-amber-400" />
                      <span>Prompt Only</span>
                    </button>
                  </div>
                </div>

                {/* AI Image Generation Prompt Box */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 italic leading-relaxed">
                  "{activePanel.imagePrompt && activePanel.imagePrompt.trim().length > 5 
                    ? activePanel.imagePrompt 
                    : `Self-contained educational illustration for Scene ${activePanel.panelNumber || safeIndex + 1} (${activePanel.purpose || 'Story Progression'}). High detail, watercolor storybook style, 4K.`}"
                </div>

                {/* Visual Speech & Action Preview Badge for Lazy Readers */}
                {activePanel.speechBubble && (
                  <div className="bg-indigo-950/80 border border-indigo-500/40 p-3 rounded-xl text-xs space-y-1 shadow-inner">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      <MessageSquare className="w-3 h-3 text-indigo-400" />
                      Visual Speech Balloon Embedded in Image
                    </div>
                    <p className="text-xs font-semibold text-white italic">
                      "{renderSafeText(activePanel.speechBubble)}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Storybook Narrative & Action Button */}
            <div className="md:col-span-7 space-y-5 text-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {renderSafeText(activePanel.purpose || `Chapter ${safeIndex + 1}`)}
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {renderSafeText(production.title)}
                </h2>
              </div>

              <div className="space-y-3 text-sm text-slate-200 leading-relaxed font-serif">
                <p className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 leading-relaxed">
                  {renderSafeText(
                    (activePanel.narrationBox && String(activePanel.narrationBox).trim().length > 5)
                      ? activePanel.narrationBox
                      : activePanel.storyProgress || activePanel.learningPurpose || `Chapter ${safeIndex + 1}: The narrative progresses through key physical events.`
                  )}
                </p>

                {activePanel.speechBubble && (
                  <div className="bg-indigo-950/60 border border-indigo-500/30 p-4 rounded-2xl font-sans text-xs text-indigo-200 italic">
                    💬 <strong>Dialogue:</strong> "{renderSafeText(activePanel.speechBubble)}"
                  </div>
                )}

                {/* Educational Code Concept Bridge Badge */}
                {activePanel.educationalGraphic && (
                  <div className="bg-amber-950/50 border border-amber-500/40 p-3.5 rounded-2xl font-sans text-xs text-amber-200 flex items-start gap-2.5 shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">Code Concept Bridge:</strong> {renderSafeText(activePanel.educationalGraphic)}
                    </div>
                  </div>
                )}

                {/* Executable Code Snippet Card */}
                {activePanel.codeSnippet && (
                  <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 font-sans space-y-2">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-mono font-bold">
                      <span className="flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-emerald-400" /> Python Code Implementation
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(typeof activePanel.codeSnippet === 'string' ? activePanel.codeSnippet : JSON.stringify(activePanel.codeSnippet || ''));
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-[10px] text-slate-400 hover:text-emerald-300 transition-colors"
                      >
                        {copied ? 'Copied Code!' : 'Copy Code'}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-emerald-300 bg-slate-900/90 p-3 rounded-xl overflow-x-auto border border-slate-800">
                      <code>{renderSafeText(activePanel.codeSnippet)}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Green Confirmation Button */}
              <button
                type="button"
                onClick={() => setCurrentPanelIndex((prev) => Math.min(panels.length - 1, prev + 1))}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>I understood the story</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (panels.length > 0 && activePanel) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Panel Visual Scene Prompt */}
          <div className="md:col-span-7 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Panel {renderSafeText(activePanel.panelNumber || safeIndex + 1)} of {panels.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('MARKDOWN')}
                  className="bg-emerald-600/30 hover:bg-emerald-600/60 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>📜 View Full Script</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(typeof activePanel.imagePrompt === 'string' ? activePanel.imagePrompt : JSON.stringify(activePanel.imagePrompt || ''));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-500/40 text-indigo-200 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied Prompt!' : 'Copy AI Prompt'}</span>
                </button>
                <span className="text-xs bg-slate-900 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full">
                  {renderSafeText(activePanel.purpose || 'Story Scene')}
                </span>
              </div>
            </div>

            {/* Panel Composition & Visual Art Directives */}
            <div className="my-4 space-y-3">
              <div className="bg-slate-900/80 border border-indigo-500/20 p-4 rounded-xl">
                <div className="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Copyable AI Image Prompt
                </div>
                <p className="text-xs font-mono text-indigo-200 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {renderSafeText(activePanel.imagePrompt)}
                </p>
              </div>

              {activePanel.characterEmotion && (
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Character Emotion: <strong>{renderSafeText(activePanel.characterEmotion)}</strong></span>
                </div>
              )}
            </div>

            {/* Narration Box */}
            {activePanel.narrationBox && (
              <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-xs font-medium italic">
                📜 <strong>Narrator:</strong> {renderSafeText(activePanel.narrationBox)}
              </div>
            )}
          </div>

          {/* Right Column: Character Speech, Learning Purpose & Code Concept Bridge */}
          <div className="md:col-span-5 space-y-4">
            {/* Dialogue Bubble Card */}
            {activePanel.speechBubble ? (
              <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 p-5 rounded-2xl shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Character Dialogue
                </div>
                <div className="bg-slate-900/90 border border-indigo-500/30 p-3.5 rounded-xl text-sm font-semibold text-white leading-snug">
                  "{renderSafeText(activePanel.speechBubble)}"
                </div>
              </div>
            ) : null}

            {/* Educational Objective for this panel */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pedagogical Purpose
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {renderSafeText(activePanel.learningPurpose || activePanel.storyProgress || 'Introduces concept analogy and engages learner.')}
              </p>
            </div>

            {/* Educational Code Concept Bridge Badge */}
            {activePanel.educationalGraphic && (
              <div className="bg-amber-950/50 border border-amber-500/40 p-3.5 rounded-2xl font-sans text-xs text-amber-200 flex items-start gap-2.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Code Concept Invariant:</strong> {renderSafeText(activePanel.educationalGraphic)}
                </div>
              </div>
            )}

            {/* Executable Code Snippet Card */}
            {activePanel.codeSnippet && (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 font-sans space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-mono font-bold">
                  <span className="flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-emerald-400" /> Python Code Implementation
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(typeof activePanel.codeSnippet === 'string' ? activePanel.codeSnippet : JSON.stringify(activePanel.codeSnippet || ''));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[10px] text-slate-400 hover:text-emerald-300 transition-colors"
                  >
                    {copied ? 'Copied Code!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="text-xs font-mono text-emerald-300 bg-slate-900/90 p-3 rounded-xl overflow-x-auto border border-slate-800">
                  <code>{renderSafeText(activePanel.codeSnippet)}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="prose prose-invert prose-indigo max-w-none p-4">
        <Markdown>{typeof production.content === 'string' ? production.content : String(production.content || '')}</Markdown>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col h-[calc(100vh-140px)] max-h-[800px]">
      {/* Top Header Bar */}
      <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] bg-indigo-950 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-800">
                PyBe Studio Outcome • {production.deliverableType}
              </span>
              {quality && (
                <span className="text-[11px] bg-emerald-950/90 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  Quality Gate: {quality.qualityLevel || 'Q3'} ({quality.overallScore}%)
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5 truncate max-w-md">{production.title}</h2>
          </div>
        </div>

        {/* Deliverable View Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('VISUAL')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'VISUAL'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Viewer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MARKDOWN')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'MARKDOWN'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>📜 Full Script</span>
          </button>
          {production.blueprint && (
            <button
              type="button"
              onClick={() => setActiveTab('BLUEPRINT')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'BLUEPRINT'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>🏛️ Full Blueprint</span>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 text-xs font-semibold transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Container View Area */}
      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === 'VISUAL' && (
          <div className="h-full flex flex-col justify-between space-y-6">
            {renderVisualPanels()}

            {/* Panel Carousel Navigation Bar */}
            {panels.length > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setCurrentPanelIndex((prev) => Math.max(0, prev - 1))}
                  disabled={safeIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs font-bold text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Scene</span>
                </button>

                {/* Panel Dots Stepper */}
                <div className="flex items-center space-x-2">
                  {panels.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPanelIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        safeIndex === idx
                          ? 'w-8 bg-indigo-500 shadow-lg shadow-indigo-500/50'
                          : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                      }`}
                      title={`Scene ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPanelIndex((prev) => Math.min(panels.length - 1, prev + 1))}
                  disabled={safeIndex === panels.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs font-bold text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <span>Next Scene</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Full Markdown Script */}
        {activeTab === 'MARKDOWN' && (
          <div className="prose prose-invert prose-indigo max-w-none text-slate-200 p-2">
            <Markdown>{typeof production.content === 'string' ? production.content : String(production.content || '')}</Markdown>
          </div>
        )}

        {/* Tab 3: Production Blueprint */}
        {activeTab === 'BLUEPRINT' && (
          <div className="space-y-6">
            {production.blueprint ? (
              <>
                {/* Story Overview Header Card */}
                {production.blueprint.storyOverview && (
                  <div className="bg-slate-950/80 border border-amber-500/30 p-6 rounded-2xl space-y-2 shadow-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      Full Story Overview & Narrative Arc
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-serif">
                      {renderSafeText(production.blueprint.storyOverview)}
                    </div>
                  </div>
                )}

                {/* Character & Environment Bibles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {production.blueprint.characterBible && (
                    <div className="bg-slate-950/80 border border-indigo-500/30 p-6 rounded-2xl space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        <User className="w-4 h-4 text-indigo-400" />
                        Character Bible
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                        {renderSafeText(production.blueprint.characterBible)}
                      </div>
                    </div>
                  )}

                  {production.blueprint.environmentBible && (
                    <div className="bg-slate-950/80 border border-emerald-500/30 p-6 rounded-2xl space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                        Environment & World-Building Bible
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                        {renderSafeText(production.blueprint.environmentBible)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Raw Blueprint Specification */}
                {production.blueprint.markdownBlueprint && (
                  <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-purple-400" />
                      Production Blueprint Specification
                    </div>
                    <pre className="text-[11px] font-mono text-slate-300 bg-slate-900 p-4 rounded-xl overflow-x-auto border border-slate-800">
                      {renderSafeText(production.blueprint.markdownBlueprint)}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-slate-950/80 border border-slate-800 p-8 rounded-2xl text-center space-y-3">
                <Layers className="w-8 h-8 text-indigo-400 mx-auto opacity-60" />
                <h4 className="text-sm font-bold text-white">Production Blueprint Specifications</h4>
                <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                  The complete character bible, visual staging parameters, and environment specifications for this {production.deliverableType || 'Deliverable'} are embedded directly within the script deliverable.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
