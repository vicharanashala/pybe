import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Skull, 
  Map, 
  BookKey, 
  Unlock, 
  ShieldAlert, 
  ArrowRight, 
  BookOpen, 
  FlaskConical, 
  KeyRound, 
  CheckCircle2, 
  Sparkles,
  Globe,
  Terminal
} from 'lucide-react';
import { DrawerSimulation } from '../components/DrawerSimulation';
import { RaceMode } from '../components/RaceMode';
import { HashVisualizer } from '../components/HashVisualizer';
import { InteractiveCodeBlock } from '../components/InteractiveCodeBlock';
import { SpotTheBug } from '../components/SpotTheBug';
import { LiveExecutionTerminal } from '../components/LiveExecutionTerminal';
import { BoobyTrapDemo } from '../components/BoobyTrapDemo';
import { QuizCard } from '../components/QuizCard';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const Story = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const pageNum = parseInt(page, 10) || 1;

  const { unlockBadge, unlockNextPage, nerdMode } = useGame();
  const { playClick, playSuccess } = useSoundFX();

  // Active step within each chapter: 'story' | 'lab' | 'quiz'
  // ALWAY starts on 'story' as requested!
  const [activeTab, setActiveTab] = useState('story');

  // Chapter Checkpoint States
  const [ch1Quiz1, setCh1Quiz1] = useState(false);
  const [ch1Quiz2, setCh1Quiz2] = useState(false);

  const [ch2Quiz1, setCh2Quiz1] = useState(false);
  const [ch2Quiz2, setCh2Quiz2] = useState(false);
  const [ch2Quiz3, setCh2Quiz3] = useState(false);

  const [ch3BugsDone, setCh3BugsDone] = useState(false);
  const [ch3Quiz1, setCh3Quiz1] = useState(false);
  const [ch3Quiz2, setCh3Quiz2] = useState(false);

  const [ch4Executed, setCh4Executed] = useState(false);

  const [ch5TrapDisarmed, setCh5TrapDisarmed] = useState(false);

  // When chapter changes, always start on story and scroll to top
  useEffect(() => {
    setActiveTab('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageNum]);

  // Check if current chapter goals are fulfilled
  let canProceed = false;
  if (pageNum === 1) {
    canProceed = ch1Quiz1 && ch1Quiz2;
  } else if (pageNum === 2) {
    canProceed = ch2Quiz1 && ch2Quiz2 && ch2Quiz3;
  } else if (pageNum === 3) {
    canProceed = ch3Quiz1 && ch3Quiz2;
  } else if (pageNum === 4) {
    canProceed = ch4Executed;
  } else if (pageNum === 5) {
    canProceed = ch5TrapDisarmed;
  }

  // Handle advancing to next chapter
  const handleProceed = () => {
    playClick();
    unlockNextPage(pageNum);

    if (pageNum === 1) unlockBadge('slow_poke');
    if (pageNum === 2) unlockBadge('hash_wizard');
    if (pageNum === 3) unlockBadge('spellcaster');
    if (pageNum === 4) unlockBadge('master_thief');
    if (pageNum === 5) {
      unlockBadge('trap_dodger');
      navigate('/story/finale');
      return;
    }

    navigate(`/story/${pageNum + 1}`);
  };

  const handleTabSwitch = (tab) => {
    playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const fadeProps = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.3 }
  };

  // Chapter Metadatas
  const chapterMeta = {
    1: {
      title: 'Chapter 1: The Heist Begins',
      subtitle: 'The 1,000 Drawer Problem & Sequential Search O(N)',
      icon: <Skull size={32} color="var(--primary)" />,
      image: '/sly_searching.png'
    },
    2: {
      title: 'Chapter 2: The Wizard\'s Secret',
      subtitle: 'Sticker Keys, Values, and Instant O(1) Speed',
      icon: <Map size={32} color="var(--secondary)" />,
      image: '/sly_finding.png'
    },
    3: {
      title: 'Chapter 3: The Computer Spellbook',
      subtitle: 'Python Dictionary Syntax & Curly Bracket Magic',
      icon: <BookKey size={32} color="var(--primary)" />,
      image: '/sly_reading.png'
    },
    4: {
      title: 'Chapter 4: Execute the Spell',
      subtitle: 'Live Terminal Execution & Real-Time Lookup',
      icon: <Unlock size={32} color="var(--success)" />,
      image: ch4Executed ? '/sly_finding.png' : '/sly_searching.png'
    },
    5: {
      title: 'Chapter 5: The Booby Trap',
      subtitle: 'Handling Missing Keys: KeyError vs .get()',
      icon: <ShieldAlert size={32} color="var(--error)" />,
      image: ch5TrapDisarmed ? '/sly_finding.png' : '/sly_reading.png'
    }
  };

  const currentMeta = chapterMeta[pageNum] || chapterMeta[1];

  return (
    <div className="story-container">
      <div className="story-chapter">
        <div className="glass-card chapter-content-card">
          {/* Chapter Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="chapter-icon" style={{ margin: 0, padding: '14px' }}>
                {currentMeta.icon}
              </div>
              <div>
                <h1 style={{ fontSize: '1.7rem', color: '#fff', margin: 0 }}>
                  {currentMeta.title}
                </h1>
                <p style={{ color: 'var(--secondary)', fontSize: '0.95rem', margin: '4px 0 0 0', fontWeight: '600' }}>
                  {currentMeta.subtitle}
                </p>
              </div>
            </div>

            {/* Overall chapter completion pill */}
            {canProceed && (
              <motion.div 
                initial={{ scale: 0.8 }} 
                animate={{ scale: 1 }} 
                style={{ background: 'rgba(0, 255, 163, 0.15)', border: '1px solid var(--success)', color: 'var(--success)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <CheckCircle2 size={16} /> Chapter Completed!
              </motion.div>
            )}
          </div>

          {/* Chapter Journey Tabs: Starts on "The Story" */}
          <nav className="chapter-quest-nav">
            <button 
              className={`quest-tab-btn ${activeTab === 'story' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('story')}
            >
              <BookOpen size={16} color="var(--secondary)" />
              <span>Step 1: The Story</span>
            </button>

            <button 
              className={`quest-tab-btn ${activeTab === 'lab' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('lab')}
            >
              <FlaskConical size={16} color="var(--accent)" />
              <span>Step 2: Hands-on Lab</span>
            </button>

            <button 
              className={`quest-tab-btn ${activeTab === 'quiz' ? 'active' : ''} ${canProceed ? 'completed' : ''}`}
              onClick={() => handleTabSwitch('quiz')}
            >
              <KeyRound size={16} color="var(--primary)" />
              <span>Step 3: Security Checkpoint</span>
              {canProceed && <CheckCircle2 size={14} color="var(--success)" />}
            </button>
          </nav>

          {/* ========================================================= */}
          {/* TAB 1: THE STORY (Starts here!)                           */}
          {/* ========================================================= */}
          {activeTab === 'story' && (
            <motion.div key="tab-story" {...fadeProps}>
              <div className="desktop-grid">
                {/* Character Portrait */}
                <div className="visual-column">
                  <div className="story-image-container">
                    <img src={currentMeta.image} alt="Sly the Goblin" />
                  </div>
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Sly the Goblin — Master Infiltrator (and full-time coward)
                  </div>
                </div>

                {/* Narrative Scene Dialogue */}
                <div className="text-column">
                  {/* CHAPTER 1 STORY */}
                  {pageNum === 1 && (
                    <>
                      <div className="story-speech-bubble">
                        <div className="story-speech-author">
                          <span>🧰 SLY WHISPERS IN THE DARK:</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "Psst! Hey, you! Over here in the shadows! Keep your voice down!"
                        </p>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "I sneaked into the Wizard's high tower tonight to swipe his legendary Golden Coin. But look at what's in front of us... a colossal mahogany chest with <strong>ONE THOUSAND tiny locked drawers</strong>!"
                        </p>
                        <p style={{ margin: 0 }}>
                          "And look right on the rug... Cerberus the guard dog is fast asleep! If I start rattling open every drawer one by one, he'll wake up and turn me into goblin stew!"
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(0, 240, 255, 0.06)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '14px', padding: '14px 18px', color: '#D8F8FF', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <Globe size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ color: 'var(--secondary)' }}>Real-World Connection:</strong> Searching an unsorted List is like flipping through every single page of a 1,000-page book one by one from page 1 instead of looking at the index.
                          </div>
                        </div>

                        {nerdMode && (
                          <div style={{ background: 'rgba(138, 43, 226, 0.12)', border: '1px solid rgba(138, 43, 226, 0.35)', borderRadius: '14px', padding: '14px 18px', color: '#E6D3FF', fontSize: '0.9rem', fontFamily: 'monospace', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <Terminal size={18} color="#D4AAFF" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong style={{ color: '#D4AAFF' }}>NERD MODE:</strong> Linear search visits every element sequentially. Its worst-case time complexity is O(N), meaning computation time grows directly proportional to the dataset size N.
                            </div>
                          </div>
                        )}
                      </div>

                      <button 
                        className="web3-button"
                        onClick={() => handleTabSwitch('lab')}
                        style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.05rem' }}
                      >
                        Enter The Vault: Try The Drawers Lab 🧰 <ArrowRight size={18} />
                      </button>
                    </>
                  )}

                  {/* CHAPTER 2 STORY */}
                  {pageNum === 2 && (
                    <>
                      <div className="story-speech-bubble">
                        <div className="story-speech-author">
                          <span>📜 SLY HOLDS A GLOWING PARCHMENT:</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "Holy goblin ears! Look what the Wizard left behind on his desk — an ancient blueprint!"
                        </p>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "It explains the secret of this 1,000-drawer chest: Every drawer has a sticker label (the <strong>KEY</strong>). Inside is the treasure (the <strong>VALUE</strong>)."
                        </p>
                        <p style={{ margin: 0 }}>
                          "And best of all? The Wizard built a magical <strong>Hash Machine</strong> that converts any sticker name directly into its drawer number in 0.0001 seconds! No searching, no waking the dog!"
                        </p>
                      </div>

                      {/* Old vs New comparison */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ background: 'rgba(255,46,147,0.08)', border: '1px solid rgba(255,46,147,0.3)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🐢 Linear Search O(N)</div>
                          <div style={{ color: '#ffb3d9', fontSize: '0.88rem', lineHeight: '1.5' }}>Check every drawer one by one.<br /><em>Could take 1,000 pulls! Dog wakes up!</em></div>
                        </div>
                        <div style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>⚡ Hashmap O(1)</div>
                          <div style={{ color: '#B5F8FF', fontSize: '0.88rem', lineHeight: '1.5' }}>Feed key to Hash Machine ➡️ Drawer number!<br /><em>Always exactly 1 step! Dog stays asleep!</em></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(0, 240, 255, 0.06)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '14px', padding: '14px 18px', color: '#D8F8FF', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <Globe size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ color: 'var(--secondary)' }}>Real-World Connection:</strong> Searching a phone contact by name (e.g. "Mom"). Your phone doesn't dial 2 billion strangers — it instantly jumps straight to Mom's number!
                          </div>
                        </div>

                        {nerdMode && (
                          <div style={{ background: 'rgba(138, 43, 226, 0.12)', border: '1px solid rgba(138, 43, 226, 0.35)', borderRadius: '14px', padding: '14px 18px', color: '#E6D3FF', fontSize: '0.9rem', fontFamily: 'monospace', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <Terminal size={18} color="#D4AAFF" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong style={{ color: '#D4AAFF' }}>NERD MODE:</strong> A Hash Table maps keys to bucket indices via a hash function: <code>index = hash(key) % capacity</code>. This gives O(1) amortized lookup, insertion, and deletion.
                            </div>
                          </div>
                        )}
                      </div>

                      <button 
                        className="web3-button"
                        onClick={() => handleTabSwitch('lab')}
                        style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.05rem', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', color: '#000' }}
                      >
                        Enter Step-by-Step Hashmap Lab ⚙️ <ArrowRight size={18} />
                      </button>
                    </>
                  )}

                  {/* CHAPTER 3 STORY */}
                  {pageNum === 3 && (
                    <>
                      <div className="story-speech-bubble">
                        <div className="story-speech-author">
                          <span>🧙‍♂️ SLY STUDIES THE WIZARD'S SPELLBOOK:</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "The Wizard wrote his enchantments in a computer language called <strong>Python</strong>!"
                        </p>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "In Python, this magic hashmap is called a <strong>Dictionary</strong>. The curly brackets <code>{`{ }`}</code> represent the magical chest."
                        </p>
                        <p style={{ margin: 0 }}>
                          "Every Key gets wrapped in quotes, followed by a colon <code>:</code> that points to the Value. But look! The Wizard left buggy spells we have to fix!"
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(0, 240, 255, 0.06)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '14px', padding: '14px 18px', color: '#D8F8FF', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <Globe size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ color: 'var(--secondary)' }}>Real-World Connection:</strong> Modern web APIs send data across the world using JSON, which has the exact same key-value curly bracket format!
                          </div>
                        </div>
                      </div>

                      <button 
                        className="web3-button"
                        onClick={() => handleTabSwitch('lab')}
                        style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.05rem' }}
                      >
                        Inspect Code & Play 'Spot The Bug' 📜 <ArrowRight size={18} />
                      </button>
                    </>
                  )}

                  {/* CHAPTER 4 STORY */}
                  {pageNum === 4 && (
                    <>
                      <div className="story-speech-bubble">
                        <div className="story-speech-author">
                          <span>⚡ SLY IS TREMBLING WITH EXCITEMENT:</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "The dog's tail just thumped the floor! Time is running out!"
                        </p>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "I brought the magic terminal. You type the key, and watch the Python code dynamically generate right before your eyes."
                        </p>
                        <p style={{ margin: 0 }}>
                          "When you hit execute, we send the spell directly to the backend chest to pop the lock and snatch the treasure!"
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(0, 240, 255, 0.06)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '14px', padding: '14px 18px', color: '#D8F8FF', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <Globe size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ color: 'var(--secondary)' }}>Real-World Connection:</strong> Searching for a song on Spotify executes an instant database index search across 100 million tracks!
                          </div>
                        </div>
                      </div>

                      <button 
                        className="web3-button"
                        onClick={() => handleTabSwitch('lab')}
                        style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.05rem', background: 'linear-gradient(135deg, var(--success), var(--secondary))', color: '#000' }}
                      >
                        Open Live Spell Terminal 🗝️ <ArrowRight size={18} />
                      </button>
                    </>
                  )}

                  {/* CHAPTER 5 STORY */}
                  {pageNum === 5 && (
                    <>
                      <div className="story-speech-bubble" style={{ borderLeftColor: 'var(--error)' }}>
                        <div className="story-speech-author" style={{ color: 'var(--error)' }}>
                          <span>🛡️ SLY PANICS AT THE BOOBY TRAP:</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "WAIT! STOP! Don't touch that sticker!"
                        </p>
                        <p style={{ margin: '0 0 10px 0' }}>
                          "Sly reached for a sticker named <strong>'dragon'</strong>, but that sticker DOES NOT exist on the chest!"
                        </p>
                        <p style={{ margin: 0 }}>
                          "If you search for a missing key in Python using square brackets <code>chest['dragon']</code>, it throws a violent <code>KeyError</code> crash that will trigger the alarm bells and wake the dog!"
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(0, 240, 255, 0.06)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '14px', padding: '14px 18px', color: '#D8F8FF', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <Globe size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ color: 'var(--secondary)' }}>Real-World Connection:</strong> A website showing a clean 'Page Not Found' (404) message instead of crashing your browser.
                          </div>
                        </div>
                      </div>

                      <button 
                        className="web3-button"
                        onClick={() => handleTabSwitch('lab')}
                        style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #FF8C00, #FF2E93)' }}
                      >
                        Enter The Trap Lab & Disarm with .get() 🛡️ <ArrowRight size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: HANDS-ON LAB / SIMULATION                         */}
          {/* ========================================================= */}
          {activeTab === 'lab' && (
            <motion.div key="tab-lab" {...fadeProps}>
              {pageNum === 1 && (
                <div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 style={{ color: 'var(--accent)', margin: '0 0 6px 0', fontSize: '1.15rem' }}>
                      🧰 The Hands-On Drawer Lab
                    </h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem' }}>
                      Test 10, 100, and 1,000 drawers. Watch the guard dog stir and watch the live linear growth graph build!
                    </p>
                  </div>

                  <DrawerSimulation />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', flexWrap: 'wrap', gap: '14px' }}>
                    <button 
                      onClick={() => handleTabSwitch('story')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem' }}
                    >
                      ⬅️ Re-read the Story
                    </button>
                    <button 
                      className="web3-button"
                      onClick={() => handleTabSwitch('quiz')}
                      style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                    >
                      Ready for the Security Riddle 🗝️ <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {pageNum === 2 && (
                <div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 style={{ color: 'var(--secondary)', margin: '0 0 6px 0', fontSize: '1.15rem' }}>
                      ⚡ Chapter 2 Lab: Master the Hashmap
                    </h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem' }}>
                      Follow Sly through 9 tiny story scenes. In each one you tap or click to learn one small idea: letters to numbers, adding, wrapping into drawers, the magic formula that joins them, hiding a treasure, finding it again, and what happens in a collision.
                    </p>
                  </div>

                  <HashVisualizer onComplete={() => handleTabSwitch('quiz')} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', flexWrap: 'wrap', gap: '14px' }}>
                    <button 
                      onClick={() => handleTabSwitch('story')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem' }}
                    >
                      ⬅️ Re-read the Story
                    </button>
                    <button 
                      className="web3-button"
                      onClick={() => handleTabSwitch('quiz')}
                      style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', color: '#000' }}
                    >
                      Ready for Chapter 2 Security Riddle 🗝️ <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {pageNum === 3 && (
                <div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 style={{ color: 'var(--primary)', margin: '0 0 6px 0', fontSize: '1.15rem' }}>
                      🧙‍♂️ Python Syntax & Debugging Lab
                    </h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem' }}>
                      Hover over tokens to learn their roles, then eliminate 3 common Python dictionary syntax bugs!
                    </p>
                  </div>

                  <InteractiveCodeBlock />
                  <SpotTheBug onCompleted={() => setCh3BugsDone(true)} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', flexWrap: 'wrap', gap: '14px' }}>
                    <button 
                      onClick={() => handleTabSwitch('story')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem' }}
                    >
                      ⬅️ Re-read the Story
                    </button>
                    <button 
                      className="web3-button"
                      onClick={() => handleTabSwitch('quiz')}
                      style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                    >
                      Ready for Chapter 3 Security Riddle 🗝️ <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {pageNum === 4 && (
                <div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 style={{ color: 'var(--success)', margin: '0 0 6px 0', fontSize: '1.15rem' }}>
                      ⚡ Live Spell Terminal
                    </h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem' }}>
                      Type a sticker symbol, watch the Python code reflect it live, and execute the backend API lookup!
                    </p>
                  </div>

                  <LiveExecutionTerminal onExecutedSuccess={() => {
                    setCh4Executed(true);
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', flexWrap: 'wrap', gap: '14px' }}>
                    <button 
                      onClick={() => handleTabSwitch('story')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem' }}
                    >
                      ⬅️ Re-read the Story
                    </button>
                    {ch4Executed && (
                      <button 
                        className="web3-button"
                        onClick={handleProceed}
                        style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', background: 'linear-gradient(135deg, var(--success), var(--secondary))', color: '#000' }}
                      >
                        Treasure Claimed! Enter Chapter 5 🛡️ <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {pageNum === 5 && (
                <div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 style={{ color: 'var(--error)', margin: '0 0 6px 0', fontSize: '1.15rem' }}>
                      🛡️ The Booby Trap Disarming Lab
                    </h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem' }}>
                      Compare what happens between direct square brackets and safe .get() handling when a key is missing.
                    </p>
                  </div>

                  <BoobyTrapDemo onTrapDisarmed={() => {
                    setCh5TrapDisarmed(true);
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', flexWrap: 'wrap', gap: '14px' }}>
                    <button 
                      onClick={() => handleTabSwitch('story')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem' }}
                    >
                      ⬅️ Re-read the Story
                    </button>
                    {ch5TrapDisarmed && (
                      <button 
                        className="web3-button"
                        onClick={handleProceed}
                        style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', background: 'linear-gradient(135deg, var(--success), var(--secondary))', color: '#000' }}
                      >
                        Enter Grand Finale & Claim Certificate 👑 <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SECURITY CHECKPOINT QUIZZES                        */}
          {/* ========================================================= */}
          {activeTab === 'quiz' && (
            <motion.div key="tab-quiz" {...fadeProps}>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ color: 'var(--primary)', margin: '0 0 6px 0', fontSize: '1.15rem' }}>
                  🗝️ Chapter {pageNum} Security Ward
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem' }}>
                  Answer these checkpoint challenges correctly to lower the dog's alarm, earn XP, and unlock the next chapter!
                </p>
              </div>

              {/* CHAPTER 1 QUIZZES */}
              {pageNum === 1 && (
                <>
                  <QuizCard
                    id="ch1-q1"
                    question="If Sly searches the drawers sequentially (one-by-one), what is the WORST number of drawers he might have to pull?"
                    options={['1 drawer', '10 drawers', '1,000 drawers']}
                    correctAnswer="1,000 drawers"
                    explanations={{
                      '1 drawer': 'That would be the lucky BEST case (if the coin was in drawer #1)! In the WORST case, it is in the very last drawer.',
                      '10 drawers': 'What if the coin is hidden all the way in drawer #999 or #1,000? 10 drawers is not enough!',
                      '1,000 drawers': 'Correct! In the worst-case scenario, the treasure is in the very last drawer, requiring all 1,000 pulls.'
                    }}
                    hints={[
                      'Think about what happens if the treasure was tucked into the very last drawer.',
                      'In the worst-case scenario, you check every single drawer in the chest.',
                      'The chest has 1,000 total drawers, so in the worst case you must check all 1,000!'
                    ]}
                    onPassed={() => setCh1Quiz1(true)}
                  />

                  {ch1Quiz1 && (
                    <QuizCard
                      id="ch1-q2"
                      question="What does O(N) linear time mean in plain words?"
                      options={[
                        'The time to search grows in direct proportion to the number of items N.',
                        'The computer immediately knows where everything is.',
                        'The search takes zero seconds no matter what.'
                      ]}
                      correctAnswer="The time to search grows in direct proportion to the number of items N."
                      explanations={{
                        'The time to search grows in direct proportion to the number of items N.': 'Spot on! Double the drawers = double the search time.',
                        'The computer immediately knows where everything is.': 'That describes a Hashmap O(1), not a sequential list search!',
                        'The search takes zero seconds no matter what.': 'Pulling 1,000 drawers definitely takes time and noise!'
                      }}
                      hints={[
                        'N represents the number of drawers in the chest.',
                        'If N doubles from 10 to 20, what happens to the number of pulls needed?',
                        'Time scales linearly with N: 10 drawers = 10 pulls, 1,000 drawers = 1,000 pulls.'
                      ]}
                      onPassed={() => setCh1Quiz2(true)}
                    />
                  )}
                </>
              )}

              {/* CHAPTER 2 QUIZZES */}
              {pageNum === 2 && (
                <>
                  <QuizCard
                    id="ch2-q1"
                    question="In a Hashmap, what is the 'Key' and what is the 'Value'?"
                    options={[
                      'Key is the secret sticker label; Value is the treasure inside the drawer.',
                      'Key is the metal lock; Value is how much money it costs.',
                      'Key is the dog; Value is the goblin.'
                    ]}
                    correctAnswer="Key is the secret sticker label; Value is the treasure inside the drawer."
                    explanations={{
                      'Key is the secret sticker label; Value is the treasure inside the drawer.': 'Exactly! You supply the unique Key ("star") to retrieve the Value ("Golden Coin").',
                      'Key is the metal lock; Value is how much money it costs.': 'In CS terminology, Keys and Values form associative pairs.',
                      'Key is the dog; Value is the goblin.': 'Sly would disagree!'
                    }}
                    hints={[
                      'Think about the label on the outside vs the prize on the inside.',
                      'The key is what you ask for; the value is what you get back.',
                      'Key = sticker symbol (e.g. "star"), Value = treasure (e.g. "Golden Coin").'
                    ]}
                    onPassed={() => setCh2Quiz1(true)}
                  />

                  {ch2Quiz1 && (
                    <QuizCard
                      id="ch2-q2"
                      question="Why does the Hashmap keep the guard dog fast asleep?"
                      options={[
                        'It jumps straight to the exact drawer in 1 step O(1), skipping the noisy drawer pulling.',
                        'The hash function plays a lullaby.',
                        'It only works when the dog is fed.'
                      ]}
                      correctAnswer="It jumps straight to the exact drawer in 1 step O(1), skipping the noisy drawer pulling."
                      explanations={{
                        'It jumps straight to the exact drawer in 1 step O(1), skipping the noisy drawer pulling.': 'Correct! O(1) constant time means zero search delay.',
                        'The hash function plays a lullaby.': 'Hash functions do math, not music!',
                        'It only works when the dog is fed.': 'No dog treats required — pure algorithmic efficiency!'
                      }}
                      hints={[
                        'Compare pulling 1,000 drawers with opening just 1 drawer.',
                        'O(1) means constant time — exactly 1 step regardless of chest size.',
                        'Because it opens the target drawer instantly in 1 step, the dog hears nothing!'
                      ]}
                      onPassed={() => setCh2Quiz2(true)}
                    />
                  )}

                  {ch2Quiz2 && (
                    <QuizCard
                      id="ch2-q3"
                      question="Sly uses the 3-step recipe on the word 'cat' (c=3, a=1, t=20) with 10 drawers. Which drawer does he open?"
                      options={[
                        'Drawer #4, because 3 + 1 + 20 = 24 and 24 wraps around to 4',
                        'Drawer #24, because that is the total',
                        'He has to open all 10 drawers to check'
                      ]}
                      correctAnswer="Drawer #4, because 3 + 1 + 20 = 24 and 24 wraps around to 4"
                      explanations={{
                        'Drawer #4, because 3 + 1 + 20 = 24 and 24 wraps around to 4': 'Exactly! Letters to numbers, add them up, then wrap with the remainder (24 % 10 = 4). Three steps, no searching.',
                        'Drawer #24, because that is the total': 'There is no drawer #24! Step 3 wraps the total back into the 10 drawers by keeping only the remainder.',
                        'He has to open all 10 drawers to check': 'That is the long way. The recipe tells him the exact drawer, so he opens just one.'
                      }}
                      hints={[
                        'Remember the 3 steps: letters to numbers, add them up, wrap into the drawers.',
                        'The total is 24. How many full laps of 10 drawers fit in 24, and what is left over?',
                        '24 is 2 full laps (20) plus 4 left over, so the answer is drawer #4.'
                      ]}
                      onPassed={() => setCh2Quiz3(true)}
                    />
                  )}
                </>
              )}

              {/* CHAPTER 3 QUIZZES */}
              {pageNum === 3 && (
                <>
                  <QuizCard
                    id="ch3-q1"
                    question="Which brackets create a Python Dictionary (Hashmap)?"
                    options={[
                      '{ } (Curly brackets)',
                      '[ ] (Square brackets)',
                      '( ) (Parentheses / Round brackets)'
                    ]}
                    correctAnswer="{ } (Curly brackets)"
                    explanations={{
                      '{ } (Curly brackets)': 'Correct! Curly brackets { } create dictionaries and sets.',
                      '[ ] (Square brackets)': 'Square brackets [ ] create Lists (Arrays), which must be searched one by one, O(N)!',
                      '( ) (Parentheses / Round brackets)': 'Round brackets ( ) create Tuples or call functions.'
                    }}
                    hints={[
                      'Look at the Wizard\'s spellbook.',
                      'It looks like two fancy little curly wings.',
                      'Curly brackets { } are used for Python dictionaries!'
                    ]}
                    onPassed={() => setCh3Quiz1(true)}
                  />

                  {ch3Quiz1 && (
                    <QuizCard
                      id="ch3-q2"
                      question="In wizard_chest = {'skull': 'Cursed Ring'}, how do you fetch the treasure?"
                      options={[
                        'wizard_chest["skull"]',
                        'wizard_chest.pull("skull")',
                        'wizard_chest -> "skull"'
                      ]}
                      correctAnswer='wizard_chest["skull"]'
                      explanations={{
                        'wizard_chest["skull"]': 'Correct! Passing the key inside square brackets [] retrieves the associated value.',
                        'wizard_chest.pull("pull")': 'There is no .pull() method in Python dictionaries.',
                        'wizard_chest -> "skull"': 'The -> arrow is used in other languages, not for Python dictionary lookup.'
                      }}
                      hints={[
                        'You use the dictionary name followed by brackets containing the key string.',
                        'In Python, lookup syntax is dict[key].',
                        'Use wizard_chest["skull"] to retrieve "Cursed Ring"!'
                      ]}
                      onPassed={() => setCh3Quiz2(true)}
                    />
                  )}
                </>
              )}

              {/* CHAPTER 4 & 5 CHECKPOINTS */}
              {pageNum === 4 && (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  {ch4Executed ? (
                    <div>
                      <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 12px auto' }} />
                      <h3 style={{ color: 'var(--success)' }}>Chapter 4 Cleared!</h3>
                      <p style={{ color: '#D8F8FF' }}>You successfully executed the spell via the live terminal!</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: 'var(--text-muted)' }}>Go to Step 2 (Hands-on Lab) and execute a valid spell in the terminal to clear this chapter!</p>
                      <button className="web3-button" onClick={() => handleTabSwitch('lab')}>
                        Go to Terminal Lab ⚡
                      </button>
                    </div>
                  )}
                </div>
              )}

              {pageNum === 5 && (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  {ch5TrapDisarmed ? (
                    <div>
                      <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 12px auto' }} />
                      <h3 style={{ color: 'var(--success)' }}>Booby Trap Safely Disarmed!</h3>
                      <p style={{ color: '#D8F8FF' }}>You used .get() to prevent the KeyError crash!</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: 'var(--text-muted)' }}>Go to Step 2 (Hands-on Lab) and test safe .get() handling to disarm the trap!</p>
                      <button className="web3-button" onClick={() => handleTabSwitch('lab')}>
                        Go to Booby Trap Lab 🛡️
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Proceed Button */}
              {canProceed && (
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                  <button
                    className="web3-button"
                    onClick={handleProceed}
                    style={{
                      padding: '18px 36px',
                      fontSize: '1.15rem',
                      background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                      color: '#000',
                      boxShadow: '0 10px 25px rgba(0, 240, 255, 0.4)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span>{pageNum === 5 ? 'Enter Grand Finale & Claim Certificate' : `Proceed to Chapter ${pageNum + 1}`}</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;
