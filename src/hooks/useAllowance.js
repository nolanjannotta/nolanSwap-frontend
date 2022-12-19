import {useState, useEffect} from 'react'
import {utils} from "ethers"
import {useAccount,useContract, usePrepareContractWrite, useContractWrite, useSigner} from "wagmi"
import MockERC20 from "../ABI/MockERC20.json"
import { isZeroAddress } from '../utils'
 

function useAllowance(poolData) {
    const [allowanceData, setAllowanceData] = useState({})
    const {data: signer} = useSigner();
    const {address} = useAccount();
    const amount = utils.parseEther("10000000");
    
    const tokenA = useContract({
        addressOrName: poolData.addressA,
        contractInterface: MockERC20,
        signerOrProvider: signer
    })
    const tokenB = useContract({
        addressOrName: poolData.addressB,
        contractInterface: MockERC20,
        signerOrProvider: signer
    })
    
    const getAllowance = async() => {
        let token1Allowance = await tokenA.allowance(address, poolData.address)
        let token2Allowance = await tokenB.allowance(address, poolData.address)
        setAllowanceData({
            tokenA: token1Allowance,
            tokenB: token2Allowance
        })
    } 
    
    const approveA = async () => {
        await tokenA.connect(signer).approve(poolData.address, amount);

    }
    const approveB = async () => {
        await tokenB.connect(signer).approve(poolData.address, amount)
        
    }

    useEffect(()=> {
        setAllowanceData(prev => ({
            ...prev,
            getAllowance: getAllowance
        }))
    },[])

    

    useEffect(()=> {
        getAllowance()

    },[poolData.address])

  return {allowanceData, approveA, approveB}
}

export default useAllowance