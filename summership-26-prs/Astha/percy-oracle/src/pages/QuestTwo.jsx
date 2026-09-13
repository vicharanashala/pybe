import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quest.css";

export default function QuestTwo() {

  const navigate = useNavigate();
  const [choice, setChoice] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="quest">
      <div className="quest-card">

        <h1>Quest II</h1>

        <p className="story">
          You continue deeper into the Temple of Delphi.

          <br /><br />

          The Prophecy Scroll glows in your hands, but suddenly the temple
          begins to tremble. Ancient symbols on the walls light up, and a
          magical gate rises before you.

          <br /><br />

          The Oracle calmly says:

          <br /><br />

          <i>
            "A hero does not fear the unexpected.
            A hero prepares for it."
          </i>

          <br /><br />

          The gate is unstable. One careless action could activate an
          ancient trap.

          Choose the wisest course of action.
        </p>

        <div className="oracle-hint">

          <strong>The Oracle whispers...</strong>

          <p>
            "Preparation is often more powerful than bravery."
          </p>

        </div>

        {/* Attack */}

        <div className="artifact-card">

          <h3>⚔ Attack the gate immediately</h3>

          <p>
            Sometimes confidence becomes carelessness.
            Acting without understanding the situation may make the danger
            even worse.
          </p>

          <button
            className="choice"
            onClick={() => setChoice("attack")}
          >
            Choose
          </button>

          {choice === "attack" && (

            <div className="wrong">

              The gate releases a burst of magical energy.

              <br /><br />

              Acting too quickly without preparation has triggered the trap.

              <br /><br />

              <strong>
                A wise hero thinks before acting.
              </strong>

            </div>

          )}

        </div>

        {/* Observe */}

        <div className="artifact-card">

          <h3>Observe the gate and prepare for unexpected dangers</h3>

          <p>
            Wise heroes first study what could go wrong before taking
            action. Preparation often prevents failure.
          </p>

          <button
            className="choice"
            onClick={() => setChoice("observe")}
          >
            Choose
          </button>

          {choice === "observe" && (

            <div className="correct">

              You carefully observe the magical gate.

              <br /><br />

              Hidden warning symbols begin glowing.

              <br /><br />

              The Oracle smiles.

              <br /><br />

              <strong>
                "Excellent. A careless hero expects everything to go
                perfectly. A wise hero prepares for the unexpected."
              </strong>

              <div className="lesson-box">

                <h3>Programmer's Lesson</h3>

                <p>

                  Imagine you write a program that asks the user to enter
                  a number.

                  <br /><br />

                  Most people may enter:

                  <strong> 25 </strong>

                  <br /><br />

                  But what if someone enters:

                  <strong> hello </strong>

                  <br /><br />

                  Something unexpected has happened.

                  Just as heroes prepare for hidden dangers,
                  programmers prepare for unexpected situations.

                </p>

              </div>

              <button
                onClick={() => navigate("/oracle")}
              >
                Learn the Ancient Technique →
              </button>

            </div>

          )}

        </div>

        {/* Ignore */}

        <div className="artifact-card">

          <h3>Ignore the gate and keep walking</h3>

          <p>
            Ignoring a problem rarely solves it.
            Hidden dangers remain hidden until they are understood.
          </p>

          <button
            className="choice"
            onClick={() => setChoice("ignore")}
          >
            Choose
          </button>

          {choice === "ignore" && (

            <div className="wrong">

              You try to walk past...

              <br /><br />

              The magical gate blocks your path completely.

              <br /><br />

              <strong>
                Problems don't disappear when we ignore them.
              </strong>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}