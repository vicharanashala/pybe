import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import App from "../../../../case-studies/references-and-memory-modules/client/src/App.jsx";
import styles from "../../../../case-studies/references-and-memory-modules/client/src/App.css";
const theme = `:host{position:relative;isolation:isolate;--bg-color:#fcf8f2;--text-primary:#30271f;--text-secondary:#766352;--accent:#df622f;--panel-bg:#fffdf9;--panel-border:#eadbce;--sidebar-bg:#fff5eb;font-family:"Segoe UI",system-ui,sans-serif}.scene-overlay{overflow-x:clip;position:relative;inset:auto;width:100%;height:auto;min-height:560px;z-index:auto;padding:12px;background:#fcf8f2}.scene-card-animated{max-height:none;overflow:visible;padding:22px}.app-container{height:auto;min-height:600px;overflow:visible}.main-content{min-width:0;overflow:visible;padding:24px}.sidebar{position:relative;height:auto}.glass-panel{box-shadow:none}.btn.primary{background:#df622f;color:white}.crash-overlay{position:fixed;inset:var(--pybe-header-bottom,96px) 0 0}.crash-card{max-height:calc(100dvh - var(--pybe-header-bottom,96px) - 32px);overflow:auto}#root [style*="position: fixed"]{top:var(--pybe-header-bottom,96px)!important}#root [style*="position: fixed"]>div{max-height:calc(100dvh - var(--pybe-header-bottom,96px) - 32px)!important}#root .floating-sidebar-toggle{position:relative!important;top:auto!important;left:auto!important;align-self:flex-start;z-index:1;}.welcome-start-btn{background:#df622f!important}.welcome-screen-container{padding:24px!important}@media(max-width:760px){.memory-welcome-heading{flex-wrap:wrap}.welcome-screen-container [style*="backdrop-filter: blur(10px)"]{flex-wrap:wrap;gap:8px}.welcome-screen-container img{object-fit:contain!important}.app-container{display:block}.sidebar{width:100%;max-width:none}.sidebar.collapsed{display:none}.main-content{padding:12px}.welcome-screen-container [style*="min-width: 380px"]{min-width:0!important;flex-basis:100%!important}.level-container,.level-content{grid-template-columns:minmax(0,1fr)}.glass-panel{min-width:0;padding:14px}pre{max-width:100%;overflow:auto}.level-container{max-width:100%}.crash-card{max-width:95%;overflow:auto}}`;
export default function MemoryModules({ onComplete }) {
  return (
    <AuthoredStory styles={[styles]} theme={theme}>
      <App onComplete={onComplete} />
    </AuthoredStory>
  );
}
