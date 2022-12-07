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





// to handle all logic

function Main() {

    const provider = useProvider();

    const {address} = useAccount()

    const [pool, setPool] = useState("")

    const factoryAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
    const schruteAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"
    const stanleyAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
    const correlated1Address = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"
    const correlated2Address = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318" 

    const [poolData, setPoolData] = useState({
        address: "",
        reservesA: 0,
        reservesB: 0,
        symbol:"",
        totalLiquidity: 0,
        initialized: false,
        yourLPBalance: 0,
        addressA: constants.AddressZero,
        addressB: constants.AddressZero
    })
    console.log(poolData)

    const {pairTokenA, pairTokenB} = useTokenPair(poolData.addressA, poolData.addressB);

    const poolFactory = useContract({
        addressOrName: factoryAddress,
        contractInterface: PoolFactoryAbi,
        signerOrProvider: provider
    });
    const poolContract = useContract({
        addressOrName: poolData.address,
        contractInterface: PoolABI,
        signerOrProvider: provider
    });

const getPoolData = async() => {
    let lpSymbol = await poolContract.symbol();
    let reserves = await poolContract.getBalances();
    let initialized = await poolContract.initialized();
    let totalLiquidity = await poolContract.totalLiquidity();
    let yourLPBalance = await poolContract.balanceOf(address);
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
    }))

} 

useEffect(()=>{
    if(poolContract) 
        getPoolData()
    
},[poolContract])
const getPool = async() => {
    let pool = await poolFactory.getPool(poolData.addressA,poolData.addressB);
    setPoolData(prev => ({...prev, address: pool}))
}
useEffect(()=> {
   

    if(utils.isAddress(poolData.addressA) && poolData.addressA != constants.AddressZero  && 
    utils.isAddress(poolData.addressB) && poolData.addressB != constants.AddressZero) {
        getPool();
    }
},[poolData.addressA, poolData.addressB])






  return (
    <Background>

            <AccountDetails>
          <CustomConnect/>
            </AccountDetails>  

        <ExampleTokens 
            pool={pool} setPool={setPool} 
            poolData={poolData} setPoolData={setPoolData} 
            poolFactory={poolFactory} 
            schruteAddress={schruteAddress} 
            stanleyAddress={stanleyAddress}
            correlated1Address={correlated1Address}
            correlated2Address={correlated2Address}
            
            
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
