import {useState, useEffect} from 'react'
import {isZeroAddress} from "../utils"
import {constants} from "ethers"
import { useAccount, useContract, useProvider} from 'wagmi'
import PoolABI from "../ABI/NSPool.json"



function usePool(tokenA, tokenB, poolFactory) {
    const [poolAddress, setPoolAddress] = useState("")
    const[loading, setLoading] = useState(false)
    const [poolExists, setPoolExists] = useState(false)
    const provider = useProvider();

    const poolContract = useContract({
        addressOrName: poolAddress,
        contractInterface: PoolABI,
        signerOrProvider: provider
    });
    
    
    const getPool = async() => {
        
        if(isZeroAddress(tokenA) || isZeroAddress(tokenB)) {
            setPoolAddress("")
            return
        }
        setLoading(true)
        let pool = await poolFactory.getPool(tokenA,tokenB);
        setPoolAddress(pool)
        setLoading(false)
      }

    useEffect(()=> {
        getPool();
    }, [tokenA, tokenB])
    
    useEffect(()=> {
        
        isZeroAddress(poolAddress) ? setPoolExists(false) : setPoolExists(false)

    }, [poolAddress])
  
    return{poolAddress, getPool, poolContract,loading}

}

export default usePool