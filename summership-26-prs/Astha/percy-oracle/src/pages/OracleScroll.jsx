import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/lesson.css";

export default function OracleScroll() {

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [q1Answered, setQ1Answered] = useState(false);
  const [q2Answered, setQ2Answered] = useState(false);
  const [q3Answered, setQ3Answered] = useState(false);
  const [q4Answered, setQ4Answered] = useState(false);

  const [q1Message, setQ1Message] = useState("");
  const [q2Message, setQ2Message] = useState("");
  const [q3Message, setQ3Message] = useState("");
  const [q4Message, setQ4Message] = useState("");
  const [score, setScore] = useState(0);
const [nextMessage, setNextMessage] = useState("");

  return (

    <div className="lesson-page">

      <div className="lesson-card">

        <h1> The Oracle's Secret Scroll</h1>

        <p>
          The Oracle smiles and opens one final ancient scroll.
        </p>

        <p className="highlight">
          "Young demigod... every monster is different.
          Python also faces different kinds of unexpected problems called
          <strong> Exceptions.</strong>"
        </p>

        <hr />

        <h2>Meet the Four Guardians of Chaos</h2>

        <div className="spell-step">
          <h3> ValueError</h3>
          <p>
            Appears when Python receives a value that it cannot use.
          </p>
          <p><strong>Example:</strong> int("hello")</p>
        </div>

        <div className="spell-step">
          <h3> ZeroDivisionError</h3>
          <p>
            Appears when Python tries to divide by zero.
          </p>
          <p><strong>Example:</strong> 10 / 0</p>
        </div>

        <div className="spell-step">
          <h3> NameError</h3>
          <p>
            Appears when Python cannot find a variable.
          </p>
          <p><strong>Example:</strong> print(hero)</p>
        </div>

        <div className="spell-step">
          <h3> FileNotFoundError</h3>
          <p>
            Appears when Python cannot find a requested file.
          </p>
          <p><strong>Example:</strong> open("oracle.txt")</p>
        </div>

        <hr />

        <h2>⚔ Trial I — The Cursed Relic</h2>

        <div className="scroll">
<pre>{`age = int("hello")`}</pre>
        </div>

        {!q1Answered ? (
          <>
            <button
              className="option"
              onClick={()=>{
                setQ1Answered(true);
                setQ1Message("❌ Not quite! 'hello' is not a variable problem.");
              }}
            >
              NameError
            </button>

            <button
              className="option"
              onClick={()=>{
    setQ1Answered(true);
    setScore(prev => prev + 1);
    setQ1Message("✅ Correct! 'hello' cannot be converted into an integer, so Python raises ValueError.");
}}
            >
              ValueError
            </button>

            <button
              className="option"
              onClick={()=>{
                setQ1Answered(true);
                setQ1Message("❌ This isn't a syntax mistake.");
              }}
            >
              SyntaxError
            </button>
          </>
        ) : (
          <p className="highlight">{q1Message}</p>
        )}

        <hr />

        <h2>Trial II — The Bottomless Pit</h2>

        <div className="scroll">
<pre>{`10 / 0`}</pre>
        </div>

        {!q2Answered ? (
          <>
            <button
              className="option"
              onClick={()=>{
    setQ2Answered(true);
    setScore(prev => prev + 1);
    setQ2Message("✅ Correct! Dividing by zero raises ZeroDivisionError.");
}}
            >
              ZeroDivisionError
            </button>

            <button
              className="option"
              onClick={()=>{
                setQ2Answered(true);
                setQ2Message("❌ The value isn't the problem.");
              }}
            >
              ValueError
            </button>

            <button
              className="option"
              onClick={()=>{
                setQ2Answered(true);
                setQ2Message("❌ Python knows the number. The math is impossible.");
              }}
            >
              NameError
            </button>
          </>
        ) : (
          <p className="highlight">{q2Message}</p>
        )}

        <hr />
        <h2> Trial III — The Forgotten Hero</h2>

        <div className="scroll">
<pre>{`print(hero)`}</pre>
        </div>

        {!q3Answered ? (
          <>
            <button
              className="option"
              onClick={()=>{
                setQ3Answered(true);
                setQ3Message("❌ Not quite! The value isn't the problem.");
              }}
            >
              ValueError
            </button>

            <button
              className="option"
              onClick={()=>{
    setQ3Answered(true);
    setScore(prev => prev + 1);
    setQ3Message("✅ Correct! Python raises NameError because 'hero' has never been defined.");
}}
            >
              NameError
            </button>

            <button
              className="option"
              onClick={()=>{
                setQ3Answered(true);
                setQ3Message("❌ No file is involved here.");
              }}
            >
              FileNotFoundError
            </button>
          </>
        ) : (
          <p className="highlight">{q3Message}</p>
        )}

        <hr />

        <h2> Trial IV — The Lost Scroll</h2>

        <div className="scroll">
<pre>{`open("oracle.txt")`}</pre>
        </div>

        {!q4Answered ? (
          <>
            <button
              className="option"
              onClick={()=>{
                setQ4Answered(true);
                setQ4Message("❌ Python knows the variable. It can't find the file.");
              }}
            >
              NameError
            </button>

            <button
              className="option"
              onClick={()=>{
                setQ4Answered(true);
                setQ4Message("❌ The value is valid. The file is missing.");
              }}
            >
              ValueError
            </button>

            <button
              className="option"
              onClick={()=>{
    setQ4Answered(true);
    setScore(prev => prev + 1);
    setQ4Message("✅ Correct! Python raises FileNotFoundError because the requested file doesn't exist.");
}}
            >
              FileNotFoundError
            </button>
          </>
        ) : (
          <p className="highlight">{q4Message}</p>
        )}

        <hr />

        <h2> Oracle's Wisdom</h2>

        <div className="highlight">

          <strong>Should we put the entire program inside a try block?</strong>

          <br /><br />

          No.

          <br /><br />

          A wise programmer protects only the code that might fail.
          Wrapping the whole program inside <strong>try</strong> hides real
          mistakes and makes debugging much harder.

        </div>

        <hr />

        <h2> How Python Handles Exceptions</h2>

        <div className="scroll">
<pre>{`
Program Starts
      │
      ▼
   try Block
      │
 ┌────┴─────────┐
 │              │
No Exception   Exception
 │              │
 ▼              ▼
Continue     except Block
      │
      ▼
Program Continues
`}</pre>
        </div>

        <div className="highlight">
           <strong>Fun Fact:</strong> Python has dozens of built-in exceptions.
          You don't have to memorize all of them. As you build more programs,
          you'll naturally learn which ones appear most often.
        </div>

        <div className="highlight">
           <strong>Oracle's Final Advice</strong>

          <br /><br />

          "A hero is not someone who never faces danger.

          <br /><br />

          A programmer is not someone who never gets errors.

          <br /><br />

          True wisdom comes from preparing for both."
        </div>

        <p className="highlight">
    Score: {score}/4
</p>

{nextMessage && (
    <p className="highlight">{nextMessage}</p>
)}

<button
    onClick={() => {

        // Make sure all questions are answered
        if (!q1Answered || !q2Answered || !q3Answered || !q4Answered) {
            setNextMessage("⚠ Please answer all four trials first.");
            return;
        }

        // Require at least 2 correct answers
        if (score >= 2) {
            navigate("/activity");
        } else {
            setNextMessage(
                ` You scored ${score}/4. You need at least 2 correct answers to continue.`
            );
        }

    }}
>
    Face the Final Oracle Challenge →
</button>

      </div>

    </div>

  );

}