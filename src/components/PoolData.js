import React from "react";
import useCreatePool from "../hooks/useCreatePool";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Button,
  CardHeader,
  TextField,
  Divider
} from "@mui/material";

function PoolData({allPoolData, poolFactory}) {
    const {poolData, getPool, tokenPair, setTokenPair, resetPoolData, updatePairTokens, loading} = allPoolData;

    const { createPool } = useCreatePool(poolFactory, tokenPair.tokenA,tokenPair.tokenB,getPool);



  if (!poolData.poolExists)
    return (
        <Box sx={{width: "30%"}}>

        
        <Card align="center" sx={{ height: .95, overflowY: "auto" }}>
          <CardContent>
            <CardHeader title="select or paste in token address:" />

            <TextField
              id="outlined-basic"
              label="token address"
              variant="outlined"
              type="string"
              name="address"
              value={tokenPair.tokenA ? tokenPair.tokenA : ""}
              onChange={(event) => {
                setTokenPair((prev) => ({
                  ...prev,
                  tokenA: event.target.value,
                }));
              }}
            />
            <Typography variant="h5">x</Typography>
            <TextField
              id="outlined-basic"
              label="token address"
              variant="outlined"
              type="string"
              name="address"
              value={tokenPair.tokenB ? tokenPair.tokenB : ""}
              onChange={(event) => {
                setTokenPair((prev) => ({
                  ...prev,
                  tokenB: event.target.value,
                }));
              }}
            />
            <Box>
              {loading && <>loading...</>}

              {poolData.poolFetched && !poolData.PoolExists && !loading && (
                <Button onClick={createPool}>create</Button>
              )}
            </Box>
          </CardContent>
        </Card>
        </Box>
    );

  if (poolData.poolExists)
    return (
        <Box sx={{width: "30%"}}>

        
        <Card align="center" sx={{ height: .95, overflowY: "auto" }}>
          <CardHeader title="Pool Data" />
          <CardContent>
            <List>
              <ListItem>{poolData.token1Name} x {poolData.token2Name}</ListItem>
              <Divider/>
              <ListItem>fee: {poolData.fee}%</ListItem>
              <Divider/>
              <ListItem>lp token symbol: {poolData.symbol}</ListItem>
              <Divider/>
              <ListItem>{poolData.token1Name} reserves: {poolData.reservesA}</ListItem>
              <Divider/>
              <ListItem>{poolData.token2Name} reserves: {poolData.reservesB}</ListItem>
              <Divider/>
              <ListItem> your lp token balance: {poolData.yourLPBalance}</ListItem>
              <Divider/>
              <ListItem>total liquidity: {poolData.totalLiquidity}</ListItem>
              <Divider/>
              <Button onClick={resetPoolData}>back</Button>
            </List>
          </CardContent>
        </Card>
        </Box>
    );
}

export default PoolData;
