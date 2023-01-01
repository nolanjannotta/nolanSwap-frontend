import {useState, useEffect} from 'react'
import {utils} from "ethers"
import {useAccount,useContract, useSigner, useWaitForTransaction, erc20ABI} from "wagmi"
 


function useAllowance(poolData, callback) {
    const [allowances, setAllowances] = useState({})
    const [hash, setHash] = useState("")
    // const [args, setArgs] = useState(undefined)
    const {data: signer} = useSigner();
    const {address} = useAccount();
    const amount = utils.parseEther("10000000");

    const tokenA = useContract({
        addressOrName: poolData.addressA,
        contractInterface: erc20ABI,
        signerOrProvider: signer
    })
    const tokenB = useContract({
        addressOrName: poolData.addressB,
        contractInterface: erc20ABI,
        signerOrProvider: signer
    })

    // const { config: tokenAConfig } = usePrepareContractWrite({
    //     addressOrName: poolData.addressA,
    //     contractInterface: erc20ABI,
    //     functionName: 'approve',
    //     args: [poolData.address, amount]
    //   })

    //   const { config: tokenBConfig } = usePrepareContractWrite({
    //     addressOrName: poolData.addressB,
    //     contractInterface: erc20ABI,
    //     functionName: 'approve',
    //     args: [poolData.address, amount]
    //   })
    //   const { write: approveA, isSuccess: tokenASuccess } = useContractWrite({
    //     ...tokenAConfig,
    //     onSuccess() {
    //         getAllowance()
    //     }
    
    // })
    //   const { write: approveB, isSuccess: tokenBSuccess } = useContractWrite({
    //     ...tokenBConfig,
    //     onSuccess() {
    //         getAllowance()
    //     }
    //   })

    const getAllowance = async() => {
        let token1Allowance = await tokenA.allowance(address, poolData.address)
        let token2Allowance = await tokenB.allowance(address, poolData.address)

        setAllowances({
            tokenA: token1Allowance,
            tokenB: token2Allowance
        })

    } 
    

    
    const {isSuccess,isFetching,isLoading} = useWaitForTransaction({
        hash: hash,
        onSuccess(data, error) {
            getAllowance()
            console.log("error", error)
            console.log("data", data)
          },
      })

    
    
    
    const approveA = async () => {
        const results = await tokenA.approve(poolData.address, amount);
        await results.wait()
        setHash(results.hash)
    }
    const approveB = async () => {
        const results = await tokenB.approve(poolData.address, amount)
        await results.wait()
        setHash(results.hash)
    }

    // useEffect(()=> {
    //     setAllowanceData(prev => ({
    //         ...prev,
    //         getAllowance: getAllowance
    //     }))
    // },[])

    // useEffect(() => {
    //     if(isSuccess) {
    //     const timer = setTimeout(() => {console.log("timer start");getAllowance()}, 4000);
    //     return () => clearTimeout(timer);    
    //     }
        
    //   }, [isSuccess]);

    useEffect(()=> {
        getAllowance()
        
    },[poolData])

  return {allowances, approveA, approveB}
}

export default useAllowance