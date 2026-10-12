const personalizedRepo = require('../repositories/PersonalizedRepo');
const commandHandlers = require('./CommandHandlers');
const { StartJourney } = require('../domain/commands');

class StoryOrchestratorService {
    /**
     * Helper to replace {placeholders} with specific theme vocabulary.
     */
    _interpolate(templateString, dictionary) {
        if (!templateString) return "";
        const enriched = { ...dictionary };
        if (!enriched.practice_action) enriched.practice_action = enriched.repeated_action || enriched.desired_action || enriched.function_name || "complete the bonus challenge";
        if (!enriched.practice_variable) enriched.practice_variable = enriched.state_variable || enriched.container_name || "bonus_score";
        if (!enriched.practice_target) enriched.practice_target = enriched.target_condition || enriched.threshold || "100";
        if (!enriched.practice_item) enriched.practice_item = enriched.item_1 || "Magic Gem";
        return templateString.replace(/\{(\w+)\}/g, (match, key) => {
            return enriched[key] !== undefined ? enriched[key] : match;
        });
    }

    /**
     * Orchestrates the 4-Step Adaptive Learning Journey.
     */
    async generateAdaptiveJourney(userId, themeId) {
        // 1. Fetch the chosen theme dictionary
        const theme = personalizedRepo.getTheme(themeId);
        if (!theme) throw new Error(`Theme '${themeId}' not found.`);

        // 2. Fetch the corresponding master archetype (e.g., 'loop_depletion')
        const archetype = personalizedRepo.getArchetype(theme.allowed_archetype);
        if (!archetype) throw new Error(`Archetype '${theme.allowed_archetype}' not found.`);

        // 3. Initialize or fetch the user's current adaptive state via StartJourney Command
        const userState = await commandHandlers.handleStartJourney(new StartJourney(userId, themeId));

        // 4. Interpolate the Example Story & Side-by-Side Code
        const exampleStory = this._interpolate(archetype.example_scenario.pure_story, theme);
        const pseudoCode = this._interpolate(archetype.example_scenario.pseudo_code, theme);
        const pythonCode = this._interpolate(archetype.example_scenario.python_code, theme);

        // 5. Generate the Adaptive Practice Scenario based on the user's level
        const practiceData = commandHandlers.generatePracticeTemplate(archetype, userState.level);
        
        // Deep copy and interpolate the practice template
        const practiceScenario = {
            pure_story: this._interpolate(practiceData.data.pure_story, theme),
            task_type: practiceData.type,
            pseudo_template: this._interpolate(practiceData.data.pseudo_code_template, theme),
            python_template: this._interpolate(practiceData.data.python_code_template, theme),
            options: practiceData.data.options ? {
                blank_1: (practiceData.data.options.blank_1 || []).map(opt => this._interpolate(opt, theme)),
                blank_2: (practiceData.data.options.blank_2 || []).map(opt => this._interpolate(opt, theme))
            } : null,
            explanations: practiceData.data.explanations
        };

        // 6. Return the perfectly assembled 4-Step Sequence
        return {
            topic: archetype.concept,
            currentLevel: userState.level,
            step1_exampleStory: exampleStory,
            step2_discovery: { pseudo: pseudoCode, python: pythonCode },
            step3_practiceStory: practiceScenario.pure_story,
            step4_evaluation: practiceScenario
        };
    }
}

module.exports = new StoryOrchestratorService();
