import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {ConnectButton} from '@rainbow-me/rainbowkit';
import { useAccount, useContract, useProvider, useSigner,usePrepareContractWrite, useContractWrite } from 'wagmi'
import SwapContainer from './SwapContainer';
import MockERC20Abi  from "../ABI/MockERC20"
import PoolFactoryAbi from "../ABI/PoolFactory"
import PoolABI from "../ABI/Pool.json"
import { utils } from "ethers";


function Data(props) {
    const {data: signer}= useSigner()



    const mint = async() => {
        await props.contract.connect(signer).mint(utils.parseEther("10000"))
    }

    // const approve = async() => {
    //     await props.contract.connect(signer).approve(pool, balance);
    // }

    return (
        <span>
            {props.name} &nbsp;
            <button onClick={() => {navigator.clipboard.writeText(props.address)}}>copy address</button> &nbsp;
            <button onClick={mint}>mint</button> &nbsp;
            balance: {parseFloat(props.balance).toFixed(3)}
            
        </span>
    )
}


function ExampleTokens(props) {

    const provider = useProvider();

    const {address} = useAccount()

    const [tokenData, setTokenData]= useState({
        schruteName: "",
        stanleyName: "",
        schruteBalance: 0,
        stanleyBalance: 0

    })


    const schruteBucks = useContract({
        addressOrName: props.schrute,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });
    const stanleyNickels = useContract({
        addressOrName: props.stanley,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });
    

    const getTokenData = async() => {
        let _schrute = await schruteBucks.name()
        let _stanley = await stanleyNickels.name()
        let schruteBalance = await schruteBucks.balanceOf(address)
        let stanleyBalance = await stanleyNickels.balanceOf(address)
        setTokenData({
            schruteName: _schrute,
            stanleyName: _stanley,
            schruteBalance: utils.formatEther(schruteBalance),
            stanleyBalance: utils.formatEther(stanleyBalance)

        })


    }

    // const mint = async() => {
    //     await 
    // }

    useEffect(()=>{
        getTokenData()
    },[])



  return (
    <Container>
        <SwapBox>
        Demo tokens
        <Data name={tokenData.schruteName} balance={tokenData.schruteBalance} address={props.schrute} contract={schruteBucks} ></Data>
        <Data name={tokenData.stanleyName} balance={tokenData.stanleyBalance} address={props.stanley} contract={stanleyNickels}></Data>

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