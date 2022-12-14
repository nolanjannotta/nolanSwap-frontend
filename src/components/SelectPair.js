import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import SwapContainer from './SwapContainer';
import ReviewSwap from './ReviewSwap';
import {isZeroAddress} from "../utils"
import {utils} from "ethers"




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
const [review, setReview] = useState(false) // false == the review screen


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
        {(props.poolData.address == "" || isZeroAddress(props.poolData.address)) && "select or create a pair to manage liquidity"}

        {utils.isAddress(props.poolData.address) && !isZeroAddress(props.poolData.address) &&
        <SwapBox>
            {!review && <SwapContainer setSwapData={setSwapData} swapData={swapData} poolContract={props.poolContract} setReview={setReview} poolData={props.poolData}/>}
            {review && <ReviewSwap pool={props.poolData.address} setReview={setReview } swapData={swapData}/>}       
        </SwapBox>}

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