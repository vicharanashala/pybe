/* =========================
   EXPLORER ELEMENTS
========================= */

const keywordContainer =
    document.getElementById("keywordContainer");

const searchInput =
    document.getElementById("search");

const categorySelect =
    document.getElementById("category");

const keywordCount =
    document.getElementById("keywordCount");



/* =========================
   TABS
========================= */

const explorerTab =
    document.getElementById("explorerTab");

const quizTab =
    document.getElementById("quizTab");

const explorerSection =
    document.getElementById("explorerSection");

const quizSection =
    document.getElementById("quizSection");



explorerTab.addEventListener(
    "click",
    () => {

        explorerSection
            .classList
            .remove("hidden");

        quizSection
            .classList
            .add("hidden");

        explorerTab
            .classList
            .add("active");

        quizTab
            .classList
            .remove("active");

    }
);



quizTab.addEventListener(
    "click",
    () => {

        explorerSection
            .classList
            .add("hidden");

        quizSection
            .classList
            .remove("hidden");

        explorerTab
            .classList
            .remove("active");

        quizTab
            .classList
            .add("active");

    }
);



/* =========================
   DISPLAY KEYWORDS
========================= */

function displayKeywords(list) {

    keywordContainer.innerHTML = "";


    keywordCount.textContent =
        `${list.length} keyword${
            list.length !== 1
                ? "s"
                : ""
        } found`;


    if (list.length === 0) {

        keywordContainer.innerHTML = `

            <div class="card">

                <h2>
                    No keyword found 🔎
                </h2>

                <p>
                    Try searching for another
                    Python keyword.
                </p>

            </div>

        `;

        return;
    }



    list.forEach((item) => {

        const card =
            document.createElement("div");


        card.className = "card";


        card.innerHTML = `

            <h2>
                ${item.keyword}
            </h2>


            <span class="category">
                ${item.category}
            </span>


            <p>
                ${item.description}
            </p>


            <div class="section-title">
                Syntax
            </div>

            <pre>${item.syntax}</pre>


            <div class="section-title">
                Example
            </div>

            <pre>${item.example}</pre>


            <div class="section-title">
                Output
            </div>

            <pre>${item.output}</pre>

        `;


        keywordContainer
            .appendChild(card);

    });

}



/* =========================
   INITIAL DISPLAY
========================= */

displayKeywords(keywords);



/* =========================
   SEARCH + FILTER
========================= */

function filterKeywords() {

    const searchText =
        searchInput
            .value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categorySelect.value;


    const filtered =
        keywords.filter(
            (item) => {

                const matchesSearch =

                    item.keyword
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    item.description
                        .toLowerCase()
                        .includes(searchText);


                const matchesCategory =

                    selectedCategory === "All"

                    ||

                    item.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    displayKeywords(filtered);

}



searchInput.addEventListener(
    "input",
    filterKeywords
);


categorySelect.addEventListener(
    "change",
    filterKeywords
);



/* =========================
   QUIZ ELEMENTS
========================= */

const startQuizButton =
    document.getElementById("startQuiz");

const restartQuizButton =
    document.getElementById("restartQuiz");

const nextQuestionButton =
    document.getElementById("nextQuestion");


const quizStart =
    document.getElementById("quizStart");

const quizContent =
    document.getElementById("quizContent");

const quizResult =
    document.getElementById("quizResult");


const questionElement =
    document.getElementById("question");

const optionsElement =
    document.getElementById("options");


const questionNumberElement =
    document.getElementById("questionNumber");

const scoreElement =
    document.getElementById("score");


const progressBar =
    document.getElementById("progressBar");

const answerMessage =
    document.getElementById("answerMessage");


const finalScore =
    document.getElementById("finalScore");

const resultMessage =
    document.getElementById("resultMessage");



/* =========================
   QUIZ VARIABLES
========================= */

let currentQuestion = 0;

let userScore = 0;

let quizList = [];



/* =========================
   SHUFFLE
========================= */

function shuffleArray(array) {

    const shuffled =
        [...array];


    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];

    }


    return shuffled;

}



/* =========================
   START QUIZ
========================= */

startQuizButton.addEventListener(
    "click",
    startQuiz
);


restartQuizButton.addEventListener(
    "click",
    startQuiz
);



function startQuiz() {

    currentQuestion = 0;

    userScore = 0;


    /*
       Randomly select 5 questions.
    */

    quizList =
        shuffleArray(
            quizQuestions
        ).slice(0, 5);


    quizStart
        .classList
        .add("hidden");


    quizResult
        .classList
        .add("hidden");


    quizContent
        .classList
        .remove("hidden");


    showQuestion();

}



/* =========================
   SHOW QUESTION
========================= */

function showQuestion() {

    const current =
        quizList[currentQuestion];


    questionNumberElement.textContent =
        `Question ${
            currentQuestion + 1
        }/${quizList.length}`;


    scoreElement.textContent =
        `Score: ${userScore}`;


    questionElement.textContent =
        current.question;


    optionsElement.innerHTML = "";


    answerMessage.textContent = "";


    nextQuestionButton
        .classList
        .add("hidden");


    progressBar.style.width =
        `${
            (
                (currentQuestion + 1)
                / quizList.length
            ) * 100
        }%`;



    const options =
        shuffleArray(
            current.options
        );


    options.forEach(
        (option) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "option";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                () => {

                    checkAnswer(
                        button,
                        option,
                        current.answer
                    );

                }
            );


            optionsElement
                .appendChild(button);

        }
    );

}



/* =========================
   CHECK ANSWER
========================= */

function checkAnswer(
    selectedButton,
    selectedAnswer,
    correctAnswer
) {

    const allOptions =
        document.querySelectorAll(
            ".option"
        );


    /*
       Disable all answers
       after one selection.
    */

    allOptions.forEach(
        (button) => {

            button.classList
                .add("disabled");

        }
    );



    if (
        selectedAnswer ===
        correctAnswer
    ) {

        selectedButton
            .classList
            .add("correct");


        userScore++;


        answerMessage.textContent =
            "✅ Correct! Great job!";


        answerMessage.style.color =
            "#28a745";

    }

    else {

        selectedButton
            .classList
            .add("wrong");


        allOptions.forEach(
            (button) => {

                if (
                    button.textContent ===
                    correctAnswer
                ) {

                    button.classList
                        .add("correct");

                }

            }
        );


        answerMessage.textContent =
            `❌ Incorrect. The correct answer is "${correctAnswer}".`;


        answerMessage.style.color =
            "#dc3545";

    }


    scoreElement.textContent =
        `Score: ${userScore}`;


    nextQuestionButton
        .classList
        .remove("hidden");

}



/* =========================
   NEXT QUESTION
========================= */

nextQuestionButton.addEventListener(
    "click",
    () => {

        currentQuestion++;


        if (
            currentQuestion <
            quizList.length
        ) {

            showQuestion();

        }

        else {

            showResult();

        }

    }
);



/* =========================
   SHOW RESULT
========================= */

function showResult() {

    quizContent
        .classList
        .add("hidden");


    quizResult
        .classList
        .remove("hidden");


    finalScore.textContent =
        `You scored ${userScore} out of ${quizList.length}.`;


    if (userScore === 5) {

        resultMessage.textContent =
            "🏆 Perfect score! You are a Python Keyword Master!";

    }

    else if (userScore >= 4) {

        resultMessage.textContent =
            "🌟 Excellent! You have a strong understanding of Python keywords.";

    }

    else if (userScore >= 3) {

        resultMessage.textContent =
            "👍 Good job! Keep practicing to improve.";

    }

    else {

        resultMessage.textContent =
            "📚 Keep learning! Explore the keywords and try again.";

    }

}
