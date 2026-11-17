// Compatibility boundary for stored-draft tools. Remote generation is removed.
const AI_PROVIDERS = [];
async function generateWithProvider() {
  throw Object.assign(new Error('Automatic generation has been removed. Use authored case studies.'), { status: 410, statusCode: 410, code: 'LOCAL_ONLY' });
}
module.exports = { AI_PROVIDERS, generateWithProvider };
