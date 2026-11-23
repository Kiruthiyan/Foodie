import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing a value.
 * Used for Smart Search to prevent API queries on every keystroke.
 * @param value The input value
 * @param delay Delay in milliseconds (default 350ms)
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
