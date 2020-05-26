# Use State Persist

A simple React Hook to persist **useState** in local storage.

Works on the `Web` and `React Native`.

**Easily implement**

- Offline state
- Stale while revalidate flow
- Global state

```bash
npm install use-state-persist
# or
yarn add use-state-persist
```

## How to persists useState

Same behavior and API as `useState` so you can use it by easily replacing the `useState` hook for the calls which you want to persist offline.

```tsx
import { useStatePersist as useState } from 'use-state-persist';

const Component = () => {
  // Before
  //const [counter, setCounter] = useState(0);
  const [counter, setCounter] = useState('@counter', 0);

  return <CounterDisplay value={counter} />;
};
```

## Stale While Revalidate

```tsx
import { useStatePersist as useState } from 'use-state-persist';

const Component = () => {
  // Loads stale state
  const [data, setData] = useState('@data');

  const fetchData = async () => {
    // Fetches new state
    const data = await fetch('/endpoint');
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <DataDisplay value={data} />;
};
```

## Global State

Simple event system allows all the storage writes to be dispatched to all hooks . That means that all `useStatePersist()` can be used as a global state by sharing the same key `useStatePersist('@globalKey')`

To avoid that just make sure that the key being passed to the hook is unique `useStatePersist('@uniqueKey')`

```tsx
const CounterButton = () => {
  const [counter, setCounter] = useState('@counter');

  return <Button onClick={() => setCounter(counter => counter++)} />;
};
```

State will be updated across multiple components

```tsx
const ShowCounter = () => {
  const [counter, setCounter] = useState('@counter', 0);

  return <CounterDisplay value={counter} />;
};
```
