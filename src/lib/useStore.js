import { useEffect, useRef, useSyncExternalStore } from "react";

// `getServerSnapshot` lets a store report a fixed value for the hydration
// pass, independent of whatever the live store already holds by the time
// this component mounts. Pass it whenever a store's value can be mutated
// client-side (e.g. from localStorage) to a value SSR could never have
// rendered — otherwise React may log a hydration mismatch depending on the
// order independent Astro islands happen to hydrate in.
export function useStore(store, getServerSnapshot) {
  const onStoreChangeRef = useRef(null);

  const value = useSyncExternalStore(
    (onStoreChange) => {
      onStoreChangeRef.current = onStoreChange;
      return store.listen(() => onStoreChange());
    },
    () => store.get(),
    getServerSnapshot ?? (() => store.get())
  );

  useEffect(() => {
    // Astro's `client:visible`/`client:idle` islands can hydrate well after
    // page load — possibly after the live store has already diverged from
    // whatever `getServerSnapshot` reported (e.g. the language was switched
    // before this island ever mounted). Nanostores' `.listen()` only fires
    // on *future* changes, so a late-mounting subscriber would otherwise be
    // stuck rendering the stale hydration snapshot forever. Nudge a
    // re-render once, right after mount, so it picks up the true live value.
    if (getServerSnapshot && store.get() !== getServerSnapshot()) {
      onStoreChangeRef.current?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}
