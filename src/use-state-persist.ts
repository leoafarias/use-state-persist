import {useEffect, useState, useCallback} from 'react';
import {syncStorage} from './storage';

export const useStatePersist = <T>(key: string, value?: T): ReturnValues<T> => {
  const [state, setState] = useState<Value<T>>(value);
  const [isStale, setIsStale] = useState(true);

  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    await syncStorage.init();
    setIsStale(value === undefined);
    const payload = syncStorage.getItem(key);
    if (!payload) {
      setState(undefined);
      return;
    }
    const data: T = JSON.parse(payload);
    setState(data);
  };

  const setNewState = useCallback(
    async (value: T) => {
      const currentState = JSON.stringify(state);
      const newState = JSON.stringify(value);

      if (currentState !== newState) {
        setState(value);
        setIsStale(false);
        syncStorage.setItem(key, newState);
      }
    },
    [setState]
  );

  return [state, setNewState, isStale];
};
