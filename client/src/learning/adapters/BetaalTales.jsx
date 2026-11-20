import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/python-fundamentals-betaal-tales/client/src/BetaalTales.jsx";
import styles from "../../../../case-studies/python-fundamentals-betaal-tales/client/src/styles.css";
import introStyles from "../../../../case-studies/python-fundamentals-betaal-tales/client/src/intro.css";
const theme = `:host{--parchment:#fcf8f2;--parchment-dark:#fff0e2;--ink:#30271f;--ink-soft:#68513e;--gold:#b24e25;--gold-soft:#f2d5bb;--forest:#c4552d;--forest-dark:#a94423;--terracotta:#df622f;--indigo:#b24e25;--indigo-soft:#fff0e2;--font-ui:"Segoe UI",system-ui,sans-serif}.app-header{position:relative;top:auto;background:#fffdf9}.btn-primary{background:#df622f;border-color:#df622f}.brand-mark{background:#df622f}.app-shell{background:#fcf8f2}.book-pages,.theme-forest,.theme-terracotta,.theme-indigo,.theme-gold,.theme-robe{--cover-a:#c4552d;--cover-b:#933a20;--cover-glow:#e9c9ae;--topic-accent:#c4552d;--topic-dark:#a94423;--topic-light:#fff0e2}.player{scroll-margin-top:100px}.stage{background:#fffdf9}`;
export default function BetaalTales({ onComplete }) {
  return (
    <AuthoredStory styles={[styles, introStyles]} theme={theme}>
      <Story onComplete={onComplete} />
    </AuthoredStory>
  );
}
