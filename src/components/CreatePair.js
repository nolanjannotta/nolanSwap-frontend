import React from "react";
import styled from "styled-components";
import InitializePool from "./InitializePool";
import ManageLiquidity from "./ManageLiquidity";
import { utils } from "ethers";
import { isZeroAddress } from "../utils";
import useAllowance from "../hooks/useAllowance"
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardHeader,
} from "@mui/material";


function CreatePair({ allPoolData, tokenPairContracts }) {
  const { poolData, poolContract, getPool } = allPoolData;
  const allowanceData = useAllowance(poolData, getPool);

  return (

    <Box sx={{width: "30%"}}>

        
        <Card align="center" sx={{ height: .95, overflowY: "auto" }}>
        
      <CardHeader title="Manage Liquidity" align="center" />
         {(poolData.address == "" || isZeroAddress(poolData.address)) && (
        <Typography variant="h5" align="center">
          select or create a pair to manage liquidity
        </Typography>
      )} 
      

      {utils.isAddress(poolData.address) &&
        !isZeroAddress(poolData.address) && (
        <CardContent>
            {poolData.initialized ? (
              <ManageLiquidity
                poolData={poolData}
                pool={poolContract}
                allowanceData={allowanceData}
              />
            ) : (
              <InitializePool
                poolData={poolData}
                poolContract={poolContract}
                allowanceData={allowanceData}
              />
            )}
            </CardContent>
        )}
        
    </Card>
    </Box>
  );
}

export default CreatePair;

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
const SwapBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;
