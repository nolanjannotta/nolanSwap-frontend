import {useState, useEffect} from 'react'
import {constants,utils} from "ethers"
import {useAccount, useContract, useProvider,useToken} from "wagmi"
import useTokenPair from "./useTokenPair"
import PoolABI from "../ABI/NSPool.json"
import {isZeroAddress} from "../utils"


function useGetPoolData(poolFactory) {
    const basePoolData = {
        address: constants.AddressZero,
        reservesA: 0,
        reservesB: 0,
        symbol:"",
        totalLiquidity: 0,
        initialized: false,
        yourLPBalance: 0,
        addressA: constants.AddressZero,
        addressB: constants.AddressZero,
        fee: 0,
        poolFetched: false,
        poolExists: false
    }
    const baseTokenPair = {tokenA: undefined, tokenB: undefined}

    const provider = useProvider();

    const {address} = useAccount()
    const [tokenPair, setTokenPair] = useState(baseTokenPair)
    
    const [poolData, setPoolData] = useState(basePoolData)
    const [loading, setLoading] = useState(false)
    const {data: tokenAData} = useToken({
        address: tokenPair.tokenA,
      })
      
    const {data: tokenBData} = useToken({
        address: tokenPair.tokenB,
      })
    const poolContract = useContract({
        addressOrName: poolData.address,
        contractInterface: PoolABI,
        signerOrProvider: provider
    });
    


    

    const getPool = async() => {
        if(!tokenPair.tokenA || !tokenPair.tokenB) {
            return
        }
        setLoading(true)
        let pool = await poolFactory.getPool(tokenPair.tokenA,tokenPair.tokenB);
        setPoolData(prev => ({...prev, address: pool}))
        if(isZeroAddress(pool)) {
            setLoading(false)
            setPoolData(prev => ({...prev, poolExists: false, poolFetched:true}))

        }
        
      }


    const getPoolData = async() => {
        if(isZeroAddress(poolContract.address)) {

          return
        }
        
        let lpSymbol = await poolContract.symbol();
        let reservesA = await poolContract.tokenToInternalBalance(tokenPair.tokenA)
        let reservesB = await poolContract.tokenToInternalBalance(tokenPair.tokenB)
        let tokenAName = tokenAData.name
        let tokenBName = tokenBData.name
        let initialized = await poolContract.initialized();
        let totalLiquidity = await poolContract.totalLiquidity();
        let yourLPBalance = await poolContract.balanceOf(address);
        let fee = await poolContract.fee();

        setPoolData(prev => ({
            ...prev,
            address: poolContract.address,
            reservesA: utils.formatEther(reservesA.toString()),
            reservesB: utils.formatEther(reservesB.toString()),
            addressA: tokenPair.tokenA,
            addressB: tokenPair.tokenB,
            initialized: initialized,
            totalLiquidity: utils.formatEther(totalLiquidity.toString()),
            symbol: lpSymbol,
            yourLPBalance: utils.formatEther(yourLPBalance.toString()),
            token1Name: tokenAName, 
            token2Name: tokenBName,
            fee: (fee/ 10).toString(),
            poolFetched: true,
            poolExists: true
    
        }))
        setLoading(false)
    
    }

    console.log(poolData)

    const resetPoolData = () => {
        setPoolData(basePoolData);
        setTokenPair(baseTokenPair);
    }

    const updatePairTokens = (newAddress) => {
        if (newAddress == tokenPair.tokenA) {
          return;
        }
        setTokenPair((prev) => ({
          ...prev,
          tokenA: newAddress,
          tokenB: prev.tokenA,
        }));
      };


    useEffect(()=> {
        getPoolData()

    },[poolContract])


    useEffect(()=> {
        getPool();
        
        
    }, [tokenPair])
    




  return {poolData, getPoolData,getPool, tokenPair, setTokenPair, resetPoolData, setPoolData, updatePairTokens, poolContract, loading}
}

export default useGetPoolData