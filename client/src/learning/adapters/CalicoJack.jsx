import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/conditionals-hunt-for-calico-jack/client/src/App.jsx";
import landing from "../../../../case-studies/conditionals-hunt-for-calico-jack/client/src/components/LandingPage.css";
import journey from "../../../../case-studies/conditionals-hunt-for-calico-jack/client/src/components/journey/journey.css";
const theme = `.jr-quiz-title,.jr-count,.jr-cap-text,.jr-bridge-text{color:#382b21}.jr-quiz-card{box-shadow:0 8px 24px #59371518}.jr-fb.is-right{color:#286435}.jr-fb.is-wrong{color:#9a352a}.jr-reroll{background:#fffaf3;color:#9a4211;border-color:#c45b19}.jr-reroll span{color:#705a46}.jr-end h2{color:#382b21}:host{display:block;--navy-deep:#fffaf3;--navy:#f9eee0;--navy-light:#f0dfcb;--parchment:#382b21;--parchment-dim:#705a46;--brass:#c45b19;--brass-bright:#a44712;--ink:#382b21;color:#382b21;font-family:system-ui,sans-serif}.jr-root{--navy-deep:#fffaf3;--navy:#f9eee0;--navy-light:#f0dfcb;--parchment:#382b21;--parchment-dim:#705a46;--brass:#c45b19;--brass-bright:#a44712;--glass:#fffaf3ed;--glass-line:#e7cfb5;--shadow:#59371522;font-family:system-ui,sans-serif}.landing-hero,.landing-features,.landing-topics,.landing-footer,.jr-quiz,.jr-end,.jr-act-bridge .jr-act-sticky{background:#fffaf3;color:#382b21}.hero-title,.hero-subtitle,.section-title,.section-subtitle,.feature-title,.feature-desc,.topic-title,.topic-desc,.jr-quiz-q,.jr-quiz-done p,.jr-end p{color:#382b21}.feature-card,.topic-card,.jr-quiz-card,.jr-opt{background:#fffdf9;border-color:#e7cfb5;color:#382b21}.jr-btn,.hero-cta,.topic-btn{background:#c45b19;color:white;border-color:#c45b19}.jr-btn-ghost{background:transparent;color:#a44712}.jr-quiz-progress span{color:#705a46}.jr-topbar{top:var(--pybe-header-bottom,96px);background:#fffaf3ed;border-color:#e7cfb5;z-index:10}.jr-totop{z-index:11}.jr-act-sticky,.jr-cine-sticky{top:var(--pybe-header-bottom,96px);height:calc(100vh - var(--pybe-header-bottom,96px))}.jr-code{--parchment:#ecdfbd;--parchment-dim:#cbbc95;--brass-bright:#f0d093;color:#ecdfbd}.jr-caption,.jr-caption p,.jr-banner,.jr-rail{color:#382b21}.jr-quiz-inner,.jr-end-inner{scroll-margin-top:130px}@media(max-width:600px){.jr-topbar-inner{gap:8px;font-size:10px}.jr-count{display:none}}`;
export default function CalicoJack({ onComplete }) {
  return (
    <AuthoredStory
      styles={[landing, journey]}
      theme={theme}
      publicAssetsRoot="/submissions/conditionals-hunt-for-calico-jack/client/public"
    >
      <Story onComplete={onComplete} />
    </AuthoredStory>
  );
}
