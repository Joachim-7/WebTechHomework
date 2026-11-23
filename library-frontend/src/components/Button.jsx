import { useState } from 'react'

export default function Button() {
  const [count, setCount] = useState(0)

  function increment() {
    setCount(count + 1)
  }

  return (
    <div>
      <button type="button" onClick={increment}>Click me {count}</button>
    </div>
  )
}