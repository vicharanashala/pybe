import { Terminal } from 'lucide-react';
import { motion } from 'motion/react';

interface CodeLine {
  text: string;
  indent: number;
}

function renderCodeLine(text: string) {
  if (text.trim().startsWith('#')) {
    return <span className="text-stone-500 italic">{text}</span>;
  }
  
  const parts = text.split(/("[^"]*"|\b(?:if|elif|else|match|case|True|False|in|while|for|break|class|def)\b|\b(?:print|cast_spell|add_ingredient|trigger_explosion|append|remove|blink_lights|tune_radio|close_portal|print_batch|hack_feed|drill|__init__|shoot_web)\b|\b(?:self|WebShooter)\b|[-]?\b\d+(?:\.\d+)?\b)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return <span key={i} className="text-green-700">{part}</span>;
    }
    if (['if', 'elif', 'else', 'match', 'case', 'in', 'while', 'for', 'break', 'class', 'def'].includes(part)) {
      return <span key={i} className="text-pink-700">{part}</span>;
    }
    if (['True', 'False'].includes(part)) {
      return <span key={i} className="text-purple-700">{part}</span>;
    }
    if (['print', 'cast_spell', 'add_ingredient', 'trigger_explosion', 'append', 'remove', 'blink_lights', 'tune_radio', 'close_portal', 'print_batch', 'hack_feed', 'drill', '__init__', 'shoot_web'].includes(part)) {
      return <span key={i} className="text-blue-700">{part}</span>;
    }
    if (['self', 'WebShooter'].includes(part)) {
      return <span key={i} className="text-cyan-700">{part}</span>;
    }
    if (/^[-]?\d+(?:\.\d+)?$/.test(part)) {
      return <span key={i} className="text-orange-700">{part}</span>;
    }
    return <span key={i} className="text-stone-800">{part}</span>;
  });
}

export function CodeViewer({ code, activeLineIndices = [] }: { code: CodeLine[], activeLineIndices?: number[] }) {
  return (
    <div className="bg-amber-100 rounded-2xl overflow-hidden border border-amber-300 shadow-sm h-full flex flex-col font-mono text-sm">
      <div className="bg-amber-200/60 px-4 py-3 border-b border-amber-300 flex items-center gap-2 shrink-0">
        <Terminal className="w-4 h-4 text-amber-800" />
        <span className="text-amber-900 font-bold tracking-wide text-xs">spell_logic.py</span>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        {code.map((line, index) => {
          const isActive = activeLineIndices.includes(index);
          
          return (
            <div
              key={index}
              className={`relative flex items-center py-1 px-2 rounded transition-colors duration-300 ${
                isActive ? 'bg-amber-300/40' : 'hover:bg-amber-200/30'
              }`}
            >
              <div className="w-6 text-right mr-4 text-amber-600 select-none text-xs">{index + 1}</div>
              <div 
                className={`transition-opacity duration-300 whitespace-pre flex-1 ${isActive ? 'text-stone-900 opacity-100 font-semibold' : 'text-stone-800 opacity-90'}`}
                style={{ paddingLeft: `${line.indent * 1.5}rem` }}
              >
                {renderCodeLine(line.text)}
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-line-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600 rounded-r"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
