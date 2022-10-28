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

const factory = "0x6C2d83262fF84cBaDb3e416D527403135D757892"
const schrute = "0xFD6F7A6a5c21A3f503EBaE7a473639974379c351"
const stanley = "0xa6e99A4ED7498b3cdDCBB61a6A607a4925Faa1B7"  

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


