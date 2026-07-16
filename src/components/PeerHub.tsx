import { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  PlusCircle, 
  Search, 
  ThumbsUp, 
  CheckCircle2, 
  HelpCircle, 
  User, 
  Users, 
  Filter, 
  Code2, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Code,
  Flame,
  X,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface PeerHubProps {
  progress: UserProgress;
  onUpdateProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  selectedScenario: string;
}

interface Reply {
  id: string;
  author: string;
  role: string;
  avatarColor: string;
  xpBadge: string;
  content: string;
  code?: string;
  votes: number;
  userVoted: boolean;
  isAccepted: boolean;
  createdAt: string;
}

interface DoubtThread {
  id: string;
  title: string;
  content: string;
  codeContext?: string;
  author: string;
  role: string;
  avatarColor: string;
  xpBadge: string;
  category: 'syntax' | 'logic' | 'analogy' | 'projects' | 'general';
  votes: number;
  userVoted: boolean;
  replies: Reply[];
  status: 'resolved' | 'open';
  createdAt: string;
  scenario: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Discussions', count: 0 },
  { id: 'syntax', label: 'Syntax Errors', count: 0 },
  { id: 'logic', label: 'Logical Bugs', count: 0 },
  { id: 'analogy', label: 'Concept Analogies', count: 0 },
  { id: 'projects', label: 'Project Support', count: 0 },
  { id: 'general', label: 'General / Career', count: 0 },
];

const INITIAL_THREADS: DoubtThread[] = [
  {
    id: 'thread_1',
    title: 'IndentationError: expected an indented block in Minecraft zombie loop',
    content: `I'm trying to spawn 5 zombies in my custom Minecraft loop, but Python keeps throwing an IndentationError on my spawning line. Can anyone explain why it is complaining about indents when my code looks correct in my head?`,
    codeContext: `for i in range(5):\nprint("Spawning zombie #" + str(i))\n# Wait, why is this breaking?`,
    author: 'mine_crafter_steve',
    role: 'Apprentice',
    avatarColor: 'from-emerald-400 to-teal-600',
    xpBadge: '380 XP',
    category: 'syntax',
    votes: 8,
    userVoted: false,
    status: 'resolved',
    createdAt: '2 hours ago',
    scenario: 'gaming',
    replies: [
      {
        id: 'reply_1_1',
        author: 'spell_caster_99',
        role: 'Grand Mage',
        avatarColor: 'from-purple-500 to-indigo-700',
        xpBadge: '1,240 XP',
        content: `In Python, blank space is not just for readability; it acts like the curly braces {} in languages like Java or C++!

When you define a block structure like a \`for\` loop, an \`if\` statement, or a function, Python expects the block of code inside to be indented. Usually, we use **4 spaces** or press **Tab** once.

Try indenting the spawning line like this:`,
        code: `for i in range(5):\n    print("Spawning zombie #" + str(i)) # Indented by 4 spaces`,
        votes: 12,
        userVoted: false,
        isAccepted: true,
        createdAt: '1 hour ago'
      }
    ]
  },
  {
    id: 'thread_2',
    title: 'Visualizing nested dictionaries for Harry Potter houses?',
    content: `I am currently studying nested dictionaries in lists. Simple key-value pairs are easy to understand, but nested structures (dictionaries inside dictionaries) are giving me a massive headache. Does anyone have a simple, wizarding-world analogy to make this click?`,
    codeContext: `hogwarts_houses = {\n    "Gryffindor": {"points": 350, "founder": "Godric"},\n    "Slytherin": {"points": 340, "founder": "Salazar"}\n}`,
    author: 'muggle_born_coder',
    role: 'Novice Wizard',
    avatarColor: 'from-amber-400 to-red-500',
    xpBadge: '140 XP',
    category: 'analogy',
    votes: 15,
    userVoted: false,
    status: 'resolved',
    createdAt: '5 hours ago',
    scenario: 'books',
    replies: [
      {
        id: 'reply_2_1',
        author: 'hermione_codes',
        role: 'Bookworm Prefect',
        avatarColor: 'from-blue-400 to-indigo-600',
        xpBadge: '1,980 XP',
        content: `Think of a nested dictionary like the Hogwarts Castle itself!

1. The main dictionary is the **Castle**.
2. The outer keys ("Gryffindor", "Slytherin") are the **Common Rooms**. When you unlock a Common Room door, you don't just find one item; you find an entire room filled with different items.
3. Inside each Common Room, you have sub-keys (like "points" and "founder"). These are specific labeled chests inside that room!

So, to find Gryffindor's points, you walk into the castle, unlock Gryffindor common room, then open the "points" chest!
\`hogwarts_houses["Gryffindor"]["points"]\``,
        votes: 18,
        userVoted: false,
        isAccepted: true,
        createdAt: '4 hours ago'
      },
      {
        id: 'reply_2_2',
        author: 'ron_is_king',
        role: 'Apprentice',
        avatarColor: 'from-orange-400 to-red-600',
        xpBadge: '220 XP',
        content: `Wow, Hermione's analogy is spot on. I used to think of it like nested sweet boxes from Honeydukes, but the castle room chest makes way more sense. Thanks!`,
        votes: 3,
        userVoted: false,
        isAccepted: false,
        createdAt: '3 hours ago'
      }
    ]
  },
  {
    id: 'thread_3',
    title: 'Why does my conditional check set my character score to 0 instead of checking it?',
    content: `I'm writing a mini game engine. I want to trigger a Game Over screen when my hero's health is zero. But instead of checking it, Python literally overwrites the health variable, sets it to zero, and triggers the Game Over every single time! What's going on here?`,
    codeContext: `hero_health = 100\n\n# ... game logic ...\nif hero_health = 0:\n    print("Game Over!")`,
    author: 'pixel_slayer',
    role: 'Apprentice',
    avatarColor: 'from-purple-400 to-pink-600',
    xpBadge: '410 XP',
    category: 'logic',
    votes: 6,
    userVoted: false,
    status: 'open',
    createdAt: '1 day ago',
    scenario: 'gaming',
    replies: [
      {
        id: 'reply_3_1',
        author: 'finance_ninja',
        role: 'Venture Coder',
        avatarColor: 'from-emerald-400 to-blue-600',
        xpBadge: '890 XP',
        content: `This is the single most common logical bug in all of computer programming!

In Python (and most other languages):
- A single equals sign \`=\` is used for **Assignment** (placing a value inside a variable box).
- A double equals sign \`==\` is used for **Comparison** (asking if two things are equal).

Your code is attempting to assign \`0\` to \`hero_health\` within the conditional statement. Fix this by using \`==\`:`,
        code: `if hero_health == 0:\n    print("Game Over!")`,
        votes: 9,
        userVoted: false,
        isAccepted: false,
        createdAt: '22 hours ago'
      }
    ]
  },
  {
    id: 'thread_4',
    title: 'Rich Dad Poor Dad: Storing assets and liabilities inside lists',
    content: `How can I organize Robert's cash flow variables cleanly? Right now I have 20 individual string variables for asset_1, asset_2, liability_1, liability_2... It's becoming unmanageable. Is a List or a Dictionary better for appending assets?`,
    codeContext: `asset_1 = "Rental Condo"\nasset_2 = "Tech Stock Dividends"\nliability_1 = "Car Payment"\nliability_2 = "Credit Card Debt"`,
    author: 'cash_flow_kid',
    role: 'Initiate',
    avatarColor: 'from-lime-400 to-green-600',
    xpBadge: '90 XP',
    category: 'projects',
    votes: 4,
    userVoted: false,
    status: 'open',
    createdAt: '2 days ago',
    scenario: 'business',
    replies: []
  }
];

export default function PeerHub({ progress, onUpdateProgress, selectedScenario }: PeerHubProps) {
  const [threads, setThreads] = useState<DoubtThread[]>(() => {
    const saved = localStorage.getItem('pyverse_peer_threads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_THREADS;
      }
    }
    return INITIAL_THREADS;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThread, setSelectedThread] = useState<DoubtThread | null>(null);
  
  // Ask Doubt Form State
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCategory, setNewCategory] = useState<'syntax' | 'logic' | 'analogy' | 'projects' | 'general'>('general');

  // Submit Answer Form State
  const [replyContent, setReplyContent] = useState('');
  const [replyCode, setReplyCode] = useState('');

  // Notifications
  const [notification, setNotification] = useState<{message: string, xp?: number} | null>(null);

  // Simulated peer typing state
  const [isPeerResponding, setIsPeerResponding] = useState(false);

  // Sync threads to local storage
  useEffect(() => {
    localStorage.setItem('pyverse_peer_threads', JSON.stringify(threads));
  }, [threads]);

  const triggerNotification = (message: string, xpAmount?: number) => {
    setNotification({ message, xp: xpAmount });
    if (xpAmount) {
      onUpdateProgress(prev => ({
        ...prev,
        xp: prev.xp + xpAmount
      }));
    }
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Upvote Question
  const handleUpvoteQuestion = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const diff = t.userVoted ? -1 : 1;
        return { ...t, votes: t.votes + diff, userVoted: !t.userVoted };
      }
      return t;
    }));
    
    const thread = threads.find(t => t.id === threadId);
    if (thread && !thread.userVoted) {
      triggerNotification(`You upvoted "${thread.title.substring(0, 30)}..."`, 2);
    }
  };

  // Upvote Reply
  const handleUpvoteReply = (threadId: string, replyId: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const updatedReplies = t.replies.map(r => {
          if (r.id === replyId) {
            const diff = r.userVoted ? -1 : 1;
            return { ...r, votes: r.votes + diff, userVoted: !r.userVoted };
          }
          return r;
        });
        return { ...t, replies: updatedReplies };
      }
      return t;
    }));

    // Sync selected thread if viewing
    if (selectedThread && selectedThread.id === threadId) {
      setSelectedThread(prev => {
        if (!prev) return null;
        const updatedReplies = prev.replies.map(r => {
          if (r.id === replyId) {
            const diff = r.userVoted ? -1 : 1;
            return { ...r, votes: r.votes + diff, userVoted: !r.userVoted };
          }
          return r;
        });
        return { ...prev, replies: updatedReplies };
      });
    }
  };

  // Accept Solution
  const handleAcceptSolution = (threadId: string, replyId: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const updatedReplies = t.replies.map(r => ({
          ...r,
          isAccepted: r.id === replyId
        }));
        return { ...t, status: 'resolved', replies: updatedReplies };
      }
      return t;
    }));

    // Update selected thread detail view
    if (selectedThread && selectedThread.id === threadId) {
      setSelectedThread(prev => {
        if (!prev) return null;
        const updatedReplies = prev.replies.map(r => ({
          ...r,
          isAccepted: r.id === replyId
        }));
        return { ...prev, status: 'resolved', replies: updatedReplies };
      });
    }

    triggerNotification("Spell Solved! Doubt cleared from peer dialogue.", 30);
  };

  // Ask Question / Post Doubt
  const handleAskDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newThread: DoubtThread = {
      id: `thread_${Date.now()}`,
      title: newTitle,
      content: newContent,
      codeContext: newCode.trim() ? newCode : undefined,
      author: 'You_Apprentice',
      role: 'Apprentice',
      avatarColor: 'from-indigo-600 to-purple-600',
      xpBadge: `${progress.xp} XP`,
      category: newCategory,
      votes: 1,
      userVoted: true,
      status: 'open',
      createdAt: 'Just now',
      scenario: selectedScenario,
      replies: []
    };

    setThreads(prev => [newThread, ...prev]);
    setShowAskModal(false);
    setNewTitle('');
    setNewContent('');
    setNewCode('');
    
    triggerNotification("Doubt cast to PyVerse! Apprentice XP Awarded", 10);

    // Simulate smart peer response based on content keywords
    simulatePeerResponse(newThread.id, newTitle + " " + newContent);
  };

  // Submit Answer to Doubt
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyContent.trim()) return;

    const newReply: Reply = {
      id: `reply_${Date.now()}`,
      author: 'You_Apprentice',
      role: 'Apprentice',
      avatarColor: 'from-indigo-600 to-purple-600',
      xpBadge: `${progress.xp} XP`,
      content: replyContent,
      code: replyCode.trim() ? replyCode : undefined,
      votes: 1,
      userVoted: true,
      isAccepted: false,
      createdAt: 'Just now'
    };

    setThreads(prev => prev.map(t => {
      if (t.id === selectedThread.id) {
        return { ...t, replies: [...t.replies, newReply] };
      }
      return t;
    }));

    setSelectedThread(prev => {
      if (!prev) return null;
      return { ...prev, replies: [...prev.replies, newReply] };
    });

    setReplyContent('');
    setReplyCode('');

    triggerNotification("Solution shared! Helpful answer reward awarded.", 20);
  };

  // Peer response generator
  const simulatePeerResponse = (threadId: string, textContext: string) => {
    setIsPeerResponding(true);
    
    const lowercaseText = textContext.toLowerCase();
    let replyText = "";
    let codeSnippet = "";
    let peerName = "spell_caster_99";
    let peerBadge = "Wizard Scholar";
    let peerColor = "from-purple-500 to-indigo-700";

    if (lowercaseText.includes('loop') || lowercaseText.includes('for') || lowercaseText.includes('while')) {
      peerName = "loop_master_cyber";
      peerBadge = "Grand Caster";
      peerColor = "from-teal-400 to-emerald-600";
      replyText = `Hey! Loops can definitely get tricky when you're nesting them or managing dynamic game conditions. 

Remember in Python, \`range(start, end)\` is exclusive of the end! If you write \`range(1, 5)\`, it will iterate exactly 4 times (1, 2, 3, 4). If you want 5 items, use \`range(5)\` which does 0, 1, 2, 3, 4.

Also, make sure you don't accidentally write an infinite loop by forgetting to increment your variable!`;
      codeSnippet = `# Correct range usage:\nfor count in range(1, 6):\n    print("Casting fire blast #" + str(count))`;
    } else if (lowercaseText.includes('variable') || lowercaseText.includes('assign') || lowercaseText.includes('type')) {
      peerName = "python_pioneer";
      peerBadge = "Byte Master";
      peerColor = "from-orange-400 to-amber-600";
      replyText = `Welcome to the Apprentice Guild! In Python, variables are fully dynamic. You don't have to announce their types (like int, string) ahead of time like in Java or C++. 

One major thing: variable names are highly case-sensitive! \`playerScore\` and \`playerscore\` are completely separate containers.

Ensure you do not put quotes around your variable names when printing, otherwise Python treats them as plain strings!`;
      codeSnippet = `player_name = "Alex"\n# printing variables:\nprint("Welcome back, " + player_name)`;
    } else if (lowercaseText.includes('function') || lowercaseText.includes('def') || lowercaseText.includes('return')) {
      peerName = "algo_wizard";
      peerBadge = "Senior Enchanter";
      peerColor = "from-pink-500 to-rose-600";
      replyText = `Ah, function spells! Functions are just reusable recipes. You define them once using the \`def\` keyword, and can run them thousands of times.

Always make sure you use a \`return\` statement if you want to save the output of the function into a variable. If you write a function with only \`print()\` inside, it actually yields \`None\`!`;
      codeSnippet = `def forge_gold_bar(iron_ore, fuel):\n    if iron_ore >= 1 and fuel >= 1:\n        return "Gold Bar"\n    return "Slag"\n\nitem_crafted = forge_gold_bar(2, 5)\nprint(item_crafted) # Output: Gold Bar`;
    } else if (lowercaseText.includes('dict') || lowercaseText.includes('list') || lowercaseText.includes('array')) {
      peerName = "data_alchemist";
      peerBadge = "Archivist Mage";
      peerColor = "from-blue-500 to-cyan-600";
      replyText = `For storing lists or dicts, keep in mind:
- **Lists** \`[]\` are ordered stacks of ingredients (accessed by index numbers starting at 0).
- **Dictionaries** \`{}\` are labeled potion racks, where each slot has an explicit, unique Name key (accessed by strings).

To add elements, we use \`.append()\` for lists, and assign directly \`my_dict["new_key"] = value\` for dictionaries. Let me know if this helps!`;
      codeSnippet = `inventory = ["Wooden Shield", "Iron Sword"]\ninventory.append("Health Potion")\n\nstats = {"health": 100, "defense": 15}\nstats["level"] = 2`;
    } else {
      peerName = "apprentice_mentor_alex";
      peerBadge = "Guild Mentor";
      peerColor = "from-indigo-500 to-purple-600";
      replyText = `Greetings! That is a very interesting Python dilemma. 

Double check three vital points:
1. Are your colon colons \`:\` placed at the end of loop and if headers?
2. Is your indentation level strictly consistent (always 4 spaces or tab)?
3. Are there any spelling typos in variable or function names?

What error code or stdout results are you receiving in your terminal? Let me know and let's compile it together!`;
    }

    setTimeout(() => {
      setIsPeerResponding(false);
      
      const simulatedReply: Reply = {
        id: `reply_simulated_${Date.now()}`,
        author: peerName,
        role: peerBadge,
        avatarColor: peerColor,
        xpBadge: "Guild Certified",
        content: replyText,
        code: codeSnippet || undefined,
        votes: 2,
        userVoted: false,
        isAccepted: false,
        createdAt: 'Just now'
      };

      setThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          return { ...t, replies: [...t.replies, simulatedReply] };
        }
        return t;
      }));

      // Update selected thread detail if open
      setSelectedThread(prev => {
        if (prev && prev.id === threadId) {
          return { ...prev, replies: [...prev.replies, simulatedReply] };
        }
        return prev;
      });

      triggerNotification(`New reply on your doubt from ${peerName}!`, 0);
    }, 2500);
  };

  // Filters and searches
  const filteredThreads = threads.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate counts for categories
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return threads.length;
    return threads.filter(t => t.category === catId).length;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6" id="peer-hub-view">
      
      {/* Dynamic Pop-up Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 border border-indigo-500/30 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 max-w-sm backdrop-blur-xl"
          >
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-indigo-50 shadow-md">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">{notification.message}</p>
              {notification.xp && (
                <p className="text-[10px] text-amber-400 font-extrabold tracking-widest mt-0.5">+{notification.xp} XP BONUS EARNED</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout switch: Thread List vs Thread Detail */}
      {!selectedThread ? (
        <>
          {/* Header Dashboard Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-900/80 shadow-indigo-950/20">
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  PyVerse Dialogue Guild
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-400 bg-clip-text text-transparent">
                  Apprentice Q&A Hub
                </h1>
                <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed font-medium">
                  Discuss coding strategies, clear complex syntax doubts, and collaborate with fellow Apprentices on custom Python spells.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="bg-slate-950/60 backdrop-blur-md border border-slate-900 p-4 rounded-2xl text-center min-w-[100px] shadow-lg">
                  <Users className="h-5 w-5 text-indigo-400 mx-auto mb-1.5" />
                  <div className="text-2xl font-black font-mono tracking-tight">42</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">ONLINE NOW</div>
                </div>
                <div className="bg-slate-950/60 backdrop-blur-md border border-slate-900 p-4 rounded-2xl text-center min-w-[100px] shadow-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
                  <div className="text-2xl font-black font-mono tracking-tight">
                    {threads.filter(t => t.status === 'resolved').length}
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">SOLVED DOUBTS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search, Action, Filter Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-4">
                <button 
                  onClick={() => setShowAskModal(true)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-3 px-4 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <PlusCircle className="h-4.5 w-4.5" />
                  <span>Ask a Doubt</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800/50 pt-3">
                  <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">
                    Forum Categories
                  </h3>
                  <div className="space-y-1">
                    {CATEGORIES.map(cat => {
                      const active = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer text-xs font-bold ${
                            active
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-650'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                            active 
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                              : 'bg-slate-100 dark:bg-slate-950 text-slate-500'
                          }`}>
                            {getCategoryCount(cat.id)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Guild Conduct Rules */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800/80 relative overflow-hidden shadow-md">
                <h4 className="text-[10px] font-black text-indigo-400 flex items-center gap-1.5 uppercase tracking-widest mb-2.5">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>Dialogue Guild Perks</span>
                </h4>
                <ul className="text-[11px] text-slate-300 leading-relaxed font-semibold space-y-2">
                  <li className="flex gap-2">
                    <span className="text-indigo-400">✦</span>
                    <span>Cast a Doubt: **+10 XP** to initiate spell tracking.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400">✦</span>
                    <span>Submit Solutions: **+20 XP** upon contribution.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400">✦</span>
                    <span>Accepted Solves: **+30 XP** when clearing doubts.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Threads List Container */}
            <div className="lg:col-span-9 space-y-5">
              {/* Search Bar Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search active doubts (e.g., indentation errors, lists)..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-12 py-3.5 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold shadow-sm text-slate-800 dark:text-slate-100"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Doubt Cards */}
              <div className="space-y-4">
                {filteredThreads.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 max-w-lg mx-auto shadow-sm">
                    <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No doubts found matching criteria</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      Be the first to cast a new doubt and notify fellow Apprentices in the Dialogue Guild!
                    </p>
                    <button 
                      onClick={() => setShowAskModal(true)}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all"
                    >
                      Ask Question &rarr;
                    </button>
                  </div>
                ) : (
                  filteredThreads.map(thread => (
                    <div
                      key={thread.id}
                      onClick={() => setSelectedThread(thread)}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.01]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          {/* Top Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                              thread.status === 'resolved' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' 
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                            }`}>
                              {thread.status === 'resolved' ? 'Solved' : 'Open Doubt'}
                            </span>
                            <span className="text-[8px] font-extrabold uppercase tracking-widest bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 px-2 py-0.5 rounded-md capitalize">
                              {thread.category}
                            </span>
                            {thread.scenario && (
                              <span className="text-[8px] font-extrabold uppercase tracking-widest bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-md capitalize">
                                Theme: {thread.scenario}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold ml-1">
                              {thread.createdAt}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm md:text-base font-black text-slate-850 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                            {thread.title}
                          </h3>

                          {/* Summary Context */}
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {thread.content}
                          </p>
                        </div>

                        {/* Votes Interaction */}
                        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-2.5 min-w-[55px]">
                          <button
                            onClick={(e) => handleUpvoteQuestion(thread.id, e)}
                            className={`p-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all ${
                              thread.userVoted ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 hover:text-indigo-500'
                            }`}
                          >
                            <ThumbsUp className="h-4.5 w-4.5" />
                          </button>
                          <span className="text-xs font-black font-mono mt-1 text-slate-800 dark:text-slate-200">
                            {thread.votes}
                          </span>
                        </div>
                      </div>

                      {/* Footer Info / Author details */}
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 mt-4 pt-3 text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${thread.avatarColor} flex items-center justify-center text-[10px] text-white font-extrabold shadow-sm`}>
                            {thread.author.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-700 dark:text-slate-300">@{thread.author}</span>
                            <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-black tracking-wider uppercase ml-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/40 dark:border-indigo-900/40 px-1.5 py-0.5 rounded">
                              {thread.xpBadge}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{thread.replies.length} Replies</span>
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </>
      ) : (
        /* Detailed Thread View */
        <div className="space-y-6">
          
          {/* Back button header */}
          <button
            onClick={() => setSelectedThread(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Discussions</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Thread Master doubt context card */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${selectedThread.avatarColor} flex items-center justify-center text-xs text-white font-black shadow-sm`}>
                      {selectedThread.author.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                        @{selectedThread.author} <span className="text-slate-400 font-bold ml-1">({selectedThread.role})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">Posted {selectedThread.createdAt}</div>
                    </div>
                  </div>

                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md ${
                    selectedThread.status === 'resolved' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                  }`}>
                    {selectedThread.status === 'resolved' ? 'Solved' : 'Open Doubt'}
                  </span>
                </div>

                {/* Question Details */}
                <div className="space-y-4 border-b border-slate-100 dark:border-slate-800/50 pb-5">
                  <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-snug">
                    {selectedThread.title}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-semibold whitespace-pre-wrap leading-relaxed">
                    {selectedThread.content}
                  </p>

                  {/* Optional code context */}
                  {selectedThread.codeContext && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-850 shadow-inner bg-slate-950">
                      <div className="bg-slate-900 px-4 py-2 border-b border-slate-950 flex justify-between items-center text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
                        <span>Accompanying Code Specimen</span>
                        <Code className="h-3.5 w-3.5" />
                      </div>
                      <pre className="p-4 overflow-x-auto text-[11px] text-slate-300 font-mono leading-5 leading-relaxed select-text">
                        <code>{selectedThread.codeContext}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Actions / Votes */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-indigo-400 font-black tracking-widest uppercase">
                    DIALOGUE GUILD ID: {selectedThread.id.toUpperCase()}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold">{selectedThread.votes} apprentices found this helpful</span>
                    <button
                      onClick={(e) => handleUpvoteQuestion(selectedThread.id, e)}
                      className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
                        selectedThread.userVoted 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-300' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:text-indigo-500 text-slate-500'
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{selectedThread.userVoted ? 'Upvoted!' : 'Upvote'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies/Answers Showcase */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                  Solutions & Replies ({selectedThread.replies.length})
                </h3>

                {selectedThread.replies.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 text-center shadow-sm">
                    <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">No apprentice solutions submitted yet.</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Be the first to help clear this doubt and claim a **+20 XP bonus**!</p>
                  </div>
                ) : (
                  selectedThread.replies.map(reply => (
                    <div
                      key={reply.id}
                      className={`border rounded-3xl p-5 md:p-6 shadow-sm transition-all relative overflow-hidden ${
                        reply.isAccepted 
                          ? 'bg-emerald-50/20 border-emerald-500 dark:bg-emerald-950/10' 
                          : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      {reply.isAccepted && (
                        <div className="absolute right-0 top-0 bg-emerald-500 text-white text-[8px] font-black tracking-widest px-3.5 py-1 uppercase rounded-bl-xl shadow-md flex items-center gap-1 z-10">
                          <Check className="h-3 w-3" />
                          <span>Doubt Cleared</span>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Author */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${reply.avatarColor} flex items-center justify-center text-[10px] text-white font-black shadow-sm`}>
                              {reply.author.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-extrabold text-xs text-slate-850 dark:text-slate-200">
                                @{reply.author} <span className="text-slate-400 font-bold ml-1">({reply.role})</span>
                              </div>
                              <div className="text-[9px] text-slate-400 font-bold">{reply.createdAt}</div>
                            </div>
                          </div>

                          <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-black tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">
                            {reply.xpBadge}
                          </span>
                        </div>

                        {/* Reply Body */}
                        <div className="space-y-3">
                          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-semibold whitespace-pre-wrap leading-relaxed">
                            {reply.content}
                          </p>

                          {/* Code */}
                          {reply.code && (
                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-850 shadow-inner bg-slate-950">
                              <pre className="p-4 overflow-x-auto text-[11px] text-slate-300 font-mono leading-relaxed select-text">
                                <code>{reply.code}</code>
                              </pre>
                            </div>
                          )}
                        </div>

                        {/* Footer Interactions */}
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3 text-xs">
                          
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-100 dark:border-slate-900">
                            <button
                              onClick={() => handleUpvoteReply(selectedThread.id, reply.id)}
                              className={`p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all ${
                                reply.userVoted ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'
                              }`}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                              {reply.votes}
                            </span>
                          </div>

                          {/* "Accept Solution" controls for Question owner */}
                          {selectedThread.author === 'You_Apprentice' && !reply.isAccepted && (
                            <button
                              onClick={() => handleAcceptSolution(selectedThread.id, reply.id)}
                              className="bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl py-1.5 px-3.5 font-bold text-[10px] uppercase tracking-wider transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/10 cursor-pointer flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              <span>Accept Solution</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Reply Box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                  Your Apprentice Solution
                </h3>
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mb-1.5">
                      Answer Description
                    </label>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      required
                      placeholder="Write your explanation or helpful analogy clearly to clear peer doubts..."
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 dark:text-slate-100 font-semibold leading-relaxed"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">
                        Optional Code Snippet (Python)
                      </label>
                      <span className="text-[9px] text-slate-400 font-bold italic">Optional</span>
                    </div>
                    <textarea
                      value={replyCode}
                      onChange={(e) => setReplyCode(e.target.value)}
                      placeholder="# Write python code here..."
                      rows={3}
                      className="w-full bg-slate-950 text-slate-300 font-mono p-4 rounded-2xl text-[11px] leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-550 text-white rounded-2xl py-2.5 px-6 font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-500/10"
                  >
                    Submit Reply (+20 XP)
                  </button>
                </form>
              </div>

            </div>

            {/* Right details sidebar info */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800/80 space-y-4">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">
                  Thread Insights
                </h3>
                
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className={`font-black uppercase tracking-wider text-[10px] ${selectedThread.status === 'resolved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {selectedThread.status === 'resolved' ? 'SOLVED' : 'OPEN DOUBT'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Solvers</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
                      {selectedThread.replies.length} peers
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scenario Focus</span>
                    <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-[10px] font-black">
                      {selectedThread.scenario || 'gaming'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category</span>
                    <span className="text-slate-800 dark:text-slate-200 capitalize">
                      {selectedThread.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic typing notifier */}
              {isPeerResponding && (
                <div className="bg-indigo-950/40 border border-indigo-900/40 text-slate-300 rounded-3xl p-5 shadow-md flex items-center gap-3.5 animate-pulse">
                  <div className="flex space-x-1 flex-shrink-0">
                    <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" />
                    <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                  <div className="text-[11px] font-bold">
                    Another Apprentice is compiling a solution block...
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* Ask Doubt Overlay Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/85 pb-4">
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-indigo-500" />
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Post Your Python Doubt
                </h2>
              </div>
              <button 
                onClick={() => setShowAskModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAskDoubt} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mb-1.5">
                  Doubt Title / Core Issue
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My indentation loops are throwing an Error!"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-3 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mb-1.5">
                    Select Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3.5 py-3 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100 font-bold"
                  >
                    <option value="syntax">Syntax Errors</option>
                    <option value="logic">Logical Bugs</option>
                    <option value="analogy">Concept Analogies</option>
                    <option value="projects">Project Support</option>
                    <option value="general">General / Career</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mb-1.5">
                    Active Scenario
                  </label>
                  <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3.5 py-3 rounded-2xl text-xs dark:text-slate-300 font-black capitalize">
                    {selectedScenario} Mode
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black mb-1.5">
                  Doubt Description
                </label>
                <textarea
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Explain exactly what you are trying to do, and where the compilation of variables or control structures breaks..."
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 dark:text-slate-100 font-semibold leading-relaxed"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">
                    Optional Python Code Block
                  </label>
                  <span className="text-[9px] text-slate-400 font-bold italic">Optional</span>
                </div>
                <textarea
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="# Paste your problematic code here..."
                  rows={3}
                  className="w-full bg-slate-950 text-slate-300 font-mono p-4 rounded-2xl text-[11px] leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex gap-3 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 rounded-xl font-bold border border-slate-150 dark:border-slate-800/60 transition-all text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl py-2.5 px-5 font-black uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  Cast Doubt (+10 XP)
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
