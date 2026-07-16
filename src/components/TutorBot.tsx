import { useState, useRef, useEffect } from 'react';
import { HelpCircle, Send, Sparkles, User, Zap, Terminal, AlertTriangle, Play, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface TutorBotProps {
  scenario: string;
}

interface Message {
  id: string;
  role: 'user' | 'tutor';
  content: string;
}

export default function TutorBot({ scenario }: TutorBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'tutor',
      content: `Hello, Apprentice! I am your Pybe AI Guru tutor. 🎓 

Ask me any funny or serious coding questions! I specialize in translating complex concepts like loops, variables, and dicts into real-life stories and game analog models.

What python spell would you like to construct together today?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const rawMessage = textToSend || inputValue;
    if (!rawMessage.trim() || isLoading) return;

    if (!textToSend) {
      setInputValue('');
    }

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: rawMessage
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const activeHistory = messages.filter(m => m.id !== 'welcome');
      const response = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: rawMessage,
          chatHistory: activeHistory.map(m => ({ role: m.role === 'user' ? 'user' : 'model', content: m.content })),
          scenario: scenario
        })
      });

      if (!response.ok) {
        throw new Error('API server offline or invalid response.');
      }

      const data = await response.json();
      const tutorMsg: Message = {
        id: `tut_${Date.now()}`,
        role: 'tutor',
        content: data.reply
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      console.error(err);
      // Offline / Fallback local answers
      let localReply = "I am currently running in Offline Mode! Here is a simple explanation for your master query:\n\n";
      const q = rawMessage.toLowerCase();
      if (q.includes('loop')) {
        localReply += `**Loops (while/for):** Think of a loop like doing laps on an arcade car racer track or cast-repeating magic spells in Harry Potter. It automates repetitive actions!
\`\`\`python
for lap in range(3):
    print("Lap completed:", lap + 1)
\`\`\``;
      } else if (q.includes('variable') || q.includes('data type')) {
        localReply += `**Variables:** Think of variables as labeled bins inside your game bag. \`rich_dad_assets = 12000\` stores a number in a bin called rich_dad_assets!
\`\`\`python
rich_dad_assets = 12000
poor_dad_expenses = 4500
\`\`\``;
      } else if (q.includes('function')) {
        localReply += `**Functions:** Functions are reusable spell scrolls. Instead of rewriting complex code, declare it once under a name and invoke it!
\`\`\`python
def cast_magic():
    print("Spell cast successful!")

cast_magic() # invokes spell
\`\`\``;
      } else {
        localReply += `I couldn't locate pre-cached slides for that concept offline. 
        
Try typing queries about **loops**, **variables**, or **functions** to trigger beautiful interactive examples, or make sure your internet connection is active!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `tut_err_${Date.now()}`,
          role: 'tutor',
          content: localReply
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyShortcut = (shortcutText: string) => {
    handleSend(shortcutText);
  };

  const shortcuts = [
    { label: "Loops in Harry Potter 🪄", text: "Explain loops using Harry Potter wizardry" },
    { label: "Explain variables simply 👶", text: "Explain Python variables like I am 10 years old" },
    { label: "Functions in Minecraft ⛏️", text: "Explain Python functions using Minecraft crafting blocks" },
    { label: "What are dictionaries? 📖", text: "Explain Python Dictionaries using a country's cities list" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6" id="chat-view">
      <div className="bg-white rounded-3xl shadow-sm border border-sky-100 overflow-hidden flex flex-col h-[620px] transition-all">
        
        {/* Chat Header in Playful Blue */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50/50 px-6 py-4 flex items-center justify-between border-b border-sky-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 tracking-tight">AI Python Tutor Guru</h3>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                Real-world Analogies Engine
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-sky-100/60 px-3 py-1 rounded-full text-[9px] text-blue-700 font-black border border-sky-200 shadow-inner">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="tracking-widest">ONLINE</span>
          </div>
        </div>

        {/* Messages list with light theme backgrounds */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50/50">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`h-8.5 w-8.5 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs shadow-sm border ${
                  isUser 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-white text-slate-800 border-sky-100'
                }`}>
                  {isUser ? <User className="h-4 w-4" /> : <Terminal className="h-4 w-4 text-blue-600" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed font-semibold shadow-sm border ${
                  isUser 
                    ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                    : 'bg-white text-slate-800 border-sky-50 rounded-tl-none whitespace-pre-wrap'
                }`}>
                  {m.content}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="h-8.5 w-8.5 rounded-xl bg-white border border-sky-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Terminal className="h-4 w-4 text-blue-600" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-sky-50 rounded-tl-none flex items-center gap-3 shadow-sm">
                <div className="flex space-x-1">
                  <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" />
                  <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
                <span className="text-[11px] text-slate-400 font-extrabold italic">AI Guru is compiling humorous analogies...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Shortcuts / Prompt Builders (styled cleanly) */}
        <div className="px-5 py-3 bg-slate-50 border-t border-sky-100 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {shortcuts.map((shortcut, idx) => (
            <button
              key={idx}
              onClick={() => applyShortcut(shortcut.text)}
              className="px-3.5 py-2 bg-white hover:bg-sky-50 border border-sky-100 text-[10px] font-black text-slate-600 rounded-full transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex-shrink-0 shadow-sm"
            >
              {shortcut.label}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-sky-100 flex gap-2.5 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your coding question here (e.g., explain loops with Harry Potter)..."
            className="flex-1 bg-slate-50 border border-sky-100 px-4 py-3 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800 font-semibold"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
