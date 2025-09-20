import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const html = document.querySelector('html')
    if (html) {
      html.addEventListener('click', () => {
        setCount((c) => c + 1)
      })
    }
  }, [])
  return (
    <>
      <h1>Clicks: {count}</h1>
    </>
  )
}

export default App
