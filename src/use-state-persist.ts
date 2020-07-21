import { useEffect, useState, SetStateAction, Dispatch } from 'react';
import { syncStorage } from './storage';
import { storageNamespace } from './constants';
import equal from 'fast-deep-equal/es6';

export const useStatePersist = <T>(
  key: string,
  value?: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(value);

  // Storage namespace
  const storageKey = storageNamespace + key;

  useEffect(() => {
    initialState();

    const unsubscribe = syncStorage.subscribe(storageKey, (data: T) => {
      if (!equal(data, state)) {
        setState(data);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handlePersist(state);
  }, [state]);

  const initialState = async () => {
    await syncStorage.init();
    // If an initial value was set skip
    if (value) return;

    const data = syncStorage.getItem<T>(storageKey);
    setState(data);
  };

  const handlePersist = async (data: any) => {
    await syncStorage.init();
    if (!data) {
      syncStorage.removeItem(storageKey);
    } else {
      syncStorage.setItem(storageKey, data);
    }
  };

  return [state as T, setState as Dispatch<SetStateAction<T>>];
};
