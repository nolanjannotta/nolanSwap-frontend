import {useState, useEffect} from 'react'
import {isZeroAddress} from "../utils"

function usePool(tokenA, tokenB, poolFactory, callback) {
    const [poolAddress, setPoolAddress] = useState("")

    
    
    const getPool = async() => {
        if(isZeroAddress(tokenA) || isZeroAddress(tokenB)) return
        let pool = await poolFactory.getPool(tokenA,tokenB);
        setPoolAddress(pool)
      }

    useEffect(()=> {
        getPool();
    }, [tokenA, tokenB])
  
  
    return{poolAddress, getPool}

}

export default usePool