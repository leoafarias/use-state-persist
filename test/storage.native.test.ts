import { arrayOfRandomStorageItems } from './utils';
// @ts-ignore: Unreachable code error
import MockAsyncStorage from 'mock-async-storage';
import { syncStorage } from '../src/storage/storage.native';
import AsyncStorage from '@react-native-community/async-storage';
import { StorageItem } from '../src/storage/types';

// function timeout(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

const mock = () => {
  const mockImpl = new MockAsyncStorage();
  jest.mock('@react-native-community/async-storage', () => mockImpl);
};

const release = () => jest.unmock('@react-native-community/async-storage');

beforeAll(async () => {
  mock();
});

afterAll(async () => {
  release();
  syncStorage.clear();
});

test('Checks if loads', async () => {
  try {
    syncStorage.getItem('@key');
  } catch (err) {
    expect(err).toBeTruthy();
  }

  expect(syncStorage._private.loaded).toEqual(false);
  await syncStorage.init();
  expect(syncStorage._private.loaded).toEqual(true);
});

test('Stores Values and retrieves', async () => {
  let results: any = true;
  // assert new state
  const dataArray = arrayOfRandomStorageItems();
  dataArray.forEach(item => {
    syncStorage.setItem(item.key, item.data);

    const value = syncStorage.getItem(item.key);

    if (JSON.stringify(value) !== JSON.stringify(item.data)) {
      results = value;
    }
  });

  expect(results).toBe(true);
});

test('Can get all keys', async () => {
  const allKeys = syncStorage.getAllKeys();
  const asyncStorageAllKeys = await AsyncStorage.getAllKeys();
  expect(JSON.stringify(allKeys)).toEqual(JSON.stringify(asyncStorageAllKeys));
});

test('Maps local storage to memory', async () => {
  const item: StorageItem = ['@key', JSON.stringify('value')];
  syncStorage._private.mapToMemory(item);
});
test('Clears storage', async () => {
  expect(syncStorage.length).not.toEqual(0);
  syncStorage.clear();
  expect(syncStorage.length).toBe(0);
});

test('Data subscription works', async () => {
  const storageData = 'String Value';
  expect.hasAssertions();

  const eventPromise = () => {
    return new Promise(resolve => {
      const callback = jest.fn((data: any) => {
        expect(storageData).toEqual(data);
        unsubscribe();
        resolve();
      });

      const unsubscribe = syncStorage.subscribe('@eventKey', callback);

      syncStorage.setItem('@eventKey', storageData);
    });
  };

  await eventPromise();
});

test('Removes item', async () => {
  const value = 'Value of String';
  syncStorage.setItem('@key', value);

  expect(syncStorage.getItem('@key')).toEqual(value);
  syncStorage.removeItem('@key');
  expect(syncStorage.getItem('@key')).toEqual(undefined);
});
