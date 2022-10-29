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

const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState(0);

const [addLiquidityTokenIn, setAddLiquidityTokenIn] = useState({
    nameIn: "",
    addressIn: "",
    amountIn: 0,
    name2In: "",
    address2In: "",
    amount2In: 0
})

console.log(addLiquidityTokenIn)

const [allowances, setAllowances] = useState([])
const [poolData, setPoolData] = useState({})
const [dataLoaded, setDataLoaded] = useState(false)
const [createButton, setCreateButton] = useState({text: "select tokens", action: ()=> {return}})
const [addRemoveLiquidity, setAddRemoveLiquidity] = useState({
    button: "add liquidity",
    value: false
})
// const [addRemoveLiquidity, setAddRemoveLiquidity] = useState(false)

const maxUint = 115792089237316195423570985008687907853269984665640564039457584007913129639935;


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

const toggleAddRemoveLiquidity = () => {
    setAddRemoveLiquidity(prev => ({
        ...prev, 
        value: !prev.value,
        button: prev.value ? "add liquidity" : "remove liquidity"
    
    }))
}



const createPair = async() => {
    if(utils.isAddress(token1) && utils.isAddress(token2)) {
       let receipt = await poolFactory.connect(signer).createPair(token1, token2)
        setCreatePoolHash(receipt.hash) 
    }
    

}
const approvePool = async(tokenContract) => {
    await tokenContract.connect(signer).approve(pool, utils.parseEther("10000000"));

}

const getAllowance = async() => {
    let token1Allowance = await token1Contract.allowance(address, poolContract.address)
    let token2Allowance = await token2Contract.allowance(address, poolContract.address)
    setAllowances([token1Allowance,token2Allowance])
    console.log(token1Allowance,token2Allowance)
}



const getPoolData = async() => {
    setDataLoaded(false)
    let poolData = {}
    let reserves = await poolContract.getBalances()
    let liquidity = await poolContract.totalLiquidity()
    let token1Name = await token1Contract.name()   
    let token2Name = await token2Contract.name()    
    let initialized = await poolContract.initialized()
    let liquidityTokens = await poolContract.balanceOf(address)
    console.log(initialized)
    poolData.reserves = reserves;
    poolData.liquidity = Number(liquidity);
    poolData.token1Name = token1Name;
    poolData.token2Name = token2Name;
    poolData.initialized = initialized;
    poolData.liquidityTokens = liquidityTokens

    setPoolData(poolData)
    setToken1Name(token1Name)
    setToken2Name(token2Name)
    setCurrentReserves(reserves)

    setDataLoaded(true)
    // setCreateButton({action: ()=>{console.log("add liquidity")}, text: "add liquidity"})
    }


useEffect(()=>{
    if(!dataLoaded) return
    if(!poolData.initialized) { 
        // setCreateButton({action: ()=>{console.log}, text: "initialize pool"}) 
        console.log(currentReserves)
        console.log(poolData)
        
    }
    else {
        console.log("already initialized")
    }
},[poolData])


useEffect(()=> {
    
    getPoolData()
    getAllowance()
        
    // setCreateButton({action: async ()=>{poolContract.connect(signer).initializePool(token1Amount, token2Amount)}, text: "initialize pool"}) 

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

useEffect(()=> {
    if(!isConnected) return;

    if (utils.isAddress(token1) && utils.isAddress(token2) && !toggle) {
        getPool()
    }

    
    
},[token1, token2])

const getOtherTokenAndAmount = async(token, amount) => {
        let tokenOut =await poolContract.getLiquidityAmount(token, utils.parseEther(amount.toString()))
        console.log(tokenOut[1].toString())
        let name2In = addLiquidityTokenIn.nameIn == token1Name ? token2Name : token1Name
        setAddLiquidityTokenIn(prev => ({...prev, name2In: name2In, address2In: tokenOut[0], amount2In: tokenOut[1].toString()}))

        }
const addLiquidity = async() => {
    await poolContract.connect(signer).addLiquidity(addLiquidityTokenIn.addressIn, utils.parseEther(addLiquidityTokenIn.amountIn.toString()))
}

const initializePool = async() => {
    await poolContract.connect(signer).initializePool(utils.parseEther(token1Amount.toString()), utils.parseEther(token2Amount.toString()))
}

const removeLiquidity = async() => {
    await poolContract.connect(signer).removeLiquidity(utils.parseEther(removeLiquidityAmount.toString()))
}


useEffect(()=>{
    if(toggle == 2) {

        getOtherTokenAndAmount(addLiquidityTokenIn.addressIn, addLiquidityTokenIn.amountIn)
        
    }


},[toggle])




  return (
    <Container>
        
        <SwapBox>
            {toggle == 0 && "Create a pair & add liquidity"}
            
            {toggle > 0 && (poolData.initialized  ? (<button onClick={toggleAddRemoveLiquidity}>add/remove liquidity</button>) : "Initialize")}

            {toggle ==0 &&

            <>
            <SwapInput>


                tokenA
                <Input type="text" name="name" onChange={(event)=> {setToken1(event.target.value)}} />
                tokenB  
                <Input type="text" name="name" onChange={(event) =>{setToken2(event.target.value)}}/>
            </SwapInput>

            <div>
            {toggle > 0 && <button onClick={() => setToggle(prev => prev-1)}>back</button>}
            <button onClick={createButton.action}>{createButton.text}</button>
            </div>
            </>

            }


            {/* INITIALIZE OR ADD LIQUIDITY */}
            {toggle ==1 &&
            <>

            {poolData.initialized
            ?
            (<>

                {addRemoveLiquidity.value 
                    ?
                    <SwapInput>
                        <span>
                            remove liquidity
                        </span>
                        your LP token balance: {utils.formatEther(poolData.liquidityTokens)}

                        <Input type="number" name="name" placeholder="amount"  onChange={(event) => {setRemoveLiquidityAmount(event.target.value)}} />
                        </SwapInput>
                    :
                <SwapInput>
                    <span>
                    add liquidity: first select a starting token:   
                    </span>
                        {token1Name} - current reserves: {parseFloat(utils.formatEther(currentReserves[0])).toFixed(3)}

                        <button onClick={() => {setAddLiquidityTokenIn(prev => ({...prev, nameIn:token1Name, addressIn: token1}))}}>select</button>
                        {allowances[0] == 0 && <button onClick={() => {approvePool(token1Contract)}}>allow all</button>}
                        {token2Name} - current reserves: {parseFloat(utils.formatEther(currentReserves[1])).toFixed(3)}
                        <button onClick={() => {setAddLiquidityTokenIn(prev => ({...prev, nameIn:token2Name, addressIn: token2}))}}>select</button>  
                        {allowances[1] == 0 && <button onClick={() => {approvePool(token2Contract)}}>allow all</button>}

                    <span>
                    <Input type="number" name="name" placeholder="amount"  onChange={(event) => {setAddLiquidityTokenIn(prev => ({...prev, amountIn: event.target.value}))}} />
                    &nbsp;{addLiquidityTokenIn.nameIn}
                    </span>

                </SwapInput>
                }
                </>)
            : 
                        // initialize page
                    <SwapInput>
                    {token1Name} - current reserves: {utils.formatEther(currentReserves[0])}
                    {allowances[0] == 0 && <button onClick={() => {approvePool(token1Contract)}}>allow all</button>}
                    <Input type="number" name="name"   onChange={(event) => {setToken1Amount(event.target.value)}} />
                    {token2Name} - current reserves: {utils.formatEther(currentReserves[1])}
                    {allowances[1] == 0 && <button onClick={() => {approvePool(token2Contract)}}>allow all</button>}
                    <Input type="number" name="name"   onChange={(event) =>{setToken2Amount(event.target.value)}}/>
                    
                     
                    </SwapInput>
                }
                {/* </>  */}

            <div>
            {toggle > 0 && <button onClick={() => setToggle(prev => prev-1)}>back</button>}
            <button onClick={() => setToggle(prev => prev+1)}>review operation</button>
            </div>
            </>

            }



            {/* REVIEW AND SUBMIT */}
            {toggle ==2 &&
            
            <>
            {poolData.initialized
            ?
                    <>
                    {addRemoveLiquidity.value 
                    ?
                    <SwapInput>
                        removing {removeLiquidityAmount} lp tokens
                        <button onClick={removeLiquidity}>submit</button>
                    </SwapInput>
                    
                    :
                    <SwapInput>
                        reserves before:
                        <span>
                        {token1Name} - {parseFloat(utils.formatEther(currentReserves[0])).toFixed(3)}
                        </span>
                        <span>
                        {token2Name} - {parseFloat(utils.formatEther(currentReserves[1])).toFixed(3)}
                        </span>

                        liquidity to add:
                        <div>
                        {addLiquidityTokenIn.nameIn} - {addLiquidityTokenIn.amountIn}

                        </div>
                        <div>
                        {addLiquidityTokenIn.name2In} - {utils.formatEther(addLiquidityTokenIn.amount2In.toString())}   
                        </div>
                        <button onClick={addLiquidity}>submit</button>

                        
                    </SwapInput>
                    }
                    </>

            : 
                <SwapInput>
                    <span>
                       adding {token1Amount} {token1Name} 
                    </span>
                    <span>
                       adding {token2Amount} {token2Name} 
                    </span>
                    <button onClick={initializePool}>initialize pool</button>

                </SwapInput>
            }
            <div>
            {toggle > 0 && <button onClick={() => setToggle(prev => prev-1)}>back</button>}
            </div>
            </>
            }
            


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