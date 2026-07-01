import { Compass, Sparkles, Code2, ChevronRight, Send } from 'lucide-react';
import { PageHeader } from '../components/TopNavigation';
import { VoiceInput, EmptyResult } from '../components/SharedComponents';

export function WorkspacePage({ selected, form, setForm, submitting, onSubmit, onComplete, onViewMentor, activeResult }) {
  return (
    <div className="page workspace-page">
      <PageHeader
        title={selected?.title || 'Learning Workspace'}
        subtitle={selected?.context}
      >
        {activeResult && (
          <button className="secondary" onClick={onViewMentor}>
            View AI Mentor <ChevronRight size={16} />
          </button>
        )}
      </PageHeader>

      <div className="workspace-layout">
        <section className="panel learning-panel">
          <div className="section-title">
            <Compass size={20} />
            <h2>Your Learning Task</h2>
          </div>
          <div className="objective-row">
            {selected?.objectives?.map((item) => <span key={item}>{item}</span>)}
          </div>
          <form onSubmit={onSubmit} className="learning-form">
            <label>
              Your reasoning
              <div className="textarea-row">
                <textarea
                  required
                  value={form.reasoning}
                  onChange={(e) => setForm({ ...form, reasoning: e.target.value })}
                  placeholder={selected?.prompt}
                />
                <VoiceInput value={form.reasoning} onChange={(v) => setForm({ ...form, reasoning: v })} />
              </div>
            </label>
            <label>
              Prompt you would give an AI mentor
              <div className="textarea-row">
                <textarea
                  value={form.promptText}
                  onChange={(e) => setForm({ ...form, promptText: e.target.value })}
                  placeholder="Explain my approach step by step..."
                />
                <VoiceInput value={form.promptText} onChange={(v) => setForm({ ...form, promptText: v })} />
              </div>
            </label>
            <label>
              Reflection
              <div className="textarea-row">
                <textarea
                  value={form.reflection}
                  onChange={(e) => setForm({ ...form, reflection: e.target.value })}
                  placeholder="What did you notice about your thinking?"
                />
                <VoiceInput value={form.reflection} onChange={(v) => setForm({ ...form, reflection: v })} />
              </div>
            </label>
            <div className="form-actions">
              <button type="submit" className="primary" disabled={submitting}>
                <Send size={18} />{submitting ? 'Mapping...' : 'Submit & Continue'}
              </button>
            </div>
          </form>
        </section>

        <section className="panel result-panel">
          <div className="section-title">
            <Sparkles size={20} />
            <h2>AI Mentor Output</h2>
          </div>
          {!activeResult ? (
            <EmptyResult />
          ) : (
            <div className="workspace-result-preview">
              <div className="score"><span>{activeResult.promptScore}</span><small>Prompt maturity</small></div>
              {activeResult.abstractionMap?.map((item) => (
                <article className="mapping" key={item.pattern}>
                  <strong>{item.pattern}</strong>
                  <span>{item.pythonConcept}</span>
                  <p>{item.explanation}</p>
                </article>
              ))}
              <div className="code-block">
                <div><Code2 size={18} /> Generated Python</div>
                <pre>{activeResult.generatedCode}</pre>
              </div>
            </div>
          )}
        </section>
      </div>

      {activeResult && (
        <div className="workspace-next">
          <button className="primary" onClick={onComplete}>
            Continue to Session Summary <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}