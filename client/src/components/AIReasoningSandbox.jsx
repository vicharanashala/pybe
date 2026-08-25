import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Terminal, Cpu, CheckCircle, RefreshCw, Send } from 'lucide-react';
import { getStoryAIPresets } from '../storyData';

const buildCode = (text, story) => {
  const t = text.toLowerCase();
  const id = story?.id || '';

  if (id === 'tortoise_hare' || t.includes('hare') || t.includes('division') || t.includes('zero')) {
    return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\ndistance = 100\nhare_speed = 0\ntry:\n    finish_time = distance / hare_speed\nexcept ZeroDivisionError:\n    print("⚡ ZeroDivisionError! Hare is asleep!")\n    finish_time = 999.0\nelse:\n    print(f"🏃 Race finished in {finish_time}s!")`;
  }
  if (id === 'goldilocks' || t.includes('bowl') || t.includes('index') || t.includes('porridge')) {
    return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\nporridge = ["Hot 🔥", "Cold 🧊", "Just Right ✨"]\ntry:\n    choice = porridge[5]\nexcept IndexError:\n    print("🥣 IndexError! Only 3 bowls exist!")\nexcept KeyError:\n    print("🛏️ KeyError! Not a bear bed owner!")`;
  }
  if (id === 'hansel_gretel' || t.includes('file') || t.includes('breadcrumbs') || t.includes('trail')) {
    return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\ntry:\n    with open("breadcrumbs.txt", "r") as f:\n        path = f.read()\nexcept FileNotFoundError:\n    print("🐦 FileNotFoundError: Birds ate the trail!")\n    path = compass.get_coordinates()\nfinally:\n    print("🧭 Navigation system active!")`;
  }
  if (id === 'cried_wolf' || t.includes('alarm') || t.includes('raise') || t.includes('wolf')) {
    return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\nclass WolfAlarmError(Exception):\n    pass\n\ntry:\n    if alarm == "prank":\n        raise ValueError("🤡 False Alarm!")\n    elif alarm == "real_wolf":\n        raise WolfAlarmError("🐺 REAL WOLF!")\nexcept ValueError as ve:\n    print(f"Prank: {ve}")\nexcept WolfAlarmError as wae:\n    print(f"🚨 EMERGENCY: {wae}")`;
  }
  if (id === 'three_pigs' || t.includes('finally') || t.includes('house') || t.includes('build')) {
    return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\ntry:\n    build_house("straw")\nexcept Exception as e:\n    print(f"🏠 Collapsed: {e}")\nelse:\n    print("🧱 House stands firm!")\nfinally:\n    lock_site()\n    print("🔒 Site secured!")`;
  }
  if (id === 'aladdin_genie' || t.includes('wish') || t.includes('permission') || t.includes('lamp')) {
    return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\nrequested_wishes = 5\ntry:\n    if requested_wishes > 3:\n        raise PermissionError("🧞 Max 3 wishes!")\nexcept PermissionError as e:\n    print(f"🚨 {e}")\nfinally:\n    lamp.seal()\n    print("🪔 Lamp sealed!")`;
  }
  if (id === 'cinderella' || t.includes('timeout') || t.includes('midnight') || t.includes('ball')) {
    return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\ntime_remaining = 0\ntry:\n    if time_remaining <= 0:\n        raise TimeoutError("🕛 Spell expired!")\nexcept TimeoutError as e:\n    print(f"👠 {e} — Escaping!")\nfinally:\n    leave_glass_slipper()\n    print("👠 Slipper left!")`;
  }
  if (id === 'pied_piper' || t.includes('memory') || t.includes('overflow') || t.includes('batch')) {
    return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\ntry:\n    rats = [0] * (10**12)\nexcept MemoryError:\n    print("🌊 MemoryError! Processing in batches!")\n    process_batches(100)\nfinally:\n    collect_payment()\n    print("💰 Payment collected!")`;
  }
  if (id === 'jack_beanstalk' || t.includes('type') || t.includes('bean') || t.includes('int')) {
    return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\nmagic_beans = "5"\ntry:\n    total = magic_beans + 3\nexcept TypeError:\n    total = int(magic_beans) + 3\n    print(f"🌱 TypeError handled! Total: {total}")\nfinally:\n    chop_beanstalk()\n    print("🪓 Beanstalk chopped!")`;
  }
  // Default — red_hood / AttributeError
  return `# AI Generated Python Exception Logic — ${story?.title || 'Story'}:\ntry:\n    guest = cottage.get_guest()\n    guest.bake_pastries()\nexcept AttributeError as err:\n    print(f"🚨 AttributeError: {err}")\n    woodcutter.alert_rescue()\nfinally:\n    cottage.lock_door()\n    print("🔒 Door locked!")`;
};

export function AIReasoningSandbox({ story, onActivityDone }) {
  const PRESETS = getStoryAIPresets(story);
  const [promptText, setPromptText] = useState(PRESETS[0].prompt);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [generatedResult, setGeneratedResult] = useState(null);



  // Reset when story changes
  useEffect(() => {
    const presets = getStoryAIPresets(story);
    setPromptText(presets[0].prompt);
    setIsAnalyzing(false);
    setReasoningSteps([]);
    setGeneratedResult(null);
  }, [story.id]);

  const runAIReasoning = (customPrompt) => {
    const textToUse = customPrompt || promptText;
    setIsAnalyzing(true);
    setReasoningSteps([]);
    setGeneratedResult(null);

    const steps = [
      { num: 1, title: 'Parsing Prompt Instructions', desc: `Scanning user intent: "${textToUse.slice(0, 60)}..."` },
      { num: 2, title: 'Identifying Exception Types', desc: 'Detecting potential runtime errors & risk boundaries in the scenario.' },
      { num: 3, title: 'Structuring Try-Except-Else-Finally Architecture', desc: 'Ensuring safe action attempt in try: and emergency handler in except:.' },
      { num: 4, title: 'Synthesizing Python Code & Verification', desc: 'Building clean Python syntax and verifying exception recovery paths.' }
    ];

    steps.forEach((st, idx) => {
      setTimeout(() => {
        setReasoningSteps(prev => [...prev, st]);
        if (idx === steps.length - 1) {
          setIsAnalyzing(false);
          const codeOutput = buildCode(textToUse, story);
          setGeneratedResult({
            code: codeOutput,
            confidence: '98.5%',
            tokensUsed: 142,
            reasoningTime: '1.2s'
          });
          onActivityDone && onActivityDone();
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <div className="air-root">
      {/* Header */}
      <div className="air-header">
        <div className="air-header-title">
          <Bot size={24} className="air-bot-icon" />
          <div>
            <h3>🤖 AI Reasoning Sandbox — {story.icon} {story.title}</h3>
            <p>Test how an AI agent reasons through <strong>{story.errorType}</strong> exception handling scenarios specific to this story.</p>
          </div>
        </div>

        <div className="air-presets">
          <span className="preset-lbl">Quick Prompts:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className="preset-btn"
              onClick={() => { setPromptText(p.prompt); runAIReasoning(p.prompt); }}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox Layout */}
      <div className="air-grid">
        {/* Left: Prompt Input & AI Thinking Trace */}
        <div className="air-left">
          <div className="air-card">
            <div className="air-card-hdr">
              <Sparkles size={16} />
              <span>Prompt AI Reasoning Engine</span>
            </div>

            <div className="air-input-wrap">
              <textarea
                className="air-textarea"
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={`Describe a scenario for "${story.title}" (e.g. ${story.errorType})...`}
              />
              <button
                className="air-run-btn"
                onClick={() => runAIReasoning()}
                disabled={isAnalyzing || !promptText.trim()}
              >
                {isAnalyzing ? <RefreshCw className="spin" size={15} /> : <Send size={15} />}
                {isAnalyzing ? 'Reasoning...' : 'Run AI Reasoning'}
              </button>
            </div>
          </div>

          {/* AI Thinking Trace Panel */}
          <div className="air-card">
            <div className="air-card-hdr">
              <Cpu size={16} />
              <span>Live AI Logic & Reasoning Trace</span>
            </div>

            <div className="air-trace-list">
              {reasoningSteps.length === 0 ? (
                <div className="air-idle-msg">
                  <Bot size={24} />
                  <p>Click <strong>"Run AI Reasoning"</strong> to view real-time step-by-step AI thought traces...</p>
                </div>
              ) : (
                reasoningSteps.map((st) => (
                  <div key={st.num} className="air-trace-step">
                    <div className="trace-step-badge">Step {st.num}</div>
                    <div className="trace-step-body">
                      <strong>{st.title}</strong>
                      <p>{st.desc}</p>
                    </div>
                    <CheckCircle size={16} className="trace-check-ic" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Generated Python Code Output */}
        <div className="air-right">
          <div className="air-card result-card">
            <div className="air-card-hdr dark">
              <Terminal size={16} />
              <span>Synthesized Python Exception Code</span>
            </div>

            {generatedResult ? (
              <div className="air-result-body">
                <div className="air-stats-strip">
                  <span>🎯 Confidence: <strong>{generatedResult.confidence}</strong></span>
                  <span>⚡ Latency: <strong>{generatedResult.reasoningTime}</strong></span>
                  <span>🔤 Tokens: <strong>{generatedResult.tokensUsed}</strong></span>
                </div>

                <pre className="air-code-box">{generatedResult.code}</pre>

                <div className="air-explanation-callout">
                  <strong>💡 AI Reasoning Summary:</strong>
                  <p>The AI isolated the risky <strong>{story.errorType}</strong> scenario inside a <code>try:</code> block and constructed an emergency <code>except:</code> handler specific to the <em>{story.title}</em> story.</p>
                </div>
              </div>
            ) : (
              <div className="air-empty-result">
                <Terminal size={32} />
                <p>Waiting for AI reasoning synthesis output...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
