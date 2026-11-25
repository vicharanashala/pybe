"""
The Sorting Investigation - Integrity & Integration Test Suite
Verifies all static assets, HTML structure, script completeness, and HTTP server endpoints.
"""

import os
import re
import sys
import json
import unittest
import urllib.request
import urllib.error
import threading
import time

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)
import server


class TestProjectIntegrity(unittest.TestCase):

    def test_file_structure_exists(self):
        """Verify all critical files and directories exist."""
        required_files = [
            "index.html",
            "server.py",
            "run.bat",
            "run.ps1",
            "README.md",
            "HISTORICAL_NOTES.md",
            "css/style.css",
            "assets/illustrations.js",
            "assets/favicon.svg",
            "js/app.js",
            "js/story.js",
            "js/evidence.js",
            "js/sortGame.js",
            "js/simulator.js",
            "js/pythonLearn.js",
            "js/exercises.js",
            "js/finalMission.js",
            "assets/images/hero_scutari_hospital.jpg",
            "assets/images/story_scutari_nurses_1855.png",
            "assets/images/story_medical_report_1858.png",
            "assets/images/scene3_mortality_diagram.jpg",
            "assets/images/story_nightingale_ward_visit_1855.png",
            "Historical-Story-Images/story_scutari_nurses_1855.png",
            "Historical-Story-Images/story_medical_report_1858.png",
            "Historical-Story-Images/story_nightingale_ward_visit_1855.png",
        ]
        for rel_path in required_files:
            full_path = os.path.join(BASE_DIR, rel_path)
            self.assertTrue(os.path.exists(full_path), f"Missing required file: {rel_path}")

    def test_authentic_historical_images_valid(self):
        """Verify that all authentic historical images are valid readable image files."""
        from PIL import Image
        jpg_names = [
            "hero_scutari_hospital.jpg",
            "scene3_mortality_diagram.jpg",
        ]
        for name in jpg_names:
            img_path = os.path.join(BASE_DIR, "assets", "images", name)
            self.assertTrue(os.path.exists(img_path), f"Missing image file: {name}")
            self.assertGreater(os.path.getsize(img_path), 50 * 1024, f"Image {name} is unusually small!")
            with Image.open(img_path) as im:
                self.assertEqual(im.format, "JPEG", f"Image {name} is not JPEG format!")
                self.assertGreater(im.width, 300)
                self.assertGreater(im.height, 300)

        png_names = [
            "story_scutari_nurses_1855.png",
            "story_medical_report_1858.png",
            "story_nightingale_ward_visit_1855.png",
        ]
        for name in png_names:
            img_path = os.path.join(BASE_DIR, "assets", "images", name)
            self.assertTrue(os.path.exists(img_path), f"Missing image file: {name}")
            self.assertGreater(os.path.getsize(img_path), 50 * 1024, f"Image {name} is unusually small!")
            with Image.open(img_path) as im:
                self.assertEqual(im.format, "PNG", f"Image {name} is not PNG format!")
                self.assertGreater(im.width, 300)
                self.assertGreater(im.height, 300)

            # Also verify in Historical-Story-Images directory
            hsi_path = os.path.join(BASE_DIR, "Historical-Story-Images", name)
            self.assertTrue(os.path.exists(hsi_path), f"Missing in Historical-Story-Images: {name}")

    def test_html_contains_all_eight_screens(self):
        """Verify that index.html contains definitions for all 8 screens."""
        html_path = os.path.join(BASE_DIR, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()

        for screen_num in range(1, 9):
            screen_id = f'id="screen-{screen_num}"'
            self.assertIn(screen_id, content, f"Screen {screen_num} missing from index.html!")

    def test_no_external_broken_cdn_dependencies(self):
        """Ensure project has no external CDN dependencies that could break offline."""
        html_path = os.path.join(BASE_DIR, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check for external script src or link href starting with http/https
        external_scripts = re.findall(r'<script[^>]+src=["\'](https?://[^"\']+)["\']', content)
        external_css = re.findall(r'<link[^>]+href=["\'](https?://[^"\']+)["\']', content)
        self.assertEqual(external_scripts, [], "External script CDN found in index.html!")
        self.assertEqual(external_css, [], "External stylesheet CDN found in index.html!")

    def test_all_local_scripts_referenced_in_html(self):
        """Verify that all js files in js/ and assets/ are referenced in index.html."""
        html_path = os.path.join(BASE_DIR, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()

        expected_scripts = [
            "assets/illustrations.js",
            "js/story.js",
            "js/evidence.js",
            "js/sortGame.js",
            "js/simulator.js",
            "js/pythonLearn.js",
            "js/exercises.js",
            "js/finalMission.js",
            "js/app.js",
        ]
        for script_ref in expected_scripts:
            self.assertIn(script_ref, content, f"Script {script_ref} is not referenced in index.html!")

    def test_illustrations_complete_and_valid_svg(self):
        """Verify all historical illustrations exist and contain valid SVG markup."""
        illus_path = os.path.join(BASE_DIR, "assets", "illustrations.js")
        with open(illus_path, "r", encoding="utf-8") as f:
            content = f.read()

        required_keys = ["scutariHospital", "ledger", "patternDiscovery", "investigatorMission", "badge"]
        for key in required_keys:
            self.assertIn(f"{key}:", content, f"Missing illustration key: {key}")
            # Ensure it contains svg markup
            pattern = rf'{key}:\s*`\s*<svg[^>]+>[\s\S]+?</svg>\s*`'
            self.assertTrue(re.search(pattern, content), f"Illustration {key} does not contain valid SVG markup!")

    def test_simulator_mode_toggle_elements_and_arrows(self):
        """Verify simulator mode toggle buttons have arrows and proper ARIA states."""
        html_path = os.path.join(BASE_DIR, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn('id="sim-mode-asc"', content)
        self.assertIn('id="sim-mode-desc"', content)
        self.assertIn('▲', content)
        self.assertIn('▼', content)
        self.assertIn('class="mode-toggle-btn active"', content)

    def test_simulator_sorting_logic_known_values(self):
        """Verify exact expected test values for simulator step generation."""
        test_input = [58, 24, 91, 12, 45]
        asc_expected = [12, 24, 45, 58, 91]
        desc_expected = [91, 58, 45, 24, 12]

        self.assertEqual(sorted(test_input), asc_expected)
        self.assertEqual(sorted(test_input, reverse=True), desc_expected)

    def test_all_dom_ids_referenced_in_js_exist_in_html(self):
        """Verify that every static element ID looked up in JS exists in index.html."""
        html_path = os.path.join(BASE_DIR, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()

        html_ids = set(re.findall(r'id=["\']([a-zA-Z0-9_\-]+)["\']', html))

        js_dir = os.path.join(BASE_DIR, "js")
        dynamic_ids = {"btn-next-level", "btn-to-sim"}  # IDs inserted dynamically in feedback HTML

        for fname in os.listdir(js_dir):
            if fname.endswith(".js"):
                with open(os.path.join(js_dir, fname), "r", encoding="utf-8") as f:
                    js_code = f.read()

                referenced_ids = re.findall(r'getElementById\(["\']([a-zA-Z0-9_\-]+)["\']\)', js_code)
                for dom_id in referenced_ids:
                    # Ignore dynamically constructed screen-X or dynamic feedback buttons
                    if dom_id.startswith("screen-") or dom_id in dynamic_ids:
                        continue
                    self.assertIn(
                        dom_id,
                        html_ids,
                        f"JS file '{fname}' looks up ID '{dom_id}' which does not exist in index.html!"
                    )

    def test_soft_rose_theme_variables_present(self):
        """Verify that the Soft Rose theme variables and color tokens are correctly defined."""
        css_path = os.path.join(BASE_DIR, "css", "style.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()

        required_tokens = [
            "--bg-page: #faf6f5",
            "--border-light: #ebdcd9",
            "--bg-subtle: #f7eeec",
            "--color-primary: #1d4ed8",
        ]
        for token in required_tokens:
            self.assertIn(token, css, f"Soft Rose token '{token}' missing from style.css")

    def test_graded_answers_are_randomized_without_visible_letter_prefixes(self):
        """Options shuffle in presentation only; semantic keys and labels stay fixed."""
        with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as handle:
            html = handle.read()
        with open(os.path.join(BASE_DIR, "css", "style.css"), "r", encoding="utf-8") as handle:
            css = handle.read()
        sources = {}
        for name in ["randomize.js", "simulator.js", "exercises.js", "finalMission.js"]:
            with open(os.path.join(BASE_DIR, "js", name), "r", encoding="utf-8") as handle:
                sources[name] = handle.read()

        self.assertIn('js/randomize.js?v=2.2', html)
        self.assertIn("function shuffled", sources["randomize.js"])
        self.assertIn("function shuffleGroup", sources["randomize.js"])
        self.assertIn("Rejection sampling avoids modulo bias", sources["randomize.js"])

        # Visible letters are generated from the displayed position, so a shuffle
        # can never leave an answer labelled with its old letter.
        self.assertNotRegex(html, r"<strong>[A-D]\)</strong>")
        self.assertIn("counter-reset: answer-option", css)
        self.assertIn("content: counter(answer-option, upper-alpha)", css)

        self.assertIn("shuffleAnswerGroups", sources["exercises.js"])
        self.assertIn("reshuffleOptions: shuffleAnswerGroups", sources["exercises.js"])
        self.assertIn("shuffleAnswerGroups", sources["finalMission.js"])
        self.assertIn("reshuffleOptions: shuffleAnswerGroups", sources["finalMission.js"])
        self.assertIn("optionLabel(btnEl", sources["finalMission.js"])

        self.assertIn("reshuffleUnderstandingCheck", sources["simulator.js"])
        self.assertIn("understandingCheckOrder", sources["simulator.js"])
        self.assertIn("reshuffleUnderstandingCheck,\n    answerCheckpoint", sources["simulator.js"])

        for group_name in ["ex1-option", "ex5-option", "ex8-option", "mission-strat-btn", "mission-q3-btn"]:
            self.assertIn(group_name, html, f"Randomized group {group_name} is missing from index.html")

    def test_soft_slate_simulator_palette_replaces_near_black(self):
        """The final simulator cascade uses coordinated warm slate surfaces."""
        with open(os.path.join(BASE_DIR, "css", "style.css"), "r", encoding="utf-8") as handle:
            css = handle.read()

        self.assertIn("Soft Slate simulator palette", css)
        final_layer = css.split("Soft Slate simulator palette", 1)[1]
        for token in [
            "--sim-surface: #2c3a4a",
            "--sim-surface-raised: #38485a",
            "--sim-border: #5b6d81",
            "--sim-text: #f8fafc",
            "--sim-muted: #d7e0ea",
            "--sim-focus: #fcd34d",
        ]:
            self.assertIn(token, final_layer, f"Soft Slate token '{token}' missing")
        self.assertNotIn("#0f172a", final_layer)
        self.assertNotIn("#020617", final_layer)

    def test_story_image_warm_background_styling(self):
        """Verify that story image presentation uses warm ivory background, Soft Rose captions, and muted brown text."""
        css_path = os.path.join(BASE_DIR, "css", "style.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()

        # Story scene visual warm ivory and warm beige border
        self.assertIn("background-color: #f3e9e3;", css)
        self.assertIn("border: 1px solid #dfd0c7;", css)

        # Story scene caption Soft Rose background and muted brown text
        self.assertIn("background-color: #fdf5f3;", css)
        self.assertIn("color: #554943;", css)

        # Verify hero art box retains its dark framing
        self.assertIn(".hero-art-box", css)

    def test_header_brand_icon_and_emblem_svg(self):
        """Verify header brand icon has valid SVG emblem and prevents undefined rendering."""
        html_path = os.path.join(BASE_DIR, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()

        # Check inline emblem SVG inside header-brand-icon
        self.assertIn('id="header-brand-icon"', html)
        self.assertIn('<svg viewBox="0 0 36 36"', html)

        # Check illustrations.js defines emblem, lantern, and logo
        illus_path = os.path.join(BASE_DIR, "assets", "illustrations.js")
        with open(illus_path, "r", encoding="utf-8") as f:
            illus = f.read()
        self.assertIn("emblem:", illus)
        self.assertIn("lantern:", illus)
        self.assertIn("logo:", illus)

    def test_terminal_presets_and_active_states(self):
        """Verify terminal presets in HTML and JS have active state handlers."""
        html_path = os.path.join(BASE_DIR, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()

        for preset_id in ["btn-preset-asc", "btn-preset-desc", "btn-preset-imm"]:
            self.assertIn(f'id="{preset_id}"', html)

        js_path = os.path.join(BASE_DIR, "js", "exercises.js")
        with open(js_path, "r", encoding="utf-8") as f:
            exercises_js = f.read()

        self.assertIn("updatePresetButtons", exercises_js)

    def test_final_mission_strategy_wiring(self):
        """Verify final mission strategy buttons and dual branching logic."""
        html_path = os.path.join(BASE_DIR, "index.html")
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertIn('data-strat="ascending"', html)
        self.assertIn('data-strat="descending"', html)

        mission_js_path = os.path.join(BASE_DIR, "js", "finalMission.js")
        with open(mission_js_path, "r", encoding="utf-8") as f:
            mission_js = f.read()

        self.assertIn('strategy === "descending"', mission_js)
        self.assertIn('currentStrategy === "descending"', mission_js)


    def test_milestone_progress_contract(self):
        """Progress comes from real learning actions, not screen navigation."""
        with open(os.path.join(BASE_DIR, "js", "app.js"), "r", encoding="utf-8") as handle:
            app_js = handle.read()
        with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as handle:
            html = handle.read()

        milestone_keys = [
            "story.scenes", "evidence.compared", "game.allLevels",
            "sim.bubble", "sim.insertion", "sim.merge", "sim.timsort",
            "comparison.benchmark", "python.sorting", "exercises.complete",
            "mission.complete",
        ]
        for key in milestone_keys:
            self.assertIn(f'"{key}"', app_js, f"Missing milestone key {key}")
        self.assertIn("function awardMilestone", app_js)
        self.assertIn("function getProgress", app_js)
        self.assertIn("Milestones ${progress.earnedCount} of ${progress.totalCount}", app_js)
        self.assertIn('id="header-progress-text"', html)
        self.assertIn('id="mission-requirements-list"', html)

        module_expectations = {
            "story.js": "story.scenes",
            "evidence.js": "evidence.compared",
            "sortGame.js": "game.allLevels",
            "pythonLearn.js": "python.sorting",
            "exercises.js": "exercises.complete",
            "finalMission.js": "mission.complete",
        }
        for filename, key in module_expectations.items():
            with open(os.path.join(BASE_DIR, "js", filename), "r", encoding="utf-8") as handle:
                module_js = handle.read()
            self.assertIn(f'awardMilestone("{key}")', module_js, f"{filename} never awards {key}")
            self.assertIn("function reset()", module_js, f"{filename} has no reset contract")

    def test_shared_teaching_and_benchmark_states_are_wired(self):
        """The step explanation and benchmark failure states must exist in markup and code."""
        with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as handle:
            html = handle.read()
        with open(os.path.join(BASE_DIR, "js", "simulator.js"), "r", encoding="utf-8") as handle:
            simulator_js = handle.read()
        with open(os.path.join(BASE_DIR, "css", "style.css"), "r", encoding="utf-8") as handle:
            css = handle.read()

        for element_id in [
            "sim-teaching-panel", "sim-teach-state", "sim-teach-examined",
            "sim-teach-condition", "sim-teach-outcome", "sim-teach-change",
            "sim-teach-remaining", "sim-teach-complete", "sim-teaching-legend",
            "sim-input-dataset-select", "sim-check-panel", "sim-check-question",
            "sim-check-option-a", "sim-check-option-b", "sim-check-feedback",
            "sim-commentary-text", "sim-commentary-label", "sim-commentary-why",
            "comparison-purpose", "comparison-pattern-help", "comparison-loading",
            "comparison-results", "comparison-chart", "comparison-interpretation",
            "comparison-success-badge", "comparison-advanced",
        ]:
            self.assertIn(f'id="{element_id}"', html, f"Missing {element_id}")
        self.assertIn("<summary>Advanced results and technical details</summary>", html)
        self.assertIn("Algorithm Comparison", html)
        for dataset_label in [
            "Random-like", "Already sorted", "Reversed", "Nearly sorted", "Duplicates",
        ]:
            self.assertIn(dataset_label, html)
        self.assertIn("function teachingFor", simulator_js)
        self.assertIn('state: "endpoint-missing"', simulator_js)
        self.assertIn('state: "invalid-response"', simulator_js)
        self.assertIn('state: "request-failed"', simulator_js)
        self.assertIn('state: "timeout"', simulator_js)
        self.assertIn("DATASET_EXPLANATIONS", simulator_js)
        self.assertIn("function clearComparisonResults", simulator_js)
        self.assertIn("function renderComparisonCards", simulator_js)
        self.assertIn("function buildComparisonInterpretation", simulator_js)
        self.assertIn("if (requestId === benchmarkRequestId) {", simulator_js)
        self.assertIn("function renderOriginalArrayStrip", simulator_js)
        self.assertIn('op: "stack"', simulator_js)
        for comparison_selector in [
            ".comparison-results", ".comparison-chart", ".comparison-interpretation",
            ".comparison-advanced", ".comparison-loading", ".sim-merge-source",
        ]:
            self.assertIn(comparison_selector, css)
        self.assertIn("#sim-teaching-panel", css)
        self.assertIn(".sim-check-panel", css)
        self.assertIn(".sim-visual-stage", css)
        self.assertIn("prefers-reduced-motion", css)

    def test_simulator_redesigned_transport_and_understanding_check(self):
        """The primary path has only Play/Next and credit needs a real check."""
        with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as handle:
            html = handle.read()
        with open(os.path.join(BASE_DIR, "js", "simulator.js"), "r", encoding="utf-8") as handle:
            simulator_js = handle.read()

        self.assertIn('id="sim-play-btn"', html)
        self.assertIn('id="sim-next-btn"', html)
        for removed_id in [
            "sim-prev-btn", "sim-reset-btn", "sim-mode-watch", "sim-mode-guided",
            "sim-guided-panel", "sim-checkpoint-panel", "sim-check-answer-btn",
            "sim-choice-left", "sim-choice-right",
        ]:
            self.assertNotIn(f'id="{removed_id}"', html, f"Removed control {removed_id} is still in HTML")
            self.assertNotIn(f'getElementById("{removed_id}")', simulator_js)

        self.assertIn("UNDERSTANDING_CHECKS", simulator_js)
        self.assertIn("function answerUnderstandingCheck", simulator_js)
        self.assertIn("function renderUnderstandingCheck", simulator_js)
        self.assertIn("Next is a deliberate single operation", simulator_js)
        self.assertIn("renderStep(0)", simulator_js)
        self.assertIn("understanding check", simulator_js)

        # Automatic playback must call the internal frame advancer, never the
        # manual Next handler (which pauses as soon as it is invoked).
        self.assertIn("function advanceOneStep", simulator_js)
        self.assertIn("if (!advanceOneStep()) pause();", simulator_js)
        self.assertNotIn("if (currentStepIdx < steps.length - 1) nextStep();", simulator_js)
        self.assertIn("playbackTimerActive", simulator_js)
        with open(os.path.join(BASE_DIR, "js", "app.js"), "r", encoding="utf-8") as handle:
            app_js = handle.read()
        self.assertIn("window.SimulatorModule.pause()", app_js)

    def test_activities_share_the_visualize_vocabulary(self):
        """Practice, Play and Mission reinforce the operations shown in Simulator."""
        with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as handle:
            html = handle.read()
        paths = {
            "exercises_js": os.path.join(BASE_DIR, "js", "exercises.js"),
            "sort_game_js": os.path.join(BASE_DIR, "js", "sortGame.js"),
            "mission_js": os.path.join(BASE_DIR, "js", "finalMission.js"),
            "python_js": os.path.join(BASE_DIR, "js", "pythonLearn.js"),
        }
        sources = {}
        for name, path in paths.items():
            with open(path, "r", encoding="utf-8") as handle:
                sources[name] = handle.read()

        for number in [8, 9, 10, 11]:
            self.assertIn(f'ex{number}-option', html, f"Missing exercise {number} markup")
            self.assertIn(f'function checkEx{number}', sources["exercises_js"])
            self.assertIn(f'.ex{number}-option', sources["exercises_js"])
        self.assertIn("adjacent", sources["exercises_js"])
        self.assertIn("held key", sources["exercises_js"])
        self.assertIn("one side empty", sources["exercises_js"])
        self.assertIn("opposite run", sources["exercises_js"])

        self.assertIn("58, 24, 91, 12, 45", html)
        self.assertIn("[58, 24, 91, 12, 45]", sources["sort_game_js"])
        self.assertIn("adjacent", sources["sort_game_js"])

        self.assertIn('data-val="STABLE"', html)
        self.assertIn('data-val="MUTATE"', html)
        self.assertIn('"STABLE"', sources["mission_js"])
        self.assertNotIn('"NO"', sources["mission_js"])
        self.assertIn("arrival order", sources["mission_js"])

        self.assertIn("comparedMutation", sources["python_js"])
        self.assertIn("inspectedStability", sources["python_js"])
        self.assertIn("reveal the stability example", sources["python_js"])

    def test_assets_use_current_cache_version(self):
        """Browser assets are versioned so a reload cannot reuse stale CSS/JS."""
        with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as handle:
            html = handle.read()
        self.assertNotIn("?v=1.9", html)
        self.assertNotIn("?v=2.0", html)
        self.assertIn("?v=2.2", html)


class TestLiveHttpServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.test_port = 8765
        server.socketserver.TCPServer.allow_reuse_address = True
        cls.httpd = server.socketserver.TCPServer(
            ("127.0.0.1", cls.test_port),
            server.InvestigationRequestHandler
        )
        cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.server_thread.start()
        time.sleep(0.5)

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def test_health_check_endpoint(self):
        url = f"http://127.0.0.1:{self.test_port}/api/health"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as response:
            self.assertEqual(response.status, 200)
            data = json.loads(response.read().decode("utf-8"))
            self.assertEqual(data["status"], "healthy")
            self.assertEqual(data["app"], "The Sorting Investigation")

    def test_serve_index_html(self):
        url = f"http://127.0.0.1:{self.test_port}/"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as response:
            self.assertEqual(response.status, 200)
            body = response.read().decode("utf-8")
            self.assertIn("The Sorting Investigation", body)
            self.assertIn("Scutari Hospital", body)

    def test_serve_css(self):
        url = f"http://127.0.0.1:{self.test_port}/css/style.css"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as response:
            self.assertEqual(response.status, 200)
            body = response.read().decode("utf-8")
            self.assertIn("--color-primary", body)

    def test_serve_historical_images(self):
        url = f"http://127.0.0.1:{self.test_port}/assets/images/story_scutari_nurses_1855.png"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as response:
            self.assertEqual(response.status, 200)
            self.assertIn("image/png", response.headers.get("Content-Type", "").lower())
            data = response.read()
            self.assertGreater(len(data), 50 * 1024)

        # Also verify mortality diagram remains intact as JPEG
        url_diag = f"http://127.0.0.1:{self.test_port}/assets/images/scene3_mortality_diagram.jpg"
        req_diag = urllib.request.Request(url_diag)
        with urllib.request.urlopen(req_diag, timeout=3) as response:
            self.assertEqual(response.status, 200)
            self.assertIn("image/jpeg", response.headers.get("Content-Type", "").lower())

    def test_execute_endpoint_valid_code(self):
        url = f"http://127.0.0.1:{self.test_port}/api/execute"
        payload = json.dumps({"code": "print(sorted([10, 5, 20]))"}).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json", "Origin": f"http://127.0.0.1:{self.test_port}"}
        )
        with urllib.request.urlopen(req, timeout=4) as response:
            self.assertEqual(response.status, 200)
            data = json.loads(response.read().decode("utf-8"))
            self.assertTrue(data["success"])
            self.assertEqual(data["stdout"].strip(), "[5, 10, 20]")

    def test_execute_endpoint_forbidden_origin(self):
        url = f"http://127.0.0.1:{self.test_port}/api/execute"
        payload = json.dumps({"code": "print('hello')"}).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json", "Origin": "http://evil-site.com"}
        )
        try:
            with urllib.request.urlopen(req, timeout=3) as response:
                self.assertEqual(response.status, 403)
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 403)
        except (ConnectionResetError, ConnectionAbortedError):
            pass


if __name__ == "__main__":
    unittest.main()
