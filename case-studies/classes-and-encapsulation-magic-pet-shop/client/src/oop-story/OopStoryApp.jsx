import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Mic, MicOff, RotateCcw, Play, Zap, Shield, Sparkles } from 'lucide-react';

// Case Study 1 (Encapsulation) Data & Stage
import { PET_SHOP_EPISODES } from './story/petShopStoryData';
import { SCENE_CHOREOGRAPHY } from './story/sceneChoreography';
import PetShopStage from './components/PetShopStage';
import InteractivePetCare from './components/InteractivePetCare';
import GraduationCeremony from './components/GraduationCeremony';

// Case Study 2 (Inheritance) Data & Stage
import { HERO_ACADEMY_EPISODES } from './story/heroAcademyStoryData';
import { HERO_SCENE_CHOREOGRAPHY } from './story/heroSceneChoreography';
import HeroAcademyStage from './components/HeroAcademyStage';
import HeroMissionInteractive from './components/HeroMissionInteractive';
import HeroCreatorLab from './components/HeroCreatorLab';

// Shared Components & Services
import AdventureSelector from './components/AdventureSelector';
import SpeechBubble from './components/SpeechBubble';
import MagicCodeScroll from './components/MagicCodeScroll';
import StoryChoiceModal from './components/StoryChoiceModal';
import GuidedCodeChallenge from './components/GuidedCodeChallenge';
import FinalQuizModal from './components/FinalQuizModal';
import EpisodeNavigation from './components/EpisodeNavigation';
import { SoundService } from './services/soundEffects';

// CSS Styles
import './index.css';
import './styles/cartoonStage.css';
import './styles/petCareUI.css';
import './styles/heroAcademy.css';

export default function OopStoryApp() {
  // Top-level Case Study Selector: 'encapsulation' (CS1) vs 'inheritance' (CS2)
  const [activeCaseStudy, setActiveCaseStudy] = useState('encapsulation');

  // Shared Global Controls
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  // ----------------------------------------------------
  // CASE STUDY 1 (Encapsulation: Pet Shop) State
  // ----------------------------------------------------
  const [cs1EpisodeId, setCs1EpisodeId] = useState(1);
  const [cs1DialogueIdx, setCs1DialogueIdx] = useState(0);
  const [cs1DoorOpen, setCs1DoorOpen] = useState(false);
  const [buddyActor, setBuddyActor] = useState({ x: 44, y: 30, action: 'idle', mood: 'joyful', scaleX: 1, showStats: false, health: 100, happiness: 70, energy: 90, hasCape: false, visible: true });
  const [lunaActor, setLunaActor] = useState({ x: 75, y: 30, action: 'waving', scaleX: -1, visible: true });
  const [capsuleActor, setCapsuleActor] = useState({ x: 20, y: 30, action: 'hover', visible: false, shieldActive: true, lockOpen: false });
  const [cs1TamperEvent, setCs1TamperEvent] = useState(null);
  const [flyingProp, setFlyingProp] = useState(null);
  const [cs1StageProps, setCs1StageProps] = useState({});

  // ----------------------------------------------------
  // CASE STUDY 2 (Inheritance: Hero Academy) State
  // ----------------------------------------------------
  const [cs2EpisodeId, setCs2EpisodeId] = useState(1);
  const [cs2DialogueIdx, setCs2DialogueIdx] = useState(0);
  const [cs2DoorsOpen, setCs2DoorsOpen] = useState(false);
  const [novaActor, setNovaActor] = useState({ x: 75, y: 25, action: 'talking', scaleX: -1, visible: true });
  const [zippyActor, setZippyActor] = useState({ x: 18, y: 25, action: 'idle', scaleX: 1, visible: true, health: 100 });
  const [emberActor, setEmberActor] = useState({ x: 42, y: 25, action: 'idle', scaleX: 1, visible: true, health: 100 });
  const [shieldyActor, setShieldyActor] = useState({ x: 64, y: 25, action: 'idle', scaleX: 1, visible: true, health: 100 });
  const [heroParentBadge, setHeroParentBadge] = useState({ visible: false, streamActive: false, highlightFeature: null });
  const [cs2TamperEvent, setCs2TamperEvent] = useState(null);
  const [customHero, setCustomHero] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const timelineTimeoutsRef = useRef([]);

  // Helper to clear existing timeline timeouts
  const clearTimeline = () => {
    timelineTimeoutsRef.current.forEach(t => clearTimeout(t));
    timelineTimeoutsRef.current = [];
  };

  // Pure baseline state factory for Case Study 1 (eliminates dirty prev state leakage)
  const getInitialCS1State = (epId) => {
    const ch = SCENE_CHOREOGRAPHY[epId] || SCENE_CHOREOGRAPHY[1];
    const ep = PET_SHOP_EPISODES.find(e => e.id === epId) || PET_SHOP_EPISODES[0];

    const defaultBuddy = {
      x: 44,
      y: 30,
      action: 'idle',
      mood: 'joyful',
      scaleX: 1,
      showStats: epId >= 2,
      health: epId === 10 ? -500 : (epId === 14 ? 70 : 100),
      happiness: epId === 14 ? 65 : 70,
      energy: epId === 14 ? 60 : 90,
      hasCape: epId === 17,
      visible: true
    };

    const defaultLuna = {
      x: 75,
      y: 30,
      action: epId === 17 ? 'celebrating' : 'waving',
      scaleX: -1,
      visible: true
    };

    const defaultCapsule = {
      x: 20,
      y: 30,
      action: 'hover',
      visible: epId >= 11,
      shieldActive: true,
      lockOpen: false
    };

    return {
      doorOpen: epId > 1 || !!ch?.initial?.doorOpen,
      buddy: { ...defaultBuddy, ...(ch?.initial?.buddy || {}) },
      luna: { ...defaultLuna, ...(ch?.initial?.luna || {}) },
      capsule: { ...defaultCapsule, ...(ch?.initial?.capsule || {}) },
      tamperEvent: ch?.initial?.tamperEvent || null,
      flyingProp: null,
      stageProps: { ...(ep?.stageProps || {}), ...(ch?.initial?.stageProps || {}) }
    };
  };

  // ----------------------------------------------------
  // Animation Timelines Runner
  // ----------------------------------------------------
  const startSceneAnimation = (caseStudy, epId) => {
    clearTimeline();
    SoundService.stopSpeech();

    if (caseStudy === 'encapsulation') {
      // 1. Reset all actors to clean baseline for this episode (no dirty merges)
      const initialState = getInitialCS1State(epId);
      setCs1DoorOpen(initialState.doorOpen);
      setBuddyActor(initialState.buddy);
      setLunaActor(initialState.luna);
      setCapsuleActor(initialState.capsule);
      setCs1TamperEvent(initialState.tamperEvent);
      setFlyingProp(null);
      setCs1StageProps(initialState.stageProps);

      // 2. Run timeline keyframe events if defined
      const ch = SCENE_CHOREOGRAPHY[epId] || SCENE_CHOREOGRAPHY[1];
      if (ch.timeline && ch.timeline.length > 0) {
        ch.timeline.forEach(step => {
          const timeoutId = setTimeout(() => {
            if (step.sound) {
              if (step.sound === 'bark') SoundService.playBark();
              else if (step.sound === 'boing') SoundService.playBoing();
              else if (step.sound === 'chime') SoundService.playChime();
              else if (step.sound === 'sadWobble') SoundService.playSadWobble();
              else if (step.sound === 'pop') SoundService.playPop();
              else if (step.sound === 'success') SoundService.playSuccess();
              else if (step.sound === 'fanfare') SoundService.playFanfare();
            }

            if (step.updates) {
              if (step.updates.doorOpen !== undefined) setCs1DoorOpen(step.updates.doorOpen);
              if (step.updates.tamperEvent !== undefined) setCs1TamperEvent(step.updates.tamperEvent);
              if (step.updates.buddy) setBuddyActor(prev => ({ ...prev, ...step.updates.buddy }));
              if (step.updates.luna) setLunaActor(prev => ({ ...prev, ...step.updates.luna }));
              if (step.updates.capsule) setCapsuleActor(prev => ({ ...prev, ...step.updates.capsule }));
              if (step.updates.flyingProp !== undefined) setFlyingProp(step.updates.flyingProp);
              if (step.updates.stageProps) setCs1StageProps(prev => ({ ...prev, ...step.updates.stageProps }));
            }
          }, step.t);

          timelineTimeoutsRef.current.push(timeoutId);
        });
      }
    } else {
      // CS2 (Hero Academy) Animation Timeline
      const ch = HERO_SCENE_CHOREOGRAPHY[epId] || HERO_SCENE_CHOREOGRAPHY[1];
      if (ch.initial) {
        setCs2DoorsOpen(!!ch.initial.doorsOpen);
        setNovaActor(prev => ({ ...prev, ...(ch.initial.nova || {}) }));
        setZippyActor(prev => ({ ...prev, ...(ch.initial.zippy || {}) }));
        setEmberActor(prev => ({ ...prev, ...(ch.initial.ember || {}) }));
        setShieldyActor(prev => ({ ...prev, ...(ch.initial.shieldy || {}) }));
        setHeroParentBadge(ch.initial.heroParentBadge || { visible: false });
        setCs2TamperEvent(ch.initial.tamperEvent || null);
      }

      if (ch.timeline && ch.timeline.length > 0) {
        ch.timeline.forEach(step => {
          const timeoutId = setTimeout(() => {
            if (step.sound) {
              if (step.sound === 'whoosh') SoundService.playWhoosh();
              else if (step.sound === 'zap') SoundService.playZap();
              else if (step.sound === 'flame') SoundService.playFlame();
              else if (step.sound === 'shield') SoundService.playShieldClank();
              else if (step.sound === 'powerUp') SoundService.playPowerUp();
              else if (step.sound === 'chime') SoundService.playChime();
              else if (step.sound === 'sadWobble') SoundService.playSadWobble();
              else if (step.sound === 'pop') SoundService.playPop();
              else if (step.sound === 'success') SoundService.playSuccess();
              else if (step.sound === 'fanfare') SoundService.playFanfare();
            }

            if (step.updates) {
              if (step.updates.doorsOpen !== undefined) setCs2DoorsOpen(step.updates.doorsOpen);
              if (step.updates.tamperEvent !== undefined) setCs2TamperEvent(step.updates.tamperEvent);
              if (step.updates.heroParentBadge !== undefined) setHeroParentBadge(step.updates.heroParentBadge);
              if (step.updates.nova) setNovaActor(prev => ({ ...prev, ...step.updates.nova }));
              if (step.updates.zippy) setZippyActor(prev => ({ ...prev, ...step.updates.zippy }));
              if (step.updates.ember) setEmberActor(prev => ({ ...prev, ...step.updates.ember }));
              if (step.updates.shieldy) setShieldyActor(prev => ({ ...prev, ...step.updates.shieldy }));
            }
          }, step.t);

          timelineTimeoutsRef.current.push(timeoutId);
        });
      }
    }
  };

  // Sync on Case Study Switch
  useEffect(() => {
    SoundService.stopSpeech();
    if (activeCaseStudy === 'encapsulation') {
      startSceneAnimation('encapsulation', cs1EpisodeId);
    } else {
      startSceneAnimation('inheritance', cs2EpisodeId);
    }

    return () => clearTimeline();
  }, [activeCaseStudy]);

  // Sync on CS1 Episode Change (Forward / Backward Navigation)
  useEffect(() => {
    if (activeCaseStudy === 'encapsulation') {
      setCs1DialogueIdx(0);
      startSceneAnimation('encapsulation', cs1EpisodeId);
    }
    return () => clearTimeline();
  }, [cs1EpisodeId]);

  // Sync on CS2 Episode Change
  useEffect(() => {
    if (activeCaseStudy === 'inheritance') {
      setCs2DialogueIdx(0);
      startSceneAnimation('inheritance', cs2EpisodeId);
    }
    return () => clearTimeline();
  }, [cs2EpisodeId]);

  // Active episode reference
  const cs1Episode = PET_SHOP_EPISODES.find(e => e.id === cs1EpisodeId) || PET_SHOP_EPISODES[0];
  const cs2Episode = HERO_ACADEMY_EPISODES.find(e => e.id === cs2EpisodeId) || HERO_ACADEMY_EPISODES[0];

  const currentEpisode = activeCaseStudy === 'encapsulation' ? cs1Episode : cs2Episode;
  const currentDialogueIdx = activeCaseStudy === 'encapsulation' ? cs1DialogueIdx : cs2DialogueIdx;

  // ----------------------------------------------------
  // Dialogue & Navigation Handlers
  // ----------------------------------------------------
  const handleNextLine = () => {
    if (currentDialogueIdx < currentEpisode.dialogue.length - 1) {
      const nextIdx = currentDialogueIdx + 1;
      if (activeCaseStudy === 'encapsulation') {
        setCs1DialogueIdx(nextIdx);
        const line = cs1Episode.dialogue[nextIdx];
        if (line && line.speaker === 'Buddy') {
          setBuddyActor(b => ({ ...b, action: 'waving', mood: 'joyful' }));
          setTimeout(() => setBuddyActor(b => ({ ...b, action: 'idle' })), 1200);
        } else if (line && line.speaker === 'Capsule') {
          setCapsuleActor(c => ({ ...c, action: 'bouncing' }));
          setTimeout(() => setCapsuleActor(c => ({ ...c, action: 'hover' })), 1200);
        } else if (line && line.speaker === 'Luna') {
          setLunaActor(l => ({ ...l, action: 'waving' }));
          setTimeout(() => setLunaActor(l => ({ ...l, action: 'idle' })), 1200);
        }
      } else {
        setCs2DialogueIdx(nextIdx);
        const line = cs2Episode.dialogue[nextIdx];
        if (line && line.speaker === 'Zippy') {
          setZippyActor(z => ({ ...z, action: 'waving' }));
          setTimeout(() => setZippyActor(z => ({ ...z, action: 'idle' })), 1200);
        } else if (line && line.speaker === 'Ember') {
          setEmberActor(e => ({ ...e, action: 'waving' }));
          setTimeout(() => setEmberActor(e => ({ ...e, action: 'idle' })), 1200);
        } else if (line && line.speaker === 'Shieldy') {
          setShieldyActor(s => ({ ...s, action: 'flexing' }));
          setTimeout(() => setShieldyActor(s => ({ ...s, action: 'idle' })), 1200);
        } else if (line && (line.speaker === 'Professor Nova' || line.speaker === 'Nova')) {
          setNovaActor(n => ({ ...n, action: 'talking' }));
        }
      }
    }
  };

  const handleNextEpisode = () => {
    if (activeCaseStudy === 'encapsulation') {
      if (cs1EpisodeId < PET_SHOP_EPISODES.length) setCs1EpisodeId(id => id + 1);
    } else {
      if (cs2EpisodeId < HERO_ACADEMY_EPISODES.length) setCs2EpisodeId(id => id + 1);
    }
  };

  const handlePrevEpisode = () => {
    if (activeCaseStudy === 'encapsulation') {
      if (cs1EpisodeId > 1) setCs1EpisodeId(id => id - 1);
    } else {
      if (cs2EpisodeId > 1) setCs2EpisodeId(id => id - 1);
    }
  };

  const handleSelectEpisode = (epId) => {
    if (activeCaseStudy === 'encapsulation') setCs1EpisodeId(epId);
    else setCs2EpisodeId(epId);
  };

  const handleRestartAdventure = () => {
    if (activeCaseStudy === 'encapsulation') {
      setCs1EpisodeId(1);
      setCs1DialogueIdx(0);
      startSceneAnimation('encapsulation', 1);
    } else {
      setCs2EpisodeId(1);
      setCs2DialogueIdx(0);
      setCustomHero(null);
      setQuizFinished(false);
      startSceneAnimation('inheritance', 1);
    }
  };

  const toggleSound = () => {
    const newVal = !soundOn;
    setSoundOn(newVal);
    SoundService.setSoundEnabled(newVal);
  };

  const toggleVoice = () => {
    const newVal = !voiceOn;
    setVoiceOn(newVal);
    SoundService.setVoiceEnabled(newVal);
  };

  // Case Study 2 Interactive Hero Action Dispatcher
  const handleTriggerHeroAction = (heroId, actionType) => {
    if (heroId === 'zippy') {
      if (actionType === 'fight') {
        setZippyActor(z => ({ ...z, action: 'celebrating' }));
        setTimeout(() => setZippyActor(z => ({ ...z, action: 'idle' })), 1400);
      } else if (actionType === 'running') {
        setZippyActor(z => ({ ...z, action: 'running' }));
        setTimeout(() => setZippyActor(z => ({ ...z, action: 'idle' })), 1800);
      }
    } else if (heroId === 'ember') {
      if (actionType === 'fight') {
        setEmberActor(e => ({ ...e, action: 'celebrating' }));
        setTimeout(() => setEmberActor(e => ({ ...e, action: 'idle' })), 1400);
      } else if (actionType === 'fire-blast') {
        setEmberActor(e => ({ ...e, action: 'fire-blast' }));
        setTimeout(() => setEmberActor(e => ({ ...e, action: 'idle' })), 1800);
      }
    } else if (heroId === 'shieldy') {
      if (actionType === 'fight') {
        setShieldyActor(s => ({ ...s, action: 'celebrating' }));
        setTimeout(() => setShieldyActor(s => ({ ...s, action: 'idle' })), 1400);
      } else if (actionType === 'shield-block') {
        setShieldyActor(s => ({ ...s, action: 'shield-block' }));
        setTimeout(() => setShieldyActor(s => ({ ...s, action: 'idle' })), 1800);
      }
    }
  };

  // Case Study 1 Physical Prop Animations (Scene 14)
  const handleTriggerPropAnimation = (propData) => {
    if (propData.type === 'feed') {
      setFlyingProp({ icon: '🍎', x: propData.startX, y: propData.startY, scale: 1.2 });
      setTimeout(() => {
        setFlyingProp({ icon: '🍎', x: propData.targetX, y: propData.targetY, scale: 0.8, eating: true });
        setBuddyActor(b => ({
          ...b,
          action: 'eating',
          mood: 'joyful',
          health: Math.min(100, (b.health || 70) + 15),
          happiness: Math.min(100, (b.happiness || 65) + 10)
        }));
      }, 350);

      setTimeout(() => {
        setFlyingProp(null);
        setBuddyActor(b => ({ ...b, action: 'idle' }));
      }, 1600);
    } else if (propData.type === 'play') {
      setFlyingProp({ icon: '🎾', x: propData.startX, y: propData.startY });
      setBuddyActor(b => ({ ...b, action: 'walking', scaleX: -1, x: 28 }));

      setTimeout(() => {
        setFlyingProp({ icon: '🎾', x: propData.targetX, y: propData.targetY, scale: 0.8 });
        setBuddyActor(b => ({
          ...b,
          action: 'jumping',
          scaleX: 1,
          x: 42,
          happiness: Math.min(100, (b.happiness || 65) + 25),
          energy: Math.max(10, (b.energy || 60) - 15)
        }));
      }, 700);

      setTimeout(() => {
        setFlyingProp(null);
        setBuddyActor(b => ({ ...b, action: 'idle' }));
      }, 1600);
    } else if (propData.type === 'heal') {
      setFlyingProp({ icon: '💚', x: propData.startX, y: propData.startY });
      setTimeout(() => {
        setBuddyActor(b => ({
          ...b,
          action: 'jumping',
          mood: 'joyful',
          health: Math.min(100, (b.health || 70) + 30)
        }));
      }, 400);

      setTimeout(() => {
        setFlyingProp(null);
        setBuddyActor(b => ({ ...b, action: 'idle' }));
      }, 1800);
    } else if (propData.type === 'overfeed') {
      setFlyingProp({ icon: '🍬', x: propData.startX, y: propData.startY });
      setCapsuleActor(c => ({ ...c, x: 34, action: 'bouncing', shieldActive: true }));

      setTimeout(() => {
        setFlyingProp({ icon: '💥', x: 34, y: propData.targetY, scale: 1.4 });
      }, 450);

      setTimeout(() => {
        setFlyingProp(null);
        setCapsuleActor(c => ({ ...c, x: 18, action: 'hover' }));
      }, 1400);
    }
  };

  const isCaseStudy1 = activeCaseStudy === 'encapsulation';

  return (
    <div className={isCaseStudy1 ? "petshop-app-root" : "hero-academy-root"}>
      {/* Top Header Bar */}
      <header className={isCaseStudy1 ? "petshop-header" : "hero-academy-header"}>
        {/* Brand Badge */}
        <div className={isCaseStudy1 ? "brand-badge" : "hero-brand-badge"}>
          <span style={{ fontSize: '1.6rem' }}>{isCaseStudy1 ? '🐾' : '⚡'}</span>
          <div>
            <h1 className={isCaseStudy1 ? "brand-title" : "hero-brand-title"}>
              {isCaseStudy1 ? "Buddy's Magic Pet Shop" : "Hero Academy — The Power Family"}
            </h1>
            <div className={isCaseStudy1 ? "" : "hero-brand-subtitle"} style={isCaseStudy1 ? { fontSize: '0.85rem', color: '#B45309', fontWeight: 600 } : {}}>
              {isCaseStudy1 ? "Case Study: Python Encapsulation" : "Case Study 2: Python Inheritance in OOP"}
            </div>
          </div>
        </div>

        {/* Global Controls & Replay */}
        <div className="header-controls">
          <button
            className="icon-btn-round"
            onClick={() => {
              if (isCaseStudy1) setCs1DialogueIdx(0);
              else setCs2DialogueIdx(0);
              startSceneAnimation(activeCaseStudy, isCaseStudy1 ? cs1EpisodeId : cs2EpisodeId);
            }}
            title="Replay Scene Animation"
          >
            <RotateCcw size={16} /> Replay
          </button>

          <button
            className={`icon-btn-round ${soundOn ? 'active' : ''}`}
            onClick={toggleSound}
            title={soundOn ? "Sound Effects ON" : "Sound Effects OFF"}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>Sound</span>
          </button>

          <button
            className={`icon-btn-round ${voiceOn ? 'active' : ''}`}
            onClick={toggleVoice}
            title={voiceOn ? "Voice Narration ON" : "Voice Narration OFF"}
          >
            {voiceOn ? <Mic size={18} /> : <MicOff size={18} />}
            <span>Voice</span>
          </button>
        </div>
      </header>

      {/* Case Study Adventure Selector Hub */}
      <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'center', margin: '4px 0 14px 0', padding: '0 16px' }}>
        <AdventureSelector
          activeCaseStudy={activeCaseStudy}
          onSelectCaseStudy={setActiveCaseStudy}
        />
      </div>

      {/* Main Theater */}
      <main className="theater-container">
        {/* Episode Title Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
          <div>
            <span style={{ fontFamily: 'Fredoka', fontSize: '1rem', color: isCaseStudy1 ? '#0369A1' : '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>
              {currentEpisode.subtitle}
            </span>
            <h2 style={{ fontFamily: 'Fredoka', fontSize: '1.6rem', color: isCaseStudy1 ? '#0F172A' : '#F8FAFC', margin: '2px 0 0 0' }}>
              {currentEpisode.title}
            </h2>
          </div>
          <div style={{
            fontFamily: 'Fredoka',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: isCaseStudy1 ? '#D97706' : '#FBBF24',
            background: isCaseStudy1 ? '#FEF3C7' : 'rgba(30, 41, 59, 0.9)',
            border: isCaseStudy1 ? 'none' : '1.5px solid #F59E0B',
            padding: '6px 16px',
            borderRadius: '999px'
          }}>
            Scene {currentEpisode.id} / {isCaseStudy1 ? PET_SHOP_EPISODES.length : HERO_ACADEMY_EPISODES.length}
          </div>
        </div>

        {/* 2D Animated Cartoon Theater Stage */}
        {isCaseStudy1 ? (
          // Case Study 1 Stage (Pet Shop) with deterministic key and props
          <PetShopStage
            key={`stage-cs1-${cs1EpisodeId}`}
            theme={currentEpisode.theme}
            doorOpen={cs1DoorOpen}
            buddy={buddyActor}
            luna={lunaActor}
            capsule={capsuleActor}
            tamperEvent={cs1TamperEvent}
            flyingProp={flyingProp}
            stageProps={cs1StageProps}
          />
        ) : (
          // Case Study 2 Stage (Hero Academy)
          <HeroAcademyStage
            key={`stage-cs2-${cs2EpisodeId}`}
            theme={currentEpisode.theme}
            doorsOpen={cs2DoorsOpen}
            nova={novaActor}
            zippy={zippyActor}
            ember={emberActor}
            shieldy={shieldyActor}
            heroParentBadge={heroParentBadge}
            tamperEvent={cs2TamperEvent}
            customHero={customHero}
          />
        )}

        {/* Dialogue & Speech Bubble */}
        <SpeechBubble
          key={`speech-${activeCaseStudy}-${currentEpisode.id}`}
          dialogueList={currentEpisode.dialogue}
          currentLineIndex={currentDialogueIdx}
          onNextLine={handleNextLine}
          onComplete={handleNextEpisode}
          isLastLine={currentDialogueIdx === currentEpisode.dialogue.length - 1}
        />

        {/* In-Story Interactive Choice */}
        {currentEpisode.interactiveType === 'mcq' && (
          <StoryChoiceModal
            key={`choice-${activeCaseStudy}-${currentEpisode.id}`}
            mcq={currentEpisode.mcq}
            onSolved={handleNextLine}
          />
        )}

        {/* CS1 Interactive Pet Care */}
        {isCaseStudy1 && currentEpisode.interactiveType === 'petCare' && (
          <InteractivePetCare
            key={`petcare-${cs1EpisodeId}`}
            buddyState={buddyActor}
            onUpdateBuddyState={setBuddyActor}
            onTriggerPropAnimation={handleTriggerPropAnimation}
          />
        )}

        {/* CS2 Interactive Hero Mission Dispatcher */}
        {!isCaseStudy1 && currentEpisode.interactiveType === 'heroMission' && (
          <HeroMissionInteractive
            key={`mission-${cs2EpisodeId}`}
            onTriggerHeroAction={handleTriggerHeroAction}
            onSolved={handleNextLine}
          />
        )}

        {/* Guided Code Challenge (CS1 or CS2) */}
        {currentEpisode.interactiveType === 'codeChallenge' && (
          <GuidedCodeChallenge
            key={`challenge-${activeCaseStudy}-${currentEpisode.id}`}
            challenge={currentEpisode.challenge}
            onSolved={handleNextLine}
          />
        )}

        {/* CS1 Final Quiz */}
        {isCaseStudy1 && currentEpisode.interactiveType === 'finalQuiz' && (
          <FinalQuizModal
            key={`quiz-cs1-${cs1EpisodeId}`}
            quizQuestions={currentEpisode.quizQuestions}
            onCompleted={handleNextEpisode}
          />
        )}

        {/* CS1 Graduation Ceremony */}
        {isCaseStudy1 && currentEpisode.interactiveType === 'graduation' && (
          <GraduationCeremony
            key={`grad-cs1-${cs1EpisodeId}`}
            onRestartStory={handleRestartAdventure}
          />
        )}

        {/* CS2 Final Quiz & Hero Creator Lab */}
        {!isCaseStudy1 && currentEpisode.interactiveType === 'heroQuizAndLab' && (
          <>
            {!quizFinished ? (
              <FinalQuizModal
                key={`quiz-cs2-${cs2EpisodeId}`}
                quizQuestions={currentEpisode.quizQuestions}
                onCompleted={() => setQuizFinished(true)}
              />
            ) : (
              <HeroCreatorLab
                key={`lab-cs2-${cs2EpisodeId}`}
                onSpawnCustomHero={(hero) => {
                  setCustomHero(hero);
                  setNovaActor(n => ({ ...n, action: 'celebrating' }));
                  setZippyActor(z => ({ ...z, action: 'celebrating' }));
                  setEmberActor(e => ({ ...e, action: 'celebrating' }));
                  setShieldyActor(s => ({ ...s, action: 'celebrating' }));
                }}
                onRestartAdventure={handleRestartAdventure}
              />
            )}
          </>
        )}

        {/* Python Code Scroll (if present in episode) */}
        {currentEpisode.codeSnippet && (
          <MagicCodeScroll
            key={`code-${activeCaseStudy}-${currentEpisode.id}`}
            codeSnippet={currentEpisode.codeSnippet}
          />
        )}

        {/* Story Takeaway Pill */}
        {currentEpisode.takeaway && (
          <div className="takeaway-pill">
            <span>{currentEpisode.takeaway}</span>
          </div>
        )}

        {/* Scene Stepper Bar */}
        <EpisodeNavigation
          episodes={isCaseStudy1 ? PET_SHOP_EPISODES : HERO_ACADEMY_EPISODES}
          currentEpisodeId={isCaseStudy1 ? cs1EpisodeId : cs2EpisodeId}
          onSelectEpisode={handleSelectEpisode}
          onPrev={handlePrevEpisode}
          onNext={handleNextEpisode}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          voiceOn={voiceOn}
          onToggleVoice={toggleVoice}
        />
      </main>
    </div>
  );
}
