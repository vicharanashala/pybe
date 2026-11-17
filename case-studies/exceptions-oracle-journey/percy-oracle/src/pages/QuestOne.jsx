import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quest.css";

export default function QuestOne() {
  const navigate = useNavigate();
  const [choice, setChoice] = useState("");

  return (
    <div className="quest">
      <div className="quest-card">

        <h1>Quest I</h1>

        <h2>The Oracle's First Trial</h2>

        <p className="story">
          As you step into the ancient Temple of Delphi, the air becomes
          strangely silent. Three sacred relics rise from glowing marble
          pedestals.
          <br /><br />
          The Oracle speaks:
          <br /><br />
          <i>
            "Many heroes believe strength alone restores balance.
            But wisdom lies in choosing the right tool for the right purpose."
          </i>
          <br /><br />
          Read the purpose of each relic carefully.
          Even someone with no knowledge of Percy Jackson can solve this
          challenge by using logic.
        </p>

        <div className="oracle-hint">
          <strong>The Oracle whispers...</strong>

          <p>
            "When something has been forgotten,
            seek what reveals the truth,
            not what defeats the enemy."
          </p>
        </div>

        {/* Sword */}

        <div className="artifact-card">

          <h3>⚔ Sword of Ares</h3>

          <strong>Purpose</strong>

          <p>
            Forged for battle, this sword possesses enormous strength.
            It can defeat powerful enemies but was never created to reveal
            forgotten knowledge.
          </p>

          <small>
            Hint: Best when strength is needed, not when solving mysteries.
          </small>

          <button
            className="choice"
            onClick={() => setChoice("sword")}
          >
            Choose Sword
          </button>

          {choice === "sword" && (
            <div className="wrong">
              The sword shines with immense power.

              <br /><br />

              The temple begins shaking...

              <br />

              But the prophecy remains silent.

              <br /><br />

              <strong>
                Power without understanding cannot restore forgotten knowledge.
              </strong>
            </div>
          )}

        </div>

        {/* Shield */}

        <div className="artifact-card">

          <h3>🛡 Shield of Athena</h3>

          <strong>Purpose</strong>

          <p>
            Blessed by Athena, this shield protects heroes and reflects
            magical attacks. It offers safety but cannot uncover hidden truth.
          </p>

          <small>
            Hint: Best for protection, not for discovering secrets.
          </small>

          <button
            className="choice"
            onClick={() => setChoice("shield")}
          >
            Choose Shield
          </button>

          {choice === "shield" && (
            <div className="wrong">
              The shield surrounds the temple with brilliant light.

              <br /><br />

              Everyone is protected...

              <br />

              Yet nothing changes.

              <br /><br />

              <strong>
                Protection alone cannot reveal hidden truth.
              </strong>
            </div>
          )}

        </div>

        {/* Scroll */}

        <div className="artifact-card">

          <h3> Prophecy Scroll</h3>

          <strong>Purpose</strong>

          <p>
            This ancient scroll preserves forgotten knowledge.
            Legends say it reveals truths that cannot be discovered through
            strength alone.
          </p>

          <small>
            Hint: Best for uncovering truth and understanding.
          </small>

          <button
            className="choice"
            onClick={() => setChoice("scroll")}
          >
            Choose Scroll
          </button>

          {choice === "scroll" && (
            <div className="correct">

              The Prophecy Scroll begins glowing.

              <br /><br />

              Ancient letters slowly appear across its surface.

              <br /><br />

              <strong>
                "You chose wisdom before power."
              </strong>

              <div className="lesson-box">

                <h3>Programmer's Lesson</h3>

                <p>
                  Great programmers don't immediately write code.
                  They first understand the problem, gather information,
                  and choose the correct solution.

                  <br /><br />

                  Just like you selected the relic whose purpose matched the
                  challenge, programmers succeed by choosing the right approach,
                  not simply the strongest one.
                </p>

              </div>

              <button
                onClick={() => navigate("/lesson1")}
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