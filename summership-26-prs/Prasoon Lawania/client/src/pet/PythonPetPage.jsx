import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Play, RotateCcw, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';

// ─── Cyberpunk Neon Theme Palette ─────────────────────────────────────────────
const Theme = {
  bg: '#0a0f12',
  cardBg: '#12181c',
  border: '#1f2b34',
  text: '#ffffff',
  muted: '#7f93a1',
  neonGreen: '#39ff14',
  neonCyan: '#00f3ff',
  neonPink: '#ff007f',
  neonYellow: '#ffea00',
  error: '#ff3b30'
};

// ─── Neon Progress Bar ────────────────────────────────────────────────────────
function NeonProgressBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'monospace' }}>
        <span style={{ color: Theme.muted }}>{label.toUpperCase()}</span>
        <strong style={{ color: color }}>{value}%</strong>
      </div>
      <div style={{ height: 10, background: '#172026', borderRadius: 5, overflow: 'hidden', border: `1px solid ${Theme.border}` }}>
        <div style={{
          height: '100%',
          width: `${value}%`,
          background: color,
          boxShadow: `0 0 8px ${color}`,
          borderRadius: 5,
          transition: 'width 0.4s ease'
        }} />
      </div>
    </div>
  );
}

// ─── Neon Pixel Dino SVG Animations ───────────────────────────────────────────
function PixelDino({ state }) {
  const isEating = state === 'eating';
  const isPlaying = state === 'playing';
  const isSleeping = state === 'sleeping';
  const isSad = state === 'sad';
  const isDead = state === 'dead';

  return (
    <div style={{
      width: '100%',
      height: 180,
      background: '#0d1317',
      border: `2px solid ${isDead ? Theme.neonPink : Theme.neonCyan}`,
      boxShadow: isDead ? `0 0 15px rgba(255, 0, 127, 0.2)` : `0 0 15px rgba(0, 243, 255, 0.15)`,
      borderRadius: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Simulation Grid Background */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(31,43,52,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(31,43,52,0.1) 1px, transparent 1px)',
        backgroundSize: '15px 15px'
      }} />

      {/* Floating animations */}
      {isSleeping && (
        <div style={{
          position: 'absolute',
          top: 30, right: '35%',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: Theme.neonCyan,
          animation: 'zzz 2s infinite ease-in-out'
        }}>
          Zzz...
          <style>{`@keyframes zzz { 0%,100%{transform:translateY(0) scale(0.8);opacity:0.3} 50%{transform:translateY(-15px) scale(1.1);opacity:1} }`}</style>
        </div>
      )}

      {isEating && (
        <div style={{
          position: 'absolute',
          top: 50, right: '30%',
          fontSize: '1.5rem',
          animation: 'appleBounce 1s infinite'
        }}>
          🍏
          <style>{`@keyframes appleBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px) rotate(15deg)} }`}</style>
        </div>
      )}

      {isPlaying && (
        <div style={{
          position: 'absolute',
          top: 30, left: '30%',
          fontSize: '1.4rem',
          animation: 'sparkle 1.2s infinite'
        }}>
          💖✨
          <style>{`@keyframes sparkle { 0%,100%{transform:scale(0.8);opacity:0.5} 50%{transform:scale(1.2);opacity:1} }`}</style>
        </div>
      )}

      {/* Dinosaur SVG Graphic */}
      <svg
        width="110"
        height="110"
        viewBox="0 0 100 100"
        style={{
          transform: isPlaying ? 'translateY(-10px)' : 'none',
          transition: 'transform 0.2s ease',
          animation: isSleeping ? 'breathing 2s infinite ease-in-out' : 'none'
        }}
      >
        <style>{`@keyframes breathing { 0%,100%{transform:scale(1)} 50%{transform:scale(0.96) translateY(2px)} }`}</style>

        {/* Dino Body */}
        {isDead ? (
          // Dead Dino Flat on back
          <g transform="rotate(90 50 50) translate(0, 10)">
            <rect x="25" y="45" width="50" height="20" rx="6" fill="#1f2b34" stroke={Theme.neonPink} strokeWidth="2" />
            {/* Tail */}
            <path d="M 25 55 L 5 45 L 25 45 Z" fill="#1f2b34" stroke={Theme.neonPink} strokeWidth="2" />
            {/* Feet */}
            <rect x="35" y="35" width="6" height="10" fill="#1f2b34" stroke={Theme.neonPink} strokeWidth="2" />
            <rect x="55" y="35" width="6" height="10" fill="#1f2b34" stroke={Theme.neonPink} strokeWidth="2" />
            {/* Head */}
            <rect x="65" y="35" width="22" height="22" rx="4" fill="#1f2b34" stroke={Theme.neonPink} strokeWidth="2" />
            {/* X Eyes */}
            <path d="M 72 42 L 76 46 M 76 42 L 72 46" stroke={Theme.neonPink} strokeWidth="2" />
          </g>
        ) : (
          // Living Dino (Normal / Eating / Playing / Sad)
          <g>
            {/* Tail */}
            <path
              d="M 25 65 L 5 50 L 25 50 Z"
              fill={isSad ? '#1f2b34' : '#2e4c3e'}
              stroke={isSad ? Theme.border : Theme.neonGreen}
              strokeWidth="2.5"
              style={{
                transform: isPlaying ? 'rotate(-10deg) translate(2px, 0)' : 'none',
                transformOrigin: '25px 55px',
                transition: 'transform 0.3s ease'
              }}
            />
            {/* Spikes on back */}
            <path d="M 25 48 L 30 40 L 35 48 M 35 48 L 40 40 L 45 48 M 45 48 L 50 40 L 55 48" fill={Theme.neonYellow} />

            {/* Back Feet */}
            <rect x="35" y="70" width="8" height="15" rx="2" fill="#131d24" stroke={Theme.neonGreen} strokeWidth="1.5" />
            <rect x="53" y="70" width="8" height="15" rx="2" fill="#131d24" stroke={Theme.neonGreen} strokeWidth="1.5" />

            {/* Main Body */}
            <rect
              x="25"
              y="48"
              width="36"
              height="26"
              rx="8"
              fill={isSad ? '#1d262b' : '#1a2e24'}
              stroke={isSad ? Theme.border : Theme.neonGreen}
              strokeWidth="2.5"
            />

            {/* Front Feet */}
            <rect
              x="38"
              y="74"
              width="8"
              height="15"
              rx="2"
              fill={isSad ? '#1d262b' : '#1a2e24'}
              stroke={isSad ? Theme.border : Theme.neonGreen}
              strokeWidth="2.5"
              transform={isPlaying ? 'rotate(10 38 74)' : 'none'}
            />
            <rect
              x="50"
              y="74"
              width="8"
              height="15"
              rx="2"
              fill={isSad ? '#1d262b' : '#1a2e24'}
              stroke={isSad ? Theme.border : Theme.neonGreen}
              strokeWidth="2.5"
              transform={isPlaying ? 'rotate(-10 50 74)' : 'none'}
            />

            {/* Neck & Head */}
            <g transform={isEating ? 'rotate(5 55 52)' : 'none'}>
              <rect
                x="50"
                y="30"
                width="24"
                height="28"
                rx="6"
                fill={isSad ? '#1d262b' : '#1a2e24'}
                stroke={isSad ? Theme.border : Theme.neonGreen}
                strokeWidth="2.5"
              />
              <rect
                x="58"
                y="26"
                width="26"
                height="18"
                rx="4"
                fill={isSad ? '#1d262b' : '#1a2e24'}
                stroke={isSad ? Theme.border : Theme.neonGreen}
                strokeWidth="2.5"
              />

              {/* Eyes */}
              {isSleeping ? (
                // Sleeping closed eyes
                <line x1="72" y1="33" x2="78" y2="33" stroke={Theme.neonCyan} strokeWidth="2.5" />
              ) : isSad ? (
                // Sad teardrop eye
                <g>
                  <circle cx="74" cy="33" r="3" fill={Theme.neonCyan} />
                  <path d="M 74 34 L 72 40 L 76 40 Z" fill={Theme.neonCyan} />
                </g>
              ) : (
                // Happy normal eye
                <circle cx="75" cy="33" r="3" fill={Theme.neonGreen} />
              )}

              {/* Mouth */}
              {isEating ? (
                // Open biting mouth
                <path d="M 75 40 Q 82 45 76 48" fill="none" stroke={Theme.neonGreen} strokeWidth="2.5" />
              ) : (
                // Normal smile or sad frown
                <path
                  d={isSad ? "M 74 42 Q 78 39 82 42" : "M 74 39 Q 78 42 82 39"}
                  fill="none"
                  stroke={isSad ? Theme.border : Theme.neonGreen}
                  strokeWidth="2"
                />
              )}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}

// ─── Main PythonPetPage Component ─────────────────────────────────────────────
export default function PythonPetPage() {
  const [hunger, setHunger] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [cycle, setCycle] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState(['Tamagotchi simulation loaded. Engaged with local Pyodide interpreter.']);
  const [animationState, setAnimationState] = useState('idle');
  const [resultMessage, setResultMessage] = useState(null);
  
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  const defaultCode = `# Dino Pet Autopilot Control Script
# Stats available: pet.hunger (0-100), pet.energy (0-100), pet.happiness (0-100)
# Actions you can take: pet.feed(), pet.play(), pet.sleep()

if pet.hunger > 60:
    pet.feed("apple")
elif pet.energy < 35:
    pet.sleep()
elif pet.happiness < 50:
    pet.play("ball")
else:
    # If stats are balanced, do nothing to save energy!
    pass
`;

  const [code, setCode] = useState(defaultCode);

  const runningRef = useRef(false);

  // Initialize Pyodide on mount or first execution
  const initPyodide = async () => {
    if (pyodide) return pyodide;
    setPyodideLoading(true);
    try {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/pyodide/pyodide.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load local Pyodide files.'));
          document.head.appendChild(script);
        });
      }
      const py = await window.loadPyodide({ indexURL: '/pyodide/' });
      setPyodide(py);
      setPyodideLoading(false);
      return py;
    } catch (err) {
      setLogs(prev => [...prev, `[ERROR] Failed to load local Pyodide: ${err.message}`]);
      setPyodideLoading(false);
      return null;
    }
  };

  const handleReset = () => {
    runningRef.current = false;
    setIsRunning(false);
    setHunger(50);
    setEnergy(50);
    setHappiness(50);
    setCycle(0);
    setLogs(['Autopilot resetted. Ready to start simulation.']);
    setAnimationState('idle');
    setResultMessage(null);
  };

  const runSimulation = async () => {
    if (isRunning) return;
    
    // Reset stats for clean simulation start
    let curHunger = 50;
    let curEnergy = 50;
    let curHappiness = 50;
    
    setHunger(curHunger);
    setEnergy(curEnergy);
    setHappiness(curHappiness);
    setCycle(0);
    setResultMessage(null);
    setLogs(['Initializing autopilot test...']);
    setAnimationState('idle');

    // Load Pyodide
    const py = await initPyodide();
    if (!py) return;

    setIsRunning(true);
    runningRef.current = true;

    const runDayCycle = async (day) => {
      if (!runningRef.current) return;

      setCycle(day);

      // 1. Stats decay at start of day
      curHunger = Math.min(100, curHunger + 10);
      curEnergy = Math.max(0, curEnergy - 10);
      curHappiness = Math.max(0, curHappiness - 5);

      setHunger(curHunger);
      setEnergy(curEnergy);
      setHappiness(curHappiness);

      // Check for death before execution
      if (curHunger >= 100 || curEnergy <= 0 || curHappiness <= 0) {
        setAnimationState('dead');
        setLogs(prev => [...prev, `[FATAL] Day ${day}: Dino collapsed due to extreme neglect.`]);
        setResultMessage({
          success: false,
          text: 'Game Over! Dino-Pet collapsed. Adjust your conditions to react earlier!'
        });
        setIsRunning(false);
        runningRef.current = false;
        return;
      }

      // Determine sad state animation
      if (curHunger > 70 || curEnergy < 30 || curHappiness < 30) {
        setAnimationState('sad');
      }

      // 2. Prepare Pyodide scope
      py.runPython(`
class VirtualPet:
    def __init__(self, hunger, energy, happiness):
        self.hunger = hunger
        self.energy = energy
        self.happiness = happiness
        self._action = None
        self._action_param = None
        
    def feed(self, food="apple"):
        self._action = "feed"
        self._action_param = food
        
    def play(self, game="ball"):
        self._action = "play"
        self._action_param = game
        
    def sleep(self):
        self._action = "sleep"

pet = VirtualPet(${curHunger}, ${curEnergy}, ${curHappiness})
      `);

      // 3. Execute student code
      try {
        await py.runPythonAsync(code);
        
        // Extract actions
        const action = py.runPython('pet._action');
        const param = py.runPython('pet._action_param');

        // Apply action changes
        if (action === 'feed') {
          curHunger = Math.max(0, curHunger - 35);
          curEnergy = Math.min(100, curEnergy + 5);
          setAnimationState('eating');
          setLogs(prev => [...prev, `Day ${day}: Python fed Dino an ${param || 'apple'}! Hunger reduced.`]);
        } else if (action === 'sleep') {
          curEnergy = Math.min(100, curEnergy + 40);
          curHunger = Math.min(100, curHunger + 5); // sleeping adds light hunger
          setAnimationState('sleeping');
          setLogs(prev => [...prev, `Day ${day}: Python instructed Dino to take a nap. Energy restored.`]);
        } else if (action === 'play') {
          curHappiness = Math.min(100, curHappiness + 25);
          curEnergy = Math.max(0, curEnergy - 15);
          setAnimationState('playing');
          setLogs(prev => [...prev, `Day ${day}: Python ordered Dino to play with a ${param || 'ball'}! Happiness up.`]);
        } else {
          setAnimationState(curHunger > 70 || curEnergy < 30 || curHappiness < 30 ? 'sad' : 'idle');
          setLogs(prev => [...prev, `Day ${day}: Python took no action. Dino rested.`]);
        }

        // Apply state updates to UI
        setHunger(curHunger);
        setEnergy(curEnergy);
        setHappiness(curHappiness);

      } catch (err) {
        setLogs(prev => [...prev, `[RUNTIME ERROR] Day ${day}: ${err.message}`]);
        setResultMessage({
          success: false,
          text: `Autopilot Crashed! Python error on Day ${day}.`
        });
        setIsRunning(false);
        runningRef.current = false;
        return;
      }

      // Check for death after action
      if (curHunger >= 100 || curEnergy <= 0 || curHappiness <= 0) {
        setAnimationState('dead');
        setLogs(prev => [...prev, `[FATAL] Day ${day}: Dino collapsed after taking action.`]);
        setResultMessage({
          success: false,
          text: 'Game Over! Dino-Pet collapsed. Adjust your conditions to react earlier!'
        });
        setIsRunning(false);
        runningRef.current = false;
        return;
      }

      // Schedule next day cycle or finish
      if (day < 10) {
        setTimeout(() => runDayCycle(day + 1), 1200);
      } else {
        setIsRunning(false);
        runningRef.current = false;
        setAnimationState('idle');
        setLogs(prev => [...prev, '✓ Autopilot successfully completed the 10-day survival test!']);
        setResultMessage({
          success: true,
          text: 'Autopilot Success! Dino-Pet survived all 10 days safely using your Python logic!'
        });
      }
    };

    runDayCycle(1);
  };

  useEffect(() => {
    return () => {
      runningRef.current = false; // clean up on unmount
    };
  }, []);

  return (
    <div style={{
      background: Theme.bg,
      minHeight: 'calc(100vh - 60px)',
      color: Theme.text,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Header Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `2px solid ${Theme.border}`,
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: Theme.neonCyan, display: 'flex', alignItems: 'center', gap: '0.6rem', textShadow: '0 0 10px rgba(0, 243, 255, 0.3)' }}>
            <Gamepad2 size={32} /> PYTHON DINO-PET AUTOMATION
          </h1>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: Theme.muted }}>
            Build a Python script containing conditional checks to keep your Dino alive for 10 simulated days.
          </p>
        </div>
        
        {/* Actions Button Bar */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={runSimulation}
            disabled={isRunning || pyodideLoading}
            style={{
              background: isRunning ? '#162026' : Theme.neonGreen,
              color: isRunning ? Theme.muted : '#0a0f12',
              border: 'none',
              borderRadius: 10,
              padding: '0.65rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: isRunning ? 'none' : `0 0 12px ${Theme.neonGreen}`,
              transition: 'all 0.2s ease'
            }}
          >
            <Play size={16} /> {pyodideLoading ? 'Loading Pyodide...' : isRunning ? 'Autopilot Running...' : 'Start Autopilot'}
          </button>
          <button
            onClick={handleReset}
            style={{
              background: 'transparent',
              color: Theme.neonPink,
              border: `1px solid ${Theme.neonPink}`,
              borderRadius: 10,
              padding: '0.65rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: `0 0 8px rgba(255,0,127,0.15)`,
              transition: 'all 0.2s ease'
            }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Side: Script Editor */}
        <div style={{
          background: Theme.cardBg,
          border: `1px solid ${Theme.border}`,
          borderRadius: 16,
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ margin: 0, fontSize: '0.9rem', color: Theme.neonCyan, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} /> PYTHON SCRIPT EDITOR
          </h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isRunning}
            style={{
              width: '100%',
              height: '320px',
              background: '#070a0d',
              color: Theme.neonGreen,
              border: `1px solid ${Theme.border}`,
              borderRadius: 10,
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              transition: 'border 0.2s ease'
            }}
            onFocus={(e) => (e.target.style.borderColor = Theme.neonCyan)}
            onBlur={(e) => (e.target.style.borderColor = Theme.border)}
          />
        </div>

        {/* Right Side: Tamagotchi Monitor */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Animated Pet Display */}
          <div style={{ position: 'relative' }}>
            <PixelDino state={animationState} />
            
            {/* Top Cycle Day Tracker Badge */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'rgba(10,15,18,0.85)',
              border: `1px solid ${Theme.border}`,
              borderRadius: '2rem',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              color: Theme.neonCyan,
              fontFamily: 'monospace',
              fontWeight: 700
            }}>
              DAY {cycle} / 10
            </div>
          </div>

          {/* Health Status Gauges Panel */}
          <div style={{
            background: Theme.cardBg,
            border: `1px solid ${Theme.border}`,
            borderRadius: 16,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: 0, fontSize: '0.82rem', letterSpacing: '0.08em', color: Theme.muted, borderBottom: `1px solid ${Theme.border}`, paddingBottom: '0.5rem' }}>
              DINO HEALTH GAUGES
            </h3>
            <NeonProgressBar label="Hunger (Lower is Better)" value={hunger} color={hunger > 70 ? Theme.error : Theme.neonGreen} />
            <NeonProgressBar label="Energy" value={energy} color={energy < 30 ? Theme.error : Theme.neonCyan} />
            <NeonProgressBar label="Happiness" value={happiness} color={happiness < 30 ? Theme.error : Theme.neonPink} />
          </div>
        </div>
      </div>

      {/* Outcome Cards */}
      {resultMessage && (
        <div style={{
          background: resultMessage.success ? 'rgba(57,255,20,0.06)' : 'rgba(255,0,127,0.06)',
          border: resultMessage.success ? `1px solid ${Theme.neonGreen}` : `1px solid ${Theme.neonPink}`,
          borderRadius: 16,
          padding: '1.25rem 1.5rem',
          display: 'flex',
          gap: '0.8rem',
          alignItems: 'center',
          animation: 'csFadeIn 0.4s ease-out'
        }}>
          {resultMessage.success ? (
            <CheckCircle size={32} style={{ color: Theme.neonGreen, flexShrink: 0 }} />
          ) : (
            <AlertTriangle size={32} style={{ color: Theme.neonPink, flexShrink: 0 }} />
          )}
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: resultMessage.success ? Theme.neonGreen : Theme.neonPink }}>
              {resultMessage.success ? 'AUTOPILOT SUCCESS!' : 'AUTOPILOT COLLAPSED!'}
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: Theme.text }}>
              {resultMessage.text}
            </p>
          </div>
        </div>
      )}

      {/* Day logs panel */}
      <div style={{
        background: Theme.cardBg,
        border: `1px solid ${Theme.border}`,
        borderRadius: 16,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ margin: 0, fontSize: '0.82rem', letterSpacing: '0.08em', color: Theme.muted }}>
          SIMULATION EVENT LOGS
        </h3>
        <div style={{
          height: 120,
          background: '#070a0d',
          borderRadius: 10,
          padding: '0.8rem 1rem',
          fontFamily: 'monospace',
          fontSize: '0.78rem',
          lineHeight: 1.5,
          color: Theme.neonCyan,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          {logs.map((log, i) => (
            <div key={i} style={{
              color: log.includes('[ERROR]') || log.includes('[FATAL]') ? Theme.neonPink : log.includes('✓') ? Theme.neonGreen : Theme.neonCyan
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
