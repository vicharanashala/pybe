import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/home.css";

import book from "../assets/book.png";
import temple from "../assets/temple.png";

export default function Home() {

  const navigate = useNavigate();
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (

    <div className="home">

      <img
        src={temple}
        className="temple"
        alt="Temple"
      />

      <div className="book-frame">

        <div
          className="book"
          onClick={() => navigate("/intro")}
        >

          <img
            src={book}
            className="book-image"
            alt="Ancient Book"
          />

        </div>

      </div>

      <div className="home-text">

        <h1>The Lost Prophecy</h1>

        <p>
          Deep within the Temple of Delphi lies a forgotten prophecy waiting
          to be restored. Only a hero who thinks carefully and prepares for
          the unexpected can awaken the Oracle and uncover the ancient
          secrets of Python Exception Handling.
        </p>

        <p>
          Click the ancient spellbook to begin your adventure.
        </p>

      </div>

    </div>

  );

}