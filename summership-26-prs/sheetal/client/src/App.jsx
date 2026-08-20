import React, { useState } from 'react';
import StoryCanvas from './components/StoryCanvas';
import RightPanelManager from './RightPanelManager';
import IntroScreen from './components/IntroScreen';
import ExhaustionScreen from './components/ExhaustionScreen';
import EurekaScreen from './components/EurekaScreen';
import MagicalBackground from './components/MagicalBackground';
import { ChapterProvider } from './context/ChapterContext';

export default function App() {
  const [currentStage, setCurrentStage] = useState('intro');
  const [isFoxSummoned, setIsFoxSummoned] = useState(false);

  // Exact Master Orion intro dialogue
  const [orionText, setOrionText] = useState(
    "Greetings, traveler! I am Master Orion, the Grand Architect of the Whispering Woods. My sacred duty is to breathe life into this forest, but my hands grow weary. Will you lend me your aid?"
  );

  const handleDialogueTrigger = (text) => {
    setOrionText(text);
    if (text.includes("Look at that! With a single line of code")) {
      setIsFoxSummoned(true);
    }
  };

  const handleStartMoldingFromIntro = () => {
    setCurrentStage('molding_1');
    setOrionText(
      "Specify the attributes of the fox, apprentice! Every detail must be manually entered. Name, Essence, Legs, Tails... and don't forget Eye Color, Aura Type, Fur Pattern, Ear Shape, Temperament, and Paws! True mastery demands tedious, precise repetition. Don't falter now."
    );
  };

  const handleLookAroundFromExhaustion = () => {
    setCurrentStage('eureka');
    setOrionText(
      "Wait a moment... Look at this ledger! I don't carve a new emblem by hand every time I sign a page. I carved this brass stamp ONCE, and now it effortlessly creates infinite, identical wax seals! What if we did the same for our creatures? We don't need to mold every fox by hand... we need to build a Master Blueprint! A Dhancha!"
    );
  };

  const handleCreateBlueprintFromEureka = () => {
    setCurrentStage('fill_in_the_blank');
    setOrionText(
      "Listen closely, apprentice. Before we can manifest any creature, we must define its essence using a class. Think of a class not as the creature itself, but as the Dhancha—the architectural blueprint or rubber stamp. It holds the rules: every fox must have legs and a tail, but it doesn't give them life yet. In programming, a class is a user-defined prototype that bundles data and behaviors together!"
    );
  };

  return (
    <ChapterProvider>
      <div className="w-screen h-screen max-h-screen overflow-hidden relative font-sans-rounded">
        {/* Full-Screen Dynamic Background Image & Ambient Orbs */}
        <MagicalBackground currentStage={currentStage} isFoxSummoned={isFoxSummoned} />

        {currentStage === 'intro' ? (
          /* Unified Full-Screen Intro Page (Slide 1) */
          <IntroScreen onStartMolding={handleStartMoldingFromIntro} />
        ) : currentStage === 'exhaustion' ? (
          /* Cinematic Full-Screen Cutscene (Slide 5) */
          <ExhaustionScreen onLookAround={handleLookAroundFromExhaustion} />
        ) : currentStage === 'eureka' || currentStage === 'epiphany' ? (
          /* Cinematic "Eureka!" Class Epiphany Cutscene (Slide 6) */
          <EurekaScreen onCreateBlueprint={handleCreateBlueprintFromEureka} />
        ) : (
          /* Unified Immersive Layout for molding and subsequent stages (Slide 2-4, 7+) */


          <main className="relative z-10 w-full h-full flex flex-col lg:flex-row items-stretch justify-between p-6 gap-6 max-w-[1600px] mx-auto">
            {/* Top Header for State 8 (blueprint_success) */}
            {(currentStage === 'blueprint_success' || currentStage === 'blueprint_forged') && (
              <header className="absolute top-3 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
                <div className="flex items-center space-x-3 pointer-events-auto">
                  <div className="w-9 h-9 rounded-xl bg-black/50 border border-amber-400/50 backdrop-blur-md flex items-center justify-center text-lg shadow-lg">
                    🔮
                  </div>
                  <div>
                    <h1 className="text-base font-extrabold font-serif text-amber-300 tracking-wider drop-shadow">
                      CREATION <span className="text-slate-300 font-sans font-normal text-xs ml-1">- The Interactive Canvas</span>
                    </h1>
                  </div>
                </div>

                <div className="px-4 py-1 rounded-full bg-black/60 border border-slate-700/60 text-xs font-sans text-slate-300 font-medium backdrop-blur-md shadow-lg pointer-events-auto">
                  Chapter I: Prologue
                </div>
              </header>
            )}

            {/* Left Side: Floating Character Visual & Earthy Dialogue Box */}
            <section className={`w-full lg:w-[46%] h-full flex flex-col justify-between ${
              currentStage === 'blueprint_success' || currentStage === 'blueprint_forged' ? 'pt-10' : 'pt-4'
            }`}>
              <StoryCanvas customDialogue={orionText} currentStage={currentStage} />
            </section>

            {/* Right Side: Frosted Glass Manual Parchment Ledger / Workspace */}
            <section className={`w-full lg:w-[50%] h-full flex flex-col justify-center ${
              currentStage === 'blueprint_success' || currentStage === 'blueprint_forged' ? 'pt-10' : 'pt-4'
            }`}>
              <RightPanelManager
                initialStage={currentStage}
                triggerOrionDialogue={handleDialogueTrigger}
                onStageChange={(stage) => setCurrentStage(stage)}
              />
            </section>
          </main>
        )}
      </div>
    </ChapterProvider>
  );
}


