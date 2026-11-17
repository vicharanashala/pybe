import React, { useState, useEffect, useCallback } from 'react';
import { CHAPTERS, MODULE_META } from './data/dasaraLesson.js';
import { sound } from './services/soundEngine.js';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Captions from './components/Captions.jsx';

import Chapter0Opening from './components/screens/Chapter0Opening.jsx';
import Chapter1StoryIntro from './components/screens/Chapter1StoryIntro.jsx';
import Chapter2MahishasuraRise from './components/screens/Chapter2MahishasuraRise.jsx';
import Chapter3NineDayBattle from './components/screens/Chapter3NineDayBattle.jsx';
import Chapter4TryExcept from './components/screens/Chapter4TryExcept.jsx';
import Chapter5RamaJourney from './components/screens/Chapter5RamaJourney.jsx';
import Chapter6Vijayadashami from './components/screens/Chapter6Vijayadashami.jsx';
import Chapter7CodeLab from './components/screens/Chapter7CodeLab.jsx';
import Chapter8Assessment from './components/screens/Chapter8Assessment.jsx';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState(new Set([0]));
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const [captionsVisible, setCaptionsVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // User input states
  const [ch2Answer, setCh2Answer] = useState(null);
  const [ch3Answer, setCh3Answer] = useState(null);
  const [ch5Answer, setCh5Answer] = useState(null);
  const [ch6Solved, setCh6Solved] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const currentChapter = CHAPTERS[currentIndex];

  // Narration playback handler
  const playNarration = useCallback((text) => {
    if (!text || !sound.narrationEnabled) {
      sound.stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    sound.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  }, []);

  // Sync narration and audio settings
  const handleToggleNarration = () => {
    const nextState = !narrationEnabled;
    setNarrationEnabled(nextState);
    sound.narrationEnabled = nextState;
    if (nextState) {
      sound.playClick();
      playNarration(currentChapter.narration);
    } else {
      sound.stopSpeaking();
      setIsSpeaking(false);
    }
  };

  const handleToggleSfx = () => {
    const nextState = !sfxEnabled;
    setSfxEnabled(nextState);
    sound.sfxEnabled = nextState;
    if (nextState) sound.playClick();
  };

  const handleToggleCaptions = () => {
    sound.playClick();
    setCaptionsVisible((prev) => !prev);
  };

  // Chapter navigation
  const goToChapter = useCallback(
    (idx) => {
      if (idx < 0 || idx >= CHAPTERS.length) return;
      sound.stopSpeaking();
      setIsSpeaking(false);
      setCurrentIndex(idx);
      setCompletedIndices((prev) => new Set([...prev, idx]));
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger narration on next chapter if enabled
      setTimeout(() => {
        if (sound.narrationEnabled && CHAPTERS[idx].narration) {
          playNarration(CHAPTERS[idx].narration);
        }
      }, 150);
    },
    [playNarration]
  );

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) goToChapter(currentIndex - 1);
  }, [currentIndex, goToChapter]);

  const handleNext = useCallback(() => {
    if (currentIndex < CHAPTERS.length - 1) goToChapter(currentIndex + 1);
  }, [currentIndex, goToChapter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing into an input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Opening screen start handlers
  const handleStartLab = (enableVoice) => {
    if (enableVoice) {
      setNarrationEnabled(true);
      sound.narrationEnabled = true;
    }
    goToChapter(1);
  };

  return (
    <div className="app-shell">
      {/* Skip to Content for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main learning content
      </a>

      {/* Header bar */}
      <Header
        chapters={CHAPTERS}
        currentIndex={currentIndex}
        onSelectChapter={goToChapter}
        sfxEnabled={sfxEnabled}
        onToggleSfx={handleToggleSfx}
        narrationEnabled={narrationEnabled}
        onToggleNarration={handleToggleNarration}
        captionsVisible={captionsVisible}
        onToggleCaptions={handleToggleCaptions}
        completedIndices={completedIndices}
      />

      {/* Main Screen Content */}
      <main id="main-content" className="site-main" role="main">
        {currentIndex === 0 && (
          <Chapter0Opening
            chapter={currentChapter}
            onStart={() => handleStartLab(true)}
            onStartQuiet={() => handleStartLab(false)}
          />
        )}

        {currentIndex === 1 && (
          <Chapter1StoryIntro
            chapter={currentChapter}
            onContinue={handleNext}
          />
        )}

        {currentIndex === 2 && (
          <Chapter2MahishasuraRise
            chapter={currentChapter}
            selectedAnswer={ch2Answer}
            onAnswerSelected={(ans) => setCh2Answer(ans)}
            onContinue={handleNext}
          />
        )}

        {currentIndex === 3 && (
          <Chapter3NineDayBattle
            chapter={currentChapter}
            selectedAnswer={ch3Answer}
            onAnswerSelected={(ans) => setCh3Answer(ans)}
            onContinue={handleNext}
          />
        )}

        {currentIndex === 4 && (
          <Chapter4TryExcept
            chapter={currentChapter}
            onContinue={handleNext}
          />
        )}

        {currentIndex === 5 && (
          <Chapter5RamaJourney
            chapter={currentChapter}
            selectedAnswer={ch5Answer}
            onAnswerSelected={(ans) => setCh5Answer(ans)}
            onContinue={handleNext}
          />
        )}

        {currentIndex === 6 && (
          <Chapter6Vijayadashami
            chapter={currentChapter}
            onChallengeSolved={() => setCh6Solved(true)}
            onContinue={handleNext}
          />
        )}

        {currentIndex === 7 && (
          <Chapter7CodeLab
            chapter={currentChapter}
            onContinue={handleNext}
          />
        )}

        {currentIndex === 8 && (
          <Chapter8Assessment
            chapter={currentChapter}
            savedAnswers={assessmentResult?.userAnswers}
            onAssessmentComplete={(res) => setAssessmentResult(res)}
            onRestart={() => goToChapter(0)}
          />
        )}
      </main>

      {/* Narration Captions Ribbon */}
      {captionsVisible && currentChapter.narration && (
        <Captions
          text={currentChapter.narration}
          isSpeaking={isSpeaking}
          onClose={() => setCaptionsVisible(false)}
        />
      )}

      {/* Footer navigation */}
      <Footer
        currentIndex={currentIndex}
        totalChapters={CHAPTERS.length}
        chapterTitle={currentChapter.title}
        onPrev={handlePrev}
        onNext={handleNext}
        canGoNext={true}
        isComplete={completedIndices.size === CHAPTERS.length}
      />
    </div>
  );
}
