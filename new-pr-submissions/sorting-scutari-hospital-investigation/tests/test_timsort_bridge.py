"""Static contract tests for the independent conceptual connection section."""

import os
import re
import unittest

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class TestTimsortBridge(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as handle:
            cls.html = handle.read()
        with open(os.path.join(BASE_DIR, "js", "app.js"), "r", encoding="utf-8") as handle:
            cls.app_js = handle.read()
        with open(os.path.join(BASE_DIR, "js", "simulator.js"), "r", encoding="utf-8") as handle:
            cls.simulator_js = handle.read()
        with open(os.path.join(BASE_DIR, "js", "timsortBridge.js"), "r", encoding="utf-8") as handle:
            cls.bridge_js = handle.read()
        with open(os.path.join(BASE_DIR, "css", "style.css"), "r", encoding="utf-8") as handle:
            cls.css = handle.read()
        with open(os.path.join(BASE_DIR, "README.md"), "r", encoding="utf-8") as handle:
            cls.readme = handle.read()

    def test_six_tab_navigation_with_independent_connection(self):
        """The connection is its own destination between Merge and Timsort."""
        tab_ids = re.findall(r'id="(tab-sim-[^"]+)"', self.html)
        self.assertEqual(
            tab_ids,
            [
                "tab-sim-bubble",
                "tab-sim-insertion",
                "tab-sim-merge",
                "tab-sim-connection",
                "tab-sim-timsort",
                "tab-sim-comparison",
            ],
        )
        self.assertEqual(len(re.findall(r'id="screen-\d+"', self.html)), 8)
        self.assertIn(
            '<button id="tab-sim-connection" class="algo-tab-btn algo-tab-btn-concept"',
            self.html,
        )
        self.assertIn('data-algo="connection"', self.html)
        self.assertIn('aria-controls="sim-connection-panel"', self.html)
        self.assertIn('aria-label="Connecting the Ideas: conceptual bridge between Merge Sort and Timsort Model"', self.html)
        self.assertIn("Conceptual connection · before the Timsort Model", self.html)

    def test_original_timsort_experience_is_restored(self):
        """No embedded-intro scaffolding remains inside the simulator tab."""
        self.assertNotIn("sim-timsort-intro", self.html)
        self.assertNotIn("sim-algorithm-workspace", self.html)
        self.assertNotIn("sim-timsort-review-btn", self.html)
        self.assertNotIn("Review the connection", self.html)
        self.assertNotIn("showTimsortIntro", self.simulator_js)
        self.assertNotIn("showTimsortSimulator", self.simulator_js)
        self.assertNotIn("reviewTimsortConnection", self.simulator_js)
        self.assertNotIn("timsortIntroVisible", self.simulator_js)
        self.assertNotIn("timsortReviewVisible", self.simulator_js)
        self.assertNotIn("setTimsortReviewButtonVisible", self.simulator_js)
        self.assertIn(
            "These animations use illustrative ward records to show how values compare and move.",
            self.html,
        )
        self.assertIn("The Timsort tab is a simplified model of natural runs", self.html)
        self.assertIn("updateAlgoInfoCard(currentAlgo);", self.simulator_js)
        self.assertIn("regenerateSteps();", self.simulator_js)

    def test_dedicated_panel_contains_five_stage_structure(self):
        """The independent panel owns the complete learning experience."""
        panel_start = self.html.index('id="sim-connection-panel"')
        comparison_start = self.html.index('id="sim-comparison-panel"')
        panel_html = self.html[panel_start:comparison_start]

        self.assertIn('role="tabpanel"', panel_html)
        self.assertIn('aria-labelledby="tab-sim-connection"', panel_html)
        self.assertIn("Connecting the Ideas: From Insertion Sort and Merge Sort to TimSort", panel_html)
        self.assertIn(
            "<strong>Learning objective:</strong> Understand how TimSort combines the ideas of Insertion Sort and Merge Sort to efficiently sort partially ordered data.",
            panel_html,
        )
        self.assertIn("not another sorting algorithm", panel_html)

        for stage in ["The problem", "Insertion idea", "Merge idea", "TimSort connection", "Knowledge check"]:
            self.assertIn(stage, panel_html, f"Missing stage label: {stage}")

        for element_id in [
            "bridge-progress-steps", "bridge-progress-bar", "bridge-progress-fill",
            "bridge-stage-kicker", "bridge-stage-counter", "bridge-stage-title",
            "bridge-stage-copy", "bridge-visual", "bridge-operation-label",
            "bridge-explanation-text", "bridge-prev-btn", "bridge-restart-btn",
            "bridge-next-btn", "bridge-continue-btn", "bridge-check-panel",
            "bridge-check-question", "bridge-check-options", "bridge-check-feedback",
            "bridge-complete-badge",
        ]:
            self.assertIn(f'id="{element_id}"', self.html, f"Missing {element_id}")

        self.assertIn('<script src="js/timsortBridge.js?v=2.2"></script>', self.html)

    def test_five_stages_teach_relationships_with_a_continuous_example(self):
        """The module uses one dataset and explains why the ideas connect."""
        self.assertEqual(len(re.findall(r'kicker:\s*"Stage [A-E]', self.bridge_js)), 5)
        for phrase in [
            "Real data is often partly ordered",
            "Extend a short ordered section",
            "Combine ordered sections",
            "Find runs, extend them, then merge adaptively",
            "Check the connections",
            "natural runs",
            "Descending run to reverse",
            "insertion-style placement",
            "Merge Sort shows how two sections",
            "adaptive strategy",
            "not Insertion Sort followed by Merge Sort",
            "does not split the list into halves",
        ]:
            self.assertIn(phrase, self.bridge_js, f"Missing teaching phrase: {phrase}")

        # The same ward values appear in every visual stage.
        for value in ["24", "38", "12", "45", "58", "73", "91", "64", "50"]:
            self.assertIn(value, self.bridge_js)

        self.assertIn("CHECK_OPTIONS", self.bridge_js)
        self.assertIn("CHECK_FEEDBACK", self.bridge_js)
        self.assertIn("visitedFinalStage", self.bridge_js)
        self.assertIn("checkAnsweredCorrectly", self.bridge_js)

    def test_progress_and_navigation_are_wired_without_visit_credit(self):
        """Completion remains distinct and only follows a correct answer."""
        self.assertIn(
            '"sim.connection": { screen: 5, label: "Complete the conceptual connection section" }',
            self.app_js,
        )
        requirement = re.search(r'5:\s*\[([^\]]+)\]', self.app_js)
        self.assertIsNotNone(requirement)
        screen_five_keys = re.findall(r'"([^"]+)"', requirement.group(1))
        self.assertEqual(
            screen_five_keys,
            [
                "sim.bubble", "sim.insertion", "sim.merge",
                "sim.connection", "sim.timsort", "comparison.benchmark",
            ],
        )
        self.assertIn("if (window.TimsortBridgeModule) window.TimsortBridgeModule.init();", self.app_js)
        self.assertIn('awardMilestone("sim.connection")', self.bridge_js)
        self.assertIn('if (!milestoneEarned() && window.App && typeof window.App.awardMilestone === "function")', self.bridge_js)
        self.assertIn("stageIndex !== STAGES.length - 1 || !visitedFinalStage", self.bridge_js)

        self.assertIn('const isBridge = algo === "connection";', self.simulator_js)
        self.assertIn('const bridgePanel = document.getElementById("sim-connection-panel");', self.simulator_js)
        self.assertIn("window.TimsortBridgeModule.activate();", self.simulator_js)
        self.assertIn('"sim.connection": "complete the conceptual connection section"', self.simulator_js)
        self.assertIn("function refreshProgression()", self.simulator_js)
        self.assertIn("refreshProgression,", self.simulator_js)
        self.assertIn("keys.indexOf(event.key) === -1", self.simulator_js)

    def test_styles_are_present_and_responsive(self):
        """The section uses the project design system at every breakpoint."""
        for selector in [
            ".algo-tab-btn-concept {", ".concept-tab-badge {", ".bridge-panel {",
            ".bridge-head {", ".bridge-objective {", ".bridge-progress {",
            ".bridge-progress-fill {", ".bridge-stage-card,", ".bridge-visual {",
            ".bridge-run-strip,", ".bridge-flow {", ".bridge-merge-stage {",
            ".bridge-timsort-stage {", ".bridge-recap-grid {", ".bridge-check-option {",
        ]:
            if selector == ".bridge-timsort-stage {":
                # Generated visual layout is covered by its child selectors.
                self.assertIn(".bridge-run-groups {", self.css)
            else:
                self.assertIn(selector, self.css, f"Missing CSS selector: {selector}")

        for query in ["@media (max-width: 900px)", "@media (max-width: 640px)", "@media (max-width: 360px)", "prefers-reduced-motion"]:
            self.assertIn(query, self.css)

    def test_readme_documents_the_independent_section(self):
        """The public learning flow matches the implementation."""
        objective = (
            "> **Project objective:** To help students understand sorting algorithms "
            "and the ideas behind TimSort through an interactive historical case study "
            "based on Florence Nightingale's work at Scutari Hospital."
        )
        self.assertIn(objective, self.readme)
        self.assertIn("The independent **Connecting the Ideas** tab sits between Merge Sort and Timsort Model", self.readme)
        self.assertIn("five stages follow one ward dataset", self.readme)
        self.assertNotIn("Timsort Model tab first presents a short conceptual introduction", self.readme)
        self.assertNotIn("Review the connection", self.readme)


if __name__ == "__main__":
    unittest.main()
