(function () {
            "use strict";

            const EMOJI = {
                "Human": "🧑", "Alien": "👽", "Translator": "🔄",
                "Human's language": "🧑💬", "Alien's language": "👽💬", "Alien understands": "👽✅",
                "Programmer": "🧑\u200d💻", "Python Code": "🐍", "Translation": "🔁", "Computer": "💻",
                "Complete Message": "📜", "Translated Message": "📬",
                "Program": "📝", "Compiler": "🔄", "Translated Form": "📦", "Run": "▶️",
                "Instruction": "1️⃣", "Interpreter": "🔄", "Handled Step-by-Step": "⚡"
            };
            const COLOR = {
                "Human": "green", "Human's language": "green", "Programmer": "green", "Python Code": "green",
                "Complete Message": "green", "Program": "green", "Instruction": "green",
                "Alien": "violet", "Alien's language": "violet", "Alien understands": "violet", "Computer": "violet",
                "Translated Message": "violet", "Translated Form": "violet", "Run": "violet", "Handled Step-by-Step": "violet",
                "Translator": "gold", "Translation": "gold", "Compiler": "gold", "Interpreter": "gold"
            };
            function chipClass(l) { return "chip chip--" + (COLOR[l] || "muted"); }
            function chipHTML(l) { return (EMOJI[l] ? EMOJI[l] + " " : "") + l; }

            function shuffle(arr) {
                const a = arr.slice();
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }

            function renderDiagram(id, labels) {
                const el = document.getElementById(id);
                if (!el) return;
                el.innerHTML = labels.map((l, i) => {
                    const chip = `<span class="${chipClass(l)}">${chipHTML(l)}</span>`;
                    return i < labels.length - 1 ? chip + '<span class="arrow">➡</span>' : chip;
                }).join("");
            }

            const pageEls = [...document.querySelectorAll(".page")];
            const PAGES = pageEls.map(p => p.id);
            const gateOpen = {};
            pageEls.forEach(p => { gateOpen[p.id] = p.dataset.gated !== "true"; });

            let current = 0;

            function openGate(id) {
                gateOpen[id] = true;
                if (PAGES[current] === id) updateNav();
            }

            function showPage(i) {
                pageEls.forEach((p, idx) => p.classList.toggle("page--active", idx === i));
                current = i;
                window.scrollTo({ top: 0, behavior: "auto" });
                updateNav();
            }

            function updateNav() {
                document.getElementById("navBack").disabled = current === 0;
                document.getElementById("navNext").disabled = !gateOpen[PAGES[current]];
                document.getElementById("navCount").textContent = (current + 1) + " / " + PAGES.length;
                document.getElementById("navProgressFill").style.width = (((current + 1) / PAGES.length) * 100) + "%";
            }

            document.getElementById("navNext").addEventListener("click", () => {
                if (current < PAGES.length - 1 && gateOpen[PAGES[current]]) showPage(current + 1);
            });
            document.getElementById("navBack").addEventListener("click", () => {
                if (current > 0) showPage(current - 1);
            });
            document.getElementById("btnStart").addEventListener("click", () => showPage(1));
            document.getElementById("btnRestart").addEventListener("click", () => location.reload());

            function initQuestion(cfg) {
                const root = document.getElementById(cfg.id);
                const optsEl = root.querySelector(".q-options");
                const feedbackEl = root.querySelector(".q-feedback");
                let answered = false;

                cfg.options.forEach((opt, i) => {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "q-opt";
                    btn.textContent = opt;
                    btn.addEventListener("click", () => {
                        if (answered) return;
                        if (i === cfg.correctIndex) {
                            answered = true;
                            btn.classList.add("correct");
                            [...optsEl.children].forEach(b => { if (b !== btn) b.disabled = true; });
                            feedbackEl.textContent = cfg.feedback;
                            feedbackEl.className = "q-feedback good";
                            openGate(cfg.id);
                        } else {
                            btn.classList.add("wrong");
                            btn.disabled = true;
                            feedbackEl.textContent = cfg.wrongHint || "Oops! Try again! 😊";
                            feedbackEl.className = "q-feedback bad";
                        }
                    });
                    optsEl.appendChild(btn);
                });
            }

            function initPuzzle(cfg) {
                const root = document.getElementById(cfg.id);
                const trayEl = root.querySelector(".tray");
                const slotsEl = root.querySelector(".slots");
                const feedbackEl = root.querySelector(".puzzle-feedback");

                let shuffled = shuffle(cfg.blocks);
                if (shuffled.join("|") === cfg.correct.join("|")) shuffled.reverse();

                slotsEl.innerHTML = "";
                cfg.correct.forEach((_, i) => {
                    const slot = document.createElement("div");
                    slot.className = "slot";
                    slot.dataset.index = i;
                    slot.dataset.filled = "false";
                    slot.innerHTML = `<span class="slot-num">${i + 1}</span>`;
                    slot.addEventListener("click", () => {
                        if (slot.dataset.filled === "true") returnToTray(slot);
                    });
                    slotsEl.appendChild(slot);
                });

                trayEl.innerHTML = "";
                shuffled.forEach(label => {
                    const tile = document.createElement("button");
                    tile.type = "button";
                    tile.className = chipClass(label) + " tile";
                    tile.textContent = chipHTML(label);
                    tile.dataset.value = label;
                    tile.addEventListener("click", () => placeInSlot(tile));
                    trayEl.appendChild(tile);
                });

                function placeInSlot(tile) {
                    const emptySlot = [...slotsEl.children].find(s => s.dataset.filled !== "true");
                    if (!emptySlot) return;
                    emptySlot.dataset.filled = "true";
                    emptySlot.dataset.value = tile.dataset.value;
                    emptySlot.innerHTML = `<span class="slot-num">${+emptySlot.dataset.index + 1}</span><span class="slot-tile ${chipClass(tile.dataset.value)}">${chipHTML(tile.dataset.value)}</span>`;
                    tile.classList.add("used");
                    tile.disabled = true;
                    slotsEl.classList.remove("shake", "success");
                    feedbackEl.textContent = "";
                    checkComplete();
                }

                function returnToTray(slot) {
                    const val = slot.dataset.value;
                    slot.dataset.filled = "false";
                    slot.removeAttribute("data-value");
                    slot.innerHTML = `<span class="slot-num">${+slot.dataset.index + 1}</span>`;
                    const tile = [...trayEl.children].find(t => t.dataset.value === val && t.disabled);
                    if (tile) { tile.disabled = false; tile.classList.remove("used"); }
                    slotsEl.classList.remove("shake", "success");
                    feedbackEl.textContent = "";
                }

                function checkComplete() {
                    const slots = [...slotsEl.children];
                    if (slots.some(s => s.dataset.filled !== "true")) return;
                    const order = slots.map(s => s.dataset.value);
                    const ok = order.every((v, i) => v === cfg.correct[i]);
                    if (ok) {
                        slotsEl.classList.add("success");
                        feedbackEl.textContent = cfg.explanation;
                        feedbackEl.className = "puzzle-feedback good";
                        openGate(cfg.id);
                    } else {
                        slotsEl.classList.add("shake");
                        feedbackEl.textContent = "Not quite! Tap a block to move it and try again. 😊";
                        feedbackEl.className = "puzzle-feedback bad";
                        setTimeout(() => slotsEl.classList.remove("shake"), 400);
                    }
                }
            }

            document.addEventListener("DOMContentLoaded", () => {

                /* ---- Chapter 1: Translation ---- */

                initQuestion({
                    id: "pg-q1",
                    options: ["😴 They are too far apart", "🗣️ They speak different languages", "🔉 The Human is too quiet", "😠 The Alien doesn't want to talk"],
                    correctIndex: 1,
                    feedback: "Exactly! Both of them want to communicate, but they don't understand the language the other one is using.",
                    wrongHint: "Hmm, look again — they're right next to each other, and both are really trying. Try again!"
                });

                initQuestion({
                    id: "pg-q2",
                    options: ["📢 Shout louder", "🔄 A translator", "🍕 More food", "😴 Take a nap"],
                    correctIndex: 1,
                    feedback: "Yes! A translator knows both languages and helps them talk.",
                    wrongHint: "Would that really fix a language problem? Think about it and try again!"
                });

                initPuzzle({
                    id: "pg-puzzle1",
                    blocks: ["Alien", "Human", "Translator"],
                    correct: ["Human", "Translator", "Alien"],
                    explanation: "The translator converts the Human's message into a language the Alien understands! 🎉"
                });

                initQuestion({
                    id: "pg-q3",
                    options: ["✏️ Changing what the Human wants to say", "📢 Making the Human speak louder", "🔄 Converting the message into another language", "😵 Giving the Alien a completely different message"],
                    correctIndex: 2,
                    feedback: "Exactly! The meaning stays the same. Only the language changes.",
                    wrongHint: "Think about it — does the meaning change, or just the words? Try again!"
                });

                initPuzzle({
                    id: "pg-puzzle2",
                    blocks: ["Alien's language", "Human's language", "Translator", "Human", "Alien"],
                    correct: ["Human", "Human's language", "Translator", "Alien's language", "Alien"],
                    explanation: "The message starts with the Human, passes through the Translator, and reaches the Alien in a language it understands! 🎉"
                });

                /* ---- Way 1 & 2: Compiler / Interpreter ---- */

                renderDiagram("diagramCompiler", ["Programmer", "Program", "Compiler", "Translated Form", "Run"]);
                renderDiagram("diagramInterpreter", ["Programmer", "Program", "Interpreter", "Handled Step-by-Step"]);

                updateNav();
            });
        })();