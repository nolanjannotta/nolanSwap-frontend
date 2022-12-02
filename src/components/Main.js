import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import CreatePair from './CreatePair';
import SelectPair from './SelectPair';
import ExampleTokens from './ExampleTokens';
import { useAccount, useContract, useProvider, useSigner,usePrepareContractWrite, useContractWrite } from 'wagmi'
import { utils, constants } from "ethers";
import MockERC20Abi  from "../ABI/MockERC20"
import PoolFactoryAbi from "../ABI/PoolFactory"
import PoolABI from "../ABI/NSPool.json"
import CustomConnect from "./CustomConnect"





// to handle all logic

function Main() {

    const provider = useProvider();

    const {address} = useAccount()

    const [pool, setPool] = useState("")

    const factoryAddress = "0xbf2ad38fd09F37f50f723E35dd84EEa1C282c5C9"
    const schruteAddress = "0xF66CfDf074D2FFD6A4037be3A669Ed04380Aef2B"
    const stanleyAddress = "0xFC4EE541377F3b6641c23CBE82F6f04388290421"
    const correlated1Address = "0x20d7B364E8Ed1F4260b5B90C41c2deC3C1F6D367"
    const correlated2Address = "0xf5C3953Ae4639806fcbCC3196f71dd81B0da4348" 

    const [poolData, setPoolData] = useState({
        address: "",
        reservesA: 0,
        reservesB: 0,
        symbol:"",
        totalLiquidity: 0,
        isInitialized: false,
        yourLPBalance: 0,
        addressA:"",
        addressB:""
    })

    

    const [tokenPair, setTokenPair] = useState({
        tokenA: constants.AddressZero,
        tokenB: constants.AddressZero
    })


    const poolFactory = useContract({
        addressOrName: factoryAddress,
        contractInterface: PoolFactoryAbi,
        signerOrProvider: provider
    });




    const pairTokenA = useContract({
        addressOrName: tokenPair.tokenA,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });
    const pairTokenB = useContract({
        addressOrName: tokenPair.tokenB,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });
    const poolContract = useContract({
        addressOrName: poolData.address,
        contractInterface: PoolABI,
        signerOrProvider: provider
    });

    const getPool = async() => {
        let pool = await poolFactory.getPool(tokenPair.tokenA,tokenPair.tokenB);
        setPoolData(prev => ({...prev, address: pool}))
    }





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
        tokenPair: tokenPair
    }))
} 

useEffect(()=>{
    if(poolContract) 
        getPoolData()
    
},[poolContract])

useEffect(()=> {
    if(utils.isAddress(tokenPair.tokenA) && tokenPair.tokenA != constants.AddressZero  && utils.isAddress(tokenPair.tokenB)&& tokenPair.tokenB != constants.AddressZero) {

        getPool();
    }
},[tokenPair])






  return (
    <Background>

            <AccountDetails>
          <CustomConnect/>
            </AccountDetails>  

        <ExampleTokens 
            pool={pool} setPool={setPool} 
            poolData={poolData} setPoolData={setPoolData} 
            tokenPair={tokenPair} setTokenPair={setTokenPair}
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
