import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const BadgeToast = () => {
  const { newBadgeToast, setNewBadgeToast } = useGame();

  useEffect(() => {
    if (newBadgeToast) {
      const timer = setTimeout(() => {
        setNewBadgeToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newBadgeToast, setNewBadgeToast]);

  if (!newBadgeToast) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="badge-toast"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          zIndex: 9990,
          background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.95), rgba(10, 10, 25, 0.95))',
          backdropFilter: 'blur(16px)',
          border: '2px solid var(--accent)',
          borderRadius: '20px',
          padding: '20px 24px',
          boxShadow: '0 10px 40px rgba(242, 201, 76, 0.3), 0 0 20px rgba(255, 46, 147, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          maxWidth: '400px'
        }}
      >
        <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(242, 201, 76, 0.6))' }}>
          {newBadgeToast.icon}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Sparkles size={14} /> BADGE UNLOCKED! (+50 XP)
          </div>
          <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: '4px 0 2px 0' }}>
            {newBadgeToast.title}
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.3' }}>
            {newBadgeToast.desc}
          </p>
        </div>
        <button
          onClick={() => setNewBadgeToast(null)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
