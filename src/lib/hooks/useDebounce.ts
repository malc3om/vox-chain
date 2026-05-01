/**
 * Debounce utility hook.
 *
 * Returns a debounced version of the input value that only
 * updates after `delay` ms of inactivity. Useful for search
 * inputs to avoid excessive re-renders and API calls.
 */

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
