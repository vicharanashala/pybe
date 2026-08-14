import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, LazyImage } from '../components/Ornaments';
import { RotateCcw, ArrowRight, MapPin, BookOpen, Trophy, Layers, Gem } from 'lucide-react';
import { getTopic, allTopics } from '../data/curriculum';
import { getTraditionTheme } from '../utils/storyThemes';
import { characterPortrait, stableSeed } from '../utils/pollinations';
import { getCachedUrl } from '../utils/imageCache';
import { learningLevels, getLevelProgress, isLevelUnlocked } from '../data/levels';
import { pedagogyStages, stepPedagogyMap } from '../data/pedagogy';
import { getCardsForTopic } from '../data/characterCards';
import { traditionArtifacts, topicGadgets } from '../data/rewards';

export const DashboardView: React.FC = () => {
  const { aiScores, unlockedBadges, resetAll, activeTopicId, completedTopics, collectedCards, collectedArtifacts, collectedGadgets, pedagogyProgress, setStep } = useProgress();
  const topic = getTopic(activeTopicId);
  const world = topic.storyWorld;
  const theme = getTraditionTheme(world.storyTradition);

  const averageScore = aiScores
    ? Math.round(
        (aiScores.reasoning +
          aiScores.reflection +
          aiScores.criticalThinking +
          aiScores.creativity +
          aiScores.communication +
          aiScores.promptQuality) /
          6
      )
    : 85;

  const allBadges = [
    { name: "Reflection Master", desc: "For articulating computational insights.", icon: "✍️", unlocked: unlockedBadges.includes("Reflection Master") || true },
    { name: topic.badgeName, desc: `For mastering ${topic.title}.`, icon: "🔑", unlocked: unlockedBadges.includes(topic.badgeName) || true },
    { name: "Story Complete", desc: "For journeying through the narrative.", icon: "⚡", unlocked: true },
  ];

  // Pedagogy journey progress
  const pedagogyVisited = pedagogyStages.map((stage, idx) => {
    const stepForStage = Object.entries(stepPedagogyMap).find(([, v]) => v === idx)?.[0];
    const wasVisited = stepForStage ? pedagogyProgress[parseInt(stepForStage)] : false;
    return { ...stage, visited: wasVisited };
  });
  const pedagogyCount = pedagogyVisited.filter(s => s.visited).length;

  // Character collection stats
  const totalCards = 63;
  const collectedCount = collectedCards.length;

  // Group all topics by tradition for story map
  const traditionGroups = new Map<string, { tradition: string; topics: typeof allTopics }>();
  for (const t of allTopics) {
    const tradition = t.storyWorld.storyTradition;
    if (!traditionGroups.has(tradition)) {
      traditionGroups.set(tradition, { tradition, topics: [] });
    }
    traditionGroups.get(tradition)!.topics.push(t);
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-4xl mx-auto w-full select-none">
      {/* Reward Card */}
      <ManuscriptCard className="w-full text-center relative overflow-hidden animate-manuscript-open mb-8">
        <div className="absolute top-6 left-12 text-royal-gold/20 text-3xl animate-bounce" aria-hidden="true">★</div>
        <div className="absolute top-24 right-16 text-royal-gold/20 text-2xl animate-float" aria-hidden="true">★</div>
        <div className="absolute bottom-20 left-20 text-royal-gold/20 text-4xl animate-pulse" aria-hidden="true">★</div>
        <div className="absolute bottom-8 right-12 text-royal-gold/20 text-3xl animate-bounce" aria-hidden="true">★</div>

        {/* Reward Character */}
        <div
          title={world.rewardCharacter.illustrationPrompt}
          className={`${theme.accentBg} w-20 h-20 rounded-full border-4 border-royal-gold overflow-hidden flex items-center justify-center mx-auto mb-4 shadow-xl animate-float`}
        >
          <LazyImage
            src={getCachedUrl(`char:${world.rewardCharacter.name}`, () => characterPortrait(world.rewardCharacter.imagePrompt, stableSeed(world.rewardCharacter.name)))}
            alt={`${world.rewardCharacter.name} — ${world.rewardCharacter.role}`}
            className="w-full h-full rounded-full"
          />
        </div>

        <h2 className={`${theme.accentText} font-serif text-sm font-semibold uppercase tracking-widest mb-1`}>
          ✔ Story Completed
        </h2>
        <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-royal-indigo dark:text-white mb-3">
          {topic.narrativeTitle}
        </h1>

        {/* Reward Character Details */}
        <div className={`${theme.accentBg} inline-flex items-center gap-2 px-4 py-2 rounded-full border ${theme.accentBorder} mb-6`}>
          <LazyImage
            src={characterPortrait(world.rewardCharacter.imagePrompt, stableSeed(world.rewardCharacter.name) + 1)}
            alt=""
            className="w-6 h-6 rounded-full"
          />
          <div className="text-left">
            <p className="text-xs font-serif font-bold text-royal-indigo dark:text-white">
              {world.rewardCharacter.name}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {world.rewardCharacter.desc}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-4">
          {world.storyTheme}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className={`${theme.accentBg} ${theme.accentText} px-3 py-1 rounded-full border ${theme.accentBorder} font-semibold`}>
            {theme.icon} {theme.label} Completed
          </span>
          <span className="bg-royal-crimson/10 text-royal-crimson dark:bg-royal-gold/10 dark:text-royal-gold px-3 py-1 rounded-full border border-royal-crimson/20 dark:border-royal-gold/20 font-semibold">
            Score: {averageScore}/100
          </span>
        </div>

        {/* Learning Summary */}
        <div className="max-w-2xl mx-auto mt-8 text-left">
          <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider mb-3">Key Lesson</h3>
          <p className="p-4 mb-5 rounded-lg bg-royal-crimson/5 dark:bg-royal-gold/5 border border-royal-gold/20 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{topic.learningSummary}</p>

          {/* Reward Card */}
          <div className={`${theme.accentBg} rounded-xl p-5 border ${theme.accentBorder} mb-5`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg" aria-hidden="true">🏆</span>
              <h4 className="text-xs font-serif font-bold text-royal-indigo dark:text-white uppercase tracking-wider">
                Collectible Reward Card
              </h4>
              <span className={`ml-auto text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                topic.rewardCard.rarity === 'legendary' ? 'bg-yellow-400/20 text-yellow-700 dark:text-yellow-300' :
                topic.rewardCard.rarity === 'rare' ? 'bg-purple-400/20 text-purple-700 dark:text-purple-300' :
                'bg-gray-200/50 text-gray-600 dark:text-gray-400'
              }`}>
                {topic.rewardCard.rarity}
              </span>
            </div>
            <p className="text-sm font-serif italic text-royal-indigo dark:text-white mb-2 leading-relaxed">
              {topic.rewardCard.quote}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {topic.rewardCard.lesson}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 text-xs text-gray-600 dark:text-gray-300 animate-stagger">
            <div className="p-3 rounded-lg border border-parchment-border dark:border-parchment-darkBorder"><strong>Why useful:</strong> {topic.learningReflection.useful}</div>
            <div className="p-3 rounded-lg border border-parchment-border dark:border-parchment-darkBorder"><strong>Common mistake:</strong> {topic.learningReflection.commonMistake}</div>
            <div className="p-3 rounded-lg border border-parchment-border dark:border-parchment-darkBorder"><strong>Memory trick:</strong> {topic.learningReflection.memoryTrick}</div>
            <div className="p-3 rounded-lg border border-parchment-border dark:border-parchment-darkBorder"><strong>Key takeaway:</strong> {topic.learningReflection.keyTakeaway}</div>
          </div>
        </div>

        {/* Badges Earned */}
        <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider mb-4">
          Unlocked Royal Crests
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 animate-stagger">
          {allBadges.map((badge, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl border flex flex-col items-center text-center bg-white/40 dark:bg-parchment-darkCard/40 border-royal-gold/40 hover:-translate-y-0.5 shadow transition-all duration-300"
            >
              <span className="text-3xl mb-2" aria-hidden="true">{badge.icon}</span>
              <h4 className="text-xs font-serif font-bold text-royal-indigo dark:text-white">
                {badge.name}
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-normal">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto pt-6 border-t border-parchment-border dark:border-parchment-darkBorder">
          <button
            onClick={() => setStep(1)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-royal-crimson hover:bg-royal-crimsonHover text-white transition-all duration-300 text-sm font-semibold shadow-md"
          >
            <span>View Story Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={resetAll}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-parchment-border dark:border-parchment-darkBorder text-gray-600 dark:text-gray-300 hover:text-royal-crimson hover:bg-white dark:hover:bg-parchment-darkCard transition-all duration-300 text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>
        </div>
      </ManuscriptCard>

      {/* Learning Levels */}
      <ManuscriptCard className="w-full animate-fade-in mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-royal-crimson dark:text-royal-gold" />
          <h2 className="text-xl font-serif font-bold text-royal-indigo dark:text-white">
            Learning Levels
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningLevels.map((level) => {
            const progress = getLevelProgress(level, completedTopics);
            const unlocked = isLevelUnlocked(level, completedTopics);
            return (
              <div
                key={level.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  unlocked
                    ? `${level.color} hover:-translate-y-0.5 shadow`
                    : 'bg-gray-50 dark:bg-gray-900/30 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" aria-hidden="true">{level.icon}</span>
                  <div>
                    <h4 className="text-sm font-serif font-bold">{level.name}</h4>
                    <p className="text-[10px] opacity-70">{level.topics.length} topics</p>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed mb-3 opacity-80">{level.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-current rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[10px] font-mono font-semibold">{progress}%</span>
                </div>
                {!unlocked && (
                  <p className="text-[9px] mt-2 opacity-60 italic">Complete {level.unlockThreshold}% of previous level to unlock</p>
                )}
              </div>
            );
          })}
        </div>
      </ManuscriptCard>

      {/* Ancient Pedagogy Journey */}
      <ManuscriptCard className="w-full animate-fade-in mb-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-royal-crimson dark:text-royal-gold" />
          <h2 className="text-xl font-serif font-bold text-royal-indigo dark:text-white">
            Ancient Learning Journey
          </h2>
          <span className="ml-auto text-xs font-mono text-royal-gold">{pedagogyCount}/9 stages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pedagogyVisited.map((stage, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                stage.visited
                  ? 'bg-white/40 dark:bg-parchment-darkCard/40 border-royal-gold/40'
                  : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${stage.visited ? 'bg-royal-gold' : 'bg-gray-300 dark:bg-gray-700'}`} />
                <span className={`text-xs font-serif font-bold ${stage.color}`}>{stage.sanskrit}</span>
              </div>
              <h4 className="text-xs font-serif font-bold text-royal-indigo dark:text-white mb-1">{stage.name}</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 italic leading-relaxed">{stage.journeyDescription}</p>
            </div>
          ))}
        </div>
      </ManuscriptCard>

      {/* Character Collection */}
      <ManuscriptCard className="w-full animate-fade-in mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-royal-crimson dark:text-royal-gold" />
          <h2 className="text-xl font-serif font-bold text-royal-indigo dark:text-white">
            Character Collection
          </h2>
          <span className="ml-auto text-xs font-mono text-royal-gold">{collectedCount}/{totalCards} cards</span>
        </div>

        <div className="mb-4">
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-royal-gold rounded-full transition-all" style={{ width: `${(collectedCount / totalCards) * 100}%` }} />
          </div>
        </div>

        {/* Show collected cards by topic */}
        <div className="space-y-4">
          {Array.from(traditionGroups.entries()).map(([tradition, group]) => {
            const tTheme = getTraditionTheme(tradition);
            return (
              <div key={tradition}>
                <span className={`${tTheme.accentBg} ${tTheme.accentText} inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${tTheme.accentBorder} mb-2`}>
                  <span aria-hidden="true">{tTheme.icon}</span>
                  {tTheme.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.topics.map((t) => {
                    const topicCardsAll = getCardsForTopic(t.id);
                    return (
                      <div key={t.id} className="flex items-center gap-1">
                        {topicCardsAll.map((card) => {
                          const isCollected = collectedCards.some(cc => cc.id === card.id);
                          return (
                            <div
                              key={card.id}
                              className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all duration-300 ${
                                isCollected
                                  ? 'border-royal-gold shadow-md'
                                  : 'border-gray-300 dark:border-gray-700 opacity-30'
                              }`}
                              title={isCollected ? `${card.name} — ${card.role}` : '???'}
                            >
                              {isCollected ? (
                                <LazyImage
                                  src={characterPortrait(card.name, stableSeed(card.name))}
                                  alt={card.name}
                                  className="w-full h-full rounded-full"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[8px] text-gray-400">?</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ManuscriptCard>

      {/* Royal Museum — Artifacts & Gadgets */}
      <ManuscriptCard className="w-full animate-fade-in mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Gem className="w-5 h-5 text-royal-crimson dark:text-royal-gold" />
          <h2 className="text-xl font-serif font-bold text-royal-indigo dark:text-white">
            Royal Museum
          </h2>
          <span className="ml-auto text-xs font-mono text-royal-gold">{collectedArtifacts.length + collectedGadgets.length} items</span>
        </div>

        {/* Artifacts Gallery */}
        <div className="mb-6">
          <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider mb-3">Story Artifacts</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {traditionArtifacts.map((artifact) => {
              const isCollected = collectedArtifacts.some(a => a.id === artifact.id);
              return (
                <div
                  key={artifact.id}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    isCollected
                      ? 'bg-white/40 dark:bg-parchment-darkCard/40 border-royal-gold/40 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-40'
                  }`}
                >
                  <p className="text-xs font-serif font-bold text-royal-indigo dark:text-white mb-1">{isCollected ? artifact.name : '???'}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{isCollected ? artifact.description : 'Complete the story to unlock'}</p>
                  {isCollected && (
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      artifact.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      artifact.rarity === 'rare' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400'
                    }`}>
                      {artifact.rarity}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gadgets Gallery */}
        <div>
          <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider mb-3">Story Gadgets</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {topicGadgets.map((gadget) => {
              const isCollected = collectedGadgets.some(g => g.id === gadget.id);
              return (
                <div
                  key={gadget.id}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    isCollected
                      ? 'bg-white/40 dark:bg-parchment-darkCard/40 border-royal-gold/40 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 opacity-40'
                  }`}
                >
                  <p className="text-xs font-serif font-bold text-royal-indigo dark:text-white mb-1">{isCollected ? gadget.name : '???'}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{isCollected ? gadget.description : 'Complete the topic to unlock'}</p>
                  {isCollected && (
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1 italic">&ldquo;{gadget.quote}&rdquo;</p>
                  )}
                  {isCollected && (
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      gadget.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      gadget.rarity === 'rare' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400'
                    }`}>
                      {gadget.rarity}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ManuscriptCard>

      {/* Story Map */}
      <ManuscriptCard className="w-full animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-royal-crimson dark:text-royal-gold" />
          <h2 className="text-xl font-serif font-bold text-royal-indigo dark:text-white">
            Story Map
          </h2>
        </div>

        <div className="space-y-6">
          {Array.from(traditionGroups.entries()).map(([tradition, group]) => {
            const tTheme = getTraditionTheme(tradition);
            const completedCount = group.topics.filter(t => completedTopics.includes(t.id)).length;
            const percentage = Math.round((completedCount / group.topics.length) * 100);

            return (
              <div key={tradition} className="animate-fade-in" role="region" aria-label={`${tTheme.label} stories`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`${tTheme.accentBg} ${tTheme.accentText} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border ${tTheme.accentBorder}`}>
                    <span aria-hidden="true">{tTheme.icon}</span>
                    {tTheme.label}
                  </span>
                  <div className="flex-1 h-1.5 bg-parchment-border dark:bg-parchment-darkBorder rounded-full overflow-hidden" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${tTheme.label} completion: ${percentage}%`}>
                    <div 
                      className="h-full bg-royal-gold rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-gray-400">{percentage}%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.topics.map((t) => {
                    const isCompleted = completedTopics.includes(t.id);
                    const isCurrent = t.id === activeTopicId;
                    return (
                      <span
                        key={t.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 ${
                          isCurrent
                            ? `${tTheme.accentBg} ${tTheme.accentText} ${tTheme.accentBorder} ring-1 ring-royal-gold/50`
                            : isCompleted
                              ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                              : 'bg-white/40 dark:bg-parchment-dark/20 text-gray-400 dark:text-gray-600 border-parchment-border dark:border-parchment-darkBorder'
                        }`}
                        aria-label={`${t.title}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                      >
                        {isCompleted && <span className="text-green-500" aria-hidden="true">✔</span>}
                        {t.title.replace('Python ', '')}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ManuscriptCard>
    </div>
  );
};
