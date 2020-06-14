import { renderHook, act } from '@testing-library/react-hooks';
import {
  useStatePersist,
  clearState,
  storageNamespace,
  invalidateCache,
} from '../src';
import { syncStorage } from '../src/storage';
import { useState } from 'react';
import { keyName } from './utils';

const payload = {
  string: 'Payload 1',
  nestedObject: {
    string: 'String Nested',
    object: {
      first: 1,
      second: 'Two',
    },
    array: ['first', { object: 'Object' }],
  },
};

beforeAll(async () => {
  await syncStorage.init();
});

beforeEach(() => {
  syncStorage.clear();
});

test('Allows to add useStatePersist', async () => {
  const key = keyName();
  const { result, waitForNextUpdate } = renderHook(() =>
    useStatePersist<any>(key)
  );

  // assert initial state
  expect(result.current[0]).toBe(undefined);

  act(() => {
    result.current[1](payload);
  });

  await waitForNextUpdate();

  // assert new state
  expect(result.current[0]).toEqual(payload);
});

test('State persists', async () => {
  const key = keyName();
  const value = 'PERSISTED_STATE_VALUE';
  const newValue = 'NEW_PERSISTED_STATE_VALUE';

  syncStorage.setItem(storageNamespace + key, value);

  const { result, waitForNextUpdate } = renderHook(() => useStatePersist(key));

  await waitForNextUpdate();

  // assert initial state
  expect(result.current[0]).toBe(value);

  act(() => {
    result.current[1](newValue);
  });

  await waitForNextUpdate();

  expect(result.current[0]).toBe(newValue);
});

test('Behaves like useState', async () => {
  const key = keyName();
  const { result, waitForNextUpdate } = renderHook(() =>
    useStatePersist(key, 0)
  );
  const { result: stateResult } = renderHook(() => useState(0));

  // assert initial state
  expect(stateResult.current[0]).toBe(0);
  expect(result.current[0]).toBe(0);

  act(() => {
    stateResult.current[1](count => count + 1);
    result.current[1](count => count + 1);
  });

  await waitForNextUpdate();

  // assert new state
  expect(stateResult.current[0]).toEqual(1);
  expect(result.current[0]).toEqual(1);

  act(() => {
    stateResult.current[1](6);
    result.current[1](6);
  });

  await waitForNextUpdate();

  expect(stateResult.current[0]).toBe(6);
  expect(result.current[0]).toBe(6);
});

test('Can set value to null or undefined', async () => {
  // Can set to undefined
  const key = keyName();
  type HookValue = number | undefined | null;
  const { result, waitForNextUpdate } = renderHook(() =>
    useStatePersist<HookValue>(key, 0)
  );
  const { result: stateResult } = renderHook(() => useState<HookValue>(0));

  act(() => {
    result.current[1](undefined);
    stateResult.current[1](undefined);
  });

  await waitForNextUpdate();

  expect(result.current[0]).toBe(undefined);
  expect(stateResult.current[0]).toBe(undefined);
});

test('Clears state', async () => {
  syncStorage.setItem(storageNamespace + '@one', '');
  syncStorage.setItem(storageNamespace + '@two', '');
  let keys = syncStorage.getAllKeys();
  expect(keys.length).toBeGreaterThan(0);

  await clearState();
  keys = syncStorage.getAllKeys();
  expect(keys.length).toBe(0);

  const key = keyName();
  const value = 'CLEAR_STATE_VALUE';
  const { result, waitForNextUpdate } = renderHook(() =>
    useStatePersist(key, value)
  );

  expect(result.current[0]).toEqual(value);

  await act(async () => {
    clearState();
    await waitForNextUpdate();
  });

  expect(result.current[0]).toEqual(undefined);
});

describe('Cache Invalidation', () => {
  const key1 = storageNamespace + '@cacheInvalidate1';
  const key2 = storageNamespace + '@cacheInvalidate2';
  test('Invalidates without initial key', async () => {
    syncStorage.setItem(key1, 'VALUE1');
    syncStorage.setItem(key2, 'VALUE2');

    // Check that values exist
    expect(syncStorage.length).toEqual(2);
    await invalidateCache('CACHE_KEY');
    // invalidateCache('CACHE_KEY');

    expect(syncStorage.getItem(key1)).toBeUndefined();
    expect(syncStorage.getItem(key2)).toBeUndefined();
  });

  test('Invalidates with initial key', async () => {
    await invalidateCache('INITIAL_KEY');
    syncStorage.setItem(key1, 'VALUE1');
    syncStorage.setItem(key2, 'VALUE2');

    // Check that values exist
    expect(syncStorage.getItem(key1)).toEqual('VALUE1');
    expect(syncStorage.getItem(key2)).toEqual('VALUE2');

    await invalidateCache('NEW_CACHE_KEY');
    // invalidateCache('CACHE_KEY');

    expect(syncStorage.getItem(key1)).toBeUndefined();
    expect(syncStorage.getItem(key2)).toBeUndefined();
  });

  test('Can send promise to invalidate cache', async () => {
    await invalidateCache('INITIAL_KEY');
    syncStorage.setItem(key1, 'VALUE1');
    syncStorage.setItem(key2, 'VALUE2');

    // Check that values exist
    expect(syncStorage.getItem(key1)).toEqual('VALUE1');
    expect(syncStorage.getItem(key2)).toEqual('VALUE2');

    await invalidateCache(
      () => new Promise(resolve => resolve('NEW_CACHE_KEY'))
    );
    // invalidateCache('CACHE_KEY');

    expect(syncStorage.getItem(key1)).toBeUndefined();
    expect(syncStorage.getItem(key2)).toBeUndefined();
  });
});
