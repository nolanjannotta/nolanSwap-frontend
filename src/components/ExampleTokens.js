import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useSigner } from 'wagmi'
import {utils} from "ethers";


function Data(props) {
    const {data: signer}= useSigner()



    const mint = async() => {
        await props.contract.connect(signer).mint(utils.parseEther("10000"))
    }


    return (
        <span>
            {props.name} &nbsp;
            {/* <button onClick={() => {navigator.clipboard.writeText(props.address)}}>copy address</button> &nbsp; */}
            <button onClick={()=>{props.updatePair(props.address)}}>select</button> &nbsp;
            <button onClick={mint}>mint</button> &nbsp;
            balance: {parseFloat(props.balance).toFixed(3)}
            
        </span>
    )
}


function ExampleTokens(props) {
    const updatePairTokens = (newAddress) => {
        if(newAddress == props.tokenPair.tokenA){
            return
        }
        let pair = {
            tokenA: newAddress,
            tokenB: props.tokenPair.tokenA
        };

        props.setTokenPair(pair)

    }

    



  return (
    <Container>
        <SwapBox>
        Demo tokens
        <Data 
            updatePair={updatePairTokens} 
            name={props.tokenData.schruteName} 
            balance={props.tokenData.schruteBalance} 
            address={props.schrute} 
            contract={props.schruteBucks} 
            ></Data>

        <Data 
            updatePair={updatePairTokens} 
            name={props.tokenData.stanleyName} 
            balance={props.tokenData.stanleyBalance} 
            address={props.stanley} 
            contract={props.stanleyNickels}
            ></Data>

        </SwapBox>
        <SwapBox>
            <span>{props.tokenPair.tokenA}  </span>
            <span>x</span> 
            <span>{props.tokenPair.tokenB}</span>
            <span>lp token symbol: {props.poolData.symbol}</span>
            <span>tokenA Reserves: {props.poolData.reservesA}</span>
            <span>tokenB Reserves: {props.poolData.reservesB}</span>
            <span>your lp token balance: {props.poolData.yourLPBalance}</span>
            <span>total liquidity: {props.poolData.totalLiquidity}</span>


            
        </SwapBox>
    </Container>
  )
}

export default ExampleTokens

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
    width: 60vw;
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