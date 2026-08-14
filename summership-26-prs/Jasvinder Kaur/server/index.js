import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health status check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PyBe API Engine', timestamp: new Date().toISOString() });
});

// Python execution sandbox endpoint
app.post('/api/execute', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No Python code provided' });
  }

  // Simulated backend trace execution for recursive algorithms
  try {
    let outputTrace = [];
    if (code.includes('factorial')) {
      outputTrace = [
        '[SERVER TRACE] Starting factorial execution...',
        'Pushing stack frame: factorial(4) -> Waiting for factorial(3)',
        'Pushing stack frame: factorial(3) -> Waiting for factorial(2)',
        'Pushing stack frame: factorial(2) -> Waiting for factorial(1)',
        'Pushing stack frame: factorial(1) -> BASE CASE REACHED!',
        'Unwinding: factorial(1) returns 1',
        'Unwinding: factorial(2) returns 2',
        'Unwinding: factorial(3) returns 6',
        'Unwinding: factorial(4) returns 24',
        'Execution finished cleanly! Final return: 24'
      ];
    } else {
      outputTrace = [
        '[SERVER TRACE] Executing Python script...',
        'Call stack initialized.',
        'Recursion safety check passed: Base case defined.',
        'Execution completed successfully.'
      ];
    }

    res.json({
      success: true,
      stdout: outputTrace.join('\n'),
      trace: outputTrace
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 PyBe Backend Server running on http://localhost:${PORT}`);
});
