import React from 'react'
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import "./components/SwapContainer"
import Main from './components/Main';

function App() {

  const { chains, provider } = configureChains(
    [chain.foundry],
    [
      jsonRpcProvider({
        rpc: () => ({http: 'http://127.0.0.1:8545'}),
      }),
    ]
  );

  console.log(chain.foundry)
  const { connectors } = getDefaultWallets({
    appName: 'Nolan Swap',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  
  return (
    // <div className="App">    
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
      <Main/>
    </RainbowKitProvider>
  </WagmiConfig>
  // </div>
  );
}

export default App;






