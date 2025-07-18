import {  useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)

  async function fetchCssUrl() {
    try {
      const response = await axios.get<{ url: string }>('http://localhost:3000/api/v1/tokens?platform=web'); // seu endpoint que gera presigned URL
      const data =  response.data

      if (!data.url) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = data.url;
      document.head.appendChild(link);

    } catch (error) {
      console.error('Erro ao buscar URL do CSS:', error);
    }
  }

  useEffect(() => {
    fetchCssUrl();
  }, []);

  return (
    <>
      <div className="bg-brand-primary-50">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <div className="bg-color-primary-900 p-4">
        Testando cor primária 900 com variável CSS
      </div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
