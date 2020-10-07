# Use State Persist

![CI](https://github.com/leoafarias/use-state-persist/workflows/CI/badge.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/leoafarias/use-state-persist/badge.svg?branch=master)](https://coveralls.io/github/leoafarias/use-state-persist?branch=master) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/9b1c2ea8d9c84c2bb37a49b2adce88a5)](https://app.codacy.com/manual/leo/use-state-persist?utm_source=github.com&utm_medium=referral&utm_content=leoafarias/use-state-persist&utm_campaign=Badge_Grade_Dashboard) [![npm version](https://badgen.net/npm/v/use-state-persist)](https://www.npmjs.com/package/use-state-persist)

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

## Cache Invalidation

There are some cases where you might want to clear all the local storage cache for the hook, pending a certain change in state in the app.

This will clear all the local storage items use by the `useStatePersist` hook when the key changes.

### Use Cases

- User/App State changes
- User Log out
- Environment variable changes

```tsx
import { invalidateCache } from 'use-state-persist';

invalidateCache('CACHE_KEY');

// You can also send a promise which will compare the result
invalidateCache(async () => 'CACHE_KEY');
```

### React Native

Init prepares the SyncStorage to work synchronously, by getting all values for all keys stored on AsyncStorage. You can use the init method on the web without any side effects to keep code consistency.

```typescript
import { syncStorage } from 'use-state-persist';

await syncStorage.init();
```
