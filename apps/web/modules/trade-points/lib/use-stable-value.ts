import { useRef } from "react";

export function useStableValue<T>(value: T): T {
  const ref = useRef<{ key: string; value: T }>({
    key: JSON.stringify(value),
    value,
  });
  const newKey = JSON.stringify(value);
  if (newKey !== ref.current.key) {
    ref.current = { key: newKey, value };
  }
  return ref.current.value;
}
