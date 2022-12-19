import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import CreatePair from './CreatePair';
import SelectPair from './SelectPair';
import ExampleTokens from './ExampleTokens';
import { useAccount, useContract, useProvider} from 'wagmi'
import { utils, constants } from "ethers";
import PoolFactoryAbi from "../ABI/PoolFactory"
import PoolABI from "../ABI/NSPool.json"
import CustomConnect from "./CustomConnect"
import useTokenPair from "../hooks/useTokenPair"
import {factory} from "../addresses"
import {isZeroAddress} from "../utils"
import useAllowance from '../hooks/useAllowance';
import usePool from '../hooks/usePool';




// to handle all logic

function Main() {

    const provider = useProvider();

    const {address} = useAccount()

    const [pool, setPool] = useState("")

   
    const [poolData, setPoolData] = useState({
        address: "",
        reservesA: 0,
        reservesB: 0,
        symbol:"",
        totalLiquidity: 0,
        initialized: false,
        yourLPBalance: 0,
        addressA: constants.AddressZero,
        addressB: constants.AddressZero,
        fee: 0
    })
    
    const poolFactory = useContract({
      addressOrName: factory,
      contractInterface: PoolFactoryAbi,
      signerOrProvider: provider
    });

    const {pairTokenA, pairTokenB} = useTokenPair(poolData.addressA, poolData.addressB);

    const {allowanceData} = useAllowance(poolData, pairTokenA, pairTokenB);

    const {poolAddress, getPool} = usePool(poolData.addressA, poolData.addressB,poolFactory)

    const poolContract = useContract({
        addressOrName: poolAddress,
        contractInterface: PoolABI,
        signerOrProvider: provider
    });

const getPoolData = async() => {
    let lpSymbol = await poolContract.symbol();
    let reservesA = await poolContract.tokenToInternalBalance(poolData.addressA)
    let reservesB = await poolContract.tokenToInternalBalance(poolData.addressB)
    let initialized = await poolContract.initialized();
    let totalLiquidity = await poolContract.totalLiquidity();
    let yourLPBalance = await poolContract.balanceOf(address);
    let fee = await poolContract.fee();
    let token1Name = await pairTokenA.name()
    let token2Name = await pairTokenB.name()

    setPoolData(prev => ({
        ...prev,
        address: poolAddress,
        reservesA: utils.formatEther(reservesA.toString()),
        reservesB: utils.formatEther(reservesB.toString()),
        initialized: initialized,
        totalLiquidity: utils.formatEther(totalLiquidity.toString()),
        symbol: lpSymbol,
        yourLPBalance: utils.formatEther(yourLPBalance.toString()),
        token1Name: token1Name, 
        token2Name: token2Name,
        fee: (fee/ 10).toString(),
    }))

} 


useEffect(()=>{
    if(!isZeroAddress(poolAddress)) 
        getPoolData()
    else 
      setPoolData(prev => ({
        ...prev,
        address: constants.AddressZero,
      }))
},[poolAddress])




  return (
    <Background>

            <AccountDetails>
          <CustomConnect/>
            </AccountDetails>  

        <ExampleTokens 
            getPool={getPool}
            poolData={poolData} setPoolData={setPoolData} 
            poolFactory={poolFactory} 
            ></ExampleTokens>       

         <CardHolder>
           <CreatePair 
            poolData={poolData} 
            poolContract={poolContract}
            pairTokenA={pairTokenA}
            pairTokenB={pairTokenB}
            allowanceData={allowanceData}
            
            
            ></CreatePair>

          <SelectPair 
            poolData={poolData} 
            poolContract={poolContract}
            pairTokenA={pairTokenA}
            pairTokenB={pairTokenB}
            allowanceData={allowanceData}
            ></SelectPair> 
          </CardHolder>



    </Background>
  )
}

export default Main

const CardHolder = styled.div`
  display: flex;
  // flex-direction: column;
  justify-content: space-between;
  width: 65%;
`

const Background = styled.div`
background-color: #fbf2c4;
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center
`

const AccountDetails = styled.div`
position: absolute;
top: 0;
right: 0;

`
