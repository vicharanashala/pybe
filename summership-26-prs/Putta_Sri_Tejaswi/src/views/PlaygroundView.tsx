import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, StoryHeader } from '../components/Ornaments';
import { ArrowLeft, ArrowRight, Play, HelpCircle, RefreshCw } from 'lucide-react';
import { getTopic, parseAssignment } from '../data/curriculum';

interface ConsoleLine {
  type: 'input' | 'output' | 'error';
  text: string;
}

export const PlaygroundView: React.FC = () => {
  const { vaultState, updateVault, resetVault, nextStep, prevStep, activeTopicId } = useProgress();
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

  const handleCommandSubmit = (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    const newLines: ConsoleLine[] = [{ type: 'input', text: `>>> ${trimmed}` }];

    if (activeTopicId !== 'dictionaries') {
      const preset = presets.find(item => item.cmd === trimmed);
      if (preset) {
        newLines.push({ type: 'output', text: preset.output });
      } else if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        const inner = trimmed.slice(6, -1).trim();
        const matchedPreset = presets.find(item => item.cmd === inner);
        if (matchedPreset) {
          newLines.push({ type: 'output', text: matchedPreset.output });
        } else if (variableState[inner] !== undefined) {
          newLines.push({ type: 'output', text: variableState[inner] });
        } else {
          newLines.push({ type: 'output', text: inner });
        }
      } else if (assignment && trimmed.startsWith(`${assignment.name} =`)) {
        const newValue = trimmed.slice(trimmed.indexOf('=') + 1).trim();
        setVariableState(prev => ({ ...prev, [assignment.name]: newValue }));
        newLines.push({ type: 'output', text: `# ${assignment.name} = ${newValue}` });
      } else {
        newLines.push({ type: 'error', text: `This guided ${topic.title} chamber recognises the lesson examples. Choose a template from the left panel or try print(${varName ?? 'variable'}).` });
      }
      setHistory(prev => [...prev, ...newLines]);
      setCommand('');
      return;
    }
    
    // Simple JavaScript-based regex parser for Python dictionary commands
    try {
      // 1. print(vault)
      if (trimmed === 'print(vault)' || trimmed === 'vault') {
        newLines.push({ 
          type: 'output', 
          text: JSON.stringify(vaultState).replace(/"/g, "'").replace(/,/g, ", ").replace(/:/g, ": ") 
        });
      }
      
      // 2. len(vault)
      else if (trimmed === 'len(vault)') {
        newLines.push({ type: 'output', text: Object.keys(vaultState).length.toString() });
      }

      // 3. vault.keys()
      else if (trimmed === 'vault.keys()') {
        newLines.push({ type: 'output', text: `dict_keys(${JSON.stringify(Object.keys(vaultState)).replace(/"/g, "'")})` });
      }

      // 4. vault.values()
      else if (trimmed === 'vault.values()') {
        newLines.push({ type: 'output', text: `dict_values(${JSON.stringify(Object.values(vaultState)).replace(/"/g, "'")})` });
      }

      // 5. vault.items()
      else if (trimmed === 'vault.items()') {
        const items = Object.entries(vaultState).map(([k, v]) => `('${k}', '${v}')`);
        newLines.push({ type: 'output', text: `dict_items([${items.join(', ')}])` });
      }

      // 6. del vault['key'] or del vault["key"]
      else if (trimmed.startsWith('del vault[')) {
        const match = trimmed.match(/del vault\[['"](.+?)['"]\]/);
        if (match && match[1]) {
          const key = match[1];
          if (vaultState[key] !== undefined) {
            updateVault(key, null, 'delete');
            newLines.push({ type: 'output', text: `# Removed merchant "${key}" from the ledger.` });
          } else {
            newLines.push({ type: 'error', text: `KeyError: '${key}'` });
          }
        } else {
          newLines.push({ type: 'error', text: "SyntaxError: Invalid del syntax. Use del vault['merchant_name']" });
        }
      }

      // 7. vault.pop('key') or vault.pop("key")
      else if (trimmed.startsWith('vault.pop(')) {
        const match = trimmed.match(/vault\.pop\(['"](.+?)['"]\)/);
        if (match && match[1]) {
          const key = match[1];
          if (vaultState[key] !== undefined) {
            const val = vaultState[key];
            updateVault(key, null, 'delete');
            newLines.push({ type: 'output', text: `'${val}'` });
          } else {
            newLines.push({ type: 'error', text: `KeyError: '${key}'` });
          }
        } else {
          newLines.push({ type: 'error', text: "SyntaxError: Invalid pop syntax. Use vault.pop('merchant_name')" });
        }
      }

      // 8. vault['key'] = 'val' or vault["key"] = "val" (Addition / Modification)
      else if (trimmed.includes('=') && trimmed.startsWith('vault[')) {
        const match = trimmed.match(/vault\[['"](.+?)['"]\]\s*=\s*['"](.+?)['"]/);
        if (match && match[1] && match[2]) {
          const key = match[1];
          const val = match[2];
          const exists = vaultState[key] !== undefined;
          updateVault(key, val, exists ? 'update' : 'add');
          newLines.push({ 
            type: 'output', 
            text: exists 
              ? `# Updated merchant "${key}" tribute contents to "${val}".` 
              : `# Added new merchant "${key}" into the vault with tribute "${val}".` 
          });
        } else {
          newLines.push({ type: 'error', text: "SyntaxError: Invalid assignment. Use vault['merchant'] = 'tribute'" });
        }
      }

      // 9. vault.get('key', 'default') or vault.get("key", "default")
      else if (trimmed.startsWith('vault.get(')) {
        const match = trimmed.match(/vault\.get\(['"](.+?)['"]\s*,\s*['"](.+?)['"]\)/);
        const matchSingle = trimmed.match(/vault\.get\(['"](.+?)['"]\)/);
        
        if (match && match[1] && match[2]) {
          const key = match[1];
          const defVal = match[2];
          const val = vaultState[key] !== undefined ? vaultState[key] : defVal;
          newLines.push({ type: 'output', text: `'${val}'` });
        } else if (matchSingle && matchSingle[1]) {
          const key = matchSingle[1];
          const val = vaultState[key] !== undefined ? vaultState[key] : 'None';
          newLines.push({ type: 'output', text: val === 'None' ? 'None' : `'${val}'` });
        } else {
          newLines.push({ type: 'error', text: "SyntaxError: Invalid get syntax. Use vault.get('key', 'default')" });
        }
      }

      // 10. vault['key'] or vault["key"] (Retrieval)
      else if (trimmed.startsWith('vault[')) {
        const match = trimmed.match(/vault\[['"](.+?)['"]\]/);
        if (match && match[1]) {
          const key = match[1];
          if (vaultState[key] !== undefined) {
            newLines.push({ type: 'output', text: `'${vaultState[key]}'` });
          } else {
            newLines.push({ type: 'error', text: `KeyError: '${key}'` });
          }
        } else {
          newLines.push({ type: 'error', text: "SyntaxError: Invalid key lookup syntax. Use vault['merchant_name']" });
        }
      }

      // 11. 'key' in vault or "key" in vault (Membership)
      else if (trimmed.includes('in vault')) {
        const match = trimmed.match(/['"](.+?)['"]\s+in\s+vault/);
        if (match && match[1]) {
          const key = match[1];
          const exists = vaultState[key] !== undefined;
          newLines.push({ type: 'output', text: exists ? 'True' : 'False' });
        } else {
          newLines.push({ type: 'error', text: "SyntaxError: Invalid membership check. Use 'merchant' in vault" });
        }
      }
      
      // 12. Unrecognized command fallback
      else {
        newLines.push({ 
          type: 'error', 
          text: `NameError: command "${trimmed}" is not recognized in this royal simulation. Use help commands on the left.` 
        });
      }
    } catch {
      newLines.push({ type: 'error', text: 'SyntaxError: Invalid python dictionary command.' });
    }

    setHistory(prev => [...prev, ...newLines]);
    setCommand('');
  };

  const handleReset = () => {
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
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder={varName ? `Type Python command (e.g., print(${varName})) and press Enter...` : 'Type a command from the left panel and press Enter...'}
                className="flex-1 bg-transparent focus:outline-none text-white font-mono text-xs md:text-sm"
              />
              <button
                type="submit"
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
