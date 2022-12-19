import {useEffect, useState} from 'react'
import {useSigner, useWaitForTransaction} from "wagmi"
import {utils} from "ethers"


function useInitialize(poolContract, initAmount, callback) {

    const {data: signer} = useSigner();
    const [hash, setHash] = useState("")
    const { data, isError, isLoading, isSuccess } = useWaitForTransaction({
        hash: hash,
      })

    console.log(utils.parseEther(initAmount.tokenA).toString(), utils.parseEther(initAmount.tokenB).toString())
    const initialize = async() => {
        if(!initAmount.tokenA || !initAmount.tokenB)
            return
        const data = await poolContract.connect(signer).initializePool(utils.parseEther(initAmount.tokenA), utils.parseEther(initAmount.tokenB))
        setHash(data.hash)
    }


    useEffect(()=> {
        if(isSuccess) {
            callback && callback()
        }

    },[isSuccess])


  
    return {initialize, isLoading, isError, isSuccess}
}

export default useInitialize