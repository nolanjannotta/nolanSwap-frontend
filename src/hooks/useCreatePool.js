import {useState, useEffect} from 'react'
import {useSigner, useWaitForTransaction} from "wagmi"


function useCreatePool(factory, tokenA, tokenB, callback) {
    const {data: signer} = useSigner();
    const [hash, setHash] = useState("")
    const { data, isError, isLoading, isSuccess } = useWaitForTransaction({
        hash: hash,
      })


    const createPool = async() => {

        const data = await factory.connect(signer).createPairCreate2(tokenA, tokenB)
        setHash(data.hash)
    }


    useEffect(()=> {
        if(isSuccess) {
            callback()
        }

    },[isSuccess])


  
    return {createPool, isLoading, isError, isSuccess}
} 

export default useCreatePool