import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useProvider, useSigner} from 'wagmi'
import { utils, constants } from "ethers";



function SelectPair(props) {

const [swapData, setSwapData] = useState({
    addressIn: "",
    amountIn: 0,
    nameIn: "",
    addressOut: "",
    amountOut: 0,
    nameOut: "",
    lastEntered: 1 // 1 == token1 2 == token2
})




const [toggle, setToggle] = useState(0)



const provider = useProvider();
const { data: signer } = useSigner()





const getAmountOut = async() => {
    let results;
    if(swapData.lastEntered == 1) {
        results = await props.poolContract.getTokenAndAmountOut(swapData.addressIn, utils.parseEther(swapData.amountIn.toString()))
        setSwapData( prev => ({...prev, amountOut: utils.formatEther(results[1].toString())}))
        // console.log(results[0], results[1].toString())
    }
    else if(swapData.lastEntered == 2) {
        results = await props.poolContract.getTokenAndAmountIn(swapData.addressOut, utils.parseEther(swapData.amountOut.toString()))
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
    // console.log(swapData)
}

const swapComponent = () => {
    if(props.poolData.address == constants.AddressZero) {
        return(
            <div>
                please create pool first
            </div>
        )
    }
    else {
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
            <button onClick={()=>{setToggle(prev => prev + 1)}}>review operation</button>

            </>
        )
    }   
}


useEffect(()=> {
    setSwapData(prev => ({
        ...prev,
        addressIn: props.pairTokenA.address,
        nameIn: props.poolData.token1Name,
        addressOut: props.pairTokenB.address,
        nameOut: props.poolData.token2Name

    }))


},[props.poolData, props.pairTokenA, props.pairTokenB])






  return (
    <Container>
        {props.poolData.address != "" ?
        <SwapBox>


        {toggle==0 &&  swapComponent()}

        {toggle==1 &&
        <>
        
        <SwapInput>
            review swap
            <div>
            you send {swapData.amountIn} {swapData.nameIn}
            </div>
            <div>
            you recieve {swapData.amountOut} {swapData.nameOut}
            </div>
            <button onClick={swap}>swap</button>
            
        </SwapInput>
        </>
        }
        <div>
        {toggle > 0 && <button onClick={()=>{setToggle(prev => prev - 1)}}>back</button>}
        </div>
        
       
        </SwapBox>
        : "select a pair to swap"

        }

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