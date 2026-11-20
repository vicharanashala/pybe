import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(
  await readFile(path.join(root, "shared/lesson-registry.json"), "utf8"),
);
async function htmlLesson(definition) {
  const content = JSON.parse(
    await readFile(path.join(root, definition.output), "utf8"),
  );
  return {
    kind: "html",
    ...content,
    module: definition.module,
    baseURL: definition.baseURL,
    completionSelector: definition.completionSelector,
    layout: definition.layout,
    slug: definition.slug,
    route: definition.route,
    scopedHash: definition.scopedHash,
    theme: definition.theme,
  };
}
export async function getLesson(studyId) {
  const study = registry.studies[studyId];
  if (!study) return null;
  const relative = registry.collections[study.collection];
  if (relative?.kind === "book") {
    const pages = await Promise.all(relative.pages.map(htmlLesson)),
      sharedStyles = [],
      styleIndexes = new Map();
    const content = pages.map(({ styles, ...page }) => ({
      ...page,
      styleIds: styles.map((style) => {
        const key = JSON.stringify(style);
        if (!styleIndexes.has(key)) {
          styleIndexes.set(key, sharedStyles.length);
          sharedStyles.push(style);
        }
        return styleIndexes.get(key);
      }),
    }));
    return {
      studyId,
      collection: study.collection,
      kind: "book",
      sharedStyles,
      pages: content,
    };
  }
  if (relative?.kind === "html") {
    return {
      studyId,
      collection: study.collection,
      ...(await htmlLesson(relative)),
    };
  }
  if (relative?.kind === "component")
    return {
      studyId,
      collection: study.collection,
      kind: "component",
      component: relative.component,
      layout: relative.layout,
    };
  if (typeof relative === "object") {
    const steps = JSON.parse(
      await readFile(path.join(root, relative.output), "utf8"),
    );
    return {
      studyId,
      collection: study.collection,
      kind: relative.kind,
      steps,
      fixtures: relative.fixtures || {},
    };
  }
  const topics = JSON.parse(await readFile(path.join(root, relative), "utf8"));
  return {
    studyId,
    collection: study.collection,
    inspectVariables: study.inspectVariables,
    reasoningDelay: study.reasoningDelay,
    topics,
  };
}
