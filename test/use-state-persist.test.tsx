import { renderHook, act } from '@testing-library/react-hooks';
import { useStatePersist } from '../src';
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

// function timeout(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

beforeAll(async () => {
  await syncStorage.init();
  syncStorage.clear();
});

test('Allows to add useStatePersist', async () => {
  const key = keyName();
  const { result, waitForNextUpdate } = renderHook(() =>
    useStatePersist<any>(key)
  );

  // result.current[0] = state
  // result.current[1] = setState / updateState
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

  act(() => {
    syncStorage.setItem(key, value);
  });

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

  // result.current[0] = state
  // result.current[1] = setState / updateState

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
