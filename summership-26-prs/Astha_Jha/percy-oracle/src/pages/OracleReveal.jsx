import { useNavigate } from "react-router-dom";
import "../styles/oracle.css";
import { useEffect } from "react";
export default function OracleReveal() {

  const navigate = useNavigate();
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (

    <div className="oracle-page">

      <div className="oracle-card">

        <h1>The Oracle Speaks</h1>

        <p>
          Well done, young demigod.
        </p>

        <p>
          You have completed two important trials.
          In the first, you learned that choosing the right solution is
          more important than choosing the strongest one.
        </p>

        <p>
          In the second, you discovered that wise heroes prepare for
          unexpected dangers instead of hoping nothing goes wrong.
        </p>

        <hr />

        <p>
          The Oracle smiles and says,
        </p>

        <p className="highlight">
          "Every hero faces moments they cannot predict.
          Programming is no different."
        </p>

        <p>
          Imagine you create a program that asks a user to enter a number.
        </p>

        <p>
          Most people might enter:
          <strong> 25 </strong>
        </p>

        <p>
          But someone could accidentally enter:
          <strong> hello </strong>
        </p>

        <p>
          Your program expected a number,
          but received text instead.
        </p>

        <h2>What just happened?</h2>

        <p>
          Something unexpected interrupted the normal flow of the program.
        </p>

        <p>
          In mythology, we may call it <strong>Chaos</strong>.
        </p>

        <p>
          In Python, we call it an
          <strong> Exception.</strong>
        </p>

        <p>
          If a programmer is not prepared,
          the program stops with an error.
        </p>

        <p className="highlight">
          Great programmers are like great demigods.
          They don't fear unexpected situations—
          they prepare for them.
        </p>
<button
  onClick={() => {
    navigate("/lesson");

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }}
   >     
          Learn How Python Handles Exceptions →
        </button>
       
 

      </div>

    </div>

  );

}