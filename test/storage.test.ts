import { syncStorage } from '../src/storage';
import { arrayOfRandomStorageItems } from './utils';

beforeAll(async () => {
  await syncStorage.init();
});

afterAll(async () => {
  syncStorage.clear();
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
