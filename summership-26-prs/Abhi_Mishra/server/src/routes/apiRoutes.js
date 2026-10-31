import { Router } from 'express';
import * as controller from '../controllers/contentController.js';

const router = Router();
router.get('/case-study', controller.caseStudy);
router.get('/plots', controller.plots);
router.get('/quiz', controller.quiz);
router.post('/session', controller.session);
export default router;
