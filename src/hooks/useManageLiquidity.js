import React, { useEffect, useState } from 'react'
import {useSigner} from 'wagmi'
import { utils } from "ethers";


function useManageLiquidity(pool,poolData) {
    const {data: signer} = useSigner();


    const [liquidityParams, setLiquidityParams] = useState({
        nameIn: poolData.token1Name,
        addressIn: poolData.addressA,
        amountIn: 0,
        name2In: poolData.token2Name,
        address2In: poolData.addressB,
        amount2In: 0,
        removeAmount: 0
    })


    const updateLiquidityParams = async() => {
        let results = await pool.getLiquidityAmount(liquidityParams.addressIn, utils.parseEther(liquidityParams.amountIn.toString()))
    
        setLiquidityParams( prev => ({
                ...prev, 
                address2In: results[0],
                amount2In: utils.formatEther(results[1].toString())}))
    
    }
    const removeLiquidity = async() => {
        await pool.connect(signer).removeLiquidity(utils.parseEther(liquidityParams.removeAmount.toString()))
    }
    const addLiquidity = async() => {
        await pool.connect(signer).addLiquidity(liquidityParams.addressIn, utils.parseEther(liquidityParams.amountIn.toString()))
    }

  
  
    return {addLiquidity, removeLiquidity, updateLiquidityParams,setLiquidityParams, liquidityParams}
}

export default useManageLiquidity