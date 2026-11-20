import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { observeAuthoredAssets } from "../../../library/learning/authored-assets.mjs";
import {authoredStyles} from '../../../shared/story-styles.mjs';
import sharedStyles from "../../../shared/story-elements.css";

// Native React portal, not an iframe or another application runtime. Styling is
// isolated so an authored illustration cannot change the surrounding PyBe UI.
export default function AuthoredStory({
  styles,
  completionHeading,
  onComplete,
  children,
  theme = "",
  publicAssetsRoot = null,
}) {
  const host = useRef(null),
    reported = useRef(false);
  const [surface, setSurface] = useState(null);
  useLayoutEffect(() => {
    const root =
      host.current.shadowRoot || host.current.attachShadow({ mode: "open" });
    setSurface(root);
  }, []);
  useLayoutEffect(() => {
    const element = host.current,
      header = element.ownerDocument.querySelector(".site-header");
    if (!header) return;
    const size = () =>
      element.style.setProperty(
        "--pybe-header-bottom",
        `${Math.max(0, header.getBoundingClientRect().bottom)}px`,
      );
    size();
    const observer = new ResizeObserver(size);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!surface || !publicAssetsRoot) return;
    const observer = observeAuthoredAssets(surface, {
      publicRoot: publicAssetsRoot,
    });
    return () => observer.disconnect();
  }, [surface, publicAssetsRoot]);
  useEffect(() => {
    if (!surface) return;
    const localAnchor = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      const href = link.getAttribute('href');
      if (!/^#[\w:-]+$/.test(href)) return;
      const target = surface.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({block:'start',behavior:'smooth'});
      if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
      target.focus({preventScroll:true});
    };
    surface.addEventListener('click',localAnchor);
    return () => surface.removeEventListener('click',localAnchor);
  }, [surface]);
  useEffect(() => {
    if (!surface || !completionHeading) return;
    const check = () => {
      if (
        !reported.current &&
        [...surface.querySelectorAll("h1,h2")].some(
          (heading) => heading.textContent.trim() === completionHeading,
        )
      ) {
        reported.current = true;
        onComplete?.();
      }
    };
    const observer = new MutationObserver(check);
    observer.observe(surface, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    check();
    return () => observer.disconnect();
  }, [surface, completionHeading, onComplete]);
  const palette = `:host{display:block;color:#30271f;background:#fcf8f2;font:16px/1.6 "Segoe UI",system-ui,sans-serif;--bg:#fcf8f2;--paper:#fffdf9;--line:#eadbce;--font-body:"Segoe UI",system-ui,sans-serif;--font-display:Georgia,serif}.story-shell{min-height:0}.story-main{padding:16px 0 30px}.btn-primary{background:#df622f!important;border-color:#df622f!important;color:white!important}.story-back{color:#b24e25!important}button:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #df622f;outline-offset:3px}`;
  return (
    <div ref={host} className="authored-story">
      {surface &&
        createPortal(
          <>
            <style>
              {styles
                .map(authoredStyles)
                .join("\n") +
                "\n" +
                palette +
                "\n" +
                sharedStyles +
                "\n" +
                theme}
            </style>
            <div id="root">{children}</div>
          </>,
          surface,
        )}
    </div>
  );
}
