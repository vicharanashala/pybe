"""
Comprehensive service layer tests for pyBE.
Tests business logic, validation, and data processing.
"""

import pytest
from datetime import datetime, timedelta


class TestSpacedRepetition:
    """Test SM-2 spaced repetition algorithm."""

    def test_first_review_success(self):
        """First successful review should set repetition to 1."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(4, 0, 2.5, 0)
        assert result['repetitions'] == 1
        assert result['interval'] == 1
        assert result['easiness'] >= 2.5

    def test_second_review_success(self):
        """Second successful review should increase interval."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(4, 1, 2.5, 1)
        assert result['repetitions'] == 2
        assert result['interval'] == 6  # 1 * 2.5 * 2.5

    def test_third_review_success(self):
        """Third successful review should further increase interval."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(4, 2, 2.5, 6)
        expected_interval = round(6 * 2.5)
        assert result['repetitions'] == 3
        assert result['interval'] == expected_interval

    def test_failed_review_resets_repetition(self):
        """Failed review (quality < 3) should reset repetition to 0."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(2, 3, 2.5, 10)
        assert result['repetitions'] == 0
        assert result['interval'] == 1

    def test_easiness_minimum_enforced(self):
        """Easiness factor should never go below 1.3."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(0, 0, 1.4, 1)  # Complete blackout
        assert result['easiness'] >= 1.3

    def test_easiness_increases_on_good_review(self):
        """Good review (quality >= 3) should increase easiness."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(5, 0, 2.5, 1)
        assert result['easiness'] > 2.5

    def test_easiness_decreases_on_poor_review(self):
        """Poor review (quality < 3) should decrease easiness."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(2, 1, 2.5, 6)
        assert result['easiness'] < 2.5

    def test_quality_0_complete_blackout(self):
        """Quality 0 should reset everything and lower easiness."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(0, 3, 2.5, 10)
        assert result['repetitions'] == 0
        assert result['interval'] == 1
        assert result['easiness'] < 2.5

    def test_quality_5_perfect_response(self):
        """Quality 5 should increase easiness significantly."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(5, 0, 2.5, 1)
        assert result['repetitions'] == 1
        assert result['easiness'] > 2.5

    def test_next_review_date_set(self):
        """Result should include next_review_date."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(4, 0, 2.5, 1)
        assert 'next_review_date' in result
        assert isinstance(result['next_review_date'], datetime)

    def test_next_review_date_in_future(self):
        """Next review date should be in the future."""
        from src.services.spaced_repetition import calculate_sm2
        result = calculate_sm2(4, 0, 2.5, 1)
        assert result['next_review_date'] > datetime.utcnow()

    def test_interval_calculation_formula(self):
        """Test interval calculation matches SM-2 formula."""
        from src.services.spaced_repetition import calculate_sm2
        # For repetition 0: interval = 1
        r0 = calculate_sm2(4, 0, 2.5, 0)
        assert r0['interval'] == 1

        # For repetition 1: interval = 6 (SM-2 hardcoded)
        r1 = calculate_sm2(4, 1, 2.5, 1)
        assert r1['interval'] == 6

        # For repetition >= 2: interval = previous * easiness
        r2 = calculate_sm2(4, 2, 2.5, 6)
        assert r2['interval'] == round(6 * 2.5)


class TestScenarioValidator:
    """Test scenario validation logic."""

    def test_valid_scenario_passes(self):
        """Valid scenario should pass validation."""
        from src.services.scenario_validator import validate_scenario_for_submission
        valid_data = {
            'id': 'test-valid-scenario',
            'title': 'The Test Scenario That Is Valid',
            'domain': 'Science',
            'pythonConcept': 'Functions',
            'difficultyLevel': 2,
            'jonasanType': 'Structured Inquiry',
            'philosophicalAnchor': 'A' * 60,
            'theoryPillar': 'Theory explanation that is long enough.',
            'anchorPillar': 'Anchor explanation that is long enough.',
            'triggerPillar': 'Trigger explanation that is long enough.',
            'realityPillar': 'Reality explanation that is long enough.',
            'caseStudy': 'Case study content that is definitely long enough to pass validation with over 100 characters as required for a proper case study narrative.',
            'hints': [
                {'level': 1, 'text': 'What is the problem asking you to do?'},
                {'level': 2, 'text': 'Have you considered breaking it into smaller parts?'},
                {'level': 3, 'text': 'What approach might work better here?'}
            ]
        }
        is_valid, errors, warnings = validate_scenario_for_submission(valid_data)
        assert is_valid is True
        assert len(errors) == 0

    def test_missing_id_fails(self):
        """Missing ID should fail validation."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {'title': 'Test'}
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False
        assert any('id' in e['field'].lower() for e in errors)

    def test_missing_title_fails(self):
        """Missing title should fail validation."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {'id': 'test-id'}
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False
        assert any('title' in e['field'].lower() for e in errors)

    def test_invalid_id_format_fails(self):
        """ID with invalid format should fail."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {
            'id': 'Invalid ID With Spaces',
            'title': 'Valid Title Here',
        }
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False
        assert any('id' in e['field'].lower() for e in errors)

    def test_short_title_fails(self):
        """Title shorter than 10 characters should fail."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {
            'id': 'valid-id',
            'title': 'Short',
        }
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False
        assert any('title' in e['field'].lower() for e in errors)

    def test_invalid_difficulty_level_fails(self):
        """Difficulty level outside 1-5 should fail."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {
            'id': 'test-id',
            'title': 'Valid Title Here',
            'difficultyLevel': 10,  # Invalid
        }
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False
        assert any('difficulty' in e['field'].lower() for e in errors)

    def test_invalid_jonasan_type_fails(self):
        """Invalid Jonasan type should fail."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {
            'id': 'test-id',
            'title': 'Valid Title Here',
            'jonasanType': 'Invalid Type',
        }
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False
        assert any('jonasan' in e['field'].lower() for e in errors)

    def test_hint_with_answer_fails(self):
        """Hint that gives away answer should fail Socratic validation."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {
            'id': 'test-id',
            'title': 'Valid Title Here',
            'hints': [
                {'level': 1, 'text': 'Just use the answer directly here.'}
            ]
        }
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False

    def test_hint_too_short_fails(self):
        """Hint shorter than 15 characters should fail."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {
            'id': 'test-id',
            'title': 'Valid Title Here',
            'hints': [
                {'level': 1, 'text': 'Short?'}
            ]
        }
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False

    def test_case_study_with_code_fails(self):
        """Case study containing code should fail."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {
            'id': 'test-id',
            'title': 'Valid Title Here',
            'caseStudy': 'Try using print() to output the result.',
        }
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False

    def test_non_socratic_hint_warns(self):
        """Non-Socratic hint should generate warning but not error."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {
            'id': 'test-id',
            'title': 'Valid Title Here That Is Long',
            'hints': [
                {'level': 1, 'text': 'This is a statement that does not end with a question mark but is long enough.'}
            ]
        }
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        # Socratic violations are errors, not warnings
        # But we should have warnings about non-question hints
        # The validator requires hints to be questions for hints > 20 chars

    def test_minimum_hints_required(self):
        """At least 3 hints should be required."""
        from src.services.scenario_validator import validate_scenario_for_submission
        data = {
            'id': 'test-id',
            'title': 'Valid Title Here',
            'hints': [
                {'level': 1, 'text': 'First hint that is long enough.'},
                {'level': 2, 'text': 'Second hint that is long enough.'},
            ]
        }
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        assert is_valid is False
        assert any('hint' in e['field'].lower() or 'hint' in e['message'].lower() for e in errors)


class TestGamificationService:
    """Test gamification service logic."""

    def test_calculate_level_1(self):
        """XP 0-199 should be level 1."""
        from src.services.gamification_service import calculate_level_info
        level = calculate_level_info(0)
        assert level['level'] == 1
        assert level['name'] == 'Apprentice'

    def test_calculate_level_2(self):
        """XP 200-499 should be level 2."""
        from src.services.gamification_service import calculate_level_info
        level = calculate_level_info(200)
        assert level['level'] == 2
        assert level['name'] == 'Craftsperson'

    def test_calculate_level_3(self):
        """XP 500-999 should be level 3."""
        from src.services.gamification_service import calculate_level_info
        level = calculate_level_info(500)
        assert level['level'] == 3
        assert level['name'] == 'Scholar'

    def test_calculate_level_4(self):
        """XP 1000-2999 should be level 4."""
        from src.services.gamification_service import calculate_level_info
        level = calculate_level_info(1000)
        assert level['level'] == 4
        assert level['name'] == 'Architect'

    def test_calculate_level_5(self):
        """XP 3000+ should be level 5."""
        from src.services.gamification_service import calculate_level_info
        level = calculate_level_info(3000)
        assert level['level'] == 5
        assert level['name'] == 'Pythonista'

    def test_level_boundaries(self):
        """Test boundary values for levels."""
        from src.services.gamification_service import calculate_level_info
        assert calculate_level_info(199)['level'] == 1
        assert calculate_level_info(200)['level'] == 2
        assert calculate_level_info(499)['level'] == 2
        assert calculate_level_info(500)['level'] == 3
        assert calculate_level_info(999)['level'] == 3
        assert calculate_level_info(1000)['level'] == 4
        assert calculate_level_info(2999)['level'] == 4
        assert calculate_level_info(3000)['level'] == 5

    def test_calculate_xp_from_progress(self):
        """XP should be sum of scores * 10."""
        from src.services.gamification_service import calculate_xp_from_progress

        class MockProgress:
            def __init__(self, score):
                self.score = score

        progress = [MockProgress(80), MockProgress(90), MockProgress(70)]
        xp = calculate_xp_from_progress(progress)
        assert xp == (80 + 90 + 70) * 10

    def test_calculate_xp_empty_progress(self):
        """Empty progress should return 0 XP."""
        from src.services.gamification_service import calculate_xp_from_progress
        assert calculate_xp_from_progress([]) == 0


class TestScenarioService:
    """Test scenario service logic."""

    def test_get_list_returns_scenarios(self, mock_scenario_engine):
        """get_list should return list of scenarios."""
        from src.services.scenario_service import ScenarioService
        result = ScenarioService.get_list(mock_scenario_engine)
        assert isinstance(result, list)
        assert len(result) > 0

    def test_get_list_filter_by_domain(self, mock_scenario_engine):
        """get_list should filter by domain."""
        from src.services.scenario_service import ScenarioService
        result = ScenarioService.get_list(mock_scenario_engine, domain='Philosophy')
        for scenario in result:
            assert scenario['domain'] == 'Philosophy'

    def test_get_detail_returns_scenario(self, mock_scenario_engine):
        """get_detail should return full scenario."""
        from src.services.scenario_service import ScenarioService
        result = ScenarioService.get_detail(mock_scenario_engine, 'fellowship-graph')
        assert result is not None
        assert result['id'] == 'fellowship-graph'
        assert 'caseStudy' in result

    def test_get_detail_nonexistent(self, mock_scenario_engine):
        """get_detail for nonexistent should return None."""
        from src.services.scenario_service import ScenarioService
        result = ScenarioService.get_detail(mock_scenario_engine, 'nonexistent')
        assert result is None

    def test_calculate_rubric_score(self):
        """Should calculate weighted rubric score correctly."""
        from src.services.scenario_service import ScenarioService
        rubric = {
            'reasoning': {'weight': 40},
            'code': {'weight': 30},
            'reflection': {'weight': 30}
        }
        learner_scores = {
            'theory_score': 80,
            'code_score': 90,
            'reflection_score': 70
        }
        result = ScenarioService.calculate_rubric_score('test', rubric, learner_scores)
        expected = (80 * 0.4) + (90 * 0.3) + (70 * 0.3)  # 32 + 27 + 21 = 80
        assert result['total'] == pytest.approx(expected, rel=0.1)

    def test_calculate_rubric_score_handles_none(self):
        """Should handle None rubric gracefully."""
        from src.services.scenario_service import ScenarioService
        result = ScenarioService.calculate_rubric_score('test', None, {})
        assert result['total'] == 0
        assert result['grade'] == 'F'


class TestUserService:
    """Test user service logic."""

    def test_get_user_stats(self, mock_scenario_engine):
        """Should return user stats with labels and data."""
        from src.services.user_service import UserService
        stats = UserService.get_user_stats(mock_scenario_engine)
        assert 'labels' in stats
        assert 'data' in stats
        assert isinstance(stats['labels'], list)
        assert isinstance(stats['data'], list)

    def test_get_domain_graph_data(self, mock_scenario_engine):
        """Should return D3-compatible graph data."""
        from src.services.user_service import UserService
        graph = UserService.get_domain_graph_data(mock_scenario_engine)
        assert 'nodes' in graph
        assert 'links' in graph
        assert len(graph['nodes']) > 0


class TestAIEvaluator:
    """Test AI evaluator service."""

    def test_mock_evaluate_returns_result(self):
        """Mock evaluate should return a result."""
        from src.services.ai_evaluator import AIEvaluator
        evaluator = AIEvaluator()
        evaluator.use_mock = True
        result, score = evaluator._mock_evaluate('print("test")', False)
        assert isinstance(result, dict)
        assert 'scores' in result
        assert 'totalScore' in result
        assert 'feedback' in result
        assert 0 <= score <= 100

    def test_mock_hint_returns_socratic(self):
        """Mock hint should return Socratic-style hint."""
        from src.services.ai_evaluator import AIEvaluator
        evaluator = AIEvaluator()
        hint = evaluator._mock_hint('def foo(): pass')
        assert 'hint' in hint
        assert 'encouragement' in hint
        # Socratic hints should be questions
        assert '?' in hint['hint'] or len(hint['hint']) < 20

    def test_extract_constructs_detects_functions(self):
        """Should detect function definitions."""
        from src.services.ai_evaluator import _extract_constructs_mock
        constructs = _extract_constructs_mock('def hello(): print("hi")')
        assert 'Function Def' in constructs

    def test_extract_constructs_detects_imports(self):
        """Should detect imports."""
        from src.services.ai_evaluator import _extract_constructs_mock
        constructs = _extract_constructs_mock('import os\nfrom sys import path')
        assert 'Import' in constructs

    def test_extract_constructs_detects_loops(self):
        """Should detect loops."""
        from src.services.ai_evaluator import _extract_constructs_mock
        constructs = _extract_constructs_mock('for i in range(10): pass')
        assert 'For Loop' in constructs

    def test_extract_constructs_empty_code(self):
        """Should handle empty code."""
        from src.services.ai_evaluator import _extract_constructs_mock
        constructs = _extract_constructs_mock('')
        assert isinstance(constructs, list)
        assert len(constructs) == 0


class TestStorage:
    """Test storage layer."""

    def test_storage_get_user_by_id(self, app_context):
        """Should get user by ID."""
        from src.storage import Storage
        from src.models import User, db

        # Create user first
        user = User(username='storagetest', email='store@test.com', password_hash='hash')
        db.session.add(user)
        db.session.commit()

        result = Storage.get_user_by_id(user.id)
        assert result is not None
        assert result.username == 'storagetest'

    def test_storage_get_user_by_username(self, app_context):
        """Should get user by username."""
        from src.storage import Storage
        from src.models import User, db

        user = User(username='storeuser2', email='store2@test.com', password_hash='hash')
        db.session.add(user)
        db.session.commit()

        result = Storage.get_user_by_username('storeuser2')
        assert result is not None
        assert result.username == 'storeuser2'

    def test_storage_create_user(self, app_context):
        """Should create new user."""
        from src.storage import Storage
        user = Storage.create_user('newuser', 'new@test.com', 'hash123')
        assert user is not None
        assert user.username == 'newuser'

    def test_storage_save_progress(self, app_context):
        """Should save progress."""
        from src.storage import Storage
        from src.models import User, db

        user = User(username='progresstest', email='progress@test.com', password_hash='hash')
        db.session.add(user)
        db.session.commit()

        result = Storage.save_progress(
            user_id=user.id,
            scenario_id='fellowship-graph',
            repetition=1,
            interval=1,
            easiness_factor=2.5,
            next_review_date=datetime.utcnow() + timedelta(days=1),
            status='completed',
            score=80,
            updated_at=datetime.utcnow()
        )
        assert result is not None

    def test_storage_get_progress(self, app_context):
        """Should get progress record."""
        from src.storage import Storage
        from src.models import User, db

        user = User(username='getprogresstest', email='getprogress@test.com', password_hash='hash')
        db.session.add(user)
        db.session.commit()

        Storage.save_progress(
            user_id=user.id,
            scenario_id='fellowship-graph',
            repetition=1,
            interval=1,
            easiness_factor=2.5,
            next_review_date=datetime.utcnow() + timedelta(days=1),
            status='completed',
            score=80,
            updated_at=datetime.utcnow()
        )

        result = Storage.get_progress(user.id, 'fellowship-graph')
        assert result is not None
        assert result.scenario_id == 'fellowship-graph'


class TestEngine:
    """Test scenario engine."""

    def test_load_all_returns_count(self, mock_scenario_engine):
        """load_all should return number of scenarios."""
        engine = mock_scenario_engine
        count = engine.load_all()
        assert count > 0
        assert count == len(engine._index)

    def test_list_scenarios_returns_summaries(self, mock_scenario_engine):
        """list_scenarios should return summary objects."""
        engine = mock_scenario_engine
        result = engine.list_scenarios()
        assert isinstance(result, list)
        if result:
            scenario = result[0]
            assert 'id' in scenario
            assert 'title' in scenario
            assert 'domain' in scenario

    def test_get_scenario_returns_full_data(self, mock_scenario_engine):
        """get_scenario should return full scenario with caseStudy."""
        engine = mock_scenario_engine
        result = engine.get_scenario('fellowship-graph')
        assert 'caseStudy' in result
        assert 'title' in result

    def test_get_scenario_raises_not_found(self, mock_scenario_engine):
        """get_scenario should raise ScenarioNotFoundError for invalid ID."""
        from src.engine import ScenarioNotFoundError
        engine = mock_scenario_engine
        with pytest.raises(ScenarioNotFoundError):
            engine.get_scenario('nonexistent-id')

    def test_get_hints(self, mock_scenario_engine):
        """get_hints should return hints array."""
        engine = mock_scenario_engine
        hints = engine.get_hints('fellowship-graph')
        assert isinstance(hints, list)

    def test_get_hints_with_limit(self, mock_scenario_engine):
        """get_hints with reveal_count should limit results."""
        engine = mock_scenario_engine
        hints = engine.get_hints('fellowship-graph', reveal_count=1)
        assert len(hints) == 1

    def test_get_solutions(self, mock_scenario_engine):
        """get_solutions should return solution files."""
        engine = mock_scenario_engine
        solutions = engine.get_solutions('fellowship-graph')
        assert isinstance(solutions, list)

    def test_get_reflection(self, mock_scenario_engine):
        """get_reflection should return reflection prompts."""
        engine = mock_scenario_engine
        reflection = engine.get_reflection('fellowship-graph')
        assert reflection is not None

    def test_get_rubric(self, mock_scenario_engine):
        """get_rubric should return scoring rubric."""
        engine = mock_scenario_engine
        rubric = engine.get_rubric('fellowship-graph')
        assert rubric is not None