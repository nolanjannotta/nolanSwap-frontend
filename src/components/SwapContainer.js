import React, {useState} from 'react'
import styled from 'styled-components'
import {useProvider, useAccount, useSigner,useContractRead} from 'wagmi'
import { utils } from "ethers";
import MockERC20Abi from "../ABI/MockERC20.json"
 



function TokenBalance({tokenAddress}) {
    const {address} = useAccount();

    const { data: balance, refetch: getBalance} = useContractRead({
        addressOrName: tokenAddress,
        contractInterface: MockERC20Abi,
        functionName: 'balanceOf',
        args: [address]
      })
  return (
    <div>balance: {parseFloat(utils.formatEther(balance || 0)).toFixed(3)}</div>
  )
}



function SwapContainer({setSwapData, poolData, poolContract, swapData, setReview}) {

const { address, isConnected } = useAccount();
const [poolAddr, setPoolAddr] = useState();

const provider = useProvider();
const { data: signer } = useSigner()


const flipTokens = () => {
    setSwapData(prev => ({
        ...prev, 
        addressIn: prev.addressOut, 
        nameIn: prev.nameOut,
        amountIn: 0,
        addressOut: prev.addressIn,
        nameOut: prev.nameIn,
        amountOut: 0
    
    }))
}


const getOtherAmount = async() => {
    let results;
    if(swapData.lastEntered == 1) {
        results = await poolContract.getTokenAndAmountOut(swapData.addressIn, utils.parseEther(swapData.amountIn.toString()))
        setSwapData( prev => ({...prev, amountOut: utils.formatEther(results[1].toString())}))
        // console.log(results[0], results[1].toString())
    }
    else if(swapData.lastEntered == 2) {
        results = await poolContract.getTokenAndAmountIn(swapData.addressOut, utils.parseEther(swapData.amountOut.toString()))
        setSwapData( prev => ({...prev, amountIn: utils.formatEther(results[1].toString())}))
        // console.log(results[0], results[1].toString())
    }

}






    return (
        <>
        <SwapInput>
                {swapData.nameIn}
                <div>
                    <Input type="number" name="name" value={swapData.amountIn} onChange={(event)=> {setSwapData( prev => ({...prev, amountIn: event.target.value || 0,lastEntered: 1}))}} />
                    {/* <TokenBalance tokenAddress={swapData.addressIn}/> */}
                </div>
                
                <button onClick={getOtherAmount}>calculate</button>
                <button onClick={flipTokens}>flip</button>
                {swapData.nameOut}
                <div>
                    <Input type="number" name="name" value={swapData.amountOut} onChange={(event)=> {setSwapData( prev => ({...prev, amountOut: event.target.value || 0, lastEntered: 2}))}}/>
                    {/* <TokenBalance tokenAddress={swapData.addressOut}/> */}
                </div>
                <button onClick={()=>{getOtherAmount(); setReview(prev => !prev)}}>review operation</button>

        </SwapInput>

        </>
    )
}


export default SwapContainer

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
        



`

const Input = styled.input`


`