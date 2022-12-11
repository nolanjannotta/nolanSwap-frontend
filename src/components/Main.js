import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import CreatePair from './CreatePair';
import SelectPair from './SelectPair';
import ExampleTokens from './ExampleTokens';
import { useAccount, useContract, useProvider,useContractReads, chain } from 'wagmi'
import { utils, constants } from "ethers";
import PoolFactoryAbi from "../ABI/PoolFactory"
import PoolABI from "../ABI/NSPool.json"
import MockERC20 from "../ABI/MockERC20.json"
import CustomConnect from "./CustomConnect"
import useTokenPair from "../hooks/useTokenPair"
import {factory, schruteBucks, stanleyNickels, ct1, ct2} from "../addresses"
import {isZeroAddress} from "../utils"





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

    const {pairTokenA, pairTokenB} = useTokenPair(poolData.addressA, poolData.addressB);


    const poolFactory = useContract({
        addressOrName: factory,
        contractInterface: PoolFactoryAbi,
        signerOrProvider: provider
    });
    const poolContract = useContract({
        addressOrName: poolData.address,
        contractInterface: PoolABI,
        signerOrProvider: provider
    });

    const contract = {
      addressOrName: poolData.address,
      contractInterface: PoolABI,

    }

    // const { data: _poolData, isError, isLoading, isSuccess, isFetchedAfterMount, refetch: getData} = useContractReads({
    //   contracts: [
    //     {
    //       ...contract,
    //       functionName: 'symbol',
    //     },
    //     {
    //       ...contract,
    //       functionName: 'getBalances',
    //     },
    //     {
    //       ...contract,
    //       functionName: 'initialized',
    //     },
    //     {
    //       ...contract,
    //       functionName: 'totalLiquidity',
    //     },
    //     {
    //       ...contract,
    //       functionName: 'balanceOf',
    //       args: [address]
    //     },
    //     {
    //       addressOrName: poolData.addressA,
    //       contractInterface: MockERC20,
    //       functionName: "name"
    //     },
    //     {
    //       addressOrName: poolData.addressB,
    //       contractInterface: MockERC20,
    //       functionName: "name"
    //     },
    //     {
    //       addressOrName: factory,
    //       contractInterface: PoolFactoryAbi,
    //       functionName: "getPool",
    //       args: [poolData.addressA, poolData.addressB]
    //     },
    //   ],

    //   enabled: true,
    // })

    // console.log(_poolData, isError, isLoading, isSuccess,isFetchedAfterMount)


const getPoolData = async() => {
    let lpSymbol = await poolContract.symbol();
    let reserves = await poolContract.getBalances();
    let initialized = await poolContract.initialized();
    let totalLiquidity = await poolContract.totalLiquidity();
    let yourLPBalance = await poolContract.balanceOf(address);
    let fee = await poolContract.fee();
    let token1Name = await pairTokenA.name()
    let token2Name = await pairTokenB.name()

    setPoolData(prev => ({
        ...prev,
        reservesA: utils.formatEther(reserves[0].toString()),
        reservesB: utils.formatEther(reserves[1].toString()),
        initialized: initialized,
        totalLiquidity: utils.formatEther(totalLiquidity.toString()),
        symbol: lpSymbol,
        yourLPBalance: utils.formatEther(yourLPBalance.toString()),
        token1Name: token1Name, 
        token2Name: token2Name,
        fee: (fee/ 10).toString()
    }))

} 

// useEffect(()=>{
//   if(isSuccess && _poolData) {
//     getData()
//     setPoolData(prev => ({
//       ...prev,
//       reservesA: _poolData[1] && utils.formatEther(_poolData[1][0].toString()),
//       reservesB: _poolData[1] && utils.formatEther(_poolData[1][1].toString()),
//       initialized: _poolData[2] && _poolData[2],
//       totalLiquidity: _poolData[3] && utils.formatEther(_poolData[3].toString()),
//       symbol: _poolData[0] && _poolData[0],
//       yourLPBalance: _poolData[4] && utils.formatEther(_poolData[4].toString()),
//       token1Name: _poolData[5] && _poolData[5], 
//       token2Name: _poolData[6] && _poolData[6],
//   }))
//   }
  
  
// },[poolData.address])

useEffect(()=>{
    if(!isZeroAddress(poolData.address)) 
        getPoolData()
    
},[poolData.address])

const getPool = async() => {
  if(isZeroAddress(poolData.addressA) || isZeroAddress(poolData.addressB)) return
  let pool = await poolFactory.getPool(poolData.addressA,poolData.addressB);
  setPoolData(prev => ({...prev, address: pool}))
}

useEffect(()=> {
  
    getPool();
},[poolData.addressA, poolData.addressB])






  return (
    <Background>

            <AccountDetails>
          <CustomConnect/>
            </AccountDetails>  

        <ExampleTokens 
            getPool={getPool}
            pool={pool} setPool={setPool} 
            poolData={poolData} setPoolData={setPoolData} 
            poolFactory={poolFactory} 
            schruteAddress={schruteBucks} 
            stanleyAddress={stanleyNickels}
            correlated1Address={ct1}
            correlated2Address={ct2}
            
            
            ></ExampleTokens>       

         <CardHolder>
           <CreatePair 
            poolData={poolData} 
            poolContract={poolContract}
            pairTokenA={pairTokenA}
            pairTokenB={pairTokenB}
            
            
            ></CreatePair>
            
          <SelectPair 
            poolData={poolData} 
            poolContract={poolContract}
            pairTokenA={pairTokenA}
            pairTokenB={pairTokenB}
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
