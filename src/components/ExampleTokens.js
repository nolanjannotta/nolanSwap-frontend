import React from 'react'
import styled from 'styled-components'
import {useAccount,useContractRead,usePrepareContractWrite, useContractWrite } from 'wagmi'
import {constants, utils} from "ethers";
import MockERC20Abi  from "../ABI/MockERC20"
import {isZeroAddress} from "../utils"
import useCreatePool from '../hooks/useCreatePool';
import {schruteBucks, stanleyNickels, ct1, ct2} from "../addresses"




function Token({updatePair, tokenAddress}) {
    const {address} = useAccount();

    const token = {
        addressOrName: tokenAddress,
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
            <button onClick={()=>{updatePair(tokenAddress)}}>select</button> &nbsp;
            <button onClick={mint}>mint</button> &nbsp;
            balance: {parseFloat(utils.formatEther(balance || 0)).toFixed(3)} &nbsp;
            <button onClick={getBalance}>refresh</button> &nbsp;

            
        </span>
    )
}



function ExampleTokens({poolFactory, poolData, getPool, setPoolData}) {

    const {createPool} = useCreatePool(poolFactory, poolData.addressA, poolData.addressB, getPool)

    const updatePairTokens = (newAddress) => {
        if(newAddress == poolData.addressA){
            return
        }
        setPoolData( prev => ({
            address:"",
            addressA: newAddress,
            addressB: prev.addressA
            
        }))

    }

    const choosePool = () => {
        setPoolData({
            address:"",
            addressA: constants.AddressZero,
            addressB: constants.AddressZero
        })
    }

  return (
    <Container>
        <SwapBox>
        Demo tokens

        <Token 
            updatePair={updatePairTokens} 
            tokenAddress={schruteBucks} 
            ></Token>

        <Token
            updatePair={updatePairTokens} 
            tokenAddress={stanleyNickels} 
            ></Token>


        <Token 
            updatePair={updatePairTokens} 
            tokenAddress={ct1} 
            ></Token>
        <Token 
            updatePair={updatePairTokens} 
            tokenAddress={ct2} 
            ></Token>


        </SwapBox>

        {(poolData.address == "" || isZeroAddress(poolData.address)) && 

        <SwapBox>
            <span>select or paste in token address:</span>
            <Input type="string" name="address"  value={!isZeroAddress(poolData.addressA) ? poolData.addressA : "token address..."} onChange={(event)=> {console.log(event)}} />
            <span>x</span>
            <Input type="string" name="address"  value={!isZeroAddress(poolData.addressB) ? poolData.addressB : "token address..."} onChange={(event)=> {console.log(event)}} />
            {(!poolData.initialized && (!isZeroAddress(poolData.addressA) && !isZeroAddress(poolData.addressB))) && 

            <button onClick={createPool}>create</button>
            }
            {/* <CreatePool poolData={props.poolData} getPool={props.getPool}/> */}
        </SwapBox>}

        {utils.isAddress(poolData.address) && !isZeroAddress(poolData.address) &&
            <SwapBox>
            <span>{poolData.token1Name}  </span>
            <span>x</span> 
            <span>{poolData.token2Name}</span>
            <span>pool fee: {poolData.fee}%</span>
            <span>lp token symbol: {poolData.symbol}</span>
            <span>{poolData.token1Name} reserves: {poolData.reservesA}</span>
            <span>{poolData.token2Name} reserves: {poolData.reservesB}</span>
            <span>your lp token balance: {poolData.yourLPBalance}</span>
            <span>total liquidity: {poolData.totalLiquidity}</span>
        <button onClick={choosePool}>back</button>
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