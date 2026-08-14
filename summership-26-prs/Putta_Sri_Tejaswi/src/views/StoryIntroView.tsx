import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, LazyImage } from '../components/Ornaments';
import { ArrowRight } from 'lucide-react';
import { getTopic } from '../data/curriculum';
import { getTraditionTheme } from '../utils/storyThemes';
import { characterPortrait, sceneBackground, stableSeed } from '../utils/pollinations';
import { getCachedUrl, preloadImages } from '../utils/imageCache';

export const StoryIntroView: React.FC = () => {
  const { nextStep, prevStep, activeTopicId } = useProgress();
  const topic = getTopic(activeTopicId);
  const world = topic.storyWorld;
  const characters = topic.characters;
  const theme = getTraditionTheme(world.storyTradition);

  // Preload all character portraits + scene background immediately
  React.useEffect(() => {
    const urls: string[] = [];
    // Mentor portrait
    urls.push(getCachedUrl(`${topic.id}:${world.mentor.id}`, () => characterPortrait(world.mentor.imagePrompt, stableSeed(world.mentor.name))));
    // Character portraits
    for (const char of characters) {
      urls.push(getCachedUrl(`${topic.id}:${char.id || char.name}`, () => characterPortrait(char.imagePrompt, stableSeed(char.name))));
    }
    // Scene background
    if (world.sceneImagePrompt) {
      urls.push(getCachedUrl(`scene:${topic.id}:0`, () => sceneBackground(world.sceneImagePrompt, stableSeed(topic.id))));
    }
    // Reward character
    urls.push(getCachedUrl(`char:${world.rewardCharacter.name}`, () => characterPortrait(world.rewardCharacter.imagePrompt, stableSeed(world.rewardCharacter.name))));
    preloadImages(urls);
  }, [topic.id, world, characters]);

  return (
    <div className="flex-1 flex flex-col justify-center py-8 px-4 max-w-4xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        {/* Story Tradition & Title */}
        <div className="text-center mb-8">
          <span className={`${theme.accentText} ${theme.accentBg} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border ${theme.accentBorder}`}>
            <span aria-hidden="true">{theme.icon}</span>
            {world.storyTradition}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-royal-indigo dark:text-white mt-4">
            {topic.narrativeTitle}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Teaching {topic.title}
          </p>
          <div className="w-16 h-0.5 bg-royal-gold mx-auto mt-3" aria-hidden="true"></div>
        </div>

        {/* Setting & Narrator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-stagger">
          <div className={`${theme.accentBg} rounded-xl p-5 border ${theme.accentBorder}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 block mb-1">
              Setting
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-200 font-serif italic leading-relaxed">
              {world.setting}
            </p>
            {world.sceneImagePrompt && (
              <div className="mt-3 rounded-lg overflow-hidden border border-white/20">
                <LazyImage
                  src={getCachedUrl(`scene:${topic.id}:0`, () => sceneBackground(world.sceneImagePrompt, stableSeed(topic.id)))}
                  alt={`${world.storyTradition} setting illustration`}
                  className="w-full h-32"
                />
              </div>
            )}
          </div>
          <div className="bg-white/50 dark:bg-parchment-dark/50 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 block mb-1">
              Narrator
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-200 font-serif italic leading-relaxed">
              {world.narrator}
            </p>
          </div>
        </div>

        {/* Story Intro */}
        <div className="prose dark:prose-invert max-w-none text-center mb-8 animate-fade-in">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {topic.storyIntro}
          </p>
        </div>

        {/* Mentor Card */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider text-center mb-4">
            Mentor
          </h3>
          <div className={`${theme.accentBg} rounded-xl p-5 border ${theme.accentBorder} flex flex-col items-center text-center max-w-sm mx-auto`}>
            <div
              title={world.mentor.illustrationPrompt}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-royal-gold/30 mb-3 shadow-inner"
            >
              <LazyImage
                src={getCachedUrl(`char:${world.mentor.name}`, () => characterPortrait(world.mentor.imagePrompt, stableSeed(world.mentor.name)))}
                alt={`${world.mentor.name} — ${world.mentor.role}`}
                className="w-full h-full rounded-full"
              />
            </div>
            <h4 className="text-lg font-serif font-bold text-royal-indigo dark:text-white">
              {world.mentor.name}
            </h4>
            <span className="text-[10px] font-semibold text-royal-crimson dark:text-royal-gold uppercase tracking-wider mb-2">
              {world.mentor.role}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {world.mentor.desc}
            </p>
          </div>
        </div>

        {/* Main Characters */}
        <h3 className="text-lg font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider text-center mb-6">
          Dramatis Personae
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-stagger">
          {characters.map((char, index) => (
            <div 
              key={index}
              className="bg-white/50 dark:bg-parchment-dark/50 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder hover:scale-[1.02] transition-transform duration-300 flex flex-col items-center text-center"
            >
              <div
                title={char.illustrationPrompt}
                className="w-14 h-14 rounded-full overflow-hidden border border-royal-gold/20 mb-3 shadow-inner"
              >
                <LazyImage
                  src={getCachedUrl(`${topic.id}:${char.id || char.name}`, () => characterPortrait(char.imagePrompt, stableSeed(char.name)))}
                  alt={`${char.name} — ${char.role}`}
                  className="w-full h-full rounded-full"
                />
              </div>
              <h4 className="text-base font-serif font-bold text-royal-indigo dark:text-white">
                {char.name}
              </h4>
              <span className="text-[10px] font-semibold text-royal-crimson dark:text-royal-gold uppercase tracking-wider mb-2">
                {char.role}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {char.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Emotional Tone & Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-stagger">
          <div className="bg-white/50 dark:bg-parchment-dark/50 rounded-xl p-5 border border-parchment-border dark:border-parchment-darkBorder text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 block mb-1">
              Emotional Tone
            </span>
            <p className="text-sm font-serif font-semibold text-royal-indigo dark:text-white">
              {world.emotionalTone}
            </p>
          </div>
          <div className={`${theme.accentBg} rounded-xl p-5 border ${theme.accentBorder} text-center`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 block mb-1">
              Story Theme
            </span>
            <p className="text-sm font-serif font-semibold text-royal-indigo dark:text-white leading-relaxed">
              {world.storyTheme}
            </p>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center gap-4 pt-4 border-t border-parchment-border dark:border-parchment-darkBorder">
          <button
            onClick={prevStep}
            className="px-5 py-2.5 rounded-lg border border-parchment-border dark:border-parchment-darkBorder text-gray-500 hover:text-royal-crimson hover:bg-white dark:hover:bg-parchment-darkCard transition-all duration-300"
          >
            Curriculum
          </button>
          
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20"
          >
            <span>Enter the Story</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </ManuscriptCard>
    </div>
  );
};
