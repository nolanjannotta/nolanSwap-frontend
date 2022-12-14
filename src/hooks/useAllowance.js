import {useState, useEffect} from 'react'
import {utils} from "ethers"
import {useAccount, usePrepareContractWrite, useContractWrite} from "wagmi"
import MockERC20 from "../ABI/MockERC20.json"
 

function useAllowance(poolData, tokenA, tokenB) {
    const [allowanceData, setAllowanceData] = useState({})

    const {address} = useAccount();
    const amount = utils.parseEther("10000000");
    const {config: tokenAConfig} = usePrepareContractWrite({
        addressOrName: poolData.addressA,
        contractInterface: MockERC20,
        functionName: 'approve',
        args:[poolData.address, amount]
      })
    const {config: tokenBConfig} = usePrepareContractWrite({
        addressOrName: poolData.addressB,
        contractInterface: MockERC20,
        functionName: 'approve',
        args: [poolData.address, amount]
      })
      

  

    
    const getAllowance = async() => {
        let token1Allowance = await tokenA.allowance(address, poolData.address)
        let token2Allowance = await tokenB.allowance(address, poolData.address)
        console.log(token1Allowance.toString(),token2Allowance.toString())
        setAllowanceData(prev => ({
            ...prev,
            tokenA: token1Allowance,
            tokenB: token2Allowance
        }))
    } 
    const {write: approveA} = useContractWrite({...tokenAConfig, onSuccess(){getAllowance()}})
    const {write: approveB} = useContractWrite({...tokenBConfig, onSuccess(){getAllowance()}})


    useEffect(()=> {
        setAllowanceData(prev => ({
            ...prev,
            approveA: approveA,
            approveB: approveB,
            getAllowance: getAllowance
        }))
    },[approveA,approveB])

    

    useEffect(()=> {
        getAllowance()

    },[poolData.address])

  return {allowanceData}
}

export default useAllowance