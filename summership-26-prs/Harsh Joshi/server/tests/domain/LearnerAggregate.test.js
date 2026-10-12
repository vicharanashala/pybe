const LearnerAggregate = require('../../src/domain/LearnerAggregate');

describe('LearnerAggregate', () => {
    let aggregate;

    beforeEach(() => {
        aggregate = new LearnerAggregate('test_user');
    });

    it('should initialize with correct default values', () => {
        expect(aggregate.userId).toBe('test_user');
        expect(aggregate.level).toBe(1);
        expect(aggregate.score).toBe(0);
        expect(aggregate.masteredConcepts).toEqual([]);
        expect(aggregate.events).toEqual([]);
    });

    it('should increment score and level on correct answer', () => {
        // First correct answer -> score = 10, level = 1
        const result1 = aggregate.processAnswer('variables', true);
        expect(result1.success).toBe(true);
        expect(aggregate.score).toBe(10);
        expect(aggregate.level).toBe(1);

        // Second correct answer -> score = 20, which triggers level up -> level = 2, score = 0
        const result2 = aggregate.processAnswer('variables', true);
        expect(result2.newLevel).toBe(2);
        expect(aggregate.score).toBe(0);
        expect(aggregate.level).toBe(2);
    });

    it('should decrease level on incorrect answer if level > 1', () => {
        // Level up first
        aggregate.processAnswer('variables', true);
        aggregate.processAnswer('variables', true);
        expect(aggregate.level).toBe(2);

        // Incorrect answer -> level drops to 1
        const result = aggregate.processAnswer('variables', false);
        expect(result.success).toBe(false);
        expect(aggregate.level).toBe(1);
        
        // Incorrect again -> level stays 1
        aggregate.processAnswer('variables', false);
        expect(aggregate.level).toBe(1);
    });

    it('should emit ConceptMastered event when reaching level 4 and correctly answering', () => {
        aggregate.level = 4;
        const result = aggregate.processAnswer('variables', true);
        
        expect(result.success).toBe(true);
        expect(aggregate.masteredConcepts).toContain('variables');
        
        // Check if event was raised
        expect(aggregate.events.length).toBe(1);
        expect(aggregate.events[0].name).toBe('ConceptMastered');
        expect(aggregate.events[0].concept).toBe('variables');
    });
});
