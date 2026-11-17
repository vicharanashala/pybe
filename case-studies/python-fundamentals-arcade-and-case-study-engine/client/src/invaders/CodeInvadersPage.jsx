import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Play, RotateCcw, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';

const Theme = {
  bg: '#0a0f12',
  cardBg: '#12181c',
  border: '#1f2b34',
  text: '#ffffff',
  muted: '#7f93a1',
  neonCyan: '#00f3ff',
  neonGreen: '#39ff14',
  neonPink: '#ff007f',
  neonYellow: '#ffea00'
};

export default function CodeInvadersPage() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState(['Laser shield initialized. Engagement script compiled.']);
  const [resultMessage, setResultMessage] = useState(null);

  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const runningRef = useRef(false);

  // Mutable game state variables for frame loops
  const gameState = useRef({
    shipX: 150,
    laserX: 0,
    laserY: 0,
    laserActive: false,
    invaders: [
      { id: 1, x: 50, y: 30, active: true },
      { id: 2, x: 120, y: 35, active: true },
      { id: 3, x: 180, y: 30, active: true },
      { id: 4, x: 250, y: 40, active: true }
    ],
    score: 0,
    lives: 3,
    wave: 1
  });

  const defaultCode = `# Autopilot Script for Space Invaders
# Available coordinates:
#   ship.x - current center coordinate of your ship (10 to 290)
#   invader.x - horizontal coordinate of the closest invader
#   invader.y - vertical coordinate of the closest invader
# Actions:
#   ship.move_left()
#   ship.move_right()
#   ship.shoot()

# Logic: Align with closest invader, then blast it!
if invader.x > ship.x + 10:
    ship.move_right()
elif invader.x < ship.x - 10:
    ship.move_left()
else:
    ship.shoot()
`;

  const [code, setCode] = useState(defaultCode);

  // Initialize Pyodide
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
      setLogs(prev => [...prev, `[ERROR] Failed to load Pyodide: ${err.message}`]);
      setPyodideLoading(false);
      return null;
    }
  };

  const handleReset = () => {
    runningRef.current = false;
    setIsRunning(false);
    clearInterval(timerRef.current);
    
    gameState.current = {
      shipX: 150,
      laserX: 0,
      laserY: 0,
      laserActive: false,
      invaders: [
        { id: 1, x: 50, y: 30, active: true },
        { id: 2, x: 120, y: 35, active: true },
        { id: 3, x: 180, y: 30, active: true },
        { id: 4, x: 250, y: 40, active: true }
      ],
      score: 0,
      lives: 3,
      wave: 1
    };

    setScore(0);
    setLives(3);
    setWave(1);
    setResultMessage(null);
    setLogs(['Game reset. Auto-pilot shields standby.']);
    drawGameFrame();
  };

  // Draw game frame to canvas 2D
  const drawGameFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = gameState.current;

    // Clear frame
    ctx.fillStyle = '#070a0e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines (Cyberpunk effect)
    ctx.strokeStyle = 'rgba(31, 43, 52, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Player Ship (Glowing Cyan Triangle)
    ctx.fillStyle = '#0c1217';
    ctx.strokeStyle = Theme.neonCyan;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(state.shipX, 175);
    ctx.lineTo(state.shipX - 12, 192);
    ctx.lineTo(state.shipX + 12, 192);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw Laser (Glowing Green Line)
    if (state.laserActive) {
      ctx.strokeStyle = Theme.neonGreen;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(state.laserX, state.laserY);
      ctx.lineTo(state.laserX, state.laserY - 12);
      ctx.stroke();
    }

    // Draw Invaders (Glowing Pink Alien Blobs)
    state.invaders.forEach(invader => {
      if (!invader.active) return;
      ctx.fillStyle = '#170d13';
      ctx.strokeStyle = Theme.neonPink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(invader.x, invader.y, 9, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Mini Antenna horns
      ctx.beginPath();
      ctx.moveTo(invader.x - 5, invader.y - 8);
      ctx.lineTo(invader.x - 8, invader.y - 13);
      ctx.moveTo(invader.x + 5, invader.y - 8);
      ctx.lineTo(invader.x + 8, invader.y - 13);
      ctx.stroke();
    });
  };

  const startGameSimulation = async () => {
    if (isRunning) return;

    // Load Pyodide
    const py = await initPyodide();
    if (!py) return;

    handleReset();
    setIsRunning(true);
    runningRef.current = true;
    setLogs(['Initiating AI Autopilot Defense...']);

    const state = gameState.current;

    const gameLoopStep = async () => {
      if (!runningRef.current) return;

      // 1. Advance Laser
      if (state.laserActive) {
        state.laserY -= 18;
        if (state.laserY < 0) {
          state.laserActive = false;
        }
      }

      // 2. Advance Invaders (natural fall)
      state.invaders.forEach(invader => {
        if (!invader.active) return;
        invader.y += 2.5; // slow drift downwards

        // Check if invader breached shield
        if (invader.y >= 172) {
          state.lives -= 1;
          setLives(state.lives);
          setLogs(prev => [...prev, `[WARNING] Invader breached shields! Shield Integrity: ${state.lives} HP.`]);
          invader.y = 20; // reset to top
          invader.x = Math.random() * 260 + 20;
        }
      });

      // Check Game Over
      if (state.lives <= 0) {
        setLogs(prev => [...prev, `[FATAL] Defense failed. Spaceship collapsed.`]);
        setResultMessage({
          success: false,
          text: `Spaceship destroyed! Your autopilot scored ${state.score} points on Wave ${state.wave}.`
        });
        setIsRunning(false);
        runningRef.current = false;
        clearInterval(timerRef.current);
        return;
      }

      // Check Wave Complete (Respawn new wave)
      const activeCount = state.invaders.filter(i => i.active).length;
      if (activeCount === 0) {
        state.wave += 1;
        setWave(state.wave);
        setLogs(prev => [...prev, `✓ Wave ${state.wave - 1} cleared! Initializing Wave ${state.wave}...`]);
        state.invaders = [
          { id: 1, x: Math.random() * 250 + 25, y: 25, active: true },
          { id: 2, x: Math.random() * 250 + 25, y: 35, active: true },
          { id: 3, x: Math.random() * 250 + 25, y: 20, active: true },
          { id: 4, x: Math.random() * 250 + 25, y: 40, active: true }
        ];
      }

      // 3. Find closest active invader
      let closest = null;
      let maxDepth = -1;
      state.invaders.forEach(invader => {
        if (invader.active && invader.y > maxDepth) {
          maxDepth = invader.y;
          closest = invader;
        }
      });

      // 4. Run Python Script
      if (closest) {
        py.runPython(`
class SpaceShip:
    def __init__(self, x):
        self.x = x
        self._action = None
        
    def move_left(self):
        self._action = "left"
        
    def move_right(self):
        self._action = "right"
        
    def shoot(self):
        self._action = "shoot"

class InvaderThreat:
    def __init__(self, x, y):
        self.x = x
        self.y = y

ship = SpaceShip(${state.shipX})
invader = InvaderThreat(${closest.x}, ${closest.y})
        `);

        try {
          await py.runPythonAsync(code);

          const action = py.runPython('ship._action');
          if (action === 'left') {
            state.shipX = Math.max(15, state.shipX - 16);
          } else if (action === 'right') {
            state.shipX = Math.min(285, state.shipX + 16);
          } else if (action === 'shoot') {
            if (!state.laserActive) {
              state.laserActive = true;
              state.laserX = state.shipX;
              state.laserY = 170;
            }
          }
        } catch (err) {
          setLogs(prev => [...prev, `[ERROR] Autopilot crash: ${err.message}`]);
          setResultMessage({
            success: false,
            text: 'Autopilot logic failed or raised a syntax exception.'
          });
          setIsRunning(false);
          runningRef.current = false;
          clearInterval(timerRef.current);
          return;
        }
      }

      // 5. Check Laser collision with active invaders
      if (state.laserActive) {
        state.invaders.forEach(invader => {
          if (!invader.active) return;
          // Proximity collision detection box
          const dist = Math.hypot(state.laserX - invader.x, state.laserY - invader.y);
          if (dist < 15) {
            invader.active = false;
            state.laserActive = false;
            state.score += 100;
            setScore(state.score);
            setLogs(prev => [...prev, `[BLAST] Invader destroyed at (${Math.round(invader.x)}, ${Math.round(invader.y)}). +100 Score.`]);
          }
        });
      }

      // Render Frame
      drawGameFrame();
    };

    // Draw initially
    drawGameFrame();
    
    // Play loop at ~80ms per frame
    timerRef.current = setInterval(gameLoopStep, 80);
  };

  useEffect(() => {
    drawGameFrame();
    return () => clearInterval(timerRef.current);
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
            <Rocket size={32} /> PYTHON SPACE-INVADERS AUTOPILOT
          </h1>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: Theme.muted }}>
            Program a real-time reactive AI loop in Python to move your spaceship defense shield and blast falling aliens.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={startGameSimulation}
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
            <Play size={16} /> {pyodideLoading ? 'Loading Engine...' : isRunning ? 'Shields Up...' : 'Start Game'}
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
            <Terminal size={18} /> AUTOPILOT AI ALGORITHM
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

        {/* Right Side: Arcade Canvas */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Canvas Box */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <canvas
              ref={canvasRef}
              width="300"
              height="200"
              style={{
                width: '100%',
                maxWidth: 420,
                height: 250,
                borderRadius: 14,
                background: '#070a0e',
                border: `2px solid ${Theme.neonCyan}`,
                boxShadow: `0 0 15px rgba(0, 243, 255, 0.2)`
              }}
            />
          </div>

          {/* HUD statistics panel */}
          <div style={{
            background: Theme.cardBg,
            border: `1px solid ${Theme.border}`,
            borderRadius: 16,
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontFamily: 'monospace'
          }}>
            <div>
              <div style={{ color: Theme.muted, fontSize: '0.72rem', letterSpacing: '0.05em' }}>HIGH SCORE</div>
              <strong style={{ color: Theme.neonGreen, fontSize: '1.4rem', textShadow: `0 0 8px ${Theme.neonGreen}` }}>{score}</strong>
            </div>

            <div>
              <div style={{ color: Theme.muted, fontSize: '0.72rem', letterSpacing: '0.05em' }}>CURRENT WAVE</div>
              <strong style={{ color: Theme.neonYellow, fontSize: '1.4rem', textShadow: `0 0 8px ${Theme.neonYellow}` }}>WAVE {wave}</strong>
            </div>

            <div>
              <div style={{ color: Theme.muted, fontSize: '0.72rem', letterSpacing: '0.05em' }}>SHIELD POWER</div>
              <strong style={{ color: Theme.neonPink, fontSize: '1.4rem', textShadow: `0 0 8px ${Theme.neonPink}` }}>{lives} HP</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Result cards */}
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
              {resultMessage.success ? 'MISSION ACCOMPLISHED!' : 'SHIELD DEFLATED!'}
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: Theme.text }}>
              {resultMessage.text}
            </p>
          </div>
        </div>
      )}

      {/* Log Feed */}
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
          LASER SENSOR RADAR READOUT
        </h3>
        <div style={{
          height: 100,
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
              color: log.includes('[ERROR]') || log.includes('[FATAL]') ? Theme.neonPink : log.includes('✓') || log.includes('[BLAST]') ? Theme.neonGreen : Theme.neonCyan
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
