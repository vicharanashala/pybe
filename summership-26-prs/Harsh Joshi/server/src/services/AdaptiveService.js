class AdaptiveService {
    constructor() {
        // Levels: 1 (Options), 2 (Blanks), 3 (Fewer Blanks), 4 (Write Full Code)
        this.userStates = {}; 
    }

    initializeUser(userId, selectedCategory) {
        // Base motivation score is determined by the chosen category's inherent engagement
        // E.g., Gaming/Pop Culture might yield a higher starting engagement score
        const cat = (selectedCategory || '').toLowerCase();
        const baseMotivation = (cat.includes('games') || cat.includes('heroes') || cat.includes('super')) ? 2 : 1;
        this.userStates[userId] = { level: baseMotivation, score: 0 };
        return this.userStates[userId];
    }

    getUserState(userId) {
        return this.userStates[userId] || { level: 1, score: 0 };
    }

    evaluateAnswer(userId, topic, isCorrect) {
        let state = this.userStates[userId] || { level: 1, score: 0 };
        
        if (isCorrect) {
            state.score += 10;
            // Increase difficulty level if threshold met (max level 4)
            if (state.score >= 20 && state.level < 4) {
                state.level += 1;
                state.score = 0; // reset for next tier
            }
            return { success: true, newLevel: state.level, message: "Perfect! Level increased." };
        } else {
            // Decrease motivation/level to provide more scaffolding
            if (state.level > 1) state.level -= 1;
            return { success: false, newLevel: state.level, message: "Incorrect. Let's look at the explanation and try an easier step." };
        }
    }

    generatePracticeTemplate(archetype, currentLevel) {
        // Redacts the template based on difficulty level
        let template = archetype.practice_scenario;
        if (currentLevel === 1) return { type: 'options', data: template };
        if (currentLevel === 2) return { type: 'blanks', data: { ...template, options: null } };
        if (currentLevel === 3) {
            let minimalData = template.python_code_template
                .replace('while', '_____')
                .replace('if', '_____')
                .replace('def', '_____')
                .replace(' = ', ' _____ ')
                .replace("['", "_____");
            return { type: 'minimal_blanks', data: { ...template, python_code_template: minimalData, options: null } };
        }
        if (currentLevel === 4) {
            const topicNames = {
                'variables': 'variable assignment',
                'if/else logic': 'if/else conditional statement',
                'while loop': 'while loop',
                'lists': 'list collection',
                'functions': 'function definition'
            };
            const topicName = topicNames[archetype.concept] || archetype.concept || 'code';
            return { type: 'full_code', data: { ...template, pseudo_code_template: "No scaffolding provided at Level 4.", python_code_template: `Write the complete ${topicName} based on the story.`, options: null } };
        }
        return { type: 'options', data: template };
    }
}

module.exports = new AdaptiveService();
