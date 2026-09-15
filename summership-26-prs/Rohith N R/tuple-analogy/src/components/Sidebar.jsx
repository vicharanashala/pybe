import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ListOrdered,
  Lock,
  Briefcase,
  BatteryCharging,
  ChevronLeft,
  ChevronRight,
  NotebookPen
} from 'lucide-react';

export  const links = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      color: 'bg-yellow-300',
      level: 0
    },
    {
      path: '/ordered',
      label: '1. Bittu & Biscuits',
      icon: ListOrdered,
      color: 'bg-emerald-400',
      level: 1
    },
    {
      path: '/heterogeneous',
      label: '2. Only Biscuits',
      icon: Briefcase,
      color: 'bg-amber-400',
      level: 2
    },
    {
      path: '/nested',
      label: '3. Remote',
      icon: BatteryCharging,
      color: 'bg-orange-400',
      level: 3
    },
    {
      path: '/finalTest',
      label: '4. Final Test',
      icon: NotebookPen,
      color: 'bg-pink-400',
      level: 4
    }
  ];


export default function Sidebar() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(true);

  // Track the highest unlocked level
  const [unlockedLevel, setUnlockedLevel] = useState(1);

  // Sync lock state with LocalStorage
  useEffect(() => {
    const updateLevel = () => {
      const level = parseInt(
        localStorage.getItem('unlockedLevel') || '1'
      );

      setUnlockedLevel(level);
    };

    // Check on mount
    updateLevel();

    // Listen for changes
    window.addEventListener('levelUnlocked', updateLevel);

    return () => {
      window.removeEventListener('levelUnlocked', updateLevel);
    };
  }, []);

 
  const handleReset = () => {
    localStorage.removeItem('unlockedLevel');
    location.pathname === "/home";

    // Tell Sidebar to update immediately
    window.dispatchEvent(new Event('levelUnlocked'));
  };

  return (
    <motion.nav
      initial={false}
      animate={{
        width: isOpen ? 256 : 96
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
      className="bg-[#FFF8E7]/95 border-r-4 border-black flex flex-col min-h-screen shrink-0 relative z-50"
    >

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-5 top-8 bg-[#FFF8E7]/95 border-4 border-black shadow-[6px_0_15px_rgba(0,0,0,0.12)] rounded-full p-1 hover:bg-[#FFF8E7] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all z-[60]"
      >
        {isOpen ? (
          <ChevronLeft size={20} strokeWidth={3} />
        ) : (
          <ChevronRight size={20} strokeWidth={3} />
        )}
      </button>

      {/* Header */}
      <div
        className={`mt-6 mb-8 flex ${
          isOpen
            ? 'px-6 justify-start'
            : 'px-0 justify-center'
        }`}
      >
        <h1 className="text-2xl font-black uppercase tracking-tight overflow-hidden whitespace-nowrap">
          {isOpen ? (
            <>
              Bittu's
              <br />
              World
            </>
          ) : (
            <span className="text-3xl">BW</span>
          )}
        </h1>
      </div>

      {/* Navigation Links */}
      <div
        className={`flex flex-col gap-4 ${
          isOpen ? 'px-6' : 'px-4'
        }`}
      >
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          // Check whether this link is locked
          const isLocked = link.level > unlockedLevel;

          const Icon = isLocked ? Lock : link.icon;

          const content = (
            <motion.div
              whileHover={
                !isLocked
                  ? {
                      x: 4,
                      y: -4,
                      boxShadow:
                        '4px 4px 0px 0px rgba(0,0,0,1)'
                    }
                  : {}
              }
              whileTap={
                !isLocked
                  ? {
                      x: 0,
                      y: 0,
                      boxShadow:
                        '0px 0px 0px 0px rgba(0,0,0,1)'
                    }
                  : {}
              }
              className={`flex items-center rounded-xl border-4 border-black font-bold transition-colors overflow-hidden ${
                isOpen
                  ? 'p-4 gap-3'
                  : 'p-4 justify-center'
              } ${
                isLocked
                  ? 'bg-zinc-200 text-zinc-400 border-zinc-400 cursor-not-allowed opacity-75'
                  : isActive
                    ? link.color
                    : 'bg-[#FFF8E7] hover:bg-white'
              }`}
              title={
                isLocked
                  ? 'Score 50% in the previous section to unlock!'
                  : !isOpen
                    ? link.label
                    : ''
              }
            >
              <Icon
                size={24}
                strokeWidth={2.5}
                className="shrink-0"
              />

              {isOpen && (
                <span className="whitespace-nowrap">
                  {link.label}
                </span>
              )}
            </motion.div>
          );

          // Locked = visual only
          if (isLocked) {
            return (
              <div key={link.path}>
                {content}
              </div>
            );
          }

          // Unlocked = clickable
          return (
            <Link
              key={link.path}
              to={link.path}
            >
              {content}
            </Link>
          );
        })}
      </div>

      {/* Bottom Reset Button */}
      <div
        className={`mt-auto ${
          isOpen ? 'px-6' : 'px-4'
        } pb-4 pt-6`}
      >
        <button
          onClick={handleReset}
          className={`w-full py-2 bg-red-400 border-4 border-black font-black rounded-lg
            hover:-translate-y-1
            hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            active:translate-y-0
            active:shadow-none
            transition-all duration-300
            ${
              isOpen
                ? 'px-2'
                : 'px-1 text-sm'
            }`}
        >
          {isOpen ? 'RESET PROGRESS' : 'RESET'}
        </button>
      </div>

    </motion.nav>
  );
}