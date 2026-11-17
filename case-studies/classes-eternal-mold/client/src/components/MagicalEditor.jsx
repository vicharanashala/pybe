import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { motion } from 'framer-motion';
import { usePyodide } from '../usePyodide';
import ConsoleOutput from './ConsoleOutput';
import { useChapter } from '../context/ChapterContext';
import { handleOrionMisfire } from '../interceptorEngine';

export default function MagicalEditor() {
  const { currentChapter, chapterInfo, completeChapter, saveScroll } = useChapter();
  const [code, setCode] = useState(chapterInfo.initialCode);

  const { runPython, isRunning, isLoading, consoleOutput, setConsoleOutput, clearOutput } =
    usePyodide();

  useEffect(() => {
    setCode(chapterInfo.initialCode);
  }, [currentChapter, chapterInfo.initialCode]);

  const hasClassKeyword = code.includes('class');

  const handleCastSpell = async () => {
    clearOutput();
    saveScroll(currentChapter, code);

    setConsoleOutput([
      { type: 'system', text: `✨ Casting spell for Chapter ${currentChapter}...` },
    ]);

    const result = await runPython(code);

    if (result.success) {
      completeChapter();
      setConsoleOutput((prev) => [
        ...prev,
        {
          type: 'system',
          text: `🎉 Incantation Successful! Objective for Chapter ${currentChapter} complete.`,
        },
      ]);
    } else {
      const misfire = handleOrionMisfire(result.error, code);
      setConsoleOutput((prev) => [
        ...prev,
        {
          type: 'orion_misfire',
          text: misfire.message,
          raw: result.error,
        },
      ]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg overflow-hidden relative select-none p-5 text-white">
      {/* Chapter Title Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/15">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{chapterInfo.icon || '📜'}</span>
          <span className="text-sm font-bold font-serif-magical text-amber-300">
            {chapterInfo.title}
          </span>
        </div>

        {hasClassKeyword && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-1 bg-amber-950/80 border border-orange-400/60 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-amber-300 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
          >
            <span>✨</span>
            <span>Class Keyword Active</span>
          </motion.div>
        )}
      </div>

      {/* CodeMirror Editor (Top 68%) */}
      <div className="h-[68%] w-full my-3 rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-inner relative flex flex-col">
        <CodeMirror
          value={code}
          height="100%"
          theme="dark"
          extensions={[python()]}
          onChange={(val) => setCode(val)}
          className="w-full h-full font-mono text-sm leading-relaxed"
        />

        {/* Cast Spell Button */}
        <div className="absolute bottom-4 right-4 z-20">
          <motion.button
            whileHover={{ scale: 1.06, textShadow: '0px 0px 10px rgb(255,255,255)' }}
            whileTap={{ scale: 0.92 }}
            animate={isRunning || isLoading ? { scale: [1, 1.03, 1] } : {}}
            transition={isRunning || isLoading ? { repeat: Infinity, duration: 1 } : {}}
            onClick={handleCastSpell}
            disabled={isRunning || isLoading}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-serif-magical text-sm shadow-[0_4px_25px_rgba(249,115,22,0.5)] border border-white/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isRunning ? '🔮 Casting...' : '✨ Cast Spell'}</span>
          </motion.button>
        </div>
      </div>

      {/* Console Output (Bottom 28%) */}
      <div className="h-[28%] w-full">
        <ConsoleOutput output={consoleOutput} onClear={clearOutput} />
      </div>
    </div>
  );
}

