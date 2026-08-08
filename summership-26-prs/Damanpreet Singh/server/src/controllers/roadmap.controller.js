const roadmapRepository = require('../repositories/roadmap.repository');

/**
 * GET /api/roadmap
 * Returns all roadmap phases ordered by sortOrder.
 */
async function getAll(req, res, next) {
  try {
    const phases = await roadmapRepository.findAll();
    return res.status(200).json({ success: true, data: phases });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getAll };
