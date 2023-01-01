import React, { useState } from "react";
import styled from "styled-components";
import { useProvider, useAccount, useSigner, useContractRead } from "wagmi";
import { utils } from "ethers";
import MockERC20Abi from "../ABI/MockERC20.json";
import {
  Box,
  TextField,
  Button,
  ButtonGroup,
} from "@mui/material";

function SwapContainer({
  setSwapData,
  poolData,
  poolContract,
  swapData,
  setReview,
}) {


  const flipTokens = () => {
    setSwapData((prev) => ({
      ...prev,
      addressIn: prev.addressOut,
      nameIn: prev.nameOut,
      amountIn: 0,
      addressOut: prev.addressIn,
      nameOut: prev.nameIn,
      amountOut: 0,
    }));
  };

  const getOtherAmount = async () => {
    let results;
    if (swapData.lastEntered == 1) {
      results = await poolContract.getTokenAndAmountOut(
        swapData.addressIn,
        utils.parseEther(swapData.amountIn.toString())
      );
      setSwapData((prev) => ({
        ...prev,
        amountOut: utils.formatEther(results[1].toString()),
      }));
    } else if (swapData.lastEntered == 2) {
      results = await poolContract.getTokenAndAmountIn(
        swapData.addressOut,
        utils.parseEther(swapData.amountOut.toString())
      );
      setSwapData((prev) => ({
        ...prev,
        amountIn: utils.formatEther(results[1].toString()),
      }));
    }
  };

  return (
    <Box align="center" direction="column">
    <Box sx={{display:"flex", flexDirection: "column", width:1/2}}>
      <TextField
      size="small"
        id="outlined-basic"
        label={swapData.nameIn}
        variant="outlined"
        type="number"
        value={swapData.amountIn || ""}
        onChange={(event) => {
          setSwapData((prev) => ({
            ...prev,
            amountIn: event.target.value || 0,
            lastEntered: 1,
          }));
        }}
      />

      

      <TextField
      sx={{mt:2}}
      size="small"
        id="outlined-basic"
        label={swapData.nameOut}
        variant="outlined"
        type="number"
        value={swapData.amountOut || ""}
        onChange={(event) => {
          setSwapData((prev) => ({
            ...prev,
            amountOut: event.target.value || 0,
            lastEntered: 2,
          }));
        }}
      />
    </Box>
      <ButtonGroup  sx={{ margin:2}} variant="text" aria-label="outlined primary button group">
        <Button size="small" onClick={getOtherAmount}>
          calculate
        </Button>
        <Button size="small" onClick={flipTokens}>
          flip
        </Button>
        <Button
          onClick={() => {
            getOtherAmount();
            setReview((prev) => !prev);
          }}
        >
          review operation
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default SwapContainer;

const Wrapper = styled.div`
  background-color: #fbf2c4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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
`;

const Input = styled.input``;
