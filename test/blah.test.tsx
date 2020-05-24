import { renderHook, act } from '@testing-library/react-hooks';
import useStatePersist from '../src/index';

const payload = {
  string: 'Random Name',
  nestedObject: {
    string: 'String Nested',
    object: {
      first: 1,
      second: 'Two',
    },
    array: ['first', { object: 'Object' }],
  },
};

test('Allows to add useStatePersist', async () => {
  const { result } = renderHook(() => useStatePersist('@stateKey'));
  const [state, setState] = result.current;
  // assert initial state
  expect(state).toBe(undefined);
  expect(setState).toBeTruthy();
});

test('Allows to change state', async () => {
  const { result } = renderHook(() => useStatePersist('@stateKey'));
  const [state, setState] = result.current;

  // add second value
  act(() => {
    setState(payload);
  });
  // assert new state
  expect(state).toEqual(payload);

  act(() => {
    setState(undefined);
  });
});
