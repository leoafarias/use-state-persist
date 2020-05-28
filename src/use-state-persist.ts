import {
  useEffect,
  useState,
  SetStateAction,
  Dispatch,
  useCallback,
} from 'react';
import { syncStorage } from './storage';

export const useStatePersist = <T>(
  key: string,
  value?: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(value);

  useEffect(() => {
    initialState();
    // const unsubscribe = syncStorage.subscribe(key, (data: T) => {
    //   setState(data);
    // });

    // return () => unsubscribe();
  }, []);

  const initialState = async () => {
    await syncStorage.init();
    const data = syncStorage.getItem<T>(key);

    if (data) {
      setState(data);
    }
  };

  const updateState = useCallback(
    async (data: any) => {
      await syncStorage.init();
      const newState = JSON.stringify(data);
      const currentState = JSON.stringify(state);
      const storedState = JSON.stringify(syncStorage.getItem<T>(key));

      if (newState === currentState) return;

      setState(data);

      if (newState === storedState) return;
      handlePersist(data);
    },
    [state]
  );

  const handlePersist = async (data: any) => {
    syncStorage.init();
    if (data === null || data === undefined) {
      syncStorage.removeItem(key);
    } else {
      syncStorage.setItem(key, data);
    }
  };

  return [state as T, updateState as Dispatch<SetStateAction<T>>];
};
