import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { executeCklisPipeline } from './src/server/cklisOrchestrator.js';
import { LearningRequest, RuntimeContext } from './src/types.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Routes FIRST

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CKLIS Runtime Orchestrator',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Standard Pipeline Request Endpoint
  app.post('/api/cklis/generate', async (req, res) => {
    try {
      const {
        topic,
        desiredOutput,
        audience,
        representation,
        programmingLanguage,
        teachingStyle,
        experienceHints,
        experienceConstraints,
        outputRequirements,
        isSimpleForm,
        selectedProvider,
        inputMode,
        userObservation,
        conceptSelectionMode
      } = req.body;

      const activeMode = inputMode || 'topic';
      const effectiveTopic = (topic && typeof topic === 'string' && topic.trim() && topic.trim() !== userObservation?.trim())
        ? topic.trim()
        : (userObservation?.trim() || topic?.trim() || 'State Transitions & Accumulator Loops');

      if (!effectiveTopic || !effectiveTopic.trim()) {
        return res.status(400).json({
          error: 'Missing mandatory field: Topic or Real-World Observation is required.'
        });
      }

      const request: LearningRequest = {
        topic: effectiveTopic.trim(),
        audience: audience || 'Learner — Knowledge is for everyone',
        desiredOutput,
        representation,
        programmingLanguage,
        teachingStyle: teachingStyle || 'Story-based',
        experienceHints,
        experienceConstraints,
        outputRequirements,
        isSimpleForm: isSimpleForm ?? true,
        selectedProvider,
        inputMode: activeMode,
        userObservation: userObservation?.trim(),
        conceptSelectionMode: conceptSelectionMode || 'auto'
      };

      console.log(`[Express API] Kicking off CKLIS pipeline [Mode: ${activeMode}] for: "${request.topic}"`);

      // Execute full 7-step pipeline (handles request normalization & pre-step internally)
      const context = await executeCklisPipeline(request);

      const includeReasoning = req.query.includeReasoning === 'true' || req.body.includeReasoning === true;

      const pipelineOutcome = {
        topic: context.learningRequest.topic,
        learningObjective: context.learningRequest.learningObjective || '',
        educationalAnalysis: context.educationalAnalysis
      };

      const studioOutcome = context.production;

      if (!includeReasoning) {
        return res.json({
          executionId: context.executionId,
          status: context.status,
          production: studioOutcome,
          studioOutcome,
          pipelineOutcome,
          quality: context.quality,
          normalizedRequest: context.learningRequest,
          logs: context.logs,
          educationalAnalysis: context.educationalAnalysis
        });
      }

      return res.json({
        executionId: context.executionId,
        status: context.status,
        production: studioOutcome,
        studioOutcome,
        pipelineOutcome,
        quality: context.quality,
        educationalAnalysis: context.educationalAnalysis,
        logs: context.logs,
        revisionCount: context.revisionCount,
        normalizedRequest: context.learningRequest
      });
    } catch (error) {
      console.error('[Express API Error]:', error);
      res.status(500).json({
        error: 'Failed to process CKLIS execution request.',
        details: (error as Error).message
      });
    }
  });

  // Server-Sent Events (SSE) Endpoint for Real-time Streaming of Pipeline Steps
  app.get('/api/cklis/stream', async (req, res) => {
    const topic = (req.query.topic as string) || 'Variables and Memory';
    const desiredOutput = (req.query.desiredOutput as string) || 'Lesson';
    const audience = (req.query.audience as string) || 'Beginner';
    const representation = (req.query.representation as string) || 'Story';
    const programmingLanguage = (req.query.programmingLanguage as string) || 'Python';
    const experienceHints = (req.query.experienceHints as string) || '';
    const experienceConstraints = (req.query.experienceConstraints as string) || '';

    // Setup SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    const request: LearningRequest = {
      topic,
      desiredOutput,
      audience,
      representation,
      programmingLanguage,
      experienceHints,
      experienceConstraints
    };

    try {
      sendEvent('init', { message: 'Connected to CKLIS Streaming Orchestrator' });

      await executeCklisPipeline(request, (ctx: RuntimeContext) => {
        sendEvent('progress', {
          status: ctx.status,
          logs: ctx.logs,
          educationalAnalysis: ctx.educationalAnalysis,
          production: ctx.production,
          quality: ctx.quality,
          revisionCount: ctx.revisionCount
        });
      });

      sendEvent('complete', { message: 'Pipeline finished' });
      res.end();
    } catch (err) {
      sendEvent('error', { message: (err as Error).message });
      res.end();
    }
  });

  // Vite middleware setup for development vs production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CKLIS Orchestrator Server] Running on http://0.0.0.0:${PORT}`);
  });
  server.headersTimeout = 600000;  // 10 minutes for multi-step AI pipeline
  server.requestTimeout = 600000;  // 10 minutes
  server.keepAliveTimeout = 600000; // 10 minutes
}

startServer();
