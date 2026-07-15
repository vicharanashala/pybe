/**
 * Scenario Validator Tests
 * =========================
 */

import { describe, it, expect } from 'vitest';
import {
  ScenarioValidator,
  validateScenario,
  formatValidationErrors,
  VALID_DOMAINS,
  VALID_JONASAN_TYPES
} from '../src/lib/scenario-validator.js';

function getValidScenario() {
  return {
    id: 'test-scenario',
    title: 'Test Scenario Title Here',
    domain: 'Philosophy',
    pythonConcept: 'Recursion',
    difficultyLevel: 3,
    jonasanType: 'Structured Inquiry',
    philosophicalAnchor: 'This is a philosophical anchor that explains the deep why of this concept and is at least fifty characters long. This additional text ensures it passes the 100 character advisory threshold for full philosophical depth.',
    theoryPillar: 'Theory pillar content that is at least thirty characters long.',
    anchorPillar: 'Anchor pillar content that connects to interdisciplinary concepts and is at least thirty chars.',
    triggerPillar: 'Trigger pillar content that provides the narrative case study and is at least thirty chars.',
    realityPillar: 'Reality pillar content describing engineering depth and real-world usage patterns.',
    caseStudy: 'This is a case study narrative that describes a specific scenario learners will engage with. It must be at least one hundred characters to pass validation and provide a complete context for the learner to understand and solve the problem.',
    hints: [
      { level: 1, text: 'Hint one asks a Socratic question about the concept?' },
      { level: 2, text: 'Hint two guides without giving direct answer?' },
      { level: 3, text: 'Hint three encourages deeper reflection?' }
    ],
    targetConstructs: ['Recursion', 'Function calls'],
    briefDescription: 'A brief test scenario description'
  };
}

describe('ScenarioValidator', () => {
  describe('validate with valid data', () => {
    it('should pass validation with complete valid scenario', () => {
      const validator = new ScenarioValidator();
      validator.validate(getValidScenario());
      expect(validator.isValid).toBe(true);
      expect(validator.errors.length).toBe(0);
    });
  });

  describe('validateIdAndTitle', () => {
    it('should require title', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), title: undefined };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('title').code).toBe('required');
    });

    it('should reject short title', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), title: 'Short' };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('title').code).toBe('min_length');
    });

    it('should reject title over 100 chars', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), title: 'A'.repeat(101) };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('title').code).toBe('max_length');
    });

    it('should require id', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), id: undefined };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('id').code).toBe('required');
    });

    it('should reject invalid id format', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), id: 'Invalid ID With Spaces' };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('id').code).toBe('format_error');
    });

    it('should reject id starting with hyphen', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), id: '-invalid-id' };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('id').code).toBe('format_error');
    });

    it('should accept valid kebab-case id', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), id: 'my-scenario-id' };
      validator.validate(data);
      expect(validator.getError('id')).toBeUndefined();
    });
  });

  describe('validateFoundation', () => {
    it('should require domain', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), domain: undefined };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('domain').code).toBe('required');
    });

    it('should warn on non-standard domain', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), domain: 'Custom Domain' };
      validator.validate(data);
      expect(validator.getWarning('domain')).toBeDefined();
      expect(validator.getWarning('domain').code).toBe('non_standard');
    });

    it('should accept standard domains', () => {
      for (const domain of VALID_DOMAINS) {
        const validator = new ScenarioValidator();
        const data = { ...getValidScenario(), domain };
        validator.validate(data);
        expect(validator.getWarning('domain')?.code).not.toBe('non_standard');
      }
    });

    it('should require pythonConcept', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), pythonConcept: undefined };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('pythonConcept').code).toBe('required');
    });

    it('should require difficultyLevel', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), difficultyLevel: undefined };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('difficultyLevel').code).toBe('required');
    });

    it('should reject difficulty outside 1-5 range', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), difficultyLevel: 6 };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('difficultyLevel').code).toBe('range_error');
    });

    it('should reject non-integer difficulty', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), difficultyLevel: 3.5 };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('difficultyLevel').code).toBe('range_error');
    });

    it('should require jonasanType', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), jonasanType: undefined };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('jonasanType').code).toBe('required');
    });

    it('should accept valid jonasan types', () => {
      for (const type of VALID_JONASAN_TYPES) {
        const validator = new ScenarioValidator();
        const data = { ...getValidScenario(), jonasanType: type };
        validator.validate(data);
        expect(validator.getError('jonasanType')).toBeUndefined();
      }
    });
  });

  describe('validatePhilosophicalAnchor', () => {
    it('should require philosophicalAnchor', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), philosophicalAnchor: undefined };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('philosophicalAnchor').code).toBe('required');
    });

    it('should require minimum 50 chars for anchor', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), philosophicalAnchor: 'Short' };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('philosophicalAnchor').code).toBe('min_length');
    });

    it('should warn for anchor under 100 chars', () => {
      const validator = new ScenarioValidator();
      const data = {
        ...getValidScenario(),
        philosophicalAnchor: 'Exactly fifty chars!'.padEnd(50, 'x')
      };
      validator.validate(data);
      expect(validator.getWarning('philosophicalAnchor')).toBeDefined();
    });
  });

  describe('validateFourPillars', () => {
    it('should require all four pillars', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), theoryPillar: undefined };
      validator.validate(data);
      expect(validator.isValid).toBe(false);

      const data2 = { ...getValidScenario(), anchorPillar: undefined };
      const v2 = new ScenarioValidator();
      v2.validate(data2);
      expect(v2.isValid).toBe(false);

      const data3 = { ...getValidScenario(), triggerPillar: undefined };
      const v3 = new ScenarioValidator();
      v3.validate(data3);
      expect(v3.isValid).toBe(false);

      const data4 = { ...getValidScenario(), realityPillar: undefined };
      const v4 = new ScenarioValidator();
      v4.validate(data4);
      expect(v4.isValid).toBe(false);
    });

    it('should require minimum 30 chars for each pillar', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), theoryPillar: 'Too short' };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('theoryPillar').code).toBe('min_length');
    });
  });

  describe('validateCaseStudy', () => {
    it('should require caseStudy', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), caseStudy: undefined, triggerPillar: undefined };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('caseStudy').code).toBe('required');
    });

    it('should require minimum 100 chars', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), caseStudy: 'Too short' };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('caseStudy').code).toBe('min_length');
    });

    it('should warn if caseStudy contains python syntax', () => {
      const validator = new ScenarioValidator();
      const data = {
        ...getValidScenario(),
        caseStudy: 'This case study narrative is plenty long enough to pass the minimum character requirement and uses print() to demonstrate output.'
      };
      validator.validate(data);
      const caseStudyError = validator.getError('caseStudy');
      expect(caseStudyError?.code).toBe('syntax_detected');
    });
  });

  describe('validateHints', () => {
    it('should require at least 1 hint', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), hints: [] };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('hints').code).toBe('required');
    });

    it('should require at least 3 hints', () => {
      const validator = new ScenarioValidator();
      const data = {
        ...getValidScenario(),
        hints: [
          { level: 1, text: 'Hint one is long enough to pass validation' },
          { level: 2, text: 'Hint two is also sufficiently long' }
        ]
      };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('hints').code).toBe('min_length');
    });

    it('should warn when more than 5 hints', () => {
      const validator = new ScenarioValidator();
      const data = {
        ...getValidScenario(),
        hints: [
          { level: 1, text: 'Hint one question?' },
          { level: 2, text: 'Hint two question?' },
          { level: 3, text: 'Hint three question?' },
          { level: 4, text: 'Hint four question?' },
          { level: 5, text: 'Hint five question?' },
          { level: 6, text: 'Hint six question?' }
        ]
      };
      validator.validate(data);
      expect(validator.getWarning('hints').code).toBe('advisory');
    });

    it('should detect Socratic violations in hints', () => {
      const validator = new ScenarioValidator();
      const data = {
        ...getValidScenario(),
        hints: [
          { level: 1, text: 'The answer is to use recursion' },
          { level: 2, text: 'Hint two question?' },
          { level: 3, text: 'Hint three question?' }
        ]
      };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      const socraticError = validator.errors.find(e => e.code === 'socratic_violation');
      expect(socraticError).toBeDefined();
    });

    it('should reject hints that suggest calling a function', () => {
      const validator = new ScenarioValidator();
      const data = {
        ...getValidScenario(),
        hints: [
          { level: 1, text: 'The answer is to use recursion to solve it' },
          { level: 2, text: 'Use the dir() function to explore methods' },
          { level: 3, text: 'Have you considered the base case?' }
        ]
      };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      const socraticViolations = validator.errors.filter(e => e.code === 'socratic_violation');
      expect(socraticViolations.length).toBeGreaterThan(0);
    });

    it('should require hint text to be at least 15 characters', () => {
      const validator = new ScenarioValidator();
      const data = {
        ...getValidScenario(),
        hints: [
          { level: 1, text: 'Short' },
          { level: 2, text: 'Hint two question?' },
          { level: 3, text: 'Hint three question?' }
        ]
      };
      validator.validate(data);
      expect(validator.isValid).toBe(false);
      expect(validator.getError('hints[0].text').code).toBe('min_length');
    });

    it('should warn if hint does not end with question mark', () => {
      const validator = new ScenarioValidator();
      const data = {
        ...getValidScenario(),
        hints: [
          { level: 1, text: 'This is a hint that does not end with question mark and is long enough' },
          { level: 2, text: 'Hint two question?' },
          { level: 3, text: 'Hint three question?' }
        ]
      };
      validator.validate(data);
      expect(validator.getWarning('hints[0].text').code).toBe('advisory');
    });
  });

  describe('validateTargetConstructs', () => {
    it('should warn if no constructs specified', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), targetConstructs: [] };
      validator.validate(data);
      expect(validator.getWarning('targetConstructs')).toBeDefined();
    });

    it('should warn if too many constructs', () => {
      const validator = new ScenarioValidator();
      const data = {
        ...getValidScenario(),
        targetConstructs: Array(11).fill('Construct')
      };
      validator.validate(data);
      expect(validator.getWarning('targetConstructs').code).toBe('advisory');
    });
  });

  describe('validateBriefDescription', () => {
    it('should allow briefDescription to be omitted', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario() };
      delete data.briefDescription;
      validator.validate(data);
      expect(validator.isValid).toBe(true);
    });

    it('should reject briefDescription over 180 chars', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), briefDescription: 'A'.repeat(181) };
      validator.validate(data);
      expect(validator.getError('briefDescription').code).toBe('max_length');
    });
  });

  describe('toJSON', () => {
    it('should return validation summary', () => {
      const validator = new ScenarioValidator();
      validator.validate(getValidScenario());
      const result = validator.toJSON();

      expect(result.valid).toBe(true);
      expect(result.errorCount).toBe(0);
      expect(result.warnings.length).toBeGreaterThanOrEqual(0);
      expect(result.errors).toEqual([]);
    });

    it('should return errors and warnings in toJSON', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), id: undefined, title: undefined };
      validator.validate(data);
      const result = validator.toJSON();

      expect(result.valid).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('helper functions', () => {
    it('should get single error by field', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), id: undefined };
      validator.validate(data);

      expect(validator.getError('id')).toBeDefined();
      expect(validator.getError('nonexistent')).toBeUndefined();
    });

    it('should get all errors for a field', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), hints: [{ level: 1, text: 'x' }] };
      validator.validate(data);

      const hintErrors = validator.getErrors('hints');
      expect(hintErrors.length).toBeGreaterThan(0);
    });

    it('should format validation errors as string', () => {
      const validator = new ScenarioValidator();
      const data = { ...getValidScenario(), id: undefined, title: undefined };
      validator.validate(data);

      const formatted = formatValidationErrors(validator);
      expect(formatted).toContain('Errors:');
      expect(formatted).toContain('id');
      expect(formatted).toContain('title');
    });

    it('should handle empty validation in formatValidationErrors', () => {
      const validator = new ScenarioValidator();
      validator.validate(getValidScenario());

      const formatted = formatValidationErrors(validator);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('validate with non-object', () => {
    it('should reject null input', () => {
      const validator = new ScenarioValidator();
      validator.validate(null);
      expect(validator.isValid).toBe(false);
      expect(validator.errors[0].code).toBe('type_error');
    });

    it('should reject non-object input', () => {
      const validator = new ScenarioValidator();
      validator.validate('string');
      expect(validator.isValid).toBe(false);
      expect(validator.errors[0].code).toBe('type_error');
    });
  });

  describe('validateScenario convenience function', () => {
    it('should return validator instance', () => {
      const result = validateScenario(getValidScenario());
      expect(result).toBeInstanceOf(ScenarioValidator);
      expect(result.isValid).toBe(true);
    });
  });

  describe('VALID_DOMAINS constant', () => {
    it('should include common domains', () => {
      expect(VALID_DOMAINS.has('Philosophy')).toBe(true);
      expect(VALID_DOMAINS.has('Science')).toBe(true);
      expect(VALID_DOMAINS.has('Literature')).toBe(true);
      expect(VALID_DOMAINS.has('Folklore')).toBe(true);
      expect(VALID_DOMAINS.has('Music')).toBe(true);
    });
  });

  describe('VALID_JONASAN_TYPES constant', () => {
    it('should include all three types', () => {
      expect(VALID_JONASAN_TYPES.has('Structured Inquiry')).toBe(true);
      expect(VALID_JONASAN_TYPES.has('Design Thinking Problem')).toBe(true);
      expect(VALID_JONASAN_TYPES.has('Dilemma')).toBe(true);
    });
  });
});