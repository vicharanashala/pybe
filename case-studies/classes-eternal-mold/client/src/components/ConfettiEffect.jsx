import React from 'react';
import { motion } from 'framer-motion';

const confettiPieces = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 0.5,
  color: ['bg-amber-400', 'bg-purple-400', 'bg-pink-400', 'bg-emerald-400', 'bg-orange-400'][i % 5],
  rotate: Math.random() * 360,
}));

export default function ConfettiEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ opacity: 1, y: -20, x: `${piece.x}%`, rotate: piece.rotate }}
          animate={{
            y: ['0%', '120%'],
            x: [`${piece.x}%`, `${piece.x + (Math.random() * 20 - 10)}%`],
            rotate: piece.rotate + 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.5,
            delay: piece.delay,
            ease: 'easeOut',
          }}
          className={`absolute w-2.5 h-2.5 rounded-sm ${piece.color} shadow-sm`}
        />
      ))}
    </div>
  );
}
