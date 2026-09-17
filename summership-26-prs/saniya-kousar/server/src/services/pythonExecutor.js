// server/src/services/pythonExecutor.js
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class PythonExecutor {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    this.ensureTempDir();
  }

  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  async executeCode(code, timeout = 5000) {
    const fileId = uuidv4();
    const filePath = path.join(this.tempDir, `${fileId}.py`);
    
    try {
      // Write code to temp file
      await fs.writeFile(filePath, code, 'utf8');

      // Execute the Python script
      const result = await this.runPythonScript(filePath, timeout);
      
      // Clean up temp file
      await fs.unlink(filePath).catch(() => {});
      
      return result;
    } catch (error) {
      // Clean up on error
      await fs.unlink(filePath).catch(() => {});
      return {
        success: false,
        error: error.message,
        output: ''
      };
    }
  }

  runPythonScript(filePath, timeout) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let output = '';
      let error = '';

      // Spawn Python process
      const python = spawn('python', [filePath]);
      
      // Collect stdout
      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      // Collect stderr
      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      // Handle process completion
      python.on('close', (code) => {
        const executionTime = Date.now() - startTime;
        
        if (code === 0) {
          resolve({
            success: true,
            output: output || '✅ Code executed successfully (no output)',
            executionTime,
            exitCode: code
          });
        } else {
          resolve({
            success: false,
            error: error || `Process exited with code ${code}`,
            output: output,
            executionTime,
            exitCode: code
          });
        }
      });

      // Handle process errors
      python.on('error', (err) => {
        resolve({
          success: false,
          error: `Failed to start Python: ${err.message}`,
          output: '',
          executionTime: Date.now() - startTime
        });
      });

      // Set timeout
      setTimeout(() => {
        python.kill('SIGTERM');
        resolve({
          success: false,
          error: `Execution timed out after ${timeout}ms`,
          output: output || '',
          executionTime: timeout
        });
      }, timeout);
    });
  }

  // Validate code for safety (prevent dangerous operations)
  validateCodeSafety(code) {
    const dangerousPatterns = [
      /__import__/,
      /eval\s*\(/,
      /exec\s*\(/,
      /compile\s*\(/,
      /open\s*\(/,
      /file\s*\(/,
      /input\s*\(/,
      /subprocess/,
      /os\./,
      /sys\./,
      /shutil/,
      /glob\./,
      /socket/,
      /requests/,
      /urllib/,
      /http\./
    ];

    const warnings = [];
    const errors = [];

    // Check for dangerous patterns
    dangerousPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        warnings.push(`Potentially unsafe operation detected: ${pattern.source}`);
      }
    });

    // Check for infinite loops (simple heuristic)
    if (code.includes('while True') && !code.includes('break')) {
      warnings.push('Possible infinite loop detected (while True without break)');
    }

    // Check for very long code
    if (code.length > 10000) {
      warnings.push('Code is very long, may cause performance issues');
    }

    return {
      isSafe: errors.length === 0,
      errors,
      warnings
    };
  }
}

module.exports = new PythonExecutor();