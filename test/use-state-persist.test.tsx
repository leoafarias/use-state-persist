import { renderHook, act } from '@testing-library/react-hooks';
import { useStatePersist } from '../src';
import { syncStorage } from '../src/storage';
import { useState } from 'react';

const payload = {
  string: 'String',
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
  await syncStorage.ready();
  syncStorage.clear();
});

test('Allows to add useStatePersist', async () => {
  const { result } = renderHook(() => useStatePersist<any>('@stateKey'));

  // result.current[0] = state
  // result.current[1] = setState / updateState

  // assert initial state
  expect(result.current[0]).toBe(undefined);
  console.log('testState:', result.current[0]);

  act(() => {
    result.current[1](payload);
  });

  // assert new state
  expect(result.current[0]).toEqual(payload);

  act(() => {
    result.current[1](undefined);
  });

  expect(result.current[0]).toBe(undefined);
});

test('Can useStatePersist with a callback', async () => {
  const { result } = renderHook(() => useStatePersist<number>('@count', 0));
  const { result: stateResult } = renderHook(() => useState<number>(0));

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

  act(() => {
    stateResult.current[1](6);
  });

  expect(stateResult.current[0]).toBe(6);
});
