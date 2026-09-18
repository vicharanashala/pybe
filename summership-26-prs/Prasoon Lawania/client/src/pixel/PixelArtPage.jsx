import React, { useState, useEffect, useRef } from 'react';
import { Palette, Play, RotateCcw, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';

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

const CHALLENGES = [
  {
    id: 'checkerboard',
    title: 'Checkerboard Pattern',
    description: 'Paint alternating cells of the 16x16 grid with two different colors.',
    template: `# Challenge: Paint Checkerboard Pattern
# Exposed function: paint_pixel(x, y, "color") (colors: "cyan", "pink", "green")

for y in range(16):
    for x in range(16):
        if (x + y) % 2 == 0:
            paint_pixel(x, y, "cyan")
        else:
            paint_pixel(x, y, "pink")
`,
    validate: (cells) => {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const cellColor = cells[y * 16 + x];
          if ((x + y) % 2 === 0) {
            if (cellColor !== 'cyan') return false;
          } else {
            if (cellColor !== 'pink') return false;
          }
        }
      }
      return true;
    }
  },
  {
    id: 'border',
    title: 'Outer Border Frame',
    description: 'Paint the outer boundary edges of the 16x16 grid with a single color.',
    template: `# Challenge: Paint Outer Border Frame
# Exposed function: paint_pixel(x, y, "color")

for y in range(16):
    for x in range(16):
        if x == 0 or x == 15 or y == 0 or y == 15:
            paint_pixel(x, y, "green")
`,
    validate: (cells) => {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const cellColor = cells[y * 16 + x];
          if (x === 0 || x === 15 || y === 0 || y === 15) {
            if (cellColor !== 'green') return false;
          } else {
            if (cellColor && cellColor !== '#0d1317') return false;
          }
        }
      }
      return true;
    }
  },
  {
    id: 'diagonals',
    title: 'Diagonal Cross X',
    description: 'Paint a massive X diagonal cross spanning from corner-to-corner.',
    template: `# Challenge: Paint Diagonal Cross X
# Exposed function: paint_pixel(x, y, "color")

for y in range(16):
    for x in range(16):
        if x == y or x == 15 - y:
            paint_pixel(x, y, "pink")
`,
    validate: (cells) => {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const cellColor = cells[y * 16 + x];
          if (x === y || x === 15 - y) {
            if (cellColor !== 'pink') return false;
          } else {
            if (cellColor && cellColor !== '#0d1317') return false;
          }
        }
      }
      return true;
    }
  }
];

export default function PixelArtPage() {
  const [selectedChallenge, setSelectedChallenge] = useState(CHALLENGES[0]);
  const [cells, setCells] = useState(Array(16 * 16).fill('#0d1317'));
  const [logs, setLogs] = useState(['Pixel canvas initialized. Exposing paint hooks to Python.']);
  const [resultMessage, setResultMessage] = useState(null);
  
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  const [code, setCode] = useState(CHALLENGES[0].template);

  // Sync editor template on challenge switch
  const handleChallengeChange = (challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.template);
    handleReset();
  };

  const handleReset = () => {
    setCells(Array(16 * 16).fill('#0d1317'));
    setResultMessage(null);
    setLogs(['Canvas reset. Board cleared.']);
  };

  // Load Pyodide
  const initPyodide = async () => {
    if (pyodide) return pyodide;
    setPyodideLoading(true);
    try {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/pyodide/pyodide.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load local Pyodide.'));
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

  const runCode = async () => {
    const py = await initPyodide();
    if (!py) return;

    // Reset grid initially
    const freshCells = Array(16 * 16).fill('#0d1317');
    setCells(freshCells);
    setResultMessage(null);
    setLogs(['Executing Python canvas script...']);

    // Map drawing color names to hex codes
    const colorMap = {
      cyan: Theme.neonCyan,
      pink: Theme.neonPink,
      green: Theme.neonGreen,
      yellow: Theme.neonYellow
    };

    // Inject paint_pixel JS API
    py.globals.set('paint_pixel', (x, y, color) => {
      const px = Math.floor(x);
      const py = Math.floor(y);
      if (px >= 0 && px < 16 && py >= 0 && py < 16) {
        const hex = colorMap[color] || color || Theme.neonCyan;
        freshCells[py * 16 + px] = color || 'cyan'; // store name for validation checks
      }
    });

    try {
      await py.runPythonAsync(code);
      
      // Update cell colors state
      const mappedHexes = freshCells.map(c => colorMap[c] || c);
      setCells(mappedHexes);

      // Validate pattern
      const isCorrect = selectedChallenge.validate(freshCells);
      if (isCorrect) {
        setLogs(prev => [...prev, '✓ Canvas rendering matches target pattern! Success.']);
        setResultMessage({
          success: true,
          text: 'Challenge Complete! Your loop logic drew the pattern perfectly.'
        });
      } else {
        setLogs(prev => [...prev, '[WARNING] Drawing completed, but grid values do not match target.']);
        setResultMessage({
          success: false,
          text: 'Validation Failed! The cell color mapping does not match the target pattern.'
        });
      }

    } catch (err) {
      setLogs(prev => [...prev, `[RUNTIME ERROR] ${err.message}`]);
      setResultMessage({
        success: false,
        text: 'Autopilot crash! Python script encountered a runtime exception.'
      });
    }
  };

  // Convert pixels to a PNG and trigger download offline
  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const pixelSize = 256 / 16;
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const color = cells[y * 16 + x];
        ctx.fillStyle = color === '#0d1317' ? '#070a0e' : color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        // Draw grid border for resolution
        ctx.strokeStyle = '#12181c';
        ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pixel_art_${selectedChallenge.id}.png`;
    link.href = dataUrl;
    link.click();
    setLogs(prev => [...prev, '📥 Exported pixel artwork as PNG file.']);
  };

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
            <Palette size={32} /> PYTHON PIXEL-ART PLAYGROUND
          </h1>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: Theme.muted }}>
            Write nested loops and conditions to paint glowing pixel-art designs on a retro 16x16 canvas.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={runCode}
            disabled={pyodideLoading}
            style={{
              background: Theme.neonGreen,
              color: '#0a0f12',
              border: 'none',
              borderRadius: 10,
              padding: '0.65rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: `0 0 12px ${Theme.neonGreen}`,
              transition: 'all 0.2s ease'
            }}
          >
            <Play size={16} /> {pyodideLoading ? 'Loading Engine...' : 'Render Pixels'}
          </button>
          <button
            onClick={downloadImage}
            style={{
              background: 'transparent',
              color: Theme.neonCyan,
              border: `1px solid ${Theme.neonCyan}`,
              borderRadius: 10,
              padding: '0.65rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: `0 0 8px rgba(0,243,255,0.15)`,
              transition: 'all 0.2s ease'
            }}
          >
            Export Art (.PNG)
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
          {/* Challenge Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {CHALLENGES.map(ch => (
              <button
                key={ch.id}
                onClick={() => handleChallengeChange(ch)}
                style={{
                  background: selectedChallenge.id === ch.id ? Theme.neonCyan : '#0c1217',
                  color: selectedChallenge.id === ch.id ? '#070a0e' : Theme.muted,
                  border: `1px solid ${selectedChallenge.id === ch.id ? Theme.neonCyan : Theme.border}`,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '2rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {ch.title}
              </button>
            ))}
          </div>

          <h2 style={{ margin: 0, fontSize: '0.9rem', color: Theme.neonCyan, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} /> PYTHON CANVAS ALGORITHM
          </h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: '100%',
              height: '300px',
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

        {/* Right Side: Pixel Canvas Monitor */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Pixel Art Grid Board */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(16, 1fr)',
              gap: '2px',
              width: '100%',
              maxWidth: 420,
              height: 280,
              padding: '0.75rem',
              background: '#070a0e',
              border: `2px solid ${Theme.border}`,
              borderRadius: 14,
              boxShadow: '0 4px 30px rgba(0,0,0,0.6)'
            }}>
              {cells.map((color, index) => (
                <div
                  key={index}
                  style={{
                    background: color,
                    border: '1px solid rgba(31,43,52,0.1)',
                    borderRadius: 2,
                    boxShadow: color !== '#0d1317' ? `0 0 6px ${color}` : 'none',
                    transition: 'all 0.15s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Description HUD */}
          <div style={{
            background: Theme.cardBg,
            border: `1px solid ${Theme.border}`,
            borderRadius: 16,
            padding: '1rem 1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <strong style={{ display: 'block', fontSize: '0.82rem', color: Theme.neonCyan, marginBottom: '0.3rem' }}>
              TARGET OBJECTIVE
            </strong>
            <p style={{ margin: 0, fontSize: '0.84rem', color: Theme.muted, lineHeight: 1.5 }}>
              {selectedChallenge.description}
            </p>
          </div>
        </div>
      </div>

      {/* Outcome Banner */}
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
              {resultMessage.success ? 'CHALLENGE COMPLETE!' : 'VALIDATION ERROR!'}
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: Theme.text }}>
              {resultMessage.text}
            </p>
          </div>
        </div>
      )}

      {/* Console execution log */}
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
          PIXEL GRID COORDINATE BUFFER LOGS
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
              color: log.includes('[ERROR]') || log.includes('[WARNING]') ? Theme.neonPink : log.includes('✓') ? Theme.neonGreen : Theme.neonCyan
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
