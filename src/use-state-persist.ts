import { useEffect, useState } from 'react';
import { syncStorage } from './storage';

export const useStatePersist = <T = any>(
  key: string,
  value?: T
): ReturnValues<T> => {
  const [state, setState] = useState<Value<T>>(value);

  useEffect(() => {
    loadInitialState();
  }, []);

  useEffect(() => {
    if (!state) {
      syncStorage.removeItem(key);
    } else {
      syncStorage.setItem(key, JSON.stringify(state));
    }
  }, [state]);

  const loadInitialState = async () => {
    await syncStorage.init();

    const payload = syncStorage.getItem(key);

    if (!payload) {
      setState(undefined);
    } else {
      const data: T = JSON.parse(payload);
      setState(data);
    }
  };

  return [state, setState];
};
