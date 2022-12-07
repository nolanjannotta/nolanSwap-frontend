import React,{useState, useEffect} from 'react'
import styled from 'styled-components'
import { utils, constants } from "ethers";
import { useAccount, useSigner} from 'wagmi'
import {SwapInput, Input} from "../styles"






const InitializePool = ({pool, poolData, pairTokenA, pairTokenB}) => {
    const [allowances, setAllowances] = useState({
        tokenA:0,
        tokenB:0
    })
    const [swapAmount, setSwapAmount] = useState({
        tokenA: 0,
        tokenB: 0
    })
    const { address } = useAccount();
    const { data: signer } = useSigner()


    const getAllowance = async() => {
        let token1Allowance = await pairTokenA.allowance(address, poolData.address)
        let token2Allowance = await pairTokenB.allowance(address, poolData.address)
        setAllowances({
            tokenA: token1Allowance,
            tokenB: token2Allowance
        })
    } 
    const approvePool = async(tokenContract) => {
        await tokenContract.connect(signer).approve(poolData.address, utils.parseEther("10000000"));    
    }
    const initializePool = async() => {
        await pool.connect(signer).initializePool(utils.parseEther(swapAmount.tokenA.toString()), utils.parseEther(swapAmount.tokenB.toString()))
    }
    useEffect(()=> {
        getAllowance()    
    }, [poolData.address])

    if(poolData.address == constants.AddressZero) {
        return(
            <div>
                create pool above
            </div>
        )
    }
    else {
        return (
            <SwapInput>
                        {poolData.token1Name}
                        {allowances.tokenA == 0 && <button onClick={() => {approvePool(pairTokenA)}}>allow all</button>}
                        <Input type="number" name="name"   onChange={(event) => {setSwapAmount(prev => ({...prev, tokenA: event.target.value}))}} />
                        {poolData.token2Name}
                        {allowances.tokenB == 0 && <button onClick={() => {approvePool(pairTokenB)}}>allow all</button>}
                        <Input type="number" name="name"   onChange={(event) => {setSwapAmount(prev => ({...prev, tokenB: event.target.value}))}}/>
                        <button onClick={initializePool}>initialize pool</button>
                         
                        </SwapInput>
        )

    }
    
}

export default InitializePool

