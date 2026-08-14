import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, ScoreGauge, StoryHeader } from '../components/Ornaments';
import { Award, ArrowRight, RefreshCw, Star } from 'lucide-react';
import { getTopic } from '../data/curriculum';

export const AIMentorView: React.FC = () => {
  const { aiScores, aiFeedback, nextStep, prevStep, activeTopicId } = useProgress();
  const topic = getTopic(activeTopicId);

  if (!aiScores) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 max-w-md mx-auto w-full select-none">
        <ManuscriptCard className="w-full text-center">
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-royal-gold/10 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-royal-gold animate-pulse" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-serif">
              The Royal Advisor is reviewing your reflection...
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
              Please complete the reflection step first.
            </p>
          </div>
        </ManuscriptCard>
      </div>
    );
  }

  // Calculate overall average score
  const averageScore = Math.round(
    (aiScores.reasoning +
      aiScores.reflection +
      aiScores.criticalThinking +
      aiScores.creativity +
      aiScores.communication +
      aiScores.promptQuality) /
      6
  );

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-4xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        <StoryHeader topic={topic} />

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Average Card */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder flex flex-col justify-center items-center text-center shadow-inner md:col-span-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
              Overall Merit
            </span>
            <div className="relative flex items-center justify-center w-28 h-28 my-3">
              {/* Gold Circle Backing */}
              <div className="absolute inset-0 rounded-full border-4 border-royal-gold/20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full border border-dashed border-royal-gold/40"></div>
              <span className="text-4xl font-serif font-bold text-royal-crimson dark:text-royal-gold">
                {averageScore}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-royal-gold">
              {[...Array(5)].map((_, i) => {
                const starVal = (i + 1) * 20;
                return (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${
                      averageScore >= starVal 
                        ? 'fill-royal-gold text-royal-gold' 
                        : 'text-gray-300 dark:text-gray-700'
                    }`} 
                  />
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2 italic">
              Grade based on computational thinking indicators
            </p>
          </div>

          {/* Core Six Dimensions */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder shadow-inner md:col-span-2">
            <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider mb-4 border-b border-parchment-border/40 dark:border-parchment-darkBorder/40 pb-2">
              Performance Attributes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <ScoreGauge label="Reasoning" score={aiScores.reasoning} delayMs={100} />
              <ScoreGauge label="Reflection" score={aiScores.reflection} delayMs={200} />
              <ScoreGauge label="Critical Thinking" score={aiScores.criticalThinking} delayMs={300} />
              <ScoreGauge label="Creativity" score={aiScores.creativity} delayMs={400} />
              <ScoreGauge label="Communication" score={aiScores.communication} delayMs={500} />
              <ScoreGauge label="Prompt Quality" score={aiScores.promptQuality} delayMs={600} />
            </div>
          </div>
        </div>

        {/* Written Advice Scroll */}
        <div className="mb-6 p-6 bg-amber-50/20 dark:bg-yellow-950/5 rounded-xl border border-royal-gold/30 relative">
          {/* Visual Scroll End decorations */}
          <div className="absolute -left-1.5 top-4 bottom-4 w-3 bg-royal-gold rounded-full opacity-30"></div>
          <div className="absolute -right-1.5 top-4 bottom-4 w-3 bg-royal-gold rounded-full opacity-30"></div>

          <div className="pl-4 prose dark:prose-invert max-w-none">
            <h4 className="font-serif font-bold text-royal-indigo dark:text-royal-gold mb-2 text-sm uppercase tracking-wide">
              The Royal Advisor's Review
            </h4>
            <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line font-serif italic">
              {aiFeedback}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center gap-4 pt-4 border-t border-parchment-border dark:border-parchment-darkBorder">
          <button
            onClick={prevStep}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-royal-crimson hover:bg-white dark:hover:bg-parchment-darkCard rounded-lg border border-transparent hover:border-parchment-border transition-all duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reflect Again</span>
          </button>
          
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20"
          >
            <span>View Story Completion</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </ManuscriptCard>
    </div>
  );
};
