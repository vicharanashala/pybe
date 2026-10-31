import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import apiRoutes from './routes/apiRoutes.js';

const app = express();
const dist = fileURLToPath(new URL('../../client/dist', import.meta.url));

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', apiRoutes);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Route not found' }));

// `npm run build` then `npm start` serves the whole app from one port.
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.use((_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  app.use((_req, res) => res.status(404).json({ error: 'Client not built. Run `npm run build`.' }));
}
export default app;
