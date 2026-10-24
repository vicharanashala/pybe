import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const MOCK_TREASURES = {
  star: { treasure: 'Golden Coin 🌟', hint: 'Shines bright in the night sky. The Wizard\'s pride!' },
  heart: { treasure: 'Ruby 💖', hint: 'Pulsing with warm magic and vital energy.' },
  skull: { treasure: 'Cursed Ring ☠️', hint: 'Dark enchantment wrapped in cold silver.' },
  crown: { treasure: 'Royal Gem 👑', hint: 'Forged for kings, gleaming with regal light.' },
  // Easter eggs!
  goblin: { treasure: 'Shiny Golden Spoon 🥄', hint: 'Sly\'s secret personal treasure for midnight snacks!' },
  bone: { treasure: 'Sleepy Dog Biscuit 🦴', hint: 'The guard dog munches happily and goes back to sleep!' }
};

/**
 * Fetch treasure by key symbol.
 * Automatically tries backend API first, falls back seamlessly to local mock if offline.
 */
export async function getTreasure(symbol) {
  const cleanKey = (symbol || '').toLowerCase().trim();
  if (!cleanKey) {
    return { success: false, found: false, message: 'Please provide a valid sticker symbol!' };
  }

  // Check easter eggs first
  if (MOCK_TREASURES[cleanKey] && (cleanKey === 'goblin' || cleanKey === 'bone')) {
    return {
      success: true,
      found: true,
      isEasterEgg: true,
      key: cleanKey,
      treasure: MOCK_TREASURES[cleanKey].treasure,
      hint: MOCK_TREASURES[cleanKey].hint
    };
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/treasure/${encodeURIComponent(cleanKey)}`, {
      timeout: 2500
    });
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable, using local mock for /treasure:', err.message);
    if (MOCK_TREASURES[cleanKey]) {
      return {
        success: true,
        found: true,
        key: cleanKey,
        treasure: MOCK_TREASURES[cleanKey].treasure,
        hint: MOCK_TREASURES[cleanKey].hint
      };
    }
    return {
      success: false,
      found: false,
      key: cleanKey,
      message: `Sticker '${cleanKey}' not found on the chest!`,
      hint: "Try checking the secret parchment symbols: 'star', 'heart', 'skull', or 'crown'."
    };
  }
}

/**
 * Fetch randomized quiz question
 */
export async function getQuiz() {
  try {
    const response = await axios.get(`${API_BASE_URL}/quiz`, { timeout: 2500 });
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable, using local mock for /quiz:', err.message);
    const keys = ['star', 'heart', 'skull', 'crown'];
    const correctKey = keys[Math.floor(Math.random() * keys.length)];
    const correctValue = MOCK_TREASURES[correctKey].treasure;

    const otherKeys = keys.filter(k => k !== correctKey).sort(() => Math.random() - 0.5);
    const options = [
      { key: correctKey, value: correctValue },
      { key: otherKeys[0], value: MOCK_TREASURES[otherKeys[0]].treasure },
      { key: otherKeys[1], value: MOCK_TREASURES[otherKeys[1]].treasure }
    ].sort(() => Math.random() - 0.5);

    return {
      success: true,
      question: `Which treasure is hidden behind the "${correctKey}" sticker?`,
      options,
      correctKey,
      correctValue
    };
  }
}

/**
 * Check backend health
 */
export async function checkBackendHealth() {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 1500 });
    return { online: true, ...response.data };
  } catch (err) {
    return { online: false, message: 'Offline (mock mode active)' };
  }
}
