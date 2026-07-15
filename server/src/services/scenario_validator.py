"""
pyBE Scenario Schema Validator
===============================

Comprehensive validation for scenario submissions enforcing the 4-pillar manifesto.
Validates all fields according to the pyBE format specification.
"""

from typing import Any, Optional
import re


VALID_DOMAINS = {
    'Biology', 'Music', 'Folklore', 'Folklore/Panchatantra',
    'Literature', 'Philosophy', 'Philosophy/Buddhism',
    'Pop Culture', 'Pop Culture/Harry Potter', 'Pop Culture/LOTR',
    'Pop Culture/Avengers', 'Physics', 'Psychology', 'Linguistics',
    'Culinary', 'Sports', 'Science', 'General', 'Other'
}

VALID_JONASAN_TYPES = {
    'Structured Inquiry',
    'Design Thinking Problem',
    'Dilemma'
}

FORBIDDEN_HINT_PATTERNS = [
    (r'\buse\s+\w+\(\)', 'Hint gives away the answer directly'),
    (r'\bcall\s+\w+\(\)', 'Hint tells learner to call a specific function'),
    (r'\btry\s+\w+\.\w+', 'Hint suggests trying a specific method'),
    (r'\bthe answer is\b', 'Hint reveals the answer'),
    (r'\bsimply\s+', 'Hint oversimplifies - remove "simply"'),
    (r'\bjust\s+', 'Hint oversimplifies - remove "just"'),
    (r'\bdirectly\s+', 'Hint oversimplifies - remove "directly"'),
    (r'\bapply\s+\w+\(\)', 'Hint gives away the solution'),
    (r'\buse\s+\w+\s+to\b', 'Hint provides direct solution path'),
    (r'\bthe\s+way\s+to\b', 'Hint reveals solution methodology'),
]


class ValidationError:
    def __init__(self, field: str, message: str, code: str = 'invalid'):
        self.field = field
        self.message = message
        self.code = code

    def to_dict(self) -> dict:
        return {
            'field': self.field,
            'message': self.message,
            'code': self.code
        }


class ValidationResult:
    def __init__(self):
        self.errors: list[ValidationError] = []
        self.warnings: list[ValidationError] = []

    @property
    def is_valid(self) -> bool:
        return len(self.errors) == 0

    def add_error(self, field: str, message: str, code: str = 'invalid'):
        self.errors.append(ValidationError(field, message, code))

    def add_warning(self, field: str, message: str, code: str = 'warning'):
        self.warnings.append(ValidationError(field, message, code))

    def to_dict(self) -> dict:
        return {
            'valid': self.is_valid,
            'errorCount': len(self.errors),
            'warningCount': len(self.warnings),
            'errors': [e.to_dict() for e in self.errors],
            'warnings': [w.to_dict() for w in self.warnings]
        }


def validate_scenario_schema(data: dict[str, Any]) -> ValidationResult:
    """
    Comprehensive validation of scenario data against pyBE schema.
    Returns ValidationResult with errors and warnings.
    """
    result = ValidationResult()

    if not isinstance(data, dict):
        result.add_error('root', 'Scenario data must be an object', 'type_error')
        return result

    _validate_id_and_title(data, result)
    _validate_foundation(data, result)
    _validate_philosophical_anchor(data, result)
    _validate_four_pillars(data, result)
    _validate_case_study(data, result)
    _validate_hints(data, result)
    _validate_target_constructs(data, result)
    _validate_brief_description(data, result)

    return result


def _validate_id_and_title(data: dict, result: ValidationResult):
    title = data.get('title')
    if not title:
        result.add_error('title', 'Title is required', 'required')
    elif not isinstance(title, str):
        result.add_error('title', 'Title must be a string', 'type_error')
    elif len(title) < 10:
        result.add_error('title', 'Title must be at least 10 characters', 'min_length')
    elif len(title) > 100:
        result.add_error('title', 'Title must be at most 100 characters', 'max_length')

    scenario_id = data.get('id')
    if not scenario_id:
        result.add_error('id', 'Scenario ID is required', 'required')
    elif not isinstance(scenario_id, str):
        result.add_error('id', 'ID must be a string', 'type_error')
    elif not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', scenario_id):
        result.add_error('id', 'ID must be lowercase alphanumeric with hyphens only', 'format_error')
    elif scenario_id.startswith('-') or scenario_id.endswith('-'):
        result.add_error('id', 'ID cannot start or end with a hyphen', 'format_error')


def _validate_foundation(data: dict, result: ValidationResult):
    domain = data.get('domain')
    if not domain:
        result.add_error('domain', 'Domain is required', 'required')
    elif domain not in VALID_DOMAINS:
        result.add_warning('domain', f'Domain "{domain}" is not in the standard list. Valid domains: {", ".join(sorted(VALID_DOMAINS))}', 'non_standard')

    python_concept = data.get('pythonConcept')
    if not python_concept:
        result.add_error('pythonConcept', 'Python Concept is required', 'required')
    elif not isinstance(python_concept, str):
        result.add_error('pythonConcept', 'Python Concept must be a string', 'type_error')
    elif len(python_concept) < 3:
        result.add_error('pythonConcept', 'Python Concept must be at least 3 characters', 'min_length')

    difficulty = data.get('difficultyLevel')
    if difficulty is None:
        result.add_error('difficultyLevel', 'Difficulty Level is required', 'required')
    elif not isinstance(difficulty, int) or difficulty < 1 or difficulty > 5:
        result.add_error('difficultyLevel', 'Difficulty Level must be an integer between 1 and 5', 'range_error')

    jonasan_type = data.get('jonasanType')
    if not jonasan_type:
        result.add_error('jonasanType', 'Jonasan Type is required', 'required')
    elif jonasan_type not in VALID_JONASAN_TYPES:
        result.add_error('jonasanType', f'Jonasan Type must be one of: {", ".join(sorted(VALID_JONASAN_TYPES))}', 'invalid_enum')


def _validate_philosophical_anchor(data: dict, result: ValidationResult):
    anchor = data.get('philosophicalAnchor')
    if not anchor:
        result.add_error('philosophicalAnchor', 'Philosophical Anchor is required', 'required')
    elif not isinstance(anchor, str):
        result.add_error('philosophicalAnchor', 'Philosophical Anchor must be a string', 'type_error')
    elif len(anchor) < 50:
        result.add_error('philosophicalAnchor', 'Philosophical Anchor must be at least 50 characters. Explain the WHY deeply.', 'min_length')
    elif len(anchor) < 100:
        result.add_warning('philosophicalAnchor', 'Philosophical Anchor should be at least 100 characters for adequate depth', 'advisory')


def _validate_four_pillars(data: dict, result: ValidationResult):
    pillars = {
        'theoryPillar': 'Theory Pillar',
        'anchorPillar': 'Anchor Pillar (Interdisciplinary Mapping)',
        'triggerPillar': 'Trigger Pillar (Case Study Connection)',
        'realityPillar': 'Reality Pillar (Engineering Depth)'
    }

    for field, label in pillars.items():
        content = data.get(field)
        if not content:
            result.add_error(field, f'{label} is required', 'required')
        elif not isinstance(content, str):
            result.add_error(field, f'{label} must be a string', 'type_error')
        elif len(content) < 30:
            result.add_error(field, f'{label} must be at least 30 characters', 'min_length')

    reality = data.get('realityPillar', '')
    if reality and len(reality) < 50:
        result.add_warning('realityPillar', 'Reality Pillar should be at least 50 characters to describe real engineering depth', 'advisory')


def _validate_case_study(data: dict, result: ValidationResult):
    case_study = data.get('caseStudy') or data.get('triggerPillar')
    if not case_study:
        result.add_error('caseStudy', 'Case Study / Trigger is required', 'required')
    elif not isinstance(case_study, str):
        result.add_error('caseStudy', 'Case Study must be a string', 'type_error')
    elif len(case_study) < 100:
        result.add_error('caseStudy', 'Case Study must be at least 100 characters. Write a full scenario.', 'min_length')
    elif len(case_study) < 200:
        result.add_warning('caseStudy', 'Case Study should be at least 200 characters for a complete narrative', 'advisory')

    if isinstance(case_study, str):
        code_patterns = [
            r'\bprint\s*\(',
            r'\bdef\s+\w+\s*\(',
            r'\bimport\s+\w+',
            r'\b\w+\s*=\s*\w+\s*\(',
            r'```python',
            r'`\w+\(\)`'
        ]
        for pattern in code_patterns:
            if re.search(pattern, case_study):
                result.add_error('caseStudy', 'Case Study must not contain Python syntax or code hints. Write only the narrative problem.', 'syntax_detected')
                break


def _validate_hints(data: dict, result: ValidationResult):
    hints = data.get('hints', [])

    if not hints:
        result.add_error('hints', 'At least one hint is required', 'required')
        return

    if not isinstance(hints, list):
        result.add_error('hints', 'Hints must be an array', 'type_error')
        return

    if len(hints) < 3:
        result.add_error('hints', 'At least 3 hints are required', 'min_length')

    if len(hints) > 5:
        result.add_warning('hints', 'More than 5 hints may reduce learning effectiveness', 'advisory')

    for i, hint in enumerate(hints):
        hint_num = i + 1

        if not isinstance(hint, dict):
            result.add_error(f'hints[{i}]', 'Each hint must be an object', 'type_error')
            continue

        hint_text = hint.get('text', '')
        if not hint_text:
            if hint_num <= 2:
                result.add_error(f'hints[{i}]', f'Hint {hint_num} is required', 'required')
            else:
                result.add_warning(f'hints[{i}]', f'Hint {hint_num} is empty', 'advisory')
            continue

        if not isinstance(hint_text, str):
            result.add_error(f'hints[{i}].text', f'Hint {hint_num} text must be a string', 'type_error')
            continue

        if len(hint_text) < 15:
            result.add_error(f'hints[{i}].text', f'Hint {hint_num} must be at least 15 characters', 'min_length')
            continue

        for pattern, message in FORBIDDEN_HINT_PATTERNS:
            if re.search(pattern, hint_text):
                result.add_error(f'hints[{i}].text', f'Hint {hint_num}: {message}', 'socratic_violation')
                break

        hint_lower = hint_text.lower().strip()
        if not hint_lower.endswith('?') and len(hint_text) > 20:
            result.add_warning(f'hints[{i}].text', f'Hint {hint_num} should be a Socratic question (end with ?)', 'advisory')


def _validate_target_constructs(data: dict, result: ValidationResult):
    constructs = data.get('targetConstructs', [])

    if not constructs:
        result.add_warning('targetConstructs', 'Target Python Constructs should be specified', 'advisory')
        return

    if not isinstance(constructs, list):
        result.add_error('targetConstructs', 'Target Constructs must be an array', 'type_error')
        return

    if len(constructs) > 10:
        result.add_warning('targetConstructs', 'More than 10 constructs may be too many for one scenario', 'advisory')

    for i, construct in enumerate(constructs):
        if not isinstance(construct, str):
            result.add_error(f'targetConstructs[{i}]', 'Each construct must be a string', 'type_error')
        elif len(construct) < 2:
            result.add_error(f'targetConstructs[{i}]', f'Construct "{construct}" is too short', 'min_length')


def _validate_brief_description(data: dict, result: ValidationResult):
    brief = data.get('briefDescription')
    if brief and not isinstance(brief, str):
        result.add_error('briefDescription', 'Brief Description must be a string', 'type_error')
    elif brief and len(brief) > 180:
        result.add_error('briefDescription', 'Brief Description must be at most 180 characters', 'max_length')


def validate_scenario_for_submission(data: dict[str, Any]) -> tuple[bool, list[dict], list[dict]]:
    """
    High-level validation function for scenario submission.
    Returns (is_valid, errors, warnings)
    """
    result = validate_scenario_schema(data)
    return (
        result.is_valid,
        [e.to_dict() for e in result.errors],
        [w.to_dict() for w in result.warnings]
    )


def get_schema_summary() -> dict:
    """
    Returns a summary of the expected schema structure.
    Useful for documentation and API responses.
    """
    return {
        'required': {
            'id': 'string (lowercase alphanumeric with hyphens)',
            'title': 'string (10-100 characters)',
            'domain': f'string ({"|".join(sorted(VALID_DOMAINS))})',
            'pythonConcept': 'string (at least 3 characters)',
            'difficultyLevel': 'integer (1-5)',
            'jonasanType': f'string ({"|".join(sorted(VALID_JONASAN_TYPES))})',
            'philosophicalAnchor': 'string (at least 50 characters)',
            'theoryPillar': 'string (at least 30 characters)',
            'anchorPillar': 'string (at least 30 characters)',
            'triggerPillar': 'string (at least 30 characters)',
            'realityPillar': 'string (at least 30 characters)',
            'caseStudy': 'string (at least 100 characters)',
            'hints': 'array of hint objects (minimum 3, maximum 5)'
        },
        'optional': {
            'briefDescription': 'string (max 180 characters)',
            'targetConstructs': 'array of strings',
            'scoringRubric': 'object with reasoning/code/reflection weights',
            'reflectionPrompts': 'array of strings'
        },
        'hint_requirements': {
            'min_length': 15,
            'must_be_socratic': True,
            'forbidden_patterns': [p[1] for p in FORBIDDEN_HINT_PATTERNS]
        },
        'four_pillar_requirements': {
            'philosophicalAnchor_min': 50,
            'case_study_min': 100,
            'pillar_min': 30,
            'reality_min': 50
        }
    }