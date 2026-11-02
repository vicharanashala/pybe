class MessageBus {
    constructor() {
        this.handlers = {
            'ConceptMastered': [this.checkContradictions.bind(this)],
            'ContradictionTriggered': [this.handleProductiveStruggle.bind(this)]
        };
        
        // In-memory mock for mastered concepts (replace with DB later)
        this.userMastery = {}; 
    }

    async handle(event) {
        const eventHandlers = this.handlers[event.name] || [];
        for (const handler of eventHandlers) {
            await handler(event);
        }
    }

    // HANDLER: The Contradiction Engine
    async checkContradictions(event) {
        if (!this.userMastery[event.userId]) {
            this.userMastery[event.userId] = [];
        }

        const mastered = this.userMastery[event.userId];
        
        // Contradiction Rule: Learner knows "Variables" (single value) but is attempting "Lists" (many values)
        if (mastered.includes('variables_identity') && event.concept === 'lists_inventory') {
            const { ContradictionTriggered } = require('../domain/events');
            
            const contradictionEvent = new ContradictionTriggered(
                event.userId, 
                'variables_identity', 
                'lists_inventory',
                "Wait! You learned that a variable holds ONE value. How can this container hold MANY items? Your previous rule is breaking!"
            );
            
            console.log(`[Contradiction Engine] Paradox detected for User ${event.userId}`);
            await this.handle(contradictionEvent);
        } else {
            // No contradiction, record mastery
            mastered.push(event.concept);
            console.log(`[Contradiction Engine] Mastery recorded for User ${event.userId}: ${event.concept}`);
        }
    }

    // HANDLER: Productive Struggle Trigger
    async handleProductiveStruggle(event) {
        // In the full system, this would interrupt the frontend API and inject a "Dilemma" Case Study
        console.log(`[Message Bus] Triggering Productive Struggle UI: ${event.message}`);
    }
}

module.exports = new MessageBus();
