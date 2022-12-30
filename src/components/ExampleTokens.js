import React, { useState } from "react";
import styled from "styled-components";
// import {useAccount,useContractRead,usePrepareContractWrite, useContractWrite, useEnsResolver } from 'wagmi'
import { constants, utils } from "ethers";
import MockERC20Abi from "../ABI/MockERC20";
import { isZeroAddress } from "../utils";
import useCreatePool from "../hooks/useCreatePool";
import useMint from "../hooks/useMint";
import { schruteBucks, stanleyNickels, ct1, ct2 } from "../addresses";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Button,
  ButtonGroup,
  Grid,
  ListItemText,
  ListItemButton,
  Divider,
  TextField,
} from "@mui/material";

function Token({ updatePair, tokenAddress }) {
  const { balance, name, getBalance, mint } = useMint(tokenAddress);

  return (
      <>     
    <ListItem disablePadding>
      <ListItemText
        align="center"
        primary={name}
        secondary={
          <>
            balance: {parseFloat(utils.formatEther(balance || 0)).toFixed(3)}
            <ButtonGroup
              variant="text"
              aria-label="outlined primary button group"
            >
              <Button size="small" onClick={mint}>
                mint
              </Button>
              <Button size="small" onClick={getBalance}>
                refresh
              </Button>
            </ButtonGroup>
          </>
        }
      />

      <ButtonGroup aria-label="outlined primary button group">
        <Button
          size="small"
          onClick={() => {
            updatePair(tokenAddress);
          }}
        >
          select
        </Button>
      </ButtonGroup>
    </ListItem> 
    <Divider />
    </>
  );
}

function ExampleTokens({allPoolData, poolFactory}) {

    const {poolData, getPool, tokenPair, setTokenPair, resetPoolData, updatePairTokens, loading} = allPoolData;

    const { createPool } = useCreatePool(poolFactory,poolData.addressA,poolData.addressB,getPool);


  return (
      <>
      {/* <Grid container direction="row" alignItems="center" justifyContent="space-around">
        <Grid item width={1/3}>*/}

        <Box display="flex" justifyContent="space-around" marginTop={5}>

            <Container sx={{width: "40%", height: '50%'}}>

            <Card>
                
            <CardContent>
                <Typography variant="h4">Demo Tokens</Typography>
                <Typography variant="p">Use these to quickly try out the exchage</Typography>          
                <List sx={{overflow: 'auto', height:"50%"}}>           
                    <Token updatePair={updatePairTokens} tokenAddress={schruteBucks}/>
                    <Token updatePair={updatePairTokens} tokenAddress={stanleyNickels}/>
                    <Token updatePair={updatePairTokens} tokenAddress={ct1} />
                    <Token updatePair={updatePairTokens} tokenAddress={ct2} />
                </List>
            </CardContent>
            </Card>
            </Container>
        {/* </Grid>  */}


    {!poolData.poolExists && (
        //   <Grid item width={1/3}  height={1/3}>
        <Container sx={{width: "40%", minHeight: '100%'}}>
              <Card>
                <CardContent>

                <Typography variant="h5">select or paste in token address:</Typography>
                
                <TextField id="outlined-basic" label="token address" variant="outlined"
                type="string"
                name="address"
                value={tokenPair.tokenA ? tokenPair.tokenA : ""}
                onChange={(event) => {
                    setTokenPair(prev => ({...prev, tokenA: event.target.value}));
                }}
                />
                <Typography variant="h5">x</Typography>
                <TextField id="outlined-basic" label="token address" variant="outlined"
                type="string"
                name="address"
                value={tokenPair.tokenB ? tokenPair.tokenB : ""}
                onChange={(event) => {
                    setTokenPair(prev => ({...prev, tokenB: event.target.value}));
                }}
                />
                <Box>
                    {loading && <>loading...</>}
                    
                    {(poolData.poolFetched && !poolData.PoolExists && !loading) && <Button onClick={createPool}>create</Button>}
                
                </Box>
                
                </CardContent>
            </Card>
            </Container>
        //   </Grid>
        )}

     {poolData.poolExists && (
         
        //   <Grid item width={1/3}>
              <Card>
        <CardContent>
            <List>            
            <ListItem>{poolData.token1Name} x {poolData.token2Name}</ListItem>
            <ListItem>fee: {poolData.fee}%</ListItem>
            <ListItem>lp token symbol: {poolData.symbol}</ListItem>
            <ListItem>{poolData.token1Name} reserves: {poolData.reservesA}</ListItem>
            <ListItem>{poolData.token2Name} reserves: {poolData.reservesB}</ListItem>
            <ListItem>your lp token balance: {poolData.yourLPBalance}</ListItem>
            <ListItem>total liquidity: {poolData.totalLiquidity}</ListItem>
            <Button onClick={resetPoolData}>back</Button>
            </List>
            </CardContent>
          </Card>
        //   </Grid>
          
     )}
        {/* </Grid> */}
        </Box>
         </>
  );

 
}

export default ExampleTokens;

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
//     width: 65%;
//     height: 30vh;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 15px;
//     border: 2px solid #008585;
//     box-shadow: 8px 8px 8px #615e4c;
//     // transform: rotate(2deg);

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
