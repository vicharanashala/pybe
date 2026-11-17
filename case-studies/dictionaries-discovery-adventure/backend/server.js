require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Treasure = require('./models/Treasure');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/magic-treasure-chest';

// In-memory fallback dataset for seamless offline / zero-database operation
const DEFAULT_TREASURES = [
  { keySymbol: 'star', treasureValue: 'Golden Coin 🌟', hint: 'Shines bright in the night sky. The Wizard\'s pride!' },
  { keySymbol: 'heart', treasureValue: 'Ruby 💖', hint: 'Pulsing with warm magic and vital energy.' },
  { keySymbol: 'skull', treasureValue: 'Cursed Ring ☠️', hint: 'Dark enchantment wrapped in cold silver.' },
  { keySymbol: 'crown', treasureValue: 'Royal Gem 👑', hint: 'Forged for kings, gleaming with regal light.' }
];

let inMemoryStore = [...DEFAULT_TREASURES];
let isDbConnected = false;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 3000
})
  .then(async () => {
    isDbConnected = true;
    console.log('🔮 Connected to MongoDB');
    
    // Seed default stickers if database is empty
    for (const item of DEFAULT_TREASURES) {
      await Treasure.findOneAndUpdate(
        { keySymbol: item.keySymbol },
        item,
        { upsert: true, new: true }
      );
    }
    console.log('✨ Seeded default stickers (star, heart, skull, crown)');
  })
  .catch(err => {
    console.warn('⚠️ MongoDB not reachable at startup, running in-memory fallback store:', err.message);
  });

// GET /health - Simple status check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Magic Treasure Chest: The Goblin Heist API',
    uptime: Math.floor(process.uptime()),
    database: isDbConnected ? 'connected' : 'in-memory-fallback',
    stickersCount: inMemoryStore.length
  });
});

// GET /treasure/:symbol - Instant O(1) Hashmap lookup
app.get('/treasure/:symbol', async (req, res) => {
  try {
    const symbol = (req.params.symbol || '').toLowerCase().trim();
    if (!symbol) {
      return res.status(400).json({ 
        success: false, 
        found: false, 
        message: 'Please provide a valid sticker symbol!' 
      });
    }

    let treasure = null;
    if (isDbConnected) {
      treasure = await Treasure.findOne({ keySymbol: symbol });
    } else {
      treasure = inMemoryStore.find(t => t.keySymbol === symbol);
    }

    if (treasure) {
      return res.json({ 
        success: true, 
        found: true,
        key: treasure.keySymbol,
        treasure: treasure.treasureValue,
        hint: treasure.hint 
      });
    } else {
      return res.json({ 
        success: false, 
        found: false,
        key: symbol,
        message: `Sticker '${symbol}' not found on the chest!`,
        hint: "Try checking the secret parchment symbols: 'star', 'heart', 'skull', or 'crown'."
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during lookup' });
  }
});

// GET /quiz - Randomized question with 1 correct and 2 incorrect choices
app.get('/quiz', async (req, res) => {
  try {
    let allTreasures = [];
    if (isDbConnected) {
      allTreasures = await Treasure.find({});
    }
    if (!allTreasures || allTreasures.length < 3) {
      allTreasures = inMemoryStore;
    }

    // Pick a random treasure as correct answer
    const correctIndex = Math.floor(Math.random() * allTreasures.length);
    const correctTreasure = allTreasures[correctIndex];

    // Pick 2 other random treasures as distractors
    const options = [correctTreasure];
    const available = allTreasures.filter(t => t.keySymbol !== correctTreasure.keySymbol);
    
    // Shuffle and pick 2
    available.sort(() => Math.random() - 0.5);
    options.push(available[0]);
    if (available.length > 1) {
      options.push(available[1]);
    }

    // Shuffle final options
    options.sort(() => Math.random() - 0.5);

    res.json({
      success: true,
      question: `Which treasure is hidden behind the "${correctTreasure.keySymbol}" sticker?`,
      options: options.map(opt => ({
        key: opt.keySymbol,
        value: opt.treasureValue
      })),
      correctKey: correctTreasure.keySymbol,
      correctValue: correctTreasure.treasureValue
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error generating quiz' });
  }
});

// POST /admin/treasure - Insert or update a key-value pair
app.post('/admin/treasure', async (req, res) => {
  try {
    const { keySymbol, treasureValue, hint } = req.body;
    if (!keySymbol || typeof keySymbol !== 'string' || !treasureValue || typeof treasureValue !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid keySymbol and treasureValue are required strings.' 
      });
    }

    const cleanKey = keySymbol.toLowerCase().trim();
    const cleanHint = (hint || 'A mysterious enchanted treasure.').trim();

    const record = {
      keySymbol: cleanKey,
      treasureValue: treasureValue.trim(),
      hint: cleanHint
    };

    // Update in-memory store
    const existingIndex = inMemoryStore.findIndex(t => t.keySymbol === cleanKey);
    if (existingIndex >= 0) {
      inMemoryStore[existingIndex] = record;
    } else {
      inMemoryStore.push(record);
    }

    if (isDbConnected) {
      await Treasure.findOneAndUpdate(
        { keySymbol: cleanKey },
        record,
        { upsert: true, new: true }
      );
    }

    res.json({ 
      success: true, 
      message: `Treasure for sticker '${cleanKey}' successfully inscribed on chest!`,
      treasure: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error saving treasure' });
  }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

app.listen(PORT, () => {
  console.log(`🏰 Magic Treasure Chest backend running on http://localhost:${PORT}`);
});
