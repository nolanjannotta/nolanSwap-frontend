import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {ConnectButton} from '@rainbow-me/rainbowkit';
import { useAccount, useContract, useProvider, useSigner,usePrepareContractWrite, useContractWrite } from 'wagmi'
import SwapContainer from './SwapContainer';
import MockERC20Abi  from "../ABI/MockERC20"
import PoolFactoryAbi from "../ABI/PoolFactory"
import { utils } from "ethers";



function SelectPair(props) {

const { address, isConnected } = useAccount();

const [token1, setToken1]= useState("")
const [token2, setToken2]= useState("")



const [pool, setPool] = useState("");

const provider = useProvider();
 
const poolFactory = useContract({
    addressOrName: props.factory,
    contractInterface: PoolFactoryAbi,
    signerOrProvider: provider
});

const getTokenBalance = async() => {

}

const getPool = async() => {
    if(utils.isAddress(token1) && utils.isAddress(token2)) {
        let pool = await poolFactory.getPool(token1,token2);
        setPool(pool);
        console.log(pool)
    }
}


useEffect(()=> {
    if(isConnected) {
      getPool();  
    }

},[token1, token2])





  return (
    <Container>
        {/* {!isConnected 
        ? <ConnectButton>connect</ConnectButton>

        :  */}
        <SwapBox>
            Swap
            <SwapInput>
                tokenA
                <Input type="text" name="name" onChange={(event)=> {setToken1(event.target.value)}} />
                tokenB
                <Input type="text" name="name" onChange={(event)=> {setToken2(event.target.value)}} />                
            </SwapInput>

            <SwapContainer pool={pool}></SwapContainer>

        </SwapBox>
    
    
    
    {/* } */}

    </Container>
  )
}

export default SelectPair

const Wrapper = styled.div`
    background-color: #fbf2c4;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;



`

const Container = styled.div`
    background-color: #74a892;
    width: 30vw;
    height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    border: 2px solid #008585;
    box-shadow: 8px 8px 8px #615e4c;



`
const SwapInput = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;

`
const SwapBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`

const Input = styled.input`


`