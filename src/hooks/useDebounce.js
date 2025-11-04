// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * A custom hook that delays updating a value.
 * @param {*} value The value to debounce (e.g., the search query)
 * @param {number} delay The delay in milliseconds
 * @returns The debounced value
 */
function useDebounce(value, delay) {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set a timer to update the debounced value after the delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // This is the cleanup function:
      // It clears the timer if the value or delay changes
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-run if value or delay changes
  );

  return debouncedValue;
}

export default useDebounce;