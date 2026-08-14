import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { GitFork, X, Sparkles, RefreshCw, AlertTriangle, ZoomIn, ZoomOut, Maximize2, ShieldAlert, Cpu, Database, Network, Lock, Zap, Code, Terminal, Layers, Search, Workflow, Activity, CheckCircle, Flame, Eye, Box, Server, Shuffle, Globe } from 'lucide-react';
import api from '../lib/api';

function getConceptIcon(title = '', depth = 0, color = '#a855f7') {
  const t = (title || '').toLowerCase();
  const iconProps = { size: 16, color: color, style: { filter: `drop-shadow(0 0 5px ${color})`, flexShrink: 0 } };
  if (t.includes('risk') || t.includes('fraud') || t.includes('sec') || t.includes('shield') || t.includes('threat') || t.includes('alert') || t.includes('anom')) return <ShieldAlert {...iconProps} />;
  if (t.includes('net') || t.includes('stream') || t.includes('socket') || t.includes('connect') || t.includes('api') || t.includes('http') || t.includes('tcp') || t.includes('udp')) return <Network {...iconProps} />;
  if (t.includes('data') || t.includes('store') || t.includes('sql') || t.includes('db') || t.includes('cache') || t.includes('payload') || t.includes('buffer')) return <Database {...iconProps} />;
  if (t.includes('cpu') || t.includes('engine') || t.includes('compute') || t.includes('proc') || t.includes('core') || t.includes('rule')) return <Cpu {...iconProps} />;
  if (t.includes('speed') || t.includes('fast') || t.includes('velocity') || t.includes('zap') || t.includes('real-time') || t.includes('dynamic') || t.includes('promo')) return <Zap {...iconProps} />;
  if (t.includes('lock') || t.includes('auth') || t.includes('pass') || t.includes('token') || t.includes('crypt') || t.includes('user')) return <Lock {...iconProps} />;
  if (t.includes('loop') || t.includes('while') || t.includes('for') || t.includes('retry') || t.includes('iter') || t.includes('cycle')) return <RefreshCw {...iconProps} />;
  if (t.includes('check') || t.includes('val') || t.includes('test') || t.includes('verif') || t.includes('pass')) return <CheckCircle {...iconProps} />;
  if (t.includes('monitor') || t.includes('watch') || t.includes('eye') || t.includes('trace') || t.includes('behavior')) return <Eye {...iconProps} />;
  if (t.includes('code') || t.includes('py') || t.includes('func') || t.includes('class') || t.includes('mod') || t.includes('obj')) return <Code {...iconProps} />;
  if (t.includes('flow') || t.includes('pipeline') || t.includes('path') || t.includes('route') || t.includes('work') || t.includes('arch')) return <Workflow {...iconProps} />;
  if (t.includes('server') || t.includes('host') || t.includes('cloud') || t.includes('dist')) return <Server {...iconProps} />;
  if (t.includes('web') || t.includes('global') || t.includes('url') || t.includes('site') || t.includes('cart') || t.includes('e-comm')) return <Globe {...iconProps} />;
  
  const depthIcons = [
    <Flame {...iconProps} size={18} />,
    <Layers {...iconProps} />,
    <Box {...iconProps} />,
    <Terminal {...iconProps} />,
    <Activity {...iconProps} />,
    <Shuffle {...iconProps} />
  ];
  return depthIcons[depth % depthIcons.length] || <Sparkles {...iconProps} />;
}

/* ─────────────────────────────────────────────
   Layout engine: compute (x, y) for every node
   using a top-down tree layout algorithm
───────────────────────────────────────────── */
const NODE_W = 220;
const NODE_H = 84;
const H_GAP = 32;   // horizontal gap between siblings
const V_GAP = 84;   // vertical gap between levels

function computeLayout(node, depth = 0) {
  if (!node) return null;
  const children = (node.children || []).map(c => computeLayout(c, depth + 1));
  const subtreeWidth = children.length
    ? children.reduce((sum, c) => sum + c.subtreeWidth, 0) + H_GAP * (children.length - 1)
    : NODE_W;
  return { ...node, children, depth, subtreeWidth };
}

function assignX(node, startX = 0) {
  if (!node) return;
  if (!node.children || node.children.length === 0) {
    node.x = startX + node.subtreeWidth / 2;
    return;
  }
  let cursor = startX;
  for (const child of node.children) {
    assignX(child, cursor);
    cursor += child.subtreeWidth + H_GAP;
  }
  const first = node.children[0];
  const last = node.children[node.children.length - 1];
  node.x = (first.x + last.x) / 2;
}

function assignY(node, y = 0) {
  if (!node) return;
  node.y = y;
  for (const child of node.children || []) {
    assignY(child, y + NODE_H + V_GAP);
  }
}

function flattenNodes(node, acc = []) {
  if (!node) return acc;
  acc.push(node);
  for (const child of node.children || []) flattenNodes(child, acc);
  return acc;
}

function flattenEdges(node, acc = []) {
  if (!node) return acc;
  for (const child of node.children || []) {
    acc.push({ from: node, to: child });
    flattenEdges(child, acc);
  }
  return acc;
}

/* ─────────────────────────────────────────────
   Colour palette for depth levels
───────────────────────────────────────────── */
const DEPTH_COLORS = [
  '#a855f7', // root – vivid purple
  '#6366f1', // level 1 – indigo
  '#06b6d4', // level 2 – cyan
  '#10b981', // level 3 – emerald
  '#f59e0b', // level 4 – amber
  '#ef4444', // level 5 – red
];
const depthColor = (d) => DEPTH_COLORS[Math.min(d, DEPTH_COLORS.length - 1)];

/* ─────────────────────────────────────────────
   Main modal
───────────────────────────────────────────── */
export default function ConceptTreeModal({ onClose, activeScenario, initialTopic, autoGenerate = false }) {
  const [topic, setTopic] = useState(initialTopic || activeScenario?.title || 'Loops');
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);

  const fetchTree = async (targetTopic) => {
    setLoading(true);
    setError('');
    setSelectedNode(null);
    setTreeData(null);
    try {
      const { data } = await api.post('/scenarios/generate-tree', { topic: targetTopic });
      if (data.success && data.data?.root) {
        setTreeData(data.data);
        setZoom(1);
      } else {
        throw new Error('Invalid concept tree response from AI API.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate concept tree.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      if (autoGenerate) {
        fetchTree(initialTopic);
      }
    } else if (activeScenario?.title) {
      setTopic(activeScenario.title);
    }
  }, [activeScenario, initialTopic, autoGenerate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) fetchTree(topic.trim());
  };


  /* Build SVG layout */
  let svgContent = null;
  let svgW = 800, svgH = 400;

  if (treeData?.root) {
    const laid = computeLayout(treeData.root);
    assignX(laid, 0);
    assignY(laid, 0);
    const nodes = flattenNodes(laid);
    const edges = flattenEdges(laid);

    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs) - NODE_W / 2 - 40;
    const maxX = Math.max(...xs) + NODE_W / 2 + 40;
    const minY = Math.min(...ys) - 40;
    const maxY = Math.max(...ys) + NODE_H + 40;
    svgW = maxX - minX;
    svgH = maxY - minY;
    const ox = -minX;
    const oy = -minY;

    svgContent = (
      <svg
        width={svgW}
        height={svgH}
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          {DEPTH_COLORS.map((c, i) => (
            <filter key={i} id={`glow-${i}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
          <filter id="glow-node" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map(({ from, to }, i) => {
          const x1 = from.x + ox;
          const y1 = from.y + oy + NODE_H;
          const x2 = to.x + ox;
          const y2 = to.y + oy;
          const midY = (y1 + y2) / 2;
          const color = depthColor(from.depth);
          return (
            <path
              key={i}
              d={`M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeOpacity="0.7"
              style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const nx = node.x + ox - NODE_W / 2;
          const ny = node.y + oy;
          const color = node.color || depthColor(node.depth);
          const isSelected = selectedNode?.title === node.title;
          const isRoot = node.depth === 0;

          return (
            <g
              key={i}
              onClick={() => setSelectedNode(isSelected ? null : node)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow ring on selected */}
              {isSelected && (
                <rect
                  x={nx - 4} y={ny - 4}
                  width={NODE_W + 8} height={NODE_H + 8}
                  rx="14" ry="14"
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeOpacity="0.9"
                  style={{ filter: `drop-shadow(0 0 12px ${color})` }}
                />
              )}

              {/* Card background */}
              <rect
                x={nx} y={ny}
                width={NODE_W} height={NODE_H}
                rx="12" ry="12"
                fill={isRoot ? 'rgba(28,15,50,0.98)' : 'rgba(18,12,38,0.96)'}
                stroke={color}
                strokeWidth={isRoot ? 2 : 1.5}
                style={{ filter: isRoot ? `drop-shadow(0 0 16px ${color}88)` : `drop-shadow(0 0 8px ${color}44)` }}
              />

              {/* Node Card Content with Diagram Logo Badge */}
              <foreignObject x={nx + 6} y={ny + 6} width={NODE_W - 12} height={NODE_H - 12}>
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '2px 6px',
                    boxSizing: 'border-box',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {/* Top row: Icon + Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: `${color}18`,
                      border: `1px solid ${color}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${color}22`
                    }}>
                      {getConceptIcon(node.title, node.depth, color)}
                    </div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: isRoot ? '12.5px' : '11px',
                      color: '#ffffff',
                      lineHeight: '1.2',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}>
                      {node.title}
                    </div>
                  </div>

                  {/* Bottom row: Ultra-short readable description */}
                  <div style={{
                    fontSize: '10px',
                    color: '#cbd5e1',
                    lineHeight: '1.3',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    paddingLeft: '36px',
                    fontWeight: 400,
                  }}>
                    {node.desc}
                  </div>
                </div>
              </foreignObject>

              {/* Depth badge (root only) */}
              {isRoot && (
                <>
                  <rect x={nx + NODE_W / 2 - 42} y={ny - 11} width={84} height={18} rx="9" fill={color} />
                  <text
                    x={nx + NODE_W / 2} y={ny - 1}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                  >
                    ROOT CONCEPT
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  return ReactDOM.createPortal(
    <div
      className="python-sandbox-overlay"
      onClick={onClose}
      style={{ zIndex: 99999, alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '96vw',
          maxWidth: '1300px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(10, 7, 22, 0.98)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          borderRadius: '18px',
          boxShadow: '0 0 80px rgba(168, 85, 247, 0.25), 0 40px 120px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 100000,
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 22px',
          background: 'rgba(168, 85, 247, 0.08)',
          borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitFork size={22} style={{ color: '#a855f7', filter: 'drop-shadow(0 0 8px #a855f7)' }} />
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem' }}>AI Concept Tree Generator</div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Interactive 2D mind map · Powered by AI</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Zoom controls */}
            {treeData && (
              <>
                <button onClick={() => setZoom(z => Math.max(0.3, z - 0.15))} style={btnStyle}>
                  <ZoomOut size={16} />
                </button>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', minWidth: '40px', textAlign: 'center' }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button onClick={() => setZoom(z => Math.min(2, z + 0.15))} style={btnStyle}>
                  <ZoomIn size={16} />
                </button>
                <button onClick={() => setZoom(1)} style={btnStyle}>
                  <Maximize2 size={16} />
                </button>
              </>
            )}
            <button onClick={onClose} style={{ ...btnStyle, marginLeft: '8px', color: '#ef4444' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Search bar ── */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '12px 22px',
          borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
          background: 'rgba(23, 17, 46, 0.6)',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}>
          <span style={{ color: '#d8b4fe', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Concept / Topic:
          </span>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. BFS, Loops, Recursion, Stacks, Django Models…"
            style={{
              flex: 1, minWidth: '220px',
              padding: '9px 14px',
              borderRadius: '10px',
              background: 'rgba(17, 10, 35, 0.9)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 20px',
              borderRadius: '10px',
              background: loading ? 'rgba(168,85,247,0.4)' : 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 18px rgba(168,85,247,0.4)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading
              ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
              : <><Sparkles size={15} /> Generate Tree</>}
          </button>
          {activeScenario && (
            <div style={{
              fontSize: '0.75rem', color: '#d8b4fe',
              background: 'rgba(168,85,247,0.12)',
              padding: '5px 12px', borderRadius: '20px',
              border: '1px solid rgba(168,85,247,0.25)',
            }}>
              📌 Context: <strong>{activeScenario.title}</strong>
            </div>
          )}
        </form>

        {/* ── Canvas ── */}
        <div
          ref={canvasRef}
          style={{
            flex: 1,
            overflow: 'auto',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.06) 0%, #07050e 60%)',
            position: 'relative',
            padding: '30px',
          }}
        >
          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(127,29,29,0.55)', border: '1px solid rgba(239,68,68,0.5)',
              color: '#fca5a5', padding: '12px 16px', borderRadius: '10px',
              marginBottom: '20px', fontSize: '0.9rem',
            }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '20px', height: '100%', minHeight: '340px',
              color: '#c084fc',
            }}>
              <RefreshCw size={44} style={{ animation: 'spin 1.2s linear infinite', filter: 'drop-shadow(0 0 16px #a855f7)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Building your AI Concept Tree…</div>
                <div style={{ fontSize: '0.82rem', color: '#9333ea', marginTop: '6px' }}>Topic: <strong>"{topic}"</strong></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '280px' }}>
                {[
                  'Generating root concept & branches…',
                  'Expanding branch 1 details…',
                  'Expanding branch 2 details…',
                  'Expanding branch 3 details…',
                  'Expanding branch 4 details…',
                ].map((step, i) => (
                  <LoadingStep key={i} label={step} index={i} />
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '4px' }}>
                Making 5 small API calls to stay within rate limits (~25s)
              </div>
            </div>
          )}

          {/* SVG Tree */}
          {!loading && svgContent && (
            <div style={{ display: 'inline-block', transformOrigin: 'top left', transform: `scale(${zoom})`, transition: 'transform 0.2s' }}>
              {svgContent}
            </div>
          )}

          {/* Empty state */}
          {!loading && !treeData && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '60px', color: '#cbd5e1', maxWidth: '520px', margin: '0 auto' }}>
              <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 0 25px rgba(168, 85, 247, 0.2)' }}>
                <GitFork size={38} style={{ color: '#a855f7', filter: 'drop-shadow(0 0 6px #a855f7)' }} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0' }}>Ready to Build Your AI Concept Tree</h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                Type any Python or Computer Science concept in the box above and click <strong style={{ color: '#d8b4fe' }}>Generate Tree</strong> to create an interactive AI-powered 2D mind map.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>Try a concept:</span>
                {['DFS (Depth-First Search)', 'BFS (Breadth-First Search)', 'Recursion', 'Binary Search Trees', 'Python Decorators'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setTopic(chip);
                      fetchTree(chip);
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      color: '#e9d5ff',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    ✨ {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Selected node drawer ── */}
        {selectedNode && (
          <div style={{
            padding: '14px 22px',
            background: 'rgba(26,18,52,0.97)',
            borderTop: `1px solid ${selectedNode.color || '#a855f7'}`,
            flexShrink: 0,
            display: 'flex', alignItems: 'flex-start', gap: '12px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: selectedNode.color || '#a855f7',
              boxShadow: `0 0 10px ${selectedNode.color || '#a855f7'}`,
              flexShrink: 0, marginTop: '6px',
            }} />
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                {selectedNode.title}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6' }}>
                {selectedNode.desc}
              </div>
            </div>
            <button onClick={() => setSelectedNode(null)} style={{ ...btnStyle, marginLeft: 'auto', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

const btnStyle = {
  background: 'rgba(168,85,247,0.12)',
  border: '1px solid rgba(168,85,247,0.25)',
  borderRadius: '8px',
  color: '#c084fc',
  cursor: 'pointer',
  padding: '6px 8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.15s',
};

/**
 * Animated loading step — each step lights up ~5 seconds after the previous one
 * to match the actual backend multi-call timing.
 */
function LoadingStep({ label, index }) {
  const [active, setActive] = React.useState(false);
  useEffect(() => {
    const t = setTimeout(() => setActive(true), index * 5000);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '7px 12px',
      borderRadius: '8px',
      background: active ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${active ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.06)'}`,
      transition: 'all 0.5s ease',
      opacity: active ? 1 : 0.35,
    }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: active ? '#a855f7' : '#374151',
        boxShadow: active ? '0 0 8px #a855f7' : 'none',
        flexShrink: 0,
        transition: 'all 0.4s',
      }} />
      <span style={{ fontSize: '0.8rem', color: active ? '#e9d5ff' : '#6b7280', transition: 'color 0.4s' }}>
        {label}
      </span>
      {active && (
        <RefreshCw size={12} style={{ marginLeft: 'auto', animation: 'spin 1s linear infinite', color: '#a855f7', flexShrink: 0 }} />
      )}
    </div>
  );
}
