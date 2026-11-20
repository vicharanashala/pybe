// Translate an authored story's #/page/... addresses into its PyBe route.
// The story retains its own page state and real browser Back/Forward entries.
export function createAuthoredRoute(realWindow, studyId) {
  const prefix = `#study/${studyId}/story`;
  const location = {
    get hash() {
      const hash = realWindow.location.hash;
      return hash.startsWith(prefix)
        ? "#" + (hash.slice(prefix.length) || "/")
        : "#/";
    },
    set hash(value) {
      realWindow.location.hash = prefix + String(value).replace(/^#/, "");
    },
  };
  const history = {
    replaceState(data, title, url) {
      realWindow.history.replaceState(
        data,
        title,
        prefix + String(url).replace(/^#/, ""),
      );
    },
    pushState(data, title, url) {
      realWindow.history.pushState(
        data,
        title,
        prefix + String(url).replace(/^#/, ""),
      );
    },
    back: () => realWindow.history.back(),
    forward: () => realWindow.history.forward(),
    go: (n) => realWindow.history.go(n),
  };
  return { location, history };
}
