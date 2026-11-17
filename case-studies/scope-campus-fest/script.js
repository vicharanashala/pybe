// Interactive Train Python Scope Presentation Logic

document.addEventListener("DOMContentLoaded", () => {
    // --- Slide Navigation System ---
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const trackFill = document.getElementById("track-fill");
    const trainCursor = document.getElementById("train-cursor");
    const slideIndicator = document.getElementById("slide-indicator");

    let currentSlideIndex = 0;

    function updateSlide() {
        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });

        // Update nav buttons
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === slides.length - 1;

        // Update progress bar
        const totalSlides = slides.length;
        const progressPercent = (currentSlideIndex / (totalSlides - 1)) * 100;
        trackFill.style.width = `${progressPercent}%`;
        trainCursor.style.left = `${progressPercent}%`;

        // Update slide count text
        const displayIndex = String(currentSlideIndex + 1).padStart(2, '0');
        const displayTotal = String(totalSlides).padStart(2, '0');
        slideIndicator.textContent = `${displayIndex} / ${displayTotal}`;
    }

    prevBtn.addEventListener("click", () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlide();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            updateSlide();
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === " ") {
            // Prevent space bar page scroll
            if (e.key === " ") e.preventDefault();
            if (currentSlideIndex < slides.length - 1) {
                currentSlideIndex++;
                updateSlide();
            }
        } else if (e.key === "ArrowLeft") {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSlide();
            }
        }
    });

    // --- Slide 01: The Journey Begins ---
    const enterTrainBtn = document.getElementById("enter-train-btn");
    enterTrainBtn.addEventListener("click", () => {
        currentSlideIndex = 1; // Move to Slide 02
        updateSlide();
    });

    // Coach highlight transitions
    const coachBtns = document.querySelectorAll(".coach-btn");
    coachBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            coachBtns.forEach(b => b.classList.remove("active-coach"));
            e.target.classList.add("active-coach");
            
            // Auto transition to slide 2 if coach B2 selected
            if (e.target.dataset.coach === "B2") {
                setTimeout(() => {
                    currentSlideIndex = 1;
                    updateSlide();
                }, 400);
            }
        });
    });

    // --- Slide 02: Your Ticket Zoom ---
    const ticketFields = document.querySelectorAll(".clickable-field");
    const zoomPreview = document.getElementById("zoom-preview");

    ticketFields.forEach(field => {
        field.addEventListener("click", () => {
            const zoomType = field.dataset.zoom;
            let previewText = "";
            let highlightClass = "";

            if (zoomType === "train") {
                previewText = `<strong>🚆 Train Level (Global Scope)</strong><br>
                               The train identity <strong>12760</strong> encompasses everything. Any passenger in any coach can view the train route and number. It exists globally.`;
                highlightClass = "var(--color-train)";
            } else if (zoomType === "coach") {
                previewText = `<strong>🚃 Coach Level (Enclosing Scope)</strong><br>
                               The coach code <strong>B2</strong> is a container enclosing all its local berths. It is only accessible to those inside coach B2.`;
                highlightClass = "var(--color-coach)";
            } else if (zoomType === "seat") {
                previewText = `<strong>👤 Seat Level (Local Scope)</strong><br>
                               Seat <strong>36</strong> is specific to Seeta. It represents the local scope – information that belongs directly to this individual compartment.`;
                highlightClass = "var(--color-passenger)";
            }

            zoomPreview.innerHTML = `<p class="preview-text" style="border-left: 4px solid ${highlightClass}; padding-left: 10px;">${previewText}</p>`;
        });
    });

    // --- Slide 03: Welcome to Coach B2 ---
    const berths = document.querySelectorAll(".seat-berth");
    berths.forEach(berth => {
        berth.addEventListener("click", () => {
            const seatNo = berth.dataset.seat;
            if (seatNo === "36") {
                currentSlideIndex = 3; // Move to passenger details
                updateSlide();
            } else {
                alert(`You are currently examining Berth ${seatNo}. Try clicking the highlighted Seat 36 to visit Passenger Seeta.`);
            }
        });
    });

    // --- Slide 04: Meet Passenger 36 ---
    const avatarBox = document.getElementById("passenger-avatar-box");
    const detailsCard = document.getElementById("passenger-details-card");
    avatarBox.addEventListener("click", () => {
        detailsCard.classList.add("show");
    });

    // --- Slide 05: Who Knows What? (Pathways) ---
    const questionBtns = document.querySelectorAll(".question-btn");
    const pathLevels = {
        passenger: document.getElementById("path-level-passenger"),
        coach: document.getElementById("path-level-coach"),
        train: document.getElementById("path-level-train")
    };
    const answerBox = document.getElementById("test-answer-box");

    questionBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Reset active states
            questionBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Reset path highlights
            Object.values(pathLevels).forEach(level => {
                level.classList.remove("highlight-search", "highlight-match");
            });

            const query = btn.dataset.question;

            if (query === "seat") {
                pathLevels.passenger.classList.add("highlight-match");
                answerBox.innerHTML = `<strong>"My seat is 36."</strong><br><span style="color: var(--color-passenger)">Resolved locally!</span> Seeta knows her seat number directly without checking outside.`;
            } else if (query === "coach") {
                pathLevels.passenger.classList.add("highlight-search");
                setTimeout(() => {
                    pathLevels.coach.classList.add("highlight-match");
                    answerBox.innerHTML = `<strong>"My coach is B2."</strong><br>Seeta doesn't store 'coach number' as her seat identity, so she looks outward to the <span style="color: var(--color-coach)">Coach level (Enclosing)</span>.`;
                }, 300);
            } else if (query === "train") {
                pathLevels.passenger.classList.add("highlight-search");
                setTimeout(() => {
                    pathLevels.coach.classList.add("highlight-search");
                    setTimeout(() => {
                        pathLevels.train.classList.add("highlight-match");
                        answerBox.innerHTML = `<strong>"The train number is 12760."</strong><br>Seeta looks in seat (no), checks coach (no), and finally searches further outward at the <span style="color: var(--color-train)">Train level (Global)</span> to find it.`;
                    }, 300);
                }, 300);
            }
        });
    });

    // --- Slide 06: Searchlight Animation ---
    const triggerSearchlight = document.getElementById("trigger-searchlight-btn");
    const sbPassenger = document.getElementById("sb-passenger");
    const sbCoach = document.getElementById("sb-coach");
    const sbTrain = document.getElementById("sb-train");
    const statusPassenger = document.getElementById("status-passenger");
    const statusCoach = document.getElementById("status-coach");
    const statusTrain = document.getElementById("status-train");
    const beam = document.getElementById("searchlight-beam");

    triggerSearchlight.addEventListener("click", () => {
        // Reset blocks
        sbPassenger.style.borderColor = "var(--border-color)";
        sbCoach.style.borderColor = "var(--border-color)";
        sbTrain.style.borderColor = "var(--border-color)";
        statusPassenger.textContent = "Checking...";
        statusCoach.textContent = "Checking...";
        statusTrain.textContent = "Checking...";
        beam.style.opacity = "1";

        // Step 1: Check Passenger
        beam.style.background = "radial-gradient(circle at 50% 80%, rgba(255, 191, 0, 0.25) 0%, transparent 60%)";
        sbPassenger.style.borderColor = "var(--error)";
        statusPassenger.textContent = "❌ Not found in my seat";

        // Step 2: Check Coach
        setTimeout(() => {
            beam.style.background = "radial-gradient(circle at 50% 50%, rgba(255, 191, 0, 0.25) 0%, transparent 60%)";
            sbCoach.style.borderColor = "var(--error)";
            statusCoach.textContent = "❌ Not found in my Coach";

            // Step 3: Check Train
            setTimeout(() => {
                beam.style.background = "radial-gradient(circle at 50% 20%, rgba(255, 191, 0, 0.25) 0%, transparent 60%)";
                sbTrain.style.borderColor = "var(--success)";
                statusTrain.textContent = "✅ FOUND: Train 12760!";
            }, 800);
        }, 800);
    });

    // --- Slide 07: Compartment Partition & Rejection Drag-and-Drop ---
    const seetaSeatToken = document.getElementById("seeta-seat-token");
    const ramanCard = document.getElementById("raman-card");
    const compartmentFeedback = document.getElementById("compartment-feedback");

    seetaSeatToken.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
        e.target.style.opacity = "0.5";
    });

    seetaSeatToken.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    ramanCard.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    ramanCard.addEventListener("drop", (e) => {
        e.preventDefault();
        // Shake animation for rejection
        ramanCard.classList.add("shake-animation");
        ramanCard.style.borderColor = "var(--error)";
        compartmentFeedback.innerHTML = `<span style="color: var(--error)">🚫 Rejection: That's not your information!</span><br>Seeta cannot modify Raman's seat number directly. Each passenger has their own private space.`;
        
        setTimeout(() => {
            ramanCard.classList.remove("shake-animation");
            ramanCard.style.borderColor = "var(--border-color)";
        }, 1000);
    });

    // --- Slide 08: Zooming Out Stack Accordion ---
    const stackItems = document.querySelectorAll(".zoom-stack-item");
    stackItems.forEach(item => {
        item.addEventListener("click", () => {
            const isExpanded = item.classList.contains("expanded");
            // Collapse all
            stackItems.forEach(i => i.classList.remove("expanded"));
            // Expand clicked if not previously expanded
            if (!isExpanded) {
                item.classList.add("expanded");
            }
        });
    });

    // --- Slide 09: Information Challenge Drag and Drop Game ---
    const challengeCards = document.querySelectorAll(".challenge-card");
    const dropZones = document.querySelectorAll(".drop-target-zone");
    const gameFeedback = document.getElementById("game-feedback");

    challengeCards.forEach(card => {
        card.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.id);
            e.target.style.opacity = "0.6";
        });

        card.addEventListener("dragend", (e) => {
            e.target.style.opacity = "1";
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.classList.add("dragover");
        });

        zone.addEventListener("dragleave", () => {
            zone.classList.remove("dragover");
        });

        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove("dragover");
            const cardId = e.dataTransfer.getData("text/plain");
            const cardElement = document.getElementById(cardId);
            const targetZoneId = cardElement.dataset.target;

            if (zone.id === targetZoneId) {
                // Correct drop
                zone.querySelector(".zone-contents").appendChild(cardElement);
                cardElement.style.cursor = "default";
                cardElement.draggable = false;
                cardElement.style.border = "1px solid var(--success)";
                cardElement.style.background = "hsla(142, 70%, 45%, 0.15)";
                checkGameCompletion();
            } else {
                // Incorrect drop
                zone.classList.add("shake-animation");
                gameFeedback.innerHTML = `<span style="color: var(--error)">❌ Incorrect placement!</span> Try moving one level closer to where this info belongs.`;
                setTimeout(() => {
                    zone.classList.remove("shake-animation");
                }, 500);
            }
        });
    });

    function checkGameCompletion() {
        const remainingCards = document.getElementById("challenge-cards-source").children.length;
        if (remainingCards === 0) {
            gameFeedback.innerHTML = `<span style="color: var(--success)">🎉 Awesome! All matched correctly!</span> We have successfully created a clean hierarchy of information.`;
        } else {
            gameFeedback.innerHTML = `<span style="color: var(--success)">✅ Nice match!</span> Keep placing the other cards.`;
        }
    }

    // --- Slide 11: Code Morphing Animation ---
    const morphBtn = document.getElementById("morph-btn");
    const codeContainer = document.getElementById("morphing-code");

    const pythonCodeTemplate = `<span class="comment"># Global Scope (The Train)</span>
<span class="keyword">train_number</span> = <span class="number">12760</span>

<span class="keyword">def</span> <span class="defname">coach</span>():
    <span class="comment"># Enclosing Scope (The Coach)</span>
    <span class="keyword">coach_number</span> = <span class="string">"B2"</span>

    <span class="keyword">def</span> <span class="defname">passenger</span>():
        <span class="comment"># Local Scope (The Passenger)</span>
        <span class="keyword">seat_number</span> = <span class="number">36</span>
        
        <span class="comment"># Accessible scopes inside</span>
        print(seat_number)   <span class="comment"># Local</span>
        print(coach_number)  <span class="comment"># Enclosing</span>
        print(train_number)  <span class="comment"># Global</span>

    passenger()

coach()`;

    morphBtn.addEventListener("click", () => {
        // Animate morph
        const railwaySide = document.getElementById("morph-railway-side");
        railwaySide.style.transform = "scale(0.9) rotate(-3deg)";
        railwaySide.style.opacity = "0.5";

        setTimeout(() => {
            codeContainer.innerHTML = pythonCodeTemplate;
            const codeSide = document.getElementById("morph-code-side");
            codeSide.style.borderColor = "var(--success)";
            codeSide.style.boxShadow = "0 0 15px rgba(34, 197, 94, 0.2)";
        }, 300);
    });

    // --- Slide 13: LEGB Interactive Lookup ---
    const legbBtns = document.querySelectorAll(".legb-btn");
    const legbSteps = {
        L: document.getElementById("step-l"),
        E: document.getElementById("step-e"),
        G: document.getElementById("step-g"),
        B: document.getElementById("step-b")
    };
    const legbStatus = document.getElementById("legb-status");

    legbBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            legbBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");

            // Reset ladder steps
            Object.values(legbSteps).forEach(step => {
                step.classList.remove("active-search", "resolved-match");
            });

            const searchVar = btn.dataset.search;

            if (searchVar === "seat_number") {
                // Steps through L only
                legbSteps.L.classList.add("resolved-match");
                legbStatus.innerHTML = `Searching for <code>seat_number</code>... found in <strong style="color: var(--color-passenger)">Local Scope (L)</strong>!`;
            } else if (searchVar === "coach_number") {
                // Steps through L -> E
                legbSteps.L.classList.add("active-search");
                legbStatus.textContent = "Checking Local... (not found)";
                setTimeout(() => {
                    legbSteps.L.classList.remove("active-search");
                    legbSteps.E.classList.add("resolved-match");
                    legbStatus.innerHTML = `Not in Local. Checking <strong style="color: var(--color-coach)">Enclosing Scope (E)</strong>... found!`;
                }, 500);
            } else if (searchVar === "train_number") {
                // Steps L -> E -> G
                legbSteps.L.classList.add("active-search");
                legbStatus.textContent = "Checking Local... (not found)";
                setTimeout(() => {
                    legbSteps.L.classList.remove("active-search");
                    legbSteps.E.classList.add("active-search");
                    legbStatus.textContent = "Checking Enclosing... (not found)";
                    setTimeout(() => {
                        legbSteps.E.classList.remove("active-search");
                        legbSteps.G.classList.add("resolved-match");
                        legbStatus.innerHTML = `Not in Local or Enclosing. Checking <strong style="color: var(--color-train)">Global Scope (G)</strong>... found!`;
                    }, 500);
                }, 500);
            } else if (searchVar === "len") {
                // Steps L -> E -> G -> B
                legbSteps.L.classList.add("active-search");
                legbStatus.textContent = "Checking Local... (not found)";
                setTimeout(() => {
                    legbSteps.L.classList.remove("active-search");
                    legbSteps.E.classList.add("active-search");
                    legbStatus.textContent = "Checking Enclosing... (not found)";
                    setTimeout(() => {
                        legbSteps.E.classList.remove("active-search");
                        legbSteps.G.classList.add("active-search");
                        legbStatus.textContent = "Checking Global... (not found)";
                        setTimeout(() => {
                            legbSteps.G.classList.remove("active-search");
                            legbSteps.B.classList.add("resolved-match");
                            legbStatus.innerHTML = `Not in Local, Enclosing, or Global. Checking <strong style="color: var(--color-railway)">Built-in Scope (B)</strong>... resolved to Python standard function <code>len()</code>!`;
                        }, 500);
                    }, 500);
                }, 500);
            }
        });
    });

    // --- Slide 14: Recap Quiz & Restart ---
    const optionBtns = document.querySelectorAll(".recap-opt-btn");
    const recapFeedback = document.getElementById("recap-feedback");
    const restartBtn = document.getElementById("restart-journey-btn");

    optionBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const isCorrect = btn.dataset.correct === "true";
            optionBtns.forEach(b => {
                b.classList.remove("correct", "incorrect");
                b.disabled = true;
            });

            if (isCorrect) {
                btn.classList.add("correct");
                recapFeedback.innerHTML = `<span style="color: var(--success)">🎉 Correct!</span> Python always checks the Local Scope first (just like the passenger checks their own seat first).`;
            } else {
                btn.classList.add("incorrect");
                recapFeedback.innerHTML = `<span style="color: var(--error)">❌ Try again.</span> Think about the closest place Python searches first.`;
            }
        });
    });

    restartBtn.addEventListener("click", () => {
        // Reset quiz
        optionBtns.forEach(btn => {
            btn.classList.remove("correct", "incorrect");
            btn.disabled = false;
        });
        recapFeedback.textContent = "";

        // Reset slide index
        currentSlideIndex = 0;
        updateSlide();

        // Reset slide 9 challenge game
        const sourceContainer = document.getElementById("challenge-cards-source");
        const cardsToReset = document.querySelectorAll(".challenge-card");
        cardsToReset.forEach(card => {
            sourceContainer.appendChild(card);
            card.draggable = true;
            card.style.border = "";
            card.style.background = "";
            card.style.cursor = "";
        });
        gameFeedback.textContent = "Drag the cards into their respective zones to match the hierarchy.";

        // Reset slide 11 code morph
        const railwaySide = document.getElementById("morph-railway-side");
        railwaySide.style.transform = "";
        railwaySide.style.opacity = "";
        codeContainer.innerHTML = "# Click Morph to generate Python structure...";
        const codeSide = document.getElementById("morph-code-side");
        codeSide.style.borderColor = "";
        codeSide.style.boxShadow = "";

        // Reset slide 13 LEGB buttons and ladder
        legbBtns.forEach(b => b.classList.remove("selected"));
        Object.values(legbSteps).forEach(step => {
            step.classList.remove("active-search", "resolved-match");
        });
        legbStatus.textContent = "Click a variable button to start searching.";

        // Reset Slide 5 Question visualizer
        questionBtns.forEach(b => b.classList.remove("active"));
        Object.values(pathLevels).forEach(level => {
            level.classList.remove("highlight-search", "highlight-match");
        });
        answerBox.textContent = "Choose a question to see the search path.";

        // Reset Slide 4 details card
        detailsCard.classList.remove("show");
    });

    // Initialize slide on page load
    updateSlide();
});
