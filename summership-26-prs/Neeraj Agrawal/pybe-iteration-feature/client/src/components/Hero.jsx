import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onExplore, isCase1Completed }) => {
  return (
    <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 flex flex-col items-center text-center">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
          Master Python Iteration <br className="hidden md:block" />
          Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Real-World Stories</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
          Understand loops using Cricket over rules.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isCase1Completed ? (
            <button 
              onClick={onExplore}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all duration-300 transform hover:-translate-y-1">
              Start Learning
            </button>
          ) : (
            <button 
              onClick={onExplore}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all duration-300 transform hover:-translate-y-1">
              Revisit Case Study 1 🏏
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
