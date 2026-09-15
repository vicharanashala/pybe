import React from 'react';

const Navbar = ({ onNavigate }) => {
  return (
    <nav className="fixed w-full z-50 glassmorphism border-b-0 rounded-none bg-slate-900/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="font-bold text-xl tracking-tight text-white">LoopCraft 🏏</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              Python Iteration
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => onNavigate('home')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
