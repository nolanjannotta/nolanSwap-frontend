import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {ConnectButton} from '@rainbow-me/rainbowkit';
import { useAccount, useContract, useProvider, useSigner,useWaitForTransaction, useContractWrite } from 'wagmi'

import MockERC20Abi  from "../ABI/MockERC20"
import PoolFactoryAbi from "../ABI/PoolFactory"
import PoolABI from "../ABI/Pool"
import { utils } from "ethers";
 


function CreatePair(props) {
console.log(props.poolData.address == "")
const { address, isConnected } = useAccount();


const [token1Amount, setToken1Amount] = useState(0)
const [token2Amount, setToken2Amount] = useState(0)


const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState(0);

const [addLiquidityTokensIn, setAddLiquidityTokensIn] = useState({
    nameIn: "",
    addressIn: "",
    amountIn: 0,
    name2In: "",
    address2In: "",
    amount2In: 0
})
const [tokenFlip, setTokenFlip] = useState(false)



const [allowances, setAllowances] = useState([])
const [addRemoveLiquidity, setAddRemoveLiquidity] = useState({
    button: "add liquidity",
    value: false
})
// const [addRemoveLiquidity, setAddRemoveLiquidity] = useState(false)



const [toggle, setToggle] = useState(0)



const provider = useProvider();
const { data: signer } = useSigner()

const poolFactory = useContract({
    addressOrName: props.factory,
    contractInterface: PoolFactoryAbi,
    signerOrProvider: provider
});

const getAddLiquidityData = async() => {
    let results;
        results = await props.poolContract.getLiquidityAmount(addLiquidityTokensIn.addressIn, utils.parseEther(addLiquidityTokensIn.amountIn.toString()))

        setAddLiquidityTokensIn( prev => ({
            ...prev, 
            address2In: results[0],
            amount2In: utils.formatEther(results[1].toString())}))

}

const flipTokens = () => {
    setTokenFlip(prev => !prev)
    setAddLiquidityTokensIn(prev => ({
        ...prev,
        addressIn: prev.address2In, 
        address2In: prev.addressIn,
        amountIn: 0,
        amount2In: 0,


    
    }))

    // console.log(swapData)
}


const toggleAddRemoveLiquidity = () => {
    setAddRemoveLiquidity(prev => ({
        ...prev, 
        value: !prev.value,
        button: prev.value ? "add liquidity" : "remove liquidity"
    
    }))
}



// const createPair = async() => {
//     if(utils.isAddress(token1) && utils.isAddress(token2)) {
//        let receipt = await poolFactory.connect(signer).createPair(token1, token2)
//         setCreatePoolHash(receipt.hash) 
//     }
    

// }
const approvePool = async(tokenContract) => {
    await tokenContract.connect(signer).approve(props.pool, utils.parseEther("10000000"));

}

const getAllowance = async() => {
    let token1Allowance = await props.pairTokenA.allowance(address, props.poolContract.address)
    let token2Allowance = await props.pairTokenB.allowance(address, props.poolContract.address)
    setAllowances([token1Allowance,token2Allowance])
}


useEffect(()=> {
    
    // getPoolData()
    getAllowance()
        
    // setCreateButton({action: async ()=>{poolContract.connect(signer).initializePool(token1Amount, token2Amount)}, text: "initialize pool"}) 

}, [props.poolContract])




// this gets the pool address as soon as two valid addresses are entered, 

// useEffect(()=> {
    
//     if(props.pool == "0x0000000000000000000000000000000000000000") {
//         setCreateButton({action: createPair, text: "create pair"})    
//         return;
//         }

//     setCreateButton({action: ()=>{setToggle(1)}, text: "next"}) 


    
    
// },[props.pool])

useEffect(()=>{
    console.log(addLiquidityTokensIn)
},[addLiquidityTokensIn])

const addLiquidity = async() => {
    await props.poolContract.connect(signer).addLiquidity(addLiquidityTokensIn.addressIn, utils.parseEther(addLiquidityTokensIn.amountIn.toString()))
}

const initializePool = async() => {
    await props.poolContract.connect(signer).initializePool(utils.parseEther(token1Amount.toString()), utils.parseEther(token2Amount.toString()))
}

const removeLiquidity = async() => {
    await props.poolContract.connect(signer).removeLiquidity(utils.parseEther(removeLiquidityAmount.toString()))
}


// useEffect(()=>{
//     if(toggle == 1) {

//         getOtherTokenAndAmount()
//         console.log(addLiquidityTokensIn)
        
//     }


// },[toggle])



const addRemoveLiquidityComponent = () => {
    return (
        addRemoveLiquidity.value //true == remove liquidity false == add liquidity 
            ?
            <SwapInput>
                <span>
                    remove liquidity
                </span>

                <Input type="number" name="name" placeholder="amount"  onChange={(event) => {setRemoveLiquidityAmount(event.target.value)}} />
            </SwapInput>
            :
        <SwapInput>
            <span>
            add liquidity:
            </span>
            {tokenFlip
                ?
                <>
                    {props.tokenNames.tokenA}
                    <Input type="number" name="name" value={addLiquidityTokensIn.amountIn} onChange={(event)=> {setAddLiquidityTokensIn( prev => ({...prev, nameIn: props.tokenNames.tokenA, name2In:props.tokenNames.tokenB, amountIn: event.target.value, addressIn: props.pairTokenA.address, address2In: props.pairTokenB.address}))}} />
                    <button onClick={getAddLiquidityData}>calculate</button>
                    <button onClick={flipTokens}>flip</button>
                    {props.tokenNames.tokenB}  
                    <Input type="number" name="name" value={addLiquidityTokensIn.amount2In} onChange={(event)=> {setAddLiquidityTokensIn( prev => ({...prev, nameIn: props.tokenNames.tokenB, name2In:props.tokenNames.tokenA, amount2In: event.target.value, addressIn: props.pairTokenA.address, address2In: props.pairTokenB.address}))}}/>
                </>
                :
                <>
                    {props.tokenNames.tokenB}
                    <Input type="number" name="name" value={addLiquidityTokensIn.amountIn} onChange={(event)=> {setAddLiquidityTokensIn( prev => ({...prev, nameIn: props.tokenNames.tokenB, name2In:props.tokenNames.tokenA, amountIn: event.target.value, addressIn: props.pairTokenB.address, address2In: props.pairTokenA.address}))}} />
                    <button onClick={getAddLiquidityData}>calculate</button>
                    <button onClick={flipTokens}>flip</button>
                    {props.tokenNames.tokenA}  
                    <Input type="number" name="name" value={addLiquidityTokensIn.amount2In} onChange={(event)=> {setAddLiquidityTokensIn( prev => ({...prev, nameIn: props.tokenNames.tokenA, name2In:props.tokenNames.tokenB, amount2In: event.target.value, addressIn: props.pairTokenB.address, address2In: props.pairTokenA.address}))}}/>
                </>
                }

        </SwapInput>
    )
}

const initializeComponent = () => {
    return (
        <SwapInput>
                    {/* {props.token1Name} - current reserves: {parseFloat(props.poolData.reservesA).toFixed(3)} */}
                    {allowances[0] == 0 && <button onClick={() => {approvePool(props.pairTokenA)}}>allow all</button>}
                    <Input type="number" name="name"   onChange={(event) => {setToken1Amount(event.target.value)}} />
                    {/* {props.token2Name} - current reserves: {parseFloat(props.poolData.reservesB).toFixed(3)} */}
                    {allowances[1] == 0 && <button onClick={() => {approvePool(props.pairTokenB)}}>allow all</button>}
                    <Input type="number" name="name"   onChange={(event) =>{setToken2Amount(event.target.value)}}/>
                    
                     
                    </SwapInput>
    )
}

const reviewAndSubmitComponent = () => {
    return (
        <>
            {props.poolData.initialized
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
                        {/* reserves before:
                        <span>
                        {props.token1Name} - current reserves: {parseFloat(props.poolData.reservesA).toFixed(3)}
                        </span>
                        <span>
                        {props.token2Name} - current reserves: {parseFloat(props.poolData.reservesB).toFixed(3)}
                        </span> */}

                        liquidity to add:
                        <div>
                        {addLiquidityTokensIn.nameIn} - {addLiquidityTokensIn.amountIn}

                        </div>
                        <div>
                        {addLiquidityTokensIn.name2In} - {addLiquidityTokensIn.amount2In}   
                        </div>
                        <button onClick={addLiquidity}>submit</button>

                        
                    </SwapInput>
                    }
                    </>

            : 
                <SwapInput>
                    <span>
                       adding {token1Amount} {props.poolData.token1Name} 
                    </span>
                    <span>
                       adding {token2Amount} {props.poolData.token2Name} 
                    </span>
                    <button onClick={initializePool}>initialize pool</button>

                </SwapInput>
            }
            </>
            )
}


  return (
    <Container>
        
        <SwapBox>
            {/* INITIALIZE OR ADD LIQUIDITY */}

            {props.poolData.address != "" && (props.poolData.initialized  ? (<button onClick={toggleAddRemoveLiquidity}>add/remove liquidity</button>) : "Initialize")}
            

            {
            toggle == 0 && 

            props.poolData.address != "" ? (props.poolData.initialized ? addRemoveLiquidityComponent() : initializeComponent()) : "select a pair"}

            {toggle == 1 && reviewAndSubmitComponent()}


            {props.poolData.address != "" &&
            <div>
            {2 > toggle > 0 && <button onClick={() => setToggle(prev => prev-1)}>back</button>}
            <button onClick={() => setToggle(prev => prev+1)}>review operation</button>
            </div> }


           


            
            
            
            
            


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