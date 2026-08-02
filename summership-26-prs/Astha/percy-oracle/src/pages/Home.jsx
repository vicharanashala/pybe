import { useNavigate } from "react-router-dom";

import "../styles/home.css";

import book from "../assets/book.png";

import temple from "../assets/temple.png";


export default function Home() {

  const navigate = useNavigate();

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
          Camp Half-Blood awaits its next hero.
          
        </p>

       

      </div>

    </div>

  );

}