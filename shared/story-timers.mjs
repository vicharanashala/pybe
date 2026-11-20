import { createTimerGroup } from "../library/learning/timer-group.mjs";
export function createStoryTimersHook(React) {
  return function useStoryTimers() {
    const group = React.useMemo(() => createTimerGroup(), []);
    React.useEffect(() => {
      group.activate();
      return () => group.dispose();
    }, [group]);
    return group;
  };
}
