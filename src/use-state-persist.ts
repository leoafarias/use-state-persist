import {
  useEffect,
  useState,
  SetStateAction,
  Dispatch,
  useCallback,
} from 'react';
import { isFunction } from './utils';
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
        setState(data);
      } else {
        setState(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const initialState = async () => {
    await syncStorage.init();
    const data = syncStorage.getItem<T>(storageKey);

    setState(data);
  };

  const updateState = useCallback(
    async (data: any | ((prevState: T) => T)) => {
      let value = data;
      // Could be an anonymous function
      if (isFunction(data)) value = data(state);

      await syncStorage.init();
      const newState = JSON.stringify(value);
      const currentState = JSON.stringify(state);
      const storedState = JSON.stringify(syncStorage.getItem<T>(storageKey));

      if (newState === currentState) return;
      setState(value);

      // Do not store if already saved
      if (newState === storedState) return;
      handlePersist(value);
    },
    [state]
  );

  const handlePersist = async (data: any) => {
    syncStorage.init();
    if (data === null || data === undefined) {
      syncStorage.removeItem(storageKey);
    } else {
      syncStorage.setItem(storageKey, data);
    }
  };

  return [state as T, updateState as Dispatch<SetStateAction<T>>];
};
