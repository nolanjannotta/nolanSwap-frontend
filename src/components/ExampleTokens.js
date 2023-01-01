import React from "react";
import { utils } from "ethers";
import useCreatePool from "../hooks/useCreatePool";
import useMint from "../hooks/useMint";
import { schruteBucks, stanleyNickels, ct1, ct2 } from "../addresses";
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  Button,
  ButtonGroup,
  ListItemText,
  CardHeader,
  Divider,
} from "@mui/material";

function Token({ updatePair, tokenAddress }) {
  const { balance, name, getBalance, mint } = useMint(tokenAddress);

  return (
    <>
      <ListItem
        secondaryAction={
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
            <Button
              size="small"
              onClick={() => {
                updatePair(tokenAddress);
              }}
            >
              select
            </Button>
          </ButtonGroup>
        }
      >
        <ListItemText
          primary={<>{name || "Name"}</>}
          secondary={
            <>
              balance: {parseFloat(utils.formatEther(balance || 0)).toFixed(3)}
            </>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
}

function ExampleTokens({ allPoolData, poolFactory }) {
  const {
    poolData,
    getPool,
    tokenPair,
    setTokenPair,
    resetPoolData,
    updatePairTokens,
    loading,
  } = allPoolData;

  const { createPool } = useCreatePool(
    poolFactory,
    poolData.addressA,
    poolData.addressB,
    getPool
  );

  return (
    <Box sx={{width: "30%"}}>
      <Card align="center" sx={{ maxHeight: .95, overflowY: "auto" }}>
        <CardContent>
          <CardHeader
            title="Demo Tokens"
            subheader="Use these to quickly try out the exchage"
          />
          
          <List sx={{ overflowY: "auto", height: "50%" }}>
            <Token updatePair={updatePairTokens} tokenAddress={schruteBucks} />
            <Token
              updatePair={updatePairTokens}
              tokenAddress={stanleyNickels}
            />
            <Token updatePair={updatePairTokens} tokenAddress={ct1} />
            <Token updatePair={updatePairTokens} tokenAddress={ct2} />
          </List>
          
        </CardContent>
      </Card>
      </Box>
  );
}

export default ExampleTokens;
