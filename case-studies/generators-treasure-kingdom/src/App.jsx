import React, { useState } from 'react';
import Header from './components/Header';
import FooterNavigation from './components/FooterNavigation';
import AdventureMapModal from './components/AdventureMapModal';
import BackgroundCanvas from './components/BackgroundCanvas';
import { soundEngine } from './utils/soundEngine';

import Page1_Entrance from './slides/Page1_Entrance';
import Page2_CarryChallenge from './slides/Page2_CarryChallenge';
import Page3_IterableConcept from './slides/Page3_IterableConcept';
import Page4_WhoOpensTreasure from './slides/Page4_WhoOpensTreasure';
import Page5_IteratorConcept from './slides/Page5_IteratorConcept';
import Page6_ThirstyDilemma from './slides/Page6_ThirstyDilemma';
import Page7_GeneratorConcept from './slides/Page7_GeneratorConcept';
import Page8_MemoryMeter from './slides/Page8_MemoryMeter';
import Page9_YieldConcept from './slides/Page9_YieldConcept';
import Page10_SuperComparison from './slides/Page10_SuperComparison';
import Page11_BossMatchingGame from './slides/Page11_BossMatchingGame';
import Page12_MemoryCard from './slides/Page12_MemoryCard';
import Page13_VictorySandbox from './slides/Page13_VictorySandbox';

const SLIDES_CONFIG = [
  { id: 'slide-1', badge: 'Page 1 / 13', tag: '🏰 Kingdom Entrance', Component: Page1_Entrance, theme: null },
  { id: 'slide-2', badge: 'Page 2 / 13', tag: '📦 Carry Challenge', Component: Page2_CarryChallenge, theme: null },
  { id: 'slide-3', badge: 'Page 3 / 13', tag: '💡 Concept: Iterable', Component: Page3_IterableConcept, theme: 'iterable' },
  { id: 'slide-4', badge: 'Page 4 / 13', tag: '📖 New Story', Component: Page4_WhoOpensTreasure, theme: null },
  { id: 'slide-5', badge: 'Page 5 / 13', tag: '💡 Concept: Iterator', Component: Page5_IteratorConcept, theme: 'iterator' },
  { id: 'slide-6', badge: 'Page 6 / 13', tag: '🥤 Thirsty Dilemma', Component: Page6_ThirstyDilemma, theme: null },
  { id: 'slide-7', badge: 'Page 7 / 13', tag: '💡 Concept: Generator', Component: Page7_GeneratorConcept, theme: 'generator' },
  { id: 'slide-8', badge: 'Page 8 / 13', tag: '📊 Memory Meter', Component: Page8_MemoryMeter, theme: 'generator' },
  { id: 'slide-9', badge: 'Page 9 / 13', tag: '💡 Concept: Yield', Component: Page9_YieldConcept, theme: 'yield' },
  { id: 'slide-10', badge: 'Page 10 / 13', tag: '🏆 Super Comparison', Component: Page10_SuperComparison, theme: null },
  { id: 'slide-11', badge: 'Page 11 / 13', tag: '⚔️ Boss Challenge', Component: Page11_BossMatchingGame, theme: null },
  { id: 'slide-12', badge: 'Page 12 / 13', tag: '📖 Kingdom Map', Component: Page12_MemoryCard, theme: null },
  { id: 'slide-13', badge: 'Page 13 / 13', tag: '🏆 VICTORY!', Component: Page13_VictorySandbox, theme: null }
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMute = () => {
    const muted = soundEngine.toggleSound();
    setIsMuted(!muted);
  };

  return (
    <>
      <BackgroundCanvas />

      <div className="app-container">
        <Header
          currentSlide={currentSlide}
          onOpenMenu={() => setIsMenuOpen(true)}
        />

        <main>
          <div className="slide-viewport">
            {SLIDES_CONFIG.map((slideObj, index) => {
              const isActive = index === currentSlide;
              const { Component, id, badge, tag, theme } = slideObj;

              return (
                <section
                  key={id}
                  id={id}
                  className={`slide ${isActive ? 'active' : ''}`}
                  data-theme={theme || undefined}
                >
                  <div className="slide-header">
                    <span className="page-badge">{badge}</span>
                    <span className="concept-tag">{tag}</span>
                  </div>

                  <Component />
                </section>
              );
            })}
          </div>
        </main>

        <FooterNavigation
          currentSlide={currentSlide}
          totalSlides={SLIDES_CONFIG.length}
          onGoToSlide={(slideIdx) => setCurrentSlide(slideIdx)}
        />
      </div>

      <AdventureMapModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectSlide={(slideIdx) => setCurrentSlide(slideIdx)}
      />
    </>
  );
}
