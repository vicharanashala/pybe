import { useState, useRef, useEffect } from "react";
import { Send, Loader2, MessageCircleQuestion, Sparkles, Bot, User } from "lucide-react";
import type { Lesson } from "../../learning/lessons/types";

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || "http://localhost:3001/api/ask";
const CLIENT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface ChatMessage {
  role: "student" | "krishna";
  text: string;
}

interface LessonChatbotProps {
  lesson: Lesson;
}

export default function LessonChatbot({ lesson }: LessonChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    `How does "${lesson.storyTitle}" relate to ${lesson.title}?`,
    `Give a real-world example of handling ${lesson.title}`,
    `What happens if I don't catch ${lesson.title}?`
  ];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function fetchDirectFromGemini(question: string): Promise<string> {
    const systemPrompt = `You are Krishna, acting as a patient guide inside a Python learning app called CodeGita.
You are currently helping a student with the lesson "${lesson.title}", whose story is "${lesson.storyTitle}".
Lesson explanation: "${lesson.conceptExplainer}"

Rules:
- Answer only questions related to this specific exception, the story it's mapped to, or real-world code.
- Keep answers concise: 2-4 sentences in a calm, guiding, non-robotic tone.`;

    const models = ["gemini-1.5-flash", "gemini-2.0-flash"];
    let lastErr = "";

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${CLIENT_GEMINI_KEY}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: question }] }],
            generationConfig: { maxOutputTokens: 300 }
          }),
        });

        if (res.ok) {
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I hear your question, seeker, but the answer remains unseen.";
        } else {
          lastErr = await res.text();
        }
      } catch (err: any) {
        lastErr = err?.message || String(err);
      }
    }
    throw new Error(lastErr || "Direct Gemini API call failed");
  }

  async function handleSend(promptText?: string) {
    const question = (promptText || input).trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "student", text: question }]);
    if (!promptText) setInput("");
    setLoading(true);
    setError(null);

    try {
      let answerText = "";

      if (CLIENT_GEMINI_KEY) {
        answerText = await fetchDirectFromGemini(question);
      } else {
        const res = await fetch(CHAT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            lessonTitle: lesson.title,
            storyTitle: lesson.storyTitle,
            conceptExplainer: lesson.conceptExplainer,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server returned status ${res.status}`);
        }
        const data = await res.json();
        answerText = data.answer;
      }

      setMessages((prev) => [...prev, { role: "krishna", text: answerText }]);
    } catch (err: any) {
      console.warn("Gemini call warning:", err);

      // Fallback friendly Krishna wisdom response
      const fallbackAnswer = `Reflect upon how ${lesson.title} represents an unhandled condition in your execution. When a problem arises mid-run, Python allows you to handle it with grace using try/except — just as Arjuna found steady guidance amidst doubt.`;
      
      setMessages((prev) => [...prev, { role: "krishna", text: fallbackAnswer }]);
      setError("Note: AI service offline or missing key. Displaying guide guidance.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card-strong rounded-3xl overflow-hidden border border-gold/30 shadow-2xl transition-all">
      <div className="flex items-center justify-between px-5 py-3.5 bg-panel/60 border-b border-line/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-ink text-sm font-semibold font-display">Ask Krishna about {lesson.title}</p>
            <p className="text-muted text-[11px]">Personalized Doubt Resolution</p>
          </div>
        </div>
        <span className="text-[10px] bg-gold/10 border border-gold/30 text-gold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
          AI Active
        </span>
      </div>

      <div ref={scrollRef} className="max-h-80 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
        {messages.length === 0 && (
          <div className="text-center py-4 px-2">
            <MessageCircleQuestion size={28} className="mx-auto text-gold/60 mb-2" />
            <p className="text-mutedSoft text-sm italic mb-4 max-w-md mx-auto leading-relaxed">
              Have a doubt about {lesson.title} or how the story maps to the code? Ask below or pick a prompt:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-panel/80 hover:bg-gold/15 border border-gold/25 hover:border-gold/60 text-mutedSoft hover:text-gold rounded-full px-3 py-1.5 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 text-sm leading-relaxed max-w-[90%] ${
              m.role === "student" ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                m.role === "student"
                  ? "bg-vermilion/20 text-vermilion border border-vermilion/40"
                  : "bg-gold/20 text-gold border border-gold/40"
              }`}
            >
              {m.role === "student" ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div
              className={`rounded-2xl px-4 py-3 border ${
                m.role === "student"
                  ? "bg-gold/15 border-gold/30 text-ink rounded-tr-none"
                  : "bg-panel/90 border-line text-mutedSoft rounded-tl-none shadow-md"
              }`}
            >
              {m.role === "krishna" && (
                <p className="text-gold text-[11px] font-semibold uppercase tracking-wider mb-1 font-display">
                  Krishna
                </p>
              )}
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="self-start flex items-center gap-2 text-gold text-xs bg-panel/60 border border-gold/20 px-3 py-2 rounded-xl animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            <span>Krishna is reflecting…</span>
          </div>
        )}

        {error && (
          <div className="text-gold/90 text-xs bg-gold/10 border border-gold/20 rounded-xl px-3 py-2">
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 bg-panel/40 border-t border-line/60">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Ask a question about ${lesson.title}…`}
          className="flex-1 bg-transparent text-ink text-sm outline-none placeholder:text-muted/70 px-2"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-gold text-bg p-2 rounded-xl hover:opacity-90 disabled:opacity-30 transition-all shadow-md flex items-center justify-center shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}