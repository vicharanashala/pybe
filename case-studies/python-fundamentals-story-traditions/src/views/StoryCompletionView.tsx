import React, { useEffect, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, LazyImage } from '../components/Ornaments';
import { getTopic } from '../data/curriculum';
import { getTraditionTheme } from '../utils/storyThemes';
import { pedagogyStages, stepPedagogyMap } from '../data/pedagogy';
import { characterPortrait, stableSeed } from '../utils/pollinations';
import { getCachedUrl } from '../utils/imageCache';
import { ArrowRight, BookOpen, Trophy, Star, Zap, Target, MapPin, Sparkles, LayoutDashboard } from 'lucide-react';

export const StoryCompletionView: React.FC = () => {
  const { activeTopicId, setStep, collectedCards, collectRandomCard, collectArtifact, collectGadget, markPedagogy, completedTopics, pedagogyProgress, collectedArtifacts, collectedGadgets, getNextUnlockedTopic, continueToNextTopic } = useProgress();
  const topic = getTopic(activeTopicId);
  const world = topic.storyWorld;
  const theme = getTraditionTheme(world.storyTradition);

  const topicCards = collectedCards.filter(c => c.topicId === activeTopicId);
  const totalCardsForTopic = 3;
  const cardProgress = `${topicCards.length}/${totalCardsForTopic}`;

  const collectedRef = React.useRef(false);
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (collectedRef.current) return;
    collectedRef.current = true;
    markPedagogy(11);
    const existingIds = collectedCards.map(c => c.id);
    const hasAll = topic.characters.every((_, i) => existingIds.includes(`${activeTopicId}-char-${i}`));
    if (!hasAll) {
      collectRandomCard(activeTopicId);
    }
    collectArtifact(world.storyTradition);
    collectGadget(activeTopicId);
  }, []);

  const nextTopicId = useMemo(() => getNextUnlockedTopic(), [completedTopics, activeTopicId]);
  const nextTopic = nextTopicId ? getTopic(nextTopicId) : null;

  const newCard = topicCards.length > 0 ? topicCards[topicCards.length - 1] : null;
  const topicGadget = collectedGadgets.find(g => g.topicId === activeTopicId);
  const topicArtifact = collectedArtifacts.find(a => a.tradition === world.storyTradition);

  const completedCount = completedTopics.length;
  const totalTopics = 21;
  const overallProgress = Math.round((completedCount / totalTopics) * 100);

  // Determine which pedagogy stages were visited during this story
  const visitedStages = pedagogyStages.map((stage, idx) => {
    const stepForStage = Object.entries(stepPedagogyMap).find(([, v]) => v === idx)?.[0];
    const wasVisited = stepForStage ? pedagogyProgress[parseInt(stepForStage)] : false;
    return { ...stage, visited: wasVisited };
  });

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-4xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-royal-gold/10 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-royal-gold" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-royal-indigo dark:text-white">
            Story Complete!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            You have completed the {theme.label} tale: {topic.narrativeTitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Story Summary */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-royal-gold" />
              <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider">Story Summary</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{topic.learningSummary}</p>
          </div>

          {/* Python Concepts Learned */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-royal-gold" />
              <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider">Python Concepts</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{topic.description}</p>
          </div>

          {/* Ancient Learning Progress */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-royal-gold" />
              <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider">Ancient Learning Progress</h3>
            </div>
            <div className="space-y-1.5">
              {visitedStages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[10px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${stage.visited ? 'bg-royal-gold' : 'bg-gray-300 dark:bg-gray-700'}`} />
                  <span className="font-serif font-semibold text-gray-600 dark:text-gray-400">{stage.name}</span>
                  <span className="text-gray-400 dark:text-gray-600 italic hidden md:inline">{stage.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-life Applications */}
          <div className="bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-royal-gold" />
              <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider">Real-life Applications</h3>
            </div>
            <ul className="space-y-2">
              {topic.applications.map((app, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-royal-gold mt-1.5 shrink-0" />
                  {app}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Knowledge Artifact */}
        <div className="mb-8 bg-white/40 dark:bg-parchment-darkCard/40 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-royal-gold" />
            <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider">Knowledge Artifact</h3>
          </div>
          <div className="p-3 bg-royal-indigo/5 dark:bg-royal-gold/5 rounded-lg border border-royal-gold/20">
            <p className="text-xs font-serif text-royal-indigo dark:text-royal-gold font-semibold">{topic.badgeName}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{topic.storyWorld.storyTheme}</p>
          </div>
          <div className="mt-3">
            <p className="text-[10px] text-gray-400 dark:text-gray-600">Overall Journey: {completedCount}/{totalTopics} topics ({overallProgress}%)</p>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-royal-gold rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Character Card Unlock */}
        {newCard && (
          <div className="mb-8 p-5 bg-royal-gold/5 dark:bg-royal-gold/5 rounded-xl border border-royal-gold/20 text-center">
            <p className="text-xs font-semibold text-royal-gold uppercase tracking-wider mb-3">New Character Card Unlocked!</p>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-royal-gold/40">
                <LazyImage
                  src={getCachedUrl(`char:${newCard.name}`, () => characterPortrait(newCard.name, stableSeed(newCard.name)))}
                  alt={newCard.name}
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs font-serif font-bold text-royal-indigo dark:text-white">{newCard.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{newCard.role}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 italic">{newCard.tradition}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">&ldquo;{newCard.quote}&rdquo;</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase ${
                newCard.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                newCard.rarity === 'rare' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                'bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400'
              }`}>
                {newCard.rarity}
              </span>
            </div>
          </div>
        )}

        {/* Story Artifact Unlock */}
        {topicArtifact && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700/30 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-serif font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Story Artifact Unlocked!</p>
            </div>
            <p className="text-sm font-serif font-bold text-amber-800 dark:text-amber-300">{topicArtifact.name}</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">{topicArtifact.description}</p>
            <p className="text-[10px] text-amber-500 dark:text-amber-500 mt-1 italic">{topicArtifact.historicalSignificance}</p>
          </div>
        )}

        {/* Story Gadget Unlock */}
        {topicGadget && (
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700/30 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <p className="text-xs font-serif font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Story Gadget Unlocked!</p>
            </div>
            <p className="text-sm font-serif font-bold text-indigo-800 dark:text-indigo-300">{topicGadget.name}</p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">{topicGadget.description}</p>
            <p className="text-[10px] text-indigo-500 dark:text-indigo-500 mt-1 italic">{topicGadget.pythonMeaning}</p>
            <p className="text-[10px] text-indigo-400 dark:text-indigo-500 mt-1">&ldquo;{topicGadget.quote}&rdquo;</p>
          </div>
        )}

        {/* Character Collection Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Character Collection</span>
            <span className="text-[10px] font-mono text-royal-gold">{cardProgress} cards</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-royal-gold rounded-full transition-all" style={{ width: `${(topicCards.length / totalCardsForTopic) * 100}%` }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-parchment-border dark:border-parchment-darkBorder">
          {nextTopic ? (
            <button
              onClick={continueToNextTopic}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20"
            >
              <span>Continue to {nextTopic.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20"
            >
              <span>All Stories Completed!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setStep(1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-parchment-light dark:bg-parchment-darkCard border border-parchment-border dark:border-parchment-darkBorder text-gray-600 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:border-royal-gold"
          >
            <BookOpen className="w-4 h-4" />
            <span>Story Library</span>
          </button>
          <button
            onClick={() => setStep(14)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-parchment-light dark:bg-parchment-darkCard border border-parchment-border dark:border-parchment-darkBorder text-gray-600 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:border-royal-gold"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>View Dashboard</span>
          </button>
        </div>
      </ManuscriptCard>
    </div>
  );
};
