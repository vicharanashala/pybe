import { useState, useEffect, useRef } from 'react';

let globalPyodidePromise = null;

export default function usePyodide() {
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [output, setOutput] = useState('');
  const outputRef = useRef('');

  useEffect(() => {
    let isMounted = true;

    const initializePyodide = async () => {
      try {
        if (!window.loadPyodide) {
          throw new Error('Pyodide script not loaded in index.html');
        }

        if (!globalPyodidePromise) {
          globalPyodidePromise = window.loadPyodide();
        }

        const pyodideInstance = await globalPyodidePromise;
        
        if (isMounted) {
          setPyodide(pyodideInstance);
          
          pyodideInstance.setStdout({
            batched: (text) => {
              outputRef.current += text + '\n';
              setOutput(outputRef.current);
            }
          });
          pyodideInstance.setStderr({
            batched: (text) => {
              outputRef.current += text + '\n';
              setOutput(outputRef.current);
            }
          });
        }
      } catch (err) {
        console.error('Failed to load Pyodide', err);
        if (isMounted) setOutput('Error loading Python environment.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializePyodide();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const runCode = async (code) => {
    if (!pyodide) return { success: false, stdout: '' };
    outputRef.current = '';
    setOutput('');
    
    try {
      await pyodide.runPythonAsync(code);
      return { success: true, stdout: outputRef.current };
    } catch (err) {
      outputRef.current += err.message + '\n';
      setOutput(outputRef.current);
      return { success: false, stdout: outputRef.current, error: err.message };
    }
  };

  return { isLoading, output, runCode, pyodide };
}
