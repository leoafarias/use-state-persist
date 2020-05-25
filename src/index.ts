import {
  useEffect,
  useState,
  SetStateAction,
  useCallback,
  Dispatch,
} from 'react';
import { syncStorage } from './storage';

export const useStatePersist = <T = any>(
  key: string,
  value?: T
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
  const [state, setState] = useState(value);
  const [isStale, setIsStale] = useState(!!!value);

  useEffect(() => {
    loadInitialState();
  }, []);

  useEffect(() => {
    handlePersist(state);
  }, [state]);

  const loadInitialState = async () => {
    await syncStorage.ready();
    const payload = syncStorage.getItem(key);

    if (payload && isStale) {
      const data: T = JSON.parse(payload);
      setState(data);
    }
  };

  const updateState: React.Dispatch<SetStateAction<T | undefined>> = value => {
    setIsStale(false);
    setState(value);
  };

  const handlePersist = useCallback(
    async (state: T | undefined) => {
      await syncStorage.ready();
      if (state === null || state === undefined) {
        syncStorage.removeItem(key);
      } else {
        syncStorage.setItem(key, JSON.stringify(value));
      }
    },
    [isStale]
  );

  return [state, updateState];
};
