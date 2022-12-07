import React from 'react'
import {useContract, useProvider} from 'wagmi'
import MockERC20Abi  from "../ABI/MockERC20"



function useTokenPair(addressA, addressB) {
    const provider = useProvider();

    const pairTokenA = useContract({
        addressOrName: addressA,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });
    const pairTokenB = useContract({
        addressOrName: addressB,
        contractInterface: MockERC20Abi,
        signerOrProvider: provider
    });

  return {pairTokenA, pairTokenB}
}

export default useTokenPair