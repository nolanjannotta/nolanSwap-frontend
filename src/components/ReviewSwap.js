import React from 'react'
import {SwapInput} from "../styles"
import {usePrepareContractWrite, useContractWrite} from 'wagmi'
import PoolABI from "../ABI/NSPool.json"
import { utils } from "ethers";
import {
  Box,
  Typography,
  Button,
  ButtonGroup
} from "@mui/material";





function Swap({contractAddress, args, functionName}) {

    const {config: swapConfig } = usePrepareContractWrite({
        addressOrName: contractAddress,
        contractInterface: PoolABI,
        functionName: functionName,
        args: args
      })

      console.log(swapConfig)

    const { write: swap } = useContractWrite({  
        ...swapConfig,
        onSuccess() {console.log("hello")},
        onError(error) {console.log('create pool error:', error)},
    
    })

    return(
        <Button onClick={swap}>Swap</Button>
    )
}


function ReviewSwap({swapData, setReview, pool}) {
  return (
    <Box>

            <Typography variant="h5">you send {parseFloat(swapData.amountIn || 0).toFixed(5)} {swapData.nameIn}</Typography>

            <Typography variant="h5">you recieve {parseFloat(swapData.amountOut || 0).toFixed(5)} {swapData.nameOut}</Typography>
            

            <ButtonGroup sx={{mt: 5}}>
            <Button onClick={()=>{setReview(prev => !prev)}}>back</Button>
            {swapData.lastEntered == 1 && <Swap functionName="swapExactAmountIn" contractAddress={pool} args={[utils.parseEther(swapData.amountIn.toString()), swapData.addressIn]}/>}
            {swapData.lastEntered == 2 && <Swap functionName="swapExactAmountOut" contractAddress={pool} args={[utils.parseEther(swapData.amountOut.toString()), swapData.addressOut]}/>}
            
            
            </ButtonGroup>
            
        </Box>
  )
}

export default ReviewSwap