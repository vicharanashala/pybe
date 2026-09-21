// server/src/data/store.js
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Store {
  constructor() {
    this.dbPath = path.join(__dirname, 'db.json');
    this.initialized = false;
  }

  // Initialize the database if it doesn't exist
  async init() {
    if (this.initialized) return;
    
    try {
      await fs.access(this.dbPath);
    } catch (error) {
      // Create initial db.json if it doesn't exist
      const initialData = {
        scenarios: [],
        sessions: [],
        analytics: { sessions: [] },
        roadmap: []
      };
      await fs.writeFile(this.dbPath, JSON.stringify(initialData, null, 2));
    }
    
    this.initialized = true;
  }

  // Read the entire database
  async readDb() {
    await this.init();
    const data = await fs.readFile(this.dbPath, 'utf8');
    return JSON.parse(data);
  }

  // Write to the database
  async writeDb(data) {
    await this.init();
    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
  }

  // Reset data with new scenarios
  async resetData(scenarios) {
    const db = {
      scenarios: scenarios.map(scenario => ({
        _id: uuidv4(),
        ...scenario,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      sessions: [],
      analytics: { sessions: [] },
      roadmap: [
        {
          phase: "V0",
          title: "Core Learning Experience",
          summary: "Scenario interface, abstraction mapping, conversational questioning, Python construct generation, and prompt evaluation.",
          items: [
            "Scenario Interface",
            "AI Abstraction Mapper",
            "Conversational Questioning",
            "Python Construct Generator",
            "Prompt Evaluation Engine"
          ]
        },
        {
          phase: "V1",
          title: "Educational Data Engine",
          summary: "Structured educational data for scenarios, learner interactions, reflections, misconceptions, and prompts.",
          items: [
            "Scenario Database",
            "Learner Interaction Logging",
            "Reflection Storage",
            "Misconception Dataset",
            "Prompt Dataset Builder"
          ]
        },
        {
          phase: "V2",
          title: "TinyLLM Specialization",
          summary: "RAG, retrieval, prompt grading, scenario generation, and misconception detection for a specialized learning companion.",
          items: [
            "RAG Pipeline",
            "Educational Retrieval Engine",
            "Prompt Grading Model",
            "Scenario Generation Model",
            "Misconception Detection Model"
          ]
        },
        {
          phase: "V3",
          title: "Intelligent Learning Ecosystem",
          summary: "Personalized pathways, persistent mentor, dashboard, gamification, and collaborative learning.",
          items: [
            "Learner Dashboard",
            "Gamification System",
            "Adaptive Learning Engine",
            "Persistent AI Mentor",
            "Community Ecosystem"
          ]
        }
      ]
    };
    
    await this.writeDb(db);
    return db;
  }

  // ============ SCENARIO METHODS ============
  
  async listScenarios() {
    const db = await this.readDb();
    return db.scenarios || [];
  }

  async getScenario(id) {
    const db = await this.readDb();
    return db.scenarios?.find(s => s._id === id) || null;
  }

  async addScenario(scenarioData) {
    const db = await this.readDb();
    const newScenario = {
      _id: uuidv4(),
      ...scenarioData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!db.scenarios) db.scenarios = [];
    db.scenarios.push(newScenario);
    await this.writeDb(db);
    return newScenario;
  }

  async updateScenario(id, updates) {
    const db = await this.readDb();
    const index = db.scenarios?.findIndex(s => s._id === id);
    if (index === -1) throw new Error('Scenario not found');
    
    db.scenarios[index] = { 
      ...db.scenarios[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.writeDb(db);
    return db.scenarios[index];
  }

  async deleteScenario(id) {
    const db = await this.readDb();
    db.scenarios = db.scenarios?.filter(s => s._id !== id) || [];
    await this.writeDb(db);
  }

  // ============ SESSION METHODS ============
  
  async listSessions() {
    const db = await this.readDb();
    return db.sessions || [];
  }

  async getSession(id) {
    const db = await this.readDb();
    return db.sessions?.find(s => s.id === id || s._id === id) || null;
  }

  async addSession(sessionData) {
    const db = await this.readDb();
    
    const newSession = {
      id: uuidv4(),
      _id: uuidv4(),
      learnerName: sessionData.learnerName || 'Guest learner',
      scenario: sessionData.scenario || sessionData.scenarioId,
      reasoning: sessionData.reasoning || '',
      promptText: sessionData.promptText || '',
      abstractionMap: sessionData.abstractionMap || [],
      generatedCode: sessionData.generatedCode || '',
      codeExplanation: sessionData.codeExplanation || '',
      promptScore: sessionData.promptScore || 0,
      promptFeedback: sessionData.promptFeedback || '',
      reflection: sessionData.reflection || '',
      misconceptions: sessionData.misconceptions || [],
      masterySignals: sessionData.masterySignals || [],
      score: sessionData.score || 0,
      codeWritten: sessionData.codeWritten || '',
      timeSpent: sessionData.timeSpent || 0,
      status: sessionData.status || 'in_progress',
      completedAt: sessionData.completedAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!db.sessions) db.sessions = [];
    db.sessions.push(newSession);
    await this.writeDb(db);
    return newSession;
  }

  async updateSession(id, updates) {
    const db = await this.readDb();
    const index = db.sessions?.findIndex(s => s.id === id || s._id === id);
    if (index === -1) throw new Error('Session not found');
    
    const { id: _id, _id: __id, createdAt, ...allowedUpdates } = updates;
    
    db.sessions[index] = { 
      ...db.sessions[index], 
      ...allowedUpdates,
      updatedAt: new Date().toISOString()
    };
    await this.writeDb(db);
    return db.sessions[index];
  }

  async deleteSession(id) {
    const db = await this.readDb();
    db.sessions = db.sessions?.filter(s => s.id !== id && s._id !== id) || [];
    await this.writeDb(db);
  }

  async getSessionsByScenario(scenarioId) {
    const db = await this.readDb();
    return db.sessions?.filter(s => s.scenario === scenarioId) || [];
  }

  async getSessionsByLearner(learnerName) {
    const db = await this.readDb();
    return db.sessions?.filter(s => s.learnerName === learnerName) || [];
  }

  // ============ ANALYTICS METHODS ============
  
  async getAnalytics() {
    const db = await this.readDb();
    return db.analytics || { sessions: [] };
  }

  async addAnalyticsSession(sessionData) {
    const db = await this.readDb();
    if (!db.analytics) db.analytics = { sessions: [] };
    db.analytics.sessions.push({
      ...sessionData,
      addedAt: new Date().toISOString()
    });
    await this.writeDb(db);
    return db.analytics;
  }

  async updateAnalytics(updates) {
    const db = await this.readDb();
    db.analytics = { ...db.analytics, ...updates };
    await this.writeDb(db);
    return db.analytics;
  }

  // ============ ROADMAP METHODS ============
  
  async getRoadmap() {
    const db = await this.readDb();
    return db.roadmap || [];
  }

  async updateRoadmap(roadmapData) {
    const db = await this.readDb();
    db.roadmap = roadmapData;
    await this.writeDb(db);
    return db.roadmap;
  }

  // ============ STATISTICS METHODS ============
  
  async getStats() {
    const db = await this.readDb();
    const sessions = db.sessions || [];
    const scenarios = db.scenarios || [];
    const completedSessions = sessions.filter(s => s.status === 'completed');
    
    const totalScore = completedSessions.reduce((sum, s) => sum + (s.score || 0), 0);
    const avgScore = completedSessions.length > 0 ? totalScore / completedSessions.length : 0;
    
    const conceptCounts = {};
    sessions.forEach(session => {
      session.abstractionMap?.forEach(map => {
        const concept = map.pythonConcept || 'unknown';
        conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
      });
    });
    
    const misconceptionCounts = {};
    sessions.forEach(session => {
      session.misconceptions?.forEach(misconception => {
        misconceptionCounts[misconception] = (misconceptionCounts[misconception] || 0) + 1;
      });
    });
    
    return {
      totalScenarios: scenarios.length,
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      averageScore: Math.round(avgScore),
      conceptCounts,
      misconceptionCounts,
      recentSessions: sessions.slice(-5).reverse()
    };
  }

  // ============ UTILITY METHODS ============
  
  async clearAllData() {
    const emptyData = {
      scenarios: [],
      sessions: [],
      analytics: { sessions: [] },
      roadmap: []
    };
    await this.writeDb(emptyData);
  }

  async seedData(initialData) {
    await this.writeDb(initialData);
  }

  async backupDb() {
    const db = await this.readDb();
    const backupPath = path.join(__dirname, `db_backup_${Date.now()}.json`);
    await fs.writeFile(backupPath, JSON.stringify(db, null, 2));
    return backupPath;
  }

  async restoreDb(backupPath) {
    const data = await fs.readFile(backupPath, 'utf8');
    await this.writeDb(JSON.parse(data));
  }
}

// Export singleton instance
module.exports = new Store();