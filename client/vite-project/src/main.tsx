import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './pages/App.tsx'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThirdwebProvider } from "@thirdweb-dev/react";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <ThirdwebProvider activeChain="ethereum"> */}
          <App />
      {/* </ThirdwebProvider> */}
    </BrowserRouter>
  </React.StrictMode>,
)
