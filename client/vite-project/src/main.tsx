import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThirdwebProvider, metamaskWallet,coinbaseWallet, walletConnect, rainbowWallet, trustWallet} from "@thirdweb-dev/react";

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "",
      },
    }),
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {/* CHANGE THIS IF LOCAL TESTNET OR MAINNET */}
      <ThirdwebProvider 
        supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect(), rainbowWallet(), trustWallet()]}
        activeChain="goerli" 
        clientId="f040e4ca2a016065c0cb8c64b651338a"> 
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThirdwebProvider>
    </ChakraProvider>
  </React.StrictMode>,
)