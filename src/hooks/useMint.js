import React from 'react'
import {useAccount,useContractRead,usePrepareContractWrite, useContractWrite } from 'wagmi'
import {constants, utils} from "ethers";
import MockERC20Abi  from "../ABI/MockERC20"



function useMint(tokenAddress) {
    const {address} = useAccount();

    const token = {
        addressOrName: tokenAddress,
        contractInterface: MockERC20Abi,
    }
    
    
    const { data: balance, refetch: getBalance} = useContractRead({
        ...token,
        functionName: 'balanceOf',
        args: [address]
      })
    const { data: name,} = useContractRead({
        ...token,
        functionName: 'name',
      })


    const {config: mintConfig } = usePrepareContractWrite({
        ...token,
        functionName: "mint",
        args: [utils.parseEther("10000")]
      })

    const { write: mint } = useContractWrite({
        ...mintConfig,
        onSuccess() {
            getBalance()
          },
        onError(error) {
            console.log('token mint error:', error)
          },
    
    })
  return {balance, name, getBalance, mint}
}

export default useMint