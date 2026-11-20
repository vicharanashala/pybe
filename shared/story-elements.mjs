// Shared markup for stories that already used these same controls. React comes
// from the host, so a retained standalone source can use its own React version.
// Chapter order and scene content belong to each story, never to this shell.
export function createStoryElements(React, { codeClass = "code" } = {}) {
  const h = React.createElement;
  function Code({ children }) {
    return h(
      "pre",
      codeClass ? { className: codeClass } : null,
      h("code", null, children),
    );
  }
  function Feedback({ ok, children }) {
    return h(
      "div",
      { className: ok ? "feedback ok" : "feedback retry" },
      ok ? "✓ " : "↺ ",
      children,
    );
  }
  function Choice({ icon, label, active, onClick }) {
    return h(
      "button",
      { className: active ? "choice active" : "choice", onClick },
      h("span", null, icon),
      label,
    );
  }
  function Completion({
    title,
    description,
    onHome,
    homeLabel = "Back to the story library",
  }) {
    return h(
      "section",
      { className: "story-completion", role: "status" },
      h("h2", null, title),
      h("p", null, description),
      onHome &&
        h(
          "button",
          { className: "story-completion-button", onClick: onHome },
          homeLabel,
        ),
    );
  }
  function ChapterShell({ title, chapters, step, onStepChange, children }) {
    const progress = (step / Math.max(1, chapters.length - 1)) * 100;
    return h(
      "main",
      { className: "app" },
      h(
        "header",
        { className: "top" },
        h(
          "div",
          { className: "brand" },
          h("b", null, "PyBe"),
          h("small", null, "Scenario-first Python"),
        ),
        h(
          "div",
          { className: "title" },
          h("small", null, "Learning Journey"),
          h("b", null, title),
        ),
        h("b", { className: "pct" }, Math.round(progress) + "%"),
      ),
      h(
        "div",
        { className: "bar" },
        h("i", { style: { width: progress + "%" } }),
      ),
      h(
        "nav",
        { className: "steps" },
        chapters.map((chapter, index) =>
          h(
            "button",
            {
              key: chapter,
              className: index === step ? "on" : index < step ? "done" : "",
              onClick: () => index <= step && onStepChange(index),
            },
            h("span", null, index < step ? "✓" : index + 1),
            h("small", null, chapter),
          ),
        ),
      ),
      h("section", { className: "stage" }, children),
      h(
        "footer",
        null,
        h(
          "button",
          {
            onClick: () => onStepChange(Math.max(0, step - 1)),
            disabled: !step,
          },
          "← Back",
        ),
        h("span", null, `Chapter ${step + 1} of ${chapters.length}`),
        h(
          "button",
          {
            onClick: () =>
              onStepChange(Math.min(chapters.length - 1, step + 1)),
            disabled: step === chapters.length - 1,
          },
          "Next →",
        ),
      ),
    );
  }
  return { Code, Feedback, Choice, ChapterShell, Completion };
}
