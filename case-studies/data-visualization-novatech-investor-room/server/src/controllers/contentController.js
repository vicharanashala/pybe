import * as data from '../services/dataService.js';

export const caseStudy = (_req, res) => res.json(data.getCaseStudy());
export const plots = (_req, res) => res.json(data.getPlots());
export const quiz = (_req, res) => res.json(data.getQuiz());
export const session = (req, res) => {
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ error: 'JSON body required' });
  return res.status(201).json(data.saveSession(req.body));
};
