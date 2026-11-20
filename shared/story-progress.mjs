import { readProgress, saveProgress } from "../library/learning/core.mjs";
// Story-specific completion identities share storage rules, without prescribing
// chapter order or awarding points. Accept the authored caller's React version.
export function createStoryProgressHook(React) {
  return function useStoryProgress(collection) {
    const [completed, setCompleted] = React.useState(
      () => new Set(readProgress(localStorage, collection).completed),
    );
    const complete = React.useCallback(
      (id) =>
        setCompleted((previous) => {
          if (previous.has(id)) return previous;
          const next = new Set([...previous, id]);
          saveProgress(localStorage, collection, { completed: [...next] });
          return next;
        }),
      [collection],
    );
    return [completed, complete];
  };
}
