import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/lesson.css";

export default function Activity() {

  const navigate = useNavigate();

  const [q1Answer, setQ1Answer] = useState("");
  const [q2Answer, setQ2Answer] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="lesson-page">

      <div className="lesson-card">

        <h1>Oracle's Challenge</h1>

        <p>
          Before becoming the Guardian of the Oracle,
          prove that you understand how exceptions work.
        </p>

        <hr />

        <h2>Scenario 1</h2>

        <p>The user enters:</p>

        <div className="code">
25
        </div>

        <button
          className="option"
          onClick={() => setQ1Answer("crash")}
        >
          The program crashes.
        </button>

        {q1Answer === "crash" && (
          <p className="wrong">
            ❌ Not quite! A valid number will not crash the program.
          </p>
        )}

        <button
          className="option"
          onClick={() => setQ1Answer("correct")}
        >
          The age is printed successfully.
        </button>

        {q1Answer === "correct" && (
          <p className="highlight">
            ✅ Correct! Since the input is a valid number,
            the <strong>try</strong> block executes normally.
          </p>
        )}

        <button
          className="option"
          onClick={() => setQ1Answer("error")}
        >
          The error message is displayed.
        </button>

        {q1Answer === "error" && (
          <p className="wrong">
            ❌ Not quite! No exception occurs because the input is valid.
          </p>
        )}

        <hr />

        <h2>Scenario 2</h2>

        <p>The user enters:</p>

        <div className="code">
hello
        </div>

        <button
          className="option"
          onClick={() => setQ2Answer("age")}
        >
          The age is printed.
        </button>

        {q2Answer === "age" && (
          <p className="wrong">
            ❌ Incorrect. Python cannot convert "hello" into an integer.
          </p>
        )}

        <button
          className="option"
          onClick={() => setQ2Answer("correct")}
        >
          The except block prints an error message.
        </button>

        {q2Answer === "correct" && (
          <p className="highlight">
            ✅ Correct! Python raises a ValueError and the
            <strong> except </strong>
            block handles it gracefully.
          </p>
        )}

        <button
          className="option"
          onClick={() => setQ2Answer("nothing")}
        >
          Nothing happens.
        </button>

        {q2Answer === "nothing" && (
          <p className="wrong">
            ❌ Incorrect. An exception is raised, so something definitely happens.
          </p>
        )}

        {q1Answer === "correct" && q2Answer === "correct" && (

          <div className="lesson-box">

            <h2>Congratulations!</h2>

            <p>
              You have successfully completed all the Oracle's Trials.
            </p>

            <p>You learned that:</p>

            <ul>

              <li>✔ Think before acting.</li>

              <li>✔ Prepare for unexpected situations.</li>

              <li>✔ Use <strong>try</strong> to attempt risky code.</li>

              <li>✔ Use <strong>except</strong> to handle errors gracefully.</li>

            </ul>

            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/ending");
              }}
            >
              Go back to the Temple →
            </button>

          </div>

        )}

      </div>

    </div>
  );
}