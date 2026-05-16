import './UseMemoPage.css'

import { useMemo, useState} from 'react';

import { initialItems } from '../../utils/initialItems'

interface DemoProps {}

export default function UseMemoPage({}: DemoProps) {
  const [count, setCount] = useState(0);
  const [items] = useState(initialItems);

  // expensive slow operation
  const selectedItem = useMemo(
    () => items.find((item) => item.id === count),  // prev: item.isSelected
    [items, count]
  );

  return <main className="use-state-page">
    <h1>Use Memo Page</h1>

    <h2>Count: {count}</h2>
    <h2>Selected Items: {selectedItem?.id}</h2>
    <button onClick={() => setCount(count + 1)}>Increment</button>

  </main>
}
