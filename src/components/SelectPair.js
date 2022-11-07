import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {ConnectButton} from '@rainbow-me/rainbowkit';
import { useAccount, useContract, useProvider, useSigner,usePrepareContractWrite, useContractWrite } from 'wagmi'
import SwapContainer from './SwapContainer';
import MockERC20Abi  from "../ABI/MockERC20"
import PoolFactoryAbi from "../ABI/PoolFactory"
import PoolABI from "../ABI/Pool.json"
import { utils } from "ethers";



function SelectPair(props) {

const { address, isConnected } = useAccount();

const [token1, setToken1]= useState("")
const [token2, setToken2]= useState("")

const [token1Name, setToken1Name] = useState("")
const [token2Name, setToken2Name] = useState("")

const [token1Amount, setToken1Amount] = useState(0)
const [token2Amount, setToken2Amount] = useState(0)

const [swapData, setSwapData] = useState({
    addressIn: "",
    amountIn: 0,
    nameIn: "",
    addressOut: "",
    amountOut: 0,
    nameOut: "",
    lastEntered: 1 // 1 == token1 2 == token2
})



const [tokenFlip, setTokenFlip] = useState(false)

const [toggle, setToggle] = useState(0)

const [pool, setPool] = useState("");


const provider = useProvider();
const { data: signer } = useSigner()

// console.log(signer)
 
const poolFactory = useContract({
    addressOrName: props.factory,
    contractInterface: PoolFactoryAbi,
    signerOrProvider: provider
});

const token1Contract = useContract({
    addressOrName: token1,
    contractInterface: MockERC20Abi,
    signerOrProvider: provider
});
const token2Contract = useContract({
    addressOrName: token2,
    contractInterface: MockERC20Abi,
    signerOrProvider: provider
});
const poolContract = useContract({
    addressOrName: pool,
    contractInterface: PoolABI,
    signerOrProvider: provider
});


const getAmountOut = async() => {
    let results;
    if(swapData.lastEntered == 1) {
        results = await props.poolContract.getTokenAndAmountOut(swapData.addressIn, utils.parseEther(swapData.amountIn.toString()))
        setSwapData( prev => ({...prev, amountOut: utils.formatEther(results[1].toString())}))
        // console.log(results[0], results[1].toString())
    }
    else if(swapData.lastEntered == 2) {
        results = await poolContract.getTokenAndAmountIn(swapData.addressOut, utils.parseEther(swapData.amountOut.toString()))
        setSwapData( prev => ({...prev, amountIn: utils.formatEther(results[1].toString())}))
        // console.log(results[0], results[1].toString())
    }

}

const swap = async() => {
    if(swapData.lastEntered == 1) {
        await props.poolContract.connect(signer).swapExactAmountIn(utils.parseEther(swapData.amountIn.toString()), swapData.addressIn)
    }
    if(swapData.lastEntered == 2) {
        await props.poolContract.connect(signer).swapExactAmountOut(utils.parseEther(swapData.amountOut.toString()), swapData.addressOut)

    }
}


const getTokenData = async() => {
    let name1 = await token1Contract.name()
    let name2 = await token2Contract.name()
    setToken1Name(name1)
    setToken2Name(name2)

    

}

const flipTokens = () => {
    setTokenFlip(prev => !prev)
    setSwapData(prev => ({
        ...prev, 
        addressIn: prev.addressOut, 
        nameIn: prev.nameOut,
        amountIn: 0,
        addressOut: prev.addressIn,
        nameOut: prev.nameIn,
        amountOut: 0
    
    }))
    // console.log(swapData)
}

const swapComponent = () => {
    return (
        <>
        <SwapInput>
                {swapData.nameIn}
                <Input type="number" name="name" value={swapData.amountIn} onChange={(event)=> {setSwapData( prev => ({...prev, amountIn: event.target.value,lastEntered: 1}))}} />
                <button onClick={getAmountOut}>calculate</button>
                <button onClick={flipTokens}>flip</button>
                {swapData.nameOut}  
                <Input type="number" name="name" value={swapData.amountOut} onChange={(event)=> {setSwapData( prev => ({...prev, amountOut: event.target.value, lastEntered: 2}))}}/>
        </SwapInput>

        <div>
        {toggle > 0 && <button onClick={()=>{setToggle(prev => prev - 1)}}>back</button>}
        <button onClick={()=>{setToggle(prev => prev + 1)}}>next</button>
        </div>
        </>
    )
}


useEffect(()=> {
    setSwapData(prev => ({
        ...prev,
        addressIn: props.pairTokenA.address,
        nameIn: props.poolData.token1Name,
        addressOut: props.pairTokenB.address,
        nameOut: props.poolData.token2Name

    }))

    console.log(swapData)

},[props.poolData, props.pairTokenA, props.pairTokenB])






  return (
    <Container>
        <SwapBox>
            Swap <br/>

        {/* {toggle==0 &&
        <>
        
        <SwapInput>


            tokenA
            <Input type="text" name="name" onChange={(event)=> {setToken1(event.target.value)}} />
            tokenB  
            <Input type="text" name="name" onChange={(event) =>{setToken2(event.target.value)}}/>
        </SwapInput>
        <button onClick={()=>{setToggle(prev => prev + 1)}}>next</button>
        </>} */}

        {(toggle==0 && props.poolData.address != "") ?  swapComponent() : "select a pair"}

        {toggle==1 &&
        <>
        
        <SwapInput>
            review swap
            <div>
            you send {swapData.amountIn} {swapData.addressIn == token1 ? props.poolData.token1Name : props.poolData.token2Name}
            </div>
            <div>
            you recieve {swapData.amountOut} {swapData.addressOut == token1 ? props.poolData.token1Name : props.poolData.token2Name}
            </div>
            <button onClick={swap}>swap</button>
            
        </SwapInput>
        <div>
        {toggle > 0 && <button onClick={()=>{setToggle(prev => prev - 1)}}>back</button>}
        <button onClick={()=>{setToggle(prev => prev + 1)}}>next</button>
        </div>
        
        </>
        }
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