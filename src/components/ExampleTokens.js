import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useSigner, useAccount, useContract, useProvider } from 'wagmi'
import {constants, utils} from "ethers";
import MockERC20Abi  from "../ABI/MockERC20"



function Token(props) {
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
    const {data: signer}= useSigner()
    const provider = useProvider()
    const {address} = useAccount()

    const schruteBucks = useContract({
        addressOrName: props.schruteAddress,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });
    const stanleyNickels = useContract({
        addressOrName: props.stanleyAddress,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });
    const correlated1 = useContract({
        addressOrName: props.correlated1Address,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });
    const correlated2 = useContract({
        addressOrName: props.correlated2Address,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });

    const [tokenData, setTokenData]= useState({
        schruteName: "",
        stanleyName: "",
        schruteBalance: 0,
        stanleyBalance: 0

    })

    const getTokenData = async() => {
        let _schrute = await schruteBucks.name()
        let _stanley = await stanleyNickels.name()
        let schruteBalance = await schruteBucks.balanceOf(address)
        let stanleyBalance = await stanleyNickels.balanceOf(address)
        let _ct1 = await correlated1.name()
        let _ct2 = await correlated2.name()
        let ct1Balance = await correlated1.balanceOf(address)
        let ct2Balance = await correlated2.balanceOf(address)
        setTokenData({
            schruteName: _schrute,
            stanleyName: _stanley,
            schruteBalance: utils.formatEther(schruteBalance),
            stanleyBalance: utils.formatEther(stanleyBalance),
            ct1Name: _ct1,
            ct2Name: _ct2,
            ct1Balance: utils.formatEther(ct1Balance),
            ct2Balance: utils.formatEther(ct2Balance),


        })


    }
    useEffect(()=>{
        getTokenData()
    },[])

    console.log(props.poolData)
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

    const createPair = async() => {
        if(utils.isAddress(props.tokenPair.tokenA) && utils.isAddress(props.tokenPair.tokenB)) {
           await props.poolFactory.connect(signer).createPair(props.tokenPair.tokenA, props.tokenPair.tokenB)
        }
        
    
    }

    



  return (
    <Container>
        <SwapBox>
        Demo tokens

        <Token 
            updatePair={updatePairTokens} 
            name={tokenData.schruteName} 
            balance={tokenData.schruteBalance} 
            address={props.schruteAddress} 
            contract={schruteBucks} 
            ></Token>

        <Token
            updatePair={updatePairTokens} 
            name={tokenData.stanleyName} 
            balance={tokenData.stanleyBalance} 
            address={props.stanleyAddress} 
            contract={stanleyNickels}
            ></Token>


        <Token 
            updatePair={updatePairTokens} 
            name={tokenData.ct1Name} 
            balance={tokenData.ct1Balance} 
            address={props.correlated1Address} 
            contract={correlated1}
            ></Token>
        <Token 
            updatePair={updatePairTokens} 
            name={tokenData.ct2Name} 
            balance={tokenData.ct2Balance} 
            address={props.correlated2Address} 
            contract={correlated2}
            ></Token>


        </SwapBox>

        {props.poolData.address != constants.AddressZero ?
        
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
        :
        <SwapBox>
        <button onClick={createPair}>create pool</button>
        </SwapBox>}
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
    width: 65%;
    height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    border: 2px solid #008585;
    box-shadow: 8px 8px 8px #615e4c;
    // transform: rotate(2deg);




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