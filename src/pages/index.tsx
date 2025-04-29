// A very bad React component
import React, { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState(null)
  const [input, setInput] = useState("")

  useEffect(() => {
    fetch('https://example.com/data') // No error handling, insecure HTTP fetch
      .then(response => response.json())
      .then(setData);
  }, [])

  function clickHandler() {
    eval(input); // HUGE SECURITY FLAW: Running user input directly
    alert("clicked!")
  }

  function renderItems() {
    return data.map((item, i) => <div key={i}>{item.name}</div>) // Bad keys usage
  }

  return (
    <div style={{color: 'blue', marginLeft: '10px', border: '1px solid red'}}> {/* Inline styles */}
      <h1>Hello World</h1>
      <input value={input} onChange={e => setInput(e.target.value)} /> {/* No validation */}
      <button onClick={clickHandler}>Click Me</button>
      <div>{data && renderItems()}</div>
    </div>
  )
}