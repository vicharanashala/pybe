import { Play, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function IntroductionPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto w-full flex flex-col items-center bg-[#FDF8F0] text-stone-800">
      {/* Hero Section */}
      <section className="w-full max-w-5xl px-8 py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center mb-8 border border-amber-300 shadow-sm rotate-3"
        >
          <Sparkles className="w-12 h-12 text-amber-600" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-amber-950"
        >
          You've Been Accepted!
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-stone-600 max-w-3xl mb-12 leading-relaxed font-medium"
        >
          Your letter to Hogwarts has finally arrived. Grab your wand and board the Hogwarts Express. 
          Your journey to mastering Python logic begins now.
        </motion.p>
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={onStart}
          className="px-10 py-5 bg-amber-700 hover:bg-amber-600 text-white font-black text-xl rounded-2xl shadow-lg transition-all flex items-center gap-4 cursor-pointer group"
        >
          <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          Board the Hogwarts Express
        </motion.button>
      </section>
      
      <footer className="py-12 text-stone-500 text-sm font-bold tracking-wider uppercase mt-auto">
        Interactive learning powered by Pybe
      </footer>
    </div>
  );
}
