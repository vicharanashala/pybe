import React, { useEffect, useRef, useState } from "react";
import {
  createAuthoredEnvironment,
  scopeAuthoredStyles,
} from "../../../library/learning/authored-environment.mjs";

export default function AuthoredHtmlStory({ lesson, onComplete, onNavigate }) {
  const host = useRef(null),
    [error, setError] = useState("");
  useEffect(() => {
    let gone = false,
      runtime = null,
      observer = null,
      reported = false,
      instance = null;
    const element = host.current;
    const surface =
      element.shadowRoot || element.attachShadow({ mode: "open" });
    const baseURL = new URL(lesson.baseURL, location.origin).href;
    const body = document.createElement("div");
    body.className = "authored-html-body";
    body.tabIndex = -1;
    body.innerHTML = lesson.markup;
    const navigate = (event) => {
      if (event.defaultPrevented) return;
      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (lesson.scopedHash && href.startsWith("#/")) {
        event.preventDefault();
        runtime.environment.location.hash = href;
        return;
      }
      if (href.startsWith("#")) {
        const target = surface.getElementById(
          decodeURIComponent(href.slice(1)),
        );
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
      if (onNavigate?.(anchor.href)) event.preventDefault();
    };
    body.addEventListener("click", navigate);
    for (const node of body.querySelectorAll("[src],[href]")) {
      for (const key of ["src", "href"])
        if (node.hasAttribute(key) && !node.getAttribute(key).startsWith("#"))
          node.setAttribute(key, new URL(node.getAttribute(key), baseURL).href);
    }
    const style = document.createElement("style");
    style.textContent =
      lesson.styles
        .map((entry) =>
          scopeAuthoredStyles(
            entry.css ?? entry,
            entry.baseURL
              ? new URL(entry.baseURL, location.origin).href
              : baseURL,
          ),
        )
        .join("\n") +
      `\n:host{display:block;position:relative;contain:layout paint;overflow:clip;${lesson.layout === "document" ? "height:auto;min-height:0;" : "height:calc(100dvh - 240px);min-height:560px;"}--amber:#df622f;--amber-lit:#f3aa70;--accent:#df622f;--accent-dark:#a84420;--accent-soft:#fff0e2}.authored-html-body{${lesson.layout === "document" ? "height:auto;min-height:600px;" : "height:100%;"}position:relative;overflow:clip}#next,#btn-next,.btn-primary{border-color:#df622f;background:#df622f;color:#fff}` +
      (lesson.theme || "");
    surface.replaceChildren(style, body);
    const size = () => {
      element.style.setProperty("--study-vw", `${element.clientWidth / 100}px`);
      element.style.setProperty(
        "--study-vh",
        `${(lesson.layout === "document" ? window.innerHeight : element.clientHeight) / 100}px`,
      );
    };
    size();
    const sizing = new ResizeObserver(size);
    sizing.observe(element);
    runtime = createAuthoredEnvironment({
      host: element,
      surface,
      body,
      baseURL,
      hashStudyId: lesson.scopedHash ? lesson.studyId : null,
    });
    const check = () => {
      if (
        !reported &&
        ((lesson.completionSelector &&
          surface.querySelector(lesson.completionSelector)) ||
          instance?.isComplete?.())
      ) {
        reported = true;
        onComplete?.();
      }
    };
    observer = new MutationObserver(check);
    observer.observe(body, {
      subtree: true,
      childList: true,
      attributes: true,
    });
    import(/* @vite-ignore */ lesson.module)
      .then((module) => {
        if (gone) return;
        instance = module.default(
          runtime.document,
          runtime.window,
          runtime.environment,
        );
        element.studyInstance = instance;
        element.studyEnvironment = runtime;
        check();
      })
      .catch((error) => {
        if (!gone) {
          runtime.dispose();
          setError(error.message);
        }
      });
    return () => {
      gone = true;
      observer?.disconnect();
      sizing.disconnect();
      runtime?.dispose();
      body.removeEventListener("click", navigate);
      delete element.studyInstance;
      delete element.studyEnvironment;
      surface.replaceChildren();
    };
  }, [lesson, onComplete, onNavigate]);
  return (
    <>
      {error && (
        <div className="lesson-feedback" role="alert">
          This story could not start: {error}
        </div>
      )}
      <div
        className="authored-html-story"
        ref={host}
        aria-label="Interactive story"
      />
    </>
  );
}
