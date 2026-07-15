"""
pyBE Enhanced Gamification
==========================

Streaks, Challenges, and Achievement System

Features:
- Daily/weekly learning streaks with bonus XP
- Timed challenges with limited badges
- Completion certificates for scenarios/domains
- Special event badges
"""

from datetime import datetime, timedelta, date
from typing import Optional
from flask import current_app


class StreakService:
    """
    Manages user learning streaks.

    Streaks are consecutive days of completing scenarios.
    Bonus XP awarded for maintaining streaks.
    """

    STREAK_BONUS_XP = {
        3: 25,   # 3-day streak: 25 bonus XP
        7: 75,   # 7-day streak: 75 bonus XP
        14: 150, # 14-day streak: 150 bonus XP
        30: 500  # 30-day streak: 500 bonus XP
    }

    @staticmethod
    def calculate_streak_bonus(current_streak: int) -> int:
        """
        Calculate bonus XP for maintaining a streak.

        Returns the highest bonus tier the streak qualifies for.
        """
        bonus = 0
        for threshold, tier_bonus in sorted(StreakService.STREAK_BONUS_XP.items()):
            if current_streak >= threshold:
                bonus = tier_bonus
        return bonus

    @staticmethod
    def get_streak_tier(streak_days: int) -> dict:
        """
        Get streak tier info.

        Returns tier name, bonus XP, and next milestone.
        """
        if streak_days >= 30:
            return {
                "tier": "legendary",
                "name": "Legendary Learner",
                "streak": streak_days,
                "bonus_xp": StreakService.STREAK_BONUS_XP[30],
                "next_milestone": None,
                "progress": 100
            }
        elif streak_days >= 14:
            next_threshold = 30
            progress = int((streak_days / 30) * 100)
        elif streak_days >= 7:
            next_threshold = 14
            progress = int((streak_days / 14) * 100)
        elif streak_days >= 3:
            next_threshold = 7
            progress = int((streak_days / 7) * 100)
        else:
            next_threshold = 3
            progress = int((streak_days / 3) * 100)

        tier_names = {
            3: "Dedicated Starter",
            7: "Week Warrior",
            14: "Fortnight Force",
            30: "Legendary Learner"
        }

        return {
            "tier": f"tier_{next_threshold}",
            "name": tier_names.get(next_threshold, "Learner"),
            "streak": streak_days,
            "bonus_xp": StreakService.calculate_streak_bonus(streak_days),
            "next_milestone": next_threshold,
            "progress": min(progress, 100)
        }


class ChallengeService:
    """
    Manages timed learning challenges.

    Challenges are time-limited goals with special badges.
    Types:
    - Daily: Reset every day at midnight UTC
    - Weekly: Reset every Monday
    - Special: Time-limited events (Halloween, anniversary, etc.)
    """

    DAILY_CHALLENGE_TEMPLATES = [
        {
            "id": "daily_quickstarter",
            "name": "Quick Starter",
            "description": "Complete 1 scenario today",
            "requirement": 1,
            "type": "completion",
            "badge": "daily_starter",
            "xp_reward": 50
        },
        {
            "id": "daily_deep_thinker",
            "name": "Deep Thinker",
            "description": "Complete a Dilemma-type scenario",
            "requirement": 1,
            "type": "domain",
            "target": "Dilemma",
            "badge": "daily_philosopher",
            "xp_reward": 75
        },
        {
            "id": "daily_explorer",
            "name": "Domain Explorer",
            "description": "Complete scenarios from 2 different domains",
            "requirement": 2,
            "type": "domains",
            "badge": "daily_explorer",
            "xp_reward": 100
        },
        {
            "id": "daily_perfectionist",
            "name": "Perfectionist",
            "description": "Score 90+ on any scenario",
            "requirement": 1,
            "type": "score",
            "threshold": 90,
            "badge": "daily_perfectionist",
            "xp_reward": 75
        }
    ]

    WEEKLY_CHALLENGES = [
        {
            "id": "weekly_scholar",
            "name": "Weekly Scholar",
            "description": "Complete 5 scenarios this week",
            "requirement": 5,
            "type": "completion",
            "badge": "weekly_scholar",
            "xp_reward": 500
        },
        {
            "id": "weekly_diverse",
            "name": "Diverse Learner",
            "description": "Complete scenarios from 4 different domains",
            "requirement": 4,
            "type": "domains",
            "badge": "weekly_diverse",
            "xp_reward": 300
        },
        {
            "id": "weekly_master",
            "name": "Weekly Master",
            "description": "Complete all daily challenges this week",
            "requirement": 7,
            "type": "streak",
            "badge": "weekly_master",
            "xp_reward": 750
        }
    ]

    @staticmethod
    def get_daily_challenge() -> dict:
        """
        Get today's daily challenge.

        Uses day of year to rotate through available challenges.
        """
        day_of_year = datetime.utcnow().timetuple().tm_yday
        challenge = ChallengeService.DAILY_CHALLENGE_TEMPLATES[
            day_of_year % len(ChallengeService.DAILY_CHALLENGE_TEMPLATES)
        ]
        return {
            **challenge,
            "expires_at": ChallengeService._get_next_midnight().isoformat(),
            "reset_in_seconds": int(
                (ChallengeService._get_next_midnight() - datetime.utcnow()).total_seconds()
            )
        }

    @staticmethod
    def get_weekly_challenges() -> list:
        """Get this week's available challenges."""
        return ChallengeService.WEEKLY_CHALLENGES

    @staticmethod
    def check_challenge_progress(user_id: int, challenge: dict, progress_data: dict) -> dict:
        """
        Check if user has completed a challenge.

        Returns completion status and progress percentage.
        """
        requirement = challenge.get("requirement", 1)
        current = progress_data.get("current", 0)

        return {
            "completed": current >= requirement,
            "progress": min(int((current / requirement) * 100), 100),
            "current": current,
            "requirement": requirement
        }

    @staticmethod
    def _get_next_midnight() -> datetime:
        """Get next midnight UTC."""
        tomorrow = datetime.utcnow().date() + timedelta(days=1)
        return datetime.combine(tomorrow, datetime.min.time())

    @staticmethod
    def get_challenge_badge(challenge_type: str, challenge_id: str) -> dict:
        """Get badge info for completing a challenge."""
        badge_id = f"{challenge_type}_{challenge_id}"
        return {
            "id": badge_id,
            "name": f"{challenge_type.title()} Challenger",
            "icon": "🏆",
            "description": f"Completed the {challenge_id} challenge",
            "xp_reward": 100
        }


class CertificateService:
    """
    Generates completion certificates.

    Certificates are issued for:
    - Scenario completion
    - Domain mastery
    - Level achievements
    - Special accomplishments
    """

    CERTIFICATE_TEMPLATES = {
        "scenario": {
            "title": "Certificate of Completion",
            "description": "Has successfully completed the scenario",
            "include": ["scenario_title", "domain", "score", "date", "user_name"]
        },
        "domain_mastery": {
            "title": "Domain Mastery Certificate",
            "description": "Has achieved mastery in the domain of",
            "include": ["domain", "scenario_count", "date", "user_name"]
        },
        "level_up": {
            "title": "Level Achievement Certificate",
            "description": "Has achieved level",
            "include": ["level", "level_name", "date", "user_name"]
        },
        "perfect_score": {
            "title": "Perfect Score Certificate",
            "description": "Achieved a perfect score on",
            "include": ["scenario_title", "date", "user_name"]
        },
        "streak": {
            "title": "Streak Achievement Certificate",
            "description": "Maintained a learning streak of",
            "include": ["streak_days", "date", "user_name"]
        }
    }

    @staticmethod
    def generate_certificate(
        cert_type: str,
        user_name: str,
        **kwargs
    ) -> dict:
        """
        Generate a certificate data object.

        This is used for PDF generation on the frontend.
        The actual PDF is generated client-side.
        """
        template = CertificateService.CERTIFICATE_TEMPLATES.get(cert_type, {})

        return {
            "type": cert_type,
            "title": template.get("title", "Certificate"),
            "description": template.get("description", ""),
            "issued_to": user_name,
            "issued_at": datetime.utcnow().isoformat(),
            "fields": kwargs,
            "certificate_id": CertificateService._generate_cert_id(
                cert_type, user_name, kwargs
            )
        }

    @staticmethod
    def _generate_cert_id(cert_type: str, user_name: str, fields: dict) -> str:
        """Generate unique certificate ID."""
        import hashlib
        data = f"{cert_type}:{user_name}:{datetime.utcnow().isoformat()}:{fields}"
        return hashlib.sha256(data.encode()).hexdigest()[:16].upper()

    @staticmethod
    def get_certificate_preview(cert_type: str) -> dict:
        """Get preview of certificate template (without user data)."""
        template = CertificateService.CERTIFICATE_TEMPLATES.get(cert_type, {})
        return {
            "type": cert_type,
            "title": template.get("title", ""),
            "description": template.get("description", ""),
            "fields": template.get("include", [])
        }


class BadgeEasterEggs:
    """
    Special hidden badges for edge cases and easter eggs.

    These add fun beyond the core badge system.
    """

    SPECIAL_BADGES = {
        "midnight_philosopher": {
            "name": "Midnight Philosopher",
            "icon": "🌙",
            "description": "Complete a Philosophy scenario after midnight",
            "trigger": "time_check"
        },
        "early_bird_special": {
            "name": "Early Bird Special",
            "icon": "🌅",
            "description": "Complete 3 scenarios before 7 AM",
            "trigger": "multi_time_check"
        },
        "code_ninja": {
            "name": "Code Ninja",
            "icon": "🥷",
            "description": "Submit code with zero errors on first try",
            "trigger": "code_quality"
        },
        "completionist": {
            "name": "Completionist",
            "icon": "📝",
            "description": "Complete all reflection prompts for a scenario",
            "trigger": "reflection_complete"
        },
        "helper": {
            "name": "Helpful Hand",
            "icon": "🤝",
            "description": "Have your answer marked as accepted in discussions",
            "trigger": "accepted_answer"
        },
        "comeback_kid": {
            "name": "Comeback Kid",
            "icon": "💪",
            "description": "Complete a scenario after failing it twice",
            "trigger": "retry_success"
        },
        "century_club": {
            "name": "Century Club",
            "icon": "🎯",
            "description": "Score 100 on 5 different scenarios",
            "trigger": "score_100_x5"
        },
        "marathon_runner": {
            "name": "Marathon Runner",
            "icon": "🏃",
            "description": "Complete 10 scenarios in a single day",
            "trigger": "volume_session"
        }
    }

    @staticmethod
    def get_all_special_badges() -> dict:
        """Get all special/hidden badges."""
        return BadgeEasterEggs.SPECIAL_BADGES

    @staticmethod
    def check_special_badge_trigger(trigger: str, context: dict) -> bool:
        """
        Check if a special badge trigger condition is met.

        Returns True if badge should be awarded.
        """
        hour = context.get("hour", datetime.utcnow().hour)

        if trigger == "time_check":
            return hour >= 0 and hour < 4  # After midnight, before 4 AM
        elif trigger == "multi_time_check":
            return context.get("early_completions", 0) >= 3 and hour < 7
        elif trigger == "code_quality":
            return context.get("errors", 0) == 0 and context.get("first_try", False)
        elif trigger == "reflection_complete":
            return context.get("reflection_prompts_done", 0) >= 3
        elif trigger == "accepted_answer":
            return context.get("answer_accepted", False)
        elif trigger == "retry_success":
            return context.get("failed_attempts", 0) >= 2 and context.get("completed", False)
        elif trigger == "score_100_x5":
            return context.get("perfect_scores", 0) >= 5
        elif trigger == "volume_session":
            return context.get("daily_completions", 0) >= 10

        return False