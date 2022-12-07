import MockERC20Abi  from "./ABI/MockERC20"
import PoolFactoryAbi from "./ABI/PoolFactory"
import PoolABI from "./ABI/NSPool.json"
import {getContract, getProvider} from '@wagmi/core'

const schruteAddress = "0xF66CfDf074D2FFD6A4037be3A669Ed04380Aef2B"
const stanleyAddress = "0xFC4EE541377F3b6641c23CBE82F6f04388290421"
const correlated1Address = "0x20d7B364E8Ed1F4260b5B90C41c2deC3C1F6D367"
const correlated2Address = "0xf5C3953Ae4639806fcbCC3196f71dd81B0da4348" 

const provider = getProvider();



export const poolFactory = getContract({
    addressOrName: factoryAddress,
    contractInterface: PoolFactoryAbi,
    signerOrProvider: provider
});




// export const pairTokenA = useContract({
//     addressOrName: tokenPair.tokenA,
//     contractInterface: MockERC20Abi,
//     signerOrProvider: provider
// });
// export const pairTokenB = useContract({
//     addressOrName: tokenPair.tokenB,
//     contractInterface: MockERC20Abi,
//     signerOrProvider: provider
// });
// export const poolContract = useContract({
//     addressOrName: poolData.address,
//     contractInterface: PoolABI,
//     signerOrProvider: provider
// });