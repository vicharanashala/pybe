import React, { useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard } from '../components/Ornaments';
import { CheckCircle, Clock, Lock, ChevronRight, Library, Sparkles, Star } from 'lucide-react';
import { allTopics } from '../data/curriculum';
import { getTraditionTheme } from '../utils/storyThemes';
import { getLevelForTopic, isLevelUnlocked, learningLevels, getLevelProgress, type LearningLevel } from '../data/levels';
import type { TopicId } from '../data/curriculum';

export const TopicSelectionView: React.FC = () => {
  const { completedTopics, selectTopic, currentLevel, collectedCards, collectedArtifacts } = useProgress();

  // Group topics by level
  const levelGroups = useMemo(() => {
    const groups: { level: LearningLevel; topics: typeof allTopics; unlocked: boolean }[] = [];
    for (const level of learningLevels) {
      const levelTopics = allTopics.filter(t => level.topics.includes(t.id));
      const unlocked = isLevelUnlocked(level, completedTopics);
      groups.push({ level, topics: levelTopics, unlocked });
    }
    return groups;
  }, [completedTopics]);

  const getTopicStatus = (topicId: TopicId) => {
    if (completedTopics.includes(topicId)) return 'completed';
    const topicLevel = getLevelForTopic(topicId);
    if (topicLevel && topicLevel.id === currentLevel.id) return 'current';
    if (topicLevel && isLevelUnlocked(topicLevel, completedTopics)) return 'available';
    return 'locked';
  };

  return (
    <div className="flex-1 flex flex-col py-6 px-4 max-w-6xl mx-auto w-full select-none">
      <div className="text-center mb-6 animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-royal-gold/10 flex items-center justify-center mx-auto mb-3">
          <Library className="w-6 h-6 text-royal-gold" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-royal-indigo dark:text-white">
          Story Library
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-lg mx-auto text-sm">
          Choose a story to begin your Python journey. Each tale teaches a new concept through ancient wisdom.
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
          <span>{completedTopics.length}/{allTopics.length} stories completed</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{collectedCards.length}/63 characters</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{collectedArtifacts.length}/9 artifacts</span>
        </div>
      </div>

      {levelGroups.map(({ level, topics, unlocked }) => {
        const levelCompleted = topics.filter(t => completedTopics.includes(t.id)).length;
        const levelProgress = getLevelProgress(level, completedTopics);
        const isCurrentLevel = level.id === currentLevel.id;

        return (
          <div key={level.id} className={`mb-6 animate-fade-in ${!unlocked ? 'opacity-50' : ''}`}>
            {/* Level Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`${level.color} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border`}>
                <span aria-hidden="true">{level.icon}</span>
                Level {level.id}: {level.name}
              </span>
              <div className="flex-1 h-1.5 bg-parchment-border dark:bg-parchment-darkBorder rounded-full overflow-hidden" role="progressbar" aria-valuenow={levelProgress} aria-valuemin={0} aria-valuemax={100} aria-label={`${level.name} progress: ${levelProgress}%`}>
                <div
                  className="h-full rounded-full bg-royal-gold transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-semibold text-gray-400">{levelCompleted}/{topics.length}</span>
              {!unlocked && (
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Lock className="w-3 h-3" />
                  Complete previous level to unlock
                </span>
              )}
              {isCurrentLevel && (
                <span className="flex items-center gap-1 text-[10px] text-royal-gold font-semibold">
                  <Sparkles className="w-3 h-3" />
                  Current
                </span>
              )}
            </div>

            {/* Topic Cards — Responsive grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="list" aria-label={`${level.name} stories`}>
              {topics.map((topic) => {
                const status = getTopicStatus(topic.id);
                const isCompleted = status === 'completed';
                const isCurrent = status === 'current';
                const isLocked = status === 'locked' || !unlocked;
                const canPlay = !isCompleted && !isLocked;
                const tTheme = getTraditionTheme(topic.storyWorld.storyTradition);
                const topicCards = collectedCards.filter(c => c.topicId === topic.id);

                return (
                  <div
                    key={topic.id}
                    role="listitem"
                    className={`cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={() => canPlay && selectTopic(topic.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (canPlay) selectTopic(topic.id);
                      }
                    }}
                    tabIndex={canPlay ? 0 : -1}
                    aria-label={`${topic.title}: ${topic.narrativeTitle}. ${topic.difficulty}. ${isCompleted ? 'Completed' : isCurrent ? 'In Progress' : isLocked ? 'Locked' : 'Ready to play'}`}
                  >
                    <ManuscriptCard
                      className={`h-full flex flex-col justify-between border-parchment-card/60 dark:border-parchment-darkCard/60 ${isCompleted ? 'border-green-300 dark:border-green-800' : isCurrent ? 'border-royal-gold/40 dark:border-royal-gold/30' : ''} ${isLocked ? 'grayscale' : ''}`}
                      glow={isCurrent}
                    >
                      <div>
                        {/* Status badge + difficulty */}
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                            isCompleted ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                            isCurrent ? 'bg-royal-gold/10 text-royal-gold border-royal-gold/30' :
                            'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
                          }`}>
                            {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : isLocked ? 'Locked' : 'Ready'}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{topic.duration}</span>
                          </div>
                        </div>

                        {/* Title + narrative */}
                        <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-white mb-0.5 leading-tight">
                          {topic.title}
                        </h3>
                        <p className="text-[10px] font-medium text-royal-crimson dark:text-royal-gold mb-1.5 italic leading-tight">
                          {topic.narrativeTitle}
                        </p>

                        {/* Description — truncated */}
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-2 line-clamp-2">
                          {topic.description}
                        </p>

                        {/* Tradition + difficulty */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className={`${tTheme.accentBg} ${tTheme.accentText} text-[8px] px-1.5 py-0.5 rounded-full font-semibold uppercase border ${tTheme.accentBorder}`}>
                            {topic.difficulty}
                          </span>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500">
                            {tTheme.icon} {tTheme.label}
                          </span>
                        </div>

                        {/* Lock message */}
                        {isLocked && !isCompleted && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 mb-1">
                            <Lock className="w-3 h-3" />
                            <span>Complete previous level first</span>
                          </div>
                        )}
                      </div>

                      {/* Footer: Cards collected + action */}
                      <div className="pt-2 border-t border-parchment-border dark:border-parchment-darkBorder flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Star className="w-3 h-3" />
                          <span>{topicCards.length}/3 cards</span>
                        </div>
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                        ) : canPlay ? (
                          <div className="flex items-center gap-1 text-royal-crimson dark:text-royal-gold text-[11px] font-semibold group-hover:translate-x-0.5 transition-transform">
                            <span>Play</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                    </ManuscriptCard>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
