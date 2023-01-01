import React, { useState } from "react";
import { SwapInput, Input } from "../styles";
import useAllowance from "../hooks/useAllowance";
import useManageLiquidity from "../hooks/useManageLiquidity";
import {
  Box,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  ButtonGroup,
  Divider
} from "@mui/material";

const ManageLiquidity = ({ poolData, pool }) => {
  const { allowanceData, approveA, approveB } = useAllowance(poolData);

  const {
    addLiquidity,
    removeLiquidity,
    updateLiquidityParams,
    liquidityParams,
    setLiquidityParams,
  } = useManageLiquidity(pool, poolData);
  console.log(liquidityParams);
  const [addOrRemove, setAddOrRemove] = useState(false); 
  const [reviewTx, setReviewTx] = useState(true);

  const handleToggle = (e, value) => {
    setAddOrRemove(value);
  };

  const flipTokens = () => {
    setLiquidityParams((prev) => ({
      ...prev,
      addressIn: prev.address2In,
      nameIn: prev.name2In,
      amountIn: 0,
      address2In: prev.addressIn,
      name2In: prev.nameIn,
      amount2In: 0,
    }));
  };

  const showRemoveWindow = () => {
    if (reviewTx) {
      return (
        <>
          <ToggleButtonGroup
            color="primary"
            value={addOrRemove}
            exclusive
            onChange={handleToggle}
            aria-label="Platform"
          >
            <ToggleButton value={false}>Add Liquidity</ToggleButton>
            <ToggleButton value={true}>Remove Liquidity</ToggleButton>
          </ToggleButtonGroup>

          <Box>
            <TextField
            size="small"
            sx={{margin:2}}
              id="outlined-basic"
              label="amount"
              variant="outlined"
              type="number"
              name="address"
              onChange={(event) => {
                setLiquidityParams((prev) => ({
                  ...prev,
                  removeAmount: event.target.value,
                }));
              }}
            />
          </Box>
          <Button onClick={() => setReviewTx((prev) => !prev)}>
            review operation
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Typography variant="h6">
              removing {liquidityParams.removeAmount} lp tokens
            </Typography>
            <Divider sx={{margin:5}} variant="middle" />
            <ButtonGroup>
            <Button onClick={() => setReviewTx((prev) => !prev)}>back</Button>
              <Button onClick={removeLiquidity}>submit</Button>
              
            </ButtonGroup>
          </Box>
        </>
      );
    }
  };

  const showAddWindow = () => {
    if (reviewTx) {
      return (
        <>
          <ToggleButtonGroup
            color="primary"
            value={addOrRemove}
            exclusive
            onChange={handleToggle}
            aria-label="Platform"
          >
            <ToggleButton value={false}>Add Liquidity</ToggleButton>
            <ToggleButton value={true}>Remove Liquidity</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{display:"flex", flexDirection: "column", alignItems:"center"}}>
            {/* <Typography>{liquidityParams.nameIn}:</Typography> */}
            <TextField
            size="small"
            sx={{mt: 2}}
              id="outlined-basic"
              label={liquidityParams.nameIn}
              variant="outlined"
              type="string"
              value={liquidityParams.amountIn != 0 ? liquidityParams.amountIn : ""}
              onChange={(event) => {
                setLiquidityParams((prev) => ({
                  ...prev,
                  amountIn: event.target.value,
                }));
              }}
            />
            <Typography>{liquidityParams.name2In}: {liquidityParams.amount2In}</Typography>
            
            <ButtonGroup 
            variant="text"
            aria-label="outlined primary button group">
              <Button onClick={updateLiquidityParams}>calculate</Button>
            <Button onClick={flipTokens}>flip</Button>
            <Button onClick={() => setReviewTx((prev) => !prev)}>review operation</Button>  
            </ButtonGroup>
            
            
          </Box>
          
        </>
      );
    } else {
      return (
          <Box>

            <Typography variant="h5">adding {liquidityParams.nameIn} - {parseFloat(liquidityParams.amountIn || 0).toFixed(4)}</Typography>

            <Typography variant="h5">adding {liquidityParams.name2In} - {parseFloat(liquidityParams.amount2In || 0).toFixed(4)}</Typography>

            <ButtonGroup>
               <Button onClick={addLiquidity}>submit</Button>
                <Button onClick={() => setReviewTx((prev) => !prev)}>back</Button> 
            </ButtonGroup>
            
          </Box>
          
      );
    }
  };

  if (addOrRemove) {
    return showRemoveWindow();
  } else {
    return showAddWindow();
  }
};

export default ManageLiquidity;
