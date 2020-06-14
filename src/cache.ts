import { syncStorage } from './storage';
import { isFunction } from './utils';
import { storageNamespace, cacheKey } from './constants';

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
const checkAndInvalidate = async (invalidateKey: string) => {
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
