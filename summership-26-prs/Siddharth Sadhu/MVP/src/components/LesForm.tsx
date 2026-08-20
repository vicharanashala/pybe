import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Users,
  Compass,
  SlidersHorizontal,
  Wand2,
  Eye,
  Target
} from 'lucide-react';
import { LearningRequest } from '../types';

interface LesFormProps {
  onSubmit: (request: LearningRequest, includeReasoning: boolean) => void;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

const SAMPLE_PRESETS: (Partial<LearningRequest> & { label?: string })[] = [
  {
    topic: 'What is an If-Else Statement',
    experienceHints: 'Indian Historical Places',
    representation: 'Short Comic (1-Page)',
    inputMode: 'topic'
  },
  {
    topic: 'Recursion Base Cases & Call Stack Unwinding',
    experienceHints: 'Space Exploration',
    representation: 'Video Script',
    inputMode: 'topic'
  },
  {
    topic: 'SQL INNER JOIN vs LEFT JOIN',
    experienceHints: 'Detective Mystery',
    representation: 'Long Comic (Multi-Page)',
    inputMode: 'topic'
  },
  {
    topic: 'State Transitions & Accumulator Loops',
    userObservation: 'The Thirsty Crow Fable',
    experienceHints: 'Everyday Life',
    representation: 'Storybook',
    inputMode: 'experience',
    conceptSelectionMode: 'auto',
    label: 'The Thirsty Crow (Story-First)'
  }
];

export const LesForm: React.FC<LesFormProps> = ({ onSubmit, isLoading, theme }) => {
  const [isAdvanced, setIsAdvanced] = useState(false);

  // Dual Intake Mode: 'topic' (Topic-First) vs 'experience' (Experience-First)
  const [inputMode, setInputMode] = useState<'topic' | 'experience'>('topic');

  // Core Form Fields (No pre-filled hardcoded inputs — clean empty state with placeholders)
  const [topic, setTopic] = useState('');
  const [userObservation, setUserObservation] = useState('');
  const [conceptSelectionMode, setConceptSelectionMode] = useState<'auto' | 'custom'>('auto');
  const [customConcept, setCustomConcept] = useState('');

  const audience = 'Learner — Knowledge is for everyone';
  const [environment, setEnvironment] = useState('');

  // Advanced Form Fields
  const [representation, setRepresentation] = useState('Short Comic (1-Page)');
  const [programmingLanguage, setProgrammingLanguage] = useState('Python');
  const [experienceConstraints, setExperienceConstraints] = useState('Beginner friendly, 100% real-world physical/historical accuracy');
  const [selectedProvider, setSelectedProvider] = useState<'auto' | 'kimi' | 'groq' | 'minimax' | 'gemini'>('auto');
  const [includeReasoning, setIncludeReasoning] = useState(true);

  const handleApplyPreset = (preset: Partial<LearningRequest> & { label?: string }) => {
    if (preset.inputMode) setInputMode(preset.inputMode);
    if (preset.topic) {
      setTopic(preset.topic);
      setCustomConcept(preset.topic);
    }
    if (preset.userObservation) setUserObservation(preset.userObservation);
    if (preset.conceptSelectionMode) setConceptSelectionMode(preset.conceptSelectionMode);
    if (preset.experienceHints) setEnvironment(preset.experienceHints);
    if (preset.representation) setRepresentation(preset.representation);
  };

  const handleSurpriseMe = () => {
    setEnvironment('Surprise Me!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalTopic = topic.trim();
    if (inputMode === 'experience') {
      if (!userObservation.trim()) return;
      if (conceptSelectionMode === 'custom' && customConcept.trim()) {
        finalTopic = customConcept.trim();
      } else if (topic.trim() && topic.trim() !== userObservation.trim()) {
        finalTopic = topic.trim();
      } else {
        finalTopic = topic.trim() || userObservation.trim();
      }
    } else {
      if (!finalTopic) return;
    }

    const request: LearningRequest = {
      topic: finalTopic,
      audience,
      experienceHints: environment || 'Surprise Me!',
      representation,
      desiredOutput: representation,
      programmingLanguage,
      teachingStyle: 'Story-based',
      experienceConstraints,
      isSimpleForm: !isAdvanced,
      selectedProvider,
      inputMode,
      userObservation: inputMode === 'experience' ? userObservation.trim() : undefined,
      conceptSelectionMode
    };

    onSubmit(request, includeReasoning);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full rounded-3xl border transition-all duration-300 p-5 sm:p-8 shadow-2xl backdrop-blur-2xl ${
        isDark
          ? 'bg-slate-950/85 border-white/15 text-slate-100 shadow-black/80 ring-1 ring-white/10'
          : 'bg-white/90 border-slate-900/15 text-slate-900 shadow-amber-900/10 ring-1 ring-slate-900/10'
      }`}
    >
      {/* Form Header */}
      <div className={`flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b ${
        isDark ? 'border-slate-800/80' : 'border-slate-300/80'
      }`}>
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-2xl border ${
              isDark
                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-300'
                : 'bg-gradient-to-br from-indigo-100 to-amber-100 border-indigo-200 text-indigo-700'
            }`}
          >
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Learning Request
            </h2>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isAdvanced ? 'Advanced Mode • Complete Control' : 'Story-Based Learning Engine'}
            </p>
          </div>
        </div>

        {/* Dual Mode Switch Toggle */}
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-bold transition-all shadow-md ${
            isAdvanced
              ? isDark
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-500/30'
                : 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30'
              : isDark
              ? 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
              : 'bg-white/90 border-slate-300 text-slate-800 hover:bg-indigo-50 hover:text-indigo-900'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isAdvanced ? 'Switch to Simple Form' : 'Advanced Form'}</span>
        </button>
      </div>

      {/* Primary Intake Pipeline Mode Selector Tabs */}
      <div className="mb-6">
        <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Select Intake Pipeline Mode
        </label>
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900/40 border border-slate-800">
          <button
            type="button"
            onClick={() => setInputMode('topic')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              inputMode === 'topic'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>🎯 Learn a CS Concept (Topic-First)</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('experience')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              inputMode === 'experience'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>📖 Learn from Real Story / Observation</span>
          </button>
        </div>
      </div>

      {/* Quick Example Presets */}
      <div className="mb-6">
        <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Quick Start Examples
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SAMPLE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`text-left p-3 rounded-2xl border transition-all text-xs group ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80'
                  : 'bg-white/90 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 shadow-sm'
              }`}
            >
              <div className={`font-semibold truncate ${isDark ? 'text-indigo-300 group-hover:text-indigo-200' : 'text-indigo-700'}`}>
                {p.label || p.topic}
              </div>
              <div className={`mt-1 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {p.representation} • {p.inputMode === 'experience' ? 'Story Anchor' : p.experienceHints}
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* FORM INPUTS */}
        <div className="space-y-4">
          {inputMode === 'topic' ? (
            /* Mode 1: Topic-First Input */
            <div>
              <label className={`block text-xs font-semibold mb-1.5 flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <BookOpen className="w-4 h-4 text-indigo-400" />
                1. What computer science topic do you want to learn? <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required={inputMode === 'topic'}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. What is an If-Else Statement, Recursion Base Cases, SQL JOINs..."
                className={`w-full rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500'
                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                }`}
              />
            </div>
          ) : (
            /* Mode 2: Experience / Observation-First Input */
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  <Eye className="w-4 h-4 text-purple-400" />
                  1. Real-World Story, Experience, or Observation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required={inputMode === 'experience'}
                  value={userObservation}
                  onChange={(e) => setUserObservation(e.target.value)}
                  placeholder="e.g. The Thirsty Crow Fable, Vijaya Stambha, Ant Colony Foraging..."
                  className={`w-full rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    isDark
                      ? 'bg-slate-900/90 border border-purple-500/40 text-white placeholder-slate-500'
                      : 'bg-white border border-purple-300 text-slate-900 placeholder-slate-400 shadow-sm'
                  }`}
                />
                <p className="mt-1 text-[11px] text-purple-400 font-medium">
                  🔒 This story will be locked as the 100% authentic anchor with 0% fake fantasy mechanics.
                </p>
              </div>

              {/* Concept Selection Options for Mode 2 */}
              <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-950/10 space-y-3">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>
                  Target Computer Science Concept
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConceptSelectionMode('auto')}
                    className={`flex items-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      conceptSelectionMode === 'auto'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <div>
                      <div>🪄 Auto-Discover Concept</div>
                      <div className="text-[10px] opacity-80 font-normal">System finds natural CS fit in story</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConceptSelectionMode('custom')}
                    className={`flex items-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      conceptSelectionMode === 'custom'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Target className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                    <div>
                      <div>✍️ Custom Concept</div>
                      <div className="text-[10px] opacity-80 font-normal">Specify custom target concept</div>
                    </div>
                  </button>
                </div>

                {conceptSelectionMode === 'custom' && (
                  <input
                    type="text"
                    value={customConcept}
                    onChange={(e) => setCustomConcept(e.target.value)}
                    placeholder="e.g. State Transitions, Stack Unwinding, Accumulator Pattern"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      isDark ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900'
                    }`}
                  />
                )}
              </div>
            </div>
          )}

          {/* Field 2 & Field 3 in 2-Col Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field 2: Target Audience Badge */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <Users className="w-4 h-4 text-blue-400" />
                Target Audience
              </label>
              <div className={`w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold flex items-center justify-between border ${
                isDark ? 'bg-indigo-950/60 border-indigo-800/80 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}>
                <span>✨ Learner — Knowledge is for everyone</span>
                <span className="text-[10px] opacity-75 font-normal">First-Principles</span>
              </div>
            </div>

            {/* Field 3: Scenario / Environment Preference */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  <Compass className="w-4 h-4 text-emerald-400" />
                  Scenario / Environment Theme
                </label>
                {inputMode === 'topic' && (
                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 transition-all"
                  >
                    ✨ Surprise Me!
                  </button>
                )}
              </div>
              {inputMode === 'topic' ? (
                <input
                  type="text"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  placeholder="e.g. Indian Historical Places, Space Exploration, Fantasy..."
                  className={`w-full rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    isDark
                      ? 'bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500'
                      : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                  }`}
                />
              ) : (
                <div className={`w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold flex items-center justify-between border ${
                  isDark ? 'bg-purple-950/60 border-purple-800/80 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-800'
                }`}>
                  <span>🔒 Locked to User Observation Anchor</span>
                  <span className="text-[10px] opacity-75 font-normal">Authentic Environment</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ADVANCED CONTROLS SECTION */}
        {isAdvanced && (
          <div className={`p-5 rounded-2xl border space-y-4 transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
              Advanced Specification Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preferred Representation */}
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Preferred Representation
                </label>
                <select
                  value={representation}
                  onChange={(e) => setRepresentation(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Short Comic (1-Page)">Short Comic (1-Page)</option>
                  <option value="Long Comic (Multi-Page)">Long Comic (Multi-Page)</option>
                  <option value="Video Script">Video Script</option>
                  <option value="Storybook">Storybook</option>
                  <option value="Audio Podcast">Audio Podcast</option>
                </select>
              </div>

              {/* Target Programming Language */}
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Target Programming Language
                </label>
                <select
                  value={programmingLanguage}
                  onChange={(e) => setProgrammingLanguage(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="SQL">SQL</option>
                </select>
              </div>

              {/* LLM Engine Selection */}
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  LLM Execution Engine
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as any)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="auto">Auto (Kimi → Groq → MiniMax → Gemini)</option>
                  <option value="kimi">Kimi (moonshotai/kimi-k3-free)</option>
                  <option value="groq">Groq (llama-3.3-70b-versatile)</option>
                  <option value="minimax">MiniMax (MiniMax-M3)</option>
                  <option value="gemini">Gemini (gemini-2.0-flash)</option>
                </select>
              </div>

              {/* Pedagogy Constraints */}
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Pedagogical Constraints
                </label>
                <input
                  type="text"
                  value={experienceConstraints}
                  onChange={(e) => setExperienceConstraints(e.target.value)}
                  placeholder="e.g. Beginner friendly, 100% real-world accuracy"
                  className={`w-full rounded-xl px-3 py-2 text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="includeReasoning"
                checked={includeReasoning}
                onChange={(e) => setIncludeReasoning(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="includeReasoning" className={`text-xs font-semibold cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Stream Educational Analysis & Step Logs (Internal Reasoning Drawer)
              </label>
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-xl transition-all duration-300 ${
            isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:via-purple-500 hover:to-amber-400 text-white shadow-indigo-600/30 hover:scale-[1.01]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span>Executing CKLIS Pipeline...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>
                {inputMode === 'experience'
                  ? 'Generate Lesson from Story / Observation'
                  : 'Generate CKLIS Educational Experience'}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
