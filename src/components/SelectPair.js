import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SwapContainer from "./SwapContainer";
import ReviewSwap from "./ReviewSwap";
import { isZeroAddress } from "../utils";
import { utils } from "ethers";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CardHeader,
  } from "@mui/material";


function SelectPair({ allPoolData, tokenPairContracts }) {
  const { poolData, poolContract } = allPoolData;
  const { pairTokenA, pairTokenB } = tokenPairContracts;
//   const { allowances, approveA, approveB } = allowanceData;

  const [swapData, setSwapData] = useState({
    addressIn: "",
    amountIn: 0,
    nameIn: "",
    addressOut: "",
    amountOut: 0,
    nameOut: "",
    lastEntered: 1, // 1 == token1 2 == token2
  });
  const [review, setReview] = useState(false); // false == the review screen

  useEffect(() => {
    setSwapData((prev) => ({
      ...prev,
      addressIn: pairTokenA.address,
      nameIn: poolData.token1Name,
      addressOut: pairTokenB.address,
      nameOut: poolData.token2Name,
    }));
  }, [poolData, pairTokenA, pairTokenB]);

  return (
    <Box sx={{width: "30%"}}>

        
    <Card align="center" sx={{ height: .95, overflowY: "auto" }}>
      <CardHeader title="Swap" align="center" />
        <Box sx={{height: 1/2, display:"flex", alignItems:"center", justifyContent: "center"}}>

        
      {(poolData.address == "" || isZeroAddress(poolData.address)) && (
        <Typography variant="h5" align="center">
          select or create a pair to swap
        </Typography>
      )}
    </Box>
      {utils.isAddress(poolData.address) &&
        !isZeroAddress(poolData.address) && (
          <CardContent>
            {!review && (
              <SwapContainer
                setSwapData={setSwapData}
                swapData={swapData}
                poolContract={poolContract}
                setReview={setReview}
                poolData={poolData}
              />
            )}
            {review && (
              <ReviewSwap
                pool={poolData.address}
                setReview={setReview}
                swapData={swapData}
              />
            )}
          </CardContent>
        )}
    </Card>
    </Box>
  );
}

export default SelectPair;

const Wrapper = styled.div`
  background-color: #fbf2c4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SwapBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const Input = styled.input``;
