import React from 'react'
import {SwapInput} from "../styles"
import {usePrepareContractWrite, useContractWrite} from 'wagmi'
import PoolABI from "../ABI/NSPool.json"
import { utils } from "ethers";





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
        <button onClick={swap}>swaaaaap</button>
    )
}


function ReviewSwap({swapData, setReview, pool}) {
  return (
    <SwapInput>
            review swap
            <div>
            you send {swapData.amountIn} {swapData.nameIn}
            </div>
            <div>
            you recieve {swapData.amountOut} {swapData.nameOut}
            </div>
            {swapData.lastEntered == 1 && <Swap functionName="swapExactAmountIn" contractAddress={pool} args={[utils.parseEther(swapData.amountIn.toString()), swapData.addressIn]}/>}
            {swapData.lastEntered == 2 && <Swap functionName="swapExactAmountOut" contractAddress={pool} args={[utils.parseEther(swapData.amountOut.toString()), swapData.addressOut]}/>}
            
            <button onClick={()=>{setReview(prev => !prev)}}>back</button>
        </SwapInput>
  )
}

export default ReviewSwap