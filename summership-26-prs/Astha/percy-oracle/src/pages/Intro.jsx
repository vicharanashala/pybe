import { useNavigate } from "react-router-dom";
import "../styles/intro.css";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="intro">

      <div className="mist"></div>

      <div className="scroll">

        <h1>The Broken Prophecy</h1>

        <p className="speaker">
          Chiron
        </p>

        <p>
          "Listen carefully, young hero.
        </p>

        <p>
          For centuries, the Oracle has protected Olympus.
          But today...
          something impossible has happened.
        </p>

        <p>
          A prophecy was spoken...
          then suddenly disappeared.
        </p>

        <p>
          Every demigod who tries to read it
          is overwhelmed by chaos.
        </p>

        <p className="oracle">
          The Oracle believes
          only someone who understands unexpected situations
          can restore the prophecy.
        </p>

        <button onClick={() => navigate("/quest1")}>
          Accept the Quest
        </button>

      </div>

    </div>
  );
}