import './UseStatePage.css'

import {useState} from 'react';

interface DemoProps {}

export default function UseStatePage({}: DemoProps) {

  const [count, setCount] = useState(0);

  return <main className="use-state-page">
    <h1>UseState</h1>
    <h2>Count: {count}</h2>
    <button onClick={() => setCount(count + 1)}>Increment</button>
    <button onClick={() => setCount(count - 1)}>Decrement</button>
  </main>
}
