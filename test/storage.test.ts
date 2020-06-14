import { syncStorage } from '../src/storage';
import { arrayOfRandomStorageItems, keyName } from './utils';

beforeAll(async () => {
  await syncStorage.init();
});

afterAll(async () => {
  syncStorage.clear();
});
test('Stores Values and retrieves', async () => {
  let results = true;
  // assert new state
  const dataArray = arrayOfRandomStorageItems();
  dataArray.forEach(item => {
    syncStorage.setItem(item.key, item.data);

    const value = syncStorage.getItem(item.key);

    results = JSON.stringify(value) === JSON.stringify(item.data);
  });

  expect(results).toBe(true);
});

test('Removes item', async () => {
  const value = 'Value of String';
  syncStorage.setItem('@key', value);

  expect(syncStorage.getItem('@key')).toEqual(value);
  syncStorage.removeItem('@key');
  expect(syncStorage.getItem('@key')).toEqual(undefined);
});
test('Clears storage', async () => {
  expect(syncStorage.length).not.toEqual(0);
  syncStorage.clear();
  expect(syncStorage.length).toBe(0);
});

test('Gets allKeys', async () => {
  syncStorage.setItem('@key1', '');
  syncStorage.setItem('@key2', '');
  const results = ['@key1', '@key2'];
  expect(syncStorage.getAllKeys()).toEqual(results);
  syncStorage.clear();
});

test('Data subscription works', async () => {
  const key = keyName();
  let storageData = 'String Value';
  expect.assertions(2);

  const setItemPromise = () => {
    return new Promise(resolve => {
      const callback = jest.fn((data: any) => {
        expect(storageData).toEqual(data);
        unsubscribe();
        resolve();
      });

      const unsubscribe = syncStorage.subscribe(key, callback);

      syncStorage.setItem(key, storageData);
    });
  };

  const removeItemPromise = () => {
    return new Promise(resolve => {
      const callback = jest.fn((data: any) => {
        expect(data).toBe(undefined);
        unsubscribe();
        resolve();
      });

      const unsubscribe = syncStorage.subscribe(key, callback);

      syncStorage.removeItem(key);
    });
  };
  await setItemPromise();
  await removeItemPromise();
});
