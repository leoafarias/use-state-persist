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
    const unsubscribe = syncStorage.subscribe(key, data => setState(data));
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    const data = syncStorage.getItem<T>(key);

    if (data && isStale) {
      setState(data);
    }
  };

  const updateState = (value: any) => {
    setIsStale(false);
    setState(value);
    persistState(value);
  };

  const persistState = async (value: any) => {
    await syncStorage.init();
    if (value === null || value === undefined) {
      syncStorage.removeItem(key);
    } else {
      syncStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [state as T, updateState as Dispatch<SetStateAction<T>>];
};
