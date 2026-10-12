const UnitOfWork = require('../uow/UnitOfWork');
const messageBus = require('./MessageBus');
const LearnerAggregate = require('../domain/LearnerAggregate');
const { StartJourney, SubmitPracticeAnswer } = require('../domain/commands');

class CommandHandlers {
    constructor() {
        // In-memory aggregate storage (simulating persistent aggregate repository)
        this.aggregates = {};
    }

    getOrCreateAggregate(userId, initialLevel = 1) {
        if (!this.aggregates[userId]) {
            this.aggregates[userId] = new LearnerAggregate(userId, initialLevel, 0, []);
        }
        return this.aggregates[userId];
    }

    /**
     * Command Handler for StartJourney
     * Initializes or retrieves the learner's aggregate within a Unit of Work transaction.
     */
    async handleStartJourney(command) {
        const uow = new UnitOfWork();
        await uow.begin();
        try {
            const cat = (command.themeId || '').toLowerCase();
            const baseMotivation = (cat.includes('games') || cat.includes('heroes') || cat.includes('super') || cat.includes('minecraft')) ? 2 : 1;
            
            const aggregate = this.getOrCreateAggregate(command.userId, baseMotivation);
            
            await uow.commit();
            return { level: aggregate.level, score: aggregate.score, masteredConcepts: aggregate.masteredConcepts };
        } catch (error) {
            await uow.rollback();
            throw error;
        }
    }

    /**
     * Command Handler for SubmitPracticeAnswer
     * Executes the adaptive 95/5 evaluation on the LearnerAggregate, collects domain events
     * via Unit of Work, commits atomically, and publishes events to the Message Bus.
     */
    async handleSubmitPracticeAnswer(command) {
        const uow = new UnitOfWork();
        await uow.begin();
        try {
            const aggregate = this.getOrCreateAggregate(command.userId);
            
            // Execute business logic on the consistency boundary
            const result = aggregate.processAnswer(command.topic, command.isCorrect);
            
            // Queue domain events from the aggregate into the Unit of Work
            if (aggregate.events && aggregate.events.length > 0) {
                aggregate.events.forEach(event => uow.addEvent(event));
                aggregate.events = []; // clear aggregate queue
            }
            
            await uow.commit();

            // Extract events from UoW and dispatch via Message Bus
            const eventsToPublish = uow.extractEvents();
            for (const event of eventsToPublish) {
                await messageBus.handle(event);
            }
            
            return result;
        } catch (error) {
            await uow.rollback();
            throw error;
        }
    }

    // --- Backward Compatibility & Helper Methods (Replacing AdaptiveService.js) ---

    async initializeUser(userId, themeId) {
        return await this.handleStartJourney(new StartJourney(userId, themeId));
    }

    async evaluateAnswer(userId, topic, isCorrect) {
        return await this.handleSubmitPracticeAnswer(new SubmitPracticeAnswer(userId, topic, isCorrect));
    }

    getUserState(userId) {
        const agg = this.aggregates[userId];
        return agg ? { level: agg.level, score: agg.score, masteredConcepts: agg.masteredConcepts } : { level: 1, score: 0, masteredConcepts: [] };
    }

    generatePracticeTemplate(archetype, currentLevel) {
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

module.exports = new CommandHandlers();
