const personalizedRepo = require('../repositories/PersonalizedRepo');
const adaptiveService = require('./AdaptiveService');

class PersonalizedService {
  /**
   * Helper function to replace {placeholders} in the master archetype
   * with specific vocabulary from the thematic dictionary and smart fallbacks.
   */
  _interpolate(template, dictionary) {
    if (!template) return "";
    if (typeof template !== 'string') return template;

    // Enrich dictionary with smart fallbacks for practice scenarios across all 250 worlds
    const enriched = { ...dictionary };
    if (!enriched.practice_action) {
      enriched.practice_action = enriched.repeated_action || enriched.desired_action || enriched.function_name || "complete the bonus challenge";
    }
    if (!enriched.practice_variable) {
      enriched.practice_variable = enriched.state_variable || enriched.container_name || "bonus_score";
    }
    if (!enriched.practice_target) {
      enriched.practice_target = enriched.target_condition || enriched.threshold || "100";
    }
    if (!enriched.practice_item) {
      enriched.practice_item = enriched.item_1 || "Magic Gem";
    }

    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return enriched[key] !== undefined ? enriched[key] : match;
    });
  }

  /**
   * Deeply interpolates an entire object (like practice_scenario or options).
   */
  _interpolateObject(obj, dictionary) {
    if (typeof obj === 'string') {
      return this._interpolate(obj, dictionary);
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this._interpolateObject(item, dictionary));
    }
    if (obj && typeof obj === 'object') {
      const result = {};
      for (const [k, v] of Object.entries(obj)) {
        result[k] = this._interpolateObject(v, dictionary);
      }
      return result;
    }
    return obj;
  }

  /**
   * Returns all 50 categories from the database for the Grid Dashboard.
   */
  getCategories() {
    return personalizedRepo.getAllCategories();
  }

  /**
   * Generates the 4-step sequence (Example Story, Side-by-Side Discovery, Practice Story, Adaptive Evaluation).
   */
  generateCaseStudy(payload) {
    let { themeId, categoryId, topic = 'loop', userId = 'guest_user' } = payload || {};

    // Determine target theme ID
    if (!themeId && categoryId) {
      themeId = `${categoryId}_${topic}`;
      // Fallback if exact topic suffix doesn't match
      if (!personalizedRepo.getTheme(themeId)) {
        themeId = `${categoryId}_var`;
      }
    }
    if (!themeId) {
      themeId = 'pets_loop'; // Safe default
    }

    let theme = personalizedRepo.getTheme(themeId);
    if (!theme) {
      // Try finding any theme starting with categoryId or use fallback
      const allThemes = personalizedRepo.getAllThemes ? personalizedRepo.getAllThemes() : {};
      const foundKey = Object.keys(allThemes).find(k => k.startsWith(themeId.split('_')[0]));
      theme = foundKey ? allThemes[foundKey] : personalizedRepo.getTheme('pets_loop');
    }

    if (!theme) {
      throw new Error(`Theme '${themeId}' could not be resolved.`);
    }

    const archetype = personalizedRepo.getArchetype(theme.allowed_archetype);
    if (!archetype) {
      throw new Error(`Archetype '${theme.allowed_archetype}' not found.`);
    }

    // Initialize or retrieve adaptive user state
    const userState = adaptiveService.initializeUser(userId, themeId);

    // Interpolate Example Scenario
    const exampleScenario = {
      pure_story: this._interpolate(archetype.example_scenario.pure_story, theme),
      pseudo_code: this._interpolate(archetype.example_scenario.pseudo_code, theme),
      python_code: this._interpolate(archetype.example_scenario.python_code, theme)
    };

    // Interpolate Practice Scenario
    const interpolatedPractice = this._interpolateObject(archetype.practice_scenario, theme);

    // Generate Adaptive Practice Template based on user's current Level (1 to 4)
    const practiceEvaluation = adaptiveService.generatePracticeTemplate(
      { ...archetype, practice_scenario: interpolatedPractice },
      userState.level
    );

    return {
      themeId,
      concept: archetype.concept,
      domain: theme.domain,
      character: theme.character,
      userState,
      example_scenario: exampleScenario,
      practice_scenario: {
        pure_story: interpolatedPractice.pure_story,
        evaluation: practiceEvaluation,
        options: interpolatedPractice.options,
        explanations: interpolatedPractice.explanations,
        raw_python_template: interpolatedPractice.python_code_template,
        raw_pseudo_template: interpolatedPractice.pseudo_code_template
      }
    };
  }

  /**
   * Evaluates user practice submission and updates adaptive difficulty state.
   */
  evaluateAnswer(userId = 'guest_user', topic, isCorrect, themeId) {
    const evalResult = adaptiveService.evaluateAnswer(userId, topic, isCorrect);
    const userState = adaptiveService.getUserState(userId);

    let updatedPractice = null;
    if (themeId) {
      const theme = personalizedRepo.getTheme(themeId);
      if (theme) {
        const archetype = personalizedRepo.getArchetype(theme.allowed_archetype);
        if (archetype) {
          const interpolatedPractice = this._interpolateObject(archetype.practice_scenario, theme);
          updatedPractice = adaptiveService.generatePracticeTemplate(
            { ...archetype, practice_scenario: interpolatedPractice },
            userState.level
          );
        }
      }
    }

    return {
      ...evalResult,
      userState,
      updatedPractice
    };
  }
}

module.exports = new PersonalizedService();
