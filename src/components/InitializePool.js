import React, { useState } from "react";
import { SwapInput, Input } from "../styles";
import useInitialize from "../hooks/useInitialize";
import {
    Container,
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    CardHeader,
    TextField,
    Button
  } from "@mui/material";

const InitializePool = ({ poolData, poolContract, allowanceData }) => {
  const { allowances, approveA, approveB } = allowanceData;
    console.log(allowanceData)
  const [initAmount, setInitAmount] = useState({
    tokenA: 0,
    tokenB: 0,
  });



  const { initialize } = useInitialize(poolContract, initAmount);

  return (
    <Box align="center">
      
      <TextField
        id="outlined-basic"
        label={poolData.token1Name}
        variant="outlined"
        type="string"
        onChange={e => {
          setInitAmount((prev) => ({ ...prev, tokenA: e.target.value }));
        }}
      />
      {allowances.tokenA == 0 && <Button onClick={approveA}>allow all</Button>}
      
      <TextField
        id="outlined-basic"
        label={poolData.token2Name}
        variant="outlined"
        type="string"
        onChange={e => {setInitAmount((prev) => ({ ...prev, tokenB: e.target.value }))}}
      />
      {allowances.tokenB == 0 && <Button onClick={approveB}>allow all</Button>}
      <Box>
        <Button onClick={initialize}>initialize pool</Button>  
      </Box>
      
    </Box>
  );
};

export default InitializePool;
