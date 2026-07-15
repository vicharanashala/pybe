// src/components/chat/TopicChatBot.jsx
// Floating chat widget — topic-locked, RAG-based, no LLM required.
// Opens as a small popup at the bottom-right. Knowledge is scoped to
// whichever concept the user is currently studying.

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react';
import { search, SUPPORTED_SLUGS } from './knowledgeBase';

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${isBot ? 'bg-brand-500' : 'bg-gray-400 dark:bg-gray-600'}`}>
        {isBot ? <Bot size={14} /> : <User size={14} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isBot
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-sm'
            : 'bg-brand-500 text-white rounded-tr-sm'
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function Typing() {
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-3.5 py-3 flex gap-1 items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
// Props:
//   concept — the current concept object ({ slug, title, ... })
//             Pass null when not on a concept page — chat shows a prompt
//             telling the user to navigate to a topic first.
export default function TopicChatBot({ concept }) {
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState('');
  const [messages, setMessages] = useState([]);
  const [typing,  setTyping]  = useState(false);
  const [lastSlug, setLastSlug] = useState(null);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  const slug  = concept?.slug  ?? null;
  const title = concept?.title ?? null;
  const supported = slug ? SUPPORTED_SLUGS.includes(slug) : false;

  // Reset conversation when topic changes
  useEffect(() => {
    if (slug === lastSlug) return;
    setLastSlug(slug);
    if (!slug || !open) return;
    setMessages([
      {
        role: 'bot',
        text: `You're now studying **${title}**. Ask me anything about this topic — I'll only answer questions related to ${title} while you're here.`,
      },
    ]);
  }, [slug, open]);

  // Welcome message when chat opens for the first time on a topic
  useEffect(() => {
    if (!open) return;
    if (messages.length === 0) {
      if (slug && supported) {
        setMessages([
          {
            role: 'bot',
            text: `Hi! I'm your ${title} assistant.\n\nAsk me anything about ${title} — what it is, how it works, examples, common mistakes, or anything you're confused about.\n\nI'll only answer questions related to ${title} while you're on this topic.`,
          },
        ]);
      } else if (slug && !supported) {
        setMessages([
          {
            role: 'bot',
            text: `Hi! I'm learning about ${title} too — my detailed knowledge for this topic is coming soon. For now, try asking about Variables, Lists, Dictionaries, Loops, Functions, or any of the core topics.`,
          },
        ]);
      } else {
        setMessages([
          {
            role: 'bot',
            text: "Hi! Open a topic from the dashboard and I'll be your focused assistant for that specific topic.\n\nI only answer questions related to the topic you're currently studying.",
          },
        ]);
      }
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;

    const userMsg = { role: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate a short delay so it feels natural
    setTimeout(() => {
      let answer;

      if (!slug) {
        answer = "Please open a topic from the dashboard first. I'll focus my answers on whatever topic you're currently studying.";
      } else if (!supported) {
        answer = `I don't have detailed answers for ${title} yet. My knowledge covers Variables, Input & Output, Operators, Conditions, Loops, Functions, Lists, Tuples, Dictionaries, Sets, String Handling, and File Handling.`;
      } else {
        answer = search(slug, q);
        if (!answer) {
          answer = `That's a great question about ${title}! I don't have a specific answer for that exact question yet. Try rephrasing, or ask about: what ${title} are, how to create them, common operations, or typical errors.`;
        }
      }

      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: answer }]);
    }, 500);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Suggested questions ──
  const SUGGESTIONS = {
    variables:         ['What is a variable?', 'How do I name a variable?', 'Can I change a variable later?'],
    'input-output':    ['How does input() work?', 'What is an f-string?', 'How do I print two things?'],
    operators:         ['What does // do?', 'What is the % operator?', 'What does == mean?'],
    conditions:        ['What is elif?', 'Why do I need a colon?', 'What is indentation?'],
    loops:             ['Difference between for and while?', 'What is range()?', 'How do I use break?'],
    functions:         ['What is a return statement?', 'What is a parameter?', 'What is scope?'],
    lists:             ['How do I add to a list?', 'What does len() do?', 'How do I loop a list?'],
    tuples:            ['How is a tuple different from a list?', 'What is unpacking?', 'Can I change a tuple?'],
    dictionaries:      ['How do I access a value?', 'How do I add a new key?', 'What is .get()?'],
    sets:              ['What makes sets special?', 'What is intersection?', 'What is union?'],
    'string-handling': ['How do I convert to uppercase?', 'What does split() do?', 'How do I check if a word is in a string?'],
    'file-handling':   ['What is the difference between r and w mode?', 'Why use "with"?', 'How do I read each line?'],
  };

  const suggestions = slug ? (SUGGESTIONS[slug] ?? []) : [];

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Topic Assistant"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${
          open
            ? 'bg-gray-700 dark:bg-gray-800 rotate-0 scale-95'
            : 'bg-brand-500 hover:bg-brand-600 hover:scale-110'
        }`}
      >
        {open
          ? <ChevronDown size={22} className="text-white" />
          : (
            <div className="relative">
              <MessageCircle size={24} className="text-white" />
              {slug && supported && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              )}
            </div>
          )
        }
      </button>

      {/* ── Chat window ─────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[520px] flex flex-col rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden animate-slide-up">

          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-brand-500 text-white shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={17} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Topic Assistant</p>
              <p className="text-[11px] text-brand-100 truncate">
                {slug && supported
                  ? `Focused on: ${title}`
                  : slug
                    ? `${title} — limited coverage`
                    : 'Open a topic to get started'}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
            {typing && <Typing />}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — shown when no conversation yet */}
          {messages.length <= 1 && suggestions.length > 0 && (
            <div className="px-4 pb-2 flex flex-col gap-1.5 shrink-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Try asking…</p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-left text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800 flex gap-2 shrink-0 bg-white dark:bg-gray-900">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={slug ? `Ask about ${title}…` : 'Open a topic first…'}
              disabled={!slug}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-400 disabled:opacity-50 leading-5"
              style={{ maxHeight: '80px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !slug}
              className="w-9 h-9 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 flex items-center justify-center text-white transition-colors shrink-0 self-end"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
