import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStatePersist } from '../.';

const App = () => {
  const [state, setState] = useStatePersist<number>('@key-test', 0);
  const increment = () => {
    setState(state => state++);
  };
  const decrement = () => {
    setState(state => state--);
  };
  return (
    <div>
      <div>{state}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
