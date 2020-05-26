import { renderHook, act } from '@testing-library/react-hooks';
import { useStatePersist } from '../src';
import { syncStorage } from '../src/storage';
import { useState } from 'react';

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
  const { result } = renderHook(() => useStatePersist<any>('@stateKey'));

  // result.current[0] = state
  // result.current[1] = setState / updateState

  // assert initial state
  expect(result.current[0]).toBe(undefined);

  act(() => {
    result.current[1](payload);
  });

  // assert new state
  expect(result.current[0]).toEqual(payload);
});

test('State persists', async () => {
  const value = 'PERSISTED_STATE_VALUE';
  const newValue = 'NEW_PERSISTED_STATE_VALUE';
  syncStorage.setItem('@persistedState', value);
  const { result } = renderHook(() => useStatePersist<any>('@persistedState'));

  // assert initial state
  expect(result.current[0]).toBe(value);

  act(() => {
    result.current[1](newValue);
  });

  expect(result.current[0]).toBe(newValue);
});

test('Behaves like useState', async () => {
  const { result } = renderHook(() => useStatePersist('@count', 0));
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

  // assert new state
  expect(stateResult.current[0]).toEqual(1);
  expect(result.current[0]).toEqual(1);

  act(() => {
    stateResult.current[1](6);
    result.current[1](6);
  });

  expect(stateResult.current[0]).toBe(6);
  expect(result.current[0]).toBe(6);
});
