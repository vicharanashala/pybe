import { useState } from 'react';
import { RouterProvider, useRouter } from './shared-components/Router';
import { GlassCard } from './shared-components/GlassCard';
import { EpisodeLayout } from './shared-components/EpisodeLayout';
import { 
  Introduction, 
  Story, 
  Problem, 
  Observation, 
  Exploration,
  Discovery, 
  ConceptReveal, 
  GuidedPractice, 
  Reflection 
} from './learning/pages';
import {
  DictIntroduction,
  DictStory,
  DictProblem,
  DictObservation,
  DictExploration,
  DictDiscovery,
  DictConceptReveal,
  DictGuidedPractice,
  DictReflection
} from './learning/dict-pages';
import { TestPage, CodingPage, QnaPage, DictQnaPage, DICT_TEST_QUESTIONS } from './assessment/pages';
import type { CodingChallenge } from './assessment/types';
import { 
  BookOpen, 
  HelpCircle, 
  Code, 
  User, 
  Award,
  Sliders,
  ChevronLeft,
  RefreshCw,
  Menu,
  Flame,
  X,
  Home as HomeIcon
} from 'lucide-react';



function MainAppContent() {
  const { currentRoute, navigate } = useRouter();

  // Navigation Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Learning sub-stepping states (0 to 7) for the 8 empty templates
  const [learningStep, setLearningStep] = useState<number>(0);
  const totalLearningSteps = 9;

  // Stepper Assessment states
  const [assessmentStep, setAssessmentStep] = useState<number>(1);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);

  // Home Dashboard States
  const [activeTopicModal, setActiveTopicModal] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<'sets' | 'dicts'>('sets');

  // Settings states
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(false);

  // Decoupled Assessment Data Structures

  const activeCodingChallenge: CodingChallenge = {
    id: 'challenge-stage3-sets',
    title: 'Sets Pocket Challenge',
    instructions: 'Help Nobita filter duplicate items from his pocket. Define a set named "pocket" using the set() constructor from the duplicate "pocket_list" array. Print the resulting pocket set, then verify if "Bamboo Copter" is in it.',
    starterCode: `# Pocket duplicates filter challenge\npocket_list = ["Anywhere Door", "Bamboo Copter", "Anywhere Door", "Shrink Ray", "Bamboo Copter"]\n\n# Create a set from the list\npocket = set(pocket_list)\n\n# Print the set\nprint(pocket)\n\n# Check if "Bamboo Copter" is in the set\nprint("Bamboo Copter" in pocket)\n`,
    tests: [
      {
        description: 'Verify "pocket" is a set containing unique gadgets',
        testCode: 'assert isinstance(pocket, set) and len(pocket) == 3 and "Anywhere Door" in pocket and "Bamboo Copter" in pocket and "Shrink Ray" in pocket'
      },
      {
        description: 'Verify the console output prints True for membership lookup',
        testCode: 'assert "Bamboo Copter" in pocket'
      }
    ],
    hints: [
      'Call set(pocket_list) to filter duplicate strings.',
      'Use print(pocket) and print("Bamboo Copter" in pocket).'
    ]
  };



  // Dynamic dialogue text array for the 8 learning sub-steps
  const getLearningDialogue = (): string[] => {
    if (currentTopic === 'dicts') {
      switch (learningStep) {
        case 0:
          return [
            "Welcome! In this episode, we study structured key-value database mappings.",
            "Let's review the high-level roadmap for Python Dictionaries."
          ];
        case 1:
          return [
            "Nobita has 5 gadgets and 5 secret activation codes on two separate lists!",
            "Gian challenges him to a duel. What happens when separate lists get out of sync?"
          ];
        case 2:
          return [
            "Inspect Nobita's desk below. Look at List A (Gadgets) and List B (Actions).",
            "What goes wrong when looking up items by index positions?"
          ];
        case 3:
          return [
            "What do you notice about Nobita's lists?",
            "Answer each question yourself before anything is revealed."
          ];
        case 4:
          return [
            "Try to pair each gadget name directly to its activation action manually!",
            "Build Nobita's codebook step by step."
          ];
        case 5:
          return [
            "Doraemon asks: 'What rule made your codebook lookups instant and crash-proof?'",
            "Select the rule you discovered."
          ];
        case 6:
          return [
            "Meet the Python Dictionary! Enforce key-value pairs with {key: value}.",
            "Test key lookups using the interactive animator."
          ];
        case 7:
          return [
            "Time to test what you know using Doraemon's world — predictions, not programming!",
            "Spot the Dictionary and predict key lookup outputs."
          ];
        case 8:
          return [
            "The episode is wrapping up. Nobita activated the right gadget just in time!",
            "Take a moment to look back at what made that possible."
          ];
        default:
          return ["Study each template page step-by-step!"];
      }
    }

    switch (learningStep) {
      case 0:
        return [
          "Welcome! In this section, we lay out the objectives for studying unique item collections.",
          "Let's review the high-level roadmap to guide our conceptual journey."
        ];
      case 1:
        return [
          "Nobita, sorting dinosaur stamps by hand is taking too long!",
          "Look at Suneo's high-stakes challenge below. How can we check containment instantly?"
        ];
      case 2:
        return [
          "Nobita's box is a mess! Look carefully at what's inside.",
          "Can you spot what's making the search so slow for him?"
        ];
      case 3:
        return [
          "Now it's your turn to look closely at Nobita's situation.",
          "Answer each question yourself before anything is revealed."
        ];
      case 4:
        return [
          "Doraemon steps back: 'Try to solve it yourself first, Nobita.'",
          "Pick an approach and see how far you get before the answer reveals itself."
        ];
      case 5:
        return [
          "Doraemon noticed something while you were working.",
          "He's going to ask you to put what you discovered into words."
        ];
      case 6:
        return [
          "You discovered the rule. Python already has a name for it.",
          "Meet the data type that enforces that rule automatically."
        ];
      case 7:
        return [
          "Time to test what you know — using Doraemon's world, not code.",
          "Four activities. Predictions, not programming."
        ];
      case 8:
        return [
          "The episode is wrapping up. Nobita beat Suneo's challenge.",
          "Take a moment to look back at what made that possible."
        ];
      default:
        return ["Study each template page step-by-step!"];
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Left Drawer Backdrop Overlay */}
      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 10, 22, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 150,
            transition: 'opacity 0.2s'
          }}
        />
      )}

      {/* 2. Left Sliding Navigation Drawer */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: '#091124',
        borderRight: '3px solid #008cff',
        boxShadow: '10px 0 30px rgba(0,0,0,0.3)',
        zIndex: 160,
        transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1.5px dashed rgba(0, 140, 255, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Logo Mascot Bell Avatar */}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#008cff',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ef4444'
            }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', bottom: '1px' }}>
                <div style={{ display: 'flex', gap: '1px', position: 'absolute', top: '1px', left: '4px' }}>
                  <div style={{ width: '3px', height: '5px', backgroundColor: 'black', borderRadius: '50%' }} />
                  <div style={{ width: '3px', height: '5px', backgroundColor: 'black', borderRadius: '50%' }} />
                </div>
                <div style={{ width: '4px', height: '4px', backgroundColor: '#ef4444', borderRadius: '50%', position: 'absolute', top: '5px', left: '7px' }} />
              </div>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.3px' }}>
              PyBe Navigation
            </span>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Navigation Links list */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          
          {/* Link 1: Concept Hub */}
          <button
            onClick={() => {
              navigate('home');
              setIsDrawerOpen(false);
            }}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: currentRoute === 'home' ? 'rgba(0, 140, 255, 0.12)' : 'transparent',
              border: `1.5px solid ${currentRoute === 'home' ? '#008cff' : 'transparent'}`,
              color: currentRoute === 'home' ? 'white' : '#64748b',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (currentRoute !== 'home') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.color = '#38bdf8';
              }
            }}
            onMouseLeave={(e) => {
              if (currentRoute !== 'home') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }
            }}
          >
            <HomeIcon size={16} />
            Concept Hub
          </button>

          {/* Link 2: My Profile */}
          <button
            onClick={() => {
              navigate('profile');
              setIsDrawerOpen(false);
            }}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: currentRoute === 'profile' ? 'rgba(0, 140, 255, 0.12)' : 'transparent',
              border: `1.5px solid ${currentRoute === 'profile' ? '#008cff' : 'transparent'}`,
              color: currentRoute === 'profile' ? 'white' : '#64748b',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (currentRoute !== 'profile') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.color = '#38bdf8';
              }
            }}
            onMouseLeave={(e) => {
              if (currentRoute !== 'profile') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: currentRoute === 'profile' ? '#008cff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <User size={12} />
            </div>
            My Profile
          </button>

          {/* Link 3: Workspace Settings */}
          <button
            onClick={() => {
              navigate('settings');
              setIsDrawerOpen(false);
            }}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              background: currentRoute === 'settings' ? 'rgba(0, 140, 255, 0.12)' : 'transparent',
              border: `1.5px solid ${currentRoute === 'settings' ? '#008cff' : 'transparent'}`,
              color: currentRoute === 'settings' ? 'white' : '#64748b',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (currentRoute !== 'settings') {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.color = '#38bdf8';
              }
            }}
            onMouseLeave={(e) => {
              if (currentRoute !== 'settings') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }
            }}
          >
            <Sliders size={16} />
            Workspace Settings
          </button>



        </div>

        {/* Drawer Version Footer */}
        <div style={{
          padding: '24px',
          fontSize: '11px',
          color: '#475569',
          borderTop: '1px solid rgba(255,255,255,0.03)'
        }}>
          PyBe Journey v1.1
        </div>
      </div>

      {/* Top Header Bar matching Screenshot (Scaled Up) */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid rgba(0, 140, 255, 0.08)',
        padding: '20px 36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
      }}>
        {/* Left Side: Hamburger Menu & Py Be Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            style={{ background: 'transparent', border: 'none', color: '#008cff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={30} />
          </button>
          
          <div 
            onClick={() => navigate('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          >
            {/* Logo Mascot Bell Avatar (Scaled to 42px) */}
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#008cff',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #ef4444'
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', bottom: '1px' }}>
                <div style={{ display: 'flex', gap: '2px', position: 'absolute', top: '2px', left: '6px' }}>
                  <div style={{ width: '4px', height: '7px', backgroundColor: 'black', borderRadius: '50%' }} />
                  <div style={{ width: '4px', height: '7px', backgroundColor: 'black', borderRadius: '50%' }} />
                </div>
                <div style={{ width: '5px', height: '5px', backgroundColor: '#ef4444', borderRadius: '50%', position: 'absolute', top: '8px', left: '11px' }} />
              </div>
            </div>
            <span style={{ fontSize: '26px', fontWeight: 900, color: '#008cff', letterSpacing: '-0.8px' }}>
              Py <span style={{ color: '#ef4444' }}>Be</span>
            </span>
          </div>
        </div>

        {/* Center Side: Progress Pill */}
        <div style={{
          backgroundColor: '#eff6ff',
          padding: '10px 24px',
          borderRadius: '9999px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1.5px solid rgba(59, 130, 246, 0.15)'
        }}>
          <span style={{ color: '#22c55e', fontSize: '18px' }}>⏱</span>
          0 / 2 Completed
        </div>

        {/* Right Side: Streak Flame badge */}
        <div style={{
          border: '2.5px solid #f97316',
          borderRadius: '9999px',
          padding: '10px 22px',
          backgroundColor: 'rgba(249, 115, 22, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#f97316',
          fontSize: '16px',
          fontWeight: 800
        }}>
          <Flame size={18} fill="#f97316" />
          1
        </div>
      </header>

      {/* Main Page Area */}
      <main 
        key={currentRoute}
        style={{
          flex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '30px 20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative'
        }} 
        className="animate-fade-in"
      >
        
        {/* --- 1. HOME PROGRESSION GRID ROUTE --- */}
        {currentRoute === 'home' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '20px 0'
          }}>
            <GlassCard style={{
              width: '100%',
              maxWidth: '1200px',
              borderRadius: '24px',
              border: '1.5px solid rgba(0, 140, 255, 0.15)',
              display: 'flex',
              overflow: 'hidden',
              flexWrap: 'wrap',
              background: 'white',
              boxShadow: '0 20px 40px rgba(0, 140, 255, 0.06)'
            }}>
              
              {/* Left Column - Mascot and Progress Stats */}
              <div style={{
                flex: '1 1 400px',
                padding: '48px',
                background: 'linear-gradient(to bottom, rgba(56, 189, 248, 0.08), rgba(0, 140, 255, 0.03))',
                borderRight: '1px solid rgba(0, 140, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '32px'
              }}>
                {/* Speech Bubble */}
                <div style={{
                  padding: '20px 24px',
                  borderRadius: '20px',
                  border: '1.5px solid rgba(0, 140, 255, 0.18)',
                  backgroundColor: '#eff6ff',
                  position: 'relative',
                  width: '100%'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8.5px solid rgba(0, 140, 255, 0.18)',
                  }} />
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#1e3a8a', fontWeight: 600, margin: 0, textAlign: 'center' }}>
                    Nobita, let's learn how to filter duplicates using Python **Sets**! Click on the card to start! 🚀
                  </p>
                </div>

                {/* Doraemon CSS Mascot (Scaled to 120px) */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#008cff',
                  border: '4px solid #ef4444',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(0, 140, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} className="animate-bell">
                  <div style={{
                    width: '92px',
                    height: '92px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    bottom: '1px'
                  }}>
                    <div style={{ display: 'flex', gap: '5px', position: 'absolute', top: '8px', left: '26px' }}>
                      <div style={{ width: '12px', height: '18px', backgroundColor: 'black', borderRadius: '50%' }} />
                      <div style={{ width: '12px', height: '18px', backgroundColor: 'black', borderRadius: '50%' }} />
                    </div>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%', position: 'absolute', top: '24px', left: '40px' }} />
                    <div style={{ width: '38px', height: '16px', borderBottom: '3px solid black', borderRadius: '0 0 50% 50%', position: 'absolute', bottom: '16px', left: '27px' }} />
                  </div>
                </div>

                {/* Progress Details / Stats */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1.5px solid rgba(0,0,0,0.04)', paddingBottom: '10px' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Active Student:</span>
                    <span style={{ color: '#0f172a', fontWeight: 800 }}>Nobi Nobita</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1.5px solid rgba(0,0,0,0.04)', paddingBottom: '10px' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Streak Count:</span>
                    <span style={{ color: '#f97316', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={14} fill="#f97316" style={{ marginTop: '-2px' }} /> 1 Day
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Total Completed:</span>
                    <span style={{ color: '#22c55e', fontWeight: 800 }}>0 / 2 Topics</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Catalog Selection List */}
              <div style={{
                flex: '1 1 540px',
                padding: '48px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
              }}>
                <div>
                  <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.6px', margin: 0 }}>
                    Select Python Topic
                  </h2>
                  <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
                    Unlock new skills by completing story paths and challenge steppers.
                  </p>
                </div>

                {/* Rows Grid list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Topic Sets Card */}
                  <button
                    onClick={() => setActiveTopicModal('sets')}
                    style={{
                      background: 'rgba(0, 140, 255, 0.03)',
                      border: '2.5px solid #008cff',
                      borderRadius: '20px',
                      padding: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%',
                      boxShadow: '0 4px 12px rgba(0, 140, 255, 0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 140, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 140, 255, 0.04)';
                    }}
                  >
                    {/* Index Badge */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: '2.5px solid #008cff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#008cff',
                      fontWeight: 800,
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      1
                    </div>

                    {/* Meta */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Python Sets</span>
                        <span style={{ fontSize: '10px', fontWeight: 900, color: 'white', background: '#008cff', padding: '2px 8px', borderRadius: '6px' }}>ACTIVE</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#475569', marginTop: '6px', lineHeight: 1.5, margin: 0 }}>
                        Learn to store unique elements and filter list duplicates instantly.
                      </p>
                    </div>

                    {/* Play Chevron */}
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#008cff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      ▶
                    </div>
                  </button>

                  {/* Topic Dictionaries Card (Active & Playable!) */}
                  <button
                    onClick={() => setActiveTopicModal('dicts')}
                    style={{
                      background: 'rgba(139, 92, 246, 0.03)',
                      border: '2.5px solid #8b5cf6',
                      borderRadius: '20px',
                      padding: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.04)';
                    }}
                  >
                    {/* Index Badge */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: '2.5px solid #8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8b5cf6',
                      fontWeight: 800,
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      2
                    </div>

                    {/* Meta */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Python Dictionaries</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#475569', marginTop: '6px', lineHeight: 1.5, margin: 0 }}>
                        Map key-value pairs for ultra-fast, structured database lookups.
                      </p>
                    </div>

                    {/* Play Chevron */}
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      ▶
                    </div>
                  </button>

                </div>
              </div>

            </GlassCard>

            {/* Interactive Concept Details Modal Overlay */}
            {activeTopicModal === 'sets' && (
              <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(5, 10, 22, 0.4)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 200,
                padding: '24px'
              }}>
                <GlassCard style={{
                  width: '100%',
                  maxWidth: '540px',
                  padding: '30px',
                  border: '1.5px solid rgba(0, 140, 255, 0.25)',
                  background: 'rgba(255, 255, 255, 0.96)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  color: '#0f172a'
                }} className="animate-fade-in">
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={18} style={{ color: '#ffcc00' }} />
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.5px' }}>
                        TOPIC: PYTHON SETS
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTopicModal(null)}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    Your full learning journey for <strong>Python Sets</strong> — four phases in sequence.
                    Complete each phase to unlock the next.
                  </p>

                  {/* Journey phase pipeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { icon: '📖', label: 'Learn',   desc: '9 interactive slides',              color: '#008cff' },
                      { icon: '❓', label: 'Q&A',     desc: '2 conceptual questions',             color: '#8b5cf6' },
                      { icon: '🏆', label: 'Test',    desc: 'Multiple-choice challenge',         color: '#ec4899' },
                      { icon: '💻', label: 'Coding',  desc: 'Write your first Set program',      color: '#f59e0b' },
                    ].map((phase, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', background: i === 0 ? 'rgba(0,140,255,0.05)' : 'rgba(0,0,0,0.02)', border: `1px solid ${i === 0 ? 'rgba(0,140,255,0.15)' : 'rgba(0,0,0,0.06)'}` }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${phase.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{phase.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{phase.label}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{phase.desc}</div>
                        </div>
                        {i < 3 && <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>then ↓</div>}
                      </div>
                    ))}
                  </div>

                  {/* Single Begin Journey button */}
                  <button
                    onClick={() => {
                      setCurrentTopic('sets');
                      setLearningStep(0);
                      setAssessmentStep(1);
                      setActiveTopicModal(null);
                      navigate('learning');
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    🚀 Begin Sets Journey
                  </button>

                </GlassCard>
              </div>
            )}

            {/* Interactive Concept Details Modal Overlay for Dictionaries */}
            {activeTopicModal === 'dicts' && (
              <div style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(5, 10, 22, 0.4)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 200, padding: '24px'
              }}>
                <GlassCard style={{
                  width: '100%', maxWidth: '540px', padding: '30px',
                  border: '1.5px solid rgba(139, 92, 246, 0.3)',
                  background: 'rgba(255, 255, 255, 0.96)',
                  position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', color: '#0f172a'
                }} className="animate-fade-in">
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={18} style={{ color: '#8b5cf6' }} />
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.5px' }}>
                        TOPIC: PYTHON DICTIONARIES
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTopicModal(null)}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    Your full 4-stage learning journey for <strong>Python Dictionaries</strong> ({'{key: value}'}) — learn, Q&amp;A, test, and code!
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { icon: '📖', label: 'Learn',   desc: '9 interactive Doraemon slides',       color: '#8b5cf6' },
                      { icon: '❓', label: 'Q&A',     desc: 'Dict syntax, .get(), and O(1) rules', color: '#008cff' },
                      { icon: '🏆', label: 'Test',    desc: 'Predict Output & Why? explanations', color: '#ec4899' },
                      { icon: '💻', label: 'Coding',  desc: 'Build key-value database codebook',  color: '#f59e0b' },
                    ].map((phase, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', background: i === 0 ? 'rgba(139,92,246,0.05)' : 'rgba(0,0,0,0.02)', border: `1px solid ${i === 0 ? 'rgba(139,92,246,0.2)' : 'rgba(0,0,0,0.06)'}` }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${phase.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{phase.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{phase.label}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{phase.desc}</div>
                        </div>
                        {i < 3 && <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>then ↓</div>}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentTopic('dicts');
                      setLearningStep(0);
                      setAssessmentStep(1);
                      setActiveTopicModal(null);
                      navigate('learning');
                    }}
                    className="btn"
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    🚀 Begin Dictionaries Journey
                  </button>

                </GlassCard>
              </div>
            )}

          </div>
        )}

        {/* --- UNIFIED 4-STAGE TOPIC JOURNEY (LEARN -> Q&A -> TEST -> CODING) --- */}
        {(currentRoute === 'learning' || currentRoute === 'test' || currentRoute === 'coding') && (() => {
          const activeStageIndex = currentRoute === 'learning' 
            ? 0 
            : assessmentStep === 1 
              ? 1 
              : assessmentStep === 2 
                ? 2 
                : 3;

          return (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Stepper Header Row */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', width: '100%' }}>
                {/* Back to Home */}
                <button 
                  onClick={() => navigate('home')}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 140, 255, 0.08)',
                    border: '1px solid rgba(0, 140, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#008cff',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 140, 255, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 140, 255, 0.08)'}
                  title="Back to Home Dashboard"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Journey Title Card */}
                <GlassCard style={{
                  flex: 1,
                  padding: '12px 20px',
                  border: '1px solid rgba(0, 140, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minWidth: '240px'
                }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {currentTopic === 'sets' ? 'Python Sets — Full Journey' : 'Python Dictionaries — Full Journey'}
                  </h2>
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                    📖 Learn &nbsp;→&nbsp; ❓ Q&amp;A &nbsp;→&nbsp; 🏆 Test &nbsp;→&nbsp; 💻 Coding
                  </span>
                </GlassCard>

                {/* Attempts Badge */}
                <div style={{
                  border: '1.5px solid #f97316',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  backgroundColor: 'rgba(249, 115, 22, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#f97316',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }} onClick={() => setAttemptsCount(0)}>
                  <RefreshCw size={13} />
                  Attempts: {attemptsCount}
                </div>
              </div>

              {/* Connected 4-Step Stepper Navigation Bar */}
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '640px',
                margin: '0 auto 16px',
                width: '100%',
                padding: '0 20px'
              }}>
                {/* Connecting Line Background */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '40px',
                  right: '40px',
                  height: '2px',
                  backgroundColor: 'rgba(0,0,0,0.08)',
                  zIndex: 1
                }} />

                {/* Animated Progress Line */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '40px',
                  width: `${(activeStageIndex / 3) * 100}%`,
                  maxWidth: 'calc(100% - 80px)',
                  height: '2px',
                  background: 'linear-gradient(90deg, #008cff, #8b5cf6, #ec4899, #f59e0b)',
                  zIndex: 1,
                  transition: 'width 0.4s ease'
                }} />

                {/* Step 1 — Learn */}
                <div 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, cursor: 'pointer' }}
                  onClick={() => navigate('learning')}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: activeStageIndex >= 0 ? '#008cff' : 'white',
                    border: `2px solid ${activeStageIndex >= 0 ? '#008cff' : 'rgba(0,0,0,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: activeStageIndex >= 0 ? 'white' : '#64748b',
                    fontWeight: 800, fontSize: '14px',
                    boxShadow: activeStageIndex === 0 ? '0 0 16px rgba(0,140,255,0.35)' : 'none',
                    transition: 'all 0.2s'
                  }}>📖</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: activeStageIndex >= 0 ? '#008cff' : '#64748b' }}>
                    <BookOpen size={11} /> Learn
                  </div>
                </div>

                {/* Step 2 — Q&A */}
                <div 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, cursor: 'pointer' }}
                  onClick={() => { setAssessmentStep(1); navigate('test'); }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: activeStageIndex >= 1 ? '#8b5cf6' : 'white',
                    border: `2px solid ${activeStageIndex >= 1 ? '#8b5cf6' : 'rgba(0,0,0,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: activeStageIndex >= 1 ? 'white' : '#64748b',
                    fontWeight: 800, fontSize: '14px',
                    boxShadow: activeStageIndex === 1 ? '0 0 16px rgba(139,92,246,0.35)' : 'none',
                    transition: 'all 0.2s'
                  }}>❓</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: activeStageIndex >= 1 ? '#8b5cf6' : '#64748b' }}>
                    <HelpCircle size={11} /> Q&amp;A
                  </div>
                </div>

                {/* Step 3 — Test */}
                <div 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, cursor: 'pointer' }}
                  onClick={() => { setAssessmentStep(2); navigate('test'); }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: activeStageIndex >= 2 ? '#ec4899' : 'white',
                    border: `2px solid ${activeStageIndex >= 2 ? '#ec4899' : 'rgba(0,0,0,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: activeStageIndex >= 2 ? 'white' : '#64748b',
                    fontWeight: 800, fontSize: '14px',
                    boxShadow: activeStageIndex === 2 ? '0 0 16px rgba(236,72,153,0.35)' : 'none',
                    transition: 'all 0.2s'
                  }}>🏆</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: activeStageIndex >= 2 ? '#ec4899' : '#64748b' }}>
                    <Award size={11} /> Test
                  </div>
                </div>

                {/* Step 4 — Coding */}
                <div 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, cursor: 'pointer' }}
                  onClick={() => { setAssessmentStep(3); navigate('test'); }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: activeStageIndex >= 3 ? '#f59e0b' : 'white',
                    border: `2px solid ${activeStageIndex >= 3 ? '#f59e0b' : 'rgba(0,0,0,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: activeStageIndex >= 3 ? 'white' : '#64748b',
                    fontWeight: 800, fontSize: '14px',
                    boxShadow: activeStageIndex === 3 ? '0 0 16px rgba(245,158,11,0.35)' : 'none',
                    transition: 'all 0.2s'
                  }}>💻</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: activeStageIndex >= 3 ? '#f59e0b' : '#64748b' }}>
                    <Code size={11} /> Coding
                  </div>
                </div>
              </div>

              {/* Stage Active Content Area */}
              <div style={{ width: '100%' }}>
                
                {/* Stage 0: Interactive Doraemon Learning Slides */}
                {activeStageIndex === 0 && (
                  <EpisodeLayout
                    totalSteps={totalLearningSteps}
                    currentStepIndex={learningStep}
                    dialogues={getLearningDialogue()}
                    character={learningStep === 1 ? 'nobita' : learningStep === 0 ? 'system' : 'doraemon'}
                    onNext={() => {
                      if (learningStep < totalLearningSteps - 1) {
                        setLearningStep(prev => prev + 1);
                      } else {
                        // Learning complete — flow directly into Q&A stage
                        setAssessmentStep(1);
                        navigate('test');
                      }
                    }}
                    onBack={() => {
                      if (learningStep > 0) {
                        setLearningStep(prev => prev - 1);
                      } else {
                        navigate('home');
                      }
                    }}
                    isBackDisabled={false}
                  >
                    <GlassCard style={{ padding: '28px', width: '100%', background: 'white' }}>
                      <div key={learningStep} className="animate-fade-in" style={{ width: '100%' }}>
                        {currentTopic === 'dicts' ? (
                          <>
                            {learningStep === 0 && <DictIntroduction />}
                            {learningStep === 1 && <DictStory />}
                            {learningStep === 2 && <DictProblem />}
                            {learningStep === 3 && <DictObservation />}
                            {learningStep === 4 && <DictExploration />}
                            {learningStep === 5 && <DictDiscovery />}
                            {learningStep === 6 && <DictConceptReveal />}
                            {learningStep === 7 && <DictGuidedPractice />}
                            {learningStep === 8 && <DictReflection />}
                          </>
                        ) : (
                          <>
                            {learningStep === 0 && (
                              <Introduction 
                                title="1. Introduction to Collections" 
                                subtitle="Conceptual structure outline for analyzing element grouping formats." 
                                objectives={[
                                  "Objective 1: Analyze how duplicate entries affect dataset consistency.",
                                  "Objective 2: Outline the necessity of high-speed presence queries.",
                                  "Objective 3: Introduce the roadmap for discovering unordered set spaces."
                                ]}
                              />
                            )}
                            {learningStep === 1 && (
                              <Story 
                                sceneTitle="The Stamp Collector's Clutter" 
                                narrative="Gian and Suneo are boasting about their dinosaur stamps. Nobita borrows a stamp trading machine from Doraemon but ends up with a messy cardboard box containing hundreds of duplicate stamps. Suneo challenges him to a trade: 'Prove that you have these three specific stamps in exactly three seconds, or no trade!' Nobita dumps his box, but searching through duplicates is too slow. Suneo counts down: '3... 2...'" 
                                characters={["Doraemon", "Nobita", "Suneo"]}
                              />
                            )}
                            {learningStep === 2 && <Problem />}
                            {learningStep === 3 && <Observation />}
                            {learningStep === 4 && <Exploration />}
                            {learningStep === 5 && <Discovery />}
                            {learningStep === 6 && <ConceptReveal />}
                            {learningStep === 7 && <GuidedPractice />}
                            {learningStep === 8 && <Reflection />}
                          </>
                        )}
                      </div>
                    </GlassCard>
                  </EpisodeLayout>
                )}

                {/* Stage 1: Technical Q&A Page */}
                {activeStageIndex === 1 && (
                  <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
                    {currentTopic === 'dicts' ? (
                      <DictQnaPage onProceedToTest={() => { setAssessmentStep(2); navigate('test'); }} />
                    ) : (
                      <QnaPage onProceedToTest={() => { setAssessmentStep(2); navigate('test'); }} />
                    )}
                  </div>
                )}

                {/* Stage 2: Knowledge Test Suite */}
                {activeStageIndex === 2 && (
                  <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
                    {currentTopic === 'dicts' ? (
                      <TestPage questions={DICT_TEST_QUESTIONS} onProceedToCoding={() => { setAssessmentStep(3); navigate('test'); }} />
                    ) : (
                      <TestPage onProceedToCoding={() => { setAssessmentStep(3); navigate('test'); }} />
                    )}
                  </div>
                )}

                {/* Stage 3: Coding Challenge */}
                {activeStageIndex === 3 && (
                  <CodingPage
                    challenge={activeCodingChallenge}
                    onVerify={() => setAttemptsCount(prev => prev + 1)}
                  />
                )}

              </div>
            </div>
          );
        })()}



        {/* --- 5. PROFILE ROUTE --- */}
        {currentRoute === 'profile' && (
          <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
            <GlassCard style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: 'white' }}>
              {/* Profile avatar */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#008cff',
                border: '4px solid white',
                boxShadow: '0 0 20px rgba(0, 140, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#ffcc00',
                  border: '2px solid #ef4444',
                  position: 'absolute',
                  bottom: '-5px',
                  right: '-5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'black', position: 'absolute', top: '8px' }} />
                </div>
                <User size={40} color="white" />
              </div>

              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Nobi Nobita</h2>
                <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>Apprentice Python Coder</p>
              </div>

              {/* Progress metrics */}
              <div style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginTop: '10px'
              }}>
                <div style={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <Award size={20} style={{ color: '#ffcc00', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase' }}>Rank Status</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>Robo-Cat Student</div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <BookOpen size={20} style={{ color: '#38bdf8', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase' }}>Completed</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>0/2 Topics</div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* --- 6. SETTINGS ROUTE --- */}
        {currentRoute === 'settings' && (
          <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
            <GlassCard style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'white' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} style={{ color: '#008cff' }} />
                Workspace Settings
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Setting A */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Auto-run code assessments</div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>Verify test assertions immediately on run</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoRun}
                    onChange={(e) => setAutoRun(e.target.checked)}
                    style={{
                      width: '40px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Setting B */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Robotic Voice Guidance</div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>Read lesson slides using text-to-speech assistant</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={voiceGuidance}
                    onChange={(e) => setVoiceGuidance(e.target.checked)}
                    style={{
                      width: '40px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
              
              <button 
                onClick={() => alert("Progress has been reset!")}
                className="btn" 
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                  border: '1px solid rgba(239, 68, 68, 0.15)', 
                  color: '#ef4444',
                  marginTop: '10px'
                }}
              >
                Reset Progress
              </button>
            </GlassCard>
          </div>
        )}

      </main>


      
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <MainAppContent />
    </RouterProvider>
  );
}

export default App;
