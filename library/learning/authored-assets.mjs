// One asset resolver for native DOM stories and React scene portals. Authored
// relative image paths continue to resolve from the submission, not PyBe's URL.
export function observeAuthoredAssets(root, { baseURL, publicRoot = null }) {
  const resolve = () => {
    for (const node of root.querySelectorAll("[src],[poster]"))
      for (const key of ["src", "poster"]) {
        const value = node.getAttribute(key);
        if (!value) continue;
        const target =
          publicRoot && value.startsWith("/assets/")
            ? new URL(publicRoot + value, location.origin).href
            : !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(value) && baseURL
              ? new URL(value, baseURL).href
              : null;
        if (target && target !== value) node.setAttribute(key, target);
      }
  };
  const observer = new MutationObserver(resolve);
  observer.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["src", "poster"],
  });
  resolve();
  return observer;
}
