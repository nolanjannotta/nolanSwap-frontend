import React from 'react'
import styled from 'styled-components'
import {useAccount,useContractRead,usePrepareContractWrite, useContractWrite } from 'wagmi'
import {utils} from "ethers";
// import {isAddress} from "ethers/utils"
import MockERC20Abi  from "../ABI/MockERC20"
import poolFactory from "../ABI/PoolFactory.json"
import {factory} from "../addresses"
import {isZeroAddress} from "../utils"



function Token(props) {
    const {address} = useAccount();

    const token = {
        addressOrName: props.address,
        contractInterface: MockERC20Abi,
    }
    

    const { data: balance, refetch: getBalance} = useContractRead({
        ...token,
        functionName: 'balanceOf',
        args: [address]
      })
    const { data: name,} = useContractRead({
        ...token,
        functionName: 'name',
      })


    const {config: mintConfig } = usePrepareContractWrite({
        ...token,
        functionName: "mint",
        args: [utils.parseEther("10000")]
      })

    const { write: mint } = useContractWrite({
        ...mintConfig,
        onSuccess() {
            getBalance()
          },
        onError(error) {
            console.log('token mint error:', error)
          },
    
    })

    return (
        <span>
            {name} &nbsp;
            <button onClick={()=>{props.updatePair(props.address)}}>select</button> &nbsp;
            <button onClick={mint}>mint</button> &nbsp;
            balance: {parseFloat(utils.formatEther(balance || 0)).toFixed(3)} &nbsp;
            <button onClick={getBalance}>refresh</button> &nbsp;

            
        </span>
    )
}

function CreatePool({poolData, getPool}) {
    console.log(poolData)
    const {config} = usePrepareContractWrite({
        addressOrName: factory,
        contractInterface: poolFactory,
        functionName: "createPair",
        args: [poolData.addressA, poolData.addressB],
        enabled: true,
    })
    // console.log(config)
    const {write: createPool} = useContractWrite({
        ...config,
        onSuccess() {
            getPool()
            
          },
        onError(error) {
            console.log('create pool error:', error)
          },
    
    })

    return(
        <button onClick={createPool}>create pool</button>
    )
}


function ExampleTokens(props) {
    

    console.log(props.poolData)
    
    const updatePairTokens = (newAddress) => {
        if(newAddress == props.poolData.addressA){
            return
        }
        props.setPoolData( prev => ({
            address: "",
            addressA: newAddress,
            addressB: prev.addressA
            
        }))

    }

  return (
    <Container>
        <SwapBox>
        Demo tokens

        <Token 
            updatePair={updatePairTokens} 
            address={props.schruteAddress} 
            ></Token>

        <Token
            updatePair={updatePairTokens} 
            address={props.stanleyAddress} 
            ></Token>


        <Token 
            updatePair={updatePairTokens} 
            address={props.correlated1Address} 
            ></Token>
        <Token 
            updatePair={updatePairTokens} 
            address={props.correlated2Address} 
            ></Token>


        </SwapBox>

        {(props.poolData.address == "" || isZeroAddress(props.poolData.address)) && 

        <SwapBox>
            <span>select or paste in token address:</span>
            <Input type="string" name="address"  value={!isZeroAddress(props.poolData.addressA) ? props.poolData.addressA : "token address..."} onChange={(event)=> {console.log(event)}} />
            <span>x</span>
            <Input type="string" name="address"  value={!isZeroAddress(props.poolData.addressB) ? props.poolData.addressB : "token address..."} onChange={(event)=> {console.log(event)}} />
            {(!props.poolData.initialized && (!isZeroAddress(props.poolData.addressA) && !isZeroAddress(props.poolData.addressB))) && 
            
            <CreatePool poolData={props.poolData} getPool={props.getPool}/>}

        </SwapBox>}

        {utils.isAddress(props.poolData.address) && !isZeroAddress(props.poolData.address) &&
            <SwapBox>
            <span>{props.poolData.token1Name}  </span>
            <span>x</span> 
            <span>{props.poolData.token2Name}</span>
            <span>pool fee: {props.poolData.fee}%</span>
            <span>lp token symbol: {props.poolData.symbol}</span>
            <span>{props.poolData.token1Name} reserves: {props.poolData.reservesA}</span>
            <span>{props.poolData.token2Name} reserves: {props.poolData.reservesB}</span>
            <span>your lp token balance: {props.poolData.yourLPBalance}</span>
            <span>total liquidity: {props.poolData.totalLiquidity}</span>
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