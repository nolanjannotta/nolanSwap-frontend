import React,{useState, useEffect} from 'react'
import styled from 'styled-components'
import { utils, constants } from "ethers";
import { useAccount, useSigner, usePrepareContractWrite, useContractWrite} from 'wagmi'
import {SwapInput, Input} from "../styles"
import MockERC20Abi  from "../ABI/MockERC20"
import poolABI  from "../ABI/NSPool.json"







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

    const {config: tokenAConfig} = usePrepareContractWrite({
        addressOrName: poolData.addressA,
        contractInterface: MockERC20Abi,
        functionName: 'approve',
        args:[poolData.address, utils.parseEther("10000000")]
      })
    const {config: tokenBConfig} = usePrepareContractWrite({
        addressOrName: poolData.addressB,
        contractInterface: MockERC20Abi,
        functionName: 'approve',
        args: [poolData.address, utils.parseEther("10000000")]
      })
    const {config: initializeConfig} = usePrepareContractWrite({
        addressOrName: poolData.address,
        contractInterface: poolABI,
        functionName: 'initializePool',
        args: [utils.parseEther(swapAmount.tokenA.toString()), utils.parseEther(swapAmount.tokenB.toString())]
      })

    const {write: initialize} = useContractWrite(initializeConfig)
    const {write: approveA} = useContractWrite(tokenAConfig)
    const {write: approveB} = useContractWrite(tokenBConfig)



    const getAllowance = async() => {
        let token1Allowance = await pairTokenA.allowance(address, poolData.address)
        let token2Allowance = await pairTokenB.allowance(address, poolData.address)
        setAllowances({
            tokenA: token1Allowance,
            tokenB: token2Allowance
        })
    } 
    // const approvePool = async(tokenContract) => {
    //     await tokenContract.connect(signer).approve(poolData.address, utils.parseEther("10000000"));    
    // }
    // const initializePool = async() => {
    //     await pool.connect(signer).initializePool(utils.parseEther(swapAmount.tokenA.toString()), utils.parseEther(swapAmount.tokenB.toString()))
    // }
    useEffect(()=> {
        getAllowance()    
    }, [poolData.address])

        return (
            <SwapInput>
                {poolData.token1Name}
                {allowances.tokenA == 0 && <button onClick={approveA}>allow all</button>}
                <Input type="number" name="name"   onChange={(event) => {setSwapAmount(prev => ({...prev, tokenA: event.target.value}))}} />
                {poolData.token2Name}
                {allowances.tokenB == 0 && <button onClick={approveB}>allow all</button>}
                <Input type="number" name="name"   onChange={(event) => {setSwapAmount(prev => ({...prev, tokenB: event.target.value}))}}/>
                <button onClick={initialize}>initialize pool</button>
            </SwapInput>
        )

    }
    


export default InitializePool

