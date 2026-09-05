const store = require('../data/store');
const aiProviderFactory = require('./ai/aiProviderFactory');
const promptTemplates = require('./ai/promptTemplates');

const MAX_HISTORY_MESSAGES = 12;

/**
 * Feature 4: AI Tutor Chat. Keeps a short conversation history per
 * (learnerId, scenarioId) so the tutor has context across turns, and
 * grounds every reply in the learner's current scenario when one is open.
 */
async function chat({ learnerId, scenarioId, message }) {
  if (!learnerId || !message?.trim()) {
    throw Object.assign(new Error('learnerId and message are required'), { status: 400 });
  }

  const [scenario, conversation] = await Promise.all([
    scenarioId ? store.getScenario(scenarioId) : null,
    store.getTutorConversation(learnerId, scenarioId)
  ]);

  const history = (conversation?.messages || []).slice(-MAX_HISTORY_MESSAGES);
  const promptRequest = promptTemplates.tutorChatPrompt({ question: message, scenario, history });
  const aiResponse = await aiProviderFactory.complete(promptRequest);

  const conversationRecord = await store.appendTutorMessages(learnerId, scenarioId, [
    { role: 'user', content: message, timestamp: new Date().toISOString() },
    { role: 'assistant', content: aiResponse.text, timestamp: new Date().toISOString() }
  ]);

  return { reply: aiResponse.text, providerUsed: aiResponse.providerUsed, messages: conversationRecord.messages };
}

async function getHistory({ learnerId, scenarioId }) {
  if (!learnerId) throw Object.assign(new Error('learnerId is required'), { status: 400 });
  const conversation = await store.getTutorConversation(learnerId, scenarioId);
  return conversation?.messages || [];
}

module.exports = { chat, getHistory };
