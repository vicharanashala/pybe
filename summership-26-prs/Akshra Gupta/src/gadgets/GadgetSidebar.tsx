import React, { useState } from 'react';
import { GlassCard } from '../shared-components/GlassCard';
import { CodeEditor } from './CodeEditor';
import { Terminal } from './Terminal';
import { QuizGrader } from './QuizGrader';
import { usePython } from './usePython';
import { X, ChevronRight, Cpu } from 'lucide-react';

export const GadgetSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeGadget, setActiveGadget] = useState<string | null>(null);

  // States for the on-the-fly Sidebar Editor/Terminal Gadget
  const [code, setCode] = useState<string>(
    `# Sidebar Scratchpad Gadget\n# Test algorithms or code snippets here!\n\nprint("Scratchpad gadget active! 🚀")\n`
  );
  const [stdout, setStdout] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const { isLoading: isPyodideLoading, runPython } = usePython();

  const handleRunCode = async () => {
    if (isPyodideLoading || isRunning) return;
    setIsRunning(true);
    setError(null);
    const result = await runPython(code);
    setStdout(result.stdout);
    setError(result.error);
    setIsRunning(false);
  };

  const handleClearConsole = () => {
    setStdout('');
    setError(null);
  };

  // Mock quiz values for Sidebar Translation Grader
  const sidebarQuiz = {
    question: 'Which of the following is the correct symbol to begin comments in Python?',
    options: [
      '// Comment style',
      '/* Comment style */',
      '# Comment style',
      '-- Comment style'
    ],
    correctOptionIndex: 2,
    explanation: 'Python uses the hash symbol (#) to start single-line comments!'
  };

  return (
    <>
      {/* 1. Floating Pocket Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            right: '20px',
            bottom: '40px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#008cff',
            border: '3px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 140, 255, 0.45)',
            cursor: 'pointer',
            zIndex: 100,
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Open 4D Pocket Gadgets"
        >
          {/* Collar bell drawing inside pocket button */}
          <div style={{
            width: '26px',
            height: '20px',
            borderBottom: '2.5px solid white',
            borderRadius: '0 0 50% 50%',
            backgroundColor: 'white',
            position: 'absolute',
            bottom: '10px'
          }} />
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffcc00',
            border: '1.5px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '8px'
          }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'black', position: 'absolute', top: '3px' }} />
          </div>
        </button>
      )}

      {/* 2. Slide-Over Sidebar Panel */}
      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: '300px',
        background: 'rgba(10, 23, 47, 0.85)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(0, 140, 255, 0.18)',
        zIndex: 99,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} style={{ color: '#ffcc00' }} />
            <span style={{ fontSize: '13px', fontWeight: 900, color: 'white', letterSpacing: '0.5px' }}>
              4D POCKET GADGETS
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Gadget List */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>
            AVAILABLE DEPLOYMENTS
          </span>

          {/* Gadget Item GD-01 */}
          <GlassCard 
            hoverable 
            onClick={() => setActiveGadget('GD-01')}
            style={{ padding: '16px', cursor: 'pointer', border: '1px solid rgba(0,140,255,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800 }}>GD-01</span>
              <ChevronRight size={14} style={{ color: '#38bdf8' }} />
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'white', marginTop: '6px', marginBottom: '2px' }}>
              Anywhere Editor
            </h4>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
              Launch floating script compiler pad to draft and test algorithms.
            </p>
          </GlassCard>

          {/* Gadget Item GD-02 */}
          <GlassCard 
            hoverable 
            onClick={() => setActiveGadget('GD-02')}
            style={{ padding: '16px', cursor: 'pointer', border: '1px solid rgba(0,140,255,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800 }}>GD-02</span>
              <ChevronRight size={14} style={{ color: '#38bdf8' }} />
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'white', marginTop: '6px', marginBottom: '2px' }}>
              Pocket Console
            </h4>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
              Open terminal console to run python output statements.
            </p>
          </GlassCard>

          {/* Gadget Item GD-03 */}
          <GlassCard 
            hoverable 
            onClick={() => setActiveGadget('GD-03')}
            style={{ padding: '16px', cursor: 'pointer', border: '1px solid rgba(0,140,255,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800 }}>GD-03</span>
              <ChevronRight size={14} style={{ color: '#38bdf8' }} />
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'white', marginTop: '6px', marginBottom: '2px' }}>
              Translation Grader
            </h4>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
              Pull out multiple choice evaluator sheet to test syntax definitions.
            </p>
          </GlassCard>
        </div>

        {/* Pocket bottom details */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: '#475569', textAlign: 'center' }}>
          ✨ Pull gadgets on-the-fly
        </div>
      </div>

      {/* 3. Floating Overlay Modals for Gadgets */}
      {activeGadget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 10, 22, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '24px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: activeGadget === 'GD-03' ? '600px' : '760px',
            height: activeGadget === 'GD-03' ? 'auto' : '560px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }} className="animate-fade-in">
            {/* Modal Close Button positioned inside header slot */}
            <button 
              onClick={() => setActiveGadget(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            >
              <X size={16} />
            </button>

            {/* Render selected gadget */}
            {activeGadget === 'GD-01' && (
              <div style={{ height: '100%' }}>
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  onRun={handleRunCode}
                />
              </div>
            )}

            {activeGadget === 'GD-02' && (
              <div style={{ height: '100%' }}>
                <Terminal
                  stdout={stdout}
                  error={error}
                  isLoading={isPyodideLoading}
                  isRunning={isRunning}
                  onClear={handleClearConsole}
                  onRun={handleRunCode}
                />
              </div>
            )}

            {activeGadget === 'GD-03' && (
              <QuizGrader
                question={sidebarQuiz.question}
                options={sidebarQuiz.options}
                correctOptionIndex={sidebarQuiz.correctOptionIndex}
                explanation={sidebarQuiz.explanation}
                onGrade={(passed) => console.log('Sidebar Grader Answer Passed:', passed)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default GadgetSidebar;
