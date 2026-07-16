import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loadDB, saveDB } from "./db.js";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { LIVE_QUIZ_QUESTIONS } from "./src/utils/quizQuestions.js";

// Load environment variables from local files first, then fallback to defaults.
// AI Studio injects runtime values automatically, so local files are only for development.
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Lazy initialization of Gemini API Client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Ensure proper error handling and model aliases
const MODEL_NAME = "gemini-3.5-flash";

// --- API ROUTES ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    online: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString()
  });
});

const JWT_SECRET = process.env.JWT_SECRET || "pybe-secret-token-key-2026";

// Authentication middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
}

// REGISTER ENDPOINT
app.post("/api/auth/register", async (req: any, res: any) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields (name, email, password) are required" });
  }

  try {
    const db = loadDB();
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    if (db.users.find(u => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = "user_" + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    const newUser = {
      id: userId,
      name,
      email: normalizedEmail,
      password_hash,
      profile_picture: null,
      created_at: now,
      last_login: now
    };

    db.users.push(newUser);

    // Default User Progress
    const defaultProgress = {
      id: "prog_" + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      selected_world: "story",
      current_lesson: "1",
      completed_lessons: [],
      test_scores: {},
      xp_points: 0,
      badges: [],
      streak: 1,
      weak_topics: [],
      strong_topics: [],
      completed_daily_problems: [],
      updated_at: now
    };
    db.userProgress.push(defaultProgress);

    // Default Settings
    const defaultSettings = {
      id: "set_" + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      theme: "light",
      font_size: "medium",
      sound_preference: true,
      language: "english",
      updated_at: now
    };
    db.settings.push(defaultSettings);

    saveDB(db);

    const token = jwt.sign({ id: userId, email: normalizedEmail, name }, JWT_SECRET, { expiresIn: "30d" });

    res.status(201).json({
      token,
      user: { id: userId, name, email: normalizedEmail, profile_picture: null },
      progress: defaultProgress,
      settings: defaultSettings,
      sandboxFiles: [],
      projects: [],
      bookmarks: [],
      peerPosts: [],
      peerReplies: [],
      uploads: [],
      voiceMessages: [],
      aiTutorChats: []
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
});

// LOGIN ENDPOINT
app.post("/api/auth/login", async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const db = loadDB();
    const normalizedEmail = email.toLowerCase().trim();
    const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Update last login
    user.last_login = new Date().toISOString();
    saveDB(db);

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "30d" });

    // Fetch all related data
    const progress = db.userProgress.find(p => p.user_id === user.id) || null;
    const settings = db.settings.find(s => s.user_id === user.id) || null;
    const sandboxFiles = db.sandboxFiles.filter(f => f.user_id === user.id);
    const projects = db.projects.filter(p => p.user_id === user.id);
    const bookmarks = db.bookmarks.filter(b => b.user_id === user.id);
    const peerPosts = db.peerPosts.filter(p => p.user_id === user.id);
    const peerReplies = db.peerReplies.filter(r => r.user_id === user.id);
    const uploads = db.uploads.filter(u => u.user_id === user.id);
    const voiceMessages = db.voiceMessages.filter(v => v.user_id === user.id);
    const aiTutorChats = db.aiTutorChats.filter(c => c.user_id === user.id);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, profile_picture: user.profile_picture },
      progress,
      settings,
      sandboxFiles,
      projects,
      bookmarks,
      peerPosts,
      peerReplies,
      uploads,
      voiceMessages,
      aiTutorChats
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// GET USER DATA ENDPOINT (for Cross-Device Sync)
app.get("/api/user/data", authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;

  try {
    const db = loadDB();
    const user = db.users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const progress = db.userProgress.find(p => p.user_id === userId) || null;
    const settings = db.settings.find(s => s.user_id === userId) || null;
    const sandboxFiles = db.sandboxFiles.filter(f => f.user_id === userId);
    const projects = db.projects.filter(p => p.user_id === userId);
    const bookmarks = db.bookmarks.filter(b => b.user_id === userId);
    const peerPosts = db.peerPosts.filter(p => p.user_id === userId);
    const peerReplies = db.peerReplies.filter(r => r.user_id === userId);
    const uploads = db.uploads.filter(u => u.user_id === userId);
    const voiceMessages = db.voiceMessages.filter(v => v.user_id === userId);
    const aiTutorChats = db.aiTutorChats.filter(c => c.user_id === userId);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, profile_picture: user.profile_picture },
      progress,
      settings,
      sandboxFiles,
      projects,
      bookmarks,
      peerPosts,
      peerReplies,
      uploads,
      voiceMessages,
      aiTutorChats
    });
  } catch (error: any) {
    console.error("Get user data error:", error);
    res.status(500).json({ error: "Failed to load user data" });
  }
});

// SYNC DATA ENDPOINT
app.post("/api/user/sync", authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const {
    progress,
    settings,
    sandboxFiles,
    projects,
    bookmarks,
    peerPosts,
    peerReplies,
    uploads,
    voiceMessages,
    aiTutorChats
  } = req.body;

  try {
    const db = loadDB();
    const now = new Date().toISOString();

    // Sync progress
    if (progress) {
      const existingProgIdx = db.userProgress.findIndex(p => p.user_id === userId);
      const updatedProg = {
        id: progress.id || "prog_" + Math.random().toString(36).substr(2, 9),
        ...progress,
        user_id: userId,
        updated_at: now
      };
      if (existingProgIdx !== -1) {
        db.userProgress[existingProgIdx] = { ...db.userProgress[existingProgIdx], ...updatedProg };
      } else {
        db.userProgress.push(updatedProg);
      }
    }

    // Sync settings
    if (settings) {
      const existingSetIdx = db.settings.findIndex(s => s.user_id === userId);
      const updatedSet = {
        id: settings.id || "set_" + Math.random().toString(36).substr(2, 9),
        ...settings,
        user_id: userId,
        updated_at: now
      };
      if (existingSetIdx !== -1) {
        db.settings[existingSetIdx] = { ...db.settings[existingSetIdx], ...updatedSet };
      } else {
        db.settings.push(updatedSet);
      }
    }

    // Sync other lists
    if (sandboxFiles) {
      db.sandboxFiles = db.sandboxFiles.filter(f => f.user_id !== userId).concat(
        sandboxFiles.map((f: any) => ({ ...f, user_id: userId, updated_at: now }))
      );
    }
    if (projects) {
      db.projects = db.projects.filter(p => p.user_id !== userId).concat(
        projects.map((p: any) => ({ ...p, user_id: userId, updated_at: now }))
      );
    }
    if (bookmarks) {
      db.bookmarks = db.bookmarks.filter(b => b.user_id !== userId).concat(
        bookmarks.map((b: any) => ({ ...b, user_id: userId, created_at: b.created_at || now }))
      );
    }
    if (peerPosts) {
      db.peerPosts = db.peerPosts.filter(p => p.user_id !== userId).concat(
        peerPosts.map((p: any) => ({ ...p, user_id: userId, created_at: p.created_at || now }))
      );
    }
    if (peerReplies) {
      db.peerReplies = db.peerReplies.filter(r => r.user_id !== userId).concat(
        peerReplies.map((r: any) => ({ ...r, user_id: userId, created_at: r.created_at || now }))
      );
    }
    if (uploads) {
      db.uploads = db.uploads.filter(u => u.user_id !== userId).concat(
        uploads.map((u: any) => ({ ...u, user_id: userId, created_at: u.created_at || now }))
      );
    }
    if (voiceMessages) {
      db.voiceMessages = db.voiceMessages.filter(v => v.user_id !== userId).concat(
        voiceMessages.map((v: any) => ({ ...v, user_id: userId, created_at: v.created_at || now }))
      );
    }
    if (aiTutorChats) {
      db.aiTutorChats = db.aiTutorChats.filter(c => c.user_id !== userId).concat(
        aiTutorChats.map((c: any) => ({ ...c, user_id: userId, created_at: c.created_at || now }))
      );
    }

    saveDB(db);
    res.json({ success: true, message: "User progress synchronized successfully" });
  } catch (error: any) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Failed to sync user data", details: error.message });
  }
});

// UPLOAD AVATAR ENDPOINT
app.post("/api/user/upload-avatar", authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const { profile_picture } = req.body;

  if (!profile_picture) {
    return res.status(400).json({ error: "Profile picture required" });
  }

  try {
    const db = loadDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profile_picture = profile_picture;
    saveDB(db);

    res.json({ success: true, profile_picture });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to upload avatar" });
  }
});

// DELETE ACCOUNT ENDPOINT
app.delete("/api/user/delete-account", authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;

  try {
    const db = loadDB();

    db.users = db.users.filter(u => u.id !== userId);
    db.userProgress = db.userProgress.filter(p => p.user_id !== userId);
    db.settings = db.settings.filter(s => s.user_id !== userId);
    db.sandboxFiles = db.sandboxFiles.filter(f => f.user_id !== userId);
    db.projects = db.projects.filter(p => p.user_id !== userId);
    db.bookmarks = db.bookmarks.filter(b => b.user_id !== userId);
    db.peerPosts = db.peerPosts.filter(p => p.user_id !== userId);
    db.peerReplies = db.peerReplies.filter(r => r.user_id !== userId);
    db.uploads = db.uploads.filter(u => u.user_id !== userId);
    db.voiceMessages = db.voiceMessages.filter(v => v.user_id !== userId);
    db.aiTutorChats = db.aiTutorChats.filter(c => c.user_id !== userId);

    saveDB(db);

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// EXPORT USER DATA ENDPOINT
app.get("/api/user/export", authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;

  try {
    const db = loadDB();
    const user = db.users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const data = {
      user: { name: user.name, email: user.email, created_at: user.created_at },
      progress: db.userProgress.find(p => p.user_id === userId) || null,
      settings: db.settings.find(s => s.user_id === userId) || null,
      sandboxFiles: db.sandboxFiles.filter(f => f.user_id === userId),
      projects: db.projects.filter(p => p.user_id === userId),
      bookmarks: db.bookmarks.filter(b => b.user_id === userId),
      peerPosts: db.peerPosts.filter(p => p.user_id === userId),
      peerReplies: db.peerReplies.filter(r => r.user_id === userId),
      uploads: db.uploads.filter(u => u.user_id === userId),
      voiceMessages: db.voiceMessages.filter(v => v.user_id === userId),
      aiTutorChats: db.aiTutorChats.filter(c => c.user_id === userId)
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=pybe_data_export_${userId}.json`);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to export data" });
  }
});

// 2. Generate custom personalized lesson
app.post("/api/generate-lesson", async (req, res) => {
  const { concept, level, scenario } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.status(503).json({
      error: "Gemini API key not configured. Offline lessons are active.",
      fallback: true
    });
  }

  try {
    const prompt = `Create a personalized Python programming lesson for a learner.
Topic: "${concept}"
Difficulty Level: "${level}"
Learner's Interest/Scenario context: "${scenario}"

The lesson should teach the concept using the scenario as a direct analogy.
For example, if the topic is "Variables" and the scenario is "Rich Dad Poor Dad", use variables like 'assets' and 'liabilities' to explain.
If the scenario is "Minecraft", use blocks, creepers, and inventory sizes.

Please return a structured JSON response matching this exact schema:
{
  "title": "A short, engaging lesson title",
  "explanation": "A complete, step-by-step markdown formatted explanation teaching the concept through the scenario.",
  "codeExample": "A simple, clean Python code example demonstrating the concept in the scenario.",
  "interactiveChallenge": {
    "instruction": "A simple instruction for the learner to write or complete Python code.",
    "template": "Starter Python code template for the learner to fill in.",
    "expectedOutputContains": ["a word or number expected in print output to validate their code"]
  }
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "explanation", "codeExample", "interactiveChallenge"],
          properties: {
            title: { type: Type.STRING },
            explanation: { type: Type.STRING },
            codeExample: { type: Type.STRING },
            interactiveChallenge: {
              type: Type.OBJECT,
              required: ["instruction", "template", "expectedOutputContains"],
              properties: {
                instruction: { type: Type.STRING },
                template: { type: Type.STRING },
                expectedOutputContains: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    const lessonData = JSON.parse(resultText);
    res.json({ ...lessonData, id: `gen_${Date.now()}`, concept, level, scenario });
  } catch (err: any) {
    console.error("Gemini lesson generation failed:", err);
    res.status(500).json({ error: "Failed to generate lesson via Gemini.", details: err.message, fallback: true });
  }
});

// 3. AI Tutor explanation / chat
app.post("/api/tutor-chat", async (req, res) => {
  const { message, chatHistory, scenario } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.status(503).json({
      error: "AI Tutor is currently offline. Pre-cached responses will be used.",
      fallback: true
    });
  }

  try {
    const systemInstruction = `You are an incredibly friendly, creative, and expert Python tutor.
Your mission is to explain complex programming ideas using fun, relatable analogies based on the user's favorite interests.
The user is currently studying with the main scenario: "${scenario}".
Always relate your answers to this scenario or other playful topics (like Minecraft, books, sports, or finance) if requested.
Use very friendly, jargon-free explanation. Keep code examples brief, correct, and readable.
Encourage the user, give them simple exercises if they ask, but DO NOT write all the code for them directly; let them learn!`;

    // Map the user history into Gemini content formats
    const formattedContents = [
      ...(chatHistory || []).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: formattedContents as any,
      config: {
        systemInstruction,
        temperature: 0.8
      }
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error("Gemini Tutor Chat failed:", err);
    res.status(500).json({ error: "Failed to get response from AI Tutor.", details: err.message });
  }
});

// 4. AI Code Reviewer
app.post("/api/code-review", async (req, res) => {
  const { code, challengeContext, instruction } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.status(503).json({
      error: "AI reviewer is offline. Local execution verification will validate your output.",
      fallback: true
    });
  }

  try {
    const prompt = `You are an automated Python Code Reviewer.
A student wrote this Python code:
\`\`\`python
${code}
\`\`\`

The goal or instruction of the challenge was: "${instruction}"
Context: "${challengeContext}"

Please check the code for:
1. Syntax correctness
2. Logic (does it solve the prompt?)
3. Style & Best practices
4. Good naming conventions

Provide feedback. If there is a mistake, explain what the issue is without directly rewriting the correct solution for them. Guide them to solve it themselves.

Return a structured JSON response matching this exact schema:
{
  "isCorrect": true/false (set to true if the code successfully meets the core challenge logic and has no syntax errors),
  "score": 85 (a score out of 100 representing code quality, syntax, and naming),
  "feedback": "A concise, supportive markdown string outlining pros, cons, and tips to improve."
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["isCorrect", "score", "feedback"],
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (err: any) {
    console.error("Gemini code review failed:", err);
    res.status(500).json({ error: "Failed to review code via Gemini.", details: err.message });
  }
});

// 5. Generate custom personalized challenge
app.post("/api/generate-challenge", async (req, res) => {
  const { concept, level, scenario } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.status(503).json({
      error: "Gemini is offline.",
      fallback: true
    });
  }

  try {
    const prompt = `Generate a personalized interactive coding puzzle or quiz.
Topic: "${concept}"
Level: "${level}"
Scenario Context: "${scenario}"

Please return a structured JSON response matching this exact schema:
{
  "title": "A short, exciting challenge title",
  "description": "An engaging scenario description introducing the challenge.",
  "starterCode": "Initial code containing placeholders, bug, or missing function for the user.",
  "expectedOutput": "The expected exact printed result from the solved code.",
  "hint": "A supportive hint guiding the user."
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "description", "starterCode", "expectedOutput", "hint"],
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            starterCode: { type: Type.STRING },
            expectedOutput: { type: Type.STRING },
            hint: { type: Type.STRING }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (err: any) {
    console.error("Gemini challenge generation failed:", err);
    res.status(500).json({ error: "Failed to generate challenge.", details: err.message });
  }
});

// --- WEBSOCKET LIVE QUIZ ARENA ---

interface Player {
  ws: WebSocket;
  id: string;
  name: string;
  avatar: string;
  team?: 'red' | 'blue';
  score: number;
  answers: { [questionId: string]: { answer: string; isCorrect: boolean; timeTakenMs: number } };
  isBot?: boolean;
}

interface Room {
  id: string;
  type: '1v1' | 'team';
  players: Player[];
  status: 'lobby' | 'playing' | 'ended';
  countdown: number;
  currentQuestionIndex: number;
  roundTimer: NodeJS.Timeout | null;
  questions: typeof LIVE_QUIZ_QUESTIONS;
  roundTimeLeft: number;
}

let activeRooms: Room[] = [];
let matchmakingQueue: { ws: WebSocket; id: string; name: string; avatar: string; type: '1v1' | 'team'; team?: 'red' | 'blue'; userId?: string }[] = [];

// Helper to broadcast JSON to a room
function broadcastToRoom(room: Room, data: any) {
  room.players.forEach(p => {
    if (!p.isBot && p.ws && p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(JSON.stringify(data));
    }
  });
}

const BOT_NAMES = ["ByteBot 🤖", "hermione_codes 📚", "spell_caster_99 🧙‍♂️", "steve_miner ⛏️", "loop_master 🔁", "python_ninja 🥷"];
const BOT_AVATARS = ["🔥", "🎓", "⚡", "👾", "🦊", "🧙‍♂️"];

function createBot(team?: 'red' | 'blue'): Player {
  const nameIdx = Math.floor(Math.random() * BOT_NAMES.length);
  const avatarIdx = Math.floor(Math.random() * BOT_AVATARS.length);
  return {
    ws: null as any,
    id: "bot_" + Math.random().toString(36).substring(2, 9),
    name: BOT_NAMES[nameIdx],
    avatar: BOT_AVATARS[avatarIdx],
    team,
    score: 0,
    answers: {},
    isBot: true
  };
}

// Award XP to database users after a match
function awardXP(userId: string, xpEarned: number) {
  try {
    const db = loadDB();
    const progress = db.userProgress.find(p => p.user_id === userId);
    if (progress) {
      progress.xp_points = (progress.xp_points || 0) + xpEarned;
      // Also potentially award a badge if they hit milestone or win
      if (progress.xp_points >= 500 && !progress.badges.includes("Quiz Conqueror")) {
        progress.badges.push("Quiz Conqueror");
      }
      progress.updated_at = new Date().toISOString();
      saveDB(db);
    }
  } catch (err) {
    console.error("Failed to award XP to user:", userId, err);
  }
}

// Start the actual game loop for a room
function startQuizMatch(room: Room) {
  room.status = 'playing';
  room.currentQuestionIndex = 0;
  
  broadcastToRoom(room, {
    type: 'match_start',
    players: room.players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, team: p.team, score: p.score, isBot: p.isBot })),
    totalQuestions: room.questions.length,
    roomType: room.type
  });

  setTimeout(() => {
    pushNextQuestion(room);
  }, 2000);
}

// Push next question
function pushNextQuestion(room: Room) {
  if (room.status !== 'playing') return;
  if (room.currentQuestionIndex >= room.questions.length) {
    endQuizMatch(room);
    return;
  }

  const question = room.questions[room.currentQuestionIndex];
  room.roundTimeLeft = 20; // 20 seconds per question

  broadcastToRoom(room, {
    type: 'question_push',
    questionIndex: room.currentQuestionIndex,
    question: {
      id: question.id,
      concept: question.concept,
      question: question.question,
      codeContext: question.codeContext,
      options: question.options,
      type: question.type
    },
    timeLeft: room.roundTimeLeft
  });

  // Handle bots answering
  room.players.forEach(p => {
    if (p.isBot) {
      const answerDelay = 2000 + Math.random() * 8000; // 2-10 seconds
      setTimeout(() => {
        if (room.status !== 'playing' || room.currentQuestionIndex >= room.questions.length || room.questions[room.currentQuestionIndex].id !== question.id) return;
        
        // Correctness based on bot probability (75% correct)
        const isCorrect = Math.random() < 0.75;
        let selectedAnswer = question.correctAnswer;
        if (!isCorrect && question.options) {
          const incorrectOptions = question.options.filter(o => o !== question.correctAnswer);
          if (incorrectOptions.length > 0) {
            selectedAnswer = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
          }
        }
        
        const timeTakenMs = answerDelay;
        const timeRemaining = Math.max(0, 20 - (timeTakenMs / 1000));
        const pts = isCorrect ? 100 + Math.round(timeRemaining * 10) : 0;
        
        p.answers[question.id] = { answer: selectedAnswer, isCorrect, timeTakenMs };
        p.score += pts;

        broadcastToRoom(room, {
          type: 'player_answered',
          playerId: p.id,
          answered: true
        });

        checkAllAnswered(room);
      }, answerDelay);
    }
  });

  // Start ticking clock
  if (room.roundTimer) clearInterval(room.roundTimer);
  room.roundTimer = setInterval(() => {
    room.roundTimeLeft--;
    
    broadcastToRoom(room, {
      type: 'timer_tick',
      timeLeft: room.roundTimeLeft
    });

    if (room.roundTimeLeft <= 0) {
      if (room.roundTimer) clearInterval(room.roundTimer);
      evaluateRound(room);
    }
  }, 1000);
}

// Check if all players answered
function checkAllAnswered(room: Room) {
  const question = room.questions[room.currentQuestionIndex];
  const allAnswered = room.players.every(p => p.answers[question.id] !== undefined);
  if (allAnswered) {
    if (room.roundTimer) clearInterval(room.roundTimer);
    evaluateRound(room);
  }
}

// Evaluate round
function evaluateRound(room: Room) {
  if (room.roundTimer) clearInterval(room.roundTimer);
  
  const question = room.questions[room.currentQuestionIndex];
  
  // Set default wrong answers for players who didn't respond
  room.players.forEach(p => {
    if (p.answers[question.id] === undefined) {
      p.answers[question.id] = { answer: '', isCorrect: false, timeTakenMs: 20000 };
    }
  });

  broadcastToRoom(room, {
    type: 'round_result',
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      score: p.score,
      roundAnswer: p.answers[question.id]
    }))
  });

  room.currentQuestionIndex++;
  setTimeout(() => {
    pushNextQuestion(room);
  }, 4000); // 4 seconds delay before next round
}

// End the quiz match
function endQuizMatch(room: Room) {
  room.status = 'ended';
  if (room.roundTimer) clearInterval(room.roundTimer);

  // Determine winners
  let standings = [...room.players].sort((a, b) => b.score - a.score);
  
  // Award XP to logged-in users
  room.players.forEach(p => {
    if (!p.isBot && p.id && !p.id.startsWith("guest")) {
      const isWinner = standings[0].id === p.id;
      const xpToAward = isWinner ? 50 : 30;
      awardXP(p.id, xpToAward);
    }
  });

  broadcastToRoom(room, {
    type: 'quiz_end',
    standings: standings.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, score: p.score, team: p.team, isBot: p.isBot }))
  });

  // Remove room
  activeRooms = activeRooms.filter(r => r.id !== room.id);
}

function handleWebSocketConnection(ws: WebSocket) {
  let currentPlayerId: string | null = null;
  let currentRoomId: string | null = null;
  let userDbId: string | null = null;

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'join_lobby': {
          const { name, avatar, mode, team, token } = data;
          
          let userId = "guest_" + Math.random().toString(36).substring(2, 9);
          let playerName = name || "Guest Learner";
          
          if (token) {
            try {
              const decoded: any = jwt.verify(token, JWT_SECRET);
              userId = decoded.id;
              playerName = decoded.name || playerName;
              userDbId = userId;
            } catch (err) {
              console.warn("Lobby token verification failed, treating as guest");
            }
          }

          currentPlayerId = userId;

          // Remove any stale queue entry for this player
          matchmakingQueue = matchmakingQueue.filter(q => q.id !== userId);

          if (mode === '1v1') {
            const opponentIdx = matchmakingQueue.findIndex(q => q.type === '1v1');
            if (opponentIdx !== -1) {
              const opponent = matchmakingQueue[opponentIdx];
              matchmakingQueue.splice(opponentIdx, 1);

              const roomId = "room_" + Math.random().toString(36).substring(2, 9);
              currentRoomId = roomId;

              const newRoom: Room = {
                id: roomId,
                type: '1v1',
                players: [
                  { ws, id: userId, name: playerName, avatar, score: 0, answers: {} },
                  { ws: opponent.ws, id: opponent.id, name: opponent.name, avatar: opponent.avatar, score: 0, answers: {} }
                ],
                status: 'lobby',
                countdown: 5,
                currentQuestionIndex: 0,
                roundTimer: null,
                questions: LIVE_QUIZ_QUESTIONS,
                roundTimeLeft: 20
              };

              activeRooms.push(newRoom);
              
              broadcastToRoom(newRoom, {
                type: 'lobby_state',
                players: newRoom.players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar })),
                countdown: 5
              });

              let countdown = 5;
              const lobbyTimer = setInterval(() => {
                countdown--;
                broadcastToRoom(newRoom, {
                  type: 'lobby_state',
                  players: newRoom.players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar })),
                  countdown
                });
                if (countdown <= 0) {
                  clearInterval(lobbyTimer);
                  startQuizMatch(newRoom);
                }
              }, 1000);

            } else {
              matchmakingQueue.push({ ws, id: userId, name: playerName, avatar, type: '1v1', userId: userDbId || undefined });
              
              ws.send(JSON.stringify({
                type: 'waiting_in_lobby',
                message: "Searching for an opponent... Game will start with a Bot if no player joins in 5 seconds."
              }));

              setTimeout(() => {
                const inQueueIdx = matchmakingQueue.findIndex(q => q.id === userId);
                if (inQueueIdx !== -1) {
                  matchmakingQueue.splice(inQueueIdx, 1);
                  const roomId = "room_" + Math.random().toString(36).substring(2, 9);
                  currentRoomId = roomId;

                  const bot = createBot();
                  const newRoom: Room = {
                    id: roomId,
                    type: '1v1',
                    players: [
                      { ws, id: userId, name: playerName, avatar, score: 0, answers: {} },
                      bot
                    ],
                    status: 'lobby',
                    countdown: 3,
                    currentQuestionIndex: 0,
                    roundTimer: null,
                    questions: LIVE_QUIZ_QUESTIONS,
                    roundTimeLeft: 20
                  };

                  activeRooms.push(newRoom);
                  
                  broadcastToRoom(newRoom, {
                    type: 'lobby_state',
                    players: newRoom.players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, isBot: p.isBot })),
                    countdown: 3
                  });

                  let countdown = 3;
                  const lobbyTimer = setInterval(() => {
                    countdown--;
                    broadcastToRoom(newRoom, {
                      type: 'lobby_state',
                      players: newRoom.players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, isBot: p.isBot })),
                      countdown
                    });
                    if (countdown <= 0) {
                      clearInterval(lobbyTimer);
                      startQuizMatch(newRoom);
                    }
                  }, 1000);
                }
              }, 5000);
            }
          } else {
            // Team Battle mode
            let teamRoom = activeRooms.find(r => r.type === 'team' && r.status === 'lobby');
            
            if (!teamRoom) {
              const roomId = "room_" + Math.random().toString(36).substring(2, 9);
              teamRoom = {
                id: roomId,
                type: 'team',
                players: [],
                status: 'lobby',
                countdown: 8,
                currentQuestionIndex: 0,
                roundTimer: null,
                questions: LIVE_QUIZ_QUESTIONS,
                roundTimeLeft: 20
              };
              activeRooms.push(teamRoom);

              let countdown = 8;
              const lobbyTimer = setInterval(() => {
                if (!teamRoom) return;
                countdown--;
                teamRoom.countdown = countdown;

                broadcastToRoom(teamRoom, {
                  type: 'lobby_state',
                  players: teamRoom.players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, team: p.team })),
                  countdown
                });

                if (countdown <= 0) {
                  clearInterval(lobbyTimer);
                  
                  // Fill spots to ensure balance
                  while (teamRoom.players.filter(p => p.team === 'red').length < 2) {
                    teamRoom.players.push(createBot('red'));
                  }
                  while (teamRoom.players.filter(p => p.team === 'blue').length < 2) {
                    teamRoom.players.push(createBot('blue'));
                  }

                  startQuizMatch(teamRoom);
                }
              }, 1000);
            }

            currentRoomId = teamRoom.id;
            
            let assignedTeam: 'red' | 'blue' = team || 'red';
            const redCount = teamRoom.players.filter(p => p.team === 'red').length;
            const blueCount = teamRoom.players.filter(p => p.team === 'blue').length;
            
            if (!team) {
              assignedTeam = redCount <= blueCount ? 'red' : 'blue';
            }

            teamRoom.players.push({
              ws,
              id: userId,
              name: playerName,
              avatar,
              team: assignedTeam,
              score: 0,
              answers: {}
            });

            broadcastToRoom(teamRoom, {
              type: 'lobby_state',
              players: teamRoom.players.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, team: p.team })),
              countdown: teamRoom.countdown
            });
          }
          break;
        }

        case 'submit_answer': {
          if (!currentRoomId || !currentPlayerId) return;
          const room = activeRooms.find(r => r.id === currentRoomId);
          if (!room || room.status !== 'playing') return;

          const player = room.players.find(p => p.id === currentPlayerId);
          if (!player) return;

          const question = room.questions[room.currentQuestionIndex];
          
          if (player.answers[question.id] !== undefined) return;

          const { answer, timeTakenMs } = data;
          const isCorrect = answer === question.correctAnswer;
          const timeRemaining = Math.max(0, 20 - (timeTakenMs / 1000));
          const pts = isCorrect ? 100 + Math.round(timeRemaining * 10) : 0;

          player.answers[question.id] = { answer, isCorrect, timeTakenMs };
          player.score += pts;

          ws.send(JSON.stringify({
            type: 'answer_acknowledged',
            isCorrect,
            points: pts,
            correctAnswer: question.correctAnswer
          }));

          broadcastToRoom(room, {
            type: 'player_answered',
            playerId: currentPlayerId,
            answered: true
          });

          checkAllAnswered(room);
          break;
        }

        case 'chat_message': {
          if (!currentRoomId || !currentPlayerId) return;
          const room = activeRooms.find(r => r.id === currentRoomId);
          if (!room) return;

          const player = room.players.find(p => p.id === currentPlayerId);
          if (!player) return;

          broadcastToRoom(room, {
            type: 'chat_broadcast',
            playerId: currentPlayerId,
            name: player.name,
            message: data.message
          });
          break;
        }
      }
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  });

  ws.on('close', () => {
    if (currentPlayerId) {
      matchmakingQueue = matchmakingQueue.filter(q => q.id !== currentPlayerId);
    }

    if (currentRoomId && currentPlayerId) {
      const room = activeRooms.find(r => r.id === currentRoomId);
      if (room) {
        const player = room.players.find(p => p.id === currentPlayerId);
        if (player) {
          player.ws = null as any;
        }

        broadcastToRoom(room, {
          type: 'player_disconnected',
          playerId: currentPlayerId,
          name: player?.name || "Player"
        });

        const anyHumansLeft = room.players.some(p => !p.isBot && p.ws && p.ws.readyState === WebSocket.OPEN);
        if (!anyHumansLeft) {
          if (room.roundTimer) clearInterval(room.roundTimer);
          activeRooms = activeRooms.filter(r => r.id !== room.id);
        }
      }
    }
  });
}

// Setup HTTP and WebSocket server
const httpServer = createServer(app);
const wss = new WebSocketServer({ noServer: true });

httpServer.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
  if (pathname === "/api/quiz-arena") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on("connection", (ws) => {
  handleWebSocketConnection(ws);
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
