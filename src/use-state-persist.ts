import {
  useEffect,
  useState,
  SetStateAction,
  Dispatch,
  useCallback,
} from 'react';
import { syncStorage } from './storage';
import { storageNamespace } from './constants';
import deepEquals from 'fast-deep-equal';

export const useStatePersist = <T>(
  key: string,
  initialValue?: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] => {
  // Storage namespace

  const [state, setState] = useState(() => {
    try {
      // Get from local storage by key
      const item = syncStorage.getItem<T>(storageNamespace + key);
      // Get item or else initial value

      return item ? item : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    const unsubscribe = syncStorage.subscribe(
      storageNamespace + key,
      (data: T) => {
        if (isState(data)) return;
        setState(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateState: Dispatch<SetStateAction<T>> = data => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = data instanceof Function ? data(state as T) : data;
      // Save state
      setState(valueToStore);
      // Save to local storage

      syncStorage.setItem(storageNamespace + key, valueToStore);
    } catch (error) {
      console.error(error);
    }
  };

  const isState = useCallback(
    (compareValue: any) => {
      return deepEquals(state, compareValue);
    },
    [state]
  );

  return [state as T, updateState];
};
