import React, { useRef, useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type SpellType = 'Protego' | 'Expelliarmus' | 'Riddikulus' | 'Expecto Patronum' | 'Stupefy' | 'Unknown';

interface Point { x: number; y: number }

function recognizeSpell(points: Point[]): SpellType {
  if (points.length < 5) return 'Unknown';
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  
  const width = maxX - minX;
  const height = maxY - minY;
  const maxDim = Math.max(width, height);
  if (maxDim < 20) return 'Unknown'; // Too small
  
  const start = points[0];
  const end = points[points.length - 1];
  const startEndDist = Math.hypot(end.x - start.x, end.y - start.y);
  
  let reversalsX = 0;
  let reversalsY = 0;
  let lastDx = 0;
  let lastDy = 0;
  
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i-1].x;
    const dy = points[i].y - points[i-1].y;
    
    if (Math.abs(dx) > 2) {
      if (lastDx !== 0 && Math.sign(dx) !== Math.sign(lastDx)) reversalsX++;
      lastDx = dx;
    }
    if (Math.abs(dy) > 2) {
      if (lastDy !== 0 && Math.sign(dy) !== Math.sign(lastDy)) reversalsY++;
      lastDy = dy;
    }
  }

  if (reversalsX >= 3 || reversalsY >= 3) {
    return 'Riddikulus';
  } else if (startEndDist < maxDim * 0.35) {
    return 'Protego';
  } else if (width > height * 1.5) {
    return 'Expelliarmus';
  } else if (height > width * 1.5) {
    return 'Stupefy';
  } else {
    return 'Expecto Patronum';
  }
}

export function SpellReference({ spell, hint, path }: { spell: string, hint: string, path: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider whitespace-nowrap">{spell}</div>
      <div className="relative w-16 h-16 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-center p-2 group shadow-sm">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(217,119,6,0.3)]">
           <path d={path} fill="none" stroke="#d97706" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="absolute inset-0 bg-stone-800/90 items-center justify-center text-[10px] text-amber-50 font-medium text-center p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex">
          {hint}
        </div>
      </div>
    </div>
  );
}

export const SPELL_REFS = {
  'Protego': { hint: 'Draw a circle', path: 'M 50 10 A 40 40 0 1 1 49.9 10' },
  'Expelliarmus': { hint: 'Horizontal line', path: 'M 10 50 L 90 50' },
  'Stupefy': { hint: 'Vertical line', path: 'M 50 10 L 50 90' },
  'Riddikulus': { hint: 'Zig-zag', path: 'M 10 90 L 30 10 L 50 90 L 70 10 L 90 90' },
  'Expecto Patronum': { hint: 'Swirl or arc', path: 'M 20 80 Q 50 10 80 80' },
};

export function SpellCanvas({ 
  onSpellCast,
  disabled
}: { 
  onSpellCast: (spell: string) => void,
  disabled?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (result && !disabled) {
       timeout = setTimeout(() => {
         setResult(null);
         setPoints([]);
         const canvas = canvasRef.current;
         if (canvas) {
           const ctx = canvas.getContext('2d');
           if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
         }
       }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [result, disabled]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (result) {
       setResult(null);
       setPoints([]);
       const canvas = canvasRef.current;
       if (canvas) {
         const ctx = canvas.getContext('2d');
         if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
       }
    }
    const coords = getCoordinates(e);
    if (coords) {
      setIsDrawing(true);
      setPoints([coords]);
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.beginPath();
          ctx.moveTo(coords.x, coords.y);
        }
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || disabled) return;
    const coords = getCoordinates(e);
    if (coords) {
      setPoints(prev => [...prev, coords]);
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(217, 119, 6, 0.3)';
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();
        }
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const spell = recognizeSpell(points);
    setResult(spell);
    onSpellCast(spell);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className={`relative w-64 h-64 bg-white rounded-3xl border-2 border-stone-400 shadow-sm overflow-hidden ${disabled ? 'opacity-80' : 'touch-none'}`}>
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          style={{ cursor: "url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M12%202v20m-10-10h20%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%2F%3E%3C%2Fsvg%3E') 12 12, crosshair" }}
          className={`w-full h-full relative z-10 ${disabled ? 'pointer-events-none' : ''}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        <div className="absolute top-4 left-4 text-amber-900/40 text-xs flex items-center gap-1 pointer-events-none z-0 font-bold">
          <Wand2 className="w-3 h-3" /> Draw Spell
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20 pointer-events-none"
            >
              <div className="text-xl md:text-2xl font-black text-amber-600 tracking-widest uppercase px-4 text-center">
                {result === 'Unknown' ? 'No spell detected!' : `${result}!`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
