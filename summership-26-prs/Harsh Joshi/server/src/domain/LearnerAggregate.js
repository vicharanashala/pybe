const { ConceptMastered } = require('./events');

class LearnerAggregate {
    constructor(userId, initialLevel = 1, initialScore = 0, masteredConcepts = []) {
        this.userId = userId;
        this.level = initialLevel;
        this.score = initialScore;
        this.masteredConcepts = masteredConcepts;
        this.events = []; // Internal array to queue domain events
    }

    /**
     * Core Business Logic: The Adaptive 95/5 Evaluation
     */
    processAnswer(topic, isCorrect) {
        if (isCorrect) {
            this.score += 10;
            
            // Adaptive Difficulty Escalation
            if (this.score >= 20 && this.level < 4) {
                this.level += 1;
                this.score = 0; // reset for next tier
            }

            // If level 4 is completed correctly, the concept is mastered
            if (this.level === 4 && !this.masteredConcepts.includes(topic)) {
                this.masteredConcepts.push(topic);
                // Raise a Domain Event to be picked up by the Message Bus
                this.events.push(new ConceptMastered(this.userId, topic));
            }
            
            return { success: true, newLevel: this.level, message: "Perfect! Keep going." };
        } else {
            // Adaptive Difficulty De-escalation (Scaffolding)
            if (this.level > 1) {
                this.level -= 1;
            }
            return { success: false, newLevel: this.level, message: "Incorrect. Let's try an easier step." };
        }
    }
}

module.exports = LearnerAggregate;
