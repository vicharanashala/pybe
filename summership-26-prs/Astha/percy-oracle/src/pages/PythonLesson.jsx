import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/lesson.css";

export default function PythonLesson() {

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (

    <div className="lesson-page">

      <div className="lesson-card">

        <h1> The Oracle's Wisdom</h1>

        <h2>Exception Handling in Python</h2>

        <p>
          The Oracle now reveals one of the most powerful techniques used by
          programmers to survive unexpected situations.
        </p>

        <hr />

        <h2>What is an Exception?</h2>

        <p>
          An <strong>Exception</strong> is an unexpected event that interrupts
          the normal execution of a program.
        </p>

        <p>
          Imagine your program asks the user to enter their age.
        </p>

        <p>
          If the user enters <strong>25</strong>, everything works perfectly.
        </p>

        <p>
          But what if the user enters
          <strong> hello </strong>
          instead?
        </p>

        <p>
          Python cannot convert text into a number,
          so it raises an Exception.
        </p>

        <div className="highlight">

          Great programmers don't prevent every mistake.

          <br /><br />

          They prepare their programs to handle mistakes gracefully.

        </div>

        <hr />

        <h2>The Ancient Spell: try & except</h2>

        <div className="scroll">

<pre>{`try:
    age = int(input("Enter your age: "))
    print("Your age is", age)

except ValueError:
    print("Please enter a valid number.")`}</pre>

        </div>

        <hr />

        <h2>How the Spell Works</h2>

        <div className="spell-step">

          <h3>① try</h3>

          <p>
            Python first attempts to execute every line inside the
            <strong> try </strong> block.
          </p>

        </div>

        <div className="spell-step">

          <h3>② int()</h3>

          <p>
            The input is converted into an integer.
            If the conversion fails,
            Python raises an Exception.
          </p>

        </div>

        <div className="spell-step">

          <h3>③ except ValueError</h3>

          <p>
            Instead of crashing,
            Python immediately executes the code inside the
            <strong> except </strong> block.
          </p>

        </div>

        <hr />

        <h2>Example Output</h2>

        <div className="console">

<pre>{`Enter your age: hello

Please enter a valid number.`}</pre>

        </div>

        <p className="highlight">

          Notice something important...

          <br /><br />

          The program did not crash.

          It handled the problem and continued safely.

        </p>

        <button
          onClick={() => navigate("/scroll")}
        >
          Read the Oracle's Secret Scroll →
        </button>

      </div>

    </div>

  );

}