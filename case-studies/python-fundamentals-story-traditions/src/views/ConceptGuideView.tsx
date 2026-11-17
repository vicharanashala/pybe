import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { getTopic } from '../data/curriculum';
import { ManuscriptCard } from '../components/Ornaments';
import { ArrowRight, ArrowLeft, Lightbulb, Brain, Map, Cog } from 'lucide-react';

export const ConceptGuideView: React.FC = () => {
  const { activeTopicId, nextStep, prevStep } = useProgress();
  const topic = getTopic(activeTopicId);
  const guide = topic.conceptGuide;

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-3xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-royal-indigo dark:text-white">
            Understanding {topic.title.replace('Python ', '')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Deepen your understanding of the concept</p>
        </div>

        <div className="space-y-6 mb-8">
          {/* What is it? */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-serif font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">What is it?</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{guide.whatIsIt}</p>
          </div>

          {/* Why are we using it? */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-serif font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Why are we using it?</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{guide.whyUseIt}</p>
          </div>

          {/* Where do we use it? */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Map className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-serif font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Where do we use it?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-xs font-serif font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Real Life</p>
                <ul className="space-y-1.5">
                  {guide.realLifeExamples.map((ex, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-serif font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Python</p>
                <ul className="space-y-1.5">
                  {guide.pythonExamples.map((ex, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800/50 rounded px-2 py-1">
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* How does it work? */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Cog className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-sm font-serif font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">How does it work?</h3>
            </div>
            <div className="space-y-3 mt-3">
              {[
                { step: 'Activity', text: guide.howItWorks.activity, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
                { step: 'Idea', text: guide.howItWorks.idea, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
                { step: 'Python', text: guide.howItWorks.python, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
                { step: 'Example', text: guide.howItWorks.example, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', isCode: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${item.color}`}>
                    {item.step}
                  </span>
                  {item.isCode ? (
                    <pre className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded px-3 py-2 overflow-x-auto whitespace-pre-wrap">{item.text}</pre>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4 border-t border-parchment-border dark:border-parchment-darkBorder">
          <button
            onClick={prevStep}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-parchment-light dark:bg-parchment-darkCard border border-parchment-border dark:border-parchment-darkBorder text-gray-600 dark:text-gray-300 font-semibold rounded-xl transition-all hover:border-royal-gold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            onClick={nextStep}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20"
          >
            <span>Learn Python Syntax</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </ManuscriptCard>
    </div>
  );
};
