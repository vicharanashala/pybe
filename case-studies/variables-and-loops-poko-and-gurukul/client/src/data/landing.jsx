import React from "react";
import { motion } from "framer-motion";
import "../../styles.css";

export default function Landing({ onStart }) {
  console.log("Landing Rendered");
  return (
    <section className="hero">
      <div className="hero__bg"></div>

      <div className="hero__main_box">
        {/* LEFT SIDE: BIG WIDE VINTAGE GHIBLI PYTHON POSTER */}
        <div className="hero__left_image_container">
          <motion.div
            className="hero__image_frame wide_vintage_theme"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <img
              src="/assets/wide_vintage_ghibli_python_poster.png"
              alt="Wide Vintage Ghibli Python Poster"
              className="hero__ghibli_img"
            />
            <div className="hero__vintage_glow"></div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: PYBE LOGO & START BUTTONS */}
        <div className="hero__right_content">
          <h1 className="hero__title">
            <span className="en">PyBe</span>
            <span className="hi">पाइबी</span>
          </h1>

          <p className="hero__tagline">
            Learn Python through Games, Stories & Real Challenges.
          </p>

          <div className="hero__buttons">
            <button
              className="btn btn-primary"
              onClick={onStart}
            >
              Get Started
            </button>

            <button
              className="btn btn-secondary"
              onClick={onStart}
            >
              Explore Demo 🚀
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}