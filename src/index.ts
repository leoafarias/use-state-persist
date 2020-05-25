import {
  useEffect,
  useState,
  useCallback,
  SetStateAction,
  Dispatch,
} from 'react';
import { syncStorage } from './storage';

export const useStatePersist = <T>(
  key: string,
  value?: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(value);
  const [isStale, setIsStale] = useState(!!!value);

  useEffect(() => {
    loadInitialState();
  }, []);

  useEffect(() => {
    handlePersist(state);
  }, [state]);

  const loadInitialState = async () => {
    const payload = syncStorage.getItem(key);

    if (payload && isStale) {
      const data: T = JSON.parse(payload);
      setState(data);
    }
  };

  const updateState = (value: any) => {
    setIsStale(false);
    setState(value);
  };

  const handlePersist = useCallback(
    async (state: any) => {
      await syncStorage.ready();
      if (state === null || state === undefined) {
        syncStorage.removeItem(key);
      } else {
        syncStorage.setItem(key, JSON.stringify(value));
      }
    },
    [isStale]
  );

  return [state as T, updateState as Dispatch<SetStateAction<T>>];
};
