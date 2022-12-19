import React, {useState} from 'react'
import {SwapInput,Input} from "../styles"
import { utils } from "ethers";
import useAllowance from '../hooks/useAllowance';
import {useSigner} from 'wagmi'




const ManageLiquidity = ({poolData, pool, getAllowance, allowances}) => {
    const {allowanceData, approveA, approveB} = useAllowance(poolData);

    const [removeAmount, setRemoveAmount] = useState(0) // amount to either add or remove
    const [addOrRemove, setAddOrRemove] = useState(true); // true == add, false == remove
    const [reviewTx, setReviewTx] = useState(true)
    const { data: signer } = useSigner()
    const [addLiquidityData, setAddLiquidityData] = useState({
        nameIn: poolData.token1Name,
        addressIn: poolData.addressA,
        amountIn: 0,
        name2In: poolData.token2Name,
        address2In: poolData.addressB,
        amount2In: 0
    })

    const flipTokens = () => {
        setAddLiquidityData(prev => ({
            ...prev,
            addressIn: prev.address2In, 
            nameIn: prev.name2In,
            amountIn: 0,
            address2In: prev.addressIn,
            name2In: prev.nameIn,
            amount2In: 0,
    
    
        
        }))
    
    }

    // useEffect(()=>{
    //     setAddLiquidityData(prev => ({
    //         ...prev,
    //         addressIn: poolData.addressA, 
    //         nameIn: poolData.token1Name,
    //         amountIn: 0,
    //         address2In: poolData.addressB,
    //         name2In: poolData.token2Name,
    //         amount2In: 0,
    
    //     }))
        
    // },[poolData])

    const getAddLiquidityData = async() => {
        let results = await pool.getLiquidityAmount(addLiquidityData.addressIn, utils.parseEther(addLiquidityData.amountIn.toString()))
    
        setAddLiquidityData( prev => ({
                ...prev, 
                address2In: results[0],
                amount2In: utils.formatEther(results[1].toString())}))
    
    }
    const removeLiquidity = async() => {
        await pool.connect(signer).removeLiquidity(utils.parseEther(removeAmount.toString()))
    }
    const addLiquidity = async() => {
        await pool.connect(signer).addLiquidity(addLiquidityData.addressIn, utils.parseEther(addLiquidityData.amountIn.toString()))
    }

    
    if(addOrRemove) {
            return(
                reviewTx ?            
                <>            
                <button onClick={() => {setAddOrRemove(prev => !prev)}}>add/remove liquidity</button>
                    <SwapInput>
                        <span> remove liquidity</span>

                        <Input type="number" name="name" placeholder="amount"  onChange={(event) => {setRemoveAmount(event.target.value)}} />
                    </SwapInput>
                    <button onClick={() => setReviewTx(prev => !prev)}>review operation</button>

                </>
            :
            <>
            <SwapInput>
             removing {removeAmount} lp tokens
                <button onClick={removeLiquidity}>submit</button>
             </SwapInput>
            <button onClick={() => setReviewTx(prev => !prev)}>back</button>

            </>
            )}
    else {
        return(        
            reviewTx ?
            <>
                <button onClick={() => {setAddOrRemove(prev => !prev)}}>add/remove liquidity</button>
        
                <SwapInput>
                    <span>
                    add liquidity:
                    </span>
                            {addLiquidityData.nameIn}:
                            <Input type="number" name="name" value={addLiquidityData.amountIn} onChange={(event)=> {setAddLiquidityData( prev => ({...prev, amountIn: event.target.value}))}} />
                            <button onClick={getAddLiquidityData}>calculate</button>
                            <button onClick={flipTokens}>flip</button>
                            {addLiquidityData.name2In}:&nbsp; 
                            {addLiquidityData.amount2In} 
                            {/* <Input type="number" name="name" value={addLiquidityTokensIn.amount2In} onChange={(event)=> {setAddLiquidityTokensIn( prev => ({...prev, nameIn: props.tokenNames.tokenB, name2In:props.tokenNames.tokenA, amount2In: event.target.value, addressIn: props.pairTokenA.address, address2In: props.pairTokenB.address}))}}/> */}
        
                </SwapInput>
                <button onClick={() => setReviewTx(prev => !prev)}>review operation</button>
            </>
            : 
            <>
            <SwapInput>
                liquidity to add:
                <div>
                {addLiquidityData.nameIn} - {addLiquidityData.amountIn}

                </div>
                <div>
                {addLiquidityData.name2In} - {addLiquidityData.amount2In}   
                </div>
                <button onClick={addLiquidity}>submit</button>

            
            </SwapInput>
            <button onClick={() => setReviewTx(prev => !prev)}>back</button>

            </>
        )}
    
}

export default ManageLiquidity

