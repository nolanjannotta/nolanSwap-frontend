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
import CreatePair from './components/CreatePair';
import ExampleTokens from './components/ExampleTokens';
import CustomConnect from "./components/CustomConnect"

function App() {

const factory = "0xC9a43158891282A2B1475592D5719c001986Aaec"
const schrute = "0x1c85638e118b37167e9298c2268758e058DdfDA0"
const stanley = "0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb"  

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
    appName: 'My RainbowKit App',
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
      <Wrapper>   
        <AccountDetails>
          <CustomConnect></CustomConnect>
      </AccountDetails>    
          <ExampleTokens schrute={schrute} stanley={stanley}></ExampleTokens>       
          <CreatePair factory={factory}></CreatePair>
          <SelectPair factory={factory}></SelectPair>
       </Wrapper>  
    </RainbowKitProvider>
  </WagmiConfig>
  );
}

export default App;


const Wrapper = styled.div`
background-color: #fbf2c4;
min-height: 100vh;
display: flex;
// flex-direction: column;
justify-content: space-evenly;
align-items: center;



`

const AccountDetails = styled.div`
position: absolute;
top: 0;
right: 0;



`


