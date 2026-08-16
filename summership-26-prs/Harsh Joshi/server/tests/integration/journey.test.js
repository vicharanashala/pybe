const request = require('supertest');
const app = require('../../src/index');

describe('Learning Journey Integration', () => {
    it('POST /api/journey/start should return a 4-step journey', async () => {
        const response = await request(app)
            .post('/api/journey/start')
            .send({
                userId: 'test_user_integration',
                themeId: 'pets_var'
            });
            
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('step1_exampleStory');
        expect(response.body.data).toHaveProperty('step2_discovery');
        expect(response.body.data).toHaveProperty('step3_practiceStory');
        expect(response.body.data).toHaveProperty('step4_evaluation');
        expect(response.body.data.topic).toBeDefined();
    });

    it('POST /api/journey/evaluate should process answer and update difficulty', async () => {
        // Start Journey
        await request(app)
            .post('/api/journey/start')
            .send({
                userId: 'test_user_eval',
                themeId: 'pets_var'
            });

        // Evaluate Correct
        const evalRes = await request(app)
            .post('/api/journey/evaluate')
            .send({
                userId: 'test_user_eval',
                topic: 'variables',
                isCorrect: true
            });
            
        expect(evalRes.statusCode).toBe(200);
        expect(evalRes.body.success).toBe(true);
        expect(evalRes.body.data.success).toBe(true);
        expect(evalRes.body.data.newLevel).toBeDefined();
    });
});
