import { useEffect, useState, useCallback } from "react";

const storage = {
  provider:
}

export const useAppState = <T>(key: string, value?: T): ReturnValues<T> => {
  const [state, setState] = useState<Value<T>>(value);
  const [isStale, setIsStale] = useState(true);

  // Checks if value is stale
  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    setIsStale(value === undefined);
    const payload = localStorage.getItem(key);
    if (!payload) {
      setState(undefined);
      return;
    }
    const data: T = JSON.parse(payload);
    setState(data);
  };

  const setNewState = useCallback(
    async (value: T) => {
      setState(value);
      setIsStale(false);

      localStorage.setItem(key, JSON.stringify(value));
    },
    [setState]
  );

  return [state, setNewState, isStale];
};
