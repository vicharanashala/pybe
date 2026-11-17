// server/src/routes/python.js
const express = require('express');
const pythonExecutor = require('../services/pythonExecutor');

const router = express.Router();

// POST /api/python/execute - Execute Python code
router.post('/execute', async (req, res, next) => {
  try {
    const { code, scenarioId, timeout } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'No code provided' 
      });
    }

    // Validate code safety
    const safetyCheck = pythonExecutor.validateCodeSafety(code);
    
    if (!safetyCheck.isSafe) {
      return res.status(400).json({
        success: false,
        error: 'Code failed safety check',
        warnings: safetyCheck.warnings,
        errors: safetyCheck.errors
      });
    }

    // Execute the code
    const result = await pythonExecutor.executeCode(code, timeout || 5000);
    
    res.json({
      success: result.success,
      output: result.output || '',
      error: result.error || null,
      executionTime: result.executionTime || 0,
      exitCode: result.exitCode || null,
      warnings: safetyCheck.warnings
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/python/validate - Validate Python syntax without executing
router.post('/validate', async (req, res, next) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'No code provided' 
      });
    }

    // Use Python's -m py_compile to validate syntax
    const { exec } = require('child_process');
    const fs = require('fs').promises;
    const path = require('path');
    const { v4: uuidv4 } = require('uuid');
    
    const fileId = uuidv4();
    const tempDir = path.join(__dirname, '../temp');
    const filePath = path.join(tempDir, `${fileId}.py`);
    
    try {
      await fs.mkdir(tempDir, { recursive: true });
      await fs.writeFile(filePath, code, 'utf8');
      
      const result = await new Promise((resolve) => {
        exec(`python -m py_compile "${filePath}"`, (error, stdout, stderr) => {
          resolve({
            isValid: !error,
            error: stderr || null,
            output: stdout || null
          });
        });
      });
      
      await fs.unlink(filePath).catch(() => {});
      
      res.json({
        success: result.isValid,
        errors: result.error ? [result.error] : [],
        warnings: []
      });
    } catch (error) {
      await fs.unlink(filePath).catch(() => {});
      res.status(500).json({
        success: false,
        errors: [`Validation error: ${error.message}`],
        warnings: []
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;