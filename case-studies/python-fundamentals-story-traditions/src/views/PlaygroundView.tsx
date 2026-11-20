import {createStoryPythonHook} from '../../../../shared/story-python.mjs';
import {buildStoryConsoleProgram} from '../../../../shared/story-console-python.mjs';
const useStoryPython=createStoryPythonHook(React);
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, StoryHeader } from '../components/Ornaments';
import { ArrowLeft, ArrowRight, Play, HelpCircle, RefreshCw } from 'lucide-react';
import {topicSetups} from '../utils/pythonExamples';
import { getTopic, parseAssignment } from '../data/curriculum';

interface ConsoleLine {
  type: 'input' | 'output' | 'error';
  text: string;
}

export const PlaygroundView: React.FC = () => {
  const { vaultState, replaceVault, updateVault, resetVault, nextStep, prevStep, activeTopicId } = useProgress();
  const {run,running}=useStoryPython();
  const previous=useRef<string[]>([]),initialVault=useRef({...vaultState});
  const topic = getTopic(activeTopicId);
  const varName = topic.playground.variableName;
  const presets = topic.playground.presets;

  const assignment = useMemo(() => {
    if (activeTopicId === 'dictionaries') return null;
    const firstPreset = presets[0];
    if (!firstPreset) return null;
    return parseAssignment(firstPreset.cmd);
  }, [activeTopicId, presets]);

  const [variableState, setVariableState] = useState<Record<string, string>>(() => {
    if (assignment) return { [assignment.name]: assignment.value };
    return {};
  });

  const [command, setCommand] = useState<string>('');
  const [history, setHistory] = useState<ConsoleLine[]>(() => {
    const lines: ConsoleLine[] = [{ type: 'output', text: '# Python Shell Initialized.' }];
    if (varName) {
      lines.push({ type: 'output', text: `# The active lesson variable is named "${varName}".` });
    }
    return lines;
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommandSubmit = async(cmdString:string) => {
    const trimmed=cmdString.trim();if(!trimmed||running)return;
    setCommand('');setHistory(prev=>[...prev,{type:'input',text:'>>> '+trimmed}]);
    const initial=activeTopicId==='dictionaries'?`vault = __import__('json').loads(${JSON.stringify(JSON.stringify(initialVault.current))})`:assignment?`${assignment.name} = ${assignment.value}`:'';
    const result=await run(buildStoryConsoleProgram((topicSetups[activeTopicId]||'')+'\n'+initial,previous.current,trimmed));
    if(result.error){setHistory(prev=>[...prev,{type:'error',text:result.error}]);return;}
    const at=result.output.lastIndexOf('__PYBE_CONSOLE__');
    if(at<0){setHistory(prev=>[...prev,{type:'error',text:'The console could not read the result. Try resetting this activity.'}]);return;}
    previous.current.push(trimmed);
    const snapshot=JSON.parse(result.output.slice(at+'__PYBE_CONSOLE__'.length));
    if(activeTopicId==='dictionaries'&&snapshot.vault&&typeof snapshot.vault==='object')replaceVault(snapshot.vault);
    const output=result.output.slice(0,at).trimEnd();if(output)setHistory(prev=>[...prev,{type:'output',text:output}]);
  };

  const handleReset = () => {
    if(running)return;
    previous.current=[];
    if (activeTopicId === 'dictionaries') {
      resetVault();
    } else if (assignment) {
      setVariableState({ [assignment.name]: assignment.value });
    }
    setHistory(prev => [
      ...prev,
      { type: 'output', text: '# Variable state reset.' },
    ]);
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-5xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        <StoryHeader topic={topic} />

        <div className="flex justify-end mb-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-parchment-border dark:border-parchment-darkBorder text-gray-500 hover:text-royal-crimson hover:bg-white dark:hover:bg-parchment-darkCard transition-all duration-300 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Vault</span>
          </button>
        </div>

        {/* Master columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-6">
          {/* Left panel: Guides and Presets (md:span-4) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-serif font-bold text-royal-indigo dark:text-royal-gold uppercase tracking-wider mb-2 flex items-center gap-1">
                <HelpCircle className="w-4 h-4" />
                <span>Command Ledger</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                {topic.playground.intro}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCommand(preset.cmd);
                  }}
                  className="text-left p-2.5 rounded-lg bg-white/60 dark:bg-parchment-darkCard/50 border border-parchment-border dark:border-parchment-darkBorder hover:border-royal-gold transition-colors text-xs flex flex-col gap-1"
                >
                  <span className="font-semibold text-royal-indigo dark:text-royal-gold uppercase text-[9px] tracking-wide">
                    {preset.label}
                  </span>
                  <code className="font-mono text-royal-crimson dark:text-green-400 bg-black/5 dark:bg-black/30 px-1 py-0.5 rounded select-all">
                    {preset.cmd}
                  </code>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: Terminal Simulator (md:span-8) */}
          <div className="md:col-span-8 flex flex-col border border-royal-gold/20 rounded-2xl overflow-hidden shadow-lg">
            {/* Window bar */}
            <div className="bg-royal-indigo/20 dark:bg-black/50 px-4 py-2 flex items-center justify-between border-b border-royal-gold/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-[10px] font-mono font-bold text-royal-indigo dark:text-royal-gold">
                interpreter.py (Simulated)
              </span>
            </div>

            {/* Scrollable command history */}
            <div className="bg-royal-indigo dark:bg-black/40 p-5 h-72 overflow-y-auto flex flex-col gap-2 font-mono text-xs text-white border-b border-royal-gold/20 select-text">
              {history.map((line, idx) => {
                let colorClass = 'text-gray-300';
                if (line.type === 'input') colorClass = 'text-royal-gold font-semibold';
                if (line.type === 'error') colorClass = 'text-red-400 font-bold';
                if (line.type === 'output' && line.text.startsWith('#')) colorClass = 'text-gray-500 italic';
                if (line.type === 'output' && !line.text.startsWith('#')) colorClass = 'text-green-400';

                return (
                  <div key={idx} className={colorClass}>
                    {line.text}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* User Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommandSubmit(command);
              }}
              className="bg-black/90 p-3 flex items-center gap-2 border-t border-royal-gold/10"
            >
              <span className="font-mono text-xs text-royal-gold font-bold select-none">&gt;&gt;&gt;</span>
              <input
                type="text"
                value={command} disabled={running}
                onChange={(e) => setCommand(e.target.value)}
                placeholder={varName ? `Type Python command (e.g., print(${varName})) and press Enter...` : 'Type a command from the left panel and press Enter...'}
                className="flex-1 bg-transparent focus:outline-none text-white font-mono text-xs md:text-sm"
              />
              <button
                type="submit" disabled={running}
                className="p-1.5 rounded bg-royal-crimson hover:bg-royal-crimsonHover text-white transition-colors"
                aria-label="Submit command"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex justify-between items-center pt-4 border-t border-parchment-border dark:border-parchment-darkBorder">
          <button
            onClick={prevStep}
            className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-royal-indigo transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20"
          >
            <span>Proceed to Court Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </ManuscriptCard>
    </div>
  );
};
