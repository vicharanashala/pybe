"""
pyBE Analytics Service
======================

Learning Analytics and Insights

Provides:
- Learning velocity metrics
- Concept mastery radar
- Time spent analysis
- Personalized recommendations
"""

from datetime import datetime, timedelta
from typing import List, Dict, Optional
from collections import defaultdict


class LearningAnalytics:
    """
    Analytics engine for learning insights.

    Computes various metrics from user progress data.
    """

    @staticmethod
    def calculate_learning_velocity(
        progress_records: list,
        days: int = 30
    ) -> dict:
        """
        Calculate learning velocity (scenarios per week).

        Returns velocity metrics over the specified period.
        """
        if not progress_records:
            return {
                "velocity": 0,
                "scenarios_completed": 0,
                "period_days": days,
                "trend": "neutral"
            }

        cutoff_date = datetime.utcnow() - timedelta(days=days)
        recent_completions = [
            p for p in progress_records
            if p.status == 'completed' and
            (p.updated_at or datetime.min) >= cutoff_date
        ]

        velocity = len(recent_completions) / (days / 7)  # per week
        velocity_per_day = len(recent_completions) / days

        return {
            "velocity": round(velocity, 2),
            "velocity_per_day": round(velocity_per_day, 2),
            "scenarios_completed": len(recent_completions),
            "period_days": days,
            "trend": LearningAnalytics._calculate_trend(recent_completions, days)
        }

    @staticmethod
    def _calculate_trend(completions: list, days: int) -> str:
        """Determine if velocity is increasing, decreasing, or stable."""
        if len(completions) < 2:
            return "neutral"

        # Split completions into first and second half
        completions_sorted = sorted(
            completions,
            key=lambda x: x.updated_at or datetime.min,
            reverse=True
        )

        midpoint = len(completions_sorted) // 2
        first_half = completions_sorted[midpoint:]
        second_half = completions_sorted[:midpoint]

        if not first_half or not second_half:
            return "neutral"

        # Calculate days span for each half
        first_rate = len(first_half) / max(1, (days / 2))
        second_rate = len(second_half) / max(1, (days / 2))

        if second_rate > first_rate * 1.2:
            return "increasing"
        elif second_rate < first_rate * 0.8:
            return "decreasing"
        return "stable"

    @staticmethod
    def get_concept_mastery_radar(user_id: int, engine, progress_records: list) -> dict:
        """
        Generate concept mastery data for radar chart.

        Returns mastery scores for various Python concepts.
        """
        concept_scores = defaultdict(list)

        for p in progress_records:
            if p.status != 'completed':
                continue
            try:
                scenario = engine.get_scenario(p.scenario_id)
                concept = scenario.get('pythonConcept', 'General')
                score = (p.score or 50) / 100.0
                concept_scores[concept].append(score)
            except Exception:
                continue

        # Calculate average mastery per concept
        radar_data = []
        for concept, scores in concept_scores.items():
            avg_mastery = sum(scores) / len(scores) if scores else 0
            radar_data.append({
                "concept": concept,
                "mastery": round(avg_mastery, 2),
                "attempts": len(scores)
            })

        # Sort by mastery
        radar_data.sort(key=lambda x: x['mastery'], reverse=True)

        return {
            "concepts": radar_data[:8],  # Top 8 for radar
            "total_concepts": len(radar_data),
            "average_mastery": round(
                sum(x['mastery'] for x in radar_data) / len(radar_data), 2
            ) if radar_data else 0
        }

    @staticmethod
    def get_domain_distribution(progress_records: list, engine) -> dict:
        """
        Get distribution of completions across domains.

        Returns data for pie/bar charts.
        """
        domain_counts = defaultdict(int)

        for p in progress_records:
            if p.status != 'completed':
                continue
            try:
                scenario = engine.get_scenario(p.scenario_id)
                domain = scenario.get('domain', 'General')
                domain_counts[domain] += 1
            except Exception:
                domain_counts['General'] += 1

        # Convert to list
        distribution = [
            {"domain": domain, "count": count}
            for domain, count in domain_counts.items()
        ]
        distribution.sort(key=lambda x: x['count'], reverse=True)

        total = sum(d['count'] for d in distribution)

        # Add percentages
        for d in distribution:
            d['percentage'] = round((d['count'] / total) * 100, 1) if total > 0 else 0

        return {
            "distribution": distribution,
            "total": total,
            "unique_domains": len(distribution)
        }

    @staticmethod
    def get_time_analysis(progress_records: list) -> dict:
        """
        Analyze when user learns (time of day, day of week).

        Returns patterns for optimizing learning schedule.
        """
        hour_distribution = defaultdict(int)
        day_distribution = defaultdict(int)

        for p in progress_records:
            if p.status != 'completed' or not p.updated_at:
                continue

            dt = p.updated_at
            hour = dt.hour
            day = dt.strftime('%A')  # Full weekday name

            hour_distribution[hour] += 1
            day_distribution[day] += 1

        # Find peak times
        peak_hour = max(hour_distribution.items(), key=lambda x: x[1])[0] if hour_distribution else 12
        peak_day = max(day_distribution.items(), key=lambda x: x[1])[0] if day_distribution else 'Sunday'

        # Calculate completion rate by hour
        hour_rates = []
        for hour in range(24):
            count = hour_distribution.get(hour, 0)
            hour_rates.append({
                "hour": f"{hour:02d}:00",
                "count": count,
                "label": "Peak" if hour == peak_hour else "Active" if count > 0 else "Inactive"
            })

        day_rates = [
            {"day": day, "count": day_distribution.get(day, 0)}
            for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        ]

        return {
            "peak_hour": peak_hour,
            "peak_day": peak_day,
            "hourly_distribution": hour_rates,
            "daily_distribution": day_rates,
            "insight": LearningAnalytics._generate_time_insight(
                peak_hour, peak_day, hour_distribution, day_distribution
            )
        }

    @staticmethod
    def _generate_time_insight(peak_hour: int, peak_day: str,
                                hour_dist: dict, day_dist: dict) -> str:
        """Generate personalized insight based on learning patterns."""
        total = sum(hour_dist.values())
        if total == 0:
            return "Start your learning journey today!"

        # Check if morning, afternoon, evening, or night learner
        if 5 <= peak_hour < 12:
            time_label = "morning"
        elif 12 <= peak_hour < 17:
            time_label = "afternoon"
        elif 17 <= peak_hour < 21:
            time_label = "evening"
        else:
            time_label = "night"

        return f"You learn best on {peak_day} {time_label}s. " \
               f"Try scheduling your pyBE sessions during this time for maximum retention."

    @staticmethod
    def get_recommendations(user_id: int, engine, progress_records: list) -> list:
        """
        Generate personalized scenario recommendations.

        Based on:
        - Incomplete scenarios in domains user is strong in
        - Domains user hasn't explored yet
        - Scenarios similar to high-scoring completions
        """
        recommendations = []

        # Get domains user has completed
        completed_domains = set()
        completed_scenarios = set()
        concept_scores = defaultdict(list)

        for p in progress_records:
            if p.status != 'completed':
                continue
            try:
                scenario = engine.get_scenario(p.scenario_id)
                domain = scenario.get('domain', 'General')
                concept = scenario.get('pythonConcept', 'General')
                completed_domains.add(domain)
                completed_scenarios.add(p.scenario_id)
                concept_scores[concept].append(p.score or 50)
            except Exception:
                continue

        # Find strongest domains
        domain_strengths = {}
        for domain in completed_domains:
            scores = []
            for p in progress_records:
                if p.status != 'completed':
                    continue
                try:
                    scenario = engine.get_scenario(p.scenario_id)
                    if scenario.get('domain') == domain:
                        scores.append(p.score or 50)
                except Exception:
                    continue
            if scores:
                domain_strengths[domain] = sum(scores) / len(scores)

        # Recommend scenarios in strong domains
        all_scenarios = engine.list_scenarios()
        for scenario in all_scenarios:
            if scenario['id'] in completed_scenarios:
                continue

            reason = None
            priority = 0

            # High priority: same domain as user's strong areas
            domain = scenario.get('domain', 'General')
            if domain in domain_strengths and domain_strengths[domain] > 70:
                reason = f"You're strong in {domain}. This scenario builds on that!"
                priority = 3

            # Medium priority: new domain exploration
            if domain not in completed_domains:
                reason = reason or f"Explore a new domain: {domain}"
                priority = max(priority, 2)

            # Low priority: similar concepts to high scores
            concept = scenario.get('pythonConcept', '')
            if concept in concept_scores:
                avg_score = sum(concept_scores[concept]) / len(concept_scores[concept])
                if avg_score > 75:
                    reason = reason or f"You excel at {concept}. Keep practicing!"
                    priority = max(priority, 1)

            if reason:
                recommendations.append({
                    "scenario_id": scenario['id'],
                    "title": scenario.get('title', 'Unknown'),
                    "domain": domain,
                    "difficulty": scenario.get('difficultyLevel', 1),
                    "reason": reason,
                    "priority": priority
                })

        # Sort by priority
        recommendations.sort(key=lambda x: x['priority'], reverse=True)

        return recommendations[:5]  # Top 5 recommendations

    @staticmethod
    def get_difficulty_analysis(progress_records: list, engine) -> dict:
        """
        Analyze user performance across difficulty levels.

        Returns success rates and average scores per difficulty.
        """
        difficulty_stats = defaultdict(lambda: {"total": 0, "completed": 0, "scores": []})

        for p in progress_records:
            try:
                scenario = engine.get_scenario(p.scenario_id)
                level = scenario.get('difficultyLevel', 1)
                difficulty_stats[level]["total"] += 1
                if p.status == 'completed':
                    difficulty_stats[level]["completed"] += 1
                    difficulty_stats[level]["scores"].append(p.score or 50)
            except Exception:
                continue

        analysis = []
        for level in sorted(difficulty_stats.keys()):
            stats = difficulty_stats[level]
            avg_score = sum(stats["scores"]) / len(stats["scores"]) if stats["scores"] else 0
            completion_rate = (stats["completed"] / stats["total"]) * 100 if stats["total"] > 0 else 0

            analysis.append({
                "level": level,
                "level_name": ["Apprentice", "Craftsperson", "Scholar", "Architect", "Pythonista"][level - 1],
                "attempted": stats["total"],
                "completed": stats["completed"],
                "completion_rate": round(completion_rate, 1),
                "average_score": round(avg_score, 1)
            })

        return {
            "levels": analysis,
            "insight": LearningAnalytics._generate_difficulty_insight(analysis)
        }

    @staticmethod
    def _generate_difficulty_insight(analysis: list) -> str:
        """Generate insight about user's difficulty progression."""
        if not analysis:
            return "Complete some scenarios to see your difficulty analysis."

        # Find strongest and weakest levels
        strongest = max(analysis, key=lambda x: x["average_score"])
        needs_work = min(analysis, key=lambda x: x["completion_rate"])

        if strongest["level"] < needs_work["level"]:
            return f"You're strongest at Level {strongest['level']} ({strongest['level_name']}). " \
                   f"Consider more practice at Level {needs_work['level']} ({needs_work['level_name']})."
        else:
            return f"You're progressing well! Your strength is at Level {strongest['level']}. " \
                   f"Keep challenging yourself!"


class ProgressInsights:
    """
    Generate human-readable insights from progress data.
    """

    @staticmethod
    def generate_insight_summary(user_id: int, engine, progress_records: list) -> dict:
        """
        Generate comprehensive insight summary.

        Returns multiple insight categories for the dashboard.
        """
        if not progress_records:
            return {
                "summary": "Start your learning journey by completing your first scenario!",
                "categories": []
            }

        completion_records = [p for p in progress_records if p.status == 'completed']

        categories = []

        # Velocity insight
        velocity = LearningAnalytics.calculate_learning_velocity(progress_records)
        if velocity['scenarios_completed'] > 0:
            categories.append({
                "type": "velocity",
                "title": "Learning Pace",
                "insight": f"You've completed {velocity['scenarios_completed']} scenarios "
                          f"at a rate of {velocity['velocity']} per week. "
                          f"Your trend is {velocity['trend']}."
            })

        # Time insight
        time_analysis = LearningAnalytics.get_time_analysis(progress_records)
        categories.append({
            "type": "timing",
            "title": "Best Learning Time",
            "insight": time_analysis['insight']
        })

        # Domain distribution
        domain_dist = LearningAnalytics.get_domain_distribution(progress_records, engine)
        if domain_dist['total'] > 0:
            top_domain = domain_dist['distribution'][0] if domain_dist['distribution'] else None
            if top_domain:
                categories.append({
                    "type": "domain",
                    "title": "Domain Focus",
                    "insight": f"You've explored {domain_dist['unique_domains']} domains. "
                              f"{top_domain['domain']} is your most completed domain "
                              f"at {top_domain['percentage']}%."
                })

        # Difficulty insight
        difficulty = LearningAnalytics.get_difficulty_analysis(progress_records, engine)
        categories.append({
            "type": "difficulty",
            "title": "Difficulty Progression",
            "insight": difficulty['insight']
        })

        return {
            "total_completed": len(completion_records),
            "categories": categories,
            "recommendations": LearningAnalytics.get_recommendations(
                user_id, engine, progress_records
            )
        }