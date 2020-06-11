import {
  useEffect,
  useState,
  SetStateAction,
  Dispatch,
  useCallback,
} from 'react';
import { syncStorage } from './storage';

export const storageNamespace = '@useStatePerist:';

export const clearState = async () => {
  await syncStorage.init();
  const keys = syncStorage.getAllKeys();
  keys.forEach(k => {
    if (k.startsWith(storageNamespace)) {
      syncStorage.removeItem(k);
    }
  });
};

export const useStatePersist = <T>(
  key: string,
  value?: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(value);

  // Storage namespace
  const storageKey = storageNamespace + key;

  useEffect(() => {
    initialState();
    const unsubscribe = syncStorage.subscribe(storageKey, (data: T) => {
      if (!data) {
        setState(undefined);
      } else {
        setState(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const initialState = async () => {
    await syncStorage.init();
    const data = syncStorage.getItem<T>(storageKey);

    if (data) {
      setState(data);
    }
  };

  const updateState = useCallback(
    async (data: any) => {
      await syncStorage.init();
      const newState = JSON.stringify(data);
      const currentState = JSON.stringify(state);
      const storedState = JSON.stringify(syncStorage.getItem<T>(storageKey));

      if (newState === currentState) return;
      setState(data);

      // Do not store if already saved
      if (newState === storedState) return;
      handlePersist(data);
    },
    [state]
  );

  const handlePersist = async (data: any) => {
    if (data === null || data === undefined) {
      syncStorage.removeItem(storageKey);
    } else {
      syncStorage.setItem(storageKey, data);
    }
  };

  return [state as T, updateState as Dispatch<SetStateAction<T>>];
};
