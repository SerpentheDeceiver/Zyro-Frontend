import { useCallback, useEffect, useState } from 'react';

/**
 * Like useState but backed by localStorage.
 * Cross-component reactive: when any component calls the setter, every other
 * component using the same key re-renders with the new value — even in the same tab.
 *
 * How it works:
 *  - The setter writes to localStorage AND dispatches a synthetic StorageEvent.
 *  - The native 'storage' event only fires across tabs; we dispatch it manually
 *    so same-tab subscribers (e.g. HomePage listening to Navbar's location change)
 *    also receive it.
 *  - Every instance of the hook with the same key adds a 'storage' listener and
 *    syncs its local state whenever the event fires.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Setter: persist → notify all same-key hook instances in this tab
  const set = useCallback(
    (nextValue) => {
      const resolved =
        typeof nextValue === 'function'
          ? nextValue(JSON.parse(localStorage.getItem(key) ?? 'null') ?? initialValue)
          : nextValue;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
        // Dispatch manually because the native StorageEvent skips the originating tab
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(resolved),
            storageArea: localStorage,
          })
        );
      } catch {
        setValue(resolved);
      }
    },
    [key, initialValue]
  );

  // Listener: sync this instance when any setter (same tab or another tab) fires
  useEffect(() => {
    function onStorage(e) {
      if (e.storageArea !== localStorage || e.key !== key) return;
      try {
        setValue(e.newValue !== null ? JSON.parse(e.newValue) : initialValue);
      } catch {
        setValue(initialValue);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, initialValue]);

  return [value, set];
}

export default useLocalStorage;
