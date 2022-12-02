import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { useAccount, useProvider, useSigner} from 'wagmi'

import { utils, constants } from "ethers";
 


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

console.log(props.poolData)

const [allowances, setAllowances] = useState([])
const [addRemoveLiquidity, setAddRemoveLiquidity] = useState({
    button: "add liquidity",
    value: false
})



const [toggle, setToggle] = useState(0)
console.log(toggle)



const { data: signer } = useSigner()


const getAddLiquidityData = async() => {
    let results = await props.poolContract.getLiquidityAmount(addLiquidityTokensIn.addressIn, utils.parseEther(addLiquidityTokensIn.amountIn.toString()))

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
        nameIn: prev.name2In,
        amountIn: 0,
        address2In: prev.addressIn,
        name2In: prev.nameIn,
        amount2In: 0,


    
    }))

}


const toggleAddRemoveLiquidity = () => {
    setAddRemoveLiquidity(prev => ({
        ...prev, 
        value: !prev.value,
        button: prev.value ? "add liquidity" : "remove liquidity"
    
    }))
}



const approvePool = async(tokenContract) => {
    await tokenContract.connect(signer).approve(props.poolData.address, utils.parseEther("10000000"));

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


useEffect(()=>{
    setAddLiquidityTokensIn(prev => ({
        ...prev,
        addressIn: props.poolData.addressA, 
        nameIn: props.poolData.token1Name,
        amountIn: 0,
        address2In: props.poolData.addressB,
        name2In: props.poolData.token2Name,
        amount2In: 0,

    }))
    
},[props.poolData])

const addLiquidity = async() => {
    await props.poolContract.connect(signer).addLiquidity(addLiquidityTokensIn.addressIn, utils.parseEther(addLiquidityTokensIn.amountIn.toString()))
}

const initializePool = async() => {
    await props.poolContract.connect(signer).initializePool(utils.parseEther(token1Amount.toString()), utils.parseEther(token2Amount.toString()))
}

const removeLiquidity = async() => {
    await props.poolContract.connect(signer).removeLiquidity(utils.parseEther(removeLiquidityAmount.toString()))
}




const addRemoveLiquidityComponent = () => {
    return (
        addRemoveLiquidity.value //true == remove liquidity false == add liquidity 
            ?
            <>
            
            <SwapInput>
                <span>
                    remove liquidity
                </span>

                <Input type="number" name="name" placeholder="amount"  onChange={(event) => {setRemoveLiquidityAmount(event.target.value)}} />
            </SwapInput>
        <button onClick={() => setToggle(prev => prev+1)}>review operation</button>

            </>
            :
            <>
            
        <SwapInput>
            <span>
            add liquidity:
            </span>
                    {addLiquidityTokensIn.nameIn}:
                    <Input type="number" name="name" value={addLiquidityTokensIn.amountIn} onChange={(event)=> {setAddLiquidityTokensIn( prev => ({...prev, amountIn: event.target.value}))}} />
                    <button onClick={getAddLiquidityData}>calculate</button>
                    <button onClick={flipTokens}>flip</button>
                    {addLiquidityTokensIn.name2In}:&nbsp; 
                    {addLiquidityTokensIn.amount2In} 
                    {/* <Input type="number" name="name" value={addLiquidityTokensIn.amount2In} onChange={(event)=> {setAddLiquidityTokensIn( prev => ({...prev, nameIn: props.tokenNames.tokenB, name2In:props.tokenNames.tokenA, amount2In: event.target.value, addressIn: props.pairTokenA.address, address2In: props.pairTokenB.address}))}}/> */}

        </SwapInput>
        <button onClick={() => setToggle(prev => prev+1)}>review operation</button>
        </>
        
        
    )
}

const initializeComponent = () => {
    if(props.poolData.address == constants.AddressZero) {
        return(
            <div>
                create pool above
            </div>
        )
    }
    else {
        return (
            <SwapInput>
                        {props.poolData.token1Name}
                        {allowances[0] == 0 && <button onClick={() => {approvePool(props.pairTokenA)}}>allow all</button>}
                        <Input type="number" name="name"   onChange={(event) => {setToken1Amount(event.target.value)}} />
                        {props.poolData.token2Name}
                        {allowances[1] == 0 && <button onClick={() => {approvePool(props.pairTokenB)}}>allow all</button>}
                        <Input type="number" name="name"   onChange={(event) =>{setToken2Amount(event.target.value)}}/>
                        
                         
                        </SwapInput>
        )

    }
    
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
        {
            props.poolData.address != "" ?
        
        <SwapBox>
            {/* INITIALIZE OR ADD LIQUIDITY */}

            {props.poolData.initialized  ? (<button onClick={toggleAddRemoveLiquidity}>add/remove liquidity</button>) : "Initialize"}
            

            {
            toggle == 0 && 

            (props.poolData.initialized ? addRemoveLiquidityComponent() : initializeComponent())}

            {toggle == 1 && reviewAndSubmitComponent()}


            
            <div>
            {toggle > 0 && <button onClick={() => setToggle(prev => prev-1)}>back</button>}
            </div>

        </SwapBox>
        :
        "select a pair and manage liquidity"    
    }

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