from datetime import datetime
from typing import Optional

from src.models import User, Progress


def _is_mongo():
    try:
        from src.database import is_mongodb
        return is_mongodb()
    except Exception:
        return False

BADGES = {
    'first_blood': {
        'name': 'First Blood',
        'trigger': 'Complete your first scenario',
        'icon': '✅',
        'domain': None
    },
    'folklore_explorer': {
        'name': 'Panchatantra Path',
        'trigger': 'Complete a Folklore scenario',
        'icon': '🐘',
        'domain': 'Folklore'
    },
    'biologist': {
        'name': 'Protein Thinker',
        'trigger': 'Complete a Science/Biology scenario',
        'icon': '🧬',
        'domain': 'Science'
    },
    'musician': {
        'name': 'Taal Master',
        'trigger': 'Complete a Music scenario',
        'icon': '🎵',
        'domain': 'Music'
    },
    'philosopher': {
        'name': 'Anicca Seeker',
        'trigger': 'Complete a Philosophy scenario',
        'icon': '☸️',
        'domain': 'Philosophy'
    },
    'literature_scholar': {
        'name': 'Fellowship Member',
        'trigger': 'Complete a Literature scenario',
        'icon': '📚',
        'domain': 'Literature'
    },
    'hardware_toucher': {
        'name': 'Hardware Toucher',
        'trigger': 'Complete a Level 5 scenario',
        'icon': '⚡',
        'domain': None,
        'level': 5
    },
    'socratic_thinker': {
        'name': 'Socratic Thinker',
        'trigger': 'Complete 5 scenarios without using hints',
        'icon': '🧙',
        'domain': None
    },
    'deep_thinker': {
        'name': 'Deep Thinker',
        'trigger': 'Complete a Dilemma-type scenario',
        'icon': '🤔',
        'domain': None
    },
    'speed_learner': {
        'name': 'Speed Learner',
        'trigger': 'Complete 3 scenarios in one day',
        'icon': '🚀',
        'domain': None
    },
    'domain_crosser': {
        'name': 'Domain Crosser',
        'trigger': 'Complete scenarios from 4 different domains',
        'icon': '🌉',
        'domain': None
    },
    'recursion_master': {
        'name': 'Recursion Master',
        'trigger': 'Complete a recursion scenario',
        'icon': '🔄',
        'domain': None,
        'concept': 'Recursion'
    },
    'graph_navigator': {
        'name': 'Graph Navigator',
        'trigger': 'Complete a graph theory scenario',
        'icon': '🗺️',
        'domain': None,
        'concept': 'Graph'
    },
    'memory_sage': {
        'name': 'Memory Sage',
        'trigger': 'Complete a memory management scenario',
        'icon': '🧘',
        'domain': None,
        'concept': 'Memory'
    },
    'ten_scenarios': {
        'name': 'Scholar',
        'trigger': 'Complete 10 scenarios',
        'icon': '📚',
        'domain': None
    },
    'all_scenarios': {
        'name': 'Philosopher King',
        'trigger': 'Complete all 26 scenarios',
        'icon': '👑',
        'domain': None
    },
    'xp_master': {
        'name': 'XP Master',
        'trigger': 'Earn 1000 XP',
        'icon': '⚡',
        'domain': None
    },
    'level_5_conqueror': {
        'name': 'Level 5 Conqueror',
        'trigger': 'Reach Level 5',
        'icon': '🏔️',
        'domain': None
    },
    'early_bird': {
        'name': 'Early Bird',
        'trigger': 'Login first thing in the morning',
        'icon': '🐦',
        'domain': None
    },
    'night_owl': {
        'name': 'Night Owl',
        'trigger': 'Complete a scenario after midnight',
        'icon': '🦉',
        'domain': None
    }
}

LEVELS = [
    {'level': 1, 'name': 'Apprentice', 'minXP': 0, 'maxXP': 199, 'color': '#78C257'},
    {'level': 2, 'name': 'Craftsperson', 'minXP': 200, 'maxXP': 499, 'color': '#4A90D9'},
    {'level': 3, 'name': 'Scholar', 'minXP': 500, 'maxXP': 999, 'color': '#9B59B6'},
    {'level': 4, 'name': 'Architect', 'minXP': 1000, 'maxXP': 2999, 'color': '#E67E22'},
    {'level': 5, 'name': 'Pythonista', 'minXP': 3000, 'maxXP': float('inf'), 'color': '#E74C3C'}
]


def calculate_level_info(xp: int) -> dict:
    """Get level info for given XP."""
    for lvl in reversed(LEVELS):
        if xp >= lvl['minXP']:
            return lvl
    return LEVELS[0]


def calculate_xp_from_progress(progress_records: list) -> int:
    """Calculate total XP from progress records."""
    return sum((p.score or 0) * 10 for p in progress_records)


def evaluate_badges(user_id: int, progress_records: list, engine) -> list:
    """
    Evaluate which badges a user has earned based on their progress.
    Returns list of badge IDs.
    """
    earned = []

    completed = [p for p in progress_records if p.status == 'completed']
    total_xp = calculate_xp_from_progress(completed)

    if len(completed) >= 1:
        earned.append('first_blood')
    if len(completed) >= 5:
        earned.append('ten_scenarios')
    if len(completed) >= 10:
        earned.append('ten_scenarios')
    if len(completed) >= 21:
        earned.append('all_scenarios')
    if total_xp >= 1000:
        earned.append('xp_master')

    domains_completed = set()
    concepts_used = set()
    levels_completed = set()
    jonasan_types = set()

    for p in completed:
        try:
            scenario = engine.get_scenario(p.scenario_id)
            domain = scenario.get('domain', '')
            concept = scenario.get('pythonConcept', scenario.get('concept', ''))
            level = scenario.get('difficultyLevel', scenario.get('level', 1))
            jonasan_type = scenario.get('jonasanType', '')

            if domain:
                domains_completed.add(domain)
            if concept:
                concepts_used.add(concept.lower())
            if level:
                levels_completed.add(level)
            if jonasan_type:
                jonasan_types.add(jonasan_type)

            if domain == 'Folklore':
                earned.append('folklore_explorer')
            elif domain == 'Music':
                earned.append('musician')
            elif domain == 'Philosophy':
                earned.append('philosopher')
            elif domain == 'Literature':
                earned.append('literature_scholar')
            elif domain == 'Science':
                earned.append('biologist')

            if level >= 5:
                earned.append('hardware_toucher')

            concept_lower = concept.lower()
            if 'recur' in concept_lower:
                earned.append('recursion_master')
            if 'graph' in concept_lower or 'dijkstra' in concept_lower:
                earned.append('graph_navigator')
            if 'memory' in concept_lower or 'garbage' in concept_lower:
                earned.append('memory_sage')

        except Exception:
            pass

    if len(domains_completed) >= 4:
        earned.append('domain_crosser')

    if 'Dilemma' in jonasan_types:
        earned.append('deep_thinker')

    level_info = calculate_level_info(total_xp)
    if level_info['level'] >= 5:
        earned.append('level_5_conqueror')

    if len(completed) >= 3:
        completed_dates = [p.updated_at.date() for p in completed if p.updated_at]
        if completed_dates:
            date_counts = {}
            for d in completed_dates:
                date_counts[d] = date_counts.get(d, 0) + 1
            if any(c >= 3 for c in date_counts.values()):
                earned.append('speed_learner')

    hour = datetime.utcnow().hour
    if hour < 6:
        earned.append('night_owl')
    elif hour < 9:
        earned.append('early_bird')

    return list(set(earned))


class GamificationService:

    XP_PER_SCORE = 10

    @staticmethod
    def calculate_xp(progress_records: list) -> int:
        return calculate_xp_from_progress(progress_records)

    @staticmethod
    def calculate_level(xp: int) -> int:
        return calculate_level_info(xp)['level']

    @staticmethod
    def get_profile(user_id: int, engine) -> dict:
        """
        Build gamification profile for a user.
        Returns XP, level, badges, and completion stats.
        """
        if _is_mongo():
            from src.storage import Storage
            progress_records_raw = Storage.get_all_progress_for_user(user_id)
            progress_records = []
            for p in progress_records_raw:
                class FakeProgress:
                    pass
                fp = FakeProgress()
                fp.score = p.get('score', 0)
                fp.status = p.get('status', 'started')
                fp.updated_at = p.get('updated_at')
                progress_records.append(fp)
            xp = GamificationService.calculate_xp(progress_records)
            level_info = calculate_level_info(xp)
            completed = [p for p in progress_records if p.status == "completed"]
            total_scenarios = len(engine.list_scenarios())

            earned_badge_ids = evaluate_badges(user_id, progress_records, engine)
            badges = []
            for badge_id in earned_badge_ids:
                if badge_id in BADGES:
                    badges.append({
                        'id': badge_id,
                        'name': BADGES[badge_id]['name'],
                        'icon': BADGES[badge_id]['icon'],
                        'description': BADGES[badge_id]['trigger']
                    })

            current_level_num = level_info['level']
            next_level = None
            if current_level_num < 5:
                next_level = LEVELS[current_level_num]

            xp_to_next = (next_level['minXP'] - xp) if next_level else 0

            return {
                "xp": xp,
                "level": level_info['level'],
                "levelName": level_info['name'],
                "levelColor": level_info['color'],
                "badges": badges,
                "completedCount": len(completed),
                "totalScenarios": total_scenarios,
                "progressPercent": round((len(completed) / total_scenarios) * 100, 1) if total_scenarios > 0 else 0,
                "xpToNextLevel": max(0, xp_to_next),
                "nextLevelName": next_level['name'] if next_level else None,
                "allBadges": BADGES
            }

        progress_records = Progress.query.filter_by(user_id=user_id).all()
        xp = GamificationService.calculate_xp(progress_records)
        level_info = calculate_level_info(xp)
        completed = [p for p in progress_records if p.status == "completed"]
        total_scenarios = len(engine.list_scenarios())

        earned_badge_ids = evaluate_badges(user_id, progress_records, engine)
        badges = []
        for badge_id in earned_badge_ids:
            if badge_id in BADGES:
                badges.append({
                    'id': badge_id,
                    'name': BADGES[badge_id]['name'],
                    'icon': BADGES[badge_id]['icon'],
                    'description': BADGES[badge_id]['trigger']
                })

        current_level_num = level_info['level']
        next_level = None
        if current_level_num < 5:
            next_level = LEVELS[current_level_num]

        xp_to_next = (next_level['minXP'] - xp) if next_level else 0

        return {
            "xp": xp,
            "level": level_info['level'],
            "levelName": level_info['name'],
            "levelColor": level_info['color'],
            "badges": badges,
            "completedCount": len(completed),
            "totalScenarios": total_scenarios,
            "progressPercent": round((len(completed) / total_scenarios) * 100, 1) if total_scenarios > 0 else 0,
            "xpToNextLevel": max(0, xp_to_next),
            "nextLevelName": next_level['name'] if next_level else None,
            "allBadges": BADGES
        }

    @staticmethod
    def get_leaderboard(limit: int = 10) -> list[dict]:
        """
        Get top users by XP.
        Returns username, XP, level, and completed count.
        """
        if _is_mongo():
            from src.storage import Storage
            users_raw = Storage.get_all_users()
            leaderboard = []
            for user in users_raw:
                user_id_val = int(str(user["_id"]), 16) if hasattr(user.get("_id"), "__str__") else user.get("id", 0)
                progress_records_raw = Storage.get_all_progress_for_user(user_id_val)
                progress_records = []
                for p in progress_records_raw:
                    class FakeProgress:
                        pass
                    fp = FakeProgress()
                    fp.score = p.get('score', 0)
                    fp.status = p.get('status', 'started')
                    progress_records.append(fp)
                xp = GamificationService.calculate_xp(progress_records)
                level_info = calculate_level_info(xp)
                completed = len([p for p in progress_records if p.status == "completed"])
                leaderboard.append({
                    "user_id": user_id_val,
                    "username": user.get('username', ''),
                    "xp": xp,
                    "level": level_info['level'],
                    "levelName": level_info['name'],
                    "levelColor": level_info['color'],
                    "completed": completed,
                })
            leaderboard.sort(key=lambda x: x["xp"], reverse=True)
            return leaderboard[:limit]

        users = User.query.all()
        leaderboard = []

        for user in users:
            progress_records = Progress.query.filter_by(user_id=user.id).all()
            xp = GamificationService.calculate_xp(progress_records)
            level_info = calculate_level_info(xp)
            completed = len([p for p in progress_records if p.status == "completed"])

            leaderboard.append({
                "user_id": user.id,
                "username": user.username,
                "xp": xp,
                "level": level_info['level'],
                "levelName": level_info['name'],
                "levelColor": level_info['color'],
                "completed": completed,
            })

        leaderboard.sort(key=lambda x: x["xp"], reverse=True)
        return leaderboard[:limit]

    @staticmethod
    def award_badge(user_id: int, badge_id: str) -> bool:
        """
        Award a specific badge to a user (stored in app config for MVP).
        Returns True if awarded, False if already owned or invalid.
        """
        from flask import current_app

        user_badges = current_app.config.get('user_badges', {})

        if user_id not in user_badges:
            user_badges[user_id] = []

        if badge_id in user_badges[user_id]:
            return False

        user_badges[user_id].append(badge_id)
        current_app.config['user_badges'] = user_badges
        return True

    @staticmethod
    def get_locked_badges(earned_badge_ids: list) -> list:
        """Get list of badges not yet earned."""
        locked = []
        for badge_id, badge_info in BADGES.items():
            if badge_id not in earned_badge_ids:
                locked.append({
                    'id': badge_id,
                    'name': badge_info['name'],
                    'icon': badge_info['icon'],
                    'description': badge_info['trigger']
                })
        return locked