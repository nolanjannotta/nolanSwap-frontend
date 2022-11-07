import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import CreatePair from './CreatePair';
import SelectPair from './SelectPair';
import ExampleTokens from './ExampleTokens';
import { useAccount, useContract, useProvider, useSigner,usePrepareContractWrite, useContractWrite } from 'wagmi'
import { utils, constants } from "ethers";
import MockERC20Abi  from "../ABI/MockERC20"
import PoolFactoryAbi from "../ABI/PoolFactory"
import PoolABI from "../ABI/Pool.json"




// to handle all logic

function Main() {

    const provider = useProvider();

    const {address} = useAccount()

    const [pool, setPool] = useState("")
    const factory = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    const schrute = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
    const stanley = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707" 
    const [poolData, setPoolData] = useState({
        address: "",
        reservesA: 0,
        reservesB: 0,
        symbol:"",
        totalLiquidity: 0,
        isInitialized: false,
        yourLPBalance: 0
    })

    const [tokenData, setTokenData]= useState({
        schruteName: "",
        stanleyName: "",
        schruteBalance: 0,
        stanleyBalance: 0

    })

    const [tokenPair, setTokenPair] = useState({
        tokenA: constants.AddressZero,
        tokenB: constants.AddressZero
    })

    const [tokenNames, setTokenNames] = useState({
        tokenA: "",
        tokenB: ""
    })



    const poolFactory = useContract({
        addressOrName: factory,
        contractInterface: PoolFactoryAbi,
        signerOrProvider: provider
    });

    const schruteBucks = useContract({
        addressOrName: schrute,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });
    const stanleyNickels = useContract({
        addressOrName: stanley,
        contractInterface: MockERC20Abi,
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

    const getNames = async() => {
        let nameA = await pairTokenA.name();
        let nameB = await pairTokenB.name();
        setTokenNames({
            tokenA: nameA,
            tokenB: nameB
        })


    }

    const getTokenData = async() => {
        let _schrute = await schruteBucks.name()
        let _stanley = await stanleyNickels.name()
        let schruteBalance = await schruteBucks.balanceOf(address)
        let stanleyBalance = await stanleyNickels.balanceOf(address)
        setTokenData({
            schruteName: _schrute,
            stanleyName: _stanley,
            schruteBalance: utils.formatEther(schruteBalance),
            stanleyBalance: utils.formatEther(stanleyBalance)

        })


    }


const getPoolData = async() => {
    // let pool = await poolFactory.getPool(tokenPair.tokenA,tokenPair.tokenB);
    // // setPool(pool);
    // setPoolData(prev => ({...prev, address: pool}))
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
        token2Name: token2Name
    }))

// }
} 

useEffect(()=>{
    if(poolContract) 
        getPoolData()
    
},[poolContract])

useEffect(()=> {
    if(utils.isAddress(tokenPair.tokenA) && tokenPair.tokenA != constants.AddressZero  && utils.isAddress(tokenPair.tokenB)&& tokenPair.tokenB != constants.AddressZero) {

        getPool();
        getNames();
        // console.log(tokenPair)
    }
},[tokenPair])


useEffect(()=>{
    getTokenData()
},[])



  return (
    <div>
        <ExampleTokens 
            pool={pool} 
            setPool={setPool} 
            poolData={poolData}
            setPoolData={setPoolData} 
            tokenPair={tokenPair}
            setTokenPair={setTokenPair}
            stanleyNickels={stanleyNickels}
            schruteBucks={schruteBucks}
            factory={factory} 
            schrute={schrute} 
            stanley={stanley}
            tokenData={tokenData}
            
            
            ></ExampleTokens>       

         <CardHolder>
           <CreatePair 
            poolData={poolData} 
            factory={factory}

            poolContract={poolContract}
            pairTokenA={pairTokenA}
            pairTokenB={pairTokenB}
            tokenNames={tokenNames}
            
            
            ></CreatePair>
          <SelectPair 
            poolData={poolData} 
            factory={factory}
            poolContract={poolContract}
            pairTokenA={pairTokenA}
            pairTokenB={pairTokenB}
            tokenNames={tokenNames}
            ></SelectPair> 
          </CardHolder>


    </div>
  )
}

export default Main

const CardHolder = styled.div`
  display: flex;
  // flex-direction: column;
  justify-content: space-evenly;
  align-items: space-evenly;



`