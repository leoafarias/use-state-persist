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
const cacheKey = '@useStatePersistCacheKey';

export const invalidateCache = async (
  invalidateKey: string | (() => Promise<string>)
) => {
  let value: string;
  if (isFunction(invalidateKey)) {
    value = await (invalidateKey as () => Promise<string>)();
  } else {
    value = invalidateKey as string;
  }
  await checkAndInvalidate(value);
};

// Need to be async to make sure storage is initialized
export const checkAndInvalidate = async (invalidateKey: string) => {
  await syncStorage.init();
  const key = syncStorage.getItem(cacheKey);
  if (invalidateKey !== key) {
    await clearState();
    syncStorage.setItem(cacheKey, invalidateKey);
  }
};

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
      setState(data);
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
      await syncStorage.init();
      let value = data;
      // Could be an anonymous function
      if (isFunction(data)) value = data(state);

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
    if (!data) {
      syncStorage.removeItem(storageKey);
    } else {
      syncStorage.setItem(storageKey, data);
    }
  };

  return [state as T, updateState as Dispatch<SetStateAction<T>>];
};
