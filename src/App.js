import React, {useState, useEffect} from 'react'
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import styled from 'styled-components';
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
import SelectPair from './components/SelectPair';
import Main from './components/Main';
import ExampleTokens from './components/ExampleTokens';

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
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
      <Main/>
    </RainbowKitProvider>
  </WagmiConfig>
  );
}

export default App;


const Wrapper = styled.div`
  background-color: #fbf2c4;
  height: 100%;
  width: 100%;
  // display: flex;
  // // flex-direction: column;
  // justify-content: center;
  // align-items: center;



`





