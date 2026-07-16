import { useState, useEffect, useRef } from 'react';
import { Lesson, LearningLevel, UserProgress } from '../types';
import { OFFLINE_LESSONS, OFFLINE_QUIZZES } from '../predefinedData';
import { VARIABLES_MODULE, INPUT_OUTPUT_MODULE, GuidedExample } from '../variablesAndIoData';
import CodeEditor from './CodeEditor';
import ReactMarkdown from 'react-markdown';
import { 
  BookOpen, Sparkles, AlertCircle, ArrowRight, CheckCircle2, 
  ChevronRight, HelpCircle, Volume2, VolumeX, Play, Pause, 
  RotateCcw, Sliders, Bookmark, MessageSquare, Send, Mic, 
  Image as ImageIcon, Code, Star, Check, Award, Compass, RefreshCw,
  Lock, Unlock, MessageCircle, ArrowDown, Move, Trophy, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LessonViewerProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  selectedScenario: string;
  selectedLevel: LearningLevel;
  onSelectTab?: (tab: string) => void;
}

const LESSON_CONCEPTS = [
  { concept: 'Variables & Data Types', id: 'concept_vars' },
  { concept: 'Input and Output', id: 'concept_io' },
  { concept: 'Operators & Strings', id: 'concept_operators' },
  { concept: 'Lists, Tuples, Dictionaries & Sets', id: 'concept_collections' },
  { concept: 'Conditions (if-else)', id: 'concept_conditions' },
  { concept: 'Loops (for/while)', id: 'concept_loops' },
  { concept: 'Functions & Modules', id: 'concept_funcs' },
  { concept: 'Object-Oriented Programming', id: 'concept_oop' }
];

export default function LessonViewer({
  progress,
  onUpdateProgress,
  selectedScenario,
  selectedLevel,
  onSelectTab
}: LessonViewerProps) {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [activePage, setActivePage] = useState(0); // For standard concepts (0: Sim, 1: Flowchart, 2: Spell Challenge)

  useEffect(() => {
    const reviewIndexStr = localStorage.getItem('pyverse_review_concept_index');
    if (reviewIndexStr !== null) {
      const parsedIndex = parseInt(reviewIndexStr, 10);
      if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < LESSON_CONCEPTS.length) {
        setActiveConceptIndex(parsedIndex);
        setActivePage(0);
        setCustomPathStep(0);
      }
      localStorage.removeItem('pyverse_review_concept_index');
    }
  }, []);
  
  // Custom Curriculum Steps states for Variables and I/O
  const [customPathStep, setCustomPathStep] = useState(0); // 0 to 4: Examples, 5: Games, 6: Redirection
  const [activeGameIndex, setActiveGameIndex] = useState(0); // 0 to 4
  const [gameUnlocked, setGameUnlocked] = useState<boolean[]>([true, false, false, false, false]);
  const [game1Choice, setGame1Choice] = useState<string | null>(null);
  const [game2Input, setGame2Input] = useState('');
  const [game2Feedback, setGame2Feedback] = useState<string | null>(null);
  
  // Drag & Match game state
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedMatchName, setSelectedMatchName] = useState<string | null>(null);
  
  const [lockWarning, setLockWarning] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Audio Tutor State
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState('Professor Py');
  const [muted, setMuted] = useState(false);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [practicePassed, setPracticePassed] = useState<Record<string, boolean>>({});

  // Simulation interaction variables
  const [simName, setSimName] = useState('Ravi');
  const [simAge, setSimAge] = useState(21);
  const [simScore, setSimScore] = useState(100);
  const [simFuel, setSimFuel] = useState(50);
  const [simX, setSimX] = useState(20);
  const [simY, setSimY] = useState(10);

  // Conversation Simulator
  const [chatHistory, setChatHistory] = useState<{ sender: 'robot' | 'user'; text: string }[]>([
    { sender: 'robot', text: "Beep boop! 🤖 Hello Friend! I am your Python conversational assistant. What is your name?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Peer Discussion States
  const [doubts, setDoubts] = useState([
    {
      id: 1,
      author: 'Apprentice_George',
      text: 'Why does Python throw an IndentationError when I put 3 spaces instead of 4?',
      votes: 12,
      solved: true,
      replies: [
        { author: 'Grand_Wizard_Sarah', text: 'Python relies strictly on indentation blocks to group statements! Standardizing on 4 spaces avoids mismatch bugs.' }
      ]
    },
    {
      id: 2,
      author: 'Apprentice_Zack',
      text: 'In the lunchbox variable example, if we re-assign a variable, does it throw away the previous lunch inside the box?',
      votes: 7,
      solved: true,
      replies: [
        { author: 'Professor Py', text: 'Spot on, Zack! 📦 Assigning a new value throws away the old lunch. The variable holds only the latest value!' }
      ]
    }
  ]);
  const [newDoubtText, setNewDoubtText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeReplyDoubtId, setActiveReplyDoubtId] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

  const activeConcept = LESSON_CONCEPTS[activeConceptIndex].concept;
  const isCustomCurriculum = activeConcept === 'Variables & Data Types' || activeConcept === 'Input and Output';
  const customModule = activeConcept === 'Variables & Data Types' ? VARIABLES_MODULE : INPUT_OUTPUT_MODULE;

  // Clear states when concept changes
  useEffect(() => {
    setCustomPathStep(0);
    setActiveGameIndex(0);
    setGameUnlocked([true, false, false, false, false]);
    setGame1Choice(null);
    setGame2Input('');
    setGame2Feedback(null);
    setMatchedPairs({});
    setSelectedMatchName(null);
    setPracticePassed({});
    setCaptionIndex(0);
    setVoicePlaying(false);
    if (activeConcept === 'Input and Output') {
      setChatHistory([
        { sender: 'robot', text: "Beep boop! 🤖 Hello Friend! I am your Python conversational assistant. What is your name?" }
      ]);
    }
  }, [activeConceptIndex]);

  // Handle auto speech subtitle progression when muted (or as a fallback if Speech Synthesis is unavailable)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const hasSpeechSynthesis = typeof window !== 'undefined' && !!window.speechSynthesis;
    
    // Only use timer-based progress if we are muted OR if speech synthesis is not supported in this browser
    if (voicePlaying && (muted || !hasSpeechSynthesis)) {
      timer = setInterval(() => {
        setCaptionIndex((prev) => {
          const max = customModule.voiceLines.length - 1;
          if (prev >= max) {
            setVoicePlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 5000 / voiceSpeed);
    }
    return () => clearInterval(timer);
  }, [voicePlaying, muted, voiceSpeed, customModule]);

  // Web Speech API Synthesis Integration for audible coach voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // If voice playing is disabled or muted, stop any speaking and return
    if (!voicePlaying || muted) {
      window.speechSynthesis.cancel();
      return;
    }

    const currentText = customModule.voiceLines[captionIndex];
    if (!currentText) return;

    // Stop any ongoing speech before starting a new one
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentText);
    
    // Set speech speed rate
    utterance.rate = voiceSpeed;

    // Customize voice pitch and speed multipliers based on selected personality
    if (selectedVoice === 'Professor Py') {
      utterance.pitch = 0.95; // Friendly, intellectual, slightly deeper
    } else if (selectedVoice === 'Wizard Sage') {
      utterance.pitch = 0.70; // Deeper, mystical, old-wise tone
    } else if (selectedVoice === 'Coach Spark') {
      utterance.pitch = 1.20; // High-energy, cheerful and fast
      utterance.rate = voiceSpeed * 1.05;
    }

    // Attempt to load and match an English voice that aligns with the personality
    const selectAppropriateVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        let matchedVoice = null;
        if (selectedVoice === 'Professor Py') {
          // English male/neutral accent
          matchedVoice = voices.find(v => v.lang.startsWith('en') && 
            (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google US English') || v.name.includes('Natural'))
          );
        } else if (selectedVoice === 'Wizard Sage') {
          // Older/deeper english tone if possible
          matchedVoice = voices.find(v => v.lang.startsWith('en') && 
            (v.name.includes('Microsoft') || v.name.includes('UK') || v.name.includes('Male') || v.name.includes('George'))
          );
        } else if (selectedVoice === 'Coach Spark') {
          // Enthusiastic female/cheerful english tone
          matchedVoice = voices.find(v => v.lang.startsWith('en') && 
            (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google UK English') || v.name.includes('Hazel'))
          );
        }

        // Fallback to any English voice
        if (!matchedVoice) {
          matchedVoice = voices.find(v => v.lang.startsWith('en'));
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }
    };

    selectAppropriateVoice();

    // If voices are loaded asynchronously, register handler to bind once available
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = selectAppropriateVoice;
    }

    // Progress automatically when speech finishes speaking
    utterance.onend = () => {
      if (voicePlaying) {
        const max = customModule.voiceLines.length - 1;
        if (captionIndex < max) {
          setCaptionIndex((prev) => prev + 1);
        } else {
          setVoicePlaying(false);
        }
      }
    };

    utterance.onerror = (e) => {
      // Log speech error or interrupted state
      console.log('SpeechSynthesisUtterance status/interrupted:', e);
    };

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [voicePlaying, muted, voiceSpeed, selectedVoice, captionIndex, customModule]);

  // Automated lock checker
  const isConceptTestCompleted = (conceptName: string) => {
    if (conceptName === 'Variables & Data Types') {
      const varQuizIds = ['var_quiz_q1', 'var_quiz_q2', 'var_quiz_q3', 'var_quiz_q4', 'var_quiz_q5'];
      return varQuizIds.every((id) => progress.completedQuizzes.includes(id));
    }
    if (conceptName === 'Input and Output') {
      const ioQuizIds = ['io_quiz_q1', 'io_quiz_q2', 'io_quiz_q3', 'io_quiz_q4', 'io_quiz_q5'];
      return ioQuizIds.every((id) => progress.completedQuizzes.includes(id));
    }
    const otherQuizzes = OFFLINE_QUIZZES.filter((q) => q.concept === conceptName);
    if (otherQuizzes.length === 0) return true;
    return otherQuizzes.every((q) => progress.completedQuizzes.includes(q.id));
  };

  const handleConceptSelect = (index: number) => {
    // Lock Rule: index > 0 requires previous concept's test to be fully completed
    const previousIndex = index - 1;
    if (index > 0) {
      const prevConcept = LESSON_CONCEPTS[previousIndex].concept;
      const isCompleted = isConceptTestCompleted(prevConcept);
      if (!isCompleted) {
        setLockWarning(
          `🔒 Access Denied! Please complete the compulsory "${prevConcept}" test inside the testing tab to unlock this topic.`
        );
        setTimeout(() => setLockWarning(null), 5000);
        return;
      }
    }
    setActiveConceptIndex(index);
    setActivePage(0);
  };

  // Chatbot conversation logic for I/O
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "Wow, that's fascinating! Tell me more about what you want to build in Python!";
      if (chatHistory.length === 1) {
        reply = `Wonderful name, ${userText}! 🤖 Let's make a deal: I will teach you input and output, and you can build a space car. What is your favorite car color?`;
      } else if (chatHistory.length === 3) {
        reply = `Excellent choice! A ${userText} racer sounds lightning-fast. Now, input your speed limit as a number:`;
      } else if (chatHistory.length === 5) {
        const num = parseInt(userText) || 100;
        reply = `Updating variables... Core registers a speed of ${num} mph! Writing input to memory completed. Awesome dialogue simulation! 🏎️💨`;
      }
      setChatHistory((prev) => [...prev, { sender: 'robot', text: reply }]);
    }, 1000);
  };

  const handleExamplePracticeSuccess = (exId: string) => {
    setPracticePassed((prev) => ({ ...prev, [exId]: true }));
    onUpdateProgress((prev) => ({
      ...prev,
      xp: prev.xp + 10,
    }));
  };

  // Practice games logic
  const checkGame1 = (choice: string) => {
    setGame1Choice(choice);
    if (choice === customModule.games.game1_nameTheBox.correct) {
      setGameUnlocked((prev) => {
        const next = [...prev];
        next[1] = true;
        return next;
      });
      onUpdateProgress((prev) => ({ ...prev, xp: prev.xp + 10 }));
    }
  };

  const checkGame2 = () => {
    const cleanInput = game2Input.trim().replace(/\s+/g, '');
    const cleanAnswer = customModule.games.game2_fixTheVariable.correctAnswer.replace(/\s+/g, '');
    if (cleanInput === cleanAnswer) {
      setGame2Feedback("Correct! Variable spaces fixed! 🚀");
      setGameUnlocked((prev) => {
        const next = [...prev];
        next[2] = true;
        return next;
      });
      onUpdateProgress((prev) => ({ ...prev, xp: prev.xp + 10 }));
    } else {
      setGame2Feedback("Incorrect! Check for spaces and underscores. Try again!");
    }
  };

  const checkGame3 = () => {
    // Treasure hunt logic
    setGameUnlocked((prev) => {
      const next = [...prev];
      next[3] = true;
      return next;
    });
    onUpdateProgress((prev) => ({ ...prev, xp: prev.xp + 15 }));
  };

  const handleMatchClick = (name: string, isLeft: boolean) => {
    if (isLeft) {
      setSelectedMatchName(name);
    } else if (selectedMatchName) {
      // Find matching pair
      const correctPair = customModule.games.game4_matchGame.pairs.find(
        (p) => p.name === selectedMatchName && p.value === name
      );
      if (correctPair) {
        setMatchedPairs((prev) => ({ ...prev, [selectedMatchName]: name }));
        setSelectedMatchName(null);

        // Check if all matched
        const totalToMatch = customModule.games.game4_matchGame.pairs.length;
        if (Object.keys(matchedPairs).length + 1 === totalToMatch) {
          setGameUnlocked((prev) => {
            const next = [...prev];
            next[4] = true;
            return next;
          });
          onUpdateProgress((prev) => ({ ...prev, xp: prev.xp + 15 }));
        }
      } else {
        setSelectedMatchName(null);
      }
    }
  };

  const handleFinalGameSuccess = () => {
    // Mark concept completed
    const lessonKey = `${selectedScenario}_${selectedLevel}_${activeConcept}`;
    onUpdateProgress((prev) => {
      const nextCompleted = prev.completedLessons.includes(lessonKey)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonKey];
      return {
        ...prev,
        completedLessons: nextCompleted,
        xp: prev.xp + 50,
      };
    });

    setCustomPathStep(6); // Celebration and redirection
  };

  const triggerRedirectToQuiz = () => {
    if (onSelectTab) {
      onSelectTab('quizzes');
    }
  };

  // Peer forum logic
  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoubtText.trim()) return;
    
    const userQuery = newDoubtText.trim();
    const newId = doubts.length + 1;
    
    const newD = {
      id: newId,
      author: 'Learner_Explorer',
      text: userQuery,
      votes: 1,
      solved: false,
      replies: [] as { author: string; text: string }[]
    };
    
    setDoubts([newD, ...doubts]);
    setNewDoubtText('');

    // Simulate real-time thinking AI tutor to suggest a personalized helpful answer
    setTimeout(() => {
      let aiText = `Beep boop! 🧠 Great query! In python ${activeConcept}, everything runs sequentially from top-to-bottom. Make sure that you didn't leave a typo in your syntax!`;
      if (userQuery.toLowerCase().includes('space') || userQuery.toLowerCase().includes('car')) {
        aiText = `Ah, working with coordinates! 🏎️ Remember that Python reads variables exactly. If your variable is \`car_x\`, and you type \`carx\`, Python throws a NameError! Verify spelling and spacing!`;
      } else if (userQuery.toLowerCase().includes('input') || userQuery.toLowerCase().includes('enter')) {
        aiText = `Excellent! Remember that \`input()\` always returns a **string** (text). If you want to use it for numbers or equations, convert it using \`int(input())\` first! 📦`;
      } else if (userQuery.toLowerCase().includes('variable') || userQuery.toLowerCase().includes('box')) {
        aiText = `Variables are indeed boxes! 📦 Assigning a value is done with a single equals sign (\`=\`). If you want to change it later, just assign a new value to the exact same box label!`;
      }

      setDoubts((prev) => prev.map((d) => {
        if (d.id === newId) {
          return {
            ...d,
            replies: [...d.replies, { author: 'Professor Py (AI Tutor)', text: aiText }]
          };
        }
        return d;
      }));
    }, 1200);
  };

  const handleUpvote = (id: number) => {
    setDoubts(doubts.map((d) => (d.id === id ? { ...d, votes: d.votes + 1 } : d)));
  };

  const handleToggleSolved = (id: number) => {
    setDoubts(doubts.map((d) => (d.id === id ? { ...d, solved: !d.solved } : d)));
  };

  const handlePostReply = (doubtId: number) => {
    const text = replyTexts[doubtId]?.trim();
    if (!text) return;

    setDoubts(doubts.map((d) => {
      if (d.id === doubtId) {
        return {
          ...d,
          replies: [...d.replies, { author: 'Learner_Explorer', text }]
        };
      }
      return d;
    }));

    setReplyTexts((prev) => ({ ...prev, [doubtId]: '' }));
    setActiveReplyDoubtId(null);
  };

  const simulateRecordVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setNewDoubtText((prev) => prev + "\n🎤 [Simulated Voice Note Attachment: 0:12]");
    }, 2000);
  };

  const simulateScreenshot = () => {
    setUploadedImage('simulated_error_snapshot');
    setNewDoubtText((prev) => prev + "\n🖼️ [Attached Code Snapshot: SyntaxError Line 2]");
  };

  // Load standard lessons fallback
  const loadStandardLesson = () => {
    const matched = OFFLINE_LESSONS.find(
      (l) => l.concept === activeConcept && l.scenario === selectedScenario
    );
    if (matched) return matched;

    return {
      id: 'std_fallback',
      title: `${activeConcept} Scenario Practice`,
      concept: activeConcept,
      level: selectedLevel,
      scenario: selectedScenario,
      explanation: `### Learn ${activeConcept} in ${selectedScenario} World\nExplore dynamic coordinate grids, arrays, and game rules!`,
      codeExample: `speed = 100\nprint(speed)`,
      interactiveChallenge: {
        instruction: 'Print variable "speed" to proceed.',
        template: `speed = 100\nprint(speed)`
      }
    };
  };

  const stdLesson = loadStandardLesson();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="lesson-view">
      
      {/* Locked Topic Warning Toast */}
      <AnimatePresence>
        {lockWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl flex items-center gap-3 shadow text-rose-900 max-w-4xl mx-auto"
          >
            <ShieldAlert className="h-5 w-5 text-rose-500 flex-shrink-0 animate-bounce" />
            <p className="text-xs font-black leading-relaxed">{lockWarning}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Navigation */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-50 rounded-lg text-blue-600">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">ACTIVE PYTHON DUNGEON</div>
            <div className="text-sm font-black text-slate-900">
              {selectedScenario.toUpperCase()} WORLD {selectedBook ? `• ${selectedBook}` : ''}{selectedGame ? `• ${selectedGame}` : ''}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isBookmarked ? 'bg-amber-50 border-amber-200 text-amber-500 animate-pulse' : 'bg-white border-slate-150 text-slate-400 hover:bg-slate-50'
            }`}
            title="Bookmark"
          >
            <Star className="h-4.5 w-4.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Curriculum Roadmap */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-sky-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">
              Curriculum Roadmap
            </h3>
            <div className="space-y-1.5">
              {LESSON_CONCEPTS.map((c, index) => {
                const isActive = index === activeConceptIndex;
                const isPreviousTestDone = index === 0 || isConceptTestCompleted(LESSON_CONCEPTS[index - 1].concept);

                return (
                  <button
                    key={c.id}
                    onClick={() => handleConceptSelect(index)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-sky-50 text-blue-700 font-extrabold border-l-4 border-blue-600 shadow-sm'
                        : !isPreviousTestDone
                        ? 'opacity-50 text-slate-400 hover:bg-slate-50 cursor-not-allowed'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs truncate mr-2 font-black">{c.concept}</span>
                    {!isPreviousTestDone ? (
                      <Lock className="h-3.5 w-3.5 text-slate-400" />
                    ) : progress.completedLessons.includes(`${selectedScenario}_${selectedLevel}_${c.concept}`) ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className={`h-3 w-3 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Locked Status Badge */}
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <h4 className="text-[10px] font-black text-sky-100 flex items-center gap-1.5 uppercase tracking-widest mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dungeon Progression</span>
            </h4>
            <p className="text-[11px] text-sky-50 leading-relaxed font-bold mb-3.5">
              Subsequent modules unlock ONLY after passing their respective skill tests inside the Compulsory Tests page.
            </p>
            <div className="text-[10px] text-white font-black uppercase bg-white/25 px-3 py-2 rounded-xl border border-white/20 text-center">
              Target Level: {selectedLevel.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Right Side: Active Portals */}
        <div className="lg:col-span-9 space-y-6">

          {/* CUSTOM RICH WHITE AND BLUE LEARNING PATH */}
          {isCustomCurriculum ? (
            <div className="space-y-6">
              
              {/* Top stepper indicators */}
              <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-sm flex flex-wrap justify-between items-center gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {customModule.examples.map((ex, i) => (
                    <button
                      key={ex.id}
                      onClick={() => setCustomPathStep(i)}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                        customPathStep === i
                          ? 'bg-blue-600 text-white border-blue-600 shadow shadow-blue-500/20'
                          : practicePassed[ex.id]
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      Step {i + 1}: {ex.title.split(':')[0]}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCustomPathStep(5)}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                      customPathStep === 5
                        ? 'bg-amber-500 text-white border-amber-500 shadow shadow-amber-500/20'
                        : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                    }`}
                  >
                    🎮 5 Mini-Games
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-500">Progress:</span>
                  <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((customPathStep + 1) / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-700">{Math.round(((customPathStep + 1) / 7) * 100)}%</span>
                </div>
              </div>

              {/* STEP 0 - 4: Guided Examples */}
              {customPathStep < 5 && (
                <div className="space-y-6">
                  {/* Visual animation and Audio player row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Visual Diagram Panel */}
                    <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm flex flex-col justify-between space-y-4 min-h-[320px]">
                      <div>
                        <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider bg-sky-50 px-2 py-1 rounded border border-sky-100">
                          Active Interactive Visualizer
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-2">
                          {activeConcept === 'Variables & Data Types' ? "Python Storage Boxes" : "Interactive Chat Robot Simulation"}
                        </h3>
                      </div>

                      {activeConcept === 'Variables & Data Types' ? (
                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                          {customPathStep === 4 ? (
                            // Car coordinate layout
                            <div className="space-y-3">
                              <div className="bg-slate-50 border border-sky-100 p-4 rounded-2xl relative h-36 flex flex-col justify-end overflow-hidden shadow-inner">
                                <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400">
                                  Grid coordinates: car_x, car_y
                                </div>
                                
                                {/* Animated Car */}
                                <div 
                                  className="absolute bg-blue-600 text-white px-2 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-md transition-all duration-500"
                                  style={{ left: `${(simX / 40) * 100}%`, bottom: `${(simY / 20) * 100}%` }}
                                >
                                  <span>🏎️ car</span>
                                  <span className="text-[9px] bg-blue-800 px-1 rounded">x:{simX}</span>
                                </div>

                                <div className="w-full h-0.5 bg-slate-300 border-dashed" />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-2 rounded-xl border border-sky-100 text-center">
                                  <span className="text-[10px] font-bold text-slate-500">car_x coordinate:</span>
                                  <input 
                                    type="range" min="10" max="35" value={simX}
                                    onChange={(e) => setSimX(parseInt(e.target.value))}
                                    className="w-full accent-blue-600 mt-1 cursor-pointer"
                                  />
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl border border-sky-100 text-center">
                                  <span className="text-[10px] font-bold text-slate-500">car_y coordinate:</span>
                                  <input 
                                    type="range" min="5" max="15" value={simY}
                                    onChange={(e) => setSimY(parseInt(e.target.value))}
                                    className="w-full accent-blue-600 mt-1 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                              // Cartoon Python Robot and Boxes
                              <div className="space-y-4">
                              {/* Cartoon Robot Head and Body */}
                              <div className="bg-gradient-to-r from-sky-50 to-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center gap-4 shadow-sm animate-pulse">
                                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl shadow-md border-4 border-blue-100 relative overflow-hidden flex-shrink-0">
                                  🤖
                                  <div className="absolute top-1 left-2 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-black text-blue-900 uppercase tracking-wide flex items-center gap-1">
                                    <span>Py-Bot v1.0 Box Organizer</span>
                                    <span className="bg-emerald-500 text-white text-[8px] px-1.5 py-0.2 rounded-full">ACTIVE</span>
                                  </h4>
                                  <p className="text-[11px] font-bold text-slate-650 leading-relaxed">
                                    “A variable is like a labelled lunch box. Type values below to change what's inside!”
                                  </p>
                                </div>
                              </div>

                              {/* Three labeled Storage Boxes */}
                              <div className="grid grid-cols-3 gap-3">
                                {/* Box 1: name */}
                                <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-2xl flex flex-col items-center justify-between shadow-sm hover:scale-[1.03] transition-transform duration-200">
                                  <div className="flex items-center gap-1 mb-1 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                                    <span className="text-[9px] font-black text-blue-800 font-mono">name</span>
                                  </div>
                                  <div className="w-14 h-14 bg-white rounded-2xl border-2 border-dashed border-blue-400 flex flex-col items-center justify-center text-xl shadow-inner relative group">
                                    <span>🍱</span>
                                    <span className="text-[8px] font-black absolute bottom-1 text-blue-500">STRING</span>
                                  </div>
                                  <div className="w-full space-y-1 mt-2">
                                    <span className="text-[9px] text-slate-400 font-bold block text-center">Value inside:</span>
                                    <input 
                                      type="text" 
                                      value={simName} 
                                      onChange={(e) => setSimName(e.target.value)}
                                      className="w-full text-center text-xs font-black border border-blue-200 rounded-lg p-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                  </div>
                                </div>

                                {/* Box 2: score */}
                                <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl flex flex-col items-center justify-between shadow-sm hover:scale-[1.03] transition-transform duration-200">
                                  <div className="flex items-center gap-1 mb-1 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                                    <span className="text-[9px] font-black text-amber-800 font-mono">score</span>
                                  </div>
                                  <div className="w-14 h-14 bg-white rounded-2xl border-2 border-dashed border-amber-400 flex flex-col items-center justify-center text-xl shadow-inner relative">
                                    <span>🪙</span>
                                    <span className="text-[8px] font-black absolute bottom-1 text-amber-500">INTEGER</span>
                                  </div>
                                  <div className="w-full space-y-1 mt-2">
                                    <span className="text-[9px] text-slate-400 font-bold block text-center">Value inside:</span>
                                    <input 
                                      type="number" 
                                      value={simScore} 
                                      onChange={(e) => setSimScore(parseInt(e.target.value) || 0)}
                                      className="w-full text-center text-xs font-black border border-amber-200 rounded-lg p-1 bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                                    />
                                  </div>
                                </div>

                                {/* Box 3: fuel */}
                                <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl flex flex-col items-center justify-between shadow-sm hover:scale-[1.03] transition-transform duration-200">
                                  <div className="flex items-center gap-1 mb-1 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                                    <span className="text-[9px] font-black text-emerald-800 font-mono">fuel</span>
                                  </div>
                                  <div className="w-14 h-14 bg-white rounded-2xl border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center text-xl shadow-inner relative">
                                    <span>⚡</span>
                                    <span className="text-[8px] font-black absolute bottom-1 text-emerald-500">FLOAT</span>
                                  </div>
                                  <div className="w-full space-y-1 mt-2">
                                    <span className="text-[9px] text-slate-400 font-bold block text-center">Value inside:</span>
                                    <input 
                                      type="number" 
                                      value={simFuel} 
                                      onChange={(e) => setSimFuel(parseInt(e.target.value) || 0)}
                                      className="w-full text-center text-xs font-black border border-emerald-200 rounded-lg p-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Input Output chatbot visual
                        <div className="flex-1 flex flex-col justify-between border border-sky-100 rounded-2xl p-3 bg-slate-50/50 shadow-inner overflow-hidden max-h-56">
                          <div className="space-y-2 overflow-y-auto max-h-40 flex-1 text-xs">
                            {chatHistory.map((ch, idx) => (
                              <div key={idx} className={`flex ${ch.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-xl max-w-[85%] font-semibold leading-relaxed ${
                                  ch.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-sky-100 text-slate-850'
                                }`}>
                                  {ch.text}
                                </div>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleSendChat} className="flex gap-1.5 border-t border-sky-100 pt-2 mt-2">
                            <input 
                              type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Type robot response..."
                              className="flex-1 px-3 py-1.5 text-xs border border-sky-150 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                            />
                            <button type="submit" className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* AI Voice explainer controller */}
                    <div className="bg-sky-50/50 rounded-3xl p-6 border border-sky-100 shadow-sm flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                          </span>
                          <span className="text-[10px] font-black text-blue-900 uppercase">AI Voice Trainer</span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-800 mt-2">Listen to Coach Explanation</h3>
                      </div>

                      {/* Speech subtitles visualizer */}
                      <div className="bg-white p-4 rounded-2xl border border-sky-100 flex-1 flex flex-col justify-center text-center shadow-inner">
                        <div className="text-blue-500 text-[9px] font-black uppercase tracking-wider mb-1">
                          Coach Subtitles:
                        </div>
                        <p className="text-xs font-semibold italic text-slate-700 leading-relaxed">
                          "{muted ? "🔇 (Muted) " : ""}{customModule.voiceLines[captionIndex]}"
                        </p>
                      </div>

                      {/* Audio Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-sky-100 shadow-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setVoicePlaying(!voicePlaying)}
                            className="p-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 cursor-pointer"
                          >
                            {voicePlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5" />}
                          </button>
                          <button
                            onClick={() => { setCaptionIndex(0); setVoicePlaying(true); }}
                            className="p-2.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 cursor-pointer"
                            title="Replay"
                          >
                            <RotateCcw className="h-4.5 w-4.5" />
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <select
                            value={voiceSpeed}
                            onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                            className="text-[10px] font-bold bg-white px-2 py-1 border border-sky-100 rounded text-slate-700 focus:outline-none"
                          >
                            <option value="0.5">0.5x Speed</option>
                            <option value="1">1.0x Speed</option>
                            <option value="1.5">1.5x Speed</option>
                          </select>
                          <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="text-[10px] font-bold bg-white px-2 py-1 border border-sky-100 rounded text-slate-700 focus:outline-none"
                          >
                            <option value="Professor Py">Professor Py</option>
                            <option value="Wizard Sage">Wizard Sage</option>
                            <option value="Coach Spark">Coach Spark</option>
                          </select>
                          <button onClick={() => setMuted(!muted)} className="p-1 text-slate-500">
                            {muted ? <VolumeX className="h-4.5 w-4.5 text-red-500" /> : <Volume2 className="h-4.5 w-4.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Lesson Concept & Explanation card */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-sm space-y-4">
                    <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider bg-sky-50 px-2 py-1 rounded border border-sky-100">
                      Step {customPathStep + 1} core lesson
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {customModule.examples[customPathStep].title}
                    </h2>
                    
                    <div className="prose max-w-none text-slate-700 text-xs md:text-sm font-semibold leading-relaxed">
                      <p>{customModule.examples[customPathStep].explanation}</p>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-4 overflow-x-auto font-mono text-xs text-sky-100 border border-slate-800 leading-relaxed shadow-inner">
                      <pre>{customModule.examples[customPathStep].code}</pre>
                    </div>

                    {/* Why are we using this? panel */}
                    <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-2">
                      <div className="flex items-center gap-1.5 font-extrabold text-xs text-blue-800">
                        <HelpCircle className="h-4 w-4" />
                        <span>Why do we use this?</span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        {customModule.examples[customPathStep].whyExplanation}
                      </p>
                    </div>
                  </div>

                  {/* Try It Yourself Sandbox Practice Zone */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-600 animate-pulse" />
                      <h3 className="font-extrabold text-base text-slate-900">Try it Yourself Practice</h3>
                    </div>

                    <p className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed bg-blue-50/40 p-4 rounded-2xl border border-sky-100">
                      {customModule.examples[customPathStep].tryItYourself.instruction}
                    </p>

                    <CodeEditor
                      initialCode={customModule.examples[customPathStep].tryItYourself.starterCode}
                      onRunSuccess={() => handleExamplePracticeSuccess(customModule.examples[customPathStep].id)}
                      expectedOutputContains={customModule.examples[customPathStep].tryItYourself.expectedOutputContains}
                      lessonContext={activeConcept}
                      isSecureExercise={true}
                      progress={progress}
                      onUpdateProgress={onUpdateProgress}
                    />

                    {/* Success confirmation and unlock button */}
                    <AnimatePresence>
                      {practicePassed[customModule.examples[customPathStep].id] && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-50 border-2 border-emerald-100 p-5 rounded-2xl text-center space-y-4 shadow-sm"
                        >
                          <div className="p-2 bg-emerald-500 text-white rounded-full inline-block">
                            <Check className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wide">
                              Success! Challenge Unlocked
                            </h4>
                            <p className="text-xs text-emerald-800 font-bold mt-1">
                              {customModule.examples[customPathStep].tryItYourself.successMessage}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => {
                              const next = customPathStep + 1;
                              setCustomPathStep(next);
                            }}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Lock & Load: Continue</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* STEP 5: Interactive Practice Games */}
              {customPathStep === 5 && (
                <div className="space-y-6">
                  
                  {/* Games navigation panel */}
                  <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-sky-50 px-2 py-1 rounded border border-sky-100">
                      Gamified Challenge Suite
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2">Select Your Mini-Game</h3>
                    
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {[1, 2, 3, 4, 5].map((gIndex) => {
                        const isUnlocked = gameUnlocked[gIndex - 1];
                        const isActive = activeGameIndex === gIndex - 1;
                        return (
                          <button
                            key={gIndex}
                            disabled={!isUnlocked}
                            onClick={() => setActiveGameIndex(gIndex - 1)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                              isActive
                                ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                                : isUnlocked
                                ? 'bg-white border-sky-100 text-slate-700 hover:bg-sky-50 cursor-pointer'
                                : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <span className="text-[9px] font-black block uppercase">Game {gIndex}</span>
                            <span className="text-xs mt-0.5">
                              {gIndex === 1 && "🏷️"}
                              {gIndex === 2 && "🔧"}
                              {gIndex === 3 && "🏴‍☠️"}
                              {gIndex === 4 && "🔗"}
                              {gIndex === 5 && "🏎️"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIVE GAME CONTAINER */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-sm space-y-6">
                    
                    {/* GAME 1: Name the Box */}
                    {activeGameIndex === 0 && (
                      <div className="space-y-4 text-center">
                        <div className="p-2 bg-amber-100 text-amber-700 font-black text-[10px] rounded inline-block uppercase tracking-wider">
                          Mini Game 1: Name the Box
                        </div>
                        <h3 className="text-lg font-black text-slate-900">What is the most suitable variable name for this box?</h3>
                        
                        <div className="bg-slate-50 border border-sky-100 p-6 rounded-2xl max-w-sm mx-auto shadow-inner space-y-3">
                          <div className="w-16 h-16 bg-white border-4 border-amber-400 rounded-2xl flex items-center justify-center text-3xl shadow mx-auto">
                            📦
                          </div>
                          <p className="font-mono text-sm text-slate-700 font-extrabold">{customModule.games.game1_nameTheBox.value}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
                          {customModule.games.game1_nameTheBox.choices.map((choice) => {
                            const isCorrect = choice === customModule.games.game1_nameTheBox.correct;
                            const isSelected = game1Choice === choice;
                            return (
                              <button
                                key={choice}
                                onClick={() => checkGame1(choice)}
                                className={`p-4 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                                  isSelected
                                    ? isCorrect
                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow'
                                      : 'bg-rose-600 border-rose-600 text-white shadow'
                                    : 'bg-slate-50 border-sky-50 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>

                        {game1Choice && (
                          <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-semibold ${
                            game1Choice === customModule.games.game1_nameTheBox.correct 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {game1Choice === customModule.games.game1_nameTheBox.correct 
                              ? "Splendid! 'speed' is self-explanatory, descriptive, and clean. Game 2 unlocked! 🌟" 
                              : "Oh no! That is not descriptive enough. Try again!"}
                          </div>
                        )}
                      </div>
                    )}

                    {/* GAME 2: Fix the Variable */}
                    {activeGameIndex === 1 && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="p-2 bg-amber-100 text-amber-700 font-black text-[10px] rounded inline-block uppercase tracking-wider">
                            Mini Game 2: Fix the Variable
                          </div>
                          <h3 className="text-lg font-black text-slate-900 mt-2">Erase the spacing syntax errors!</h3>
                          <p className="text-xs text-slate-500 mt-1">{customModule.games.game2_fixTheVariable.prompt}</p>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-rose-300 max-w-sm mx-auto text-center border border-slate-800 shadow-inner">
                          {customModule.games.game2_fixTheVariable.buggyCode}
                        </div>

                        <div className="max-w-md mx-auto space-y-3">
                          <input
                            type="text"
                            value={game2Input}
                            onChange={(e) => setGame2Input(e.target.value)}
                            placeholder="Type correct code here..."
                            className="w-full px-4 py-2.5 text-xs font-mono border border-sky-150 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-400 bg-slate-50 font-bold"
                          />
                          <button
                            onClick={checkGame2}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase shadow cursor-pointer"
                          >
                            Validate Fix
                          </button>
                        </div>

                        {game2Feedback && (
                          <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-semibold text-center ${
                            game2Feedback.includes("Correct") 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {game2Feedback}
                          </div>
                        )}
                      </div>
                    )}

                    {/* GAME 3: Treasure Hunt */}
                    {activeGameIndex === 2 && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="p-2 bg-amber-100 text-amber-700 font-black text-[10px] rounded inline-block uppercase tracking-wider">
                            Mini Game 3: Treasure Hunt
                          </div>
                          <h3 className="text-lg font-black text-slate-900 mt-2">Crack the Ancient Treasure Chest</h3>
                          <p className="text-xs text-slate-500 mt-1">{customModule.games.game3_treasureHunt.prompt}</p>
                        </div>

                        <CodeEditor
                          initialCode={customModule.games.game3_treasureHunt.starterCode}
                          onRunSuccess={checkGame3}
                          expectedOutputContains={[]}
                          lessonContext={activeConcept}
                          isSecureExercise={true}
                          progress={progress}
                          onUpdateProgress={onUpdateProgress}
                        />

                        {gameUnlocked[3] && (
                          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-xs font-semibold text-center max-w-md mx-auto">
                            Hooray! Pirate vault variables configured perfectly. Game 4 unlocked! 🏴‍☠️🗝️
                          </div>
                        )}
                      </div>
                    )}

                    {/* GAME 4: Variable Match Game */}
                    {activeGameIndex === 3 && (
                      <div className="space-y-4 text-center">
                        <div className="p-2 bg-amber-100 text-amber-700 font-black text-[10px] rounded inline-block uppercase tracking-wider">
                          Mini Game 4: Drag & Match Game
                        </div>
                        <h3 className="text-lg font-black text-slate-900">Click a concept name, then click its matching code value!</h3>

                        <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto pt-4">
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entities:</h4>
                            {customModule.games.game4_matchGame.pairs.map((p) => {
                              const isMatched = !!matchedPairs[p.name];
                              const isSelected = selectedMatchName === p.name;
                              return (
                                <button
                                  key={p.name}
                                  disabled={isMatched}
                                  onClick={() => handleMatchClick(p.name, true)}
                                  className={`w-full p-4 rounded-xl border text-xs font-black transition-all ${
                                    isMatched
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-60'
                                      : isSelected
                                      ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                                      : 'bg-slate-50 border-sky-50 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {p.name} {isMatched && "✓"}
                                </button>
                              );
                            })}
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code Values:</h4>
                            {customModule.games.game4_matchGame.pairs.map((p) => {
                              const isMatched = Object.values(matchedPairs).includes(p.value);
                              return (
                                <button
                                  key={p.value}
                                  disabled={isMatched}
                                  onClick={() => handleMatchClick(p.value, false)}
                                  className={`w-full p-4 rounded-xl border text-xs font-mono font-black transition-all ${
                                    isMatched
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-60'
                                      : 'bg-slate-50 border-sky-50 text-slate-750 hover:bg-slate-100'
                                  }`}
                                >
                                  {p.value}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {gameUnlocked[4] && (
                          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-xs font-semibold text-center max-w-md mx-auto">
                            Excellent! All variable entities matched and synced to memory! Final game unlocked! 🧠🔌
                          </div>
                        )}
                      </div>
                    )}

                    {/* GAME 5: Final Variables Challenge */}
                    {activeGameIndex === 4 && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="p-2 bg-amber-100 text-amber-700 font-black text-[10px] rounded inline-block uppercase tracking-wider">
                            Mini Game 5: Final Variables Challenge
                          </div>
                          <h3 className="text-lg font-black text-slate-900 mt-2">Construct a Game Profile Card!</h3>
                          <p className="text-xs text-slate-500 mt-1">{customModule.games.game5_finalChallenge.prompt}</p>
                        </div>

                        <CodeEditor
                          initialCode={customModule.games.game5_finalChallenge.starterCode}
                          onRunSuccess={handleFinalGameSuccess}
                          expectedOutputContains={customModule.games.game5_finalChallenge.expectedOutputContains}
                          lessonContext={activeConcept}
                          isSecureExercise={true}
                          progress={progress}
                          onUpdateProgress={onUpdateProgress}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: Celebration and Automatic redirect */}
              {customPathStep === 6 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-3xl p-8 text-center space-y-6 shadow-lg relative overflow-hidden"
                >
                  <div className="p-4 bg-white/10 rounded-full inline-block">
                    <Trophy className="h-12 w-12 text-amber-300 animate-bounce" />
                  </div>
                  
                  <div className="space-y-2 max-w-md mx-auto">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Lesson Completed! 🎉</h2>
                    <p className="text-xs md:text-sm text-sky-100 font-bold leading-relaxed">
                      You have mastered variables! All 5 guided examples and 5 interactive mini-games completed successfully. Undergoing redirection to the final test...
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={triggerRedirectToQuiz}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-blue-900 text-xs font-black uppercase tracking-wider rounded-xl transition shadow cursor-pointer"
                    >
                      <span>Take Compulsory Test</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            
            // STANDARD SCENARIO LESSON LAYOUT
            <div className="space-y-6">
              
              {/* Header Navigation for Multi-Pages */}
              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2">
                  {[
                    { step: 0, label: "🎥 1. Simulator Arena" },
                    { step: 1, label: "📊 2. Logic Flowchart" },
                    { step: 2, label: "💻 3. Spell Challenge" }
                  ].map((pg) => (
                    <button
                      key={pg.step}
                      onClick={() => setActivePage(pg.step)}
                      className={`px-4 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                        activePage === pg.step
                          ? 'bg-blue-600 text-white border-blue-600 shadow shadow-blue-500/20'
                          : 'bg-white text-slate-600 border-slate-150 hover:bg-slate-50'
                      }`}
                    >
                      {pg.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">Progress:</span>
                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${((activePage + 1) / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-700 font-black">{Math.round(((activePage + 1) / 3) * 100)}%</span>
                </div>
              </div>

              {/* PAGE 0: Interactive Simulation */}
              {activePage === 0 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-sm space-y-6">
                  <div className="border-b border-sky-50 pb-4 space-y-1">
                    <span className="text-blue-600 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-50 border border-sky-100 tracking-wider">
                      Interactive Simulation
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900">{stdLesson.title}</h2>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4">
                    <Star className="h-8 w-8 text-amber-400 animate-pulse" />
                    <h4 className="font-extrabold text-slate-900">Custom World Simulation Grid</h4>
                    <p className="text-xs text-slate-500 text-center">
                      Change parameters below and view Python variables in actions!
                    </p>
                  </div>

                  <div className="prose max-w-none text-slate-650 text-xs md:text-sm font-medium leading-relaxed bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                    <div className="markdown-body">
                      <ReactMarkdown>{stdLesson.explanation}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setActivePage(1)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue to Flowchart</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 1: Logic Flowchart */}
              {activePage === 1 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-sm space-y-6">
                  <div className="border-b border-sky-50 pb-4 space-y-1">
                    <span className="text-blue-600 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-50 border border-sky-100 tracking-wider">
                      Logic Diagrams & Core Motivation
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900">Visual Blueprint: {activeConcept}</h2>
                  </div>

                  <div className="bg-sky-50/50 rounded-2xl p-6 border border-sky-100 flex flex-col items-center justify-center space-y-4">
                    <div className="flex flex-col items-center space-y-3 max-w-sm w-full font-mono text-xs">
                      <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl font-black border border-blue-200">
                        Read sequential statements
                      </div>
                      <div className="h-4 w-0.5 bg-blue-300" />
                      <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-xl font-black border border-indigo-200">
                        Execute Python logic
                      </div>
                    </div>
                  </div>

                  {/* Why are we using this? */}
                  <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                    <div className="bg-sky-50 px-5 py-3 border-b border-sky-150 flex items-center gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-blue-600" />
                      <h3 className="font-extrabold text-sm text-slate-800">Why are we using this concept?</h3>
                    </div>
                    <div className="p-5 md:p-6 text-xs md:text-sm text-slate-600 font-semibold space-y-3">
                      <p>
                        Using programming paradigms lets us write scalable apps, calculate variable quantities dynamically, and build games.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setActivePage(0)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      &larr; Back to Sim
                    </button>
                    <button
                      onClick={() => setActivePage(2)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue to Code Challenge</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 2: Practical Interactive Task */}
              {activePage === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 shadow-md space-y-4">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-sky-200" />
                      <h3 className="font-black text-lg">Active Spell Challenge Arena</h3>
                    </div>
                    <p className="text-sky-50 text-xs md:text-sm leading-relaxed font-bold">
                      {stdLesson.interactiveChallenge.instruction}
                    </p>
                  </div>

                  <CodeEditor
                    initialCode={stdLesson.interactiveChallenge.template || ""}
                    onRunSuccess={() => {
                      onUpdateProgress((prev) => ({
                        ...prev,
                        xp: prev.xp + 50
                      }));
                      alert("✨ Excellent job! Concept challenge passed successfully.");
                    }}
                    expectedOutputContains={[]}
                    lessonContext={activeConcept}
                    isSecureExercise={true}
                    progress={progress}
                    onUpdateProgress={onUpdateProgress}
                  />

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setActivePage(1)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      &larr; Back to Flowchart
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Inline Peer Discussion Forum Below Each Lesson */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-sm space-y-6">
            <div className="border-b border-sky-50 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="h-4.5 w-4.5 text-blue-600" />
                  <span>Lesson Peer Discussion Forum</span>
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Ask doubt with simulated voice message attachments, screenshots, or code fragments.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-50 text-blue-700 border border-sky-100 px-2.5 py-1 rounded-full">
                {doubts.length} ACTIVE DOUBTS
              </span>
            </div>

            {/* Post a Doubt form */}
            <form onSubmit={handlePostDoubt} className="space-y-4">
              <div className="relative">
                <textarea
                  value={newDoubtText}
                  onChange={(e) => setNewDoubtText(e.target.value)}
                  placeholder="Post your syntax error or question here..."
                  className="w-full text-xs font-semibold p-4 rounded-xl border border-sky-100 bg-slate-50/50 text-slate-805 placeholder-slate-400 focus:outline-none focus:border-blue-400 min-h-[85px] shadow-inner"
                />
                
                {uploadedImage && (
                  <div className="absolute right-4 bottom-4 flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold">
                    <ImageIcon className="h-3 w-3" />
                    <span>Screenshot attached</span>
                    <button type="button" onClick={() => setUploadedImage(null)} className="text-red-500 font-bold ml-1">×</button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={simulateRecordVoice}
                    className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isRecording ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                    <span>{isRecording ? "Recording..." : "Attach Voice"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={simulateScreenshot}
                    className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center gap-1.5 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Attach Screenshot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewDoubtText((prev) => prev + "\n```python\n# write snippet\n\n```")}
                    className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center gap-1.5 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    <Code className="h-4 w-4" />
                    <span>Insert Code snippet</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Post Doubt</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

            {/* List Doubts */}
            <div className="space-y-4 pt-2">
              {doubts.map((doubt) => (
                <div key={doubt.id} className="p-4 rounded-2xl border border-sky-100 bg-sky-50/10 space-y-3.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded font-mono">
                        {doubt.author}
                      </span>
                      <span className="text-[10px] text-slate-450 font-bold">asked recently</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSolved(doubt.id)}
                        className={`px-2.5 py-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                          doubt.solved 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {doubt.solved ? "✓ Solved" : "Mark as Solved"}
                      </button>
                      
                      <button
                        onClick={() => handleUpvote(doubt.id)}
                        className="px-2.5 py-1 bg-white border border-slate-150 rounded-lg text-xs font-extrabold text-slate-700 flex items-center gap-1 hover:bg-slate-50"
                      >
                        <span>▲</span>
                        <span>{doubt.votes}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    {doubt.text}
                  </p>

                  {/* Interactive Reply to Peer Form Trigger */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => setActiveReplyDoubtId(activeReplyDoubtId === doubt.id ? null : doubt.id)}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>💬 Reply to Peer</span>
                    </button>
                  </div>

                  {/* Interactive Reply Form */}
                  {activeReplyDoubtId === doubt.id && (
                    <div className="ml-6 space-y-2 bg-slate-50 p-3 rounded-xl border border-sky-50">
                      <textarea
                        value={replyTexts[doubt.id] || ''}
                        onChange={(e) => setReplyTexts({ ...replyTexts, [doubt.id]: e.target.value })}
                        placeholder="Write your advice or solution..."
                        className="w-full text-xs font-semibold p-2.5 bg-white border border-sky-100 rounded-lg focus:outline-none focus:border-blue-400 shadow-inner"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveReplyDoubtId(null)}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePostReply(doubt.id)}
                          disabled={!(replyTexts[doubt.id]?.trim())}
                          className="px-3.5 py-1.5 bg-blue-600 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm cursor-pointer hover:bg-blue-700"
                        >
                          Submit Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {doubt.replies.map((rep, rIdx) => (
                    <div key={rIdx} className="bg-white p-3 rounded-xl border border-sky-50 ml-6 flex flex-col gap-1 shadow-sm">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500">
                        <span className="text-blue-700 bg-sky-50 px-1.5 py-0.5 rounded font-bold">
                          {rep.author}
                        </span>
                        <span>suggested:</span>
                        {(rep.author.includes('Professor') || rep.author.includes('AI Tutor')) && (
                          <span className="bg-blue-600 text-white text-[8px] px-1.5 rounded-full font-black uppercase">
                            AI TUTOR RESPONSE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-650 leading-relaxed font-semibold mt-1">
                        <div className="markdown-body">
                          <ReactMarkdown>{rep.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
