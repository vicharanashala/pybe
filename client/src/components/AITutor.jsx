import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { tutorChat, getTutorHistory } from '../api/client';

/**
 * Feature 4: AI Tutor Chat. Mounted once in App.jsx so it's available
 * throughout the platform (spec: "available throughout the platform"), and
 * reads `activeScenario` from App state so its replies are grounded in
 * whatever the learner currently has open.
 */
function AITutor({ activeScenario }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    getTutorHistory(activeScenario?._id).then((data) => setMessages(data.messages || [])).catch(() => {});
  }, [open, activeScenario?._id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  async function handleSend(event) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    setInput('');
    setMessages((current) => [...current, { role: 'user', content: question }]);
    setSending(true);
    try {
      const result = await tutorChat(question, activeScenario?._id);
      setMessages(result.messages);
    } catch (err) {
      setMessages((current) => [...current, { role: 'assistant', content: `Sorry, I ran into a problem: ${err.message}` }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="ai-tutor">
      {open ? (
        <div className="ai-tutor-panel">
          <div className="ai-tutor-header">
            <div className="ai-tutor-title"><Bot size={18} /> PyBe Mentor</div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close tutor chat"><X size={18} /></button>
          </div>

          {activeScenario && (
            <p className="ai-tutor-context">Talking about: <strong>{activeScenario.title}</strong></p>
          )}

          <div className="ai-tutor-messages" ref={scrollRef}>
            {messages.length === 0 && (
              <p className="ai-tutor-empty">
                Ask me to explain a concept, give a hint, or simplify something - I won't just hand you the answer.
              </p>
            )}
            {messages.map((message, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} className={`ai-tutor-message ${message.role}`}>
                {message.content}
              </div>
            ))}
            {sending && <div className="ai-tutor-message assistant typing">Thinking...</div>}
          </div>

          <form className="ai-tutor-input" onSubmit={handleSend}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Explain variables, give me a hint..."
            />
            <button type="submit" disabled={sending} aria-label="Send"><Send size={16} /></button>
          </form>
        </div>
      ) : (
        <button type="button" className="ai-tutor-fab" onClick={() => setOpen(true)}>
          <Bot size={22} />
        </button>
      )}
    </div>
  );
}

export default AITutor;
