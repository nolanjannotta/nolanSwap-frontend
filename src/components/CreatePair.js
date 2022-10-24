import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {ConnectButton} from '@rainbow-me/rainbowkit';
import { useAccount, useContract, useProvider, useSigner,useWaitForTransaction, useContractWrite } from 'wagmi'

import MockERC20Abi  from "../ABI/MockERC20"
import PoolFactoryAbi from "../ABI/PoolFactory"
import PoolABI from "../ABI/Pool"
import { utils } from "ethers";


function InitializePair() {



    return(
        <div>hello</div>
    )
}

function CreatePair(props) {

const { address, isConnected } = useAccount();


// const stanleyAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
// const schruteAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";


const [token1, setToken1]= useState("")
const [token2, setToken2]= useState("")

const [token1Name, setToken1Name] = useState("")
const [token2Name, setToken2Name] = useState("")

const [token1Amount, setToken1Amount] = useState(0)
const [token2Amount, setToken2Amount] = useState(0)

const [currentReserves, setCurrentReserves] = useState([null,null])

const [allowances, setAllowances] = useState([])
console.log(allowances)
const [poolData, setPoolData] = useState({})
console.log(poolData)
const [createButton, setCreateButton] = useState({text: "select tokens", action: ()=> {return}})

const [toggle, setToggle] = useState(0)


const [pool, setPool] = useState("");
const [createPoolHash, setCreatePoolHash] = useState("");

const { data, isError, isLoading } = useWaitForTransaction({
    hash: createPoolHash,
  })

  
const provider = useProvider();
const { data: signer } = useSigner()

const poolFactory = useContract({
    addressOrName: props.factory,
    contractInterface: PoolFactoryAbi,
    signerOrProvider: provider
});
const token1Contract = useContract({
    addressOrName: token1,
    contractInterface: MockERC20Abi,
    signerOrProvider: provider
});
const token2Contract = useContract({
    addressOrName: token2,
    contractInterface: MockERC20Abi,
    signerOrProvider: provider
});

const poolContract = useContract({
    addressOrName: pool,
    contractInterface: PoolABI,
    signerOrProvider: provider
});



const getliquidityAmount = async() => {



}

const getReserveBalances = async() => {
    let reserves = await poolContract.getBalances()
    setCurrentReserves(reserves)

}



const createPair = async() => {
    if(utils.isAddress(token1) && utils.isAddress(token2)) {
       let receipt = await poolFactory.connect(signer).createPair(token1, token2)
        setCreatePoolHash(receipt.hash) 
    }
    

}

const InitializePool = async() => {
    if(token1Amount == 0 || token2Amount == 0) return;
    console.log("hello")
    setToggle(1)
    
    await poolContract.connect(signer).initializePool(utils.parseUnits(token1Amount.toString(), "ether"), utils.parseUnits(token2Amount.toString(), "ether"))
    // await poolContract.connect(signer).initializePool(token1Amount, token2Amount)
    

}
const approvePool = async(tokenContract) => {
    let balance = await tokenContract.balanceOf(address)
    await tokenContract.connect(signer).approve(pool, balance);

}

const getAllowance = async() => {
    let token1Allowance = await token1Contract.allowance(address, poolContract.address)
    let token2Allowance = await token2Contract.allowance(address, poolContract.address)
    setAllowances([token1Allowance,token2Allowance])
}



const getPoolData = async() => {
    let poolData = {}
    let reserves = await poolContract.getBalances()
    let liquidity = await poolContract.totalLiquidity()
    let token1Name = await token1Contract.name()   
    let token2Name = await token2Contract.name()    
    let initialized = await poolContract.initialized()
    console.log(initialized)
    poolData.reserves = reserves;
    poolData.liquidity = Number(liquidity);
    poolData.token1Name = token1Name;
    poolData.token2Name = token2Name;
    poolData.initialized = initialized;

    setPoolData(poolData)
    setToken1Name(token1Name)
    setToken2Name(token2Name)
    setCurrentReserves(reserves)

   
    // setCreateButton({action: ()=>{console.log("add liquidity")}, text: "add liquidity"})
    }




useEffect(()=> {
    
    getPoolData()
    getAllowance()
        
    // setCreateButton({action: async ()=>{poolContract.connect(signer).initializePool(token1Amount, token2Amount)}, text: "initialize pool"}) 

    if(!poolData.initialized && toggle) {
        setCreateButton({action: InitializePool, text: "initialize pool"}) 
        // setCreateButton({action: ()=>{console.log}, text: "initialize pool"}) 
        console.log(currentReserves)
        
    }

}, [poolContract])


const getPool = async() => {
    let pool = await poolFactory.getPool(token1,token2);
    setPool(pool); 

    if(pool == "0x0000000000000000000000000000000000000000") {
        setCreateButton({action: createPair, text: "create pair"})    
        return;
        }

    setCreateButton({action: ()=>{setToggle(1)}, text: "next"}) 
}

// this gets the pool address as soon as two valid addresses are entered, 
// also gets the allowances

useEffect(()=> {
    if(!isConnected) return;

    if (utils.isAddress(token1) && utils.isAddress(token2) && !toggle) {
        getPool()
        // setCreateButton({action: ()=>{setToggle(true)}, text: "next"}) 
    }

    
    
},[token1, token2])




// useEffect(()=>{
//     // if(token1Contract.allowance(address, poolContract.address == 0 || token2Contract.allowance(address, poolContract.address == 0 ))
        
//     if(currentReserves[0] == 0 && currentReserves[1] == 0)
//         setCreateButton({action: async ()=>{poolContract.connect(signer).initializePool(token1Amount, token2Amount)}, text: "initialize pool"}) 

// },[currentReserves])




  return (
    <Container>
        
        <SwapBox>
            Create a pair & add liquidity


            {toggle ==0
            &&
            <SwapInput>


                tokenA
                <Input type="text" name="name" onChange={(event)=> {setToken1(event.target.value)}} />
                tokenB  
                <Input type="text" name="name" onChange={(event) =>{setToken2(event.target.value)}}/>
            </SwapInput>
            
            }
            { toggle ==1 
            &&
            <SwapInput>
                    
                {token1Name} - current reserves: {utils.formatEther(currentReserves[0])}
                {allowances[0] == 0 && <button onClick={() => {approvePool(token1Contract)}}>allow all</button>}
                <Input type="number" name="name"  onChange={(event) => {setToken1Amount(event.target.value)}} />
                {token2Name} - current reserves: {utils.formatEther(currentReserves[1])}
                {allowances[1] == 0 && <button onClick={() => {approvePool(token2Contract)}}>allow all</button>}
                <Input type="number" name="name"  onChange={(event) =>{setToken2Amount(event.target.value)}}/>

            </SwapInput>

            }
            <div>
            {toggle > 0 && <button onClick={() => setToggle(prev => prev-1)}>back</button>}
            <button onClick={createButton.action}>{createButton.text}</button>
            </div>


        </SwapBox>

    </Container>
  )
}

export default CreatePair


const Wrapper = styled.div`
    background-color: #fbf2c4;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

`

const Container = styled.div`
    background-color: #74a892;
    width: 30vw;
    height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    border: 2px solid #008585;
    box-shadow: 8px 8px 8px #615e4c;



`
const SwapInput = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;

`
const SwapBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`

const Input = styled.input`


`