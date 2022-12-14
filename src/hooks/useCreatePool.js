import {useState, useEffect} from 'react'
import {useSigner, useWaitForTransaction} from "wagmi"


function useCreatePool(factory, tokenA, tokenB, callback) {
    const {data: signer} = useSigner();
    const [hash, setHash] = useState("")
    const { data, isError, isLoading, isSuccess } = useWaitForTransaction({
        hash: hash,
      })


    const createPool = async() => {

        const data = await factory.connect(signer).createPair(tokenA, tokenB)
        setHash(data.hash)
        console.log(data)
    }


    useEffect(()=> {
        if(isSuccess) {
            callback()
        }
        console.log(data, isError, isLoading, isSuccess)


    },[isSuccess])


  
    return {createPool, isLoading, isError, isSuccess}
} 

export default useCreatePool