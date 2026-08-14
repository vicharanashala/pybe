const { Router } = require('express');
const sessionController = require('../controllers/session.controller');
const { sessionSchema, validateBody } = require('../middleware/validate');

const router = Router();

router.get('/', sessionController.getAll);
router.post('/', validateBody(sessionSchema), sessionController.create);

module.exports = router;
