import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/lesson.css";

export default function LessonOne() {

  const navigate = useNavigate();

  const [answer, setAnswer] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (

    <div className="lesson-page">

      <div className="lesson-card">

        <h1>What Did You Learn?</h1>

        <p>
          Every great hero begins by understanding the challenge before
          taking action.
        </p>

        <p>
          In the Temple of Delphi, you were not asked to choose the
          strongest relic. Instead, you chose the relic whose
          <strong> purpose </strong>
          matched the problem.
        </p>

        <p>
          Programming works in exactly the same way.
          Good programmers don't immediately write code.
          They first understand the problem, collect information,
          and then choose the most suitable solution.
        </p>

        <div className="reflection">

          <h2>Reflection Challenge</h2>

          <p>
            Imagine your program suddenly stops working.
            What should a good programmer do first?
          </p>

          <button
            className="option"
            onClick={() => setAnswer("wrong")}
          >
            Change random lines of code.
          </button>

          {answer === "wrong" && (
            <p className="wrong">
              ❌ Not quite! Changing random code often creates even more bugs.
              First understand what caused the problem.
            </p>
          )}

          <button
            className="option"
            onClick={() => setAnswer("correct")}
          >
            Read the error and understand the problem first.
          </button>

          {answer === "correct" && (

            <div className="success">

              <h3>Excellent!</h3>

              <p>
                Great programmers don't panic when something goes wrong.
                They investigate first, understand the problem,
                and only then decide how to solve it.
              </p>

              <button
                onClick={() => navigate("/quest2")}
              >
                Continue to Trial II →
              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}