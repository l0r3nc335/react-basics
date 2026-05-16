import './UseEffectPage.css'
import {useState, useEffect} from 'react';

interface DemoProps {}

export default function UseEffect({}: DemoProps) {

  const [count, setCount] = useState(0);

  useEffect(() => {
    // Code to run
    console.log("The count is: ", count)

    // Optional return Function or Cleanup function
    return () => {
      console.log("Cleaning up...")
    }
  }, [count]); // Dependency Array

  return <main className="use-state-page">
    <h1>Use Effects</h1>

    <h2>Count: {count}</h2>
    <button onClick={() => setCount(count + 1)}>Increment</button>
    <button onClick={() => setCount(count - 1)}>Decrement</button>
  </main>
}
