import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import SwapContainer from './SwapContainer';
import ReviewSwap from './ReviewSwap';
import {isZeroAddress} from "../utils"
import {utils} from "ethers"
import {Container, Box, Card, Grid, Typography, CardHeader} from '@mui/material'


const cardStyle = {
    minWidth: "30%",
    minHeight: "30%"

}


function SelectPair({allPoolData,tokenPairContracts,allowanceData}) {

    const {poolData, poolContract} = allPoolData
    const {pairTokenA, pairTokenB} = tokenPairContracts
    const {allowances, approveA, approveB} = allowanceData

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
        addressIn: pairTokenA.address,
        nameIn: poolData.token1Name,
        addressOut: pairTokenB.address,
        nameOut: poolData.token2Name

    }))


},[poolData, pairTokenA, pairTokenB])






  return (
    <Card sx={{width: 1/3}}>
        <CardHeader title="Swap" align="center" />

        {(poolData.address == "" || isZeroAddress(poolData.address)) && 
        <Typography variant="h5" align="center">select or create a pair to swap</Typography>
        
        }

        {utils.isAddress(poolData.address) && !isZeroAddress(poolData.address) &&
        <SwapBox>
            {!review && <SwapContainer setSwapData={setSwapData} swapData={swapData} poolContract={poolContract} setReview={setReview} poolData={poolData}/>}
            {review && <ReviewSwap pool={poolData.address} setReview={setReview } swapData={swapData}/>}       
        </SwapBox>}

    </Card>
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

// const Container = styled.div`
//     background-color: #74a892;
//     width: 30vw;
//     height: 30vh;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 15px;
//     border: 2px solid #008585;
//     box-shadow: 8px 8px 8px #615e4c;
    



// `
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